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


def _luchador(c, eq, i, l):
    acc = []
    if eq is c.actual and not eq.es_cpu and not c.terminado() and l in c.disponibles():
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


def estado(c, p=None):
    d = {
        "turno": c.turno, "terminado": c.terminado(), "log": c.log, "historial": list(c.historial),
        "medios": [e.medios for e in c.equipos],
        "equipos": [{"nombre": e.nombre, "cpu": e.es_cpu,
                     "luchadores": [_luchador(c, e, i, l) for i, l in enumerate(e.luchadores)]} for e in c.equipos],
        "objetivo": None,
        "blancos": [c.rival.luchadores.index(l) for l in c.rival.blancos] if not c.terminado() else [],
        "aliados": [c.actual.luchadores.index(l) for l in c.actual.vivos] if not c.terminado() else [],
    }
    if not c.terminado():
        o = c.objetivo_por_defecto()
        d["objetivo"] = c.rival.luchadores.index(o) if o else None
    else:
        g = c.ganador()
        d["ganador"] = c.equipos.index(g)
        lider = g.vivos[0]
        d["victoria_img"] = (p or {}).get("img_victoria") or lider.d.get("victoria_img") or lider.d.get("gif")
        if p and p.get("premio") is not None:
            d["recompensa"] = p["premio"]
            d["monedas"] = p.get("monedas")
    return d


def _anim(c):
    return [{"titulo": a["titulo"], "desc": a["desc"], "gif": a.get("gif"), "seg": a.get("seg", 2),
             "color": "#%06x" % a.get("color", 0x333333)} for a in (c.anim, c.trans) if a]


def _pagar(p):
    """Si el jugador (con cuenta) ganó contra la CPU, le da sus monedas, una sola vez por pelea."""
    c = p["c"]
    if p["pagado"] or not c.terminado():
        return
    p["pagado"] = True
    if p["uid"] and c.equipos.index(c.ganador()) == 0:
        premio = M.RECOMPENSA_CPU.get(c.nivel, 8)

        def f(d):
            d["monedas"] += premio
            return d["monedas"]
        try:
            p["monedas"] = db().transaccion(p["uid"], f)
            p["premio"] = premio
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


def api_yo(_, ses):
    if not ses:
        return {"logueado": False, "login_disponible": bool(CLIENT_ID)}
    d = db().obtener(ses["id"])
    return {"logueado": True, "id": ses["id"], "nombre": ses["n"], "avatar": ses.get("av"),
            "monedas": d["monedas"], "mascotas": d["mascotas"], "mascota": d["equipado"].get("mascota"),
            "imagen": d["equipado"].get("imagen")}


def api_bazar(_, ses):
    d = db().obtener(ses["id"]) if ses else None
    mas = []
    for k, it in C.COSMETICOS["mascotas"].items():
        mas.append({"key": k, "nombre": it["nombre"], "precio": it["precio"], "emoji_url": _emoji_url(it["normal"]),
                    "victoria_url": _emoji_url(it["victoria"]),
                    "tiene": bool(d and k in d["mascotas"]), "puesta": bool(d and d["equipado"].get("mascota") == k)})
    return {
        "monedas": d["monedas"] if d else None, "mascotas": mas,
        "imgs": {"burnice": C.BURNICE_IMG, "comprar": C.COMPRAR_IMG, "mesa": C.MESA_IMG, "niko": C.NIKO_IMG},
        "textos": {"saludos": C.BURNICE_SALUDOS, "comprar": C.BURNICE_COMPRAR, "mesa": C.BURNICE_MESA,
                   "salidas": C.BURNICE_SALIDAS, "niko": C.NIKO_OPINION},
        "charlas": C.CHARLAS,
    }


def api_comprar(b, ses):
    if not ses:
        return {"error": "Inicia sesión con Discord para comprar."}
    key = b.get("key")
    it = C.COSMETICOS["mascotas"].get(key)
    if not it:
        return {"error": "Burnice mira alrededor: \"¿Eso? Hmm… no lo tengo en el Bazar. A lo mejor se me quemó, jeje.\""}

    def f(d):
        if key in d["mascotas"]:
            return {"msg": "¡Eso ya lo tienes, cielo! Dos veces no se puede… a menos que lo quemes y lo compres otra vez. No lo recomiendo."}
        if d["monedas"] < it["precio"]:
            return {"msg": f"Uy, te faltan **{it['precio'] - d['monedas']}** Monedas del Alma. Gana unas peleas y vuelve, ¡yo no me muevo!"}
        d["monedas"] -= it["precio"]
        d["mascotas"].append(key)
        return {"msg": f"¡Vendido! **{it['nombre']}** es tuya. Cuídala bien, ¿sí? Ya puedes ponértela desde aquí mismo.", "ok": True}
    r = db().transaccion(ses["id"], f)
    r["monedas"] = db().obtener(ses["id"])["monedas"]
    return r


def api_equipar(b, ses):
    if not ses:
        return {"error": "Inicia sesión con Discord."}
    key = b.get("key")
    if key is not None and key not in C.COSMETICOS["mascotas"]:
        return {"error": "Esa mascota no existe."}

    def f(d):
        if key is not None and key not in d["mascotas"]:
            return {"error": "Primero tienes que comprarla."}
        d["equipado"]["mascota"] = key
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


GETS = {"/api/personajes": api_personajes, "/api/yo": api_yo, "/api/bazar": api_bazar}
POSTS = {"/api/nueva": api_nueva, "/api/accion": api_accion, "/api/terminar": api_terminar,
         "/api/comprar": api_comprar, "/api/equipar": api_equipar}


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

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        ruta, q = u.path, urllib.parse.parse_qs(u.query)
        try:
            if ruta in GETS:
                return self._json(GETS[ruta](None, self._sesion()))
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
