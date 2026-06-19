import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameFile = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });
const jsErrors = [];
page.on('pageerror', err => jsErrors.push(err.message));
page.on('console', msg => { if(msg.type()==='error') jsErrors.push('CONSOLE: '+msg.text()); });
await page.goto(gameFile);
await page.waitForTimeout(3000);
console.log('JS Errors:', JSON.stringify(jsErrors, null, 2));
const info = await page.evaluate(() => {
  const menu = document.getElementById('menu');
  const creator = document.getElementById('creator');
  return {
    menuDisplay: menu ? menu.style.display : 'NOT FOUND',
    creatorDisplay: creator ? creator.style.display : 'NOT FOUND',
    menuVisible: menu ? window.getComputedStyle(menu).display : 'N/A',
  };
});
console.log('DOM state:', JSON.stringify(info, null, 2));
await browser.close();
