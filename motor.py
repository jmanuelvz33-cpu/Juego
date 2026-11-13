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
CLAVES = ("normal", "hab1", "hab2", "hab3", "hab4")   # las 4 habilidades + el ataque normal (hab3 y hab4 solo las tienen los personajes reworkeados)
NO_MOV = {"nombre": "—", "tipo": "normal", "coste": 99, "no": True}
LIMPIABLES = ("paralisis", "quemadura", "veneno", "sangrado", "congelado", "ciego")   # lo que quita el Toque empático de Mantis
HOJAS_MAX = 4           # 🍃 hojas máximas de Mantis (las gana con su ataque normal y las gasta con sus habilidades)
HOJAS_INICIAL = 4       # Mantis empieza la pelea con todas sus hojas
CURA_HOJAS = {1: 16, 2: 30, 3: 14, 4: 20}   # cura de Mantis según sus hojas: 1 = 16 a un aliado · 2 = 30 a un aliado · 3 = 14 a TODO el equipo · 4 = 20 a TODO el equipo
ANTENAS_MULT = 2.0      # ✨ Antenas afiladas (Mantis): su ataque normal hace el doble de daño (su normal es el más flojo del juego)
ANTENAS_HOJA = 1        # ... y gana 1 hoja extra
DIOSA_MULT = 1.15       # ⚡ Diosa del trueno (Ororo): su ataque normal golpea 2 veces y además hace +15% de daño
FUERZA_MULT = 1.15      # 💪 Fuerza (Reze): +15% de daño
CHISPAS = (0.4, 0.15)   # 🎆 Pirotecnia (Reze): las chispas hacen 40% del daño a los otros rivales y cada aliado tiene 15% de comérselas
RABIA_CRIT = 0.10       # 🩸 Rabia de sangre (Denji): +10% de probabilidad de crítico
BARRERA_HP = 24         # 🕸️ Barrera de hilos (Jolyne): vida propia de la barrera
BARRERA_DUR = 3         # ... dura hasta romperse o 3 turnos de su equipo
ROBO_ULTI = (25, 15)    # 🧵 Hilos ladrones (Jolyne): le quita 25 de ÚLTI al rival y ella se queda con 15
PEINADO_MULT = 1.5      # 💈 Peinarse el pelo (Josuke): sus curas valen +50%
CONTRA_ESCUDO = 0.5     # 💢 "¿Qué dijiste de mi cabello?": recibe la mitad del daño del primer golpe...
CONTRA_REFLEJO = 1.0    # parte del daño que devuelve (1.0 = entero)
CONTRA_CURA = 15        # ... se lo devuelve entero al atacante y cura 15 a un compañero al azar
GARUDA_REBOTE = 0.6     # ⚽ Pelota garuda (Yuki): el segundo rival recibe 60% del daño
LINEA_MAX = 3           # ⬛ Línea negra (Yuki): medidor propio, de 0 a 3
RAJIN_PARALISIS = 0.35   # ⚡ Rajin Sekein (Yoruichi): probabilidad de paralizar con cada golpe
RAJIN_DUR = 2            # turnos que dura (el resto del turno en que se activa + el siguiente)
BOLAS_CURA = 5           # 🔮 Bolas de reiatsu (Urahara): vida que recupera cada aliado
BOLAS_RELOJ = 3          # gajos que gana el reloj
BOLAS_ULTI = 10          # % de ÚLTI que gana
TRAMPA_GASTA = 2         # 🪤 Trampa (Urahara): gajos del reloj que gasta (no gasta todo)
PUNTERIA_PREC = 0.15     # 🎯 Puntería: +15% de precisión a todo el equipo
CONTROL_MULT = 1.5      # 🧲 Control metal: el rival controlado golpea con su ataque normal a +50% de daño
CONGELADO_MULT = 1.25   # ❄️ Congelado (Ororo): el luchador congelado recibe +25% de daño
VIENTO_ESQUIVA = 0.15   # 🌬️ Viento a favor (Ororo): +15% de esquiva a su equipo
ULTI_CURA = 0.4         # curar también carga la ÚLTI de quien cura (0.4 = 40% de lo que carga hacer daño)
ULTI_HOJA = 20          # % de ÚLTI que gana Mantis cada vez que su ataque normal acierta
ARENA_MAX = 4           # ⏳ medidor "reloj de arena" de Urahara (4 gajos). Mitad (2) = efecto de 2 turnos · lleno (4) = efecto potenciado
ARENA_NORMAL = 2        # gajos que gana con su ataque normal cuando acierta
ULTI_ARENA = 15         # % de ÚLTI que gana Urahara cada vez que su ataque normal acierta
REIATSU = {"reiatsu": (0.15, 0.15, 0.10),       # reserva espiritual normal (medio reloj): +15% daño · -15% daño recibido · +10% esquiva
           "reiatsu_max": (0.25, 0.25, 0.20)}   # reserva espiritual potenciada (reloj lleno): +25% · -25% · +20%
REIATSU_TURNOS = {"reiatsu": 2, "reiatsu_max": 3}
BANKAI_CRIT = 0.20      # 🌀 Bankai (Urahara): +20% de probabilidad de crítico a todo el equipo
BANKAI_ESQUIVA = 0.20   # 🌀 Bankai: +20% de esquiva a todo el equipo
BANKAI_TURNOS = 2
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
CPU_CONTRA = 0.35        # cuánto valora la CPU el Contraataque de Josuke (por punto de daño enemigo)
CPU_ROBO = 0.15          # cuánto valora la CPU robar ÚLTI (por punto)
CPU_BARRERA = 0.5        # cuánto valora la CPU la vida de una Barrera de hilos
CPU_POTENCIA = 0.75      # cuánto valora la CPU preparar un bono propio (Antenas afiladas, Diosa del trueno)
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
    "ciego": "🕶️ Ciego",           # solo lo causa Yuki: no ve el nombre ni el icono de sus habilidades
    "apagon": "🔌 Apagón",         # solo lo causa Reze: no puede usar su ataque normal en su próximo turno
    "congelado": "❄️ Congelado",   # solo lo causa la Ventisca de Ororo: no puede actuar y recibe +25% de daño
    "sueno": "💤 Sueño",          # solo lo causa la ÚLTI de Mantis: no puede actuar su próximo turno
    "fusion": "🧵 Fusionado",      # solo lo causa Josuke: el luchador baja su precisión
    "regen": "💚 Regeneración",   # solo lo da Josuke a un compañero: se cura al inicio de su turno
}
BONOS_TXT = {"furia": "🔺 Furia (+25% daño)", "velocidad": "💨 Velocidad (+25% crítico)",
             "frenesi": "🩸 Frenesí (+20% daño y roba vida a los que sangran)",
             "reiatsu": "🔷 Reiatsu (+15% daño, -15% daño recibido, +10% esquiva)",
             "reiatsu_max": "🔷 Reiatsu máximo (+25% daño, -25% daño recibido, +20% esquiva)",
             "bankai": "🌀 Bankai (+20% crítico y +20% esquiva)",
             "barrera": "🕸️ Barrera de hilos (absorbe daño)",
             "peinado": "💈 Peinado perfecto (sus curas valen +50%)",
             "contra": "💢 Contraataque (el próximo golpe que reciba se lo devuelve al atacante)",
             "fuerza": "💪 Fuerza (+15% de daño)",
             "rabia": "🩸 Rabia de sangre (+10% de probabilidad de crítico)",
             "antenas": "🌿 Antenas afiladas (su ataque normal hace el doble de daño y gana 1 hoja extra)",
             "diosa": "⚡ Diosa del trueno (su ataque normal golpea 2 veces y hace +15% de daño)",
             "viento": "🌬️ Viento a favor (+15% de esquiva)",
             "rajin": "⚡ Rajin Sekein (cada golpe tiene 35% de paralizar)",
             "punteria": "🎯 Puntería (+15% de precisión)"}

# ---------------- PERSONAJES ----------------
# "gif" = retrato · "crit_gif" = animación de golpe fuerte / crítico · "ulti_gif" = animación de la ÚLTI
# "victoria_img" = imagen de victoria. Déjalos "" hasta que tengas los links (el bot funciona igual).
# "emoji" puede ser un emoji normal o uno personalizado de tu servidor: <:nombre:ID>
PERSONAJES = {
    "jolyne": {
        "nombre": "Jolyne Kujo",
        "emoji": "<:emoji_15:1563289355601059991>",
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "", "hab1": "", "hab2": "", "hab3": "", "hab4": "", "defender": "", "ulti": "",
        },
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
            "hab2": {"nombre": "Deshilar", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (20, 27), "prec": 0.90, "desteje": True,
                     "desc": "Golpe medio. Deshila al rival: le arranca todos sus bonos (y su barrera) y le quita la guardia."},
            "hab3": {"nombre": "Barrera de hilos", "tipo": "barrera", "coste": COSTE_HABILIDAD, "pm": 3,
                     "barrera": BARRERA_HP,
                     "desc": "Elige a un compañero (o a ella): una barrera de hilos con 24 de vida propia absorbe el daño que le hagan. Dura hasta romperse o 3 turnos."},
            "hab4": {"nombre": "Hilos ladrones", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (4, 7), "prec": 0.85, "roba_ulti": ROBO_ULTI,
                     "desc": "Poco daño. Le roba 25% de ÚLTI al rival y ella se queda con 15%."},
        },
        "ulti": {"nombre": "Cinta de Möbius", "tipo": "equipo", "coste": COSTE_ULTI,
                 "cura": 15, "bono": ("furia", 2), "limpia": True,
                 "gif": "https://i.imgur.com/ggk68Y7.gif", "grito": "¡Su cuerpo se vuelve cinta!",   # <- gif = animación de la ÚLTI
                 "desc": "Cura 15 a todo el equipo, limpia sus efectos y sube su daño 25% durante 2 turnos."},
    },
    "reze": {
        "nombre": "Reze",
        "emoji": "<:emoji_17:1563289420923146321>",
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "", "hab1": "", "hab2": "", "hab3": "", "hab4": "", "defender": "", "ulti": "",
        },
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
            "hab2": {"nombre": "Explosión de cabeza", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (19, 25), "prec": 0.90, "bono_prob": ("fuerza", 2, 0.30),
                     "desc": "Golpe medio. 30% de ganar 💪 Fuerza: +15% de daño durante 2 turnos."},
            "hab3": {"nombre": "Pirotecnia", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (15, 20), "prec": 0.90, "chispas": CHISPAS,
                     "desc": "Ataca a un rival. Las chispas hacen 40% del daño a los otros rivales... y cada compañero tiene 15% de comérselas."},
            "hab4": {"nombre": "Apagón", "tipo": "apagon", "coste": COSTE_HABILIDAD, "pm": 4,
                     "desc": "Sin daño. Ningún rival puede usar su ataque normal en su próximo turno."},
        },
        "ulti": {"nombre": "Bomba total", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (12, 16), "efecto": ("quemadura", 2, 1.0),
                 "gif": "https://i.imgur.com/mn3GQl2.gif", "grito": "¡Todo el campo estalla!",
                 "desc": "Daño a todo el equipo rival y los deja ardiendo."},
    },
    "storm": {
        "nombre": "Storm",
        "emoji": "<:emoji_16:1563289388190924943>",
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "<:emoji_12:1570564519573463060>", "hab1": "<:emoji_13:1570564541518053407>", "hab2": "<:emoji_15:1570564593212854322>", "hab3": "<:emoji_14:1570564567157710999>", "hab4": "<:emoji_16:1570564617871298761>", "defender": "<:emoji_17:1570566283978870885>", "ulti": "<:emoji_18:1570566309274714155>",
        },
        "color": 0x5DADE2,
        "boton": "50B2CB",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "desc": "Ororo Munroe (X-Men). Clima y área: debilita, congela, protege con el viento y lanza tormentas a todo el equipo.",
        "gif": "https://i.imgur.com/y1z0rAi.jpeg",
        "crit_gif": "https://i.imgur.com/lneGV70.gif",
        "victoria_img": "https://i.imgur.com/zK9gwvM.jpeg",
        "mov": {
            "normal": {"nombre": "Rayo", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (8, 12), "prec": 0.95},
            "hab1": {"nombre": "Niebla helada", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (5, 8), "prec": 0.90, "efecto": ("debilidad", 2, 0.85),
                     "desc": "Poco daño. El rival hace 25% menos de daño durante 2 turnos (85%)."},
            "hab2": {"nombre": "Viento cortante", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (14, 19), "prec": 0.92, "bono_equipo": ("viento", 2),
                     "desc": "Golpe medio. Todo su equipo gana 🌬️ Viento a favor: +15% de esquiva durante 2 turnos."},
            "hab3": {"nombre": "Ventisca", "tipo": "ventisca", "coste": COSTE_HABILIDAD, "pm": 4,
                     "dmg": (12, 16), "prec": 0.92, "congela": 0.40,
                     "desc": "Daño a todos los rivales. 40% de ❄️ congelar a uno: pierde su próximo turno y recibe +25% de daño mientras esté congelado."},
            "hab4": {"nombre": "Diosa del trueno", "tipo": "potencia", "coste": COSTE_HABILIDAD, "pm": 3,
                     "bono": ("diosa", 2),
                     "desc": "Durante 2 turnos su ataque normal (Rayo) golpea 2 veces y hace +15% de daño."},
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
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "<:emoji_26:1570573182337949818>", "hab1": "<:emoji_31:1570573359203491941>", "hab2": "<:emoji_29:1570573275828986029>", "hab3": "<:emoji_30:1570573336201662704>", "hab4": "<:emoji_27:1570573204622155908>", "defender": "<:emoji_28:1570573225661042700>", "ulti": "<:emoji_32:1570573397560262899>",
        },
        "color": 0x8E44AD,
        "boton": "D2693C",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": VIDA,
        "linea": True,       # usa la ⬛ línea negra
        "desc": "Jujutsu Kaisen. Golpes pesados: carga su línea negra con Masa virtual y la gasta en patadas que pueden dejar ciego al rival.",
        "gif": "https://i.imgur.com/eJQK7p6.jpeg",            # <- retrato de Yuki
        "crit_gif": "https://i.imgur.com/lieBufC.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/KrjerJx.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Golpe de masa", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (9, 13), "prec": 0.93},
            "hab1": {"nombre": "Masa virtual", "tipo": "estado", "coste": COSTE_NORMAL, "pm": 1,
                     "dmg": (6, 9), "prec": 0.93, "linea": 1,
                     "desc": "Cuesta medio icono. Poco daño y, si acierta, sube 1 punto su ⬛ línea negra (máx. 3), que potencia su Doble patada."},
            "hab2": {"nombre": "Pelota garuda", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (15, 20), "prec": 0.85, "estampa": GARUDA_REBOTE, "doble_txt": "Lanzar contra…",
                     "desc": "Golpea a un rival y después lanzas la pelota contra otro que tú eliges (ese recibe 60% del daño)."},
            "hab3": {"nombre": "Doble patada", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (10, 13), "prec": 0.90, "patadas": True,
                     "desc": "Dos patadas y gasta la ⬛ línea negra. Con la línea en 2 el segundo golpe deja 🕶️ ciego al rival (no ve sus habilidades en su próximo turno). Con la línea llena (3) son tres patadas."},
            "hab4": {"nombre": "Apuñalada", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (12, 16), "prec": 0.90, "efecto": ("sangrado", 2, 0.80),
                     "desc": "Apuñala al rival y lo deja 🩸 sangrando (80%)."},
        },
        "ulti": {"nombre": "Furia estelar", "tipo": "unico", "coste": COSTE_ULTI,
                 "dmg": (55, 70),
                 "gif": "https://i.imgur.com/Yd9kdug.gif", "grito": "¡La masa virtual lo aplasta todo!",
                 "desc": "Golpe enorme a un solo objetivo. Ignora la guardia y siempre acierta."},
    },
    "yoruichi": {
        "nombre": "Yoruichi Shihōin",
        "emoji": "<:emoji_22:1563551448124362782>",
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "<:emoji_34:1570598791512326216>", "hab1": "<:emoji_38:1570599005728145418>", "hab2": "<:emoji_35:1570598850182254602>", "hab3": "<:emoji_33:1570598727985528983>", "hab4": "<:emoji_37:1570598985494691931>", "defender": "<:emoji_39:1570599030151712778>", "ulti": "<:emoji_36:1570598867265912892>",
        },
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
            "hab2": {"nombre": "Shunko", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (16, 21), "prec": 0.90, "efecto": ("paralisis", 1, 0.35),
                     "desc": "Golpe de rayo. 35% de paralizar al rival."},
            "hab3": {"nombre": "Paso de clones", "tipo": "clones", "coste": COSTE_HABILIDAD, "pm": 5,
                     "dmg": (7, 9), "prec": 0.93, "bono": ("velocidad", 2), "doble_txt": "Luego, a…",
                     "desc": "Corre tan rápido que deja clones: golpea a un rival, luego a otro y por último a todos. Poco daño por golpe, cuesta muchos PM. Después gana 💨 Velocidad (2 turnos)."},
            "hab4": {"nombre": "Rajin Sekein", "tipo": "potencia", "coste": COSTE_NORMAL, "pm": 2,
                     "requiere_bono": "velocidad", "bono": ("rajin", RAJIN_DUR),
                     "desc": "Solo con 💨 Velocidad. Toma su forma con orejas y cola: 2 turnos en los que cada golpe suyo tiene 35% de paralizar."},
        },
        "ulti": {"nombre": "Destello de los 3 pasos", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (11, 15), "primer_crit": True, "devuelve": 2,
                 "gif": "https://i.imgur.com/KdHPmQW.gif", "grito": "¡Tres pasos, tres golpes!",
                 "desc": "Daño a todo el equipo rival; el primer golpe es crítico y recupera 1 icono."},
    },
    "megumi": {
        "nombre": "Megumi Fushiguro",
        "emoji": "<:emoji_26:1565487546916409364>",     # <- pon aquí tu emoji de Megumi: <:nombre:ID>
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "<:emoji_2:1570617119035629628>", "hab1": "<:emoji_1:1570617093122957322>", "hab2": "<:emoji_5:1570617189717778585>", "hab3": "<:emoji_4:1570617166678720642>", "hab4": "<:emoji_3:1570617138580951122>", "defender": "<:emoji_6:1570617211859505292>", "ulti": "<:emoji_7:1570617236908019804>",
        },
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
            "hab3": {"nombre": "Conejos", "tipo": "conejos", "coste": COSTE_HABILIDAD, "sombras": 1,
                     "dmg": (4, 6), "golpes": 3, "prec": 0.92,
                     "dmg_todos": (5, 8), "efecto_todos": ("debilidad", 1, 0.35), "doble_txt": "Conejos…",
                     "desc": "Cuesta 1 🌑. Eliges: solo a un rival (3 mordiscos seguidos) o a todos (1 mordisco a cada uno, con 35% de debilitarlos)."},
            "hab4": {"nombre": "Serpiente", "tipo": "estado", "coste": COSTE_HABILIDAD, "sombras": 1,
                     "dmg": (8, 12), "prec": 0.90, "efecto": ("veneno", 3, 0.90),
                     "desc": "Cuesta 1 🌑. La serpiente muerde y deja ☠️ veneno 3 turnos (90%)."},
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
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "", "hab1": "", "hab2": "", "hab3": "", "hab4": "", "defender": "", "ulti": "",
        },
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
            "hab3": {"nombre": "Peinarse el pelo", "tipo": "potencia", "coste": COSTE_NORMAL, "pm": 2,
                     "bono": ("peinado", 3),
                     "desc": "Cuesta medio icono. Durante 3 turnos todas sus curas valen +50%."},
            "hab4": {"nombre": "¿Qué dijiste de mi cabello?", "tipo": "potencia", "coste": COSTE_HABILIDAD, "pm": 3,
                     "bono": ("contra", 2),
                     "desc": "Se prepara: el próximo golpe que reciba le hace la mitad de daño, se lo devuelve entero al atacante y cura 15 a un compañero al azar."},
        },
        "ulti": {"nombre": "Crazy Diamond: ¡DORARARARA!", "tipo": "crazy", "coste": COSTE_ULTI,
                 "dmg": (4, 6), "golpes": 3, "cura": (4, 6), "curas": 3,
                 "gif": "https://i.imgur.com/44WtlIH.gif", "grito": "¡Dorarararararara!",
                 "desc": "Golpea 3 veces a cada rival y cura 3 veces a cada compañero. Siempre acierta."},
    },
    "denji": {
        "nombre": "Denji",
        "emoji": "<:emoji_25:1565152531364053062>",     # <- pon aquí tu emoji de Denji: <:nombre:ID>
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "", "hab1": "", "hab2": "", "hab3": "", "hab4": "", "defender": "", "ulti": "",
        },
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
            "hab3": {"nombre": "Cuerda de motosierra", "tipo": "estado", "coste": COSTE_HABILIDAD, "pm": 3,
                     "dmg": (13, 17), "prec": 0.90, "estampa": True, "doble_txt": "Estampar contra…",
                     "desc": "Agarra a un rival con una cuerda y tú eliges a otro: lo estampa contra él y ambos sufren daño."},
            "hab4": {"nombre": "Rabia de sangre", "tipo": "potencia", "coste": COSTE_NORMAL, "pm": 3,
                     "bono": ("rabia", 3), "requiere": "sangrado", "cura_propia": 8,
                     "desc": "Solo si algún rival sangra. Se cura un poco y gana +10% de probabilidad de crítico durante 3 turnos."},
        },
        "ulti": {"nombre": "Hombre Motosierra", "tipo": "area", "coste": COSTE_ULTI,
                 "dmg": (3, 5), "golpes": 3, "efecto": ("sangrado", 3, 1.0), "bono": ("frenesi", 2),
                 "gif": "https://i.imgur.com/NdpROYz.gif", "grito": "¡Las motosierras salen de todo su cuerpo!",
                 "desc": "3 cortes a todo el equipo rival, todos quedan 🩸 sangrando. Denji gana Frenesí 2 turnos."},
    },
    "mantis": {

        "nombre": "Mantis",
        "emoji": "<:emoji_23:1564807292795224146>",     # <- pon aquí tu emoji de Mantis: <:nombre:ID>
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "<:emoji_19:1570568581786370219>", "hab1": "<:emoji_20:1570568616410218588>", "hab2": "<:emoji_21:1570568647817166989>", "hab3": "<:emoji_22:1570568681254027435>", "hab4": "<:emoji_25:1570569019092893807>", "defender": "<:emoji_23:1570568712887607388>", "ulti": "<:emoji_24:1570568750443266068>",
        },
        "color": 0x27AE60,
        "boton": "30C57B",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": 125,        # menos vida que el resto (130): hay que protegerla
        "hojas": True,      # usa 🍃 hojas (las gana con el ataque normal)
        "desc": "Guardianes de la Galaxia (Marvel). Apoyo y control: empieza con 4 hojas, cura, controla la mente del rival y su ÚLTI duerme al equipo.",
        "gif": "https://i.imgur.com/arZOwk3.jpeg",            # <- retrato de Mantis
        "crit_gif": "https://i.imgur.com/4rDkOAu.gif",       # <- animación de golpe fuerte / crítico
        "victoria_img": "https://i.imgur.com/pD8UBHP.jpeg",   # <- imagen de victoria
        "mov": {
            "normal": {"nombre": "Golpe de antena", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (6, 9), "prec": 0.97, "hoja": 1,
                       "desc": "Poco daño. Si acierta, gana 1 🍃 hoja (máximo 3)."},
            "hab1": {"nombre": "Sanar", "tipo": "cura", "coste": COSTE_HABILIDAD,
                     "desc": "Gasta todas sus 🍃 hojas. Elige a quién curar en el menú de objetivos. 1 hoja: cura 16 · 2 hojas: cura 30 · 3 hojas: cura 14 a todo el equipo · 4 hojas: cura 20 a todo el equipo."},
            "hab2": {"nombre": "Toque empático", "tipo": "limpia", "coste": COSTE_HABILIDAD, "hojas": 1,
                     "desc": "Gasta 1 🍃 hoja. Le quita la quemadura, el veneno, el sangrado, la parálisis o el hielo al compañero que elijas."},
            "hab3": {"nombre": "Control metal", "tipo": "estado", "coste": COSTE_HABILIDAD, "hojas": 2,
                     "dmg": (4, 7), "prec": 0.92, "control": True,
                     "desc": "Gasta 2 🍃 hojas. Golpea a un rival y toma el control de su mente: ataca a sus compañeros. Si está solo se ataca a sí mismo (si es curandero, cura a tu equipo)."},
            "hab4": {"nombre": "Antenas afiladas", "tipo": "potencia", "coste": COSTE_NORMAL, "hojas": 1,
                     "bono": ("antenas", 3),
                     "desc": "Cuesta medio icono y 1 🍃 hoja. Durante 3 turnos su Golpe de antena hace el doble de daño y gana 1 hoja extra."},
        },
        "ulti": {"nombre": "Sueño profundo", "tipo": "sueno", "coste": COSTE_ULTI,
                 "efecto": ("sueno", 1, 1.0),
                 "gif": "https://i.imgur.com/FN5ttuM.gif", "grito": "¡Sus antenas brillan y todos se duermen!",
                 "desc": "Duerme a todo el equipo rival: no puede actuar en su próximo turno. Siempre acierta."},
    },
    "urahara": {
        "nombre": "Kisuke Urahara",
        "emoji": "<:emoji_27:1569682511859294321>",     # <- pon aquí tu emoji de Urahara: <:nombre:ID>
        "emojis": {   # emoji de cada botón (Discord): "<:nombre:ID>". Vacío = emoji por defecto
            "normal": "<:emoji_41:1570604789207932980>", "hab1": "<:emoji_44:1570605500008104038>", "hab2": "<:emoji_45:1570605595751350333>", "hab3": "<:emoji_42:1570605056951324672>", "hab4": "<:emoji_43:1570605450632634449>", "defender": "<:emoji_40:1570604768814956666>", "ulti": "<:emoji_46:1570605660100628660>",
        },
        "color": 0x2E8B6E,
        "boton": "30C57B",   # color de sus botones: azul, verde, rojo o gris (Discord solo permite esos 4)
        "vida": 125,
        "arena": True,      # usa el medidor ⏳ reloj de arena en vez de PM
        "desc": "Bleach. Apoyo táctico: su bastón llena el reloj y con él refuerza al equipo o debilita la defensa rival; su Bankai los vuelve difíciles de tocar.",
        "gif": "https://i.imgur.com/flTYzPY.jpeg",            # <- retrato de Urahara (o sube img/urahara_normal.png)
        "crit_gif": "https://i.imgur.com/kTBD5Pi.gif",
        "victoria_img": "",
        "mov": {
            "normal": {"nombre": "Golpe de bastón", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (6, 9), "prec": 0.97, "reloj": ARENA_NORMAL,
                       "desc": "Poco daño. Si acierta, el ⏳ reloj de arena gana 2 gajos (máx. 4) y la ÚLTI un poco."},
            "hab1": {"nombre": "Gigai explosivo", "tipo": "reserva", "coste": COSTE_HABILIDAD, "arena": 2,
                     "desc": "Gasta todo el ⏳ reloj (mínimo 2 gajos). Estalla un gigai portátil y todo el equipo gana 🔷 Reiatsu: más daño, menos daño recibido y más esquiva. Medio reloj: 2 turnos · reloj lleno: 3 turnos y efectos mayores."},
            "hab2": {"nombre": "Red de Benihime", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "arena": 2,
                     "dmg": (14, 19), "prec": 0.90, "efecto": ("guardia_rota", 2, 1.0),
                     "desc": "Gasta todo el ⏳ reloj (mínimo 2 gajos). Golpea y deja al rival con 🛡️ Guardia rota 2 turnos. Con el reloj lleno se la aplica a todos los rivales."},
            "hab3": {"nombre": "Bolas de reiatsu", "tipo": "bolas", "coste": COSTE_HABILIDAD,
                     "dmg": (5, 7), "prec": 0.95, "cura": BOLAS_CURA,
                     "desc": "Lanza bolas de energía espiritual: poco daño a un rival, cura un poquito a todo el equipo y el ⏳ reloj gana 3 gajos y la ÚLTI un poco."},
            "hab4": {"nombre": "Trampa de Kisuke", "tipo": "trampa", "coste": COSTE_NORMAL, "arena": TRAMPA_GASTA,
                     "dmg_todos": (7, 10), "prec": 0.92,
                     "desc": "Gasta 2 gajos del ⏳ reloj. Una trampa hiere un poco a todos los rivales y todo el equipo gana 🎯 Puntería (+15% de precisión) 2 turnos."},
        },
        "ulti": {"nombre": "Bankai: Kannonbiraki Benihime Aratame", "tipo": "bankai", "coste": COSTE_ULTI,
                 "gif": "", "grito": "¡Bankai! La realidad se dobla a su favor.",
                 "desc": "Todo el equipo gana 🌀 Bankai 2 turnos: +20% de crítico y +20% de esquiva."},
    },
    # ---- Personaje SOLO del modo historia: no sale en la selección de equipo ----
    "esbirro": {
        "nombre": "Esbirro de Dio",
        "emoji": "🧛",
        "color": 0x8B1A2B,
        "boton": "8E292C",
        "oculto": True,      # no se puede elegir ni sale de rival al azar
        "vida": 170,         # pelea 2 contra 1 (probado: el jugador gana ~90% con juego normal)
        "desc": "Vampiro al servicio de Dio. Solo historia.",
        "gif": "",           # retrato: img/esbirro_normal.png
        "crit_gif": "",
        "victoria_img": "",
        "mov": {
            "normal": {"nombre": "Zarpazo", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (11, 15), "prec": 0.95},
            "hab1": {"nombre": "Sed de sangre", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (22, 28), "prec": 0.90, "drena": 0.5,
                     "desc": "Muerde a un rival y recupera la mitad del daño en vida."},
            "hab2": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
        },
        "ulti": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
    },
    "lagarto": {
        "nombre": "Lagarto zombie",
        "emoji": "🦎",
        "color": 0x5E7A3A,
        "boton": "5E7A3A",
        "oculto": True,
        "vida": 85,
        "desc": "Lagarto podrido que vaga por el bosque. Solo historia.",
        "gif": "",           # retrato: img_historia/lagarto_normal.png
        "crit_gif": "",
        "victoria_img": "",
        "mov": {
            "normal": {"nombre": "Garra podrida", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (7, 10), "prec": 0.95},
            "hab1": {"nombre": "Mordida infecta", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (12, 16), "prec": 0.90, "efecto": ("veneno", 2, 0.60),
                     "desc": "Muerde y puede envenenar."},
            "hab2": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
        },
        "ulti": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
    },
    "lobo": {
        "nombre": "Lobo salvaje",
        "emoji": "🐺",
        "color": 0x6B6F78,
        "boton": "6B6F78",
        "oculto": True,
        "vida": 70,
        "desc": "Lobo hambriento del bosque. Solo historia.",
        "gif": "",           # retrato: img_historia/lobo_normal.png
        "crit_gif": "",
        "victoria_img": "",
        "mov": {
            "normal": {"nombre": "Mordisco", "tipo": "normal", "coste": COSTE_NORMAL,
                       "dmg": (8, 11), "prec": 0.95},
            "hab1": {"nombre": "Embestida", "tipo": "fuerte", "coste": COSTE_HABILIDAD, "pm": 2,
                     "dmg": (15, 20), "prec": 0.90,
                     "desc": "Se lanza con todo su peso."},
            "hab2": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
        },
        "ulti": {"nombre": "—", "tipo": "normal", "coste": 99, "no": True},
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
        self.hojas = HOJAS_INICIAL if self.d.get("hojas") else 0        # 🍃 solo las usa Mantis (empieza con todas)
        self.arena = 0        # ⏳ solo lo usa Urahara (reloj de arena)
        self.sombras = SOMBRAS_INICIAL if self.d.get("sombras") else 0   # 🌑 solo las usa Megumi
        self.forma = None     # "mahoraga" mientras Megumi está transformado
        self.forma_hp = 0
        self.forma_turnos = 0
        self.adaptado = None  # efecto que Mahoraga absorbió con Adaptación (nombre, duración)
        self.barrera = 0      # 🕸️ vida que le queda a su Barrera de hilos
        self.linea = 0        # ⬛ línea negra de Yuki (0 a LINEA_MAX)

    @property
    def incapaz(self):
        """No puede actuar: paralizado, dormido, enredado o congelado."""
        return any(e in self.efectos for e in ("paralisis", "sueno", "enredado", "congelado"))

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
            return self.d["forma_mov"].get(k, NO_MOV)
        if k == "ulti":
            alt = self.d.get("ulti_alt")
            if alt and self.sombras >= SOMBRAS_MAX:
                return alt          # con el medidor lleno la ÚLTI es Mahoraga
            return self.d["ulti"]
        return self.d["mov"].get(k, NO_MOV)


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
        return any(self._puede_base(l, k) for k in CLAVES + ("defender", "ulti"))

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
            if l.barrera and "barrera" not in l.bonos:
                l.barrera = 0

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
        if k == "normal" and "apagon" in l.efectos:
            return False                                  # 🔌 Apagón: sin ataque normal
        if m.get("requiere_bono") and m["requiere_bono"] not in l.bonos:
            return False                                  # Rajin Sekein: solo con Velocidad
        if m.get("requiere") == "sangrado" and not any("sangrado" in x.efectos for x in self.rival.vivos):
            return False                                  # Rabia de sangre: solo si algún rival sangra
        if l.pm < m.get("pm", 0) or l.sombras < m.get("sombras", 0):
            return False
        if l.arena < m.get("arena", 0) or l.hojas < m.get("hojas", 0):
            return False
        if m["tipo"] == "cura" and (l.hojas < 1 or not self._heridos()):
            return False
        if m["tipo"] == "limpia" and (l.hojas < m.get("hojas", 1) or self._a_limpiar() is None):
            return False
        if m["tipo"] == "barrera" and self._a_barrera() is None:
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
        malos = [x for x in self.actual.vivos if any(e in x.efectos for e in LIMPIABLES)]
        if not malos:
            return None
        return max(malos, key=lambda x: ("paralisis" in x.efectos, len(x.efectos), -x.hp))

    def _a_barrera(self):
        """Compañero que más necesita una Barrera de hilos (el que no tiene una y está más herido), o None."""
        cand = [x for x in self.actual.vivos if not x.forma and "barrera" not in x.bonos]
        return min(cand, key=lambda x: x.hp / x.max_hp) if cand else None

    def _mult_cura(self, l):
        """💈 Peinarse el pelo: las curas de Josuke valen más."""
        return PEINADO_MULT if "peinado" in l.bonos else 1.0

    def _mismo_equipo(self, a, b):
        return any(a in e.luchadores and b in e.luchadores for e in self.equipos)

    def _cargar_cura(self, l, curado):
        l.ulti = min(100.0, l.ulti + curado * ULTI_HECHO * ULTI_CURA)

    def _apoyo(self, l, k, objetivo=None):
        m = l.mov(k)
        cab = f"{l.d['emoji']} **{l.tag}** usa **{m['nombre']}**"
        if m["tipo"] == "potencia":          # se da un bono a sí mismo (Antenas afiladas, Diosa del trueno)
            l.hojas -= m.get("hojas", 0)
            nombre, dur = m["bono"]
            l.bonos[nombre] = max(dur, l.bonos.get(nombre, 0))
            self.log = f"{cab}.\n{BONOS_TXT[nombre]} durante {dur} turnos."
            if m.get("cura_propia"):
                curado = min(m["cura_propia"], l.max_hp - l.hp)
                l.hp += curado
                if curado:
                    self.log += f"\n🩸 **{l.tag}** recupera {curado} de vida."
            return
        if m["tipo"] == "linea":             # ⬛ Masa virtual: sube la línea negra
            antes = l.linea
            l.linea = min(LINEA_MAX, l.linea + m["linea"])
            self.log = f"{cab}.\n⬛ Línea negra: {'⬛' * l.linea}{'⬜' * (LINEA_MAX - l.linea)} ({l.linea}/{LINEA_MAX})" + (" · ¡llena!" if l.linea >= LINEA_MAX else "")
            return
        if m["tipo"] == "barrera":           # 🕸️ Barrera de hilos sobre un compañero
            t = objetivo if (objetivo is not None and objetivo in self.actual.vivos and not objetivo.forma) else self._a_barrera()
            t.barrera = m["barrera"]
            t.bonos["barrera"] = max(BARRERA_DUR, t.bonos.get("barrera", 0))
            self.log = f"{cab} sobre **{t.tag}**.\n🕸️ Barrera de hilos: absorbe hasta {t.barrera} de daño (máx. {BARRERA_DUR} turnos)."
            return
        if m["tipo"] == "reserva":
            lleno = l.arena >= ARENA_MAX
            nombre = "reiatsu_max" if lleno else "reiatsu"
            dur = REIATSU_TURNOS[nombre]
            l.arena = 0
            for x in self.actual.vivos:
                x.bonos.pop("reiatsu", None)
                x.bonos.pop("reiatsu_max", None)
                x.bonos[nombre] = dur
            l.ulti = min(100.0, l.ulti + 20)
            self.log = (f"{cab}{' con el reloj LLENO' if lleno else ''}.\n{BONOS_TXT[nombre]} para todo el equipo durante {dur} turnos.")
            return
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
                e in objetivo.efectos for e in LIMPIABLES)) else self._a_limpiar()
            quitados = [e for e in LIMPIABLES if e in t.efectos]
            for e in quitados:
                del t.efectos[e]
            self._cargar_cura(l, 10)
            self.log = (f"{cab} sobre **{t.tag}**.\n✨ Le quita: " + ", ".join(EFECTOS_TXT[e] for e in quitados) + ".")

    # ----- Josuke: sus golpes también curan -----
    def _es_curar_aliado(self, l, k, objetivo):
        m = l.mov(k)
        return (k in CLAVES and objetivo is not None and objetivo in self.actual.vivos
                and bool(m.get("sana") or m.get("regen")))

    def _curar_aliado(self, l, k, t):
        m = l.mov(k)
        cab = f"{l.d['emoji']} **{l.tag}** usa **{m['nombre']}** sobre **{t.tag}**"
        if m.get("sana"):
            antes = t.hp
            t.hp = min(t.max_hp, t.hp + round(m["sana"] * self._mult_cura(l)))
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
    def ejecutar(self, l, k, objetivo=None, objetivo2=None):
        if not self.puede(l, k):
            return False
        self._obj2 = objetivo2
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
        elif l.mov(k)["tipo"] in ("cura", "limpia", "reserva", "potencia", "barrera", "linea"):
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            self._apoyo(l, k, objetivo)
        elif l.mov(k)["tipo"] == "clones":
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            self._clones(l, k, objetivo)
        elif l.mov(k)["tipo"] == "bolas":
            eq.medios -= l.mov(k)["coste"]
            self._bolas(l, k, objetivo)
        elif l.mov(k)["tipo"] == "trampa":
            eq.medios -= l.mov(k)["coste"]
            l.arena -= TRAMPA_GASTA
            self._trampa(l, k)
        elif l.mov(k)["tipo"] == "ventisca":
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            self._ventisca(l, k)
        elif l.mov(k)["tipo"] == "apagon":
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            self._apagon(l, k)
        elif l.mov(k)["tipo"] == "conejos" and (objetivo2 == -1 or (objetivo2 is None and len(self.rival.blancos) >= 2)):
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            l.sombras -= l.mov(k).get("sombras", 0)
            self._conejos(l, k)
        elif self._es_curar_aliado(l, k, objetivo):
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            self._curar_aliado(l, k, objetivo)
        else:
            eq.medios -= l.mov(k)["coste"]
            l.pm -= l.mov(k).get("pm", 0)
            l.sombras -= l.mov(k).get("sombras", 0)
            l.hojas -= l.mov(k).get("hojas", 0)
            self._atacar(l, k, objetivo)
        self._volcar_avisos()
        if self.terminado():
            return True
        if l in eq.luchadores:
            eq.cursor = (eq.luchadores.index(l) + 1) % len(eq.luchadores)    # el turno pasa al siguiente del equipo
        if eq.medios <= 0 or not self.disponibles():
            self._cerrar_turno()
        return True

    def _prec(self, a, m, t=None):
        """Precisión real del movimiento (🧵 Fusionado y la esquiva del objetivo la bajan)."""
        return min(1.0, max(0.05, m["prec"] + (PUNTERIA_PREC if "punteria" in a.bonos else 0)
                            - (FUSION_PREC if "fusion" in a.efectos else 0) - self._esquiva(t)))

    def _mult_sangre(self, a, t):
        """🩸 Frenesí: más daño contra rivales que sangran."""
        return FRENESI_MULT if ("frenesi" in a.bonos and "sangrado" in t.efectos) else 1.0

    def _mult_ataque(self, a):
        mult = 1.0 + MS_SUBE * max(0, self.ronda - MS_RONDA)
        if "furia" in a.bonos:
            mult *= FURIA_MULT
        if "fuerza" in a.bonos:
            mult *= FUERZA_MULT
        if "debilidad" in a.efectos:
            mult *= DEBIL_MULT
        for r in ("reiatsu_max", "reiatsu"):
            if r in a.bonos:
                mult *= 1 + REIATSU[r][0]
                break
        return mult

    def _esquiva(self, t):
        """Probabilidad extra de que un ataque contra t falle (Reiatsu y Bankai)."""
        e = 0.0
        if t is None:
            return e
        for r in ("reiatsu_max", "reiatsu"):
            if r in t.bonos:
                e += REIATSU[r][2]
                break
        if "bankai" in t.bonos:
            e += BANKAI_ESQUIVA
        if "viento" in t.bonos:
            e += VIENTO_ESQUIVA
        return e

    def _mult_normal(self, a):
        """Antenas afiladas (Mantis) y Diosa del trueno (Ororo): el ataque normal pega más fuerte."""
        return (ANTENAS_MULT if "antenas" in a.bonos else 1.0) * (DIOSA_MULT if "diosa" in a.bonos else 1.0)

    def _golpes(self, a, m, k):
        """Golpes de un movimiento (la Diosa del trueno de Ororo duplica los de su ataque normal)."""
        if m.get("patadas"):                 # Doble patada de Yuki: con la línea negra llena es triple
            return 3 if a.linea >= LINEA_MAX else 2
        return m.get("golpes", 1) * (2 if (k == "normal" and "diosa" in a.bonos) else 1)

    def _mult_defensa(self, t):
        for r in ("reiatsu_max", "reiatsu"):
            if r in t.bonos:
                return 1 - REIATSU[r][1]
        return 1.0

    def _golpear(self, t, dmg, atacante):
        """Aplica daño y carga las ÚLTIS. Devuelve el daño real."""
        if "congelado" in t.efectos and not t.forma:
            dmg *= CONGELADO_MULT           # ❄️ el hielo hace que cada golpe duela más
        dmg = max(1, round(dmg * self._mult_defensa(t)))
        reflejo = 0
        if "contra" in t.bonos and not t.forma and atacante is not None and atacante is not t and not self._mismo_equipo(t, atacante):
            del t.bonos["contra"]           # 💢 solo reacciona al primer golpe
            reflejo = round(dmg * CONTRA_REFLEJO)
            dmg = max(1, round(dmg * CONTRA_ESCUDO))
        if t.forma:     # el daño va a la vida de Mahoraga, no a la de Megumi
            dmg = min(dmg, t.forma_hp)
            t.forma_hp -= dmg
            self._cargar(atacante, dmg, True)
            self._cargar(t, dmg, False)
            if t.forma_hp <= 0:
                self._terminar_forma(t, "es derrotado")
            return dmg
        absorbido = 0
        if t.barrera > 0:                   # 🕸️ la barrera se come el daño primero
            absorbido = min(dmg, t.barrera)
            t.barrera -= absorbido
            dmg -= absorbido
            self._avisos.append(f"🕸️ La barrera de **{t.tag}** absorbe {absorbido}" + (" y se rompe." if t.barrera <= 0 else f" (le quedan {t.barrera})."))
            if t.barrera <= 0:
                t.bonos.pop("barrera", None)
        dmg = min(dmg, t.hp)
        t.hp -= dmg
        if dmg and SUENO_DESPIERTA:
            t.efectos.pop("sueno", None)
        self._cargar(atacante, dmg + absorbido, True)
        self._cargar(t, dmg, False)
        if reflejo:                         # ... y se lo devuelve entero a quien lo golpeó
            dev = self._golpear(atacante, reflejo, t)
            self._avisos.append(f"💢 **{t.tag}**: «¿Qué dijiste de mi cabello?» ¡Le devuelve el golpe a **{atacante.tag}**: -{dev}!")
            if atacante.hp <= 0 and not atacante.forma:
                self._avisos.append(f"💀 **{atacante.tag}** cae.")
            amigos = [x for x in self.equipos[0].luchadores + self.equipos[1].luchadores
                      if x is not t and x.vivo and not x.forma and self._mismo_equipo(t, x)] or ([t] if t.vivo else [])
            if amigos:
                h = random.choice(amigos)
                curado = min(round(CONTRA_CURA * self._mult_cura(t)), h.max_hp - h.hp)
                h.hp += curado
                self._avisos.append(f"💚 **{h.tag}** recupera {curado}.")
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
        reloj = 0
        if m.get("arena"):                 # Urahara: gasta todo el reloj, y el nivel decide el efecto
            reloj = a.arena
            a.arena = 0
        if random.random() > self._prec(a, m, t):
            eq.medios = 0
            self.log = f"{cab}... ¡pero falla! 💨 **{eq.nombre} pierde todos sus turnos.**"
            return
        golpes = self._golpes(a, m, k)
        dmg = sum(random.randint(*m["dmg"]) for _ in range(golpes)) * self._mult_ataque(a)
        if k == "normal":
            dmg *= self._mult_normal(a)
        dmg_base = dmg                      # daño sin guardia ni crítico (lo usan las chispas y la estampida)
        linea0 = a.linea                    # línea negra antes de la patada
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
            if random.random() < PROB_CRIT + (VEL_CRIT if "velocidad" in a.bonos else 0) + (BANKAI_CRIT if "bankai" in a.bonos else 0) + (RABIA_CRIT if "rabia" in a.bonos else 0):
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
        if m.get("drena") and a.vivo and real > 0:        # 🧛 chupa vida: recupera una parte del daño
            curado = min(round(real * m["drena"]), a.max_hp - a.hp)
            if curado > 0:
                a.hp += curado
                notas.append(f"🧛 **{a.tag}** recupera {curado} de vida.")
        if k == "normal" and a.pm < PM_MAX:
            a.pm = min(PM_MAX, a.pm + PM_NORMAL)
        if m.get("chispas"):                              # 🎆 Pirotecnia: chispas a los demás rivales (y, con mala suerte, a un aliado)
            notas += self._chispas(a, t, dmg_base, m["chispas"])
        if m.get("estampa"):                              # 🪢 Cuerda de motosierra / ⚽ Pelota garuda: el golpe sigue contra otro rival
            notas += self._estampar(a, t, dmg_base, m)
        if m.get("linea"):                                # ⬛ Masa virtual: sube la línea negra
            a.linea = min(LINEA_MAX, a.linea + m["linea"])
            notas.append(f"⬛ Línea negra: {'⬛' * a.linea}{'⬜' * (LINEA_MAX - a.linea)}" + (" · ¡llena!" if a.linea >= LINEA_MAX else ""))
        if m.get("patadas"):                              # ⬛ Doble patada: gasta la línea negra
            a.linea = 0
            if linea0 == 2 and t.hp > 0 and not t.forma:   # a la mitad: el segundo golpe deja ciego
                notas.append(self._aplicar_efecto(t, ("ciego", 1, 1.0)) + " No ve sus habilidades en su próximo turno.")
        if m.get("bono_prob") and random.random() < m["bono_prob"][2]:
            a.bonos[m["bono_prob"][0]] = max(m["bono_prob"][1], a.bonos.get(m["bono_prob"][0], 0))
            notas.append(f"{BONOS_TXT[m['bono_prob'][0]]} durante {m['bono_prob'][1]} turnos.")
        if m.get("extra") and (t.hp > 0 or t.forma):      # daño eléctrico extra: no lo reduce la guardia
            extra = self._golpear(t, m["extra"], a)
            real += extra
            notas.append(f"⚡ +{extra} de daño eléctrico.")
        if m.get("reloj"):
            a.ulti = min(100.0, a.ulti + ULTI_ARENA)
            if a.arena < ARENA_MAX:
                a.arena = min(ARENA_MAX, a.arena + m["reloj"])
                notas.append(f"⏳ {a.tag} llena el reloj ({a.arena}/{ARENA_MAX}).")
        if m.get("sombra") and a.sombras < SOMBRAS_MAX:
            a.sombras += 1
            notas.append(f"🌑 {a.tag} gana una sombra ({a.sombras}/{SOMBRAS_MAX}).")
        if m.get("hoja"):
            a.ulti = min(100.0, a.ulti + ULTI_HOJA)
            if a.hojas < HOJAS_MAX:
                a.hojas = min(HOJAS_MAX, a.hojas + m["hoja"] + (ANTENAS_HOJA if "antenas" in a.bonos else 0))
                notas.append(f"🍃 {a.tag} gana una hoja ({a.hojas}/{HOJAS_MAX}).")
        if m.get("bono_equipo"):                          # Viento a favor: todo el equipo gana el bono
            for x in eq.vivos:
                x.bonos[m["bono_equipo"][0]] = max(m["bono_equipo"][1], x.bonos.get(m["bono_equipo"][0], 0))
            notas.append(f"{BONOS_TXT[m['bono_equipo'][0]]} para todo el equipo durante {m['bono_equipo'][1]} turnos.")
        if t.hp <= 0 and not t.forma:
            notas.append(f"💀 **{t.tag}** cae.")
        elif t.hp > 0 and not (era_forma and not t.forma):
            if m.get("efecto"):
                notas.append(self._aplicar_efecto(t, m["efecto"]))
                if reloj >= ARENA_MAX:        # reloj lleno: el efecto llega a todos los rivales
                    for x in self.rival.blancos:
                        if x is not t and x.vivo:
                            notas.append(self._aplicar_efecto(x, m["efecto"]))
            if m.get("efecto_extra"):
                notas.append(self._aplicar_efecto(t, m["efecto_extra"]))
            if "rajin" in a.bonos and "paralisis" not in t.efectos:      # ⚡ Rajin Sekein
                notas.append(self._aplicar_efecto(t, ("paralisis", 1, RAJIN_PARALISIS)))
            if m.get("control"):                       # Control metal: el rival ataca a los suyos
                notas += self._control(a, t)
            if m.get("roba_ulti") and not t.forma:     # 🧵 Hilos ladrones: le roba carga de ÚLTI
                robo = min(t.ulti, m["roba_ulti"][0])
                if robo > 0:
                    t.ulti -= robo
                    a.ulti = min(100.0, a.ulti + robo * m["roba_ulti"][1] / m["roba_ulti"][0])
                    notas.append(f"🧵 **{a.tag}** le roba {round(robo)}% de ÚLTI a **{t.tag}**.")
                else:
                    notas.append(f"🧵 **{t.tag}** no tiene ÚLTI que robar.")
            if m.get("desteje") and not t.forma:       # ✂️ Deshilar: le arranca los bonos y la guardia
                quitados = [BONOS_TXT[b].split(" (")[0] for b in t.bonos]
                t.bonos.clear()
                t.barrera = 0
                if t.guardia:
                    t.guardia = False
                    quitados.append("🛡️ Guardia")
                notas.append(f"✂️ **{a.tag}** deshila a **{t.tag}**: pierde " + ", ".join(quitados) + "." if quitados else f"✂️ **{t.tag}** no tenía nada que deshilar.")
            if a.forma and a.adaptado:       # Mahoraga devuelve el efecto que absorbió
                nombre_ad, dur_ad = a.adaptado
                a.adaptado = None
                notas.append("🌀 " + self._aplicar_efecto(t, (nombre_ad, dur_ad, 1.0)))
        self.log = f"{cab} y causa **{real}** de daño" + (f" ({golpes} golpes)." if golpes > 1 else ".")
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

    def _reducir(self, x, dmg):
        """Daño de un golpe secundario: la guardia lo reduce a la mitad, la guardia rota lo aumenta."""
        if "guardia_rota" in x.efectos:
            return dmg * ROTA_MULT
        return dmg * GUARDIA_MULT if x.guardia else dmg

    def _chispas(self, a, t, base, ch):
        notas = []
        for x in list(self.rival.blancos):
            if x is t or not x.vivo:
                continue
            real = self._golpear(x, self._reducir(x, base * ch[0]), a)
            notas.append(f"🎆 Una chispa alcanza a **{x.tag}**: -{real}." + (f"\n💀 **{x.tag}** cae." if x.hp <= 0 and not x.forma else ""))
        ulti0 = a.ulti
        for x in list(self.actual.vivos):
            if x is a or random.random() >= ch[1]:
                continue
            real = self._golpear(x, self._reducir(x, base * ch[0]), a)
            notas.append(f"🎆💥 ¡Una chispa se desvía y quema a su compañero **{x.tag}**: -{real}!" + (f"\n💀 **{x.tag}** cae." if x.hp <= 0 and not x.forma else ""))
        a.ulti = ulti0                        # el fuego amigo no carga la ÚLTI
        return notas

    def _estampar(self, a, t, base, m):
        otros = [x for x in self.rival.blancos if x is not t and x.vivo]
        v = getattr(self, "_obj2", None)
        if not isinstance(v, Luchador) or v not in otros:
            v = min(otros, key=lambda x: x.hp) if otros else None
        self._obj2 = None
        rebote = m["estampa"] if isinstance(m["estampa"], float) else 1.0
        if v is None:
            return ["⚽ No hay otro rival al que lanzarlo." if rebote < 1 else "🪢 No hay otro rival contra quien estamparlo."]
        real = self._golpear(v, self._reducir(v, base * rebote) * self._mult_sangre(a, v), a)
        txt = f"⚽ La pelota rebota contra **{v.tag}**: -{real}." if rebote < 1 else f"🪢 **{t.tag}** es estampado contra **{v.tag}**: -{real}."
        return [txt + (f"\n💀 **{v.tag}** cae." if v.hp <= 0 and not v.forma else "")]

    def _conejos(self, a, k):
        """🐰 Conejos (Megumi), modo 'a todos': un mordisco a cada rival, con posibilidad de debilitarlos."""
        m = a.mov(k)
        cab = f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}** (a todos)"
        lineas, notas = [], []
        for t in list(self.rival.blancos):
            if random.random() > self._prec(a, m, t):
                lineas.append(f"{t.tag} esquiva")
                continue
            dmg = random.randint(*m["dmg_todos"]) * self._mult_ataque(a) * self._mult_sangre(a, t)
            real = self._golpear(t, self._reducir(t, dmg), a)
            lineas.append(f"{t.tag} -{real}")
            if t.hp <= 0 and not t.forma:
                notas.append(f"💀 **{t.tag}** cae.")
            elif t.hp > 0 and not t.forma and m.get("efecto_todos"):
                notas.append(self._aplicar_efecto(t, m["efecto_todos"]))
        self.log = f"{cab}\n🐰 " + ", ".join(lineas) + "."
        notas = [n for n in notas if n]
        if notas:
            self.log += "\n" + "\n".join(notas)

    def _clones(self, a, k, t1):
        """💨 Paso de clones (Yoruichi): golpea a un rival, luego a otro y por último a todos. Después gana Velocidad."""
        m = a.mov(k)
        rv = self.rival.blancos
        t1 = t1 if (t1 is not None and t1.vivo and t1 in rv) else self.objetivo_por_defecto()
        t2 = getattr(self, "_obj2", None)
        otros = [x for x in rv if x is not t1]
        if not isinstance(t2, Luchador) or t2 not in otros:
            t2 = min(otros, key=lambda x: x.hp) if otros else t1
        self._obj2 = None
        secuencia = [t1, t2] + list(rv)
        lineas, notas = [], []
        for x in secuencia:
            if not x.vivo and not x.forma:
                lineas.append(f"{x.tag} ya cayó")
                continue
            if random.random() > self._prec(a, m, x):
                lineas.append(f"{x.tag} esquiva")
                continue
            dmg = random.randint(*m["dmg"]) * self._mult_ataque(a) * self._mult_sangre(a, x)
            real = self._golpear(x, self._reducir(x, dmg), a)
            lineas.append(f"{x.tag} -{real}")
            if x.hp <= 0 and not x.forma:
                notas.append(f"💀 **{x.tag}** cae.")
            elif "rajin" in a.bonos and not x.forma and "paralisis" not in x.efectos:
                notas.append(self._aplicar_efecto(x, ("paralisis", 1, RAJIN_PARALISIS)))
        if a.vivo:
            a.bonos["velocidad"] = max(m["bono"][1], a.bonos.get("velocidad", 0))
            notas.append(f"{BONOS_TXT['velocidad'].split(' (')[0]}: +25% de crítico durante {m['bono'][1]} turnos.")
        self.log = (f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}**\n💨 " + ", ".join(lineas) + ".")
        notas = [n for n in notas if n]
        if notas:
            self.log += "\n" + "\n".join(notas)

    def _bolas(self, a, k, t):
        """🔮 Bolas de reiatsu (Urahara): poco daño a un rival, cura al equipo y carga el reloj."""
        m = a.mov(k)
        t = t if (t is not None and t.vivo and t in self.rival.blancos) else self.objetivo_por_defecto()
        cab = f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}** sobre **{t.tag}**"
        notas = []
        if random.random() > self._prec(a, m, t):
            texto = f"{cab}... la bola no alcanza a {t.tag}."
        else:
            dmg = random.randint(*m["dmg"]) * self._mult_ataque(a) * self._mult_sangre(a, t)
            real = self._golpear(t, self._reducir(t, dmg), a)
            texto = f"{cab} y causa **{real}** de daño."
            if t.hp <= 0 and not t.forma:
                notas.append(f"💀 **{t.tag}** cae.")
        curas = []
        for x in self.actual.vivos:
            c = min(m["cura"], x.max_hp - x.hp)
            if c > 0:
                x.hp += c
                curas.append(f"{x.tag} +{c}")
        if curas:
            notas.append("💚 " + ", ".join(curas) + ".")
        a.ulti = min(100.0, a.ulti + BOLAS_ULTI)
        if a.arena < ARENA_MAX:
            a.arena = min(ARENA_MAX, a.arena + BOLAS_RELOJ)
            notas.append(f"⏳ {a.tag} llena el reloj ({a.arena}/{ARENA_MAX}).")
        self.log = texto + ("\n" + "\n".join(notas) if notas else "")

    def _trampa(self, a, k):
        """🪤 Trampa (Urahara): hiere un poco a todos los rivales; todo el equipo gana Puntería."""
        m = a.mov(k)
        lineas, notas = [], []
        for t in list(self.rival.blancos):
            if random.random() > self._prec(a, m, t):
                lineas.append(f"{t.tag} la esquiva")
                continue
            dmg = random.randint(*m["dmg_todos"]) * self._mult_ataque(a) * self._mult_sangre(a, t)
            real = self._golpear(t, self._reducir(t, dmg), a)
            lineas.append(f"{t.tag} -{real}")
            if t.hp <= 0 and not t.forma:
                notas.append(f"💀 **{t.tag}** cae.")
        for x in self.actual.vivos:
            x.bonos["punteria"] = max(2, x.bonos.get("punteria", 0))
        notas.append(f"{BONOS_TXT['punteria']} para todo el equipo durante 2 turnos.")
        self.log = f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}**\n🪤 " + ", ".join(lineas) + "." + "\n" + "\n".join(n for n in notas if n)

    def _apagon(self, a, k):
        """🔌 Apagón (Reze): ningún rival puede usar su ataque normal en su próximo turno."""
        m = a.mov(k)
        cab = f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}**"
        quedan = []
        for t in self.rival.blancos:
            if t.forma:
                continue
            t.efectos["apagon"] = max(1, t.efectos.get("apagon", 0))
            quedan.append(t.tag)
        self.log = f"{cab}\n🔌 Se va la luz: " + (", ".join(quedan) + " no pueden usar su ataque normal." if quedan else "no pasa nada.")

    def _golpe_forzado(self, t, v):
        """El luchador t (controlado) golpea con su ataque normal a v. La guardia reduce el daño; no hay crítico ni pérdida de iconos."""
        m = t.d["mov"]["normal"]
        dmg = sum(random.randint(*m["dmg"]) for _ in range(m.get("golpes", 1))) * self._mult_ataque(t) * CONTROL_MULT
        if "guardia_rota" in v.efectos:
            dmg *= ROTA_MULT
        elif v.guardia:
            dmg *= GUARDIA_MULT
        return self._golpear(v, dmg, t)

    def _control(self, a, t):
        """🧲 Control metal (Mantis): t ataca a sus compañeros. Si está solo se ataca a sí mismo; si es curandero, cura al equipo de Mantis."""
        if t.forma or not t.vivo:
            return []
        eq, rv = self.actual, self.rival
        notas = [f"🧲 **{t.tag}** queda bajo el control de **{a.tag}**."]
        ulti0 = t.ulti
        otros = [x for x in rv.blancos if x is not t]
        cura = max((mv.get("sana", 0) for mv in t.d["mov"].values()), default=0)
        if otros:
            for v in otros:
                real = self._golpe_forzado(t, v)
                notas.append(f"💢 **{t.tag}** golpea a **{v.tag}**: -{real}.")
                if v.hp <= 0 and not v.forma:
                    notas.append(f"💀 **{v.tag}** cae.")
        elif cura:
            h = min(eq.vivos, key=lambda x: x.hp / x.max_hp)
            antes = h.hp
            h.hp = min(h.max_hp, h.hp + cura)
            notas.append(f"💚 **{t.tag}** cura a **{h.tag}**: +{h.hp - antes}.")
        else:
            real = self._golpe_forzado(t, t)
            notas.append(f"💢 **{t.tag}** se golpea a sí mismo: -{real}.")
            if t.hp <= 0:
                notas.append(f"💀 **{t.tag}** cae.")
        t.ulti = ulti0                      # golpear bajo control no le carga la ÚLTI
        return notas

    def _ventisca(self, a, k):
        """❄️ Ventisca (Ororo): daño a todos los rivales y posibilidad de congelar a uno."""
        m = a.mov(k)
        cab = f"{a.d['emoji']} **{a.tag}** usa **{m['nombre']}**"
        lineas, notas, tocados = [], [], []
        for t in list(self.rival.blancos):
            if random.random() > self._prec(a, m, t):
                lineas.append(f"{t.tag} esquiva")
                continue
            dmg = random.randint(*m["dmg"]) * self._mult_ataque(a) * self._mult_sangre(a, t)
            if "guardia_rota" in t.efectos:
                dmg *= ROTA_MULT
            elif t.guardia:
                dmg *= GUARDIA_MULT
            real = self._golpear(t, dmg, a)
            lineas.append(f"{t.tag} -{real}")
            if t.hp <= 0 and not t.forma:
                notas.append(f"💀 **{t.tag}** cae.")
            elif t.hp > 0 and not t.forma:
                tocados.append(t)
        if tocados and random.random() < m["congela"]:
            v = random.choice(tocados)
            notas.append(self._aplicar_efecto(v, ("congelado", 1, 1.0)) + " No puede actuar y recibe +25% de daño.")
        self.log = f"{cab}\n🌨️ " + ", ".join(lineas) + "."
        notas = [n for n in notas if n]
        if notas:
            self.log += "\n" + "\n".join(notas)

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
                t.hp = min(t.max_hp, t.hp + round(sum(random.randint(*u["cura"]) for _ in range(u["curas"])) * self._mult_cura(a)))
                total += t.hp - antes
                curas.append(f"{t.tag} +{t.hp - antes}")
            self._cargar_cura(a, total)
            self.log = f"{cab}\n💢 " + ", ".join(lineas) + ".\n💚 Cura: " + ", ".join(curas) + "."
            if notas:
                self.log += "\n" + "\n".join(notas)
            a.ulti = 0.0
            return
        if u["tipo"] == "bankai":
            for l in eq.vivos:
                l.bonos["bankai"] = BANKAI_TURNOS
            self.log = f"{cab}\n{BONOS_TXT['bankai']} para todo el equipo durante {BANKAI_TURNOS} turnos."
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
            for k in CLAVES + ("defender", "ulti"):
                if not self.puede(l, k):
                    continue
                if k == "defender" or (k != "ulti" and l.mov(k)["tipo"] in ("cura", "limpia", "adapta", "reserva", "potencia", "ventisca", "apagon", "barrera", "trampa")):
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
        if m["tipo"] == "clones":            # Paso de clones: un golpe a cada uno de los dos elegidos y otro a todos
            prom = sum(m["dmg"]) / 2 * mult
            golpes = [t] + [x for x in rv.blancos if x is not t][:1] + list(rv.blancos)
            v = sum(prom * self._prec(l, m, x) * (ROTA_MULT if "guardia_rota" in x.efectos else (GUARDIA_MULT if x.guardia else 1)) for x in golpes)
            v += 8 * (1 - t.hp / t.max_hp) * 0.5 + (5 if "velocidad" not in l.bonos else 0)
            if "rajin" in l.bonos:
                v += 2.5 * len(golpes) * RAJIN_PARALISIS
            v -= m["pm"] * 0.9
            return v / (m["coste"] ** 0.8)
        if m["tipo"] == "bolas":             # Bolas de reiatsu: pega poco, cura al equipo y carga el reloj
            prom = sum(m["dmg"]) / 2 * mult * self
