import { chromium } from 'playwright';
import path from 'path'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fails=[]; const log=(ok,n,i='')=>{console.log((ok?'  ✅ ':'  ❌ ')+n.padEnd(52)+i); if(!ok)fails.push(n);};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport:{width:1280,height:800} });

// SYMULUJ OFFLINE dla Google Fonts — jeśli czcionki są wbudowane, i tak się załadują
let googleReq=0;
await page.route('**', route => {
  const u=route.request().url();
  if(/fonts\.(googleapis|gstatic)\.com/.test(u)){ googleReq++; return route.abort(); }
  return route.continue();
});

await page.goto('file://'+path.join(__dirname,'index.html'));
await page.waitForTimeout(1500);
await page.evaluate(()=>document.fonts.ready);

const r = await page.evaluate(()=>({
  russo: document.fonts.check("700 88px 'Russo One'"),
  orbitron: document.fonts.check("700 20px 'Orbitron'"),
  faceCount: [...document.fonts].length,
  russoFaces: [...document.fonts].filter(f=>f.family==='Russo One').length,
  orbFaces: [...document.fonts].filter(f=>f.family==='Orbitron').length,
}));

log(r.russo, "Russo One ZAŁADOWANY mimo zablokowanego Google CDN (offline-safe)", JSON.stringify(r.russo));
log(r.orbitron, "Orbitron ZAŁADOWANY mimo zablokowanego Google CDN", JSON.stringify(r.orbitron));
log(r.russoFaces>0 && r.orbFaces>0, "wbudowane @font-face obecne", JSON.stringify({russo:r.russoFaces,orb:r.orbFaces}));
log(googleReq===0, "ZERO zapytań do Google Fonts (RODO/prywatność)", "googleReq="+googleReq);

console.log('\n'+(fails.length?('❌ FAIL: '+fails.join(' | ')):'🟢 CZCIONKI SELF-HOSTED ZIELONE'));
await browser.close();
process.exit(fails.length?1:0);
