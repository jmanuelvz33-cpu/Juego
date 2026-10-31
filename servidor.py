"""Prototipo web del juego (Fase 1): pelea contra la CPU en el navegador.
Solo usa la librería estándar de Python: python3 servidor.py  ->  abre http://localhost:8000
Archivos: motor.py (reglas, sin Discord) · servidor.py · index.html"""
import json, os, random, re, uuid, time
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import motor as M

AQUI = Path(__file__).parent
PUERTO = int(os.environ.get("PORT", "8000"))
PARTIDAS = {}          # id -> {"c": Combate, "t": última actividad}
MAX_PARTIDAS = 200


class Jugador:
    def __init__(self, nombre, es_cpu=False):
        self.display_name = nombre
        self.id = 0 if es_cpu else 1


def _emoji_url(txt):
    """<:nombre:ID> -> link de imagen (Discord los sirve en su CDN)."""
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
            d["dual"] = k in ("normal", "hab1", "hab2") and k != "defender" and bool(l.mov(k).get("sana") or l.mov(k).get("regen"))
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


def estado(c, anim=None):
    d = {
        "turno": c.turno, "terminado": c.terminado(), "log": c.log, "historial": list(c.historial),
        "medios": [e.medios for e in c.equipos], "icono_medios": M.MEDIOS_POR_LUCHADOR,
        "equipos": [{"nombre": e.nombre, "cpu": e.es_cpu,
                     "luchadores": [_luchador(c, e, i, l) for i, l in enumerate(e.luchadores)]} for e in c.equipos],
        "objetivo": None, "anim": anim,
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
        d["victoria_img"] = lider.d.get("victoria_img") or lider.d.get("gif")
    return d


def _anim(c):
    out = []
    for a in (c.anim, c.trans):
        if a:
            out.append({"titulo": a["titulo"], "desc": a["desc"], "gif": a.get("gif"), "seg": a.get("seg", 2),
                        "color": "#%06x" % a.get("color", 0x333333)})
    return out


def _paso(c):
    return {"estado": estado(c), "anims": _anim(c)}


def _turnos_cpu(c, pasos):
    for _ in range(80):             # tope de seguridad
        if c.terminado() or not c.actual.es_cpu:
            return
        j = c.jugada_cpu()
        if j is None:
            c.terminar_turno()
        else:
            c.ejecutar(*j)
        pasos.append(_paso(c))


def _limpiar():
    if len(PARTIDAS) > MAX_PARTIDAS:
        for k in sorted(PARTIDAS, key=lambda k: PARTIDAS[k]["t"])[:50]:
            PARTIDAS.pop(k, None)


def api_personajes(_):
    out = []
    for k, d in M.PERSONAJES.items():
        out.append({"key": k, "nombre": d["nombre"], "emoji": d["emoji"], "emoji_url": _emoji_url(d["emoji"]),
                    "color": "#%06x" % d["color"], "desc": d["desc"], "gif": d.get("gif"), "vida": d["vida"],
                    "movs": [{"nombre": d["mov"][m]["nombre"], "desc": d["mov"][m].get("desc", "")} for m in ("normal", "hab1", "hab2")]
                            + [{"nombre": d["ulti"]["nombre"] + " (ÚLTI)", "desc": d["ulti"].get("desc", "")}]})
    return {"personajes": out}


def api_nueva(b):
    keys = b.get("equipo", [])
    if len(keys) != 3 or any(k not in M.PERSONAJES for k in keys):
        return {"error": "Elige 3 luchadores."}
    nivel = b.get("nivel", "normal")
    rival = b.get("rival") or random.sample(list(M.PERSONAJES), 3)
    c = M.Combate(M.Equipo(Jugador("Tú"), keys), M.Equipo(Jugador("CPU", True), rival, es_cpu=True))
    if nivel in M.CPU_NIVELES:
        c.nivel = nivel
        c.inteligencia = M.CPU_NIVELES[nivel]
    gid = uuid.uuid4().hex[:10]
    _limpiar()
    PARTIDAS[gid] = {"c": c, "t": time.time()}
    pasos = []
    _turnos_cpu(c, pasos)      # si la CPU abre la pelea
    return {"id": gid, "estado": estado(c), "pasos": pasos}


def _partida(b):
    p = PARTIDAS.get(b.get("id"))
    if not p:
        return None, {"error": "La partida ya no existe. Empieza otra."}
    p["t"] = time.time()
    c = p["c"]
    if c.terminado() or c.actual.es_cpu:
        return None, {"error": "No es tu turno."}
    return c, None


def api_accion(b):
    c, err = _partida(b)
    if err:
        return err
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
    pasos = [_paso(c)]
    _turnos_cpu(c, pasos)
    return {"pasos": pasos}


def api_terminar(b):
    c, err = _partida(b)
    if err:
        return err
    c.terminar_turno()
    pasos = [_paso(c)]
    _turnos_cpu(c, pasos)
    return {"pasos": pasos}


RUTAS = {"/api/nueva": api_nueva, "/api/accion": api_accion, "/api/terminar": api_terminar}


class H(BaseHTTPRequestHandler):
    def _json(self, d, code=200):
        raw = json.dumps(d, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        if self.path == "/api/personajes":
            return self._json(api_personajes(None))
        if self.path in ("/", "/index.html"):
            raw = (AQUI / "index.html").read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            return self.wfile.write(raw)
        self.send_error(404)

    def do_POST(self):
        f = RUTAS.get(self.path)
        if not f:
            return self.send_error(404)
        try:
            n = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(min(n, 10000)) or b"{}")
            self._json(f(body))
        except Exception as e:
            print("Error:", repr(e))
            self._json({"error": "Error del servidor."}, 500)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print(f"Juego web en http://localhost:{PUERTO}")
    ThreadingHTTPServer(("0.0.0.0", PUERTO), H).serve_forever()
