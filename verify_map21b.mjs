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
  console.log('Shot:', name, 'wx='+wx, 'wy='+wy);
}

// Concert Hall area — it showed floating on grass in rowC_east
await shot('chal_area',       2400, 900);
await shot('chal_east',       2800, 900);

// Targ (Market) area
await shot('targ_area',       3200, 900);

// IKEA sides — check east/west edges
await shot('ikea_west_side',  1700, 816);
await shot('ikea_east_side',  2100, 816);

// Blocks under Concert Hall — uneven spacing
await shot('blocks_under_chal', 2400, 1100);
await shot('blocks_under_targ', 3200, 1100);

// Row A east — Studio, Siłownia
await shot('rowa_east',       3000, 200);
await shot('rowa_far_east',   3600, 200);

// V1 road area and blocks
await shot('v1_blocks',       288, 1600);

// North west corner
await shot('corner_nw',       100, 100);

// Far south
await shot('far_south_west',  400, 3400);
await shot('far_south_east',  2000, 3400);

await browser.close();
console.log('Done!');
