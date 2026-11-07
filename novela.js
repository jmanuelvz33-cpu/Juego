// "La mesa" como novela visual: hablar con un personaje (o con Burnice) haciéndole preguntas.
// Los textos están en dialogos.js; las imágenes en la carpeta img/ (ver tutorial). No necesitas tocar este archivo.
(function(){
  const D=window.DIALOGOS||{},I=window.INTERFAZ||{};
  const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const NIV=D.NIVELES||[3,10],NN=D.NOMBRES_NIVEL||['Conocidos','Amigos','Compañeros de batalla'];
  const css=document.createElement('style');
  css.textContent=`
  .vn{display:flex;flex-direction:column;min-height:calc(100vh - 110px)}
  .vn .arr{display:flex;justify-content:space-between;align-items:center;gap:8px}
  .vn .conf{font-size:.78rem;color:var(--mut);text-align:right}
  .vn .conf b{color:#ff6b8a}
  .vn .esc{flex:1;display:flex;align-items:flex-end;justify-content:center;min-height:36vh;padding-top:6px}
  .vn .esc img{max-height:54vh;max-width:92%;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(0,0,0,.6));animation:flota 4s ease-in-out infinite,entra .35s ease-out}
  @keyframes flota{50%{transform:translateY(-6px)}}
  @keyframes entra{from{opacity:0;transform:translateY(10px)}}
  .vn .caja{position:relative;background:rgba(6,10,16,.93);border:2px solid var(--ac);border-radius:14px;padding:18px 14px 12px;margin-top:6px;min-height:92px;cursor:pointer}
  .vn .caja .nom{position:absolute;top:-14px;left:12px;background:var(--ac);color:var(--ac-tx);font-weight:800;padding:2px 12px;border-radius:10px;font-size:.88rem}
  .vn .caja .txt{font-size:1rem;line-height:1.45;min-height:3em}
  .vn .caja .sig{position:absolute;right:12px;bottom:6px;color:var(--ac);animation:parp 1s steps(2) infinite}
  @keyframes parp{50%{opacity:0}}
  .vn .opc{display:grid;gap:7px;margin-top:10px}
  .vn .opc button{background:var(--card2);border:1px solid var(--line);text-align:left;padding:10px 12px;font-size:.92rem}
  .vn .opc button{font-family:var(--f-texto);text-transform:none;letter-spacing:0;font-weight:600}
  .vn .opc button.hecha{border-color:#52e08a66;color:#c9d1e0}
  .vn .opc button.sal{background:var(--card2);text-align:center}
  .vn .opc button.otra{background:var(--ac);color:var(--ac-tx);border-color:var(--ac);text-align:center}

  /* ---------- HORIZONTAL (PC y celular girado): personaje al centro, preguntas a los lados, texto abajo al centro ---------- */
  @media (orientation:landscape) and (min-width:700px){
    main:has(.vn){max-width:1200px;padding-top:4px}
    .vn{display:grid;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr) auto;min-height:0;position:relative;overflow:hidden}
    body:has(.vn) #mus{right:auto;left:50%;transform:translateX(-50%) scale(.55);transform-origin:top center}
    .vn .arr h1{display:none}.vn .arr{justify-content:flex-end}
    .vn .arr{grid-row:1;grid-column:1}
    .vn .esc,.vn .opc{grid-row:2;grid-column:1;min-height:0}
    .vn .esc{padding:0;align-items:flex-end;position:relative}
    .vn{--nv-alto:1.1}   /* tamaño del personaje en horizontal: 1 = normal, 1.15 = 15% más grande */
    .vn .esc img{height:calc(100% * var(--nv-alto));max-height:none;max-width:60%;width:auto;object-fit:contain;object-position:bottom}
    .vn .opc{margin:0;z-index:2;pointer-events:none;align-content:center;align-items:center;gap:8px 0;
      grid-template-columns:minmax(0,1fr) minmax(0,34%) minmax(0,1fr);padding:0 1%}
    .vn .opc button{pointer-events:auto;width:100%;font-size:.9rem;background:rgba(6,10,16,.88)}
    .vn .opc button:nth-child(odd){grid-column:1}
    .vn .opc button:nth-child(even){grid-column:3;text-align:right;border-left:0;border-right:.3em solid var(--ac);
      clip-path:polygon(var(--corte) 0,100% 0,100% 100%,0 100%);padding:.65em .9em .65em 1.5em}
    .vn .opc button.sal,.vn .opc button.otra{text-align:center}
    .vn .caja{grid-row:3;grid-column:1;width:min(860px,94%);justify-self:center;margin:6px 0 0}
  }
  @media (orientation:landscape) and (max-height:520px){
    .vn h1{font-size:1rem}.vn .conf{font-size:.66rem}
    .vn .opc button{font-size:.72rem;padding:.4em .7em}
    .vn .caja{min-height:64px;padding:14px 12px 8px;border-radius:10px}
    .vn .caja .txt{font-size:.82rem;line-height:1.35;min-height:2.6em}
  }
  `;
  document.head.appendChild(css);
  const U=window.UI=window.UI||{};
  const ESP=k=>k==='burnice'||k==='niko';
  const mal=new Set();let N={},tm=null;
  const nombre=k=>k==='burnice'?'🔥 Burnice':k==='niko'?'☀️ Niko':((typeof PJ!=='undefined'&&PJ.find(x=>x.key===k)||{}).nombre||k);
  // Expresiones: el 1 es la normal. Puedes escribir en dialogos.js el nombre ("feliz") o el número (2).
  // Imagen que busca: img/PERSONAJE_novela_NUMERO.png (o .webp). Si falta ese número usa el 1; si tampoco, la imagen de antes.
  const EXP=Object.assign({normal:1,feliz:2,triste:3,enojado:4,sorpresa:5,nervioso:6},D.EXPRESIONES||{});
  const numExp=e=>/^\d+$/.test(String(e))?+e:(EXP[e]||1);
  function cand(k,exp){
    const n=numExp(exp),l=[];
    [n,1].filter((x,i,a)=>a.indexOf(x)===i).forEach(m=>{l.push(`/img/${k}_novela_${m}.png`,`/img/${k}_novela_${m}.webp`)});
    l.push(`/img/${k}_normal.png`);
    const p=(typeof PJ!=='undefined')&&PJ.find(x=>x.key===k);
    if(k==='burnice'&&I.BIENVENIDA_IMG)l.push(I.BIENVENIDA_IMG);else if(k==='niko'&&typeof BZ!=='undefined'&&BZ&&BZ.imgs&&BZ.imgs.niko)l.push(BZ.imgs.niko);else if(p&&p.gif)l.push(p.gif);
    return l.filter(u=>!mal.has(u));
  }
  U.nvFb=function(im){
    mal.add(im.getAttribute('src'));
    const l=JSON.parse(im.dataset.c||'[]').filter(u=>!mal.has(u));
    if(l.length){im.dataset.c=JSON.stringify(l);im.src=l[0]}else im.style.visibility='hidden';
  };
  function sprite(exp){
    const im=$("#nvspr");if(!im)return;exp=String(exp);
    const l=cand(N.k,exp);if(!l.length){im.style.visibility='hidden';return}
    if(im.dataset.exp===exp&&im.style.visibility!=='hidden')return;
    im.dataset.exp=exp;im.dataset.c=JSON.stringify(l);im.style.visibility='visible';
    im.style.animation='none';void im.offsetWidth;im.style.animation='';
    im.src=l[0];
  }
  function nivel(){
    const w=ESP(N.k)?0:(typeof YO!=='undefined'&&YO.vic_pj&&YO.vic_pj[N.k])||0;
    N.w=w;return w>=NIV[1]?2:w>=NIV[0]?1:0;
  }
  function confH(){
    if(ESP(N.k))return '<div class="conf">'+(N.k==='niko'?'Siempre tiene algo que contar ☀️':'Siempre tiene algo que contar 🔥')+'</div>';
    const l=N.nv,h='❤️'.repeat(l+1)+'🤍'.repeat(2-l);
    const falta=l<2?` · ${NIV[l]-N.w} victoria${NIV[l]-N.w==1?'':'s'} más para subir`:'';
    return `<div class="conf">${h} <b>${NN[l]}</b><br>${N.w} victoria${N.w==1?'':'s'} con él/ella${falta}</div>`;
  }
  function decir(l,despues){
    if(tm)clearInterval(tm);
    const [exp,tx]=l;sprite(exp||'normal');
    const t=$('#nvtxt'),sig=$('#nvsig');if(!t)return;
    const texto=tx;let i=0;sig.style.display='none';$('#nvopc').innerHTML='';
    N.fin=()=>{clearInterval(tm);tm=null;t.textContent=texto;sig.style.display='';despues&&despues();N.fin=null};
    tm=setInterval(()=>{i+=2;t.textContent=texto.slice(0,i);if(i>=texto.length)N.fin()},22);
  }
  function opciones(){
    const d=N.d,o=$('#nvopc');if(!o)return;
    let h=N.lista.map(i=>`<button class="${N.hechas.has(i)?'hecha':''}" onclick="UI.nvPreg(${i})">${N.hechas.has(i)?'✓ ':'💬 '}${esc(d.preguntas[i].q)}</button>`).join('');
    if(ESP(N.k))h+=`<button class="otra" onclick="UI.nvOtras()">🎲 Otras preguntas</button>`;
    h+=`<button class="sal" onclick="UI.nvSalir()">👋 Despedirse</button>`;
    o.innerHTML=h;
  }
  function sacar(){
    const d=N.d,n=d.preguntas.length;
    if(!ESP(N.k)){N.lista=[...Array(n).keys()];return}
    const rest=[...Array(n).keys()].filter(i=>!(N.lista||[]).includes(i));
    const base=rest.length>=5?rest:[...Array(n).keys()];
    N.lista=base.sort(()=>Math.random()-.5).slice(0,5);
  }
  U.nvPreg=function(i){
    if(N.fin)return;
    const p=N.d.preguntas[i];N.hechas.add(i);
    const r=p.r[Math.min(N.nv,p.r.length-1)];
    decir(r,opciones);
  };
  U.nvOtras=function(){if(N.fin)return;sacar();opciones()};
  U.nvSalir=function(){
    if(tm){clearInterval(tm);tm=null}
    if(ESP(N.k))bazar('mesa');else bazar('personaje',{k:N.k});
  };
  // en horizontal la escena ocupa justo lo que queda de pantalla (sin scroll)
  function ajusta(){
    const v=$('.vn');if(!v)return;
    v.style.height=matchMedia('(orientation:landscape) and (min-width:700px)').matches?Math.max(260,innerHeight-v.getBoundingClientRect().top-10)+'px':'';
  }
  window.addEventListener('resize',ajusta);
  U.novela=function(k){
    musica('bazar');U.fondo&&U.fondo('novela');
    const d=D[k]||{hola:[['normal','…']],preguntas:[]};
    N={k,d,hechas:new Set(),lista:[],fin:null};
    N.nv=nivel();
    sacar();
    const nuevo=typeof YO!=='undefined'&&YO.nuevo_pj&&YO.nuevo_pj[k]&&d.gane;
    $('#app').innerHTML=barra(`<button class="sec" onclick="UI.nvSalir()">⬅️ Volver</button>`)+
    `<div class="vn"><div class="arr"><h1 style="margin:0">${esc(nombre(k))}</h1>${confH()}</div>
      <div class="esc"><img id="nvspr" alt="" onerror="UI.nvFb(this)"></div>
      <div class="caja" onclick="N_tap()"><div class="nom">${esc(nombre(k))}</div><div class="txt" id="nvtxt"></div><span class="sig" id="nvsig">▼</span></div>
      <div class="opc" id="nvopc"></div></div>`;
    ajusta();
    const hola=d.hola[Math.min(N.nv,d.hola.length-1)];
    if(nuevo){
      api('/api/visto',{key:k});YO.nuevo_pj[k]=false;
      decir(d.gane,()=>{N.cola=1;$('#nvopc').innerHTML=`<button class="otra" onclick="UI.nvHola()">▶ Continuar</button>`});
      N.hola=hola;
    }else decir(hola,opciones);
  };
  U.nvHola=function(){decir(N.hola,opciones)};
  window.N_tap=function(){if(N.fin)N.fin()};
})();

