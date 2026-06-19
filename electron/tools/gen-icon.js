// Renderuje tools/icon.html offscreen i zapisuje build/icon.png (512x512).
// electron-builder z tego PNG wygeneruje .ico/.icns. Uruchom: electron tools/gen-icon.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration(); // stabilniejszy offscreen capture

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 512, height: 512, show: false,
    useContentSize: true,
    transparent: true, frame: false, backgroundColor: '#00000000',
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  try {
    await win.loadFile(path.join(__dirname, 'icon.html'));
    await new Promise(r => setTimeout(r, 600));
    const img = await win.webContents.capturePage({ x: 0, y: 0, width: 512, height: 512 });
    const outDir = path.join(__dirname, '..', 'build');
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, 'icon.png');
    fs.writeFileSync(out, img.toPNG());
    const sz = fs.statSync(out).size;
    const dim = img.getSize();
    console.log('ICON-OK: ' + out + ' (' + sz + ' bajtow, ' + dim.width + 'x' + dim.height + ')');
    if (sz < 2000 || dim.width !== 512) { console.error('ICON-FAIL: zly rozmiar'); app.exit(1); return; }
    app.exit(0);
  } catch (e) {
    console.error('ICON-FAIL: ' + (e && e.stack || e));
    app.exit(1);
  }
});
