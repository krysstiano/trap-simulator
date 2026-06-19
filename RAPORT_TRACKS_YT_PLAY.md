# RAPORT: Tytuły tracków + Tytuły YT + Bug Play
**Data:** 2026-05-15
**Plik:** `E:\Snowy Simulator\index.html`
**Zgłoszenia od:** Amper (beta tester) — 3 sub-zadania

---

## Spis treści
1. [Tytuły tracków (zamiast "Singiel #X")](#1-tytuły-tracków)
2. [Tytuły filmów YouTube](#2-tytuły-filmów-youtube)
3. [Nieaktywny przycisk Play (Spotify)](#3-nieaktywny-przycisk-play-spotify)

---

## 1. Tytuły tracków

### Stan obecny — auto-naming

Track ma pole `name` i jest generowany automatycznie w dwóch miejscach:

**A) `dawReleaseSingle()` — pro studio (DAW), linia 17232-17234:**
```js
const trackNum=(G.studioTracks||[]).length+1;
const genres_pl={trap:'Trap',boombap:'Boom Bap',drill:'Drill',reggaeton:'Reggaeton',jerk:'Jerk'};
const name=`Singiel #${trackNum} — ${genres_pl[ct.genre]||'Trap'}`;
```
Push do `G.studioTracks` w linii 17253:
```js
G.studioTracks.push({name,quality:finalQ,streams,royalties,releaseDay:G.day,genre:ct.genre,beatQ:ct.beatQ,vocalQ:ct.vocalQ,mixQ:ct.mixQ,masterQ:ct.masterQ,hit:_hitFlag});
```

**B) `recordHomeDemo()` — home studio demo, linia 12169-12174:**
```js
const trackNum=(G.studioTracks||[]).length+1;
const name=`[DEMO] Singiel #${trackNum}`;
...
G.studioTracks.push({name,quality:finalQ,streams,royalties,releaseDay:G.day,genre:'demo',isDemo:true});
```

**C) `releaseBeat()` — beatmaker instrumental, linia 15667:**
```js
G.studioTracks.push({name:`Instrumental #${G.studioTracks.length+1}`,quality:50,...});
```

Pola track object: `name, quality, streams, royalties, releaseDay, genre, beatQ, vocalQ, mixQ, masterQ, hit, isDemo, type`.

W stanie startowym `G.currentTrack` jest już zdefiniowany z pustym `name:''` (linia 797):
```js
currentTrack:{beatQ:0,vocalQ:0,mixQ:0,masterQ:0,genre:'trap',name:''}
```
Pole `name` w `currentTrack` istnieje, ale jest puste i nigdy nie używane → idealne miejsce do podpięcia inputa.

### Propozycja UI

**Wariant 1 (preferowany):** input field w zakładce **Master** DAW, obok przycisku `🚀 Wydaj Singiel!`. Gracz wpisuje tytuł PRZED kliknięciem release. Pusty input → fallback do auto-name `Singiel #X — Genre`.

**Wariant 2:** `prompt()` przy kliknięciu `Wydaj Singiel!`. Prostsze, ale mniej eleganckie (popup blokuje UI).

**Demo z home studio** — analogicznie input pod przyciskiem nagrywania (lub `prompt()`, bo home demo to "szybki freestyle", więc lekki prompt pasuje).

### Konkretne edity

#### EDIT 1A — Master tab (input field) — linia 17018-17021

**old_string:**
```
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px">
        <button class="dbtn" onclick="dawDoMaster()" style="margin:0">🎛️ Master → finalizuj</button>
        ${canRelease?`<button class="dbtn" onclick="dawReleaseSingle()" style="margin:0;background:#1a2a0a;border-color:#2ecc71;color:#2ecc71">🚀 Wydaj Singiel!</button>`:''}
      </div>
```

**new_string:**
```
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px">
        <button class="dbtn" onclick="dawDoMaster()" style="margin:0">🎛️ Master → finalizuj</button>
        ${canRelease?`<button class="dbtn" onclick="dawReleaseSingle()" style="margin:0;background:#1a2a0a;border-color:#2ecc71;color:#2ecc71">🚀 Wydaj Singiel!</button>`:''}
      </div>
      ${canRelease?`<div style="max-width:500px;margin:12px auto 0;text-align:center">
        <label style="display:block;color:#aaa;font-size:12px;margin-bottom:4px">🏷️ Tytuł singla (opcjonalnie)</label>
        <input id="track-name-input" type="text" maxlength="40" placeholder="np. Trap King, Zimowy Wieczór…" value="${(G.currentTrack?.name||'').replace(/"/g,'&quot;')}" oninput="G.currentTrack.name=this.value.slice(0,40)" style="width:100%;max-width:380px;padding:8px 12px;background:#0a0a14;border:1px solid #2a2a3a;border-radius:6px;color:#fff;font-family:inherit;font-size:13px;text-align:center">
        <div style="color:#556;font-size:10px;margin-top:4px">Puste → auto "Singiel #${(G.studioTracks||[]).length+1} — ${({trap:'Trap',boombap:'Boom Bap',drill:'Drill',reggaeton:'Reggaeton',jerk:'Jerk'}[ct.genre])||'Trap'}"</div>
      </div>`:''}
```

#### EDIT 1B — `dawReleaseSingle()` — użyj custom name jeśli wpisany — linia 17232-17234

**old_string:**
```
  const trackNum=(G.studioTracks||[]).length+1;
  const genres_pl={trap:'Trap',boombap:'Boom Bap',drill:'Drill',reggaeton:'Reggaeton',jerk:'Jerk'};
  const name=`Singiel #${trackNum} — ${genres_pl[ct.genre]||'Trap'}`;
```

**new_string:**
```
  const trackNum=(G.studioTracks||[]).length+1;
  const genres_pl={trap:'Trap',boombap:'Boom Bap',drill:'Drill',reggaeton:'Reggaeton',jerk:'Jerk'};
  /* v2.X.X: tytuł singla — user-input jeśli podany w polu Master, fallback do auto */
  const _customName=(ct.name||'').trim().slice(0,40);
  const name=_customName||`Singiel #${trackNum} — ${genres_pl[ct.genre]||'Trap'}`;
```

#### EDIT 1C — reset `name` po wydaniu — linia 17286

**old_string:**
```
  G.currentTrack={beatQ:0,vocalQ:0,mixQ:0,masterQ:0,genre:ct.genre,name:''};
```

**new_string (już ok — name:'' zostaje, ale dla pewności):**
```
  G.currentTrack={beatQ:0,vocalQ:0,mixQ:0,masterQ:0,genre:ct.genre,name:''};
```
*(już poprawne — nic nie zmieniać, name jest resetowane).*

#### EDIT 1D — Home demo (prompt — lżejsze niż UI) — linia 12164-12170

**old_string:**
```
  if(G._lastDemoDay===G.day){showMsg('🎙 Demo już dziś nagrane — wróć jutro','r');return;}
  if(G.energy<10){showMsg('⚡ Za mało energii (potrzeba 10)','r');return;}
  const mult=getApartmentDemoMult();
  const baseQ=Math.round(rnd(35,60)*mult); // bazowa jakość losowa, mnożona przez aptMult
  const finalQ=clamp(baseQ,8,90);
  const trackNum=(G.studioTracks||[]).length+1;
  const name=`[DEMO] Singiel #${trackNum}`;
```

**new_string:**
```
  if(G._lastDemoDay===G.day){showMsg('🎙 Demo już dziś nagrane — wróć jutro','r');return;}
  if(G.energy<10){showMsg('⚡ Za mało energii (potrzeba 10)','r');return;}
  const mult=getApartmentDemoMult();
  const baseQ=Math.round(rnd(35,60)*mult); // bazowa jakość losowa, mnożona przez aptMult
  const finalQ=clamp(baseQ,8,90);
  const trackNum=(G.studioTracks||[]).length+1;
  /* v2.X.X: tytuł demo — gracz może nazwać, fallback do auto */
  let _demoCustom='';
  try{_demoCustom=(prompt('🏷️ Nazwa demo (Enter = auto, max 40 znaków):','')||'').trim().slice(0,40);}catch(e){}
  const name=_demoCustom?`[DEMO] ${_demoCustom}`:`[DEMO] Singiel #${trackNum}`;
```

### UWAGA SAVE COMPAT (twarda reguła)
Wszystkie obecne save'y mają tracki z auto-name. Nowe pole `name` JUŻ istnieje na track object → **save'y działają bez migracji**. Nowy `G.currentTrack.name` JUŻ istnieje w bazowym state (linia 797) → też ok.

---

## 2. Tytuły filmów YouTube

### Stan obecny

`G.yt.videos` to tablica z formatem:
```js
{title: G.ytGame, quality: q, views: baseViews, date: 'Dzień '+G.day}
```

**`publishYT()` — linia 15305:**
```js
G.yt.videos.push({title:G.ytGame,quality:q,views:baseViews,date:'Dzień '+G.day});
```

**`publishYTSeries()` — linia 15342:**
```js
G.yt.videos.push({title:'[SERIA] '+G.ytGame,quality:q,views:baseViews,date:'Dzień '+G.day});
```

`G.ytGame` to gatunek (np. "FPS Action") wybrany w `startYTRecording()` (linia 14793) — gracz klika kafelek z gatunkiem, ale **nie** wpisuje tytułu. W rezultacie wszystkie filmy nazywają się tak samo, np. trzy razy "FPS Action".

### Propozycja UI

Input field w panelu YT studio (gdzie są karty "Nagrywanie / Montaż / Publikuj") — pojawia się **dopiero gdy `ytEdited=true`** (film zmontowany, gotowy do publikacji). Input do 40 znaków. Pusty → fallback do `G.ytGame` (jak dotychczas).

Mniej inwazyjny niż przepisywanie minigry nagrywania.

### Konkretne edity

#### EDIT 2A — input field w karcie "Publikuj" — linia 14779

**old_string:**
```
      <div class="card"><h3>📤 Publikuj</h3><p>Wrzuć film na YouTube. <strong style="color:#27ae60">+ ×1.5 boost streamu na 3 streamy</strong></p><div class="cost">Wymaga nagrania + montażu</div><button class="dbtn" ${!G.ytRecorded||!G.ytEdited?'disabled':''} onclick="publishYT()">Publikuj</button></div>
```

**new_string:**
```
      <div class="card"><h3>📤 Publikuj</h3><p>Wrzuć film na YouTube. <strong style="color:#27ae60">+ ×1.5 boost streamu na 3 streamy</strong></p>${G.ytRecorded&&G.ytEdited?`<input id="yt-title-input" type="text" maxlength="40" placeholder="🏷️ Tytuł filmu (opcjonalnie)" value="${(G._ytCustomTitle||'').replace(/"/g,'&quot;')}" oninput="G._ytCustomTitle=this.value.slice(0,40)" style="width:100%;padding:6px 10px;background:#0a0a14;border:1px solid #2a2a3a;border-radius:5px;color:#fff;font-family:inherit;font-size:12px;margin-bottom:6px;box-sizing:border-box">`:''}<div class="cost">Wymaga nagrania + montażu</div><button class="dbtn" ${!G.ytRecorded||!G.ytEdited?'disabled':''} onclick="publishYT()">Publikuj</button></div>
```

#### EDIT 2B — input field w karcie "Seria filmowa" — linia 14781

**old_string:**
```
      <div class="card"><h3>📺 Seria filmowa</h3><p>Nagraj serię 5 filmów → ×2 zasięg na każdym. Wymaga nagranego i zmontowanego.</p><div class="cost">${G.yt.seriesProgress!==undefined?`Seria: ${G.yt.seriesProgress}/5 filmów`:'Rozpocznij serię'}</div><button class="dbtn" ${!G.ytRecorded||!G.ytEdited?'disabled':''} onclick="publishYTSeries()">Dodaj do serii</button></div>
```

**new_string:**
```
      <div class="card"><h3>📺 Seria filmowa</h3><p>Nagraj serię 5 filmów → ×2 zasięg na każdym. Wymaga nagranego i zmontowanego.</p>${G.ytRecorded&&G.ytEdited?`<input id="yt-series-title-input" type="text" maxlength="40" placeholder="🏷️ Tytuł odcinka (opcjonalnie)" value="${(G._ytSeriesCustomTitle||'').replace(/"/g,'&quot;')}" oninput="G._ytSeriesCustomTitle=this.value.slice(0,40)" style="width:100%;padding:6px 10px;background:#0a0a14;border:1px solid #2a2a3a;border-radius:5px;color:#fff;font-family:inherit;font-size:12px;margin-bottom:6px;box-sizing:border-box">`:''}<div class="cost">${G.yt.seriesProgress!==undefined?`Seria: ${G.yt.seriesProgress}/5 filmów`:'Rozpocznij serię'}</div><button class="dbtn" ${!G.ytRecorded||!G.ytEdited?'disabled':''} onclick="publishYTSeries()">Dodaj do serii</button></div>
```

#### EDIT 2C — `publishYT()` użyj custom title — linia 15305

**old_string:**
```
  G.yt.videos.push({title:G.ytGame,quality:q,views:baseViews,date:'Dzień '+G.day});
```

**new_string:**
```
  /* v2.X.X: custom tytuł filmu — user-input z karty Publikuj, fallback do G.ytGame */
  const _customYtTitle=(G._ytCustomTitle||'').trim().slice(0,40);
  G.yt.videos.push({title:_customYtTitle||G.ytGame,quality:q,views:baseViews,date:'Dzień '+G.day,genre:G.ytGame});
  G._ytCustomTitle=''; /* reset po publikacji */
```

#### EDIT 2D — `publishYT()` notify message — linia 15320

**old_string:**
```
  notify(`📤 "${G.ytGame}"! +${baseViews.toLocaleString('pl')} views, +${newSubs} sub, +${income} zł · 🔥 Boost streamu ×1.5 na 3 streamy`);
```

**new_string:**
```
  /* v2.X.X: notify używa custom title jeśli był */
  const _vidLabel=(G.yt.videos[G.yt.videos.length-1]?.title)||G.ytGame;
  notify(`📤 "${_vidLabel}"! +${baseViews.toLocaleString('pl')} views, +${newSubs} sub, +${income} zł · 🔥 Boost streamu ×1.5 na 3 streamy`);
```

#### EDIT 2E — `publishYTSeries()` użyj custom title — linia 15342

**old_string:**
```
  G.yt.videos.push({title:'[SERIA] '+G.ytGame,quality:q,views:baseViews,date:'Dzień '+G.day});
```

**new_string:**
```
  /* v2.X.X: custom tytuł odcinka serii — user-input, fallback do G.ytGame */
  const _customSerTitle=(G._ytSeriesCustomTitle||'').trim().slice(0,40);
  G.yt.videos.push({title:'[SERIA] '+(_customSerTitle||G.ytGame),quality:q,views:baseViews,date:'Dzień '+G.day,genre:G.ytGame});
  G._ytSeriesCustomTitle=''; /* reset po publikacji */
```

### UWAGA SAVE COMPAT
Stare videos w save mają tylko `{title, quality, views, date}` — nowe pole `genre` jest dodatkowe i opcjonalne (nikt nie czyta go na starych obiektach). **Save'y działają bez migracji.** Nowe pola `G._ytCustomTitle` / `G._ytSeriesCustomTitle` są stringi defaultowo undefined → `(undefined||'').trim()` daje '' → fallback do `G.ytGame`. OK.

---

## 3. Nieaktywny przycisk Play (Spotify)

### Stan obecny — DUMMY NOTIFY

**Linia 23047** w panelu telefonu Spotify (`renderPhoneApp('spotify')`):
```html
<button onclick="notify('▶ Odtwarzanie...')" style="background:#1db954;border:none;color:#000;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:900">▶</button>
```

To **dummy** — klik wywołuje tylko `notify('▶ Odtwarzanie...')` (toast), żadne audio nie leci. Stąd zgłoszenie Ampera: "wyskakuje 'odtwarzanie' ale nic nie odtwarza".

W kodzie nie istnieje `playTrack`, `playVideo`, `playSingle` — nie ma żadnej infrastruktury audio per-track. Jest tylko `BGM` (background music) zarządzany przyciskiem ▶/⏸ Pauza (linie 9664/9681) i mp3 katalog `mp3/` (potencjalnie do użycia).

W panelu Tidal i YouTube **nie ma** drugiego dummy Play — tylko Spotify go ma.

### Analiza opcji

**Opcja A — usunąć przycisk całkowicie.** Najprostsze, nic nie kłamie graczowi.

**Opcja B — zmienić flavor message + dodać "vibe" SFX** — przycisk dalej istnieje, ale klik daje krótki SFX (np. "click" lub jingle) + bardziej zabawny tekst typu `🎵 Słuchasz "${topTrack.name}"... wyobraź sobie hit!` (samoświadomy żart). Można też dodać losowe efekty (+1 stream do tego tracku za click, daily-limit).

**Opcja C — faktyczny player** — wymaga sample mp3 per gatunek (już jest folder `mp3/`), state `G._nowPlaying`, HTML5 `<audio>` element, ducking BGM. **Duża zmiana, wykracza poza bug fix.**

### Rekomendacja: **Opcja B** — flavor + zachęta

- Klik daje toast z nazwą faktycznego tracku (a nie generyczne "Odtwarzanie...")
- Dodajemy mały reward: +1 stream do tego tracku co klik, max 5 dziennie (anti-exploit) — gracz czuje że "promuje" track
- Reuse istniejącego SFX jeśli jest (sprawdzić `playSFX` w kodzie)

Jeśli user woli **prostsze** rozwiązanie — Opcja A (usunąć przycisk) — patrz EDIT 3-ALT poniżej.

### Konkretne edity

#### EDIT 3 — Opcja B (flavor + +1 stream click) — linia 23047

**old_string:**
```
          <button onclick="notify('▶ Odtwarzanie...')" style="background:#1db954;border:none;color:#000;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:900">▶</button>
```

**new_string:**
```
          <button onclick="window._spotifyPlayClick&&window._spotifyPlayClick()" style="background:#1db954;border:none;color:#000;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:900" title="Promuj track (max 5/dzień)">▶</button>
```

#### EDIT 3-B — dodać funkcję `_spotifyPlayClick` (gdzieś przy innych window.* helperach, np. blisko `renderPhoneApp`, linia ~23010)

**Wstaw NOWY kod** (np. PRZED linią 23010 `const coverHTML=(t)=>{` — lub w osobnym bloku skryptu na końcu pliku przed `</script>`):

```js
/* v2.X.X: Przycisk ▶ Spotify — promocja tracku (zamiast dummy notify) */
window._spotifyPlayClick=function(){
  const tracks=(G.studioTracks||[]).slice().sort((a,b)=>(b.streams||0)-(a.streams||0));
  const top=tracks[0];
  if(!top){if(typeof notify==='function')notify('🎵 Najpierw nagraj track!');return;}
  /* daily cap 5 kliknięć */
  if(G._spotPromoDay!==G.day){G._spotPromoDay=G.day;G._spotPromoCount=0;}
  if((G._spotPromoCount||0)>=5){
    if(typeof notify==='function')notify('🎵 Dzisiaj już promowałeś — wróć jutro');
    return;
  }
  G._spotPromoCount=(G._spotPromoCount||0)+1;
  const gain=rnd(1,5);
  top.streams=(top.streams||0)+gain;
  G.spotify.streams=(G.spotify.streams||0)+gain;
  if(typeof notify==='function')notify(`🎵 Słuchasz "${top.name}" · +${gain} streamów (${G._spotPromoCount}/5 dzisiaj)`);
  /* re-render panel żeby zobaczyć nową liczbę streamów */
  if(typeof renderPhoneApp==='function')renderPhoneApp('spotify');
};
```

#### EDIT 3-ALT — Opcja A (usunąć przycisk całkowicie) — linia 23041-23048

**old_string:**
```
        <div style="display:flex;gap:10px;align-items:center">
          ${coverHTML(topTrack)}
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;color:#fff;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${topTrack.name}</div>
            <div style="font-size:11px;color:#778">${(topTrack.streams||0).toLocaleString('pl')} odtworzeń · jakość ${topTrack.quality||0}%</div>
          </div>
          <button onclick="notify('▶ Odtwarzanie...')" style="background:#1db954;border:none;color:#000;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:900">▶</button>
        </div>
```

**new_string:**
```
        <div style="display:flex;gap:10px;align-items:center">
          ${coverHTML(topTrack)}
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;color:#fff;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${topTrack.name}</div>
            <div style="font-size:11px;color:#778">${(topTrack.streams||0).toLocaleString('pl')} odtworzeń · jakość ${topTrack.quality||0}%</div>
          </div>
        </div>
```

### UWAGA SAVE COMPAT
Nowe pola `G._spotPromoDay` / `G._spotPromoCount` są runtime-only (defaultowo undefined → fallback do day+0). **Save'y działają bez migracji.**

---

## Podsumowanie do PATCH_NOTES (jeśli zaaplikujesz)

Propozycja wpisu (player-friendly, bez hex/regex/linii kodu):

```js
{t:'feature',d:'🏷️ Możesz nazwać swój singiel przed wydaniem! W zakładce Master w studio pojawia się pole "Tytuł singla" — wpisz cokolwiek (max 40 znaków). Puste = klasyczny "Singiel #X — Trap" jak wcześniej.'},
{t:'feature',d:'🎬 Tytuły filmów YouTube — w karcie Publikuj/Seria filmowa wpisz własną nazwę odcinka. Koniec z czterema filmami "FPS Action" w bibliotece. Puste = stary autonim (gatunek gry).'},
{t:'fix',d:'🎵 Przycisk ▶ w Spotify nie działał (tylko toast "Odtwarzanie..."). Teraz to promocja tracku: klik = +1-5 streamów dla Twojego najpopularniejszego utworu (limit 5×/dzień, anti-exploit).'},
```

---

## Sygnał: NIE EDYTUJ index.html
Zgodnie z briefem — wszystkie edity są tylko PROPOZYCJĄ w tym raporcie. Czekam na sygnał użytkownika żeby zaaplikować.

**Lokalizacje kluczowe:**
- DAW Master tab: linia 17006-17023
- `dawReleaseSingle`: linia 17214-17289
- `recordHomeDemo`: linia 12161-12196
- `publishYT`: linia 15288-15322
- `publishYTSeries`: linia 15324-15359
- YT panel UI (karty): linia 14776-14782
- Spotify panel (dummy Play): linia 23038-23049
