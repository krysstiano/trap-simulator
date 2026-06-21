// Auto-nagranie surowego materiału do trailera (Playwright recordVideo).
// Produkuje .webm w ./trailer_raw/ + log timecodów scen. ZASADA #0: na końcu sprawdza rozmiar pliku.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'trailer_raw');
fs.mkdirSync(OUT, { recursive: true });
const VW = { width: 1280, height: 720 };
const GAME = 'file://' + path.join(__dirname, 'index.html');

const hold = async (page, key, ms) => { await page.evaluate(k=>document.dispatchEvent(new KeyboardEvent('keydown',{key:k})), key); await page.waitForTimeout(ms); await page.evaluate(k=>document.dispatchEvent(new KeyboardEvent('keyup',{key:k})), key); };

async function prep(page, {skipIntro=true}={}) {
  await page.goto(GAME); await page.waitForTimeout(2000);
  await page.evaluate(()=>{ try{ if(typeof window._ageConfirm==='function') window._ageConfirm(); }catch(e){} const g=document.getElementById('agegate'); if(g)g.style.display='none'; });
  await page.waitForTimeout(150);
  const nb = await page.$('button:has-text("Nowa gra")'); if(nb){ await nb.click(); await page.waitForTimeout(800); }
  const zb = await page.$('button:has-text("ZACZYNAJ"), button:has-text("Zacznij grę")'); if(zb && await zb.isVisible().catch(()=>false)){ await zb.click({timeout:2500}).catch(()=>{}); await page.waitForTimeout(1200); }
  if(skipIntro){ for(let k=0;k<6;k++){ const done=await page.evaluate(()=>{ document.getElementById('ic-skip')?.click(); [...document.querySelectorAll('button')].forEach(b=>{const t=(b.textContent||'').toLowerCase(); if(t.includes('pomiń')||t.includes('pomin')){try{b.click()}catch(e){}}}); document.getElementById('intro-offer')?.remove(); if(typeof G!=='undefined'){G._introductionActive=false;G._introductionSeen=true;} return !document.getElementById('ic-stage')&&!document.getElementById('intro-offer'); }); if(done)break; await page.waitForTimeout(400); } }
}

function richState(page){ return page.evaluate(()=>{ try{
  G.money=50000000; G.totalEarned=80000000; G.fame=420; G.fans=2200000; G.level=42; G.streetRep=90; G.energy=100; G.health=100; G.hunger=80;
  if(G.trap){ G.trap.unlocked=true; G.trap.level=15; }
  window._unlockedDistricts=['underground','coast','business'];
  if(typeof updateHUD==='function') updateHUD();
}catch(e){return 'err '+e.message;} return 'ok'; }); }

const log = [];
const mark = (t0, label) => { const t=((Date.now()-t0)/1000).toFixed(1); log.push(`  [${t}s] ${label}`); console.log(`  [${t}s] ${label}`); };

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── NAGRANIE 1: INTRO CINEMATIC ──
  console.log('▶ Nagranie 1: intro cinematic');
  let ctx = await browser.newContext({ viewport: VW, recordVideo: { dir: OUT, size: VW } });
  let page = await ctx.newPage();
  await prep(page, { skipIntro:true });
  await page.evaluate(()=>{ try{ if(typeof showIntroCinematic==='function') showIntroCinematic('MC', ()=>{}); }catch(e){} });
  await page.waitForTimeout(7000); // pełna sekwencja
  await ctx.close();
  const v1 = await page.video().path();
  console.log('  zapisano:', path.basename(v1));

  // ── NAGRANIE 2: MONTAŻ GAMEPLAYU ──
  console.log('▶ Nagranie 2: gameplay (sceny + timecody)');
  ctx = await browser.newContext({ viewport: VW, recordVideo: { dir: OUT, size: VW } });
  page = await ctx.newPage();
  await prep(page, { skipIntro:true });
  await richState(page);
  const t0 = Date.now();
  mark(t0, 'SCENA: ulica — spacer'); await hold(page,'d',2500); await hold(page,'w',1500); await hold(page,'a',1500);
  mark(t0, 'SCENA: studio'); await page.evaluate(()=>{ try{ if(typeof changeRoom==='function') changeRoom('studio'); }catch(e){} }); await page.waitForTimeout(3500);
  mark(t0, 'SCENA: kasyno'); await page.evaluate(()=>{ try{ if(typeof changeRoom==='function') changeRoom('casino'); }catch(e){} }); await page.waitForTimeout(3500);
  mark(t0, 'SCENA: dom/apartament'); await page.evaluate(()=>{ try{ if(typeof changeRoom==='function') changeRoom('home'); }catch(e){} }); await page.waitForTimeout(2500);
  mark(t0, 'SCENA: pełna mapa'); await page.evaluate(()=>{ try{ document.dispatchEvent(new KeyboardEvent('keydown',{key:'m'})); }catch(e){} }); await page.waitForTimeout(3000);
  await page.evaluate(()=>{ try{ document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); }catch(e){} });
  mark(t0, 'SCENA: ulica — finał'); await hold(page,'d',2500);
  await ctx.close();
  const v2 = await page.video().path();
  console.log('  zapisano:', path.basename(v2));

  await browser.close();

  // ── DOWÓD: pliki istnieją i mają rozmiar ──
  console.log('\n=== TIMECODY (nagranie 2) ==='); log.forEach(l=>console.log(l));
  console.log('\n=== PLIKI ===');
  let okAll=true;
  for(const v of [v1,v2]){ const sz=fs.existsSync(v)?fs.statSync(v).size:0; const kb=(sz/1024).toFixed(0); const ok=sz>20000; okAll=okAll&&ok; console.log(`  ${ok?'✅':'❌'} ${path.basename(v)} — ${kb} KB`); }
  console.log('\nFolder: '+OUT);
  process.exit(okAll?0:1);
})();
