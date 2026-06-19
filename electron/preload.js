// Preload — bezpieczny most (contextIsolation) między main (auto-update) a grą (renderer).
// Wystawia minimalne, bezpieczne API: nasłuch eventów aktualizacji + prośba o restart-instalację.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronUpdater', {
  // Renderer rejestruje callback; main wysyła obiekty {type, ...} przez kanał 'uw-update'.
  on(cb) {
    if (typeof cb !== 'function') return;
    ipcRenderer.on('uw-update', (_e, data) => { try { cb(data || {}); } catch (_) {} });
  },
  // Przycisk „Uruchom ponownie, by zainstalować" → main woła autoUpdater.quitAndInstall().
  restart() { try { ipcRenderer.send('uw-restart-install'); } catch (_) {} },
  // Flaga obecności (gra rozpoznaje środowisko desktop vs web).
  isElectron: true
});
