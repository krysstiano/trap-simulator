// steam.js — scaffold integracji Steamworks (SAFE: no-op dopóki nie ma SDK + App ID).
// Aktywny TYLKO gdy process.env.STEAM_BUILD === '1' ORAZ zainstalowany pakiet 'steamworks.js'
// ORAZ steam_appid.txt z realnym App ID. Inaczej wszystkie funkcje to bezpieczne no-opy —
// build poza Steam (GitHub Releases / strona) działa bez zmian.
//
// Gdy user poda App ID:
//   1. cd electron && npm i steamworks.js
//   2. podmień 480 w steam_appid.txt na realny App ID
//   3. build:  STEAM_BUILD=1 npm run dist
//   4. mapowanie osiągnięć: index.html wysyła nazwy odblokowanych ACHIEVEMENTS przez IPC
//      ('steam-achievement', id) → unlockAchievement(id). Nazwy id muszą być zarejestrowane
//      w panelu Steamworks (Stats & Achievements) 1:1 z grą.

let _client = null;
let _ready = false;

function steamEnabled() {
  return process.env.STEAM_BUILD === '1';
}

function initSteam() {
  if (!steamEnabled()) return false;
  try {
    const steamworks = require('steamworks.js'); // obecny tylko w buildzie Steam
    const fs = require('fs');
    const path = require('path');
    let appId = 480; // placeholder (SpaceWar) — podmieniany na realny App ID
    try { appId = parseInt(fs.readFileSync(path.join(__dirname, 'steam_appid.txt'), 'utf8').trim(), 10) || 480; } catch (e) {}
    _client = steamworks.init(appId);
    _ready = !!_client;
    if (_ready) console.log('[steam] zainicjowano, App ID', appId, '| user:', _client.localplayer.getName());
    return _ready;
  } catch (e) {
    console.warn('[steam] init pominięty (brak SDK/appid):', e.message);
    return false;
  }
}

function unlockAchievement(id) {
  if (!_ready || !_client || !id) return false;
  try {
    _client.achievement.activate(String(id));
    return true;
  } catch (e) {
    console.warn('[steam] achievement nieznane lub błąd:', id, e.message);
    return false;
  }
}

function runCallbacks() {
  if (_ready && _client && _client.runCallbacks) { try { _client.runCallbacks(); } catch (e) {} }
}

function shutdownSteam() {
  _client = null; _ready = false;
}

module.exports = { steamEnabled, initSteam, unlockAchievement, runCallbacks, shutdownSteam };
