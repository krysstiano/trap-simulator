# PLAN_INDEX — Spis treści PLAN_SESJA.md

**Status: GOTOWY DO ROZMOWY** (pre-implementation, czekamy na sygnał)

**Pliki dokumentacyjne:**
- `PLAN_SESJA.md` — żywy plan (3500+ linii, 73+ sekcje)
- `PLAN_SESJA_BACKUP_2026-05-10.md` — bezpieczna kopia stanu na dziś
- `PLAN_DEFER.md` — punkty odroczone
- **`PLAN_PROGRESS.md`** — 🔴 ŻYWY TRACKER — status każdej sekcji + checkboxy + cytaty zmapowane
- **`PLAN_44_PUNKTY.md`** — ⏸ ODŁOŻONE — 44 propozycje wizualne. Wracamy po PLAN_SESJA.md. Status: ~14%
- **`PLAN_DECISIONS.md`** — 💎 BALANS — centralny rejestr wszystkich decyzji liczbowych (spójność)
- **`PLAN_GLOSSARY.md`** — 📖 SŁOWNICZEK — terminy, statystyki, konwencje (forma vs kondycja vs fitness!)
- **`PLAN_DEPENDENCIES.md`** — 🔗 GRAPH ZALEŻNOŚCI — co MUSI iść PRZED czym (anti-freeze przed cinematicami)
- **`PLAN_ANTIPATTERNS.md`** — 🚫 LISTA BŁĘDÓW — 20 znanych AP + checklist przed zamknięciem sekcji
- **`PLAN_LOG.md`** — 📓 SESSION LOG — krótkie podsumowania sesji + retrospektywy 5 pytań
- **`PLAN_SECTION_TEMPLATE.md`** — 📋 SZABLON — gotowiec do skopiowania przy starcie nowej sekcji
- `_44_list.txt` — verbatim oryginalna lista 44 z sesji jsonl

**Skrypty automatyzacji:**
- **`_run_smoke.mjs`** — 🟢 REGRESSION SUITE — po każdej sekcji
- **`_start_section.mjs`** — 🚀 AUTO START — backup + screenshot + template (`node _start_section.mjs "NAZWA"`)
- **`_close_section.mjs`** — 🔒 AUTO CLOSE — sprawdza 6 wymagań protokołu (`node _close_section.mjs "NAZWA"`)

---

## ⚠️ PROTOKÓŁ DZIAŁANIA (zawsze)

1. NIE implementujemy bez sygnału użytkownika ("zaczynaj", "implementuj", "lecimy z X")
2. Każdy nowy problem/prośba → cytat + sekcja w PLAN_SESJA.md
3. Schemat: PRZED czytaj sekcję + DEFER → W TRAKCIE realizuj zakres → PO testy + przeczytaj cytat raz jeszcze + PATCH_NOTES
4. PATCH_NOTES — przyjazny język gracza (bez hex/koord/regex/drawXxx())

## 🔒 PROTOKÓŁ ZAMYKANIA SEKCJI (6 wymagań)

Sekcja w PLAN_PROGRESS.md może być oznaczona `✅ DONE` **TYLKO** gdy:

1. ✅ **Wszystkie checkboxy testu akceptacyjnego = PASS** (Playwright)
2. ✅ **Cytat użytkownika 1:1 zmapowany** (każde zdanie → konkretna zmiana)
3. ✅ **Smoke `_run_smoke.mjs` PASS** (brak regresji)
4. ✅ **PATCH_NOTES dopisane** (przyjazny język gracza)
5. ✅ **Memory rules nie naruszone** (sprawdzić MEMORY.md)
6. ✅ **Powiązane sekcje sprawdzone** (np. drzewko ↔ kondycja ↔ forma)

Jeśli choć JEDEN punkt FAIL → status `❌ NIEKOMPLETNE` + raport. **Nigdy nie kłamać że "działa" gdy nie działa.**

## 🛡 GWARANCJE JAKOŚCI (16 reguł)

| Reguła | Memory | Zastosowanie |
|--------|--------|--------------|
| **Protokół 6 wymagań** | `feedback_section_completion_protocol.md` | Każda sekcja DONE |
| **Re-read cytatu + mapping 1:1** | `feedback_quote_mapping.md` | Przed zamknięciem |
| **NIGDY DONE <100%** | `feedback_no_done_below_100.md` | Status NIEKOMPLETNE z raportem |
| **STOP & ASK przy ambivalencji** | `feedback_stop_and_ask.md` | AskUserQuestion zamiast zgadywania |
| **Atomic commits per checkbox** | `feedback_atomic_commits.md` | Duże sekcje: 5-10 commits |
| **Smoke regression po każdej sekcji** | `feedback_smoke_regression.md` | `node _run_smoke.mjs` |
| **Dry-run szkic PRZED kodem** | `feedback_dry_run_first.md` | 5-10 zdań w PROGRESS.md |
| **Time-box per sekcja** | `feedback_time_box.md` | 1h/4h/8h+ wg klasy |
| **Backup index.html PRZED dużą sekcją** | `feedback_backup_before_big.md` | Sekcje >100 linii |
| **Visual diff PRZED/PO** | `feedback_visual_diff.md` | Sekcje wizualne (`_visual_diffs/`) |
| **Health check pre-session** | `feedback_health_check.md` | Smoke + screenshot baseline |
| **Risk register dla dużych sekcji** | `feedback_risk_register.md` | Top 3 ryzyka + mitygacja |
| **Retrospektywa 5 pytań** | `feedback_retrospective_5q.md` | Po każdej sekcji → PLAN_LOG.md |
| **PATCH_NOTES po każdej zmianie** | `feedback_always_update_patch_notes.md` | + przyjazny język |
| **position:fixed → document.body** | `feedback_position_fixed_scale.md` | Cinematici, modale |
| **Park naturalnie** | `feedback_park_natural.md` | NPC w parku, ławka |

## 🔁 WORKFLOW SEKCJI (krok po kroku)

```
1. node _start_section.mjs "NAZWA"
   ↓ (backup + screenshot + template)
2. Skopiuj template → PLAN_PROGRESS.md
   ↓
3. Wypełnij PRZED kodem:
   • Cytat verbatim
   • Dry-run szkic (5-10 zdań)
   • Powiązania z PLAN_DEPENDENCIES.md
   • Risk register (top 3)
   • Anti-pattern check (PLAN_ANTIPATTERNS.md)
   • Time-box
   ↓
4. Sprawdź PLAN_DECISIONS.md → czy wartości spójne
5. Sprawdź PLAN_GLOSSARY.md → czy używam właściwych terminów
   ↓
6. IMPLEMENTACJA — atomic commits per checkbox
   ↓ (po każdym commit: mini-test)
7. Cytat zmapowany 1:1 → PROGRESS.md
   ↓
8. Visual diff after.png (jeśli wizualne)
   ↓
9. PATCH_NOTES dopisane (przyjazny język)
   ↓
10. node _close_section.mjs "NAZWA"
    ↓ (sprawdza smoke + diff + 4 manualne)
11. Jeśli PASS → status DONE w PROGRESS.md
    Jeśli FAIL → status NIEKOMPLETNE z raportem
   ↓
12. Retrospektywa 5 pytań → PLAN_LOG.md
   ↓
13. Update DECISIONS.md (jeśli nowe wartości)
14. Update ANTIPATTERNS.md (jeśli nowy AP)
```

---

## SEKCJE — kolejność w PLAN_SESJA.md

### Stare punkty numerowane (od dołu pliku, posortowane chronologicznie)

| # | Sekcja | Linia |
|---|--------|-------|
| 1-12 | Storyline, kompas, fontanna, mapa, ławka, HUD, pasy, samochody, mapa | 314-998 |
| 13-25 | Audyt gruby, czas, fryzjer, targ, pizzeria, zmywak, polish, godziny, admin, studio/siłownia ucięte | 903-767 |
| 26-39 | Wymogi, wskazówki, siłownia, studio (mikser, akustyka, beat seq), kondycja drzewko, freestyle spot, czas, IG/TW reset, IG sposoby zdobywania, social rebuild, merch, bank, browser confirm | 741-536 |
| 40-50 | Major Label glitch, wyjścia z budynków, sloty zapisu, linie fabularne, logika kontekstowa, Traphouse studio, poradnik animacje, postać sama idzie | 518-394 |
| 55-62 | Storyline opis V2, HUD D.1, Zbyszek, NPC park, save, Traphouse cienie, TRAPLIFE obraz, IKEA | 282-274 |
| 63-70 | Audyt #20, rachunki cykliczne, rep uliczna, wskazówki minigier, XP, mikrofon, sława, globalny rebalans | 228-220 |
| 71-81 | Siłownia rebuild, freestyle ikona, rachunki rebuild, tempo czasu, bieżnia napis, IKEA audyt, audyt bonusów, freestyle balans, sława+rep audyt, auta nigdzie, trawniki | 124-113 |

### Nowe sekcje (najnowsze na końcu pliku)

| Sekcja | Linia |
|--------|-------|
| SYGNALIZATORY ŚWIETLNE | 1017 |
| SIŁOWNIA — krytyczny bug freeze | 1094 |
| NPC PRZECHODZĄCY PRZEZ CROSSWALK | 1135 |
| RANDOM EVENTS — pełen audyt 29 eventów | 1184 |
| SIŁOWNIA — dalsze poprawki | 1262 |
| WYCIĄG — liczba płyt obciążenia | 1328 |
| PRĘDKOŚĆ POSTACI — bug zdrowie | 1369 |
| "VIRAL MOMENT!" — bez postu | 1419 |
| POGODA — emoji HUD, mgła, prędkość | 1460 |
| HUD — zamiana kondycja/drip | 1548 |
| STROJE TRENINGOWE (sportowy + pro) | 1580 |
| LATARNIE — duplikacja + chodnik only | 1650 |
| KREATOR POSTACI — ulepszenie | 1761 |
| APARTAMENT PREMIUM — bug renderowania | 1845 |
| PRĘDKOŚĆ POSTACI — diagonal bug | 1885 |
| ADMIN PANEL — rozszerzenie | 1946 |
| SPOTIFY — system weryfikacji | 2042 |
| FORMA → ENERGIA / KONDYCJA → ZDROWIE | 2182 |
| TOOLTIPS HUD — naprawa opisów | 2282 |
| **FORMA / KONDYCJA 100 — milestone + max +10** | **2397** |
| **SPADEK FORMY/KONDYCJI + Gym Bro** | **2573** |
| SYSTEM UBRAŃ — pełna przebudowa | 2775 |
| **CINEMATIC SIŁOWNIA — pierwszy raz, milestone, comeback** | **2866** |
| **DRZEWKO UMIEJĘTNOŚCI — pełna przebudowa (Power-ups + Evolution)** | **3048** |
| **CINEMATIC MILESTONE — blokada ruchu + anti-freeze** | **3338** |

---

## TEMATYCZNE GRUPY (do priorytetyzacji w rozmowie)

### 💪 BLOK SIŁOWNIA & FORMA/KONDYCJA (ze sobą powiązane)
- SIŁOWNIA krytyczny bug freeze (1094)
- SIŁOWNIA dalsze poprawki — maty, prędkości, sprint (1262)
- WYCIĄG — liczba płyt (1328)
- STROJE TRENINGOWE sportowy/pro (1580)
- FORMA → ENERGIA / KONDYCJA → ZDROWIE (2182)
- FORMA/KONDYCJA 100 — milestone + max +10 (2397)
- SPADEK FORMY/KONDYCJI + Gym Bro (2573)
- CINEMATIC SIŁOWNIA — 3 cinematici (2866)

### 🎮 BLOK CINEMATIC & UI MILESTONES (powiązane technicznie)
- FORMA/KONDYCJA 100 milestone (2397)
- CINEMATIC SIŁOWNIA 3 wersje (2866)
- CINEMATIC MILESTONE — blokada ruchu + anti-freeze (3338)

### 🌳 BLOK DRZEWKO UMIEJĘTNOŚCI (duża samodzielna mechanika)
- 31. Kondycja przeniesiona do drzewka (629) — częściowo zrobione
- DRZEWKO UMIEJĘTNOŚCI — pełna przebudowa: Power-ups + Evolution + 20 nowych skills (3048)

### 🚗 BLOK MIASTO & RUCH
- SYGNALIZATORY ŚWIETLNE (1017)
- NPC CROSSWALK (1135)
- 11. Pasy drogowe (965)
- 10. System samochodów (977)
- LATARNIE chodnik only (1650)
- 81. Trawniki (113)
- POGODA + prędkość (1460)
- PRĘDKOŚĆ DIAGONAL bug (1885)
- APARTAMENT PREMIUM bug (1845)

### 👔 BLOK UBRANIA & WYGLĄD
- KREATOR POSTACI (1761)
- SYSTEM UBRAŃ (2775)
- STROJE TRENINGOWE (1580)
- 19. Fryzjer podgląd (843)
- 15. Strój sportowy bonus (877)

### 📱 BLOK SOCIAL MEDIA & KARIERA
- 36. Social media rebuild (568)
- SPOTIFY weryfikacja (2042)
- "VIRAL MOMENT" bez postu (1419)
- 34. IG/TW daily reset (594)
- 35. IG sposoby zdobywania (586)

### 💰 BLOK GOSPODARKA & PRACE
- 13. Audyt gruby (903)
- 63. Audyt #20 KONTYNUACJA (228)
- 64. Rachunki cykliczne (165)
- 73. Rachunki rebuild — eksmisja (144)
- 67. XP za szybko (196)
- 70. Globalny rebalans (220)
- 78. Freestyle/eventy rebalans (78)

### 🛠 BLOK TECHNICZNE & POLISH
- TOOLTIPS HUD (2282)
- ADMIN PANEL (1946)
- HUD — kolejność (1548)
- RANDOM EVENTS audyt (1184)
- 12. HUD rework (948)
- 22. Polish prac/minigier (793)

---

## CO JEST GOTOWE DO ROZMOWY

Wszystkie sekcje mają:
- ✅ Cytat użytkownika (verbatim)
- ✅ Problem/Cel
- ✅ Konkretny plan implementacji
- ✅ Test akceptacyjny
- ✅ Edge cases (gdzie sensowne)
- ✅ Powiązania z innymi sekcjami
- ✅ Konkretne wartości (linie kodu, koszty, %)

## CZEGO BRAKUJE (do dyskusji w rozmowie)

- **Priorytetyzacja** — co najpierw? (sugestia: bloki w kolejności CINEMATIC ANTI-FREEZE → SIŁOWNIA & FORMA → DRZEWKO → reszta)
- **Skala każdego bloku** — czy DRZEWKO UMIEJĘTNOŚCI to 1 commit czy 5-10 oddzielnych?
- **Decyzje balansowe** — niektóre wartości oznaczone "decyzja: X lub Y"
- **Kolejność cinematicow** — najpierw anti-freeze guard czy najpierw nowe cinematici?
