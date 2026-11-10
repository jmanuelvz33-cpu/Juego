// ============================================================
//  MODO HISTORIA  — aquí editas TODO el guión.
//
//  Cada línea es:  ["quién", "expresión", "texto"]
//     quién      = clave del personaje (megumi, mantis, esbirro...) o "" para el narrador (sale en cursiva y sin nombre)
//     expresión  = normal, feliz, triste, enojado, sorpresa, nervioso (o un número). Si falta esa imagen usa la normal.
//  Imágenes: primero busca en la carpeta img_historia/ y luego en img/:  PERSONAJE_novela_NUMERO.png (o .webp). El esbirro: esbirro_novela_1.png
//  ["@batalla"] = aquí empieza la pelea. Lo de "antes" va antes de pelear y lo de "despues" al ganar.
//  "rivales" = texto del menú (ej. "2 rivales"). "rivales:false" = capítulo sin pelea (sin "@batalla"). ["@fondo","nombre"] cambia el fondo en medio del capítulo (lista "fondos"). "requiere" = id del capítulo que hay que terminar antes.
//  "reparto" = de izquierda a derecha, quién sale en pantalla (cada uno aparece cuando habla por primera vez).
//
//  FONDO Y MÚSICA DE CADA CAPÍTULO (todo opcional: lo que dejes vacío usa lo de siempre)
//     fondo   = imagen de fondo para las escenas y la pelea. Puede ser un link o varios nombres a probar.
//               Por defecto busca img_historia/ID_fondo.webp, .jpg o .png  (ej. img_historia/piloto_fondo.jpg)
//     musica.hablar  = canciones mientras se leen las escenas   (archivos en la carpeta musica_historia/)
//     musica.batalla = canciones durante la pelea
//        cada canción: {t:"Título", a:"Autor", f:"archivo.mp3", c:"portada.jpg"}  (c es opcional y va también en musica_historia/)
//        Si el archivo no está subido todavía, se usa la música normal del juego.
// ============================================================
// Música de TODOS los capítulos (la misma). Para darle una propia a un capítulo, cambia su "musica".
const MUS_HABLAR  = [{t: "Capítulo piloto", a: "", f: "piloto_hablar.mp3"}];
const MUS_BATALLA = [{t: "Capítulo piloto — batalla", a: "", f: "piloto_batalla.mp3"}];
window.HISTORIA = {
  piloto: {
    titulo: "Capítulo piloto",
    sub: "Un lugar vacío",
    reparto: ["megumi", "mantis", "esbirro"],
    musica: {hablar: MUS_HABLAR, batalla: MUS_BATALLA},
    nombres: {megumi: "Megumi", mantis: "Mantis", esbirro: "Esbirro de Dio"},
    antes: [
      ["", "", "Megumi se levanta de lo que parece una caída dura."],
      ["megumi", "normal", "Ahora, ¿qué clase de maldición me puso aquí…? Parece un lugar vacío…"],
      ["", "", "Una presencia no humana lo toca por detrás. Megumi se gira."],
      ["megumi", "enojado", "¿Quién eres? ¿Por qué te ves así?"],
      ["mantis", "nervioso", "¡Uh! Te siento muy nervioso… Espera, déjame hablarte un rato. Yo estoy perdida, igual que tú, pero no quiero hacerte daño."],
      ["megumi", "enojado", "No me mires con cara de idiota. No voy a confiar en una desconocida tan fácil. Y además, ¿cómo es eso de que sientes a la gente? Es una invasión a mi privacidad."],
      ["mantis", "sorpresa", "¡Está bien! No siento nada ahora… Bueno, te siento un poco nervioso, pero ahora sí te dejo."],
      ["megumi", "enojado", "Si sigues así, probablemente haga algo que no te guste…"],
      ["", "", "Escuchan un ruido y se giran. Una criatura se acerca."],
      ["esbirro", "normal", "¡Ah, humanos! ¡Jejejejeje! ¡El lord Dio estará contento con su sangre!"],
      ["megumi", "normal", "¿Qué mierda hace un vampiro aquí? Igual, acabaré rápido contigo."],
      ["mantis", "feliz", "¡Yo también ayudo!"],
      ["megumi", "enojado", "Lejos de mí."],
      ["@batalla"],
    ],
    despues: [
      ["", "", "El esbirro de Dio cae derrotado."],
      ["megumi", "normal", "Esto está siendo muy peligroso. Mejor empiezo a buscar a alguno de mis compañeros, o al menos un refugio."],
      ["", "", "Megumi camina y Mantis lo sigue."],
      ["megumi", "normal", "¿Tú qué…?"],
      ["mantis", "normal", "Necesitas a alguien que te ayude."],
      ["megumi", "normal", "…Ven de una vez."],
      ["", "", "Ambos se van. Fin del capítulo."],
    ],
  },
  cap1: {
    titulo: "Capítulo 1",
    sub: "Dos perdidos juntos",
    rivales: "2 rivales",
    requiere: "piloto",          // se desbloquea al terminar el piloto
    reparto: ["megumi", "mantis"],
    musica: {hablar: MUS_HABLAR, batalla: MUS_BATALLA},
    nombres: {megumi: "Megumi", mantis: "Mantis"},
    antes: [
      ["", "", "Megumi se detiene, mira alrededor y suelta un suspiro corto."],
      ["megumi", "normal", "…No vamos a ningún lado. Esto no tiene sentido."],
      ["", "", "Mantis se sienta en el tronco y lo mira un momento en silencio."],
      ["mantis", "normal", "Pues… al menos aquí no nos están atacando. Eso ya es algo, ¿no?"],
      ["megumi", "normal", "…"],
      ["mantis", "feliz", "Si quieres podemos quedarnos un rato. No tiene que ser nada raro."],
      ["megumi", "triste", "La verdad es que no sé, a mí eso no me parece una buena idea. Solo quiero encontrar a mis compañeros, si es que cayeron conmigo aquí. Porque si no, estaré atrapado con una desconocida."],
      ["mantis", "enojado", "Soy Mantis, en primer lugar. Y no seas así. En el fondo siento que tienes miedo de estar solo y de no encontrar a nadie. Podemos juntarnos, yo estoy dispuesta a ser amiga tuya si eso te sirve."],
      ["megumi", "nervioso", "Apenas nos conocemos, pero supongo que vale la pena intentarlo. Al menos esta vez."],
      ["megumi", "normal", "…Está bien. Podemos ir juntos. Por ahora."],
      ["", "", "Mantis sonríe y da una palmada suave."],
      ["mantis", "feliz", "Trato hecho. Aunque todavía no sé si somos un dúo o solo dos perdidos juntos."],
      ["", "", "Mantis aplaude suavemente."],
      ["mantis", "feliz", "¡Bien! Pues, ¿de qué quieres hablar?"],
      ["", "", "Megumi se queda callado un largo rato."],
      ["megumi", "normal", "¿Cómo se llaman tus amigos?"],
      ["mantis", "feliz", "Pues uno es un mapache llamado Rocket, es bueno con la tecnología, y otro llamado Quill, un gran amigo. Escucha música de su planeta, es muy bonita y…"],
      ["", "", "Megumi la detiene."],
      ["megumi", "enojado", "Te pedí nombres, no sus descripciones. Pues yo tengo a Itadori y a Nobara. Si tengo suerte, quizás encuentre a Gojo."],
      ["mantis", "feliz", "¡Lo haremos! Dos es mejor que uno."],
      ["", "", "De pronto se oyen movimientos entre los arbustos. Aparecen un lagarto zombie y un lobo."],
      ["megumi", "sorpresa", "Esto parece sacado de un libro de fantasía."],
      ["mantis", "normal", "Esto es normal comparado con lo que veo con los Guardianes. ¿Quieren huir?"],
      ["megumi", "normal", "No es necesario."],
      ["@batalla"],
    ],
    despues: [
      ["", "", "Mantis se limpia el sudor de la frente y mira a Megumi con una sonrisa."],
      ["mantis", "sorpresa", "Wow… tus invocaciones son de lo más interesantes. Destrozaste a un lobo usando a otro lobo."],
      ["megumi", "normal", "Tengo más. Por ahora solo usaré esas."],
      ["mantis", "feliz", "Igual me tienes a mí para curarte. Aunque… deberías cuidar un poco más tu defensa."],
      ["megumi", "normal", "Ya lo mejoraré después."],
      ["", "", "Mantis mira hacia adelante y se tensa un poco, como si notara algo."],
      ["mantis", "nervioso", "Oye… encontré una señal de vida. Se siente tranquila, más lejos. ¿Vamos a buscarla?"],
      ["megumi", "normal", "Tienes demasiada energía."],
      ["", "", "Ambos se ponen en marcha. Fin del capítulo."],
    ],
  },
  cap2: {
    titulo: "Capítulo 2",
    sub: "La cabaña",
    rivales: false,              // false = capítulo sin pelea
    requiere: "cap1",
    reparto: ["megumi", "mantis", "gato"],
    // fondos que cambian dentro del capítulo: ["@fondo","nombre"] busca img_historia/cap2_NOMBRE.(webp|jpg|png)
    fondos: ["bosque", "cabana", "sotano"],
    musica: {hablar: MUS_HABLAR},
    nombres: {megumi: "Megumi", mantis: "Mantis", gato: "Gato mago"},
    antes: [
      ["@fondo", "bosque"],
      ["", "", "Dejan de caminar para ver qué estaba oscureciendo. El bosque se veía cada vez más oscuro."],
      ["mantis", "nervioso", "Se está volviendo peligroso estar así en el bosque."],
      ["megumi", "normal", "Lo sé, y no quiero gastar más energía peleando. Dijiste que había algo más tranquilo. Dime dónde está."],
      ["", "", "Mantis mira hacia abajo y siente el latido de alguien, o algo parecido. Levanta la vista y corre hacia esa dirección. Megumi la sigue."],
      ["@fondo", "cabana"],
      ["", "", "Al llegar ven una cabaña."],
      ["mantis", "nervioso", "Debe haber alguien aquí, pero hay que tener cuidado. No sabemos qué podemos encontrarnos."],
      ["megumi", "normal", "Solo espero no pelear otra vez."],
      ["", "", "Se acercan y abren la puerta con cuidado. Como no hay nada abajo, suben al sótano."],
      ["@fondo", "sotano"],
      ["mantis", "normal", "Definitivamente hay alguien."],
      ["megumi", "enojado", "Mantente alerta."],
      ["", "", "Luego oyen el sonido de una rampa rompiéndose. Megumi invoca a su lobo y Mantis levanta los brazos, pero después miran abajo y ven a un gato antropomorfo con ropa de mago."],
      ["gato", "sorpresa", "¡Aaah! ¿Qué hacen aquí? ¡No se roben nada! Yo, emm… no puedo defenderme de la mejor manera, ¡pero los haré sufrir! ¡Y de dónde sacaron ese lobo!"],
      ["", "", "El gato salta asustado y se sube al techo."],
      ["mantis", "nervioso", "Oye, no te haremos daño… tú tranquilo."],
      ["", "", "Mantis lo dice algo nerviosa."],
      ["megumi", "sorpresa", "Uy, lo siento."],
      ["", "", "El lobo desaparece."],
      ["megumi", "normal", "Tampoco venimos a pelear, solo queremos descansar."],
      ["", "", "El gato baja."],
      ["gato", "nervioso", "No confío mucho en ustedes, pero si no me atacaron de primera, supongo que… me van a atacar por la espalda después."],
      ["mantis", "enojado", "¡Que no te vamos a hacer daño! Megumi, ayúdame."],
      ["megumi", "normal", "No lastimo a gente que no lo merece, y tú no has hecho nada malo. Además, al menos tiene conciencia, no como los otros que vimos."],
      ["gato", "normal", "Bueno, igual no confío, pero pueden quedarse. Eso sí, estaré despierto toda la noche por si se atreven a hacer algo."],
      ["", "", "Mantis se lanza a la cama y Megumi solo se sienta."],
      ["megumi", "normal", "De acuerdo, no hay problema… ¿señor?"],
      ["gato", "feliz", "Mago miau."],
      ["megumi", "enojado", "No voy a decir eso."],
      ["gato", "normal", "Entonces no digas nada."],
      ["mantis", "feliz", "Es bueno conocer a alguien que no nos quiere matar. ¡Es un placer conocerte, mago miau! Soy Mantis, y este es Megumi."],
      ["gato", "normal", "Umm, bueno. Soy un mago que está viendo y conociendo este mundo. Quizás sea el momento perfecto para…"],
      ["", "", "Ambos ya están dormidos."],
      ["gato", "triste", "Hablemos más tarde, supongo… miau."],
      ["", "", "Fin del capítulo."],
    ],
    despues: [],
  },
};

(function(){
  const H=window.HISTORIA||{};
  const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const D=window.DIALOGOS||{};
  const EXP=Object.assign({normal:1,feliz:2,triste:3,enojado:4,sorpresa:5,nervioso:6},D.EXPRESIONES||{});
  const numExp=e=>/^\d+$/.test(String(e))?+e:(EXP[e]||1);
  const css=document.createElement('style');
  css.textContent=`
  .vn.hs .esc{gap:1.5%;justify-content:center}
  .vn.hs .esc img{transition:filter .25s,transform .25s;max-width:34%}
  .vn.hs .esc img.at{filter:brightness(.4) saturate(.6) drop-shadow(0 8px 18px rgba(0,0,0,.6))}
  .vn.hs .esc img.hl{transform:scale(1.04)}
  .vn.hs .caja.nar{border-color:var(--line)}
  .vn.hs .caja.nar .nom{display:none}
  .vn.hs .caja.nar .txt{font-style:italic;color:#c9d1e0}
  .vn.hs .esc img:not([class*="x-"]){animation:entra .35s ease-out}
  .hs-bar{display:flex;gap:8px;justify-content:flex-end;align-items:center}
  .hs-cap{display:grid;gap:12px;margin:12px 0}
  .hs-c{position:relative;background:var(--card);border:1px solid var(--line);border-left:.35em solid var(--ac);padding:14px 16px;display:flex;align-items:center;gap:14px;justify-content:space-between;flex-wrap:wrap;
    clip-path:polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)}
  .hs-c h2{margin:0;font-family:var(--f-titulo);font-weight:400;text-transform:uppercase;letter-spacing:.05em;font-size:1.15rem}
  .hs-c small{display:block;color:var(--mut);margin-top:3px}
  .hs-c.bloq{opacity:.55;border-left-color:var(--line)}
  .hs-ok{color:var(--ok);font-weight:800}
  @media (orientation:landscape) and (min-width:700px){
    main:has(.hsm){max-width:760px}
    .vn.hs .esc img{max-width:30%}
  }
  @media (orientation:landscape) and (max-height:520px){
    .hs-c{padding:8px 12px}.hs-c h2{font-size:.95rem}.hs-cap{gap:8px;margin:6px 0}
  }`;
  document.head.appendChild(css);
  const U=window.UI=window.UI||{};
  const mal=new Set();let N=null,tm=null;
  const hecho=c=>{try{return !!localStorage.getItem('hist_'+c)}catch(e){return false}};
  const marcar=c=>{try{localStorage.setItem('hist_'+c,'1')}catch(e){}};

  // ---------- fondo y música propios del capítulo ----------
  const existe=async url=>{
    try{const c=new AbortController();const r=await fetch(url,{headers:{Range:'bytes=0-0'},signal:c.signal});c.abort();return r.ok}catch(e){return false}
  };
  const imgOk=url=>new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src=url});
  async function preparar(id){
    const cap=H[id],U=window.UI;
    if(cap._ok)return;
    cap._ok=true;
    // fondo
    let c=cap.fondo;c=c?(Array.isArray(c)?c:[c]):['img_historia/'+id+'_fondo','img/historia_'+id+'_fondo'].flatMap(b=>['webp','jpg','jpeg','png'].map(e=>`/${b}.${e}`));
    cap._fondo='';
    for(const u of c){if(await imgOk(u)){cap._fondo=u;break}}
    // fondos que cambian dentro del capítulo
    cap._fondos={};
    for(const n of (cap.fondos||[])){
      for(const e of ['webp','jpg','jpeg','png']){const u=`/img_historia/${id}_${n}.${e}`;if(await imgOk(u)){cap._fondos[n]=u;break}}
    }
    // música: solo las canciones cuyo archivo existe; si no hay, usa la del juego
    const M=window.MUSICA=window.MUSICA||{},m=cap.musica||{};
    for(const [g,base] of [['hablar','bazar'],['batalla','pelea']]){
      const ok=[];
      for(const t of (m[g]||[])){if(t&&t.f&&await existe('/musica_historia/'+encodeURIComponent(t.f)))ok.push(Object.assign({d:'musica_historia'},t))}
      M['hist_'+id+'_'+g]=ok.length?ok:(M[base]&&M[base].length?M[base]:(M.menu||[]));
    }
  }
  function ambiente(id){
    const U=window.UI;U.fondoHist=(H[id]&&H[id]._fondo)||'';
  }

  function cand(k,exp){
    const n=numExp(exp),l=[];
    ['img_historia','img'].forEach(c=>{[n,1].filter((x,i,a)=>a.indexOf(x)===i).forEach(m=>l.push(`/${c}/${k}_novela_${m}.png`,`/${c}/${k}_novela_${m}.webp`))});
    ['img_historia','img'].forEach(c=>l.push(`/${c}/${k}_normal.png`,`/${c}/${k}_normal.webp`));
    const p=(typeof PJ!=='undefined')&&PJ.find(x=>x.key===k);
    if(p&&p.gif)l.push(p.gif);
    return l.filter(u=>!mal.has(u));
  }
  const fb=im=>{mal.add(im.getAttribute('src'));
    const l=JSON.parse(im.dataset.c||'[]').filter(u=>!mal.has(u));
    if(l.length){im.dataset.c=JSON.stringify(l);im.src=l[0]}else im.style.visibility='hidden'};
  window.HS_fb=fb;

  // dibuja los personajes que ya salieron; el que habla se ve claro y los demás oscuros
  function escena(quien,exp){
    const cap=N.cap,box=document.getElementById('hsesc');if(!box)return;
    if(quien&&!N.vistos.has(quien))N.vistos.add(quien);
    N.exp[quien]=exp||N.exp[quien]||'normal';
    const orden=cap.reparto.filter(k=>N.vistos.has(k));
    // si cambió quién está, reconstruye; si no, solo actualiza
    if(box.dataset.o!==orden.join()){
      box.dataset.o=orden.join();
      box.innerHTML=orden.map(k=>{const l=cand(k,N.exp[k]);
        return `<img alt="" data-k="${k}" data-e="${esc(N.exp[k]||'normal')}" src="${esc(l[0]||'')}" data-c='${esc(JSON.stringify(l.slice(1)))}' onerror="HS_fb(this)">`}).join('');
    }
    box.querySelectorAll('img').forEach(im=>{
      const k=im.dataset.k;
      if(k===quien&&im.dataset.e!==String(N.exp[k])){const l=cand(k,N.exp[k]);im.dataset.e=String(N.exp[k]);
        im.style.visibility='visible';im.dataset.c=JSON.stringify(l.slice(1));im.src=l[0]||''}
      if(window.EXPR){if(k===quien)EXPR.aplicar(im,N.exp[k]);else{EXPR.limpiar(im)}}
      im.classList.toggle('at',!!quien&&k!==quien);
      im.classList.toggle('hl',!!quien&&k===quien);
    });
  }
  function linea(){
    if(!N)return;
    if(tm){clearInterval(tm);tm=null}
    const arr=N.fase==='antes'?N.cap.antes:N.cap.despues,l=arr[N.i];
    if(!l)return fin();
    if(l[0]==='@batalla')return U.histBatalla();
    if(l[0]==='@fondo'){U.fondoHist=(N.cap._fondos&&N.cap._fondos[l[1]])||N.cap._fondo||'';U.fondo('novela');N.i++;return linea()}
    const [q,exp,tx]=l;
    escena(q,exp);
    const caja=document.getElementById('hscaja'),nom=document.getElementById('hsnom'),t=document.getElementById('hstxt'),sig=document.getElementById('hssig');
    if(!t)return;
    caja.classList.toggle('nar',!q);
    nom.textContent=q?(N.cap.nombres[q]||q):'';
    sig.style.display='none';t.textContent='';
    let i=0;
    N.fin=()=>{clearInterval(tm);tm=null;t.textContent=tx;sig.style.display='';N.fin=null;N.listo=true};
    N.listo=false;
    tm=setInterval(()=>{i+=2;t.textContent=tx.slice(0,i);if(i>=tx.length)N.fin()},22);
  }
  const hayPelea=cap=>(cap.antes||[]).some(l=>l[0]==='@batalla');
  function fin(){
    if(N.fase==='antes'&&hayPelea(N.cap))return U.histBatalla();
    marcar(N.id);
    U.histMenu();
  }
  window.HS_tap=function(){
    if(!N)return;
    if(N.fin){N.fin();return}
    N.i++;linea();
  };
  function ajusta(){
    const v=document.querySelector('.vn.hs');if(!v)return;
    v.style.height=matchMedia('(orientation:landscape) and (min-width:700px)').matches?Math.max(260,innerHeight-v.getBoundingClientRect().top-10)+'px':'';
  }
  window.addEventListener('resize',ajusta);
  document.addEventListener('keydown',e=>{
    if(!N||!document.getElementById('hscaja'))return;
    if(e.key===' '||e.key==='Enter'){e.preventDefault();window.HS_tap()}
  });

  function pantalla(fase){
    const cap=N.cap;
    ambiente(N.id);musica('hist_'+N.id+'_hablar');
    $('#app').innerHTML=barra(`<button class="sec" onclick="UI.histSalir()">⬅️ Salir</button>`)+
    `<div class="vn hs"><div class="arr"><h1 style="margin:0">${esc(cap.titulo)}</h1><div class="hs-bar"><button class="sec" onclick="UI.histSaltar()">⏭️ ${fase==='antes'&&hayPelea(cap)?'Saltar a la pelea':'Saltar'}</button></div></div>
      <div class="esc" id="hsesc"></div>
      <div class="caja" id="hscaja" onclick="HS_tap()"><div class="nom" id="hsnom"></div><div class="txt" id="hstxt"></div><span class="sig" id="hssig">▼</span></div>
      <div class="opc"></div></div>`;
    ajusta();
    N.fase=fase;N.i=0;N.vistos=N.vistos||new Set();N.exp=N.exp||{};
    if(fase==='despues'){const pers=['megumi','mantis'];pers.forEach(k=>N.vistos.add(k))}
    linea();
  }

  // ---------- menú de capítulos ----------
  U.histMenu=function(){
    N=null;HIST=null;if(tm){clearInterval(tm);tm=null}
    U.fondoHist='';musica('bazar');
    const ids=Object.keys(H);
    $('#app').innerHTML=barra(`<button class="sec" onclick="bazar('inicio')">⬅️ Bazar</button>`)+
    `<div class="hsm"><h1>📖 Modo historia</h1><div class="burnice">Megumi y Mantis, un viaje por el mundo… y alguien que los quiere de cena.</div>
    <div class="hs-cap">${ids.map(id=>{const c=H[id],bl=c.requiere&&!hecho(c.requiere);
      return bl?`<div class="hs-c bloq"><div><h2>${esc(c.titulo)}</h2><small>🔒 Termina "${esc(H[c.requiere].titulo)}" para abrirlo</small></div></div>`:
      `<div class="hs-c"><div><h2>${esc(c.titulo)} ${hecho(id)?'<span class="hs-ok">✓</span>':''}</h2><small>${esc(c.sub||'')} · ${c.rivales===false?'Sin pelea':'Megumi + Mantis vs. '+esc(c.rivales||'1 rival')}</small></div>
      <button class="btn-burnice" onclick="UI.hist('${id}')">${hecho(id)?'🔁 Repetir':'▶ Empezar'}</button></div>`}).join('')}
      <div class="hs-c bloq"><div><h2>Capítulo ${ids.length}</h2><small>🔒 Próximamente</small></div></div></div>
    <div class="fila"><button class="sec" onclick="bazar('inicio')">⬅️ Bazar</button></div></div>`;
  };
  U.hist=async function(id){
    if(!H[id])return;
    await preparar(id);
    N={id,cap:H[id],vistos:new Set(),exp:{},fin:null};
    pantalla('antes');
  };
  U.histSalir=function(){
    if(tm){clearInterval(tm);tm=null}
    N=null;U.histMenu();
  };
  U.histSaltar=function(){
    if(!N)return;
    if(tm){clearInterval(tm);tm=null}
    N.fin=null;
    if(N.fase==='antes'&&hayPelea(N.cap))U.histBatalla();else{marcar(N.id);U.histMenu()}
  };
  // ---------- la pelea (2 contra 1) ----------
  U.histBatalla=async function(){
    if(tm){clearInterval(tm);tm=null}
    const id=N&&N.id||U._hid;U._hid=id;
    const r=await api('/api/historia',{cap:id});
    if(r.error)return alert(r.error);
    await preparar(id);ambiente(id);
    HIST={id,musica:'hist_'+id+'_batalla'};MODO='cpu';SEQ=0;SALA=null;
    G=r.id;S=r.estado;sel=0;tgt=null;tgtAli=null;CBT.reset();
    N=null;
    await UI2.versus();
    dibujarCombate();CBT.inicio();
    if(r.pasos.length)await reproducir(r.pasos);
  };
  // ---------- tras la pelea ----------
  U.histPost=function(){
    const id=(typeof HIST!=='undefined'&&HIST&&HIST.id)||U._hid;
    HIST=null;
    N={id,cap:H[id],vistos:new Set(['megumi','mantis']),exp:{},fin:null};
    pantalla('despues');
  };
})();
