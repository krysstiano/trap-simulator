# PLAN ROZWOJU SNOWY SIMULATOR — 8 KROKÓW

**Utworzony**: 2026-05-18 (sesja v2.1.220 → przerwana, kontynuacja jutro)
**Stan gry**: v2.1.220 (Mega Villa SE south + UI tooltipy + balans fixy)
**Status**: PENDING — wszystkie 8 kroków do implementacji, kolejność ustalona

## Kolejność wykonywania (priorytetowa)

```
1. Tier 2-4 venues       MAŁA       TOP
2. Stats dashboard       ŚREDNIA    TOP
3. A&R hunting           MAŁA       Wysoki
4. Streaming chart       MAŁA       Wysoki
5. Music video           ŚREDNIA    Średni
6. Beef system           DUŻA       Średni  (zależy od 4)
7. Reality TV show       DUŻA       Niski
8. Dialog tree NPC       BARDZO DUŻA Niski (głównie content writing)
9. Crew rozszerzenia     ŚREDNIA    Średni  (crew system juz istnieje)
```

**Skala złożoności**:
- **MAŁA**: jedna sekcja kodu (1-3 funkcje, 1 const array, 1 phone app) — kilkadziesiąt edycji w pliku
- **ŚREDNIA**: mechanika + UI + balans (2-5 sekcji, integracja z existing) — kilka iteracji edit/test
- **DUŻA**: nowy system od zera (state machine, minigame, multiple files) — wiele iteracji
- **BARDZO DUŻA**: głównie content writing (300+ dialogów) — większość pracy poza kodem

---

## KROK 1: Tier 2-4 koncert venues (MAŁA, TOP) — ⏸️ ODŁOŻONE (2026-05-18)

> **STATUS**: ODŁOŻONE — plan był oparty na nieaktualnym założeniu.
>
> **Konflikt znaleziony 2026-05-18**: Festiwal i World Tour JUŻ ISTNIEJĄ u Marcina (Booking Agent), nie w Sali Koncertowej:
> - Marcin Festiwal: 5000 zł, 70 fame, 10k fans, scena 4+, cooldown 7 dni
> - Marcin World Tour: 50k fans, 10k zł, scena 4+, multiday 5 miast (Warszawa→Berlin→Londyn→NYC→Tokio)
>
> Plan zakładał dodanie ich jako NOWE venues (fame 200/350, scena 6/7) — duplikat.
>
> **Do decyzji w przyszłej sesji**:
> 1. Konsolidacja — przenieść Marcin venues do Sali Koncertowej (refactor 2 miejsc)
> 2. Tylko Stadium między Arena (55) a Festiwal (70) — minimalny refactor
> 3. 3 nowe tier po World Tour (Coachella/Wembley/Megastar) — najwięcej kodu
>
> Pełna analiza i opcje w sesji 2026-05-18 (memory `snowy-session-2026-05-18`).

**Problem (oryginalny)**: Aktualnie tylko Mała Scena (fame 10), Klub (25), Arena (55). Wszystkie Tier 0. Late game gracz spamuje Arenę bez progresji.

**CO**: Dodać 3 venues w `venues` array (L22209):
```js
{name:'Stadium',    cost:15000, fameReq:120, scenaReq:5, fansReq:15000,  earnMin:8000,  earnMax:25000, desc:'10k osób. Stadiumowy hit.'},
{name:'Festival',   cost:50000, fameReq:200, scenaReq:6, fansReq:50000,  earnMin:18000, earnMax:60000, desc:'Festival headline. Tysięczny tłum.'},
{name:'World Tour', cost:200000,fameReq:350, scenaReq:7, fansReq:200000, earnMin:50000, earnMax:120000,desc:'Trasa świat. Multiday event.', tour:true},
```

**Wymagania dodatkowe**:
- Scena skill tree rozszerzyć z 5 → 7 nodes (Scena 6 "Stadium Headliner", Scena 7 "World Tour Star")
- World Tour aktywuje multiday tour state machine (3-7 dni gry)
- ROOMS.ulica decor — nowa ikona Stadium na mapie (opcjonalne)

**Balans**:
- Earn skaluje przez fame_mult clamp 1.0, Tier 4 +20%, drip cap, Crown +20%
- Hard cap 100k zł nadal aktywny — Festival/World Tour saturate cap

**Pliki**: L22209-22213 venues, raper skill tree scena (RAPER_ST_DEF L21460), tour state machine

**Ryzyko**: Concert formula explosion (już capped), Tour mode wymaga state machine

---

## KROK 2: Statistics dashboard (ŚREDNIA, TOP)

**CO**: Phone app "📈 Stats" z wykresami.

**Sekcje**:
- **Career**: total earnings, koncerty, tracki, days played
- **Music**: top track (most streams), avg streams/track, viral hits
- **Fame progress**: chart fame przez dni gry (SVG/Canvas)
- **Money flow**: avg/day, max single day, total earned/spent
- **Achievement progress**: X/113 unlocked
- **Time**: hours played real-time

**Dane**:
- Większość już trackowane (G.totalEarned, G.albumsReleased, G.events.performed itd.)
- Brakuje: daily history (fame curve). Trzeba rozpocząć tracking od teraz.
- Daily snapshot save w `nextPeriod`: `G._dailyStats.push({day, fame, money, fans})`
- Rolling window 30 dni (cap save bloat)

**Pliki**:
- Phone app w `renderPhoneApp('stats')`
- SVG/Canvas chart rendering
- Daily snapshot tick w nextPeriod
- Defensive init dla G._dailyStats

**Ryzyko**: Save bloat (mitigated by rolling 30-day cap)

---

## KROK 3: Owned label A&R hunting (MAŁA, Wysoki) — ✅ DONE (2026-05-18 v2.1.223)

> **Status**: DONE. 3 hidden artists (Lex Underground / MC Drop / Kid Wave) + 3 evolutions (lex_breakout / mc_drop_hit / kid_wave_star). Random event "Street talent discovery" (chance 0.008, cooldown 30 dni). 25/25 testów PASS, 0 JS errors. PATCH_NOTES v2.1.223 dodane.

**CO**: Random event "Street talent" — gracz spotyka unknown rapera na ulicy, podpisuje za 5k zł (bargain).

**Mechanika**:
- Random event `chance:0.008`, condition `currentRoom==='ulica'&&fame>=100`
- 3 nowi artyści `hidden:true` w SIGNABLE_ARTISTS:
  - `lex_riser` (300 zł/day, evolve 15 dni)
  - `mc_drop` (350 zł/day, evolve 15 dni)
  - `kid_wave` (400 zł/day, evolve 15 dni)
- Sign przez random event flow (modal "Podpisać?")
- Limit: 1 sign / 30 dni gry

**Balans**:
- Hidden artists base income mniejszy (300 zł vs 800 zł) ale evolve 2× szybciej
- Cena: 5k zł zamiast 50k zł
- Long-term ROI: hidden ~equivalent po evolution

**Pliki**:
- SIGNABLE_ARTISTS rozszerzony o 3 hidden + flag
- Nowy RANDOM_EVENTS entry "Street talent discovery"

**Ryzyko**: Niska. Addition do existing system.

---

## KROK 4: Streaming chart / top 10 NPC rivals (MAŁA, Wysoki) — ✅ DONE (2026-05-18 v2.1.224)

> **Status**: DONE. CHART_NPCS z 10 fictional rappers (Kid Drip → GOAT Eternal, fame 50-490, fans 15k-9M). Phone app "🏁 Chart" w folder Statystyki. Daily NPC growth ~1% per dzień (random 0.5-1.5%). Player rank #1-11 z fame×1000+fans score. Reset w resetG + doPrestige. 18/18 testów PASS, 0 JS errors. PATCH_NOTES v2.1.224 dodane.

**CO**: Phone app "📊 Chart" — top 10 fictional rappers, gracz widzi swoje miejsce.

**Mechanika**:
```js
const CHART_NPCS = [
  {id:'kid_drip',  fame:50,  fans:15000},
  {id:'lex_local', fame:120, fans:60000},
  {id:'mc_riser',  fame:180, fans:200000},
  // ...10 total
  {id:'phantom',   fame:490, fans:8000000},  // #1 endgame
];
function computeChartScore(rapper) {
  return rapper.fame * 1000 + rapper.fans;
}
```

**Flow**:
- Player score = G.fame × 1000 + G.fans
- NPC scores rosną daily (~1% per dzień gry)
- Player rank 10 → 1 jako progresja

**Balans/unlock**:
- Top 10 (≥#10): unlock sponsor (Tier 1)
- Top 3 (≥#3): unlock global label
- #1: special achievement + cinematic

**Pliki**: Nowy const CHART_NPCS, daily NPC growth tick, phone app "chart"

**Ryzyko**: NPC growth balance (mitigated by slow ~1%/day)

---

## KROK 5: Music video production (ŚREDNIA, Średni) — ✅ DONE (2026-05-18 v2.1.225)

> **Status**: DONE. MUSIC_VIDEO_SCENARIOS (street/luxury/concert) + CREW_TIERS (basic 5k / mid 15k / premium 50k). Quality calc: crew + vibe + Crown +10 + drip +5 + random 0-20 (max 100). Effects: Q 0-50 ×1.2 streams 5% viral, 50-80 ×1.8 15%, 80-100 ×3.0 30% +10 fame. Permanent boost na track.streams + Spotify + YT. Modal UI w "Moja muzyka" + cooldown 7 dni. 22/22 testów PASS. BUG #34 fix: compound key (name+releaseDay) dla duplicate names. PATCH_NOTES v2.1.225.

**CO**: Po wydaniu singla — możliwość nagrania teledysku. Wpływa na streams ×1.5-3 + chance viral.

**Flow**:
1. Wybierz **scenario** (street/luxury/concert)
2. **Lokacja** (Park/Mansion/Studio/Drip District)
3. **Ekipa** (cinematographer, choreograph) — koszt zł
4. **Minigame**: storyboard sequence (5 scenes, klick correct frame)
5. **Quality score** (0-100) zależy od ekipy + minigame + outfit + drip
6. Result: +X% streams, viral chance %, +fame addFame

**Balans**:
- Koszt: 5k zł (basic) → 50k zł (premium)
- Quality 0-50: streams ×1.2, viral 5%
- Quality 50-80: streams ×1.8, viral 15%
- Quality 80-100: streams ×3, viral 30%, +fame addFame(10)
- Cooldown: 1 video/track + 7 dni między tracks

**Pliki**:
- MUSIC_VIDEO_SCENARIOS const
- `recordMusicVideo()` function po publishSingle
- Storyboard minigame canvas
- YouTube subs integration (+X subs per video)

**Ryzyko**: Niskie. Additive, isolated.

---

## KROK 6: Beef system / diss tracki (DUŻA, Średni) — ✅ DONE (2026-05-18 v2.1.226)

> **Status**: DONE. Reuse CHART_NPCS jako rivals. startBeef(): player 50-100 + Crown +15 + drip 100+ +10, NPC 40-90 + heavyweight +20 (gdy fame > player+50). Win: 5-15% NPC fans (cap 50k) + 10-30 fame. Loss: +50 hejterzy, -5 fame, -20 mood. Cooldowny: 7d global, 30d same NPC, max 5/NPC. Cap historii 50 entries. Phone app "🥊 Beef" w Statystyki folder (gating fame 100+). 19/19 testów PASS, 0 JS errors. PATCH_NOTES v2.1.226.

**CO**: NPC rapers (top 10 chart). Gracz wyzwa NPC na beef. Diss track minigame, NPC odpowiada. Winner = fans + fame.

**Mechanika**:
```js
const NPC_RAPERS = [/* re-use CHART_NPCS z kroku 4 */];
```

**Flow**:
1. Phone app "🥊 Beef" → wybierz rivala (limited 1/tydz)
2. Diss track minigame (rhythm + line picker) — score 0-100
3. NPC odpowiada (random 40-90)
4. Compare scores → winner
5. Cooldown 7 dni

**Balans**:
- Power gap > 30 = handicap (NPC +20 score)
- Win: 5-15% NPC fans converted, +10-30 fame
- Loss: +50 hejterzy, -5 fame, -20 mood
- Max 5 beefs / NPC, cooldown 30 dni same NPC

**Pliki**:
- Phone app "beef" (gating fame 100+)
- Reuse freestyle minigame engine
- Random events: NPC challenges player (rare)

**Ryzyko**: Balance OP (mitigated by limits)
**Zależność**: Krok 4 (CHART_NPCS reuse)

---

## KROK 7: Reality TV show / talent contest (DUŻA, Niski) — ✅ DONE (2026-05-19 v2.1.227)

> **Status**: DONE. Random event "TV Talent Contest / Voice Star" (chance 0.005, fame 50+, cooldown 30 dni). Apply modal z accept/decline. 7 dni gry × 3 rundy auto-score (Freestyle/Theme/Live). Per-round score 50-150 z bonusami (sława/drip/Crown/streetRep/scena). Day 7: final ranking gracz vs 5 NPC, top 3 nagrody (100k/50k/20k + 20/10/5 sławy, #1 Prestige Skill Point), wszyscy +5k fans + cinematic. G._tvContest state + history cap 20. Reset w resetG + doPrestige. 19/19 testów PASS. PATCH_NOTES v2.1.227.

**CO**: Limited 7-dni event (1× per 30 dni gry). Konkurencja z 5 NPC.

**Flow**:
1. Random event "TV Talent Contest" co 30 dni (chance 0.005)
2. Aplikuj (wymaga fame 50+)
3. **7-dni gry**: 3 rundy
   - **Round 1** (day 1-2): Freestyle przed jury
   - **Round 2** (day 3-4): Wybór tematu/song
   - **Round 3** (day 5-7): Live performance — koncert
4. Score → top 3 nagrody

**Balans**:
- 1st: 100k zł, +20 fame, Prestige Skill Point, sponsor lock 2 marek
- 2nd: 50k zł, +10 fame
- 3rd: 20k zł, +5 fame
- Wszyscy: +5k fans

**Pliki**:
- TVContest state machine (start/round1/2/3/end)
- Random event entry
- Phone app "📺 TV Talent" tymczasowa (gdy active)
- Cinematic dla wygranej

**Ryzyko**: 7-dni forced engagement (mitigated by gracz może odrzucić)

---

## KROK 8: Dialog tree z NPC (BARDZO DUŻA, Niski) — ✅ DONE v2.1.228 (2026-05-19)

> **DONE**: 3 NPC × 5 stepów = 15 dialogów (marcin/kamil/producent). Każdy step ma prereq (fame/fans/streetRep/tracks/friendship) + 2-3 opcje wyboru z różnymi rewardami (money/fame/fans/streetRep/xp/friendship). Phone home → folder NPC → 📖 Historie.
>
> **Testy**: dbg_dialog_tree_v228.mjs 24/24 PASS. Regression v222-v227 — wszystkie PASS.
>
> **Komponenty**:
> - State: `G._dialogProgress` (resetG + doPrestige reset)
> - Const: `DIALOG_TREES` (3 NPCs × 5 steps)
> - Funkcje: `_dialogGetStep`, `_dialogPrereqMet`, `window.dialogChooseOption`, `renderPhoneStories`
> - UI: Phone → folder npcs → `📖 Historie` app
> - Cinematic: `showMilestoneCinematic` po step 5
> - Defensive: invalid NPC + invalid option idx → no crash
> - PATCH_NOTES v2.1.228 (6 itemów)



**CO**: Marcin/Kamil/Anita/Janka/Drake/itd. — story arc 5-10 dialogów per NPC.

**Mechanika**:
```js
const DIALOG_TREES = {
  marcin: {
    arc:[
      {step:1, prereq:fame>=10,  text:'Powiedz Marcinowi o pierwszym koncercie',
       options:[
         {label:'Pierwszy koncert!', fn:()=>addFriendship('marcin',10)},
         {label:'Nic specjalnego',   fn:()=>addFriendship('marcin',2)},
       ]},
      // ...10 steps
    ]
  }
};
```

**Balans**:
- Friendship + fame thresholds per step
- Reward: friendship +5-20 per step
- Final step (10): unique reward (sponsor lock, fame +50, achievement)

**Pliki**:
- DIALOG_TREES const
- openNPCDialogue enhancement
- G._dialogProgress tracking

**Ryzyko**: Bardzo dużo content writing (10 NPC × 10 dialogów × 3 opcje = 300+ dialogów).

---

## KROK 9: Rozszerzenia Crew system (ŚREDNIA, Średni)

**Kontekst**: Crew system **JUŻ ISTNIEJE** w grze (G.playerCrew, 5 tabel Supabase, max 4 członków, 4 weekly challenges, chat, invites, kick). Te punkty to **rozszerzenia** nad istniejącym systemem.

**Możliwe rozszerzenia D (gdyby user chciał)**:
- **Crew vs crew leaderboard** — ranking po sumie fame/zarobków crewu
- **Payouty za completed weekly challenges** — aktualnie tracking jest, ale brak rewardu (sprawdzić w kodzie i dodać payout logic)
- **Custom crew logo/emoji** — gracz wybiera emoji + customowy opis crewu
- **Crew levels** — po X completed challenges → unlock features (np. większy crew size 4 → 6, więcej challenges/tydz, exclusive chat themes)

**Wymagania**:
- Backend: 1-2 nowe Supabase tabele (`crew_rankings` lub query agregat) + ewent. `crew_payouts_log`
- Frontend: zakładka "Ranking" w phone app crew + reward UI + customization UI
- Logic: payout w `_crewAddProgress` przy completed challenge

**Pliki**:
- L46071+ `renderPhoneCrew()` — dodać sekcje (Ranking, Customization)
- L46270 `CREW_CHALLENGE_TYPES` — może rozszerzyć o trudniejsze tier (1M zł challenge dla top crewów)
- Nowe Supabase queries

**Ryzyko**: Niskie — addition do existing system, nie redesign

---

## Zależności między krokami

```
Krok 1 (venues) — STANDALONE
Krok 2 (stats) — STANDALONE
Krok 3 (A&R) — STANDALONE
Krok 4 (chart) ─┐
                ├─► Krok 6 (beef) reuse CHART_NPCS
Krok 5 (video) — STANDALONE (uses track system)
Krok 7 (TV) — STANDALONE
Krok 8 (dialog) — STANDALONE
```

## Tabela podsumowująca

| # | Feature | Złożoność | Impact | Status |
|---|---------|-----------|--------|--------|
| 1 | Tier 2-4 venues | MAŁA | 🔥 Wysoki | PENDING |
| 2 | Stats dashboard | ŚREDNIA | 🔥 Wysoki | PENDING |
| 3 | A&R hunting | MAŁA | 🟡 Średni | PENDING |
| 4 | Streaming chart | MAŁA | 🟡 Średni | PENDING |
| 5 | Music video | ŚREDNIA | 🟡 Średni | PENDING |
| 6 | Beef system | DUŻA | 🔥 Wysoki | PENDING (zależy od 4) |
| 7 | Reality TV | DUŻA | 🟢 Niski | PENDING |
| 8 | Dialog tree | BARDZO DUŻA | 🟢 Niski | PENDING |
| 9 | Crew rozszerzenia | ŚREDNIA | 🟡 Średni | PENDING (Crew core już istnieje ✅) |

---

## Co zrobić na początku jutrzejszej sesji

1. Przeczytać ten plik (PLAN_8_KROKOW.md)
2. Sprawdzić aktualny stan gry (v2.1.220+)
3. Potwierdzić z user który krok zaczynamy (domyślnie Krok 1: Tier 2-4 venues)
4. Implementacja iteracyjnie: build → syntax check → Playwright test → patch notes (BEZ trybu Amper)
5. Po każdym kroku oznaczyć status PENDING → DONE w tym pliku

---

**TRYB AMPER**: WYŁĄCZONY (od 2026-05-17). PATCH_NOTES bez [Amper]/beta-tester/reporter.
