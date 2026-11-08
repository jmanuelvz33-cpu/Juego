// ============================================================
//  MODO HISTORIA  — aquí editas TODO el guión.
//
//  Cada línea es:  ["quién", "expresión", "texto"]
//     quién      = clave del personaje (megumi, mantis, esbirro...) o "" para el narrador (sale en cursiva y sin nombre)
//     expresión  = normal, feliz, triste, enojado, sorpresa, nervioso (o un número). Si falta esa imagen usa la normal.
//  Imágenes: img/PERSONAJE_novela_NUMERO.png (o .webp), igual que en La mesa. El esbirro usa img/esbirro_novela_1.png
//  ["@batalla"] = aquí empieza la pelea. Lo de "antes" va antes de pelear y lo de "despues" al ganar.
//  "reparto" = de izquierda a derecha, quién sale en pantalla (cada uno aparece cuando habla por primera vez).
// ============================================================
window.HISTORIA = {
  piloto: {
    titulo: "Capítulo piloto",
    sub: "Un lugar vacío",
    reparto: ["megumi", "mantis", "esbirro"],
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
  .vn.hs .esc img{animation:entra .35s ease-out}
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

  function cand(k,exp){
    const n=numExp(exp),l=[];
    [n,1].filter((x,i,a)=>a.indexOf(x)===i).forEach(m=>l.push(`/img/${k}_novela_${m}.png`,`/img/${k}_novela_${m}.webp`));
    l.push(`/img/${k}_normal.png`,`/img/${k}_normal.webp`);
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
  function fin(){
    if(N.fase==='antes')return U.histBatalla();
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
    musica('bazar');U.fondo&&U.fondo('novela');
    $('#app').innerHTML=barra(`<button class="sec" onclick="UI.histSalir()">⬅️ Salir</button>`)+
    `<div class="vn hs"><div class="arr"><h1 style="margin:0">${esc(cap.titulo)}</h1><div class="hs-bar"><button class="sec" onclick="UI.histSaltar()">⏭️ ${fase==='antes'?'Saltar a la pelea':'Saltar'}</button></div></div>
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
    N=null;if(tm){clearInterval(tm);tm=null}
    musica('bazar');U.fondo&&U.fondo('novela');
    const ids=Object.keys(H);
    $('#app').innerHTML=barra(`<button class="sec" onclick="bazar('inicio')">⬅️ Bazar</button>`)+
    `<div class="hsm"><h1>📖 Modo historia</h1><div class="burnice">Megumi y Mantis, un viaje por el mundo… y alguien que los quiere de cena.</div>
    <div class="hs-cap">${ids.map((id,n)=>`<div class="hs-c"><div><h2>${esc(H[id].titulo)} ${hecho(id)?'<span class="hs-ok">✓</span>':''}</h2><small>${esc(H[id].sub||'')} · Megumi + Mantis vs. 1 rival</small></div>
      <button class="btn-burnice" onclick="UI.hist('${id}')">${hecho(id)?'🔁 Repetir':'▶ Empezar'}</button></div>`).join('')}
      <div class="hs-c bloq"><div><h2>Capítulo 1</h2><small>🔒 Próximamente</small></div></div></div>
    <div class="fila"><button class="sec" onclick="bazar('inicio')">⬅️ Bazar</button></div></div>`;
  };
  U.hist=function(id){
    if(!H[id])return;
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
    if(N.fase==='antes')U.histBatalla();else{marcar(N.id);U.histMenu()}
  };
  // ---------- la pelea (2 contra 1) ----------
  U.histBatalla=async function(){
    if(tm){clearInterval(tm);tm=null}
    const id=N&&N.id||U._hid;U._hid=id;
    const r=await api('/api/historia',{cap:id});
    if(r.error)return alert(r.error);
    HIST={id};MODO='cpu';SEQ=0;SALA=null;
    G=r.id;S=r.estado;sel=0;tgt=null;tgtAli=null;CBT.reset();
    N=null;
    dibujarCombate();CBT.inicio();
    if(r.pasos.length)await reproducir(r.pasos);
  };
  // ---------- tras la pelea ----------
  U.histPost=function(){
    const id=(typeof HIST!=='undefined'&&HIST&&HIST.id)||U._hid;
    N={id,cap:H[id],vistos:new Set(['megumi','mantis']),exp:{},fin:null};
    pantalla('despues');
  };
})();
