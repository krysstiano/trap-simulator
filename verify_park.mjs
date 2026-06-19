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
// Park area (wx=1104-1440, wy=720-1103) — center at wx=1272, wy=912
await page.evaluate(()=>{ P.wx=1272; P.wy=900; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'park_full.png'), await page.screenshot());
// Top of park
await page.evaluate(()=>{ P.wx=1272; P.wy=750; });
await page.waitForTimeout(500);
fs.writeFileSync(path.join(__dirname,'park_top.png'), await page.screenshot());
await browser.close();
console.log('Done!');
