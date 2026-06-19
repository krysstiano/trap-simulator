/* v2.1.36: wymogi w grze muszą sprawdzać G.fans (lojalnych), nie G.followers (obserwujących).
   Cofamy v2.1.34 etykiety + checki + pola req.followers→req.fans.
   ZOSTAJE bez zmian:
   - Twitter UI ("Obserwujący" header, G.followers)
   - Instagram UI ("X obserwujących")
   - Tweet/IG post gains (zwiększają G.followers)
   - Hejt na Twitter event (G.followers check)
   - Sponsored tweet event (G.followers check) */
import fs from 'fs';

const SRC = 'E:/Snowy Simulator/index.html';
let html = fs.readFileSync(SRC, 'utf8');
let applied = 0, log = [];

const pairs = [
  /* === CHECK LOGIC: G.followers → G.fans === */
  /* Studio Projektowania */
  [`if(G.followers<5000) txt=\`🔒 Studio Projektowania — wymaga 5000 obserwujących (masz \${G.followers.toLocaleString('pl')})\`;`,
   `if((G.fans||0)<5000) txt=\`🔒 Studio Projektowania — wymaga 5000 fanów (masz \${(G.fans||0).toLocaleString('pl')})\`;`],
  /* Influencer car (loc 8640) */
  [`if(cid==='influencer') txt=\`🔒 \${carNames[cid]} — wymaga 500 obserwujących (masz \${G.followers})\`;`,
   `if(cid==='influencer') txt=\`🔒 \${carNames[cid]} — wymaga 500 fanów (masz \${(G.fans||0)})\`;`],
  /* Influencer car overlay */
  [`if(!car.unlocked){document.getElementById('ov-content').innerHTML=\`<h2>📱 Influencer</h2><p class="sub">Odblokuj zdobywając 500 obserwujących (masz \${G.followers}) <strong>lub</strong> kupując punkt w drzewku 📱 Influencer (Telefon → Drzewko).</p><button class="cbtn" onclick="closeOverlay()">← Wróć</button>\`;return;}`,
   `if(!car.unlocked){document.getElementById('ov-content').innerHTML=\`<h2>📱 Influencer</h2><p class="sub">Odblokuj zdobywając 500 fanów (masz \${(G.fans||0)}) <strong>lub</strong> kupując punkt w drzewku 📱 Influencer (Telefon → Drzewko).</p><button class="cbtn" onclick="closeOverlay()">← Wróć</button>\`;return;}`],
  /* World Tour */
  [`if(G.followers<50000){showMsg(\`World Tour wymaga 50 000 obserwujących (masz \${G.followers.toLocaleString('pl')}).\`,'r');return;}`,
   `if((G.fans||0)<50000){showMsg(\`World Tour wymaga 50 000 fanów (masz \${(G.fans||0).toLocaleString('pl')}).\`,'r');return;}`],
  /* APT_REQS check (loc 19630) */
  [`if(req.followers && G.followers<req.followers){showMsg(\`🔒 Wymaga \${req.followers.toLocaleString('pl')} obserwujących (masz \${G.followers.toLocaleString('pl')}).\`,'r');return;}`,
   `if(req.fans && (G.fans||0)<req.fans){showMsg(\`🔒 Wymaga \${req.fans.toLocaleString('pl')} fanów (masz \${(G.fans||0).toLocaleString('pl')}).\`,'r');return;}`],
  /* Prestige */
  [`if(G.followers<reqs.fans){showMsg(\`Prestige \${rank} wymaga \${reqs.fans.toLocaleString('pl')} obserwujących (masz \${G.followers.toLocaleString('pl')})\`,'r');return;}`,
   `if((G.fans||0)<reqs.fans){showMsg(\`Prestige \${rank} wymaga \${reqs.fans.toLocaleString('pl')} fanów (masz \${(G.fans||0).toLocaleString('pl')})\`,'r');return;}`],
  /* Milestones (zmień check na G.fans + text "fanów") */
  [`if(!G._mile1k&&G.followers>=1000){G._mile1k=true;earn(500,false);if(typeof addFame==='function')addFame(5);else G.fame=clamp(G.fame+5,0,100);showMsg('🎉 1 000 obserwujących! +500 zł premii, +5 sława!');addNotif('🎉 Milestone: 1K obserwujących!');confetti(20);showGain('+500 zł 🎉','#27ae60');}`,
   `if(!G._mile1k&&(G.fans||0)>=1000){G._mile1k=true;earn(500,false);if(typeof addFame==='function')addFame(5);else G.fame=clamp(G.fame+5,0,100);showMsg('🎉 1 000 fanów! +500 zł premii, +5 sława!');addNotif('🎉 Milestone: 1K fanów!');confetti(20);showGain('+500 zł 🎉','#27ae60');}`],
  [`if(!G._mile10k&&G.followers>=10000){G._mile10k=true;earn(2000,false);if(typeof addFame==='function')addFame(10);else G.fame=clamp(G.fame+10,0,100);showMsg('🌟 10 000 obserwujących! +2000 zł, +10 sława!');addNotif('🌟 Milestone: 10K obserwujących!');confetti(40);showGain('+2000 zł 🌟','#f1c40f');}`,
   `if(!G._mile10k&&(G.fans||0)>=10000){G._mile10k=true;earn(2000,false);if(typeof addFame==='function')addFame(10);else G.fame=clamp(G.fame+10,0,100);showMsg('🌟 10 000 fanów! +2000 zł, +10 sława!');addNotif('🌟 Milestone: 10K fanów!');confetti(40);showGain('+2000 zł 🌟','#f1c40f');}`],
  [`if(!G._mile100k&&G.followers>=100000){G._mile100k=true;earn(10000,false);if(typeof addFame==='function')addFame(20);else G.fame=clamp(G.fame+20,0,100);showMsg('💎 100 000 obserwujących! Jesteś gwiazdą! +10 000 zł, +20 sława!');addNotif('💎 Milestone: 100K obserwujących!');confetti(60);showGain('+10 000 zł 💎','#c8a520');}`,
   `if(!G._mile100k&&(G.fans||0)>=100000){G._mile100k=true;earn(10000,false);if(typeof addFame==='function')addFame(20);else G.fame=clamp(G.fame+20,0,100);showMsg('💎 100 000 fanów! Jesteś gwiazdą! +10 000 zł, +20 sława!');addNotif('💎 Milestone: 100K fanów!');confetti(60);showGain('+10 000 zł 💎','#c8a520');}`],
  /* 1M speedrun milestone */
  [`if(!G._mile1m&&G.followers>=1000000){G._mile1m=true;G._mile1mDay=G.day; /* v1.8.73: speedrun tracker */ earn(50000,false);G.fame=100;showMsg('🏆 MILION OBSERWUJĄCYCH! Status legendy! +50 000 zł, fame=100!');addNotif('🏆 Milestone: 1M obserwujących — LEGENDA!');confetti(100);showGain('+50 000 zł 🏆','#e91e8c'); if(typeof submitAllScores==='function') submitAllScores();}`,
   `if(!G._mile1m&&(G.fans||0)>=1000000){G._mile1m=true;G._mile1mDay=G.day; /* v1.8.73: speedrun tracker */ earn(50000,false);G.fame=100;showMsg('🏆 MILION FANÓW! Status legendy! +50 000 zł, fame=100!');addNotif('🏆 Milestone: 1M fanów — LEGENDA!');confetti(100);showGain('+50 000 zł 🏆','#e91e8c'); if(typeof submitAllScores==='function') submitAllScores();}`],
  /* Achievementy 1K/10K/1M */
  [`{id:'1k_followers',name:'1K Obserwujących',desc:'Zdobądź 1000 obserwujących',icon:'👥',check:()=>G.followers>=1000},`,
   `{id:'1k_followers',name:'1K Fanów',desc:'Zdobądź 1000 fanów lojalnych',icon:'👥',check:()=>(G.fans||0)>=1000},`],
  [`{id:'10k_followers',name:'10K Obserwujących',desc:'Zdobądź 10000 obserwujących',icon:'🌟',check:()=>G.followers>=10000},`,
   `{id:'10k_followers',name:'10K Fanów',desc:'Zdobądź 10000 fanów lojalnych',icon:'🌟',check:()=>(G.fans||0)>=10000},`],
  [`{id:'fans_1m',name:'Milion obserwujących',desc:'Zdobądź 1 000 000 obserwujących',icon:'🌍',check:()=>(G.followers||0)>=1000000},`,
   `{id:'fans_1m',name:'Milion fanów',desc:'Zdobądź 1 000 000 fanów lojalnych',icon:'🌍',check:()=>(G.fans||0)>=1000000},`],
  /* fans_500 achievement */
  [`{id:'fans_500',name:'Half-K',desc:'500 followersów — masz publiczność',icon:'🌐',check:()=>G.followers>=500},`,
   `{id:'fans_500',name:'Half-K',desc:'500 fanów — masz publiczność',icon:'🌐',check:()=>(G.fans||0)>=500},`],
  /* 100k achievement */
  [`{id:'100k_followers',name:'100K',desc:'Zdobądź 100 000 obserwujących',icon:'💎',check:()=>G.followers>=100000},`,
   `{id:'100k_followers',name:'100K Fanów',desc:'Zdobądź 100 000 fanów lojalnych',icon:'💎',check:()=>(G.fans||0)>=100000},`],
  /* 1m_followers globalna ikona */
  [`{id:'1m_followers',name:'Globalna ikona',desc:'1 000 000 obserwujących + 50 sławy (legenda)',icon:'👑',check:()=>(G.followers||0)>=1000000&&(G.fame||0)>=50},`,
   `{id:'1m_followers',name:'Globalna ikona',desc:'1 000 000 fanów lojalnych + 50 sławy (legenda)',icon:'👑',check:()=>(G.fans||0)>=1000000&&(G.fame||0)>=50},`],
  /* Mapa Studio Merch label */
  [`{id:'merch_studio', wx:1100, wy:672, w:160,h:155, act:'goto:merch_studio:540:520', prompt:'[E] Studio Projektowania (5000+ obserwujących)', lbl:'Studio Merch'},`,
   `{id:'merch_studio', wx:1100, wy:672, w:160,h:155, act:'goto:merch_studio:540:520', prompt:'[E] Studio Projektowania (5000+ fanów)', lbl:'Studio Merch'},`],
  /* Tweet menu World Tour */
  [`{text:'🌍 World Tour (50k obserwujących, 10k zł, 🎪 Scena lvl 4+) — 5 miast',`,
   `{text:'🌍 World Tour (50k fanów, 10k zł, 🎪 Scena lvl 4+) — 5 miast',`],
  /* Scena raper notify Trener */
  [`fn:()=>{closeNPCDlg();notify('📅 Otwórz Telefon → 🎤 Raper → Drzewko. Gałąź 🎪 Scena wymaga: Flow lvl 3 + 500 fanów łącznie (obserwujący + lojalni). Odblokuj 3 poziomy żeby grać u mnie.');}`,
   `fn:()=>{closeNPCDlg();notify('📅 Otwórz Telefon → 🎤 Raper → Drzewko. Gałąź 🎪 Scena wymaga: Flow lvl 3 + 500 fanów lojalnych. Odblokuj 3 poziomy żeby grać u mnie.');}`],
  /* Raper ST minFans check → G.fans (nie totalFans) */
  [`if(def.minFans){const totalFans=(G.followers||0)+(G.fans||0);if(totalFans<def.minFans)return false;}`,
   `if(def.minFans){if((G.fans||0)<def.minFans)return false;}`],
  /* Raper ST reqParts UI */
  [`if(def.minFans) reqParts.push(\`\${def.minFans} fanbase'u\`);`,
   `if(def.minFans) reqParts.push(\`\${def.minFans} fanów\`);`],
  /* mainMission milestones labels */
  [`{fans:100, reward:{money:500},          done:false, label:'Pierwsze 100 (fanbase)!'},
        {fans:250, reward:{money:1000,xp:30},    done:false, label:'250 fanbase — rośniesz!'},
        {fans:500, reward:{money:2000,xp:60,followers:100}, done:false, label:'Pół drogi do celu!'},
        {fans:1000,reward:{money:5000,xp:150,fame:15},       done:false, label:'1000 FANBASE — MISJA ZALICZONA!'},`,
   `{fans:100, reward:{money:500},          done:false, label:'Pierwsze 100 fanów!'},
        {fans:250, reward:{money:1000,xp:30},    done:false, label:'250 fanów — rośniesz!'},
        {fans:500, reward:{money:2000,xp:60,followers:100}, done:false, label:'Pół drogi do celu!'},
        {fans:1000,reward:{money:5000,xp:150,fame:15},       done:false, label:'1000 FANÓW — MISJA ZALICZONA!'},`],
  /* Speedrun banner */
  [`? \`<div style="color:#27ae60;font-weight:700">✓ Osiągnąłeś 1M obserwujących w dniu \${G._mile1mDay||'?'} — pojawiasz się w rankingu</div>\``,
   `? \`<div style="color:#27ae60;font-weight:700">✓ Osiągnąłeś 1M fanów w dniu \${G._mile1mDay||'?'} — pojawiasz się w rankingu</div>\``],
  [`: \`<div style="color:#f1c40f;font-weight:700;margin-bottom:6px">⏱ Aby pojawić się tu, osiągnij 1M obserwujących</div>
           <div style="color:#aac;margin-bottom:6px">Twój postęp: <b style="color:#fff">\${fol.toLocaleString('pl')}</b> / 1 000 000 obserwujących (\${pctTo1M}%)</div>`,
   `: \`<div style="color:#f1c40f;font-weight:700;margin-bottom:6px">⏱ Aby pojawić się tu, osiągnij 1M fanów</div>
           <div style="color:#aac;margin-bottom:6px">Twój postęp: <b style="color:#fff">\${fol.toLocaleString('pl')}</b> / 1 000 000 fanów (\${pctTo1M}%)</div>`],
  [`? 'Jeszcze nikt nie ukończył speedrunu do 1M obserwujących.<br><br>Bądź pierwszy!'`,
   `? 'Jeszcze nikt nie ukończył speedrunu do 1M fanów.<br><br>Bądź pierwszy!'`],
  /* Speedrun panel — fol value to G.fans */
  [`if(_lbCurrentCat==='speedrun'){
    const fol=G.followers||0;
    const reached=!!G._mile1m;
    const pctTo1M=Math.min(100,Math.round(fol/1000000*100));`,
   `if(_lbCurrentCat==='speedrun'){
    const fol=G.fans||0;
    const reached=!!G._mile1m;
    const pctTo1M=Math.min(100,Math.round(fol/1000000*100));`],
];

for(const [oldS, newS] of pairs){
  const before = html;
  html = html.split(oldS).join(newS);
  if(html === before){
    log.push(`MISS: ${oldS.slice(0,80)}...`);
  } else {
    applied++;
  }
}

fs.writeFileSync(SRC, html);
console.log(`Applied: ${applied}/${pairs.length}`);
log.forEach(l => console.log('  '+l));
