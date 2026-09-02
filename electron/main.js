// Snowy Simulator — Electron POC wrapper
// Cel: zaladowac istniejacy ../index.html (single source) w natywnym oknie aplikacji.
// Tryb testowy (ELECTRON_TEST=1): laduje gre, robi screenshot, asercja na realny render
//   (canvas + tytul), exit 0 = OK / exit 1 = blad. ZASADA #0: dowod, nie slowo.

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const TEST = process.env.ELECTRON_TEST === '1';
/* PDF GDANSK U1 — uruchamialny dowod trybu pelnoekranowego:
     ELECTRON_TEST=1 ELECTRON_TEST_FS=1 npx electron .
   Okno startuje wtedy tak, jak u gracza (pelny ekran wg zapamietanego ustawienia), a test
   sprawdza REALNY stan okna oraz to, czy wyjscie z pelnego ekranu zapisuje sie w ustawieniach. */
const FS_TEST = process.env.ELECTRON_TEST_FS === '1';
// Spakowany build: ./game/index.html (skopiowany przez tools/prepare.js).
// Dev/POC: ../index.html (zywy single-source w root repo).
const INDEX = [
  path.join(__dirname, 'game', 'index.html'),
  path.join(__dirname, '..', 'index.html')
].find(p => fs.existsSync(p)) || path.join(__dirname, '..', 'index.html');

/* PDF GDANSK U1: gra startuje w trybie pelnoekranowym, zeby gracz nie musial na wstepie
   powiekszac okna. Wybor gracza jest zapamietywany — jesli wyjdzie z pelnego ekranu (F11),
   nastepny start uszanuje te decyzje. Plik ustawien lezy obok zapisow, w katalogu uzytkownika. */
const PREFS_NAME = 'window-prefs.json';
function prefsPath() { return path.join(app.getPath('userData'), PREFS_NAME); }
function readPrefs() {
  try { return JSON.parse(fs.readFileSync(prefsPath(), 'utf8')) || {}; } catch (_) { return {}; }
}
function writePrefs(p) {
  try { fs.mkdirSync(path.dirname(prefsPath()), { recursive: true }); fs.writeFileSync(prefsPath(), JSON.stringify(p)); } catch (_) {}
}

let failed = false;
function die(msg) {
  console.error('POC-FAIL: ' + msg);
  failed = true;
  try { app.exit(1); } catch (_) { process.exit(1); }
}

function createWindow() {
  if (!fs.existsSync(INDEX)) { die('brak pliku ' + INDEX); return; }

  const prefs = readPrefs();
  /* domyslnie pelny ekran; w trybie testowym okno zostaje male i ukryte */
  const wantFullscreen = (TEST && !FS_TEST) ? false : (prefs.fullscreen !== false);

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: wantFullscreen,  // PDF GDANSK U1: start w pelnym ekranie
    show: !TEST || FS_TEST,      // w tescie nie pokazuj okna (wyjatek: test pelnego ekranu)
    title: 'Trap Simulator',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js') // most IPC: eventy auto-update → in-game GUI
    }
  });

  win.setMenuBarVisibility(false);

  /* PDF GDANSK U1: F11 przelacza pelny ekran (menu jest ukryte, wiec skrot obslugujemy sami),
     a Esc wychodzi z pelnego ekranu bez zamykania gry. Kazda zmiana zapisuje sie w ustawieniach. */
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') {
      e.preventDefault();
      win.setFullScreen(!win.isFullScreen());
    }
  });
  win.on('enter-full-screen', () => writePrefs(Object.assign(readPrefs(), { fullscreen: true })));
  win.on('leave-full-screen', () => writePrefs(Object.assign(readPrefs(), { fullscreen: false })));

  const wc = win.webContents;

  /* v2.3.103 (user: „jak zrobiłem mural, otworzyła mi się karta w przeglądarce z tekstem nagrody").
     Gra jest w 100% lokalna i NIGDY nie otwiera zewnętrznych linków ani nowych okien — dlatego
     blokujemy KAŻDĄ próbę nawigacji/otwarcia okna. Bez tego dowolny przypadkowy gest (drag tekstu,
     środkowy klik) mógł skłonić Electron do otwarcia domyślnej przeglądarki z treścią jako wyszukiwaniem. */
  wc.setWindowOpenHandler(() => ({ action: 'deny' }));
  wc.on('will-navigate', (e, url) => { if (!String(url).startsWith('file://')) e.preventDefault(); });
  wc.on('will-redirect', (e, url) => { if (!String(url).startsWith('file://')) e.preventDefault(); });

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
    if (!TEST) { startSaveBackup(wc); setupAutoUpdate(wc); return; }
    try {
      // daj grze chwile na inicjalizacje canvasu
      await new Promise(r => setTimeout(r, 2500));
      const probe = await wc.executeJavaScript(`(() => ({
        title: document.title,
        hasCanvas: !!document.querySelector('canvas'),
        canvasCount: document.querySelectorAll('canvas').length,
        bodyLen: (document.body ? document.body.innerHTML.length : 0),
        hasUpdater: !!(window.electronUpdater && window.electronUpdater.isElectron),
        uwBound: !!window._uwUpdateBound,
        hasRender: typeof window._uwRenderUpdate === 'function'
      }))()`);
      console.log('POC-PROBE: ' + JSON.stringify(probe));

      if (FS_TEST) {
        const fsOn = win.isFullScreen();
        console.log('FS-PROBE: ' + JSON.stringify({ want: wantFullscreen, isFullScreen: fsOn }));
        if (!fsOn) return die('okno NIE wystartowalo w trybie pelnoekranowym');
        /* wyjscie z pelnego ekranu (to samo, co robi F11) musi zapisac wybor gracza */
        win.setFullScreen(false);
        await new Promise(r => setTimeout(r, 400));
        const afterOff = readPrefs().fullscreen;
        win.setFullScreen(true);
        await new Promise(r => setTimeout(r, 400));
        const afterOn = readPrefs().fullscreen;
        console.log('FS-PREFS: ' + JSON.stringify({ afterOff: afterOff, afterOn: afterOn }));
        if (afterOff !== false) return die('wyjscie z pelnego ekranu nie zapisalo sie w ustawieniach');
        if (afterOn !== true) return die('powrot do pelnego ekranu nie zapisal sie w ustawieniach');
        console.log('FS-OK: start w pelnym ekranie + zapamietany wybor gracza');
      }
      if (!probe.hasCanvas) return die('brak elementu <canvas> po zaladowaniu');
      if (probe.bodyLen < 1000) return die('body podejrzanie puste (' + probe.bodyLen + ' znakow)');

      // Most auto-update: preload musi wystawic window.electronUpdater i podpiac subskrypcje
      if (!probe.hasUpdater) return die('preload nie wystawil window.electronUpdater');
      if (!probe.hasRender) return die('renderer: brak _uwRenderUpdate (okienko aktualizacji)');
      if (!probe.uwBound) return die('renderer: _uwUpdateInit nie podpial subskrypcji eventow');
      // Round-trip IPC: main -> preload -> renderer; symuluj event 'downloaded' i sprawdz karte
      wc.send('uw-update', { type: 'downloaded', version: 'TEST' });
      await new Promise(r => setTimeout(r, 300));
      const upd = await wc.executeJavaScript(`(() => { var c=document.getElementById('uw-update-card'); return { disp: c?c.style.display:'(brak)', btn: c?c.querySelector('#uw-upd-btn').style.display:'(brak)' }; })()`);
      console.log('UPDATE-UI-PROBE: ' + JSON.stringify(upd));
      /* karta uzywa ukladu flex (od v2.3.132) — liczy sie WIDOCZNOSC, nie konkretna wartosc display */
      if (upd.disp === 'none' || upd.disp === '(brak)' || upd.btn !== 'block') return die('okienko aktualizacji nie pokazalo sie po evencie z main (' + JSON.stringify(upd) + ')');
      console.log('UPDATE-UI-OK: main->preload->renderer dziala (karta + przycisk restart widoczne)');

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
function setupAutoUpdate(wc) {
  if (!app.isPackaged) return;
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.autoDownload = true;          // pobiera w tle, GUI pokazuje postep
    autoUpdater.autoInstallOnAppQuit = false; // NIE instaluj po cichu przy zamknieciu — tylko widocznie przez przycisk w oknie
    const send = (type, data) => { try { if (wc && !wc.isDestroyed()) wc.send('uw-update', Object.assign({ type }, data || {})); } catch (_) {} };
    autoUpdater.on('checking-for-update', () => send('checking'));
    autoUpdater.on('update-available', (info) => send('available', { version: info && info.version }));
    autoUpdater.on('update-not-available', () => send('none'));
    autoUpdater.on('download-progress', (p) => send('progress', {
      percent: p && p.percent || 0,
      transferred: p && p.transferred || 0,
      total: p && p.total || 0,
      bytesPerSecond: p && p.bytesPerSecond || 0
    }));
    autoUpdater.on('update-downloaded', (info) => send('downloaded', { version: info && info.version }));
    autoUpdater.on('error', (err) => send('error', { message: (err && err.message) ? String(err.message) : 'unknown' }));
    // Renderer prosi o restart+instalacje (przycisk „Uruchom ponownie") — raz zarejestrowany handler
    if (!setupAutoUpdate._ipcBound) {
      setupAutoUpdate._ipcBound = true;
      ipcMain.on('uw-restart-install', () => { try { autoUpdater.quitAndInstall(false, true); } catch (_) {} }); // false=NIE silent (pokaż instalator), true=uruchom po instalacji
    }
    autoUpdater.checkForUpdates(); // autoDownload=true → pobiera w tle; eventy lecą do GUI
  } catch (_) { /* electron-updater niedostepny — ignoruj */ }
}

// B4/B5 (PDF v2.3.45): natywny pełny ekran okna sterowany z renderera (preload → electronFullscreen).
// HTML5 fullscreen jest auto-zamykany przez Esc; natywny setFullScreen nie reaguje na Esc, więc gra
// sama decyduje (Esc = pauza, bez wychodzenia z trybu) i toggle działa za 1. kliknięciem.
ipcMain.handle('uw-set-fullscreen', (e, on) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  if (w) { try { w.setFullScreen(!!on); } catch (_) {} }
  return w ? w.isFullScreen() : false;
});
ipcMain.handle('uw-get-fullscreen', (e) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  return w ? w.isFullScreen() : false;
});

// Steam (scaffold) — no-op dopóki STEAM_BUILD=1 + SDK + realny App ID. Bezpieczne dla buildu poza Steam (GitHub Releases/strona).
let _steam = null;
try { _steam = require('./steam'); ipcMain.on('steam-achievement', (e, id) => { try { _steam.unlockAchievement(id); } catch (_) {} }); } catch (e) {}

app.whenReady().then(() => { createWindow(); try { if (_steam) _steam.initSteam(); } catch (e) {} });
app.on('window-all-closed', () => { if (!failed) app.quit(); });
