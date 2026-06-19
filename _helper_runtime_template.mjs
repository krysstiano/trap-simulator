/**
 * Helper: Runtime test template (reguła #9)
 * Standard Playwright setup: launch → goto → skip intro → ready for tests.
 *
 * Usage:
 *   import {setupPage, teleport, getNear, capturePixel} from './_helper_runtime_template.mjs';
 *   const {page, browser} = await setupPage();
 *   await teleport(page, 1000, 1000);
 *   const pixel = await capturePixel(page, 640, 360);
 *   await browser.close();
 *
 * Template per faza: copy + customize.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupPage(opts = {}) {
  const { viewport = { width: 1280, height: 800 }, skipIntro = true, headless = true } = opts;
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForTimeout(2000);

  /* Age gate 18+ (od v2.1.763) — przechwytuje pointer; potwierdź przez JS + ukryj overlay. */
  await page.evaluate(() => {
    try { if (typeof window._ageConfirm === 'function') window._ageConfirm(); } catch (e) {}
    const g = document.getElementById('agegate'); if (g) g.style.display = 'none';
  });
  await page.waitForTimeout(150);

  if (skipIntro) {
    const startBtn = await page.$('button:has-text("Nowa gra")');
    if (startBtn) { await startBtn.click(); await page.waitForTimeout(800); }
    const zaczynaj = await page.$('button:has-text("ZACZYNAJ"), button:has-text("Zacznij grę")');
    if (zaczynaj && await zaczynaj.isVisible().catch(()=>false)) { await zaczynaj.click({ timeout: 2500 }).catch(()=>{}); await page.waitForTimeout(1500); }
    /* v2.1.621 fix: intro-offer/intro-cinematic przechwytuje pointer → Playwright .click() timeout.
       Robust skip przez JS .click() (omija interception) + remove overlay + flagi. Kilka rund. */
    for (let k = 0; k < 6; k++) {
      const done = await page.evaluate(() => {
        document.getElementById('ic-skip')?.click();
        [...document.querySelectorAll('button')].forEach(b => { const t = (b.textContent || '').toLowerCase(); if (t.includes('pomiń') || t.includes('pomin')) { try { b.click(); } catch (e) {} } });
        document.getElementById('intro-offer')?.remove();
        if (typeof G !== 'undefined') { G._introductionActive = false; G._introductionSeen = true; }
        return !document.getElementById('ic-stage') && !document.getElementById('intro-offer');
      });
      if (done) break;
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(400);
  }

  return { page, browser, errors };
}

export async function teleport(page, wx, wy, opts = {}) {
  return page.evaluate(({ wx, wy, snapCam }) => {
    if (typeof P === 'undefined') return null;
    P.wx = wx; P.wy = wy;
    if (snapCam && typeof snapCamera === 'function') snapCamera();
    return { wx: P.wx, wy: P.wy, camX: cam.x, camY: cam.y };
  }, { wx, wy, snapCam: opts.snapCam !== false });
}

export async function getNearAt(page, wx, wy) {
  return page.evaluate(({ wx, wy }) => {
    P.wx = wx; P.wy = wy;
    return typeof getNear === 'function' ? getNear() : null;
  }, { wx, wy });
}

export async function capturePixel(page, x, y) {
  return page.evaluate(({ x, y }) => {
    if (typeof X === 'undefined') return null;
    const d = X.getImageData(x, y, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3], rgb: `${d[0]},${d[1]},${d[2]}` };
  }, { x, y });
}

export async function captureCanvasURL(page) {
  return page.evaluate(() => (typeof C !== 'undefined' ? C.toDataURL('image/png') : null));
}

export async function getGameState(page, extra = []) {
  return page.evaluate((extra) => {
    if (typeof G === 'undefined') return { error: 'G undefined' };
    const base = {
      day: G.day,
      level: G.level,
      money: G.money,
      fame: Math.floor(G.fame || 0),
      fans: G.fans,
      followers: G.followers,
      currentRoom: typeof currentRoom !== 'undefined' ? currentRoom : null,
      Pwx: typeof P !== 'undefined' ? P.wx : null,
      Pwy: typeof P !== 'undefined' ? P.wy : null,
    };
    extra.forEach(key => {
      const parts = key.split('.');
      let val = G;
      for (const p of parts) val = val?.[p];
      base[key] = val;
    });
    return base;
  }, extra);
}

export async function simulateAction(page, actionFn, args = {}) {
  return page.evaluate(({ fn, args }) => {
    const f = new Function('args', `return (${fn})(args);`);
    return f(args);
  }, { fn: actionFn.toString(), args });
}

// Quick smoke test gdy uruchamiane jako CLI (defensive: process.argv[1] może być undefined gdy importowane dynamicznie via inline)
if (process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  console.log('🧪 Runtime smoke test...');
  const { page, browser, errors } = await setupPage();
  const state = await getGameState(page);
  console.log('Initial state:', JSON.stringify(state, null, 2));
  console.log('Errors:', errors.length, errors.length ? errors : 'none');
  await browser.close();
  console.log('✅ Smoke test PASS');
}
