import random

# ====================================================================================
#  SECUELA — MOTOR DE COMBATE (PRESS TURN POR EQUIPOS DE 3)
#  Esta parte no usa Discord: solo reglas. Toda la interfaz está más abajo.
# ====================================================================================

# ---------------- AJUSTES DE BALANCE (cambia estos números para equilibrar) ----------------
VIDA = 130              # vida de cada luchador
TIMEOUT_TURNO = 150     # segundos que tiene cada jugador para actuar
TIMEOUT_ELECCION = 120  # segundos para elegir equipo
MEDIOS_POR_LUCHADOR = 2 # cada luchador VIVO da 1 icono de turno = 2 "medios iconos"
COSTE_NORMAL = 1        # ataque normal = ½ icono
COSTE_HABILIDAD = 2     # habilidades = 1 icono
COSTE_DEFENDER = 2      # defender = 1 icono
COSTE_ULTI = 4          # ÚLTI = 2 iconos
ARRANQUE_MEDIOS = 3     # el equipo que abre la pelea solo tiene 1 icono y medio en su primer turno (compensa la ventaja de empezar)
PM_MAX = 10             # PM (puntos de magia) máximos de cada luchador
PM_INICIAL = 4          # PM con los que empieza (+PM_REGEN al abrir su primer turno)
PM_REGEN = 2            # PM que recupera cada luchador vivo al empezar el turno de su equipo
PM_NORMAL = 1           # PM que gana un luchador cuando su ataque normal acierta
PM_DEFENDER = 1         # PM que gana al defenderse
VEL_CRIT = 0.25         # 💨 Velocidad: probabilidad extra de crítico (Yoruichi)
HOJAS_MAX = 3           # 🍃 hojas máximas de Mantis (las gana con su ataque normal y las gasta al curar)
CURA_HOJAS = {1: 16, 2: 30, 3: 14}   # cura de Mantis según sus hojas: 1 = 16 a un aliado · 2 = 30 a un aliado · 3 = 14 a TODO el equipo
ULTI_CURA = 0.4         # curar también carga la ÚLTI de quien cura (0.4 = 40% de lo que carga hacer daño)
ULTI_HOJA = 20          # % de ÚLTI que gana Mantis cada vez que su ataque normal acierta
MS_RONDA = 40           # muerte súbita: pasados tantos cambios de turno, el daño sube en cada turno (evita peleas eternas)
MS_SUBE = 0.10          # cuánto sube el daño por cada cambio de turno extra (10% = +10% cada vez)
FUSION_PREC = 0.15      # 🧵 Fusionado: el luchador fusionado falla 15% más (baja su precisión)
REGEN_CURA = 5          # 💚 Regeneración: cura que recibe al inicio de cada turno de su dueño
SOMBRAS_MAX = 3         # 🌑 medidor de sombras de Megumi (sustituye a los PM)
SOMBRAS_INICIAL = 1     # sombras con las que empieza
MAHO_HP = 90            # vida propia de Mahoraga (Megumi no recibe daño mientras está)
MAHO_TURNOS = 3         # turnos que dura Mahoraga (cuenta el turno en que aparece). Si sale roto, pon 2
SUENO_DESPIERTA = False # True = un golpe despierta al luchador dormido
PROB_CRIT = 0.12        # probabilidad de crítico (la acción no gasta icono = turno extra)
CRIT_MULT = 1.5         # daño extra del crítico
GUARDIA_MULT = 0.5      # daño que recibe un luchador en guardia
GUARDIA_PIERDE = 2      # medios iconos que pierde quien golpea a alguien en guardia (2 = 1 icono)
DEBIL_MULT = 0.75       # 💫 Debilidad: el luchador debilitado hace 25% menos de daño
ROTA_MULT = 1.3         # 🛡️ Guardia rota: recibe 30% más de daño y su guardia no sirve
FURIA_MULT = 1.25       # bono de la ÚLTI de Jolyne: +25% de daño
QUEMADURA_DMG = 6       # 🔥 daño al inicio de cada turno de su dueño
VENENO_DMG = 5          # ☠️ daño al inicio de cada turno de su dueño
SANGRADO_DMG = 4        # 🩸 Sangrado (Denji): daño al inicio de cada turno de su dueño
FRENESI_MULT = 1.2      # 🩸 Frenesí (Denji): +20% de daño contra rivales que sangran
FRENESI_CURA = 2        # 🩸 Frenesí: vida que recupera Denji cada vez que golpea a un rival que sangra
ULTI_HECHO = 100 / 150  # carga de ÚLTI por punto de daño que haces (150 de daño = ÚLTI lista)
ULTI_RECIBIDO = 100 / 110  # carga de ÚLTI por punto de daño que recibes
ULTI_ANIM_SEG = 4       # segundos que se ve el GIF de la ÚLTI
SUSPENSO_SEG = 3.5      # segundos que se ve el GIF de un golpe fuerte o crítico
TRANSICION_GIF = "https://i.imgur.com/iP8z0NW.gif"     # <- GIF que aparece cuando termina el turno de alguien y le toca al otro (vacío = sin transición)
TRANSICION_SEG = 2.5    # segundos que se ve la transición
VERSUS_SEG = 3.5        # segundos de la pantalla de VERSUS
HISTORIAL = 2           # turnos anteriores que se muestran
CPU_EFECTO_MULT = 1.4     # la CPU valora más las habilidades que dan efecto (quemadura, parálisis...)
CPU_HAB_BONO = 2.0        # pequeño extra por usar habilidades en vez de solo el ataque normal
CPU_ULTI_MULT = 1.8       # cuando la ÚLTI está lista, la CPU la usa
CPU_REPITE = 0.85         # repetir el mismo ataque que acaba de usar vale menos (variedad)
CPU_NIVELES = {"facil": 0.55, "normal": 0.85, "dificil": 1.0}   # 1.0 = CPU perfecta
RECOMPENSA_CPU = {"facil": 3, "normal": 8, "dificil": 12}       # Monedas del Alma por ganarle a la CPU
RECOMPENSA_PVP = 25                                              # Monedas del Alma por ganarle a un jugador

# Los 5 efectos de estado. Cada uno dura N turnos de su dueño.
EFECTOS_TXT = {
    "quemadura": "🔥 Quemadura",
    "veneno": "☠️ Veneno",
    "paralisis": "⚡ Parálisis",
    "debilidad": "💫 Debilidad",
    "guardia_rota": "🛡️ Guardia rota",
    "enredado": "🪢 Enredado",     # solo lo causa Megumi: no puede actuar y luego queda debilitado
    "sangrado": "🩸 Sangrado",    # solo lo causa Denji: daño al inicio de cada turno de su dueño
    "sueno": "💤 Sueño",          # solo lo causa la ÚLTI de Mantis: no puede actuar su próximo turno
    "fusion": "🧵 Fusionado",      # solo lo causa Josuke: el luchador baja su precisión
    "regen": "💚 Regeneración",   # solo lo da Josuke a un compañero: se cura al inicio de su turno
}
BONOS_TXT = {"furia": "🔺 Furia (+25% daño)", "velocidad": "💨 Velocidad (+25% crítico)",
             "frenesi": "🩸 Frenesí (+20% daño y roba vida a los que sangran)"}

# ---------------- PERSONAJES ----------------
# "gif" = retrato · "crit_gif" = animación de golpe fuerte / crítico · "ulti_gif" = animación de la ÚLTI
# "victoria_img" = imagen de victoria. Déjalos "" hasta que tengas los links (el bot funciona igual).
# "emoji" puede ser un emoji normal o uno personalizado de tu servidor: <:nombre:ID>
PERSONAJES = {
    "jolyne": {
        "nombre": "Jolyne Kujo",
        "emoji": "<:emoji_15:1563289355601059991>",
        "color": 0x3FA7D6,
        "boton": "9DDC55",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Stone Free (JoJo). Control: sus hilos paralizan y su ÚLTI protege y potencia a todo el equipo.",
        "gif": "https://i.imgur.com/BIV9D5p.jpeg",            # <- retrato de Jolyne
        "crit_gif": "https://i.imgur.com/M4KRFZs.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/U6Vh0da.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Puñetazos de hilo", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (8, 12), "prec": 0.95},
            "hab1": {"nombre": "Hilos", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (5, 8), "prec": 0.90, "efecto": ("paralisis", 1, 0.80),
                     "desc": "Poco daño. Paraliza al rival: pierde su próximo turno (80%)."},
            "hab2": {"nombre": "Deshilar", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (22, 30), "prec": 0.85},
        },
        "ulti": {"nombre": "Cinta de Möbius", "tipo": "equipo", "coste": COSTE_ULTI,
                 "cura": 15, "bono": ("furia", 2), "limpia": True,
                 "gif": "https://i.imgur.com/ggk68Y7.gif", "grito": "¡Su cuerpo se vuelve cinta!",   # <- gif = animación de la ÚLTI
                 "desc": "Cura 15 a todo el equipo, limpia sus efectos y sube su daño 25% durante 2 turnos."},
    },
    "reze": {
        "nombre": "Reze",
        "emoji": "<:emoji_17:1563289420923146321>",
        "color": 0xC0392B,
        "boton": "D2527F",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "La Chica Bomba (Chainsaw Man). Daño: todo lo que toca explota.",
        "gif": "https://i.imgur.com/0nwo6rb.jpeg",
        "crit_gif": "https://i.imgur.com/ZSkiI3y.gif",
        "victoria_img": "https://i.imgur.com/7UDScre.jpeg",
        "mov": {
            "normal": {"nombre": "Golpe rápido", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (9, 13), "prec": 0.95},
            "hab1": {"nombre": "Beso explosivo", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (5, 8), "prec": 0.90, "efecto": ("quemadura", 2, 0.85),
                     "desc": "Poco daño. Deja al rival ardiendo 2 turnos (85%)."},
            "hab2": {"nombre": "Explosión de cabeza", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (24, 32), "prec": 0.85},
        },
        "ulti": {"nombre": "Bomba total", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (12, 16), "efecto": ("quemadura", 2, 1.0),
                 "gif": "https://i.imgur.com/mn3GQl2.gif", "grito": "¡Todo el campo estalla!",
                 "desc": "Daño a todo el equipo rival y los deja ardiendo."},
    },
    "storm": {
        "nombre": "Storm",
        "emoji": "<:emoji_16:1563289388190924943>",
        "color": 0x5DADE2,
        "boton": "50B2CB",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Ororo Munroe (X-Men). Apoyo y área: debilita al rival y lanza tormentas a todo el equipo.",
        "gif": "https://i.imgur.com/y1z0rAi.jpeg",
        "crit_gif": "https://i.imgur.com/lneGV70.gif",
        "victoria_img": "https://i.imgur.com/zK9gwvM.jpeg",
        "mov": {
            "normal": {"nombre": "Rayo", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (8, 12), "prec": 0.95},
            "hab1": {"nombre": "Niebla helada", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (5, 8), "prec": 0.90, "efecto": ("debilidad", 2, 0.85),
                     "desc": "Poco daño. El rival hace 25% menos de daño durante 2 turnos (85%)."},
            "hab2": {"nombre": "Viento cortante", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (22, 30), "prec": 0.85},
        },
        "ulti": {"nombre": "Tormenta", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (11, 15), "efecto": ("debilidad", 2, 0.50),
                 "gif": "https://i.imgur.com/DL2AP4y.gif", "grito": "¡El cielo se rompe sobre el rival!",
                 "desc": "Daño a todo el equipo rival, con 50% de debilitar a cada uno."},
    },
    "ochako": {
        "nombre": "Ochako Uraraka",
        "emoji": "<:emoji_18:1563289444302200872>",
        "color": 0xF48FB1,
        "boton": "E599C3",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Uravity (My Hero Academia). Utilidad: quita la guardia del rival y lo deja flotando.",
        "gif": "https://i.imgur.com/apmxpCV.jpeg",
        "crit_gif": "https://i.imgur.com/vpQ8RcL.gif",
        "victoria_img": "https://i.imgur.com/byhaqwv.jpeg",
        "mov": {
            "normal": {"nombre": "Golpe de palma", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (8, 12), "prec": 0.95},
            "hab1": {"nombre": "Cero gravedad", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (5, 8), "prec": 0.90, "efecto": ("guardia_rota", 2, 0.85),
                     "desc": "Poco daño. El rival recibe 30% más de daño y su guardia no sirve (85%)."},
            "hab2": {"nombre": "Lluvia de escombros", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (22, 30), "prec": 0.85},
        },
        "ulti": {"nombre": "Meteoros", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (11, 15), "flota": True,
                 "gif": "https://i.imgur.com/yPsHK6M.gif", "grito": "¡Una lluvia de meteoros cae sobre todos!",
                 "desc": "Daño a todo el equipo rival. El objetivo elegido queda flotando (paralizado 1 turno)."},
    },
    "yuki": {
        "nombre": "Yuki Tsukumo",
        "emoji": "<:emoji_21:1563551373629325574>",
        "color": 0x8E44AD,
        "boton": "D2693C",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Jujutsu Kaisen. Golpe pesado: prepara su Masa Virtual y luego golpea muy fuerte.",
        "gif": "https://i.imgur.com/eJQK7p6.jpeg",            # <- retrato de Yuki
        "crit_gif": "https://i.imgur.com/lieBufC.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/KrjerJx.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Golpe de masa", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (9, 13), "prec": 0.93},
            "hab1": {"nombre": "Masa virtual", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (4, 7), "prec": 0.95, "bono": ("furia", 2),
                     "desc": "Poco daño. Ella gana 🔺 Furia (+25% de daño) durante 2 turnos."},
            "hab2": {"nombre": "Garuda", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (26, 34), "prec": 0.80,
                     "desc": "El golpe fuerte más pesado, pero el que más falla."},
        },
        "ulti": {"nombre": "Furia estelar", "tipo": "unico", "coste": COSTE_ULTI,
                 "dmg": (55, 70),
                 "gif": "https://i.imgur.com/Yd9kdug.gif", "grito": "¡La masa virtual lo aplasta todo!",
                 "desc": "Golpe enorme a un solo objetivo. Ignora la guardia y siempre acierta."},
    },
    "yoruichi": {
        "nombre": "Yoruichi Shihōin",
        "emoji": "<:emoji_22:1563551448124362782>",
        "color": 0xF39C12,
        "boton": "FFB54F",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Bleach. Velocidad: sube su probabilidad de crítico para encadenar turnos extra.",
        "gif": "https://i.imgur.com/ijBEI56.jpeg",            # <- retrato de Yoruichi
        "crit_gif": "https://i.imgur.com/KrHwirN.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/EsE8Uk2.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Golpe de hakuda", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (7, 11), "prec": 0.97},
            "hab1": {"nombre": "Shunpo", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (4, 7), "prec": 0.95, "bono": ("velocidad", 1),
                     "desc": "Poco daño. Ella gana 💨 Velocidad: +25% de crítico el resto del turno."},
            "hab2": {"nombre": "Shunko", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (19, 26), "prec": 0.88, "efecto": ("paralisis", 1, 0.35),
                     "desc": "Golpe de rayo. 35% de paralizar al rival."},
        },
        "ulti": {"nombre": "Destello de los 3 pasos", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (11, 15), "primer_crit": True, "devuelve": 2,
                 "gif": "https://i.imgur.com/KdHPmQW.gif", "grito": "¡Tres pasos, tres golpes!",
                 "desc": "Daño a todo el equipo rival; el primer golpe es crítico y recupera 1 icono."},
    },
    "megumi": {
        "nombre": "Megumi Fushiguro",
        "emoji": "<:emoji_26:1565487546916409364>",     # <- pon aquí tu emoji de Megumi: <:nombre:ID>
        "color": 0x1C2833,
        "boton": "524C64",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": 120,
        "sombras": True,   # usa el medidor 🌑 de sombras en vez de PM
        "desc": "Jujutsu Kaisen. Invocador: junta sombras con su lobo, convoca shikigamis y, con el medidor lleno, a Mahoraga.",
        "gif": "https://i.imgur.com/mnwUG9o.jpeg",            # <- retrato de Megumi
        "crit_gif": "",       # <- (opcional) animación general; cada ataque tiene la suya abajo
        "victoria_img": "https://i.imgur.com/KFy1m5A.jpeg",   # <- imagen de victoria
        "forma_nombre": "Mahoraga",
        "forma_gif": "https://i.imgur.com/sQXcM5U.jpeg",      # <- retrato de Mahoraga (se ve mientras está invocado)
        "mov": {
            "normal": {"nombre": "Mordisco del lobo", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (9, 13), "prec": 0.95, "sombra": 1,
                       "crit_gif": "https://i.imgur.com/GLfKCFL.gif",       # <- animación de crítico del Mordisco del lobo
                       "desc": "Su lobo muerde. Si acierta, gana 1 🌑 sombra."},
            "hab1": {"nombre": "Sapo", "tipo": "estado", "coste": COSTE_HABILIDAD, "sombras": 1,
                     "dmg": (4, 7), "prec": 0.90, "efecto": ("enredado", 1, 0.80),
                     "crit_gif": "https://i.imgur.com/X51P9Rp.gif",         # <- animación de crítico del Sapo
                     "desc": "Cuesta 1 🌑. Poco daño. La lengua del sapo deja al rival 🪢 Enredado: no puede actuar su próximo turno y después queda debilitado 2 turnos (80%)."},
            "hab2": {"nombre": "Nue", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "sombras": 2,
                     "dmg": (19, 26), "prec": 0.88, "extra": 5,
                     "crit_gif": "https://i.imgur.com/24h6twV.gif",         # <- animación de crítico de Nue
                     "desc": "Cuesta 2 🌑. El pájaro eléctrico golpea fuerte y suma 5 de daño eléctrico que la guardia no reduce."},
        },
        "ulti": {"nombre": "Elefante máximo", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (15, 21),
                 "gif": "https://i.imgur.com/feH68mQ.gif", "grito": "¡Una marea de agua cae sobre todos!",   # <- gif de la ÚLTI del Elefante
                 "desc": "Daño muy alto a todo el equipo rival. Si tiene las 3 🌑 sombras, la ÚLTI es Mahoraga."},
        "ulti_alt": {"nombre": "Mahoraga", "tipo": "forma", "coste": COSTE_ULTI,
                     "gif": "https://i.imgur.com/FMk50LC.gif", "grito": "¡Mahoraga, el Sabio General Divino, despierta!",   # <- gif de la invocación de Mahoraga
                     "desc": "Gasta las 3 🌑. Mahoraga (90 de vida) cubre al equipo 3 turnos: solo él ataca y solo él recibe daño, y es inmune a los efectos."},
        "forma_mov": {
            "normal": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
            "hab1": {"nombre": "Espada de Mahoraga", "tipo": "fuerte", "coste": COSTE_HABILIDAD,
                     "dmg": (16, 22), "prec": 0.90,
                     "crit_gif": "https://i.imgur.com/y1BsWfe.gif",         # <- animación de crítico de la Espada de Mahoraga
                     "desc": "Golpe fuerte de Mahoraga. Si absorbió un efecto con Adaptación, lo aplica al rival."},
            "hab2": {"nombre": "Adaptación", "tipo": "adapta", "coste": COSTE_HABILIDAD,
                     "desc": "Guardia: mitad de daño y el rival pierde 1 icono. Absorbe el primer efecto que le lancen y su próxima Espada lo aplica."},
            "ulti": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
        },
    },
    "josuke": {
        "nombre": "Josuke Higashikata",
        "emoji": "<:emoji_24:1565078822708060160>",     # <- pon aquí tu emoji de Josuke: <:nombre:ID>
        "color": 0xFF8FB1,
        "boton": "D3127C",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": 135,
        "curador": True,   # sus ataques también pueden curar a un compañero (se elige en el menú de objetivos)
        "desc": "Crazy Diamond (JoJo, parte 4). Apoyo: sus golpes dañan al rival o curan a un compañero.",
        "gif": "https://i.imgur.com/5fj0rt7.jpeg",            # <- retrato de Josuke
        "crit_gif": "https://i.imgur.com/s23tuEP.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/RhtwAcj.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Golpe de Crazy Diamond", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (7, 11), "prec": 0.95, "sana": 9,
                       "desc": "Elige un rival: lo golpea. Elige un compañero: lo cura 9 (no falla)."},
            "hab1": {"nombre": "¡Dora, dora, dora!", "tipo": "estado", "coste": 3, "pm": 2,
                     "dmg": (2, 4), "golpes": 3, "prec": 0.95, "efecto": ("fusion", 2, 0.90), "regen": ("regen", 3),
                     "desc": "Rival: 3 golpes que lo dejan 🧵 Fusionado con su ropa (falla 15% más, 2 turnos). Compañero: 💚 Regeneración (cura 5 al inicio de su turno, 2 turnos)."},
            "hab2": {"nombre": "Puño restaurador", "tipo": "fuerte", "coste": 4, "pm": 4,
                     "dmg": (18, 25), "prec": 0.85, "sana": 26,
                     "desc": "Rival: golpe fuerte, sin efecto. Compañero: lo cura 26, mucho más que los otros."},
        },
        "ulti": {"nombre": "Crazy Diamond: ¡DORARARARA!", "tipo": "crazy", "coste": COSTE_ULTI,
                 "dmg": (4, 6), "golpes": 3, "cura": (4, 6), "curas": 3,
                 "gif": "https://i.imgur.com/44WtlIH.gif", "grito": "¡Dorarararararara!",
                 "desc": "Golpea 3 veces a cada rival y cura 3 veces a cada compañero. Siempre acierta."},
    },
    "denji": {
        "nombre": "Denji",
        "emoji": "<:emoji_25:1565152531364053062>",     # <- pon aquí tu emoji de Denji: <:nombre:ID>
        "color": 0xD35400,
        "boton": "8E292C",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Chainsaw Man. Debilitador: sus motosierras dejan sangrado y se alimenta de la sangre del rival.",
        "gif": "https://i.imgur.com/l8JxhvO.jpeg",            # <- retrato de Denji
        "crit_gif": "https://i.imgur.com/qwnopVZ.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/67OX8lm.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Corte de motosierra", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (2, 4), "golpes": 3, "prec": 0.95,
                       "desc": "3 cortes seguidos, poco daño cada uno."},
            "hab1": {"nombre": "Giro de motosierra", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (1, 3), "golpes": 4, "prec": 0.90, "efecto": ("sangrado", 3, 0.85), "bono": ("frenesi", 2),
                     "desc": "4 cortes giratorios. Deja 🩸 Sangrado (4 de daño al inicio de su turno, 3 turnos, 85%) y Denji gana 🩸 Frenesí 2 turnos: +20% de daño y roba vida contra rivales que sangran."},
            "hab2": {"nombre": "Decapitación", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (17, 24), "prec": 0.85, "efecto": ("sangrado", 3, 1.0), "efecto_extra": ("guardia_rota", 1, 1.0),
                     "desc": "Golpe fuerte: deja 🩸 Sangrado y baja la defensa del rival hasta que termine el turno (🛡️ Guardia rota: tus compañeros le pegan 30% más). No se acumula."},
        },
        "ulti": {"nombre": "Hombre Motosierra", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (3, 5), "golpes": 3, "efecto": ("sangrado", 3, 1.0), "bono": ("frenesi", 2),
                 "gif": "https://i.imgur.com/NdpROYz.gif", "grito": "¡Las motosierras salen de todo su cuerpo!",
                 "desc": "3 cortes a todo el equipo rival, todos quedan 🩸 sangrando. Denji gana Frenesí 2 turnos."},
    },
    "mantis": {

        "nombre": "Mantis",
        "emoji": "<:emoji_23:1564807292795224146>",     # <- pon aquí tu emoji de Mantis: <:nombre:ID>
        "color": 0x27AE60,
        "boton": "30C57B",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": 125,        # menos vida que el resto (130): hay que protegerla
        "hojas": True,      # usa 🍃 hojas (las gana con el ataque normal)
        "desc": "Guardianes de la Galaxia (Marvel). Apoyo: junta hojas para curar y su ÚLTI duerme al rival.",
        "gif": "https://i.imgur.com/arZOwk3.jpeg",            # <- retrato de Mantis
        "crit_gif": "https://i.imgur.com/4rDkOAu.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/pD8UBHP.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Golpe de antena", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (6, 9), "prec": 0.97, "hoja": 1,
                       "desc": "Poco daño. Si acierta, gana 1 🍃 hoja (máximo 3)."},
            "hab1": {"nombre": "Sanar", "tipo": "cura", "coste": COSTE_HABILIDAD,
                     "desc": "Gasta todas sus 🍃 hojas. Elige a quién curar en el menú de objetivos. 1 hoja: cura 16 · 2 hojas: cura 30 · 3 hojas: cura 14 a todo el equipo."},
            "hab2": {"nombre": "Toque empático", "tipo": "limpia", "coste": COSTE_HABILIDAD, "hojas": 1,
                     "desc": "Gasta 1 🍃 hoja. Le quita la quemadura, el veneno o la parálisis al compañero que elijas."},
        },
        "ulti": {"nombre": "Sueño profundo", "tipo": "sueno", "coste": COSTE_ULTI,
                 "efecto": ("sueno", 1, 1.0),
                 "gif": "https://i.imgur.com/FN5ttuM.gif", "grito": "¡Sus antenas brillan y todos se duermen!",
                 "desc": "Duerme a todo el equipo rival: no puede actuar en su próximo turno. Siempre acierta."},
    },
}


def medios_txt(m):
    """Iconos de turno: 🔷 = icono completo, 🔹 = medio icono."""
    return ("🔷" * (m // 2) + "🔹" * (m % 2)) or "—"


class Luchador:
    def __init__(self, key):
        self.key = key
        self.d = PERSONAJES[key]
        self.nombre = self.d["nombre"]
        self.max_hp = self.d["vida"]
        self.hp = self.max_hp
        self.efectos = {}     # nombre -> turnos que le quedan
        self.bonos = {}       # nombre -> turnos que le quedan
        self.guardia = False
        self.ulti = 0.0
        self.pm = PM_INICIAL
        self.hojas = 0        # 🍃 solo las usa Mantis
        self.sombras = SOMBRAS_INICIAL if self.d.get("sombras") else 0   # 🌑 solo las usa Megumi
        self.forma = None     # "mahoraga" mientras Megumi está transformado
        self.forma_hp = 0
        self.forma_turnos = 0
        self.adaptado = None  # efecto que Mahoraga absorbió con Adaptación (nombre, duración)

    @property
    def incapaz(self):
        """No puede actuar: paralizado, dormido o enredado."""
        return "paralisis" in self.efectos or "sueno" in self.efectos or "enredado" in self.efectos

    @property
    def gif(self):
        """Retrato que se ve ahora (Mahoraga tiene el suyo)."""
        return (self.d.get("forma_gif") if self.forma else None) or self.d.get("gif")

    @property
    def tag(self):
        """Nombre para los textos: si el rival tiene el mismo luchador, agrega de quién es."""
        base = self.d.get("forma_nombre", self.nombre) if self.forma else self.nombre
        return f"{base} ({self.dueno})" if getattr(self, "dup", False) else base

    @property
    def vivo(self):
        return self.hp > 0

    @property
    def paralizado(self):
        return "paralisis" in self.efectos

    def mov(self, k):
        if self.forma:
            return self.d["forma_mov"][k]
        if k == "ulti":
            alt = self.d.get("ulti_alt")
            if alt and self.sombras >= SOMBRAS_MAX:
                return alt          # con el medidor lleno la ÚLTI es Mahoraga
            return self.d["ulti"]
        return self.d["mov"][k]


class Equipo:
    def __init__(self, user, keys, es_cpu=False):
        self.user = user
        self.nombre = getattr(user, "display_name", "CPU")
        self.es_cpu = es_cpu
        self.luchadores = [Luchador(k) for k in keys]
        self.medios = 0
        self.cursor = 0       # a quién le toca actuar (el orden del equipo es fijo: 1 → 2 → 3)

    @property
    def vivos(self):
        return [l for l in self.luchadores if l.vivo]

    @property
    def blancos(self):
        """A quién se puede atacar: si hay un Mahoraga, solo a él (es el muro)."""
        muro = [l for l in self.vivos if l.forma]
        return muro or self.vivos


class Combate:
    def __init__(self, e1, e2):
        self.equipos = [e1, e2]
        self.turno = random.randint(0, 1)
        self.log = f"¡Comienza el combate! Empieza **{self.actual.nombre}**."
        self.historial = []
        self.anim = None
        self.trans = None
        self.nivel = "normal"
        self.inteligencia = CPU_NIVELES["normal"]
        self.arranque_hecho = False
        self.ronda = 0          # cambios de turno que van
        self._avisos = []       # avisos de Mahoraga (aparece/desaparece) para el texto del turno
        for eq in self.equipos:
            for l in eq.luchadores:
                l.dueno = eq.nombre
                l.dup = any(x.key == l.key for e in self.equipos if e is not eq for x in e.luchadores)
        self._iniciar_turno()

    # ----- acceso rápido -----
    @property
    def actual(self):
        return self.equipos[self.turno]

    @property
    def rival(self):
        return self.equipos[1 - self.turno]

    def terminado(self):
        return any(not e.vivos for e in self.equipos)

    def ganador(self):
        return next(e for e in self.equipos if e.vivos)

    def _tiene_jugada(self, l):
        return any(self._puede_base(l, k) for k in ("normal", "hab1", "hab2", "defender", "ulti"))

    def actor(self):
        """Quien juega ahora. El orden del equipo es fijo (1 → 2 → 3): cada acción pasa el turno al siguiente."""
        eq = self.actual
        vivos = [l for l in eq.vivos if not l.incapaz]
        muro = [l for l in vivos if l.forma]
        if muro:                    # con Mahoraga fuera, solo él actúa
            return muro[0] if self._tiene_jugada(muro[0]) else None
        n = len(eq.luchadores)
        for d in range(n):
            l = eq.luchadores[(eq.cursor + d) % n]
            if l in vivos and self._tiene_jugada(l):    # si le toca a alguien que no puede, se salta
                return l
        return None

    def disponibles(self):
        """El luchador al que le toca actuar (lista de 0 o 1)."""
        a = self.actor()
        return [a] if a else []

    # ----- inicio y fin de turno -----
    def _iniciar_turno(self):
        for _ in range(6):   # por seguridad: nunca queda en bucle
            eq = self.actual
            eq.cursor = 0           # cada turno empieza con el luchador 1
            for l in eq.vivos:
                l.guardia = False
            lineas = self._ticks(eq)
            if self.terminado():
                if lineas:
                    self.log += "\n" + "\n".join(lineas)
                return
            eq.medios = MEDIOS_POR_LUCHADOR * len(eq.vivos)
            for l in eq.vivos:
                l.pm = min(PM_MAX, l.pm + PM_REGEN)
            if not self.arranque_hecho:
                self.arranque_hecho = True
                eq.medios = min(eq.medios, ARRANQUE_MEDIOS)
            if lineas:
                self.log += "\n" + "\n".join(lineas)
            if self.disponibles():
                return
            self.log += f"\n⚡ Todo el equipo de **{eq.nombre}** no puede actuar (parálisis o sueño) y pierde el turno."
            self._decrementar(eq)
            self.turno = 1 - self.turno

    def _ticks(self, eq):
        out = []
        for l in eq.vivos:
            if l.forma:
                continue            # Mahoraga no sufre daño por efectos
            if "regen" in l.efectos and l.hp < l.max_hp:
                antes = l.hp
                l.hp = min(l.max_hp, l.hp + REGEN_CURA)
                out.append(f"💚 {l.tag} regenera **{l.hp - antes}**.")
            for nombre, dmg in (("quemadura", QUEMADURA_DMG), ("veneno", VENENO_DMG), ("sangrado", SANGRADO_DMG)):
                if nombre in l.efectos and l.vivo:
                    l.hp -= dmg
                    self._cargar(l, dmg, False)
                    out.append(f"{EFECTOS_TXT[nombre].split()[0]} {l.tag} sufre **{dmg}** de daño.")
                    if l.hp <= 0:
                        l.hp = 0
                        out.append(f"💀 **{l.tag}** cae.")
        return out

    def _terminar_forma(self, l, motivo):
        self._avisos.append(f"👹 **{l.d.get('forma_nombre', 'Mahoraga')}** desaparece ({motivo}): **{l.nombre}** vuelve.")
        l.forma = None
        l.forma_hp = 0
        l.forma_turnos = 0
        l.adaptado = None
        l.guardia = False

    def _volcar_avisos(self):
        if self._avisos:
            self.log += "\n" + "\n".join(self._avisos)
            self._avisos = []

    def _decrementar(self, eq):
        for l in eq.luchadores:
            if l.forma:
                l.forma_turnos -= 1
                if l.forma_turnos <= 0:
                    self._terminar_forma(l, "se acaba su tiempo")
            for dic in (l.efectos, l.bonos):
                for k in list(dic):
                    dic[k] -= 1
                    if dic[k] <= 0:
                        del dic[k]

    def _cerrar_turno(self):
        self._decrementar(self.actual)
        self.turno = 1 - self.turno
        self.ronda += 1
        self._iniciar_turno()
        self._volcar_avisos()
        if self.ronda == MS_RONDA and not self.terminado():
            self.log += "\n⚠️ **¡Muerte súbita!** El daño de todos sube un poco más en cada turno."
        if TRANSICION_GIF and not self.terminado():
            self.trans = {"titulo": "🔄 Cambio de turno", "desc": f"Turno de **{self.actual.nombre}**",
                          "gif": TRANSICION_GIF, "seg": TRANSICION_SEG, "color": 0x2C3E50}

    def terminar_turno(self):
        """Botón 'Terminar turno': el jugador cede los iconos que le quedan."""
        if self.terminado():
            return
        self._guardar_historial()
        self.anim = None
        self.trans = None
        self.log = f"⏭️ **{self.actual.nombre}** termina su turno."
        self._cerrar_turno()

    def abandonar(self, eq):
        for l in eq.luchadores:
            l.hp = 0

    def _guardar_historial(self):
        if not self.log or self.log.startswith("¡Comienza"):
            return
        txt = " · ".join(l.strip() for l in self.log.split("\n") if l.strip())
        if len(txt) > 170:
            txt = txt[:167] + "..."
        self.historial.append(txt)
        self.historial = self.historial[-HISTORIAL:]

    # ----- ÚLTI -----
    def _cargar(self, l, dmg, hecho):
        k = ULTI_HECHO if hecho else ULTI_RECIBIDO
        l.ulti = min(100.0, l.ulti + dmg * k)

    # ----- reglas de qué se puede hacer -----
    def puede(self, l, k):
        if self.terminado() or not l.vivo or l not in self.disponibles() or l not in self.actual.luchadores:
            return False
        return self._puede_base(l, k)

    def _puede_base(self, l, k):
        if k == "defender":
            return self.actual.medios >= COSTE_DEFENDER and not l.guardia and not l.forma
        m = l.mov(k)
        if m.get("no") or self.actual.medios < m["coste"]:
            return False
        if l.pm < m.get("pm", 0) or l.sombras < m.get("sombras", 0):
            return False
        if m["tipo"] == "cura" and (l.hojas < 1 or not self._heridos()):
            return False
        if m["tipo"] == "limpia" and (l.hojas < m.get("hojas", 1) or self._a_limpiar() is None):
            return False
        if k == "ulti" and l.ulti < 100:
            return False
        return True

    def objetivo_por_defecto(self):
        vivos = self.rival.blancos
        return min(vivos, key=lambda t: t.hp) if vivos else None

    # ----- apoyo de Mantis (curar y limpiar) -----
    def _heridos(self):
        """Compañeros vivos que no tienen la vida llena."""
        return [x for x in self.actual.vivos if x.hp < x.max_hp]

    def _a_limpiar(self):
        """Compañero al que Toque empático le sirve más (parálisis primero), o None si nadie lo necesita."""
        malos = [x for x in self.actual.vivos if any(e in x.efectos for e in ("paralisis", "quemadura", "veneno", "sangrado"))]
        if not malos:
            return None
        return max(malos, key=lambda x: ("paralisis" in x.efectos, len(x.efectos), -x.hp))

    def _cargar_cura(self, l, curado):
        l.ulti = min(100.0, l.ulti + curado * ULTI_HECHO * ULTI_CURA)

    def _apoyo(self, l, k, objetivo=None):
        m = l.mov(k)
        cab = f"{l.d['emoji']} **{l.tag}** usa **{m['nombre']}**"
        if m["tipo"] == "cura":
            n = min(l.hojas, HOJAS_MAX)
            l.hojas = 0
            cura = CURA_HOJAS[n]
            if n >= 3:
                objetivos = list(self.actual.vivos)
            else:
                if objetivo is not None and objetivo in self._heridos():
                    objetivos = [objetivo]      # el que eligió el jugador
                else:
                    objetivos = [min(self._heridos() or self.actual.vivos, key=lambda x: x.hp / x.max_hp)]
            lineas, total = [], 0
            for t in objetivos:
                antes = t.hp
                t.hp = min(t.max_hp, t.hp + cura)
                total += t.hp - antes
                lineas.append(f"{t.tag} +{t.hp - antes}")
            self._cargar_cura(l, total)
            self.log = f"{cab} con {n} 🍃.\n💚 Cura: " + ", ".join(lineas) + "."
        else:
            l.hojas -= m.get("hojas", 1)
            t = objetivo if (objetivo is not None and objetivo in self.actual.vivos and any(
                e in objetivo.efectos for e in ("paralisis", "quemadura", "veneno", "sangrado"))) else self._a_limpiar()
            quitados = [e for e in ("paralisis", "quemadura", "veneno", "sangrado") if e in t.efectos]
            for e in quitados:
                del t.efectos[e]
            self._cargar_cura(l, 10)
            self.log = (f"{cab} sobre **{t.tag}**.\n✨ Le quita: " + ", ".join(EFECTOS_TXT[e] for e in quitados) + ".")

    # ----- Josuke: sus golpes también curan -----
    def _es_curar_aliado(self, l, k, objetivo):
        m = l.mov(k)
        return (k in ("normal", "hab1", "hab2") and objetivo is not None and objetivo in self.actual.vivos
                and bool(m.get("sana") or m.get("regen")))

    def _curar_aliado(self, l, k, t):
        m = l.mov(k)
        cab = f"{l.d['emoji']} **{l.tag}** usa **{m['nombre']}** sobre **{t.tag}**"
        if m.get("sana"):
            antes = t.hp
            t.hp = min(t.max_hp, t.hp + m["sana"])
            self.log = f"{cab}.\n💚 {t.tag} +{t.hp - antes}."
            self._cargar_cura(l, t.hp - antes)
            if k == "normal":
                l.pm = min(PM_MAX, l.pm + PM_NORMAL)
        else:
            nombre, dur = m["regen"]
            t.efectos[nombre] = max(dur, t.efectos.get(nombre, 0))
            self.log = f"{cab}.\n{EFECTOS_TXT[nombre]} sobre {t.tag}."
            self._cargar_cura(l, REGEN_CURA * (dur - 1))

    # ----- ejecutar una acción -----
    def ejecutar(self, l, k, objetivo=None):
        if not self.puede(l, k):
            return False
        self._guardar_historial()
        self.anim = None
        self.trans = None
        eq = self.actual
        if k == "defender":
            eq.medios -= COSTE_DEFENDER
            l.guardia = True
            l.pm = min(PM_MAX, l.pm + PM_DEFENDER)
            self.log = (f"🛡️ **{l.tag}** se pone en guardia: recibirá la mitad del daño y quien lo golpee "
                        f"perderá 1 icono.")
        elif k == "ulti":
            eq.medios -= l.mov("ulti")["coste"]
            self._ulti(l, objetivo)
        elif l.mov(k)["tipo"] == "adapta":
            eq.medios -= l.mov(k)["coste"]
            l.guardia = True
            self.log = (f"🌀 **{l.tag}** se adapta: recibirá la mitad del daño, quien lo golpee perderá 1 icono "
                        f"y absorberá el primer efecto que le lancen.")
        elif l.mov(k)["tipo"] in ("cura", "limpia"):
            eq.medios -= l.mov(k)["coste"]
            self._apoyo(l, k, objetivo)
        elif self._es_curar_aliado(l, k, objetivo):
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            self._curar_aliado(l, k, objetivo)
        else:
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            l.sombras -= l.mov(k).get("sombras", 0)
            self._atacar(l, k, objetivo)
        self._volcar_avisos()
        if self.terminado():
            return True
        if l in eq.luchadores:
            eq.cursor = (eq.luchadores.index(l) + 1) % len(eq.luchadores)    # el turno pasa al siguiente del equipo
        if eq.medios <= 0 or not self.disponibles():
            self._cerrar_turno()
        return True

    def _prec(self, a, m):
        """Precisión real del movimiento (🧵 Fusionado la baja)."""
        return max(0.05, m["prec"] - (FUSION_PREC if "fusion" in a.efectos else 0))

    def _mult_sangre(self, a, t):
        """🩸 Frenesí: más daño contra rivales que sangran."""
        return FRENESI_MULT if ("frenesi" in a.bonos and "sangrado" in t.efectos) else 1.0

    def _mult_ataque(self, a):
        mult = 1.0 + MS_SUBE * max(0, self.ronda - MS_RONDA)
        if "furia" in a.bonos:
            mult *= FURIA_MULT
        if "debilidad" in a.efectos:
            mult *= DEBIL_MULT
        return mult

    def _golpear(self, t, dmg, atacante):
        """Aplica daño y carga las ÚLTIS. Devuelve el daño real."""
        dmg = max(1, round(dmg))
        if t.forma:     # el daño va a la vida de Mahoraga, no a la de Megumi
            dmg = min(dmg, t.forma_hp)
            t.forma_hp -= dmg
            self._cargar(atacante, dmg, True)
            self._cargar(t, dmg, False)
            if t.forma_hp <= 0:
                self._terminar_forma(t, "es derrotado")
            return dmg
        dmg = min(dmg, t.hp)
        t.hp -= dmg
        if SUENO_DESPIERTA:
            t.efectos.pop("sueno", None)
        self._cargar(atacante, dmg, True)
        self._cargar(t, dmg, False)
        return dmg

    def _aplicar_efecto(self, t, ef):
        nombre, dur, prob = ef
        if t.forma:     # Mahoraga es inmune... salvo que se adapte y se quede con el efecto
            if t.guardia and t.adaptado is None and t.vivo and random.random() < prob:
                t.adaptado = (nombre, dur)
                return f"🌀 **{t.tag}** se adapta y absorbe {EFECTOS_TXT[nombre]}."
            return ""
        if t.vivo and random.random() < prob:
            t.efectos[nombre] = max(dur, t.efectos.get(nombre, 0))
            if nombre == "enredado":
                t.efectos["debilidad"] = max(dur + 1, t.efectos.get("debilidad", 0))
                return f"{EFECTOS_TXT[nombre]} sobre {t.tag}: no puede actuar y luego quedará 💫 debilitado."
            return f"{EFECTOS_TXT[nombre]} sobre {t.tag}."
        return ""

    def _atacar(self, a, k, objetivo):
        eq = self.actual
        m = a.mov(k)
        t = objetivo if (objetivo is not None and objetivo.vivo and objetivo in self.rival.blancos) \
            else self.objetivo_por_defecto()
        cab = f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}** sobre **{t.tag}**"
        if m.get("bono"):
            a.bonos[m["bono"][0]] = max(m["bono"][1], a.bonos.get(m["bono"][0], 0))
            cab += f" y gana {BONOS_TXT[m['bono'][0]].split(' (')[0]}"
        if random.random() > self._prec(a, m):
            eq.medios = 0
            self.log = f"{cab}... ¡pero falla! 💨 **{eq.nombre} pierde todos sus turnos.**"
            return
        dmg = sum(random.randint(*m["dmg"]) for _ in range(m.get("golpes", 1))) * self._mult_ataque(a)
        notas = []
        rota = "guardia_rota" in t.efectos
        if rota:
            dmg *= ROTA_MULT
        sangra = "frenesi" in a.bonos and "sangrado" in t.efectos
        dmg *= self._mult_sangre(a, t)
        crit = False
        if t.guardia and not rota:
            dmg *= GUARDIA_MULT
            eq.medios = max(0, eq.medios - GUARDIA_PIERDE)
            notas.append(f"🛡️ **{t.tag}** resiste: daño a la mitad y {eq.nombre} pierde 1 icono.")
        else:
            if t.guardia and rota:
                notas.append(f"🛡️💔 La guardia de {t.tag} está rota y no lo protege.")
            if random.random() < PROB_CRIT + (VEL_CRIT if "velocidad" in a.bonos else 0):
                crit = True
                dmg *= CRIT_MULT
                eq.medios += m["coste"]
                notas.append("💥 ¡Crítico! **Turno extra**: la acción no gasta icono.")
        era_forma = bool(t.forma)
        real = self._golpear(t, dmg, a)
        if sangra and a.vivo:
            curado = min(FRENESI_CURA, a.max_hp - a.hp)
            a.hp += curado
            if curado:
                notas.append(f"🩸 **{a.tag}** recupera {curado} de vida.")
        if k == "normal" and a.pm < PM_MAX:
            a.pm = min(PM_MAX, a.pm + PM_NORMAL)
        if m.get("extra") and (t.hp > 0 or t.forma):      # daño eléctrico extra: no lo reduce la guardia
            extra = self._golpear(t, m["extra"], a)
            real += extra
            notas.append(f"⚡ +{extra} de daño eléctrico.")
        if m.get("sombra") and a.sombras < SOMBRAS_MAX:
            a.sombras += 1
            notas.append(f"🌑 {a.tag} gana una sombra ({a.sombras}/{SOMBRAS_MAX}).")
        if m.get("hoja"):
            a.ulti = min(100.0, a.ulti + ULTI_HOJA)
            if a.hojas < HOJAS_MAX:
                a.hojas = min(HOJAS_MAX, a.hojas + m["hoja"])
                notas.append(f"🍃 {a.tag} gana una hoja ({a.hojas}/{HOJAS_MAX}).")
        if t.hp <= 0 and not t.forma:
            notas.append(f"💀 **{t.tag}** cae.")
        elif t.hp > 0 and not (era_forma and not t.forma):
            if m.get("efecto"):
                notas.append(self._aplicar_efecto(t, m["efecto"]))
            if m.get("efecto_extra"):
                notas.append(self._aplicar_efecto(t, m["efecto_extra"]))
            if a.forma and a.adaptado:       # Mahoraga devuelve el efecto que absorbió
                nombre_ad, dur_ad = a.adaptado
                a.adaptado = None
                notas.append("🌀 " + self._aplicar_efecto(t, (nombre_ad, dur_ad, 1.0)))
        self.log = f"{cab} y causa **{real}** de daño" + (f" ({m['golpes']} golpes)." if m.get("golpes") else ".")
        notas = [n for n in notas if n]
        if notas:
            self.log += "\n" + "\n".join(notas)
        # animación: si el movimiento tiene su propio crit_gif (Megumi) solo sale con crítico;
        # si no, usa el del personaje y también sale con los golpes fuertes
        gif_mov = m.get("crit_gif")
        gif = gif_mov or a.d.get("crit_gif")
        if gif and (crit or (m["tipo"] == "fuerte" and not gif_mov)):
            self.anim = {"titulo": f"{a.d['emoji']} {m['nombre']}",
                         "desc": ("💥 ¡CRÍTICO!\n" if crit else "ゴゴゴゴ\n") + f"**{a.tag}**",
                         "gif": gif, "seg": SUSPENSO_SEG,
                         "color": 0xE74C3C if crit else a.d["color"]}

    def _ulti(self, a, objetivo):
        eq, rv = self.actual, self.rival
        u = a.mov("ulti")
        cab = f"💥 **{u['nombre']}** — {a.tag}. {u['grito']}"
        if u.get("gif"):
            self.anim = {"titulo": f"💥 {u['nombre']}", "desc": f"ゴゴゴゴゴゴゴ\n**{a.tag}** desata su ÚLTI",
                         "gif": u["gif"], "seg": ULTI_ANIM_SEG, "color": a.d["color"]}
        if u["tipo"] == "forma":
            a.forma = "mahoraga"
            a.forma_hp = MAHO_HP
            a.forma_turnos = MAHO_TURNOS
            a.sombras = 0
            a.guardia = False
            a.adaptado = None
            a.ulti = 0.0
            self.log = (f"{cab}\n👹 **{a.d.get('forma_nombre', 'Mahoraga')}** ({MAHO_HP} de vida) cubre al equipo {MAHO_TURNOS} turnos: "
                        f"solo él ataca y solo él recibe daño.")
            return
        if u["tipo"] == "equipo":
            lineas = []
            for l in eq.vivos:
                antes = l.hp
                l.hp = min(l.max_hp, l.hp + u["cura"])
                lineas.append(f"{l.tag} +{l.hp - antes}")
                if u.get("limpia"):
                    l.efectos.clear()
                if u.get("bono"):
                    l.bonos[u["bono"][0]] = u["bono"][1]
            txt = f"{cab}\n💚 Cura: " + ", ".join(lineas) + "."
            if u.get("limpia"):
                txt += "\n✨ Se limpian los efectos del equipo."
            if u.get("bono"):
                txt += f"\n{BONOS_TXT[u['bono'][0]]} durante {u['bono'][1]} turnos."
            self.log = txt
            a.ulti = 0.0
            return
        if u["tipo"] == "unico":
            t = objetivo if (objetivo is not None and objetivo.vivo and objetivo in rv.blancos) \
                else self.objetivo_por_defecto()
            dmg = sum(random.randint(*u["dmg"]) for _ in range(u.get("golpes", 1))) * self._mult_ataque(a) * self._mult_sangre(a, t)
            if "guardia_rota" in t.efectos:
                dmg *= ROTA_MULT
            real = self._golpear(t, dmg, a)
            self.log = f"{cab}\n💢 **{t.tag}** recibe **{real}** de daño."
            if t.hp <= 0:
                self.log += f"\n💀 **{t.tag}** cae."
            a.ulti = 0.0
            return
        if u["tipo"] == "crazy":
            lineas, notas = [], []
            for t in list(rv.blancos):
                dmg = sum(random.randint(*u["dmg"]) for _ in range(u["golpes"])) * self._mult_ataque(a)
                rota = "guardia_rota" in t.efectos
                if rota:
                    dmg *= ROTA_MULT
                elif t.guardia:
                    dmg *= GUARDIA_MULT
                real = self._golpear(t, dmg, a)
                lineas.append(f"{t.tag} -{real}")
                if t.hp <= 0:
                    notas.append(f"💀 **{t.tag}** cae.")
            curas, total = [], 0
            for t in eq.vivos:
                antes = t.hp
                t.hp = min(t.max_hp, t.hp + sum(random.randint(*u["cura"]) for _ in range(u["curas"])))
                total += t.hp - antes
                curas.append(f"{t.tag} +{t.hp - antes}")
            self._cargar_cura(a, total)
            self.log = f"{cab}\n💢 " + ", ".join(lineas) + ".\n💚 Cura: " + ", ".join(curas) + "."
            if notas:
                self.log += "\n" + "\n".join(notas)
            a.ulti = 0.0
            return
        if u["tipo"] == "sueno":
            notas = [self._aplicar_efecto(t, u["efecto"]) for t in rv.blancos]
            self.log = f"{cab}\n" + "\n".join(n for n in notas if n)
            a.ulti = 0.0
            return
        # ÚLTI de área: golpea a todo el equipo rival, siempre acierta y no hace crítico
        lineas, notas = [], []
        for n, t in enumerate(list(rv.blancos)):
            dmg = sum(random.randint(*u["dmg"]) for _ in range(u.get("golpes", 1))) * self._mult_ataque(a) * self._mult_sangre(a, t)
            rota = "guardia_rota" in t.efectos
            if rota:
                dmg *= ROTA_MULT
            elif t.guardia:
                dmg *= GUARDIA_MULT
            crit = u.get("primer_crit") and n == 0
            if crit:
                dmg *= CRIT_MULT
            real = self._golpear(t, dmg, a)
            lineas.append(f"{t.tag} -{real}" + (" 💥" if crit else ""))
            if t.hp <= 0:
                notas.append(f"💀 **{t.tag}** cae.")
            elif u.get("efecto"):
                notas.append(self._aplicar_efecto(t, u["efecto"]))
        if u.get("flota") and objetivo is not None and objetivo.vivo and objetivo in rv.blancos and not objetivo.forma:
            objetivo.efectos["paralisis"] = max(1, objetivo.efectos.get("paralisis", 0))
            notas.append(f"⚡ **{objetivo.tag}** queda flotando y perderá su próximo turno.")
        self.log = f"{cab}\n💢 " + ", ".join(lineas) + "."
        if u.get("bono"):
            a.bonos[u["bono"][0]] = max(u["bono"][1], a.bonos.get(u["bono"][0], 0))
            notas.append(f"{BONOS_TXT[u['bono'][0]].split(' (')[0]} durante {u['bono'][1]} turnos.")
        if u.get("devuelve"):
            eq.medios += u["devuelve"]
            notas.append("💥 ¡Primer golpe crítico! Recupera 1 icono.")
        notas = [n for n in notas if n]
        if notas:
            self.log += "\n" + "\n".join(notas)
        a.ulti = 0.0

    # ----- CPU -----
    def opciones(self):
        """Todas las jugadas posibles del equipo actual: lista de (luchador, clave, objetivo)."""
        rv = self.rival
        res = []
        for l in self.disponibles():
            for k in ("normal", "hab1", "hab2", "defender", "ulti"):
                if not self.puede(l, k):
                    continue
                if k == "defender" or (k != "ulti" and l.mov(k)["tipo"] in ("cura", "limpia", "adapta")):
                    res.append((l, k, None))
                elif k != "ulti" and (l.mov(k).get("sana") or l.mov(k).get("regen")):
                    res += [(l, k, t) for t in rv.blancos]
                    res += [(l, k, x) for x in self.actual.vivos
                            if (l.mov(k).get("sana") and x.hp < x.max_hp)
                            or (l.mov(k).get("regen") and "regen" not in x.efectos and x.hp < x.max_hp)]
                elif k == "ulti":
                    if l.mov("ulti").get("flota") or l.mov("ulti")["tipo"] == "unico":
                        res += [(l, k, t) for t in rv.blancos]
                    else:
                        res.append((l, k, None))
                else:
                    res += [(l, k, t) for t in rv.blancos]
        return res

    def valor(self, l, k, t):
        eq, rv = self.actual, self.rival
        if k == "defender":
            v = 3.0
            if l.hp < l.max_hp * 0.4:
                v += 8
            if any(e.ulti >= 100 for e in rv.vivos):
                v += 4
            return v / (COSTE_DEFENDER ** 0.8)
        m = l.mov(k)
        mult = self._mult_ataque(l)
        if k != "ulti" and t is not None and t in eq.luchadores:        # Josuke curando a un compañero
            falta = t.max_hp - t.hp
            real = min(m["sana"], falta) if m.get("sana") else min(REGEN_CURA * (m["regen"][1] - 1), falta) * 0.8
            v = real + (6 if t.hp < t.max_hp * 0.4 else 0)
            if m.get("pm"):
                v -= m["pm"] * 0.9
            if k == "normal" and l.pm < PM_MAX:
                v += 2
            return v / (m["coste"] ** 0.8)
        if m["tipo"] == "adapta":
            return (4 + (4 if l.forma_hp < MAHO_HP * 0.5 else 0)) / (m["coste"] ** 0.8)
        if m["tipo"] == "forma":
            return 40 / (m["coste"] ** 0.8)
        if m["tipo"] == "crazy":
            prom = sum(m["dmg"]) / 2 * m["golpes"] * mult
            v = sum(prom * (ROTA_MULT if "guardia_rota" in x.efectos else 1) + (20 if prom >= x.hp else 0) for x in rv.blancos)
            v += min(sum(m["cura"]) / 2 * m["curas"] * len(eq.vivos), sum(x.max_hp - x.hp for x in eq.vivos))
            return v / (m["coste"] ** 0.8)
        if m["tipo"] == "cura":
            n = min(l.hojas, HOJAS_MAX)
            objetivos = eq.vivos if n >= 3 else [min(self._heridos(), key=lambda x: x.hp / x.max_hp)]
            real = sum(min(CURA_HOJAS[n], x.max_hp - x.hp) for x in objetivos)
            v = real + (6 if any(x.hp < x.max_hp * 0.4 for x in objetivos) else 0)
            if n < 3 and real < CURA_HOJAS[n] * 0.8:
                v -= 4                  # no malgasta hojas en curar poco
            return v / (m["coste"] ** 0.8)
        if m["tipo"] == "limpia":
            t = self._a_limpiar()
            v = 5 + (12 if "paralisis" in t.efectos else 0) + 5 * sum(e in t.efectos for e in ("quemadura", "veneno", "sangrado"))
            return v / (m["coste"] ** 0.8)
        if k == "ulti":
            if m["tipo"] == "sueno":
                v = 14 * sum(1 for x in rv.vivos if not x.incapaz)
                return v / (m["coste"] ** 0.8)
            if m["tipo"] == "equipo":
                falta = sum(e.max_hp - e.hp for e in eq.vivos)
                v = min(m["cura"] * len(eq.vivos), falta) + 12 + 6 * sum(len(e.efectos) for e in eq.vivos)
            elif m["tipo"] == "unico":
                prom = (m["dmg"][0] + m["dmg"][1]) / 2 * mult * (ROTA_MULT if "guardia_rota" in t.efectos else 1)
                v = prom + (25 if prom >= t.hp else 0) + 8 * (1 - t.hp / t.max_hp)
            else:
                prom = (m["dmg"][0] + m["dmg"][1]) / 2 * mult * m.get("golpes", 1)
                v = 0
                for x in rv.blancos:
                    d = prom * (ROTA_MULT if "guardia_rota" in x.efectos else 1) * self._mult_sangre(l, x)
                    v += d + (20 if d >= x.hp else 0) + (6 if m.get("efecto") else 0)
                if m.get("flota") and t is not None:
                    v += 8
            return v / (m["coste"] ** 0.8)
        prom = (m["dmg"][0] + m["dmg"][1]) / 2 * mult * m.get("golpes", 1) * self._mult_sangre(l, t)
        rota = "guardia_rota" in t.efectos
        guard = t.guardia and not rota
        if rota:
            prom *= ROTA_MULT
        v = prom * self._prec(l, m) * (GUARDIA_MULT if guard else 1)
        if guard:
            v -= 6
        if prom >= t.hp:
            v += 25 * self._prec(l, m)
        ef = m.get("efecto")
        ex = m.get("efecto_extra")
        if ex and ex[0] not in t.efectos:
            v += 5 * ex[2]              # bajar la defensa ayuda a los demás
        if ef and ef[0] not in t.efectos:
            v += {"paralisis": 10, "quemadura": 8, "debilidad": 7, "guardia_rota": 9, "veneno": 8, "sueno": 10, "fusion": 8, "sangrado": 10, "enredado": 11}[ef[0]] * ef[2] * CPU_EFECTO_MULT
        v += 8 * (1 - t.hp / t.max_hp)
        v -= (1 - self._prec(l, m)) * max(0, eq.medios - m["coste"]) * 3
        if m.get("pm") and prom < t.hp:
            v -= m["pm"] * 0.9          # gastar PM tiene un precio: la CPU no los malgasta
        if m.get("sombras") and l.ulti >= 70:
            v -= 4 * m["sombras"]       # con la ÚLTI casi lista, guarda las sombras para Mahoraga
        if m.get("sombra") and l.sombras < SOMBRAS_MAX:
            v += 2                      # el normal de Megumi junta sombras
        if k == "normal" and l.pm < PM_MAX:
            v += 2                      # el normal recupera PM
        if m.get("hoja") and l.hojas < HOJAS_MAX:
            v += 2                      # el normal de Mantis junta hojas
        if m.get("bono") and m["bono"][0] not in l.bonos:
            v += {"furia": 10, "velocidad": 5, "frenesi": 7}.get(m["bono"][0], 5)   # preparar vale la pena
        return v / (m["coste"] ** 0.8)

    def jugada_cpu(self):
        ops = self.opciones()
        if not ops:
            return None
        if random.random() > self.inteligencia:
            return random.choice(ops)
        ult = getattr(self, "_ult_cpu", None)
        if ult is None:
            ult = self._ult_cpu = {}
        pts = []
        for o in ops:
            p = max(0.1, self.valor(*o))
            if o[1] == "ulti":
                p *= CPU_ULTI_MULT
            elif o[1] in ("hab1", "hab2"):
                p += CPU_HAB_BONO
            if ult.get(o[0].key) == o[1] and o[1] != "defender":
                p *= CPU_REPITE
            pts.append(p)
        if self.inteligencia >= 1.0:
            j = ops[pts.index(max(pts))]
        else:
            j = random.choices(ops, [p ** 3 for p in pts])[0]
        ult[j[0].key] = j[1]
        return j


