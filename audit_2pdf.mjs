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

  if(errors.length) fail('page errors: '+errors.join(' | ')); else ok('brak page-errors');
}catch(e){ fail('exception: '+e.message+'\n'+e.stack); }
finally{ await browser.close(); }

if(failed){ console.error(`\n=== SĘDZIA 2PDF: CZERWONY (${failed} fail) ===`); process.exit(1); }
console.log('\n=== SĘDZIA 2PDF: ZIELONY ===');
