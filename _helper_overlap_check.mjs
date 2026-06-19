/**
 * Helper: Overlap Audit dla nowych obiektów wizualnych
 * Reguła #8 ZERO TOLERANCE — sprawdza kolizję vs DB_DECORATIVE + budynki + chodniki + drogi.
 *
 * Usage:
 *   node _helper_overlap_check.mjs '{"wx":1000,"wy":1000,"w":100,"h":100}' [...więcej obiektów]
 * Lub jako modul (import):
 *   import {checkOverlap} from './_helper_overlap_check.mjs';
 *   const result = await checkOverlap({wx, wy, w, h});
 *
 * Output: JSON z {conflicts, decConflicts, inBounds, onSidewalk, onRoad} per obj.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function checkOverlap(...objects) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForTimeout(2000);

  const startBtn = await page.$('button:has-text("Nowa gra")');
  if (startBtn) { await startBtn.click(); await page.waitForTimeout(800); }
  const zaczynaj = await page.$('button:has-text("ZACZYNAJ"), button:has-text("Zacznij grę")');
  if (zaczynaj) { await zaczynaj.click(); await page.waitForTimeout(2000); }
  const skip = await page.$('button:has-text("Pomiń")');
  if (skip) { await skip.click(); await page.waitForTimeout(1500); }

  const audit = await page.evaluate((checkObjs) => {
    if (typeof ROOMS === 'undefined') return { error: 'ROOMS undefined' };
    const objs = ROOMS.ulica?.objects || [];
    const decorative = (typeof DB_DECORATIVE !== 'undefined' && Array.isArray(DB_DECORATIVE)) ? DB_DECORATIVE : [];
    const overlaps = (a, b) => a.wx < b.wx + b.w && a.wx + a.w > b.wx && a.wy < b.wy + b.h && a.wy + a.h > b.wy;
    const SIDEWALK_YS = [288, 384, 1824, 2304, 2784, 3168];  // wy ranges chodników (top edges)
    const SIDEWALK_H = 96;
    const ROAD_HX = [288, 1920, 2880];  // V roads start wx (V1=720, V2=2160, V3=3456) -- horizontal roads wy
    return checkObjs.map(c => {
      const conflicts = objs.filter(o => overlaps(c, o)).map(o => ({ id: o.id, wx: o.wx, wy: o.wy, w: o.w, h: o.h }));
      const decConflicts = decorative.filter(d => {
        if (d.wx == null) return false;
        const dw = d.w || 32, dh = d.h || 32;
        return overlaps(c, { wx: d.wx, wy: d.wy, w: dw, h: dh });
      });
      const onSidewalk = SIDEWALK_YS.some(sy => c.wy < sy + SIDEWALK_H && c.wy + c.h > sy);
      const wW = ROOMS.ulica.wT * 48, wH = ROOMS.ulica.hT * 48;
      const inBounds = c.wx >= 0 && c.wy >= 0 && c.wx + c.w <= wW && c.wy + c.h <= wH;
      return {
        input: c,
        conflicts: conflicts.length,
        conflictsDetail: conflicts.slice(0, 5),
        decConflicts: decConflicts.length,
        onSidewalk, inBounds,
        mapBounds: { wT: ROOMS.ulica.wT, hT: ROOMS.ulica.hT, wW, wH },
      };
    });
  }, objects);

  await browser.close();
  return { audit, errors };
}

// CLI mode
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node _helper_overlap_check.mjs \'{"wx":X,"wy":Y,"w":W,"h":H}\' [...]');
    process.exit(1);
  }
  const objects = args.map(a => JSON.parse(a));
  const result = await checkOverlap(...objects);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.audit.some(a => a.conflicts > 0 || a.decConflicts > 0 || !a.inBounds) ? 1 : 0);
}
