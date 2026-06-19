// Dowod ze zrzut localStorage -> JSON dziala (rdzen siatki backupu z main.js).
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
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
      const json = await win.webContents.executeJavaScript(
        "localStorage.setItem('bk_a','1'); localStorage.setItem('bk_b','dwa');" +
        "JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])))"
      );
      const out = path.join(app.getPath('temp'), 'trap_backup_test.json');
      fs.writeFileSync(out, json);
      const parsed = JSON.parse(fs.readFileSync(out, 'utf8'));
      const ok = parsed.bk_a === '1' && parsed.bk_b === 'dwa';
      console.log('BACKUP-DUMP: plik ' + out + ' (' + json.length + ' znakow, kluczy=' + Object.keys(parsed).length + ')');
      if (ok) { console.log('BACKUP-OK: zrzut localStorage zapisany i odczytany jako poprawny JSON'); app.exit(0); }
      else { console.error('BACKUP-FAIL: brak oczekiwanych kluczy'); app.exit(1); }
    } catch (e) { console.error('BACKUP-FAIL: ' + (e && e.stack || e)); app.exit(1); }
  });
  win.loadFile(INDEX);
});
