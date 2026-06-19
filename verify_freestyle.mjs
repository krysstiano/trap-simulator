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

// Go to freestyle spot new location
await page.evaluate(()=>{ P.wx=1380; P.wy=780; });
await page.waitForTimeout(400);
fs.writeFileSync(path.join(__dirname,'freestyle_spot.png'), await page.screenshot());
console.log('Spot visible');

// Trigger freestyle
await page.evaluate(()=>{ P.wx=1420; P.wy=790; });
await page.waitForTimeout(400);
await page.keyboard.press('e');
await page.waitForTimeout(800);
fs.writeFileSync(path.join(__dirname,'freestyle_open.png'), await page.screenshot());
console.log('Freestyle opened');

// Type a word to verify mechanic
const panel = await page.$('#mg-job');
const wordArea = await page.$('#fs-wordarea');
if(wordArea){
  const word = await page.evaluate(()=>{
    const wa=document.getElementById('fs-wordarea');
    // Get the current word from the spans
    return [...wa.querySelectorAll('span')].map(s=>s.textContent.toLowerCase()).join('');
  });
  console.log('Current word:', word);
  // Type the first 2 chars
  if(word.length>0){
    await page.keyboard.type(word[0]);
    await page.waitForTimeout(200);
    await page.keyboard.type(word[1]||'');
    await page.waitForTimeout(200);
  }
}
fs.writeFileSync(path.join(__dirname,'freestyle_typing.png'), await page.screenshot());
console.log('Typing shown');

await browser.close();
console.log('Done!');
