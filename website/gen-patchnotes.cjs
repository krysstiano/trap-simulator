// Regeneruje website/patchnotes.json z PATCH_NOTES w ../index.html (single source).
// Pure-Node (bez przeglądarki) — uruchamiany lokalnie ORAZ w buildzie Netlify (netlify.toml),
// żeby changelog na stronie nigdy się nie zestarzał względem gry. Parser świadomy stringów
// i komentarzy (poprawne liczenie zagnieżdżonych [ ] mimo nawiasów w treści wpisów).
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const decl = html.indexOf('const PATCH_NOTES');
if (decl < 0) { console.error('Nie znaleziono PATCH_NOTES'); process.exit(1); }
const br = html.indexOf('[', decl);

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
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { i++; break; } }
}
const arrText = html.slice(br, i);
let arr;
try { arr = new Function('return ' + arrText)(); } catch (e) { console.error('Eval PATCH_NOTES failed:', e.message); process.exit(1); }
if (!Array.isArray(arr) || !arr.length) { console.error('PATCH_NOTES nie jest niepustą tablicą'); process.exit(1); }
fs.writeFileSync(path.join(__dirname, 'patchnotes.json'), JSON.stringify(arr, null, 1));
console.log('patchnotes.json zapisany:', arr.length, 'wpisów, top =', arr[0].ver);

// ── WEB-DEMO: skopiuj single-source index.html do website/play/ (grywalna wersja w przeglądarce) ──
// Generowane przy KAŻDYM deployu Netlify → nigdy się nie zestarzeje względem gry (zero ręcznych kopii,
// szanuje „single source = index.html"). Gra wykrywa brak window.electronUpdater → moduł auto-update bezczynny.
try {
  const playDir = path.join(__dirname, 'play');
  fs.mkdirSync(playDir, { recursive: true });
  fs.writeFileSync(path.join(playDir, 'index.html'), html);
  console.log('web-demo zapisany: website/play/index.html (' + (html.length / 1048576).toFixed(1) + ' MB)');
} catch (e) {
  // NIE-fatalne: kopia web-demo NIE może blokować deployu strony (changelog/wideo/FAQ ważniejsze).
  console.error('web-demo copy pominięte (nie blokuje deployu):', e.message);
}
