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
  await page.evaluate(({wx,wy})=>{ P.wx=wx; P.wy=wy; updateCamera(); }, {wx,wy});
  await page.waitForTimeout(400);
  fs.writeFileSync(path.join(__dirname, name+'.png'), await page.screenshot());
  console.log('✓', name);
}

// Right lower corner — V3 x H3 intersection (V3=wx3456-3648, H3=wy2880-3072)
await shot('corner_lr_main', 3550, 3000);
await shot('corner_lr_south', 3550, 3150);
await shot('corner_lr_east', 3700, 3000);

// Also: Drip district overview
await shot('drip_district', 2800, 2700);

await browser.close();
console.log('All done!');
