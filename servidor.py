"""Juego web — Fase 2: cuentas con Discord, monedas, Bazar de Burnice y peleas contra la CPU.
Arranque:  python servidor.py   (en Render: Start Command = python servidor.py)
Variables de entorno: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SESSION_SECRET, PUBLIC_URL, DATABASE_URL, PORT
Sin DISCORD_CLIENT_ID se puede jugar como invitado (no se guardan monedas)."""
import base64, hashlib, hmac, json, os, random, re, secrets, time, uuid
import urllib.parse, urllib.request
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from http.cookies import SimpleCookie
from pathlib import Path
import motor as M
import contenido as C
import tienda_extra as X
from db import Almacen

AQUI = Path(__file__).parent
PUERTO = int(os.environ.get("PORT", "8000"))
PUBLIC_URL = os.environ.get("PUBLIC_URL", f"http://localhost:{PUERTO}").rstrip("/")
CLIENT_ID = os.environ.get("DISCORD_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("DISCORD_CLIENT_SECRET", "")
SECRETO = (os.environ.get("SESSION_SECRET") or secrets.token_hex(32)).encode()   # sin SESSION_SECRET las sesiones se pierden al reiniciar
DISCORD_API = os.environ.get("DISCORD_API", "https://discord.com/api")          # (se cambia solo en las pruebas)
SEGURA = PUBLIC_URL.startswith("https")
SESION_DIAS = 30
MAX_PARTIDAS = 200
# Monedas del Alma por ganar (la web paga más que el bot porque las peleas son más largas)
REC_CPU = {"facil": 8, "normal": 20, "dificil": 30}
REC_PVP = 60
TIMEOUT_TURNO = 150      # segundos por turno en PvP; si se pasa, pierde por abandono
SALA_VIDA = 1800         # una sala sin actividad se borra a los 30 min
SALAS = {}               # código -> sala PvP
PARTIDAS = {}          # id -> {"c": Combate, "t": hora, "uid": dueño o None, "pagado": bool}
DB = None


def db():
    global DB
    if DB is None:
        DB = Almacen(os.environ.get("DATABASE_URL"))
    return DB


# ------------------------------------------------------------------ sesiones
def _firmar(payload: dict) -> str:
    raw = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    sig = hmac.new(SECRETO, raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{sig}"


def _leer_firma(txt):
    try:
        raw, sig = txt.rsplit(".", 1)
        esperado = hmac.new(SECRETO, raw.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, esperado):
            return None
        d = json.loads(base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4)))
        if d.get("exp", 0) < time.time():
            return None
        return d
    except Exception:
        return None


def avatar_url(uid, h):
    if h:
        return f"https://cdn.discordapp.com/avatars/{uid}/{h}.png?size=64"
    return f"https://cdn.discordapp.com/embed/avatars/{int(uid) % 5}.png"


# ------------------------------------------------------------------ pelea
class Jugador:
    def __init__(self, nombre, es_cpu=False):
        self.display_name = nombre
        self.id = 0 if es_cpu else 1


def _emoji_url(txt):
    m = re.match(r"<(a?):\w+:(\d+)>", txt or "")
    if not m:
        return None
    return f"https://cdn.discordapp.com/emojis/{m.group(2)}.{'gif' if m.group(1) else 'png'}?size=64"


def _mov(l, k):
    m = l.mov(k)
    return {"k": k, "nombre": m["nombre"], "coste": m["coste"], "pm": m.get("pm", 0), "sombras": m.get("sombras", 0),
            "desc": m.get("desc", ""), "tipo": m["tipo"]}


def _luchador(c, eq, i, l, mio=True):
    acc = []
    if mio and eq is c.actual and not eq.es_cpu and not c.terminado() and l in c.disponibles():
        ks = ("hab1", "hab2") if l.forma else ("normal", "hab1", "hab2", "defender", "ulti")
        for k in ks:
            if k == "defender":
                d = {"k": "defender", "nombre": "Defender", "coste": M.COSTE_DEFENDER, "pm": 0, "sombras": 0,
                     "desc": "Recibes la mitad de daño y el rival pierde 1 icono al golpearte.", "tipo": "defender"}
            else:
                d = _mov(l, k)
            d["ok"] = bool(c.puede(l, k))
            d["dual"] = k in ("normal", "hab1", "hab2") and bool(l.mov(k).get("sana") or l.mov(k).get("regen"))
            d["apoyo"] = d["tipo"] in ("cura", "limpia")
            acc.append(d)
    return {
        "i": i, "key": l.key, "nombre": l.nombre, "emoji": l.d["emoji"], "emoji_url": _emoji_url(l.d["emoji"]),
        "color": "#%06x" % l.d["color"], "boton": l.d.get("boton", "azul"),
        "gif": l.gif, "hp": l.hp, "max_hp": l.max_hp, "pm": l.pm, "ulti": int(l.ulti),
        "ulti_lista": l.ulti >= 100, "vivo": l.vivo, "incapaz": l.incapaz, "guardia": l.guardia,
        "hojas": l.hojas if l.d.get("hojas") else None, "sombras": l.sombras if l.d.get("sombras") else None,
        "forma": (l.d.get("forma_nombre", "Mahoraga") if l.forma else None), "forma_hp": l.forma_hp,
        "forma_turnos": l.forma_turnos,
        "efectos": [M.EFECTOS_TXT[e] for e in l.efectos] + [M.BONOS_TXT[b] for b in l.bonos],
        "acciones": acc,
    }


def estado(c, p=None, yo=0):
    """Estado visto por el equipo `yo` (0 o 1): siempre sale primero 'mi' equipo y el turno 0 = mi turno."""
    orden = [yo, 1 - yo]
    mi_turno = (c.turno == yo) and not c.terminado()
    d = {
        "turno": 0 if c.turno == yo else 1, "terminado": c.terminado(), "log": c.log, "historial": list(c.historial),
        "medios": [c.equipos[i].medios for i in orden],
        "equipos": [{"nombre": c.equipos[i].nombre, "cpu": c.equipos[i].es_cpu,
                     "luchadores": [_luchador(c, c.equipos[i], j, l, mio=(i == yo)) for j, l in enumerate(c.equipos[i].luchadores)]}
                    for i in orden],
        "actor": (c.actual.luchadores.index(c.actor()) if (not c.terminado() and c.actor()) else None),
        "objetivo": None,
        "blancos": [c.rival.luchadores.index(l) for l in c.rival.blancos] if mi_turno else [],
        "aliados": [c.actual.luchadores.index(l) for l in c.actual.vivos] if mi_turno else [],
    }
    if mi_turno:
        o = c.objetivo_por_defecto()
        d["objetivo"] = c.rival.luchadores.index(o) if o else None
    if c.terminado():
        g = c.ganador()
        gi = c.equipos.index(g)
        d["ganador"] = orden.index(gi)
        lider = g.vivos[0]
        d["victoria_img"] = lider.d.get("victoria_img") or lider.d.get("gif")
        pr = (p or {}).get("premios", {}).get(yo)
        if pr:
            d["recompensa"], d["monedas"] = pr
    return d


def _anim(c):
    return [{"titulo": a["titulo"], "desc": a["desc"], "gif": a.get("gif"), "seg": a.get("seg", 2),
             "color": "#%06x" % a.get("color", 0x333333)} for a in (c.anim, c.trans) if a]


def _sumar_vic_pj(d, keys):
    """Suma 1 victoria a cada personaje del equipo ganador y marca que tiene algo nuevo que decir en la mesa."""
    vp = d.setdefault("vic_pj", {})
    nv = d.setdefault("nuevo_pj", {})
    for k in keys:
        vp[k] = vp.get(k, 0) + 1
        nv[k] = True


def _pagar(p):
    """Si el jugador (con cuenta) ganó contra la CPU, le da sus monedas, una sola vez por pelea."""
    c = p["c"]
    if p["pagado"] or not c.terminado():
        return
    p["pagado"] = True
    if p["uid"] and c.equipos.index(c.ganador()) == 0:
        premio = REC_CPU.get(c.nivel, 20)

        def f(d):
            d["monedas"] += premio
            _sumar_vic_pj(d, [l.key for l in c.equipos[0].luchadores])
            return d["monedas"]
        try:
            total = db().transaccion(p["uid"], f)
            p.setdefault("premios", {})[0] = (premio, total)
            c.log += f"\n💀 **{c.equipos[0].nombre}** gana **{premio}** Monedas del Alma."
        except Exception as e:
            print("Error guardando monedas:", repr(e))


def _paso(p):
    c = p["c"]
    _pagar(p)
    return {"estado": estado(c, p), "anims": _anim(c)}


def _turnos_cpu(p, pasos):
    c = p["c"]
    for _ in range(80):
        if c.terminado() or not c.actual.es_cpu:
            return
        j = c.jugada_cpu()
        if j is None:
            c.terminar_turno()
        else:
            c.ejecutar(*j)
        pasos.append(_paso(p))


def _limpiar():
    if len(PARTIDAS) > MAX_PARTIDAS:
        for k in sorted(PARTIDAS, key=lambda k: PARTIDAS[k]["t"])[:50]:
            PARTIDAS.pop(k, None)


# ------------------------------------------------------------------ API
def api_personajes(_, ses):
    out = []
    for k, d in M.PERSONAJES.items():
        movs = []
        for m in ("normal", "hab1", "hab2"):
            x = d["mov"][m]
            movs.append({"nombre": x["nombre"], "coste": x["coste"], "pm": x.get("pm", 0), "sombras": x.get("sombras", 0),
                         "dmg": x.get("dmg"), "prec": x.get("prec"), "desc": x.get("desc", "")})
        u = d["ulti"]
        ficha = {"vida": d["vida"], "recurso": f"🌑 Sombras (máx. {M.SOMBRAS_MAX})" if d.get("sombras") else f"🔵 PM (máx. {M.PM_MAX})",
                 "movs": movs, "ulti": {"nombre": u["nombre"], "coste": u["coste"], "desc": u.get("desc", "")}}
        if d.get("ulti_alt"):
            ficha["ulti_alt"] = {"nombre": d["ulti_alt"]["nombre"], "desc": d["ulti_alt"].get("desc", "")}
        out.append({"key": k, "nombre": d["nombre"], "emoji": d["emoji"], "emoji_url": _emoji_url(d["emoji"]),
                    "color": "#%06x" % d["color"], "desc": d["desc"], "gif": d.get("gif"), "vida": d["vida"],
                    "movs": [{"nombre": m["nombre"], "desc": m["desc"]} for m in movs]
                            + [{"nombre": u["nombre"] + " (ÚLTI)", "desc": u.get("desc", "")}],
                    "ficha": ficha})
    return {"personajes": out}


# categoría -> (catálogo, lista en la base de datos, clave de "equipado")
CATS = {
    "mascotas": (C.COSMETICOS["mascotas"], "mascotas", "mascota"),
    "marcos":   (X.MARCOS, "colores", "color"),
    "titulos":  (X.TITULOS, "titulos", "titulo"),
    "fondos":   (X.FONDOS, "fondos", "fondo"),
    "victorias": (X.VICTORIAS, "imagenes", "imagen"),
    "skins":    (X.SKINS, "skins", "skins"),
}


def _oferta():
    return X.oferta({c: v[0] for c, v in CATS.items()})


def _precio(cat, key):
    it = CATS[cat][0][key]
    of = _oferta()
    if of and of["cat"] == cat and of["key"] == key:
        return max(1, round(it["precio"] * (100 - of["pct"]) / 100))
    return it["precio"]


def _disponible(it):
    return ("img" not in it) or bool(it["img"])


def api_yo(_, ses):
    if not ses:
        return {"logueado": False, "login_disponible": bool(CLIENT_ID)}
    d = db().obtener(ses["id"])
    eq = d["equipado"]
    mi = C.COSMETICOS["mascotas"].get(eq.get("mascota"))
    marco = X.MARCOS.get(eq.get("color"))
    tit = X.TITULOS.get(eq.get("titulo"))
    fon = X.FONDOS.get(eq.get("fondo"))
    vic = X.VICTORIAS.get(eq.get("imagen"))
    skins = {}
    for pj, k in (eq.get("skins") or {}).items():
        it = X.SKINS.get(k)
        if it and it["img"] and k in d.get("skins", []):
            skins[pj] = it["img"]
    return {"logueado": True, "id": ses["id"], "nombre": ses["n"], "avatar": ses.get("av"),
            "monedas": d["monedas"], "mascotas": d["mascotas"], "mascota": eq.get("mascota"),
            "imagen": eq.get("imagen"), "victorias": d.get("pvp_victorias", 0),
            "derrotas": d.get("pvp_derrotas", 0), "mascota_url": _emoji_url(mi["normal"]) if mi else None,
            "marco": marco["css"] if marco else None, "titulo": tit["nombre"] if tit else None,
            "fondo_img": fon["img"] if fon and fon["img"] else None,
            "victoria_img": vic["img"] if vic and vic["img"] else None, "skins": skins,
            "vic_pj": d.get("vic_pj", {}), "nuevo_pj": d.get("nuevo_pj", {})}


def api_bazar(_, ses):
    d = db().obtener(ses["id"]) if ses else None
    of = _oferta()
    cats = {}
    for cat, (cat_, lista, ceq) in CATS.items():
        out = []
        for k, it in cat_.items():
            if cat == "mascotas":
                extra = {"emoji_url": _emoji_url(it["normal"]), "victoria_url": _emoji_url(it["victoria"])}
            else:
                extra = {k2: it[k2] for k2 in ("css", "img", "pj") if k2 in it}
            if d is None:
                puesta = False
            elif cat == "skins":
                puesta = (d["equipado"].get("skins") or {}).get(it["pj"]) == k
            else:
                puesta = d["equipado"].get(ceq) == k
            out.append({"key": k, "nombre": it["nombre"], "precio": _precio(cat, k), "precio_base": it["precio"],
                        "tiene": bool(d and k in d.get(lista, [])), "puesta": puesta,
                        "disponible": _disponible(it), **extra})
        cats[cat] = out
    return {
        "monedas": d["monedas"] if d else None, "mascotas": cats["mascotas"], "cats": cats,
        "oferta": of,
        "imgs": {"burnice": C.BURNICE_IMG, "comprar": C.COMPRAR_IMG, "mesa": C.MESA_IMG, "niko": C.NIKO_IMG},
        "textos": {"saludos": C.BURNICE_SALUDOS, "comprar": C.BURNICE_COMPRAR, "mesa": C.BURNICE_MESA,
                   "salidas": C.BURNICE_SALIDAS, "niko": C.NIKO_OPINION},
        "charlas": C.CHARLAS,
    }


def api_comprar(b, ses):
    if not ses:
        return {"error": "Inicia sesión con Discord para comprar."}
    cat = b.get("cat") or "mascotas"
    key = b.get("key")
    if cat not in CATS or key not in CATS[cat][0]:
        return {"error": "Burnice mira alrededor: \"¿Eso? Hmm… no lo tengo en el Bazar. A lo mejor se me quemó, jeje.\""}
    it = CATS[cat][0][key]
    lista = CATS[cat][1]
    if not _disponible(it):
        return {"error": "Eso todavía no está listo, cielo. ¡Pronto!"}
    precio = _precio(cat, key)

    def f(d):
        mis = d.setdefault(lista, [])
        if key in mis:
            return {"msg": "¡Eso ya lo tienes, cielo! Dos veces no se puede… a menos que lo quemes y lo compres otra vez. No lo recomiendo."}
        if d["monedas"] < precio:
            return {"msg": f"Uy, te faltan **{precio - d['monedas']}** Monedas del Alma. Gana unas peleas y vuelve, ¡yo no me muevo!"}
        d["monedas"] -= precio
        mis.append(key)
        return {"msg": f"¡Vendido! **{it['nombre']}** es tuyo. Ya puedes ponértelo desde aquí mismo.", "ok": True}
    r = db().transaccion(ses["id"], f)
    r["monedas"] = db().obtener(ses["id"])["monedas"]
    return r


def api_equipar(b, ses):
    if not ses:
        return {"error": "Inicia sesión con Discord."}
    cat = b.get("cat") or "mascotas"
    key = b.get("key")
    if cat not in CATS:
        return {"error": "Eso no existe."}
    cat_, lista, ceq = CATS[cat]
    if key is not None and key not in cat_:
        return {"error": "Eso no existe."}

    def f(d):
        if key is not None and key not in d.setdefault(lista, []):
            return {"error": "Primero tienes que comprarlo."}
        if cat == "skins":
            pj = cat_[key]["pj"] if key is not None else b.get("pj")
            sk = d["equipado"].setdefault("skins", {})
            if key is None:
                sk.pop(pj, None)
            else:
                sk[pj] = key
        else:
            d["equipado"][ceq] = key
        return {"ok": True}
    return db().transaccion(ses["id"], f)


def api_visto(b, ses):
    """El jugador ya vio lo que su personaje dijo tras ganar."""
    if not ses:
        return {"ok": True}
    k = b.get("key")

    def f(d):
        d.setdefault("nuevo_pj", {}).pop(k, None)
        return {"ok": True}
    return db().transaccion(ses["id"], f)


def api_nueva(b, ses):
    keys = b.get("equipo", [])
    if len(keys) != 3 or any(k not in M.PERSONAJES for k in keys):
        return {"error": "Elige 3 luchadores."}
    nivel = b.get("nivel", "normal")
    if nivel not in M.CPU_NIVELES:
        nivel = "normal"
    rival = random.sample(list(M.PERSONAJES), 3)
    nombre = ses["n"] if ses else "Invitado"
    c = M.Combate(M.Equipo(Jugador(nombre), keys), M.Equipo(Jugador("CPU", True), rival, es_cpu=True))
    c.nivel = nivel
    c.inteligencia = M.CPU_NIVELES[nivel]
    gid = uuid.uuid4().hex[:10]
    _limpiar()
    p = PARTIDAS[gid] = {"c": c, "t": time.time(), "uid": ses["id"] if ses else None, "pagado": False}
    pasos = []
    _turnos_cpu(p, pasos)
    return {"id": gid, "estado": estado(c, p), "pasos": pasos}


def _partida(b, ses):
    p = PARTIDAS.get(b.get("id"))
    if not p:
        return None, {"error": "La partida ya no existe. Empieza otra."}
    if p["uid"] and (not ses or ses["id"] != p["uid"]):
        return None, {"error": "Esta partida es de otra cuenta."}
    p["t"] = time.time()
    c = p["c"]
    if c.terminado() or c.actual.es_cpu:
        return None, {"error": "No es tu turno."}
    return p, None


def api_accion(b, ses):
    p, err = _partida(b, ses)
    if err:
        return err
    c = p["c"]
    err = _ejecutar_accion(c, b)
    if err:
        return err
    pasos = [_paso(p)]
    _turnos_cpu(p, pasos)
    return {"pasos": pasos}


def api_terminar(b, ses):
    p, err = _partida(b, ses)
    if err:
        return err
    p["c"].terminar_turno()
    pasos = [_paso(p)]
    _turnos_cpu(p, pasos)
    return {"pasos": pasos}


# ------------------------------------------------------------------ PvP por link
LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def _limpiar_salas():
    ahora = time.time()
    for k in [k for k, s in SALAS.items() if ahora - s["t"] > SALA_VIDA]:
        SALAS.pop(k, None)


def _evento(s, anims):
    s["seq"] += 1
    s["eventos"].append({"seq": s["seq"], "anims": anims, "v": [estado(s["c"], s, 0), estado(s["c"], s, 1)]})
    s["eventos"] = s["eventos"][-60:]
    s["ult"] = time.time()


def _pagar_pvp(s):
    c = s["c"]
    if s["pagado"] or not c.terminado():
        return
    s["pagado"] = True
    gi = c.equipos.index(c.ganador())
    for i, uid in enumerate(s["uids"]):
        def f(d, i=i):
            if i == gi:
                d["monedas"] += REC_PVP
                d["pvp_victorias"] = d.get("pvp_victorias", 0) + 1
                _sumar_vic_pj(d, [l.key for l in c.equipos[gi].luchadores])
            else:
                d["pvp_derrotas"] = d.get("pvp_derrotas", 0) + 1
            return d["monedas"]
        try:
            total = db().transaccion(uid, f)
            if i == gi:
                s["premios"][i] = (REC_PVP, total)
        except Exception as e:
            print("Error guardando PvP:", repr(e))
    c.log += f"\n💀 **{c.equipos[gi].nombre}** gana **{REC_PVP}** Monedas del Alma."


def _revisar_tiempo(s):
    c = s["c"]
    if c and not c.terminado() and time.time() - s["ult"] > TIMEOUT_TURNO:
        eq = c.actual
        c.log = f"⌛ **{eq.nombre}** tardó demasiado. ¡Pierde por abandono!"
        c.anim = c.trans = None
        c.abandonar(eq)
        _pagar_pvp(s)
        _evento(s, [])


def _vista(s, yo, desde):
    _revisar_tiempo(s)
    return {"sala": "jugando", "codigo": s["codigo"], "yo": yo, "seq": s["seq"],
            "eventos": [{"seq": e["seq"], "estado": e["v"][yo], "anims": e["anims"]} for e in s["eventos"] if e["seq"] > desde],
            "actual": estado(s["c"], s, yo), "nombres": [e.nombre for e in s["c"].equipos]}


def _sala(q_id, ses):
    s = SALAS.get(str(q_id or "").upper())
    if not s:
        return None, None, {"error": "Esa partida ya no existe."}
    if not ses or ses["id"] not in s["uids"]:
        return None, None, {"error": "No eres parte de esta partida."}
    s["t"] = time.time()
    return s, s["uids"].index(ses["id"]), None


def _equipo_valido(keys):
    return isinstance(keys, list) and len(keys) == 3 and all(k in M.PERSONAJES for k in keys)


def api_pvp_crear(b, ses):
    if not ses:
        return {"error": "Inicia sesión con Discord para jugar contra amigos."}
    if not _equipo_valido(b.get("equipo")):
        return {"error": "Elige 3 luchadores."}
    _limpiar_salas()
    codigo = "".join(random.choice(LETRAS) for _ in range(6))
    SALAS[codigo] = {"codigo": codigo, "t": time.time(), "ult": time.time(), "uids": [ses["id"], None],
                     "nombres": [ses["n"], None], "equipos": [b["equipo"], None], "c": None, "eventos": [], "seq": 0,
                     "pagado": False, "premios": {}}
    return {"codigo": codigo, "link": f"{PUBLIC_URL}/?sala={codigo}"}


def api_pvp_info(q, ses):
    s = SALAS.get(str(q.get("codigo", "")).upper())
    if not s:
        return {"existe": False}
    return {"existe": True, "creador": s["nombres"][0], "libre": s["uids"][1] is None,
            "mia": bool(ses and ses["id"] in s["uids"])}


def api_pvp_unirse(b, ses):
    if not ses:
        return {"error": "Inicia sesión con Discord para unirte."}
    s = SALAS.get(str(b.get("codigo", "")).upper())
    if not s:
        return {"error": "Esa partida ya no existe."}
    if ses["id"] in s["uids"]:
        return {"error": "Esa es tu propia partida: pásale el link a tu amigo."}
    if s["uids"][1] is not None:
        return {"error": "Esa partida ya está llena."}
    if not _equipo_valido(b.get("equipo")):
        return {"error": "Elige 3 luchadores."}
    s["uids"][1], s["nombres"][1], s["equipos"][1] = ses["id"], ses["n"], b["equipo"]
    s["c"] = M.Combate(M.Equipo(Jugador(s["nombres"][0]), s["equipos"][0]), M.Equipo(Jugador(s["nombres"][1]), s["equipos"][1]))
    s["t"] = s["ult"] = time.time()
    _evento(s, [])
    return _vista(s, 1, 0)


def api_pvp_estado(q, ses):
    s, yo, err = _sala(q.get("id"), ses)
    if err:
        return err
    if s["c"] is None:
        return {"sala": "esperando", "codigo": s["codigo"]}
    return _vista(s, yo, int(q.get("desde", 0) or 0))


def _pvp_actuar(b, ses, f):
    s, yo, err = _sala(b.get("id"), ses)
    if err:
        return err
    c = s["c"]
    if c is None:
        return {"error": "Todavía falta un rival."}
    _revisar_tiempo(s)
    if c.terminado() or c.turno != yo:
        return {"error": "No es tu turno."}
    r = f(c, s, yo)
    if r:
        return r
    _pagar_pvp(s)
    _evento(s, _anim(c))
    return _vista(s, yo, int(b.get("desde", 0) or 0))


def _ejecutar_accion(c, b):
    try:
        a = c.actual.luchadores[int(b["actor"])]
        k = b["k"]
        if k not in ("normal", "hab1", "hab2", "defender", "ulti") or not c.puede(a, k):
            return {"error": "Esa acción ya no está disponible."}
        obj = None
        if k != "defender":
            m = a.mov(k)
            ali = b.get("aliado")
            if m["tipo"] in ("cura", "limpia") or (b.get("apoyo") and ali is not None):
                obj = c.actual.luchadores[int(ali)] if ali is not None else None
            elif b.get("objetivo") is not None:
                obj = c.rival.luchadores[int(b["objetivo"])]
                if not obj.vivo or obj not in c.rival.blancos:
                    obj = None
        c.ejecutar(a, k, obj)
    except (KeyError, ValueError, IndexError, TypeError):
        return {"error": "Acción inválida."}
    return None


def api_pvp_accion(b, ses):
    return _pvp_actuar(b, ses, lambda c, s, yo: _ejecutar_accion(c, b))


def api_pvp_terminar(b, ses):
    def f(c, s, yo):
        c.terminar_turno()
    return _pvp_actuar(b, ses, f)


def api_pvp_rendirse(b, ses):
    s, yo, err = _sala(b.get("id"), ses)
    if err:
        return err
    c = s["c"]
    if c is None or c.terminado():
        return {"error": "No hay partida en curso."}
    c.log = f"🏳️ **{c.equipos[yo].nombre}** se rinde."
    c.anim = c.trans = None
    c.abandonar(c.equipos[yo])
    _pagar_pvp(s)
    _evento(s, [])
    return _vista(s, yo, int(b.get("desde", 0) or 0))


GETS = {"/api/personajes": api_personajes, "/api/yo": api_yo, "/api/bazar": api_bazar,
        "/api/pvp/info": api_pvp_info, "/api/pvp/estado": api_pvp_estado}
POSTS = {"/api/nueva": api_nueva, "/api/accion": api_accion, "/api/terminar": api_terminar,
         "/api/comprar": api_comprar, "/api/equipar": api_equipar, "/api/visto": api_visto,
         "/api/pvp/crear": api_pvp_crear, "/api/pvp/unirse": api_pvp_unirse, "/api/pvp/accion": api_pvp_accion,
         "/api/pvp/terminar": api_pvp_terminar, "/api/pvp/rendirse": api_pvp_rendirse}


# ------------------------------------------------------------------ HTTP
def _discord(url, datos=None, token=None):
    cab = {"User-Agent": f"DiscordBot ({PUBLIC_URL}, 1.0)"}
    if token:
        cab["Authorization"] = "Bearer " + token
    cuerpo = None
    if datos is not None:
        cuerpo = urllib.parse.urlencode(datos).encode()
        cab["Content-Type"] = "application/x-www-form-urlencoded"
    with urllib.request.urlopen(urllib.request.Request(url, data=cuerpo, headers=cab), timeout=15) as r:
        return json.load(r)


class H(BaseHTTPRequestHandler):
    def _sesion(self):
        ck = SimpleCookie(self.headers.get("Cookie", ""))
        return _leer_firma(ck["sid"].value) if "sid" in ck else None

    def _cookie(self, nombre, valor, max_age):
        flags = f"{nombre}={valor}; Path=/; HttpOnly; SameSite=Lax; Max-Age={max_age}" + ("; Secure" if SEGURA else "")
        self.send_header("Set-Cookie", flags)

    def _json(self, d, code=200):
        raw = json.dumps(d, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _ir(self, destino, cookies=()):
        self.send_response(302)
        self.send_header("Location", destino)
        for c in cookies:
            self._cookie(*c)
        self.send_header("Content-Length", "0")
        self.end_headers()
    
    def _estatico(self, ruta):
        tipos = {".js": "application/javascript; charset=utf-8", ".mp3": "audio/mpeg", ".ogg": "audio/ogg",
                 ".m4a": "audio/mp4", ".wav": "audio/wav", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                 ".png": "image/png", ".webp": "image/webp"}
        if ruta.startswith("/musica/") or ruta.startswith("/img/"):
            carpeta = "musica" if ruta.startswith("/musica/") else "img"
            nombre = urllib.parse.unquote(ruta.split("/", 2)[2])
            arc = (AQUI / carpeta / Path(nombre).name)          # Path.name evita salirse de la carpeta
        else:
            arc = AQUI / ruta.lstrip("/")
        tipo = tipos.get(arc.suffix.lower())
        if not tipo or not arc.is_file():
            return self.send_error(404)
        total = arc.stat().st_size
        ini, fin, cod = 0, total - 1, 200
        rg = self.headers.get("Range", "")
        mt = re.match(r"bytes=(\d*)-(\d*)$", rg)
        if mt and (mt.group(1) or mt.group(2)):
            if mt.group(1):
                ini = int(mt.group(1))
                fin = int(mt.group(2)) if mt.group(2) else total - 1
            else:
                ini = max(0, total - int(mt.group(2)))
            fin = min(fin, total - 1)
            if ini > fin:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{total}")
                self.send_header("Content-Length", "0")
                return self.end_headers()
            cod = 206
        self.send_response(cod)
        self.send_header("Content-Type", tipo)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache" if arc.suffix == ".js" else ("public, max-age=300" if ruta.startswith("/img/") else "public, max-age=86400"))
        if cod == 206:
            self.send_header("Content-Range", f"bytes {ini}-{fin}/{total}")
        self.send_header("Content-Length", str(fin - ini + 1))
        self.end_headers()
        try:
            with open(arc, "rb") as fh:
                fh.seek(ini)
                resto = fin - ini + 1
                while resto > 0:
                    d = fh.read(min(65536, resto))
                    if not d:
                        break
                    self.wfile.write(d)
                    resto -= len(d)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        ruta, q = u.path, urllib.parse.parse_qs(u.query)
        try:
            if ruta in GETS:
                return self._json(GETS[ruta]({k: v[0] for k, v in q.items()}, self._sesion()))
            if ruta in ("/musica.js", "/reproductor.js", "/interfaz.js", "/pantallas.js", "/dialogos.js", "/novela.js") or ruta.startswith(("/musica/", "/img/")):
                return self._estatico(ruta)
            if ruta in ("/", "/index.html"):
                raw = (AQUI / "index.html").read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(raw)))
                self.end_headers()
                return self.wfile.write(raw)
            if ruta == "/auth/login":
                if not CLIENT_ID:
                    return self._json({"error": "El inicio de sesión no está configurado."}, 503)
                st = secrets.token_urlsafe(24)
                url = "https://discord.com/oauth2/authorize?" + urllib.parse.urlencode({
                    "client_id": CLIENT_ID, "redirect_uri": PUBLIC_URL + "/auth/callback",
                    "response_type": "code", "scope": "identify", "state": st, "prompt": "none"})
                return self._ir(url, [("oauth_state", st, 600)])
            if ruta == "/auth/callback":
                ck = SimpleCookie(self.headers.get("Cookie", ""))
                st = q.get("state", [""])[0]
                if "oauth_state" not in ck or not st or not hmac.compare_digest(ck["oauth_state"].value, st) or "code" not in q:
                    return self._ir("/?error=login")
                tok = _discord(DISCORD_API + "/oauth2/token", {
                    "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET, "grant_type": "authorization_code",
                    "code": q["code"][0], "redirect_uri": PUBLIC_URL + "/auth/callback"})
                yo = _discord(DISCORD_API + "/users/@me", token=tok["access_token"])
                nombre = yo.get("global_name") or yo.get("username") or "Jugador"
                sid = _firmar({"id": str(yo["id"]), "n": nombre, "av": avatar_url(yo["id"], yo.get("avatar")),
                               "exp": time.time() + SESION_DIAS * 86400})
                db().obtener(yo["id"])        # crea la cuenta si es nueva
                return self._ir("/", [("sid", sid, SESION_DIAS * 86400), ("oauth_state", "", 0)])
            if ruta == "/auth/logout":
                return self._ir("/", [("sid", "", 0)])
        except Exception as e:
            print("Error GET:", repr(e))
            if ruta.startswith("/auth/"):
                return self._ir("/?error=login")
            return self._json({"error": "Error del servidor."}, 500)
        self.send_error(404)

    def do_POST(self):
        f = POSTS.get(urllib.parse.urlparse(self.path).path)
        if not f:
            return self.send_error(404)
        try:
            n = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(min(n, 10000)) or b"{}")
            self._json(f(body, self._sesion()))
        except Exception as e:
            print("Error POST:", repr(e))
            self._json({"error": "Error del servidor."}, 500)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    if not os.environ.get("SESSION_SECRET"):
        print("AVISO: falta SESSION_SECRET; las sesiones se cerrarán cada vez que se reinicie el servidor.")
    db()
    print(f"Juego web en {PUBLIC_URL}  ({'Postgres' if os.environ.get('DATABASE_URL') else 'SQLite local'})")
    ThreadingHTTPServer(("0.0.0.0", PUERTO), H).serve_forever()
