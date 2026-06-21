import { setupPage } from './_helper_runtime_template.mjs';
import fs from 'fs';

const { page, browser } = await setupPage();
const fails = [];
const log = (ok, n, i='') => { console.log((ok?'  ✅ ':'  ❌ ')+n.padEnd(50)+i); if(!ok) fails.push(n); };

// ustaw bogaty stan żeby karta miała sensowne liczby
await page.evaluate(()=>{ try{ G.globalNick='MC_TEST'; G.level=42; G.fame=420; G.fans=2200000; G.money=50000000; G.day=180; G.streetRep=88; }catch(e){} });

const exist = await page.evaluate(()=>({ canv: typeof window._flexCardCanvas==='function', show: typeof window._showFlexCard==='function' }));
log(exist.canv && exist.show, 'funkcje _flexCardCanvas + _showFlexCard istnieją', JSON.stringify(exist));

// canvas się rysuje, ma treść (non-black + kolory)
const card = await page.evaluate(()=>{
  const c=window._flexCardCanvas(); const x=c.getContext('2d'); const d=x.getImageData(0,0,c.width,c.height).data;
  let nonBlack=0, colored=0;
  for(let i=0;i<d.length;i+=4*257){ const R=d[i],Gc=d[i+1],B=d[i+2]; if(R+Gc+B>40) nonBlack++; if(Math.abs(R-Gc)>30||Math.abs(Gc-B)>30||Math.abs(R-B)>30) colored++; }
  return { w:c.width, h:c.height, nonBlack, colored, dataUrlOk: c.toDataURL('image/png').startsWith('data:image/png') };
});
log(card.w===1080 && card.h===1080, 'karta 1080x1080', JSON.stringify({w:card.w,h:card.h}));
log(card.nonBlack>100, 'karta NIE jest czarna (tło/skyline/tekst)', 'nonBlack='+card.nonBlack);
log(card.colored>20, 'karta ma kolory (logo gradient + neony + staty)', 'colored='+card.colored);
log(card.dataUrlOk, 'eksport do PNG (toDataURL) działa');

// modal: download link + copy button
const modal = await page.evaluate(()=>{
  window._showFlexCard();
  const m=document.getElementById('flex-modal');
  const dl=document.getElementById('flex-dl');
  return { open:!!m, dl:!!dl, dlAttr: dl?dl.getAttribute('download'):'', hrefPng: dl?dl.getAttribute('href').startsWith('data:image/png'):false, copy:!!document.getElementById('flex-copy') };
});
log(modal.open && modal.dl && modal.copy, 'modal: obraz + Pobierz + Kopiuj', JSON.stringify({dl:modal.dl,copy:modal.copy}));
log(modal.dlAttr.endsWith('.png') && modal.hrefPng===true, 'przycisk Pobierz = plik PNG', modal.dlAttr);

// zrzut podglądu (cały modal) do oceny wizualnej
await page.screenshot({ path:'trailer_raw/flexcard_preview.png' });
log(fs.existsSync('trailer_raw/flexcard_preview.png'), 'zrzut podglądu zapisany');

console.log('\n'+(fails.length?('❌ FAIL: '+fails.join(' | ')):'🟢 KARTA POCHWAL SIĘ ZIELONA'));
await browser.close();
process.exit(fails.length?1:0);
