// Dowod ze audio laduje sie LOKALNIE z game/assets/audio (nie z catbox).
// Laduje kopie buildowa game/index.html i probuje wczytac lokalny plik audio.
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const gameIndex = path.join(__dirname, '..', 'game', 'index.html');
const audioDir = path.join(__dirname, '..', 'game', 'assets', 'audio');
app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  if (!fs.existsSync(gameIndex)) { console.error('AUDIO-FAIL: brak game/index.html — odpal prepare-game'); app.exit(1); return; }
  const sample = fs.readdirSync(audioDir).find(f => /\.(mp3|wav)$/i.test(f));
  const win = new BrowserWindow({ show: false, webPreferences: { contextIsolation: true } });
  win.webContents.on('did-finish-load', async () => {
    try {
      await new Promise(r => setTimeout(r, 500));
      const res = await win.webContents.executeJavaScript(`new Promise((resolve)=>{
        const a = new Audio('assets/audio/${sample}');
        const done = (ok,info)=>resolve({ok, info, src:a.src});
        a.addEventListener('loadeddata', ()=>done(true,'loadeddata dur='+a.duration.toFixed(1)+'s'));
        a.addEventListener('canplaythrough', ()=>done(true,'canplaythrough'));
        a.addEventListener('error', ()=>done(false,'error code '+(a.error&&a.error.code)));
        setTimeout(()=>done(false,'timeout'),8000);
        a.load();
      })`);
      console.log('AUDIO-PROBE: ' + JSON.stringify(res));
      const fromLocal = res.src && res.src.includes('assets/audio/') && !res.src.includes('catbox');
      if (res.ok && fromLocal) { console.log('AUDIO-OK: ' + sample + ' wczytany z dysku (' + res.info + ')'); app.exit(0); }
      else { console.error('AUDIO-FAIL: ok=' + res.ok + ' local=' + fromLocal + ' (' + res.info + ')'); app.exit(1); }
    } catch (e) { console.error('AUDIO-FAIL: ' + (e && e.stack || e)); app.exit(1); }
  });
  win.loadFile(gameIndex);
});
