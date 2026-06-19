import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameFile = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(gameFile);
await page.waitForTimeout(2000);
await page.locator('text=NOWA GRA').click();
await page.waitForTimeout(800);
await page.locator('.start-btn').click();
await page.waitForTimeout(1500);
for(let h=0;h<4;h++){
  await page.evaluate((hi)=>{ P.hair=hi; }, h);
  await page.evaluate(()=>{ P.wx=700; P.wy=500; cam.x=P.wx-640; cam.y=P.wy-360+62; });
  await page.waitForTimeout(300);
  // Full screenshot
  const fname = 'player_hair'+h+'.png';
  fs.writeFileSync(path.join(__dirname, fname), await page.screenshot());
  // Zoomed crop around player
  const sx = await page.evaluate(()=> P.wx - cam.x);
  const sy = await page.evaluate(()=> P.wy - cam.y + 62);
  const clip = { x: sx-30, y: sy-20, width: 80, height: 100 };
  fs.writeFileSync(path.join(__dirname, 'player_zoom'+h+'.png'), await page.screenshot({ clip }));
  console.log('Saved: '+fname+' + zoom');
}
await browser.close();
console.log('Done!');
