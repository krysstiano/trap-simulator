// Dowod trwalosci zapisu: faza "write" ustawia klucz w localStorage gry i zamyka
// aplikacje; faza "read" (osobny proces = pelny restart) odczytuje i porownuje.
// localStorage w Electronie persystuje w userData per-origin (file://.../game/index.html).
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const PHASE = process.argv.find(a => a === 'write' || a === 'read') || 'read';
const EXPECT = process.env.PERSIST_VAL || 'novalue';
const INDEX = [
  path.join(__dirname, '..', 'game', 'index.html'),
  path.join(__dirname, '..', '..', 'index.html')
].find(p => fs.existsSync(p));

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, webPreferences: { contextIsolation: true } });
  win.webContents.on('did-finish-load', async () => {
    try {
      await new Promise(r => setTimeout(r, 800));
      if (PHASE === 'write') {
        const got = await win.webContents.executeJavaScript(
          `localStorage.setItem('__persist_test', ${JSON.stringify(EXPECT)}); localStorage.getItem('__persist_test');`
        );
        await win.webContents.session.flushStorageData();
        await new Promise(r => setTimeout(r, 600));
        console.log('PERSIST-WRITE: zapisano "' + got + '"');
        app.exit(got === EXPECT ? 0 : 1);
      } else {
        const got = await win.webContents.executeJavaScript(`localStorage.getItem('__persist_test');`);
        console.log('PERSIST-READ: odczytano "' + got + '" (oczekiwano "' + EXPECT + '")');
        if (got === EXPECT) { console.log('PERSIST-OK: localStorage PRZETRWAL restart aplikacji'); app.exit(0); }
        else { console.error('PERSIST-FAIL: wartosc nie przetrwala restartu'); app.exit(1); }
      }
    } catch (e) { console.error('PERSIST-FAIL: ' + (e && e.stack || e)); app.exit(1); }
  });
  win.loadFile(INDEX);
});
