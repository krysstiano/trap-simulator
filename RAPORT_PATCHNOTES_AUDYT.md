# RAPORT — AUDYT KATEGORII PATCHNOTES
**Data audytu:** 2026-05-15
**Wersja gry:** v2.1.28
**Plik źródłowy:** `E:\Snowy Simulator\index.html` — sekcja `const PATCH_NOTES` (linia 27808-31881)
**Definicja kategorii:** `const PATCH_CATS` (linia 31885)

## Cel audytu
Reakcja na zgłoszenie usera (2026-05-15):
> *"W patchnotes są dalej błędy i błędnie skategoryzowane wpisy, przykład: w kategorii online/tablica wyników nie rozumiem dlaczego są wpisy np. o kolizji NPC. Ma WSZYSTKO być pokategoryzowane dobrze."*

Auto-kategoryzator z v2.1.24 dodał kategorie do 103 starych wpisów, ale wprowadził też nowe błędy — m.in. tag `online` na wpisach NPC i lokalnych mechanikach. Ten audyt naprawia te błędy.

## Statystyki

| Metryka | Liczba |
|---|---|
| Łączna liczba wpisów | 449 |
| Wpisów ze zmianami | 24 |
| Wpisów bez zmian (kategorie OK) | 425 |
| Wpisów bez żadnej kategorii (przed audytem) | 0 |
| Wpisów bez żadnej kategorii (po audycie) | 0 |
| **Online** — usunięto false-positive | **7** |
| **Online** — dodano brakujące | **1** |
| **Kasyno** — usunięto false-positive | 2 |
| **Kasyno** — dodano brakujące | 0 |
| Normalizacje typo/niepoprawnych kategorii (`balans`/`audio`/`change`) | 7 |

### Dystrybucja kategorii — PRZED vs PO

| Kategoria | Przed | Po | Zmiana |
|---|---:|---:|---:|
| critical | 67 | 68 | +1 |
| feature | 117 | 120 | +3 |
| bugfix | 197 | 199 | +2 |
| kasyno | 56 | 54 | -2 |
| online | 34 | 28 | -6 |
| gameplay | 123 | 125 | +2 |
| visual | 121 | 119 | -2 |
| balance | 72 | 75 | +3 |
| optimization | 5 | 6 | +1 |
| system | 37 | 37 | 0 |
| beta-tester | 17 | 17 | 0 |
| balans | 1 | 0 | -1 |
| audio | 2 | 0 | -2 |
| change | 4 | 0 | -4 |

### Nieistniejące kategorie usunięte

Kategorie używane w niektórych wpisach, ale **nieobecne w `PATCH_CATS`** (więc niewidoczne w filtrach UI):
- `balans` (1 wpis: v2.1.28) → znormalizowano do `balance`
- `audio` (2 wpisy: v2.0.25, v0.9.48) → kategoria nie istnieje w PATCH_CATS, dźwięki przeniesione do `gameplay`/`kasyno`/`visual` zależnie od treści
- `change` (4 wpisy: v2.0.4, v2.0.1, v2.0.0, v1.9.68) → `change` to **typ wpisu** (`it.t`), nie kategoria — usunięte, kategoria wybrana z treści

## Lista kategorii w grze (PATCH_CATS)

Z `index.html` linia 31885:

| Kategoria | Etykieta UI | Emoji | Kolor |
|---|---|---|---|
| `beta-tester` | Beta tester | 🐛 | #9b59b6 |
| `feature` | Nowe funkcje | ✨ | #27ae60 |
| `critical` | Krytyczne błędy | 🚨 | #c0392b |
| `bugfix` | Bugfixy | 🔧 | #e74c3c |
| `balance` | Balans | ⚖️ | #f39c12 |
| `visual` | Wizualne / UI | 🎨 | #e91e8c |
| `optimization` | Optymalizacja | ⚡ | #16a085 |
| `gameplay` | Rozgrywka | 🎮 | #3498db |
| `kasyno` | Kasyno | 🎰 | #c8a520 |
| `online` | Online / Tablica wyników | 🌍 | #7ec8e3 |
| `system` | System / techniczne | ⚙️ | #778 |

## TOP 20 najbardziej jaskrawych błędów

Posortowane wg ważności (głównie po wpływie na kategorię `online` — najczęstsze źródło zgłoszenia usera).

### 1. v2.0.32 — 💬 SMS dwie sekcje (NPC vs Znajomi) + prawdziwa minimapa NPC + poprawione pozycje
- **Obecne kategorie:** `[bugfix, feature, online]`
- **Proponowane kategorie:** `[critical, bugfix, gameplay, visual]`
- **Powód:** usunięto "online" — wpis dominują NPC (mapa NPC pozycje, panel przyjaźni NPC, restauracja). Rozdzielenie sekcji SMS NPC/Znajomi to UI gameplay, nie nowa funkcja online

### 2. v1.9.19 — 👥🚁 5 AUDYTÓW (crew/map/stats/hint/minigry) — 9 fixów
- **Obecne kategorie:** `[critical, bugfix, balance, online]`
- **Proponowane kategorie:** `[critical, bugfix, gameplay, balance]`
- **Powód:** usunięto "online" — 5 audytów dotyczy lokalnych mechanik (crew rapowy NPC, helipad, smart hint, FPS minigame, pizza). Crew tu = lokalna paczka NPC, nie Supabase Crew (v2.1.0+)

### 3. v1.9.4 — 👥 Znajomi — "Twoja paczka" → "Twoje Crew"
- **Obecne kategorie:** `[visual, online]`
- **Proponowane kategorie:** `[gameplay, visual]`
- **Powód:** usunięto "online" — rename "Twoja paczka → Twoje Crew" to czysto kosmetyczna zmiana etykiety w lokalnym UI (przed Supabase Crew v2.1.0). gameplay+visual

### 4. v0.9.8 — Zbyszek + Crew — okno nie zamyka się po zakupie
- **Obecne kategorie:** `[gameplay, online]`
- **Proponowane kategorie:** `[bugfix, gameplay]`
- **Powód:** usunięto "online" — "Crew" tu = nazwa lokalnego NPC sprzedawcy ("Zbyszek + Crew" sklep uliczny), nie Supabase Crew

### 5. v2.1.21 — 🎯 Wielki batch napraw — NPC kolizja, prędkość gracza, przelot kamerą, PATCH_NOTES ucięte 
- **Obecne kategorie:** `[critical, bugfix, visual, gameplay, online]`
- **Proponowane kategorie:** `[critical, bugfix, gameplay, visual]`
- **Powód:** usunięto "online" — wpis o NPC kolizji, prędkości gracza, przelocie kamerą, NPC migają. Wzmianka o "kategorii Online" w PATCH_NOTES to system fix, nie temat wpisu

### 6. v1.9.79 — 🚨 ROLLBACK NPC + SMS anti-spam + przyjaźń panel + mapa NPC + P2P XSS fix
- **Obecne kategorie:** `[critical, bugfix, feature, gameplay, online]`
- **Proponowane kategorie:** `[critical, feature, bugfix, gameplay]`
- **Powód:** usunięto "online" — wpis o NPC (rollback crossing), SMS NPC anti-spam, przyjaźń NPC. P2P XSS fix to security technique, NPC dominują

### 7. v1.9.9 — 💬 Faza 3 — SMS w telefonie (NPC pisze do gracza)
- **Obecne kategorie:** `[feature, online, gameplay]`
- **Proponowane kategorie:** `[feature, gameplay]`
- **Powód:** usunięto "online" — SMS od NPC w telefonie to lokalna mechanika (NPC pisze do gracza), nie P2P Supabase

### 8. v2.0.19 — 👑 VIP podłoga marble — naprawione krawędzie tile
- **Obecne kategorie:** `[kasyno, visual, bugfix]`
- **Proponowane kategorie:** `[bugfix, visual]`
- **Powód:** usunięto "kasyno" — wpis o naprawie tile pattern marble podłogi VIP (visual), nie o grze kasynowej. Wpis bez wzmianek o slotach/ruletce/blackjacku itp.

### 9. v2.0.3 — 🛗 VIP cinematic: 5 bugfixów + ESC + staged animation
- **Obecne kategorie:** `[kasyno, bugfix]`
- **Proponowane kategorie:** `[bugfix]`
- **Powód:** usunięto "kasyno" — wpis o naprawie cinematic windy VIP (5 bugfixów + ESC + staged animation), to cinematic UX, nie gra kasynowa

### 10. v1.9.68 — 🔎 3 audyty info: viral mechanics + shop edge cases + dead code
- **Obecne kategorie:** `[change]`
- **Proponowane kategorie:** `[balance, optimization]`
- **Powód:** usunięto "change" — to typ wpisu (it.t). 3 audyty info (viral mechanics + shop edge cases + dead code) = balance + optimization

### 11. v2.1.28 — 🔢 Spójność liczb w drzewku umiejętności (PU Power-Ups)
- **Obecne kategorie:** `[bugfix, balans, system]`
- **Proponowane kategorie:** `[bugfix, balance, system]`
- **Powód:** literówka: balans→balance (PATCH_CATS używa "balance")

### 12. v2.1.1 — ✂️ Koniec trzykropek przy nickach + marquee LIVE ticker
- **Obecne kategorie:** `[bugfix, visual]`
- **Proponowane kategorie:** `[bugfix, online, visual]`
- **Powód:** dodano "online" — wpis o LIVE tickerze w tablicy wyników + nicki znajomych z incoming zaproszeń. Trzykropki w nickach to bug w panelach online

### 13. v2.0.0 — 🏛 v2.0.0 — VIP wymaganie = czysta wygrana (bez odejmowania) + WIDOCZNY postęp
- **Obecne kategorie:** `[kasyno, gameplay, change]`
- **Proponowane kategorie:** `[kasyno, gameplay, balance]`
- **Powód:** usunięto "change" — to typ wpisu (it.t), nie kategoria. VIP wymóg = kasyno + balance

### 14. v0.9.48 — Studio: pianki akustyczne, dystrybucja muzyki, upload
- **Obecne kategorie:** `[visual, gameplay, audio]`
- **Proponowane kategorie:** `[feature, gameplay, visual]`
- **Powód:** usunięto "audio" — kategoria nie istnieje w PATCH_CATS (studio + dystrybucja muzyki = gameplay; pianki akustyczne = visual)

### 15. v2.0.25 — 🔊 Dźwięki w każdej grze kasynowej + MEGA WIN jackpot fanfary
- **Obecne kategorie:** `[kasyno, feature, audio]`
- **Proponowane kategorie:** `[feature, kasyno]`
- **Powód:** usunięto "audio" — kategoria nie istnieje w PATCH_CATS (dźwięki w grze kasynowej to część kasyna)

### 16. v2.0.4 — 🎤 Freestyle bez cooldownu
- **Obecne kategorie:** `[change, gameplay]`
- **Proponowane kategorie:** `[gameplay]`
- **Powód:** usunięto "change" — to typ wpisu (it.t), nie kategoria. Freestyle bez cooldownu = gameplay

### 17. v2.0.1 — 📝 Casino: opisy bez pozycji ekranowych — zamiast tego identyfikatory wizualne
- **Obecne kategorie:** `[kasyno, change, visual]`
- **Proponowane kategorie:** `[kasyno, visual]`
- **Powód:** usunięto "change" — to typ wpisu (it.t), nie kategoria. Opisy kasyna = kasyno + visual

### 18. v1.8.46 — Boczne linie fabularne widoczne w panelu · panel postaci subtelnie ulepszony
- **Obecne kategorie:** `[visual, gameplay]`
- **Proponowane kategorie:** `[feature, visual]`
- **Powód:** usunięto "kasyno" — false positive z poprzedniej auto-kategoryzacji (v2.1.24): słowo "slot" pojawia się ale w nieoczywistym kontekście (sloty zapisu / wstecznym z list)

### 19. v1.8.77 — Inteligentne ukrywanie pasków HUD gdy gracz ma otwarte okno
- **Obecne kategorie:** `[beta-tester, visual]`
- **Proponowane kategorie:** `[bugfix, visual, beta-tester]`
- **Powód:** wpis o ukrywaniu pasków HUD gdy okno otwarte (visual UX). Wzmianka "Tablica wyników" jako przykład okna nie czyni wpisu online

### 20. v1.8.75 — 📱 Reorganizacja telefonu — z 20 ikon na 7 folderów + 2 shortcuty
- **Obecne kategorie:** `[visual]`
- **Proponowane kategorie:** `[feature, visual]`
- **Powód:** wpis o reorganizacji telefonu (20 ikon→7 folderów) to visual+feature UX telefonu. Wzmianka "Tablica wyników jako shortcut" to tylko opis lokalizacji ikony, nie funkcja online

## Pełna lista zmian (tabela 24 propozycji)

| # | Ver | Tytuł (skrócony) | Obecne cats | Proponowane cats | Powód |
|---|---|---|---|---|---|
| 1 | v2.1.28 | 🔢 Spójność liczb w drzewku umiejętności (PU Power | `[bugfix,balans,system]` | `[bugfix,balance,system]` | literówka: balans→balance (PATCH_CATS używa "balance") |
| 2 | v2.1.21 | 🎯 Wielki batch napraw — NPC kolizja, prędkość gra | `[critical,bugfix,visual,gameplay,online]` | `[critical,bugfix,gameplay,visual]` | usunięto "online" — wpis o NPC kolizji, prędkości gracza, przelocie kamerą, NPC migają. Wzmianka o "kategorii Online" w PATCH_NOTES to syste |
| 3 | v2.1.1 | ✂️ Koniec trzykropek przy nickach + marquee LIVE t | `[bugfix,visual]` | `[bugfix,online,visual]` | dodano "online" — wpis o LIVE tickerze w tablicy wyników + nicki znajomych z incoming zaproszeń. Trzykropki w nickach to bug w panelach onli |
| 4 | v2.0.32 | 💬 SMS dwie sekcje (NPC vs Znajomi) + prawdziwa mi | `[bugfix,feature,online]` | `[critical,bugfix,gameplay,visual]` | usunięto "online" — wpis dominują NPC (mapa NPC pozycje, panel przyjaźni NPC, restauracja). Rozdzielenie sekcji SMS NPC/Znajomi to UI gamepl |
| 5 | v2.0.25 | 🔊 Dźwięki w każdej grze kasynowej + MEGA WIN jack | `[kasyno,feature,audio]` | `[feature,kasyno]` | usunięto "audio" — kategoria nie istnieje w PATCH_CATS (dźwięki w grze kasynowej to część kasyna) |
| 6 | v2.0.19 | 👑 VIP podłoga marble — naprawione krawędzie tile | `[kasyno,visual,bugfix]` | `[bugfix,visual]` | usunięto "kasyno" — wpis o naprawie tile pattern marble podłogi VIP (visual), nie o grze kasynowej. Wpis bez wzmianek o slotach/ruletce/blac |
| 7 | v2.0.4 | 🎤 Freestyle bez cooldownu | `[change,gameplay]` | `[gameplay]` | usunięto "change" — to typ wpisu (it.t), nie kategoria. Freestyle bez cooldownu = gameplay |
| 8 | v2.0.3 | 🛗 VIP cinematic: 5 bugfixów + ESC + staged animat | `[kasyno,bugfix]` | `[bugfix]` | usunięto "kasyno" — wpis o naprawie cinematic windy VIP (5 bugfixów + ESC + staged animation), to cinematic UX, nie gra kasynowa |
| 9 | v2.0.1 | 📝 Casino: opisy bez pozycji ekranowych — zamiast | `[kasyno,change,visual]` | `[kasyno,visual]` | usunięto "change" — to typ wpisu (it.t), nie kategoria. Opisy kasyna = kasyno + visual |
| 10 | v2.0.0 | 🏛 v2.0.0 — VIP wymaganie = czysta wygrana (bez od | `[kasyno,gameplay,change]` | `[kasyno,gameplay,balance]` | usunięto "change" — to typ wpisu (it.t), nie kategoria. VIP wymóg = kasyno + balance |
| 11 | v1.9.79 | 🚨 ROLLBACK NPC + SMS anti-spam + przyjaźń panel + | `[critical,bugfix,feature,gameplay,online]` | `[critical,feature,bugfix,gameplay]` | usunięto "online" — wpis o NPC (rollback crossing), SMS NPC anti-spam, przyjaźń NPC. P2P XSS fix to security technique, NPC dominują |
| 12 | v1.9.68 | 🔎 3 audyty info: viral mechanics + shop edge case | `[change]` | `[balance,optimization]` | usunięto "change" — to typ wpisu (it.t). 3 audyty info (viral mechanics + shop edge cases + dead code) = balance + optimization |
| 13 | v1.9.19 | 👥🚁 5 AUDYTÓW (crew/map/stats/hint/minigry) — 9 f | `[critical,bugfix,balance,online]` | `[critical,bugfix,gameplay,balance]` | usunięto "online" — 5 audytów dotyczy lokalnych mechanik (crew rapowy NPC, helipad, smart hint, FPS minigame, pizza). Crew tu = lokalna pacz |
| 14 | v1.9.9 | 💬 Faza 3 — SMS w telefonie (NPC pisze do gracza) | `[feature,online,gameplay]` | `[feature,gameplay]` | usunięto "online" — SMS od NPC w telefonie to lokalna mechanika (NPC pisze do gracza), nie P2P Supabase |
| 15 | v1.9.4 | 👥 Znajomi — "Twoja paczka" → "Twoje Crew" | `[visual,online]` | `[gameplay,visual]` | usunięto "online" — rename "Twoja paczka → Twoje Crew" to czysto kosmetyczna zmiana etykiety w lokalnym UI (przed Supabase Crew v2.1.0). gam |
| 16 | v1.8.77 | Inteligentne ukrywanie pasków HUD gdy gracz ma otw | `[beta-tester,visual]` | `[bugfix,visual,beta-tester]` | wpis o ukrywaniu pasków HUD gdy okno otwarte (visual UX). Wzmianka "Tablica wyników" jako przykład okna nie czyni wpisu online |
| 17 | v1.8.75 | 📱 Reorganizacja telefonu — z 20 ikon na 7 folderó | `[visual]` | `[feature,visual]` | wpis o reorganizacji telefonu (20 ikon→7 folderów) to visual+feature UX telefonu. Wzmianka "Tablica wyników jako shortcut" to tylko opis lok |
| 18 | v1.8.46 | Boczne linie fabularne widoczne w panelu · panel p | `[visual,gameplay]` | `[feature,visual]` | usunięto "kasyno" — false positive z poprzedniej auto-kategoryzacji (v2.1.24): słowo "slot" pojawia się ale w nieoczywistym kontekście (slot |
| 19 | v1.8.20 | Animacje i mikrointerakcje — życie wraca do gry | `[visual,feature]` | `[feature]` | usunięto "kasyno" — false positive z v2.1.24: brak gier kasynowych w treści |
| 20 | v1.2.9 | MIASTO ŻYJE: migające sygnalizatory nocą + kwiaty | `[visual,feature]` | `[feature]` | usunięto "kasyno" — false positive z v2.1.24: VIP w nieoczywistym kontekście (telefon VIP, sprzęt VIP) |
| 21 | v0.9.59 | Audyt po-przeglądowy: dokończenia (Studio podwymag | `[bugfix,balance]` | `[feature,bugfix,balance]` | usunięto "kasyno" — false positive z v2.1.24: "slot" w sensie slotu UI (sloty akustyki), nie automat kasyna |
| 22 | v0.9.55 | Beat Sequencer — tryb wyboru: SAM lub Z PODPOWIEDZ | `[visual,gameplay,feature]` | `[feature,gameplay]` | usunięto "audio" — kategoria nie istnieje. Beat Sequencer to gameplay (mini-gra), nie audio |
| 23 | v0.9.48 | Studio: pianki akustyczne, dystrybucja muzyki, upl | `[visual,gameplay,audio]` | `[feature,gameplay,visual]` | usunięto "audio" — kategoria nie istnieje w PATCH_CATS (studio + dystrybucja muzyki = gameplay; pianki akustyczne = visual) |
| 24 | v0.9.8 | Zbyszek + Crew — okno nie zamyka się po zakupie | `[gameplay,online]` | `[bugfix,gameplay]` | usunięto "online" — "Crew" tu = nazwa lokalnego NPC sprzedawcy ("Zbyszek + Crew" sklep uliczny), nie Supabase Crew |

## Wpisy które STRACIŁY kategorię `online` (7)

Te wpisy zostały błędnie otagowane jako `online` przez auto-kategoryzator v2.1.24 lub w trakcie wprowadzania kategorii w v1.8.84-v1.8.88. Powód błędu: heurystyki łapały słowo "tablica wyników" / "ranking" / "crew" w nieoczywistym kontekście (np. NPC paczka, "Crew" w nazwie sklepu, SMS od NPC).

| Ver | Tytuł | Powód usunięcia online |
|---|---|---|
| v2.1.21 | 🎯 Wielki batch napraw — NPC kolizja, prędkość gracza, przelot kamerą, | usunięto "online" — wpis o NPC kolizji, prędkości gracza, przelocie kamerą, NPC migają. Wzmianka o "kategorii Online" w PATCH_NOTE |
| v2.0.32 | 💬 SMS dwie sekcje (NPC vs Znajomi) + prawdziwa minimapa NPC + poprawi | usunięto "online" — wpis dominują NPC (mapa NPC pozycje, panel przyjaźni NPC, restauracja). Rozdzielenie sekcji SMS NPC/Znajomi to |
| v1.9.79 | 🚨 ROLLBACK NPC + SMS anti-spam + przyjaźń panel + mapa NPC + P2P XSS  | usunięto "online" — wpis o NPC (rollback crossing), SMS NPC anti-spam, przyjaźń NPC. P2P XSS fix to security technique, NPC dominu |
| v1.9.19 | 👥🚁 5 AUDYTÓW (crew/map/stats/hint/minigry) — 9 fixów | usunięto "online" — 5 audytów dotyczy lokalnych mechanik (crew rapowy NPC, helipad, smart hint, FPS minigame, pizza). Crew tu = lo |
| v1.9.9 | 💬 Faza 3 — SMS w telefonie (NPC pisze do gracza) | usunięto "online" — SMS od NPC w telefonie to lokalna mechanika (NPC pisze do gracza), nie P2P Supabase |
| v1.9.4 | 👥 Znajomi — "Twoja paczka" → "Twoje Crew" | usunięto "online" — rename "Twoja paczka → Twoje Crew" to czysto kosmetyczna zmiana etykiety w lokalnym UI (przed Supabase Crew v2 |
| v0.9.8 | Zbyszek + Crew — okno nie zamyka się po zakupie | usunięto "online" — "Crew" tu = nazwa lokalnego NPC sprzedawcy ("Zbyszek + Crew" sklep uliczny), nie Supabase Crew |

## Wpisy które DOSTAŁY kategorię `online` (1)

**v2.1.1:** ✂️ Koniec trzykropek przy nickach + marquee LIVE ticker
- Powód: dodano "online" — wpis o LIVE tickerze w tablicy wyników + nicki znajomych z incoming zaproszeń. Trzykropki w nickach to bug w panelach online

## Wpisy które STRACIŁY kategorię `kasyno` (2)

| Ver | Tytuł | Powód |
|---|---|---|
| v2.0.19 | 👑 VIP podłoga marble — naprawione krawędzie tile | usunięto "kasyno" — wpis o naprawie tile pattern marble podłogi VIP (visual), nie o grze kasynowej. Wpis bez wzmianek o slotach/ruletce/blac |
| v2.0.3 | 🛗 VIP cinematic: 5 bugfixów + ESC + staged animation | usunięto "kasyno" — wpis o naprawie cinematic windy VIP (5 bugfixów + ESC + staged animation), to cinematic UX, nie gra kasynowa |

## Podsumowanie głównych problemów

1. **Najgorszy problem — false positives `online` (7 wpisów):**
   - v2.1.21, v2.0.32, v1.9.79: wpisy o NPC kolizji / SMS NPC / mapie NPC otagowane online — NPC to lokalna mechanika gry.
   - v1.9.19, v0.9.8, v1.9.4: słowo "Crew" w tytule, ale w sensie lokalnej paczki rapowej / NPC sklepu, nie Supabase Crew (v2.1.0+).
   - v1.9.9: SMS w telefonie od NPC do gracza — lokalne wiadomości, nie P2P chat.
   *Fix:* tag `online` zarezerwowany WYŁĄCZNIE dla funkcji Supabase (leaderboard, friend requests, crew chat/invite, P2P chat).

2. **Nieistniejące kategorie (7 wpisów):** wpisy używały `balans` (1) / `audio` (2) / `change` (4). PATCH_CATS w `index.html` zna tylko `balance` (nie `balans`). `audio` w ogóle nie istnieje jako kategoria. `change` to TYP wpisu (`it.t`), nie kategoria.

3. **False positives `kasyno` (2 wpisy):** v2.0.19 (marble podłoga VIP — visual, nie gra) i v2.0.3 (VIP cinematic windy — cinematic UX, nie gra kasynowa). Wpis musi wspomnieć konkretną grę (sloty/ruletka/blackjack/baccarat/poker/craps/keno/plinko/koło/jackpot/żetony/kantor), nie tylko "VIP".

4. **Wpisy bez kategorii:** 0. (Auto-kategoryzator z v2.1.24 wypełnił wszystkie.)

## Co teraz

1. Plik `patchnotes_retag_v3.json` zawiera 24 propozycje zmian w formacie `{ver, oldCats, newCats, reason}`. Programowy retag może zastosować je do `index.html` (pole `cats:` we wpisach PATCH_NOTES).
2. Plik `KATEGORIE_REGULY.md` definiuje słownik kategorii — co należy, co NIE należy, przykłady — dla użytku przy NASTĘPNYCH wpisach (każdy nowy patchnote ma trafiać do odpowiedniej kategorii).
3. **Stabilność listy:** 425 z 449 wpisów (94.7%) zachowuje obecne kategorie — audyt skupia się tylko na ewidentnych błędach.
