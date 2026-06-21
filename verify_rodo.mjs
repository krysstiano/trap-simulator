import { setupPage } from './_helper_runtime_template.mjs';

const { page, browser } = await setupPage();
const fails = [];
const log = (ok, name, info='') => { console.log((ok?'  ✅ ':'  ❌ ')+name.padEnd(54)+info); if(!ok) fails.push(name); };

// 1) funkcje istnieją
const exist = await page.evaluate(()=>({ priv: typeof window._showPrivacyInfo==='function', del: typeof window._deleteMyData==='function' }));
log(exist.priv && exist.del, 'funkcje _showPrivacyInfo + _deleteMyData istnieją', JSON.stringify(exist));

// 2) modal prywatności
const priv = await page.evaluate(()=>{ window._showPrivacyInfo(); const m=document.getElementById('privacy-modal'); const t=m?m.innerText:''; return { open:!!m, hasLink:/prywatnosc\.html/.test(t), hasRodo:/Usuń moje dane/.test(t) }; });
log(priv.open && priv.hasLink && priv.hasRodo, 'modal prywatności: otwiera się + link + wzmianka RODO', JSON.stringify(priv));
await page.evaluate(()=>document.getElementById('privacy-modal')?.remove());

// 3) RODO sukces: mock fetch OK → woła rpc/delete_my_data z p_uuid, czyści nick
const okCase = await page.evaluate(async ()=>{
  const real=window.fetch; let captured=null;
  window.fetch=async(url,opts)=>{ captured={url:String(url),body:opts&&opts.body}; return {ok:true,status:204,text:async()=>''}; };
  G.playerUUID='test-uuid-12345678'; G.globalNick='TestNick'; G.leaderboardOptIn=true;
  window._deleteMyData();
  await new Promise(r=>setTimeout(r,50));
  document.getElementById('rodo-confirm').click();
  await new Promise(r=>setTimeout(r,200));
  window.fetch=real;
  return { calledRpc:/rpc\/delete_my_data/.test(captured?.url||''), bodyHasUuid:/test-uuid-12345678/.test(captured?.body||''), nickCleared:G.globalNick==='', optOff:G.leaderboardOptIn===false, modalGone:!document.getElementById('rodo-modal') };
});
log(okCase.calledRpc, 'RODO: woła endpoint rpc/delete_my_data', JSON.stringify(okCase.calledRpc));
log(okCase.bodyHasUuid, 'RODO: body zawiera p_uuid gracza');
log(okCase.nickCleared && okCase.optOff, 'RODO sukces: nick wyczyszczony + opt-out');
log(okCase.modalGone, 'RODO sukces: modal zamknięty');

// 4) RODO błąd: mock fetch !ok → nick NIE wyczyszczony, status błędu
const errCase = await page.evaluate(async ()=>{
  const real=window.fetch;
  window.fetch=async()=>({ok:false,status:404,text:async()=>'not found'});
  G.playerUUID='test-uuid-12345678'; G.globalNick='KeepMe'; G.leaderboardOptIn=true;
  window._deleteMyData();
  await new Promise(r=>setTimeout(r,50));
  document.getElementById('rodo-confirm').click();
  await new Promise(r=>setTimeout(r,200));
  const st=(document.getElementById('rodo-status')||{}).textContent||'';
  window.fetch=real;
  const res={ nickKept:G.globalNick==='KeepMe', errShown:/Nie udało/.test(st) };
  document.getElementById('rodo-modal')?.remove();
  return res;
});
log(errCase.nickKept, 'RODO błąd: nick NIE wyczyszczony (brak fałszywego sukcesu)');
log(errCase.errShown, 'RODO błąd: pokazany komunikat błędu');

console.log('\n'+(fails.length ? ('❌ FAIL: '+fails.join(' | ')) : '🟢 RODO/PRYWATNOŚĆ ZIELONE'));
await browser.close();
process.exit(fails.length ? 1 : 0);
