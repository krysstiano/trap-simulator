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
// Drip district entrance — sign area (wx=2430, wy=2580)
await page.evaluate(()=>{ P.wx=2500; P.wy=2680; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'dripu_entrance.png'), await page.screenshot());
// Drip shops — north side view
await page.evaluate(()=>{ P.wx=2800; P.wy=2750; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'dripu_shops.png'), await page.screenshot());
// South side of H3 road — looking at Drip from south
await page.evaluate(()=>{ P.wx=2800; P.wy=3100; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'dripu_south.png'), await page.screenshot());
await browser.close();
console.log('Done!');
