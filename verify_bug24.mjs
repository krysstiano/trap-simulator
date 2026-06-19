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

// Open phone
await page.keyboard.press('p');
await page.waitForTimeout(600);
fs.writeFileSync(path.join(__dirname,'bug24_phone_home.png'), await page.screenshot());
console.log('Phone open');

// Click Raper app
const raperApp = await page.locator('.ph-app').filter({hasText:'Raper'});
if(await raperApp.count()>0){
  await raperApp.click();
  await page.waitForTimeout(600);
  fs.writeFileSync(path.join(__dirname,'bug24_raper_career.png'), await page.screenshot());
  console.log('Raper career screen');

  // Check skill tree visible
  const hasTree = await page.evaluate(()=>document.querySelector('.ph-screen')?.innerHTML?.includes('Drzewko'));
  console.log('Skill tree in content:', hasTree);

  // Check kondycja branch
  const hasKond = await page.evaluate(()=>document.querySelector('.ph-screen')?.innerHTML?.includes('Kondycja'));
  console.log('Kondycja branch visible:', hasKond);

  // Check skill point display
  const spText = await page.evaluate(()=>{
    const txt = document.querySelector('.ph-screen')?.textContent||'';
    const m = txt.match(/Pkt umiej.*?(\d+)/);
    return m?m[0]:'not found';
  });
  console.log('Skill points:', spText);

  // Give skill points and try to buy
  await page.evaluate(()=>{ G.careers.raper.skillPts=5; G.careers.raper.xp=100; });
  await page.waitForTimeout(200);
  // Re-render phone raper
  await page.evaluate(()=>renderPhoneRaper());
  await page.waitForTimeout(400);
  fs.writeFileSync(path.join(__dirname,'bug24_raper_with_pts.png'), await page.screenshot());
  console.log('Raper with 5 skill pts');

  // Try to buy flow skill
  const flowBtn = await page.locator('button:has-text("Ulepsz")').first();
  if(await flowBtn.count()>0){
    await flowBtn.click();
    await page.waitForTimeout(400);
    fs.writeFileSync(path.join(__dirname,'bug24_after_buy.png'), await page.screenshot());
    console.log('After buying skill');
  } else {
    console.log('No Ulepsz button found');
  }
}

// Test kondycja speed effect
const spd0 = await page.evaluate(()=>{ return P.spd; });
console.log('Speed without kondycja:', spd0);

// Give kondycja 5
await page.evaluate(()=>{ if(!G.raperST) G.raperST={}; G.raperST.kondycja=5; });
await page.waitForTimeout(600); // wait for updateHUD
const spd5 = await page.evaluate(()=>P.spd);
console.log('Speed with kondycja 5:', spd5);

await browser.close();
console.log('Done!');
