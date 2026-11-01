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
  .perfil{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:14px;padding:8px 12px;text-align:left}
  .perfil img.av{width:44px;height:44px;border-radius:50%}
  .perfil .nom{font-weight:700}.perfil .sub{color:var(--mut);font-size:.82rem}
  .perfil .mas{height:34px;margin-left:auto}
  .roles{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:6px 0}
  .rol{background:var(--card);border:2px solid transparent;border-radius:12px;padding:4px;text-align:center;font-size:.7rem;cursor:pointer;color:var(--tx)}
  .rol.on{border-color:var(--ac);background:#2a2018}
  .rol .im{height:38px;display:flex;align-items:center;justify-content:center;font-size:1.6rem}
  .rol .im img{max-height:38px;max-width:100%;object-fit:contain;border-radius:6px}
  .fila3{display:flex;gap:8px;align-items:stretch}
  .ranura{flex:1;max-width:96px;height:84px;border:2px dashed #3a4052;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#3a4052;font-size:1.5rem;font-weight:700;position:relative;overflow:hidden;background:var(--card)}
  .ranura.llena{border:2px solid var(--ac);cursor:pointer;color:#fff}
  .ranura.ver{box-shadow:0 0 0 2px #ffd400}
  .ranura img{width:100%;height:100%;object-fit:cover}
  .ranura .nm{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);font-size:.64rem;padding:2px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .fila3 .azar{flex:none;width:84px;padding:6px 4px;font-size:.78rem}
  .sel2{display:flex;gap:10px;align-items:flex-start;margin-top:10px}
  #rueda{flex:none;position:relative;width:176px;overflow:hidden;border-radius:0 180px 180px 0;
    background:radial-gradient(circle at 0 50%,#2a2f44 0,#161926 45%,#10131c 100%);border:1px solid #2b3040;border-left:0}
  #rueda .anillo{position:absolute;left:0;border:1px dashed #2f3550;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%)}
  #rueda .hub{position:absolute;left:0;top:50%;width:92px;height:92px;margin:-46px 0 0 -46px;border-radius:50%;background:#1b2030;border:2px solid #343a4c;
    display:flex;align-items:center;justify-content:flex-end;padding-right:12px;font-weight:700;font-size:1.05rem}
  #rueda .t{position:absolute;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:8px;border:2px solid #343a4c;background:var(--card2);overflow:hidden;cursor:pointer;
    transition:transform .15s,opacity .2s}
  #rueda .t img{width:100%;height:100%;object-fit:cover;pointer-events:none}
  #rueda .t .fv{position:absolute;top:0;right:1px;font-size:.7rem;text-shadow:0 0 3px #000}
  #rueda .t.en{border-color:var(--ac)}
  #rueda .t.en::after{content:"✔";position:absolute;inset:0;background:rgba(255,122,61,.4);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#fff}
  #rueda .t.marco{border-color:#ffd400;box-shadow:0 0 0 2px #ffd400,0 0 14px #ffd400aa;transform:scale(1.18);z-index:5}
  #rueda .t.opaco{opacity:.2;pointer-events:none}
  #panel{flex:1;min-width:0}
  #panel .ret{width:100%;max-width:150px;aspect-ratio:1;border:3px solid #ffd400;border-radius:12px;overflow:hidden;background:#000;margin:0 auto}
  #panel .ret img{width:100%;height:100%;object-fit:cover}
  #panel .nom{font-weight:700;text-align:center;margin:6px 0 2px}
  #panel .rl{color:var(--mut);font-size:.75rem;text-align:center}
  #panel .fr{background:var(--card);border-left:4px solid #ffd400;border-radius:8px;padding:6px 8px;margin:8px 0;font-size:.85rem;min-height:2.6em}
  #panel .bt{display:flex;gap:6px}
  #panel .bt button{padding:10px 6px}
  #panel .conf{flex:1;background:#ffd400;color:#1a1500;font-weight:800;letter-spacing:.04em}
  #panel .est{width:44px;background:#2b3040}
  #panel .vacio{color:var(--mut);font-size:.9rem;padding:30px 6px;text-align:center}
  #fondo{position:fixed;inset:0;z-index:-1;background-size:cover;background-position:center;background-repeat:no-repeat;transition:opacity .35s}
  .ranura .ord{position:absolute;top:0;left:0;background:var(--ac);color:#fff;font-size:.68rem;padding:0 5px;border-radius:0 0 8px 0;z-index:2}
  .ordtxt{color:var(--mut);font-size:.75rem;margin:2px 0 4px}
  #panel .mv{display:flex;align-items:center;gap:6px;margin:6px 0}
  #panel .mv span{flex:1;text-align:center;font-size:.8rem;color:var(--mut)}
  #panel .mv button{padding:6px 14px;background:#3a3f4f}
  .guard{margin:8px 0}
  .guard .tt{color:var(--mut);font-size:.75rem;margin-bottom:4px}
  .guard .fl{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
  .gs{background:var(--card);border-radius:10px;padding:5px}
  .gs .gm{display:flex;gap:2px;justify-content:center;align-items:center;height:34px;cursor:pointer;font-size:.75rem;color:var(--mut)}
  .gs .gm img{width:32%;height:34px;object-fit:cover;border-radius:5px}
  .gs .gb{display:flex;gap:4px;margin-top:4px}
  .gs .gb button{flex:1;padding:3px;font-size:.8rem}
  .lu .num{position:absolute;top:2px;left:2px;z-index:2;background:#000b;color:#fff;font-weight:800;font-size:.72rem;min-width:1.4em;text-align:center;border-radius:8px;padding:0 4px}
  .lu.ya{border-color:#ffd400;box-shadow:0 0 12px #ffd40088}
  .lu.ya .num{background:#ffd400;color:#1a1500}
  .orden{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font-size:.76rem;color:var(--mut);margin:0 0 4px}
  .orden b{color:var(--tx)}.orden .on{color:#ffd400;font-weight:800}.orden .x{text-decoration:line-through;opacity:.5}
  .mc{display:inline-flex;padding:3px;border-radius:50%;background:var(--m,transparent);flex:none}
  .mc img{display:block;border-radius:50%}
  .perfil .tit{color:#ffd400;font-size:.72rem}
  .confeti{position:fixed;left:0;right:0;top:0;height:0;z-index:30;pointer-events:none}
  .confeti i{position:absolute;top:-30px;font-style:normal;animation:cae 1.9s ease-in forwards}
  @keyframes cae{to{transform:translateY(105vh) rotate(540deg);opacity:.2}}
  .tabs{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;margin:4px 0;scrollbar-width:thin}
  .tabs button{flex:none;background:#2a2f44;padding:8px 12px;font-size:.85rem;border:2px solid transparent}
  .tabs button.on{border-color:#ff7a3d;background:#3a2a1a}
  .of{background:linear-gradient(135deg,#3a1a10,#1a1d28);border:1px solid #ff5a1f;border-radius:12px;padding:10px;margin:8px 0;display:flex;gap:10px;align-items:center;justify-content:space-between;font-size:.9rem}
  .of b{color:#ffd400}.of button{flex:none}
  .vit{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px;margin-top:8px}
  .cartx{background:var(--card);border:1px solid #2b3040;border-radius:14px;padding:10px;text-align:center;position:relative;display:flex;flex-direction:column;gap:6px;transition:transform .15s,box-shadow .15s}
  .cartx:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(255,90,31,.25)}
  .cartx .vis{height:92px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:#12141d;overflow:hidden}
  .cartx .vis img.gi{height:76px;max-width:90%;object-fit:contain}
  .cartx .vis .foto{width:100%;height:100%;background-size:cover;background-position:center}
  .cartx .vis .tt{font-weight:800;color:#ffd400;padding:4px;font-size:.95rem}
  .cartx .vis .ring{width:62px;height:62px;border-radius:50%;padding:5px;display:flex}.cartx .vis .ring i{flex:1;border-radius:50%;background:#12141d}
  .cartx .nm{font-weight:700;font-size:.92rem}
  .cartx .pr{color:#f5b301;font-weight:700}.cartx .pr s{color:var(--mut);font-weight:400;font-size:.8rem;margin-right:4px}
  .cartx .bd{position:absolute;top:6px;left:6px;font-size:.68rem;background:#ff5a1f;color:#fff;border-radius:8px;padding:1px 7px;z-index:2}
  .cartx .bd.ok{background:#3fb56b}
  .cartx .bt2{display:flex;gap:6px}.cartx .bt2 button{flex:1;padding:7px 4px;font-size:.82rem}.cartx .bt2 button.ver{flex:none;width:38px;background:#3a3f4f}
  .cartx.bloq{opacity:.45;filter:grayscale(1)}
  .cartx.bloq .vis::after{content:"🔒";position:absolute;font-size:1.6rem}
  .cartx .vis{position:relative}
  .col{color:var(--mut);font-size:.85rem;margin:6px 0}
  #prev{position:fixed;inset:0;background:#000c;z-index:20;display:flex;align-items:center;justify-content:center;padding:16px}
  #prev .caja2{background:var(--card);border:2px solid #ff7a3d;border-radius:16px;padding:14px;max-width:360px;width:100%;text-align:center}
  #prev img.big{max-width:100%;max-height:50vh;border-radius:10px}
  .tienda .item{border:1px solid #2b3040;transition:transform .15s,box-shadow .15s}
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
    if(n==='combate'&&typeof YO!=='undefined'&&YO.fondo_img)img=YO.fondo_img;
    const o=I.FONDO_OSCURO==null?.55:I.FONDO_OSCURO;
    const nuevo=img?`linear-gradient(rgba(10,12,18,${o}),rgba(10,12,18,${o})),url("${img.replace(/"/g,'%22')}")`:'none';
    if(d.dataset.v!==nuevo){d.dataset.v=nuevo;d.style.backgroundImage=nuevo}
  };
  U.fondoDe=function(m){U.fondo({menu:'inicio',bazar:'bazar',pelea:'combate',fin:'combate'}[m]||'inicio')};
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
  U.portada=function(){
    musica('menu');
    U.fondo('inicio');
    const perfil=YO.logueado
     ?`<div class="perfil">${U.av(YO,44)}<div><div class="nom">${esc(YO.nombre)}</div>${YO.titulo?`<div class="tit">«${esc(YO.titulo)}»</div>`:''}
        <div class="sub">💀 ${YO.monedas} · 🏆 ${YO.victorias||0} · 💔 ${YO.derrotas||0}</div></div>
        ${YO.mascota_url?`<img class="mas" src="${esc(YO.mascota_url)}">`:''}<a href="/auth/logout" style="color:var(--mut);font-size:.75rem">salir</a></div>`
     :(YO.login_disponible?`<a class="btn-discord" style="display:block;padding:10px;border-radius:12px;color:#fff;text-decoration:none" href="/auth/login">Iniciar sesión con Discord</a>`:`<div class="perfil"><span style="color:var(--mut)">Modo invitado</span></div>`);
    const frase=azar(I.BIENVENIDAS&&I.BIENVENIDAS.length?I.BIENVENIDAS:['¡Hola!']).replace(/\{nombre\}/g,nombre());
    $('#app').innerHTML=`<div class="portada">${perfil}
      ${I.BIENVENIDA_IMG?`<img class="bur" src="${esc(I.BIENVENIDA_IMG)}">`:`<div class="bur0">🔥</div>`}
      <div class="burnice" style="text-align:left"><b>🔥 Burnice:</b> ${fmt(frase)}</div>
      ${I.AVISO?`<div class="dia">📣 ${fmt(I.AVISO)}</div>`:''}
      <div class="grandes"><button onclick="dibujarEleccion()">⚔️ Jugar</button><button class="btn-burnice" onclick="bazar('inicio')">🔥 Bazar</button></div>
      <div id="extras"></div></div>`;
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
    `<h1 style="font-size:1.1rem">⚔️ Elige tu equipo de 3</h1>
    <div class="roles">${bl}</div>
    <div class="fila3"><div id="ranuras" style="display:contents"></div><button class="sec azar" onclick="UI.azar()">🎲 Al azar</button></div>
    <div class="ordtxt">El orden de las ranuras (1º → 2º → 3º) es el orden en que actúan. Elige un personaje de tu equipo y muévelo con ◀ ▶.</div>
    <div class="guard" id="guard"></div>
    <div class="sel2"><div id="rueda" style="height:${w.H}px">${w.h}</div><div id="panel"></div></div>
    <div id="ctrl" style="margin-top:12px"></div>`;
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
