// Przygotowuje zawartosc gry do spakowania przez electron-builder.
// Kopiuje single-source ../index.html -> ./game/index.html (+ pozniej assets/audio).
// Single source ZOSTAJE w root repo; tu robimy tylko kopie do paczki.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');     // E:\Snowy Simulator
const gameDir = path.join(__dirname, '..', 'game'); // electron\game
fs.mkdirSync(gameDir, { recursive: true });

const src = path.join(root, 'index.html');
const dst = path.join(gameDir, 'index.html');
let htmlContent = fs.readFileSync(src, 'utf8');

// Podmien URL-e catbox -> lokalne assets/audio/ TYLKO w kopii buildowej,
// dla plikow ktore faktycznie pobralismy (source z catbox ZOSTAJE nietkniety).
const audioSrcDir = path.join(root, 'assets', 'audio');
let rewired = 0;
if (fs.existsSync(audioSrcDir)) {
  const have = new Set(fs.readdirSync(audioSrcDir));
  htmlContent = htmlContent.replace(/https?:\/\/[a-z.]*catbox[^"'`) ]+/g, (url) => {
    const base = url.split('/').pop();
    if (have.has(base)) { rewired++; return 'assets/audio/' + base; }
    return url; // brak lokalnego pliku (placeholder) — zostaw oryginal
  });
}
fs.writeFileSync(dst, htmlContent);
const sz = fs.statSync(dst).size;
console.log('PREP-OK: index.html -> game/ (' + sz + ' bajtow, ' + rewired + ' URL-i audio -> lokalne)');

// assets/audio (jesli istnieja po bundlingu) -> game/assets/audio
const audioSrc = path.join(root, 'assets', 'audio');
if (fs.existsSync(audioSrc)) {
  const audioDst = path.join(gameDir, 'assets', 'audio');
  fs.mkdirSync(audioDst, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(audioSrc)) {
    fs.copyFileSync(path.join(audioSrc, f), path.join(audioDst, f));
    n++;
  }
  console.log('PREP-OK: audio -> game/assets/audio (' + n + ' plikow)');
} else {
  console.log('PREP-INFO: brak assets/audio (audio jeszcze nie zbundlowane) — build uzyje audio online');
}
