/* Gate spójności wydania — wykrywa rozjazdy wersji MIĘDZY artefaktami (anti-gap).
   Uruchom: node tools/check-release.mjs   (exit 1 = niespójność = NIE publikować)
   Źródło prawdy wersji: electron/package.json. Wszystko inne MUSI się zgadzać. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
let FAIL = 0;
const ok = (c, m) => { console.log((c ? '✅' : '❌') + ' ' + m); if (!c) FAIL++; };

/* parser PATCH_NOTES z index.html (świadomy stringów/komentarzy) — ten sam co website/gen-patchnotes.cjs */
function extractPatchNotes(html) {
  const decl = html.indexOf('const PATCH_NOTES'); const br = html.indexOf('[', decl);
  let i = br, depth = 0, inStr = null, esc = false, line = false, block = false;
  for (; i < html.length; i++) {
    const c = html[i], n = html[i + 1];
    if (esc) { esc = false; continue; }
    if (inStr) { if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue; }
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
    if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  return new Function('return ' + html.slice(br, i))();
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'electron/package.json'), 'utf8'));
const ver = pkg.version;                 // np. "2.3.43"
const vTag = 'v' + ver;                   // "v2.3.43"
console.log('Źródło prawdy: electron/package.json =', ver, '\n');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const PN = extractPatchNotes(html);
ok(PN[0].ver === vTag, `index.html PATCH_NOTES[0].ver = ${PN[0].ver} (oczek. ${vTag})`);

const wpn = JSON.parse(fs.readFileSync(path.join(ROOT, 'website/patchnotes.json'), 'utf8'));
ok(wpn[0].ver === vTag, `website/patchnotes.json[0].ver = ${wpn[0].ver} (oczek. ${vTag})`);
ok(wpn.length === PN.length, `website/patchnotes.json count = ${wpn.length} (== index.html ${PN.length})`);
ok(JSON.stringify(wpn[0]) === JSON.stringify(PN[0]), 'website/patchnotes.json[0] identyczny z PATCH_NOTES[0] (changelog zsynchronizowany)');

const wIdx = fs.readFileSync(path.join(ROOT, 'website/index.html'), 'utf8');
const badges = (wIdx.match(/badge-ver">([^<]+)</g) || []).map(s => s.replace(/.*">/, '').replace('<', ''));
ok(badges.length > 0 && badges.every(b => b === vTag), `website badge-ver (statyczny) = [${badges.join(', ')}] (oczek. ${vTag})`);

ok(fs.existsSync(path.join(ROOT, 'electron/preload.js')), 'electron/preload.js obecny (most auto-update)');
ok(fs.existsSync(path.join(ROOT, 'electron/build/installer.nsh')), 'electron/build/installer.nsh obecny (checkboxy skrótów)');
ok(/command\s*=\s*"node website\/gen-patchnotes\.cjs"/.test(fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8')), 'netlify.toml ma build command (auto-regeneracja changelogu)');

console.log('\n' + (FAIL === 0 ? '🟢 SPÓJNE — wszystkie artefakty na ' + vTag + ', można publikować' : '🔴 NIESPÓJNE — ' + FAIL + ' rozjazdów, NIE publikować'));
process.exit(FAIL === 0 ? 0 : 1);
