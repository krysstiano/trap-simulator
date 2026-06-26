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

// B4/B5 (PDF v2.3.45): NATYWNY pełny ekran okna. HTML5 requestFullscreen jest auto-zamykany
// przez Esc (zachowanie natywne przeglądarki/Electrona) → 1. Esc wychodził z trybu zamiast
// pauzować. setFullScreen okna NIE reaguje na Esc → gra może sama spauzować, a toggle działa
// za 1. kliknięciem. Zwraca Promise<boolean> (faktyczny stan po zmianie).
contextBridge.exposeInMainWorld('electronFullscreen', {
  set(on) { try { return ipcRenderer.invoke('uw-set-fullscreen', !!on); } catch (_) { return Promise.resolve(false); } },
  get()   { try { return ipcRenderer.invoke('uw-get-fullscreen'); } catch (_) { return Promise.resolve(false); } },
  isElectron: true
});

// Steam (scaffold) — gra wysyła id odblokowanego osiągnięcia; main → unlockAchievement (no-op bez STEAM_BUILD).
contextBridge.exposeInMainWorld('electronSteam', {
  achievement(id) { try { if (id) ipcRenderer.send('steam-achievement', String(id)); } catch (_) {} },
  isElectron: true
});
