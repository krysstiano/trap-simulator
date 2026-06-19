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

async function shot(name) {
  fs.writeFileSync(path.join(__dirname, name+'.png'), await page.screenshot());
  console.log('✓', name);
}

// Teleport directly to gym room
await page.evaluate(()=>{
  currentRoom='silownia';
  P.wx=300; P.wy=300;
  cam.x=0; cam.y=0;
  updateCamera();
});
await page.waitForTimeout(500);
await shot('interior_gym');

// Studio room
await page.evaluate(()=>{
  currentRoom='studio';
  P.wx=400; P.wy=350;
  G.hasDaw=true; G.dawTier=2; G.audioInterface={tier:'pro'}; G.headphones={tier:'pro'};
  cam.x=0; cam.y=0;
  updateCamera();
});
await page.waitForTimeout(400);
await shot('interior_studio');

// Back to map — player on street
await page.evaluate(()=>{
  currentRoom='ulica';
  P.wx=640; P.wy=400; P.dir=2;
  cam.x=0; cam.y=0;
  updateCamera();
});
await page.waitForTimeout(400);
await shot('interior_map_player');

await browser.close();
console.log('All done!');
