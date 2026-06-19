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
// Position player near IKEA sidewalk junction
await page.evaluate(()=>{ P.wx=600; P.wy=700; });
await page.waitForTimeout(500);
// Get the screen coords of the sidewalk-IKEA junction (wy=671-672)
const coords = await page.evaluate(()=>{
  return {
    sw_bottom_sy: wy2sy(671),   // bottom of sidewalk
    ikea_top_sy: wy2sy(672),    // top of IKEA
    ikea_sx: wx2sx(510),
    cam_y: cam.y
  };
});
console.log('coords:', JSON.stringify(coords));
// Crop around the junction
const jy = coords.ikea_top_sy;
const clip = { x: coords.ikea_sx - 20, y: jy - 20, width: 300, height: 60 };
fs.writeFileSync(path.join(__dirname,'gap_zoom_ikea.png'), await page.screenshot({ clip }));
await browser.close();
console.log('Done!');
