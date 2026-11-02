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
  .vn .caja{position:relative;background:rgba(14,16,24,.93);border:2px solid var(--ac);border-radius:14px;padding:18px 14px 12px;margin-top:6px;min-height:92px;cursor:pointer}
  .vn .caja .nom{position:absolute;top:-14px;left:12px;background:var(--ac);color:#fff;font-weight:800;padding:2px 12px;border-radius:10px;font-size:.88rem}
  .vn .caja .txt{font-size:1rem;line-height:1.45;min-height:3em}
  .vn .caja .sig{position:absolute;right:12px;bottom:6px;color:var(--ac);animation:parp 1s steps(2) infinite}
  @keyframes parp{50%{opacity:0}}
  .vn .opc{display:grid;gap:7px;margin-top:10px}
  .vn .opc button{background:#232838;border:1px solid #3a4052;text-align:left;padding:10px 12px;font-size:.92rem}
  .vn .opc button.hecha{border-color:#3fb56b66;color:#c9d1e0}
  .vn .opc button.sal{background:#3a3f4f;text-align:center}
  .vn .opc button.otra{background:#3a2a1a;border-color:#ff7a3d88;text-align:center}
  `;
  document.head.appendChild(css);
  const U=window.UI=window.UI||{};
  const ESP=k=>k==='burnice'||k==='niko';
  const mal=new Set();let N={},tm=null;
  const nombre=k=>k==='burnice'?'🔥 Burnice':k==='niko'?'☀️ Niko':((typeof PJ!=='undefined'&&PJ.find(x=>x.key===k)||{}).nombre||k);
  function cand(k,exp){
    const l=[`/img/${k}_${exp}.png`];if(exp!=='normal')l.push(`/img/${k}_normal.png`);
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
    const im=$('#nvspr');if(!im)return;
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

