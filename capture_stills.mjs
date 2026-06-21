// Pełnoklatkowe stille gameplayu (page.screenshot DZIAŁA pełnoklatkowo; recordVideo NIE — łapie canvas w
// pod-regionie + szare wypełnienie w headless). Daje użyteczne obrazy marketingowe (itch/social/store).
// → trailer_raw/still_*.png (1280x720). ZASADA #0: sprawdza box canvasu = pełne 1280x720.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'trailer_raw');
const GAME = 'file://' + path.join(__dirname, 'index.html');
const tap = async (p,k,ms=120)=>{await p.evaluate(x=>document.dispatchEvent(new KeyboardEvent('keydown',{key:x,bubbles:true})),k);await p.waitForTimeout(ms);await p.evaluate(x=>document.dispatchEvent(new KeyboardEvent('keyup',{key:x,bubbles:true})),k);};
const hold = tap;

const b = await chromium.launch({ headless: true });
const pg = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await pg.goto(GAME); await pg.waitForTimeout(2000);
await pg.evaluate(()=>{ try{ window._ageConfirm&&window._ageConfirm(); }catch(e){} const g=document.getElementById('agegate'); if(g)g.style.display='none'; });
const nb = await pg.$('button:has-text("Nowa gra")'); if(nb){ await nb.click(); await pg.waitForTimeout(800); }
const zb = await pg.$('button:has-text("ZACZYNAJ"), button:has-text("Zacznij grę")'); if(zb && await zb.isVisible().catch(()=>0)){ await zb.click({timeout:2500}).catch(()=>{}); await pg.waitForTimeout(1000); }
for(let k=0;k<6;k++){ const d=await pg.evaluate(()=>{ document.getElementById('ic-skip')?.click(); document.getElementById('intro-offer')?.remove(); if(typeof G!=='undefined'){G._introductionActive=false;G._introductionSeen=true;} return !document.getElementById('ic-stage'); }); if(d)break; await pg.waitForTimeout(400); }
await pg.evaluate(()=>{ try{ G.money=5e7; G.fame=420; G.level=42; G.studioOwned=true; G.timeOfDay=12; window._unlockedDistricts=['underground','coast','business']; updateHUD&&updateHUD(); }catch(e){} });
await pg.evaluate(()=>{ const s=document.createElement('style'); s.textContent='#smart-hint,#itut-box,#tutorial-pill,#tutorial-popup,#intro-offer,#msg,#room-intro-toast,#onboarding-widget,#fs-link-toast,#agegate,[id*="celebr"],[class*="celebr"]{display:none!important;}'; document.head.appendChild(s); });

const shots = [];
async function shot(name, setup){ await setup(); await pg.waitForTimeout(700); const box=await pg.evaluate(()=>{const c=document.getElementById('gc');const r=c.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height)};}); const f=path.join(OUT,'still_'+name+'.png'); await pg.screenshot({path:f}); const ok=box.w>=1200&&box.h>=680; shots.push({name,ok,box}); console.log(`  ${ok?'✅':'❌'} still_${name}.png — canvas ${box.w}x${box.h}`); }

await shot('ulica',     async()=>{ await hold(pg,'d',900); });
await shot('studio',    async()=>{ await pg.evaluate(()=>{try{changeRoom('studio',200,300);}catch(e){}}); await pg.waitForTimeout(900); });
await shot('kasyno',    async()=>{ await pg.evaluate(()=>{try{changeRoom('casino',600,540);}catch(e){}}); await pg.waitForTimeout(900); });
await shot('koncert',   async()=>{ await pg.evaluate(()=>{try{startConcertMG('Arena Główna',0,0,15000,30000);}catch(e){}}); await pg.waitForTimeout(1400); for(let i=0;i<6;i++){await tap(pg,['a','s','d','f'][i%4],80);await pg.waitForTimeout(260);} });
await shot('apartament',async()=>{ await pg.evaluate(()=>{try{changeRoom('mieszkanie',618,235);}catch(e){}}); await pg.waitForTimeout(900); });

await b.close();
const allOk = shots.every(s=>s.ok);
console.log('\nFolder: '+OUT);
console.log(allOk?'✅ 5 pełnoklatkowych stilli (1280x720)':'❌ któryś still nie wypełnia kadru');
process.exit(allOk?0:1);
