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

// North row A (top of map, wy≈133)
await shot('map_north_west',   400, 200);
await shot('map_north_mid',    1200, 200);
await shot('map_north_east',   2000, 200);

// Row B (wy≈480)
await shot('map_rowB_west',    400, 480);
await shot('map_rowB_mid',     1200, 480);

// Park area
await shot('map_park',         1200, 900);

// Concert Hall / Market area (row C wy≈816?)
await shot('map_rowC_west',    600, 816);
await shot('map_rowC_mid',     1400, 816);
await shot('map_rowC_east',    2200, 816);

// IKEA area
await shot('map_ikea',         2000, 700);

// Gym / Studio area
await shot('map_gym',          2400, 700);

// H1 / V2 crossing
await shot('map_h1_v2',        2450, 480);

// Middle of map
await shot('map_mid',          1600, 1600);

// V1 road area (wx≈288)
await shot('map_v1',           288, 1000);

// H2 road area (wy≈1440?)
await shot('map_h2_west',      600, 1440);
await shot('map_h2_mid',       1600, 1440);

// H3 road
await shot('map_h3_west',      800, 2980);
await shot('map_h3_mid',       2000, 2980);

// Drip north shops
await shot('map_drip_north',   2800, 2700);

// South end of map
await shot('map_south',        1600, 3400);

await browser.close();
console.log('Done!');
