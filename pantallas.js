// Pantalla de inicio y selección de equipo (abanico). No necesitas tocar este archivo.
(function(){
  const I=window.INTERFAZ||{};
  const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const azar=a=>a[Math.floor(Math.random()*a.length)];
  const ROLES=I.ROLES||{};
  const css=document.createElement('style');
  css.textContent=`
  .portada{text-align:center;position:relative}
  .portada .bur{width:100%;max-width:420px;max-height:46vh;object-fit:contain;display:block;margin:6px auto;filter:drop-shadow(0 6px 18px rgba(255,90,31,.35))}
  .portada .bur0{font-size:5rem;margin:14px 0}
  .portada .dia{background:linear-gradient(135deg,#2a1a14,#181b25);border:1px solid #ff5a1f55;border-radius:12px;padding:10px;margin:8px 0;font-size:.9rem}
  .portada .grandes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
  .portada .grandes button{padding:18px 8px;font-size:1.15rem;font-weight:700;border-radius:14px}
  .portada{display:flex;flex-direction:column}
  .portada .po-d{display:contents}
  .portada .po-pf{order:0}.portada .po-i{order:1}.portada .po-d>*{order:2}
  .portada .po-t{display:none}
  @media (orientation:landscape) and (min-width:700px){
    main:has(.portada){max-width:1200px}
    .portada{display:grid;grid-template-columns:minmax(0,46%) minmax(0,1fr);grid-template-rows:auto 1fr;column-gap:30px;text-align:left}
    .portada .po-pf{grid-column:1/-1;grid-row:1}
    .portada .po-i{grid-column:1;grid-row:2;display:flex;align-items:flex-end;justify-content:center;min-height:0}
    .portada .bur{max-height:100%;max-width:100%;height:100%;width:auto;margin:0}
    .portada .po-d{display:flex;flex-direction:column;justify-content:center;gap:10px;grid-column:2;grid-row:2;min-height:0}
    .portada .po-d>*{order:0}
    .portada .po-t{display:block;font-size:2.6rem;margin:0 0 4px;letter-spacing:.08em;color:var(--ac);text-shadow:0 0 22px rgba(56,212,255,.45)}
    .portada .grandes{grid-template-columns:1fr;gap:12px;margin-top:8px}
    .portada .grandes button{padding:20px 22px;font-size:1.3rem;text-align:left;border-radius:0}
  }
  @media (orientation:landscape) and (max-height:520px){
    .portada .po-t{font-size:1.5rem}.portada .po-d{gap:6px}
    .portada .grandes button{padding:10px 16px;font-size:1rem}
    .portada .burnice{font-size:.8rem;padding:8px 10px}.portada .dia{font-size:.75rem;padding:6px}
  }
  .perfil{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:14px;padding:8px 12px;text-align:left}
  .perfil img.av{width:44px;height:44px;border-radius:50%}
  .perfil .nom{font-weight:700}.perfil .sub{color:var(--mut);font-size:.82rem}
  .perfil .mas{height:34px;margin-left:auto}
  .roles{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:6px 0}
  .rol{background:var(--card);border:2px solid transparent;border-radius:12px;padding:4px;text-align:center;font-size:.7rem;cursor:pointer;color:var(--tx)}
  .rol.on{border-color:var(--ac);background:#0f2a38}
  .rol .im{height:38px;display:flex;align-items:center;justify-content:center;font-size:1.6rem}
  .rol .im img{max-height:38px;max-width:100%;object-fit:contain;border-radius:6px}
  .fila3{display:flex;gap:8px;align-items:stretch}
  .ranura{flex:1;max-width:96px;height:84px;border:2px dashed #3a4052;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#3a4052;font-size:1.5rem;font-weight:700;position:relative;overflow:hidden;background:var(--card)}
  .ranura.llena{border:2px solid var(--ac);cursor:pointer;color:#fff}
  .ranura.ver{box-shadow:0 0 0 2px var(--gold)}
  .ranura img{width:100%;height:100%;object-fit:cover}
  .ranura .nm{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);font-size:.64rem;padding:2px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .fila3 .azar{flex:none;width:84px;padding:6px 4px;font-size:.78rem}
  .sel2{display:flex;gap:10px;align-items:flex-start;margin-top:10px}
  #rueda{flex:none;position:relative;width:176px;overflow:hidden;border-radius:0 180px 180px 0;
    background:radial-gradient(circle at 0 50%,var(--card2) 0,#161926 45%,#10131c 100%);border:1px solid var(--line);border-left:0}
  #rueda .anillo{position:absolute;left:0;border:1px dashed #2f3550;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%)}
  #rueda .hub{position:absolute;left:0;top:50%;width:92px;height:92px;margin:-46px 0 0 -46px;border-radius:50%;background:#1b2030;border:2px solid #343a4c;
    display:flex;align-items:center;justify-content:flex-end;padding-right:12px;font-weight:700;font-size:1.05rem}
  #rueda .t{position:absolute;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:8px;border:2px solid #343a4c;background:var(--card2);overflow:hidden;cursor:pointer;
    transition:transform .15s,opacity .2s}
  #rueda .t img{width:100%;height:100%;object-fit:cover;pointer-events:none}
  #rueda .t .fv{position:absolute;top:0;right:1px;font-size:.7rem;text-shadow:0 0 3px #000}
  #rueda .t.en{border-color:var(--ac)}
  #rueda .t.en::after{content:"✔";position:absolute;inset:0;background:rgba(255,122,61,.4);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#fff}
  #rueda .t.marco{border-color:var(--gold);box-shadow:0 0 0 2px var(--gold),0 0 14px #ffd24aaa;transform:scale(1.18);z-index:5}
  #rueda .t.opaco{opacity:.2;pointer-events:none}
  #panel{flex:1;min-width:0}
  #panel .ret{width:100%;max-width:150px;aspect-ratio:1;border:3px solid var(--gold);border-radius:12px;overflow:hidden;background:#000;margin:0 auto}
  #panel .ret img{width:100%;height:100%;object-fit:cover}
  #panel .nom{font-weight:700;text-align:center;margin:6px 0 2px}
  #panel .rl{color:var(--mut);font-size:.75rem;text-align:center}
  #panel .fr{background:var(--card);border-left:4px solid var(--gold);border-radius:8px;padding:6px 8px;margin:8px 0;font-size:.85rem;min-height:2.6em}
  #panel .bt{display:flex;gap:6px}
  #panel .bt button{padding:10px 6px}
  #panel .conf{flex:1;background:var(--gold);color:#1a1500;font-weight:800;letter-spacing:.04em}
  #panel .est{width:44px;background:var(--line)}
  #panel .vacio{color:var(--mut);font-size:.9rem;padding:30px 6px;text-align:center}
  #fondo{position:fixed;inset:0;z-index:-1;background-size:cover;background-position:center;background-repeat:no-repeat;transition:opacity .35s}
  .ranura .ord{position:absolute;top:0;left:0;background:var(--ac);color:#fff;font-size:.68rem;padding:0 5px;border-radius:0 0 8px 0;z-index:2}
  .ordtxt{color:var(--mut);font-size:.75rem;margin:2px 0 4px}
  #panel .mv{display:flex;align-items:center;gap:6px;margin:6px 0}
  #panel .mv span{flex:1;text-align:center;font-size:.8rem;color:var(--mut)}
  #panel .mv button{padding:6px 14px;background:var(--card2)}
  /* selección de equipo en horizontal: rueda + carta grande a la izquierda, equipo y botones a la derecha */
  @media (orientation:landscape) and (min-width:700px){
    main:has(.se){max-width:1250px}
    .se{display:grid;grid-template-columns:minmax(0,1fr) 330px;column-gap:26px;align-items:start}
    .se>h1{grid-column:1/-1;margin:0 0 6px}
    .se>.roles{grid-column:1/-1;max-width:640px;margin:0 0 10px}
    .se>.sel2{grid-column:1;grid-row:3/span 5;margin-top:0}
    .se>.fila3,.se>.ordtxt,.se>.guard,.se>#ctrl{grid-column:2}
    .se>.fila3{grid-row:3}.se>.ordtxt{grid-row:4}.se>.guard{grid-row:5}.se>#ctrl{grid-row:6;margin-top:10px!important}
    .fila3 .ranura{max-width:none;height:96px}
    #panel{display:grid;grid-template-columns:minmax(0,250px) minmax(0,1fr);column-gap:18px;align-content:start}
    #panel>*{grid-column:2}
    #panel .ret{grid-column:1;grid-row:1/span 7;max-width:none;margin:0}
    #panel .vacio{grid-column:1/-1}
    #panel .nom{text-align:left;font-size:1.6rem;margin:0}#panel .rl{text-align:left;margin-bottom:6px}
    #panel .fr{font-size:1rem;padding:10px 12px}
    #panel .bt button{padding:14px 8px}
    .se #ctrl .fila{display:grid;grid-template-columns:1fr;gap:8px}
    .se #ctrl .fila>span{display:none}
    .se #ctrl .fila select,.se #ctrl .fila button{width:100%}
    .se #ctrl .fila button{padding:14px 16px;font-size:1.05rem;text-align:left}
  }
  @media (orientation:landscape) and (max-height:520px){
    .se{grid-template-columns:minmax(0,1fr) 250px;column-gap:14px}
    .se>.roles{max-width:520px;margin-bottom:6px}.rol{font-size:.6rem;padding:2px}.rol .im{height:24px;font-size:1.1rem}.rol .im img{max-height:24px}
    .se>h1{display:none}
    .se>#ctrl{grid-row:4;margin-top:6px!important}.se>.guard{grid-row:5}
    .se #ctrl .fila{gap:5px}.se #ctrl .fila select{padding:4px}
    .fila3 .ranura{height:64px}.ordtxt{display:none}
    .guard .tt{display:none}.gs .gm{height:26px}.gs .gm img{height:26px}
    #panel{grid-template-columns:minmax(0,150px) minmax(0,1fr);column-gap:10px}
    #panel .nom{font-size:1.1rem}#panel .fr{font-size:.8rem;padding:6px 8px;margin:4px 0}
    .se #ctrl .fila button{padding:9px 12px;font-size:.85rem}
    #rueda{zoom:.8}
  }
  .guard{margin:8px 0}
  .guard .tt{color:var(--mut);font-size:.75rem;margin-bottom:4px}
  .guard .fl{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
  .gs{background:var(--card);border-radius:10px;padding:5px}
  .gs .gm{display:flex;gap:2px;justify-content:center;align-items:center;height:34px;cursor:pointer;font-size:.75rem;color:var(--mut)}
  .gs .gm img{width:32%;height:34px;object-fit:cover;border-radius:5px}
  .gs .gb{display:flex;gap:4px;margin-top:4px}
  .gs .gb button{flex:1;padding:3px;font-size:.8rem}
  .lu .num{position:absolute;top:2px;left:2px;z-index:2;background:#000b;color:#fff;font-weight:800;font-size:.72rem;min-width:1.4em;text-align:center;border-radius:8px;padding:0 4px}
  .lu.ya{border-color:var(--gold);box-shadow:0 0 12px #ffd24a88}
  .lu.ya .num{background:var(--gold);color:#1a1500}
  .orden{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font-size:.76rem;color:var(--mut);margin:0 0 4px}
  .orden b{color:var(--tx)}.orden .on{color:var(--gold);font-weight:800}.orden .x{text-decoration:line-through;opacity:.5}
  .mc{display:inline-flex;padding:3px;border-radius:50%;background:var(--m,transparent);flex:none}
  .mc img{display:block;border-radius:50%}
  .perfil .tit{color:var(--gold);font-size:.72rem}
  .confeti{position:fixed;left:0;right:0;top:0;height:0;z-index:30;pointer-events:none}
  .confeti i{position:absolute;top:-30px;font-style:normal;animation:cae 1.9s ease-in forwards}
  @keyframes cae{to{transform:translateY(105vh) rotate(540deg);opacity:.2}}
  .tabs{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;margin:4px 0;scrollbar-width:thin}
  .tabs button{flex:none;background:var(--card2);padding:8px 12px;font-size:.85rem;border:2px solid transparent}
  .tabs button.on{border-color:var(--ac);background:var(--ac)}
  .of{background:linear-gradient(135deg,#3a1a10,#1a1d28);border:1px solid #ff5a1f;border-radius:12px;padding:10px;margin:8px 0;display:flex;gap:10px;align-items:center;justify-content:space-between;font-size:.9rem}
  .of b{color:var(--gold)}.of button{flex:none}
  .vit{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px;margin-top:8px}
  .cartx{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px;text-align:center;position:relative;display:flex;flex-direction:column;gap:6px;transition:transform .15s,box-shadow .15s}
  .cartx:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(255,90,31,.25)}
  .cartx .vis{height:92px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:#12141d;overflow:hidden}
  .cartx .vis img.gi{height:76px;max-width:90%;object-fit:contain}
  .cartx .vis .foto{width:100%;height:100%;background-size:cover;background-position:center}
  .cartx .vis .tt{font-weight:800;color:var(--gold);padding:4px;font-size:.95rem}
  .cartx .vis .ring{width:62px;height:62px;border-radius:50%;padding:5px;display:flex}.cartx .vis .ring i{flex:1;border-radius:50%;background:#12141d}
  .cartx .nm{font-weight:700;font-size:.92rem}
  .cartx .pr{color:var(--gold);font-weight:700}.cartx .pr s{color:var(--mut);font-weight:400;font-size:.8rem;margin-right:4px}
  .cartx .bd{position:absolute;top:6px;left:6px;font-size:.68rem;background:#ff5a1f;color:#fff;border-radius:8px;padding:1px 7px;z-index:2}
  .cartx .bd.ok{background:var(--ok)}
  .cartx .bt2{display:flex;gap:6px}.cartx .bt2 button{flex:1;padding:7px 4px;font-size:.82rem}.cartx .bt2 button.ver{flex:none;width:38px;background:var(--card2)}
  .cartx.bloq{opacity:.45;filter:grayscale(1)}
  .cartx.bloq .vis::after{content:"🔒";position:absolute;font-size:1.6rem}
  .cartx .vis{position:relative}
  .col{color:var(--mut);font-size:.85rem;margin:6px 0}
  #prev{position:fixed;inset:0;background:#000c;z-index:20;display:flex;align-items:center;justify-content:center;padding:16px}
  #prev .caja2{background:var(--card);border:2px solid var(--ac);border-radius:16px;padding:14px;max-width:360px;width:100%;text-align:center}
  #prev img.big{max-width:100%;max-height:50vh;border-radius:10px}
  .tienda .item{border:1px solid var(--line);transition:transform .15s,box-shadow .15s}
  .tienda .item:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(255,90,31,.25)}
  `;
  document.head.appendChild(css);

  const U=window.UI={filtro:'todos',frase:'',sel:null};
  /* ---------- fondos a pantalla completa ---------- */
  const FO=I.FONDOS||{};
  U.fondo=function(n){
    let d=document.getElementById('fondo');
    if(!d){d=document.createElement('div');d.id='fondo';document.body.prepend(d)}
    let img=FO[n]||'';if(!img&&n==='inicio')img=I.FONDO_IMG||'';
    if(!img&&n==='novela')img=FO.bazar||'';
    if(n==='combate'){if(typeof YO!=='undefined'&&YO.fondo_img)img=YO.fondo_img;else if(U.arena)img=U.arena}
    if(U.fondoHist&&(n==='novela'||n==='combate'))img=U.fondoHist;   // fondo propio del capítulo de la historia
    const o=I.FONDO_OSCURO==null?.55:I.FONDO_OSCURO;
    const nuevo=img?`linear-gradient(rgba(10,12,18,${o}),rgba(10,12,18,${o})),url("${img.replace(/"/g,'%22')}")`:'none';
    if(d.dataset.v!==nuevo){d.dataset.v=nuevo;d.style.backgroundImage=nuevo}
  };
  U.fondoDe=function(m){U.fondo(/^hist_/.test(m)?(/_batalla$/.test(m)?'combate':'novela'):{menu:'inicio',bazar:'bazar',pelea:'combate',fin:'combate'}[m]||'inicio')};
  /* avatar con marco comprado */
  U.av=function(y,px){
    px=px||44;
    const im=y.avatar?`<img src="${esc(y.avatar)}" style="width:${px}px;height:${px}px;border-radius:50%">`:`<span style="display:flex;width:${px}px;height:${px}px;align-items:center;justify-content:center;font-size:${px*.6}px">👤</span>`;
    return y.marco?`<span class="mc" style="--m:${y.marco}">${im}</span>`:im;
  };
  /* imagen del personaje (con skin si la compraste) */
  const gifDe=p=>(typeof YO!=='undefined'&&YO.skins&&YO.skins[p.key])||p.gif;
  U.gif=gifDe;
  /* confeti + sonidito al comprar */
  U.fx=function(){
    const c=document.createElement('div');c.className='confeti';
    const em=['💀','✨','🔥','⭐','💥'];
    for(let i=0;i<34;i++){const e=document.createElement('i');e.textContent=em[i%em.length];e.style.left=(Math.random()*100)+'%';e.style.fontSize=(14+Math.random()*16)+'px';e.style.animationDelay=(Math.random()*.5)+'s';c.appendChild(e)}
    document.body.appendChild(c);setTimeout(()=>c.remove(),2600);
    try{
      if(LS.g('mus_mute')==='1')return;
      const A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime;
      [523,659,784,1047].forEach((f,i)=>{const o=A.createOscillator(),g=A.createGain();o.type='triangle';o.frequency.value=f;
        g.gain.setValueAtTime(.0001,t+i*.09);g.gain.exponentialRampToValueAtTime(.18,t+i*.09+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.09+.25);
        o.connect(g);g.connect(A.destination);o.start(t+i*.09);o.stop(t+i*.09+.3)});
      setTimeout(()=>A.close(),1200);
    }catch(e){}
  };
  const rolDe=k=>(I.ROL||{})[k]||'';
  const lista=()=>PJ.filter(p=>U.filtro==='todos'||rolDe(p.key)===U.filtro);
  const nombre=()=>(typeof YO!=='undefined'&&YO.logueado)?YO.nombre:'viajero';

  /* ---------- inicio ---------- */
  U.portadaFit=function(){
    const f=()=>{const p=document.querySelector('.portada');if(!p)return;
      p.style.height=matchMedia('(orientation:landscape) and (min-width:700px)').matches?Math.max(240,innerHeight-p.getBoundingClientRect().top-10)+'px':''};
    f();if(!U._pf){U._pf=1;window.addEventListener('resize',f)}
  };
  U.portada=function(){
    musica('menu');
    U.fondo('inicio');
    const perfil=YO.logueado
     ?`<div class="perfil">${U.av(YO,44)}<div><div class="nom">${esc(YO.nombre)}</div>${YO.titulo?`<div class="tit">«${esc(YO.titulo)}»</div>`:''}
        <div class="sub">💀 ${YO.monedas} · 🏆 ${YO.victorias||0} · 💔 ${YO.derrotas||0}</div></div>
        ${YO.mascota_url?`<img class="mas" src="${esc(YO.mascota_url)}">`:''}<a href="/auth/logout" style="color:var(--mut);font-size:.75rem">salir</a></div>`
     :(YO.login_disponible?`<a class="btn-discord" style="display:block;padding:10px;border-radius:12px;color:#fff;text-decoration:none" href="/auth/login">Iniciar sesión con Discord</a>`:`<div class="perfil"><span style="color:var(--mut)">Modo invitado</span></div>`);
    const frase=azar(I.BIENVENIDAS&&I.BIENVENIDAS.length?I.BIENVENIDAS:['¡Hola!']).replace(/\{nombre\}/g,nombre());
    $('#app').innerHTML=`<div class="portada"><div class="po-pf">${perfil}</div>
      <div class="po-i">${I.BIENVENIDA_IMG?`<img class="bur" src="${esc(I.BIENVENIDA_IMG)}">`:`<div class="bur0">🔥</div>`}</div>
      <div class="po-d"><h1 class="po-t">PRESS TURN</h1>
      <div class="burnice" style="text-align:left"><b>🔥 Burnice:</b> ${fmt(frase)}</div>
      ${I.AVISO?`<div class="dia">📣 ${fmt(I.AVISO)}</div>`:''}
      <div class="grandes"><button onclick="dibujarEleccion()">⚔️ Jugar</button><button class="btn-burnice" onclick="bazar('inicio')">🔥 Bazar</button></div>
      <div id="extras"></div></div></div>`;
    UI.portadaFit&&UI.portadaFit();
    window.PWA&&PWA.boton();
  };

  /* ---------- selección (rueda) ---------- */
  const TL=54,SEP=64,R0=80;
  const favs=()=>{try{return JSON.parse(LS.g('favs')||'[]')}catch(e){return[]}};
  const setFavs=a=>LS.s('favs',JSON.stringify(a));
  const ordenados=()=>{const f=favs();return [...PJ.filter(p=>f.includes(p.key)),...PJ.filter(p=>!f.includes(p.key))]};
  const coincide=p=>U.filtro==='todos'||(U.filtro==='fav'?favs().includes(p.key):rolDe(p.key)===U.filtro);
  function anillos(n){            // cuántas cartas caben en cada anillo
    const r=[];let R=R0,resto=n;
    while(resto>0){const am=Math.acos(Math.min(.99,(TL/2)/R));const cab=Math.floor(2*am*R/(TL+6))+1;
      const k=Math.min(cab,resto);r.push({R,k,am});resto-=k;R+=SEP}
    return r;
  }
  function ranuraH(i){
    const k=elegidos[i],p=k&&PJ.find(x=>x.key===k);
    return p?`<div class="ranura llena ${U.sel===k?'ver':''}" onclick="UI.tocar('${p.key}')">${gifDe(p)?`<img src="${esc(gifDe(p))}">`:''}<b class="ord">${i+1}º</b><div class="nm">${esc(p.nombre)}</div></div>`
            :`<div class="ranura">${i+1}</div>`;
  }
  function panelH(){
    const p=PJ.find(x=>x.key===U.sel);
    if(!p)return `<div class="vacio">Toca una carta del círculo para verla.</div>`;
    const R=ROLES[rolDe(p.key)],en=elegidos.includes(p.key),lleno=elegidos.length>=3&&!en;
    return `<div class="ret">${gifDe(p)?`<img src="${esc(gifDe(p))}">`:''}</div>
      <div class="nom">${esc(p.nombre)}</div><div class="rl">${R?esc(R.nombre):''}</div>
      ${en?`<div class="mv"><button onclick="UI.mover(-1)" ${elegidos.indexOf(p.key)==0?'disabled':''}>◀</button><span>Actúa ${elegidos.indexOf(p.key)+1}º</span><button onclick="UI.mover(1)" ${elegidos.indexOf(p.key)>=elegidos.length-1?'disabled':''}>▶</button></div>`:''}
      <div class="fr">${U.frase?`«${esc(U.frase)}»`:'…'}</div>
      <div class="bt"><button class="est" title="Favorito" onclick="UI.fav('${p.key}')">${favs().includes(p.key)?'⭐':'☆'}</button>
      <button class="conf" ${lleno?'disabled':''} onclick="UI.confirmar()">${en?'QUITAR':(lleno?'EQUIPO LLENO':'CONFIRMAR')}</button></div>`;
  }
  function ruedaH(){
    const l=ordenados(),an=anillos(l.length),Rm=an[an.length-1].R,H=2*(Rm+TL/2+10);
    let h=`<div class="hub" id="hubn">${elegidos.length}/3</div>`,idx=0;
    an.forEach(o=>{
      h+=`<div class="anillo" style="top:${H/2}px;width:${o.R*2}px;height:${o.R*2}px"></div>`;
      for(let j=0;j<o.k;j++){
        const p=l[idx++],a=o.k===1?0:-o.am+j*(2*o.am/(o.k-1));
        const x=o.R*Math.cos(a),y=H/2+o.R*Math.sin(a);
        h+=`<div class="t" data-k="${p.key}" style="left:${x}px;top:${y}px" onclick="UI.tocar('${p.key}')">${gifDe(p)?`<img src="${esc(gifDe(p))}">`:''}${favs().includes(p.key)?'<span class="fv">⭐</span>':''}</div>`;
      }
    });
    return {h,H};
  }
  function marcar(){
    document.querySelectorAll('#rueda .t').forEach(t=>{
      const k=t.dataset.k,p=PJ.find(x=>x.key===k);
      t.classList.toggle('en',elegidos.includes(k));t.classList.toggle('marco',U.sel===k);t.classList.toggle('opaco',!coincide(p));
    });
  }
  U.refrescar=function(){
    const r=$('#ranuras');if(!r)return;
    r.innerHTML=[0,1,2].map(ranuraH).join('');
    const g=$('#guard');if(g)g.innerHTML=guardH();
    $('#panel').innerHTML=panelH();
    const h=$('#hubn');if(h)h.textContent=elegidos.length+'/3';
    marcar();
    const c=$('#ctrl');if(c)c.innerHTML=ctrlH();
  };
  /* equipos guardados (se quedan en este dispositivo) */
  const guardados=()=>{try{const a=JSON.parse(LS.g('equipos')||'[]');return [a[0]||null,a[1]||null,a[2]||null]}catch(e){return[null,null,null]}};
  function guardH(){
    const g=guardados();
    return `<div class="tt">💾 Mis equipos — toca uno para cargarlo, 💾 para guardar el actual</div><div class="fl">`+g.map((e,i)=>{
      const ok=e&&e.filter(k=>PJ.find(x=>x.key===k));
      return `<div class="gs"><div class="gm" onclick="UI.cargar(${i})">${ok&&ok.length?ok.map(k=>{const p=PJ.find(x=>x.key===k);return p.gif?`<img src="${esc(p.gif)}">`:'?'}).join(''):'Vacío'}</div>
      <div class="gb"><button class="sec" ${elegidos.length==3?'':'disabled'} onclick="UI.guardar(${i})">💾</button>${ok&&ok.length?`<button class="sec" onclick="UI.borrar(${i})">🗑</button>`:''}</div></div>`}).join('')+`</div>`;
  }
  function ctrlH(){
    return `<div class="fila"><span>Equipo: <b>${elegidos.length}/3</b></span>
      <select onchange="nivel=this.value"><option value="facil" ${nivel=='facil'?'selected':''}>CPU fácil</option><option value="normal" ${nivel=='normal'?'selected':''}>CPU normal</option><option value="dificil" ${nivel=='dificil'?'selected':''}>CPU difícil</option></select>
      <button ${elegidos.length==3?'':'disabled'} onclick="empezar()">¡A pelear! (CPU)</button>
      ${reto?`<button class="btn-burnice" ${elegidos.length==3&&YO.logueado?'':'disabled'} onclick="unirse()">⚔️ Aceptar el reto de ${esc(reto.creador)}</button>`
        :(YO.logueado?`<button class="btn-discord" ${elegidos.length==3?'':'disabled'} onclick="crearSala()">👥 Retar a un amigo</button>`:'')}</div>
    ${reto?(YO.logueado?`<div class="info">🔥 <b>${esc(reto.creador)}</b> te retó. Elige tu equipo y acepta.</div>`:`<div class="info">🔥 <b>${esc(reto.creador)}</b> te retó. Inicia sesión con Discord para aceptar.</div>`):''}`;
  }
  U.eleccion=function(foco){
    musica('menu');U.fondo('seleccion');
    if(foco&&PJ.find(x=>x.key===foco)){U.sel=foco;U.fraseDe(foco)}
    const bl=[...['todos',...Object.keys(ROLES)].map(r=>{
      const R=ROLES[r]||{nombre:'Todos',icono:'✨',img:''};
      return `<button class="rol ${U.filtro===r?'on':''}" onclick="UI.filtrar('${r}')"><div class="im">${R.img?`<img src="${esc(R.img)}">`:R.icono}</div>${esc(R.nombre)}</button>`}),
      `<button class="rol ${U.filtro==='fav'?'on':''}" onclick="UI.filtrar('fav')"><div class="im">⭐</div>Favoritos</button>`].join('');
    const w=ruedaH();
    $('#app').innerHTML=barra(`<button class="sec" onclick="inicio(true)">🏠 Inicio</button> <button class="btn-burnice" onclick="bazar('inicio')">🔥 Bazar</button>`)+
    `<div class="se"><h1 style="font-size:1.1rem">⚔️ Elige tu equipo de 3</h1>
    <div class="roles">${bl}</div>
    <div class="fila3"><div id="ranuras" style="display:contents"></div><button class="sec azar" onclick="UI.azar()">🎲 Al azar</button></div>
    <div class="ordtxt">El orden de las ranuras (1º → 2º → 3º) es el orden en que actúan. Elige un personaje de tu equipo y muévelo con ◀ ▶.</div>
    <div class="guard" id="guard"></div>
    <div class="sel2"><div id="rueda" style="height:${w.H}px">${w.h}</div><div id="panel"></div></div>
    <div id="ctrl" style="margin-top:12px"></div></div>`;
    U.refrescar();
  };
  U.fraseDe=function(k){const f=(I.FRASES||{})[k];U.frase=f&&f.length?azar(f):''};
  U.tocar=function(k){U.sel=k;U.fraseDe(k);U.refrescar()};
  U.confirmar=function(){
    const k=U.sel;if(!k)return;const i=elegidos.indexOf(k);
    if(i>=0)elegidos.splice(i,1);else if(elegidos.length<3)elegidos.push(k);
    U.refrescar();
  };
  U.mover=function(d){
    const k=U.sel,i=elegidos.indexOf(k),j=i+d;
    if(i<0||j<0||j>=elegidos.length)return;
    [elegidos[i],elegidos[j]]=[elegidos[j],elegidos[i]];U.refrescar();
  };
  U.guardar=function(i){if(elegidos.length!==3)return;const g=guardados();g[i]=[...elegidos];LS.s('equipos',JSON.stringify(g));U.refrescar()};
  U.borrar=function(i){const g=guardados();g[i]=null;LS.s('equipos',JSON.stringify(g));U.refrescar()};
  U.cargar=function(i){
    const e=guardados()[i];if(!e)return;
    const ok=e.filter(k=>PJ.find(x=>x.key===k));if(!ok.length)return;
    elegidos.length=0;ok.forEach(k=>elegidos.push(k));U.tocar(ok[0]);
  };
  U.fav=function(k){const f=favs(),i=f.indexOf(k);if(i>=0)f.splice(i,1);else f.push(k);setFavs(f);U.eleccion()};
  U.filtrar=function(r){U.filtro=r;U.eleccion()};
  U.azar=function(){
    const t=[...PJ].sort(()=>Math.random()-.5).slice(0,3).map(p=>p.key);
    elegidos.length=0;t.forEach(k=>elegidos.push(k));
    U.tocar(t[0]);
  };
})();

/* =====================================================================
   EFECTOS DE COMBATE (barras con estela, números flotantes, golpes,
   cinemática de habilidades/ULTI, iconos de turno, muertes, avisos)
   Todo está aquí; index.html solo llama a window.CBT.
   ===================================================================== */
(function(){
  const css=document.createElement('style');
  css.textContent=`
  /* barras: la de arriba (.b) es la vida real; la de atrás (.est) es la estela */
  .barra{position:relative}
  .barra i{position:absolute;left:0;top:0;height:100%}
  .barra.hp .est{background:#ffd0d0}.barra.hp.cur .est{background:#a6ffc0}.barra.ult .est{background:#ffe9a0}
  .barra.dan .b{transition:width .25s ease-out}
  .barra.dan .est{transition:width .7s ease-in .45s}
  .barra.cur .est{transition:width .2s}
  .barra.cur .b{transition:width .8s ease-out .2s}
  /* números flotantes (viven en una capa propia, no se borran al redibujar) */
  #cbfx{position:fixed;inset:0;pointer-events:none;z-index:8;overflow:hidden}
  .flt{position:absolute;transform:translateX(-50%);font-weight:900;font-size:1.3rem;white-space:nowrap;text-align:center;line-height:1.05;
    text-shadow:0 2px 3px #000,0 0 8px #000;animation:cb-flota 1.15s ease-out forwards;opacity:0}
  .flt.dan{color:#ff5b5b}.flt.cur{color:#5dff8f}.flt.fal{color:#cfd6e4;font-size:1rem}.flt.mue{font-size:1.7rem}
  .flt.crit{color:var(--gold);font-size:1.8rem}.flt .sub{display:block;font-size:.72rem;letter-spacing:.08em}
  @keyframes cb-flota{0%{opacity:0;transform:translate(-50%,12px) scale(.5)}15%{opacity:1;transform:translate(-50%,-4px) scale(1.3)}30%{transform:translate(-50%,-10px) scale(1)}100%{opacity:0;transform:translate(-50%,-56px) scale(1)}}
  /* reacciones de las cartas */
  .lu.golpe{animation:cb-golpe .45s}
  .lu.golpe-f{animation:cb-golpef .65s}
  .lu.sana{animation:cb-sana .9s}
  .lu.esq{animation:cb-esq .45s}
  .lu.morir{animation:cb-morir 1.1s ease-out}
  .lu.lunge0{animation:cb-l0 .3s ease-out forwards;z-index:4}
  .lu.lunge1{animation:cb-l1 .3s ease-out forwards;z-index:4}
  .lu.critico{animation:cb-pulso 1.3s ease-in-out infinite}
  .lu.ya img.r{animation:cb-resp 1.8s ease-in-out infinite}
  @keyframes cb-golpe{0%{filter:brightness(2.4) saturate(.2)}15%{transform:translateX(-7px)}30%{transform:translateX(7px);filter:brightness(1.5)}45%{transform:translateX(-5px)}60%{transform:translateX(4px)}100%{transform:none;filter:none}}
  @keyframes cb-golpef{0%{filter:brightness(3) saturate(0);transform:scale(1.08)}12%{transform:translate(-11px,3px) scale(1.08)}24%{transform:translate(11px,-3px);filter:brightness(1.8) sepia(1) hue-rotate(-30deg)}38%{transform:translate(-8px,2px)}52%{transform:translate(6px,-2px)}70%{transform:translateX(-3px)}100%{transform:none;filter:none}}
  @keyframes cb-sana{0%{box-shadow:0 0 0 #5dff8f00}30%{box-shadow:0 0 22px #5dff8fcc;filter:brightness(1.35)}100%{box-shadow:0 0 0 #5dff8f00;filter:none}}
  @keyframes cb-esq{30%{transform:translateX(12px) rotate(3deg);opacity:.7}100%{transform:none}}
  @keyframes cb-morir{0%{opacity:1;filter:brightness(2.5)}20%{transform:translateX(-6px)}40%{transform:translateX(6px);opacity:1;filter:none}100%{opacity:.35;filter:grayscale(1);transform:translateY(5px)}}
  @keyframes cb-l0{to{transform:translateY(-16px) scale(1.07)}}
  @keyframes cb-l1{to{transform:translateY(16px) scale(1.07)}}
  @keyframes cb-pulso{50%{box-shadow:0 0 12px #ff3b3bbb;border-color:#ff3b3b88}}
  @keyframes cb-resp{50%{transform:translateY(-3px) scale(1.03)}}
  #app.sacude{animation:cb-sacude .5s}
  @keyframes cb-sacude{0%,100%{transform:none}15%{transform:translate(-6px,3px)}30%{transform:translate(6px,-3px)}45%{transform:translate(-5px,-2px)}60%{transform:translate(4px,3px)}80%{transform:translate(-2px,1px)}}
  /* iconos de Press Turn */
  .ico{display:inline-block}
  .ico.gana{animation:cb-gana .7s backwards}
  .ico.gasta{overflow:hidden;animation:cb-gasta .65s forwards}
  @keyframes cb-gana{0%{transform:scale(0);opacity:0}55%{transform:scale(1.7);filter:drop-shadow(0 0 7px #8ff)}100%{transform:scale(1)}}
  @keyframes cb-gasta{0%{transform:scale(1.5);filter:brightness(3);max-width:1.4em}60%{opacity:.8}100%{transform:scale(0) translateY(-10px);opacity:0;max-width:0}}
  /* avisos de turno */
  .cb-ban{position:fixed;left:0;right:0;top:36%;z-index:20;text-align:center;pointer-events:none;font-weight:900;font-size:1.6rem;letter-spacing:.05em;color:#fff;
    text-shadow:0 0 14px var(--c,#4aa3ff),0 3px 6px #000;background:linear-gradient(90deg,transparent,#000b 20%,#000b 80%,transparent);padding:10px 0;animation:cb-ban 1.2s ease-out forwards}
  @keyframes cb-ban{0%{opacity:0;transform:scaleY(.1)}15%{opacity:1;transform:scaleY(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-12px)}}
  /* cinemática de habilidades y ULTI */
  #anim{overflow:hidden}
  #anim .cn-rayos{position:absolute;inset:-35%;background:repeating-conic-gradient(from 0deg,var(--c,#888) 0 5deg,transparent 5deg 15deg);opacity:.22;
    -webkit-mask:radial-gradient(circle,transparent 8%,#000 65%);mask:radial-gradient(circle,transparent 8%,#000 65%);animation:cb-gira 7s linear infinite}
  @keyframes cb-gira{to{transform:rotate(360deg)}}
  #anim .cn-img{position:relative;max-width:92vw;max-height:52vh;border-radius:12px;box-shadow:0 0 34px var(--c,#888);animation:cb-img .45s cubic-bezier(.2,1.4,.4,1)}
  @keyframes cb-img{from{opacity:0;transform:translateX(-70px) scale(.75)}}
  #anim .cn-tit{position:relative;font-weight:900;font-size:1.5rem;margin-top:12px;color:var(--c,#fff);text-shadow:0 0 14px var(--c,#fff),0 2px 0 #000;animation:cb-tit .5s .12s backwards}
  @keyframes cb-tit{from{opacity:0;transform:scale(2.3);letter-spacing:.3em}}
  #anim .cn-desc{position:relative;white-space:pre-line;margin-top:4px;animation:cb-fade .6s .35s backwards}
  @keyframes cb-fade{from{opacity:0}}
  #anim .cn-skip{position:absolute;bottom:14px;left:0;right:0;font-size:.7rem;color:#fff6}
  #anim .cn-cinta{position:absolute;top:13%;left:-10%;right:-10%;padding:6px 0;transform:rotate(-4deg);background:linear-gradient(90deg,transparent,var(--c,#d33) 18%,var(--c,#d33) 82%,transparent);
    font-weight:900;font-size:1.3rem;letter-spacing:.35em;color:#fff;text-shadow:0 2px 4px #000;animation:cb-cinta .5s cubic-bezier(.2,1.2,.4,1)}
  @keyframes cb-cinta{from{transform:translateX(-120%) rotate(-4deg)}}
  #anim.cn-u{animation:cb-flash .55s}
  #anim.cn-u .cn-tit{font-size:2rem}
  #anim.cn-u .cn-img{animation:cb-img .45s cubic-bezier(.2,1.4,.4,1),cb-tiembla .14s .45s infinite}
  #anim.cn-c .cn-tit{color:var(--gold)}
  #anim .cn-ult{max-width:100vw;max-height:62vh;border-radius:0;box-shadow:none;filter:drop-shadow(0 0 22px var(--c,#d33));animation:cb-ult .6s cubic-bezier(.15,1.25,.35,1)}
  @keyframes cb-ult{from{opacity:0;transform:translateX(110vw) skewX(-12deg)}}
  /* CRÍTICO estilo Persona */
  #anim.cn-c{padding:0;animation:none;background:#05060a}
  #anim.cn-c .cn-rayos,#anim.cn-c .cn-cinta{display:none}
  .cp-f,.cp-r,.cp-fl{position:absolute;inset:0;pointer-events:none}
  .cp-f::before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 0 30%,var(--c,#d33) 30% 60%,transparent 60%);opacity:.9;animation:cp-slab .32s cubic-bezier(.2,.9,.3,1) backwards}
  .cp-r{inset:-10%;background:repeating-linear-gradient(115deg,transparent 0 40px,var(--c,#d33) 40px 80px);opacity:.2;animation:cp-drift 1.1s linear infinite}
  .cp-fl{background:#fff;animation:cp-fl .4s forwards}
  .cp-w{position:absolute;inset:0 0 26% 0;display:flex;align-items:center;justify-content:center;filter:drop-shadow(7px 7px 0 #000) drop-shadow(0 0 20px var(--c,#d33));animation:cp-w .45s cubic-bezier(.15,1.2,.35,1) .08s backwards}
  #anim .cp-img{display:block;max-width:86vw;max-height:50vh;width:auto;height:auto;border-radius:0;clip-path:polygon(7% 0,100% 0,93% 100%,0 100%);animation:cb-tiembla .12s .5s 4}
  .cp-n{position:absolute;left:0;right:0;bottom:15%;padding:.05em 6vw .12em;text-align:left;background:linear-gradient(90deg,#000 0,#000e 80%,transparent);transform:skewX(-8deg);animation:cp-n .4s cubic-bezier(.15,1.2,.35,1) .22s backwards}
  .cp-n small{display:block;font-family:var(--f-titulo);font-size:clamp(.8rem,3vh,1.4rem);letter-spacing:.35em;color:var(--gold);transform-origin:left;animation:cp-pop .3s .55s backwards}
  .cp-n b{display:block;font-family:var(--f-titulo);font-weight:400;text-transform:uppercase;letter-spacing:.04em;font-size:clamp(1.8rem,min(9vw,16vh),5.2rem);line-height:1.02;color:#fff;text-shadow:4px 4px 0 var(--c,#d33);-webkit-text-stroke:2px #000;paint-order:stroke fill}
  .cp-d{position:absolute;left:6vw;bottom:8%;color:#fffa;font-size:.9rem;animation:cb-fade .6s .5s backwards}
  @media (orientation:landscape) and (max-height:520px){#anim .cp-img{max-height:44vh}.cp-w{inset:0 0 30% 0}.cp-n{bottom:12%}}
  #anim .cp-an{animation:cp-an .4s cubic-bezier(.15,1.2,.35,1)}
  @keyframes cp-an{from{opacity:0;transform:scale(1.3)}}
  @keyframes cp-slab{from{transform:translateX(-100%)}}
  @keyframes cp-drift{to{background-position:88.3px 0}}
  @keyframes cp-fl{to{opacity:0}}
  @keyframes cp-w{from{opacity:0;transform:translateX(100vw) skewX(-10deg)}}
  @keyframes cp-n{from{transform:translateX(-110%) skewX(-8deg)}}
  @keyframes cp-pop{from{opacity:0;transform:scale(2.2)}}
  #anim.cn-t .cn-rayos,#anim.cn-t .cn-cinta{display:none}
  @keyframes cb-flash{0%{background:#fff}100%{background:#000d}}
  @keyframes cb-tiembla{25%{transform:translate(2px,-2px)}75%{transform:translate(-2px,2px)}}
  /* pantalla final */
  .vic.gano h1{animation:cb-vic .9s cubic-bezier(.2,1.6,.4,1)}
  .vic.gano img{animation:cb-sube .8s .2s backwards;box-shadow:0 0 30px #ffd24a88}
  .vic.perdio{animation:cb-apaga 1.2s}
  .vic.perdio img{filter:grayscale(.85);animation:cb-sube .8s .2s backwards}
  @keyframes cb-vic{from{opacity:0;transform:scale(.2) rotate(-8deg)}}
  @keyframes cb-sube{from{opacity:0;transform:translateY(30px)}}
  @keyframes cb-apaga{from{opacity:.1;filter:brightness(.3)}}
  @media (prefers-reduced-motion:reduce){.lu,.lu img,.flt,#app,#anim *,.cb-ban,.ico{animation:none!important}}
  `;
  document.head.appendChild(css);

  const HPV={},ULV={},HPN={},MEDV={0:0,1:0};
  let ATK=null;
  const hpDe=l=>l.forma?l.forma_hp:l.hp;
  const mxDe=l=>l.forma?90:l.max_hp;
  const C=window.CBT={};
  const I=window.INTERFAZ||{};
  const U=window.UI=window.UI||{};
  const faltan=new Set();   // imágenes que no existen (para no pedirlas otra vez)
  const esp=ms=>new Promise(r=>setTimeout(r,ms));

  C.reset=function(){
    for(const o of [HPV,ULV,HPN])for(const k in o)delete o[k];MEDV[0]=MEDV[1]=0;ATK=null;
    /* arena al azar para esta pelea (lista ARENAS en interfaz.js) */
    const L=(I.ARENAS||[]).filter(Boolean);
    if(L.length){let n;do{n=L[Math.floor(Math.random()*L.length)]}while(L.length>1&&n===U.arena);U.arena=n}else U.arena='';
  };
  /* imagen por personaje con respaldo: /img/<clave>_<tipo>.png (o .jpg, .jpeg, .webp); si no existe usa la normal */
  const EXT=['png','jpg','jpeg','webp'];
  const lista=(key,tipo)=>['img_historia','img'].flatMap(c=>EXT.map(e=>`/${c}/${key}_${tipo}.${e}`)).filter(u=>!faltan.has(u));   // img_historia = imágenes que solo usa el modo historia
  C.cara=function(key,tipo,base){
    const l=lista(key,tipo);
    if(!l.length)return base?`src="${base}"`:'style="display:none"';
    return `src="${l[0]}" data-c="${l.slice(1).join('|')}" data-o="${base||''}" onerror="CBT.fb(this)"`;
  };
  /* igual que cara(), pero prueba varios tipos en orden (ej. critico → ulti → respaldo) */
  const cadena=(key,tipos,base)=>{
    const l=key?tipos.flatMap(t=>lista(key,t)):[];
    if(!l.length)return base?`src="${base}"`:'style="display:none"';
    return `src="${l[0]}" data-c="${l.slice(1).join('|')}" data-o="${base||''}" onerror="CBT.fb(this)"`;
  };
  /* si una imagen no existe, prueba la siguiente extensión y al final la de respaldo */
  C.fb=function(im){
    faltan.add(im.getAttribute('src'));
    const c=(im.dataset.c||'').split('|').filter(Boolean);
    if(c.length){im.dataset.c=c.slice(1).join('|');im.src=c[0];return}
    im.onerror=null;im.classList.remove('cn-ult');
    if(im.dataset.o)im.src=im.dataset.o;else im.style.display='none';
  };
  /* quién está actuando en este paso (para la imagen de la ulti) */
  C.actor=function(prev){
    const lado=prev.turno===0?0:1,i=(ATK&&ATK.lado===lado)?ATK.i:prev.actor;
    return {lado,i};
  };
  C.quien=function(prev){
    if(!prev)return null;
    const a=C.actor(prev),l=a.i==null?null:prev.equipos[a.lado].luchadores[a.i];return l?l.key:null;
  };
  C.atk=function(lado,i){ATK={lado,i}};

  /* barra de vida o de ulti con estela */
  C.barra=function(tipo,lado,i,pct){
    const K=tipo==='hp'?HPV:ULV,k=lado+':'+i,prev=K[k];K[k]=pct;
    const bajo=tipo==='hp'&&pct<30?' bajo':'';
    if(prev==null||Math.abs(prev-pct)<.01)
      return `<div class="barra ${tipo}${bajo}"><i class="est" style="width:${pct}%"></i><i class="b" style="width:${pct}%"></i></div>`;
    return `<div class="barra ${tipo}${bajo} ${pct<prev?'dan':'cur'}" data-to="${pct}"><i class="est" style="width:${prev}%"></i><i class="b" style="width:${prev}%"></i></div>`;
  };
  /* número de vida que cuenta hacia arriba o abajo */
  C.num=function(lado,i,hp,mx){
    const k=lado+':'+i,prev=HPN[k];HPN[k]=hp;
    if(prev==null||prev===hp)return `${hp}/${mx}`;
    return `<span class="hpt" data-a="${prev}" data-b="${hp}" data-m="${mx}">${prev}/${mx}</span>`;
  };
  /* arranca las animaciones de barras y números (se llama justo después de dibujar) */
  C.post=function(){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      document.querySelectorAll('.barra[data-to]').forEach(b=>{
        const to=b.dataset.to+'%';b.querySelector('.b').style.width=to;b.querySelector('.est').style.width=to;b.removeAttribute('data-to');
      });
      document.querySelectorAll('.hpt[data-a]').forEach(el=>{
        const a=+el.dataset.a,b=+el.dataset.b,m=el.dataset.m,t0=performance.now();el.removeAttribute('data-a');
        const paso=t=>{const e=Math.min(1,(t-t0)/650);el.textContent=Math.round(a+(b-a)*e)+'/'+m;if(e<1&&el.isConnected)requestAnimationFrame(paso)};
        requestAnimationFrame(paso);
      });
    }));
  };

  /* iconos de Press Turn: los gastados se apagan, los nuevos entran con brillo */
  const tok=m=>[...Array(m>>1).fill('🔷'),...(m&1?['🔹']:[])];
  C.iconos=function(lado,m,activo){
    if(!activo){MEDV[lado]=0;return ''}
    const prev=MEDV[lado]||0;MEDV[lado]=m;
    const t=tok(m),g=m>prev?Math.max(1,tok(m-prev).length):0;
    let h=t.map((x,i)=>{const nuevo=g&&i>=t.length-g;return `<span class="ico${nuevo?' gana':''}"${nuevo?` style="animation-delay:${(i-(t.length-g))*90}ms"`:''}>${x}</span>`}).join('');
    if(m<prev)h+=tok(prev-m).map(x=>`<span class="ico gasta">${x}</span>`).join('');
    return h||'—';
  };

  /* cinemática de habilidad / ULTI (se puede saltar tocando) */
  let skip=null,FASE=0,EXTRA=0;
  C.cine=function(an,key){
    const a=document.getElementById('anim');
    const ulti=/^💥/.test(an.titulo||''),crit=/CRÍTICO/.test(an.desc||''),trans=/Cambio de turno/.test(an.titulo||'');
    a.className=ulti?'cn-u':crit?'cn-c':trans?'cn-t':'cn-h';
    a.style.setProperty('--c',an.color||'#888');
    a.style.display='flex';
    if(crit&&!ulti){        // estilo Persona: franjas, imagen que entra de lado y nombre del ataque en grande
      const nom=esc((an.titulo||'').replace(/<a?:\w+:\d+>/g,'').replace(/^[^\p{L}\p{N}]+/u,'')),tag=(an.desc||'').split('\n').slice(1).join(' ');
      a.innerHTML=`<div class="cp-f"></div><div class="cp-r"></div>
        ${key||an.gif?`<div class="cp-w"><img class="cp-img" alt="" ${cadena(key,['banner','ulti'],'')}></div>`:''}
        <div class="cp-n"><small>¡CRÍTICO!</small><b>${nom}</b></div>
        <div class="cp-d">${fmt(tag)}</div><div class="cp-fl"></div><div class="cn-skip">toca para saltar</div>`;
      /* fase 2: tras el banner, entra la animación del crítico (<personaje>_critico.webp o .gif; si no existe, el GIF de imgur) */
      const mi=++FASE;
      if(key&&lista(key,'critico').length||an.gif){
        EXTRA=1800;
        setTimeout(()=>{
          if(mi!==FASE||!a.classList.contains('cn-c'))return;
          const w=a.querySelector('.cp-w');if(!w)return;
          w.style.animation='none';
          w.innerHTML=`<img class="cp-img cp-an" alt="" ${cadena(key,['critico'],an.gif)}>`;
          const fl=document.createElement('div');fl.className='cp-fl';a.appendChild(fl);
        },1800);
      }
      return;
    }
    a.innerHTML=`<div class="cn-rayos"></div>${ulti||crit?`<div class="cn-cinta">${ulti?'¡ÚLTI!':'¡CRÍTICO!'}</div>`:''}${ulti&&key&&lista(key,'ulti').length?`<img class="cn-img cn-ult" ${C.cara(key,'ulti',an.gif)}>`:(an.gif?`<img class="cn-img" ${key?cadena(key,['ataque'],an.gif):`src="${an.gif}"`}>`:'')}`+
      `<div class="cn-tit">${fmt(an.titulo)}</div><div class="cn-desc">${fmt(an.desc)}</div><div class="cn-skip">toca para saltar</div>`;
  };
  C.cerrar=function(){FASE++;const a=document.getElementById('anim');a.style.display='none';a.className='';a.innerHTML=''};
  C.esperar=ms0=>new Promise(r=>{
    const ms=ms0+EXTRA;EXTRA=0;
    const t=setTimeout(fin,ms);
    function fin(){clearTimeout(t);skip=null;r()}
    skip=fin;
  });
  document.addEventListener('click',e=>{if(skip&&e.target.closest&&e.target.closest('#anim'))skip()});

  /* el atacante da un salto hacia el rival justo antes de que se vea el resultado */
  C.antes=async function(prev,nuevo){
    if(!prev||!nuevo||!/ usa \*\*|💥 \*\*/.test(nuevo.log||''))return;
    const lado=prev.turno===0?0:1;
    const i=(ATK&&ATK.lado===lado)?ATK.i:prev.actor;
    const el=i==null?null:document.querySelector(`.lu[data-l="${lado}"][data-i="${i}"]`);
    if(el){el.classList.add('lunge'+lado);await esp(300)}
  };

  function capa(){let c=document.getElementById('cbfx');if(!c){c=document.createElement('div');c.id='cbfx';document.body.appendChild(c)}return c}
  function flota(card,html,cls,retraso){
    if(!card)return;
    const r=card.getBoundingClientRect(),e=document.createElement('div');
    e.className='flt '+cls;e.innerHTML=html;
    e.style.left=(r.left+r.width/2)+'px';e.style.top=(r.top+r.height*.22)+'px';e.style.animationDelay=retraso+'ms';
    capa().appendChild(e);setTimeout(()=>e.remove(),1500+retraso);
  }
  C.aviso=function(txt,color){
    const b=document.createElement('div');b.className='cb-ban';b.textContent=txt;b.style.setProperty('--c',color||'#4aa3ff');
    document.body.appendChild(b);setTimeout(()=>b.remove(),1300);
  };
  C.inicio=function(){C.aviso('⚔️ ¡A pelear!','var(--gold)')};

  /* resultado de un paso: números, golpes, curaciones, esquivas, muertes, avisos */
  C.efectos=function(prev,S,opc){
    ATK=null;
    if(!prev||!S)return;
    const lado=prev.turno===0?0:1,rival=1-lado,log=S.log||'';
    const crit=/¡Crítico!/.test(log),falla=/pero falla/.test(log),ulti=/💥 \*\*/.test(log);
    const card=(s,i)=>document.querySelector(`.lu[data-l="${s}"][data-i="${i}"]`);
    const ch=[];
    [0,1].forEach(s=>S.equipos[s].luchadores.forEach(l=>{
      const p=prev.equipos[s].luchadores[l.i];if(!p)return;
      const d=(l.forma!==p.forma)?0:hpDe(l)-hpDe(p);
      ch.push({s,i:l.i,d,mx:mxDe(l),murio:p.vivo&&!l.vivo});
    }));
    let pico=null;ch.filter(x=>x.s===rival&&x.d<0).forEach(x=>{if(!pico||x.d<pico.d)pico=x});
    let fuerte=crit||ulti,n=0;
    ch.forEach(x=>{
      const el=card(x.s,x.i);if(!el)return;
      const ret=n*90;
      if(x.d<0){
        const es=crit&&pico===x,f=es||-x.d>=x.mx*.3;if(f)fuerte=true;
        el.classList.add(f?'golpe-f':'golpe');el.style.animationDelay=ret+'ms';
        flota(el,(es?'<span class="sub">¡CRÍTICO!</span>':'')+'-'+(-x.d),es?'crit':'dan',ret);n++;
      }else if(x.d>0){
        el.classList.add('sana');el.style.animationDelay=ret+'ms';
        flota(el,'+'+x.d,'cur',ret);n++;
      }
      if(x.murio){el.classList.remove('golpe','golpe-f');el.classList.add('morir');el.style.animationDelay=ret+'ms';flota(el,'💀','mue',ret+250);fuerte=true}
    });
    if(falla){
      const m=log.match(/sobre \*\*(.+?)\*\*\.\.\./);
      if(m){const tag=m[1],l=S.equipos[rival].luchadores.find(z=>tag.startsWith(z.nombre)||(z.forma&&tag.startsWith(z.forma)));
        if(l){const el=card(rival,l.i);if(el){el.classList.add('esq');flota(el,'Falló 💨','fal',0)}}}
    }
    if(fuerte){const a=document.getElementById('app');a.classList.remove('sacude');void a.offsetWidth;a.classList.add('sacude');setTimeout(()=>a.classList.remove('sacude'),550)}
    if(prev.turno!==S.turno&&!S.terminado&&!(opc&&opc.trans))
      C.aviso(S.turno===0?'⚔️ ¡Tu turno!':'🔔 Turno de '+S.equipos[1].nombre,S.turno===0?'#4aa3ff':'var(--bad)');
  };
})();


/* =====================================================================
   REGISTRO, ICONOS DE EFECTOS, ESTADÍSTICAS Y SONIDOS DE COMBATE
   ===================================================================== */
(function(){
  const C=window.CBT;
  const css=document.createElement('style');
  css.textContent=`
  .reg{background:var(--card);border-radius:12px;padding:8px 10px;margin:10px 0}
  .reg summary{cursor:pointer;font-weight:700;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .reg summary::-webkit-details-marker{display:none}
  .reg summary:before{content:'▾';margin-right:4px;color:var(--mut)}
  .reg:not([open]) summary:before{content:'▸'}
  .reg summary span{flex:1}
  .sfxb{padding:3px 9px;font-size:.74rem;background:var(--line);border-radius:8px}
  .regc{max-height:210px;overflow:auto;margin-top:6px}
  .lg{padding:2px 7px;margin:3px 0;border-left:3px solid #555;border-radius:5px;background:#ffffff08;font-size:.85rem;line-height:1.35;text-align:left}
  .lg-dano{border-color:var(--bad);background:#e5484d16}
  .lg-crit{border-color:var(--gold);background:#ffd24a20;font-weight:700}
  .lg-ulti{border-color:var(--ac);background:#38d4ff22;font-weight:700}
  .lg-cura{border-color:var(--ok);background:#3fb56b16}
  .lg-muerte{border-color:#c1121f;background:#c1121f30;font-weight:700}
  .lg-falla{border-color:#8a90a2;color:#aab3c5}
  .lg-efecto{border-color:#a970ff;background:#a970ff16}
  .lg-aviso{border-color:#4aa3ff;background:#4aa3ff14}
  .efs{display:flex;flex-wrap:wrap;gap:3px;min-height:1.4em;margin-top:2px}
  .ef{font-size:.95rem;line-height:1;background:#0007;border-radius:8px;padding:2px 4px;cursor:pointer}
  .ef sub{font-size:.58rem;color:var(--gold);margin-left:1px}
  #efinfo{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:25;max-width:92vw;width:340px;background:#10131c;border:2px solid var(--ac);border-radius:12px;
    padding:10px 12px;font-size:.88rem;box-shadow:0 6px 24px #000a;animation:cb-fade .2s}
  .lu.obj:after{content:'🎯';position:absolute;top:2px;right:3px;font-size:1rem;z-index:3;animation:cb-resp 1.2s ease-in-out infinite}
  .lu.nob{opacity:.62}
  .resu{background:var(--card);border-radius:12px;padding:10px;margin:12px 0;text-align:left}
  .resu h3{margin:0 0 8px;font-size:1rem;text-align:center}
  .resu .fl{display:grid;grid-template-columns:1fr 54px 54px;gap:4px;align-items:center;padding:4px 2px;border-bottom:1px solid #ffffff10;font-size:.88rem}
  .resu .fl.ca{color:var(--mut);font-size:.74rem;border:0}
  .resu .fl b{text-align:center}.resu .fl .r{color:#ff9b9b}
  .mvp{display:flex;align-items:center;gap:10px;margin-top:10px;padding:8px;border-radius:10px;background:#ffd24a14;border:1px solid #ffd24a55}
  .mvp img{width:56px;height:56px;border-radius:10px;object-fit:cover;background:#000}
  .mvp small{display:block;color:var(--mut)}
  `;
  document.head.appendChild(css);

  /* ---------- sonidos (sintetizados, sin archivos) ---------- */
  let ctx=null;
  const mute=()=>LS.g('sfx_mute')==='1';
  const audio=()=>{
    if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}
    if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    return ctx;
  };
  document.addEventListener('pointerdown',audio,{passive:true});
  const ruido=(a,d)=>{const n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;const s=a.createBufferSource();s.buffer=b;return s};
  const env=(g,t,at,pk,dec)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+at);g.gain.exponentialRampToValueAtTime(.0001,t+at+dec)};
  function tono(a,t,tipo,f0,f1,dur,vol){
    const o=a.createOscillator(),g=a.createGain();o.type=tipo;o.frequency.setValueAtTime(f0,t);
    if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
    env(g,t,.01,vol,dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05);
  }
  function golpe(a,t,f){
    const s=ruido(a,.22),fl=a.createBiquadFilter(),g=a.createGain();
    fl.type='lowpass';fl.frequency.setValueAtTime(2600*f,t);fl.frequency.exponentialRampToValueAtTime(250,t+.18);
    env(g,t,.005,.45*f,.17);s.connect(fl);fl.connect(g);g.connect(a.destination);s.start(t);s.stop(t+.22);
    tono(a,t,'sine',150*f,45,.17,.6*f);
  }
  function soplo(a,t,f0,f1,dur,vol){
    const s=ruido(a,dur+.05),fl=a.createBiquadFilter(),g=a.createGain();
    fl.type='bandpass';fl.Q.value=1.1;fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(f1,t+dur);
    env(g,t,dur*.2,vol,dur*.8);s.connect(fl);fl.connect(g);g.connect(a.destination);s.start(t);s.stop(t+dur+.05);
  }
  const SON={
    golpe:a=>golpe(a,a.currentTime,1),
    fuerte:a=>golpe(a,a.currentTime,1.5),
    crit:a=>{const t=a.currentTime;golpe(a,t,1.7);[1319,1760,2349].forEach((f,i)=>tono(a,t+.05+i*.06,'square',f,f*1.01,.18,.1))},
    cura:a=>{const t=a.currentTime;[523,659,784,1047].forEach((f,i)=>tono(a,t+i*.08,'triangle',f,0,.25,.2))},
    falla:a=>soplo(a,a.currentTime,2600,400,.25,.22),
    habilidad:a=>{const t=a.currentTime;soplo(a,t,300,2400,.35,.25);tono(a,t,'sawtooth',180,700,.3,.07)},
    ulti:a=>{const t=a.currentTime;tono(a,t,'sawtooth',50,200,.95,.28);tono(a,t,'square',100,420,.95,.06);soplo(a,t,200,3000,.9,.3);golpe(a,t+.9,2)},
    muerte:a=>{const t=a.currentTime;tono(a,t,'sine',420,45,.6,.35);golpe(a,t+.04,1.2)},
    turno:a=>{const t=a.currentTime;tono(a,t,'sine',784,0,.14,.16);tono(a,t+.09,'sine',1047,0,.2,.16)},
    rival:a=>{const t=a.currentTime;tono(a,t,'sine',392,0,.14,.15);tono(a,t+.09,'sine',330,0,.22,.15)},
    derrota:a=>{const t=a.currentTime;[392,370,330,262].forEach((f,i)=>tono(a,t+i*.22,'triangle',f,f*.97,.4,.22))},
  };
  C.sfx=function(n){
    if(mute())return;const a=audio();if(!a||a.state!=='running')return;
    try{SON[n]&&SON[n](a)}catch(e){}
  };
  C.mute=function(b){
    LS.s('sfx_mute',mute()?'0':'1');
    if(b)b.textContent=(mute()?'🔇':'🔊')+' Efectos';
    if(!mute())C.sfx('turno');
  };


  /* ---------- VOCES de los personajes (críticos, golpes fuertes y ÚLTI) ----------
     Archivos en la carpeta voces/ :  <personaje>_critico_1.mp3 · <personaje>_ulti_1.mp3 (ver LEEME_VOCES.txt)
     Reglas: cada audio suena UNA vez (nunca en bucle) · solo una voz a la vez · pausa después de cada voz ·
     un personaje no vuelve a hablar enseguida · no repite el mismo audio hasta usar todos los demás. */
  const VOZ_VOL=1.0;            // volumen de las voces (0 a 1)
  const VOZ_MAX_MS=5500;        // ningún audio suena más de esto (se corta con fundido)
  const VOZ_GAP_MS=2500;        // pausa global después de terminar una voz (crítico)
  const VOZ_GAP_PJ_MS=7000;     // pausa de ese mismo personaje después de terminar su voz
  const VOZ_PROB={critico:1,ulti:1}; // probabilidad de hablar (1 = siempre, 0.6 = 60%)
  let VOCES=null,vozLista=null,vozNodo=null,vozTipo=null,vozLibre=0,vozPaso=0;   // vozPaso = nº de jugada (cinemática y resultado de una jugada no hablan dos veces)
  const vozBuf={},vozBolsa={},vozUlt={},vozIntento={},vozPj={};
  const vozOn=()=>LS.g('voz_off')!=='1';
  function vozCargarLista(){
    if(!vozLista)vozLista=fetch('/api/voces').then(r=>r.json()).then(d=>{VOCES=d.voces||{}}).catch(()=>{VOCES={}});
    return vozLista;
  }
  function vozBuffer(url){
    if(!vozBuf[url])vozBuf[url]=fetch(url).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()})
      .then(b=>new Promise((ok,no)=>{const a=audio();if(!a)return no();a.decodeAudioData(b,ok,no)})).catch(()=>{delete vozBuf[url];return null});
    return vozBuf[url];
  }
  function vozElegir(key,tipo){            // baraja: usa todos los audios antes de repetir y nunca el mismo dos veces seguidas
    const l=((VOCES||{})[key]||{})[tipo]||[];if(!l.length)return null;
    const id=key+':'+tipo;let b=vozBolsa[id];
    if(!b||!b.length){
      b=l.slice().sort(()=>Math.random()-.5);
      if(l.length>1&&b[b.length-1]===vozUlt[id]){const t=b[0];b[0]=b[b.length-1];b[b.length-1]=t}
      vozBolsa[id]=b;
    }
    return (vozUlt[id]=b.pop());
  }
  function vozParar(){try{vozNodo&&vozNodo.stop()}catch(e){}}
  C.vozPrecargar=function(S){
    try{vozCargarLista().then(()=>{
      [0,1].forEach(s=>((S&&S.equipos&&S.equipos[s].luchadores)||[]).forEach(l=>{
        const v=(VOCES||{})[l.key]||{};['critico','ulti'].forEach(t=>(v[t]||[]).forEach(u=>vozBuffer(u)));
      }));
    })}catch(e){}
  };
  C.vozPaso=()=>vozPaso;
  C.vozDecir=async function(key,tipo,paso){
    try{
      const id=key+':'+tipo,t0=Date.now();
      if(paso===undefined)paso=vozPaso;
      if(vozIntento[id]===paso)return;   // ya se intentó con esta misma jugada
      vozIntento[id]=paso;
      if(!vozOn())return;
      if(Math.random()>(VOZ_PROB[tipo]===undefined?1:VOZ_PROB[tipo]))return;
      await vozCargarLista();
      const url=vozElegir(key,tipo);if(!url)return;
      const a=audio();if(!a||a.state!=='running')return;
      const ulti=tipo==='ulti';
      if(vozNodo&&!(ulti&&vozTipo!=='ulti'))return;                      // ya hay una voz sonando (la ÚLTI sí puede cortar a un crítico)
      if(!ulti&&t0<vozLibre)return;                                       // pausa global
      if(t0<(vozPj[id]||0))return;                                        // pausa de este personaje
      const buf=await vozBuffer(url);if(!buf)return;
      if(Date.now()-t0>1500)return;                                       // llegó tarde: ya no tiene sentido
      if(vozNodo){if(ulti&&vozTipo!=='ulti')vozParar();else return}
      const ac=audio(),src=ac.createBufferSource(),g=ac.createGain();
      src.buffer=buf;g.gain.value=VOZ_VOL;src.connect(g);g.connect(ac.destination);
      vozNodo=src;vozTipo=tipo;
      src.onended=()=>{
        if(vozNodo===src){vozNodo=null;vozTipo=null}
        const fin=Date.now();vozLibre=fin+VOZ_GAP_MS;vozPj[id]=fin+VOZ_GAP_PJ_MS;
      };
      const ahora=ac.currentTime,max=VOZ_MAX_MS/1000;
      src.start(ahora);
      if(buf.duration>max){g.gain.setValueAtTime(VOZ_VOL,ahora+max-.25);g.gain.linearRampToValueAtTime(0,ahora+max);src.stop(ahora+max)}
    }catch(e){}
  };
  C.voz=function(b){
    LS.s('voz_off',vozOn()?'1':'0');
    if(b)b.textContent=(vozOn()?'🗣️':'🤐')+' Voces';
    if(!vozOn())vozParar();
  };

  /* ---------- registro ---------- */
  let REG=true;
  C.reg=function(v){REG=v};
  const tipo=l=>{
    const t=l.replace(/<a?:\w+:\d+>/g,'').trim();
    if(/¡Crítico!/.test(t))return 'lg-crit';
    if(/^💥/.test(t))return 'lg-ulti';
    if(/💀/.test(t))return 'lg-muerte';
    if(/pero falla/.test(t))return 'lg-falla';
    if(/^💚|Cura:|regenera/.test(t)&&!/de daño/.test(t))return 'lg-cura';
    if(/🔄|Muerte súbita|⚠️|no puede actuar|pierde el turno/.test(t))return 'lg-aviso';
    if(/de daño|💢/.test(t))return 'lg-dano';
    if(/[🩸🔥☠🛡💫🪢💤🧵🔺✨👹⚡💨]/u.test(t))return 'lg-efecto';
    return '';
  };
  C.lineas=txt=>(txt||'').split('\n').filter(x=>x.trim()).map(l=>`<div class="lg ${tipo(l)}">${fmt(l)}</div>`).join('');
  C.registro=function(S){
    return `<details class="reg" ${REG?'open':''} ontoggle="CBT.reg(this.open)"><summary><span>📜 Registro</span>`+
      `<span><button class="sfxb" onclick="event.preventDefault();event.stopPropagation();CBT.voz(this)">${vozOn()?'🗣️':'🤐'} Voces</button> <button class="sfxb" onclick="event.preventDefault();event.stopPropagation();CBT.mute(this)">${mute()?'🔇':'🔊'} Efectos</button></span></summary>`+
      `<div class="regc"><div>${C.lineas(S.log)}</div></div></details>`;
  };

  /* ---------- iconos de efectos con explicación ---------- */
  const INFO=[
    ['Quemadura','Recibe 6 de daño al inicio de cada turno de su equipo.'],
    ['Veneno','Recibe 5 de daño al inicio de cada turno de su equipo.'],
    ['Parálisis','No puede actuar mientras dure.'],
    ['Debilidad','Hace 25% menos de daño.'],
    ['Guardia rota','Recibe 30% más de daño y su guardia no sirve.'],
    ['Enredado','No puede actuar y, al soltarse, queda debilitado.'],
    ['Sangrado','Recibe 4 de daño al inicio de cada turno de su equipo. Si Denji tiene Frenesí, le pega más fuerte.'],
    ['Sueño','No puede actuar mientras dure.'],
    ['Fusionado','Falla 15% más sus ataques.'],
    ['Regeneración','Se cura 5 de vida al inicio de cada turno de su equipo.'],
    ['Furia','Hace 25% más de daño.'],
    ['Velocidad','+25% de probabilidad de crítico.'],
    ['Frenesí','+20% de daño contra rivales que sangran y recupera vida al golpearlos.'],
    ['En guardia','Recibe la mitad del daño y quien lo golpea pierde 1 icono.'],
  ];
  const descDe=t=>{const n=t.replace(/^\S+\s/,'');const r=INFO.find(x=>n.startsWith(x[0]));return r?r[1]:''};
  C.chips=function(l){
    const det=(l.efectos_det||(l.efectos||[]).map(t=>({t,n:0}))).slice();
    if(l.guardia)det.push({t:'🛡️ En guardia',n:0});
    return `<div class="efs">`+det.map(e=>`<span class="ef" title="${esc(e.t)}" data-t="${esc(e.t)}" data-n="${e.n||0}" onclick="event.stopPropagation();CBT.info(this)">${esc(e.t.split(' ')[0])}${e.n?`<sub>${e.n}</sub>`:''}</span>`).join('')+`</div>`;
  };
  let tmi=null;
  C.info=function(el){
    let d=document.getElementById('efinfo');if(!d){d=document.createElement('div');d.id='efinfo';d.onclick=()=>d.remove();document.body.appendChild(d)}
    const t=el.dataset.t,n=+el.dataset.n,desc=descDe(t);
    d.innerHTML=`<b>${esc(t)}</b>${desc?`<br>${esc(desc)}`:''}${n?`<br><span style="color:var(--mut)">Le quedan ${n} turno${n==1?'':'s'} de su equipo.</span>`:''}`;
    clearTimeout(tmi);tmi=setTimeout(()=>{const x=document.getElementById('efinfo');x&&x.remove()},4500);
  };

  /* ---------- estadísticas ---------- */
  let ST=null;
  const nuevoST=()=>{ST={dano:[0,0],cura:[0,0],bajas:[0,0],crit:[0,0],turnos:0,pj:{}}};
  nuevoST();
  const r0=C.reset;C.reset=function(){r0();nuevoST()};
  const hpDe=l=>l.forma?l.forma_hp:l.hp,mxDe=l=>l.forma?90:l.max_hp;
  function calc(prev,S){
    const ac=C.actor(prev),lado=ac.lado,rival=1-lado,log=S.log||'';
    const r={lado,ai:ac.i,dano:0,cura:[0,0],muertes:[],crit:/¡Crítico!/.test(log),falla:/pero falla/.test(log),ulti:/💥 \*\*/.test(log),fuerte:false};
    [0,1].forEach(s=>S.equipos[s].luchadores.forEach(l=>{
      const p=prev.equipos[s].luchadores[l.i];if(!p)return;
      const d=(l.forma!==p.forma)?0:hpDe(l)-hpDe(p);
      if(d<0&&s===rival){r.dano+=-d;if(-d>=mxDe(l)*.3)r.fuerte=true}
      if(d>0)r.cura[s]+=d;
      if(p.vivo&&!l.vivo)r.muertes.push(s);
    }));
    return r;
  }
  function acumula(r,prev,S){
    ST.dano[r.lado]+=r.dano;r.cura.forEach((v,s)=>ST.cura[s]+=v);r.muertes.forEach(s=>ST.bajas[1-s]++);
    if(r.crit)ST.crit[r.lado]++;if(prev.turno!==S.turno)ST.turnos++;
    if(r.dano>0&&r.ai!=null){const k=r.lado+':'+r.ai;ST.pj[k]=(ST.pj[k]||0)+r.dano}
  }
  function suena(r,prev,S){
    if(r.dano>0)C.sfx(r.crit?'crit':(r.fuerte||r.ulti)?'fuerte':'golpe');else if(r.falla)C.sfx('falla');
    try{const l=r.ai!=null&&prev.equipos[r.lado].luchadores[r.ai],k=l&&l.key;
      const paso=C.vozPaso();
      if(k&&r.ulti)setTimeout(()=>C.vozDecir(k,'ulti',paso),150);
      else if(k&&r.dano>0&&(r.crit||r.fuerte))setTimeout(()=>C.vozDecir(k,'critico',paso),150)}catch(e){}
    if(r.cura[0]+r.cura[1]>0)setTimeout(()=>C.sfx('cura'),r.dano>0?230:0);
    if(r.muertes.length)setTimeout(()=>C.sfx('muerte'),r.dano>0?280:0);
    if(prev.turno!==S.turno&&!S.terminado)setTimeout(()=>C.sfx(S.turno===0?'turno':'rival'),650);
  }
  const e0=C.efectos;
  C.efectos=function(prev,S,opc){
    try{if(S)C.vozPrecargar(S)}catch(e){}
    try{if(prev&&S){const r=calc(prev,S);acumula(r,prev,S);suena(r,prev,S)}}catch(e){}
    vozPaso++;     // la jugada terminó: la siguiente puede volver a hablar
    e0(prev,S,opc);
  };
  const c0=C.cine;
  C.cine=function(an,key){
    c0(an,key);
    const t=an.titulo||'';
    if(/^💥/.test(t))C.sfx('ulti');else if(!/Cambio de turno/.test(t))C.sfx('habilidad');
    if(key){if(/^💥/.test(t))C.vozDecir(key,'ulti');else if(/CRÍTICO/.test(an.desc||''))C.vozDecir(key,'critico')}
  };
  C.resumen=function(S){
    let mvp=null;Object.keys(ST.pj).forEach(k=>{if(k[0]==='0'&&(!mvp||ST.pj[k]>mvp.v))mvp={i:+k.slice(2),v:ST.pj[k]}});
    const l=mvp&&S.equipos[0].luchadores[mvp.i];
    const fila=(n,a,b)=>`<div class="fl"><span>${n}</span><b>${a}</b><b class="r">${b}</b></div>`;
    return `<div class="resu"><h3>📊 Resumen de la pelea</h3>
      <div class="fl ca"><span>${ST.turnos} cambios de turno</span><b>Tú</b><b>Rival</b></div>
      ${fila('⚔️ Daño causado',ST.dano[0],ST.dano[1])}${fila('💥 Críticos',ST.crit[0],ST.crit[1])}
      ${fila('💚 Curación',ST.cura[0],ST.cura[1])}${fila('💀 Bajas causadas',ST.bajas[0],ST.bajas[1])}
      ${l?`<div class="mvp"><img src="${esc((YO.skins&&YO.skins[l.key])||l.gif||'')}"><div><b>⭐ MVP: ${esc(l.nombre)}</b><small>${mvp.v} de daño causado</small></div></div>`:''}</div>`;
  };
})();
