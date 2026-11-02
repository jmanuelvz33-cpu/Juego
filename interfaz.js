// ============================================================
//  AJUSTES DE LAS PANTALLAS  (aquí editas imágenes, textos, roles y frases)
//  Las imágenes son links (https://...) o archivos subidos, por ejemplo "/musica/burnice.png"
//  Cualquier texto o imagen vacío ("") simplemente no se muestra.
// ============================================================
window.INTERFAZ = {

  // Fondos a pantalla completa (uno por pantalla). Vacío "" = sin fondo. Si "inicio" está vacío usa FONDO_IMG.
  FONDOS: {
    inicio: "https://i.imgur.com/SZvt2Fk.jpeg",
    seleccion: "https://i.imgur.com/gmS72KD.jpeg",
    combate: "https://i.imgur.com/DHdNjDE.jpeg",
    bazar: "https://i.imgur.com/Q0HOKWw.jpeg",
  },
  // Qué tan oscuro se pone el fondo para que se lea (0 = nada, 0.9 = muy oscuro)
  FONDO_OSCURO: 0.55,
  // Arenas de combate
  ARENAS: ["https://i.imgur.com/rZIk2Ne.gif", "https://i.imgur.com/F0xbQOM.gif", "https://i.imgur.com/UvwD1dO.jpeg"],
  // Imagen de Burnice dándote la bienvenida (pantalla de inicio)
  BIENVENIDA_IMG: "https://i.imgur.com/6mv1T6q.jpeg",
  // Fondo opcional de la pantalla de inicio
  FONDO_IMG: "https://i.imgur.com/SZvt2Fk.jpeg",

  // Frases de bienvenida de Burnice (sale una al azar). {nombre} = nombre del jugador
  BIENVENIDAS: [
    "¡Ey, {nombre}! Qué bueno verte, cielo. ¿Pelea o compritas hoy?",
    "¡Mira quién llegó! Pasa, pasa, que aquí todo está calentito.",
    "¡Compa! Hoy huele a victoria... o a quemado. Igual me gusta.",
    "¡{nombre}! Elige: o peleas, o me ayudas a prenderle fuego a algo. Jeje.",
  ],

  // Aviso del día (un cartel debajo de Burnice). Déjalo "" para ocultarlo.
  AVISO: "Se acerca navidad",

  // Los bloques de rol. img = imagen del bloque (opcional), icono = lo que se ve si no hay imagen
  ROLES: {
    embestidor: {nombre: "Embestidor", icono: "⚔️", img: "https://i.imgur.com/a35JOVC.jpeg"},
    amparo:     {nombre: "Amparo",     icono: "🛡️", img: "https://i.imgur.com/PrbhqGn.jpeg"},
    control:    {nombre: "Control",    icono: "🌀", img: "https://i.imgur.com/0WwaXAe.jpeg"},
  },

  // A qué rol pertenece cada personaje (embestidor / amparo / control)
  ROL: {
    reze: "embestidor", yuki: "embestidor", yoruichi: "embestidor", megumi: "embestidor",
    josuke: "amparo", mantis: "amparo", storm: "amparo",
    jolyne: "control", ochako: "control", denji: "control",
  },

  // Frases cortas al elegir a un personaje (sale una al azar). Personaje nuevo: agrega una línea igual.
  FRASES: {
    jolyne:   ["Mis hilos ya te tienen. No te muevas.", "No pienso rendirme, aunque me cueste todo."],
    reze:     ["¡Boom! Esto va a ser divertido.", "Cuidado, todo lo que toco explota."],
    storm:    ["Que el cielo decida quién cae.", "Se acerca una tormenta."],
    ochako:   ["¡Plus Ultra! Flota un ratito, ¿sí?", "Voy a darlo todo, ¡cuenten conmigo!"],
    yuki:     ["Cuando golpeo, nada se queda en pie.", "Prepárate: esto va a doler."],
    yoruichi: ["Demasiado lento. ¿Ya me viste?", "No alcanzarás a parpadear."],
    megumi:   ["Mejor que no despierte lo que llevo dentro.", "Si voy a caer, no caeré solo."],
    josuke:   ["¡Nadie se burla de mi peinado!", "Tranquilo, yo te arreglo eso."],
    denji:    ["¡Solo quiero comer algo rico y ganar!", "¡Voy a cortarlos a todos!"],
    mantis:   ["Siento su dolor… déjenme ayudar.", "Yo cuido al equipo, ustedes ganen."],
  },
};
