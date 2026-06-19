// Renderuje website/ przez wbudowany serwer HTTP i robi screenshot (dowod wygladu).
const { app, BrowserWindow } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');

const webDir = path.join(__dirname, '..', '..', 'website');
const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(webDir, p);
  if (!file.startsWith(webDir) || !fs.existsSync(file)) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

app.disableHardwareAcceleration();
app.whenReady().then(() => {
  server.listen(8123, '127.0.0.1', async () => {
    const win = new BrowserWindow({ width: 1280, height: 1600, show: false, webPreferences: { contextIsolation: true } });
    win.webContents.on('did-finish-load', async () => {
      try {
        await new Promise(r => setTimeout(r, 1800)); // patch notes fetch + reveal
        const info = await win.webContents.executeJavaScript(
          "({title:document.title, cards:document.querySelectorAll('.note,.patch-note,[class*=note]').length, h1:(document.querySelector('h1')||{}).textContent})"
        );
        const out = path.join(__dirname, 'website_shot.png');
        const img = await win.webContents.capturePage();
        fs.writeFileSync(out, img.toPNG());
        console.log('WEB-INFO: ' + JSON.stringify(info));
        console.log('WEB-SHOT: ' + out + ' (' + fs.statSync(out).size + ' B)');
        console.log('WEB-OK');
        app.exit(0);
      } catch (e) { console.error('WEB-FAIL: ' + (e && e.stack || e)); app.exit(1); }
    });
    win.loadURL('http://127.0.0.1:8123/');
  });
});
