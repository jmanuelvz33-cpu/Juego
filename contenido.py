"""Contenido del Bazar (generado por extraer_web.py desde el Juego.py del bot)."""
COSMETICOS = {}
COSMETICOS["mascotas"] = {
    "neko_arc": {"nombre": "Neko Arc", "precio": 0,   # GRATIS (para probar la tienda)
                 "normal": "<a:Neko_arc:1563336473892233276>", "victoria": "<:emoji_9:1561325907631931433>"},
    "gallica": {"nombre": "Gallica", "precio": 180,
                "normal": "<:emoji_10:1561326867246747668>", "victoria": "<:emoji_11:1561326890319618270>"},
    "gardevoir": {"nombre": "Gardevoir", "precio": 200,
                  "normal": "<:emoji_12:1561328024509751416>", "victoria": "<:emoji_13:1561328057002889247>"},
    "reze": {"nombre": "Reze", "precio": 220,
             "normal": "<:emoji_14:1561328700463517819>", "victoria": "<:emoji_15:1561328735272308847>"},
    "sylveon": {"nombre": "Sylveon", "precio": 220,
                "normal": "<:emoji_20:1561458968457515099>", "victoria": "<:emoji_21:1561459004440584232>"},
    "tusk_act_1": {"nombre": "Tusk Act 1", "precio": 200,
                   "normal": "<:emoji_18:1561458857895534684>", "victoria": "<:emoji_19:1561458936358506627>"},
    "ralsei": {"nombre": "Ralsei", "precio": 250,
               "normal": "<:emoji_16:1561329244972388353>", "victoria": "<:emoji_17:1561329269072994455>"},
}


NIKO_IMG = "https://i.imgur.com/lSXXTRw.jpeg"   # ← pon aquí el link de tu banner de Niko (grande, arriba)
COLOR_NIKO = 0xFFD700

# Cada botón te lleva a otro lugar del Bazar (la pantalla entera cambia).
# Un banner por pantalla: pon aquí los links. Vacío = esa pantalla sale sin banner (todo funciona igual).
BURNICE_IMG = "https://i.imgur.com/JgwpJkm.jpeg"        # <- banner de la pantalla principal (Burnice recibiéndote)
COMPRAR_IMG = "https://i.imgur.com/W4uJKCv.jpeg"        # <- banner de "Comprar"
MESA_IMG = "https://i.imgur.com/InNlxNv.jpeg"           # <- banner de "La mesa"
COLOR_BURNICE = 0xFF5A1F

BURNICE_SALUDOS = [
    "¡Ey, ey, ey! Bienvenido al Bazar, cielo. Soy Burnice.\n¿Viniste a comprar… o a ver si quemamos algo hoy? Jeje.",
    "¡Mira quién llegó! Pasa, pasa, que aquí todo está calentito. Literalmente. Creo que dejé algo prendido.",
    "¡Compa! Qué bueno que viniste. ¿Qué hacemos hoy: comprar, charlar o prenderle fuego a algo? Yo voto por la tercera.",
]
BURNICE_COMPRAR = (
    "¡Mi parte favorita! Esto es todo lo que tengo en venta… o lo poco que no se me ha quemado, jeje.\n"
    "Por ahora solo hay mascotas. Y ojo: van a tener un cambio pronto. No sé cuál todavía, ¡pero seguro explota algo!… "
    "digo, ¡se mejora algo! Cosas de bazar.\n"
    "Los accesorios nuevos llegan después, cielo."
)
BURNICE_MESA = (
    "¡La mesa! Aquí se juntan todos los del juego. Elige a quien quieras: puedes ver su ficha o ponerte a charlar con él o ella.\n"
    "Pórtense bien… o no. Yo traje gasolina por si acaso."
)
BURNICE_SALIDAS = [
    "¿Ya te vas? ¡Vuelve pronto, compa! Dejaré algo prendido para que sepas dónde encontrarme. …Digo, la luz. La luz encendida. Jeje.",
    "¡Chao, cielo! Si algo huele a quemado cuando salgas, no fui yo. Probablemente.",
]
BURNICE_TIMEOUT = "⌛ Se me apagó la llama de tanto esperar. Usa /tienda para volver al Bazar."

NIKO_OPINION = [
    "Oh… ¿viniste a verme? Me mudé a esta mesa, jeje. ¿Qué te parece mi nuevo rincón?",
    "Burnice es… muy intensa. Dos veces casi me prende el sombrero. Pero es amable, a su manera.",
    "Extrañé mi tiendita al principio, la verdad. Pero aquí hay más gente con quien charlar… y más luz. Mucha luz. Demasiada, quizá.",
    "Me dijeron que mis mascotitas van a tener un cambio. Espero que sigan siendo felices… y que no huelan a humo.",
    "Si me necesitas, siempre estaré en esta mesa. ¿Tienes panqueques? …Solo preguntaba.",
]

# La mesa: cada personaje tiene un comentario de Burnice y unas líneas cortas (se pasan con "Hablar").
# Cámbialas a tu gusto; un personaje nuevo sin entrada aquí igual aparece en la mesa.
CHARLAS = {
    "jolyne": {
        "burnice": "¡Jolyne! Cero paciencia y muchísimo carácter, me encanta. Y esos hilos… me darían miedo si no me cayera tan bien.",
        "lineas": [
            "¿Quién eres tú para venir a mirarme así? …¿Qué? Habla de una vez.",
            "Me encerraron por algo que no hice. Pero eso no me detiene: voy a proteger a mi papá, cueste lo que cueste.",
            "Mis hilos cortan, atan y sienten todo lo que tocan. No me subestimes.",
            "Soy una Kujo. Y los Kujo no nos rendimos. Nunca.",
        ],
    },
    "reze": {
        "burnice": "¿Reze? ¡Ay, cielo, ella sí sabe de explosiones! Seríamos almas gemelas… si no me diera un poquito de miedo. Jeje.",
        "lineas": [
            "Ay, hola… ¿te asusté? Perdón, a veces aparezco de la nada.",
            "Me gustan los cafés calentitos, las cosas que hacen ¡boom!… y los chicos con cara de cachorro.",
            "No soy mala, ¿sabes? Solo hago lo que tengo que hacer. …O eso me dicen.",
            "Si me das la espalda, no te prometo que no explote algo. Era broma. ¿Tal vez?",
        ],
    },
    "storm": {
        "burnice": "Storm tiene rayos, truenos y muchísima elegancia. Yo tengo cerillos. Pero igual nos entendemos.",
        "lineas": [
            "Bienvenido. El cielo ya me avisó que vendrías.",
            "La tormenta no es crueldad, amigo mío. Es equilibrio.",
            "He sido ladrona, diosa y líder. Elegí quién quería ser, y tú también puedes.",
            "Cuida a los tuyos. Yo me encargo del clima.",
        ],
    },
    "ochako": {
        "burnice": "¡Ochako! Dulce como un pastelito… hasta que te deja flotando sin gravedad. ¡Eso es poder, compa!",
        "lineas": [
            "¡H-hola! Me da un poco de vergüenza que veas mi ficha, jeje.",
            "¡Quiero ser heroína para que mis papás por fin descansen! Es mi meta número uno.",
            "Si uso mucha gravedad cero me mareo… ¡pero estoy bien! ¡Siempre estoy bien!",
            "¡Plus Ultra! Siempre se puede un poquito más.",
        ],
    },
    "yuki": {
        "burnice": "Yuki… ¿has visto cómo golpea? Ese golpe dejaría un cráter bien bonito. Me fascina.",
        "lineas": [
            "Hola. Siéntate, si quieres. Yo hago lo que me da la gana, así que tú también.",
            "La única regla que respeto es la libertad. Todo lo demás es negociable.",
            "¿Pelear? Claro. Pero que sea divertido, ¿sí?",
            "Mi técnica pesa mucho más que mi paciencia. Cuidado.",
        ],
    },
    "yoruichi": {
        "burnice": "Yoruichi es tan rápida que ni mi fuego la alcanza. Lo intenté. Dos veces. Jeje.",
        "lineas": [
            "Jeje, ¿ya me andabas buscando? Se nota que te cuesta seguirme el paso.",
            "¿Gato o persona? Depende de cómo amanezca de humor.",
            "El shunpo no se enseña, se vive. Y se corre. Se corre mucho.",
            "Tranquilo, no muerdo. Rasguño un poquito, nada más.",
        ],
    },
    "megumi": {
        "burnice": "Megumi es serio, callado y tiene un montón de sombras con colmillos. Le ofrecí gasolina y me miró feo. ¡Qué raro!",
        "lineas": [
            "…Tsk. No me gusta hablar mucho. Pregunta lo que quieras, pero rápido.",
            "Si hay alguien que merece ser salvado, lo salvo. Así de simple.",
            "Mis shikigamis no son armas. Son… compañeros. No se lo digas a nadie.",
            "No lo hago por heroísmo. Es solo que no puedo ignorar a quien me necesita.",
        ],
    },
    "josuke": {
        "burnice": "Josuke arregla todo lo que se rompe. ¡Imagínate lo útil que sería conmigo cerca! Yo rompo cosas todo el día.",
        "lineas": [
            "¡Hola! Un gusto. Y por favor, no te rías de mi peinado… ¡es broma, perdón, me exalté!",
            "Crazy Diamond arregla heridas, cosas rotas, hasta pueblos enteros. Lo único que no puede arreglar es a mí. Qué ironía, ¿no?",
            "Si veo a alguien herido, no puedo mirar para otro lado. Así soy.",
            "¡Dora, dora, dora! Es mi forma de decir que todo va a estar bien.",
        ],
    },
    "denji": {
        "burnice": "¿Denji? ¡Motosierras y fuego se llevan de maravilla! Con pan con mermelada ya es mi mejor amigo.",
        "lineas": [
            "¿Eh? ¿Me hablas a mí? ¡Qué emoción, casi nadie lo hace!",
            "¿Sabes qué quiero? Pan con mermelada, una cama calentita y… bueno, alguien que me quiera. ¡Con eso soy feliz!",
            "Pochita, ¿me ves? ¡Estoy haciendo amigos!",
            "Si me abrazas me convierto en un perro leal. Un perro con motosierras, pero leal.",
        ],
    },
    "mantis": {
        "burnice": "Mantis es tan dulce que me da cosita encenderme cerca de ella. Casi nunca. Casi.",
        "lineas": [
            "Ay, ¡hola! Siento que estás nervioso. No pasa nada, puedes quedarte.",
            "A veces digo cosas raras. Dicen que soy rara… yo creo que es cariño.",
            "Mis antenas brillan cuando alguien necesita ayuda. Hoy brillan un poquito por ti.",
            "No me gustan las peleas, pero me gusta cuidar a los míos.",
        ],
    },
}


