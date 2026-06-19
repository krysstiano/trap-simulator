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
await page.waitForTimeout(1000);
await page.locator('.start-btn').click();
await page.waitForTimeout(3000);
// Przenieś gracza do restauracji i zatrzymaj grę
await page.evaluate(() => {
  P.wx = 1270; P.wy = 900;
  cam.x = P.wx - 640;
  cam.y = P.wy - 360 + 62;
});
await page.waitForTimeout(500);
const buf = await page.screenshot();
fs.writeFileSync(path.join(__dirname, 'restauracja.png'), buf);
await browser.close();
console.log('ok');
