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
// Move player to Ubrania area so camera follows
await page.evaluate(()=>{ P.wx=2760; P.wy=330; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'sw_ubrania.png'), await page.screenshot());
// Top of map near Traphouse
await page.evaluate(()=>{ P.wx=300; P.wy=330; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'sw_top.png'), await page.screenshot());
// Salon area
await page.evaluate(()=>{ P.wx=3100; P.wy=330; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'sw_salon.png'), await page.screenshot());
await browser.close();
console.log('Done!');
