# RAPORT: STUDIO RECORDING FREEZE BUG

**Beta tester:** Amper
**Data:** 2026-05-15
**Plik:** `E:\Snowy Simulator\index.html`
**Bug:** Klik na komputer w studio (nagrywanie) CZASAMI freezuje grę — brak okienka, brak ruchu, gracz "zawiesza się".
**Charakter:** Niedeterministyczny (zależy od poprzednich akcji gracza).

---

## 1. ŚCIEŻKA KODU — OD KLIKU DO MINIGRY

### 1.1 Definicja obiektu w studio
**Linia 2199:** `ROOMS.studio.objects` zawiera obiekt `computer` z `act:'open:daw'`:
```
{id:'computer',  wx:760,wy:150, w:145,h:100, act:'open:daw', prompt:'[E] Komputer / DAW', lbl:''}
```

### 1.2 Handler klika [E]
**Linia 1075-1080:** keydown 'E' wywołuje `tryInteract()`.
**Linia 8694:** `tryInteract()` — checki: overlayOpen, phoneOpen, mgOpen, _roomFadeDir, npcDlgOpen.
**Linia 8701:** `handleAct(obj.act, obj.id)` z `'open:daw'`.
**Linia 8972:** `handleAct` rozpoznaje `act.startsWith('open:')` → `openCareerOverlay(act.slice(5))`.
**Linia 14706-14719:** `openCareerOverlay('daw')` → `renderDAWOverlay()` → `openOverlay()`.

### 1.3 Otwarcie DAW
**Linia 16920-17096:** `renderDAWOverlay(tab='beatmaker')` — generuje HTML z 6 zakładkami:
- `beatmaker` (sequencer)
- `recording` (vocal MG)
- `mixer` (sliders)
- `master` (sliders)
- `plugins`
- `dystrybucja`

### 1.4 Klik "Nagraj wokal"
**Linia 17145-17150:** `window.dawLaunchRecording`:
```js
window.dawLaunchRecording=()=>{
  if(!G.mic||G.energy<20) return;
  G._dawVocalMode=true;
  closeOverlay();
  startVocalRecordMG();
};
```

### 1.5 Sam minigame
**Linia 16660-16769:** `function startVocalRecordMG()`. Tutaj sedno bugu — patrz §2.

---

## 2. ROOT CAUSE — `display:none` STUCK

### 2.1 Sedno problemu
`startVocalRecordMG()` (linia 16661) otwiera panel `#mg-job` w taki sposób:

```js
const panel=document.getElementById('mg-job');
panel.innerHTML='';
panel.classList.add('on');
```

**Brakuje wiersza `panel.style.display='';`** — w odróżnieniu od pozostałych minigier:
- `startFreestyleMG` (linia 21612): `el.style.display='';el.classList.add('on');el.innerHTML='';` ✓
- `startBeatSequencerMG` (linia 15413): `panel.style.display='';panel.classList.add('on');` ✓
- `startConcertMG` (linia 19330-19331): `panel.style.display=''; panel.classList.add('on');` ✓
- `startBreakdanceMG` (linia 21811-21812): `el.style.display='flex';el.classList.add('on');` ✓
- `startVocalRecordMG` (linia 16661): `panel.innerHTML='';panel.classList.add('on');` ❌ **brak resetu display**

### 2.2 Dlaczego CSS `.on { display:flex }` nie zadziała
**Linia 177-178:**
```css
#mg-job{...display:none;z-index:35;...}
#mg-job.on{display:flex;}
```

CSS rule `.on` daje `display:flex`, ALE w grze rozsiane są wiersze typu:
- `panel.style.display='none';` (np. `_jobMgCleanup` w sequencerze, linia 15624: `panel.classList.remove('on');panel.style.display='none';`)
- `mjob.style.display='none';` w `closeMG()` (linia 27833)

Inline style **`display:none` ZAWSZE wygrywa** z regułą CSS (specyficzność — inline > class), dopóki nie zostanie ręcznie wymazany.

### 2.3 Scenariusz freeze (powtarzalny)
1. Gracz wchodzi do studio.
2. Otwiera DAW → klika "🎹 Otwórz Sequencer" → `dawLaunchBeatMaker` → `startBeatSequencerMG`.
   - Panel: `display=''` + `.on` + `mg-job-content` div.
3. Gracz klika **"← Anuluj"** lub **"← Porzuć"** → wywoła się `_jobMgCleanup` (linia 15621-15625):
   ```js
   window._jobMgCleanup=()=>{
     ...
     panel.classList.remove('on');
     panel.style.display='none';   // <-- USTAWIA INLINE display:none
     document.getElementById('mg-job-content').innerHTML='';
   };
   ```
4. Gracz wraca do DAW, klika zakładkę "🎤 Nagrywanie" → klika "Nagraj wokal".
5. `dawLaunchRecording` → `closeOverlay()` → `startVocalRecordMG()`.
6. `startVocalRecordMG` ustawia `panel.classList.add('on')` ale **NIE resetuje `panel.style.display`** — pozostaje `display:none` z kroku 3.
7. Panel ma `.on` (więc `mgOpen()` zwraca `true`), więc `updatePlayer()` zwraca early (linia 8544: `if(overlayOpen()||phoneOpen()||mgOpen()) return;`).
8. Panel jest niewidoczny (`display:none`) — **gracz nie widzi okienka i nie może się ruszyć**. Freeze.

### 2.4 Inne ścieżki prowadzące do tego samego stanu
W kodzie istnieje wiele `_jobMgCleanup` które ustawiają `style.display='none'` (każda minigra w `mg-job`):
- Sequencer (linia 15624)
- Streaming (linia 15885)
- YT-style minigame inne (linia 16398)
- Tour day (linia 20364)
- Carwash (linia 20610)
- Pizza (linia 20919)
- Concert (jego cleanup) — niejednokrotnie

Każde z tych przejść (gracz robił coś innego w `mg-job` → wyszedł → poszedł nagrywać) **zostawia bombę zegarową** dla recording MG.

Dodatkowo `closeMG()` (linia 27826-27840) ustawia `mjob.style.display='none'` — co znaczy, że NAWET ESC pociągnie ten sam efekt.

### 2.5 Dlaczego "czasami działa, czasami nie"
- **Działa:** gdy `mg-job` ma `display=''` (np. pierwszy raz w sesji, lub po freestyle który resetuje display).
- **Nie działa:** gdy gracz wcześniej grał w sequencer / koncert / pizza / dowolną minigrę i wyszedł przez Porzuć/Anuluj/ESC — `display:none` zostaje.

To wyjaśnia 100% niedeterminizmu — kolejność akcji gracza.

---

## 3. RACE CONDITION #2 — `_dawVocalMode` BEZ RESETU NA EXIT

### 3.1 Bug
**Linia 17147:** `G._dawVocalMode=true;` ustawiany przed `startVocalRecordMG`.
**Linia 16676:** Exit minigry przez "← Przerwij":
```js
bClose.onclick=()=>{done=true;cancelAnimationFrame(animId);
  panel.classList.remove('on');renderSoundEngOverlay();openOverlay();};
```

**Brak `G._dawVocalMode=false`!** Tylko `finishVocal` resetuje to (linia 16756: `if(G._dawVocalMode){G.currentTrack.vocalQ=...;G._dawVocalMode=false;}`).

### 3.2 Konsekwencja
Jeśli gracz przerwie nagrywanie i otworzy DAW jeszcze raz, `G._dawVocalMode` zostaje `true`. Następnie gdy klika gdziekolwiek "Nagraj wokal" — flaga jest "lipką" — może powodować inne side-effecty (np. pipeline `_wasDawVocal` przy następnym `finishVocal` pokaże przycisk "Następny krok: Miks →" zamiast "Wróć do studia").

Nie powoduje freeze, ale to bug logiki state.

---

## 4. RACE CONDITION #3 — KEYDOWN LISTENER LEAK

### 4.1 Bug
**Linia 16734:** `window.addEventListener('keydown',onSpace);`
**Linia 16729:** Tylko ścieżka "wszystkie 6 take'ów" usuwa listener:
```js
if(takes>=TOTAL_TAKES){
  done=true;cancelAnimationFrame(animId);window.removeEventListener('keydown',onSpace);
  ...
}
```

**Linia 16676 (Exit):** `bClose.onclick` ustawia `done=true` ale **NIE usuwa keydown listenera**!

### 4.2 Konsekwencja
- Listener pozostaje aktywny w `window`. Sprawdza `if(done)return;`, więc nie wpada do logiki gry, ale każde wciśnięcie spacji wywołuje `e.preventDefault()` (linia 16715).
- Spacja staje się "głucha" w grze. Drobny mem leak.
- Gdy gracz wejdzie ponownie do recording, nowy listener się dodaje — przy 5-6 wejściach + przerwań mamy 5-6 globalnych listenerów spacji. Nie powoduje freeze, ale to ghost handler.

---

## 5. RACE CONDITION #4 — `recBarAnim` (STARSZA MINIGRA, NIE TA OD WOKALU)

**Linia 14811-14820:** `recBarAnim` to YouTube recording minigame (`doRecord`), nie wokalna.
- `closeMG()` (linia 27834) i `doRecord()` (linia 14823) clearują interval.
- Wygląda OK, brak ścieżki dziurawej — nie wpływa na vocal MG.

---

## 6. POTENCJALNE INNE PRZYCZYNY (sprawdzone, OK)

### 6.1 `_paused` — OK
`updatePlayer()` linia 8543: `if(_paused) return;`. Pauza jest kontrolowana (toggla P, intro cinematic guards). Recording MG nigdy nie ustawia `_paused`. ✓

### 6.2 `G._cinematicActive` — OK
- Linia 8551: `updatePlayer` blokuje gdy `document.querySelector('[id$="-cinematic"]')` istnieje (DOM-first).
- Recording MG nie tworzy elementów `-cinematic`. ✓
- `G._cinematicActive` jest ustawiane tylko w `showMilestoneCinematic` / intro / flythrough — z cleanup'em. ✓

### 6.3 `G._resting` — OK
- Recording MG nie ustawia `_resting`. ✓
- Stop poprzez `stopRest()`.

### 6.4 `_roomFadeDir` — OK
- `tryInteract()` linia 8697 guarduje `_roomFadeDir!==0`. ✓
- Fade nie blokuje studio bo studio interior jest zamkniętym pokojem (już po wejściu, więc fadeDir=0).

### 6.5 `npcDlgOpen` — OK w studio
- Brak NPC w studio (tylko mic_booth/mixer/computer/exit_st). ✓

### 6.6 `requestAnimationFrame` w `loop` — OK
**Linia 16741:** `animId=requestAnimationFrame(loop);` — `loop` (rysowanie minigry) jest niezależny od głównego `loop`. `cancelAnimationFrame(animId)` w `bClose.onclick` (linia 16676) zatrzymuje go. ✓

### 6.7 Brak mikrofonu / energii
- Linia 17146: `if(!G.mic||G.energy<20) return;` — early return, ale przycisk już jest disabled w UI (linia 16983). Powinno być OK chyba że gracz hackuje przycisk DOM. Niski ryzyk.

---

## 7. PROPOZYCJE FIXÓW

### FIX #1 (KRYTYCZNY) — Reset `display` w `startVocalRecordMG`
**Lokalizacja:** linia 16661.
**Obecny kod:**
```js
function startVocalRecordMG(){
  const panel=document.getElementById('mg-job');panel.innerHTML='';panel.classList.add('on');
```
**Po fix:**
```js
function startVocalRecordMG(){
  const panel=document.getElementById('mg-job');
  panel.style.display='';  // v2.1.x FIX: reset inline display:none pozostawione przez closeMG/_jobMgCleanup poprzednich minigier
  panel.innerHTML='';
  panel.classList.add('on');
  _jobPanelSession=(_jobPanelSession||0)+1;  // spójność z innymi MG
```

To rozwiązuje 95% przypadków freezu (główny root cause).

### FIX #2 (KRYTYCZNY) — Cleanup keydown listener przy Przerwij
**Lokalizacja:** linia 16675-16676.
**Obecny kod:**
```js
const bClose=document.createElement('button');bClose.textContent='← Przerwij';bClose.className='cbtn';
bClose.onclick=()=>{done=true;cancelAnimationFrame(animId);panel.classList.remove('on');renderSoundEngOverlay();openOverlay();};
```
**Po fix:**
```js
const bClose=document.createElement('button');bClose.textContent='← Przerwij';bClose.className='cbtn';
bClose.onclick=()=>{
  done=true;
  cancelAnimationFrame(animId);
  window.removeEventListener('keydown',onSpace);  // FIX: ghost listener
  G._dawVocalMode=false;  // FIX: reset DAW pipeline flag
  panel.classList.remove('on');
  panel.style.display='none';
  renderSoundEngOverlay();
  openOverlay();
};
```

### FIX #3 — Spójny `_jobMgCleanup` dla recording
**Lokalizacja:** po linii 16677 (po append do panelu).
**Dodaj:**
```js
window._jobMgCleanup=()=>{
  done=true;
  cancelAnimationFrame(animId);
  window.removeEventListener('keydown',onSpace);
  G._dawVocalMode=false;
  panel.classList.remove('on');
  panel.style.display='none';
  panel.innerHTML='<div id="mg-job-content"></div>';
};
```
To pozwala globalnym handlerom (ESC, closeMG) bezpiecznie zamknąć recording.

### FIX #4 (DEFENSYWNY) — Zabezpieczenie wszystkich MG entry pointów
**Lokalizacje wymagające `panel.style.display=''` na początku** (audit całego pliku):
- Sprawdzić każde `panel.classList.add('on')` w funkcjach `start*MG()` — szczególnie tę w `startVocalRecordMG`.

### FIX #5 — Wcześniejsze sprawdzenie `mg-job-content` w `closeMG`
**Lokalizacja:** linia 27836-27840 (już jest defensywne, OK).

### FIX #6 — `tryInteract` guard na ghost `.on`
**Lokalizacja:** linia 8694, dodaj:
```js
function tryInteract(){
  // FIX: ghost mg-job z display:none ale class .on — naprawiamy stan
  const mj=document.getElementById('mg-job');
  if(mj && mj.classList.contains('on') && mj.style.display==='none'){
    mj.classList.remove('on');  // sanitize ghost state
  }
  if(overlayOpen()||phoneOpen()||mgOpen()) return;
  ...
}
```
To "ostatnia linia obrony" — jeśli stan się popsuje, gracz naciskając E "naprawi" sam siebie.

---

## 8. MIEJSCA GDZIE PLAYER JEST BLOKOWANY BEZ GUARDU FALLBACK

Audyt wszystkich `_paused=true` / `mg-job.on` / `_cinematicActive=true` bez gwarantowanego cleanup:

| Linia | Kontekst | Status |
|-------|----------|--------|
| 16661 | `startVocalRecordMG` — `panel.classList.add('on')` bez `display=''` | ❌ BUG — freeze |
| 16676 | `bClose.onclick` Przerwij — `panel.classList.remove('on')` BEZ `style.display='none'` ani usuwania listener'a | ⚠️ niespójny ale nie freeze |
| 26220-26222 | Cinematic intro `_cinematicActive=true` + `_paused=true` | ✓ ma cleanup linia 26504+26520 |
| 26563-26564 | Cinematic flythrough — analogicznie | ✓ ma cleanup |
| 9954 | `startRestMG` — `G._resting=true` | ✓ stopRest cleanup |
| 9892+ | `startSleepAnimation` — sleepInterval | ✓ wakeUp cleanup |
| 17138 | `G._dawMode=true` w `dawLaunchBeatMaker` | ⚠️ tylko `_sqFinish` go resetuje, exit przez Porzuć NIE resetuje |
| 17147 | `G._dawVocalMode=true` | ⚠️ tylko `finishVocal` go resetuje, Przerwij NIE resetuje |

---

## 9. PODSUMOWANIE

**Główna przyczyna freezu studio recording:**

`startVocalRecordMG()` w linii 16661 **nie resetuje `panel.style.display`** przed dodaniem klasy `.on`. Inline `display:none` z poprzednich minigier (sequencer, koncert, pizza, etc.) i z `closeMG()` zostaje sticky. Panel ma klasę `.on` (więc `mgOpen()` zwraca true → `updatePlayer()` blokuje ruch), ale jest niewidoczny → gracz "zawiesza się".

**Niedeterminizm wyjaśniony 1:1:** zależy od tego czy gracz wcześniej grał w jakąkolwiek minigrę w `#mg-job` i wyszedł z niej (sequencer Porzuć, koncert, freestyle, breakdance, pizza, etc.) — wtedy `display:none` staje się sticky.

**Wystarczający fix to JEDEN wiersz** w linii 16661 — dodać `panel.style.display='';` przed `panel.innerHTML=''`.

**Zalecane dodatkowe fixy:**
- Usuwać keydown listener w `Przerwij` (#2)
- Wprowadzić `_jobMgCleanup` dla recording (#3)
- Resetować `G._dawVocalMode` na Przerwij (#2)
- Defensywny sanity-check w `tryInteract` (#6)

**Nie wymaga zmiany save'ów** — wszystkie naprawy są runtime/UI, kompatybilne wstecz.
