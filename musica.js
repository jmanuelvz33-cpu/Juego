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
    // {t:"Nombre de la canción", a:"Autor", f:"menu1.mp3"},
  ],
  bazar: [
    // {t:"Nombre", a:"Autor", f:"bazar1.mp3"},
  ],
  pelea: [
    // {t:"Nombre", a:"Autor", f:"pelea1.mp3"},
    // {t:"Otra pelea", a:"Autor", f:"pelea2.mp3", c:"portada2.jpg"},
  ],
  fin: [
    // {t:"Nombre", a:"Autor", f:"fin1.mp3"},
  ],
};
