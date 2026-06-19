// Snowy Simulator — Electron POC wrapper
// Cel: zaladowac istniejacy ../index.html (single source) w natywnym oknie aplikacji.
// Tryb testowy (ELECTRON_TEST=1): laduje gre, robi screenshot, asercja na realny render
//   (canvas + tytul), exit 0 = OK / exit 1 = blad. ZASADA #0: dowod, nie slowo.

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const TEST = process.env.ELECTRON_TEST === '1';
// Spakowany build: ./game/index.html (skopiowany przez tools/prepare.js).
// Dev/POC: ../index.html (zywy single-source w root repo).
const INDEX = [
  path.join(__dirname, 'game', 'index.html'),
  path.join(__dirname, '..', 'index.html')
].find(p => fs.existsSync(p)) || path.join(__dirname, '..', 'index.html');

let failed = false;
function die(msg) {
  console.error('POC-FAIL: ' + msg);
  failed = true;
  try { app.exit(1); } catch (_) { process.exit(1); }
}

function createWindow() {
  if (!fs.existsSync(INDEX)) { die('brak pliku ' + INDEX); return; }

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: !TEST,                 // w tescie nie pokazuj okna
    title: 'Trap Simulator',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);

  const wc = win.webContents;

  wc.on('did-fail-load', (_e, code, desc, url) => {
    die('did-fail-load ' + code + ' ' + desc + ' @ ' + url);
  });
  wc.on('render-process-gone', (_e, details) => {
    die('render-process-gone: ' + JSON.stringify(details));
  });
  wc.on('console-message', (_e, level, message) => {
    // level 3 = error w konsoli renderera
    if (level === 3) console.error('RENDERER-ERROR: ' + message);
  });

  // bezpiecznik: jesli nic sie nie wczyta w 30s -> blad (nie zawisaj)
  const guard = setTimeout(() => die('timeout 30s — strona sie nie zaladowala'), 30000);

  wc.on('did-finish-load', async () => {
    clearTimeout(guard);
    if (!TEST) { startSaveBackup(wc); setupAutoUpdate(); return; }
    try {
      // daj grze chwile na inicjalizacje canvasu
      await new Promise(r => setTimeout(r, 2500));
      const probe = await wc.executeJavaScript(`(() => ({
        title: document.title,
        hasCanvas: !!document.querySelector('canvas'),
        canvasCount: document.querySelectorAll('canvas').length,
        bodyLen: (document.body ? document.body.innerHTML.length : 0)
      }))()`);
      console.log('POC-PROBE: ' + JSON.stringify(probe));

      if (!probe.hasCanvas) return die('brak elementu <canvas> po zaladowaniu');
      if (probe.bodyLen < 1000) return die('body podejrzanie puste (' + probe.bodyLen + ' znakow)');

      // app.asar jest read-only w paczce — screenshot do zapisywalnego temp
      const shotPath = path.join(app.getPath('temp'), 'trap_poc_shot.png');
      const img = await wc.capturePage();
      fs.writeFileSync(shotPath, img.toPNG());
      const sz = fs.statSync(shotPath).size;
      console.log('POC-SHOT: ' + shotPath + ' (' + sz + ' bajtow)');
      if (sz < 1000) return die('screenshot podejrzanie maly');

      console.log('POC-OK: gra zaladowana w natywnym oknie Electron (canvas=' +
        probe.canvasCount + ', body=' + probe.bodyLen + ' znakow, tytul="' + probe.title + '")');
      app.exit(0);
    } catch (e) {
      die('wyjatek w probie: ' + (e && e.stack || e));
    }
  });

  win.loadFile(INDEX);
}

// Siatka bezpieczenstwa: cykliczny backup calego localStorage gry do pliku JSON
// w userData (rotacja 3 plikow + latest). Zero zmian w kodzie gry. Ratunek gdyby
// localStorage sie uszkodzil/wyczyscil — plik mozna recznie przywrocic.
function startSaveBackup(wc) {
  let n = 0;
  const dir = path.join(app.getPath('userData'), 'save-backups');
  try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
  const dump = async () => {
    try {
      const json = await wc.executeJavaScript(
        "JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])))"
      );
      if (!json || json.length < 3) return; // pusty localStorage — nie nadpisuj
      const slot = n % 3; n++;
      fs.writeFileSync(path.join(dir, 'backup-' + slot + '.json'), json);
      fs.writeFileSync(path.join(dir, 'latest.json'), json);
    } catch (_) { /* okno moglo sie zamknac — ignoruj */ }
  };
  setTimeout(dump, 15000);           // pierwszy backup po 15s
  setInterval(dump, 120000);         // potem co 2 min
}

// Auto-update przez GitHub Releases (electron-updater). Tylko w spakowanej apce
// (w dev nie ma sensu). Sprawdza repo z build.publish, pobiera w tle, instaluje przy restarcie.
function setupAutoUpdate() {
  if (!app.isPackaged) return;
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.autoDownload = true;
    autoUpdater.on('error', () => { /* brak sieci / brak release — cisza, gra dziala normalnie */ });
    autoUpdater.checkForUpdatesAndNotify();
  } catch (_) { /* electron-updater niedostepny — ignoruj */ }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (!failed) app.quit(); });
