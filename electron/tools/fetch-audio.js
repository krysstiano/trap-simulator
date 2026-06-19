// Pobiera wszystkie unikalne pliki audio z catbox.moe (z root index.html)
// do ../../assets/audio/<basename>. Node 24 global fetch. Pomija juz pobrane.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const urls = [...new Set((html.match(/https?:\/\/[a-z.]*catbox[^"'` )]+/g) || []))];
const outDir = path.join(root, 'assets', 'audio');
fs.mkdirSync(outDir, { recursive: true });

console.log('FETCH: ' + urls.length + ' unikalnych URL-i catbox');

(async () => {
  let ok = 0, skip = 0; const failed = [];
  for (const url of urls) {
    const base = url.split('/').pop();
    const dst = path.join(outDir, base);
    if (fs.existsSync(dst) && fs.statSync(dst).size > 0) { skip++; continue; }
    try {
      const res = await fetch(url);
      if (!res.ok) { failed.push(base + ' (HTTP ' + res.status + ')'); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) { failed.push(base + ' (pusty ' + buf.length + 'B)'); continue; }
      fs.writeFileSync(dst, buf);
      ok++;
      console.log('  OK ' + base + ' (' + buf.length + ' B)');
    } catch (e) { failed.push(base + ' (' + (e.message || e) + ')'); }
  }
  console.log('FETCH-DONE: pobrano=' + ok + ' pominieto=' + skip + ' bledy=' + failed.length);
  if (failed.length) { console.error('FETCH-FAILED: ' + failed.join(', ')); }
  const total = fs.readdirSync(outDir).filter(f => /\.(mp3|wav|ogg)$/i.test(f)).length;
  console.log('FETCH-TOTAL: ' + total + ' plikow audio w assets/audio/');
  process.exit(failed.length && ok === 0 ? 1 : 0);
})();
