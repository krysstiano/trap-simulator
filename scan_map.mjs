import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameFile = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');

const SCAN_DIR = path.join(__dirname, 'map_scan');
if (!fs.existsSync(SCAN_DIR)) fs.mkdirSync(SCAN_DIR);

// Map world size: ~4320 x 3600, viewport: 1280x720
// cam.x = wx - 640, cam.y = wy - 360 (approx center)
// Step: 900px in X, 600px in Y for ~80% overlap between shots
const X_STEPS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000];
const Y_STEPS = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3540];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });
const jsErrors = [];
page.on('pageerror', err => jsErrors.push(err.message));

await page.goto(gameFile);
await page.waitForTimeout(2000);

// Start new game
await page.locator('text=NOWA GRA').click();
await page.waitForTimeout(800);
await page.locator('.start-btn').click();
await page.waitForTimeout(2000);

let count = 0;
const total = X_STEPS.length * Y_STEPS.length;

for (const wy of Y_STEPS) {
  for (const wx of X_STEPS) {
    await page.evaluate(({wx, wy}) => {
      // Move player and camera to position
      if (typeof P !== 'undefined') { P.wx = wx; P.wy = wy; }
      if (typeof cam !== 'undefined') {
        cam.x = wx - 640;
        cam.y = wy - 360 + 62;
      }
    }, {wx, wy});
    await page.waitForTimeout(150);
    const fname = `scan_wx${wx}_wy${wy}.png`;
    fs.writeFileSync(path.join(SCAN_DIR, fname), await page.screenshot());
    count++;
    console.log(`[${count}/${total}] ${fname}`);
  }
}

await browser.close();
if (jsErrors.length) jsErrors.forEach(e => console.error('JS ERROR:', e));
else console.log(`\nSkan zakończony. ${count} screenshotów w folderze map_scan/`);
