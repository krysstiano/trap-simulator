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

// Bug #30 — Check overlay fade-in by opening a shop
await page.evaluate(()=>{ P.wx=560; P.wy=2280; });
await page.waitForTimeout(500);
await page.keyboard.press('e');
await page.waitForTimeout(600);
await shot('final_overlay_fade');

// Close overlay
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// Bug #31 — Birds visible (daytime map)
await page.evaluate(()=>{ P.wx=640; P.wy=400; });
await page.waitForTimeout(600);
await shot('final_birds_daytime');

// Bug #24/25 — Raper career panel with skill tree
await page.keyboard.press('p');
await page.waitForTimeout(500);
const raperApp = await page.locator('.ph-app').filter({hasText:'Raper'});
if(await raperApp.count()>0){
  await raperApp.click();
  await page.waitForTimeout(500);
  await shot('final_raper_career');

  // Give XP and skill pts to test level up
  await page.evaluate(()=>{
    G.careers.raper.xp=81;
    G.careers.raper.skillPts=3;
    G.raperST.kondycja=2;
  });
  await page.evaluate(()=>renderPhoneRaper());
  await page.waitForTimeout(400);
  await shot('final_raper_with_skills');
}
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// Bug #33 — Concert gate (Scena + fans requirement)
await page.evaluate(()=>{ P.wx=2785; P.wy=750; });
await page.waitForTimeout(500);
await page.keyboard.press('e');
await page.waitForTimeout(600);
await shot('final_concert_gate');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// Night view with neon lights
await page.evaluate(()=>{ G.timeOfDay=3; P.wx=2800; P.wy=2550; });
await page.waitForTimeout(500);
await shot('final_night_neons');

// Map overview
await page.evaluate(()=>{ P.wx=640; P.wy=300; G.timeOfDay=0; });
await page.waitForTimeout(500);
await shot('final_map_overview');

await browser.close();
console.log('All done!');
