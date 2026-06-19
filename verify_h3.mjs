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
// H3 right side — V3 intersection area (lower right)
await page.evaluate(()=>{ P.wx=3500; P.wy=2980; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'h3_v3.png'), await page.screenshot());
// H3 east end
await page.evaluate(()=>{ P.wx=3800; P.wy=2980; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'h3_east.png'), await page.screenshot());
// H3 south sidewalk lamps
await page.evaluate(()=>{ P.wx=3000; P.wy=3150; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'h3_south.png'), await page.screenshot());
await browser.close();
console.log('Done!');
