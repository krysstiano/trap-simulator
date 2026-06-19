# PLAN_ANTIPATTERNS — Lista błędów które już popełniłem

**Cel:** Stare błędy NIE wracają. Przed każdą sekcją sprawdzam: "czy nie wpadam w jeden z tych?"

**Format:** opis błędu | kontekst (gdzie wystąpił) | jak zapobiec | data

---

## 🔴 BŁĘDY W TREŚCI / WARTOŚCIACH

### AP-001: Zmieniłem wartość bez czytania cytatu
- **Co:** Wpisałem "+25%" zamiast "+20%" w bonusie stroju treningowego pro
- **Kontekst:** STROJE TRENINGOWE
- **Powód:** Nie przeczytałem dokładnie cytatu użytkownika
- **Zapobieganie:** **`feedback_quote_mapping.md`** — każde zdanie cytatu mapuję 1:1 na zmianę
- **Data:** 2026-05-09

### AP-002: Zaproponowałem 3 opcje zamiast jednego rozwiązania
- **Co:** Spotify weryfikacja — A/B/C, gracz powiedział "połącz B i C"
- **Kontekst:** SPOTIFY
- **Powód:** Niepotrzebnie dzieliłem rozwiązanie
- **Zapobieganie:** Gdy widzę że rozwiązanie ma sens jako jedno spójne — proponuj jedno. Opcje tylko gdy są realnie różne.
- **Data:** 2026-05-09

### AP-003: Zignorowałem część cytatu
- **Co:** "Lampy chodnik only" — pierwszy raz nie dodałem walidacji `_isOnRoad()` mimo że gracz wyraźnie napisał CAPS-em
- **Kontekst:** LATARNIE
- **Powód:** Skupiłem się na pierwszej części (duplikacja) i pominąłem drugą (chodnik only)
- **Zapobieganie:** **`feedback_quote_mapping.md`** + `PLAN_PROGRESS.md` mapping co do zdania
- **Data:** 2026-05-09

---

## 🔴 BŁĘDY UI / RENDERINGU

### AP-004: position:fixed wewnątrz #wrap z transform:scale
- **Co:** Cinematic / modal pojawiał się w złym miejscu na 2560×1440 bo był w `#wrap` z transform
- **Kontekst:** Każdy pełnoekranowy modal/cinematic
- **Powód:** Nie wiedziałem o interakcji `position:fixed` z `transform` na rodzicu
- **Zapobieganie:** **`feedback_position_fixed_scale.md`** — WSZYSTKIE elementy fixed w `document.body`
- **Test:** ZAWSZE test na rozdzielczości 2560×1440
- **Data:** wcześniej

### AP-005: Z-order — drawParkLife przed drawObjects
- **Co:** NPC w parku znikali przechodząc przez fontannę/breakdance
- **Kontekst:** PARK NPC #58
- **Powód:** Złą kolejność warstw renderowania
- **Zapobieganie:** Wszystkie ruchome elementy (NPC, gracz, breath cloud) → renderowane PO statycznych obiektach
- **Data:** 2026-05-09

### AP-006: Sztywne wartości screen coords w kodzie świata
- **Co:** APARTAMENT PREMIUM bug — `(r*bCols+c+sx)%4>1` używa screen X (sx) zamiast world X (wx) → migotanie okien gdy gracz idzie obok
- **Kontekst:** drawAptPremium
- **Powód:** Pomylenie wx ze sx
- **Zapobieganie:** **`PLAN_GLOSSARY.md`** — wx vs sx jasno rozdzielone. Cokolwiek "ma być stałe na mapie" → użyj wx.
- **Data:** 2026-05-09

---

## 🔴 BŁĘDY MECHANIK

### AP-007: Brak normalizacji prędkości diagonal
- **Co:** Gracz idzie √2 × szybciej po skosie (dx=spd + dy=spd, bez normalizacji)
- **Kontekst:** PRĘDKOŚĆ DIAGONAL
- **Powód:** Brak mathu w movement
- **Zapobieganie:** Każdy ruch z `dx≠0 && dy≠0` → `dx /= √2; dy /= √2;`
- **Data:** 2026-05-09

### AP-008: Bonus skill bez wpływu w kodzie — FALSE POSITIVE (sprawdzone w F3.1)
- **Co:** Plan PLAN_SESJA.md sugerował że 8 skills nie ma mnożników w kodzie
- **Weryfikacja w F3.1 (2026-05-10):** Wszystkie 11 skills MAJĄ działające mnożniki:
  - pizza +20%/pkt (linia 12095), supermarket +20%/pkt (12229), carwash +10/pkt (12733),
    construction +20%/pkt (13021), kurier +20%/pkt (12505), zmywak +20%/pkt (13403),
    youtuber +15%/pkt (7310), beatmaker +15%/pkt (8786), gamer +15%/pkt (8984),
    influencer +15%/pkt (9591), soundeng +15%/pkt (9727)
- **Status:** Sekcja w planie była błędna, kod jest poprawny.
- **Lekcja:** Plan mógł być oparty na starszej wersji kodu — ZAWSZE weryfikować grep przed naprawą
- **Data:** wykryte 2026-05-10, zweryfikowane jako false positive 2026-05-10

### AP-009: Wartości OP — odporność -20%/pkt × 3 = -60%
- **Co:** Odporność redukuje obrażenia za bardzo (nawet brak głodu nie boli)
- **Kontekst:** DRZEWKO odpornosc
- **Powód:** Nie obliczyłem max kumulatywnej wartości
- **Zapobieganie:** **`PLAN_DECISIONS.md`** — przed setem nowej wartości oblicz max kumulatywne. Dla statów %: max suma <40% to bezpiecznie.
- **Data:** wykryte 2026-05-10

### AP-010: Pasek freezuje w siłowni
- **Co:** Cały bug "siłownia freezuje, nie da się ćwiczyć"
- **Kontekst:** SIŁOWNIA krytyczny
- **Powód:** Logika minigry blokuje update'y
- **Zapobieganie:** Każda nowa minigra → test "czy pasek nadal działa po 30s gry"
- **Data:** raportowane 2026-05-09

---

## 🔴 BŁĘDY PROCESU / METODYKI

### AP-011: Implementacja bez planu
- **Co:** Wcześniej rzucałem się na kod bez przeczytania pełnej sekcji w PLAN_SESJA.md
- **Kontekst:** Wiele sekcji
- **Zapobieganie:** **`feedback_section_completion_protocol.md`** + **dry-run szkic** w PLAN_PROGRESS.md przed kodem
- **Data:** ongoing

### AP-012: Raportowanie "DONE" gdy działa w 80%
- **Co:** Mówiłem "skończone" gdy 1-2 punkty testu nie działały
- **Kontekst:** Wiele sekcji
- **Zapobieganie:** **`feedback_no_done_below_100.md`** — twarda zasada
- **Data:** ongoing

### AP-013: Pomijanie regresji
- **Co:** Implementowałem X bez sprawdzania czy zepsułem Y
- **Kontekst:** Wiele sekcji
- **Zapobieganie:** **`_run_smoke.mjs`** po każdej sekcji + **`feedback_smoke_regression.md`**
- **Data:** ongoing

### AP-014: Niepotrzebnie wielki commit
- **Co:** "feat: drzewko gotowe" 3000 linii — niemożliwy review
- **Zapobieganie:** **`feedback_atomic_commits.md`** — 1 commit per checkbox
- **Data:** ongoing

### AP-015: PATCH_NOTES techniczne (hex, regex, drawXxx)
- **Co:** Wpisy w PATCH_NOTES używały `#0a0a0a`, `H1/H2/H3 N+S, co 400px`, `drawAptPremium`
- **Kontekst:** PATCH_NOTES wszystkie
- **Powód:** Pisałem dla siebie, nie dla gracza
- **Zapobieganie:** **`feedback_patch_notes_player_friendly.md`** — przyjazny język dla "zwykłego gracza"
- **Data:** raportowane 2026-05-09

---

## 🔴 BŁĘDY ZGADYWANIA / ZAŁOŻEŃ

### AP-016: Założenie że plan automatycznie kontynuuje
- **Co:** Po przerwie zacząłem nowy approach zamiast wracać do PLAN_SESJA.md
- **Zapobieganie:** **`feedback_plan_first_then_implement.md`** — zawsze otwórz plan najpierw
- **Data:** wcześniej

### AP-017: Park jako budynek do wejścia
- **Co:** Próbowałem zrobić park interactivem zamiast naturalnym miejscem mapy
- **Kontekst:** PARK
- **Zapobieganie:** **`feedback_park_natural.md`** — park/staw/ławka/skatepark naturalnie, NIE jako budynek
- **Data:** wcześniej

### AP-018: Hydranty/kosze/lampy na ulicy
- **Co:** Dekoracje stawały na jezdni zamiast na chodnikach
- **Zapobieganie:** Każda dekoracja "ma być na chodniku" → walidator `_isOnRoad()` PRZED dodaniem do listy
- **Data:** raportowane 2026-05-09

---

## 🔴 BŁĘDY SAVE/LOAD

### AP-019: Zmiana struktury G.X bez migracji
- **Co:** Gracz traci save bo nowy kod oczekuje innej struktury (np. G.skills.kondycja number → object)
- **Zapobieganie:** Każda zmiana struktury G.X → migracja w load functio + test "stary save dziala"
- **Data:** ongoing wymóg

### AP-020: Daily reset overwrite gracz state
- **Co:** Reset dzienny G._gymSets nadpisywał istniejący progres
- **Zapobieganie:** `if(!G.X || G.X.day !== G.day)` — tylko reset gdy NOWY dzień
- **Data:** wcześniej

---

## 🔴 BŁĘDY NARZĘDZI / WORKFLOW

### AP-021: _close_section.mjs wymaga visual diff dla niewizualnych
- **Co:** Skrypt zwraca FAIL gdy brak before.png/after.png, mimo że sekcja jest czysto logiczna (np. anti-freeze guard)
- **Kontekst:** CINEMATIC ANTI-FREEZE
- **Powód:** Skrypt nie miał obsługi sekcji niewizualnych
- **Zapobieganie:** Dodana obsługa pliku `_NOT_VISUAL.md` w `_visual_diffs/<sekcja>/` — gdy istnieje, skrypt akceptuje brak diffów
- **How to use:** Dla sekcji logicznych utworzyć `_visual_diffs/<sekcja>/_NOT_VISUAL.md` z opisem dlaczego
- **Data:** 2026-05-10

### AP-022: Regex batch refactor zamienia tekst W STRINGACH/KOMENTARZACH
- **Co:** Skrypt _swap_skills.py zamienił `G.skills.kondycja` na `getSkillLvl('kondycja')` także wewnątrz stringa PATCH_NOTES → SyntaxError (apostrof rozbił string)
- **Kontekst:** FAZA 1.3 MIGRACJA G.skills
- **Powód:** Regex nie odróżniał kodu od stringów/komentarzy
- **Konsekwencje:** Cała gra crashowała przy starcie (10/10 smoke FAIL). Wykryte przez dbg_console_errors.mjs (SyntaxError 'Unexpected identifier kondycja')
- **Zapobieganie:**
  - Po batch regex refactor: ZAWSZE uruchomić smoke + sprawdzić console errors (dbg_console_errors.mjs)
  - Lepszy regex: wyłączyć `string` i `//` komentarze przez negative lookahead
  - LUB: użyć AST parser zamiast regex dla większych refactorów
  - LUB: po regex zrobić grep dla niespodziewanych miejsc (`getSkillLvl.*'.*'.*'` itd.)
- **Naprawa:** Manual edit cofnij zamiany w stringach + komentarzach + napraw regex bugs (np. ===undefined gdzie nowa funkcja zwraca 0)
- **Lekcja:** Regex jest TANI ale RYZYKOWNY przy dużej skali. AST > regex dla 30+ zmian.
- **Data:** 2026-05-10

---

## ✅ CHECKLIST PRZED ZAMKNIĘCIEM SEKCJI

Sprawdź czy NIE robisz żadnego z powyższych:

- [ ] AP-001: Mapowałem każde zdanie cytatu?
- [ ] AP-002: Czy 3 opcje były naprawdę różne, czy mogły być 1?
- [ ] AP-003: Czy żaden fragment cytatu nie został pominięty?
- [ ] AP-004: Czy modal/cinematic jest w `document.body`? (test 2560×1440)
- [ ] AP-005: Czy ruchome elementy renderowane PO statycznych?
- [ ] AP-006: Czy używam wx (nie sx) dla "stałego" na mapie?
- [ ] AP-007: Czy ruch diagonalny ma normalizację √2?
- [ ] AP-008: Czy nowy skill ma faktyczny mnożnik w kodzie?
- [ ] AP-009: Czy max kumulatywna wartość % < 40%?
- [ ] AP-010: Czy nowa minigra nie freezuje paska?
- [ ] AP-011: Czy zrobiłem dry-run szkic PRZED kodem?
- [ ] AP-012: Czy NIE raportuję DONE przy <100% PASS?
- [ ] AP-013: Czy uruchomiłem `_run_smoke.mjs`?
- [ ] AP-014: Czy commit jest atomowy (1 checkbox)?
- [ ] AP-015: Czy PATCH_NOTES jest w przyjaznym języku?
- [ ] AP-016: Czy najpierw otworzyłem plan?
- [ ] AP-017: Czy park elementy są naturalne (nie budynki)?
- [ ] AP-018: Czy dekoracje używają _isOnRoad()?
- [ ] AP-019: Czy zmiana struktury G ma migrację?
- [ ] AP-020: Czy daily reset chroniony if `day !== G.day`?

---

## 📈 DODAWAJ NOWE BŁĘDY

Po każdym wykryciu nowego błędu — dopisz tutaj:

```
### AP-XXX: [krótki opis]
- **Co:** ...
- **Kontekst:** ...
- **Powód:** ...
- **Zapobieganie:** ...
- **Data:** YYYY-MM-DD
```

I dopisz do checklisty na końcu.
