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
// Select RED cloth
await page.locator('button:has-text("Czerwony")').click();
await page.waitForTimeout(300);
const creatorPreview = await page.screenshot({ clip: { x: 0, y: 0, width: 640, height: 720 } });
fs.writeFileSync(path.join(__dirname,'cloth_creator_red.png'), creatorPreview);
// Start game and check player
await page.locator('.start-btn').click();
await page.waitForTimeout(1500);
// Zoom on player
const pcoords = await page.evaluate(()=>({sx:wx2sx(P.wx)+P.w/2, sy:wy2sy(P.wy)+P.h/2, cloth:P.cloth}));
console.log('Player cloth:', pcoords.cloth);
const clip = { x: pcoords.sx-30, y: pcoords.sy-40, width: 60, height: 70 };
fs.writeFileSync(path.join(__dirname,'cloth_player_red.png'), await page.screenshot({ clip }));
await browser.close();
console.log('Done!');
