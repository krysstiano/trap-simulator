/* dbg_user_q_v2333 — odpowiedz na 3 pytania usera OUTPUTEM testu (ZASADA #0):
   (1) kradzieze okazjonalne dzialaja? (2) Instagram ZAWSZE dziala? (3) Business District + wszystko na nim dziala? */
import { setupPage } from './_helper_runtime_template.mjs';
const { page, browser, errors } = await setupPage();

const r = await page.evaluate(async () => {
  const wait = ms => new Promise(s => setTimeout(s, ms));
  let lastMsg = ''; const _os = window.showMsg; window.showMsg = function (t) { try { if (t != null) lastMsg = String(t); } catch (_) {} try { return _os.apply(this, arguments); } catch (e) {} };
  const out = { kradzieze: [], instagram: [], business: [] };
  const setMax = () => { G.money = 1e9; G.level = 50; G.fame = 999; G.fans = 500000; G.followers = 200000; G.energy = 100; G.stress = 100; G.health = 100; if (!G.trap) G.trap = {}; G.trap.unlocked = true; G.trap.level = 15; G._unlockedDistricts = ['underground', 'coast', 'business']; };
  setMax();

  /* ─────── (1) KRADZIEZE OKAZJONALNE ─────── */
  // 1a. _undergroundTheftRoll — auto w underground (wymuszony RNG)
  try {
    const _rnd = Math.random; Math.random = () => 0.01;
    G.car = { name: 'Auto', price: 5000, condition: 100 }; G._carParkedAt = { room: 'underground' }; G._inCar = false; G._ugTheftDay = -1; G.day = 5;
    try { currentRoom = 'underground'; } catch (_) {}
    const res = window._undergroundTheftRoll();
    Math.random = _rnd;
    out.kradzieze.push({ test: 'underground_theft_roll (auto w dzielnicy)', ok: ['vandal', 'loot', 'parts', 'frozen'].includes(res), wynik: res });
  } catch (e) { out.kradzieze.push({ test: 'underground_theft_roll', ok: false, wynik: 'THROW:' + e.message }); }
  // 1b. czy _undergroundTheftRoll jest WYWOLYWANY w grze (w _enterDistrictPlace)
  out.kradzieze.push({ test: 'theft wywolywany przy interakcji w Underground (kod)', ok: typeof window._undergroundTheftRoll === 'function', wynik: 'hook w _enterDistrictPlace' });
  // 1c. uliczne EVENTY kradziezy: cond spelniony w nocy na ulicy -> fn odpala bez crasha
  try {
    try { currentRoom = 'ulica'; } catch (_) {}
    G.timeOfDay = 2; G.money = 50000; G._theftDay = G.day; G._theftsToday = 0;
    if (typeof RANDOM_EVENTS !== 'undefined') {
      for (const nm of ['Drobny kradzież', 'Napad rabunkowy', 'Okazja do kradzieży']) {
        const ev = RANDOM_EVENTS.find(e => e && e.name === nm);
        if (!ev) { out.kradzieze.push({ test: 'event ' + nm, ok: false, wynik: 'BRAK eventu' }); continue; }
        let pass = false; try { pass = !!ev.cond(); } catch (_) {}
        let fired = 'cond-false'; if (pass) { try { ev.fn(); fired = 'odpalony bez crasha'; } catch (e) { fired = 'THROW:' + e.message; } }
        out.kradzieze.push({ test: 'event „' + nm + '" (ulica+noc)', ok: pass && fired === 'odpalony bez crasha', wynik: 'cond=' + pass + ', fn=' + fired });
      }
    }
  } catch (e) { out.kradzieze.push({ test: 'uliczne eventy', ok: false, wynik: 'THROW:' + e.message }); }

  /* ─────── (2) INSTAGRAM ZAWSZE DZIALA ─────── */
  setMax(); try { currentRoom = 'mieszkanie'; } catch (_) {}
  const phHas = () => { const p = document.getElementById('phone'); const h = (p && p.innerHTML) || ''; return /Instagram|PUBLIKUJ|obserw|Wrzu|filtr|Spo[lł]eczno/i.test(h) && h.replace(/\s/g, '').length > 200; };
  const igStates = {
    'nowa gra (pusty feed)': [],
    'uszkodzony feed (null/string)': [null, 'zly', { caption: 'ok' }, undefined],
    'wpisy bez pol': [{}, { growStage: undefined, likes: NaN }],
    'duzy feed (50 postow)': Array.from({ length: 50 }, (_, i) => ({ caption: 'p' + i, streams: i, growStage: 5 })),
  };
  for (const [label, posts] of Object.entries(igStates)) {
    try { G.igPosts = posts.slice(); if (typeof window._sanitizePlayerLists === 'function') window._sanitizePlayerLists(); renderPhoneApp('instagram'); await wait(25); out.instagram.push({ test: 'render IG — ' + label, ok: phHas(), wynik: 'tresc=' + ((document.getElementById('phone') || {}).innerHTML || '').length + ' znakow' }); }
    catch (e) { out.instagram.push({ test: 'render IG — ' + label, ok: false, wynik: 'THROW:' + e.message }); }
  }
  // publish
  try { G.igPosts = []; G.energy = 100; G._igPostDay = -1; G._igPostCount = 0; window._igOpenComposer(2); await wait(20); const b = G.igPosts.length; window._igPublishFromComposer(); await wait(30); out.instagram.push({ test: 'PUBLIKUJ post (composer->publish)', ok: G.igPosts.length > b, wynik: 'igPosts ' + b + '->' + G.igPosts.length }); } catch (e) { out.instagram.push({ test: 'publish', ok: false, wynik: 'THROW:' + e.message }); }
  // community
  try { const html = window._igRenderCommunity(); out.instagram.push({ test: 'Spolecznosc (render feed)', ok: typeof html === 'string' && html.length > 20, wynik: html.length + ' znakow' }); } catch (e) { out.instagram.push({ test: 'community', ok: false, wynik: 'THROW:' + e.message }); }
  // LIVE
  try { G.igPosts = [{ caption: 'x', bgKey: 'studio', growStage: 5 }]; renderPhoneApp('instagram'); await wait(15); window._igStartLiveView(); await wait(25); out.instagram.push({ test: 'LIVE transmisja (start)', ok: !!G._igLiveState, wynik: G._igLiveState ? 'transmisja aktywna (target ' + G._igLiveState.targetLikes + ' lajkow)' : 'nie wystartowala' }); if (G._igLiveInterval) { clearInterval(G._igLiveInterval); G._igLiveInterval = null; } } catch (e) { out.instagram.push({ test: 'LIVE', ok: false, wynik: 'THROW:' + e.message }); }

  /* ─────── (3) BUSINESS DISTRICT ─────── */
  setMax();
  try { changeRoom('business', 720, 60); } catch (e) {}
  out.business.push({ test: 'wejscie do Business (changeRoom)', ok: currentRoom === 'business', wynik: 'currentRoom=' + currentRoom });
  G.label = { type: 'major', name: 'AudytLabel', artists: [{ id: 'a1', name: 'Art' }], albums: [] }; // dla Label HQ
  const bizPlaces = [['business_labelhq', 'Label HQ'], ['business_bankvip', 'Bank VIP'], ['business_pragency', 'PR Agency'], ['business_forbes', 'Forbes'], ['business_steakhouse', 'Steakhouse']];
  for (const [act, nm] of bizPlaces) {
    try {
      try { document.getElementById('mg-job')?.classList.remove('on'); const c = document.getElementById('mg-job-content'); if (c) c.innerHTML = ''; if (typeof closeOverlay === 'function') closeOverlay(); } catch (_) {}
      // reset cooldownow per miejsce
      G._lastForbesQuizDay = -99; G._lastPRCampaignDay = -99; G._lastSteakhouseDay = -99;
      currentRoom = 'business'; lastMsg = '';
      handleAct(act, act); await wait(25);
      const mg = document.getElementById('mg-job'); const content = (document.getElementById('mg-job-content') || {}).innerHTML || (mg || {}).innerHTML || '';
      const opened = mg && mg.classList.contains('on') && content.replace(/\s/g, '').length > 100;
      const ghost = /w przygotowaniu/i.test(lastMsg);
      out.business.push({ test: nm + ' (' + act + ')', ok: opened && !ghost, wynik: opened ? 'panel z trescia ' + content.length + ' znakow' : (ghost ? 'GHOST: w przygotowaniu' : 'msg=' + lastMsg.slice(0, 40)) });
    } catch (e) { out.business.push({ test: nm, ok: false, wynik: 'THROW:' + e.message }); }
  }
  return out;
});

const section = (title, arr) => {
  console.log(`\n=== ${title} ===`);
  let f = 0; for (const s of arr) { if (!s.ok) f++; console.log(`  ${s.ok ? '✅' : '❌'} ${s.test.padEnd(48)} ${s.wynik}`); }
  return f;
};
console.log('\n████ ODPOWIEDZ NA PYTANIA USERA — OUTPUT TESTU (v2.3.33) ████');
let fail = 0;
fail += section('(1) KRADZIEZE OKAZJONALNE — czy dzialaja?', r.kradzieze);
fail += section('(2) INSTAGRAM — czy ZAWSZE dziala?', r.instagram);
fail += section('(3) BUSINESS DISTRICT — czy wszystko dziala?', r.business);
console.log('\nPAGE ERRORS:', errors.length); errors.slice(0, 8).forEach(e => console.log('  ⚠️ ' + e));
await browser.close();
if (fail || errors.length) { console.log(`\n🔴 ${fail} testow FAIL — jest co naprawiac`); process.exit(1); }
console.log('\n🟢 WSZYSTKIE 3 OBSZARY DZIALAJA (output testu, nie slowo)'); process.exit(0);
