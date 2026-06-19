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
// Position camera to show Traphouse (wx~160,wy~133) centered
await page.evaluate(()=>{ P.wx=300; P.wy=500; cam.x=0; cam.y=0; });
await page.waitForTimeout(400);
// Crop just the Traphouse area: sx=160-cam.x=160, sy=133-cam.y+62=195
const clip1 = { x: 140, y: 100, width: 220, height: 200 };
fs.writeFileSync(path.join(__dirname,'bld_zoom_traphouse.png'), await page.screenshot({ clip: clip1 }));
// Crop Media Markt area
const clip2 = { x: 320, y: 100, width: 220, height: 200 };
fs.writeFileSync(path.join(__dirname,'bld_zoom_mediamarkt.png'), await page.screenshot({ clip: clip2 }));
await browser.close();
console.log('Done!');
