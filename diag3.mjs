import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameFile = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

// Try to get error position using CDP
const client = await page.context().newCDPSession(page);
const jsErrors = [];
await client.send('Runtime.enable');
client.on('Runtime.exceptionThrown', (event) => {
  const ex = event.exceptionDetails;
  jsErrors.push({
    text: ex.text,
    lineNumber: ex.lineNumber,
    columnNumber: ex.columnNumber,
    url: ex.url,
    exception: ex.exception ? ex.exception.description : null
  });
});

await page.goto(gameFile);
await page.waitForTimeout(3000);
console.log('JS Errors:', JSON.stringify(jsErrors, null, 2));
await browser.close();
