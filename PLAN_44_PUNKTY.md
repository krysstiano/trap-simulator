# PLAN_44_PUNKTY — Pełna lista propozycji wizualnych Snowy Simulator

**Status: ODŁOŻONE — wracamy do tego po zakończeniu PLAN_SESJA.md**

**Kontekst:** Lista 44 propozycji obiektów/dekoracji do dodania, zaproponowana przez Claude'a po komitcie `943f6ef`. Użytkownik wybrał WSZYSTKIE 44 punkty do implementacji ("W zasadzie to chciałbym wszystkie 44 punkty. Może bedzięmy jakoś po kolei implementować i będę na bieżąco testować?" — 2026-05-09 21:06).

**Plan implementacji:** podzielono na 10 sesji tematycznych. Praca rozpoczęta sesją 1 (atmosfera) i 2 (NPC), reszta NIE zrealizowana — przerwana na rzecz nowych priorytetów (forma/kondycja, drzewko umiejętności, cinematic, etc.).

**Źródło oryginalne:** sesja `96093a36-5071-427f-87c1-0a53cb38aa29.jsonl`, wiadomość `e85d94dd-90d7-4170-ab03-c1151b940593` (2026-05-09 21:06).

---

## 📋 PEŁNA LISTA 44 PUNKTÓW (oryginalna kolejność)

### 🌃 Atmosfera miasta (#1-#6)

| # | Propozycja | Status |
|---|------------|--------|
| 1 | **Latarnie uliczne wzdłuż chodników** — co 200px, zapalają się o zmierzchu z glow halo | ✅ ZROBIONE (PATCH: fizyczne słupki latarni rozstawione wzdłuż wszystkich chodników, świecą żółto wieczorem) |
| 2 | **Hydranty czerwone** — punkty interaktywne, można "rozkręcić" w upalny dzień (lokalnie deszcz + kałuża + dzieciaki) | 🟡 CZĘŚCIOWO (PATCH: z 12 do 28 sztuk, ale BRAK interaktywności "rozkręcania") |
| 3 | **Skrzynki pocztowe** — niebieskie/zielone, dekoracyjne w okolicy mieszkań | ❓ DO WERYFIKACJI |
| 4 | **Kosze na śmieci** rozproszone po mieście — niektóre przepełnione, niektóre OK | ✅ ZROBIONE (PATCH: z 10 do 32 sztuk, ~30% przepełniona — wystają papierki, butelki, puszki) |
| 5 | **Studzienki kanalizacyjne** w jezdni — okrągłe metalowe pokrywy, czasem z parą (wieczorem) | 🟡 CZĘŚCIOWO (PATCH: ~21 sztuk żeliwnych pokryw z wzorem promienistym, ale BRAK pary wieczorem) |
| 6 | **Płotki/ogrodzenia** wokół niektórych skwerów lub placów budowy | ❓ DO WERYFIKACJI |

### 🚗 Życie uliczne (#7-#12)

| # | Propozycja | Status |
|---|------------|--------|
| 7 | **NPC zróżnicowani** — różne fryzury/ubrania/kolory skóry/wzrost | ✅ ZROBIONE (PATCH: 3 nowe typy NPC + mocne zróżnicowanie) |
| 8 | **NPC z aktywnościami** — biegacz, staruszka z chodzikiem, dzieciak na hulajnodze, biznesmen, pies na smyczy | ✅ ZROBIONE (PATCH: 🏃 biegacze 2.2×, 👵 starsze osoby 0.35× z chodzikiem, 🛴 dzieci 1.8× na hulajnodze, 🐕 spacerowicze z psami 0.65×) |
| 9 | **Auta zaparkowane** — przy chodnikach, dekoracyjne (różne modele/kolory) | ❌ NIE ZROBIONE |
| 10 | **Rowery przy stojakach** rowerowych przy mieszkaniach/uczelniach | ❌ NIE ZROBIONE |
| 11 | **Taksówki** żółte przejeżdżające z pasażerami w środku | ❌ NIE ZROBIONE |
| 12 | **Autobusy/tramwaje** na wybranych ulicach (zatrzymujące się na przystankach) | ❌ NIE ZROBIONE |

### 🛍️ Dekoracje sklepów/budynków (#13-#18)

| # | Propozycja | Status |
|---|------------|--------|
| 13 | **Reklamy świetlne** na budynkach (świecące się o zmierzchu) | 🟡 CZĘŚCIOWO (już są niektóre, do rozbudowy) |
| 14 | **Plakaty filmowe/koncertowe** na słupach ogłoszeniowych | ❌ NIE ZROBIONE |
| 15 | **Markizy nad sklepami** — kolorowe trójkątne dachy | ❌ NIE ZROBIONE |
| 16 | **Kwiaty w doniczkach** przy wejściach do sklepów luksusowych | ❌ NIE ZROBIONE |
| 17 | **Stoliki kawiarniane** przed restauracją z parasolami | ❌ NIE ZROBIONE |
| 18 | **Witryny sklepowe** z manekinami w eleganckich strojach (Drip District) | ❌ NIE ZROBIONE |

### 🌳 Natura (#19-#24)

| # | Propozycja | Status |
|---|------------|--------|
| 19 | **Fontanna główna** w centrum jakiegoś placu (większa niż obecna) | ❓ DO WERYFIKACJI (jest fontanna w parku + VIP fontanna przy Penthouse — czy "główna" istnieje?) |
| 20 | **Pomnik historyczny** — postać na piedestale, miejsce do robienia zdjęć | ❓ DO WERYFIKACJI (PATCH wspomina "skwer z fontanną-pomnikiem" — może już jest) |
| 21 | **Sezonowe zmiany w parku** — kolorowe liście jesienią, kwiaty wiosną, śnieg zimą na drzewach | ❌ NIE ZROBIONE (śnieg jest globalnie ale nie konkretnie na drzewach z sezonową zmianą) |
| 22 | **Jezioro z kaczkami** w parku | ❌ NIE ZROBIONE (jest staw ale bez kaczek) |
| 23 | **Plac zabaw** dla dzieci — huśtawki, zjeżdżalnia, piaskownica | ❌ NIE ZROBIONE |
| 24 | **Boisko sportowe** — bramki do piłki, kosz do koszykówki | ❌ NIE ZROBIONE (jest skatepark, breakdance — ale nie boisko) |

### 🎭 Eventy ożywiające miasto (#25-#30)

| # | Propozycja | Status |
|---|------------|--------|
| 25 | **Demonstracja/marsz** — grupa NPC z transparentami (rzadko) | ❌ NIE ZROBIONE |
| 26 | **Filmowanie** — ekipa z kamerami i światłami, czerwony dywan przed Salą Koncertową | ❌ NIE ZROBIONE |
| 27 | **Wesele w kościele** — biały samochód z kwiatami, gości w garniturach | ❌ NIE ZROBIONE |
| 28 | **Wypadek drogowy** — auta z migaczami policji, gapie zbierają się | ❌ NIE ZROBIONE |
| 29 | **Festyn uliczny** — stragany, balony, muzyka, tłum NPC | ❌ NIE ZROBIONE |
| 30 | **Pożar kamienicy** — straż pożarna, dym z budynku (rzadki event) | ❌ NIE ZROBIONE |

### 🌧️ Pogoda interaktywna (#31-#35)

| # | Propozycja | Status |
|---|------------|--------|
| 31 | **Kałuże po deszczu** — odbijają niebo, NPC omijają | ❌ NIE ZROBIONE |
| 32 | **Parasole NPC** — gdy pada | ❌ NIE ZROBIONE |
| 33 | **Bałwany** w parku zimą (tworzone przez dzieciaków-NPC) | ❌ NIE ZROBIONE |
| 34 | **Liście spadające** z drzew jesienią — particle system | ❌ NIE ZROBIONE |
| 35 | **Mgła nad jeziorem** rano | ❌ NIE ZROBIONE (mgła globalna jest, nad jeziorem nie) |

### 🌃 Detal nocny (#36-#39)

| # | Propozycja | Status |
|---|------------|--------|
| 36 | **Świecące okna** budynków — różne wzory, niektóre zgaszone | ✅ ZROBIONE (jest w drawDB — okna zapalają się wieczorem) |
| 37 | **Neon** krzykliwych klubów — pulsujący kolorowy | ❓ DO WERYFIKACJI (Sala Koncertowa, FREESTYLE ikona neon — częściowo) |
| 38 | **Migający sygnalizator** żółty na nocnych skrzyżowaniach | ❌ NIE ZROBIONE (sygnalizatory są ale brak nocnego trybu migania) |
| 39 | **Samochody z włączonymi światłami** w nocy | ❓ DO WERYFIKACJI |

### 🏗️ Detal "miasto żyje 24/7" (#40-#44)

| # | Propozycja | Status |
|---|------------|--------|
| 40 | **Rusztowania** przy niektórych budynkach (remont w trakcie) | ❌ NIE ZROBIONE |
| 41 | **Płatki śniegu osadzające się** na elementach | ✅ ZROBIONE (już jest — płatki spadają i wyglądają jak osadzone) |
| 42 | **Graffiti** na ścianach garaży/podjazdów (street art) | ❌ NIE ZROBIONE |
| 43 | **Naklejki/wlepki** na latarniach | ❌ NIE ZROBIONE |
| 44 | **Pies/kot przebiegające** przez ekran sporadycznie | 🟡 CZĘŚCIOWO (psy są stale ze spacerowiczami, brak kotów i sporadycznych przebiegnięć) |

---

## 📊 PODSUMOWANIE STATUSU

| Status | Liczba | Procent |
|--------|--------|---------|
| ✅ ZROBIONE | 6 | 14% |
| 🟡 CZĘŚCIOWO | 4 | 9% |
| ❓ DO WERYFIKACJI | 5 | 11% |
| ❌ NIE ZROBIONE | 29 | 66% |

**Co zostało zrobione (sesje 1-2):**
- Sesja 1 🏙️ Atmosfera: #1 latarnie, #4 kosze (#2 hydranty, #5 studzienki częściowo)
- Sesja 2 👥 NPC: #7 zróżnicowani, #8 z aktywnościami (biegacze, dzieci na hulajnodze, starsze, psy)

**Praca przerwana** — kolejne sesje (3-10) NIE rozpoczęte, gracz zaczął zgłaszać NOWE problemy które trafiły do PLAN_SESJA.md.

---

## 📅 PLAN 10 SESJI TEMATYCZNYCH (ze sesji 96093a36)

| # | Sesja | Punkty | Co dodaje | Status |
|---|-------|--------|-----------|--------|
| 1 | 🏙️ Atmosfera miejska | #1, #2, #4, #5 | Latarnie, hydranty, kosze, studzienki | ✅ Zrobione (#2, #5 częściowo) |
| 2 | 👥 NPC zróżnicowani | #7, #8 | Różne wyglądy, biegacze, dzieci, psy | ✅ Zrobione |
| 3 | 🚗 Pojazdy | #9, #10, #11, #12, #39 | Zaparkowane auta, rowery, taksówki, autobusy, światła w nocy | ❌ Do zrobienia |
| 4 | 🛍️ Sklepy/dekoracje | #15, #16, #17, #18 | Markizy, kwiaty, stoliki, witryny | ❌ Do zrobienia |
| 5 | 📢 Reklamy & neony | #13, #14, #37, #38 | Świetlne reklamy, plakaty, neony klubów, migający sygnalizator | ❌ Do zrobienia (#13, #37 częściowo) |
| 6 | 🌳 Park & Natura | #19, #20, #22, #23, #24 | Fontanna, pomnik, jezioro z kaczkami, plac zabaw, boisko | ❌ Do zrobienia |
| 7 | 🍂 Sezony | #21, #33, #34 | Liście jesienią, śnieg na drzewach, bałwany | ❌ Do zrobienia |
| 8 | 🌧️ Pogoda interaktywna | #31, #32, #35 | Kałuże, parasole NPC, mgła nad jeziorem | ❌ Do zrobienia |
| 9 | 🎪 Eventy live | #25, #26, #27, #28, #29, #30 | Demonstracja, filmowanie, wesele, wypadek, festyn, pożar | ❌ Do zrobienia |
| 10 | 🏚️ Detale | #3, #6, #36, #40, #41, #42, #43, #44 | Skrzynki, płotki, okna, rusztowania, graffiti, pies/kot | 🟡 #36, #41 zrobione; reszta nie |

---

## 🎯 ZADANIA DO ZROBIENIA — KOLEJNOŚĆ REKOMENDOWANA

**Po skończeniu pracy nad PLAN_SESJA.md wracamy tutaj.** Sugerowana kolejność:

### Priorytet wysoki (dużo "życia" za małą pracę)
- **Sesja 3 — Pojazdy** (#9, 10, 11, 12, 39) — najwięcej dynamiki w mieście
- **Sesja 4 — Sklepy/dekoracje** (#15-18) — Drip District i sklepy nabiorą charakteru
- **Sesja 6 — Park & Natura** (#19, 20, 22, 23, 24) — kompletny rebuild parku

### Priorytet średni
- **Sesja 5 — Reklamy & neony** (#13, 14, 37, 38) — atmosfera nocna
- **Sesja 7 — Sezony** (#21, 33, 34) — visual variety
- **Sesja 8 — Pogoda interaktywna** (#31, 32, 35)

### Priorytet niski (eye candy, low impact)
- **Sesja 9 — Eventy live** (#25-30) — kosztowne implementacyjnie
- **Sesja 10 — Detale** (#3, 6, 40, 42, 43, 44) — pojedyncze drobiazgi

### Verifikacja przed pracą
- **#3** (skrzynki pocztowe) — sprawdzić czy istnieją
- **#6** (płotki) — sprawdzić czy istnieją (płotek wokół parku jest, ale gdzie indziej?)
- **#19** (fontanna główna) — sprawdzić aktualny stan fontann
- **#20** (pomnik) — wzmianka w PATCH "skwer z fontanną-pomnikiem"
- **#37** (neon klubów) — Sala Koncertowa, FREESTYLE — częściowy stan
- **#39** (auta z światłami) — sprawdzić obecny system aut

---

## 📁 GDZIE TO JEST ZAPISANE

- **Ten plik**: `E:\Snowy Simulator\PLAN_44_PUNKTY.md` (główny dokument)
- **Indeks**: `E:\Snowy Simulator\PLAN_INDEX.md` (powinien linkować tutaj)
- **Oryginalna lista**: `E:\Snowy Simulator\_44_list.txt` (verbatim z sesji jsonl)
- **Sesja jsonl**: `C:\Users\kryst\.claude\projects\C--Users-kryst\96093a36-5071-427f-87c1-0a53cb38aa29.jsonl`
  - Wiadomość propozycji: `e85d94dd-90d7-4170-ab03-c1151b940593` (2026-05-09 21:06)
  - Wiadomość użytkownika "wszystkie 44": `376c186b-1972-4ff6-ba0a-a09a3eadba6a`

---

## ⚠️ UWAGI DO WERYFIKACJI PRZED IMPLEMENTACJĄ

1. **Audyt Playwright** — przed startem sesji 3 zrobić skrypt który zrzuca pełną mapę i sprawdza co JUŻ jest, co nie ma
2. **Niektóre punkty mogły być zrobione później** — np. praca nad pogodą w PLAN_SESJA.md może pokrywać się z #31, #32, #35
3. **Niektóre punkty są w PLAN_SESJA.md** — np. SYGNALIZATORY ŚWIETLNE mogą pokrywać #38 (migający sygnalizator)
4. **Status "❌ NIE ZROBIONE"** to estymacja na podstawie PATCH_NOTES — przed implementacją sprawdzić w kodzie
