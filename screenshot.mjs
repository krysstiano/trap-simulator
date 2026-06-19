import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

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
await page.waitForTimeout(4000);

// Pełny screenshot skrzyżowania
const buf = await page.screenshot({ clip: { x: 560, y: 80, width: 600, height: 500 } });
fs.writeFileSync(path.join(__dirname, 'crosswalk.png'), buf);

await browser.close();
console.log('OK');
