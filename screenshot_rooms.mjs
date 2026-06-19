import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameFile = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });
const jsErrors = [];
page.on('pageerror', err => jsErrors.push(err.message));
await page.goto(gameFile);
await page.waitForTimeout(2000);
await page.locator('text=NOWA GRA').click();
await page.waitForTimeout(1000);
await page.locator('.start-btn').click();
await page.waitForTimeout(3000);

// Screenshot silownia
await page.evaluate(() => {
  currentRoom = 'silownia';
  cam.x = 0; cam.y = -62;
  P.wx = 450; P.wy = 450;
});
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname, 'room_silownia.png'), await page.screenshot());

// Screenshot studio
await page.evaluate(() => {
  currentRoom = 'studio';
  cam.x = 0; cam.y = -62;
  P.wx = 450; P.wy = 450;
});
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname, 'room_studio.png'), await page.screenshot());

// Screenshot mieszkanie
await page.evaluate(() => {
  currentRoom = 'mieszkanie';
  cam.x = 0; cam.y = -62;
  P.wx = 450; P.wy = 450;
});
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname, 'room_mieszkanie.png'), await page.screenshot());

await browser.close();
if(jsErrors.length) jsErrors.forEach(e => console.error('JS ERROR:', e));
else console.log('ok – brak błędów JS');
