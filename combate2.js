/* =====================================================================
   COMBATE 2 — pantalla de combate HORIZONTAL (PROTOTIPO)
   Inspirada en el combate Press Turn: menú a la izquierda, rivales al centro,
   tu luchador activo de frente en primer plano, tu equipo a la derecha,
   iconos de turno arriba y barra de ayuda abajo. Fondo negro.

   - Usa el MISMO motor y las MISMAS animaciones/efectos/voces del combate clásico
     (todo se engancha a  .lu[data-l][data-i] ), solo cambia cómo se dibuja.
   - Solo se activa en pantallas horizontales (PC o celular girado). En vertical
     se sigue viendo el combate clásico.
   - Activar:  abre el juego con  ?ui=2   (se recuerda)    ·   volver:  ?ui=1  o el botón "↩ Clásico".
   ===================================================================== */
(function(){
  const LSg=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
  const LSs=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  const q=new URLSearchParams(location.search).get('ui');
  if(q==='2')LSs('ui2','1');else if(q==='1')LSs('ui2','0');

  const CSS=`
  main:has(#c2){max-width:none;padding:0}
  body:has(#c2){overflow:hidden}
  body:has(#c2) #mus{top:auto;bottom:0;right:calc(1.5% + 100px);transform:scale(.52);transform-origin:bottom right}
  #c2{position:relative;height:100vh;height:100dvh;min-height:300px;background:#000;overflow:hidden;color:#fff;
    font-size:clamp(10px,2.4vh,22px);line-height:1.25;user-select:none;-webkit-user-select:none;
    padding:0 env(safe-area-inset-right) 0 env(safe-area-inset-left)}
  #c2 *{box-sizing:border-box}
  #c2 .lu{font-size:inherit}

  /* iconos de turno (arriba, centro) */
  #c2 .c2-hud{position:absolute;top:1.4vh;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:.9em;z-index:5;white-space:nowrap}
  #c2 .c2-turn{font-weight:900;letter-spacing:.1em;font-size:.95em;padding:.2em 1.1em;
    background:linear-gradient(90deg,#0000,#d9534f77 30%,#d9534f77 70%,#0000)}
  #c2 .c2-turn.yo{background:linear-gradient(90deg,#0000,#2f7dff88 30%,#2f7dff88 70%,#0000)}
  #c2 .c2-ico{display:flex;gap:.15em;font-size:1.9em;line-height:1;min-width:1.2em}

  /* registro (arriba, izquierda) */
  #c2 .c2-reg{position:absolute;left:1.2%;top:1.4vh;width:min(27vw,320px);z-index:6}
  #c2 .reg{margin:0;background:#000c;border:1px solid #fff3;border-radius:.4em;padding:.35em .6em;font-size:.82em}
  #c2 .reg summary{display:flex;justify-content:space-between;align-items:center;gap:.5em;cursor:pointer}
  #c2 .reg .regc{max-height:24vh;overflow:auto;margin-top:.4em}
  #c2 .reg summary>span:last-child{display:flex;gap:.3em;flex-wrap:nowrap}
  @media (max-height:520px){#c2 .reg .regc{max-height:13vh}#c2 .reg{font-size:.78em}}
  #c2 .reg .sfxb{padding:.15em .5em;font-size:.9em}

  /* rivales: sprites de frente en el centro */
  #c2 .c2-en{position:absolute;left:43%;right:24.5%;top:8vh;height:49vh;display:flex;justify-content:center;align-items:flex-end;gap:1.2%;z-index:2}
  #c2 .c2-e{flex:1 1 0;min-width:0;max-width:34%;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;
    position:relative;background:none;border:0;padding:0;border-radius:0;cursor:pointer}
  #c2 .c2-e:after{content:'';position:absolute;left:8%;right:8%;bottom:4.6em;height:1.1em;border-radius:50%;
    background:radial-gradient(ellipse,#fff2 0,#0000 70%);z-index:0;pointer-events:none}
  #c2 .sp{flex:1 1 0;min-height:0;width:100%;display:flex;align-items:flex-end;justify-content:center;position:relative;z-index:1}
  #c2 .sp img.r{width:auto;height:auto;max-width:100%;max-height:100%;aspect-ratio:auto;object-fit:contain;background:none;border-radius:0;
    filter:drop-shadow(0 .3em .5em #000)}
  #c2 .c2-e.obj .sp img.r{filter:drop-shadow(0 0 .45em #ff4d4d) drop-shadow(0 0 .15em #ff4d4d)}
  #c2 .c2-e.obj:before{content:'▼';position:absolute;top:-.2em;left:50%;transform:translateX(-50%);color:#ff4d4d;font-size:1.5em;z-index:4;animation:cb-resp 1.2s ease-in-out infinite}
  #c2 .c2-e.nob{opacity:.5}
  #c2 .c2-e.muerto{opacity:.28;filter:grayscale(1)}
  #c2 .c2-e.ya .sp img.r{filter:drop-shadow(0 0 .45em #ffd400)}
  #c2 .c2-pl{width:100%;background:#000c;border:1px solid #fff3;border-left:.3em solid var(--c,#8ab4ff);border-radius:.3em;padding:.2em .45em .3em;position:relative;z-index:2}
  #c2 .c2-pl .n{font-weight:800;font-size:.86em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #c2 .c2-pl .hn{font-size:.8em;color:#cbd2e4;text-align:right;line-height:1.1}
  #c2 .barra{height:.6em;border-radius:.3em}
  #c2 .barra.ult{height:.32em;margin-top:.15em}
  #c2 .efs{display:flex;flex-wrap:wrap;gap:.15em;min-height:0}

  /* tu luchador activo, de frente, en primer plano */
  #c2 .c2-hero{position:absolute;left:19%;width:25%;bottom:9vh;height:53vh;display:flex;align-items:flex-end;justify-content:center;z-index:3;pointer-events:none}
  #c2 .c2-hero img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 0 .8em #0009);animation:c2-resp 3.4s ease-in-out infinite;transform-origin:50% 100%}
  #c2 .c2-hero.off img{filter:brightness(.55) drop-shadow(0 0 .6em #0009);animation:none}
  #c2 .c2-hero .nm{position:absolute;left:50%;bottom:-.2em;transform:translateX(-50%);background:#000c;border-left:.3em solid var(--c,#ffd400);padding:.1em .8em;font-weight:800;white-space:nowrap;border-radius:.2em}
  @keyframes c2-resp{0%,100%{transform:scale(1)}50%{transform:scale(1.012,1.018)}}

  /* tu equipo (derecha) */
  #c2 .c2-pt{position:absolute;right:1.2%;width:23%;top:8vh;bottom:9.5vh;display:flex;flex-direction:column;gap:1.2vh;z-index:4}
  #c2 .c2-p{flex:1 1 0;min-height:0;max-height:31%;display:grid;grid-template-columns:31% 1fr;gap:.5em;align-items:stretch;
    background:linear-gradient(90deg,#000d,#000b);border:2px solid #fff2;border-left:.35em solid var(--c,#8ab4ff);border-radius:.35em;padding:.3em;cursor:pointer}
  #c2 .c2-p.sel{border-color:#ffd400;background:linear-gradient(90deg,#2a2400dd,#000b)}
  #c2 .c2-p.ya{box-shadow:0 0 .8em #ffd40088}
  #c2 .c2-p.ali{border-color:#3fb56b}
  #c2 .c2-p.muerto{opacity:.3;filter:grayscale(1)}
  #c2 .c2-p .fc{position:relative;overflow:hidden;border-radius:.3em;background:#111;min-height:0}
  #c2 .c2-p .fc img.r{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;object-fit:cover;object-position:50% 6%;border-radius:0;background:none}
  #c2 .c2-p .num{top:.1em;left:.1em}
  #c2 .c2-p .inf{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:.12em}
  #c2 .c2-p .n{font-weight:800;font-size:.95em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #c2 .c2-p .hn{font-size:.82em;color:#cbd2e4;line-height:1.1}
  #c2 .c2-p .t{font-size:.78em;color:#9aa3bd;min-height:0;line-height:1.1}
  #c2 .c2-p .efs .ef{font-size:.85em}

  /* menú de acciones (izquierda) */
  #c2 .c2-menu{position:absolute;left:1.5%;bottom:9.5vh;width:min(21%,260px);min-width:150px;display:flex;flex-direction:column;gap:.35em;z-index:5}
  #c2 .c2-who{font-size:.8em;letter-spacing:.12em;color:#ffd400;font-weight:800;text-transform:uppercase;padding-left:.2em;text-shadow:0 0 .4em #000}
  #c2 .c2-m{display:flex;align-items:center;gap:.55em;text-align:left;width:100%;background:linear-gradient(90deg,#000e,#000b);
    border:0;border-left:.35em solid var(--c,#4f7cff);border-radius:.2em 1em 1em .2em;padding:.5em .75em;font-size:1em;line-height:1.2;font-weight:700;color:#fff;transition:transform .12s,background .12s}
  #c2 .c2-m .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #c2 .c2-m small{display:inline;opacity:.8;font-weight:600;white-space:nowrap}
  #c2 .c2-m:hover:not(:disabled),#c2 .c2-m:focus-visible{background:var(--c,#4f7cff);color:#050505;transform:translateX(.35em)}
  #c2 .c2-m.sec{--c:#6b7280}
  #c2 .c2-m.ulti:not(:disabled){animation:cb-resp 1.3s ease-in-out infinite;--c:#d9534f}
  #c2 .c2-ali{display:flex;gap:.3em;flex-wrap:wrap;align-items:center;font-size:.85em}
  #c2 .c2-ali button{padding:.25em .6em;background:#000c;border:1px solid #3fb56b88}
  #c2 .c2-ali button.on{background:#3fb56b;color:#000}

  /* barra de ayuda (abajo) */
  #c2 .c2-help{position:absolute;left:0;right:0;bottom:0;height:7.5vh;min-height:28px;display:flex;align-items:center;gap:.8em;padding:0 1.5%;
    background:linear-gradient(90deg,#000,#1d2130cc 50%,#000);border-top:1px solid #fff4;z-index:5}
  #c2 .c2-help b{color:#ffd400;letter-spacing:.12em}
  #c2 .c2-help .tx{flex:1;min-width:0;margin-right:min(190px,26vw);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#e8eaf0}
  #c2 .c2-b{padding:.2em .8em;font-size:.85em;background:#2a2f44;white-space:nowrap}

  /* los ataques se lanzan hacia el rival (en este diseño: izquierda/derecha) */
  #c2 .lu.lunge0{animation:c2-l0 .3s ease-out forwards;z-index:6}
  #c2 .lu.lunge1{animation:c2-l1 .3s ease-out forwards;z-index:6}
  @keyframes c2-l0{to{transform:translateX(-18%)}}
  @keyframes c2-l1{to{transform:translateY(8%) scale(1.04)}}
  `;
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);

  const activo=()=>LSg('ui2')==='1'&&window.innerWidth>window.innerHeight;

  function colorDe(l){
    const b=String(l.boton||'');
    const hex=/^#?[0-9a-f]{6}$/i.test(b)?'#'+b.replace('#',''):null;
    return (typeof COL!=='undefined'&&COL[b.toLowerCase()])||hex||'#4f7cff';
  }
  function sprite(l,lado){
    if(l.forma)return `src="${l.gif||''}"`;                               // forma especial: usa su imagen propia
    const sk=lado==0&&YO.skins&&YO.skins[l.key];
    return sk?`src="${sk}"`:CBT.cara(l.key,'normal',l.gif);
  }
  function clases(l,lado,base){
    const cl=['lu',base];
    if(!l.vivo)cl.push('muerto');
    if(lado==0&&l.i===sel&&S.turno===0)cl.push('sel');
    if(lado==1&&l.i===tgt&&!tgtAli&&tgtAli!==0)cl.push('obj');
    if(lado==0&&tgtAli===l.i)cl.push('ali');
    if(S.actor===l.i&&l.vivo&&((S.turno===0)===(lado==0)))cl.push('ya');
    const hp=l.forma?l.forma_hp:l.hp,mx=l.forma?90:l.max_hp;
    if(l.vivo&&hp/mx*100<30)cl.push('critico');
    if(lado==1&&S.turno===0&&!S.terminado&&l.vivo&&!(S.blancos||[]).includes(l.i))cl.push('nob');
    return cl.join(' ');
  }
  function datos(l,lado){
    const hp=l.forma?l.forma_hp:l.hp,mx=l.forma?90:l.max_hp,pct=Math.max(0,hp/mx*100);
    const ex=[];
    if(l.sombras!=null)ex.push('🌑'.repeat(l.sombras));
    if(l.hojas!=null)ex.push('🍃'.repeat(l.hojas));
    if(l.pm!=null&&l.sombras==null)ex.push(l.pm+' PM');
    const nom=l.forma?('👹 '+esc(l.forma)):(emo(l)+' '+esc(l.nombre));
    return {hp,mx,pct,ex,nom};
  }
  function enemigo(l){
    const d=datos(l,1);
    return `<div class="${clases(l,1,'c2-e')}" style="--c:${colorDe(l)}" data-l="1" data-i="${l.i}" onclick="clic(1,${l.i})">
      <div class="sp">${l.gif||!l.forma?`<img class="r" ${sprite(l,1)}>`:''}</div>
      <div class="c2-pl"><div class="n">${d.nom}</div>${CBT.barra('hp',1,l.i,d.pct)}
        <div class="hn">${l.vivo?CBT.num(1,l.i,d.hp,d.mx):'💀'}</div>${CBT.barra('ult',1,l.i,Math.min(100,l.ulti))}
        ${l.vivo?CBT.chips(l):'<div class="efs"></div>'}</div></div>`;
  }
  function aliado(l){
    const d=datos(l,0);
    return `<div class="${clases(l,0,'c2-p')}" style="--c:${colorDe(l)}" data-l="0" data-i="${l.i}" onclick="clic(0,${l.i})">
      <div class="fc"><span class="num">${l.i+1}</span><img class="r" ${sprite(l,0)}></div>
      <div class="inf"><div class="n">${d.nom}</div>${CBT.barra('hp',0,l.i,d.pct)}
        <div class="hn">${l.vivo?CBT.num(0,l.i,d.hp,d.mx):'💀'}</div>${CBT.barra('ult',0,l.i,Math.min(100,l.ulti))}
        <div class="t">${l.vivo?d.ex.join(' '):''} ${l.ulti_lista?'💥':''}</div>
        ${l.vivo?CBT.chips(l):'<div class="efs"></div>'}</div></div>`;
  }
  function boton(a,x){
    const ic={normal:'⚔️',hab1:'✨',hab2:'💢',defender:'🛡️',ulti:'💥'}[x.k]||'▪️';
    const nom=x.k==='ulti'&&!a.ulti_lista?`ÚLTI ${a.ulti}%`:x.nombre;
    const col=x.k==='defender'?'#6b7280':x.k==='ulti'?'#d9534f':colorDe(a);
    const ex=(x.pm?` · ${x.pm}PM`:'')+(x.sombras?` · ${x.sombras}🌑`:'');
    return `<button class="c2-m ${x.k}" style="--c:${col}" data-ok="${x.ok?1:0}" ${x.ok&&!lock?'':'disabled'}
      onclick="hacer('${x.k}')" onmouseenter="UI2.ayuda(this.dataset.d)" onfocus="UI2.ayuda(this.dataset.d)" onmouseleave="UI2.ayuda()" data-d="${esc(x.desc||'')}">
      <span>${ic}</span><span class="nm">${esc(nom)}</span><small>${costeTxt(x.coste)}${ex}</small></button>`;
  }

  let defecto='';
  function dibujar(){
    const a=actorActual();
    if(tgt==null||!S.blancos.includes(tgt))tgt=S.objetivo;
    const miTurno=S.turno===0,e0=S.equipos[0],e1=S.equipos[1];
    const soporte=a&&a.acciones.some(x=>x.apoyo||x.dual);
    const ico1=CBT.iconos(1,S.medios[1],S.turno===1),ico0=CBT.iconos(0,S.medios[0],miTurno);   // (también recuerda el estado para las animaciones)
    const elegido=e0.luchadores[sel]&&e0.luchadores[sel].vivo?e0.luchadores[sel]:null;
    const hero=a||elegido||e0.luchadores.find(l=>l.vivo);
    defecto=miTurno?'Elige una acción. Toca a un rival para apuntarle.':`Turno de ${e1.nombre}…`;

    let h=`<div id="c2">
      <div class="c2-hud"><span class="c2-turn ${miTurno?'yo':''}">${miTurno?'TU TURNO':'TURNO DE '+esc(e1.nombre).toUpperCase()}</span><span class="c2-ico">${ico1}${ico0}</span></div>
      <div class="c2-reg">${CBT.registro(S)}</div>
      <div class="c2-en">${e1.luchadores.map(enemigo).join('')}</div>
      ${hero?`<div class="c2-hero ${miTurno?'':'off'}" style="--c:${colorDe(hero)}"><img ${sprite(hero,0)}><span class="nm">${emo(hero)} ${esc(hero.forma||hero.nombre)}</span></div>`:''}
      <div class="c2-pt">${e0.luchadores.map(aliado).join('')}</div>`;
    if(miTurno&&a){
      h+=`<div class="c2-menu acc"><div class="c2-who">▶ ${esc(a.forma||a.nombre)}</div>
        ${a.acciones.map(x=>boton(a,x)).join('')}
        <button class="c2-m sec" onclick="terminar()" onmouseenter="UI2.ayuda('Pasa el turno sin gastar más iconos.')" onmouseleave="UI2.ayuda()"><span>⏭️</span><span class="nm">Terminar turno</span></button>
        ${soporte?`<div class="c2-ali">💚 ${S.aliados.map(i=>`<button class="${tgtAli===i?'on':''}" onclick="elegirAli(${i})">${esc(e0.luchadores[i].nombre)}</button>`).join('')}</div>`:''}</div>`;
    }
    h+=`<div class="c2-help"><b>AYUDA</b><span class="tx" id="c2h">${esc(defecto)}</span>
      ${MODO==='pvp'?'<button class="c2-b" onclick="rendirse()">🏳️ Rendirse</button>':''}
      <button class="c2-b" onclick="UI2.clasico()">↩ Clásico</button></div></div>`;
    $('#app').innerHTML=h;
    CBT.post();
  }

  window.UI2={
    activo,dibujar,
    ayuda:t=>{const e=document.getElementById('c2h');if(e)e.textContent=t||defecto},
    clasico:()=>{LSs('ui2','0');dibujarCombate(true)},
  };

  // si giran el celular / cambian el tamaño, vuelve a dibujar con el diseño que corresponda
  let modo=activo(),tm=null;
  window.addEventListener('resize',()=>{
    clearTimeout(tm);tm=setTimeout(()=>{
      const m=activo();if(m===modo)return;modo=m;
      try{if(S&&!S.terminado&&document.querySelector('#c2,.eq'))dibujarCombate(true)}catch(e){}
    },200);
  });
})();
