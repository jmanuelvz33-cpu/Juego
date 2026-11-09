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
  /* ---- expresiones con movimiento y símbolos (sirve con una sola imagen por personaje) ---- */
  .vn .esc{position:relative}
  @keyframes ex-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px) rotate(-.8deg)}40%{transform:translateX(6px) rotate(.8deg)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
  @keyframes ex-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-22px)}}
  @keyframes ex-pop{0%{transform:scale(1)}30%{transform:scale(1.13) translateY(-8px)}100%{transform:scale(1)}}
  @keyframes ex-trem{0%,100%{transform:translateX(0)}50%{transform:translateX(2px)}}
  @keyframes ex-sink{from{transform:translateY(0)}to{transform:translateY(14px)}}
  @keyframes ex-s{0%{transform:scale(0) rotate(-25deg);opacity:0}15%{transform:scale(1.35) rotate(8deg);opacity:1}30%{transform:scale(1) rotate(0)}85%{opacity:1}100%{transform:translateY(-12px);opacity:0}}
  .vn .esc img.x-enojado{animation:flota 4s ease-in-out infinite,ex-shake .12s linear 10;filter:drop-shadow(0 8px 18px rgba(0,0,0,.6)) drop-shadow(0 0 14px rgba(255,60,60,.6))}
  .vn .esc img.x-feliz{animation:flota 4s ease-in-out infinite,ex-hop .45s ease-out 2;filter:drop-shadow(0 8px 18px rgba(0,0,0,.6)) drop-shadow(0 0 12px rgba(255,220,120,.5))}
  .vn .esc img.x-sorpresa{animation:flota 4s ease-in-out infinite,ex-pop .5s ease-out 1}
  .vn .esc img.x-nervioso{animation:ex-trem .09s linear infinite}
  .vn .esc img.x-triste{animation:ex-sink .8s ease-out forwards;filter:drop-shadow(0 8px 18px rgba(0,0,0,.6)) brightness(.72) saturate(.75)}
  .vn .esc .exs{position:absolute;z-index:3;pointer-events:none;font-size:clamp(26px,5.5vw,54px);line-height:1;animation:ex-s 2.4s ease-out forwards;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}
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
    .vn{--nv-alto:1}   /* tamaño del personaje en horizontal: 1 = normal, 1.15 = 15% más grande */
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

  /* ---------- LA MESA: riel de tarjetas ---------- */
  .ms-riel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}
  .ms-c{position:relative;aspect-ratio:2/3;cursor:pointer;overflow:hidden;background:#0b1420;
    clip-path:polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%);
    transition:transform .18s,filter .18s;scroll-snap-align:center}
  .ms-c::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 35%,var(--c,var(--ac)),transparent 72%);opacity:.4;transition:opacity .18s}
  .ms-c img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 12%}
  .ms-c:hover,.ms-c:focus-visible{transform:translateY(-10px);filter:brightness(1.12)}
  .ms-c:hover::before{opacity:.75}
  .ms-ft{position:absolute;left:0;right:0;bottom:0;padding:26px 12px 12px;background:linear-gradient(transparent,rgba(3,6,10,.92) 55%);border-bottom:4px solid var(--c,var(--ac))}
  .ms-ft b{display:block;font-family:var(--f-titulo);font-weight:400;text-transform:uppercase;letter-spacing:.05em;font-size:1rem;line-height:1.1}
  .ms-ft span{font-size:.75rem;color:var(--mut)}
  .ms-new{position:absolute;top:8px;right:8px;z-index:2;background:var(--gold);color:#1a1300;font-weight:800;font-size:.72rem;padding:3px 8px;animation:ms-p 1.2s ease-in-out infinite;clip-path:polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%)}
  @keyframes ms-p{50%{transform:scale(1.12)}}
  .ms-ft i{font-style:normal}
  .ms-pie{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  .ms-hint{display:none;color:var(--mut);font-size:.8rem}
  @media (orientation:landscape) and (min-width:700px){
    main:has(.ms){max-width:none;padding-left:18px;padding-right:18px}
    .ms .burnice{margin:6px 0}
    .ms-riel{display:flex;gap:16px;overflow-x:auto;overflow-y:hidden;padding:16px 6px 6px;margin:0;height:55vh;scroll-snap-type:x proximity;scrollbar-width:thin}
    .ms-c{height:100%;aspect-ratio:2/3;flex:0 0 auto;transform-origin:bottom}
    .ms-hint{display:inline}
  }
  @media (orientation:landscape) and (max-height:520px){
    .ms h1{font-size:1rem;margin:0}.ms .burnice{font-size:.78rem;padding:6px 10px;margin:4px 0}
    .ms-ft{padding:16px 8px 8px}.ms-ft b{font-size:.78rem}.ms-ft span{font-size:.62rem}.ms-ft .nvn{display:none}
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
  // ---- EXPR: efecto de la expresión sobre la imagen (movimiento + símbolo de manga). Lo usa también historia.js ----
  const SIMB={enojado:'💢',feliz:'✨',triste:'💧',sorpresa:'❗',nervioso:'💦'};
  const nomExp=e=>{e=String(e==null?'normal':e);if(/^\d+$/.test(e)){const k=Object.keys(EXP).find(x=>EXP[x]===+e);return k||'normal'}return e};
  window.EXPR={
    nombre:nomExp,
    limpiar(im){if(!im)return;[...im.classList].filter(c=>c.indexOf('x-')===0).forEach(c=>im.classList.remove(c))},
    aplicar(im,exp){
      if(!im)return;const nm=nomExp(exp),box=im.parentElement;
      this.limpiar(im);void im.offsetWidth;
      if(box)box.querySelectorAll('.exs').forEach(e=>e.remove());
      if(nm==='normal'||!SIMB[nm])return;
      im.classList.add('x-'+nm);
      const poner=()=>{
        if(!box||!im.isConnected)return;
        const s=document.createElement('span');s.className='exs';s.textContent=SIMB[nm];
        box.appendChild(s);
        const x=Math.min(im.offsetLeft+im.offsetWidth*.68,box.clientWidth-s.offsetWidth-4);
        s.style.left=Math.max(0,x)+'px';s.style.top=Math.max(0,im.offsetTop+im.offsetHeight*.04)+'px';
      };
      if(im.complete&&im.naturalWidth)poner();else im.addEventListener('load',poner,{once:true});
    }
  };
  U.nvFb=function(im){
    mal.add(im.getAttribute('src'));
    const l=JSON.parse(im.dataset.c||'[]').filter(u=>!mal.has(u));
    if(l.length){im.dataset.c=JSON.stringify(l);im.src=l[0]}else im.style.visibility='hidden';
  };
  function sprite(exp){
    const im=$("#nvspr");if(!im)return;exp=String(exp);
    const l=cand(N.k,exp);if(!l.length){im.style.visibility='hidden';return}
    if(im.dataset.exp===exp&&im.style.visibility!=='hidden'){EXPR.aplicar(im,exp);return}
    im.dataset.exp=exp;im.dataset.c=JSON.stringify(l);im.style.visibility='visible';
    im.style.animation='none';void im.offsetWidth;im.style.animation='';
    im.src=l[0];EXPR.aplicar(im,exp);
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
    bazar('mesa');
  };
  // en horizontal la escena ocupa justo lo que queda de pantalla (sin scroll)
  function ajusta(){
    const v=$('.vn');if(!v)return;
    v.style.height=matchMedia('(orientation:landscape) and (min-width:700px)').matches?Math.max(260,innerHeight-v.getBoundingClientRect().top-10)+'px':'';
  }
  window.addEventListener('resize',ajusta);

  // ---------- LA MESA: devuelve el HTML (la llama bazar('mesa') en index.html) ----------
  U.mesa=function(t,im,volver){
    const lvl=k=>{const w=(YO.vic_pj||{})[k]||0;return w>=NIV[1]?2:w>=NIV[0]?1:0};
    const tarj=(k,nom,col,imgs,pie,nuevo)=>{
      const l=imgs.filter(Boolean);
      return `<div class="ms-c" style="--c:${esc(col)}" tabindex="0" onclick="UI.novela('${k}')" onkeydown="if(event.key==='Enter')UI.novela('${k}')">
        ${nuevo?'<span class="ms-new">💬 ¡Te habla!</span>':''}
        <img alt="" src="${esc(l[0]||'')}" data-c='${esc(JSON.stringify(l.slice(1)))}' onerror="UI.nvFb(this)">
        <div class="ms-ft"><b>${esc(nom)}</b><span>${pie}</span></div></div>`;
    };
    const nov=k=>[`/img/${k}_novela_1.png`,`/img/${k}_novela_1.webp`];
    const cartas=[tarj('burnice','Burnice','#ff5a1f',[...nov('burnice'),im.burnice,I.BIENVENIDA_IMG],'🔥 la anfitriona')]
      .concat(PJ.map(p=>{const l=lvl(p.key);return tarj(p.key,p.nombre,p.color||'#38d4ff',[...nov(p.key),U.gif?U.gif(p):p.gif,p.gif],'❤️'.repeat(l+1)+'🤍'.repeat(2-l)+' <i class="nvn">'+NN[l]+'</i>',(YO.nuevo_pj||{})[p.key])}))
      .concat([tarj('niko','Niko','#ffd24a',[...nov('niko'),im.niko],'☀️ siempre aquí')]);
    return `<div class="ms"><h1>🪑 La mesa</h1><div class="burnice">${fmt(t.mesa)}</div>
      <div class="ms-riel" id="msriel">${cartas.join('')}</div>
      <div class="ms-pie">${volver}<span class="ms-hint">↔ Desliza (o usa la rueda del mouse) y elige con quién hablar</span></div></div>`;
  };
  U.mesaInit=function(){
    const r=$('#msriel');if(!r)return;
    const fit=()=>{const rr=$('#msriel');if(!rr)return;
      rr.style.height=matchMedia('(orientation:landscape) and (min-width:700px)').matches?Math.max(150,innerHeight-rr.getBoundingClientRect().top-72)+'px':''};
    fit();window.addEventListener('resize',fit);
    r.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&r.scrollWidth>r.clientWidth){r.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false});
  };
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

