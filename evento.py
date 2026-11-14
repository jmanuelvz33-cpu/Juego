"""Evento de dinosaurios. Todo se enciende y apaga solo según las fechas.
Para probar fuera de fechas: en Render pon la variable de entorno EVENTO=on (o EVENTO=off para apagarlo)."""
import os
import re
import urllib.parse
from datetime import datetime, timedelta, timezone
import threading
from pathlib import Path

AQUI = Path(__file__).parent
BOL = timezone(timedelta(hours=-4))                       # hora de Bolivia
INICIO = datetime(2026, 11, 14, 0, 0, 0, tzinfo=BOL)      # sábado 14, desde las 00:00 (adelantado)
FIN = datetime(2026, 11, 23, 23, 59, 59, tzinfo=BOL)      # lunes 23, hasta las 23:59

NOMBRE = "🦖 Evento de dinosaurios"
AVISO = "🦖 ¡Evento de dinosaurios! Mascotas nuevas en el Bazar, Niko te cuenta datos de cada una. Hasta el lunes 23."

# Mascotas del evento: la imagen va en img/mascotas/<clave>.png (256x256, fondo transparente).
# Solo se pueden comprar durante el evento; quien las compró se las queda para siempre.
MASCOTAS = {
    "rex":          {"nombre": "Tiranosaurio",  "precio": 250, "evento": True},
    "triceratops":  {"nombre": "Triceratops",   "precio": 250, "evento": True},
    "velociraptor": {"nombre": "Velociraptor",  "precio": 250, "evento": True},
    "pteranodon":   {"nombre": "Pteranodon",    "precio": 250, "evento": True},
}

# Lo que dice Niko de cada mascota en el Bazar (puedes cambiarlo a tu gusto; también hay de Tyrunt y Agumon).
INTRO_NIKO = [
    "Oh… hola. Burnice me dejó poner mi tiendita aquí otra vez, solo esta semana. Traje unos amigos… muy, muy viejos. Jeje.",
    "Hay unos dinosaurios nuevos. Un paleontólogo cumple años, ¿sabes? Pensé que… merecían una fiesta. Toca uno y te cuento algo de él.",
]
DATOS_NIKO = {
    "rex": "El tiranosaurio tenía una de las mordidas más fuertes de cualquier animal terrestre… y brazos pequeñitos. Pero no eran inútiles, eran muy fuertes. …Como yo cargando panqueques.",
    "triceratops": "Su cráneo medía más de dos metros con todo y collar. Los tres cuernos… sirven para defenderse. O para presumir. Yo no presumo… nada.",
    "velociraptor": "¿Sabías que era del tamaño de un pavo? Y tenía plumas. Los de las películas son más bien… otro dinosaurio, Deinonychus. Shh, no se lo digas a los velociraptores.",
    "pteranodon": "Técnicamente… no es un dinosaurio. Es un pterosaurio. No tenía dientes y sus alas abiertas medían como seis metros. Aun así lo traje. Se veía triste en la fila.",
    "tyrunt": "Tyrunt… dicen que está inspirado en el tiranosaurio. Pero con mucho carácter. Le doy espacio cuando se enoja.",
    "agumon": "Agumon es… un Digimon, no un dinosaurio. Pero se parece mucho a un tiranosaurio pequeñito. Y es muy valiente. Eso cuenta, ¿no?",
}


# Vista privada de prueba: abre  tusitio/?evento=CLAVE  y solo TU navegador ve el evento (aunque no sea la fecha).
# Para salir de la prueba:  tusitio/?evento=off.  Cambia la clave con la variable de entorno EVENTO_CLAVE.
CLAVE = os.environ.get("EVENTO_CLAVE", "dino-tester-2026")
_t = threading.local()


def probar(si):
    _t.v = bool(si)


def activo(ahora=None):
    if getattr(_t, "v", False):
        return True
    forzar = os.environ.get("EVENTO", "").strip().lower()
    if forzar in ("on", "1", "si", "sí", "true"):
        return True
    if forzar in ("off", "0", "no", "false"):
        return False
    ahora = ahora or datetime.now(BOL)
    return INICIO <= ahora <= FIN


def _primera_imagen(carpeta, base):
    d = AQUI / carpeta
    if not d.is_dir():
        return ""
    for f in sorted(d.iterdir()):
        if f.stem.lower() == base and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"):
            return "/" + carpeta + "/" + urllib.parse.quote(f.name)
    return ""


def info():
    on = activo()
    musica = []
    d = AQUI / "musica_evento"
    if on and d.is_dir():
        for f in sorted(d.iterdir()):
            if f.suffix.lower() in (".mp3", ".ogg", ".m4a", ".wav"):
                nombre = re.sub(r"[_\-]+", " ", f.stem).strip()
                musica.append({"t": nombre, "a": "Evento", "f": f.name, "d": "musica_evento"})
    return {
        "activo": on, "nombre": NOMBRE, "aviso": AVISO,
        "fondo": _primera_imagen("img", "evento_dino_fondo") if on else "",
        "musica": musica,
        "intro": INTRO_NIKO, "datos": DATOS_NIKO,
        "fin": FIN.isoformat(),
    }
