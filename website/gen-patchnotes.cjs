// Regeneruje website/patchnotes.json z PATCH_NOTES w ../index.html (single source).
// Pure-Node (bez przeglądarki) — uruchamiany lokalnie ORAZ w GitHub Actions (deploy-website.yml),
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

// ── PDF v2.3.140 U6: ANGIELSKA historia aktualizacji dla przełącznika języka na stronie ──
// Tłumaczenia bierzemy z tego samego słownika, który jest wbudowany w index.html i którego
// używa gra (window.__I18N_DATA.en). Dzięki temu changelog na stronie nigdy nie rozjedzie się
// z tłumaczeniem w grze i nie trzeba tłumaczyć niczego drugi raz.
function _enDict(src) {
  const MARK = 'window.__I18N_DATA=';
  const i = src.indexOf(MARK);
  if (i < 0) return null;
  const open = src.indexOf('{', i);
  if (open < 0) return null;
  let d = 0, end = -1, inStr = false, esc = false;
  for (let p = open; p < src.length; p++) {
    const c = src[p];
    if (esc) { esc = false; continue; }
    if (inStr) { if (c === String.fromCharCode(92)) esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') d++;
    else if (c === '}') { d--; if (!d) { end = p + 1; break; } }
  }
  if (end < 0) return null;
  let obj;
  try { obj = JSON.parse(src.slice(open, end)); } catch (e) { return null; }
  if (!obj || typeof obj.en !== 'string') return null;
  try { return JSON.parse(obj.en); } catch (e) { return null; }
}

try {
  const en = _enDict(html);
  if (!en) throw new Error('brak slownika angielskiego w index.html');
  let hit = 0, miss = 0;
  const t = (v) => {
    if (typeof v !== 'string' || !v) return v;
    if (Object.prototype.hasOwnProperty.call(en, v)) { hit++; return en[v]; }
    miss++; return v;
  };
  const arrEn = arr.map(g => Object.assign({}, g, {
    title: t(g.title),
    items: Array.isArray(g.items) ? g.items.map(it => Object.assign({}, it, { d: t(it.d) })) : g.items,
  }));
  fs.writeFileSync(path.join(__dirname, 'patchnotes-en.json'), JSON.stringify(arrEn, null, 1));
  console.log('patchnotes-en.json zapisany:', arrEn.length, 'wpisów · przetłumaczonych', hit, '· bez tłumaczenia', miss);
} catch (e) {
  // NIE-fatalne: brak wersji angielskiej nie może zablokować deployu strony.
  console.error('patchnotes-en.json pominięty (nie blokuje deployu):', e.message);
}

// ── WEB-DEMO: skopiuj single-source index.html do website/play/ (grywalna wersja w przeglądarce) ──
// Generowane przy KAŻDYM deployu (GitHub Actions → Cloudflare Pages) → nigdy się nie zestarzeje względem gry (zero ręcznych kopii,
// szanuje „single source = index.html"). Gra wykrywa brak window.electronUpdater → moduł auto-update bezczynny.
// ⚠️ Cloudflare Pages ma TWARDY limit 25 MiB NA PLIK. Po dołożeniu czwartego słownika (pt)
// index.html urósł do ~28,5 MiB i deploy strony padał na kroku „Deploy to Cloudflare Pages"
// (v2.3.142, run 34637491471). Dlatego web-demo dostaje słowniki w OSOBNYCH plikach obok siebie:
// sam index.html schodzi wtedy do ~10 MiB, a każdy słownik to ~4,5 MiB — wszystko pod limitem.
// Gra (index.html w repo, Electron) zostaje NIETKNIĘTA — podział robimy tylko dla kopii webowej.
const CF_FILE_LIMIT = 25 * 1024 * 1024;

function splitDictsForWeb(src) {
  const MARK = 'window.__I18N_DATA={';
  const i = src.indexOf(MARK);
  if (i < 0) return null;                                   // brak bloku — nie ma czego dzielić
  const sOpen = src.lastIndexOf('<script>', i);
  const sClose = src.indexOf('</script>', i);               // literały mają <\/script, więc to nasz tag
  if (sOpen < 0 || sClose < 0) return null;
  const files = [], tags = [];
  let p = i + MARK.length;
  for (;;) {
    while (p < src.length && (src[p] === ',' || src[p] === ' ' || src[p] === '\n')) p++;
    if (src[p] === '}') break;
    if (src[p] !== '"') return null;                        // nieznany kształt — lepiej nie ruszać
    let q = p + 1, key = '';
    while (q < src.length && src[q] !== '"') key += src[q++];
    if (src[q] !== '"' || src[q + 1] !== ':' || src[q + 2] !== '"') return null;
    q += 2;
    const vs = q;                                           // literał wartości (JSON-owy string)
    q++;
    while (q < src.length) {
      if (src[q] === '\\') { q += 2; continue; }
      if (src[q] === '"') { q++; break; }
      q++;
    }
    const name = 'i18n-' + key + '.js';
    files.push({ name, body: 'window.__I18N_DATA=window.__I18N_DATA||{};window.__I18N_DATA[' + JSON.stringify(key) + ']=' + src.slice(vs, q) + ';' });
    tags.push('<script src="' + name + '"></script>');      // klasyczne <script> = kolejność zachowana
    p = q;
  }
  if (!files.length) return null;
  return { html: src.slice(0, sOpen) + tags.join('') + src.slice(sClose + '</script>'.length), files };
}

try {
  const playDir = path.join(__dirname, 'play');
  fs.mkdirSync(playDir, { recursive: true });
  for (const f of fs.readdirSync(playDir)) if (/^i18n-[a-z]{2}\.js$/.test(f)) fs.unlinkSync(path.join(playDir, f));

  let demo = html, extra = [];
  if (html.length > CF_FILE_LIMIT) {
    const split = splitDictsForWeb(html);
    if (!split) throw new Error('index.html > 25 MiB, a bloku slownikow nie da sie rozdzielic');
    demo = split.html; extra = split.files;
  }
  const tooBig = [{ name: 'index.html', size: demo.length }, ...extra.map(f => ({ name: f.name, size: Buffer.byteLength(f.body) }))]
    .filter(f => f.size > CF_FILE_LIMIT);
  if (tooBig.length) throw new Error('plik(i) nadal ponad limit 25 MiB: ' + tooBig.map(f => f.name + ' ' + (f.size / 1048576).toFixed(1) + ' MiB').join(', '));

  for (const f of extra) fs.writeFileSync(path.join(playDir, f.name), f.body);
  fs.writeFileSync(path.join(playDir, 'index.html'), demo);
  console.log('web-demo zapisany: website/play/index.html (' + (demo.length / 1048576).toFixed(1) + ' MB)' +
    (extra.length ? ' + slowniki osobno: ' + extra.map(f => f.name + ' ' + (Buffer.byteLength(f.body) / 1048576).toFixed(1) + ' MB').join(', ') : ''));
} catch (e) {
  // NIE-fatalne: kopia web-demo NIE może blokować deployu strony (changelog/wideo/FAQ ważniejsze).
  // Usuwamy niepełną kopię, żeby na Pages nie poszedł plik ponad limit i nie wywalil calego deployu.
  try {
    const playDir = path.join(__dirname, 'play');
    for (const f of fs.readdirSync(playDir)) if (/^(index\.html|i18n-[a-z]{2}\.js)$/.test(f)) fs.unlinkSync(path.join(playDir, f));
  } catch (e2) { }
  console.error('web-demo copy pominięte (nie blokuje deployu):', e.message);
}
