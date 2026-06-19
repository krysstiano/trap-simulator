# PLAN_PROGRESS — Żywy tracker pracy nad PLAN_SESJA.md

**Cel:** Status każdej sekcji + checklisty z testów akceptacyjnych. Bez tego punkty wpadają w czarną dziurę.

**Format:** każda sekcja ma:
- Status (`⏸ TODO` | `🟡 IN PROGRESS` | `❌ NIEKOMPLETNE` | `✅ DONE`)
- Datę startu/zamknięcia
- Checkboxy z testu akceptacyjnego (1:1 z PLAN_SESJA.md)
- Cytaty użytkownika zmapowane na implementację (po zakończeniu)
- Bugs found / Open questions

---

## ⚠️ PROTOKÓŁ ZAMYKANIA SEKCJI

Sekcja może być oznaczona ✅ DONE **TYLKO** gdy:
1. ✅ Wszystkie checkboxy testu akceptacyjnego = PASS
2. ✅ Cytat użytkownika 1:1 zmapowany (każde zdanie → konkretna zmiana)
3. ✅ Smoke testy `_run_smoke.mjs` PASS (brak regresji)
4. ✅ PATCH_NOTES dopisane (przyjazny język gracza, bez hex/koord)
5. ✅ Memory rules nie naruszone (sprawdzić MEMORY.md)
6. ✅ Powiązane sekcje sprawdzone (drzewko ↔ kondycja, cinematic ↔ anti-freeze, etc.)

Jeśli choć JEDEN punkt FAIL → status `❌ NIEKOMPLETNE` + raport co działa, co nie, dlaczego.

**Nigdy nie kłamać że "działa" gdy nie działa.** Lepiej "70% gotowe, X i Y nie działa, mam 2 hipotezy" niż false "DONE".

---

## SEKCJE (kolejność wg PLAN_INDEX.md)

---

## 🟡 SESJA 2026-05-11 — BUG #2 NPC crosswalk + BUG #1 screenshots

### Dry-run BUG #2 (NPC trasa przez crosswalk)

**Problem (cytat 2026-05-10):** "NPC nie przechodzą po przejściach dla pieszych tylko obok przejść dla pieszych. Źle jest wytyczona ich trasa."

**Diagnoza:**
- `_crossXranges = [[718,1010],[2158,2450],[3406,3698]]` obejmuje pełną szerokość obszaru wraz z jezdnią
- Faktyczne pasy zebra V (rysowane przez `crosswalkV(...)`) to wąskie 50px slice: 718-768 + 960-1010 (per V-road)
- NPC w wx=864 (środek jezdni) **przechodzi w środku drogi** — nie po pasach
- `Math.random() < 0.005` × 60 ticków = ~16.5% szans flaky smoke FAIL (test ledwo PASS)

**Co konkretnie zmienię:**
1. `_crossXranges` → 6 wąskich pasów: `[[718,768],[960,1010],[2158,2208],[2400,2450],[3406,3456],[3648,3698]]`
2. Szansa decyzji `< 0.005` → `< 0.02` (4× częściej, kompensata wąskiego pasa)
3. Komentarz w kodzie zaktualizuj
4. `dbg_npc_crosswalk.mjs`: NPC z wx=864 (jezdnia) → wx=743 (środek crosswalk W V1)

**Test akceptacyjny:**
- [ ] NPC w teście (wx=743) zaczyna przechodzić w < 6s
- [ ] NPC w wx=864 (środek jezdni) NIE zaczyna przechodzić
- [ ] Smoke 28/28 PASS
- [ ] PATCH_NOTES dopisane przyjaznym językiem
- [ ] Atomic commit

### Random Events audyt — dry-run

**Helper:** `_isHome = currentRoom.startsWith('mieszkanie')` — w funkcjach inline (RANDOM_EVENTS deklarowane raz, cond evaluated at runtime).

**Mapowanie kontekstu (z PLAN_SESJA.md linia 1200-1234):**

| # | Event | Aktualne | Dodam |
|---|---|---|---|
| 1 | Viral moment! | follow>100+post/yt/release | `(_isHome || ulica || studio)` |
| 2 | Sponsorship offer | follow>=1000 | `_isHome` (mail) |
| 3 | Equipment broken | ma sprzęt | `(studio || _isHome)` |
| 4 | Lucky day | ulica | dodaj `timeOfDay<=2` |
| 5 | Hater attack | follow>500 | `(_isHome || ulica)` |
| 6 | Music festival | ma karierę muz | `_isHome` |
| 9 | Manager bonus | ma menadżera | `(_isHome || ulica)` |
| 10 | Police fine | streetRep>50 | `currentRoom==='ulica'` |
| 11 | Collab invite | yt.subs>=500 | `_isHome` |
| 13 | Fan donation | hardcore>10 | `(_isHome || ulica)` |
| 15 | Newspaper feature | fame>=40 | `(_isHome || ulica)` |
| 16 | TV interview | fame>=50 | podwyższyć do `>=60`, `(_isHome || ulica)` |
| 19 | Unexpected bill | money>500 | `_isHome` |
| 25 | Idol w okolicy | fame>=20 | `currentRoom==='ulica'` |
| 26 | Anonimowy darczyńca | streetRep>=20 | `(_isHome || ulica)` |
| 27 | Awaria sprzętu | ma sprzęt | `(studio || _isHome)` |
| 28 | Hejt na Twitter | follow>=2000 | `(_isHome || ulica)` |
| 29 | Niespodziewany gig | fame>=15+energy>=20 | `(_isHome || ulica)` |

Pasywne (zostają zawsze, OK): 7 Fan buys merch, 8 Radio royalty, 12 Viral beat, 17 Subscriber wave, 18 Social media trend.

OK już: 14 Studio accident (ma `currentRoom==='studio'`), 20-24 (mają `ulica`).

**Test akceptacyjny:** smoke 28/28 PASS + spawn gracza w różnych lokacjach z forced eventów per typ — sprawdzić że event w nieodpowiedniej lokacji nie odpala.

---

### Plan BUG #1 — screenshots first, fix later

Wygeneruję 18 obrazów (9 skrzyżowań × 2 stany świateł cars=green/cars=red) i pokażę użytkownikowi do pixel-feedback. Implementacja DOPIERO po jego odpowiedzi.


### 🔧 FAZA 1: INFRASTRUCTURE

#### F1.1 ✅ DONE — CINEMATIC ANTI-FREEZE (2026-05-10)
- Generic guard `[id$="-cinematic"]` w updatePlayer
- Defensive finish + safety cleanup (duration+5s)
- Test: dbg_cinematic_antifreeze.mjs 8/8 PASS
- 3 commits, ~25 min

#### F1.2 ✅ DONE — getMaxStat + clampStat helpers (2026-05-10)
- Nowe funkcje `getMaxStat(name)` i `clampStat(name, val)` (linia 818)
- Zamienione 77 miejsc clamp/Math.min dla zdrowie/energia/głód
- Cykliczny bonus +10/+20 max (forma/kondycja=100)
- Pasywna regen energii działa z dynamic max
- Test: dbg_max_stat.mjs 13/13 PASS
- 3 commits, ~30 min

#### F1.3 ✅ DONE — Migracja G.skills number → object (2026-05-10)
- 6 helpers: getSkillLvl, getSkillPowerUps, hasSkillEvolution + 3 setters
- migrateSkillsToObjectFormat() w load function
- 30 miejsc G.skills.X → getSkillLvl('X') (skrypt _swap_skills.py)
- Stary save działa transparentnie (lazy migration)
- W trakcie wykryto + naprawiono 4 bugi regex (stringi/komentarze/===undefined)
- Test: dbg_skills_migration.mjs 13/13 PASS
- Smoke: 11/11 PASS
- 4 commits, ~50 min (estimated 90 min — szybciej!)

### ✅ FAZA 1 ZAKOŃCZONA (3/3 sekcje DONE)
**Fundamenty gotowe** dla FAZY 2 (siłownia & forma):
- ✅ Anti-freeze guard dla cinematicow
- ✅ getMaxStat / clampStat — dynamiczny max stat
- ✅ G.skills migracja na rozbudowaną strukturę

**Następny krok:** FAZA 2.1 — SIŁOWNIA krytyczny bug freeze (linia 1094)

### 💪 BLOK SIŁOWNIA & FORMA/KONDYCJA — FAZA 2

#### F2.1 ✅ DONE — SIŁOWNIA krytyczny bug freeze (2026-05-10)
- Bug: `lx`/`ly` poza scope w bp_emitSweat (linia 14401)
- Hipoteza #5 z planu trafiona dokładnie
- Naprawa: `let lx, ly` w outer scope + branche assignują (3 linie zmian)
- Test: dbg_silownia_freeze.mjs 6/6 PASS
- Smoke: 12/12 PASS (z dodanym testem)
- 1 atomic commit, ~30 min

#### F2.2 ✅ DONE — SIŁOWNIA dalsze poprawki (2026-05-10)
- 4 podpunkty: kettlebells, km/h, animacja, sprint cap

#### F2.3 ✅ DONE — WYCIĄG płyty obciążenia (2026-05-10)
- for(let i=0;i<8) → for(let i=0;i<totalPlates) + plyty 12px → 10px
- 100kg=10 plyt, 120kg=12 plyt (poprzednio max 8)
- Visual diff dla 5 wag (20/40/80/100/120) wszystkie OK

#### F2.4 ✅ DONE — STROJE TRENINGOWE (2026-05-10)
- Strój sportowy: +30% → +20% (rebalans)
- NOWY strój sport_pro: +25% + 1 dodatkowa sesja siły + 1 cardio (700 zł)
- Limity dynamic (2 lub 3 zależnie od stroju)
- Test 13/13 PASS

#### F2.5 ✅ DONE — FORMA→ENERGIA / KONDYCJA→ZDROWIE (2026-05-10)
- formaEnergyMult = 1 - forma/100*0.05 (max -5%)
- fitnessHealthMult = 1 - fitness/100*0.05
- Liniowe, delikatne, max 5% per stat = 10% razem przy obu 100
- Test 11/11 PASS

#### F2.6 ✅ DONE — FORMA/KONDYCJA 100 milestone + max +10 (2026-05-10)
- Cinematic SZCZYT FORMY (forma=100, pomarańczowy theme)
- Cinematic PEŁNA KONDYCJA (fitness=100, cyjanowy theme)
- Bonus +10 max już wszędzie (przez F1.2 getMaxStat)
- Szpital + adminMaxStats teraz używają getMaxStat (faktycznie 110/120)
- Test 11/11 PASS

#### F2.7 ✅ DONE — SPADEK FORMY + Gym Bro SMS (2026-05-10)
- G._lastGymDay tracking + reset po każdej sesji
- Dzień 3 (2 dni bez): SMS od Gym Bro (4 wariantów wiadomości)
- Dzień 4+ (3+ dni bez): decay 10-20% formy + kondycji
- Niezależnie od poziomu (forma 30 i 100 oba spadają)
- 1 sesja resetuje cykl
- Test 19/19 PASS

#### F2.8 ✅ DONE — CINEMATIC SIŁOWNIA #1 + #3 (2026-05-10)
- #1 TUTORIAL EPIC: pierwsze wejście do siłowni, NIE auto-close, 4 sekcje info
- #3 COMEBACK: powrót do 100 po spadku (cykliczny, 4 warianty komunikatu)
- #2 (milestone) — done w F2.6
- checkFormaComeback / checkFitnessComeback z re-arm flag
- Test 12/12 PASS

### ✅ FAZA 2 ZAKOŃCZONA (8/8 sekcji DONE)
**Cały blok siłownia/forma/kondycja gotowy:**
- ✅ Bug freeze, kettlebells, km/h, animacja, wyciąg płyty
- ✅ Stroje sportowy/PRO (+20%/+25% + extra serie)
- ✅ Mechaniki 5% (forma→energy, kondycja→health)
- ✅ Cinematic milestone forma/kondycja 100 + bonus +10/+20 max
- ✅ Decay "use it or lose it" + Gym Bro SMS
- ✅ 3 cinematici siłowni (tutorial, milestone, comeback)

**Następny krok:** FAZA 3 — DRZEWKO UMIEJĘTNOŚCI (linia 3048) — duża samodzielna sekcja

#### 1. SIŁOWNIA — krytyczny bug freeze (linia 1094) — ZASTĄPIONE PRZEZ F2.1
- Status: ✅ DONE w F2.1
- Test akceptacyjny: (do uzupełnienia w trakcie pracy)
- Cytaty: (do zmapowania)

#### 2. SIŁOWNIA — dalsze poprawki maty/prędkości (linia 1262)
- Status: ⏸ TODO

#### 3. WYCIĄG — liczba płyt obciążenia (linia 1328)
- Status: ⏸ TODO

#### 4. STROJE TRENINGOWE sportowy/pro (linia 1580)
- Status: ⏸ TODO

#### 5. FORMA → ENERGIA / KONDYCJA → ZDROWIE (linia 2182)
- Status: ⏸ TODO

#### 6. FORMA/KONDYCJA 100 — milestone + max +10 (linia 2397)
- Status: ⏸ TODO

#### 7. SPADEK FORMY/KONDYCJI + Gym Bro (linia 2573)
- Status: ⏸ TODO

#### 8. CINEMATIC SIŁOWNIA — 3 cinematici (linia 2866)
- Status: ⏸ TODO

### 🎮 BLOK CINEMATIC & UI MILESTONES

#### 9. CINEMATIC ANTI-FREEZE (PLAN_SESJA.md linia 3338) — FAZA 1.1

##### 📊 Status
- Status: 🟡 IN PROGRESS
- Started: 2026-05-10
- Estimated time: małe (~30 min)
- Backup: `index_backup_cinematic_anti-freeze_2026-05-10.html`

##### 📝 Cytat użytkownika (verbatim)
> "Dodaj żeby podczas cinematic milestone gracz nie mógł chodzić, bo aktualnie słychać kroki gdy gracz trzyma jakikolwiek przycisk chodzenia. Dopilnuj żeby nie było bugu z freeze, że np. cynematics milestone się skończy/zamknie/gracz wyłączy i postać nie będzie mogła chodzić."

##### 🗺 Dry-run szkic
1. **updatePlayer()** linia 5347 — dodam GENERIC strażnik `if(document.querySelector('[id$="-cinematic"]')) return;`
2. **showMilestoneCinematic finish()** linia 15816 — wzmocnię o try/catch + querySelectorAll cleanup
3. **showMilestoneCinematic init** linia 15784 — wzmocnię o querySelectorAll (na wypadek duplikatów)
4. **Safety setTimeout** — duration+5s force cleanup (chroni przed crash w finish)
5. Test dedykowany: dbg_cinematic_antifreeze.mjs — symuluje cinematic + W trzymane → verify pozycja nie zmieniła się + verify ruch wraca po close
6. Smoke regression + visual diff

##### 🎯 Powiązania
- MUSI BYĆ PO: — (brak)
- MUSI BYĆ PRZED: WSZYSTKIE cinematici (FORMA 100, CINEMATIC SIŁOWNIA #1/#2/#3, comeback)
- Wpływa na: każde wywołanie showMilestoneCinematic + każdy nowy cinematic z id `*-cinematic`

##### 🛡 Risk register (top 3)
1. **Ryzyko**: generic guard `[id$="-cinematic"]` przypadkiem złapie inny element → Mitygacja: convention check, zapytam grep czy są takie ID
2. **Ryzyko**: cinematic crashuje + bez safety cleanup → freeze → Mitygacja: setTimeout duration+5s force remove
3. **Ryzyko**: wielokrotny cinematic w krótkim czasie → race → Mitygacja: querySelectorAll w init dla wszystkich istniejących

##### 🔄 Anti-pattern check
- [x] AP-001 cytat zmapowany 1:1 (poniżej)
- [x] AP-004 position:fixed w document.body — sprawdzone (overlay już w body w showMilestoneCinematic)
- [x] AP-013 smoke regression — będzie po
- [x] AP-015 PATCH_NOTES przyjazny język

##### ✅ Test akceptacyjny (1:1 z PLAN_SESJA.md)
- [ ] Cinematic + W trzymany → postać nie rusza się, kroki nie słychać
- [ ] Cinematic + WSAD trzymany → żaden kierunek nie działa
- [ ] Po zamknięciu → kontrola natychmiast bez opóźnienia
- [ ] Crash test → po duration+5s ruch wraca
- [ ] Generic guard pokrywa wszystkie *-cinematic (forma100, gym tutorial, comeback)

##### 🎨 Cytat zmapowany 1:1
- "podczas cinematic milestone gracz nie mógł chodzić" → ⏳ strażnik w updatePlayer
- "słychać kroki gdy gracz trzyma jakikolwiek przycisk chodzenia" → ⏳ guard PRZED `K[]` reading
- "Dopilnuj żeby nie było bugu z freeze" → ⏳ DOM-first guard (samoresetujący) + safety cleanup
- "cynematics milestone się skończy/zamknie/gracz wyłączy" → ⏳ try/catch w finish() + duration+5s force

##### 📦 Sub-commits (atomic)
- [x] commit 3294a0e: `feat(cinematic): generic anti-freeze guard w updatePlayer`
- [x] commit bd6d15b: `feat(cinematic): defensive finish() + safety cleanup w showMilestoneCinematic`
- [x] commit 8d496c0: `test+docs(cinematic): dbg_cinematic_antifreeze.mjs + PATCH_NOTES v0.9.86`

##### 🟢 Auto-checks (z _close_section.mjs)
- [x] [1/6] Smoke regression — 9/9 PASS (włącznie z nowym dbg_cinematic_antifreeze)
- [x] [2/6] Visual diff — _NOT_VISUAL.md placeholder (sekcja logiczna)

##### 🟡 Manual checks
- [x] [3/6] PATCH_NOTES v0.9.86 — przyjazny język gracza
- [x] [4/6] Memory check — wszystkie reguły OK (DOM-first guard zgodny z `position_fixed_scale`)
- [x] [5/6] Cytat mapping 1:1 — wszystkie 4 fragmenty zmapowane:
  - "podczas cinematic milestone gracz nie mógł chodzić" → ✅ strażnik w updatePlayer linia 5347
  - "słychać kroki gdy gracz trzyma jakikolwiek przycisk chodzenia" → ✅ guard PRZED `K[]` reading
  - "Dopilnuj żeby nie było bugu z freeze" → ✅ DOM-first samoresetujący + safety cleanup
  - "cynematics milestone się skończy/zamknie/gracz wyłączy" → ✅ try/catch w finish() + duration+5s force
- [x] [6/6] Powiązane sekcje — sprawdzone PLAN_DEPENDENCIES.md, fundament dla wszystkich cinematicow

##### ✅ Test akceptacyjny — wynik (dbg_cinematic_antifreeze.mjs 8/8 PASS)
- [x] Cinematic + W trzymany → postać nie rusza się ✅ (TEST 2: pos 217.6→217.6)
- [x] Cinematic + WSAD trzymany → żaden kierunek nie działa ✅ (TEST 4: generic guard)
- [x] Po zamknięciu → kontrola natychmiast bez opóźnienia ✅ (TEST 3: pos zmienia się od razu)
- [x] Crash test → ruch wraca naturalnie po cinematic ✅ (TEST 5)
- [x] Generic guard pokrywa wszystkie *-cinematic ✅ (TEST 4: custom test-cinematic ID)

##### 📊 Final status
- Status: ✅ **DONE** (6/6 protokołu PASS)
- Closed: 2026-05-10
- Actual time: ~25 min (estimated 30 min)

##### 🔍 Retrospektywa (5 pytań)
1. **Co poszło dobrze?**
   - Generic guard `[id$="-cinematic"]` to lepsze rozwiązanie niż per-ID — pokrywa intro+milestone+future
   - DOM-first + samoresetujący — żadne dodatkowe stany do synchronizacji
   - Test dedykowany 5 scenariuszy zaimplementowany od razu (8/8 PASS)
   - Safety cleanup (duration+5s) — naprawdę robust

2. **Co poszło źle?**
   - `_close_section.mjs` zgłosił FAIL na visual diff dla sekcji logicznej (false positive)
   - Naprawione: dodany `_NOT_VISUAL.md` placeholder + obsługa w skrypcie

3. **Czy dry-run szkic był dokładny?**
   - TAK — 6 punktów dry-run pokryły implementację 1:1 + dodatkowo wyłapałem że trzeba ulepszyć skrypt close

4. **Czy znalazłem nieprzewidziane bugi?**
   - Drobny: `_close_section.mjs` nie wspierał sekcji niewizualnych → naprawione
   - Nowy AP do dodania: AP-021 — narzędzia wymagają obsługi N/A dla sekcji niewizualnych

5. **Co wniosę do następnej sekcji?**
   - Workflow działa też dla sekcji logicznych (po fix z _NOT_VISUAL.md)
   - Test dedykowany Playwright dla każdej "trudnej do testowania" mechaniki — bardzo cenne
   - Generic patterns (jak `[id$="-cinematic"]`) > per-instance — przy konwencji nazewnictwa

**Czas:** estimated 30 min vs actual ~25 min
**Sub-commits:** 3 (atomic per checkbox)
**Smoke regressions naprawione:** 0
**Nowe anti-patterns:** AP-021 (narzędzia muszą wspierać N/A dla sekcji niewizualnych) → dodane do PLAN_ANTIPATTERNS.md

### 🌳 FAZA 3: DRZEWKO UMIEJĘTNOŚCI ✅ DONE (5/5 podsekcji)

#### F3.1 ✅ DONE — Audyt + balans odporności (2026-05-10)
- Audyt: wszystkie 11 prac/karier MAJĄ działające bonusy (AP-008 = false positive)
- Rebalans odporności: -20%/pkt → -10%/pkt (max -30% zamiast OP -60%)
- 1 commit, 5 min

#### F3.2 + F3.3 ✅ DONE — Power-ups + Evolution system (2026-05-10)
- 15 skills × 3 power-ups + 1 evolution dodane do SKILL_DEF
- Helpery _PU(), _EVO() dla DRY
- buyPowerUp() + buyEvolution() — sequence + money + cinematic
- UI tile rozszerzony (200px, status PU/3, korona 👑 dla evo)
- Test: 13/13 PASS

#### F3.4 ✅ DONE — 16 nowych skills w 4 nowych kategoriach (2026-05-10)
- 🧠 Intelekt: czytanie, kreatywnosc, logika, skupienie
- 💰 Ekonomia: negocjacje, inwestycje, hazard, networking
- 🎨 Styl & Scena: drip_master, scena, flow, foto
- 🏃 Fizyczne: sila, bieg, medytacja, dieta
- Każdy z PEŁNYMI 3 power-ups + 1 evolution
- Faktyczne efekty: czytanie (+5%/pkt XP), sila (+5%/pkt forma gain)
- Test: 11/11 PASS

#### F3.5 ✅ DONE — Epicki UI (zakładki + kolory) (2026-05-10)
- 7 zakładek kategorii z indywidualnymi kolorami akcentu
- Gradient header per kategoria + glow na aktywnej zakładce
- Liczniki postępu (X/Y pkt + evos 👑) w badges zakładek
- Tytuł "DRZEWKO UMIEJĘTNOŚCI" z gradientem
- Tylko aktywna kategoria pokazywana (zamiast wszystkich 31 naraz)
- switchCharPanelCat() pamięta wybór

### ✅ FAZA 3 ZAKOŃCZONA — drzewko REALNIE GRUBA mechanika
- 31 skills × 3 power-ups + 1 evolution = ~124 etapy progresji
- 4 nowe kategorie + 7 zakładek + epicki UI
- Cinematic milestone przy każdej ewolucji
- Test 24/24 PASS (powerups + nowe_skills)
- Smoke: 19/19 PASS

**Następny krok:** FAZA 4 — POLISH & NPC (NPC Park, Apartament, Prędkość, Pogoda, Latarnie, Kreator)

### 🔧 FAZA 4: POLISH & NPC ✅ DONE (6/6)

#### F4.1 ✅ DONE — NPC PARK basic (gardener → business + palety)
#### F4.2 ✅ DONE — APARTAMENT PREMIUM bug (sx → 7/11 deterministyczne)
#### F4.3 ✅ DONE — PRĘDKOŚĆ DIAGONAL (normalizacja √2 — koniec 41% szybciej po skosie)
#### F4.4 ✅ DONE — POGODA (emoji ☁️ 🌧️ 🌫️ ⛈️ + mgła 0.22 → 0.10 + brak wpływu na P.spd verified)
#### F4.5 ✅ DONE — LATARNIE (5 specjalnych miejsc, koniec duplikacji z streetLamps)
#### F4.6 ✅ DONE — KREATOR POSTACI (240x340 podgląd + 🎲 Random + 6 odcieni skóry + 8 kolorów ubrania/spodni/butów)

### 🚗 BLOK MIASTO & RUCH

#### 11. SYGNALIZATORY ŚWIETLNE (linia 1017)
- Status: ⏸ TODO

#### 12. NPC CROSSWALK (linia 1135)
- Status: ⏸ TODO

#### 13. POGODA + prędkość (linia 1460)
- Status: ⏸ TODO

#### 14. PRĘDKOŚĆ DIAGONAL bug (linia 1885)
- Status: ⏸ TODO

#### 15. APARTAMENT PREMIUM bug (linia 1845)
- Status: ⏸ TODO

#### 16. LATARNIE chodnik only (linia 1650)
- Status: ⏸ TODO

#### 17. NPC W PARKU — zróżnicowanie + ławka (najnowsze)
- Status: ⏸ TODO

### 👔 BLOK UBRANIA & WYGLĄD

#### 18. KREATOR POSTACI (linia 1761)
- Status: ⏸ TODO

#### 19. SYSTEM UBRAŃ (linia 2775)
- Status: ⏸ TODO

### 📱 BLOK SOCIAL MEDIA & KARIERA

#### 20. SPOTIFY weryfikacja (linia 2042)
- Status: ⏸ TODO

#### 21. "VIRAL MOMENT" bez postu (linia 1419)
- Status: ⏸ TODO

#### 22. RANDOM EVENTS audyt (linia 1184)
- Status: ⏸ TODO

### 🛠 BLOK TECHNICZNE & POLISH

#### 23. TOOLTIPS HUD (linia 2282)
- Status: ⏸ TODO

#### 24. ADMIN PANEL (linia 1946)
- Status: ⏸ TODO

#### 25. HUD — zamiana kolejności kondycja/drip (PLAN_SESJA.md linia 1548) — PILOT INFRASTRUKTURY

##### 📊 Status
- Status: 🟡 IN PROGRESS
- Started: 2026-05-10
- Estimated time: małe (~30 min) — pilot test workflow
- Backup: `index_backup_hud_swap_kondycja_drip_2026-05-10.html`

##### 📝 Cytat użytkownika (verbatim z PLAN_SESJA.md)
> "Zamień kolejność na HUD tak żeby forma i kondycja były obok siebie (zamień kondycje i drip miejscami)."

##### 🗺 Dry-run szkic
1. Zamienię miejscami linie 219 i 220 w `index.html` (drip ↔ kondycja)
2. Aktualnie: forma(218) → drip(219) → kondycja(220)
3. Po: forma(218) → kondycja(219) → drip(220)
4. ID `hvdrip` i `hvfit` zostają — `updateHUD` w linii 15972-15973 czyta przez `getElementById` więc działa niezależnie
5. Test: screenshot HUD przed/po + verify że oba paski pokazują wartości

##### 🎯 Powiązania (z PLAN_DEPENDENCIES.md)
- MUSI BYĆ PO: — (brak zależności)
- MUSI BYĆ PRZED: HUD rework (#12), TOOLTIPS HUD (linia 2282)
- Wpływa na: visual layout HUD

##### 🛡 Risk register (top 3)
1. **Ryzyko**: ID się myli (hvdrip vs hvfit) → Mitygacja: nie ruszam ID, tylko swap całych DIVów
2. **Ryzyko**: stylowanie się rozjedzie (min-width:60px) → Mitygacja: zachowuję inline style
3. **Ryzyko**: inny kod HUD oczekuje konkretnej kolejności → Mitygacja: grep'em sprawdzone, brak innych miejsc

##### 🔄 Anti-pattern check
- [x] AP-001 mapping cytatu — 1 zdanie cytatu = 1 zmiana
- [x] AP-013 smoke regression — uruchomię po
- [x] AP-015 PATCH_NOTES przyjazny język

##### ✅ Test akceptacyjny (1:1 z PLAN_SESJA.md)
- [ ] HUD pokazuje statystyki w kolejności: 💪 Forma → 🏃 Kondycja → 💎 Drip
- [ ] Wszystkie wartości aktualizują się poprawnie po zmianie
- [ ] Pozostałe elementy HUD nie zostały dotknięte

##### 🎨 Cytat zmapowany 1:1 (po implementacji)
- "Zamień kolejność na HUD" → ⏳ swap linii 219↔220
- "tak żeby forma i kondycja były obok siebie" → ⏳ forma(218) + kondycja(nowa 219) sąsiadują
- "(zamień kondycje i drip miejscami)" → ⏳ drip(219→220), kondycja(220→219)

##### 📦 Sub-commits (atomic)
- [x] commit 5ad8b71: `feat(hud): swap kondycja/drip — forma+kondycja obok siebie (PILOT)`

##### 🟢 Auto-checks (z _close_section.mjs)
- [x] [1/6] Smoke regression — 8/8 PASS
- [x] [2/6] Visual diff — before.png + after.png present

##### 🟡 Manual checks
- [x] [3/6] PATCH_NOTES — v0.9.85 dopisane (przyjazny język, bez hex/koord)
- [x] [4/6] Memory check — żadna reguła nie naruszona (sprawdzone MEMORY.md, PLAN_DECISIONS.md, PLAN_GLOSSARY.md)
- [x] [5/6] Cytat mapping 1:1 — wszystkie 3 fragmenty zmapowane:
  - "Zamień kolejność na HUD" → ✅ swap linii 219↔220 w index.html
  - "tak żeby forma i kondycja były obok siebie" → ✅ DOM order: [..., fitness, kondycja, drip]
  - "(zamień kondycje i drip miejscami)" → ✅ drip(219→220), kondycja(220→219)
- [x] [6/6] Powiązane sekcje — sprawdzone PLAN_DEPENDENCIES.md, brak konfliktów

##### ✅ Test akceptacyjny — wynik
- [x] HUD pokazuje statystyki w kolejności: 💪 Forma → 🏃 Kondycja → 💎 Drip ✅
- [x] Wszystkie wartości aktualizują się poprawnie (verified screenshot: forma=85, kondycja=75, drip=42) ✅
- [x] Pozostałe elementy HUD nie zostały dotknięte (smoke 8/8 PASS) ✅

##### 📊 Final status
- Status: ✅ **DONE** (6/6 protokołu PASS)
- Closed: 2026-05-10
- Actual time: ~20 min (estimated 30 min — szybciej!)

##### 🔍 Retrospektywa (5 pytań)
1. **Co poszło dobrze?**
   - Workflow zadziałał płynnie — _start_section.mjs i _close_section.mjs działają
   - Smoke testy chronią przed regresją (8/8 PASS po zmianie)
   - Visual diff pokazuje obiektywnie zmianę (before.png vs after.png)
   - Cytat zmapowany 1:1 — żaden fragment pominięty
   - Atomic commit z pełnym kontekstem

2. **Co poszło źle?**
   - System reminder o TaskCreate pojawiał się wielokrotnie — ignorowałem słusznie (mała sekcja, nie potrzeba TaskList)
   - Drobne: musiałem stworzyć nowy dbg_hud_swap.mjs (nie miałem dedykowanego skryptu HUD-only screenshotu)

3. **Czy dry-run szkic był dokładny?**
   - TAK — implementacja pokryła się 1:1 z dry-run (5 punktów, wszystkie zrealizowane bez surprises)

4. **Czy znalazłem nieprzewidziane bugi?**
   - NIE — sekcja prosta, bez ukrytych problemów
   - Confirmation: ID hvdrip/hvfit faktycznie działają niezależnie od kolejności DOM

5. **Co wniosę do następnej sekcji?**
   - Workflow potwierdzony jako praktyczny — można ruszać z większymi sekcjami
   - Dla sekcji wizualnych warto utworzyć dedykowany dbg skrypt jeśli istniejący nie pokazuje konkretnego elementu
   - _close_section.mjs dobrze wskazuje co manualne, co auto

**Czas:** estimated 30 min vs actual ~20 min (szybciej dzięki workflow)
**Sub-commits:** 1 (mała sekcja)
**Smoke regressions naprawione:** 0 (brak)
**Nowe anti-patterns:** brak — workflow zadziałał

#### 26. PRĘDKOŚĆ POSTACI bug zdrowie (linia 1369)
- Status: ⏸ TODO

### 📜 STARSZE PUNKTY (numerowane #1-#81)

Patrz PLAN_INDEX.md grupa "Stare punkty numerowane" — do uzupełniania w miarę pracy.

---

## 📊 STATYSTYKI

| Status | Liczba sekcji |
|--------|---------------|
| ⏸ TODO | 26 nowych + ~70 starych |
| 🟡 IN PROGRESS | 0 |
| ❌ NIEKOMPLETNE | 0 |
| ✅ DONE | 0 |

**Update**: po każdej sekcji ja (Claude) aktualizuję ten plik.

---

## 🔄 SZABLON SEKCJI W TRAKCIE PRACY

Gdy zaczynam sekcję X, tu wpisuję:

```markdown
#### X. NAZWA SEKCJI (linia Y w PLAN_SESJA.md)
- Status: 🟡 IN PROGRESS
- Started: 2026-MM-DD HH:MM
- Cytat zmapowany:
  - "fragment A" → ✅ change in line 12345
  - "fragment B" → 🟡 in progress
  - "fragment C" → ❌ blokada — pytanie do użytkownika
- Test akceptacyjny:
  - [x] Punkt 1 PASS (Playwright dbg_xxx.mjs)
  - [ ] Punkt 2 — TODO
- Smoke regression: dbg_start.mjs PASS, dbg_park.mjs PASS, dbg_silownia.mjs PASS
- Bugs found: ...
- Open questions: ...
- PATCH_NOTES dopisane: ❌
```

Po zakończeniu:
```markdown
- Status: ✅ DONE
- Closed: 2026-MM-DD HH:MM
- Sub-commits: feat: A, feat: B, fix: C
- Final report: wszystko PASS, wszystkie cytaty zmapowane
```

LUB jeśli niekompletne:
```markdown
- Status: ❌ NIEKOMPLETNE
- Reason: nie udało się zaimplementować Y
- Done: A, B
- Not done: Y (powód: ...)
- Hipotezy: ...
- Decision needed from user: ...
```
