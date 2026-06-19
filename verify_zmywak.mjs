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

// Go to restaurant
await page.evaluate(()=>{ P.wx=560; P.wy=2280; });
await page.waitForTimeout(400);
await page.keyboard.press('e');
await page.waitForTimeout(600);

// Check restaurant overlay
const hasOverlay = await page.evaluate(()=>document.querySelector('.overlay.on')!==null||document.getElementById('overlay')?.classList.contains('on'));
console.log('Overlay open:', hasOverlay);
fs.writeFileSync(path.join(__dirname,'zmywak_restauracja.png'), await page.screenshot());

// Click zmywak button
const zmywakBtn = await page.locator('button:has-text("zmywaku")');
if(await zmywakBtn.count()>0){
  await zmywakBtn.click();
  await page.waitForTimeout(1000);
}
fs.writeFileSync(path.join(__dirname,'zmywak_game.png'), await page.screenshot());
console.log('Done!');

await browser.close();
