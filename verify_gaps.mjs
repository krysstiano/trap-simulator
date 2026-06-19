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
// IKEA area (wx=510, wy=672) - central zone
await page.evaluate(()=>{ P.wx=600; P.wy=700; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'gap_ikea.png'), await page.screenshot());
// sklep/fryzjer area
await page.evaluate(()=>{ P.wx=280; P.wy=700; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'gap_sklep.png'), await page.screenshot());
// Pizzeria (wy=2208, south zone)
await page.evaluate(()=>{ P.wx=260; P.wy=2250; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'gap_pizzeria.png'), await page.screenshot());
await browser.close();
console.log('Done!');
