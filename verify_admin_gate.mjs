import { setupPage } from './_helper_runtime_template.mjs';

const { page, browser } = await setupPage();
const fails = [];
const log = (ok, name, info='') => { console.log((ok?'  ✅ ':'  ❌ ')+name.padEnd(50)+info); if(!ok) fails.push(name); };

// 0) NIE jesteśmy w trybie dev — gate ma działać niezależnie od ?dev=1 (jak w apce Electron)
const devMode = await page.evaluate(()=>({ search: location.search, dev: typeof _snowyDevMode==='function'?_snowyDevMode():'(brak)', ls: (typeof localStorage!=='undefined')?localStorage.getItem('snowy_dev'):'(brak)' }));
log(devMode.dev===false, 'NIE w trybie dev (gate niezależny od ?dev=1/localStorage)', JSON.stringify(devMode));

// reset
await page.evaluate(()=>{ try{_adminSeq='';}catch(_){} document.getElementById('admin-gate')?.remove(); const ap=document.getElementById('admin-panel'); if(ap)ap.style.display='none'; document.activeElement&&document.activeElement.blur&&document.activeElement.blur(); });

// 1) brak gate przed sekwencją
const before = await page.evaluate(()=>!!document.getElementById('admin-gate'));
log(before===false, 'przed sekwencją: brak gate');

// 2) sekwencja 'snowy' → gate
await page.keyboard.type('snowy', { delay: 40 });
await page.waitForTimeout(250);
const gate1 = await page.evaluate(()=>({ gate: !!document.getElementById('admin-gate'), panel: (document.getElementById('admin-panel')||{}).style?.display }));
log(gate1.gate===true, 'po "snowy" → gate hasłowy się pojawia');
log(gate1.panel!=='block', 'po "snowy" → panel jeszcze ZAMKNIĘTY (dopiero po haśle)');

// 3) złe hasło → panel NIE otwarty, gate trzyma + błąd
await page.fill('#admin-gate-pass', 'zlehaslo');
await page.click('#admin-gate-ok');
await page.waitForTimeout(180);
const wrong = await page.evaluate(()=>({ gate: !!document.getElementById('admin-gate'), panel: (document.getElementById('admin-panel')||{}).style?.display, err: (document.getElementById('admin-gate-err')||{}).textContent, val: (document.getElementById('admin-gate-pass')||{}).value }));
log(wrong.panel!=='block', 'złe hasło → ADMIN PANEL NIE otwarty', JSON.stringify({panel:wrong.panel}));
log(wrong.gate===true && /Nieprawid/.test(wrong.err||''), 'złe hasło → gate trzyma + komunikat błędu', JSON.stringify({err:wrong.err}));
log(wrong.val==='', 'złe hasło → pole wyczyszczone');

// 4) dobre hasło → panel otwarty, gate znika
await page.fill('#admin-gate-pass', '7snowyveganamper13');
await page.click('#admin-gate-ok');
await page.waitForTimeout(250);
const right = await page.evaluate(()=>({ gate: !!document.getElementById('admin-gate'), panel: (document.getElementById('admin-panel')||{}).style?.display }));
log(right.panel==='block', 'dobre hasło → ADMIN PANEL OTWARTY', JSON.stringify(right));
log(right.gate===false, 'dobre hasło → gate zamknięty');

// 5) sekwencja 'amper' też otwiera gate
await page.evaluate(()=>{ const ap=document.getElementById('admin-panel'); if(ap)ap.style.display='none'; try{_adminSeq='';}catch(_){} document.activeElement&&document.activeElement.blur&&document.activeElement.blur(); });
await page.keyboard.type('amper', { delay: 40 });
await page.waitForTimeout(250);
const gateAmper = await page.evaluate(()=>!!document.getElementById('admin-gate'));
log(gateAmper===true, 'sekwencja "amper" też otwiera gate');

// 6) Anuluj zamyka gate bez panelu
await page.click('#admin-gate-cancel');
await page.waitForTimeout(150);
const cancelled = await page.evaluate(()=>({ gate: !!document.getElementById('admin-gate'), panel: (document.getElementById('admin-panel')||{}).style?.display }));
log(cancelled.gate===false && cancelled.panel!=='block', 'Anuluj → gate zamknięty, panel nieotwarty');

console.log('\n'+(fails.length ? ('❌ FAIL ('+fails.length+'): '+fails.join(' | ')) : '🟢 GATE HASŁOWY ZIELONY — wszystkie asercje przeszły'));
await browser.close();
process.exit(fails.length ? 1 : 0);
