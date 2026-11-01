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
  .tienda .item{border:1px solid #2b3040;transition:transform .15s,box-shadow .15s}
  .tienda .item:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(255,90,31,.25)}
  `;
  document.head.appendChild(css);

  const U=window.UI={filtro:'todos',frase:'',sel:null};
  const rolDe=k=>(I.ROL||{})[k]||'';
  const lista=()=>PJ.filter(p=>U.filtro==='todos'||rolDe(p.key)===U.filtro);
  const nombre=()=>(typeof YO!=='undefined'&&YO.logueado)?YO.nombre:'viajero';

  /* ---------- inicio ---------- */
  U.portada=function(){
    musica('menu');
    const fondo=I.FONDO_IMG?`style="background:url('${esc(I.FONDO_IMG)}') center/cover;border-radius:16px;padding:8px"`:'';
    const perfil=YO.logueado
     ?`<div class="perfil">${YO.avatar?`<img class="av" src="${esc(YO.avatar)}">`:''}<div><div class="nom">${esc(YO.nombre)}</div>
        <div class="sub">💀 ${YO.monedas} · 🏆 ${YO.victorias||0} · 💔 ${YO.derrotas||0}</div></div>
        ${YO.mascota_url?`<img class="mas" src="${esc(YO.mascota_url)}">`:''}<a href="/auth/logout" style="color:var(--mut);font-size:.75rem">salir</a></div>`
     :(YO.login_disponible?`<a class="btn-discord" style="display:block;padding:10px;border-radius:12px;color:#fff;text-decoration:none" href="/auth/login">Iniciar sesión con Discord</a>`:`<div class="perfil"><span style="color:var(--mut)">Modo invitado</span></div>`);
    const frase=azar(I.BIENVENIDAS&&I.BIENVENIDAS.length?I.BIENVENIDAS:['¡Hola!']).replace(/\{nombre\}/g,nombre());
    $('#app').innerHTML=`<div class="portada" ${fondo}>${perfil}
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
    return p?`<div class="ranura llena ${U.sel===k?'ver':''}" onclick="UI.tocar('${p.key}')">${p.gif?`<img src="${esc(p.gif)}">`:''}<div class="nm">${esc(p.nombre)}</div></div>`
            :`<div class="ranura">${i+1}</div>`;
  }
  function panelH(){
    const p=PJ.find(x=>x.key===U.sel);
    if(!p)return `<div class="vacio">Toca una carta del círculo para verla.</div>`;
    const R=ROLES[rolDe(p.key)],en=elegidos.includes(p.key),lleno=elegidos.length>=3&&!en;
    return `<div class="ret">${p.gif?`<img src="${esc(p.gif)}">`:''}</div>
      <div class="nom">${esc(p.nombre)}</div><div class="rl">${R?esc(R.nombre):''}</div>
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
        h+=`<div class="t" data-k="${p.key}" style="left:${x}px;top:${y}px" onclick="UI.tocar('${p.key}')">${p.gif?`<img src="${esc(p.gif)}">`:''}${favs().includes(p.key)?'<span class="fv">⭐</span>':''}</div>`;
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
    $('#panel').innerHTML=panelH();
    const h=$('#hubn');if(h)h.textContent=elegidos.length+'/3';
    marcar();
    const c=$('#ctrl');if(c)c.innerHTML=ctrlH();
  };
  function ctrlH(){
    return `<div class="fila"><span>Equipo: <b>${elegidos.length}/3</b></span>
      <select onchange="nivel=this.value"><option value="facil" ${nivel=='facil'?'selected':''}>CPU fácil</option><option value="normal" ${nivel=='normal'?'selected':''}>CPU normal</option><option value="dificil" ${nivel=='dificil'?'selected':''}>CPU difícil</option></select>
      <button ${elegidos.length==3?'':'disabled'} onclick="empezar()">¡A pelear! (CPU)</button>
      ${reto?`<button class="btn-burnice" ${elegidos.length==3&&YO.logueado?'':'disabled'} onclick="unirse()">⚔️ Aceptar el reto de ${esc(reto.creador)}</button>`
        :(YO.logueado?`<button class="btn-discord" ${elegidos.length==3?'':'disabled'} onclick="crearSala()">👥 Retar a un amigo</button>`:'')}</div>
    ${reto?(YO.logueado?`<div class="info">🔥 <b>${esc(reto.creador)}</b> te retó. Elige tu equipo y acepta.</div>`:`<div class="info">🔥 <b>${esc(reto.creador)}</b> te retó. Inicia sesión con Discord para aceptar.</div>`):''}`;
  }
  U.eleccion=function(foco){
    musica('menu');
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
  U.fav=function(k){const f=favs(),i=f.indexOf(k);if(i>=0)f.splice(i,1);else f.push(k);setFavs(f);U.eleccion()};
  U.filtrar=function(r){U.filtro=r;U.eleccion()};
  U.azar=function(){
    const t=[...PJ].sort(()=>Math.random()-.5).slice(0,3).map(p=>p.key);
    elegidos.length=0;t.forEach(k=>elegidos.push(k));
    U.tocar(t[0]);
  };
})();
