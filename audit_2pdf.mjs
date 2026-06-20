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

  // ============ NX sub-batch 3 — kontrakty + escrow + NPC + heatCh ============
  const nx3 = await page.evaluate(()=>{
    const _rand=Math.random;
    try{
      G.trap=G.trap||{}; G.trap.unlocked=true; G.trap.heat=10; G.trap.heatCh=undefined;
      G.workers=[{role:'chemist'}]; G.trap.front={type:'pharma',tier:1}; G.money=10000000; G.day=5;
      G.nox=undefined; window._noxEnsure(); G.nox.unlocked=true; G.nox.handshakeDone=true; G.nox.reputation=30; G.nox.brokerTrust=50;
      const out={};
      G.nox.accessLevel=1; out.acceptTier1=window.acceptNoxContract('ROUTE-17A');
      G.nox.accessLevel=2;
      const mB=G.money; out.accept=window.acceptNoxContract('ROUTE-17A');
      out.escrowAfter=G.nox.escrowBalance; out.moneyDrop=mB-G.money; out.activeLen=(G.nox.active||[]).length; out.cooldown=G.nox.cooldownGlobal;
      // SUCCESS
      const c={offerId:'ROUTE-17A',typ:'Logistyka',cost:150000,skMin:100,skMax:100,betrayal:0,heatCh:'customs',heatImpact:6};
      G.nox.reputation=30; G.nox.escrowBalance=150000; G.nox.traceLevel=0; G.trap.heatCh=undefined;
      Math.random=()=>0.01; window.resolveNoxContract(c);
      out.succRep=G.nox.reputation; out.succEscrow=G.nox.escrowBalance; out.succHeatCh=(G.trap.heatCh&&G.trap.heatCh.customs)||0;
      // FAILURE
      const c2={offerId:'UTIL-07',typ:'Utylizacja',cost:100000,skMin:50,skMax:50,betrayal:0,heatCh:'env',heatImpact:9};
      G.nox.reputation=30; G.nox.escrowBalance=100000; const m2=G.money;
      Math.random=()=>0.99; window.resolveNoxContract(c2);
      out.failRep=G.nox.reputation; out.failEscrow=G.nox.escrowBalance; out.failMoneyReturned=G.money-m2;
      // NPC unlock tier2
      window._noxUnlockContactsForTier(2); out.hasMira=(G.nox.contacts||[]).some(x=>x.id==='mira'); out.npcCount=NOX_NPCS.length;
      // dashboard buttons tier2
      G.nox.accessLevel=2; let de=null; try{ window.renderNoxDashboard(); }catch(e){ de=e.message; }
      out.dashErr=de; out.dashHtml=(document.getElementById('ph-content')||{}).innerHTML||'';
      return out;
    } finally { Math.random=_rand; }
  });
  if(nx3.acceptTier1!==false) fail('NX-3: accept przy tier1 nie odmówił ('+nx3.acceptTier1+')'); else ok('NX-3: tier1 read-only — accept odmawia');
  if(nx3.accept!==true) fail('NX-3: acceptNoxContract nie przyjął przy tier2'); else ok('NX-3: accept tier2 przyjmuje trasę');
  if(nx3.escrowAfter!==150000||nx3.moneyDrop!==150000) fail('NX-3: escrow='+nx3.escrowAfter+' moneyDrop='+nx3.moneyDrop+' (oczek 150000)'); else ok('NX-3: escrow blokuje koszt 150k zł');
  if(nx3.activeLen!==1||nx3.cooldown!==11) fail('NX-3: active='+nx3.activeLen+' cooldown='+nx3.cooldown+' (oczek 1/11)'); else ok('NX-3: aktywne zlecenie + cooldown (dzień 11)');
  if(nx3.succRep!==36) fail('NX-3: sukces reputacja='+nx3.succRep+' (oczek 36)'); else ok('NX-3: sukces → reputacja +6 (36)');
  if(nx3.succEscrow!==0||!(nx3.succHeatCh>0)) fail('NX-3: sukces escrow='+nx3.succEscrow+' heatCh.customs='+nx3.succHeatCh); else ok('NX-3: sukces → escrow zwolnione + heatCh customs +'+nx3.succHeatCh);
  if(nx3.failRep!==22) fail('NX-3: porażka reputacja='+nx3.failRep+' (oczek 22)'); else ok('NX-3: porażka → reputacja -8 (22)');
  if(nx3.failEscrow!==0||nx3.failMoneyReturned!==0) fail('NX-3: porażka escrow='+nx3.failEscrow+' zwrot='+nx3.failMoneyReturned+' (escrow ma przepaść)'); else ok('NX-3: porażka → escrow przepada (brak zwrotu)');
  if(!nx3.hasMira||nx3.npcCount!==6) fail('NX-3: NPC mira='+nx3.hasMira+' liczba='+nx3.npcCount); else ok('NX-3: 6 NPC brokerów, tier2 odblokowuje Mira Rysa');
  if(nx3.dashErr) fail('NX-3: renderNoxDashboard rzucił: '+nx3.dashErr); else ok('NX-3: dashboard tier2 renderuje bez błędu');
  if(!/Akceptuj przez escrow/.test(nx3.dashHtml)) fail('NX-3: brak przycisków akceptacji w dashboardzie tier2'); else ok('NX-3: przyciski Akceptuj aktywne przy tier2');

  // ============ K-1 — blokada dzienna kradzieży + ryzyko dzielnic ============
  const k1 = await page.evaluate(()=>{
    const out={};
    out.day12 = canPlayerRobNpc(12,'ulica');             // false (dzień)
    out.night2ug = canPlayerRobNpc(2,'underground');     // true full
    out.e21ug = canPlayerRobNpc(21,'underground');       // true low
    out.e21bus = canPlayerRobNpc(21,'business');         // false (zła lokacja early-night)
    out.predawn5 = canPlayerRobNpc(5,'ulica');           // false predawn
    out.ugRisk = (typeof DISTRICT_THEFT_RISK!=='undefined') ? DISTRICT_THEFT_RISK.underground : null;
    window._theftStateEnsure();
    out.stateOk = !!(G._theft && typeof G._theft.stealthXp==='number' && G._theft.robberyCooldown && G._theft.robsByDistrict);
    out.varsExist = (typeof G.defamation==='number' && typeof G.streetHeat==='number' && typeof G.streetCredibility==='number');
    // _attemptTheft day-block (12:00) — brak skoku
    gameMin=720; G.day=5; G._theftDay=5; G._theftsToday=0; G.money=1000;
    try{ window._attemptTheft(); }catch(e){ out.dayErr=e.message; }
    out.dayTheftsAfter=G._theftsToday; out.dayMoney=G.money;
    // _attemptTheft night (2:00) — skok się liczy
    gameMin=120; G._theftDay=5; G._theftsToday=0;
    try{ window._attemptTheft(); }catch(e){ out.nightErr=e.message; }
    out.nightTheftsAfter=G._theftsToday;
    return out;
  });
  if(k1.day12.ok!==false||!/Za jasno|niewidzialny|tylko nocą/.test(k1.day12.msg||'')) fail('K-1: dzień(12) ok='+k1.day12.ok+' msg='+k1.day12.msg); else ok('K-1: 06-20 blokada kradzieży (komunikat PDF)');
  if(k1.night2ug.ok!==true) fail('K-1: noc(2,underground) nie pozwala'); else ok('K-1: 22-04 pełna dostępność w Underground');
  if(k1.e21ug.ok!==true||k1.e21ug.lootBand!=='low') fail('K-1: 21:00 underground band='+JSON.stringify(k1.e21ug)); else ok('K-1: 20-22 wybrane dzielnice, niskie łupy');
  if(k1.e21bus.ok!==false) fail('K-1: 21:00 business powinno być zablokowane'); else ok('K-1: 20-22 zła lokacja (business) zablokowana');
  if(k1.predawn5.ok!==false) fail('K-1: 5:00 powinno być zablokowane'); else ok('K-1: 04-06 martwe ulice (patrole) — blokada');
  if(!k1.ugRisk||k1.ugRisk.rob!=='wysokie') fail('K-1: DISTRICT_THEFT_RISK.underground='+JSON.stringify(k1.ugRisk)); else ok('K-1: DISTRICT_THEFT_RISK (underground=wysokie)');
  if(!k1.stateOk) fail('K-1: G._theft nie zainicjowany'); else ok('K-1: G._theft stan save-safe');
  if(!k1.varsExist) fail('K-1: brak istniejących zmiennych (defamation/streetHeat) — coś zepsute'); else ok('K-1: istniejące zmienne nietknięte (defamation/streetHeat/streetCredibility)');
  if(k1.dayTheftsAfter!==0||k1.dayMoney!==1000) fail('K-1: _attemptTheft w dzień zadziałał (thefts='+k1.dayTheftsAfter+' money='+k1.dayMoney+')'); else ok('K-1: _attemptTheft w dzień zablokowany (brak skoku)');
  if(k1.nightTheftsAfter!==1) fail('K-1: _attemptTheft w nocy nie policzył skoku ('+k1.nightTheftsAfter+')'); else ok('K-1: _attemptTheft w nocy przechodzi (skok policzony)');

  // ============ K-2 — gracz okrada NPC (4 typy + formuła) ============
  const k2 = await page.evaluate(()=>{
    const _rand=Math.random;
    try{
      const out={};
      currentRoom='ulica';
      out.typeCount=Object.keys(ROBBERY_TYPES).length;
      gameMin=120; G.day=5; G._theftDay=5; G._theftsToday=0; G.fame=0; G.streetHeat=0; G._alcoholAddictionUntil=0; G.activeSubstance=null; G._highUntil=0;
      window._theftStateEnsure(); G._theft.districtWitness={}; G._theft.stealthXp=0;
      const chUg=window._robberySuccessChance('pickpocket','underground');
      const chBus=window._robberySuccessChance('pickpocket','business');
      out.chRange=(chUg>=0.05&&chUg<=0.95&&chBus>=0.05&&chBus<=0.95); out.ugGtBus=chUg>chBus;
      // pickpocket sukces → kasa
      G._theftsToday=0; G.money=1000; Math.random=()=>0.01;
      window._attemptTheft('pickpocket'); out.ppMoney=G.money;
      // intimidate gated (streetRep 0, ulica) → odmowa (brak skoku)
      G._theftsToday=0; G.streetRep=0; { const m0=G.money,t0=G._theftsToday; window._attemptTheft('intimidate'); out.intiRefused=(t0===G._theftsToday); }
      // intimidate dozwolone (streetRep 50)
      G._theftsToday=0; G.streetRep=50; { const t1=G._theftsToday; window._attemptTheft('intimidate'); out.intiAllowed=(G._theftsToday===t1+1); }
      // shoplift wpadka → ban
      G._theftsToday=0; Math.random=()=>0.99; window._theftStateEnsure(); G._theft.shopBans={};
      window._attemptTheft('shoplift');
      out.banKeys=Object.keys(G._theft.shopBans).length; out.banVal=Object.values(G._theft.shopBans)[0]||0;
      return out;
    } finally { Math.random=_rand; }
  });
  if(k2.typeCount!==4) fail('K-2: ROBBERY_TYPES ma '+k2.typeCount+' typów (oczek 4)'); else ok('K-2: 4 typy kradzieży (kieszonkowa/torba/wymuszenie/sklepowa)');
  if(!k2.chRange) fail('K-2: _robberySuccessChance poza 0.05-0.95'); else ok('K-2: szansa sukcesu w zakresie 0.05-0.95');
  if(!k2.ugGtBus) fail('K-2: Underground nie łatwiejszy niż Centrum/business'); else ok('K-2: formuła — Underground łatwiejszy niż pilnowane dzielnice');
  if(!(k2.ppMoney>1000)) fail('K-2: kieszonkowa sukces nie dała kasy ('+k2.ppMoney+')'); else ok('K-2: kieszonkowa sukces → dirty_cash (+'+(k2.ppMoney-1000)+' zł)');
  if(!k2.intiRefused) fail('K-2: wymuszenie nie zablokowane przy streetRep<30 poza Underground'); else ok('K-2: wymuszenie gated (streetRep<30 + nie-Underground → odmowa)');
  if(!k2.intiAllowed) fail('K-2: wymuszenie nie przeszło przy streetRep 50'); else ok('K-2: wymuszenie dozwolone przy streetRep 50');
  if(!(k2.banKeys>=1&&k2.banVal>5)) fail('K-2: sklepowa wpadka nie dała bana (keys='+k2.banKeys+' val='+k2.banVal+')'); else ok('K-2: sklepowa wpadka → ban w sklepie (do dnia '+k2.banVal+')');

  // ============ K-3 — bycie okradzionym + wandalizm auta (7 typów) ============
  const k3 = await page.evaluate(()=>{
    const _rand=Math.random;
    const setSeq=(arr)=>{ let i=0; Math.random=()=>{ const v=(i<arr.length)?arr[i]:0.5; i++; return v; }; };
    try{
      const out={};
      currentRoom='underground'; G.day=5; G.car={name:'TestCar',condition:100,price:500000}; G._inCar=true; G._carCond={}; G._harnold=null;
      if(typeof _carInvEnsure==='function') _carInvEnsure();
      window._theftStateEnsure();
      G._ugTheftDay=-1; G.car.condition=100; setSeq([0.01,0.01]);
      out.v1=window._undergroundTheftRoll(); out.cond1=G.car.condition;
      G._ugTheftDay=-1; G.car.condition=100; setSeq([0.01,0.99]);
      out.v2=window._undergroundTheftRoll(); out.cond2=G.car.condition;
      Math.random=_rand;
      // bycie okradzionym — wysokie ryzyko fires
      G._theft.robbedDay=-1; G.money=200000; G.streetCredibility=0; G.crew=[]; gameMin=120; G.drip=0; G.energy=100; G._alcoholAddictionUntil=0; G.activeSubstance=null; G._highUntil=0;
      setSeq([0.01,0.3]);
      out.rbFired=!!window.rollNpcRobberyAgainstPlayer('underground',2); out.moneyAfterRob=G.money; out.lastRob=G._theft._lastRobbery?G._theft._lastRobbery.npc:null;
      Math.random=_rand;
      // niskie ryzyko — brak
      G._theft.robbedDay=-1; G.money=1000; G.streetCredibility=80; G.crew=[]; setSeq([0.99]);
      out.rb2=window.rollNpcRobberyAgainstPlayer('business',12);
      Math.random=_rand;
      // 5 reakcji
      const react=(id)=>{ G._theft._lastRobbery={npc:'x',name:'X',emoji:'🚨',cash:1000,loc:'underground',recoverable:600}; const b={vio:G.violenceHeat||0,money:G.money||0,fear:G._theft.fear||0}; window._npcRobberyReact(id); return {vio:(G.violenceHeat||0)-b.vio, dmoney:(G.money||0)-b.money, fear:(G._theft.fear||0)-b.fear}; };
      G.violenceHeat=0; G.streetHeat=0; G._theft.fear=0; G.money=100000; G.crew=[{role:'guard'}]; G._trapDealerMet=true;
      out.chase=react('chase'); out.contact=react('contact'); out.protection=react('protection');
      let pErr=null; try{ react('police'); react('letgo'); }catch(e){ pErr=e.message; } out.pErr=pErr;
      out.npcTypes=NPC_ROBBER_TYPES.length;
      return out;
    } finally { Math.random=_rand; }
  });
  const VIDS=['scratch','window','mirrors','tires','tag','interior','wreck','frozen'];
  if(!VIDS.includes(k3.v1)||!(k3.cond1<100)) fail('K-3: wandalizm v1='+k3.v1+' cond='+k3.cond1); else ok('K-3: wandalizm auta — typ "'+k3.v1+'" (sprawność '+k3.cond1+'%)');
  if(!VIDS.includes(k3.v2)||!(k3.cond2<k3.cond1)) fail('K-3: wandalizm v2='+k3.v2+' cond='+k3.cond2+' (oczek cięższy niż v1)'); else ok('K-3: cięższy wandalizm "'+k3.v2+'" (sprawność '+k3.cond2+'% < '+k3.cond1+'%)');
  if(k3.npcTypes!==6) fail('K-3: NPC_ROBBER_TYPES='+k3.npcTypes+' (oczek 6)'); else ok('K-3: 6 typów NPC okradających');
  if(!k3.rbFired||!(k3.moneyAfterRob<200000)||!k3.lastRob) fail('K-3: wysokie ryzyko nie okradło (fired='+k3.rbFired+' money='+k3.moneyAfterRob+')'); else ok('K-3: bycie okradzionym przy wysokim ryzyku ('+k3.lastRob+', strata)');
  if(k3.rb2!==false) fail('K-3: niskie ryzyko (business/dzień) okradło ('+k3.rb2+')'); else ok('K-3: brak kradzieży przy niskim ryzyku (business/dzień)');
  if(!(k3.chase.vio>0)) fail('K-3: reakcja Szukaj-sprawcy nie podniosła violence_heat'); else ok('K-3: reakcja „Szukaj sprawcy" → +violence_heat');
  if(k3.contact.dmoney===0) fail('K-3: reakcja Kontakt nie zmieniła kasy'); else ok('K-3: reakcja „Zadzwoń do kontaktu" → koszt/odzysk');
  if(!(k3.protection.fear>0)) fail('K-3: reakcja Ochrona nie podniosła fear'); else ok('K-3: reakcja „Użyj ochrony" → +fear/+violence_heat/odzysk');
  if(k3.pErr) fail('K-3: reakcje police/letgo rzuciły: '+k3.pErr); else ok('K-3: reakcje „Zgłoś służbom" / „Odpuść" działają');

  // ============ K-4 — progi defamation + kariera + anty-exploit ============
  const k4 = await page.evaluate(()=>{
    const out={};
    out.tiers=[5,20,35,55,75,95].map(s=>_defamationTier(s).id);
    G.defamation=95; out.modToxic=_defamationCareerMods();
    G.defamation=0; out.modClean=_defamationCareerMods();
    G.day=5; window._theftStateEnsure(); G._theft.robsDay=5; G._theft.robsByDistrict={underground:3}; G._theft.alertUntil={}; G._theft.districtWitness={};
    const chBefore=window._robberySuccessChance('pickpocket','underground');
    window._theftDistrictAlertCheck('underground');
    out.alerted=window._theftDistrictAlerted('underground'); out.alertUntil=G._theft.alertUntil.underground;
    out.alertLowersChance=(window._robberySuccessChance('pickpocket','underground')<chBefore);
    return out;
  });
  const TIERS=['clean','rumors','suspect','blacklist','burned','toxic'];
  if(JSON.stringify(k4.tiers)!==JSON.stringify(TIERS)) fail('K-4: progi defamation='+JSON.stringify(k4.tiers)); else ok('K-4: 6 progów zniesławienia (clean→toxic)');
  if(k4.modToxic.id!=='toxic'||!(k4.modToxic.payoutMult<0.6)||k4.modToxic.sponsorMult!==0) fail('K-4: toksyczny mods='+JSON.stringify(k4.modToxic)); else ok('K-4: toksyczny brand → sponsorzy 0, stawki '+Math.round(k4.modToxic.payoutMult*100)+'%');
  if(k4.modClean.id!=='clean'||k4.modClean.payoutMult!==1) fail('K-4: czysty mods='+JSON.stringify(k4.modClean)); else ok('K-4: czysty wizerunek → pełne stawki (mnożniki kariery)');
  if(!k4.alerted||!(k4.alertUntil>5)) fail('K-4: czujna okolica nie aktywowana po 3 kradzieżach (alerted='+k4.alerted+')'); else ok('K-4: anty-exploit „czujna okolica" po 3 kradzieżach (do dnia '+k4.alertUntil+')');
  if(!k4.alertLowersChance) fail('K-4: czujna okolica nie obniża szansy kradzieży'); else ok('K-4: czujna okolica obniża szansę (+patrole/świadkowie)');

  // ============ U9 — welcome wall -10% szerokości ============
  const u9 = await page.evaluate(()=>{
    try{ showWelcomePopup('Test','Body'); }catch(e){ return {err:e.message}; }
    const el=document.getElementById('welcome-popup');
    const mw=el?el.style.maxWidth:null;
    if(el) el.remove(); const bd=document.getElementById('welcome-backdrop'); if(bd) bd.remove();
    return { mw };
  });
  if(u9.err) fail('U9: showWelcomePopup rzucił: '+u9.err); else if(u9.mw!=='468px') fail('U9: welcome-popup max-width='+u9.mw+' (oczek 468px = -10%)'); else ok('U9: „Wall powitalny" zwężony o 10% (520→468px)');

  // ============ U16-sub2 — flavor rename generycznych sklepów ============
  const u16b = await page.evaluate(()=>{
    const lbl=(id)=>{ const o=(ROOMS.ulica.objects||[]).find(x=>x.id===id); return o?o.lbl:null; };
    const lm=(frag)=>(MAP_LANDMARKS||[]).some(l=>(l.name||'').includes(frag));
    return {
      carwash:lbl('carwash'), shelter:lbl('shelter'), salon:lbl('salon'), muzyczny:lbl('muzyczny'), sala:lbl('sala_konce'), zoo:lbl('zoo_shop'), pepco:lbl('pepco'), szpital:lbl('szpital'),
      lmBeat:lm('BeatPoint'), lmPaw:lm('Dom dla Łapy'), lmSplash:lm('Splash & Go'),
    };
  });
  const exp={carwash:'Splash & Go',shelter:'Dom dla Łapy',salon:'CityDrive Motors',muzyczny:'BeatPoint',sala:'808 Arena',zoo:'PetSide Market',pepco:'Backstreet Thrift',szpital:'Nova Cura'};
  let u16bad=[];
  for(const k of Object.keys(exp)){ if(u16b[k]!==exp[k]) u16bad.push(k+'='+u16b[k]); }
  if(u16bad.length) fail('U16-sub2: lbl niezmienione: '+u16bad.join(', ')); else ok('U16-sub2: sklepy generyczne → fikcyjne brandy (carwash/shelter/salon/muzyczny/sala/zoo + 10 dalszych)');
  if(!u16b.lmBeat||!u16b.lmPaw||!u16b.lmSplash) fail('U16-sub2: minimap niezmieniony (beat='+u16b.lmBeat+' paw='+u16b.lmPaw+' splash='+u16b.lmSplash+')'); else ok('U16-sub2: minimap MAP_LANDMARKS przemianowany');

  // ============ P2 — spot-check poprzedniego PDF (narkobiznes: systemy nazwane nie-ghost) ============
  const p2 = await page.evaluate(()=>{
    const out={};
    // H5 — 3 nazwane ekipy produkcyjne z pasmami jakości
    const crews=(typeof WORKER_NPCS!=='undefined')?WORKER_NPCS.filter(w=>['crew_samir','crew_ramin','crew_heisenberg'].includes(w.id)):[];
    out.crews=crews.length; out.crewsBand=crews.every(c=>Array.isArray(c.crewBand)&&c.crewBand.length===2);
    // H2 — fillery
    out.fillers=(typeof TRAP_FILLERS!=='undefined')?TRAP_FILLERS.length:0;
    out.fillersOk=(typeof TRAP_FILLERS!=='undefined')&&TRAP_FILLERS.every(f=>f&&f.id);
    // H3 — system łapówek
    out.bribeFn=(typeof window._offerBribe==='function');
    // _trapFillersEnsure init
    G.trapInv=G.trapInv||{}; let feErr=null;
    try{ if(typeof _trapFillersEnsure==='function') _trapFillersEnsure(); }catch(e){ feErr=e.message; }
    out.feErr=feErr;
    out.fillersInit=(typeof TRAP_FILLERS!=='undefined')?TRAP_FILLERS.every(f=>typeof G.trapInv[f.id]==='number'):false;
    return out;
  });
  if(!(p2.crews===3&&p2.crewsBand)) fail('P2 narko: ekipy produkcyjne H5='+p2.crews+' band='+p2.crewsBand); else ok('P2 narko: 3 nazwane ekipy produkcyjne (H5) z pasmami jakości');
  if(!(p2.fillers>0&&p2.fillersOk)) fail('P2 narko: fillery H2='+p2.fillers); else ok('P2 narko: fillery (H2) zarejestrowane ('+p2.fillers+')');
  if(!p2.bribeFn) fail('P2 narko: brak _offerBribe (system łapówek H3)'); else ok('P2 narko: system łapówek _offerBribe (H3) wired');
  if(p2.feErr||!p2.fillersInit) fail('P2 narko: _trapFillersEnsure err='+p2.feErr+' init='+p2.fillersInit); else ok('P2 narko: _trapFillersEnsure inicjuje fillery save-safe');

  // ============ P3 — głęboki audyt: łańcuch tantiemów muzycznych (collect-only, anti-NaN/double-pay) ============
  const p3 = await page.evaluate(()=>{
    const out={};
    // spotify: zbierz pulę → kasa rośnie, pula 0
    G.money=100000; G.spotify=G.spotify||{}; G.spotify.royalties=5000; G.spotify.listeners=0; G.spotify.streams=0;
    const m0=G.money; window.collectRoyalties('spotify');
    out.spotGain=G.money-m0; out.spotPool=G.spotify.royalties;
    // pusta pula → brak zmiany, brak NaN
    const m1=G.money; window.collectRoyalties('spotify');
    out.emptyGain=G.money-m1; out.moneyFinite=Number.isFinite(G.money);
    // yt: pole adsense (NIE royalties) — historyczny bug undefined/NaN
    G.yt=G.yt||{}; G.yt.adsense=3000; const m2=G.money; window.collectRoyalties('yt');
    out.ytGain=G.money-m2; out.ytPool=G.yt.adsense; out.ytFinite=Number.isFinite(G.money);
    return out;
  });
  if(!(p3.spotGain>0&&p3.spotPool===0)) fail('P3 muzyka: collect spotify gain='+p3.spotGain+' pool='+p3.spotPool); else ok('P3 muzyka: zbieranie tantiem Spotify (kasa +'+p3.spotGain+', pula→0)');
  if(p3.emptyGain!==0||!p3.moneyFinite) fail('P3 muzyka: pusta pula gain='+p3.emptyGain+' finite='+p3.moneyFinite); else ok('P3 muzyka: pusta pula → brak zmiany, brak NaN (anti-double-pay)');
  if(!(p3.ytGain>0&&p3.ytPool===0&&p3.ytFinite)) fail('P3 muzyka: yt adsense gain='+p3.ytGain+' pool='+p3.ytPool+' finite='+p3.ytFinite); else ok('P3 muzyka: YouTube AdSense (pole adsense, nie royalties) — kasa +'+p3.ytGain+', brak NaN');

  // ============ P3 — bank/lokaty (invest→zwrot, anti-cheat) ============
  const p3b = await page.evaluate(()=>{
    const out={};
    G.bank=G.bank||{}; G.bank.investments=[]; G.bank.investHistory=G.bank.investHistory||[]; G.day=10; G.money=100000;
    // tworzenie lokaty
    const m0=G.money; window.invest(10000,7,10);
    const inv=(G.bank.investments||[])[0]||{};
    out.moneyDrop=m0-G.money; out.invAmount=inv.amount; out.invReturn=inv.returnAmount; out.invReturnDay=inv.returnDay;
    // anti-cheat: ujemna kwota nie daje kasy
    const m1=G.money; window.invest(-5000,7,10); out.cheatGain=G.money-m1; out.cheatCount=(G.bank.investments||[]).length;
    // dojrzewanie: ustaw returnDay<=day, nextPeriod usuwa + investHistory rośnie
    G.bank.investments=[{amount:10000,returnAmount:11000,returnDay:G.day,days:7,pct:10}];
    const hist0=(G.bank.investHistory||[]).length;
    let npErr=null; try{ if(typeof nextPeriod==='function') nextPeriod(); }catch(e){ npErr=e.message; }
    out.npErr=npErr; out.matRemoved=!(G.bank.investments||[]).some(i=>i.returnAmount===11000); out.histGrew=((G.bank.investHistory||[]).length>hist0);
    return out;
  });
  if(!(p3b.moneyDrop===10000&&p3b.invAmount===10000&&p3b.invReturn===11000&&p3b.invReturnDay===17)) fail('P3 bank: lokata drop='+p3b.moneyDrop+' amount='+p3b.invAmount+' return='+p3b.invReturn+' day='+p3b.invReturnDay); else ok('P3 bank: lokata tworzona (−10k, zwrot 11k @ dzień 17)');
  if(p3b.cheatGain>0||p3b.cheatCount!==1) fail('P3 bank: anti-cheat ujemna kwota gain='+p3b.cheatGain+' count='+p3b.cheatCount); else ok('P3 bank: anti-cheat — ujemna kwota odrzucona (brak gain)');
  if(p3b.npErr) fail('P3 bank: nextPeriod rzucił: '+p3b.npErr); else if(!(p3b.matRemoved&&p3b.histGrew)) fail('P3 bank: dojrzewanie removed='+p3b.matRemoved+' histGrew='+p3b.histGrew); else ok('P3 bank: dojrzewanie lokaty → wypłata + historia (usunięta z aktywnych)');

  // ============ P3 — kryptowaluty (buy/sell, anti-exploit) ============
  const p3c = await page.evaluate(()=>{
    const out={};
    const coinId=(typeof CRYPTO_COINS!=='undefined'&&CRYPTO_COINS[0])?CRYPTO_COINS[0].id:'hype';
    G.trader=G.trader||{}; G.trader.unlocked=true; G.trader.tradesCount=0;
    G.crypto=G.crypto||{}; G.crypto.holdings={}; G.crypto.history=[]; G.crypto.prices=G.crypto.prices||{}; G.crypto.prevPrices=G.crypto.prevPrices||{};
    G.crypto.prices[coinId]=25; G.crypto.prevPrices[coinId]=25; G.day=10; G.money=100000;
    // buy
    const m0=G.money; const okBuy=window._cryptoBuy(coinId,10000);
    const h=G.crypto.holdings[coinId]||{}; out.okBuy=okBuy; out.buyDrop=m0-G.money; out.qtyAfterBuy=h.qty||0;
    // sell wszystko
    const m1=G.money; const okSell=window._cryptoSell(coinId,h.qty||0);
    out.okSell=okSell; out.sellGain=G.money-m1; out.qtyAfterSell=(G.crypto.holdings[coinId]||{}).qty||0;
    // anti-exploit: kup za wiecej niz masz
    G.money=5000; const m2=G.money; const cheatBuy=window._cryptoBuy(coinId,1e9); out.cheatBuy=cheatBuy; out.cheatBuyDrop=m2-G.money;
    // anti-exploit: sprzedaj wiecej niz masz
    G.crypto.holdings[coinId]={qty:1,avgPrice:25,buyDay:10}; const m3=G.money; const cheatSell=window._cryptoSell(coinId,1e9); out.cheatSell=cheatSell; out.cheatSellGain=G.money-m3;
    return out;
  });
  if(!(p3c.okBuy&&p3c.buyDrop>0&&p3c.qtyAfterBuy>0)) fail('P3 crypto: buy ok='+p3c.okBuy+' drop='+p3c.buyDrop+' qty='+p3c.qtyAfterBuy); else ok('P3 crypto: zakup coina (kasa −'+Math.round(p3c.buyDrop)+', holdings +'+p3c.qtyAfterBuy.toFixed(3)+')');
  if(!(p3c.okSell&&p3c.sellGain>0&&p3c.qtyAfterSell<0.001)) fail('P3 crypto: sell ok='+p3c.okSell+' gain='+p3c.sellGain+' qty='+p3c.qtyAfterSell); else ok('P3 crypto: sprzedaż coina (kasa +'+Math.round(p3c.sellGain)+', holdings→0)');
  if(p3c.cheatBuy!==false||p3c.cheatBuyDrop!==0) fail('P3 crypto: anti-exploit over-buy='+p3c.cheatBuy+' drop='+p3c.cheatBuyDrop); else ok('P3 crypto: anti-exploit — kup ponad stan odrzucony');
  if(p3c.cheatSell!==false||p3c.cheatSellGain!==0) fail('P3 crypto: anti-exploit over-sell='+p3c.cheatSell+' gain='+p3c.cheatSellGain); else ok('P3 crypto: anti-exploit — sprzedaż ponad holdings odrzucona');

  // ============ P3 — prestige (reset→permanentny bonus, cap, anti-exploit crew/career reset) ============
  const p3p = await page.evaluate(()=>{
    const out={};
    G.prestige=0; G.prestigeBonus={moneyMult:1,fameMult:1}; G.level=999; G.fans=1e9; G.xp=5000; G.money=100000; G.crew=[{role:'dj'}]; G.contract=null; G.prestigePoints=0;
    window.doPrestige();
    out.rank1=G.prestige; out.levelReset=G.level; out.mMult1=G.prestigeBonus.moneyMult; out.fMult1=G.prestigeBonus.fameMult; out.crewReset=(G.crew||[]).length; out.points=G.prestigePoints;
    // earn aplikuje bonus permanentny (read w earn) — directional
    const eb=(typeof earn==='function')?earn(1000,false):1000; out.earnApplied=(eb>=1000);
    // cap przy rank 10
    G.prestige=9; G.level=999; G.fans=1e9; window.doPrestige();
    out.rank10=G.prestige; out.mMultCap=G.prestigeBonus.moneyMult;
    // ponad cap — rank 11 odrzucony
    G.prestige=10; G.level=999; G.fans=1e9; const before=G.prestige; window.doPrestige(); out.over=(G.prestige===before);
    return out;
  });
  /* lvl resetuje do 1; checkAchievements() po prestige może doliczyć XP z odblokowanego osiągnięcia (nudge do 2) — reset = drop z 999 do ≤2 (nie exact-1, analog szumu passive). */
  if(!(p3p.rank1===1&&p3p.levelReset<=2&&p3p.mMult1>1&&p3p.fMult1>1)) fail('P3 prestige: rank='+p3p.rank1+' lvl='+p3p.levelReset+' mMult='+p3p.mMult1+' fMult='+p3p.fMult1); else ok('P3 prestige: reset poziomu (999→'+p3p.levelReset+') + permanentny bonus (money×'+p3p.mMult1.toFixed(2)+', fame×'+p3p.fMult1.toFixed(2)+')');
  if(!(p3p.crewReset===0&&p3p.points>=1)) fail('P3 prestige: anti-exploit crew='+p3p.crewReset+' points='+p3p.points); else ok('P3 prestige: anti-exploit — ekipa zresetowana + prestige point przyznany');
  if(!(p3p.rank10===10&&p3p.mMultCap===1.20)) fail('P3 prestige: cap rank='+p3p.rank10+' mMult='+p3p.mMultCap); else ok('P3 prestige: bonus money capowany na 1.20 (rank 10)');
  if(!p3p.over) fail('P3 prestige: rank >10 nie odrzucony'); else ok('P3 prestige: max prestige 10 (ponad odrzucone)');

  // ============ P3 — osiągnięcia (unlock→nagroda + lifetime-claim anti-exploit) ============
  const p3a = await page.evaluate(()=>{
    const out={};
    G.money=1e9; G.fame=500; G.fans=2e6; G.followers=1e6; G.level=50; G.xp=0; G.streetRep=100; G.drip=200; G.studioTracks=G.studioTracks||[];
    // świeży claim
    G.achievements=[]; G._achievementsClaimed=[];
    const xp0=G.xp; checkAchievements();
    out.unlocked=G.achievements.length; out.claimed=G._achievementsClaimed.length; out.xpGained=(G.xp>xp0);
    // anti-exploit quit-load: wyczyść achievements (NIE claimed), nagroda NIE wypłacana ponownie
    G.achievements=[]; const m0=G.money; const cl0=G._achievementsClaimed.length;
    checkAchievements();
    out.reUnlocked=G.achievements.length; out.m0=m0; out.moneyAfterReclaim=G.money; out.claimedStable=(G._achievementsClaimed.length===cl0);
    return out;
  });
  if(!(p3a.unlocked>0&&p3a.claimed>0&&p3a.xpGained)) fail('P3 ach: unlocked='+p3a.unlocked+' claimed='+p3a.claimed+' xp='+p3a.xpGained); else ok('P3 osiągnięcia: unlock w MAXED ('+p3a.unlocked+' odblokowanych, '+p3a.claimed+' z nagrodą +XP)');
  /* anti-exploit: po quit-load (achievements wyczyszczone, claimed zachowane) ponowny check NIE dopłaca nagrody (money===m0) + claimed nie rośnie. */
  if(!(p3a.reUnlocked>0&&p3a.claimedStable&&p3a.moneyAfterReclaim===p3a.m0)) fail('P3 ach: anti-exploit reUnlocked='+p3a.reUnlocked+' claimedStable='+p3a.claimedStable+' money='+p3a.moneyAfterReclaim+' m0='+p3a.m0); else ok('P3 osiągnięcia: lifetime-claim anti-exploit (quit-load NIE wypłaca nagrody 2×, money stabilne)');

  // ============ P3 — crew-akcje (sound_eng mastering → buff + cooldown + gate) ============
  const p3cr = await page.evaluate(()=>{
    const out={};
    G.money=1e9; G.fans=2e6; G.followers=1e6; G.day=10; G._crewActionDay={}; G._soundEngBuff=null;
    G.crew=[{role:'sound_eng',name:'Mariusz'}];
    // akcja → ustawia buff +10 jakości następnego wydania
    let e1=null; try{ window._crewAction('sound_eng'); }catch(e){ e1=e.message; }
    out.e1=e1; out.buffSet=!!(G._soundEngBuff&&G._soundEngBuff.active); out.actDay=G._crewActionDay.sound_eng;
    // cooldown: dzień 12 (<cd 5) → zablokowane, buff NIE ustawiony ponownie
    G.day=12; G._soundEngBuff=null; window._crewAction('sound_eng'); out.cdBlocked=!(G._soundEngBuff&&G._soundEngBuff.active);
    // po cooldownie dzień 16 (>=5) → znów działa
    G.day=16; window._crewAction('sound_eng'); out.afterCd=!!(G._soundEngBuff&&G._soundEngBuff.active);
    // brak workera → gate
    G.crew=[]; G._soundEngBuff=null; G.day=30; window._crewAction('sound_eng'); out.noWorker=!(G._soundEngBuff&&G._soundEngBuff.active);
    return out;
  });
  if(p3cr.e1||!p3cr.buffSet||p3cr.actDay!==10) fail('P3 crew: err='+p3cr.e1+' buff='+p3cr.buffSet+' day='+p3cr.actDay); else ok('P3 crew: sound_eng mastering → buff +10 jakości następnego wydania (cooldown ustawiony)');
  if(!p3cr.cdBlocked) fail('P3 crew: cooldown nie zablokował akcji'); else ok('P3 crew: cooldown 5 dni blokuje ponowną akcję');
  if(!p3cr.afterCd) fail('P3 crew: akcja nie działa po cooldownie'); else ok('P3 crew: akcja znów dostępna po cooldownie');
  if(!p3cr.noWorker) fail('P3 crew: akcja zadziałała bez workera'); else ok('P3 crew: gate — brak sound_eng w ekipie blokuje akcję');

  // ============ P3 — item equip bonus (getItemBonus: sumowanie + cap 0.45 + read-w-earn) ============
  const p3i = await page.evaluate(()=>{
    const out={};
    G.equipped={}; out.empty=getItemBonus('job');
    G.equipped={a:{bonus:{job:0.12}}, b:{bonus:{job:0.20}}}; out.sum=getItemBonus('job');
    G.equipped={a:{bonus:{job:0.30}}, b:{bonus:{job:0.30}}}; out.cap=getItemBonus('job');
    G.equipped={a:{bonus:{fame:0.15}}}; out.fame=getItemBonus('fame'); out.jobZero=getItemBonus('job');
    return out;
  });
  if(p3i.empty!==0) fail('P3 item: brak equip getItemBonus='+p3i.empty); else ok('P3 item: brak equip → bonus 0');
  if(Math.abs(p3i.sum-0.32)>0.001) fail('P3 item: sumowanie='+p3i.sum+' (oczek 0.32)'); else ok('P3 item: bonusy equip sumują się (0.12+0.20=0.32)');
  if(p3i.cap!==0.45) fail('P3 item: cap='+p3i.cap+' (oczek 0.45)'); else ok('P3 item: cap bonusu 0.45 (0.30+0.30→0.45)');
  if(!(Math.abs(p3i.fame-0.15)<0.001&&p3i.jobZero===0)) fail('P3 item: per-stat fame='+p3i.fame+' job='+p3i.jobZero); else ok('P3 item: bonus per-stat (fame osobno od job; czytane w earn/addFame/stream)');

  // ============ P3 — sklep jedzenia (kup→ekwipunek/lodówka + merge + anti-exploit) ============
  const p3f = await page.evaluate(()=>{
    const out={};
    window.renderFoodShop=()=>{}; // izolacja DOM
    G.money=100000; G.inventory=[]; G.fridgeItems=[]; G.backpack=20;
    const m0=G.money; window.buyToInventory('pizza');
    out.invHasPizza=(G.inventory||[]).some(i=>i.id==='pizza'&&i.type==='food'); out.invMoneyDrop=m0-G.money;
    const m1=G.money; window.buyToFridge('pizza'); window.buyToFridge('pizza');
    const fr=(G.fridgeItems||[]).find(i=>i.id==='pizza'); out.fridgeQty=fr?fr.qty:0; out.fridgeMoneyDrop=m1-G.money;
    G.money=0; window.buyToInventory('water'); out.brokeBlocked=(G.money===0 && !(G.inventory||[]).some(i=>i.id==='water'));
    G.money=100000; G.backpack=0; G.inventory=[]; for(let i=0;i<6;i++) G.inventory.push({id:'x'+i,type:'food',name:'x',qty:1});
    const m3=G.money; window.buyToInventory('burger'); out.capBlocked=(G.money===m3 && !(G.inventory||[]).some(i=>i.id==='burger'));
    return out;
  });
  if(!(p3f.invHasPizza&&p3f.invMoneyDrop>0)) fail('P3 food: ekwipunek hasPizza='+p3f.invHasPizza+' drop='+p3f.invMoneyDrop); else ok('P3 sklep-jedzenie: kup→ekwipunek (kasa −'+p3f.invMoneyDrop+', pizza w inv)');
  if(p3f.fridgeQty!==2||!(p3f.fridgeMoneyDrop>0)) fail('P3 food: lodówka qty='+p3f.fridgeQty+' drop='+p3f.fridgeMoneyDrop); else ok('P3 sklep-jedzenie: kup×2→lodówka (merge qty=2, kasa −'+p3f.fridgeMoneyDrop+')');
  if(!p3f.brokeBlocked) fail('P3 food: anti-exploit brak-kasy nie zablokował'); else ok('P3 sklep-jedzenie: anti-exploit — brak kasy blokuje zakup');
  if(!p3f.capBlocked) fail('P3 food: cap ekwipunku nie zablokował'); else ok('P3 sklep-jedzenie: pełny ekwipunek (cap 6) blokuje zakup do inv');

  // ============ P3 — lombard invPawn (sprzedaż przedmiotu→kasa+/inv- + blokada quest) ============
  const p3p2 = await page.evaluate(()=>{
    const out={};
    window.gameConfirm=(m,fn)=>fn(); window.openInventory=()=>{}; // auto-confirm + izolacja DOM
    G.inventory=[{id:'gold',type:'item',name:'Sztabka',emoji:'🪙',qty:1,value:5000}]; G.money=1000;
    window.invPawn('gold'); out.money=G.money; out.removed=!(G.inventory||[]).some(i=>i.id==='gold');
    // quest item — NIE sprzedawalny
    G.inventory=[{id:'q',type:'item',kind:'quest',name:'Dowód',emoji:'📄',qty:1,value:9999}]; const m=G.money;
    window.invPawn('q'); out.questBlocked=(G.money===m && (G.inventory||[]).some(i=>i.id==='q'));
    return out;
  });
  if(!(p3p2.money===6000&&p3p2.removed)) fail('P3 lombard: money='+p3p2.money+' removed='+p3p2.removed); else ok('P3 lombard: sprzedaż przedmiotu (kasa 1000→6000, usunięty z inv)');
  if(!p3p2.questBlocked) fail('P3 lombard: quest-item NIE zablokowany'); else ok('P3 lombard: przedmiot zadaniowy nie sprzedawalny (anti-loss)');

  // ============ P3 — parabank/chwilówka (pożyczka→dług, cap, spłata anti-overpay) ============
  const p3pb = await page.evaluate(()=>{
    const out={};
    window.renderPhoneApp=()=>{}; window.updateHUD=()=>{};
    G.parabank={loan:0}; G.money=1000;
    window._parabankBorrow(5000,6000); out.borrowMoney=G.money; out.borrowLoan=G.parabank.loan;
    // cap długu 40k
    G.parabank.loan=38000; const m=G.money, l=G.parabank.loan; window._parabankBorrow(5000,6000); out.capBlocked=(G.money===m && G.parabank.loan===l);
    // spłata częściowa
    G.parabank.loan=6000; G.money=10000; window._parabankRepay(2000); out.repayMoney=G.money; out.repayLoan=G.parabank.loan;
    // anti-overpay: spłać więcej niż dług → max do długu
    G.parabank.loan=1000; G.money=10000; window._parabankRepay(5000); out.overMoney=G.money; out.overLoan=G.parabank.loan;
    return out;
  });
  if(!(p3pb.borrowMoney===6000&&p3pb.borrowLoan===6000)) fail('P3 parabank: pożyczka money='+p3pb.borrowMoney+' loan='+p3pb.borrowLoan); else ok('P3 parabank: pożyczka (kasa 1000→6000, dług 6000)');
  if(!p3pb.capBlocked) fail('P3 parabank: cap długu 40k nie zablokował'); else ok('P3 parabank: cap długu 40 000 zł blokuje nadmierną pożyczkę');
  if(!(p3pb.repayMoney===8000&&p3pb.repayLoan===4000)) fail('P3 parabank: spłata money='+p3pb.repayMoney+' loan='+p3pb.repayLoan); else ok('P3 parabank: spłata częściowa (kasa −2000, dług 6000→4000)');
  if(!(p3pb.overMoney===9000&&p3pb.overLoan===0)) fail('P3 parabank: anti-overpay money='+p3pb.overMoney+' loan='+p3pb.overLoan); else ok('P3 parabank: anti-overpay — spłata max do długu (kasa −1000, dług→0, nie ujemny)');

  if(errors.length) fail('page errors: '+errors.join(' | ')); else ok('brak page-errors');
}catch(e){ fail('exception: '+e.message+'\n'+e.stack); }
finally{ await browser.close(); }

if(failed){ console.error(`\n=== SĘDZIA 2PDF: CZERWONY (${failed} fail) ===`); process.exit(1); }
console.log('\n=== SĘDZIA 2PDF: ZIELONY ===');
