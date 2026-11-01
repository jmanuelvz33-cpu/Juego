// Reproductor de música con tarjeta "disco girando". No necesitas tocar este archivo.
(function(){
  const M=window.MUSICA||{};
  const LS={g:k=>{try{return localStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  const st=document.createElement('style');
  st.textContent=`
  #mus{position:fixed;top:8px;right:8px;z-index:60;display:none;align-items:center;gap:8px;max-width:calc(100vw - 16px);
    background:rgba(24,27,37,.92);backdrop-filter:blur(6px);border:1px solid #2b3040;border-radius:40px;padding:5px 12px 5px 5px;
    box-shadow:0 4px 16px rgba(0,0,0,.45);color:#e8eaf0;font:13px/1.2 system-ui,sans-serif}
  body.conmus #mus{display:flex}
  body.conmus main{padding-top:58px}
  #mus .disc{flex:none;width:42px;height:42px;border-radius:50%;cursor:pointer;position:relative;
    background:radial-gradient(circle,#111 0 22%,transparent 23%),repeating-radial-gradient(circle,#0b0b0e 0 2px,#1c1c22 3px 4px);
    border:2px solid #333;animation:musgira 5s linear infinite;animation-play-state:paused}
  #mus.suena .disc{animation-play-state:running}
  #mus .disc i{position:absolute;inset:30%;border-radius:50%;background:#ff7a3d center/cover;border:1px solid #000}
  #mus .disc::after{content:"";position:absolute;inset:46%;border-radius:50%;background:#0f1117}
  @keyframes musgira{to{transform:rotate(360deg)}}
  #mus .tx{min-width:0;width:120px;overflow:hidden}
  #mus .tit{white-space:nowrap;font-weight:700;display:inline-block}
  #mus .tit.mov{animation:musmarq 9s linear infinite}
  @keyframes musmarq{0%,12%{transform:translateX(0)}88%,100%{transform:translateX(var(--d))}}
  #mus small{display:block;color:#8a90a2;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
  #mus button{background:none;border:0;color:#e8eaf0;padding:4px 5px;font-size:15px;border-radius:8px;cursor:pointer}
  #mus input[type=range]{width:56px;accent-color:#ff7a3d}
  #mus.min .tx,#mus.min button,#mus.min input{display:none}
  #mus.min{padding:5px}
  @media(max-width:520px){#mus input[type=range]{display:none}#mus .tx{width:96px}}`;
  document.head.appendChild(st);
  const box=document.createElement('div');box.id='mus';
  box.innerHTML=`<div class="disc" title="Mostrar / ocultar"><i></i></div>
    <div class="tx"><span class="tit"></span><small></small></div>
    <button class="bp" title="Pausa">⏸</button><button class="bn" title="Siguiente">⏭</button>
    <button class="bm" title="Silenciar">🔊</button><input type="range" min="0" max="100" title="Volumen">`;
  document.body.appendChild(box);
  const q=s=>box.querySelector(s);
  const au=new Audio();au.preload='auto';
  let vol=parseFloat(LS.g('mus_vol'));if(isNaN(vol))vol=0.4;
  let mute=LS.g('mus_mute')==='1',pausa=LS.g('mus_pausa')==='1',activo=false,oculto=false;
  let modo=null,lista=[],pista=null,fallos=0;
  if(LS.g('mus_min')==='1')box.classList.add('min');
  const vr=q('input');vr.value=Math.round(vol*100);

  function aplicaVol(){au.volume=mute?0:Math.max(0,Math.min(1,vol));q('.bm').textContent=(mute||vol===0)?'🔇':'🔊'}
  function pinta(){
    box.classList.toggle('suena',!au.paused&&!au.ended);
    q('.bp').textContent=(pausa||au.paused)?'▶':'⏸';
    document.body.classList.toggle('conmus',!!pista);
  }
  function titulo(){
    if(!pista)return;
    const t=q('.tit');t.classList.remove('mov');t.textContent=pista.t||'';q('small').textContent=pista.a?'por '+pista.a:'';
    const c=q('.disc i');c.style.backgroundImage=pista.c?`url("/musica/${encodeURIComponent(pista.c)}")`:'none';
    requestAnimationFrame(()=>{const d=t.scrollWidth-q('.tx').clientWidth;if(d>4){t.style.setProperty('--d',-(d+6)+'px');t.classList.add('mov')}});
  }
  function jugar(){
    if(!pista||!activo||pausa||oculto)return pinta();
    const p=au.play();if(p&&p.catch)p.catch(()=>{});
  }
  function cargar(t){
    pista=t;au.loop=lista.length===1;
    au.src='/musica/'+encodeURIComponent(t.f);aplicaVol();titulo();pinta();jugar();
  }
  function siguiente(){
    if(!lista.length)return;
    let o=lista.filter(x=>x!==pista);if(!o.length)o=lista;
    cargar(o[Math.floor(Math.random()*o.length)]);
  }
  function setModo(m){
    if(m===modo)return;modo=m;
    let l=M[m];if(!l||!l.length)l=(m==='bazar'||m==='fin')?(M.menu||[]):[];
    lista=l;
    if(!l.length){pista=null;au.pause();au.removeAttribute('src');return pinta()}
    if(pista&&l.includes(pista)){au.loop=l.length===1;return pinta()}   // ya suena una de este grupo
    siguiente();
  }
  au.addEventListener('ended',siguiente);
  au.addEventListener('play',pinta);au.addEventListener('pause',pinta);
  au.addEventListener('playing',()=>{fallos=0});
  au.addEventListener('error',()=>{if(++fallos<=lista.length&&lista.length>1)siguiente();else{pista=null;pinta()}});
  function primerToque(){if(activo)return;activo=true;jugar()}
  ['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,primerToque,{passive:true}));
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){oculto=true;au.pause()}else{oculto=false;jugar()}});
  q('.disc').onclick=()=>{box.classList.toggle('min');LS.s('mus_min',box.classList.contains('min')?'1':'0')};
  q('.bp').onclick=()=>{pausa=!pausa;LS.s('mus_pausa',pausa?'1':'0');if(pausa)au.pause();else{activo=true;jugar()}pinta()};
  q('.bn').onclick=()=>{activo=true;pausa=false;LS.s('mus_pausa','0');siguiente()};
  q('.bm').onclick=()=>{mute=!mute;LS.s('mus_mute',mute?'1':'0');aplicaVol()};
  vr.oninput=()=>{vol=vr.value/100;mute=false;LS.s('mus_vol',vol);LS.s('mus_mute','0');aplicaVol()};
  aplicaVol();
  window.MUS={modo:setModo};
})();
