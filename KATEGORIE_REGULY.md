# KATEGORIE PATCH_NOTES — Reguły przyjęcia i odrzucenia

**Data:** 2026-05-15
**Wersja gry:** v2.1.28
**Plik źródłowy:** `E:\Snowy Simulator\index.html` — `const PATCH_CATS` (linia 31885)

Ten dokument definiuje **co należy** i **co NIE należy** do każdej z 11 kategorii PATCH_NOTES. Stosować przy KAŻDYM nowym wpisie, by od razu trafiał do właściwej kategorii.

---

## Zasady ogólne

1. **Każdy wpis MA mieć co najmniej 1 kategorię** (pole `cats: [...]`). Wpisy bez kategorii nie pojawiają się w filtrach poza "Wszystkie".
2. **Kategoria opisuje TEMAT wpisu**, nie typ wpisu. Typ wpisu (`it.t`) to osobne pole — `add`/`feature`/`fix`/`change`/`critical`.
3. **Nie mieszać typu wpisu z kategorią:** `change` to typ (`it.t='change'`), NIE kategoria. Jeśli `cats:[...]` zawiera `change` — błąd.
4. **Maksymalnie 4 kategorie na wpis** (UI wytrzymuje więcej, ale czytelność cierpi).
5. **Kolejność w `cats:[...]`** powinna szanować ważność: krytyczne > feature > bugfix > obszar tematyczny (kasyno/online/gameplay/visual) > meta (balance/optimization/system/beta-tester).
6. **Tytuł najważniejszy** — kategorię wybieraj głównie po tytule. Treść items doprecyzowuje.

---

## Lista 11 kategorii (PATCH_CATS)

| Klucz | Etykieta UI | Emoji | Kolor |
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

---

## `beta-tester` — Beta tester

**Co tu należy:**
- Wpisy konsolidujące zgłoszenia od konkretnego beta-testera (Amper, Mirro itp.).
- Pole `reporter:'NickGracza'` lub `reporters:['Amper','Mirro']` ustawione we wpisie.
- Naprawy wykonane W ODPOWIEDZI na zgłoszenie usera (cytat usera w opisie).

**Co NIE należy:**
- Wpisy bez wskazania konkretnego reportera.
- Generyczne audyty wewnętrzne ("5 AUDYTÓW" — to nie zgłoszenie usera, to praca asystenta).

**Przykład pasujący:** v1.8.86 "Konsolidacja zgłoszeń Ampera (zapis po śmierci, merch cap, YT-stream cross, Ctrl+S)".

---

## `feature` — Nowe funkcje

**Co tu należy:**
- Nowa funkcja, mechanika, apka, budynek, NPC, minigra, system.
- Pierwsza implementacja czegoś (NIE rebalans istniejącego).
- Tytuł zawiera: "Nowy/Nowa", "Nowość", "Dodano", "Wprowadzam", "MVP", "rewrite/przebudowa pełna".
- Co najmniej jeden item ma typ `feature` lub `add`.

**Co NIE należy:**
- Naprawy istniejących funkcji (to `bugfix` lub `balance`).
- Zmiany wizualne istniejących elementów (to `visual`).
- Drobne tweaki balansu (to `balance`).

**Przykład pasujący:** v2.1.23 "🤢 Mechanika PRZEJEDZENIA — anti-exploit XP z jedzenia" (nowy stat G.overeat + 3 stopnie efektów + HUD tooltip).

---

## `critical` — Krytyczne błędy

**Co tu należy:**
- Bugi blokujące rozgrywkę (game-break, crash, soft-lock).
- Money/XP exploity (poważne — pozwalające ominąć ekonomię).
- Save-corruption / data-loss.
- Tytuł zawiera "KRYTYCZNY", "CRITICAL", "RAGE QUIT", "game break", lub item ma `t:'critical'`.

**Co NIE należy:**
- Pomniejsze bugi UI (to `bugfix`).
- Sugerowane usprawnienia (to `balance`).

**Przykład pasujący:** v1.9.84 "🎰 KRYTYCZNY Koło Fortuny rebalance" — EV=6.375× exploit, gracz wygrywał średnio 6× stawki. Nigdy bez kategorii `kasyno` (bo dotyczy gry kasynowej).

---

## `bugfix` — Bugfixy

**Co tu należy:**
- Naprawy błędów w istniejącej funkcji (nie krytycznych).
- Co najmniej jeden item ma typ `fix`.
- Tytuł zawiera "fix", "naprawa", "naprawiony/a/e", "poprawka", "rozwiązanie".

**Co NIE należy:**
- Nowe funkcje (to `feature`).
- Rebalans (to `balance`).
- Wpis NIE może mieć WYŁĄCZNIE `bugfix` jeśli temat to konkretny obszar (kasyno/online/gameplay/visual) — dodaj też ten obszar.

**Przykład pasujący:** v2.1.25 "🏃 Prędkość gracza naprawiona + ławki anti-exploit" (krytyczny `[critical, bugfix, gameplay]`).

---

## `balance` — Balans

**Co tu należy:**
- Rebalanse, tuning, nerf, buff.
- Anti-exploit logic (limits, capy, cooldowny).
- Zmiana wartości liczbowych (mnożniki, RTP, house edge, EV).
- Tytuł zawiera "balans", "rebalans", "tuning", "nerf", "buff", "cap", "cooldown", "exploit".
- **UWAGA:** literówka `balans` (bez `e`) jest **nieprawidłowa** — używaj `balance`. PATCH_CATS zna tylko `balance`.

**Co NIE należy:**
- Naprawa wartości błędnej (to `bugfix`).
- Wprowadzenie nowej funkcji (to `feature`).

**Przykład pasujący:** v2.0.13 "🟡 Plinko fair (HE 3.5%)" — `[kasyno, balance, bugfix]` (rebalans gry kasynowej).

---

## `visual` — Wizualne / UI

**Co tu należy:**
- Zmiany wyglądu (sprite, kolor, gradient, ramka, padding, font).
- Cinematic / kamera / przelot.
- Animacje, mikrointerakcje.
- HUD, overlay, popup, badge, tooltip, ikona, emoji.
- Minimapa, awatar.
- Zmiany layoutu/foldery telefonu.

**Co NIE należy:**
- Wzmianka "HUD" / "okno" mimochodem (np. "naprawiony bug HUD w X") nie czyni wpisu `visual` jeśli temat to mechanika gry.
- Zmiana zachowania UI (np. anti-spam clicku) bez zmiany wyglądu — to `bugfix`/`balance`/`gameplay`.

**Przykład pasujący:** v2.1.16 "🚦 NPC wskaźnik czeka na zielone + naprawa wychodzi na ulicę" — `[bugfix, visual, gameplay]`.

---

## `optimization` — Optymalizacja

**Co tu należy:**
- Performance (FPS, memory leak, lag).
- Debounce, throttle, cache.
- Usuwanie dead code (refactor pod katem rozmiaru/szybkości).

**Co NIE należy:**
- Refactor bez wymiernego zysku (to `system`).

**Przykład pasujący:** v1.9.12 "⚡ POTĘŻNY AUDYT cd. — Performance: debounce save, cache audio koncertu".

---

## `gameplay` — Rozgrywka

**Co tu należy (POZA kasynem):**
- NPC (kolizje, AI, ścieżki, SMS NPC).
- Mechaniki gracza: XP, level-up, umiejętności, energia/głód/nastrój/forma/kondycja/zdrowie, sen.
- Sklepy, restauracje, mieszkania, helipad, park.
- Studio, radio, kariery: rap/koncerty/album/track/beat.
- Tutorial, intro, storyline, side questy.
- Prestige, fan/sława/fame, milestones, achievements.
- Outfity, fryzury, tatuaże, drip.
- Pogoda, pora dnia, transport (autobus/taxi).
- Imprezy, kluby, trening, jogging.
- Sponsorzy, AdSense, Autopromocja, dropshipping.
- Streaming (YouTube/Instagram/Twitter/Spotify/Tidal jako mechaniki w grze).
- Crew/przyjaźń jako LOKALNE NPC (przed v2.1.0 Supabase Crew).
- SMS od NPC w telefonie (lokalne, nie P2P z innym graczem).

**Co NIE należy:**
- Gry kasynowe (to `kasyno`).
- Funkcje Supabase (to `online`).
- Czysto wizualne zmiany (to `visual`).
- Save/load tech (to `system`).

**Przykład pasujący:** v2.1.18 "🚶 NPC anti back-and-forth fix #2 + wzmocnione collision avoidance" — `[bugfix, gameplay]`.

---

## `kasyno` — Kasyno

**Co tu należy:**
- Tylko wpisy o **konkretnych grach kasynowych** w grze Trap Simulator:
  - Sloty (regular, VIP)
  - Ruletka
  - Blackjack
  - Baccarat
  - Poker
  - WAR
  - Craps
  - Keno
  - Plinko
  - Koło Fortuny (regular, VIP)
  - Daily Wheel / Daily Spin (Free Wheel of Fortune)
- Kantor (kupno/sprzedaż żetonów)
- Mechaniki kasyna: jackpot, VIP lounge, VIP floor, żetony, cooldowny gier
- House Edge / RTP / EV gier kasynowych
- VIP-cinematic z windy do VIP **TYLKO** jeśli dotyczy mechaniki kasyna (nie sam cinematic)

**Co NIE należy:**
- "VIP" bez kontekstu kasyna (np. VIP w telefonie, VIP outfit, VIP apartament — to `gameplay` lub `visual`).
- "Slot" w sensie save slot / UI slot (np. v0.9.37 "Sloty zapisu").
- Tylko marble podłoga / cień stołu / ramka — to `visual` (chyba że tytuł wyraźnie mówi o stole gry kasynowej).
- Wpis ma wzmiankę o kasynie tylko jako lokalizację (np. "spawn po wyjściu z kasyna naprawiony") — to `gameplay`.

**Przykład pasujący:** v2.0.14 "🃏 Blackjack: 2 talie + opcja PODDAJ" — `[kasyno, balance, feature]`.
**Przykład NIE-pasujący:** v2.0.19 "👑 VIP podłoga marble" — to `[visual, bugfix]`, NIE kasyno (brak konkretnej gry).

---

## `online` — Online / Tablica wyników

**Krytyczne:** to NAJCZĘŚCIEJ błędnie używana kategoria. Reguła żelazna: **`online` = funkcje wykorzystujące Supabase (serwer zewnętrzny)**.

**Co tu należy (WYŁĄCZNIE):**
- 🌍 **Tablica wyników / Leaderboard** (globalna baza danych w Supabase).
- 👥 **System znajomych** (od v1.8.90) — friend codes, friend requests, friendship table.
- 🏆 **Crew system** (od v2.1.0) — założenie crew, zaproszenia, group chat, tygodniowe wyzwania.
- 💬 **P2P chat / SMS gracz-do-gracza** (od v1.9.81/v2.0.30) — player-to-player wiadomości przez Supabase.
- 🔔 **Social poller** (`_pollSocial`) — pollowanie nowych wiadomości/zaproszeń z serwera.
- 🌐 **Network errors** — HTTP 401/403/409, RLS policies, Supabase JWT, auth.uid.
- 🎖 **Live ticker / LIVE NICK** — pasek z aktywnością innych graczy w tablicy wyników.
- 🏛 **Hall of Fame / Master Score** — globalne rankingi.

**Co NIE należy (najczęstsze błędy):**
- ❌ **NPC** (kolizje, AI, ruchy, SMS od NPC, przyjaźń z NPC) — NPC to LOKALNA mechanika, NIE online.
- ❌ **"Crew" jako lokalna paczka rapowa** (pre-v2.1.0) — to NPC team gracza, nie Supabase crew.
- ❌ **SMS od NPC do gracza** — lokalne wiadomości, NIE P2P.
- ❌ **Local rename UI** (np. "paczka → Crew") — to `gameplay`/`visual`, nie online.
- ❌ **Wpis WSPOMINA "tablica wyników"** tylko jako jeden z przykładów okien/lokalizacji — to nie temat wpisu.
- ❌ **Patch Notes kategoria "Online"** wprowadzona w systemie patchnotes — to `system`, nie online.
- ❌ **Reorganizacja telefonu** zawierająca skrót "Tablica wyników" — to `visual`/`feature`, nie online.
- ❌ **HUD ukrywanie kiedy "Tablica wyników" otwarta** — to `visual`, nie online.
- ❌ **"Zbyszek + Crew"** (nazwa NPC sklepu ulicznego) — to `gameplay`, nie online.

**Test sanity:** jeśli wpis usunąć Supabase z gry, czy ten patch ma sens? Jeśli TAK → nie online. Jeśli NIE (patch dosłownie nie istniałby) → online.

**Przykład pasujący:** v1.8.73 "🌍 Globalna tablica wyników — pierwszy element rywalizacji między graczami".
**Przykład pasujący:** v2.1.0 "🏆 v2.1.0 — Crew system (założenie + zapraszanie + group chat + tygodniowe wyzwania)".
**Przykład NIE-pasujący:** v2.1.21 "Wielki batch napraw — NPC kolizja, prędkość gracza, przelot kamerą" — NPC + kamera + Craps, NIE online (poprawiono w niniejszym audycie).

---

## `system` — System / techniczne

**Co tu należy:**
- Save migration (stare save'y bez nowych pól → domyślne wartości).
- LocalStorage, quota.
- Crash guards, try-catch, error handling.
- XSS / sanitize / escape HTML / innerHTML guards.
- Save game / load game / export / import.
- Schema (SQL), wersjonowanie save'ów.
- Recycle bin / kosz na save'y.
- Auto-save, auto-load, immediate save.
- Audyt PATCH_NOTES, auto-kategoryzacja, audyt kodu (dead code, console.log).
- Admin panel guard, eval() removed.
- Window-level event handlers, focus management.

**Co NIE należy:**
- Tylko save mechanic visible to player (np. Ctrl+S shortcut) — to `gameplay` lub `feature`.
- Performance fix bez schemat/migracji — to `optimization`.

**Przykład pasujący:** v1.9.97 "🗑 Recycle bin dla save'ów — usunięte save'y nie giną".
**Przykład pasujący:** v2.1.24 "🏷️ PATCH_NOTES — auto-kategoryzacja 103 wpisów bez tagów" — `[system, bugfix]`.

---

## Reguły kombinacji (dwie+ kategorie naraz)

Typowe i poprawne kombinacje:

- **Kasyno bug:** `[critical, bugfix, kasyno]` lub `[bugfix, kasyno, balance]`
- **Kasyno wizualna zmiana:** `[kasyno, visual]`
- **Online feature:** `[feature, online]` lub `[feature, online, visual]`
- **NPC bug:** `[bugfix, gameplay]` lub `[critical, bugfix, gameplay, visual]`
- **Save migration:** `[bugfix, system]` lub `[bugfix, system, gameplay]`
- **Mechanika anti-exploit:** `[critical, bugfix, balance, gameplay]`

**Antywzorce — NIGDY:**
- `[online, gameplay]` na wpisie o NPC. NPC to gameplay, nie online.
- `[kasyno]` na wpisie bez konkretnej gry kasynowej.
- `[balans]` (literówka — używaj `balance`).
- `[audio]` (nie istnieje).
- `[change]` (to typ wpisu, nie kategoria).

---

## Workflow dla NOWEGO wpisu

1. Napisz `title` i `items[]`.
2. Sprawdź: jakie obszary tematyczne treść porusza? (NPC? kasyno? online? balans?)
3. Zacznij od dominanty:
   - Wpis o **konkretnej grze kasynowej** → zacznij od `kasyno`.
   - Wpis o **Supabase/leaderboard/crew online/friend request/P2P** → zacznij od `online`.
   - Inaczej → zacznij od `gameplay` (jeśli mechanika) lub `visual` (jeśli wygląd) lub `system` (jeśli technika).
4. Dodaj meta-tagi:
   - Item z `t:'fix'` → dodaj `bugfix`.
   - Item z `t:'feature'`/`t:'add'` → dodaj `feature`.
   - Item z `t:'critical'` lub treść "KRYTYCZNY" → dodaj `critical`.
   - Wpis o capie/cooldownie/nerfie/buffie → dodaj `balance`.
   - Wpis konsoliduje zgłoszenia konkretnego usera (`reporter:'X'`) → dodaj `beta-tester`.
5. Cap na 4 kategorie. Kolejność: `critical → feature → bugfix → kasyno/online → gameplay/visual → balance/optimization/system/beta-tester`.
6. **Sanity check (online):** jeśli usunąć Supabase z gry, czy patch ma sens? Jeśli TAK → usuń `online`.
7. **Sanity check (kasyno):** czy tytuł wymienia konkretną grę kasynową lub item w 60%+ mówi o niej? Jeśli NIE → usuń `kasyno`.

---

## Bezpieczna lista kategorii (`PATCH_CATS`)

Akceptowane wartości w `cats:[...]`:

```
beta-tester, feature, critical, bugfix, balance, visual, optimization, gameplay, kasyno, online, system
```

**NIEakceptowane (typowe błędy):**

- `balans` → użyj `balance`
- `audio` → kategoria nie istnieje, dźwięki idą do `gameplay`/`kasyno`/`visual`
- `change` → to typ wpisu (`it.t`), nie kategoria — wybierz kategorię z treści
- `kasynow` / `kasyna` / `casino` → użyj `kasyno`
- `znajomi` / `friends` / `multiplayer` → użyj `online`

---

## Najczęstsze pułapki (z audytu 2026-05-15)

| Sygnał w treści | Pułapka | Poprawnie |
|---|---|---|
| "tablica wyników" wspomniana jako jedno z okien w grze | Klasyfikator dodaje `online` | NIE dodawaj `online` — to tylko wzmianka |
| "Crew" w tytule (pre-v2.1.0) | Klasyfikator dodaje `online` | To lokalna paczka NPC — `gameplay` |
| "Crew" w nazwie sklepu/NPC ("Zbyszek + Crew") | Klasyfikator dodaje `online` | To nazwa, nie funkcja — `gameplay` |
| "SMS" w tytule (od NPC) | Klasyfikator może dodać `online` | Lokalne — `gameplay` |
| "P2P SMS XSS fix" jako jeden item w wpisie o NPC | Klasyfikator dodaje `online` | Jeśli NPC dominują wpis — `gameplay`+`bugfix` wystarczy |
| "slot" w sensie save slot | Klasyfikator dodaje `kasyno` | NIE kasyno — `system`/`feature` |
| "VIP" bez gry kasynowej | Klasyfikator dodaje `kasyno` | NIE — to `gameplay` lub `visual` |
| "marble podłoga" / "tile pattern" | Klasyfikator dodaje `kasyno` | To `visual` chyba że tytuł wyraźnie gra |
| "🎰" emoji w tytule | Wystarczające do `kasyno`? | Zwykle TAK (sygnał świadomy), zostaw |

---

**KONIEC.** Stosować od następnego patcha. Zmiany w tym dokumencie tylko po retrospektywie kolejnej sesji.
