/* SĘDZIA 2 PDF (v2.3.44+) — rośnie z każdą fazą. JA odpalam co iterację (gate), user może zweryfikować.
   ZASADA #0: done = ZIELONY tu (exit 1 przy bugu). node audit_2pdf.mjs */
import { setupPage } from './_helper_runtime_template.mjs';

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

  if(errors.length) fail('page errors: '+errors.join(' | ')); else ok('brak page-errors');
}catch(e){ fail('exception: '+e.message+'\n'+e.stack); }
finally{ await browser.close(); }

if(failed){ console.error(`\n=== SĘDZIA 2PDF: CZERWONY (${failed} fail) ===`); process.exit(1); }
console.log('\n=== SĘDZIA 2PDF: ZIELONY ===');
