import { setupPage } from './_helper_runtime_template.mjs';
import fs from 'fs';

const { page, browser } = await setupPage();
const fails = [];
const log = (ok, n, i='') => { console.log((ok?'  ✅ ':'  ❌ ')+n.padEnd(48)+i); if(!ok) fails.push(n); };

// odpal cinematic, daj animacji canvas pomalować klatki
await page.evaluate(()=>{ try{ showIntroCinematic('MC', ()=>{}); }catch(e){} });
await page.waitForTimeout(1200);

const chk = await page.evaluate(()=>{
  const cv=document.getElementById('ic-canvas');
  if(!cv) return {canvas:false};
  const r={ canvas:true, w:cv.width, h:cv.height };
  // próbka pikseli — czy canvas NIE jest jednolicie czarny (są neony/skyline)
  try{
    const ctx=cv.getContext('2d');
    const data=ctx.getImageData(0,0,cv.width,cv.height).data;
    let nonBlack=0, colored=0;
    for(let i=0;i<data.length;i+=4*97){ const R=data[i],Gc=data[i+1],B=data[i+2];
      if(R+Gc+B>30) nonBlack++;
      if(Math.abs(R-Gc)>25||Math.abs(Gc-B)>25||Math.abs(R-B)>25) colored++; }
    r.nonBlack=nonBlack; r.colored=colored;
  }catch(e){ r.err=e.message; }
  r.fxStop = typeof document.getElementById('intro-cinematic')?._icFxStop;
  return r;
});
log(chk.canvas, 'canvas intro istnieje', JSON.stringify({w:chk.w,h:chk.h}));
log((chk.nonBlack||0)>50, 'canvas NIE jest czarny (skyline/tło narysowane)', 'nonBlack='+chk.nonBlack);
log((chk.colored||0)>5, 'są kolorowe neony (okna budynków)', 'colored='+chk.colored);

// screenshot dowodowy
await page.screenshot({ path: 'trailer_raw/intro_preview.png' });
const sz = fs.existsSync('trailer_raw/intro_preview.png') ? fs.statSync('trailer_raw/intro_preview.png').size : 0;
log(sz>10000, 'zrzut intro zapisany (trailer_raw/intro_preview.png)', (sz/1024).toFixed(0)+' KB');

// skip działa i sprząta animację
await page.evaluate(()=>document.getElementById('ic-skip')?.click());
await page.waitForTimeout(700);
const gone = await page.evaluate(()=>!document.getElementById('intro-cinematic'));
log(gone, 'POMIŃ zamyka intro + zatrzymuje animację');

console.log('\n'+(fails.length?('❌ FAIL: '+fails.join(' | ')):'🟢 INTRO CINEMATIC ZIELONE'));
await browser.close();
process.exit(fails.length?1:0);
