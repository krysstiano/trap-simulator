import { setupPage } from './_helper_runtime_template.mjs';

// Świeża NOWA gra (setupPage robi "Nowa gra" + skip intro). Sprawdzamy zdrowie pierwszego uruchomienia.
const { page, browser } = await setupPage();
const fails = [];
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const log = (ok, name, info='') => { console.log((ok?'  ✅ ':'  ❌ ')+name.padEnd(50)+info); if(!ok) fails.push(name); };

// 1) gra wystartowała: G istnieje, podstawowe staty skończone
const core = await page.evaluate(()=>{
  if(typeof G==='undefined') return {ok:false};
  const fin=v=>typeof v==='number'&&isFinite(v);
  return { ok:true, money:G.money, energy:G.energy, health:G.health, day:G.day,
    finite: fin(G.money)&&fin(G.energy)&&fin(G.health)&&fin(G.hunger), level:G.level };
});
log(core.ok, 'nowa gra wystartowała (G istnieje)');
log(core.finite, 'HUD: kluczowe staty to skończone liczby', JSON.stringify({money:core.money,energy:core.energy,day:core.day,level:core.level}));

// 2) gracz ma KIERUNEK na start: tutorial/onboarding/quest scaffolding obecne
const guidance = await page.evaluate(()=>({
  hasTutorialFn: typeof window._startInteractiveTutorial==='function' || typeof restartTutorial==='function',
  introSystem: ('_introductionSeen' in G) || ('_itut' in G) || typeof window.showLeaderboardOnboarding==='function',
  questSystem: typeof window.QUEST_POOL!=='undefined' || typeof rollDailyQuest==='function' || ('dailyQuest' in G),
}));
log(guidance.hasTutorialFn, 'system tutorialu dostępny');
log(guidance.questSystem, 'system zleceń/celów dostępny (kierunek dla gracza)');

// 3) ruch gracza działa (symuluj klawisz, pozycja się zmienia)
const moved = await page.evaluate(async ()=>{
  if(typeof P==='undefined') return {ok:false,reason:'brak P'};
  const x0=P.wx, y0=P.wy;
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'d'}));
  await new Promise(r=>setTimeout(r,500));
  document.dispatchEvent(new KeyboardEvent('keyup',{key:'d'}));
  return { ok:(P.wx!==x0||P.wy!==y0), dx:Math.round(P.wx-x0) };
});
log(moved.ok, 'ruch gracza działa (WASD)', JSON.stringify(moved.dx??moved.reason));

// 4) telefon otwiera się (kluczowy hub UI dla nowego gracza)
const phone = await page.evaluate(async ()=>{
  if(typeof togglePhone!=='function') return {ok:false};
  togglePhone(); await new Promise(r=>setTimeout(r,300));
  const open = typeof phoneOpen==='function' ? phoneOpen() : !!document.getElementById('phone-overlay');
  const content = (document.getElementById('ph-content')||{}).innerHTML||'';
  if(open) togglePhone();
  return { ok:open, hasContent: content.length>50 };
});
log(phone.ok, 'telefon otwiera się (hub UI)');

// 5) brak page-errors w trakcie pierwszego uruchomienia
await page.waitForTimeout(500);
log(errors.length===0, 'zero page-errors na świeżej grze', errors.slice(0,2).join(' | '));

console.log('\n'+(fails.length ? ('❌ FAIL: '+fails.join(' | ')) : '🟢 ONBOARDING SMOKE ZIELONY (no-crash + scaffolding + ruch/telefon/HUD)'));
console.log('   (UWAGA: smoke = brak crashy i obecność systemów; ocena UX 5 min + test instalacji na czystej maszynie = po stronie usera)');
await browser.close();
process.exit(fails.length ? 1 : 0);
