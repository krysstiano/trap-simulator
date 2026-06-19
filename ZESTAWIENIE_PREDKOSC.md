# ZESTAWIENIE PRĘDKOŚCI GRACZA
Data: 2026-05-15
Wersja gry: v2.1.28
Plik: `E:\Snowy Simulator\index.html`

---

## 1) Centralna formuła

Cała prędkość gracza jest przeliczana w jednym miejscu — `updateHUD()`, raz na klatkę.

**Linia 26658:**
```js
P.spd = Math.min(2.5, (2.0 + (G.fitness||0)/100*0.5 + _kondBonus) * getBiegSpeedBonus());
```

Czyli:

```
P.spd = min( 2.5 ,  ( BAZA + FITNESS_BONUS + KONDYCJA_SKILL_BONUS ) × BIEG_MULT )
```

- `P.spd` to **pixele / klatka** (nie per sekunda — patrz pkt 6).
- Ruch jest aplikowany w `updatePlayer()` (linie 8544–8547): `dx = ±P.spd` per oś.
- **CAP = 2.5 px/klatka**. To twardy sufit — nawet pełny rozwój nie przekroczy.

---

## 2) Bazowa prędkość

| Co | Wartość | Gdzie |
|----|---------|-------|
| Init `P.spd` przy starcie postaci | **1.8 px/klatka** | linia 865 (`const P = { … spd:1.8 … }`) |
| Stała w formule HUD (baza ruchu) | **2.0 px/klatka** | linia 26658 |
| Hard cap maksymalny | **2.5 px/klatka** | linia 26658 (`Math.min(2.5, …)`) |

Wartość `1.8` z linii 865 jest tylko inicjalna — natychmiast po pierwszym tickcie `updateHUD()` zostaje nadpisana wyliczeniem z linii 26658. W praktyce „bazowa" w grze to **2.0**.

---

## 3) Pełna lista mnożników modyfikujących prędkość

### A) Mnożniki AKTYWNE w kodzie (działają)

| # | Źródło | Wartość pojedyncza | Max bonus | Linia | Forma matematyczna |
|---|--------|---------------------|-----------|-------|--------------------|
| 1 | **Forma fitness (`G.fitness`)** | +0.005 / pkt fitness | **+0.5** (przy fitness=100) | 26658 | `(G.fitness/100) * 0.5` — bonus ADDYTYWNY do bazy 2.0 |
| 2 | **Skill `kondycja` (drzewko)** | +0.06 / lvl (tabela: 0, 0.06, 0.12, 0.18, 0.24, 0.30) | **+0.30** (lvl 5/5) | 26655 + 26658 | `_kondBonus` — bonus ADDYTYWNY do bazy 2.0 |
| 3 | **Skill `bieg` (lvl, max 3)** | +5% / lvl | **+15%** (lvl 3/3) | 1223 (`getBiegSpeedBonus`) | `_sk('bieg') * 0.05` — bonus MULTIPLIKATYWNY |
| 4 | **PU `bieg` (power-ups, 3 sloty)** | +10% / PU (10/20/30 wg PU labels) | **+30%** (3 PU kupione) | 1223 | `_pu('bieg') * 0.10` — MULTIPLIKATYWNY |
| 5 | **Evo `bieg` „Maraton"** | +20% (flag boolean ×1) | **+20%** | 1223 + 37614 | `_evo('bieg') * 0.20` — MULTIPLIKATYWNY |
| 6 | **Auto (G.car) GDY w aucie** | mnoży `dx, dy` przez `car.speed` | **×2.25** (Bugatti Chiron) | 8552 + 18866–18873 | `dx *= boost; dy *= boost;` — aplikowany NA `P.spd` po wyliczeniu HUD, tylko gdy `currentRoom==='ulica' && G._inCar` |
| 7 | **Diagonal normalization (√2)** | mnoży obie osie przez `1/√2 ≈ 0.7071` przy skosie | — | 8549–8550 | nie zwiększa prędkości — koryguje overspeed przy ruchu po skosie |
| 8 | **Cinematic (blokada ruchu)** | `return` z `updatePlayer` | prędkość = 0 podczas dowolnego cinematic | 8542 | `if(document.querySelector('[id$="-cinematic"]')) return;` |

### B) Ghost / NIE działają (UI obiecuje, kod nie aplikuje)

| Źródło | Obietnica (UI / opis) | Stan w kodzie |
|--------|------------------------|---------------|
| **Skill `kondycja` w SKILL_DEF (linia 37553)** | `desc:'Wolniejszy spadek energii + szybszy ruch'` + `eff:'spadek energii'` + `perLvl:8` (op:'-') | **Tooltip mówi "+6%/poziom prędkości (max +30%)"** (linia 27564). **Kod faktycznie aplikuje +0.06 ADDYTYWNIE per lvl (max +0.30 do bazy 2.0)**, NIE „+6%". Przy bazie 2.0 to faktycznie ~+3% per lvl, NIE +6%. **Niespójność tooltip vs kod** — opis kondycji można nazwać GHOST częściowo (+ szybszy ruch działa, ale wartość procentowa w tooltipie jest myląca). |
| **Skill `kondycja` SKILL_DEF eff** | `eff:'spadek energii'` — w UI drzewka pokazany jako skill „spadku energii" | Faktycznie aplikuje BONUS PRĘDKOŚCI (linia 26655) oraz spadek energii (`_kondLvl` używany w decay). Funkcjonalność prędkości UKRYTA w SKILL_DEF — nie widać tego w drzewku. |
| **Pogoda (deszcz/śnieg/mgła)** | Niektórzy gracze sądzili że pogoda spowalnia | **POTWIERDZONE PLACEBO** — audit v1.2.7 (linia 30602–30604): „prędkość przy wszystkich 6 pogodach IDENTYCZNA". |
| **Zdrowie / głód / energia** | Można by się spodziewać że niskie zdrowie spowalnia | **POTWIERDZONE PLACEBO** — audit v1.2.4 (linia 30625–30628): „prędkość postaci NIE zależy od zdrowia". |
| **Pijany / naćpany / drip / buty / outfit** | Brak | **Nie znaleziono żadnego kodu modyfikującego `P.spd` z tych źródeł**. Buty/sneakers/outfit wpływają tylko na `G.drip` (sławę), nie na ruch. |

### C) Eventy / inne potencjalne źródła

Sprawdzono pełny grep `P.spd` w całym pliku — **JEDYNE 5 wystąpień** to:
- Linie 8544–8547 (input → dx/dy)
- Linia 26658 (centralna formuła)

**Nie ma żadnego eventa losowego, pościgu, alkoholu, narkotyków, deszczu, śniegu, mgły ani innego trybu który modyfikuje `P.spd`.**

---

## 4) Skumulowany max

### Nowy gracz (0% rozwoju)
```
P.spd = (2.0 + 0 + 0) * 1.0 = 2.0 px/klatka
```

### Pełny rozwój skilli ruchu (BEZ auta)
```
P.spd = (2.0 + 0.5 + 0.30) * (1 + 0.15 + 0.30 + 0.20)
      = 2.80 * 1.65
      = 4.62  →  CAP 2.5 px/klatka
```
**Wniosek:** już sam `getBiegSpeedBonus = 1.65` (skill 3/3 + PU 3/3 + Evo) z samą bazą 2.0 dałby `2.0 × 1.65 = 3.30` — przekracza cap 2.5. Cap 2.5 oznacza że **WIĘKSZOŚĆ górnych bonusów BIEGA jest zmarnowana** od pewnego momentu rozwoju. To "wash" bonusów BIEGA.

### Faktyczny próg po którym cap się aktywuje
`(2.0 + fitness_b + kond_b) × bieg_mult >= 2.5`

- Sam skill `bieg` lvl 1 (+5%) i baza 2.0 → 2.10 px/klatka. Cap nie aktywny.
- Skill `bieg` lvl 3 (+15%) bez nic innego → 2.30. Cap nie aktywny.
- Skill bieg 3/3 + PU 3/3 (= ×1.45) bez nic → 2.90 → **CAP 2.5**.
- Skill bieg 3/3 + PU 3/3 + Evo (= ×1.65) bez nic → 3.30 → **CAP 2.5**.

Z momentem zakupu PU 2/3 dla biega — gracze już są pod capem.

### Z autem (`G._inCar=true`, na ulicy)

| Auto | car.speed | Efektywna prędkość (cap 2.5 × boost) |
|------|-----------|--------------------------------------|
| Maluch | 1.15 | 2.875 px/klatka |
| Seat Ibiza | 1.25 | 3.125 |
| BMW E46 | 1.40 | 3.50 |
| Audi RS6 | 1.55 | 3.875 |
| Porsche 911 | 1.70 | 4.25 |
| Lamborghini | 1.85 | 4.625 |
| Ferrari | 2.00 | 5.00 |
| **Bugatti Chiron** | **2.25** | **5.625 px/klatka** |

Auto MNOŻY już ostateczne `P.spd` (po capie) przez `car.speed` w `updatePlayer()` (linia 8552). Cap 2.5 NIE dotyczy ruchu w aucie — boost auto-prędkości aplikowany do `dx, dy` po fakcie.

### W pikselach / sekundę i tile / sekundę (60 FPS, T=48)

| Stan | px/klatka | px/s (60 FPS) | tile/s (T=48) |
|------|-----------|---------------|---------------|
| Nowy gracz | 2.0 | 120 | 2.5 |
| Max bez auta (cap) | 2.5 | 150 | 3.125 |
| Max + Bugatti | 5.625 | 337.5 | ~7.03 |

PATCH_NOTES wpis (linia 27836) potwierdza: „Test: 112 px/sec stabilna prędkość bez wahań" — to odpowiada ~1.87 px/klatka, więc test był na nowym graczu bez bonusów.

---

## 5) Ghost mnożniki (UI obiecuje, kod nie aplikuje) — podsumowanie

1. **Kondycja `desc:'+ szybszy ruch'` w SKILL_DEF linia 37553** — POŁOWICZNIE GHOST. Bonus prędkości DZIAŁA (linia 26655), ale opis w SKILL_DEF mówi że to skill „spadku energii" (`eff:'spadek energii'`, `op:'-'`, `perLvl:8`). UI drzewka pokazuje że to skill spadku energii, a faktycznie ma DWA efekty (energia + prędkość). Tooltip w HUD (linia 27564) z kolei mówi „+6%/poziom prędkości" — ale kod aplikuje +0.06 ADDYTYWNIE do bazy 2.0, czyli faktycznie ~+3% per lvl. **Niespójna komunikacja: opis SKILL_DEF nie wspomina o procentach, tooltip HUD podaje błędną wartość +6%, kod robi +0.06 addytywnie.**

2. **Pijany / naćpany** — w kodzie NIC nie modyfikuje `P.spd` z tych stanów. Jeśli gra ma stany „alkohol/dragi" w innych mechanikach (np. animacja, ekran), to nie ma to wpływu na prędkość ruchu.

3. **Pogoda (deszcz/śnieg/mgła/burza)** — formalnie zaudytowane jako PLACEBO (linia 30602). Confirmed nie wpływa.

4. **Zdrowie / głód / energia** — formalnie zaudytowane jako PLACEBO (linia 30625). Confirmed nie wpływa.

5. **Drip / outfit / buty / sneakers** — drip wpływa wyłącznie na sławę (przez `getDripFameBonus`). Brak związku z prędkością.

---

## 6) Pułapki i obserwacje

### A) Bonus liczony PER KLATKĘ, nie per sekundę
PATCH_NOTES v2.1.26 (linia 27836): „Wycofany delta-time fix z v2.1.17 (powodował niestabilność). Powrót do klasycznej `P.wx += dx` (ruch per frame)". 

**Konsekwencja:** prędkość gracza zależy od FPS przeglądarki. Na 60 FPS = 120–150 px/s, na 30 FPS (browser throttling, np. minimized tab) = 60–75 px/s. **Wciąż jest to klasyczny bug nie-delta-time** (linia 27908 sam to przyznaje), ale rollback zrobiony bo delta-time wprowadzał własną niestabilność.

### B) Cap 2.5 unieważnia większość bonusu BIEGA
Bez auta, max ADDYTYWNY (fitness 100 + kond 5) = 2.80. Już sama baza 2.0 × bieg full (1.65) = 3.30. **Praktycznie każdy gracz powyżej PU 1/3 biega trafia w cap 2.5 i dalsze inwestycje BIEGA są bezwartościowe** (poza autem).

To może być świadoma decyzja designera — w PATCH_NOTES (linia 30709): „Nowy max prędkości (forma 100 + skill kondycja 5/5): 2.0 + 0.5 + 0.3 = 2.8. Wcześniej max był 2.5." — sugeruje że projektowali do 2.8 ale potem cofnęli się do 2.5 (linia 30235 v1.7.8: „Max prędkość gracza dorzucona z 3.0 do 2.5 — gracz na maks ulepszeniach był nadal za szybki zgodnie z PLAN_SESJA #75"). **Bieg jako skill stał się więc paradoksalnie najsłabszy — bo cap go zjada.**

### C) `P.spd` przeliczane co klatkę
Funkcja `updateHUD()` wywoływana jest w pętli, więc `P.spd` jest aktualizowane non-stop. Każda zmiana `G.fitness` lub kupno skilla biega natychmiast widoczne w ruchu.

### D) Cinematic = stop ruchu
Jeśli gracz przebywa w trybie cinematic (intro, milestone, gym tutorial, prestige), `updatePlayer()` ma early return. Prędkość efektywnie = 0.

### E) Diagonal — ważna naprawa
Linia 8549–8550: dzielenie przez √2 przy skosie. Bez tego gracz po skosie biegał ~41% szybciej (bug naprawiony, patrz PATCH_NOTES 30708 — historyczna kompensata bazowej 1.7→2.0 po naprawie diagonal).

### F) Czas inicjalizacji
W linii 865 `P.spd:1.8` — to wartość bootstrap. W pierwszym ticku `updateHUD()` zostanie nadpisana. Jeśli ktoś szukał „baza = 1.8" — to jest GHOST. Faktyczna baza w grze to **2.0**.

---

## 7) Najwyższa możliwa prędkość — checklist co trzeba zrobić

Żeby osiągnąć cap 2.5 px/klatka (bez auta):

1. **Fitness 100** (bieżnia w siłowni do 100/100) → bonus +0.5
2. **Skill `kondycja` 5/5** (drzewko) → bonus +0.30
3. (Mnożnik BIEGA jest praktycznie zmarnowany przez cap — wystarczy `bieg` 1/3)

Z autem Bugatti dodatkowo `×2.25` ponad cap — efektywne 5.625 px/klatka = ~7 tile/s.

---

## 8) Pliki / linie kluczowe

| Plik | Linia | Co |
|------|-------|----|
| index.html | 864–868 | Inicjacja `P` (player object) z `spd:1.8` |
| index.html | 1188–1190 | Helpery `_sk`, `_pu`, `_evo` |
| index.html | 1221–1224 | Funkcja `getBiegSpeedBonus()` — mnożnik biega |
| index.html | 8542 | Cinematic guard (blokada ruchu) |
| index.html | 8544–8547 | Aplikacja `P.spd` jako dx/dy z input |
| index.html | 8549–8550 | Normalizacja diagonal (×1/√2) |
| index.html | 8552 | Boost auta (`G.car.speed`) gdy `G._inCar` |
| index.html | 18866–18873 | Definicje aut + `car.speed` 1.15–2.25 |
| index.html | 26654–26658 | **Centralna formuła `P.spd`** |
| index.html | 27564 | Tooltip kondycji (mówi +6%/poziom — niezgodny z kodem) |
| index.html | 37553 | SKILL_DEF kondycja (opis: „+ szybszy ruch", ale eff:'spadek energii') |
| index.html | 37612–37614 | SKILL_DEF bieg + PU + Evo „Maraton" |

---

## 9) TL;DR

**Wzór:**
```
P.spd = min(2.5, (2.0 + G.fitness/100·0.5 + KondLvlBonus) × (1 + bieg·0.05 + PU·0.10 + Evo·0.20))
```

**Bonusy które działają (w kolejności od najmocniejszego):**
1. Auto (×1.15 – ×2.25, aplikowane po capie) — POZA capem
2. Fitness 100 — +0.5 addytywnie
3. Skill `kondycja` 5/5 — +0.30 addytywnie
4. Skill `bieg` + PU + Evo — multiplikatywne ×1.65 ALE praktycznie zjadane przez cap 2.5

**Cap:** 2.5 px/klatka (bez auta). Z autem brak capa.

**Ghosty:** opis kondycji niespójny (SKILL_DEF vs tooltip vs kod); pogoda/zdrowie potwierdzone placebo; pijany/naćpany/drip/buty nie wpływają.
