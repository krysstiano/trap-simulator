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

async function shot(name, wx, wy) {
  await page.evaluate(({wx,wy})=>{ P.wx=wx; P.wy=wy; }, {wx,wy});
  await page.waitForTimeout(400);
  fs.writeFileSync(path.join(__dirname, name+'.png'), await page.screenshot());
  console.log('✓', name);
}

// Bug #21 — Map layout
await shot('final_chal_area', 2800, 820);    // Concert Hall aligned
await shot('final_rowBC',     600, 1290);    // ROW B+C spacing

// Bug #22 — Freestyle spot in park
await shot('final_freestyle_spot', 1400, 720);

// Bug #26 — No orphan NPC near Ubrania
await shot('final_ubrania_area', 2700, 400);

// Bug #21 north row
await shot('final_north', 800, 200);

await browser.close();
console.log('All done!');
