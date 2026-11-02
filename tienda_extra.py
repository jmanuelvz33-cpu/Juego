"""Cosméticos nuevos del Bazar (marcos, títulos, fondos, pantallas de victoria y skins).
Aquí agregas o cambias cosas. Lo que lleva imagen ("img") sale como 'Próximamente' hasta que pongas el link o el archivo."""
import time

# Marcos de perfil: un borde de color alrededor de tu avatar. "css" es el color/degradado (no necesita imagen).
MARCOS = {
    "ascuas":  {"nombre": "Ascuas",    "precio": 150, "css": "linear-gradient(135deg,#ff5a1f,#ffd400)"},
    "hielo":   {"nombre": "Escarcha",  "precio": 150, "css": "linear-gradient(135deg,#7fe0ff,#2f6bff)"},
    "veneno":  {"nombre": "Veneno",    "precio": 150, "css": "linear-gradient(135deg,#9bff5a,#1b7f2e)"},
    "sombra":  {"nombre": "Sombras",   "precio": 200, "css": "linear-gradient(135deg,#9a6bff,#1a1033)"},
    "oro":     {"nombre": "Oro puro",  "precio": 400, "css": "linear-gradient(135deg,#fff1a8,#d4a017,#fff1a8)"},
}

# Títulos: una etiqueta junto a tu nombre.
TITULOS = {
    "recien":   {"nombre": "Recién llegado",       "precio": 0},
    "critico":  {"nombre": "Cazador de críticos",  "precio": 120},
    "cpu":      {"nombre": "Domador de la CPU",    "precio": 200},
    "burnice":  {"nombre": "Amigo de Burnice",     "precio": 150},
    "fuego":    {"nombre": "Pirómano honorario",   "precio": 250},
}

# Fondos comprables: reemplazan el fondo del combate. Pon la imagen en "img" (link o "/img/archivo.jpg").
FONDOS = {
    "atardecer": {"nombre": "Atardecer", "precio": 200, "img": "https://i.imgur.com/vYLiSD9.jpeg"},
    "noche":     {"nombre": "Noche",     "precio": 200, "img": "https://i.imgur.com/CrMXBFN.jpeg"},
    "ruinas":    {"nombre": "Ruinas",    "precio": 250, "img": "https://i.imgur.com/J29emWP.jpeg"},
}

# Pantallas de victoria: la imagen que sale cuando ganas (en vez de la del personaje).
VICTORIAS = {
    "supremo":  {"nombre": "Ser supremo",       "precio": 300, "img": "https://i.imgur.com/faKa6Gf.gif"},
    "disfraz":  {"nombre": "Disfraz divertido", "precio": 300, "img": "https://i.imgur.com/bhOLe6D.jpeg"},
    "picante":  {"nombre": "Victoria picante",  "precio": 350, "img": "https://i.imgur.com/mWCW4zF.jpeg"},
    "adorable": {"nombre": "Victoria adorable", "precio": 150, "img": "https://i.imgur.com/fjHiGVw.jpeg"},
}

# Skins: imagen alternativa de un personaje (se ve en tu selección y en tu lado del combate).
SKINS = {
    "reze_verano":   {"pj": "reze",   "nombre": "Reze de verano",   "precio": 350, "img": "https://i.imgur.com/pbMyLg3.jpeg"},
    "storm_verano": {"pj": "storm",  "nombre": "Storm navideña",   "precio": 350, "img": "https://i.imgur.com/6PfZ79h.jpeg"},
}

# Rebajas fijas (% de descuento permanente). Quita la línea para volver al precio normal.
REBAJAS = {
    "reze_verano": 98,
}

DESCUENTO_OFERTA = 25    # % de descuento de la oferta del día


def _dia():
    return int((time.time() - 4 * 3600) // 86400)      # el día cambia a medianoche de Bolivia


def oferta(catalogos):
    """Elige el artículo del día entre los que se pueden comprar y cuestan algo. catalogos: {cat: {key: item}}"""
    cand = [(c, k) for c, cat in catalogos.items() for k, it in cat.items()
            if it["precio"] > 0 and ("img" not in it or it["img"])]
    if not cand:
        return None
    cand.sort()
    c, k = cand[_dia() % len(cand)]
    return {"cat": c, "key": k, "pct": DESCUENTO_OFERTA}
