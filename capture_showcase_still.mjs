// Pełnoklatkowy still gameplayu do sekcji „Zobacz grę w akcji" (page.screenshot DZIAŁA pełnoklatkowo,
// w przeciwieństwie do recordVideo który łapie canvas w 720x720 + szare). → website/gameplay-showcase.png (1280x720).
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME = 'file://' + path.join(__dirname, 'index.html');
const DEST = path.join(__dirname, 'website', 'gameplay-showcase.png');

const tap = async (page, key, ms=120) => { await page.evaluate(k=>document.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true})), key); await page.waitForTimeout(ms); await page.evaluate(k=>document.dispatchEvent(new KeyboardEvent('keyup',{key:k,bubbles:true})), key); };

const b = await chromium.launch({ headless: true });
const pg = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await pg.goto(GAME); await pg.waitForTimeout(2000);
await pg.evaluate(()=>{ try{ window._ageConfirm&&window._ageConfirm(); }catch(e){} const g=document.getElementById('agegate'); if(g)g.style.display='none'; });
const nb = await pg.$('button:has-text("Nowa gra")'); if(nb){ await nb.click(); await pg.waitForTimeout(800); }
const zb = await pg.$('button:has-text("ZACZYNAJ"), button:has-text("Zacznij grę")'); if(zb && await zb.isVisible().catch(()=>0)){ await zb.click({timeout:2500}).catch(()=>{}); await pg.waitForTimeout(1000); }
for(let k=0;k<6;k++){ const d=await pg.evaluate(()=>{ document.getElementById('ic-skip')?.click(); document.getElementById('intro-offer')?.remove(); if(typeof G!=='undefined'){G._introductionActive=false;G._introductionSeen=true;} return !document.getElementById('ic-stage'); }); if(d)break; await pg.waitForTimeout(400); }
// money/level WYSOKO, ale fans umiarkowanie (uniknij celebracji-kamieni-milowych zasłaniających ekran)
await pg.evaluate(()=>{ try{ G.money=5e7; G.fame=420; G.level=42; G.studioOwned=true; window._unlockedDistricts=['underground','coast','business']; updateHUD&&updateHUD(); }catch(e){} });
// czysty chrom + ukryj ewentualne overlaye celebracji/achievementów
await pg.evaluate(()=>{ const s=document.createElement('style'); s.textContent='#smart-hint,#itut-box,#tutorial-pill,#tutorial-popup,#intro-offer,#msg,#room-intro-toast,#onboarding-widget,#fs-link-toast,#agegate,[id*="celebr"],[id*="milestone"],[class*="celebr"],[class*="achiev-pop"]{display:none!important;}'; document.head.appendChild(s); });
// kasyno (kolorowy parkiet „w akcji")
await pg.evaluate(()=>{ try{ changeRoom('casino',600,540); }catch(e){} });
await pg.waitForTimeout(1300);
await tap(pg,'d',900); await tap(pg,'a',700);
await pg.waitForTimeout(300);
await pg.screenshot({ path: DEST });
const box = await pg.evaluate(()=>{ const c=document.getElementById('gc'); const r=c.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height)}; });
console.log('zapisano website/gameplay-showcase.png — canvas box', JSON.stringify(box));
await b.close();
process.exit(box.w>=1200 && box.h>=680 ? 0 : 1);
