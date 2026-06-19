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
await page.waitForTimeout(2000);

const crossings = [
  {name:'V1xH1', wx:864, wy:480},
  {name:'V2xH1', wx:2304, wy:480},
  {name:'V3xH1', wx:3552, wy:480},
  {name:'V1xH2', wx:864, wy:2016},
  {name:'V2xH2', wx:2304, wy:2016},
  {name:'V1xH3', wx:864, wy:2976},
];
for(const c of crossings){
  await page.evaluate(({wx,wy})=>{
    P.wx=wx; P.wy=wy;
    cam.x=wx-640; cam.y=wy-360+62;
  },{wx:c.wx,wy:c.wy});
  await page.waitForTimeout(350);
  fs.writeFileSync(path.join(__dirname,`crosswalk_${c.name}.png`), await page.screenshot());
  console.log(`Saved: crosswalk_${c.name}.png`);
}
await browser.close();
console.log('Gotowe!');
