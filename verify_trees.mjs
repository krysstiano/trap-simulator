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
// Scan top-left area (north buildings)
await page.evaluate(()=>{ P.wx=300; P.wy=330; });
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname,'tree_north.png'), await page.screenshot());
// Scan ubrania/salon area
await page.evaluate(()=>{ P.wx=2800; P.wy=330; });
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname,'tree_ubrania.png'), await page.screenshot());
// Central zone (IKEA area)
await page.evaluate(()=>{ P.wx=600; P.wy=700; });
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname,'tree_central.png'), await page.screenshot());
await browser.close();
console.log('Done!');
