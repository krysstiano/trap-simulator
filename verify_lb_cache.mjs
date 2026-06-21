import { setupPage } from './_helper_runtime_template.mjs';

const { page, browser } = await setupPage();
const fails = [];
const log = (ok, name, info='') => { console.log((ok?'  ✅ ':'  ❌ ')+name.padEnd(52)+info); if(!ok) fails.push(name); };

const r = await page.evaluate(async () => {
  // policz wywolania sieciowe per tabela, podstaw fetch
  const calls = {};
  const realFetch = window.fetch;
  window.fetch = async (url, opts) => {
    const u = String(url);
    const table = u.split('/rest/v1/')[1]?.split('?')[0]?.split('/')[0] || u;
    calls[table] = (calls[table]||0)+1;
    const isMut = !!(opts && (opts.body || (opts.method && opts.method!=='GET')));
    return { ok:true, status: isMut?204:200, text: async()=> isMut ? '' : JSON.stringify([{id:1,player_nick:'x'}]) };
  };
  const out = {};
  // 1) dwa identyczne GET na cache'owanej tabeli -> 1 wywolanie sieciowe
  await _lbFetch('ig_photos?order=created_at.desc&limit=50');
  await _lbFetch('ig_photos?order=created_at.desc&limit=50');
  out.igAfterTwoGets = calls['ig_photos']||0;
  // 2) GET na NIE-cache'owanej tabeli (nick_claims) -> 2 wywolania
  await _lbFetch('nick_claims?nick_lower=eq.abc');
  await _lbFetch('nick_claims?nick_lower=eq.abc');
  out.nickAfterTwoGets = calls['nick_claims']||0;
  // 3) zapis do ig_photos -> bust -> kolejny GET znowu siec
  await _lbFetch('ig_photos', { method:'POST', body: JSON.stringify({caption:'t'}) });
  await _lbFetch('ig_photos?order=created_at.desc&limit=50');
  out.igAfterMutAndGet = calls['ig_photos']||0; // 1(get) +1(post) +1(get po bust) = 3
  // 4) rozne sciezki tej samej tabeli -> osobne wpisy cache
  await _lbFetch('leaderboard?category=eq.money&limit=20');
  await _lbFetch('leaderboard?category=eq.fans&limit=20');
  await _lbFetch('leaderboard?category=eq.money&limit=20'); // z cache
  out.lbDistinct = calls['leaderboard']||0; // 2 (money,fans) — trzeci z cache
  window.fetch = realFetch;
  return out;
});

log(r.igAfterTwoGets===1, 'ig_photos: 2 identyczne GET → 1 wywołanie sieciowe (cache)', JSON.stringify(r.igAfterTwoGets));
log(r.nickAfterTwoGets===2, 'nick_claims: 2 GET → 2 wywołania (NIE cache, korektność)', JSON.stringify(r.nickAfterTwoGets));
log(r.igAfterMutAndGet===3, 'zapis ig_photos bustuje cache → kolejny GET znów sieć', JSON.stringify(r.igAfterMutAndGet));
log(r.lbDistinct===2, 'leaderboard: różne ścieżki osobno, powtórzona z cache', JSON.stringify(r.lbDistinct));

console.log('\n'+(fails.length ? ('❌ FAIL: '+fails.join(' | ')) : '🟢 CACHE LB ZIELONY'));
await browser.close();
process.exit(fails.length ? 1 : 0);
