/* =====================================================================
   COMBATE 2 — pantalla de combate HORIZONTAL (PROTOTIPO)
   Inspirada en el combate Press Turn: menú a la izquierda, rivales al centro,
   tu luchador activo de frente en primer plano, tu equipo a la derecha,
   iconos de turno arriba y barra de ayuda abajo. Fondo: la arena de la pelea (ARENAS en interfaz.js);
   si no hay ninguna, negro.

   - Usa el MISMO motor y las MISMAS animaciones/efectos/voces del combate clásico
     (todo se engancha a  .lu[data-l][data-i] ), solo cambia cómo se dibuja.
   - Es el ÚNICO diseño de combate. En celular vertical se muestra un aviso para girar.
   - Incluye la pantalla de VERSUS que sale antes de cada pelea (UI2.versus()).
   ===================================================================== */
(function(){

  const CSS=`
  main:has(#c2){max-width:none;padding:0}
  body:has(#c2){overflow:hidden;background:#000}
  body:has(#c2) #mus{top:auto;bottom:0;right:calc(1.5% + 100px);transform:scale(.52);transform-origin:bottom right}
  #c2{position:relative;height:100vh;height:100dvh;min-height:300px;background:transparent;overflow:hidden;color:#fff;
    font-size:clamp(10px,2.4vh,22px);line-height:1.25;user-select:none;-webkit-user-select:none;
    padding:0 env(safe-area-inset-right) 0 env(safe-area-inset-left)}
  #c2 *{box-sizing:border-box}
  #c2 button{font-size:inherit}
  #c2 .lu{font-size:inherit}

  /* iconos de turno (arriba, centro) */
  #c2 .c2-hud{position:absolute;top:1.4vh;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:.9em;z-index:5;white-space:nowrap}
  #c2 .c2-turn{font-weight:900;letter-spacing:.1em;font-size:.95em;padding:.2em 1.1em;
    background:linear-gradient(90deg,#0000,#ff3d6e77 30%,#ff3d6e77 70%,#0000)}
  #c2 .c2-turn.yo{background:linear-gradient(90deg,#0000,#38d4ff88 30%,#38d4ff88 70%,#0000)}
  #c2 .c2-ico{display:flex;gap:.15em;font-size:1.9em;line-height:1;min-width:1.2em}

  /* registro (arriba, izquierda) */
  #c2 .c2-reg{position:absolute;left:1.2%;top:1.4vh;width:min(27vw,320px);z-index:6}
  #c2 .reg{margin:0;background:#000c;border:1px solid #fff3;border-radius:.4em;padding:.35em .6em;font-size:.82em}
  #c2 .reg summary{display:flex;justify-content:space-between;align-items:center;gap:.5em;cursor:pointer}
  #c2 .reg .regc{max-height:24vh;overflow:auto;margin-top:.4em}
  #c2 .reg .regc *{font-size:inherit}
  #c2 .reg summary>span:last-child{display:flex;gap:.3em;flex-wrap:nowrap}
  @media (max-height:520px){#c2 .reg .regc{max-height:13vh}#c2 .reg{font-size:.78em}}
  #c2 .reg .sfxb{padding:.15em .5em;font-size:.9em;clip-path:none;border-left-width:.2em;font-family:var(--f-texto);text-transform:none;letter-spacing:0}

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
  @keyframes c2-flota{0%,100%{transform:translateY(0)}50%{transform:translateY(-7%)}}
  #c2 .c2-e.flota .sp,#c2 .c2-p.flota .fc{animation:c2-flota 2.6s ease-in-out infinite}
  #c2 .c2-e.flota .sp img.r{filter:drop-shadow(0 .8em .25em rgba(0,0,0,.35)) drop-shadow(0 0 .35em #9be7ff)}
  #c2 .c2-e.muerto{opacity:.28;filter:grayscale(1)}
  #c2 .c2-e.ya .sp img.r{filter:drop-shadow(0 0 .45em var(--gold))}
  #c2 .c2-pl{width:100%;background:#000c;border:1px solid #fff3;border-left:.3em solid var(--c,#8ab4ff);border-radius:.3em;padding:.2em .45em .3em;position:relative;z-index:2}
  #c2 .c2-pl .n{font-weight:400;font-size:.8em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #c2 .c2-pl .hn{font-size:.8em;color:#cbd2e4;text-align:right;line-height:1.1}
  #c2 .barra{height:.6em;border-radius:.3em}
  #c2 .barra.ult{height:.32em;margin-top:.15em}
  #c2 .efs{display:flex;flex-wrap:wrap;gap:.15em;min-height:0}


  /* personajes "vivos": la cabeza/pelo se mueve aparte del cuerpo (misma imagen cortada en dos, sin gastar más archivos) */
  #c2 .viv{position:relative;width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;
    filter:drop-shadow(0 .3em .5em #000);animation:c2-resp 3.4s ease-in-out infinite;transform-origin:50% 100%}
  #c2 .viv img.b,#c2 .viv img.h{width:auto;height:auto;max-width:100%;max-height:100%;aspect-ratio:auto;object-fit:contain;border-radius:0;background:none;filter:none;animation:none}
  #c2 .viv img.b{clip-path:inset(var(--cu) 0 0 0)}
  #c2 .viv img.h{position:absolute;left:0;right:0;bottom:0;margin:0 auto;transform-origin:50% var(--cu);
    -webkit-mask-image:linear-gradient(to bottom,#000 var(--cu),transparent calc(var(--cu) + 5%));mask-image:linear-gradient(to bottom,#000 var(--cu),transparent calc(var(--cu) + 5%));
    animation:c2-cab 4.6s ease-in-out infinite}
  @keyframes c2-cab{0%,100%{transform:rotate(-1.1deg) translate(-.25%,.1%)}35%{transform:rotate(.9deg) translate(.3%,-.15%)}70%{transform:rotate(-.3deg) translate(.1%,.2%)}}
  #c2 .c2-hero.off .viv{filter:brightness(.55) drop-shadow(0 0 .6em #0009);animation:none}
  #c2 .c2-hero.off .viv img.h{animation:none}
  #c2 .c2-e.obj .viv{filter:drop-shadow(0 0 .45em #ff4d4d) drop-shadow(0 0 .15em #ff4d4d)}
  #c2 .c2-e.ya .viv{filter:drop-shadow(0 0 .45em var(--gold))}

  /* tu luchador activo, de frente, en primer plano */
  #c2 .c2-hero{position:absolute;left:19%;width:25%;bottom:9vh;height:53vh;display:flex;align-items:flex-end;justify-content:center;z-index:3;pointer-events:none}
  #c2 .c2-hero img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 0 .8em #0009);animation:c2-resp 3.4s ease-in-out infinite;transform-origin:50% 100%}
  #c2 .c2-hero.off img{filter:brightness(.55) drop-shadow(0 0 .6em #0009);animation:none}
  #c2 .c2-hero .nm{position:absolute;left:50%;bottom:-.2em;transform:translateX(-50%);background:#000c;border-left:.3em solid var(--c,var(--gold));padding:.1em .8em;font-family:var(--f-titulo);font-weight:400;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;border-radius:0}
  #c2 .c2-mas{position:absolute;left:35%;bottom:10vh;height:min(17vh,12vw);width:auto;z-index:4;pointer-events:none;filter:drop-shadow(0 .3em .4em #000a);animation:c2-mas 2.2s ease-in-out infinite;transform-origin:50% 100%}
  #c2 .c2-mas.off{filter:brightness(.6) drop-shadow(0 .3em .4em #000a)}
  @keyframes c2-mas{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-1.2vh) scale(1.03,.98)}}
  @keyframes c2-resp{0%,100%{transform:scale(1)}50%{transform:scale(1.012,1.018)}}

  /* tu equipo (derecha) */
  #c2 .c2-pt{position:absolute;right:1.2%;width:23%;top:8vh;bottom:9.5vh;display:flex;flex-direction:column;gap:1.2vh;z-index:4}
  #c2 .c2-p{flex:1 1 0;min-height:0;max-height:31%;display:grid;grid-template-columns:31% 1fr;gap:.5em;align-items:stretch;
    background:linear-gradient(90deg,#000d,#000b);border:2px solid #fff2;border-left:.35em solid var(--c,#8ab4ff);border-radius:.35em;padding:.3em;cursor:pointer}
  #c2 .c2-p.sel{border-color:var(--gold);background:linear-gradient(90deg,#2a2400dd,#000b)}
  #c2 .c2-p.ya{box-shadow:0 0 .8em #ffd24a88}
  #c2 .c2-p.ali{border-color:var(--ok)}
  #c2 .c2-p.muerto{opacity:.3;filter:grayscale(1)}
  #c2 .c2-p .fc{position:relative;overflow:hidden;border-radius:.3em;background:#111;min-height:0}
  #c2 .c2-p .fc img.r{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;object-fit:cover;object-position:50% 6%;border-radius:0;background:none}
  #c2 .c2-p .num{top:.1em;left:.1em}
  #c2 .c2-p .inf{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:.12em}
  #c2 .c2-p .n{font-weight:400;font-size:.95em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #c2 .c2-p .hn{font-size:.82em;color:#cbd2e4;line-height:1.1}
  #c2 .c2-p .t{font-size:.78em;color:#9aa3bd;min-height:0;line-height:1.1}
  #c2 .c2-arena{display:inline-block;position:relative;width:1.5em;height:1.5em;border-radius:50%;vertical-align:middle;margin-right:.2em;
    background:conic-gradient(from 0deg,#46e3b0 0 var(--p),#1b2233 var(--p) 100%);box-shadow:0 0 0 .1em #0b1020,0 0 .6em rgba(70,227,176,.35);transition:background .4s}
  #c2 .c2-arena::before{content:"";position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,transparent 0 89deg,#0b1020 89deg 90deg)}
  #c2 .c2-arena i{position:absolute;inset:.28em;border-radius:50%;background:#0b1020;font-style:normal;font-size:.7em;line-height:1.55em;text-align:center}
  #c2 .c2-arena i::after{content:"⏳"}
  #c2 .c2-p .efs .ef{font-size:.85em}

  /* menú de acciones (izquierda) */
  #c2 .c2-menu{position:absolute;left:1.5%;bottom:9.5vh;width:min(21%,260px);min-width:150px;display:flex;flex-direction:column;gap:.35em;z-index:5}
  #c2 .c2-who{font-size:.8em;letter-spacing:.12em;color:var(--gold);font-weight:800;text-transform:uppercase;padding-left:.2em;text-shadow:0 0 .4em #000}
  #c2 .c2-m{display:flex;align-items:center;gap:.55em;text-align:left;width:100%;background:linear-gradient(90deg,#000e,#000b);
    border:0;border-left:.35em solid var(--c,var(--ac));border-radius:0;clip-path:polygon(0 0,100% 0,calc(100% - .8em) 100%,0 100%);padding:.5em 1.4em .5em .75em;font-size:1em;line-height:1.2;font-weight:400;color:#fff;transition:transform .12s,background .12s}
  #c2 .c2-m .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #c2 .c2-m small{display:inline;opacity:.8;font-weight:600;white-space:nowrap}
  #c2 .c2-m:hover:not(:disabled),#c2 .c2-m:focus-visible{background:var(--c,var(--ac));color:#050505;transform:translateX(.35em)}
  #c2 .c2-m.sec{--c:#6b7280}
  #c2 .c2-m.ulti:not(:disabled){animation:cb-resp 1.3s ease-in-out infinite;--c:var(--bad)}
  #c2 .c2-ali{display:flex;gap:.25em;flex-wrap:nowrap;align-items:center;font-size:.9em}
  #c2 .c2-ali button{flex:1 1 0;min-width:0;padding:.3em 1em .3em .5em;font-size:1em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:#000c;border:0;border-left:.25em solid var(--ok)}
  #c2 .c2-ali button.on{background:var(--ok);color:#04120a}
  #c2 .c2-ali .ic{flex:none}

  /* barra de ayuda (abajo) */
  #c2 .c2-help{position:absolute;left:0;right:0;bottom:0;height:7.5vh;min-height:28px;display:flex;align-items:center;gap:.8em;padding:0 1.5%;
    background:linear-gradient(90deg,#000,#1d2130cc 50%,#000);border-top:1px solid #fff4;z-index:5}
  #c2 .c2-help b{color:var(--gold);letter-spacing:.12em}
  #c2 .c2-help .tx{flex:1;min-width:0;margin-right:min(190px,26vw);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#e8eaf0}
  #c2 .c2-b{padding:.25em 1.2em .25em .7em;font-size:.85em;background:var(--card2);white-space:nowrap}

    /* ===== VERSUS (antes de pelear) ===== */
  #c2vs{position:fixed;inset:0;z-index:200;overflow:hidden;background:#05070d;color:#fff;cursor:pointer;
    font-size:clamp(11px,2.6vh,24px);transition:opacity .3s}
  #c2vs.fuera{opacity:0;pointer-events:none}
  #c2vs .vb{position:absolute;inset:0;background:var(--arena) center/cover;opacity:.35;filter:blur(2px)}
  #c2vs .lado{position:absolute;top:0;bottom:0;width:56%;display:flex;align-items:flex-end;justify-content:center;gap:1%;padding:0 3% 13vh}
  #c2vs .l0{padding-right:14%}#c2vs .l1{padding-left:14%}
  #c2vs .l0{left:0;clip-path:polygon(0 0,100% 0,82% 100%,0 100%);background:linear-gradient(100deg,#0a3a5acc,#0a1a2b99);animation:vs-in0 .55s cubic-bezier(.2,.9,.2,1) both}
  #c2vs .l1{right:0;clip-path:polygon(18% 0,100% 0,100% 100%,0 100%);background:linear-gradient(260deg,#5a0a22cc,#2b0a1499);animation:vs-in1 .55s cubic-bezier(.2,.9,.2,1) both}
  @keyframes vs-in0{from{transform:translateX(-100%)}}
  @keyframes vs-in1{from{transform:translateX(100%)}}
  #c2vs .p{flex:1 1 0;min-width:0;max-width:34%;height:66vh;display:flex;align-items:flex-end;justify-content:center;animation:vs-p .5s .35s both}
  #c2vs .l1 .p{animation-delay:.45s}
  @keyframes vs-p{from{opacity:0;transform:translateY(6%) scale(.96)}}
  #c2vs .p img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 0 .7em #000)}
  #c2vs .l1 .p img{transform:scaleX(-1)}
  #c2vs .tm{position:absolute;bottom:4vh;font-family:var(--f-titulo);font-size:1.5em;letter-spacing:.12em;text-transform:uppercase;text-shadow:0 .1em .4em #000;
    background:#000a;padding:.15em .9em;white-space:nowrap;max-width:44%;overflow:hidden;text-overflow:ellipsis;animation:vs-p .5s .6s both}
  #c2vs .l0 .tm{left:4%;border-left:.2em solid #38d4ff}
  #c2vs .l1 .tm{right:4%;border-right:.2em solid #ff3d6e}
  #c2vs .vs{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) rotate(-6deg);font-family:var(--f-titulo);font-weight:900;font-size:6.5em;
    line-height:1;letter-spacing:.04em;color:#fff;text-shadow:.04em .04em 0 #ff3d6e,-.04em -.04em 0 #38d4ff,0 0 .5em #000;animation:vs-vs .5s .5s cubic-bezier(.2,1.6,.4,1) both;z-index:3}
  @keyframes vs-vs{from{opacity:0;transform:translate(-50%,-50%) rotate(-6deg) scale(3)}}
  #c2vs .sk{position:absolute;bottom:1.2vh;left:0;right:0;text-align:center;font-size:.7em;letter-spacing:.2em;color:#fff9;animation:vs-p .4s 1s both}

  /* aviso: gira el celular (solo en vertical y pantallas chicas) */
  #c2giro{display:none}
  @media (orientation:portrait) and (max-width:820px){
    body:has(#c2) #c2giro,body:has(#c2vs) #c2giro{display:flex;position:fixed;inset:0;z-index:300;background:#05070dee;color:#fff;flex-direction:column;
      align-items:center;justify-content:center;gap:.6em;text-align:center;font:700 18px/1.3 system-ui,sans-serif;padding:24px}
    #c2giro i{font-size:56px;font-style:normal;animation:c2-gira 2s ease-in-out infinite}
    @keyframes c2-gira{0%,20%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}
  }

  /* los ataques se lanzan hacia el rival (en este diseño: izquierda/derecha) */
  #c2 .lu.lunge0{animation:c2-l0 .3s ease-out forwards;z-index:6}
  #c2 .lu.lunge1{animation:c2-l1 .3s ease-out forwards;z-index:6}
  @keyframes c2-l0{to{transform:translateX(-18%)}}
  @keyframes c2-l1{to{transform:translateY(8%) scale(1.04)}}
  `;
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  {const g=document.createElement('div');g.id='c2giro';g.innerHTML='<i>📱</i><div>Gira tu celular<br><small style="font-weight:400;opacity:.8">Press Turn se juega en horizontal</small></div>';document.body.appendChild(g)}

  function colorDe(l){
    const b=String(l.boton||'');
    const hex=/^#?[0-9a-f]{6}$/i.test(b)?'#'+b.replace('#',''):null;
    return (typeof COL!=='undefined'&&COL[b.toLowerCase()])||hex||'var(--ac)';
  }
  /* personajes con movimiento: cu = por dónde se corta (cuello), en % de la altura de la imagen */
  const VIVOS={mantis:{cu:40},jolyne:{cu:33},reze:{cu:28},storm:{cu:33},ochako:{cu:38},yuki:{cu:33},yoruichi:{cu:40},megumi:{cu:33},josuke:{cu:30},denji:{cu:36},urahara:{cu:25}};
  function viva(l,lado,cl){
    const v=!l.forma&&VIVOS[l.key],sk=lado==0&&YO.skins&&YO.skins[l.key];
    if(!v||sk||lado!==0)return `<img ${cl||''} ${sprite(l,lado)}>`;
    return `<span class="viv" style="--cu:${v.cu}%"><img class="b" ${sprite(l,lado)}><img class="h" ${sprite(l,lado)}></span>`;
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
    if(l.vivo&&(l.efectos||[]).some(e=>e.includes('🎈')))cl.push('flota');   // 🎈 flotando / ingrávido (Ochako)
    if(lado==1&&S.turno===0&&!S.terminado&&l.vivo&&!(S.blancos||[]).includes(l.i))cl.push('nob');
    return cl.join(' ');
  }
  function datos(l,lado){
    const hp=l.forma?l.forma_hp:l.hp,mx=l.forma?90:l.max_hp,pct=Math.max(0,hp/mx*100);
    const ex=[];
    if(l.sombras!=null)ex.push('🌑'.repeat(l.sombras));
    if(l.hojas!=null)ex.push('🍃'.repeat(l.hojas));
    if(l.arena!=null)ex.push(`<span class="c2-arena" title="Reloj de arena ${l.arena}/${l.arena_max}" style="--p:${l.arena/l.arena_max*100}%"><i></i></span>`);
    if(l.linea!=null)ex.push(`<span title="Línea negra ${l.linea}/${l.linea_max}">${'⬛'.repeat(l.linea)}${'⬜'.repeat(l.linea_max-l.linea)}</span>`);
    if(l.pm!=null&&l.sombras==null&&l.arena==null)ex.push(l.pm+' PM');
    const nom=l.forma?('👹 '+esc(l.forma)):(emo(l)+' '+esc(l.nombre));
    return {hp,mx,pct,ex,nom};
  }
  function enemigo(l){
    const d=datos(l,1);
    return `<div class="${clases(l,1,'c2-e')}" style="--c:${colorDe(l)}" data-l="1" data-i="${l.i}" onclick="clic(1,${l.i})">
      <div class="sp">${l.gif||!l.forma?`${viva(l,1,'class="r"')}`:''}</div>
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
    const ic0={normal:'⚔️',hab1:'✨',hab2:'💢',hab3:'🌀',hab4:'🔱',defender:'🛡️',ulti:'💥'}[x.k]||'▪️';
    const ic=x.emoji_url?`<img class="emo" src="${x.emoji_url}">`:(x.emoji||ic0);
    const nom=x.k==='ulti'&&!a.ulti_lista?`ÚLTI ${a.ulti}%`:x.nombre;
    const col=x.k==='defender'?'#6b7280':x.k==='ulti'?'var(--bad)':colorDe(a);
    const ex=(x.pm?` · ${x.pm}PM`:'')+(x.sombras?` · ${x.sombras}🌑`:'');
    if(x.ciego)return `<button class="c2-m ${x.k}" style="--c:${col}" data-ok="${x.ok?1:0}" ${x.ok&&!lock?'':'disabled'} onclick="hacer('${x.k}')"><span>&nbsp;</span><span class="nm">&nbsp;</span><small>&nbsp;</small></button>`;   // 🕶️ ciego: botones vacíos
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
      ${hero?`<div class="c2-hero ${miTurno?'':'off'}" style="--c:${colorDe(hero)}">${viva(hero,0)}<span class="nm">${emo(hero)} ${esc(hero.forma||hero.nombre)}</span></div>`:''}
      ${YO.mascota_url?`<img class="c2-mas ${miTurno?'':'off'}" src="${esc(YO.mascota_url)}" alt="">`:''}
      <div class="c2-pt">${e0.luchadores.map(aliado).join('')}</div>`;
    if(miTurno&&a){
      h+=`<div class="c2-menu acc"><div class="c2-who">▶ ${esc(a.forma||a.nombre)}</div>
        ${a.acciones.map(x=>boton(a,x)).join('')}
        <button class="c2-m sec" onclick="terminar()" onmouseenter="UI2.ayuda('Pasa el turno sin gastar más iconos.')" onmouseleave="UI2.ayuda()"><span>⏭️</span><span class="nm">Terminar turno</span></button>
        ${pend2?(()=>{const ac=(a.acciones||[]).find(y=>y.k===pend2)||{};
          if(ac.conejos)return `<div class="c2-who">🐰 Conejos…</div><div class="c2-ali"><button onclick="hacer(pend2,-2)">Solo a ${esc(e1.luchadores[tgt!=null?tgt:S.blancos[0]].nombre)}</button><button onclick="hacer(pend2,-1)">A todos</button></div>`;
          return `<div class="c2-who">🎯 ${esc(ac.doble||'Contra…')}</div><div class="c2-ali">${S.blancos.filter(i=>i!==tgt).map(i=>`<button onclick="hacer(pend2,${i})">${esc(e1.luchadores[i].nombre)}</button>`).join('')}</div>`})():''}
        ${soporte?`<div class="c2-ali"><span class="ic">💚</span>${S.aliados.map(i=>`<button class="${tgtAli===i?'on':''}" onclick="elegirAli(${i})">${esc(e0.luchadores[i].nombre)}</button>`).join('')}</div>`:''}</div>`;
    }
    h+=`<div class="c2-help"><b>AYUDA</b><span class="tx" id="c2h">${esc(defecto)}</span>
      ${MODO==='pvp'?'<button class="c2-b" onclick="rendirse()">🏳️ Rendirse</button>':''}
      </div></div>`;
    $('#app').innerHTML=h;
    CBT.post();
  }

  // ---------- pantalla de VERSUS: tu equipo contra el rival, antes de pelear ----------
  function versus(){
    return new Promise(res=>{
      try{
        if(!S||!S.equipos){return res()}
        const quien=(l,lado)=>`<div class="p"><img ${sprite(l,lado)} alt=""></div>`;
        const e0=S.equipos[0],e1=S.equipos[1];
        const ar=(typeof YO!=='undefined'&&YO.fondo_img)||(typeof U!=='undefined'&&U.arena)||'';
        const d=document.createElement('div');d.id='c2vs';
        if(ar&&typeof ar==='string')d.style.setProperty('--arena',`url("${ar}")`);
        d.innerHTML=`<div class="vb"></div>
          <div class="lado l0">${e0.luchadores.map(l=>quien(l,0)).join('')}<span class="tm">${esc(e0.nombre)}</span></div>
          <div class="lado l1">${e1.luchadores.map(l=>quien(l,1)).join('')}<span class="tm">${esc(e1.nombre)}</span></div>
          <div class="vs">VS</div><div class="sk">TOCA PARA SALTAR</div>`;
        document.body.appendChild(d);
        let ok=false;
        const fin=()=>{if(ok)return;ok=true;d.classList.add('fuera');setTimeout(()=>{d.remove();res()},300)};
        d.addEventListener('pointerdown',fin);
        setTimeout(fin,2800);
      }catch(e){res()}
    });
  }

  window.UI2={
    dibujar,versus,
    ayuda:t=>{const e=document.getElementById('c2h');if(e)e.textContent=t||defecto},
  };

})();
