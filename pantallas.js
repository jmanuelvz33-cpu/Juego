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
  .roles{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:6px 0}
  .rol{background:var(--card);border:2px solid transparent;border-radius:12px;padding:4px;text-align:center;font-size:.72rem;cursor:pointer;color:var(--tx)}
  .rol.on{border-color:var(--ac);background:#2a2018}
  .rol .im{height:38px;display:flex;align-items:center;justify-content:center;font-size:1.6rem}
  .rol .im img{max-height:38px;max-width:100%;object-fit:contain;border-radius:6px}
  .sel{display:flex;gap:8px;align-items:stretch}
  .ranuras{flex:none;width:92px;display:flex;flex-direction:column;gap:8px}
  .ranura{height:100px;border:2px dashed #3a4052;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#3a4052;font-size:1.6rem;font-weight:700;position:relative;overflow:hidden;background:var(--card)}
  .ranura.llena{border:2px solid var(--ac);cursor:pointer;color:#fff}
  .ranura img{width:100%;height:100%;object-fit:cover}
  .ranura .nm{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);font-size:.68rem;padding:2px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ranuras .azar{padding:8px 4px;font-size:.8rem}
  #arco{position:relative;flex:1;min-width:0;height:380px;overflow:hidden;touch-action:pan-x;user-select:none;-webkit-user-select:none;
    background:radial-gradient(circle at 100% 50%,#1d2232 0,#12151e 70%);border-radius:16px}
  #arco .cc{position:absolute;width:74px;height:100px;margin:-50px 0 0 -37px;background:var(--card2);border:2px solid #343a4c;border-radius:10px;
    overflow:hidden;cursor:pointer;transition:left .28s,top .28s,transform .28s,opacity .28s}
  #arco.arr .cc{transition:none}
  #arco .cc img{width:100%;height:100%;object-fit:cover;pointer-events:none}
  #arco .cc .nm{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.72);font-size:.66rem;padding:2px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #arco .cc .ri{position:absolute;top:2px;left:3px;font-size:.8rem;text-shadow:0 0 3px #000}
  #arco .cc.en{border-color:var(--ac)}
  #arco .cc.en::after{content:"✔";position:absolute;inset:0;background:rgba(255,122,61,.35);display:flex;align-items:center;justify-content:center;font-size:2rem;color:#fff}
  #arco .fl{position:absolute;right:6px;z-index:5;width:32px;height:32px;padding:0;border-radius:50%;background:#2b3040;font-size:.8rem}
  .frase{background:var(--card);border-left:4px solid var(--ac);border-radius:10px;padding:8px 10px;margin:8px 0;min-height:2.4em;font-size:.92rem}
  .tienda .item{border:1px solid #2b3040;transition:transform .15s,box-shadow .15s}
  .tienda .item:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(255,90,31,.25)}
  `;
  document.head.appendChild(css);

  const U=window.UI={rot:0,filtro:'todos',frase:'',STEP:30,ini:true};
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

  /* ---------- selección ---------- */
  function ranura(i){
    const k=elegidos[i],p=k&&PJ.find(x=>x.key===k);
    return p?`<div class="ranura llena" onclick="pick('${p.key}')">${p.gif?`<img src="${esc(p.gif)}">`:''}<div class="nm">${esc(p.nombre)}</div></div>`
            :`<div class="ranura">${i+1}</div>`;
  }
  U.eleccion=function(foco){
    musica('menu');
    if(foco&&elegidos.includes(foco)){const f=(I.FRASES||{})[foco];const p=PJ.find(x=>x.key===foco);
      U.frase=f&&f.length?`<b>${esc(p.nombre)}:</b> «${esc(azar(f))}»`:'';}
    else if(foco)U.frase='';
    const rolesH=['todos',...Object.keys(ROLES)].map(r=>{
      const R=ROLES[r]||{nombre:'Todos',icono:'✨',img:''};
      return `<button class="rol ${U.filtro===r?'on':''}" onclick="UI.filtrar('${r}')"><div class="im">${R.img?`<img src="${esc(R.img)}">`:R.icono}</div>${esc(R.nombre)}</button>`}).join('');
    const antes=$('#app').innerHTML;
    $('#app').innerHTML=barra(`<button class="sec" onclick="inicio(true)">🏠 Inicio</button> <button class="btn-burnice" onclick="bazar('inicio')">🔥 Bazar</button>`)+
    `<h1 style="font-size:1.1rem">⚔️ Elige tu equipo de 3</h1>
    <div class="roles">${rolesH}</div>
    <div class="sel"><div class="ranuras">${[0,1,2].map(ranura).join('')}<button class="sec azar" onclick="UI.azar()">🎲 Equipo al azar</button></div>
      <div id="arco"><button class="fl" style="top:6px" onclick="UI.mover(-1)">▲</button><button class="fl" style="bottom:6px" onclick="UI.mover(1)">▼</button></div></div>
    <div class="frase">${U.frase||'<span style="color:var(--mut)">Toca una carta para sumarla a tu equipo.</span>'}</div>
    <div class="fila">
      <span>Equipo: <b>${elegidos.length}/3</b></span>
      <select onchange="nivel=this.value"><option value="facil" ${nivel=='facil'?'selected':''}>CPU fácil</option><option value="normal" ${nivel=='normal'?'selected':''}>CPU normal</option><option value="dificil" ${nivel=='dificil'?'selected':''}>CPU difícil</option></select>
      <button ${elegidos.length==3?'':'disabled'} onclick="empezar()">¡A pelear! (CPU)</button>
      ${reto?`<button class="btn-burnice" ${elegidos.length==3&&YO.logueado?'':'disabled'} onclick="unirse()">⚔️ Aceptar el reto de ${esc(reto.creador)}</button>`
        :(YO.logueado?`<button class="btn-discord" ${elegidos.length==3?'':'disabled'} onclick="crearSala()">👥 Retar a un amigo</button>`:'')}</div>
    ${reto?(YO.logueado?`<div class="info">🔥 <b>${esc(reto.creador)}</b> te retó. Elige tu equipo y acepta.</div>`:`<div class="info">🔥 <b>${esc(reto.creador)}</b> te retó. Inicia sesión con Discord para aceptar.</div>`):''}`;
    montarArco();
  };
  function montarArco(){
    const ar=$('#arco');if(!ar)return;
    const l=lista();
    const max=Math.max(0,(l.length-1)*U.STEP);
    if(U.ini){U.rot=Math.round((l.length-1)/2)*U.STEP;U.ini=false}
    U.rot=Math.max(0,Math.min(max,U.rot));
    l.forEach(p=>{
      const d=document.createElement('div');d.className='cc'+(elegidos.includes(p.key)?' en':'');d.dataset.k=p.key;
      const R=ROLES[rolDe(p.key)];
      d.innerHTML=`${p.gif?`<img src="${esc(p.gif)}">`:''}${R?`<span class="ri">${R.img?'':R.icono}</span>`:''}<div class="nm">${esc(p.nombre)}</div>`;
      ar.appendChild(d);
    });
    colocar(true);
    let y0=null,r0=0,mov=false;
    ar.onpointerdown=e=>{if(e.target.closest('.fl'))return;y0=e.clientY;r0=U.rot;mov=false;ar.classList.add('arr')};
    ar.onpointermove=e=>{if(y0==null)return;const dy=e.clientY-y0;if(Math.abs(dy)>6)mov=true;
      if(mov){const R=radio(ar);U.rot=Math.max(0,Math.min(max,r0-dy/R*57.3));colocar(true)}};
    const suelta=()=>{if(y0==null)return;y0=null;ar.classList.remove('arr');
      U.rot=Math.round(U.rot/U.STEP)*U.STEP;U.rot=Math.max(0,Math.min(max,U.rot));colocar();
      setTimeout(()=>{mov=false},0)};
    ar.onpointerup=suelta;ar.onpointercancel=suelta;ar.onpointerleave=e=>{if(e.pointerType==='mouse')suelta()};
    ar.addEventListener('wheel',e=>{e.preventDefault();U.mover(e.deltaY>0?1:-1)},{passive:false});
    ar.onclick=e=>{if(mov)return;const c=e.target.closest('.cc');if(c&&c.style.opacity!=='0')pick(c.dataset.k)};
  }
  function radio(ar){const H=ar.clientHeight,W=ar.clientWidth;return Math.max(80,Math.min((H/2-50-4)/Math.sin(66*Math.PI/180),W-37-8))}
  function colocar(sinAnim){
    const ar=$('#arco');if(!ar)return;
    if(sinAnim&&!ar.classList.contains('arr')){ar.classList.add('arr');requestAnimationFrame(()=>requestAnimationFrame(()=>ar.classList.remove('arr')))}
    const H=ar.clientHeight,W=ar.clientWidth,R=radio(ar),cx=R+37+8,cy=H/2;
    const l=lista();
    ar.querySelectorAll('.cc').forEach(d=>{
      const i=l.findIndex(p=>p.key===d.dataset.k),a=i*U.STEP-U.rot;
      const ok=Math.abs(a)<=70,rad=a*Math.PI/180;
      d.style.left=(cx-R*Math.cos(rad))+'px';d.style.top=(cy+R*Math.sin(rad))+'px';
      d.style.transform=`rotate(${(a*0.35).toFixed(1)}deg) scale(${(1-Math.abs(a)/260).toFixed(3)})`;
      d.style.opacity=ok?String(Math.max(0.25,1-Math.abs(a)/90)):'0';
      d.style.pointerEvents=ok?'auto':'none';d.style.zIndex=String(100-Math.round(Math.abs(a)));
    });
  }
  U.mover=function(d){const l=lista(),max=Math.max(0,(l.length-1)*U.STEP);
    U.rot=Math.max(0,Math.min(max,Math.round(U.rot/U.STEP)*U.STEP+d*U.STEP));colocar()};
  U.filtrar=function(r){U.filtro=r;U.ini=true;dibujarEleccion()};
  U.azar=function(){
    const t=[...PJ].sort(()=>Math.random()-.5).slice(0,3).map(p=>p.key);
    elegidos.length=0;t.forEach(k=>elegidos.push(k));
    dibujarEleccion(t[0]);
  };
  addEventListener('resize',()=>colocar());
})();

