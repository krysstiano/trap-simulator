/* SĘDZIA 2 PDF (v2.3.44+) — rośnie z każdą fazą. JA odpalam co iterację (gate), user może zweryfikować.
   ZASADA #0: done = ZIELONY tu (exit 1 przy bugu). node audit_2pdf.mjs */
import { setupPage } from './_helper_runtime_template.mjs';
import fs from 'fs';

let failed=0;
const fail=(m)=>{ console.error('❌ FAIL: '+m); failed++; };
const ok=(m)=>console.log('✅ '+m);

const { page, browser, errors } = await setupPage();
try{
  // ============ TIER A (U10 cofanie / U8 TrapInfo) ============
  const a = await page.evaluate(()=>{
    const out={};
    out.foldInsta = (typeof _phFolderOfApp==='function') ? _phFolderOfApp('instagram') : null;
    out.foldBank  = (typeof _phFolderOfApp==='function') ? _phFolderOfApp('bank') : null;
    if(typeof togglePhone==='function' && !(typeof phoneOpen==='function'&&phoneOpen())) togglePhone();
    if(out.foldInsta && typeof renderPhoneFolder==='function') renderPhoneFolder(out.foldInsta);
    if(typeof renderPhoneApp==='function') renderPhoneApp('instagram');
    if(typeof window._phGoBack==='function') window._phGoBack();
    out.viewAfterBack = G._phView;
    out.trapinfoName = (typeof SMS_CONTACTS!=='undefined' && SMS_CONTACTS.trapinfo) ? SMS_CONTACTS.trapinfo.name : null;
    return out;
  });
  if(a.viewAfterBack!=='folder:'+a.foldInsta) fail('U10: cofanie do "'+a.viewAfterBack+'", oczek. folder:'+a.foldInsta); else ok('U10: cofanie z apki → podgrupa ('+a.viewAfterBack+')');
  if(a.trapinfoName!=='TrapInfo') fail('U8: trapinfo='+a.trapinfoName); else ok('U8: nadawca TrapInfo OK');

  // ============ U14 — gating rekrutacji ekipy ============
  const u14 = await page.evaluate(()=>{
    const txt=(o)=>{ try{return typeof o.text==='function'?o.text():o.text;}catch(e){return '';} };
    const opts=NPC_DATA.crew.opts;
    const find=(pred)=>opts.find(pred);
    const djBeat = find(o=>txt(o).includes('1200'));
    const hype   = find(o=>txt(o).toLowerCase().includes('hype'));
    const junior = find(o=>txt(o).toLowerCase().includes('junior'));
    const djKonc = find(o=>txt(o).toLowerCase().includes('koncertowy'));
    const reset=()=>{ G.crew=[]; G.money=1e9; G.fans=0; G.events={performed:0,revenue:0}; G.managementDeal=false; G.djContract=null; };
    const roles=()=>G.crew.map(c=>c.role);
    const callQuiet=(o)=>{ try{o.fn();}catch(e){} };
    const r={};
    reset();
    r.lockDj=txt(djBeat); r.lockHype=txt(hype); r.lockJunior=txt(junior); r.lockKonc=txt(djKonc);
    callQuiet(djBeat); r.djAt0=roles().includes('dj');
    callQuiet(hype);   r.hypeAt0=roles().includes('hype');
    callQuiet(junior); r.juniorAt0=roles().includes('manager_jr');
    reset(); G.fans=2000; r.unlockDj=txt(djBeat); callQuiet(djBeat); r.djAt2k=roles().includes('dj');
    reset(); G.fans=50000; r.unlockHype=txt(hype); callQuiet(hype); r.hypeAt50k=roles().includes('hype');
    reset(); G.events.performed=5; r.unlockJunior=txt(junior); callQuiet(junior); r.juniorAt5=roles().includes('manager_jr');
    reset(); r.koncLock0=txt(djKonc);
    reset(); G.events.performed=10; r.koncUnlock10=txt(djKonc);
    return r;
  });
  if(!/wymóg: 2\s?000/.test(u14.lockDj)) fail('U14 DJ lock-text: '+u14.lockDj); else ok('U14: DJ zablokowany <2k ('+u14.lockDj+')');
  if(!/wymóg: 50\s?000/.test(u14.lockHype)) fail('U14 hype lock-text: '+u14.lockHype); else ok('U14: hype zablokowany <50k');
  if(!/wymóg: 5 koncert/.test(u14.lockJunior)) fail('U14 junior lock-text: '+u14.lockJunior); else ok('U14: junior zablokowany <5 koncertów');
  if(!/wymóg: 10 koncert/.test(u14.lockKonc)) fail('U14 djkonc lock-text: '+u14.lockKonc); else ok('U14: DJ koncertowy zablokowany <10 koncertów');
  if(u14.djAt0) fail('U14: DJ zrekrutowany mimo 0 fanów!'); else ok('U14: DJ odmawia przy 0 fanów');
  if(u14.hypeAt0) fail('U14: hype zrekrutowany mimo 0 fanów!'); else ok('U14: hype odmawia przy 0 fanów');
  if(u14.juniorAt0) fail('U14: junior zrekrutowany mimo 0 koncertów!'); else ok('U14: junior odmawia przy 0 koncertów');
  if(/wymóg/.test(u14.unlockDj)) fail('U14: DJ nadal locked przy 2k: '+u14.unlockDj); else ok('U14: DJ odblokowany przy 2k');
  if(!u14.djAt2k) fail('U14: DJ NIE zrekrutowany przy 2k fanów'); else ok('U14: DJ rekrutuje się przy 2k');
  if(!u14.hypeAt50k) fail('U14: hype NIE zrekrutowany przy 50k'); else ok('U14: hype rekrutuje się przy 50k');
  if(!u14.juniorAt5) fail('U14: junior NIE zrekrutowany przy 5 koncertach'); else ok('U14: junior rekrutuje się przy 5 koncertach');
  if(!/wymóg/.test(u14.koncLock0)) fail('U14: DJ koncertowy NIE locked przy 0 koncertów: '+u14.koncLock0); else ok('U14: DJ koncertowy locked przy 0');
  if(/wymóg/.test(u14.koncUnlock10)) fail('U14: DJ koncertowy nadal locked przy 10: '+u14.koncUnlock10); else ok('U14: DJ koncertowy odblokowany przy 10');

  // ============ U5 — ukrywanie powiadomień podczas interakcji ============
  const u5a = await page.evaluate(()=>{
    const out={};
    if(typeof phoneOpen==='function' && phoneOpen()) togglePhone();
    out.busyClosed = window._busyInteraction();
    window._deferredMsgs=[];
    if(typeof togglePhone==='function') togglePhone();
    out.busyPhone = window._busyInteraction();
    showMsg('U5TEST_AMBIENT','i',3000);
    const msgEl=document.getElementById('msg');
    out.msgTextDuring = msgEl?(msgEl.textContent||''):'';
    out.deferredHas = (window._deferredMsgs||[]).some(m=>m.t==='U5TEST_AMBIENT');
    return out;
  });
  if(u5a.busyClosed) fail('U5: _busyInteraction true mimo zamkniętego UI'); else ok('U5: brak interakcji = nie busy');
  if(!u5a.busyPhone) fail('U5: telefon otwarty ale _busyInteraction false'); else ok('U5: telefon otwarty = busy');
  if(/U5TEST_AMBIENT/.test(u5a.msgTextDuring)) fail('U5: powiadomienie POKAZANE podczas interakcji (#msg) — powinno być odłożone'); else ok('U5: powiadomienie NIE na pierwszym planie podczas interakcji');
  if(!u5a.deferredHas) fail('U5: powiadomienie NIE odłożone do kolejki'); else ok('U5: powiadomienie odłożone do kolejki');
  await page.evaluate(()=>{ if(typeof phoneOpen==='function'&&phoneOpen()) togglePhone(); });
  await page.waitForTimeout(1000);
  const u5b = await page.evaluate(()=> ({ stillDeferred:(window._deferredMsgs||[]).some(m=>m.t==='U5TEST_AMBIENT'), busy:window._busyInteraction() }));
  if(u5b.busy) fail('U5: po zamknięciu telefonu nadal busy'); else ok('U5: po zamknięciu = nie busy');
  if(u5b.stillDeferred) fail('U5: odłożone powiadomienie NIE wyflushowane po zamknięciu interakcji'); else ok('U5: odłożone powiadomienie wyflushowane po zamknięciu (drugi plan→pierwszy)');

  // ============ U7 — rename Velvet Room ============
  const u7 = await page.evaluate(()=>{
    const out={};
    const obj=(ROOMS.ulica.objects||[]).find(o=>o.id==='striptiz');
    out.lbl=obj?obj.lbl:null; out.prompt=obj?obj.prompt:null;
    out.hoursName=(typeof PLACE_HOURS!=='undefined'&&PLACE_HOURS.striptiz)?PLACE_HOURS.striptiz.name:null;
    out.signFn=(typeof drawVelvetSign==='function');
    out.landmark=(typeof MAP_LANDMARKS!=='undefined')?((MAP_LANDMARKS.find(l=>l.name&&l.name.includes('striptiz'))||{}).name||null):null;
    return out;
  });
  if(u7.lbl!=='Klub ze striptizem') fail('U7: map lbl='+u7.lbl+' (oczek. „Klub ze striptizem")'); else ok('U7: mapa lbl „Klub ze striptizem"');
  if(!/Velvet Room/.test(u7.prompt||'')) fail('U7: prompt nie ma „Velvet Room": '+u7.prompt); else ok('U7: prompt blisko = Velvet Room');
  if(u7.hoursName!=='Velvet Room') fail('U7: PLACE_HOURS name='+u7.hoursName); else ok('U7: nazwa własna Velvet Room (PLACE_HOURS)');
  if(!u7.signFn) fail('U7: brak funkcji drawVelvetSign'); else ok('U7: drawVelvetSign (szyld neon) istnieje');
  if(!/Klub ze striptizem/.test(u7.landmark||'')) fail('U7: minimap landmark='+u7.landmark); else ok('U7: minimap „Klub ze striptizem"');

  // ============ U11 — praca Budowa trudniejsza ============
  // runtime: wystartuj minigrę, ułóż 8 cegieł → etap betonu pokazuje /30 (mieszanie 20→30)
  await page.evaluate(()=>{
    try{
      if(typeof startConstructionMG==='function'){
        startConstructionMG();
        const b=document.getElementById('job-intro-start'); if(b) b.click();
        for(let i=0;i<8;i++){ if(typeof window._conAction==='function') window._conAction(); }
      }
    }catch(e){}
  });
  await page.waitForTimeout(700);
  const u11r = await page.evaluate(()=> ({ prog:(document.getElementById('con-progress')||{}).textContent||null }));
  if(!/\/30/.test(u11r.prog||'')) fail('U11: etap betonu nie pokazuje /30 (got '+u11r.prog+')'); else ok('U11: betoniarka 30 mieszań (runtime '+u11r.prog+')');
  // source-assert stałych wizualnych/timingowych (closure-local — niedostępne w runtime)
  const src=fs.readFileSync('index.html','utf8');
  if(!/const TRACK=440,GL=200,GR=240;/.test(src)) fail('U11: zielone pole nie 200-240'); else ok('U11: zielone pole PERFEKCJA -60% (GL=200,GR=240)');
  if(!/if\(dist<12\)\{pts=25/.test(src)) fail('U11: perfekcja nie dist<12'); else ok('U11: strefa perfekcji zwężona (dist<12)');
  if(!/speed=7\.5\+i\*0\.5/.test(src)) fail('U11: wskaźnik cegły nie 7.5'); else ok('U11: wskaźnik cegły szybszy (speed 7.5)');
  if(/fillText\('PERFEKCJA',110\+TRACK\/2/.test(src)) fail('U11: napis PERFEKCJA wciąż renderowany w trakcie'); else ok('U11: napis PERFEKCJA usunięty z pola w trakcie (info na wstępie)');

  // ============ U12+U13 — gęstość NPC pora dnia/pogoda ============
  const u12 = await page.evaluate(()=>{
    const out={};
    const setT=(gm,w)=>{ gameMin=gm; G.weather=w; };
    setT(180,0);  out.pedNight=window._cityPedDensity(); out.carNight=window._cityCarDensity();
    setT(1020,0); out.pedPeak=window._cityPedDensity();  out.carPeak=window._cityCarDensity();
    setT(1020,2); out.pedRain=window._cityPedDensity();  out.carRain=window._cityCarDensity();
    setT(660,0);  out.carClear11=window._cityCarDensity();
    setT(660,2);  out.carRain11=window._cityCarDensity();
    out.rankPed=(cityPeds[0]&&typeof cityPeds[0]._rank==='number');
    out.rankCar=(cityCars[0]&&typeof cityCars[0]._rank==='number');
    setT(180,0); // zostaw noc — przetestuj że draw nie rzuca przy niskiej gęstości
    return out;
  });
  await page.waitForTimeout(500); // pozwól drawCityLife renderować przy niskiej gęstości (guardy aktywne)
  if(!(u12.pedNight>0.1&&u12.pedNight<0.2)) fail('U12: pedNight='+u12.pedNight+' (oczek ~0.15)'); else ok('U12: piesi noc ~15% szczytu ('+u12.pedNight.toFixed(2)+')');
  if(!(u12.pedPeak>=0.99)) fail('U12: pedPeak='+u12.pedPeak); else ok('U12: piesi szczyt 16-18:30 = 100% ('+u12.pedPeak.toFixed(2)+')');
  if(!(u12.carNight<0.2)) fail('U12: carNight='+u12.carNight); else ok('U12: auta noc niskie ('+u12.carNight.toFixed(2)+')');
  if(!(u12.carPeak>=0.88&&u12.carPeak<=0.92)) fail('U12: carPeak='+u12.carPeak+' (oczek ~0.90 rush)'); else ok('U12: auta szczyt ruchu ~0.90 ('+u12.carPeak.toFixed(2)+')');
  if(!(u12.pedRain<u12.pedPeak&&u12.pedRain<0.7)) fail('U13: pedRain='+u12.pedRain+' (oczek -40% vs szczyt)'); else ok('U13: deszcz -40% pieszych ('+u12.pedRain.toFixed(2)+' vs '+u12.pedPeak.toFixed(2)+')');
  if(!(u12.carRain>=u12.carPeak)) fail('U13: carRain='+u12.carRain+' nie >= carPeak '+u12.carPeak); else ok('U13: deszcz +auta w szczycie ('+u12.carRain.toFixed(2)+')');
  if(!(u12.carRain11>u12.carClear11)) fail('U13: auta deszcz 11:00 ('+u12.carRain11+') nie > pogoda jasna ('+u12.carClear11+')'); else ok('U13: deszcz +20% aut (11:00 '+u12.carRain11.toFixed(2)+' > '+u12.carClear11.toFixed(2)+')');
  if(!u12.rankPed||!u12.rankCar) fail('U12: brak stałych _rank (ped='+u12.rankPed+' car='+u12.rankCar+')'); else ok('U12: stałe _rank przypisane (ped+car)');

  // ============ U15 — Marina Coast bez aut + piesi plażowi ============
  const u15 = await page.evaluate(()=>{
    const out={};
    out.cfgCars=DISTRICT_LIFE_CFG.coast.cars;
    if(typeof initDistrictLife==='function') initDistrictLife('coast');
    out.coastCars=districtCars.length;
    out.coastPeds=districtPeds.length;
    out.coastBeach=districtPeds.filter(p=>p.beach).length;
    if(typeof initDistrictLife==='function') initDistrictLife('underground');
    out.ugBeach=districtPeds.filter(p=>p.beach).length;
    out.ugCars=districtCars.length;
    return out;
  });
  if(u15.cfgCars!==0) fail('U15: DISTRICT_LIFE_CFG.coast.cars='+u15.cfgCars); else ok('U15: coast cfg cars=0');
  if(u15.coastCars!==0) fail('U15: coast districtCars='+u15.coastCars); else ok('U15: coast bez aut NPC (0)');
  if(!(u15.coastBeach>=1)) fail('U15: coast brak pieszych plażowych ('+u15.coastBeach+'/'+u15.coastPeds+')'); else ok('U15: piesi plażowi na coast ('+u15.coastBeach+'/'+u15.coastPeds+')');
  if(u15.ugBeach!==0) fail('U15: underground ma plażowych ('+u15.ugBeach+') — plażowi tylko coast'); else ok('U15: underground bez plażowych (kontrast)');
  if(u15.ugCars<=0) fail('U15: underground stracił auta ('+u15.ugCars+')'); else ok('U15: inne dzielnice mają auta dalej (underground '+u15.ugCars+')');
  // render coast (beach peds) bez błędu
  await page.evaluate(()=>{ try{ if(typeof changeRoom==='function') changeRoom('coast',720,800); }catch(e){} });
  await page.waitForTimeout(500);
  const u15b = await page.evaluate(()=> ({ room:currentRoom, cars:districtCars.length }));
  if(u15b.room==='coast' && u15b.cars!==0) fail('U15: w coast (render) są auta ('+u15b.cars+')'); else ok('U15: coast render bez aut (room='+u15b.room+')');

  // ============ U16 — rename realnych marek (sub-batch 1: trademarki) ============
  const u16 = await page.evaluate(()=>{
    const find=(id)=>(ROOMS.ulica.objects||[]).find(o=>o.id===id)||{};
    return {
      mm:find('mediamarkt').lbl, meble:find('meble').lbl, jysk:find('jysk').lbl,
      hoursMeble:(PLACE_HOURS['shop:meble']||{}).name, hoursMm:(PLACE_HOURS['shop:mediamarkt']||{}).name,
      fnVolt:(typeof renderVoltHouse==='function'), fnSign:(typeof drawNorthRoomSign==='function'),
      lmVolt:(MAP_LANDMARKS||[]).some(l=>(l.name||'').includes('VoltHouse')),
      lmNorth:(MAP_LANDMARKS||[]).some(l=>(l.name||'').includes('NorthRoom')),
    };
  });
  if(u16.mm!=='VoltHouse') fail('U16: mediamarkt lbl='+u16.mm); else ok('U16: Media Markt → VoltHouse (lbl)');
  if(u16.meble!=='NorthRoom') fail('U16: meble lbl='+u16.meble); else ok('U16: IKEA → NorthRoom (lbl)');
  if(u16.jysk!=='Meblux') fail('U16: jysk lbl='+u16.jysk); else ok('U16: JYSK → Meblux (lbl)');
  if(u16.hoursMeble!=='NorthRoom'||u16.hoursMm!=='VoltHouse') fail('U16: PLACE_HOURS meble='+u16.hoursMeble+' mm='+u16.hoursMm); else ok('U16: PLACE_HOURS przemianowane');
  if(!u16.fnVolt||!u16.fnSign) fail('U16: funkcje renderVoltHouse='+u16.fnVolt+' drawNorthRoomSign='+u16.fnSign); else ok('U16: funkcje przemianowane spójnie');
  if(!u16.lmVolt||!u16.lmNorth) fail('U16: minimap VoltHouse='+u16.lmVolt+' NorthRoom='+u16.lmNorth); else ok('U16: minimap przemianowany');
  // source: ZERO player-facing realnych marek (poza komentarzami/patch notes)
  const src16=fs.readFileSync('index.html','utf8').split('\n');
  const skip=(l)=>{ const t=l.trim(); return /^(\*|\/\*|\/\/)/.test(t)||/ver:'v|cats:\s*\[|reporter:|\{t:'(feature|change|fix|add|info|critical)'/.test(l); };
  let leak=[];
  src16.forEach((l,i)=>{ if(skip(l)) return; let c=l; const ci=l.indexOf('//'); if(ci>=0)c=l.slice(0,ci); if(/Media Markt|MediaMarkt|\bIKEA\b|\bJYSK\b/.test(c)) leak.push((i+1)+':'+l.trim().slice(0,60)); });
  if(leak.length) fail('U16: realna marka player-facing pozostała: '+leak.join(' || ')); else ok('U16: ZERO player-facing realnych marek (IKEA/JYSK/Media Markt)');

  // ============ NA — przedawkowanie alkoholu ============
  // Faza 1: 10 alkoholi/dobę + 3. próba = realne przedawkowanie
  const naMid = await page.evaluate(()=>{
    if(typeof window._alcoholEnsure==='function') window._alcoholEnsure();
    G.day=5; G._alcoholDay=5; G._alcoholToday=0; G._alcoholTypesToday=[];
    G._alcoholAttempts=2; G._alcoholOverdoseDay=-1; G._alcoholOverdoses=0; G._alcoholAddictionUntil=0;
    G.health=100; G.stress=80;
    const types=['beer','cocktail','whiskey','champagne','beer','cocktail','whiskey','champagne','beer','cocktail'];
    for(let i=0;i<10;i++) window._registerAlcohol(types[i]);
    return { today:G._alcoholToday, attempts:G._alcoholAttempts, odDay:G._alcoholOverdoseDay };
  });
  await page.waitForTimeout(2600); // event: teleport+kary po 2s
  const na1 = await page.evaluate(()=> ({ health:G.health, stress:G.stress, room:currentRoom, px:(typeof P!=='undefined'?P.wx:null), py:(typeof P!=='undefined'?P.wy:null), blackout:!!document.getElementById('alco-blackout') }));
  if(naMid.today!==10) fail('NA: licznik alkoholu='+naMid.today); else ok('NA: licznik 10 pozycji/dobę');
  if(naMid.attempts!==3||naMid.odDay!==5) fail('NA: attempts='+naMid.attempts+' odDay='+naMid.odDay); else ok('NA: 3. próba = przedawkowanie (raz na 3)');
  if(na1.health!==30) fail('NA: zdrowie po przedawkowaniu='+na1.health+' (oczek 30)'); else ok('NA: -70 zdrowia (100→30)');
  if(na1.stress!==0) fail('NA: nastrój po przedawkowaniu='+na1.stress+' (oczek 0)'); else ok('NA: -80 nastroju (80→0)');
  if(na1.room!=='ulica'||!(na1.px>250&&na1.px<310&&na1.py>1030&&na1.py<1110)) fail('NA: teleport room='+na1.room+' px='+na1.px+' py='+na1.py+' (oczek park ~280,1070)'); else ok('NA: teleport do parku przy fontannie ('+na1.px+','+na1.py+')');
  if(!na1.blackout) fail('NA: brak overlay czarnego ekranu'); else ok('NA: czarny ekran (blackout) podczas przedawkowania');
  // Faza 2: druga próba tego samego dnia udaremniona (raz na dobę)
  const na2 = await page.evaluate(()=>{ G.health=30; window._registerAlcohol('beer'); return { health:G.health }; });
  if(na2.health!==30) fail('NA: druga próba tego dnia obniżyła zdrowie ('+na2.health+') — powinna być zablokowana'); else ok('NA: druga próba tego samego dnia udaremniona (raz na dobę)');
  // Faza 3: uzależnienie po 3 przedawkowaniach
  const na3 = await page.evaluate(()=>{ G.day=10; G._alcoholOverdoses=2; G._alcoholAddictionUntil=0; window._alcoholOverdoseEvent(); return { addUntil:G._alcoholAddictionUntil, day:G.day }; });
  if(!(na3.addUntil===na3.day+7)) fail('NA: uzależnienie addUntil='+na3.addUntil+' (oczek day+7='+(na3.day+7)+')'); else ok('NA: uzależnienie 7 dób po 3 przedawkowaniach (do dnia '+na3.addUntil+')');
  // clamp uzależnienia w nextPeriod (source — guard w hot-path)
  const srcNA=fs.readFileSync('index.html','utf8');
  if(!/_alcoholAddictionUntil>\(G\.day\|\|0\) && \(G\.stress\|\|0\)>35\) G\.stress=35/.test(srcNA)) fail('NA: brak clampa uzależnienia w nextPeriod'); else ok('NA: clamp nastroju ~35 podczas uzależnienia (nextPeriod)');
  await page.evaluate(()=>{ try{ document.getElementById('alco-blackout')?.remove(); }catch(e){} });

  // ============ NX sub-batch 1 — szkielet NOX Route ============
  const nx = await page.evaluate(()=>{
    const out={};
    G.nox=undefined; window._noxEnsure();
    out.init=(G.nox && typeof G.nox.accessLevel==='number' && Array.isArray(G.nox.inbox) && G.nox.unlocked===false && typeof G.nox.brokerTrust==='number');
    const fold=_getPhoneFolders().career;
    out.appInFolder=(fold&&fold.apps||[]).some(a=>a&&typeof a.fn==='string'&&a.fn.indexOf('renderNoxApp')>=0);
    // LOCKED — brak frontu/ekipy
    G.trap=G.trap||{}; G.trap.front=null; G.workers=[]; G.trap.cooked=0; if(G.trapInv) G.trapInv.products={}; G.trap.heat=10;
    G.nox=undefined; window._noxEnsure();
    out.unlockBefore=checkNoxUnlock();
    let le=null; try{ renderNoxApp(); }catch(e){ le=e.message; }
    out.lockErr=le; out.lockHtml=(document.getElementById('ph-content')||{}).innerHTML||'';
    // UNLOCKED — spełnij warunki
    G.trap.front={type:'pharma',name:'Apteka X',paperTrailQuality:0.5,auditRisk:0.2,upkeep:100,tier:1};
    G.workers=[{role:'chemist',name:'Walter',npcId:'walter_c'}];
    G.trap.cooked=1; G.trap.heat=10;
    G.nox=undefined; window._noxEnsure();
    out.unlockAfter=checkNoxUnlock();
    let ue=null; try{ renderNoxApp(); }catch(e){ ue=e.message; }
    out.upErr=ue; out.upUnlocked=G.nox.unlocked; out.upHandshake=G.nox.handshakeDone; out.upInbox=G.nox.inbox.length;
    out.upHtml=(document.getElementById('ph-content')||{}).innerHTML||'';
    // heat krytyczny blokuje
    G.trap.heat=90; out.heatBlocks=!checkNoxUnlock();
    return out;
  });
  if(!nx.init) fail('NX: G.nox nie zainicjowany poprawnie'); else ok('NX: G.nox stan zainicjowany (save-safe)');
  if(!nx.appInFolder) fail('NX: brak apki NOX Route w folderze Kariera'); else ok('NX: apka NOX Route w folderze Kariera');
  if(nx.unlockBefore) fail('NX: checkNoxUnlock true bez frontu/ekipy'); else ok('NX: zablokowany bez frontu+ekipy+potrzeby');
  if(nx.lockErr) fail('NX: renderNoxApp rzucił (locked): '+nx.lockErr); else ok('NX: locked screen renderuje bez błędu');
  if(!/ACCESS LOCKED/.test(nx.lockHtml)) fail('NX: locked screen bez „ACCESS LOCKED"'); else ok('NX: ekran blokady (ACCESS LOCKED + checklista)');
  if(!nx.unlockAfter) fail('NX: checkNoxUnlock false mimo frontu+ekipy+produktu'); else ok('NX: odblokowanie po froncie+ekipie+potrzebie');
  if(nx.upErr) fail('NX: renderNoxApp rzucił (unlocked): '+nx.upErr); else ok('NX: dashboard renderuje bez błędu');
  if(!nx.upUnlocked||!nx.upHandshake||!(nx.upInbox>=1)) fail('NX: po odblokowaniu unlocked='+nx.upUnlocked+' handshake='+nx.upHandshake+' inbox='+nx.upInbox); else ok('NX: handshake Emir NOX + inbox ('+nx.upInbox+' wiad.)');
  if(!/ACCESS TIER|INBOX/.test(nx.upHtml)) fail('NX: dashboard bez treści'); else ok('NX: dashboard z treścią (tier+inbox)');
  if(!nx.heatBlocks) fail('NX: krytyczny heat nie blokuje odblokowania'); else ok('NX: krytyczny heat (90) blokuje kontakt');

  // ============ NX sub-batch 2 — dashboard + oferty ============
  const nx2 = await page.evaluate(()=>{
    G.trap=G.trap||{}; G.trap.front={type:'pharma',name:'X',paperTrailQuality:0.5,tier:1}; G.workers=[{role:'chemist'}]; G.trap.cooked=1; G.trap.heat=10;
    G.nox=undefined; window._noxEnsure(); G.nox.unlocked=true; G.nox.handshakeDone=true;
    const offers=generateNoxOffers(); const o0=offers[0]||{};
    const fields=['id','typ','costMin','costMax','dniMin','skMin','reqRep','cooldown','betrayal','heatCh','heatImpact','operator'];
    const hasFields=fields.every(f=>f in o0);
    const risk=calculateRouteRisk(o0);
    const riskNums=(typeof risk.route_noise==='number'&&typeof risk.trace_level==='number'&&typeof risk.betrayal==='number'&&typeof risk.heatImpact==='number'&&risk.route_noise>=0&&risk.route_noise<=100);
    G.nox.reputation=0; G.nox.accessLevel=1; const lowN=generateNoxOffers().length;
    G.nox.reputation=30; G.nox.accessLevel=3; const hiN=generateNoxOffers().length;
    let err=null; try{ renderNoxDashboard(); }catch(e){ err=e.message; }
    const html=(document.getElementById('ph-content')||{}).innerHTML||'';
    return { count:offers.length, hasFields, o0id:o0.id, riskNums, lowN, hiN, err, html };
  });
  if(!(nx2.count>=1)) fail('NX-2: generateNoxOffers zwróciło '+nx2.count+' ofert'); else ok('NX-2: generateNoxOffers ('+nx2.count+' ofert, np. '+nx2.o0id+')');
  if(!nx2.hasFields) fail('NX-2: oferta nie ma wszystkich pól PDF'); else ok('NX-2: oferta z polami (koszt/czas/skuteczność/heat/cooldown/betrayal/operator)');
  if(!nx2.riskNums) fail('NX-2: calculateRouteRisk nie zwraca poprawnych liczb'); else ok('NX-2: calculateRouteRisk (route_noise/trace/betrayal/heat liczbowo)');
  if(!(nx2.hiN>nx2.lowN)) fail('NX-2: gating — rep30/tier3 ('+nx2.hiN+') nie > rep0/tier1 ('+nx2.lowN+')'); else ok('NX-2: oferty gated reputacją/tierem ('+nx2.lowN+'→'+nx2.hiN+')');
  if(nx2.err) fail('NX-2: renderNoxDashboard rzucił: '+nx2.err); else ok('NX-2: dashboard renderuje bez błędu');
  if(!/MARKET BOARD/.test(nx2.html)||!/RISK PANEL/.test(nx2.html)) fail('NX-2: dashboard bez Market Board/Risk Panel'); else ok('NX-2: Market Board + Risk Panel w dashboardzie');

  if(errors.length) fail('page errors: '+errors.join(' | ')); else ok('brak page-errors');
}catch(e){ fail('exception: '+e.message+'\n'+e.stack); }
finally{ await browser.close(); }

if(failed){ console.error(`\n=== SĘDZIA 2PDF: CZERWONY (${failed} fail) ===`); process.exit(1); }
console.log('\n=== SĘDZIA 2PDF: ZIELONY ===');
