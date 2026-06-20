/**
 * audit_rooms.mjs — RUNTIME-INTERACTION AUDIT (ZASADA #0: DOWÓD, NIE SŁOWO)
 * =========================================================================
 * SĘDZIA, NIE MOJE SŁOWO. Klika KAŻDY act-handler w KAŻDYM pokoju w stanie
 * MAXED-ODBLOKOWANYM (Playwright). Wykrywa obiektywne klasy bugów:
 *   - THROW            (handleAct rzucił wyjątek / pageerror)
 *   - WPRZYGOTOWANIU   (ghost stub: „🚧 Content w przygotowaniu")
 *   - NO-OP            (martwy przycisk: zero feedbacku — brak msg, panelu,
 *                       zmiany pokoju, zmiany stanu)
 * Responsywny przycisk (panel / zmiana pokoju / jakikolwiek komunikat
 * gate/flavor) = PASS. To celowo NIE flaguje gate'ów/flavor-msg jako bug
 * (inaczej test krzyczy wilk na park_monument itp.).
 *
 * URUCHOM:  node audit_rooms.mjs        (exit 1 = są bugi, exit 0 = czysto)
 * User może odpalić SAM, żeby mnie sprawdzić bez ufania mi na słowo.
 */
import { setupPage } from './_helper_runtime_template.mjs';

const ROOM_KEYS = ['ulica','mieszkanie','mieszkanie_premium','mieszkanie_lux','merch_studio','silownia','studio','coast','business','underground','kamper','lab','plantacja','casino','striptiz_club','elevator','casino_vip','casino_lux','casino_royal'];
const SPAWN = { underground:[1200,480], coast:[720,800], business:[720,60] };

const { page, browser, errors } = await setupPage();

const res = await page.evaluate(async ({ ROOM_KEYS, SPAWN }) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ── przechwyć runtime errory i przypisz do aktualnego aktu ── */
  window.__curAct = '';
  window.__errLog = [];
  window.addEventListener('error', e => { try { window.__errLog.push({ act: window.__curAct, msg: (e.error && e.error.message) || e.message, stack: (e.error && e.error.stack || '').split('\n').slice(0, 4).join(' | ') }); } catch (_) {} });

  /* ── przechwyć WSZYSTKIE kanały feedbacku tekstowego ── */
  let lastMsg = '';
  const hook = name => { const o = window[name]; if (typeof o === 'function') { window[name] = function (t) { try { if (t != null && String(t).trim()) lastMsg = String(t); } catch (_) {} try { return o.apply(this, arguments); } catch (e) {} }; } };
  ['showMsg', 'notify', 'addNotif'].forEach(hook);

  /* ── MAXED unlocked save ── */
  G.money = 1e9; G.level = 50; G.fame = 999; G.fans = 500000; G.followers = 200000;
  if (!G.trap) G.trap = {}; G.trap.unlocked = true; G.trap.level = 15;
  G._unlockedDistricts = ['underground', 'coast', 'business'];
  G.studioOwned = true; G.energy = 100; G.stress = 100;
  G._hasHallOfFameStatue = true;
  G._undergroundGuideAck = true;
  G._districtFirstEnterShown = { underground: 1, coast: 1, business: 1 };
  if (!G.visitedRooms) G.visitedRooms = {};
  ROOM_KEYS.forEach(k => { G.visitedRooms[k] = true; });
  ['park', 'silownia', 'studio', 'casino'].forEach(k => { G.visitedRooms[k] = true; });
  if (typeof _growEnsure === 'function') { try { _growEnsure(); } catch (_) {} }

  const validRoom = k => ROOM_KEYS.includes(k) && ROOMS[k] && Array.isArray(ROOMS[k].objects);

  /* ── detektor otwartego panelu/overlay/minigry (mg-job, ov, phone, dowolny .on z treścią) ── */
  const PANEL_IDS = ['mg-job', 'mg-job-content', 'ov', 'ov-content', 'overlay', 'dyn-modal', 'phone', 'modal', 'npc-dlg', 'rest-overlay', 'pond-choice-overlay'];
  const visibleWithContent = e => {
    if (!e) return false;
    let vis = false;
    try { vis = e.classList.contains('on') || e.style.display === 'flex' || e.style.display === 'block' || (e.offsetParent !== null && getComputedStyle(e).display !== 'none'); } catch (_) {}
    const content = (e.innerHTML || '').replace(/\s/g, '').length > 20;
    return vis && content;
  };
  const panelOpen = () => {
    for (const id of PANEL_IDS) { if (visibleWithContent(document.getElementById(id))) return id; }
    /* generalizacja: dowolny widoczny overlay/modal/choice/panel/minigra z treścią
       (rest-overlay, pond-choice-overlay, *-mg itp. — wstawiane do #wrap, bez klasy .on) */
    const sel = '.on, .modal, .overlay, [id*=overlay], [id*=modal], [id*=choice], [id*=panel], [id$=-mg], [id^=mg-]';
    const m = [...document.querySelectorAll(sel)].find(x => { try { return x.offsetParent !== null && (x.innerHTML || '').replace(/\s/g, '').length > 20; } catch (_) { return false; } });
    return m ? (m.id || m.className || 'on-el') : null;
  };
  const closeAll = () => {
    try { if (typeof stopRest === 'function') stopRest(); } catch (_) {}
    try { if (typeof _restTimer !== 'undefined' && _restTimer) { clearInterval(_restTimer); _restTimer = null; } G._resting = false; } catch (_) {}
    try { if (typeof closeOverlay === 'function') closeOverlay(); } catch (_) {}
    try { if (typeof closeNPCDlg === 'function') closeNPCDlg(); } catch (_) {}
    try { if (typeof togglePhone === 'function' && document.getElementById('phone')?.classList.contains('on')) togglePhone(); } catch (_) {}
    document.querySelectorAll('.on').forEach(x => { try { x.classList.remove('on'); } catch (_) {} });
    ['rest-overlay', 'pond-choice-overlay'].forEach(id => { const e = document.getElementById(id); if (e) { try { e.remove(); } catch (_) {} } });
    ['mg-job', 'mg-job-content', 'ov-content', 'dyn-modal'].forEach(id => { const e = document.getElementById(id); if (e) { try { e.classList.remove('on'); if (/content|dyn-modal/.test(id)) e.innerHTML = ''; } catch (_) {} } });
  };

  const out = {};
  for (const room of ROOM_KEYS) {
    const r = { acts: [] };
    if (!validRoom(room)) { r.fatal = 'ROOM_MISSING_OR_EMPTY'; out[room] = r; continue; }
    const sp = SPAWN[room] || [150, 150];
    try { changeRoom(room, sp[0], sp[1]); } catch (e) { r.enterErr = e.message; }
    try { currentRoom = room; } catch (_) {}
    /* flush ewentualny fade z wejścia, wyczyść intro msg */
    try { if (typeof _roomFadePending !== 'undefined' && _roomFadePending) { changeRoom(_roomFadePending.id, _roomFadePending.wx, _roomFadePending.wy); _roomFadePending = null; } } catch (_) {}
    try { currentRoom = room; } catch (_) {}
    await wait(15);
    closeAll();

    for (const o of ROOMS[room].objects) {
      if (!o.act) continue;
      closeAll();
      /* re-max przed każdym aktem (akty mogą wydawać kasę/energię/limity) */
      G.money = 1e9; G.energy = 100; G.stress = 100;
      lastMsg = '';
      window.__curAct = room + '/' + o.act + '/' + o.id;
      const roomBefore = currentRoom;
      let st = 'ok';
      try { handleAct(o.act, o.id); } catch (e) { st = 'THROW:' + (e && e.message ? e.message : e); }
      await wait(25);
      /* startRoomFade jest async — wykryj/flush pending żeby zweryfikować docelowy pokój */
      let fadeTarget = null;
      try { if (typeof _roomFadePending !== 'undefined' && _roomFadePending) { fadeTarget = _roomFadePending.id; changeRoom(_roomFadePending.id, _roomFadePending.wx, _roomFadePending.wy); _roomFadePending = null; } } catch (_) {}
      const roomAfter = currentRoom;
      const opened = panelOpen();

      let verdict, ok;
      if (st.startsWith('THROW')) { verdict = 'THROW'; ok = false; }
      else if (/w przygotowaniu/i.test(lastMsg)) { verdict = 'WPRZYGOTOWANIU'; ok = false; }
      else if (fadeTarget && validRoom(fadeTarget)) { verdict = 'ROOM(' + fadeTarget + ')'; ok = true; }
      else if (fadeTarget && !validRoom(fadeTarget)) { verdict = 'ROOM-INVALID(' + fadeTarget + ')'; ok = false; }
      else if (roomAfter !== roomBefore && validRoom(roomAfter)) { verdict = 'ROOM(' + roomAfter + ')'; ok = true; }
      else if (roomAfter !== roomBefore && !validRoom(roomAfter)) { verdict = 'ROOM-INVALID(' + roomAfter + ')'; ok = false; }
      else if (opened) { verdict = 'PANEL(' + opened + ')'; ok = true; }
      else if (lastMsg) { verdict = 'MSG'; ok = true; } /* gate/flavor/info = responsywny */
      else { verdict = 'NO-OP'; ok = false; }

      r.acts.push({ act: o.act, id: o.id, verdict, ok, msg: (lastMsg || '').slice(0, 70), st: st.startsWith('THROW') ? st.slice(0, 90) : '' });

      /* przywróć kontekst pokoju do dalszej iteracji */
      try {
        if (typeof _roomFadePending !== 'undefined' && _roomFadePending) _roomFadePending = null;
        if (currentRoom !== room) { closeAll(); changeRoom(room, sp[0], sp[1]); currentRoom = room; }
      } catch (_) {}
      await wait(8);
    }
    out[room] = r;
  }

  /* ── FLOWS: kluczowe przeplywy poza pokojami (zgloszenia usera) ── */
  const flows = [];
  const flow = (name, ok, info) => flows.push({ name, ok, info: info || '' });
  closeAll();
  /* IG #1: render Instagrama na USZKODZONYM save (null/zle wpisy igPosts) — user „Instagram nie dziala" */
  try {
    G.igPosts = [null, {}, { caption: 'x' }, { growStage: undefined, likes: NaN }, 'zly', undefined];
    renderPhoneApp('instagram'); await wait(40);
    const html = (document.getElementById('phone') || {}).innerHTML || '';
    flow('ig_render_corrupt_save', /Instagram|PUBLIKUJ|obserw|Wrzu|filtr|Spo[lł]eczno/i.test(html), html.length + ' znakow');
  } catch (e) { flow('ig_render_corrupt_save', false, 'THROW: ' + e.message); }
  closeAll();
  /* IG #2: realny flow publikacji (idx 2 = Lifestyle, zawsze dostepne) */
  try {
    G.igPosts = []; G.energy = 100; G._igPostDay = -1; G._igPostCount = 0;
    if (typeof window._igOpenComposer === 'function') { window._igOpenComposer(2); await wait(25); }
    const before = (G.igPosts || []).length;
    if (typeof window._igPublishFromComposer === 'function') { window._igPublishFromComposer(); await wait(40); }
    flow('ig_publish_post', (G.igPosts || []).length > before, `igPosts ${before}->${(G.igPosts || []).length}`);
  } catch (e) { flow('ig_publish_post', false, 'THROW: ' + e.message); }
  closeAll();
  /* Dealer #5: zakup u dealera dziala TAKZE gdy save zgubil trapInv (user „dealer czasami nie dziala") */
  try {
    if (!G.trap) G.trap = {}; G.trap.unlocked = true; G.money = 1e9; try { currentRoom = 'underground'; } catch (_) {}
    delete G.trapInv;
    if (typeof window._kamperBuyIng === 'function') window._kamperBuyIng('traw', 1);
    flow('dealer_buy_no_trapInv', !!(G.trapInv && (G.trapInv.traw || 0) >= 1), 'traw=' + (G.trapInv && G.trapInv.traw));
  } catch (e) { flow('dealer_buy_no_trapInv', false, 'THROW: ' + e.message); }
  /* Narkobiznes DEEP: produkcja/sprzedaz/raid faktycznie zmieniaja stan (nie tylko panel) */
  try {
    if (!G.trap) G.trap = {}; G.trap.unlocked = true; G.trap.level = 15; G.trap.heat = 0; G.energy = 100; G.day = 10;
    G.trapInv = { traw: 10, krysztal: 0, prosz: 0, products: {} };
    const _r = Math.random; Math.random = () => 0.99;
    const cb = G.trapInv.products.joint || 0;
    if (typeof window._cookApply === 'function') window._cookApply('joint', 0.95);
    Math.random = _r;
    flow('narko_cook_produces', (G.trapInv.products.joint || 0) > cb, `joint ${cb}->${G.trapInv.products.joint || 0}`);
  } catch (e) { flow('narko_cook_produces', false, 'THROW: ' + e.message); }
  try {
    const _r = Math.random; Math.random = () => 0.99;
    G.trapInv.products.joint = 5; G.money = 1000; G.trap.heat = 0;
    const mb = G.money, pb = G.trapInv.products.joint;
    if (typeof window._trapSell === 'function') window._trapSell('joint');
    Math.random = _r;
    flow('narko_street_sell', G.trapInv.products.joint < pb && G.money > mb, `+${G.money - mb} zl, joint ${pb}->${G.trapInv.products.joint}`);
  } catch (e) { flow('narko_street_sell', false, 'THROW: ' + e.message); }
  try {
    const _r = Math.random; Math.random = () => 0.0;
    if (typeof _trapEvidenceEnsure === 'function') _trapEvidenceEnsure();
    G.trap.evidence = { physical: 50, financial: 0, digital: 0, witness: 0, logistics: 0, media: 0 };
    G.trap.heat = 100; G.trap.upgrades = G.trap.upgrades || {}; lastMsg = '';
    if (typeof window._trapRaidCheck === 'function') window._trapRaidCheck();
    Math.random = _r;
    flow('narko_raid_fires', /RAID/i.test(lastMsg), 'msg=' + (lastMsg || '').slice(0, 40));
  } catch (e) { flow('narko_raid_fires', false, 'THROW: ' + e.message); }
  closeAll();
  /* Theft #4: roll odpala z autem w underground (wymuszony RNG) */
  try {
    const _rnd = Math.random; Math.random = () => 0.01;
    G.car = { name: 'AuditCar', price: 5000, condition: 100 }; G._carParkedAt = { room: 'underground' }; G._inCar = false; G._ugTheftDay = -1; G.day = 7;
    try { currentRoom = 'underground'; } catch (_) {}
    const tr = (typeof window._undergroundTheftRoll === 'function') ? window._undergroundTheftRoll() : false;
    Math.random = _rnd;
    /* v2.3.44 K-3: _undergroundTheftRoll zwraca teraz 7 typów wandalizmu (scratch/window/mirrors/tires/tag/interior/wreck) + frozen/false. */
    flow('theft_roll_fires', ['scratch','window','mirrors','tires','tag','interior','wreck','frozen','loot','vandal','parts','loot-empty'].includes(tr), 'wynik=' + tr);
  } catch (e) { flow('theft_roll_fires', false, 'THROW: ' + e.message); }
  closeAll();
  /* Phone apps: render KAZDEJ apki na nowej grze I na uszkodzonym save (analog IG crash) */
  try {
    const APPS = ['spotify', 'soundcloud', 'tidal', 'youtube', 'instagram', 'twitter', 'luxury', 'bank', 'parabank', 'bills', 'atelier', 'contracts', 'label', 'merch', 'trap', 'crypto', 'metals', 'safe', 'olx', 'gigs', 'dog'];
    const phLen = () => { const e = document.getElementById('ph-content'); return e ? (e.innerHTML || '').replace(/\s/g, '').length : 0; };
    // nowa gra (maxed)
    let ngThrows = [];
    for (const app of APPS) { try { renderPhoneApp(app); if (phLen() < 15) ngThrows.push(app + '(pusty)'); } catch (e) { ngThrows.push(app + ':' + e.message.slice(0, 30)); } }
    flow('phoneapps_newgame', ngThrows.length === 0, ngThrows.join(', ') || 'wszystkie 21 ok');
    // uszkodzony save
    G.studioTracks = [null, {}, { name: 'x' }]; G.igPosts = [null, 'zly'];
    G.label = { type: 'indie', name: 'L', artists: [null, {}], albums: [null] };
    G.bank = { loan: 0, investments: [null, {}, { amount: 100, returnAmount: 200, returnDay: 5 }] };
    G.crypto = { holdings: { btc: null }, prices: { btc: 100 }, history: [null] };
    G.safes = { traphouse: null }; G.trapInv = { products: { joint: null } };
    let cThrows = [];
    for (const app of APPS) { try { renderPhoneApp(app); if (phLen() < 15) cThrows.push(app + '(pusty)'); } catch (e) { cThrows.push(app + ':' + e.message.slice(0, 30)); } }
    flow('phoneapps_corrupt_save', cThrows.length === 0, cThrows.join(', ') || 'wszystkie 21 ok');
  } catch (e) { flow('phoneapps_sweep', false, 'THROW: ' + e.message); }
  closeAll();
  /* Panele telefonu + inventory na uszkodzonym save (null wpisy w listach gracza) — po sanitacji */
  try {
    const PANELS = ['renderPhoneMuzyka', 'renderPhoneStats', 'renderPhoneNotifs', 'renderPhonePassive', 'renderPhoneQuest', 'renderPhoneSMS', 'openInventory', 'renderWardrobeChange'];
    G.inventory = [null, { type: 'food', id: 'x', qty: 1 }];
    G.studioTracks = [null, { name: 't', streams: 5 }]; G.igPosts = [null];
    G.notifications = [null, { time: 1 }]; G.workers = [null, { role: 'gardener' }]; G.crew = [null, { name: 'c' }];
    G.smsLog = [null]; G.stories = [null]; G.beefs = [null]; G.leads = [null];
    if (typeof window._sanitizePlayerLists === 'function') window._sanitizePlayerLists();
    let pThrows = [];
    for (const fn of PANELS) { try { if (typeof window[fn] === 'function') window[fn](); } catch (e) { pThrows.push(fn + ':' + e.message.slice(0, 25)); } }
    flow('panels_corrupt_save', pThrows.length === 0, pThrows.join(', ') || 'wszystkie panele ok');
  } catch (e) { flow('panels_corrupt_save', false, 'THROW: ' + e.message); }
  closeAll();
  /* Community feed IG + pozostale zero-arg panele na uszkodzonym save */
  try {
    G._igCommunityFeed = [null, { id: 'x', nick: 'a', bg_choice: 'b' }];
    G.beefs = [null, { rival: 'x' }]; G.stories = [null, { id: 's' }];
    if (typeof window._sanitizePlayerLists === 'function') window._sanitizePlayerLists();
    let p2 = [];
    const T2 = [['_igRenderCommunity', () => window._igRenderCommunity()], ['renderPhoneChart', () => renderPhoneChart()], ['renderPhoneStories', () => renderPhoneStories()], ['renderPhoneBeef', () => renderPhoneBeef()], ['renderPhoneFolder', () => renderPhoneFolder('muzyka')]];
    for (const [n, f] of T2) { try { f(); } catch (e) { p2.push(n + ':' + e.message.slice(0, 25)); } }
    flow('community_panels2_corrupt', p2.length === 0, p2.join(', ') || 'wszystkie ok');
  } catch (e) { flow('community_panels2_corrupt', false, 'THROW: ' + e.message); }
  closeAll();
  /* INTERAKCJE WEWNATRZ paneli — asercja ZMIANY STANU (nie tylko render).
     RESET stanu skazonego przez wczesniejsze flow corrupt-save (zeby nie zatruly interakcji). */
  try {
    ['inventory', 'studioTracks', 'igPosts', 'notifications', 'notifs', 'workers', 'crew', 'smsLog', 'stories', 'beefs', 'leads'].forEach(k => { if (!Array.isArray(G[k]) || G[k].some(x => !x || typeof x !== 'object')) G[k] = []; });
    G._igCommunityFeed = []; G.dailyQuest = null; G.micsOwned = (G.micsOwned || []).filter(x => x && typeof x === 'object');
  } catch (_) {}
  try {
    if (typeof generateDailyQuest === 'function' && !G.dailyQuest) generateDailyQuest();
    G.dailyQuest = G.dailyQuest || {}; G.dailyQuest.completed = true; G.dailyQuest.claimed = false;
    G.dailyQuest.reward = 5000; G.dailyQuest.xp = 50; G.dailyQuest.day = G.day; G.dailyQuest.progress = G.dailyQuest.count || 1;
    const mB = G.money;
    if (typeof claimQuestReward === 'function') claimQuestReward();
    flow('quest_claim_pays', G.money > mB && G.dailyQuest.claimed === true, `kasa +${G.money - mB}, claimed=${G.dailyQuest.claimed}`);
  } catch (e) { flow('quest_claim_pays', false, 'THROW: ' + e.message); }
  closeAll();
  try {
    closeAll();
    try { currentRoom = 'casino'; } catch (_) {}
    /* reset WSZYSTKICH flag VIP (room-sweep klikal sloty w casino_vip/lux/royal i je ustawil)
       -> parter (MIN_BET 10), inaczej bet clampuje sie w gore i spin wychodzi bez potracenia */
    G._casinoVip = false; G._casinoUltraVip = false; G._casinoRoyalVip = false;
    G.casinoChips = 1000000; G._slotsCooldownUntil = 0; G._lastHazardFreeSpinDay = G.day;
    if (typeof window.openSlots === 'function') { window.openSlots(); await wait(80); }
    const inp = document.getElementById('slots-bet');
    let betSet = false;
    if (inp) { inp.value = '100'; betSet = true; } /* parter: 10-1000, 100 w zakresie */
    const chipsB = G.casinoChips;
    if (typeof window._slotsSpin === 'function') window._slotsSpin();
    await wait(2400);
    /* slots dziala = bet pobrany (chips spadly) LUB wynik zaksiegowany (chips != baza) */
    flow('slots_spin_changes_state', betSet && G.casinoChips !== chipsB, `bet-input=${betSet}, chips ${chipsB}->${G.casinoChips}`);
  } catch (e) { flow('slots_spin_changes_state', false, 'THROW: ' + e.message); }
  closeAll();
  /* shop buy — gear ustawiony + owned rosnie (kasa szumi od passive income, nie sprawdzam) */
  try {
    if (typeof openShopOverlay === 'function') { openShopOverlay('muzyczny'); await wait(30); }
    const ownB = (G.micsOwned || []).length;
    if (typeof window.buyMic === 'function') window.buyMic('AudytFlowMic', 'usb', 60, 500);
    flow('shop_buy_mic', !!(G.mic && G.mic.name === 'AudytFlowMic' && (G.micsOwned || []).length > ownB), `mic=${G.mic && G.mic.name}, owned ${ownB}->${(G.micsOwned || []).length}`);
  } catch (e) { flow('shop_buy_mic', false, 'THROW: ' + e.message); }
  closeAll();
  /* array-guard: hot-path funkcje (earn/notify/checkAchievements) odporne na null wpisy w listach gracza */
  try {
    const KEYS = ['friends', 'beefHistory', 'sponsorHistory', 'sponsorMessages', 'activeSponsors', 'sponsorOffers', '_discoveredRecipes', 'fridgeItems', 'micsOwned', 'camerasOwned', 'midiCtrlsOwned', 'headphonesOwned', 'audioInterfacesOwned', 'studioTracks', 'inventory', 'workers', 'crew', 'notifications', 'notifs', 'smsLog'];
    KEYS.forEach(k => { G[k] = [null, {}]; });
    G.label = { type: 'indie', artists: [null, {}], albums: [null] }; G.trap.dealers = [null];
    if (typeof window._sanitizePlayerLists === 'function') window._sanitizePlayerLists();
    let hp = [];
    for (const [n, f] of [['checkAchievements', () => checkAchievements()], ['earn', () => earn(100, false)], ['addNotif', () => addNotif('audit:x')], ['notify', () => notify('audit:y')], ['updateHUD', () => updateHUD()]]) { try { f(); } catch (e) { hp.push(n + ':' + e.message.slice(0, 25)); } }
    flow('arrayguard_hotpaths', hp.length === 0, hp.join(', ') || 'earn/notify/achiev/hud odporne');
  } catch (e) { flow('arrayguard_hotpaths', false, 'THROW: ' + e.message); }
  closeAll();
  /* tick/hint-cond: nextPeriod + wszystkie SMART_HINTS conds odporne na null wpisy */
  try {
    ['friends', 'beefHistory', 'studioTracks', 'inventory', 'workers', 'crew', 'notifications', 'micsOwned', 'camerasOwned'].forEach(k => { G[k] = [null, {}]; });
    G.label = { type: 'indie', artists: [null, {}], albums: [null] };
    let te = [];
    try { if (typeof nextPeriod === 'function') nextPeriod(); } catch (e) { te.push('nextPeriod:' + e.message.slice(0, 20)); }
    if (typeof SMART_HINTS !== 'undefined' && Array.isArray(SMART_HINTS)) { for (let i = 0; i < SMART_HINTS.length; i++) { const h = SMART_HINTS[i]; if (h && typeof h.cond === 'function') { try { h.cond(); } catch (e) { te.push('hint[' + i + ']:' + e.message.slice(0, 18)); break; } } } }
    flow('tick_hints_guard', te.length === 0, te.join(', ') || 'nextPeriod + ' + (SMART_HINTS ? SMART_HINTS.length : 0) + ' hints odporne');
  } catch (e) { flow('tick_hints_guard', false, 'THROW: ' + e.message); }
  closeAll();
  /* deep-audit: ekonomia przy ekstremalnych wartosciach NIE produkuje NaN/Infinity */
  try {
    G.money = 1e14; G.fame = 999; G.fans = 2e9; G.followers = 1e9; G.xp = 1e7; G.streetRep = 1e6; G.drip = 200;
    let nan = [];
    for (let i = 0; i < 8; i++) { try { if (typeof nextPeriod === 'function') nextPeriod(); } catch (_) { } }
    try { if (typeof earn === 'function') earn(1e12, false); } catch (_) { }
    for (const k of ['money', 'fans', 'followers', 'fame', 'xp', 'streetRep', 'drip']) { const v = G[k]; if (typeof v === 'number' && !isFinite(v)) nan.push(k + '=' + v); }
    flow('economy_no_nan_infinity', nan.length === 0, nan.join(', ') || 'wszystkie staty skonczone');
  } catch (e) { flow('economy_no_nan_infinity', false, 'THROW: ' + e.message); }
  closeAll();
  /* deep-audit: wszystkie RANDOM_EVENTS spelniajace cond odpalaja sie bez crasha */
  try {
    G.money = 1e9; G.fame = 999; G.fans = 500000; G.followers = 500000; G.energy = 100; G.stress = 100; G.health = 100;
    if (!G.trap) G.trap = {}; G.trap.unlocked = true; G.trap.level = 15; G.trap.heat = 50; G.trap.dealers = [{ name: 'D', loyalty: 30, resentment: 60, leverage: 50 }];
    G.trapInv = { traw: 10, krysztal: 10, prosz: 10, products: { joint: 5, shard: 5 } };
    G.trader = { unlocked: true, level: 5 }; G.crypto = { holdings: { bitcoin: 2 }, prices: { bitcoin: 50000 } };
    G.dog = { owned: true, slodkosc: 90, name: 'Rex' }; G.car = { name: 'T', price: 5000, condition: 100 }; G._carParkedAt = { room: 'underground' }; G._coastVibeDay = 5;
    let ev = []; let fired = 0;
    if (typeof RANDOM_EVENTS !== 'undefined' && Array.isArray(RANDOM_EVENTS)) {
      for (let i = 0; i < RANDOM_EVENTS.length; i++) { const e = RANDOM_EVENTS[i]; if (!e || typeof e.fn !== 'function') continue; let p = true; if (typeof e.cond === 'function') { try { p = !!e.cond(); } catch (_) { p = false; } } if (!p) continue; fired++; try { e.fn(); } catch (er) { ev.push((e.name || i) + ':' + er.message.slice(0, 22)); } }
    }
    flow('random_events_fire', ev.length === 0, ev.join(', ') || fired + ' eventow odpalonych bez crasha');
  } catch (e) { flow('random_events_fire', false, 'THROW: ' + e.message); }
  closeAll();
  /* deep-audit: system przedmiotow — equip dostarcza bonus, consumable aplikuje efekt (anty-ghost) */
  try {
    if (typeof invInit === 'function') invInit();
    G.equipped = G.equipped || {};
    G.inventory.push({ id: 'audit_equip', type: 'item', kind: 'equip', slot: 'gadget', name: 'AuditGadget', emoji: '🔧', qty: 1, bonus: { job: 0.12 } });
    const jb = getItemBonus('job');
    if (typeof window.invEquip === 'function') window.invEquip('audit_equip');
    const equipOk = getItemBonus('job') > jb && !!(G.equipped.gadget && G.equipped.gadget.name === 'AuditGadget');
    G.energy = 30; G.inventory.push({ id: 'audit_cons', type: 'item', kind: 'consumable', name: 'AuditDrink', emoji: '🥤', qty: 1, effect: { energy: 25 } });
    if (typeof window.invUse === 'function') window.invUse('audit_cons');
    flow('item_equip_consumable', equipOk && G.energy > 30, `equip-bonus=${equipOk}, energy->${Math.round(G.energy)}`);
  } catch (e) { flow('item_equip_consumable', false, 'THROW: ' + e.message); }
  closeAll();
  /* deep-audit: wszystkie dialogi NPC otwieraja sie bez crasha */
  try {
    const NPCS = ['audio', 'barman', 'booking', 'casino_promo', 'crew', 'croupier', 'dj', 'fan', 'harnold', 'manager', 'producer', 'promoter', 'quest', 'vendor', 'vip_host'];
    let nb = [];
    for (const n of NPCS) { try { if (typeof closeNPCDlg === 'function') closeNPCDlg(); } catch (_) { } await wait(5); try { if (typeof openNPCDialogue === 'function') openNPCDialogue(n); } catch (e) { nb.push(n + ':' + e.message.slice(0, 18)); } }
    try { if (typeof closeNPCDlg === 'function') closeNPCDlg(); } catch (_) { }
    flow('npc_dialogues_open', nb.length === 0, nb.join(', ') || NPCS.length + ' dialogow NPC bez crasha');
  } catch (e) { flow('npc_dialogues_open', false, 'THROW: ' + e.message); }
  closeAll();
  /* substancja — _doUseSubstance aplikuje efekt (addiction) */
  try {
    G.addictions = G.addictions || { weed: 0, meth: 0, mushrooms: 0, cocaine: 0 };
    const addB = G.addictions.weed || 0;
    if (typeof window._doUseSubstance === 'function') window._doUseSubstance('weed');
    await wait(20);
    flow('substance_use_effect', (G.addictions.weed || 0) > addB, `weed-add ${addB}->${G.addictions.weed}`);
  } catch (e) { flow('substance_use_effect', false, 'THROW: ' + e.message); }
  closeAll();

  out.__flows = flows;
  out.__errLog = window.__errLog;
  return out;
}, { ROOM_KEYS, SPAWN });

const FLOWS = res.__flows || []; delete res.__flows;

if (res.__errLog && res.__errLog.length) {
  console.log('\n🩻 RUNTIME ERRORY (window.onerror, przypisane do aktu):');
  res.__errLog.forEach(e => console.log(`   ⚠️  [${e.act}] ${e.msg}\n        ${e.stack || ''}`));
}
delete res.__errLog;

/* ── RAPORT ── */
let totalActs = 0, totalFails = 0;
const fails = [];
for (const room of ROOM_KEYS) {
  const r = res[room];
  if (!r) { console.log(`\n=== ${room} === (BRAK WYNIKU)`); totalFails++; fails.push({ room, act: '(room)', verdict: 'NO_RESULT' }); continue; }
  if (r.fatal) { console.log(`\n=== ${room} === FATAL: ${r.fatal}`); totalFails++; fails.push({ room, act: '(room)', verdict: r.fatal }); continue; }
  const bad = r.acts.filter(a => !a.ok);
  console.log(`\n=== ${room} === (${r.acts.length} przycisków, ${bad.length} FAIL)${r.enterErr ? '  ENTER-ERR:' + r.enterErr : ''}`);
  for (const a of r.acts) {
    totalActs++;
    if (!a.ok) { totalFails++; fails.push({ room, act: a.act, id: a.id, verdict: a.verdict, msg: a.msg, st: a.st }); console.log(`  ❌ ${a.verdict.padEnd(16)} ${a.act}  ${a.id}  ${a.st || a.msg}`); }
  }
}

console.log(`\n=== FLOWS (przeplywy poza pokojami — zgloszenia usera) ===`);
let flowFails = 0;
for (const f of FLOWS) {
  const ok = f.ok; if (!ok) { flowFails++; fails.push({ room: 'FLOW', act: f.name, verdict: 'FLOW-FAIL', msg: f.info }); }
  console.log(`  ${ok ? '✅' : '❌'} ${f.name.padEnd(26)} ${f.info}`);
}

console.log(`\n${'═'.repeat(60)}`);
console.log(`PAGE ERRORS (pageerror): ${errors.length}`);
errors.slice(0, 15).forEach(e => console.log('  ⚠️  ' + e));
console.log(`PRZECISKÓW przeklikanych: ${totalActs}`);
console.log(`FAILów przyciskow (THROW / w przygotowaniu / NO-OP / room-invalid): ${totalFails}`);
console.log(`FAILów flows: ${flowFails}`);
totalFails += flowFails;

await browser.close();

if (totalFails > 0 || errors.length > 0) {
  console.log('\n🔴 AUDIT CZERWONY — są bugi do naprawy:');
  fails.forEach(f => console.log(`   • [${f.room}] ${f.act} (${f.id || ''}) → ${f.verdict} ${f.st || f.msg || ''}`));
  process.exit(1);
} else {
  console.log('\n🟢 AUDIT ZIELONY — wszystkie przyciski w każdym pokoju odpowiadają (panel/pokój/komunikat), zero THROW/przygotowaniu/NO-OP.');
  process.exit(0);
}
