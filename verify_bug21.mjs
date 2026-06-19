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

async function shot(name, wx, wy) {
  await page.evaluate(({wx,wy})=>{ P.wx=wx; P.wy=wy; }, {wx,wy});
  await page.waitForTimeout(400);
  fs.writeFileSync(path.join(__dirname, name+'.png'), await page.screenshot());
  console.log('Shot:', name);
}

// Concert Hall + Targ area — check bottom edge consistency
await shot('fix21_chal',      2800, 900);
await shot('fix21_targ',      3200, 900);

// Row A/B/C/D spacing — check consistency
await shot('fix21_rowAB',     1000, 1160);  // view rows A+B
await shot('fix21_rowBC',     1000, 1400);  // view rows B+C (was 1380, now 1320)
await shot('fix21_rowCD',     1000, 1620);  // view rows C+D

// West side overview
await shot('fix21_mid_west',  400, 1300);

await browser.close();
console.log('Done!');
