// ============================================================
//  LISTA DE MÚSICA  (aquí es lo único que tocas para cambiar canciones)
//  Los mp3 van dentro de la carpeta  musica/  (junto a servidor.py)
//
//  Cada canción:  {t:"Título", a:"Autor", f:"archivo.mp3", c:"portada.jpg"}
//     t = título que se ve        a = autor (letra chiquita)
//     f = nombre EXACTO del archivo en la carpeta musica/
//     c = portada para el centro del disco (opcional, también en musica/)
//
//  Grupos:
//     menu  = pantalla de elegir equipo
//     bazar = tienda de Burnice (si lo dejas vacío usa la de menu)
//     pelea = durante el combate
//     fin   = pantalla de victoria/derrota (si lo dejas vacío usa la de menu)
//  Con varias canciones en un grupo suenan al azar una tras otra.
//  Un grupo vacío [] = silencio en esa pantalla.
// ============================================================
window.MUSICA = {
  menu: [
     {t:"beneath the mask", a:"lyn", f:"menu1.mp3"},
  ],
  bazar: [
     {t:"hip shop", a:"toby fox", f:"bazar1.mp3"},
  ],
  pelea: [
     {t:"Mass destruction", a:"lotus juice", f:"pelea1.mp3"},
     {t:"Last surprise", a:"lyn", f:"pelea2.mp3", c:"portada2.jpg"},
  ],
  fin: [
     {t:"victory fanfare", a:"Masashi Hamauzu", f:"fin1.mp3"},
  ],
};
