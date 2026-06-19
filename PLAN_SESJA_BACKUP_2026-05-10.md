# Plan sesji — pełne opisy

## ⚠️ PROTOKÓŁ DZIAŁANIA — OBOWIĄZUJE PRZY KAŻDYM PUNKCIE PLANU

> "Dopisz jako ogólny krok do całego planu działania żeby czytać pełne wiadomości przed rozpoczęciem pracy KAŻDEGO kroku i po zakończeniu pracy robić dokładne testy i analizę czy zmiany zostały wprowadzone prawidłowo, czy nie ma błędów/bugów problemów i żeby po zakończeniu pracy nad KAŻDYM krokiem czytać i weryfikować pełne wiadomości jeszcze raz i upewnić się że nic nie zostało pominięte"

**Dla KAŻDEGO punktu z planu (1, 2, 3, …, n):**

1. **PRZED rozpoczęciem pracy:**
   - Przeczytaj pełen opis tego punktu w `PLAN_SESJA.md` (cytaty użytkownika + szczegóły)
   - Przeczytaj `PLAN_DEFER.md` jeśli punkt ma jakieś związki z odłożonymi zadaniami
   - Sprawdź kontekst w `CLAUDE.md` i `NOTATKI.md`

2. **W trakcie pracy:**
   - Realizuj **dokładnie taki zakres jaki opisuje dany punkt** — niektóre są wąskie (np. "usuń drugi mikrofon nad ikoną"), inne celowo szerokie (np. "to są przykłady, zainspiruj się i przeanalizuj całą grę pod tym kątem", "audyt wszystkich podobnych miejsc"). Czytaj opis uważnie żeby wiedzieć który to typ.
   - Nie rozszerzaj punktu wąskiego o niepowiązane zmiany; nie zawężaj punktu szerokiego pomijając przykłady "bo nie były literalnie wymienione".
   - Sprawdzaj kod sąsiadujący żeby nie wprowadzić regresji.

3. **PO zakończeniu pracy:**
   - Dokładne testy: `node state.mjs` + dedykowane skrypty Playwright weryfikujące zmiany
   - Analiza: czy zmiany zostały wprowadzone prawidłowo, czy nie ma błędów/bugów/problemów
   - **PONOWNIE przeczytaj pełen opis tego punktu w `PLAN_SESJA.md`** i punkt po punkcie zweryfikuj że KAŻDA wzmianka/przykład/sub-bug został zaadresowany — NIC nie zostało pominięte
   - Update `PATCH_NOTES` w `index.html` (zgodnie z feedback memory)
   - Commit zmiany

4. **Tylko jeśli wszystko z punktu 3 jest spełnione** — przejdź do następnego punktu.

---

**Zasada:** PRZED implementacją każdego punktu czytam tu cały opis i przykłady. Skrót w czacie tylko do nawigacji.

## Legenda mapy (dolny pas)
- **Prostokąt 1** — lewy dolny róg, Mieszkanie podstawowe
- **Prostokąt 2** — Penthouse
- **Prostokąt 3** — Balenciaga, Bottega, Dior, Prada (Drip)
- **Prostokąt 4** — prawy dolny, Apartament Premium

---

## 75. Bieżnia napis prędkości — nieprawdziwa wartość + nerf prędkości

> "Na siłowni przy bieżni jest informacja że prędkość gracze 3.8 na kondycji 100 [...] gracz przy 100 kondycji rozwiniętej na siłowni i przy maksymalnej rozwiniętej kondycji w drzewku umiejętności jest trochę za szybki."

**Naprawa:**
1. Napis na bieżni (1.8+fit/100*2.0) → poprawna formuła z aktualnym mnożnikiem
2. Nerf max prędkości — z 3.0 do ~2.5 (mniejsze bonusy fitness/kondycja)

---

## 76. IKEA audyt — napisy, telewizor, sofa/łóżko lux komunikaty

> "W Ikea przy meble i wyposażenie niektóre napisy są szarą czcionką, a niektóre zieloną. Przy telewizor i przy rośliny jest ten sam napis 2 razy. Telewizor ma już gracz na starcie więc jego kupno musi działać jakoś inaczej. Jak gracz kupi sofe lux to niech napisy tez sie zmieniają np odpoczywasz na sofie lux (większa regeneracja) z łóżkiem podobnie."

**Naprawa:**
1. Spójna kolorystyka napisów (wszystkie zielone — bonus, lub wszystkie szare)
2. Telewizor i rośliny — duplikat opisu (np. "+5 nastrój/dzień" w obu polach)
3. Telewizor już posiadany na starcie — zakup ma znaczenie (tier 2/upgrade) lub ukryć
4. Sofa Lux kupiona → komunikat "Odpoczywasz na sofie Lux (większa regeneracja)"
5. Łóżko Lux kupione → analogicznie ("Śpisz w luksusowym łóżku")

---

## 77. Audyt bonusów — sofa/łóżko lux, outfit muzyczny, strój sportowy

> "Sprawdz czy wszystkie systemu typu kupione łóżko lux szybkość regeneracji, albo outfit muzyczny bonus do koncertów, strój sportowy bonus na siłownie czy to wszystko działa. Zrób konkretny audyt. Sprawdz czy strój sportowy nie jest 'złamany' i czy nie daje za dużo."

**Audyt:**
1. Sofa Lux (+10 nastrój z odpoczynku) — czy faktycznie aplikowane?
2. Łóżko Lux (+20% szybkość regeneracji) — czy faktycznie aplikowane?
3. Outfit muzyczny (+5% zarobek z koncertów) — czy faktycznie aplikowane?
4. Strój sportowy (bonusy gym) — sprawdzić czy nie złamany / nie daje za dużo
5. TV/Rośliny — czy bonus +nastrój/dzień działa
6. Plant — czy faktycznie +3 nastrój/dzień
7. Desk Pro / Studio Corner / Yacht Bonus

---

## 78. Rebalans freestyle/eventów — gracz dostaje wszystko za szybko

> "rozpocząłem nową grę, zrobiłem JEDEN freestyle na ulicy (30s) i dostałem 266xp rapera, 289xp, 106 fanów, 133 followersów i 88 reputacji ulicy. Nie ma to sensu zeby w 30 sekund dostawać tak wiele i mieć prawie wymaksowaną reputacje ulicy."

**Naprawa GLOBALNA:**
- 1 freestyle (30s): obecnie 266 XP rapera + 289 XP + 106 fanów + 133 followers + 88 rep
- Cel: ~10× mniej dla pojedynczego eventu — gracz musi grindować
- Sprawdzić CAŁĄ grę pod kątem podobnych przypadków

---

## 79. Czy działają sława + reputacja uliczna? Audyt wpływu

> "Sprawdź jak działa i czy w ogóle działają takie rzeczy jak reputacja ulicy, sława. Co one dają i czy mają faktyczny wpływ na grę."

**Audyt:**
- Sława (G.fame) — gdzie używana, jakie bonusy
- Reputacja uliczna (G.streetRep) — gdzie używana
- Czy wpływają na: ceny, oferty, eventy, dostępność, mnożniki, dialogi NPC

---

## 80. Auta nie działają — kupiony, nigdzie go nie ma

> "Auta w ogóle nie działają. Zakupiłem samochód i nigdzie go nie ma."

**Problem:** Po zakupie samochodu gracz nie widzi auta nigdzie. System wsiadania (V) zapewne nieznany / nie działa.

**Naprawa:**
- Wyraźne info po zakupie: "Naciśnij V żeby wsiąść/wysiąść"
- Może auto powinno być widoczne PARKINGOWO przy mieszkaniu
- Hint w HUD że gracz ma auto i może wsiąść

---

## 81. Trawniki na chodniku/ulicy + odcień

> "Sprawdz ulica.png, nie naprawiles tego w ogóle i dalej to jest na ulicy i na chodniku w wielu miejscach. Odcieniu nie rób takiego jaki ma park tylko inny, tak żeby komponował się z miejscem w którym jest."

**Naprawa:**
1. Drzewa NIE wystają na chodnik/ulicę (większy padding wewnątrz patcha)
2. Odcień trawy INNY niż park (subtelniejszy, ciemniejszy lub barwniejszy w zależności od kontekstu)
3. Może też lekko losowy odcień per patch — wkomponowany z miejscem

---

## 71. Siłownia rebuild — maty/obciążniki/prędkość/forma

> "Usuń MATA 2 i MATA 3 na siłowni. Zrób żeby były 3 maty, ale niech bedzie napisane po prostu MATA na każdej. Obciążniki mają być NA każdej macie, bo aktualnie są POD każdą matą (mata je zasłania). Zrób żeby maksymalna prędkość gracza skalowała się do 3.0 zamiast do 3.8. Sprawdz czy siła i system Forma działa."

**Naprawa:**
1. Maty: usunąć "2" i "3" — wszystkie nazwane "MATA"
2. Obciążniki rysowane PO macie (z-order), nie POD
3. Max prędkość gracza: 3.8 → 3.0 (sprawdzić skalowanie)
4. Audyt siła i forma — czy działa progresja

---

## 72. Ikona freestyle na ulicy — ładniejsza

> "Ulepsz ikonę freestyle na ulicy zeby byla ladniejsza"

**Naprawa:** drawFreestyleSpot — bardziej rozbudowana ikona (statyw mikrofonu, soundwaves, neon glow).

---

## 73. Rachunki rebuild — eksmisja po 5 dniach + blokada wejścia + list

> "Rachunki wymagają remodernizacji. Odsetki powinny być naliczane za każdy dzień opóźnienia z płatnością. Jeżeli gracz będzie miał więcej niż 5 dni opóźnienia to zostaje eksmitowany z mieszkania (każdego jakie posiada) i nie może to niego wejść. Przy próbie wejście do mieszkania ma być 'list' w ktorym gracz widzi informacje, ze został eksmitowany z powodu nie płacenia za rachunki i jego dostęp do mieszkania ma być przywrócony jak zapłaci rachunki. Rachunki powinny przychodzić graczowi co tydzień w grze."

**Naprawa:**
1. Eksmisja po 5 dniach overdue (było 21)
2. Eksmisja BLOKUJE wejście do KAŻDEGO mieszkania (basic/premium/luxury)
3. Przy próbie wejścia (enter_apt) → modal "📜 LIST KOMORNICZY" z info o eksmisji + sumie do zapłaty
4. Po zapłaceniu wszystkich zaległości → dostęp przywrócony
5. Cykl tygodniowy zachowany

---

## 74. Tempo czasu — 1 dzień = 5 min real

> "Przyspiesz czas gry. Zrób tak żeby 1 dzień w grze to było 5 minut prawdziwego czasu."

**Naprawa:** _BASE_TIME_SCALE z 2 do 4.8 (1440 / 4.8 = 300 sek = 5 min/dzień).

---

## 64. System rachunków — opłaty cykliczne + odsetki + eksmisja

> "Chciałbym dodać system rachunków który grasz może zapłacić np przez telefon i komputer. Jeżeli gracz nie zapłaci w wyznaczonym czasie to zaczynają rosnąć odsetki, a jeżeli przez bardzo długi czas nie będzie płacić to może zostać eksmitowany z mieszkania dopóki nie spłaci rachunków."

**Funkcjonalność:**
1. **Rachunki cykliczne** per mieszkanie (czynsz, prąd/woda, internet) — różna wysokość per apartament
2. **Termin płatności** — np. co 7 dni, deadline X dni
3. **Odsetki** — po przekroczeniu terminu rosną dziennie (~5-10% / dzień)
4. **Eksmisja** — przy długim niepłaceniu (~21+ dni) — gracz wraca do Traphouse, save save (nie traci progres)
5. **Płatność** — przez telefon lub PC (nowy app/menu)

**Cel:** kolejne źródło "wymuszenia" pracy + większa głębia symulacji.

---

## 65. Reputacja uliczna złamana — szybko 100/100

> "reputacja uliczna jest zepsuta. Popracowałem może 2 minuty na pracy dorywczej i mam reputacje uliczna 100/100."

**Naprawa:** zmniejszyć przyrost streetRep z prac dorywczych. Każda zmiana powinna dawać max 1-2 punkty rep, max 100 osiągalne dopiero po wielu dniach grindu.

---

## 66. Wskazówki w minigrach (regresja #34)

> "Wskazówki i poradnik dalej wyskakują w trakcie włączonych okien/minigier/pracy dorywczej."

**Naprawa:** sprawdzić warunki guard w showSmartHint/tutorialTick. Powinny respektować stan: minigra aktywna, telefon otwarty, overlay aktywny.

---

## 67. XP zdobywany za szybko — 2 min = 3 lvl

> "Ze zdobywaniem expa tez jest cos nie tak. W niecałe 2 minuty wbiłem 3 lvl."

**Naprawa:** poziomy zwiększają próg eksponencjalnie ale start (lvl 1→2 = 100 XP) jest za niski. Albo źródła XP dają za dużo. Zrebalansować.

---

## 68. Drugi mikrofon nad freestyle (regresja #39)

> "Ikonka mikrofonu nad freestyle na ulicy dalej jest i mamy zdublowane 2 mikrofony."

**Naprawa:** sprawdzić co dokładnie pokazuje 2 mikrofony — może drawObjects + drawPrompt, albo dwie różne dekoracje.

---

## 69. Sława zepsuta

> "Przyrost sławy tez chyba jest zepsuty."

**Naprawa:** sprawdzić wszystkie miejsca G.fame+= i przywrócić sensowne tempo (sława ma być WALUTĄ zaawansowaną, trudną do uzyskania).

---

## 70. Globalny rebalans — gracz musi grindować

> "Zbalansuj rozgrywke, balans, zarobki, ceny, zdobywanie xp, zdobywanie statystyk zeby gracz nie dostawal tak szybko wszystkiego. Gracz musi troche grind zanim odblokuje wszystko."

**Filozofia:** Wszystkie statystyki rosną wolniej niż obecnie. Top-tier zawartość wymaga REALNIE wielu dni gry. Top-tier (Penthouse 50k, Bugatti, Mac Studio top) = ~30+ dni gry.

---

## 63. Audyt #20 KONTYNUACJA — balans prac, gospodarka, koszta

> "Z balansem i ogólną gospodarką jest dalej coś nie tak. Pierwszy test jaki wykonałem wykazał, że na pizzeri gracz zarabia dużo mniej niż na kurierze. Wydaje mi sie, ze na kurierze gracz zarabia troszke za duzo, a na pizzeri za mało. SPRAWDZ BALANS I GOSPODARKĘ. Sprawdz ceny, zarobki i nie tylko, przyrost statystyk tak samo, ceny, koszta."

**Konkret testowy:** kurier > pizzeria (nielogiczne — obie powinny być zbalansowane na ~10 min).

**Naprawa:**
1. Pomierzyć faktyczne wypłaty per minigra (kurier, pizza, supermarket, carwash, construction, zmywak) — ile gracz dostaje za zmianę
2. Wyrównać Tier 1 (prace dorywcze) — ~10 min gry = podobna kasa + exp dla każdej
3. Skorygować w dół te które zarabiają za dużo, w górę te które za mało
4. Audyt cen jedzenia, ubrań, sprzętu — czy zgodne z tempem zarobków
5. Audyt przyrostu XP, sławy, fanów per akcja

**Filozofia:** żaden Tier 1 nie powinien być wyraźnie lepszy od innych. Wybór = preferencja minigry, nie ekonomia.

---

## 59. Menu — "nadpisz save" nic nie robi

> "W menu jak probuje sie nadpisac save to nic sie nie dzieje i nie mozna wejsc do gry."

**Naprawa:** picker slotów z #49 — przycisk "⚠ Nadpisz" wywołuje `gameConfirm` ale po Yes nie wchodzi do creatora. Sprawdzić: callback proceed() — czy ov.remove() + showCreator() faktycznie się wywołują.

---

## 60. Traphouse — dziwne okrągłe cienie + podłoga się zmienia

> "W traphouse są jakieś dziwne okrągłe cienie."
> "Podłoga czasami zmienia się i wygląda w ten sposób. Zrób żeby wyglądała tak cały czas."

Screenshot: pokazuje deski drewniane z "okrągłymi cieniami" pod obiektami (round shadows). Poziom oczekiwany: ta podłoga drewniana ma być ZAWSZE tak ładna, nie czasami.

**Naprawa:**
1. Zlokalizować źródło "okrągłych cieni" (drawShadows? drawRoomDecorations?) — usunąć je w mieszkaniu
2. Sprawdzić dlaczego podłoga się "zmienia" — być może random pattern, animacja, time-of-day color shift. Ustawić STAŁY look drewnianej podłogi.

---

## 61. Obraz TRAPLIFE w traphouse zasłonięty

> "Obraz 'TRAPLIFE' jest zasłonięty jakimś obiektem. Przesuń 'TRAPLIFE' gdzieś indziej."

**Naprawa:** zlokalizować rysowanie obrazu TRAPLIFE w mieszkaniu, sprawdzić co go zasłania, przesunąć w wolne miejsce na ścianie.

---

## 62. IKEA — kompletnie nie działa, nic nie zmienia się po zakupie

> "IKEA kompletnie nie działa. Nic nie zmienia się w mieszkaniu po zakupie."

**Naprawa:** sklep meblowy (renderFurnitureShop) — po zakupie sofy/łóżka/etc. faktycznie zmienić render mieszkania. Sprawdzić: czy meble są zapisywane w G, czy drawing functions je używają, czy obiekty w ROOMS są aktualizowane.

---

## 55. Storyline krok 2: opis "V2" niezrozumiały dla gracza

> "Zmień opis w storyline przy kroku 2. Gracz nie wie co to V2."

**Naprawa:** zastąpić "V2" w opisie freestyle-spotu naturalnym opisem (np. "centralna ulica miasta, naprzeciwko Sali Koncertowej").

---

## 56. HUD: "Dzień 1" zamiast "D.1"

> "Zrób żeby na HUD było normalnie dzień a nie D.1."

**Naprawa:** wrócić do pełnego napisu "Dzień X" (skompresowanie do "D.X" było zbyt ascetyczne — gracz preferuje czytelne).

---

## 57. Powiększyć budkę z kebabem (Zbyszek)

> "Powiększ trochę budke z kebabem."

**Naprawa:** zwiększyć rozmiar Zbyszek-stand (NPC sprzedawca uliczny) — szerokość/wysokość rysunku.

---

## 58. NPC w parku znikają przechodząc przez breakdance/fontannę

> "Postacie chodzące po parku 'znikają' przechodząc przez 'breakdance' albo przez fontanne. Potrzebne chyba opacity albo zmiana priorytetu tak zeby postacie były na wierzchu, a nie znikały."

**Naprawa:** rozwiązać z-order — NPC parku rysować PO obiektach parku (breakdance, fontanna), żeby NPC byli na wierzchu zamiast pod nimi.

---

## 1. Storyline krok 1: auto-zalicza bez pracy

> "Linia fabularna kariery - Nie wykonałem żadnej pracy, a zaliczyło mi pierwszy krok."

**Co zweryfikować:** Warunek zaliczenia "Pierwsza wypłata" — czy sprawdza realne wykonanie pracy, czy tylko `G.money > X`. Jeśli to drugie, gracz dostaje 500zł na start i krok od razu się zalicza.

---

## 2. Storyline krok 2: zły opis lokalizacji freestyle

> "W drugim kroku jest napisane różowe kółko w parku (lewy górny róg mapy), a freestyle na ulicy nie jest ani w parku ani w lewym górnym rogu mapy."

**Stan obecny:** freestyle_spot wx:2435 wy:635 — centralna część, NIE park, NIE lewy górny róg.
**Wybór:** albo poprawić opis na rzeczywistą lokalizację, albo przenieść spot.

---

## 3. Kompas firstjob: prowadzi do konkretnej pracy

> "Strzałka prowadzi do myjni, a prac jest wiele. Nie powinna strzałka kierować gracza do konkretnej pracy, powinien sam móc wybrać gdzie chce pracować."

**Możliwe rozwiązania:**
- (a) wyłączyć kompas dla tego kroku
- (b) pokazać kilka pinów na pełnej mapie zamiast jednej strzałki
- (c) zmienić strzałkę na neutralną wskazówkę "znajdź dowolną pracę"

---

## 4. Job agents — napis "Praca!"

> "Postacie ktore krzycza: 'Praca!' ich napis jest zepsuty. Wyskakuje dziwnie, nieregularnie, ucina sie szybko. Popracuj nad tym zeby to krzyczenie 'Praca!' bylo lepsze"

**Wymagania naprawy:**
- regularny rytm pojawiania
- dłuższy czas widoczności
- płynne fade-in/fade-out
- czytelna czcionka z konturem (jak "Połóż cegłę!")
- brak ucinania
- pozycja: dymek nad głową NPC

**Dotyczy NPCów:** Supermarket, Myjnia, Zmywak, Budowa, Kurier, Pizzeria.

---

## 5. VIP Fontanna — interakcja od boków

> "VIP Fontanna dziwnie łapie interakcje. Łapię ją tylko od przodu, a od przodu nie da się podejść, bo stoi tam Penthouse. Zrób żeby od boków też łapała interakcje."

**Naprawa:** rozszerzyć strefę interakcji (actRadius lub w/h) tak by działała też z boków.
Obiekt do znalezienia w ROOMS.ulica.objects: vip_fountain lub apt2_fountain.

---

## 6. Mapa pełna — prostokąty 1/2/4 pokazują dekoracje

> "Bedziemy uzywac okreslen Prostokąt 1, 2, 3, 4. Na prostokącie 1, 2 i 4 na mapie widać pełno obiektów, a stoi tam tylko jeden budynek. Przeanalizuj jak wygląda mapa i zrób żeby były widoczne tylko budynki, a nie ławki czy jakieś inne rzeczy."

**Naprawa:** filtrować pinned-labels na mapie — pokazać tylko główne budynki, ukryć dekoracje (apt1_*, apt2_*, apt4_*, vip_fountain, ławki, latarnie, krzewy, kosze).

---

## 7. Anonimowa darowizna — daje za dużo

> "Anonimowa darowizna daje chyba za dużo. Powinna dawać trochę mniej."

**Naprawa:** znaleźć w random_events / quests, obniżyć kwotę. Trzeba zmierzyć aktualną wartość i dobrać sensownie mniejszą.

---

## 8. Designerska ławka — wygląd

> "Zrób żeby Designerska ławka była na prawdę designerska i żeby wyglądała lapiej."

**Wymagania:**
- ma faktycznie wyglądać premium / designerska
- przykłady stylu: eleganckie kształty, materiał (metal/marmur/szkło), akcenty, podświetlenie
- nazwa w grze powinna pasować do wyglądu

---

## 47. Postać sama idzie non stop w jednym kierunku

> "Czasami postac sama idzie w jednym kierunku non stop. Dopisz to do listy"

**Bug:** Gracz porusza się sam, bez wciskania klawisza, w jednym kierunku.

**Możliwe przyczyny:**
- Stuck key w obiekcie K (klawisze) — keyup nie odpalił po focus loss / blur okna
- Pauza (togglePause) nie czyści K
- Niektóre overlaye łapią keydown ale blokują keyup
- Player.dir nie reset po stop

**Naprawa:**
- Dodać `window.addEventListener('blur', () => for(k in K) delete K[k])`
- Wyczyścić K przy togglePause / closeMG / closeOverlay
- Dodać periodic cleanup (np. co sekundę sprawdzać czy klawisze faktycznie wciśnięte)

---

## 46. Poradnik + wskazówki — spektakularne, animacje/cutscenki

> "Dopisz do planu działania żeby popracować nad poradnikiem i wskazówkami, ma to być lepsze. Poradnik bardziej spektakularny niż zwykłe okienko, może jakieś animacje/cutscenki."

**Wymagania:**
- Poradnik nie zwykłe okienko — spektakularny
- Animacje / cutscenki: kamera podjeżdżająca do ważnych miejsc, podświetlanie obiektów, animowane awatary, intro z muzyką/gradientami/fade
- Każdy krok: jasny CTA + wizualizacja
- Wskazówki: ładniejsze, animowane wjazdy/zjazdy, pasują do reszty UI

**Inspiracja (do dobrania):**
- Ekran arrow + pulsujące highlighty wokół docelowego obiektu
- Tutorial NPC / mentor prowadzący gracza
- Cutscenki przy kluczowych odblokowaniach (mikrofon, pierwszy track, koncert)
- Animowane diagramy/schematy zamiast tekstu

**Cel:** Pierwsze wrażenie WCIĄGA, nie nudzi.

---

## 45. Traphouse — ograniczone studio (nagrywanie + unlock)

> "Zrób żeby w traphouse były już jakieś możliwości ktore daje studio, ale bardzo ograniczone. np gracz może nagrać piosenkę, ale jest ona dużo słabsza jakościowo i zrób żeby jakoś musiał odblokować możliwość nagrywania piosenek w mieszkaniu."

**Wymagania:**
1. Nagrywanie w mieszkaniu możliwe, ale jakość dużo słabsza (-50% do -70%), mniej fanów/streamów, krótszy max track, mniej ścieżek
2. Unlock — np. ≥N freestyle'ów + tani mic USB + Realizacja 1
3. Wizualnie: prosty zestaw (laptop + tani mic + słuchawki), prompt "[E] Nagraj demo"
4. Postęp jakościowy per mieszkanie:
   - Traphouse — minimum (1 ścieżka, najsłabsza)
   - Basic — średnio słabe (2 ścieżki)
   - Premium — prawie studio
   - Penthouse — poziom studio lub lepiej

**Cel:** mieszkanie jako miejsce twórcze + przejrzysta hierarchia jakości względem profesjonalnego studio.

---

## 44. Logika kontekstowa — IG posty / sklepy / akcje wymagają warunków

> "Dodaj do rzeczy ktore nie mają sensu np. to ze gracz moze na instagrama wrzucac kulisty studia na starcie gry gdy nic ze studiem jeszcze nie ma związane. Może wrzucać motywacje, gdy jeszcze nawet nie cwiczyl na silowni. Gracz moze kupic sofe i łóżko ktore ma od razu na starcie"

**Konkrety:**
1. IG kulisty studia — dostępne na starcie mimo że gracz nie był w studio
2. IG motywacja — dostępne bez sesji siłowni
3. Sklep meblowy — można kupić sofę/łóżko które gracz JUŻ ma od startu

**Naprawa:**
- IG/Twitter: każdy typ posta z WARUNKIEM (kulisty studia → ≥1 wizyta w studio, motywacja → ≥1 siłownia, selfie z koncertu → ≥1 koncert itd.). Zablokowane: szare + tooltip "Wykonaj X żeby odblokować"
- Sklepy: filtrować rzeczy posiadane (meble, ubrania, auta, mieszkania — wyszarz/ukryj)
- Audyt całej gry: każda akcja musi mieć sens kontekstowy (kariera/questy/itemy/dialogi NPC)

---

## 43. Linie fabularne — rozbudowa + nowe systemy progresji

> "Potrzebujemy w grze więcej rzeczy typu Linia fabularna kariery. Na jej podstawie popracuj nad tym aby dodać jakieś nowe rozwiązanie działające na podobnej zasadzie i/lub rozwinąć/rozbudować aktualną PAMIĘTAJĄC O SENSIE I LOGICE tak żeby nie było sytuacji typu że krok x przed krokiem y, a krok y jest łatwiejszy do wykonania."

**Zasada:** kroki uporządkowane logicznie po trudności. Krok X przed Y → X łatwiejszy lub równy Y w trudności.

**Kierunki:**
1. **Rozbudowa istniejącej linii rapera** — kolaboracje, trasy, własna wytwórnia, MTV awards, platynowy album
2. **Nowe linie fabularne (równoległe / opcjonalne):**
   - Drip / styl uliczny (od taniego do drogich marek, prestiż, drip 100, ikony)
   - Forma fizyczna (0 kondycji → mistrz siłowni, rekordy)
   - Business mogul (freestyle → własna wytwórnia z innymi raperami)
   - Społeczna (0 znajomych → ekipa, kolaboracje NPC, friend levels)
   - Przeprowadzki (traphouse → basic → premium → penthouse)
3. **Każdy krok:** opis "co robić" + "gdzie iść", trudność rosnąca, konkretna nagroda, status (✓/🎯/🔒)

---

## 42. Sloty zapisu — multi-slot management

> "Dodaj możliwość zarządzania slotami zapisu i wczytywania. Chodzi mi o to żeby gracz mający 1 slot zapisu aktywny mógł niezależnie od tego uruchomić sobie nową grę zachowując poprzedni zapis."

**Funkcjonalność:**
- Min. 3-5 slotów (każdy: nazwa postaci, dzień, czas gry, kasa, level, fans, data zapisu)
- Operacje per slot: nowa gra, wczytaj, nadpisz, usuń, eksport/import
- Menu główne: NOWA GRA → wybór slotu; WCZYTAJ → wybór slotu z zapisem
- Storage: `snowy_save_1`, `snowy_save_2`, ...
- Ekran wyboru slotu z podsumowaniem

---

## 41. [KRYTYCZNE] Wyjścia z budynków — Studio Merch + audyt wszystkich respawn pointów

> "KOLEJNY KRYTYCZNY BUG!!!! Gracz wychodząc ze Studio Merch jest zbugowany i zablokowany w blokach dekoracyjnych i nie może się ruszyć. SPRAWDŹ WSZYSTKIE PUNKTY RESPAWNU. Każde wyjście z każdego budynku itp. żeby NIGDZIE w grze nie było takich sytuacji"

**Naprawa:**
1. Poprawić respawn ze Studio Merch — gracz na wolnym chodniku przed budynkiem
2. **AUDYT KAŻDEGO wyjścia w grze:**
   - mieszkania (traphouse/basic/penthouse/premium)
   - studio + studio merch
   - sklepy (sklep, ubrania, fryzjer, muzyczny, mediamarkt, salon, meble/IKEA, biuro nieruch, warsztat, supermarket, targ, restauracja, pizzeria)
   - prace (myjnia, budowa, kurier, zmywak)
   - siłownia, sala koncertowa, szpital
   - drip district, kabina
3. Test: po wyjściu NIE w bloku, NIE na jezdni, NIE zablokowany przez obiekt; może się ruszyć w 4 strony
4. Systemowy fix anti-stuck — jeśli respawn w bloku, znajdź najbliższy wolny punkt

**ŻADNYCH miejsc gdzie gracz może utknąć.**

---

## 40. [KRYTYCZNE] Major Label glitch — sign+break exploit pieniędzy

> "Gracz może glitchować pieniądze. Kontrakt Major Label daje 10000zł, a zerwanie kontaktu odbiera 2000zł. Gracz może w kółko podpisywać i zrywać kontrakt bugując pieniądze. NIE MOŻE BYĆ ŻADNYCH TAKICH RZECZY W GRZE. TO GAMEBRAKEING BUG!!!!"

**Mechanika exploitu:** sign +10k, break -2k = +8k czystego zysku. Cykl daje nieskończone pieniądze.

**Naprawa:**
1. Bonus tylko przy PIERWSZYM podpisaniu (flag) ALBO cooldown ≥30 dni gry między podpisaniami ALBO kara ≥ bonus + malus reputacji
2. **AUDYT CAŁEJ GRY** — szukać wszystkich mechanik gdzie cykl daje zysk:
   - kontrakty (manager/label/sponsor)
   - kup/sprzedaj (auta, ubrania, sprzęt)
   - inwestycje banku
   - powtarzalne questy/eventy

**ZERO exploitów. ZERO glitchy pieniędzy.**

---

## 39. Browser confirm() → in-game modale (label, tutorial, inne)

> "Zrób żeby zrywając kontakt z wytwórnią nie wyskakiwał 'komunikat z bieżącej strony' z przeglądarki tak samo z ponownych uruchomieniem tutoriala."

**Naprawa:** zastąpić wszystkie natywne confirm()/alert()/prompt() własnymi in-game modalami pasującymi stylem do gry. Konkrety: zerwanie kontraktu z wytwórnią, ponowne uruchomienie tutoriala. **Audyt:** przejrzeć cały kod pod kątem confirm()/alert()/prompt() — każde zamienić.

---

## 38. Bank — limit inwestycji

> "Inwestować w banku można bez końca, powinien być jakiś limit"

**Naprawa:** dodać sensowny limit. Opcje (do dobrania): limit aktywnych inwestycji (np. 3), limit kwoty pojedynczej (zależny od poziomu), cooldown (np. 1/dzień), limit łącznej kwoty.

---

## 37. Merch — sprawdzić czy nie złamany + bug "fala sprzedaży merchu"

> "Sprawdcz czy merch nie jest złamany"

> "Dopisz do rzeczy nie majacych sensu, że wyskakuje komunikat 'fala sprzedaży merchu' i dostaje pieniądze za to, gdy nawet nie zrobiłem nic związanego z merchem"

**Co zweryfikować:**
- odblokowywanie linii merchu, projektowanie, sprzedaż, dochód, magazyn/produkcja, balans liczb, UI
- wskazówki: dbg_merch.mjs / dbg_merch_balance.mjs / dbg_merch_ui.mjs

**KONKRETNY BUG:**
- Komunikat "fala sprzedaży merchu" + kasa MIMO że gracz nie ma aktywnej linii merchu (nie odblokował, nie zaprojektował, nie wystawił).
- Naprawa: guard w random_event handler — `if(G.merch?.active && G.merch.designs.length>0)`. **Audyt wszystkich random_events** — każdy event ma sprawdzać czy gracz faktycznie ma odpowiedni system aktywny (nie ma "wirusowy stream" bez YT, nie ma "freestyle viral" bez freestyle'ów itd.).

---

## 36. Social media (Instagram/Twitter/Spotify itd.) — rozbudowa

> "Zrób żeby rzeczy takie jak instagram, twitter, spotify, itd. były na prawdę ciekawsze. Żeby te posty były jakoś lepiej widoczne, żeby to faktycznie bardziej wyglądało jak post. Może jakieś zdjecie, komentarze. Rozwiń te systemy."

**Kierunki:**
- **Instagram:** posty z grafiką, komentarze fanów/hejterów/NPC, polubienia, zasięg, statystyki rosnące w czasie, stories/reels
- **Twitter:** tweety z layoutem (avatar, handle, czas, retweet/like), replies/threads, trending tags zależne od stanu gry, reakcje
- **Spotify:** lista tracków, mock-player, streamy dzienne/tygodniowe, top miasta/kraj, royalty timeline, playlisty, karta artysty
- **Inne:** YouTube/TikTok/Twitch/Reddit-like jeśli mają sens

**Wymagania:**
- Każda platforma wygląda jak prawdziwa
- Posty/wpisy centralne i czytelne
- Komentarze, polubienia, statystyki — gracz czuje że buduje publiczność
- Spójny design system między platformami

---

## 35. Instagram — pokaż wszystkie sposoby zdobywania obserwujących

> "Na instagramie jest informacja o Autopromocja, a nie ma informacji o innych sposobach na pozyskiwanie więcej obserwujących, np. drip"

**Naprawa:** dodać do ekranu Instagrama sekcję "Jak zwiększać zasięg / followers" z listą wszystkich metod (Autopromocja, drip/prestiż, forma, posty, koncerty/fame, royalty/trendy itd.) — każda krótkie wyjaśnienie i jak działa (multiplier / odblokowanie).

---

## 34. Twitter/Instagram — daily reset wrzucania postów

> "Sprawdź czy faktycznie każdego dnia w grze można wrzucać tweet, post na instagrama, bo wydaje mi sie, ze to nie działa i że można wrzucić tylko raz i nie da się więcej."

**Naprawa (po weryfikacji):**
- Tweet i Instagram: limit dzienny, reset przy G.day++
- Sprawdzić czy liczniki (np. G.tweetCountToday) są zerowane na nowym dniu
- Inne social media (jeśli są): też sprawdzić

---

## 33. Czas gry — weryfikacja czy dni mijają poprawnie

> "Sprawdź czy czas w grze działa, czy dni mijają, aktualizują się, zmieniają"

**Co zweryfikować (przy implementacji, NIE teraz):**
- gameMin rośnie poprawnie (ticks)
- timeOfDay (0/1/2/3) zmienia się we właściwych godzinach
- G.day++ wykonuje się raz na dobę (nie podwójnie / nie wcale)
- nightBonus / godziny otwarcia / festivale / kontrakty obsługują day++
- sen / odpoczynek przesuwa czas poprawnie
- save/load zachowuje czas

Powiązane z punktem 16 (przyspieszenie czasu).

---

## 32. Freestyle spot — usunąć drugi mikrofon nad ikoną

> "Ikona freestylu na ulicy ma 2 mikrofony. Usuń ten nad ikoną, niech zostanie tylko ten w środku ikony"

**Naprawa:** w drawFreestyleSpot() usunąć rysowanie mikrofonu poza ikoną — zostawić tylko ten w środku.

---

## 31. Kondycja — przenieść z telefonu (raper) do drzewka umiejętności

> "Kondycja nie powinna byc w telefonie w raper, to powinno byc normalnie w drzewku umiejętności"

**Naprawa:** usunąć Kondycję z widoku phone:raper. Dodać ją jako pełnoprawną gałąź skill tree (poziomy, opisy, bonusy). Wymóg odblokowania: bieżnia.

---

## 30. Studio — sens, logika, mikser, mastering, dystrybucja

> "Popracuj nad ogólnym 'sensem' studia i logiką, bo tu na prawdę większość rzeczy nie ma sensu. To na prawdę ma ogromny potencjał, ale wymaga pracy. Bez sensu jest np. to, ze mozna tworzyc bit poprzez interakcje z mikser i mozna to robic w komputerze, bez sensu jest to, ze mozna nagrywac wokal poprzez interakcje z kabina i poprzez interakcje z komputerem. Raczej te rzeczy robi sie w komputerze. Mikser w komputerze też działa kompletnie źle, jak gracz przesuwa suwakami to nie aktualizuje się liczba, dopiero po naciśnięciu 'Zrób miks zapisz wynik'. Nie powinno byc tak, ze gracz po stworzeniu bitu moze wybierac gatunek. Przeciez jak bit jest juz stworzony w danym gatunku to nie mozna zmienic jego gatunku. Mikser tez powinien byc ogolnie fajniejszy. Gracz nie wie jak ma ustawic te suwaki, powinny byc jakies sugerowane wartosci/przedziały w zależności od gatunku, mikser powinien tez miec wiecej opcji. Spamując 'Zrób miks zapisz wynik' i spamując 'Master finalizuj' wartości cały czas się zmieniają nawet jak nie zmieni się nic na suwakach. LUFS powinno mieć inną skalę, np od -0LUFS do -30LUFS. -0LUFS powinno odbierać jakość za przester, a -30LUFS powinno odbierać jakość za to że jest zbyt ciche. Powinno być tak że im lepszy miks posiada gracz tym mniej LUFS może 'wykręcić', np. przy słabym miksie od mniej niż -10LUFS odbiera jakość, a przy dobrym miksie od mniej niż -5LUFS odbiera jakość. Im mniej -LUFS tym lepszy mastering. Dystrybucja tez jest cała dziwna. Wymogi powinny byc inne niz poziom, 300 zł/rok nie ma sensu, bo gracz w przeciągu dnia w grze może zarobić dużo więcej niż 300zł. Napis po wybraniu dystrybutora jest czarną czionką napisany przez co jest bardzo słabo widoczny. Powinno sie dziać coś więcej po wyborze dystrybutora, bo aktualnie gracz wybiera i nic sie nie dzieje. Nie ma zadnego uploadu, wrzucenia muzyki do dystrybutora itp. Podaje Ci tylko przykłady i pomysły, nie traktuj tej wiadomości jako 'konkretny prompt' tylko zainspiruj się tą wiadomością i na jej podstawie pracuj z udoskonalaniem Studio. Studio to bardzo ważna rzecz w grze i ona musi być na prawdę mega dobra. Ma tam być sens, logika, nie ma być błędów, problemów i ma wszystko wyglądać ładnie."

**A. Logika — zero duplikatów, wszystko przy komputerze:**
- Tworzenie bitu: tylko komputer (nie przez mikser)
- Nagrywanie wokalu: tylko komputer (nie przez kabinę)
- Mikser w pomieszczeniu = element wizualny, nie wejście do funkcji
- Cały workflow muzyczny: komputer (DAW) jako centrum

**B. Mikser w komputerze:**
- Suwaki ŻYWO aktualizują liczbę (nie dopiero po "Zrób miks")
- Więcej opcji (EQ pasmowe, kompresor, reverb send, panorama, side-chain)
- Sugerowane wartości / przedziały w zależności od gatunku
- Fajniejszy / czytelniejszy
- BUG: spamowanie "Zrób miks" / "Master finalizuj" zmienia wynik BEZ zmiany suwaków → deterministyczny wynik

**C. Gatunek:**
- BUG: gatunek wybierany PO bicie. Gatunek tylko przy tworzeniu bitu.

**D. LUFS — przebudowa skali:**
- Zakres 0 LUFS do -30 LUFS
- 0 LUFS → penalty za przester
- -30 LUFS → penalty za zbyt cicho
- Lepszy miks → wąski bezpieczny zakres:
  - słaby miks: penalty < -10 LUFS
  - dobry miks: penalty < -5 LUFS
- Im bliżej 0 (mniej -) tym lepszy mastering (w bezpiecznym zakresie)

**E. Dystrybucja:**
- Wymogi inne niż "300zł/rok" — gracz zarabia więcej w 1 dniu. Wymogi: poziom kariery, liczba tracków, jakość masteringu, fans threshold
- Napis po wyborze dystrybutora czarną czcionką → niewidoczny. Naprawić kontrast.
- Po wyborze dystrybutora konkretny flow: upload track, progress bar, komunikat sukcesu, oczekiwanie na royalties/streamy, panel statusu wydawniczego
- Spójny proces: nagraj → mix → master → upload → wydanie → royalties

**F. Filozofia:** Studio = mega ważne. Sens, logika, zero błędów, wszystko ładne.

---

## 29. Studio — pełna remodernizacja (akustyka, realizacja, beat sequencer)

> "Wracamy do punktów ze Studio. Studio jest kompletnie zepsute i wymaga pełnej remodernizacji i wszystko co się w nim znajduje. Po kupieniu słuchawek one 'leżą na podłodze' Powinny gdzieś być w jakimś sensownym miejscu, np. na statywie mikrofonu lub na biurku przy komputerze, tak żeby miało to jakiś sens. Studio za mało wygląda jak studio. Zrób tak żeby gracz mógł kupować kilka pianek akustycznych/paneli akustycznych i żeby one stackowały jakość. Dodaj kompletnie nowy system montażu pianek akustycznych i paneli akustycznych. Zrób żeby gracz po ich zakupieniu miał podświetlone jakieś miejsca na ścianie i po naciśnięciu je 'montował'. Realizacja wokalu jest kompletnie zepsuta, po naciśnięciu 'Nagrywaj' gra się freezuje i gracz nie może się ruszyć. Zlecenie - po naciśnięciu 'Przyjmij' nic się nie dzieje. Powinien też być jakiś fajny system. W stwórz bit Sequencer musi działać kompletnie inaczej. Gdy gracz naciska 'Play' powinna muzyka w tle się wyciszać. Usuń opcje 'randomize'. Gdy 'Play' włączony nie można dodać ani usunąć niczego. Zmiana BPM też nie działa, ani się nie przyspiesza ani nie spowalnia. Usuń Synth. Zamień bass na 808. Dodaj Clap i Open hat."

**A. Wygląd / wyposażenie**
- Słuchawki po zakupie leżą na podłodze → na statywie mikrofonu lub biurku
- Studio za mało wygląda jak studio — klimat (kable, lampki, "ON AIR", więcej sprzętu)
- DOPISANE: LEDy / neony (RGB strips, ON AIR, logo), inna podłoga niż basic (ciemna wykładzina/drewno studyjne/dywan)

> "Całe studio musi wygladac bardziej jak studio, miec jakies ledy, neony, inną podłogę niż taką 'basic'."

**B. Pianki/panele akustyczne — nowy system**
- Gracz kupuje kilka pianek/paneli — jakość stackuje
- Po zakupie podświetlone miejsca na ścianach → klik = montaż
- Wizualnie: ściany stopniowo wypełniane

**C. Realizacja wokalu / Nagraj wokal — oba freezy**
- BUG: po "Nagrywaj" w realizacji wokalu gra się freezuje (gracz nie rusza). Naprawić.
- BUG (dopisane): "Nagraj wokal" w KOMPUTERZE w studio też freezuje grę i gracz nie może się ruszyć. Sprawdzić czy to ten sam handler — naprawić oba.

> "'Nagraj wokal' w komputerze w studio kompletnie zepsute. Freezuje gre i gracz nie może się ruszyć"

**D. Zlecenie**
- BUG: "Przyjmij" nic nie robi. Naprawić.
- Dorobić fajny system zleceń (wybór projektu, deadline, minigra, ocena)

**E. Beat Sequencer — przebudowa**
- "Play" → wyciszyć muzykę w tle
- Usunąć "Randomize"
- Podczas Play nie można dodać/usunąć
- Zmiana BPM faktycznie przyspiesza/spowalnia
- Usunąć Synth
- Bass → 808
- Dodać Clap
- Dodać Open Hat

---

## 28. Siłownia — obciążniki, napisy, ławka/wyciąg, bieżnia, trudność

> "Na siłowni dodaj obciążniki przy każdej macie bo są tylko przy jednej. Wchodząc w interakcje z ławka nie powinno być napisu: 'Ławka / Wyciąg' tylko po prostu sama 'Ławka' i tak samo wyciąg. Ławka i wyciąg w ogóle nie działają. Wybierając obciążenie nic się nie pojawia. Bieżnia trwa za długo, zrób 15 sekund. Siłownia jset wciąż za łatwa. W trakcie testów mam 0 kondycji (czyli powinno być jeszcze trudniej) a Sprint x4 jest mega łatwy i tej spacji praktycznie nie trzeba spamować. Pamiętaj że ma być tak że im więcej kondycji ktoś ma tym łatwiej, ale powinno to być ogólnie dużo trudniejsze tak żeby gracz na prawdę miał możliwość 'przegrać' i musiał tą spacje na prawdę spamować. Pamiętaj że im większe obciążenie czy im większa prędkość na bieżni tym lepsze przyrosty, ale trudność wzrasta. Zrób żeby na prawdę trzeba było mocno spamować."

**Pakiet:**
1. Obciążniki przy KAŻDEJ macie (teraz tylko przy jednej)
2. Prompt interakcji: oddzielnie "Ławka" i "Wyciąg" — bez wspólnego "Ławka / Wyciąg"
3. **Ławka i wyciąg nie działają** — po wyborze obciążenia minigra się nie pokazuje. Naprawić.
4. Bieżnia: skrócić do **15 sekund**
5. **Trudność:** dużo trudniej.
   - 0 kondycji = znacznie ciężej (możliwe "przegranie")
   - więcej kondycji = łatwiej (skalowanie zachowane)
   - większe obciążenie / wyższa prędkość = lepsze przyrosty + większa trudność
   - gracz musi REALNIE spamować spację

Dotyczy bench press i treadmill.

---

## 27. Wskazówki — nie pokazywać podczas minigier/prac/telefonu

> "Wskazówki nie powinny wyskakiwać gdy gracz ma jakąś minigre, prace, czy włączony telefon. Wskazówki potrafią zasłaniać graczowi gre w momentach w ktorych nie powinny"

**Naprawa:** guard w showTip / showHint — nie pokazywać gdy `mgOpen() || phoneOpen() || overlayOpen() || _paused || npcDlgOpen() || char-panel || admin-panel`. Kolejkować albo pominąć — następna wskazówka pokaże się normalnie po powrocie do swobodnej gry.

---

## 26. Studio + cała gra — wymogi przy każdej opcji + komunikaty na wierzchu

> "W studio kabina pokazuje tylko przy realizacja wokalu co jest wymagane, np. zlecenie i ghostwriting nie pokazuje wymogów. Naciskając na Zlecenie 'Przyjmij' komunikat: 'Wymaga mikrofonu lub Realizacja 1+' wyskakuje 'pod okienkiem', prawie tego nie widać. Powinno być tak, że jak gracz ma uruchomione jakieś okno to wyskakuje mu taki komunikat 'nad oknem' a nie jest pod nim schowane (ma większy priorytet). Na podstawie tego przeanalizuj całą grę pod tym kątem i zobacz czy w innych miejscach nie ma podobnego problemu."

**Trzy zadania:**
1. Wymogi (np. "Wymaga mikrofonu lub Realizacja 1+") pokazywane przy KAŻDEJ opcji w studio (zlecenie, ghostwriting, …) — nie tylko przy "Realizacja wokalu"
2. Komunikaty wyskakujące w czasie otwartego okna mają być NA WIERZCHU (wyższy z-index niż okno)
3. Audyt całej gry — przejrzeć wszystkie miejsca gdzie komunikat może zostać schowany pod oknem; rozwiązać systemowo (komunikat zawsze top z-index)

---

## 25. Studio + Siłownia — ucięte, czarny pasek, napisy, brak komputera

> "W studio głośnik zasłania jakiś napis (nad biblioteką). Całe studio jest jakby 'ucięte' i po prawej stronie ekranu jest wielki czarny pasek. W studio są napisy które są 'nieostre', wyglądają jakby miały słabą jakość, są 'rozpikselowane', przeanalizuj WSZYSTKO i zrób żeby ŻADNE napisy w grze nie wyglądały jak te przykładowe w studio, np. 'kabina', 'mixer'. W studio nie ma komputera, jest tylko pusty prostokąt. Nie powinno tam być napisu kup DAW tylko cos zwiazanego z tym, ze to jest komputer."

> "Siłownia ma ten sam błąd co studio - jest 'ucięta' i po prawej stronie ekranu jest wielki czarny pasek."

**5 problemów:**
1. Głośnik zasłania napis nad biblioteką w Studio — przesunąć
2. **Studio + Siłownia "ucięte"**, czarny pasek po prawej — naprawić systemowo (sprawdzić też pozostałe wnętrza — może bug ogólny)
3. Rozpikselowane napisy (np. "kabina", "mixer") — przeanalizować WSZYSTKIE napisy w grze, ŻADEN nie ma wyglądać jak te. Wzorzec: "Połóż cegłę!" (strokeText+fillText, no blur)
4. Brak komputera w studio — tylko pusty prostokąt. Narysować komputer (monitor, klawiatura, mysz, biurko)
5. "Kup DAW" → coś o KOMPUTERZE (np. "💻 Kup komputer studyjny")

---

## 24. Admin panel — dodać więcej opcji

> "Dodaj do admin panelu więcej opcji, np odblokowywanie miejsc, zmiana czasu (w grze), zmiana prędkości, albo ustawienie żeby nie spadały statystyki typu głód, energia itp."

**Opcje do dodania:**
- odblokowywanie konkretnych miejsc/karier
- zmiana czasu w grze (gameMin)
- zmiana prędkości upływu czasu (multiplier)
- freeze statystyk (toggle: hunger/energy/health/stress nie spadają)
- (sugestia) dodaj kasę / fanów / followers / streetRep
- (sugestia) set weather, teleport

**Cel:** szybkie debugowanie i testowanie.

---

## 23. Godziny otwarcia — zawsze coś jedzeniowego dostępne

> "Ustaw godziny otwarcia miejsc tak żeby gracz zawsze miał możliwość coś zjeść gdy potrzebuje. Chodzi mi o to żeby nie było sytuacji, że np supermarket, pizzeria, targ i restuaracja są wszystkie zamknięte o jakieś porze."

**Zasada:** o każdej porze doby ≥1 miejsce z jedzeniem otwarte.

**Plan:** zinwentaryzować obecne godziny → rozłożyć shiftami (np. pizzeria 11–23, restauracja 12–24, supermarket 6–22, targ 7–15, Zbyszek 24/7 albo nocny) → komunikat "Zamknięte" sugeruje gdzie aktualnie otwarte.

---

## 22. Polish wszystkich prac/minigier/okienek

> "Popracuj nad ulepszeniem prac, minigier. Tak żeby były ciekawsze i wyglądały lepiej, np. zmywak ma słabe napisy, kran nawet nie wiadomo jak działa i co robi, 'SZTUĆCE' są prawie nieczytelne, nie można nawet ich myć, nie wiadomo po co tam są. Każda praca, minigra, każde okienko. Wszystko ma wyglądać lepiej. Popracuj bardzo konkretnie nad tym."

**Konkretne problemy w zmywaku (przykłady):**
- słabe napisy
- kran — nie wiadomo jak działa i co robi
- "SZTUĆCE" prawie nieczytelne, nie da się myć, niewiadomy cel — dać funkcję albo usunąć

**Zakres:**
- prace: pizza, supermarket, myjnia, budowa, kurier, zmywak
- minigry kariery: freestyle, koncert, beat sequencer, edytor video, influencer post, cooking
- okienka: sklepy, telefon, DAW, studio, fryzjer, ubrania, biuro nieruchomości, eventy

**Wymagania:**
- czytelne napisy (styl "Połóż cegłę!" — strokeText+fillText, no blur)
- jasne instrukcje co robić
- WSZYSTKIE elementy mają funkcję (zero dekoracji udających mechanikę)
- spójny styl wizualny
- feedback dla każdej akcji (kolor/animacja)

**Plan pracy:** inwentaryzacja problemów per minigra → fixy w batch'ach → weryfikacja screenshotami.

---

## 21. Zmywak — kursor znika + okno zamyka się po szybkim restartcie

> "Po zakończeniu pracy na zmywaku znika kursor."

> "Dopisz do punktu zmywak, ze jak gracz szybko nacisnie 'Wyjdź' po skończeniu pracy i rozpocznie nową to zamyka mu się okno."

**Naprawa:**
1. W cleanup zmywaka przywrócić kursor (zdjąć `cursor:none`). Sprawdzić inne minigry z custom kursorem.
2. Bug ze zamykaniem okna nowej pracy — prawdopodobnie pozostały timer z poprzedniej sesji wywołuje cleanup nowej. Użyć session token (jak `_jobPanelSession`) — stary timer nie może zamknąć nowej minigry.

---

## 20. Pizzeria — praca + jedzenie (różne pizze) + usunąć pizzę z Restauracji

> "Ulepsz pizzeria żeby było tak jak w Restauracja czyli można tam pracować, ale można też zjeść jakieś jedzenie. Dodaj różne warianty pizzy i usuń pizza z Restauracji."

**Wymagania:**
1. Pizzeria pozwala pracować (już jest) + jeść — jak Restauracja
2. Różne warianty pizzy (margherita, pepperoni, hawajska, capricciosa, quattro formaggi, salami itd.) — różne ceny i efekty
3. Usunąć pizzę z Restauracji (uniknąć duplikatu — każde miejsce ma swoje danie)

Wzór: shop:restauracja / FOOD_CATALOG.

---

## 19. Fryzjer — podgląd fryzury bez głowy

> "Podgląd u fryzjera jest zepsuty i dziwny. Nie widać w ogóle głowy, np. 'Łysy' pokazuje tylko oczy i uśmiech."

**Naprawa:** w podglądzie fryzury rysować najpierw głowę (skin color), potem fryzurę, potem oczy/usta. Sprawdzić wszystkie warianty (łysy, krótka, długa, dredy itd.) — każdy ma pełną głowę.

---

## 18. Zbyszek — okno nie zamyka się po zakupie

> "Zrób żeby okno rozmowy z Sprzedawca uliczny zbyszek nie zamykało się samo. Aktualnie gdy gracz chce kupic kebaba, zupę dnia i energetyka musi wchodzić 3 razy w interakcje ze Zbyszek."

**Naprawa:** po zakupie u Zbyszka okno zostaje otwarte — można kupić kolejne rzeczy. Zamknięcie tylko przyciskiem "Wyjdź" / ESC. Sprawdzić też inne sklepy które mogą mieć ten sam problem.

---

## 17. Targ — tylko "do lodówki" (bez "zjedz teraz")

> "Na targu powinna być możliwość zjedzenia teraz albo do lodówki."

> ZMIANA: "Zmień w targu żeby była opcja tylko do lodówki (bez zjedz teraz)"

**Naprawa:** na targu TYLKO opcja "do lodówki". Bez "zjedz teraz". Wszystko kupione idzie do lodówki/spiżarni jako zapas.

---

## 16. Czas gry — dzień trwa za długo

> "Musimy przyspieszyć trochę czas gry. Aktualnie dzień trwa za długo"

**Naprawa:** przyspieszyć upływ gameMin. Sprawdzić aktualny stosunek (real sec : game min), dobrać szybsze tempo. Wyważyć — szybciej, ale gracz musi zdążyć z normalnymi akcjami.

---

## 15. Strój sportowy — bonus do siłowni zamiast +2HP

> "Strój sportowy bez sensu, ze daje 2hp. Powinien np dawac lepsze przyrosty na siłowni"

**Naprawa:** zmienić efekt stroju sportowego — zamiast +2HP, bonus do siłowni:
- przykład: lepsze przyrosty fitness/kondycji na bench press i treadmill
- mniejszy koszt energii podczas ćwiczeń
- szybsze postępy

Lokalizacja: sklep ubrań + funkcja efektów ubrań (cloth bonuses).

---

## 14. Storyline — opóźnienie aktualizacji statusu

> "Wszystko aktualizuje się jakby za wolno. Zrobiłem np. krok 2 linii fabularnej i dopiero po dłuższej chwili się to zaliczyło."

**Problem:** opóźnienie zaliczenia kroku — krok 2 zaliczył się dopiero po dłuższej chwili od wykonania.

**Naprawa:**
- Zamiast polling co interval — sprawdzać natychmiast po istotnych akcjach (freestyle ukończony, kasa zarobiona, fan zdobyty itd.)
- Albo: zmniejszyć interval do ~1s lub co klatkę
- Sprawdzić też inne systemy (questy, milestones, achievements) czy nie mają tego samego problemu

---

## 13. Audyt gruby — gospodarka, ceny, progresja, statystyki, logika, grind

> "Sprawdź ogólnie wszystkie statystyki i możliwości ich zbierania. Nie wiem czy ze sławą jest wszystko okej. Sprawdz czy wszystkie statystyki są 'logiczne' czy mają sens i czy to jak i ile danej statystyki dostaje gracz nie jest nigdzie 'złamane' i jest zgodne z progresją i rozwojem. Gracz ma nie skończyć gry mega szybko i ma być wymagany grind do odblokowania najdroższych rzeczy. Sprawdz doslownie wszystko, to ile expa dostaje gracz, sławy, fanów, obserwujących, hardcore fanów. DOSŁOWNIE WSZYSTKO."

> "Zrób ogólny, bardzo konkretny audyt gospodarki, balansu, zarobków, zdobywania statystyk. Wydaje mi się że wciąż są źródła dochodu i źródła zdobywania statystyk które są złamane. Chciałbym żeby to działało logicznie, czyli prace dorywcze dają najmniej (bo są dostępne od samego początku i nie wymagają inwestycji) ale są mniej więcej zbalansowane względem siebie i gracz może na każdej pracy dorywczej zarabiać podobnie i zgarniać podobną ilość expa. Chodzi o czas pracy w trochę dłuższej skali. Pracę które wykonuje się dłużej mogą dawać trochę więcej, prace które wykonuje się szybciej mogą dawać troche mniej, ale zeby byly mniej wiecej zbalansowane względem siebie, np. że gracz w każdej pracy po 10 minutach zarobi podobną ilość pieniędzy/expa i innych statystyk. Miejsca które wymagają inwestycji/odblokowania wiadomo że muszą dawać więcej, ale zrób żeby to było zbalansowane."

> "Zrób ogólny, na prawdę konkretny, pełna analiza logiki i sensu rozgrywki. Wszystkich cen, rozwoju, progresji, zdobywania statystyk. Są rzeczy ktore dalej nie maja sensu, np. energetyk u Sprzedawca uliczny - zbyszek kosztuje 6zł i daje 30 energi, a energetyk w sklepie spożywczym kosztuje 22zł, daje 50 energi i odbiera 2 zdrowia. Przeanalizuj każdą statystykę w grze. Sprawdz jej możliwości zdobywania, nie jestem pewny ale wydaje mi sie że ze sławą też może być coś nie tak. To ma być na prawdę gruby audyt. Popracuj na prawdę konkretnie nad logiką i sensem."

**Filozofia balansu (zarobki):**
- Tier 1 (prace dorywcze) — najmniej, bez inwestycji; zbalansowane w sobie (≈10 min = podobna kasa/exp)
- Tier 2+ — wyżej, też zbalansowane

**Filozofia GRINDU (KLUCZOWE):**
- Gracz NIE kończy gry mega szybko
- Top-tier (Bugatti, Penthouse, Mac Studio top, kontrakt label) = wymaga kilkudziesięciu dni gry
- Każde źródło XP/sławy/fanów/itd. zgodne z tempem progresji
- ZERO źródeł dających absurdalnie dużo

**Konkretny przykład bug-a (od gracza):**
- Energetyk u Zbyszka: 6 zł, +30 energii
- Energetyk w supermarkecie: 22 zł, +50 energii, -2 zdrowia
- Nielogiczne — Zbyszek bije supermarket

**Plan audytu:**
1. **Źródła dochodu** — prace dorywcze, prace studyjne, kariery, eventy, darowizny, sklepy, royalties, bank, merch, sponsorzy
2. **Ceny i efekty przedmiotów** — jedzenie, sprzęt, ubrania, samochody, mieszkania, skill upgrades
3. **Audyt KAŻDEJ statystyki — DOSŁOWNIE WSZYSTKO:**
   - **XP** — źródła, ile, próg poziomu
   - **Skill points** — ile za co
   - **Sława (fame)** — podejrzenie gracza że jest złamana, sprawdzić DOKŁADNIE
   - **Fans casual** — źródła, tempo
   - **Fans hardcore** — wymagają konkretnych akcji, nie z byle czego
   - **Haters** — związane z negatywami, nie spadają losowo
   - **Followers** (IG/Twitter) — daily limit, multipliery
   - **Street rep** — z czego, nie za łatwo
   - **Health/energy/hunger/stress** — decay vs regen
   - **Kondycja** — siłownia decay
   - **Drip / prestiż** — z czego, jak szybko
4. Identyfikacja złamanych: absurdalnie dużo, nielogiczne, niezgodne z grindowym tempem
5. Wyrównanie — KONKRETNE TABELE LICZB (przed/po)

**To ma być NA PRAWDĘ GRUBY AUDYT — DOSŁOWNIE WSZYSTKO.** Konkretne tabele liczb, przetestowane na realnych ścieżkach.

---

## 12. HUD — rework wizualny + napraw nakładanie zegara

> "Godzina na hud jest zasłonięta przez ikone ustawień głośności. Popracuj nad HUD, chciałbym żeby był ładniejszy, bo teraz wygląda jak taki czarny odcinający grę pasek. Dodaj może jakieś tło fajne na ten hud, zrób żeby było ładniejsze i żeby było czytelne i nic nie nachodziło na siebie i nie zasłaniało siebie nawzajem"

> "Dopisz do punktu HUD, ze ikona glosnosci zasłania czas gdy są 4 cyfry, np 20:50."

**Wymagania:**
1. **BUG:** zegar zasłonięty przez ikonę głośności 🔊 — KONKRETNIE: zasłania czas gdy są 4 cyfry (np. 20:50). Naprawić przez przesunięcie ikony lub zwiększenie miejsca zegara
2. **Wizualnie:** HUD wygląda jak czarny pasek odcinający grę. Ma być ładniejszy:
   - jakieś fajne tło (gradient / blur / akcenty)
   - integruje się z grą zamiast odcinać
3. **Czytelność:** wszystko czytelne, nic na siebie nie nachodzi, nic się nawzajem nie zasłania

**Cel:** HUD premium, każdy element ma swoje miejsce.

---

## 11. Pasy drogowe — kolor biały + nie nachodzą na przejścia

> "Na każdym skrzyżowaniu ostatnia linia zółtych pasów drogowych nachodzi na przejście dla pieszych. Ustaw linie drogowe tak żeby nie wchodziły na pasy od przejścia dla pieszych. Zmień kolor pasów drogowych na biały."

**Naprawa:**
1. Skrócić linie drogowe tak by kończyły się PRZED strefą przejścia z każdej strony (4 strony każdego skrzyżowania)
2. Zmienić kolor żółty → biały (lub jasnoszary)

**Zakres:** wszystkie H-roads (H1/H2/H3), wszystkie V-roads (V1/V2/V3), wszystkie 9 skrzyżowań.

---

## 10. System samochodów — pełny rework

> "Samochody muszą działać kompletnie. To musi być na prawdę fajny i działający system. Powinno być tak, że gracz może wsiadać i wysiadać z samochodu i że wygląda to jakoś lepiej niż 'przyklejony' samochód do gracza. Aktualnie zepsute jest też to, że gracz po zakupieniu samochodu porusza się szybciej nawet w budynkach. To nieimmersyjne, bo gracz w budynkach nie jeździ autem przecież."

> "Dopisz do punktu z systemem samochodów, że auta są przesadzone. Zdecydowanie za szybkie, np Bugatti Chiron pędzi tak szybko, ze to aż dziwne. Dopisz do tego punktu zeby te auta roznily sie wyglądem i każde droższe było dużo ładniejsze od poprzedniego. Np Bugatti Chiron ma wyglądać przepięknie, a Maluch gorzej. Zastosuj to dla każdego auta."

**Wymagania:**
1. **Pełny system jazdy** — wsiadanie/wysiadanie (np. E przy aucie, ponowne E by wysiąść)
2. **Wygląd** — auto NIE jak "przyklejone" do gracza; gdy gracz wsiada, postać znika/siedzi w środku, rysuje się tylko pojazd
3. **BUG:** prędkość od samochodu działa też W BUDYNKACH — nieimmersyjne. Bonus tylko gdy `currentRoom==='ulica'` ORAZ gracz wsiadł do auta
4. **Prędkość przesadzona** — auta za szybkie, Bugatti Chiron pędzi absurdalnie. Zmniejszyć prędkości wszystkich aut, zachować progresję (droższe szybsze, ale realistyczne)
5. **Wygląd zróżnicowany według ceny** — każde droższe auto DUŻO ładniejsze:
   - Maluch — najgorszy wygląd (mała, rozpadająca się, prosta bryła)
   - kolejne tiery — coraz lepsze
   - Bugatti Chiron — przepięknie, premium look (linie, akcenty, refleksy, detale)
   Dotyczy KAŻDEGO auta z listy zakupów.

**Cel:** fajny, immersyjny, działający, zbalansowany system samochodów.

---

## 9. Zróżnicowanie mapy — sekcje/osiedla + zagospodarowanie pustych przestrzeni

> "Musimy trochę zróżnicować mapę, bo aktualnie prawie wszędzie wygląda tak samo (mnóstwo bloków dekoracyjnych). Musimy zrobić tak żeby podzielić ją na osiedla/sekcje i zróżnicować, np. może być sekcja która jest bardziej blokowiskiem i jest więcej tych bloków ozdobnych, ale możemy też w innej sekcji pousuwać te bloki ozdobne i zagospodarować wolną przestrzeń w inny sposób, może jakąś zielenią, drzewami, krzekami, trawą, kwiatami itp. Popracuj nad zróżnicowaniem mapy tak żeby nie było wszędzie blokowisk tylko żeby była różna, żywa i ciekawa."

> "Dolna część mapy prostokąty 1,2,3,4 są puste. Dopisz to do kroku zróżnicowanie mapy i pracując nad tym krokiem zagospodaruj ładnie wolne przestrzenie tak żeby całe miasto było pełne, ładne i nie było wiele pustych przestrzeni"

**Plan:**
1. zinwentaryzować obecne sekcje mapy (DB_DECORATIVE — gdzie ile bloków)
2. zaprojektować podział na strefy z różnym charakterem
   - przykład A: blokowisko — gęste bloki dekoracyjne (jak teraz)
   - przykład B: park/zieleń — usunąć bloki, dać drzewa, krzewy, trawniki, kwiaty
   - inne propozycje (np. dzielnica handlowa z kioskami, plac z fontanną, osiedle z ogródkami)
3. przerobić — dla każdej sekcji odpowiedni zestaw obiektów
4. **Dolny pas — Prostokąty 1, 2, 3, 4 są puste** (poza samymi budynkami). Trzeba zagospodarować wolne miejsce wokół budynków (bez kolizji z budynkiem) — zieleń, alejki, ławki, latarnie, drobne dekoracje pasujące do charakteru danego budynku (np. luksusowe akcenty wokół Penthouse/Premium, modne wokół Drip, skromne wokół Mieszkania)

**Cel:** mapa różna, żywa, ciekawa — nie wszędzie blokowiska, brak pustych przestrzeni.

---

## SYGNALIZATORY ŚWIETLNE — pełna przebudowa (sygnalizator + mechanika + ruch aut)

> Cytat użytkownika: "Sygnalizatory dalej wyglądają źle, wyglądają po prostu jakby były zepsute. Zrób research, sprawdź jak na prawdę wyglądają skrzyżowania z sygnalizacją świetlną i odwzoruj to w naszej grze. Wysięgniki niektóre nachodzą na chodnik, inne przez przejście dla pieszych (biała linia przecinająca przejścia dla pieszych). Cała mechanika też jest kompletnie zepsuta. Powinno być tak że jak pieszym zapala się zielone to dla pojazdów czerwone i na odwrót tak samo, jak pojazdom zapala się zielone to pieszym zapala się czerwone. Cała ta mechanika w ogóle nie działa. Jak jakiś pojazd się zatrzymuje na czerwonym to zamiast zatrzymywać się PRZED skrzyżowaniem zatrzymuje się na środku skrzyżowania 'obraca się' (reflektory w drugą stronę) i jak zaczyna jechać to znowu się obraca, a większość pojazdów kompletnie ignoruje czerwone światło i po prostu lekko zwalniają i jadą dalej na czerwonym."

### 1. WYGLĄD SYGNALIZATORÓW — research realnych skrzyżowań

**Problem:** sygnalizatory wyglądają zepsute, jakby były ułożone byle jak. Wysięgniki nachodzą na chodnik lub na pasy przejścia dla pieszych.

**Do zrobienia:**
- Research: jak naprawdę wyglądają polskie/europejskie skrzyżowania z sygnalizacją? (Zdjęcia referencyjne — pomyśleć: gdzie są słupy, jak wysoko, jak rozłożone wysięgniki, jak orientowane sygnalizatory)
- Reorganizacja pozycji słupów: każdy słup MUSI stać na chodniku (nie na jezdni, nie na pasach przejścia, nie wystawać poza chodnik)
- Wysięgniki NAD jezdnią — łukowate, NIE przecinają białych pasów przejścia dla pieszych
- Sygnalizator dla aut na końcu wysięgnika, **dokładnie nad pasem ruchu w odpowiednim kierunku**
- Sygnalizator dla pieszych na słupie chodnikowym, **skierowany ku drugiej stronie ulicy** (żeby pieszy widział idąc)
- Każdy crosswalk ma dwóch sygnalizatorów pieszych po obu stronach (po jednej stronie ulicy patrzą w stronę drugiej, na drugiej stronie patrzą w stronę pierwszej)

### 2. MECHANIKA CYKLU — zielone/czerwone musi być ZSYNCHRONIZOWANE

**Problem:** "jak pieszym zapala się zielone to dla pojazdów czerwone i na odwrót, jak pojazdom zapala się zielone to pieszym zapala się czerwone. Cała ta mechanika w ogóle nie działa."

**Do zrobienia:**
- Audyt funkcji `getTrafficLight()` — sprawdzić czy zwraca prawidłowe stany
- Sprawdzić czy stany są POPRAWNIE używane przy renderowaniu sygnalizatorów aut i pieszych
- Reguła: NIGDY oba zielone jednocześnie. Stany:
  - **STAN A**: Auta zielone, piesi czerwoni (np. 9s)
  - **STAN A→B**: Auta żółte, piesi czerwoni (np. 3s — przygotowanie)
  - **STAN B**: Auta czerwone, piesi zieloni (np. 7s)
  - **STAN B→A**: Auta żółte (lub czerwone+żółte), piesi czerwoni (np. 3s — przygotowanie)
- WIZUALNIE potwierdzić w grze że gdy patrzymy na skrzyżowanie:
  - Gdy auta widać czerwone → piesi muszą być zieloni
  - Gdy auta widać zielone → piesi muszą być czerwoni
  - Brak sytuacji "oba zielone" lub "auta czerwone + piesi czerwoni"
- Test: nagrać kilka sekund grze i prześledzić stany na osi czasu

### 3. AUTA — zatrzymywanie PRZED skrzyżowaniem (NIE w środku, NIE obracają się)

**Problem 1:** "Pojazd zatrzymuje się na środku skrzyżowania zamiast PRZED skrzyżowaniem"

**Do zrobienia:**
- Linia STOP MUSI być **PRZED** crosswalk z perspektywy auta (przed białymi pasami)
- Pozycje linii STOP per kierunek:
  - Auto jadące w PRAWO: zatrzymuje się tuż przed lewą krawędzią crosswalk N/S H (X = środek_skrzyżowania - 80px)
  - Auto jadące w LEWO: zatrzymuje się tuż za prawą krawędzią crosswalk (X = środek + 80px)
  - Analogicznie dla aut V
- Sprawdzanie odległości do skrzyżowania jest aktualnie błędne (zatrzymuje się ZA daleko lub w środku)
- Audyt funkcji sprawdzającej `shouldStop`/`carsMustStop` — gdzie dokładnie jest linia STOP

**Problem 2:** "Pojazd zatrzymuje się i 'obraca się' (reflektory w drugą stronę), a gdy zaczyna jechać znowu się obraca"

**Do zrobienia:**
- Auto NIGDY nie zmienia kierunku (`car.dx` nie zmienia znaku) tylko ze względu na zatrzymanie
- Aktualnie kod prawdopodobnie używa `Math.sign(car.dx)` do określenia "facing", ale gdy `car.dx` zbliża się do 0 znak może zmieniać się przez zaokrąglenie/błąd float
- Naprawa: rozdzielić `car.dx` (aktualna prędkość) i `car.facing` lub `car.baseDir` (stały kierunek). Auto zatrzymuje się ale `facing` zostaje
- Reflektory rysować ZAWSZE wg `facing`, NIE wg `dx`

**Problem 3:** "Większość pojazdów kompletnie ignoruje czerwone światło i po prostu lekko zwalniają i jadą dalej na czerwonym"

**Do zrobienia:**
- Audyt: dla KAŻDEGO auta (całe `cityCars`) sprawdzić czy `shouldStop` jest poprawnie obliczane
- Możliwe przyczyny:
  - Pętla po `intersWx` nie pokrywa wszystkich skrzyżowań
  - `dirSign` jest źle obliczany dla części aut
  - Auta z `wy` w zakresie pasów H1/H2/H3 — wszystkie powinny sprawdzać sygnalizatory
  - Auta na pasach V (jadące w pionie) też powinny sprawdzać sygnalizatory na skrzyżowaniach H
- Test: ustawić sygnał na czerwony i sprawdzić CZY KAŻDY samochód się zatrzymuje przed odpowiednim crosswalk
- Dodać debug w grze (chwilowo): pokazywać linię STOP wizualnie aby gracz/dev widział gdzie auta mają stanąć

### 4. AUDYT WIZUALNY (po naprawach)

- Przyciemnij wszystkie 9 skrzyżowań i wykonać screenshot każdego po naprawach
- Sprawdzić: brak overlap słup × jezdnia, brak nakładania na białe pasy crosswalk
- Sprawdzić: wszystkie auta zatrzymują się przed crosswalk
- Sprawdzić: facing aut nie zmienia się gdy stoją
- Sprawdzić: stany sygnalizatorów synchroniczne (nie ma sytuacji "oba zielone")

---

## SIŁOWNIA — krytyczny bug (pasek freezuje, nie da się ćwiczyć)

> Cytat użytkownika: "Siłownia kompletnie zepsuta. Wystąpił chyba jakiś krytyczny bug, bo nie da się ćwiczyć ani na ławce ani na wyciągu. Gracz spamuje i w około połowie pasek się zatrzymuje, animacja freezuje i nie można ćwiczyć."

**Priorytet: KRYTYCZNY** (regresja po wprowadzeniu osobnej animacji wyciągu w v0.9.84).

### Problem

- Po wprowadzeniu osobnej animacji wyciągu (`if(equip==='cable')` branch) coś się zepsuło w `startBenchPressMG`
- Bug dotyczy **OBU** sprzętów — ławki ORAZ wyciągu (czyli regresja jest poza branchem cable, dotyczy wspólnej logiki)
- Symptomy:
  - Pasek mocy rośnie do ~50% i się zatrzymuje
  - Animacja przestaje się aktualizować (freeze)
  - Gracz spamuje spację ale nic się nie dzieje

### Hipotezy do sprawdzenia

1. **Pętla animacyjna** (`requestAnimationFrame(draw)`) — może `gameActive` ustawia się na false bez powodu po pewnym czasie, lub `draw()` rzuca wyjątek przy `equip==='cable'` i pętla się zatrzymuje
2. **Renderowanie wyciągu** może rzucać exception (np. próbuje używać niezdefiniowanej zmiennej) → `requestAnimationFrame` cykl pęka po pierwszym błędzie
3. **Logika reps** — być może `reps>=repsNeeded` triggeruje cleanup za wcześnie, albo `lifting` flag utyka w nieprawidłowym stanie
4. **Power decay** — `power-=declineRate*dt` może mieć błędną wartość `dt` (zbyt duży dt → power spada szybciej niż gracz nadąża)
5. **Konflikt zmiennych** — w nowym branch `cable` mogłem nazwać zmienną która konfliktuje z bench branch (np. `lx`, `ly`, `bbH` — sprawdzić czy nie ma duplikatów `const`)
6. **Keydown handler** — czy `window._bpKeydown` nadal działa, czy może się zerwał

### Plan naprawy

1. Sprawdzić w przeglądarce `console.error` po starciu minigry siłowni
2. Audyt funkcji `startBenchPressMG` — szczególnie sekcja `draw()` i wszystkie deklaracje `const` w branch'ach `if(equip==='cable')` i `else`
3. Sprawdzić czy `requestAnimationFrame(draw)` jest wywoływane na końcu `draw()` w obu branchach
4. Sprawdzić czy nie zostały sieroce zmienne (np. `lx`, `ly`, `bbH` używane poza scope)
5. Test w grze: wejść do siłowni, wybrać ławkę 20kg, spamować spację 30 razy, sprawdzić czy reps przechodzi poza 50% paska
6. To samo dla wyciągu

### Test akceptacyjny

- Po naprawie: gracz może ukończyć pełną sesję na ŁAWCE (4-8 reps zależnie od wagi) bez freeze
- Po naprawie: gracz może ukończyć pełną sesję na WYCIĄGU (4-8 reps) bez freeze
- Animacja postaci animuje się przez całą minigre

---

## NPC PRZECHODZĄCY PRZEZ CROSSWALK GDY ZIELONE

> Cytat asystenta (zapowiedź z poprzedniej iteracji): "NPC jeszcze nie sprawdzają sygnalizatorów (tylko chodzą po chodnikach). To w następnej iteracji — zaproponuję jak chcesz testować i czy potrzebne NPC przechodzące crosswalk gdy zielone."
> Cytat użytkownika: "Nie zrobiłeś tego, dopisz to do planu działania"

### Problem

NPC w mieście chodzą tylko po chodnikach poziomych — nigdy nie przechodzą przez ulicę nawet gdy mają zielone. Sygnalizatory pieszych istnieją w grze ale nie wpływają na zachowanie NPC.

### Do zrobienia

1. **Decyzja per NPC: czy NPC będzie przechodził przez crosswalk?**
   - Każdy NPC powinien mieć szansę (np. 5-10% przy zbliżeniu się do skrzyżowania) że "chce przejść" na drugą stronę ulicy
   - Tylko NPC casual/business — biegacze, dzieci, starsi mogą zostać na własnym chodniku (uproszczenie)

2. **Logika podejścia do crosswalk:**
   - Gdy NPC ma decyzję "chce przejść" i zbliża się do skrzyżowania — kieruje się do najbliższego crosswalk (N/S/E/W)
   - Gdy dochodzi do crosswalk — sprawdza sygnalizator pieszych (`getTrafficLight().peds`)
   - Jeśli zielone (`peds==='green'`) → przechodzi przez ulicę (animacja przejścia po pasach)
   - Jeśli czerwone → czeka (animacja stania, możliwy idle "telefon"/"zimno")

3. **Bezpieczne przejście (synchronizacja z sygnalizatorem):**
   - Sygnalizator pieszych zielony trwa ok. 7s — NPC musi mieć czas przejść przez ulicę (192px szerokość jezdni)
   - NPC powinien zacząć przechodzić TYLKO jeśli zostało wystarczająco czasu (np. >3s zielonego) — żeby nie utknął na środku
   - W przypadku żółtego → przyspiesza żeby zdążyć

4. **Animacja przejścia:**
   - NPC porusza się po pasach crosswalk (białe pasy — wzdłuż linii)
   - Po dotarciu na drugą stronę kontynuuje normalny chód po przeciwległym chodniku
   - Wzbogacenie: kilku NPC może przechodzić jednocześnie (efekt prawdziwego skrzyżowania)

5. **Kolizje aut z pieszymi:**
   - Jeśli auto się ZATRZYMAŁO na czerwonym (po naprawie sekcji SYGNALIZATORY) — pieszy może bezpiecznie przejść przed nim
   - Jeśli auto JECHAŁOBY przez crosswalk podczas zielonego pieszego — to byłoby logiczne złamanie reguł (więc nigdy nie powinno się zdarzyć po prawidłowej naprawie sekcji SYGNALIZATORY)

### Test akceptacyjny

- Po implementacji: stanąć przy dowolnym skrzyżowaniu i obserwować — co najmniej 1-2 NPC powinno przechodzić przez crosswalk podczas zielonego pieszego (cykl ~22s więc czekać ~20-40s)
- Sprawdzić: NPC NIGDY nie wchodzi na jezdnię gdy ma czerwone
- Sprawdzić: NPC nie utyka na środku skrzyżowania (zaczyna przechodzić tylko gdy starczy czasu)
- Sprawdzić: różnorodność — z przechodzących są zarówno casual, business jak i czasem inny typ

### Zależności

- **WYMAGA**: najpierw naprawić sekcję "SYGNALIZATORY ŚWIETLNE" (sygnalizatory muszą prawidłowo świecić i być zsynchronizowane piesi/auta)
- **WYMAGA**: najpierw naprawić auta zatrzymujące się na czerwonym (żeby pieszy mógł bezpiecznie przejść)

---

## RANDOM EVENTS — pełen audyt logiki, lokacji, pory dnia

> Cytat użytkownika: "Sprawdź WSZYSTKIE random event i zrób żeby miały sens i logikę, np. wywiad w telewizji dopiero gdy gracz jest bardziej popularny, uliczny grajek jak gracz chodzi po mieście, a nie jest w budynku itp. To tylko przykłady. Przeanalizuj wszystko i zrób żeby to było sensowne, logiczne i immersyjne."

### Cel

Każde random event musi mieć logiczny **kontekst wystąpienia** — pasujący do:
- **Lokacji** (ulica / mieszkanie / studio / siłownia / sklep)
- **Pory dnia** (rano / dzień / wieczór / noc)
- **Stanu gracza** (sława, fani, posiadane przedmioty, kariera)
- **Pogody** (jeśli relevantne)

Eventy mają być **immersyjne** — gracz powinien czuć że to ma sens "naprawdę".

### Pełna lista eventów do audytu (RANDOM_EVENTS + CHOICE_EVENTS)

**RANDOM_EVENTS** (~22 eventów):

1. **Viral moment!** (chance 0.015, follow>100) — brak lokacji. Powinno wymagać telefonu otwartego LUB być w mieszkaniu/studio (gdzie korzystasz z social media). Niemożliwe na siłowni/sklepie.
2. **Sponsorship offer** (chance 0.02, follow>=1000) — brak lokacji. Powinno przychodzić jako notification z telefonu (mail) — wymaga że gracz jest w domu lub przy telefonie.
3. **Equipment broken** (chance 0.01, masz sprzęt) — gdzie się zepsuje? Logiczne tylko podczas używania (studio, gdy nagrywasz, lub w mieszkaniu przy YT). NIE na ulicy.
4. **Lucky day** (chance 0.025, ulica) — ✓ OK, znajdujesz pieniądze NA ULICY. Może dodać warunek `timeOfDay<=2` (nie nocą, podejrzane).
5. **Hater attack** (chance 0.02, follow>500) — brak lokacji. Powinno być przy telefonie/internecie (mieszkanie/studio). Notyfikacja po sprawdzeniu Twittera.
6. **Music festival** (chance 0.008, ma karierę muz.) — zaproszenie powinno przyjść mailem/sms — wymaga być w domu albo otwartego telefonu. NIE w środku jakiegoś sklepu.
7. **Fan buys merch** (chance 0.03, ma merch) — pasywne (sprzedaż automatyczna) — może wystąpić zawsze, ale lepiej z przekazem "ktoś kupił merch" (notyfikacja).
8. **Radio royalty bonus** (chance 0.02, ma beat na radiu) — pasywne (tantiemy) — OK zawsze.
9. **Manager bonus** (chance 0.015, ma menadżera) — menadżer dzwoni → wymaga telefonu/domu. Logiczne że menadżer nie wpada na ulicy z kasą.
10. **Police fine** (chance 0.008, streetRep>50) — wymaga ulicy! Mandat dostajesz na ulicy nie w mieszkaniu.
11. **Collab invite** (chance 0.012, yt.subs>=500) — przyszło z telefonu/internetu. Wymaga domu/telefonu.
12. **Viral beat** (chance 0.01, beatsSold>0) — pasywne, OK zawsze.
13. **Fan donation** (chance 0.012, hardcore>10) — donacja przez internet, wymaga domu/telefonu.
14. **Studio accident** (chance 0.005, ulica===studio) — ✓ OK, wypadek w studio.
15. **Newspaper feature** (chance 0.006, fame>=40) — gazeta wychodzi rano. Może wymagać `timeOfDay===0` (rano) — przeczytałeś o sobie. Lepiej notyfikacja.
16. **TV interview** (chance 0.003, fame>=50) — nie powinno przychodzić w random momencie. Bardziej: "telewizja chce z tobą wywiad — zaplanowane na X". Jeśli jako event prosty → wymaga być na ulicy w okolicy mediów lub w domu (gdzie odbierze telefon). Próg sławy może być wyższy (np. 60).
17. **Subscriber wave** (chance 0.008, yt.videos>=5) — pasywne (rosnący kanał). OK zawsze.
18. **Social media trend** (chance 0.01, posts>=5) — algorytm IG, pasywne. OK zawsze.
19. **Unexpected bill** (chance 0.007, money>500) — rachunek dostajesz mailem/listem — w mieszkaniu. Logiczne że nie na siłowni.
20. **Uliczny grajek** (chance 0.018, ulica + dzień) — ✓ OK.
21. **Pomocna ręka** (chance 0.012, ulica + rep<80) — ✓ OK, pomagasz starszej pani na ulicy.
22. **Drobny kradzież** (chance 0.008, ulica + noc/wieczór + kasa>200) — ✓ OK.
23. **Pochwała od fana** (chance 0.014, ulica + fan + fame) — ✓ OK.
24. **Bonus pogodowy** (chance 0.01, ulica + słońce + rano) — ✓ OK.

**CHOICE_EVENTS** (~5):

25. **Idol w okolicy** (fame>=20) — wymaga ulicy (na ulicy spotykasz idola, NIE w mieszkaniu).
26. **Anonimowy darczyńca** (streetRep>=20) — pieniądze podrzucone — w mieszkaniu (znaleziono pod drzwiami) lub na ulicy. Ale logiczniej: dom (koperta pod drzwiami).
27. **Awaria sprzętu** (masz sprzęt) — w studio/mieszkaniu (gdzie używasz sprzętu). NIE na siłowni/sklepie.
28. **Hejt na Twitter** (follow>=2000) — przy telefonie. Wymaga być w domu (otwierasz telefon i widzisz hejt) — albo notyfikacja w grze gdy gracz przegląda telefon.
29. **Niespodziewany gig** (fame>=15, energia>=20) — telefon dzwoni, gig za godzinę. Wymaga być przy telefonie/w domu/na ulicy (nie podczas pracy/minigry).

### Do zrobienia

1. **Audyt każdego eventu**:
   - Dodać warunek lokacji (`currentRoom`) tam gdzie ma sens (mieszkanie/studio/ulica)
   - Dodać warunek pory dnia tam gdzie immersyjne (rano/dzień/wieczór/noc)
   - Dodać warunki kontekstowe (np. eventy "z telefonu" wymagają że gracz NIE jest w trakcie minigry/dialogu/mapy)
   - Sprawdzić progi sławy/fanów żeby były odpowiednie do skali (np. wywiad TV od 60 sławy a nie 50)

2. **Zmiana frazowania komunikatów** — jeśli event przychodzi z telefonu, opis powinien sugerować "twój telefon dzwoni / dostałeś maila / notyfikacja". Jeśli z ulicy — "spotykasz X". Immersja przez tekst.

3. **Cooldowny per event** — niektóre eventy zdarzają się zbyt często/zbyt blisko siebie. Dodać `_lastEventDay` lub `_lastEventMin` dla najpopularniejszych (np. Lucky day max 2x/dzień).

4. **Nowe propozycje eventów immersyjnych** (jeśli brakuje):
   - "Sąsiad puka" — w mieszkaniu, prosi o coś
   - "Spotkałeś znajomego" — na ulicy, zwiększa nastrój
   - "Korek" — na ulicy z autem, opóźnia podróż
   - "Inspiracja" — w studio, +bonus do następnej sesji

### Test akceptacyjny

- Przejść przez kilka pełnych dni gry w różnych lokacjach (ulica, mieszkanie, studio, siłownia)
- Sprawdzić w konsoli (lub log) jakie eventy się odpalają w danej lokacji
- Każdy event który wystąpił MUSI mieć sens dla lokacji+pory+stanu gracza
- Eventy "z telefonu" NIE odpalają się gdy gracz jest na siłowni/w sklepie

---

## SIŁOWNIA — dalsze poprawki (maty, prędkości bieżni, animacja, sprint)

> Cytat użytkownika: "Siłownia dalej wymaga pracy. Na matach są 3 obciążniki, najlżejszy jest największy, a najcięższy jest najmniejszy, to nie ma sensu. Bieżnia wygląda dużo lepiej, ale dalej brakuje logiki. Bieg to raczej więcej niż 4.5km/h, trucht to raczej więcej niż 3km/h. Animacja wymaga poprawy, dziwnie wyglądają te ręce 'rozpikselowują się'. Na sprint na animacji postać biegnie tak szybko, ze to jest przesada. Popracuj nad tym."

### 1. MATY DO ROZCIĄGANIA — kolejność obciążników odwrotna

**Problem:** Na matach do rozciągania są 3 obciążniki — **najlżejszy jest NAJWIĘKSZY, a najcięższy NAJMNIEJSZY**. Logika jest odwrotna — w prawdziwej siłowni cięższy obciążnik jest większy.

**Do zrobienia:**
- Sprawdzić w drawSilowniaDecorations / drawGymEq jak rysowane są obciążniki na matach
- Naprawić rozmiary tak żeby **rosły z wagą** (najmniejszy = najlżejszy, największy = najcięższy)
- Sprawdzić wszystkie 3 maty (jeśli każda ma swój zestaw)
- Ewentualnie dorysować etykiety wagi (np. "5kg", "10kg", "20kg")

### 2. BIEŻNIA — realistyczne prędkości km/h

**Problem:** "Bieg to raczej więcej niż 4.5 km/h, trucht to raczej więcej niż 3 km/h"

**Realistyczne wartości referencyjne:**
- **Spacer**: 4-5 km/h (chód normalny)
- **Trucht (jogging)**: 7-9 km/h
- **Bieg**: 10-12 km/h
- **Sprint**: 15-20+ km/h (krótkie odcinki)

**Do zrobienia:**
- Audyt jak w `startTreadmillMG` przeliczane jest km/h. Aktualnie wzór `actualSpeed.toFixed(1)` km/h dla SPD na LCD — `actualSpeed` jest "speed" parametr (1=Spacer, 2=Trucht, 3=Bieg, 4=Sprint) modyfikowany przez PPS
- Zmienić mapowanie:
  - `speed=1` (Spacer) → 4-5 km/h
  - `speed=2` (Trucht) → 7-9 km/h
  - `speed=3` (Bieg) → 10-12 km/h
  - `speed=4` (Sprint) → 15-20 km/h
- LCD pokazuje aktualną prędkość (`actualSpeed * baseKmh` z linijną zamianą)
- Tytuł na ekranie wyboru tempa też pokazuje docelowe km/h przy każdym wyborze

### 3. ANIMACJA RĄK — "rozpikselowują się"

**Problem:** Ręce na animacji wyglądają dziwnie, "rozpikselowują się" (subpiksel rendering / float positions).

**Do zrobienia:**
- Sprawdzić wszystkie pozycje rąk w `drawTreadmill` minigra
- Aktualnie używamy `Math.sin(armPhase)*22*Math.min(1,actualSpeed/2)` — wynikowa wartość to float
- Wszystkie pozycje rąk (start, łokieć, dłoń) **zaokrąglić Math.round()** przy `cx.fillRect`/`cx.beginPath().arc()`
- Zwiększyć grubość linii rąk (`lineWidth`) o 1-2 dla wyrazistości
- Sprawdzić czy `cx.lineCap='round'` nie powoduje "kuli" na końcach którą gracz interpretuje jako "rozpikselizację"
- Możliwa alternatywa: rysować ręce jako prostokąty (filled rects) zamiast linii — pixel-perfect

### 4. SPRINT — animacja zbyt szybka

**Problem:** "Na sprint na animacji postać biegnie tak szybko, że to jest przesada"

**Do zrobienia:**
- Sprawdzić jak `actualSpeed` mapuje na `legPhase` i wymachy rąk
- Aktualnie `legPhase += 0.05 + actualSpeed * 0.12` — przy actualSpeed=4 (sprint) daje +0.53/klatka = bardzo szybkie wymachy
- Cap na `actualSpeed` w animacji: np. `Math.min(actualSpeed, 2.5)` żeby animacja nie przekraczała rozsądnego tempa
- Niezależnie: `bgX -= actualSpeed * 8` (pas biegowy) też może być za szybki — dodać cap
- Cel: nawet przy sprincie postać biegnie SZYBKO ale realistycznie, nie absurdalnie

### Test akceptacyjny

- **Maty**: wejść do siłowni, sprawdzić maty — najmniejszy obciążnik = najlżejszy, największy = najcięższy
- **Bieżnia LCD**: wybrać każde tempo (Spacer/Trucht/Bieg/Sprint), spamować spację, sprawdzić czy SPD na LCD pokazuje realistyczne km/h
- **Bieżnia animacja**: spamować spację 30s, ręce wyglądają płynnie (bez "pikselizacji")
- **Bieżnia sprint**: wybrać Sprint, spamować maksymalnie szybko — animacja powinna być szybka ale nie przesadzona (zbliżona do realnego sprintu)

---

## WYCIĄG — liczba płyt obciążenia nie skaluje się powyżej 80kg

> Cytat użytkownika: "Brakuje sensu wizualnego też na wyciągu. 20 kg ma 2 złote płyty obciążenia, 40 kg ma 4 złote płyty obciążenia itd. ale 100kg ma 8 płyt (tak samo jak 80kg) i 120kg też ma 8 złotych płyt obciążenia."

### Problem

W animacji wyciągu (lat pulldown) liczba złotych płyt obciążenia poprawnie skaluje się dla niższych wag, ale **zatrzymuje się na 8 płytach** dla 80kg i powyżej.

| Waga | Płyty rysowane | Powinno być |
|------|----------------|-------------|
| 20kg | 2 ✓ | 2 |
| 40kg | 4 ✓ | 4 |
| 60kg | 6 ✓ | 6 |
| 80kg | 8 ✓ | 8 |
| 100kg | **8 ❌** | 10 |
| 120kg | **8 ❌** | 12 |

### Przyczyna

W kodzie rysującym wyciąg jest pętla `for(let i=0;i<8;i++)` — hardkodowana na 8 płyt maksymalnie. Bez względu na to ile `liftedPlates` ma być, rysuje tylko 8.

### Do zrobienia

1. Sprawdzić w `startBenchPressMG` (branch `equip==='cable'`) sekcję rysującą stos obciążeń
2. Zamienić `for(let i=0;i<8;i++)` na `for(let i=0;i<liftedPlates;i++)` lub dynamiczne (z fallbackiem na rozmiar ramy)
3. Sprawdzić czy stos obciążeń (rama 30x140px) **mieści 12 płyt o wysokości 14px każda** — może trzeba zmniejszyć grubość płyt (np. z 12px na 10px) lub powiększyć ramę
4. Każda płyta = 10kg, więc 120kg = 12 płyt
5. Płyty od dołu w górę (jak w prawdziwej maszynie — sworzeń przekłada się przez wybraną liczbę płyt)
6. Rozróżnienie wizualne:
   - Płyty PODNIESIONE (wybrane przez sworzeń) = złote (#c8a520)
   - Płyty NIE PODNIESIONE (zostają na dole) = szare (#5a5a55)

### Test akceptacyjny

- Wybrać 100kg → zobaczyć 10 złotych płyt na stosie
- Wybrać 120kg → zobaczyć 12 złotych płyt
- Każdy z 6 wariantów wagowych (20/40/60/80/100/120kg) pokazuje proporcjonalną liczbę złotych płyt
- Podczas sesji (gdy power rośnie) złote płyty unoszą się — liczba złotych pozostaje proporcjonalna

---

## PRĘDKOŚĆ POSTACI — bug z zależnością od zdrowia

> Cytat użytkownika: "Postać chodzi wolniej im mniej ma zdrowia, to chyba jakiś bug bo nie powinno tak być."

### Problem

Postać porusza się wolniej gdy ma niski poziom zdrowia (`G.health`). To nie powinno działać tak — zdrowie nie powinno wpływać na prędkość chodzenia.

### Analiza obecnego kodu

W `index.html` formuła prędkości (`P.spd`):
```js
P.spd = 1.7 + (G.fitness||0)/100*0.5 + _kondBonus
```

Zależy TYLKO od:
- bazy 1.7
- fitness (max +0.5)
- kondycji skill (max +0.30)

**NIE zawiera `G.health`**. Więc bug jest gdzie indziej.

### Hipotezy

1. **Modyfikator gdzieś indziej w pętli ruchu** — szukać `dx*=` lub `P.spd*=` po obliczeniu bazowym
2. **Animacja krokowa** — niskie health może spowalniać `anim++` lub timing klatki ruchu
3. **CFG.healthDecayAmt** — może health przy <X% triggeruje jakiś debuff (np. "wycieńczony" → -50% prędkości)
4. **Konsekwencja energii** — gdy zdrowie niskie, energia spada szybciej, a być może jest pętla "energia==0 → pauza"
5. **Interakcja z animacją chodzenia** — postać może mieć osobną prędkość animacji vs prędkość ruchu, niskie health zaburza wizualnie wrażenie szybkości

### Do zrobienia

1. **Audyt całego kodu**: szukać `G.health` w kontekście ruchu (`grep "G\\.health.*spd\\|G\\.health.*dx\\|G\\.health.*move"`)
2. **Audyt CFG i debuff**: czy jest hidden mechanic typu "wycieńczony" przy niskim zdrowiu
3. **Test w grze**:
   - Pełne zdrowie (100): zmierzyć ile sekund zajmuje przejść z punktu A do B
   - Zdrowie 50: ten sam pomiar
   - Zdrowie 20: ten sam pomiar
   - Zdrowie 10: ten sam pomiar
   - Zweryfikować czy faktycznie pojawia się różnica
4. **Jeśli istnieje intencjonalny system wpływu zdrowia na prędkość** — usunąć go (zdrowie nie powinno spowalniać chodu, tylko wymagać leczenia)
5. **Jeśli to wizualny bug (animacja)** — naprawić timing klatki niezależnie od zdrowia

### Test akceptacyjny

- Postać porusza się z **identyczną prędkością** przy zdrowiu 100, 50, 20, 10
- Tylko fitness/kondycja wpływają na prędkość chodzenia (zgodnie z dokumentacją)

---

## "VIRAL MOMENT!" — odpala się bez wcześniejszego wrzucenia posta

> Cytat użytkownika: "Dostałem właśnie pieniądze za to że mój post stał się viralowy a nawet nie wrzuciłem jeszcze żadnego postu, to bez sensu."

### Problem

Random event **"Viral moment!"** odpala się gdy gracz ma >100 obserwujących, ale **NIE wymaga aby gracz miał wcześniej wrzucony jakikolwiek post**. Komunikat "🔥 Twój post stał się viralowy! +X obserwujących!" pojawia się też wtedy, gdy gracz nigdy nie używał Instagramu/Twittera/YouTube.

### Aktualny kod

```js
{name:'Viral moment!', chance:0.015, cond:()=>G.followers>100, fn:()=>{
  const gain=Math.floor(G.followers*rnd(10,30)/100);G.followers+=gain;G.yt.subs+=Math.floor(gain*.5);
  notify(`🔥 Twój post stał się viralowy! +${gain} obserwujących!`);
}}
```

Warunek `G.followers>100` jest niewystarczający — fani mogą wzrosnąć bez wrzucenia posta (np. z koncertu, freestyle, organic growth).

### Do zrobienia

1. **Dodać warunek** że gracz musiał coś wrzucić, aby event mógł się odpalić:
   - `G.careers.influencer.posts > 0` (wrzucił jakiś post na IG)
   - LUB `G.yt.videos.length > 0` (wrzucił film na YouTube)
   - LUB `G.spotify.releases > 0` lub podobne (wydał coś)
   - Skoro to "viral POST" — najlepiej wymóg na influencer.posts albo yt.videos
2. **Zmiana frazowania** — zamiast "Twój post stał się viralowy" lepiej: "Twój ostatni post na [IG/YT] stał się viralowy" — żeby było jasne o co chodzi
3. **Dodać event w trakcie audytu RANDOM EVENTS** (sekcja powyżej w planie) jako konkretny przykład bug-a logiki

### Powiązane

To podpada pod ogólny audyt random eventów (sekcja "RANDOM EVENTS — pełen audyt logiki, lokacji, pory dnia"). Konkretnie ten event łączy się z punktem **#1 Viral moment!** w liście tam — uzupełnić warunek o wymóg posta/filmu.

### Test akceptacyjny

- Nowa gra, gracz NIE wrzuca żadnego posta/filmu, ale zdobywa fanów (np. koncertami)
- Po kilku dniach gry: event "Viral moment!" NIE odpala się (bo nie ma posta który mógłby być viralowy)
- Po wrzuceniu pierwszego posta: event może się odpalić (po spełnieniu chance)

---

## POGODA — naprawa emoji HUD, mgła, prędkość gracza

> Cytat użytkownika: "Pogoda jest zepsuta. Tylko słonecznie i śnieg ma emoji na HUD, pozostałe pogody nie mają. Zrób żeby mgła wyglądała inaczej i lepiej. Denerwujące dla gracza może być to, że ma cały ekran szary. Wydaje mi się że pogoda wpływa na prędkość poruszania się gracza. Jeżeli tak to usuń to, niech pogoda nie wpływa na prędkość gracza."

### 1. EMOJI POGODY NA HUD — niektóre się nie wyświetlają

**Problem:** Tylko `☀️ Słonecznie` i `❄️ Śnieg` pokazują się na HUD. Pozostałe (`🌤 Pochmurno`, `🌧 Deszcz`, `🌫 Mgła`, `⛈ Burza`) nie wyświetlają się jako emoji.

**Przyczyna:** Niektóre znaki Unicode nie mają **Variation Selector-16 (`️`)** — bez niego są renderowane jako tekst (kropki, kreski) zamiast jako pełnoprawne emoji.
- `☀️` (U+2600 + U+FE0F) ✓ ma VS
- `🌤` (U+1F324) ❌ brak VS
- `🌧` (U+1F327) ❌ brak VS
- `❄️` (U+2744 + U+FE0F) ✓ ma VS
- `🌫` (U+1F32B) ❌ brak VS
- `⛈` (U+26C8) ❌ brak VS

**Do zrobienia:**
- W tablicy `_wIcons` w `updateHUD()` dodać `️` (variation selector) do wszystkich emoji bez niego: `🌤️ 🌧️ 🌫️ ⛈️`
- Alternatywnie zmienić na pewniejsze emoji: `☁️` (chmura, U+2601 + VS) zamiast `🌤️`, `⚡` (piorun, U+26A1) zamiast `⛈`
- Sprawdzić też `CFG.WEATHERS` (linia ~435) — tam są te same emoji, też naprawić
- Test: na różnych systemach (Windows/Mac/Linux) sprawdzić czy każde z 6 emoji wyświetla się prawidłowo

### 2. MGŁA — cały ekran szary, denerwujące

**Problem:** Pogoda mgła robi cały ekran szarym, co jest denerwujące dla gracza i blokuje widoczność.

**Do zrobienia:**
- Sprawdzić w `drawLightingOverlay` jak rysowana jest mgła (`w===4`)
- Aktualnie mgła nakłada szary tint na całą scenę z alpha ~0.22
- Lepsze podejście:
  - **Mgła z gradientem** (silniejsza w oddali, słabsza blisko gracza) — efekt głębi zamiast jednolitego tła
  - **Mgła jako oddzielne particles** (kłębki mgły unoszące się po ekranie) — atmosferyczne, nie blokujące
  - **Lokalne plamy mgły** (np. tylko nad jezdnią lub w parku) zamiast całego ekranu
  - **Zmniejszyć alpha** z .22 na np. .12 — żeby gracz widział co się dzieje
  - **Subtelny ruch** (delikatna animacja mgły przepływającej)
- Cel: gracz nadal widzi miasto i może w nim grać, ale czuje atmosferę mgły

### 3. POGODA NIE POWINNA WPŁYWAĆ NA PRĘDKOŚĆ GRACZA

**Cytat #1:** "Wydaje mi się że pogoda wpływa na prędkość poruszania się gracza. Jeżeli tak to usuń to, niech pogoda nie wpływa na prędkość gracza."

**Cytat #2 (uzupełnienie):** "Wydaje mi się, że szczególnie jak pada śnieg to gracz porusza się wolniej, ale sprawdź czy na pewno tak jest i sprawdź to dla każdej pogody. Jeżeli pogoda zmienia prędkość gracza to zrób żeby tak nie było."

**Analiza obecnego kodu:**
- W `P.spd = 1.7 + (G.fitness||0)/100*0.5 + _kondBonus` — **NIE ma `G.weather`**
- Pogoda używana jest tylko w:
  - `weatherMult` dla freestyle (linia 13718) — wpływa na nagrody, nie prędkość
  - `earnMult` dla koncertów (linie 7085-7086) — wpływa na zarobki, nie prędkość
  - Kurier bonus (linia 12393) — bonus za deszcz/burzę, nie prędkość
- Wpływ pogody na **prędkość** nie jest wprost w kodzie

**Hipotezy dlaczego gracz tak czuje (szczególnie przy śniegu):**
1. **Wizualny efekt** — gdy mgła/deszcz/śnieg, gracz widzi wolniej (rozmazany ekran, śnieżynki na pierwszym planie), co subiektywnie wydaje się że postać idzie wolniej
2. **Ukryty modifier w pętli ruchu** — może być w innej funkcji, np. animacja kroków czy timing klatki
3. **Wpływ pogody na fitness/kondycję** — pośredni efekt
4. **Snow particle obstruction** — śnieżynki padające na ekran mogą tworzyć iluzję spowolnienia (ruch postaci kontrastuje z ruchem śniegu)
5. **Snow accumulation** — gdy pada śnieg (`G.weather===3`) jest "snow accumulation na głowie/ramionach gracza" (linia 5225) — może być tam dodatkowy efekt który blokuje ruch
6. **frame skip / dropped frames** — jeśli śnieg ma dużo particles, FPS może spadać i gracz odczuwa "wolny ruch"
7. **Kierunek wiatru / sway** — śnieg ma `sway=Math.sin(weatherTick*0.018+i*0.5)*18` (linia 5021) — może gracz subiektywnie czuje że "wiatr go pcha"

**Do zrobienia:**
1. **Audyt całego kodu** (`grep -n "G.weather" index.html`) — sprawdzić wszystkie miejsca gdzie pogoda jest używana, ze szczególnym naciskiem na `weather===3` (śnieg)
2. **Audyt funkcji ruchu gracza** — sprawdzić czy w okolicach `5345-5355` (movePlayer) lub `dx/dy` modyfikacji jest cokolwiek związanego z pogodą
3. **Audyt animacji gracza** — czy `anim++` lub timing krokowy zależy od pogody
4. **Audyt fizyki/snow accumulation** — linie 5225-5237 mają snow effects, sprawdzić czy nie modyfikują ruchu
5. **Test pomiarowy w grze**:
   - Ustawić Admin Panel: `G.weather=0` (słonecznie)
   - Wcisnąć W przez **dokładnie 5 sekund** (timer)
   - Zmierzyć dystans przebyty (P.wy zmiana)
   - Powtórzyć dla weather 1-5 (pochmurno, deszcz, śnieg, mgła, burza)
   - Wyniki: tabela `weather → distance`
6. **Wyniki testu**: wszystkie 6 pogód MUSZĄ dać identyczny dystans (±2px tolerancja)
7. **Jeśli różnice istnieją (szczególnie dla śniegu)**:
   - Znaleźć przyczynę (audyt kodu)
   - Usunąć modifier
   - Powtórzyć test
8. **Skupienie na śniegu**: nawet jeśli inne pogody są OK, sprawdzić ŚNIEG ze stoperem
   - Snow accumulation jest OK (wizualnie)
   - Ale jeśli gdzieś jest `if(G.weather===3)P.spd*=0.95` → usunąć

### Test akceptacyjny

- **Emoji**: na HUD wszystkie 6 pogód (☀️ ☁️ 🌧️ ❄️ 🌫️ ⛈️) wyświetlają się jako pełne kolorowe emoji
- **Mgła**: gracz widzi miasto przy mgłe (nie ma "szarego ekranu blokującego widoczność")
- **Prędkość**: identyczny czas przejścia A→B w każdej pogodzie (różnica <2%)

---

## HUD — zamiana kolejności kondycji i dripu (forma + kondycja obok siebie)

> Cytat użytkownika: "Zamień kolejność na HUD tak żeby forma i kondycja były obok siebie (zamień kondycje i drip miejscami)."

### Problem

Aktualna kolejność statystyk fizycznych na HUD:
- 💪 **Forma** (fitness)
- 💎 **Drip**
- 🏃 **Kondycja**

Forma i Kondycja są oddzielone przez Drip, mimo że to dwie powiązane statystyki sportowe — powinny być obok siebie.

### Do zrobienia

1. W HTML HUD (linia ~218-220) zamienić kolejność elementów:
   - **Aktualnie**: forma → drip → kondycja
   - **Po naprawie**: forma → kondycja → drip
2. Konkretne linie do zamiany w `index.html`:
   - Linia 218: `<div class="hs" data-tip="fitness">...💪 Forma</div>` (zostaje)
   - Linia 219: `<div class="hs" data-tip="drip">...💎</div>` (przesunąć po kondycji)
   - Linia 220: `<div class="hs" data-tip="kondycja">...🏃</div>` (przesunąć przed drip)
3. Sprawdzić czy nie ma innego miejsca gdzie kolejność jest hardkodowana (np. updateHUD, panele statystyk)

### Test akceptacyjny

- HUD pokazuje statystyki fizyczne w kolejności: 💪 Forma → 🏃 Kondycja → 💎 Drip
- Wszystkie wartości aktualizują się poprawnie po zmianie kolejności
- Pozostałe elementy HUD nie zostały dotknięte

---

## STROJE TRENINGOWE — sportowy (tańszy) i pro (droższy)

> Cytat użytkownika #1: "Zmień działanie stroju sportowego. Zrób żeby dawał bonus 20% do przyrostów na siłowni i gdy gracz idzie na siłownie z założonym strojem sportowym to może zrobić dodatkową serie na ławce/wyciągu i dodatkową serie na bieżni."
> Cytat użytkownika #2 (uzupełnienie): "To zrób w takim razie strój sportowy który daje 20% i zrób strój treningowy pro który daje 25% i możliwość dodatkowej serii na ławce/wyciągu i dodatkowej serii na bieżni. Wiadomo, że pro ma być droższy od stroju sportowego."

### Dwa stroje treningowe — różne tier-y

**Strój sportowy (tańszy ~120-150 zł — jak teraz):**
- +20% przyrost forma/kondycja
- Brak dodatkowych serii (limit 2/2 jak normalnie)
- Tańsza opcja "wejściowa" do treningu

**Strój treningowy PRO (droższy ~600-800 zł):**
- +25% przyrost forma/kondycja
- +1 dodatkowa seria na ławce/wyciągu (3/3)
- +1 dodatkowa seria na bieżni (3/3)
- Premium opcja dla gracza inwestującego w karierę sportową

### Aktualnie (do zmiany)

- Strój sportowy: +30% przyrost, -30% energii (do zmniejszenia bonusu i usunięcia dodatkowych serii — bo tych jeszcze nie ma)
- Brak stroju treningowego PRO (do dodania)

### Do zrobienia

1. **Zmiana stroju sportowego** w `startBenchPressMG` (linie ~14069-14083):
   - `formaGainBP = Math.round(formaGainBP*1.3)` → `Math.round(formaGainBP*1.2)`
   - Komunikat: `'+30%'` → `'+20%'`
2. **Zmiana stroju sportowego** w `startTreadmillMG` (linie ~14451-14459):
   - `fitGain = Math.round(fitGain*1.3)` → `Math.round(fitGain*1.2)`
   - Komunikat: `'+30%'` → `'+20%'`
3. **Dodanie stroju treningowego PRO** do `allOutfits` (~10590) i `outfits` w sklepie (~10626):
   - id: `'sport_pro'`
   - name: `'Strój treningowy PRO'`
   - emoji: `'🥋'`
   - desc: `'Profesjonalny strój. +25% przyrosty + dodatkowa seria na siłowni i bieżni.'`
   - price: 600-800 zł
   - bonus: `'+25% gain, +1 sesja siły, +1 sesja cardio'`
4. **Logika bonusu PRO** w startBenchPressMG i startTreadmillMG:
   - Helper `const isPro = G.outfit?.top==='sport_pro'`
   - Helper `const isSport = G.outfit?.top==='sport'`
   - `const gainMult = isPro ? 1.25 : isSport ? 1.20 : 1.0`
   - Komunikat: `+25%` lub `+20%` zależnie
5. **Zwiększenie limitu siłowych** (linia 13976):
   - `const maxSets = (G.outfit?.top==='sport_pro') ? 3 : 2`
   - To samo przy sprawdzeniu w linii 14007
   - UI: pokazać "Sesje siły dzisiaj: X/2" lub "X/3 (strój PRO +1)"
6. **Zwiększenie limitu cardio** (linia 14362):
   - `const cardioMax = (G.outfit?.top==='sport_pro') ? 3 : 2`
   - To samo przy sprawdzeniu w linii 14390
   - UI: pokazać "Sesje cardio dzisiaj: X/2" lub "X/3 (strój PRO +1)"
7. **Zaktualizować opis stroju sportowego** (linie 10594, 10630):
   - Stary: `'+30% przyrost forma/kondycja, -30% energii w siłowni'`
   - Nowy: `'+20% przyrost forma/kondycja na siłowni'`
8. **Wizualnie**: strój PRO ma wyglądać LEPIEJ niż sportowy (np. inny kolor, akcenty, lepszy materiał — patrz sekcja "SYSTEM UBRAŃ")

### Test akceptacyjny

| Strój | Bonus | Limit siłowych | Limit cardio |
|-------|-------|----------------|---------------|
| **Brak** | +0% | 2 | 2 |
| **Sportowy (~150 zł)** | **+20%** | 2 | 2 |
| **Treningowy PRO (~700 zł)** | **+25%** | **3** | **3** |

- UI w siłowni pokazuje aktualny limit (2 lub 3) zależnie od stroju PRO
- Komunikat po sesji wskazuje aktualny bonus (+0%, +20% lub +25%)
- Sklep z ubraniami ma oba stroje, PRO wyraźnie droższy

---

## LATARNIE — usunąć duplikację (nowe lampy główne, stare zaledwie kilka w innych miejscach)

> Cytat użytkownika #1: "Lampy dalej wyglądają źle. Wyglądają w ogóle jakby były zdublowane. Jest jedna lampa która ma dłuższy słup i na niej jest jeszcze inna lampa która świeci mocniej. Te niższe lampy wystają na ulicę."
> Cytat użytkownika #2 (uzupełnienie): "Te nowe lampy (niższe) są ładniejsze jak coś. Możesz głównie je umiejscowić na mapie, a tych starych zaledwie kilka (w innych miejscach niż nowe)."

### ROOT CAUSE — DWA systemy lamp rysowane w tych samych pozycjach!

**System #1: `drawLamps()` (linia 4401) → `drawLamp()` (linia 4379)**
- Stary system, **wyższy słup (85px)**, klosz na sy-83
- **Mocna poświata** (radial gradient 130px na ziemi + 22px na kloszu)
- Pozycje: lampRows = `[378, 670, 1918, 2204, 2878, 3164]` co 400px

**System #2: `streetLamps` w `drawStreetDetails()` (linia ~19933)**
- Nowy system (z mojej pracy nad sesją 1 — atmosfera miejska)
- **Niższy słup (60px)**, klosz na sy-50
- Inny styl (z wieżyczką, lepszy klosz, halo)
- **Te same pozycje** lampRows = `[378, 670, 1918, 2204, 2878, 3164]` co 400px

**Wynik:** Każda lampa to **2 lampy nałożone na siebie!** — wyższa (z mocnym światłem) + niższa (która "wystaje na ulicę" bo jest bliżej jezdni).

### DECYZJA — System #2 (nowe, ładniejsze) GŁÓWNY, System #1 zaledwie kilka jako akcent

Użytkownik wyraźnie woli nowe (niższe) lampy. Plan:
- **System #2 (nowe, niższe)**: na WSZYSTKICH chodnikach miasta (jak teraz w `streetLamps`)
- **System #1 (stare, wyższe z mocnym światłem)**: tylko 4-6 sztuk w **specjalnych miejscach** które NIE pokrywają się z System #2

### Do zrobienia

1. **System #2 zostaje główny** (`streetLamps` w `drawStreetDetails`):
   - Bez zmian, działa jak teraz na wszystkich chodnikach H1/H2/H3
   - Sprawdzić pozycje X słupa — żeby nie wystawały na ulicę (szczególnie te bliskie krawędzi jezdni)

2. **System #1 — przerobić na "specjalne wysokie latarnie"**:
   - Usunąć z domyślnych pozycji (lampRows ~co 400px)
   - Zostawić tylko 4-6 wybranych pozycji w **innych miejscach niż System #2**
   - Propozycje gdzie umieścić wysokie latarnie (jako akcent / latarnia "placu"):
     - **Plac przy Sali Koncertowej** (entrance) — 1-2 wysokie latarnie z mocnym światłem
     - **Wejście do Drip District** — 1 wysoka latarnia jako landmark
     - **Park główny — wejście od V1** — 1 wysoka latarnia
     - **Penthouse — przed wejściem** — 1 wysoka latarnia "luxury"
     - **Skrzyżowanie centralne (V2×H2)** — 1 wysoka latarnia jako ozdoba
   - Sumarycznie 4-6 sztuk w SPECJALNYCH lokalizacjach, nie wzdłuż chodników
   - Zachować mocną poświatę (radial 130px) — to ich charakterystyka

3. **Implementacja**:
   - W `drawLamps()` zamienić pętlę po `lampRows`+`x+=400` na **ręczną listę 4-6 pozycji**:
     ```js
     const SPECIAL_LAMPS = [
       {wx:2785, wy:670, name:'Sala Koncertowa'}, // przed Salą
       {wx:2596, wy:2706, name:'Drip North entry'},
       {wx:670, wy:1010, name:'Park entry V1'},
       {wx:1380, wy:3148, name:'Penthouse front'},
       // ...
     ];
     ```
   - Każda z mocną poświatą (zachowane z #1)
   - Słup wyższy (85px) — niech wizualnie wyróżniają się na tle "zwykłych" niższych lamp

4. **Sprawdzić że pozycje SPECIAL_LAMPS nie kolidują ze streetLamps** (System #2):
   - SPECIAL_LAMPS są w specjalnych miejscach (np. wy=670 to chodnik S H1, ale wx=2785 to konkretny punkt — sprawdzić czy `streetLamps` nie ma lampy w +/- 60px tej pozycji)
   - Jeśli koliduje — wybrać inny punkt blisko (np. przesunąć o 50-100px)

### Test akceptacyjny

- Większość lamp w mieście to **niższe (System #2)** — jak teraz
- W 4-6 SPECJALNYCH miejscach są **wyższe (System #1)** lampy z mocnym światłem (efekt "latarni placu" / "luksusowej")
- ŻADNA pozycja nie ma 2 lamp nałożonych
- Wszystkie lampy stoją na chodniku, nie na jezdni
- Wysokie latarnie wyraźnie wyróżniają się jako "akcent" — nie wzdłuż chodnika tylko w specjalnych punktach

### ⚠️ KRYTYCZNE — PAMIĘTAĆ PRZY KAŻDEJ POZYCJI LAMPY

> Cytat użytkownika #3: "Dopisz żeby PAMIĘTAĆ ŻEBY NIE STAŁY NA ULICY. MAJĄ STAĆ NA CHODNIKACH TYLKO I WYŁĄCZNIE!"

**ŻADNA lampa NIE MOŻE stać na jezdni — TYLKO i WYŁĄCZNIE na chodnikach.**

Przy każdej dodawanej / zmienianej pozycji lampy (System #1 jak i #2) **PRZED commit** sprawdzić walidatorem `_isOnRoad(wx,wy)`:

```js
// Strefy jezdni (NIGDY tu lampy):
// H1 jezdnia: wy 384-576
// H2 jezdnia: wy 1920-2112
// H3 jezdnia: wy 2880-3072
// V1 jezdnia: wx 768-960
// V2 jezdnia: wx 2208-2400
// V3 jezdnia: wx 3456-3648
```

**Bezpieczne strefy (chodniki) gdzie można stawiać lampy:**
- Chodnik N H1: wy 288-384 (bezpieczna pozycja słupa: wy=330-378)
- Chodnik S H1: wy 576-672 (wy=620-670)
- Chodnik N H2: wy 1824-1920 (wy=1865-1918)
- Chodnik S H2: wy 2112-2208 (wy=2155-2204)
- Chodnik N H3: wy 2784-2880 (wy=2820-2878)
- Chodnik S H3: wy 3072-3168 (wy=3120-3164)
- Chodnik V1 lewy: wx 672-768
- Chodnik V1 prawy: wx 960-1056
- Chodnik V2 lewy: wx 2112-2160
- Chodnik V2 prawy: wx 2400-2448
- Chodnik V3 lewy: wx 3360-3408
- Chodnik V3 prawy: wx 3648-3744

**Wymagane zabezpieczenia w kodzie:**
1. Każda funkcja rysująca lampę MUSI wywołać `_isOnRoad(wx,wy)` i pominąć rysowanie jeśli true
2. Lub: filtr na liście pozycji `streetLamps.filter(l => !_isOnRoad(l.wx, l.wy))`
3. Test screenshotem każdego skrzyżowania po zmianach

To samo dotyczy WSZYSTKICH dekoracji ulicznych (hydranty, kosze, skrzynki, znaki, lampy) — istnieje już walidator `_isOnRoad` z sekcji "SYGNALIZATORY ŚWIETLNE", musi być używany konsekwentnie.

---

## KREATOR POSTACI — ulepszenie grafiki, więcej opcji

> Cytat użytkownika: "Ulepsz nasz aktualny kreator postaci przy starcie gry. Popracuj nad ogólną grafiką, wyglądem i estetyką. Dodaj więcej opcji i możliwości."

### Aktualny stan kreatora

Aktualnie kreator (`#creator` w HTML, linia 348) ma:
- Imię (input)
- Skóra: 3 opcje (jasna/średnia/ciemna)
- Fryzura: 4 opcje (krótka/długa/dredy/łysy)
- Kolor ubrania: 4 opcje (niebieski/czerwony/zielony/czarny)
- Kolor spodni: 4 opcje (granat/czarny/brązowy/szary)
- Kolor butów: 4 opcje (czarne/brązowe/białe/czerwone)
- Mały podgląd 180x260px po lewej

### Do zrobienia — UI / estetyka

1. **Większy podgląd postaci** — np. 280x400px, lepiej widoczny
2. **Animowany podgląd** — postać delikatnie się porusza (oddech, mrugnięcia, machnięcie)
3. **Tło podglądu** — gradient lub pixel-art scena (np. street background)
4. **Karty opcji** zamiast prostych przycisków — większe, kolorowe, hover effects
5. **Sekcje pogrupowane** w taby/akordeony (Skóra | Włosy | Twarz | Ubranie | Akcesoria)
6. **Random button** — losowy wygląd jednym klikiem
7. **Zapisz/wczytaj preset** — opcjonalnie 3 sloty na własne presety

### Do zrobienia — więcej opcji

**Skóra:**
- Z 3 → 6 odcieni (bardzo jasna, jasna, średnia, oliwkowa, ciemna, b. ciemna)

**Fryzura (z 4 → 12-16):**
- Krótka klasyczna, krótka spiked, średnia rozczochrana, długa luźna, długa kucyk
- Dredy, warkoczyki, fade haircut
- Łysy, łysy z brodą, czapka zimowa, czapka z daszkiem
- (kolor włosów — paleta 6-8 kolorów)

**Twarz/oczy (NOWA SEKCJA):**
- Kolor oczu: niebieski / brązowy / zielony / szary / czarny
- Brwi: cienkie / grube / bez brwi (opcjonalnie)
- Twarz/wąsy/broda: czysta / wąsy / broda krótka / broda długa / kozia bródka
- Tatuaż na twarzy (rapowy vibe): brak / mała kropka / kreska pod okiem / wzór
- Okulary: brak / klasyczne / aviator / okulary przeciwsłoneczne / sportowe

**Ubranie (z 4 → 8 kolorów + opcja typu):**
- Typ koszulki: t-shirt / koszulka z długim rękawem / bluza / podkoszulka
- Kolor: rozszerzona paleta (10 kolorów) lub colorpicker

**Spodnie (z 4 → 8):**
- Typ: jeansy / dresowe / formalne / krótkie spodenki
- Kolor: rozszerzona paleta

**Buty (z 4 → 8):**
- Typ: trampki / sneakersy / formalne / sportowe / wojskowe
- Kolor: rozszerzona paleta

**Akcesoria (NOWA SEKCJA):**
- Łańcuch: brak / srebrny / złoty
- Zegarek: brak / smartwatch / klasyczny / złoty
- Plecak: brak / sportowy / szkolny / luksusowy
- Czapka (jeśli nie wybrana fryzura z czapką): brak / z daszkiem / zimowa / beanie

**Imię + nick (NOWA OPCJA):**
- Imię (jak teraz)
- Nick rapowy (osobne pole) — wyświetlany w karierze rapera

### Do zrobienia — implementacja

1. Rozszerzyć HTML kreatora — dodać sekcje, więcej przycisków
2. Dodać JS handlery dla każdej nowej opcji (`setEyes`, `setBeard`, `setAccessory` itd.)
3. Rozszerzyć stan postaci `P` o nowe pola (`eyeColor`, `beard`, `accessory`)
4. Rozszerzyć `drawCharCanvas` (rysowanie podglądu) — uwzględnić wszystkie nowe pola
5. **WAŻNE**: rozszerzyć `drawPlayer` (rysowanie postaci w grze) — wszystkie nowe akcesoria muszą być widoczne w grze, nie tylko w kreatorze (powiązanie z sekcją SYSTEM UBRAŃ)
6. Save/load — wszystkie nowe pola w `G` save state

### Test akceptacyjny

- Kreator wygląda nowocześnie z większym podglądem i lepszą estetyką
- Każda z nowych opcji (oczy, broda, akcesoria) widoczna w podglądzie
- Wybór losowy (Random button) działa i daje sensowną kombinację
- Po zapisie postać w grze wygląda zgodnie z wyborem (wszystkie elementy widoczne w drawPlayer)
- Save/load zachowuje wszystkie nowe pola

---

## APARTAMENT PREMIUM — bug renderowania (migające okna podczas chodzenia obok)

> Cytat użytkownika: "Apartament premium jest zepsuty wizualnie. Stojąc obok niego świeci część tych prostokątów, a chodząc obok niego zaczynają migać i się bugować. Chyba jakiś problem z renderowaniem."

### ROOT CAUSE

W funkcji `drawAptPremium` (linia 3949) jest bug w wyborze które okno świeci:

```js
const lit=G.timeOfDay>=2&&((r*bCols+c+sx)%4)>1;
```

Używa **`sx` (pozycja na ekranie!)** jako składnik wyboru "świeci czy nie". `sx = wx2sx(obj.wx) = obj.wx - cam.x`, więc **zmienia się gdy gracz się porusza** (kamera śledzi gracza).

**Wynik:** Okna migają i zmieniają stan świecenia gdy gracz idzie obok budynku. Kompletnie niedeterministyczne renderowanie.

### Do zrobienia

1. **Naprawa**: zamienić `sx` na **deterministyczną wartość** (np. `obj.wx` przekazane jako parametr, lub po prostu numer kolumny `c`):
   ```js
   const lit = G.timeOfDay >= 2 && ((r*bCols + c) % 4) > 1; // bez sx
   ```
   Lub jeszcze lepiej — z różnorodnością ale stabilną:
   ```js
   const lit = G.timeOfDay >= 2 && ((r * bCols + c + 7) % 4) > 1; // stabilna offset
   ```

2. **Audyt innych funkcji rysujących budynki** — `grep "sx)%"` lub `grep "+sx)"` w funkcjach `drawXxx` żeby znaleźć podobne bugi w innych budynkach
3. Sprawdzić też `drawAptPenthouse` (linia 4013), `drawAptBasic`, `drawTraphouse` — czy nie mają tej samej pomyłki

### Test akceptacyjny

- Stanąć obok Apartamentu Premium nocą (G.timeOfDay>=2)
- Świecące okna są **te same** za każdym razem (deterministyczne)
- Chodząc obok — okna NIE migają, NIE zmieniają stanu świecenia
- Stan świecenia identyczny niezależnie od pozycji kamery
- Sprawdzić to samo przy innych budynkach (Penthouse, Basic, sklepy luksusowe)

---

## PRĘDKOŚĆ POSTACI — niestabilna prędkość (raz wolniej raz szybciej) — BUG DIAGONAL

> Cytat użytkownika: "Coś jest nie tak z prędkością poruszania się gracza. Raz gracz chodzi wolniej, raz szybciej. Coś chyba się buguje. Prędkość poruszania się normalnie zmienia się czasami i czasem idzie się wolno, a czasem normalnie."

### ROOT CAUSE — BRAK NORMALIZACJI RUCHU PO SKOSIE

W kodzie ruchu gracza (linie 5349-5352):
```js
if(K['ArrowLeft']||K['a']||K['A']){dx=-P.spd;P.dir=3;}
if(K['ArrowRight']||K['d']||K['D']){dx=P.spd;P.dir=1;}
if(K['ArrowUp']||K['w']||K['W']){dy=-P.spd;P.dir=0;}
if(K['ArrowDown']||K['s']||K['S']){dy=P.spd;P.dir=2;}
```

**Bug:** Gdy gracz wciska 2 klawisze naraz (np. W+A = lewo-góra), `dx=-P.spd` ORAZ `dy=-P.spd`. Wynikowa odległość przebyta na klatkę = `sqrt(dx² + dy²) = P.spd × √2 ≈ P.spd × 1.41`.

**Czyli gracz idzie 41% SZYBCIEJ po skosie niż prosto!**

To powoduje "raz wolniej, raz szybciej":
- WASD prosto (np. tylko W) = normalna prędkość = `P.spd`
- WASD po skosie (np. W+A) = **41% szybciej**

Gracz nawet nieświadomie wciska 2 klawisze i zmienia prędkość, co wygląda jak "buguje się losowo".

### Inne hipotezy do sprawdzenia

1. **Auto włącza/wyłącza się** — `G._inCar` może się zmieniać przypadkiem (np. naciśnięcie V), boost prędkości znika/wraca
2. **FPS spikes** — animacja oparta o `anim++` (klatki) zamiast time-based — przy spadku FPS gracz idzie wolniej
3. **Tempo czasu** — admin panel ma mnożnik tempa (0×, 1×, 2×, 5×, 10×, 50×) — może się włącza
4. **Skill kondycja zmienia się dynamicznie** — bonus prędkości z kondycji może się aktualizować w trakcie sesji
5. **Pora dnia / pogoda** — sprawdzone wcześniej, ale warto re-test (powiązanie z sekcją POGODA punkt 3)

### Do zrobienia

1. **Dodać normalizację diagonal** — TUŻ po obliczeniu dx/dy:
   ```js
   // Normalizacja po skosie — żeby gracz nie szedł szybciej idąc na ukos
   if(dx !== 0 && dy !== 0){
     const norm = 1 / Math.SQRT2; // ≈ 0.7071
     dx *= norm;
     dy *= norm;
   }
   ```
2. **Pomiar w grze** (po naprawie):
   - Włączyć timer
   - Idź **prosto** (tylko W) przez 5 sekund — zmierz dystans
   - Idź **po skosie** (W+A) przez 5 sekund — zmierz dystans
   - Oba wyniki MUSZĄ być identyczne (±2px)
3. **Audyt też dla innych pomieszczeń** — jeśli funkcja ruchu ta sama, naprawia automatycznie
4. **Sprawdzić auto** — jeśli `G._inCar` się przypadkowo zmienia, to też powoduje "raz szybciej raz wolniej". Sprawdzić w log konsoli czy V nie jest triggerowane bez intencji
5. **Sprawdzić tempo czasu** — czy `gameSpd` mnożnik zostaje na 1× w normalnej grze (nie admin)

### Test akceptacyjny

- Idąc prosto (W lub A lub S lub D pojedynczo) — stała prędkość X
- Idąc po skosie (W+A lub D+S itp.) — **identyczna prędkość X** (nie 1.41× szybciej)
- Stoper: 5 sek prosto = 5 sek po skosie (ten sam dystans)
- Brak losowych zmian prędkości w trakcie sesji (jeśli stat się nie zmienia)

---

## ADMIN PANEL — rozszerzenie + naprawa "Maks statystyki"

> Cytat użytkownika: "Dodaj do admin panelu więcej możliwości. Maks statystyki nie dają formy, kondycji, dripu. Dodaj tam też możliwości z drzewkiem rapera żeby łatwiej testować te rzeczy."

### 1. Naprawa "Maks statystyki" — brakuje 3 statystyk

**Aktualny kod (linia 18098):**
```js
function adminMaxStats(){
  G.health=100; G.energy=100; G.hunger=100; G.stress=100;
  G.money=Math.max(G.money,10000); G.fame=100; G.streetRep=100;
  updateHUD();
}
```

**Brakuje:**
- `G.fitness` (forma) — max 100
- `G.kondycja` lub `G.skills.kondycja` — sprawdzić czy to skill (max 10 lvl) czy osobny stat
- `G.drip` (prestiż) — max 100 lub bez limitu

**Do dodania:**
```js
G.fitness = 100;
G.drip = Math.max(G.drip||0, 100);
G.skills = G.skills||{};
G.skills.kondycja = 5; // max poziom skilla (lub 10 jeśli inny limit)
```

### 2. Rozszerzenie panelu — drzewko rapera (raperST)

Drzewko rapera ma **9 gałęzi** (każda max 5 poziomów):
- flow, teksty, produkcja, realizacja, mikser, autopromocja, biznes, scena, kondycja

**Do dodania w admin panelu:**

**A. Quick button: "Maks drzewko rapera"** — ustawia wszystkie gałęzie na max (5)
```js
function adminMaxRaperTree(){
  G.raperST = {flow:5, teksty:5, produkcja:5, realizacja:5, mikser:5, autopromocja:5, biznes:5, scena:5, kondycja:5};
  document.getElementById('adm-msg').textContent='✅ Drzewko rapera zmaksymalizowane!';
}
```

**B. Sliders/inputs dla każdej gałęzi z osobna** — dla precyzyjnego testowania:
```html
<div class="adm-row">
  <label>Flow:</label> <input id="adm-rs-flow" type="number" min="0" max="5" value="0">
  <label>Teksty:</label> <input id="adm-rs-teksty" type="number" min="0" max="5" value="0">
  ... (9 gałęzi razem)
  <button onclick="adminApplyRaperTree()">Zastosuj</button>
</div>
```

**C. Skille (G.skills)** — 14+ skilli (pizza, supermarket, kurier, carwash, construction, zmywak, raper, kondycja, charyzma, cooking, youtuber, beatmaker, gamer, influencer, soundeng, apetyt, odpornosc):
- Quick button: "Maks wszystkie skille" → wszystkie do 10
- Lub lista z input per skill

### 3. Dodatkowe quick buttons (sugerowane)

- **"Maks wszystko"** — łączy maks staty + raperST + skille + sprzęt (1 klik = pełen ekwipunek do testów)
- **"Reset wszystko"** — wszystko do 0/default (do testowania od początku)
- **"Maks finanse"** — money +1mln + zerowanie bills
- **"Maks fani"** — followers 1mln, fans.casual 700k, fans.hardcore 200k
- **"Wszystkie achievements"** — odblokować wszystkie osiągnięcia
- **"Wszystkie outfity"** — dodać wszystkie ubrania do `G._ownedOutfits`
- **"Wszystkie auta"** — dodać wszystkie samochody do `G._ownedCars`
- **"Wszystkie mieszkania"** — wszystkie do `G._ownedApts`
- **"Maks merch"** — `G.merch.sold = 1000`, `G.merch.revenue = 100000`

### 4. Dodatkowe sekcje w admin panelu

**Sekcja "Statystyki fizyczne"** (osobna od głównej):
- Forma (fitness): input 0-100
- Kondycja (skill): input 0-10
- Drip: input 0-100

**Sekcja "Drzewko rapera"** (kollapsowalna):
- 9 inputów (flow / teksty / produkcja / realizacja / mikser / autopromocja / biznes / scena / kondycja)
- Quick button "Maks wszystkie"

**Sekcja "Kariera"**:
- Albums released
- Beats sold
- Concerts performed
- YT subs / videos count

### Test akceptacyjny

- "Maks statystyki" daje 100% formy, 5/5 kondycji (skill), max drip
- "Maks drzewko rapera" daje wszystkie 9 gałęzi na poziomie 5
- Każda gałąź drzewka da się ustawić osobno
- Quick buttons działają i pokazują komunikat "✅ Zastosowano"
- HUD aktualizuje się po każdej zmianie (forma/kondycja/drip widoczne)

---

## SPOTIFY — system weryfikacji artysty (odblokowanie zamiast od razu)

> Cytat użytkownika: "Od razu na starcie gry wchodząc w spotify gracz widzi 'artysta zweryfikowany'. Nie powinno tak być i z tym też powinien być związany jakiś system. Gracz powinien jakoś 'odblokować' weryfikację. Dodajmy coś co gracz musi zrobić aby zostać artystą zweryfikowanym."

### Aktualny stan (bug)

W Spotify (linia 14843):
```html
<div style="font-size:11px;color:#7ec87e">Artysta zweryfikowany ✓</div>
```

**Wyświetla się bezwarunkowo od startu gry**, mimo że gracz nie wydał żadnego utworu ani nie ma żadnych słuchaczy.

Dla porównania: **Twitter już ma system** (linia 15065): `verified = G.followers >= 1000` — pojawia się ✓ tylko gdy gracz osiągnie 1000 obserwujących.

### Realne wymagania Spotify "Verified Artist"

W rzeczywistości Spotify wymaga:
- Wydany utwór / album przez dystrybutora (DistroKid, TuneCore itd.)
- Założenie konta Spotify for Artists
- Aplikacja o weryfikację (claim profile)
- Zwykle 250+ słuchaczy miesięcznie pomaga ale nie jest wymogiem

### Do zrobienia — system weryfikacji w grze (POŁĄCZENIE B + C)

System łączy **Quest-based** (warunki, wniosek, czekanie) z **Multi-stage** (3 wyraźne stany w UI).

**3 STANY UI:**

**Stage 1: "Niezweryfikowany"** (od startu, dopóki gracz nie wyśle wniosku)
- Brak ✓
- Komunikat w Spotify: "Niezweryfikowany — wymaga 1 wydanego utworu i 500 słuchaczy"
- Pasek postępu / hint co trzeba zrobić (np. "Masz 0/500 słuchaczy" + "Brak wydanego utworu")
- Gdy spełnione warunki: pojawia się przycisk **"Złóż wniosek o weryfikację"** (zielony, wyróżniony)

**Stage 2: "W weryfikacji"** (po kliknięciu wniosku, na 3 dni gry)
- Żółty zegar ⏳ obok nazwy artysty (zamiast ✓)
- Komunikat: "⏳ Weryfikacja w toku... Spotify rozpatruje twój wniosek (X dni do końca)"
- Brak możliwości aplikowania ponownie (cooldown)

**Stage 3: "Zweryfikowany"** (po upływie 3 dni gry)
- Niebieski/zielony ✓ (tick) obok nazwy artysty
- Komunikat: "Artysta zweryfikowany ✓"
- Trwałe — od tego momentu zawsze zweryfikowany

**WARUNKI APLIKOWANIA O WERYFIKACJĘ (Stage 1 → Stage 2):**
1. Gracz musi mieć **wydany utwór na Spotify** (przez dystrybutora) — `G.spotify.releases > 0`
2. Gracz musi mieć **min. 500 słuchaczy miesięcznie** — `G.spotify.listeners ≥ 500`

**OCZEKIWANIE NA WERYFIKACJĘ (Stage 2 → Stage 3):**
- 3 dni gry od kliknięcia "Złóż wniosek"
- Czas oczekiwania widoczny w UI (pasek lub licznik)
- Po upływie: automatyczne przejście do Stage 3 + notyfikacja + cinematic milestone

### Implementacja

1. **Nowe pola w G**: `G.spotify.verified = false` (domyślnie), `G.spotify.verifyAppliedDay = null`
2. **Modyfikacja Spotify UI** (linia 14843) — zastąpić bezwarunkowy "Artysta zweryfikowany ✓":
   ```js
   const verified = G.spotify?.verified === true;
   const appliedDay = G.spotify?.verifyAppliedDay;
   const daysWaited = appliedDay ? (G.day - appliedDay) : 0;
   const inProcess = appliedDay && daysWaited < 3 && !verified;
   const releases = G.spotify?.releases || 0;
   const listeners = G.spotify?.listeners || 0;
   const canApply = releases > 0 && listeners >= 500 && !verified && !inProcess;
   
   // 3 STANY UI
   if(verified){
     // Stage 3: ✓ (niebiesko-zielony tick)
     html += `<div style="font-size:11px;color:#1ed760;font-weight:700">Artysta zweryfikowany ✓</div>`;
   } else if(inProcess){
     // Stage 2: ⏳ (żółty zegar + licznik dni)
     const left = 3 - daysWaited;
     html += `<div style="font-size:11px;color:#f1c40f">⏳ Weryfikacja w toku — ${left} ${left===1?'dzień':'dni'} do końca</div>`;
   } else if(canApply){
     // Stage 1 + przycisk aplikacji (zielony, wyróżniony)
     html += `<button onclick="applyVerification()" style="background:linear-gradient(135deg,#1ed760,#1aa84a);color:#000;border:none;padding:6px 14px;border-radius:14px;font-weight:700;cursor:pointer">Złóż wniosek o weryfikację</button>`;
   } else {
     // Stage 1: brakuje warunków — pokaż czego brakuje
     const needRel = releases > 0 ? '✓' : '✗';
     const needLis = listeners >= 500 ? '✓' : `${listeners}/500`;
     html += `<div style="font-size:11px;color:#888">Niezweryfikowany<br>${needRel} Wydany utwór · ${needLis} słuchaczy</div>`;
   }
   ```
3. **Funkcja `applyVerification()`**:
   ```js
   window.applyVerification = function(){
     if(!G.spotify) G.spotify = {};
     G.spotify.verifyAppliedDay = G.day;
     showMsg('📤 Wniosek wysłany do Spotify. Odpowiedź za 3 dni.');
     renderSpotify(); // re-render Spotify UI
   };
   ```
4. **Auto-grant po 3 dniach** — sprawdzać przy każdym otwarciu Spotify lub w `nextPeriod()`:
   ```js
   // Na początku renderSpotify() lub w nextPeriod:
   if(G.spotify?.verifyAppliedDay && (G.day - G.spotify.verifyAppliedDay) >= 3 && !G.spotify.verified){
     G.spotify.verified = true;
     notify('🎉 Twój profil Spotify został zweryfikowany! ✓');
     if(typeof showMilestoneCinematic==='function'){
       showMilestoneCinematic({
         emoji:'✓',
         title:'ZWERYFIKOWANY ARTYSTA',
         subtitle:'Twój profil Spotify ma teraz oficjalną odznakę',
         tagline:'Wyróżniasz się wśród milionów twórców',
         accentColor:'#1ed760',
         accent2:'#1aa84a',
         duration:5000
       });
     }
   }
   ```
5. **Update PATCH_NOTES po wprowadzeniu** — przyjazny język (bez kodu hex/funkcji)

### Powiązane systemy
- Możliwy boost po weryfikacji: +5% słuchaczy/dzień, +10 sławy (jednorazowo)
- Weryfikacja może być wymogiem do podpisania kontraktu z Major Label

### Test akceptacyjny

**Stage 1 (Niezweryfikowany):**
- Nowa gra → Spotify: brak ✓, komunikat z licznikiem "✗ Wydany utwór · 0/500 słuchaczy"
- Po wydaniu pierwszego utworu (250 słuchaczy): "✓ Wydany utwór · 250/500 słuchaczy" — wciąż brak przycisku
- Po 500+ słuchaczach: zielony przycisk **"Złóż wniosek o weryfikację"** widoczny

**Stage 2 (W weryfikacji):**
- Klik wniosku → showMsg "📤 Wniosek wysłany do Spotify. Odpowiedź za 3 dni."
- Status w Spotify: "⏳ Weryfikacja w toku — 3 dni do końca"
- Po 1 dniu gry: "⏳ Weryfikacja w toku — 2 dni do końca"
- Po 2 dniach gry: "⏳ Weryfikacja w toku — 1 dzień do końca"
- Brak możliwości aplikowania ponownie

**Stage 3 (Zweryfikowany):**
- Po 3 dniach gry: notyfikacja + cinematic milestone "ZWERYFIKOWANY ARTYSTA"
- Spotify: zielony **"Artysta zweryfikowany ✓"**
- Status trwały — przy każdym otwarciu Spotify pokazuje ✓

---

## FORMA → ENERGIA / KONDYCJA → ZDROWIE — delikatne mechaniki (max -5% przy 100)

> Cytat użytkownika #1: "Dodajmy nową mechanikę żeby forma minimalnie wpływa na to jak spada energia gracza. Im więcej formy ma gracz tym wolniej spada mu energia. To ma być tylko delikatna, dodatkowa mechanika, więc nie szalej tam z wartościami. Myślę, że 5% wolniejszego spadku energii przy maksymalnie rozwiniętej formie będzie ok."
> Cytat użytkownika #2: "Tą naszą delikatną mechanikę 5% mniejszy spadek energii przy maksymalnej formie zastosuj też dla kondycji, ale kondycja ma dawać o 5% wolniejszy spadek zdrowia."

### Wyjaśnienie nazewnictwa (z kodu)

- **Forma** = `G.forma` (siła) — rośnie z **ławki/wyciągu**
- **Kondycja** = `G.fitness` (prędkość) — rośnie z **bieżni**

**UWAGA**: w istniejącym kodzie linia 7179-7184 zmienna `fitFactor` używa `G.fitness` (KONDYCJA), co już daje wpływ na energię. Trzeba uważnie audytować czy to ma być "forma" czy "kondycja" w nowych mechanikach.

### Mechaniki — tabela

| Statystyka 100 | Wpływ |
|---|---|
| **Forma 100** (`G.forma`) | -5% spadku **energii** (max) |
| **Kondycja 100** (`G.fitness`) | -5% spadku **zdrowia** (max) |

Liniowo (smooth, nie krokowo): forma 50 → -2.5% energii, forma 100 → -5% energii. Analogicznie dla kondycji vs zdrowie.

### Aktualny stan kodu

**Energia/głód** (linia 7179-7184):
```js
const fitFactor = 1 - Math.floor(G.fitness/25)*0.05; // BUG nazwa: używa fitness (kondycja) ale nazwane fitFactor — myli z formą
const kondLvl = (G.skills && G.skills.kondycja || 0);
const kondMult = 1 - (kondLvl*0.08);
const apetMult = 1 - ((G.skills && G.skills.apetyt || 0)*0.08);
G.hunger = clamp(G.hunger - Math.ceil(CFG.hungerDecay * fitFactor * apetMult), 0, 100);
G.energy = clamp(G.energy - Math.ceil(CFG.energyDecay * fitFactor * kondMult), 0, 100);
```

**Zdrowie** (linia 7188-7193):
```js
if(G.hunger<=0 || G.energy<=0){
  const odpMult = 1 - ((G.skills && G.skills.odpornosc || 0)*0.2);
  G.health = clamp(G.health - Math.ceil(CFG.healthDecayAmt * odpMult), 0, 100);
}
```

### Do zrobienia

1. **Rozdzielić zmienne per mechanika** (czytelność):
   ```js
   // Forma → energia (-5% max)
   const formaEnergyMult = 1 - (G.forma||0)/100 * 0.05; // 0→1.0, 100→0.95
   // Kondycja → zdrowie (-5% max)
   const fitnessHealthMult = 1 - (G.fitness||0)/100 * 0.05; // 0→1.0, 100→0.95
   ```

2. **Energia** (linia 7184) — uwzględnić formaEnergyMult:
   ```js
   G.energy = clamp(G.energy - Math.ceil(CFG.energyDecay * formaEnergyMult * kondMult), 0, 100);
   ```
   (zamiast aktualnego `fitFactor`)

3. **Zdrowie** (linia 7190) — uwzględnić fitnessHealthMult:
   ```js
   if(G.hunger<=0 || G.energy<=0){
     const odpMult = 1 - ((G.skills && G.skills.odpornosc || 0)*0.2);
     G.health = clamp(G.health - Math.ceil(CFG.healthDecayAmt * odpMult * fitnessHealthMult), 0, 100);
   }
   ```

4. **Hunger** — zostawić jak jest (gracz nie wspominał o głodzie, używa starego `fitFactor` z `G.fitness` `Math.floor/25*0.05` — czyli max -20%).
   - Hunger zostaje używać starej zmiennej (zachowane)

5. **Audyt nazewnictwa** w kodzie:
   - `fitFactor` aktualnie używa `G.fitness` (kondycja), nie formy — niejednoznaczne
   - Po refactor: rozdzielić nazwy (`formaEnergyMult`, `fitnessHealthMult`, `oldFitFactor` dla hunger)
   - Komentarze w kodzie powinny jasno mówić co to za mechanika

6. **Update tooltipów** (powiązanie z sekcją TOOLTIPS HUD):
   - Energia: "💪 Forma spowalnia spadek energii (max -5% przy formie 100)"
   - Zdrowie: "🏃 Kondycja spowalnia spadek zdrowia (max -5% przy kondycji 100)"

7. **Powiązanie z sekcją FORMA / KONDYCJA 100**:
   - Po osiągnięciu 100 formy/kondycji + cinematic milestone + bonus +10 do max statystyk
   - **DODATKOWO** te delikatne -5% mechaniki działają (już od 1 punktu, ale zauważalne dopiero przy 100)

### Test akceptacyjny

**Energia:**
- Forma 0 → energia spada normalnie (100% decay)
- Forma 50 → -2.5%
- Forma 100 → -5% (max)

**Zdrowie:**
- Kondycja 0 → zdrowie spada normalnie (100% decay gdy hunger/energy = 0)
- Kondycja 50 → -2.5%
- Kondycja 100 → -5% (max)

**Hunger:**
- NIE zmienia się przez nowe mechaniki (zachowane jak teraz)

Mechaniki są **delikatne** — wymaga grindu do 100 żeby zauważyć -5%. Nie game-changer, tylko zachęta do treningu.

---

## TOOLTIPS HUD — naprawa opisów (zdrowie, energia, drip, kondycja)

> Cytat użytkownika: "Zrób żeby jak najedzie się na HUD na zdrowie nie było informacji o straconym dniu, tylko o kosztach leczenia, przy energii dodaj informacje o formie i jej wpływie. Sprawdź czy opisy dripu i kondycji są prawdziwe i faktycznie zgodne z mechaniką."

### 1. ZDROWIE — usunąć "+1 dzień", dodać koszty leczenia

**Aktualny tooltip** (linia 16683):
```
Spada gdy głód lub energia = 0. Przy 0 → szpital (-500zł, +1 dzień). 
Skill „Odporność" = wolniejszy spadek.
```

**Problem:** "**+1 dzień**" — gracz tego nie chce.

**Realne koszty leczenia w grze** (linia 11411):
- **Lekkie leczenie**: 3 zł × brakujące% zdrowia (np. przy 50/100 → 150 zł, przy 20/100 → 240 zł)
- **Pełne leczenie**: 8 zł × brakujące% zdrowia (np. przy 50/100 → 400 zł, przy 20/100 → 640 zł)

**Nowy tooltip:**
```
❤️ Zdrowie X/100
Spada gdy głód lub energia = 0. Lecz w szpitalu — koszt zależy od ubytku:
• Lekkie leczenie: 3 zł × brakujące %
• Pełne leczenie: 8 zł × brakujące %
Skill „Odporność" = wolniejszy spadek.
```

### 2. ENERGIA — dodać info o formie

**Aktualny tooltip** (linia 16684):
```
Spada przy każdej akcji (praca, freestyle, koncert). 
Idź spać w łóżku gdy poniżej 30%. Przy 0 traci zdrowie.
```

**Problem:** brak info o formie (po naprawie sekcji "FORMA WPŁYWA NA SPADEK ENERGII" — forma -5% max).

**Nowy tooltip:**
```
⚡ Energia X/100
Spada przy każdej akcji (praca, freestyle, koncert). 
Idź spać w łóżku gdy poniżej 30%. Przy 0 traci zdrowie.
💪 Forma spowalnia spadek energii (max -5% przy formie 100).
```

### 3. DRIP — sprawdzić zgodność z mechaniką

**Aktualny tooltip** (linia 16689):
```
💎 Drip X
Luksusowy styl. Mnożnik fanów i ofert reklamowych (+0.2% per pkt). 
Kup ubrania w Dzielnicy Dripu (LV, Chanel, Hermès, Gucci).
```

**Aktualne efekty drip w kodzie:**
- Linia 7340: `dripRoyMult = 1 + (G.drip||0)*0.002` → +0.2% royalties Spotify per pkt drip
- Linia 9437: `dripBonus = 1 + (G.drip||0)*0.005` → +0.5% (gdzieś indziej)
- Linia 10124: `1 + (G.drip||0)*0.008` → +0.8% Major Label zaliczka
- Inne miejsca też mogą mieć

**Problem:** tooltip mówi tylko "0.2%" ale faktyczne efekty są RÓŻNE (0.2/0.5/0.8). Nieprawda.

**Nowy tooltip (poprawniejszy):**
```
💎 Drip X
Luksusowy styl. Boost na różne mechaniki:
• Tantiemy Spotify: +0.2% / pkt
• Bonusy z koncertów / kontraktów: +0.5% - 0.8% / pkt
Kup ubrania w Dzielnicy Dripu (LV, Chanel, Hermès, Gucci, Balenciaga, Bottega, Dior, Prada).
```

### 4. KONDYCJA — sprawdzić czy "+1% prędkości per pkt" jest prawdą

**Aktualny tooltip** (linia 16690):
```
🏃 Kondycja X (używa G.fitness — BUG! powinno być G.skills.kondycja)
Twoja prędkość poruszania (+1% per pkt). Biegaj na bieżni w siłowni.
```

**Problem 1: Tooltip pokazuje `G.fitness` zamiast `G.skills.kondycja`**
- `G.fitness` to FORMA (0-100), nie kondycja!
- `G.skills.kondycja` to skill (0-5)

**Problem 2: "+1% per pkt" — nieprawda**
- Aktualna formuła: `_kondBonus = [0, 0.06, 0.12, 0.18, 0.24, 0.30][Math.min(5,_kondLvl)]`
- To tabela: kondycja 0→+0%, 1→+6%, 2→+12%, 3→+18%, 4→+24%, 5→+30%
- Czyli +6% per poziom (nie +1%)
- I tylko 6 poziomów (0-5), nie X×100

**Nowy tooltip:**
```
🏃 Kondycja X/5 (z drzewka skilli)
Wpływa na prędkość poruszania (+6% za każdy poziom, max +30% przy poziomie 5).
Rozwijaj kondycję w drzewku skilli (klik twarz → drzewko).
Biegaj na bieżni w siłowni żeby zwiększyć formę (G.fitness).
```

### 5. AUDYT POZOSTAŁYCH TOOLTIPÓW (forma, sława, nastrój, głód)

Przy okazji audytu sprawdzić czy:
- **fitness/forma** tooltip mówi "Wpływa na sprzedaż w merchu (zdrowy styl), zarobki z Instagrama" — czy faktycznie tak jest? `grep "G.fitness"` w kontekście merchu i Instagrama
- **fame/sława** tooltip "koncerty (mały: 20+, średni: 35+, wielki: 55+)" — sprawdzić progi w kodzie performConcert
- **stress/nastrój** tooltip — sprawdzić "Niski nastrój = wolniejsza regeneracja"
- **hunger/głód** tooltip — Skill „Apetyt" = wolniejszy głód — sprawdzić formułę (jest -8% per pkt, max -40% przy lvl 5)

### Test akceptacyjny

- Najechanie na **❤️ Zdrowie** → tooltip pokazuje koszty leczenia (3 zł / 8 zł × brakujące %), brak "+1 dzień"
- Najechanie na **⚡ Energia** → tooltip pokazuje info o wpływie formy (max -5%)
- Najechanie na **💎 Drip** → tooltip pokazuje różne efekty (royalties, koncerty, kontrakty) ze właściwymi %
- Najechanie na **🏃 Kondycja** → tooltip pokazuje X/5 (skill, nie 0-100!), +6% per poziom, max +30%
- Pozostałe tooltips zaudytowane i zgodne z kodem

---

## FORMA / KONDYCJA 100 — milestone cinematic + zwiększenie max statystyk (+10)

> Cytat użytkownika: "Zrób że gdy gracz po raz pierwszy osiągnie 100 formy wyskakuje ta epicka animacja milestone (jak przy rozpoczęciu nowej gry i innych ważnych momentach gry) i przy osiągnięciu 100 kondycji też. Zrób że 100 formy podnosi maksymalne wartości zdrowia, energii i głodu o 100 (czyli max 110 zamiast 100) i dokładnie to samo przy osiągnięciu 100 kondycji (+10). Mając wymaksowaną formę i kondycję gracz może mieć maksymalnie 120 zdrowia, energii i głodu."

### Wyjaśnienie nazewnictwa (z kodu)

W grze są DWIE statystyki fizyczne 0-100 (oprócz drzewka kondycji):
- **Forma** = `G.forma` (siła) — rośnie z **ławki/wyciągu**
- **Kondycja** = `G.fitness` (prędkość) — rośnie z **bieżni**
- (Skill kondycja `G.skills.kondycja` jest osobny — drzewko 0-5)

### 1. CINEMATIC MILESTONE przy osiągnięciu 100

**Dla formy 100 (G.forma >= 100, po raz pierwszy):**
- Cinematic milestone jak przy nowej grze (showMilestoneCinematic)
- Tytuł: "💪 SZCZYT FORMY"
- Subtitle: "Twoja siła osiągnęła maksimum"
- Tagline: "+10 do maksymalnego zdrowia, energii i głodu"
- Accent color: pomarańczowo-czerwony (siła, np. #e67e22 / #c0392b)
- Trigger: w funkcji która zwiększa `G.forma` (np. po sesji ławki/wyciągu) — sprawdzić czy `G.forma >= 100 && !G._milestoneShown.forma100`

**Dla kondycji 100 (G.fitness >= 100, po raz pierwszy):**
- Cinematic milestone
- Tytuł: "🏃 PEŁNA KONDYCJA"
- Subtitle: "Twoja wytrzymałość osiągnęła maksimum"
- Tagline: "+10 do maksymalnego zdrowia, energii i głodu"
- Accent color: cyjanowy (kondycja, np. #00bcd4 / #3498db)
- Trigger: w funkcji która zwiększa `G.fitness` (np. po sesji bieżni)

**Helper `_milestoneShown` już istnieje** — zapisuje pokazane milestones w `G._milestonesShown` (z poprzedniej iteracji, sekcja Cinematic milestones).

### 2. ZWIĘKSZENIE MAX STATYSTYK — MUSI DZIAŁAĆ FAKTYCZNIE

> Cytat użytkownika #2: "Zrób żeby faktycznie te 120 max zdrowie/energia/głód działało. Nie tylko wizualnie, ale faktycznie też."

**Mechanika:**
- Bazowy max: 100 (zdrowie, energia, głód)
- Forma 100 → +10 do każdej (max 110)
- Kondycja 100 → +10 do każdej (max 110, niezależnie)
- **Forma + Kondycja oba 100 → +20 do każdej (max 120)**

⚠️ **KRYTYCZNE**: bonus musi działać **FAKTYCZNIE w mechanice**, nie tylko jako pasek HUD.
Czyli:
- Gracz **może faktycznie mieć 120 zdrowia/energii/głodu** w `G.health/G.energy/G.hunger`
- Jedzenie / spanie / leczenie napełnia **do nowego max (110 lub 120)**, nie do 100
- Decay (spadek z czasem) dalej działa od aktualnej wartości
- Wszystkie miejsca w kodzie z `clamp(val, 0, 100)` muszą być zaktualizowane

**Implementacja:**

1. **Nowy helper `getMaxStat(name)`**:
   ```js
   function getMaxStat(name){
     // name = 'health' | 'energy' | 'hunger'
     let bonus = 0;
     if((G.forma||0) >= 100) bonus += 10;
     if((G.fitness||0) >= 100) bonus += 10;
     return 100 + bonus;
   }
   ```

2. **Helper `clampStat(name, val)`** — używać WSZĘDZIE zamiast `clamp(val, 0, 100)`:
   ```js
   function clampStat(name, val){
     return clamp(val, 0, getMaxStat(name));
   }
   ```

3. **PEŁEN AUDYT KODU** — znaleźć i zmienić WSZYSTKIE wystąpienia:
   - `grep -n "G\.health.*clamp" index.html` — wszystkie miejsca clamp(G.health, ...)
   - `grep -n "G\.energy.*clamp" index.html` — wszystkie clamp(G.energy, ...)
   - `grep -n "G\.hunger.*clamp" index.html` — wszystkie clamp(G.hunger, ...)
   - Dla każdego: `clamp(G.X..., 0, 100)` → `clampStat('X', ...)`

4. **Audyt funkcji "naładowujących" stat** (KRYTYCZNE — bo tu gracz musi móc dojść do 120):
   - **Sleep / spanie**: `G.energy = 100` → `G.energy = getMaxStat('energy')` (pełna regeneracja energii)
   - **Jedzenie / lodówka / restauracja / sklep**: `G.hunger += X` → `G.hunger = clampStat('hunger', G.hunger + X)`
   - **Leczenie szpital**: `heal(30)` i `heal(100)` → użyć clampStat dla zdrowia
   - **Bonusy z mieszkań** (premium/penthouse): regeneracja energii, mood
   - **Posiłki** (jedzenie z lodówki, kebab, pizza) — wszystkie używają hunger/health/energy
   - **Therapy / sauna** (penthouse): regeneruje stress, ale sprawdzić jeśli też energy/health
   - **Każdy event** który daje +X do statystyki — sprawdzić clamp

5. **HUD pasek**:
   - `el.style.width = val + '%'` → `el.style.width = (val/getMaxStat(name)*100) + '%'`
   - Tekst pokazuje wartość/max: gracz widzi "120/120" gdy ma maks
   - Pasek faktycznie pokazuje wartość proporcjonalnie do nowego max

6. **Tooltip pokazuje aktualny max**:
   - `❤️ Zdrowie X/100` → `❤️ Zdrowie X/${getMaxStat('health')}`
   - Może też pokazać bonus: `❤️ Zdrowie X/120 (+20 z formy i kondycji)`

7. **Inicjalizacja na starcie gry**:
   - Gracz zaczyna z forma=0, fitness=0, więc max=100 (bez bonusów)
   - Po zdobyciu 100 formy → max staje się 110 (gracz natychmiast może zregenerować dodatkowe 10 przez jedzenie/spanie)
   - Po zdobyciu 100 kondycji → max=120

8. **Persistence**:
   - `G.forma` i `G.fitness` są w save state — działa od razu po load
   - `G._milestonesShown.forma100` i `G._milestonesShown.fitness100` w save (helper już to robi)
   - Save state nie wymaga `G.maxHealth` itd. — `getMaxStat` jest computed dynamicznie

### Test akceptacyjny

**Scenariusz 1: pierwsze 100 formy**
- Trenuj na ławce/wyciągu do G.forma = 100
- Cinematic "💪 SZCZYT FORMY" wyskakuje (raz)
- Po zamknięciu: max zdrowie/energia/głód = 110
- HUD pasek pokazuje aktualną wartość względem 110 (np. zdrowie 100/110)
- **TEST FAKTYCZNY**: zjedz coś — głód osiąga **110** (nie 100). Idź spać — energia osiąga **110**.

**Scenariusz 2: pierwsze 100 kondycji**
- Trenuj na bieżni do G.fitness = 100
- Cinematic "🏃 PEŁNA KONDYCJA" wyskakuje (raz)
- Max zdrowie/energia/głód = 110 (jeśli forma <100) lub 120 (jeśli forma 100)
- **TEST FAKTYCZNY**: idź do szpitala, lecz się — zdrowie osiąga aktualny max (**110 lub 120**)

**Scenariusz 3: oba osiągnięte**
- G.forma = 100 ORAZ G.fitness = 100
- Max zdrowie/energia/głód = **120**
- **TEST FAKTYCZNY**:
  - Spanie → energia **120/120**
  - Pełne leczenie → zdrowie **120/120**
  - Najedz się → głód **120/120**
- Gracz może faktycznie chodzić z 120 zdrowia/energii/głodu

**Scenariusz 4: powtórzenie (save/load)**
- Cinematic NIE pojawia się drugi raz po wczytaniu save
- Bonus +10/+10 nadal aktywny
- Statystyki mogą być >100 po load (jeśli były na starcie)

**Scenariusz 5: zachowanie 120 nawet gdy jeden bonus przepadnie**
- Edge case: jeśli forma spada poniżej 100 (np. minigra "obniża" formę chwilowo) → max wraca do 110
- Aktualne statystyki nie są clamp'owane wstecz (np. miałeś 120, max spada do 110, ale stat zostaje 120 dopóki nie zacznie spadać)
- LUB: clamp natychmiast (do decyzji w implementacji)

### ⚠️ DYNAMICZNY MAX — WAŻNE: BONUS DZIAŁA TYLKO GDY FORMA/KONDYCJA = 100

> Cytat użytkownika: "Pamiętaj o rzeczach typu, gdy graczowi spadnie kondycja/forma poniżej 100 to jego max zdrowie/energia/głód spadnie też, gdy wbije ponownie 100 formy +10, ponownie 100 kondycji +10"

**Mechanika `getMaxStat` jest dynamiczna — sprawdzana CO KLATKA, nie raz przy "odblokowaniu":**
- Bonus +10 z formy działa **TYLKO** gdy `G.forma >= 100` (warunek sprawdzany ZAWSZE)
- Bonus +10 z kondycji działa **TYLKO** gdy `G.fitness >= 100` (warunek sprawdzany ZAWSZE)
- Spadek poniżej 100 → bonus znika natychmiast → max wraca do 100/110
- Ponowne osiągnięcie 100 → bonus wraca → max znów 110/120

**Cykl bonus (przykład):**
1. Gracz wbija formę = 100 → cinematic 💪 SZCZYT FORMY → bonus +10 (max 110)
2. Gracz nie ćwiczy 4 dni → forma spada do 85 → bonus znika → max wraca do 100
3. Gracz wraca na siłkę, wbija formę = 100 znów → **brak cinematic** (już pokazany raz) ALE **bonus +10 wraca** (max 110)

**Implementacja zapewnia automatyczność:**
```js
function getMaxStat(name){
  let bonus = 0;
  if((G.forma||0) >= 100) bonus += 10; // sprawdza CO WYWOŁANIE — gdy forma spadnie, bonus znika
  if((G.fitness||0) >= 100) bonus += 10;
  return 100 + bonus;
}
```
Dzięki temu nie trzeba osobnego mechanizmu — bonus jest computed dynamicznie.

**Cinematic milestone vs bonus:**
- **Cinematic** = pokazywany RAZ (`_milestoneShown.forma100` zapisuje że już pokazano)
- **Bonus +10** = aktywny zawsze gdy stat >= 100 (computed)
- Ponowne osiągnięcie 100 → bonus wraca, ale cinematic NIE pojawia się drugi raz

**Co się dzieje ze statystykami które przekraczają nowy max?**
- Edge case: gracz miał zdrowie 120, forma spada poniżej 100 (max=110), zdrowie nadal=120
- **Decyzja**: NIE clamp wstecz — gracz zachowuje "nadmiar" do następnego decay/akcji
- Po spadku z naturalnego decay: stat dochodzi do nowego max i tam się zatrzymuje
- LUB (alternatywa): clamp natychmiast — wtedy gracz traci nadwyżkę przy spadku formy
- **Rekomendowane: NIE clamp wstecz** (bardziej przyjazne dla gracza, mniej "karzące")

---

## SPADEK FORMY/KONDYCJI gdy gracz nie ćwiczy + SMS od Gym Bro

> Cytat użytkownika: "Musimy dodać immersyjną mechanikę związaną z formą i kondycją, polegającą na tym, że gdy gracz nie ćwiczy to forma i kondycja spadają. Żeby nie było tak, że gracz raz wbije 100 formy, 100 kondycji i nie musi już nigdy na siłownie wrócić. Zróbmy tak, że gdy gracz ćwiczył chociaż raz to od tego momentu odblokowywuje mechanikę która miałaby działać mniej więcej tak: dzień 1 > gracz idzie na siłownie, ćwiczy, dzień 2 > gracz nie poszedł na siłownie, nie ćwiczył nic danego dnia, dzień 3 > Rano gracz dostaje smsa od gym bro w stylu bracie musisz wbijać na siłke bo spadnie, bo spadnie Ci pompa, dzień 4 > jeżeli gracz poszedł na siłownie i ćwiczył to ok, ale jeżeli nie poszedł to forma i kondycja spadają o 10-20%."

### Cel mechaniki

Anti-grindowa, immersyjna mechanika "use it or lose it" — gracz nie może raz wbić max formy/kondycji i już nigdy nie wrócić na siłownię. Musi utrzymywać sesje treningowe.

### Mechanika krok po kroku (z cytatu)

| Dzień | Co się dzieje | Akcja gry |
|-------|---------------|-----------|
| Dzień 1 | Gracz ćwiczy (siłka lub bieżnia) | `G._lastGymDay = G.day` ustawione, mechanika ODBLOKOWANA |
| Dzień 2 | Gracz nie ćwiczy | Nic — 1 dzień przerwy OK |
| Dzień 3 (rano) | Gracz nie ćwiczył od 2 dni | **SMS od Gym Bro** ostrzegający |
| Dzień 4 (rano) | Gracz nadal nie ćwiczył | **-10-20% formy i kondycji** (decyzja: 15%? randomized 10-20%?) |
| Dzień 5+ | Gracz nadal nie ćwiczył | Co dzień kolejny -10-20% spadek |

### Reset mechaniki

- Każda sesja na siłowni (ławka/wyciąg/bieżnia) **resetuje licznik** — `G._lastGymDay = G.day`
- Liczy się dzień ostatniej sesji, nie dni od pierwszej
- Po reset spadek nie jest cofnięty (forma/kondycja zostaje) — gracz musi odbudować

### ⚠️ KRYTYCZNE ZASADY (z cytatu użytkownika)

> Cytat użytkownika: "Pamiętaj że spadek formy/kondycji gdy gracz nie ćwiczy ma być niezależny od wartości formy/kondycji gracza. Ma nie spadać tylko gdy gracz ma 100 i nie ćwiczy tylko ma spadać gdy gracz nie ćwiczy niezależnie od tego ile formy/kondycji ma. Pamiętaj żeby resetować cykl tej mechaniki z gym bro, przykład: gracz stracił % formy/kondycji bo nie ćwiczył przez określony czas, poszedł na siłownie i zaczął ćwiczyć to cykl resetuje się od nowa i dopiero gdy znowu przez określony czas nie będzie ćwiczyć to znowu spadnie % formy/kondycji."

**ZASADA 1: SPADEK NIEZALEŻNY OD WARTOŚCI FORMY/KONDYCJI**

Mechanika decay działa **ZAWSZE** gdy gracz nie ćwiczy 3+ dni — niezależnie od aktualnej wartości:
- Gracz ma forma=100 → 4 dni bez treningu → spadek do 85
- Gracz ma forma=50 → 4 dni bez treningu → spadek do 35
- Gracz ma forma=30 → 4 dni bez treningu → spadek do 15
- Gracz ma forma=10 → 4 dni bez treningu → spadek do 0 (clamp)

**To NIE jest mechanika tylko dla "max formy"** — to jest mechanika "use it or lose it" dla CAŁEGO postępu na siłowni. Jak nie ćwiczysz, tracisz progres niezależnie od poziomu.

**Wymóg uruchomienia mechaniki:**
- Jedyny warunek odblokowania: `G._lastGymDay !== null` (czyli gracz CHOĆ RAZ ćwiczył)
- Jeśli gracz nigdy nie był na siłowni → mechanika nie działa (nic do stracenia)
- Po pierwszej sesji → mechanika ZAWSZE aktywna, niezależnie od wartości formy/kondycji

**ZASADA 2: PEŁNY RESET CYKLU PO KAŻDEJ SESJI TRENINGOWEJ**

Każda sesja siłowni RESETUJE licznik dni od początku — cykl SMS i decay startuje od zera:

**Przykład cyklu z resetem:**
| Dzień | Akcja | `G._lastGymDay` | `daysSince` | Co się dzieje |
|-------|-------|-----------------|-------------|----------------|
| 1 | Trening | 1 | 0 | OK |
| 2 | Brak | 1 | 1 | Nic |
| 3 | Brak | 1 | 2 | **SMS od Gym Bro** |
| 4 | Brak | 1 | 3 | **Spadek -15%** |
| 5 | **Trening** | **5** (RESET) | 0 | **Cykl od nowa!** Brak SMS, brak decay |
| 6 | Brak | 5 | 1 | Nic |
| 7 | Brak | 5 | 2 | **SMS od Gym Bro znowu** (od początku cyklu) |
| 8 | Brak | 5 | 3 | **Spadek -15% znowu** |

**Kluczowa zasada implementacji:**
- Po KAŻDEJ udanej sesji (ławka, wyciąg, bieżnia) → `G._lastGymDay = G.day`
- To AUTOMATYCZNIE resetuje wszystkie kolejne sprawdzenia (`daysSince = 0`)
- Cykl: SMS (dzień 3 od ostatniego treningu) → decay (dzień 4+) jest LICZONY OD `G._lastGymDay`, nie od jakiejś globalnej daty
- Reset jest "darmowy" — wystarczy 1 sesja żeby przerwać cykl

**Kluczowe NIE:**
- ❌ NIE liczyć "całkowitej liczby dni bez treningu" globalnie
- ❌ NIE używać akumulującego się licznika (np. "stracone treningi")
- ❌ NIE wymagać wielu sesji żeby zresetować cykl (1 wystarczy)
- ❌ NIE resetować licznika SMS osobno (jest jeden licznik: `G.day - G._lastGymDay`)

**Edge case: gracz trenuje codziennie**
- Każdy dzień: `G._lastGymDay = G.day` → `daysSince = 0` zawsze
- Mechanika nigdy nie aktywuje się (idealnie)
- To zachowanie pożądane — codzienny trening = brak utraty

### Implementacja

1. **Nowy stat w G**: `G._lastGymDay = null` (ustawiane po pierwszej sesji)
2. **Hook na koniec sesji ławki/wyciągu/bieżni** — w cleanup minigier:
   ```js
   // Po sukcesie sesji (siłowa lub cardio)
   G._lastGymDay = G.day;
   ```
3. **Sprawdzenie w `nextPeriod()`** (każdy nowy dzień gry):
   ```js
   if(G._lastGymDay !== null){
     const daysSince = G.day - G._lastGymDay;
     if(daysSince === 2){
       // SMS od Gym Bro (rano dzień 3)
       sendGymBroSms();
     } else if(daysSince >= 3){
       // Spadek formy i kondycji
       const decay = 10 + Math.floor(Math.random()*11); // 10-20%
       G.forma = Math.max(0, (G.forma||0) - decay);
       G.fitness = Math.max(0, (G.fitness||0) - decay);
       notify(`💪 Spadek formy i kondycji o ${decay}% (brak treningu od ${daysSince} dni)`);
       updateHUD();
     }
   }
   ```
4. **Funkcja `sendGymBroSms()`** — nowy NPC kontakt w telefonie:
   ```js
   function sendGymBroSms(){
     // Notyfikacja w telefonie + showMsg
     const messages = [
       "Bracie! Musisz wbijać na siłkę bo spadnie Ci pompa! 💪",
       "Hej, ostatnio Cię nie widziałem na siłce. Wracaj bo zniknie progress!",
       "Pamiętaj — 'use it or lose it'. Nie pozwól żeby forma uciekła!",
       "Hej bracie, kiedy widzimy się na siłce? Czuję że zaraz spadnie pompa!",
     ];
     const msg = messages[Math.floor(Math.random()*messages.length)];
     addNotif(`💪 Gym Bro: "${msg}"`);
     showMsg(`💪 SMS od Gym Bro: "${msg}"`);
     // Opcjonalnie: dodać do "wiadomości" w telefonie jako persistent
   }
   ```
5. **Optional: Gym Bro jako kontakt w telefonie** (sekcja "Wiadomości"):
   - Lista SMS-ów od Gym Bro przechowywana w `G.gymBroMessages = []`
   - Dostępna w aplikacji "Wiadomości" w telefonie
   - Każdy SMS ma datę otrzymania
6. **Persistence**: `G._lastGymDay` w save state (działa od razu)

### Edge cases

- **Gracz nigdy nie ćwiczył**: mechanika nie działa (G._lastGymDay = null)
- **Gracz właśnie zaczął** (dzień 1 sesja, dzień 1 sprawdzenie): daysSince = 0 → OK
- **Save load po wielu dniach**: jeśli gracz wczyta save sprzed 5 dni — naliczyć cały spadek (np. 5-3 = 2 dni spadku × 10-20% = 20-40% spadek)
  - Lub: tylko 1 spadek per sesja (rozsądniej, żeby nie zaskakiwać gracza)
- **Forma 0**: spadek nie schodzi poniżej 0

### ⚠️ KRYTYCZNE POWIĄZANIE z FORMA/KONDYCJA 100 — bonus +10 max stat działa CYKLICZNIE

> Cytat użytkownika: "Pamiętaj o rzeczach typu, gdy graczowi spadnie kondycja/forma poniżej 100 to jego max zdrowie/energia/głód spadnie też, gdy wbije ponownie 100 formy +10, ponownie 100 kondycji +10"

**Pełny cykl mechaniki (forma jako przykład, kondycja analogicznie):**

| Krok | Stan | Max zdrowie/energia/głód | Komunikat |
|------|------|--------------------------|-----------|
| 1. Start gry | forma=0 | 100/100/100 | — |
| 2. Trening, forma=100 (pierwszy raz) | forma=100 | **110/110/110** | 💪 cinematic SZCZYT FORMY + bonus +10 |
| 3. 4 dni bez treningu, decay -15% | forma=85 | 100/100/100 | "💪 Spadek formy... bonus +10 max znika" |
| 4. Naturalny decay zdrowia 110→100 | zdrowie=100 | 100/100/100 | (stopniowo, bez wymuszania) |
| 5. Wraca na siłownię, forma=100 znów | forma=100 | **110/110/110** | "💪 Bonus +10 do max wrócił! (forma=100)" — BEZ cinematic |
| 6. Kolejny okres bez treningu | forma=85 | 100/100/100 | "💪 Spadek..." |
| 7. Powrót, forma=100 | forma=100 | **110/110/110** | "💪 Bonus +10 wrócił" |

**Mechanika jest CYKLICZNA — bonus +10 może wracać i znikać dowolną liczbę razy.**

**Implementacja jest automatyczna dzięki dynamicznemu `getMaxStat()`** (zob. sekcja FORMA/KONDYCJA 100 wcześniej):
```js
function getMaxStat(name){
  let bonus = 0;
  if((G.forma||0) >= 100) bonus += 10; // sprawdza CO WYWOŁANIE
  if((G.fitness||0) >= 100) bonus += 10;
  return 100 + bonus;
}
```
- Spadek formy 100→85 (z decay) → bonus znika natychmiast (max 110→100)
- Powrót formy 85→100 (po treningu) → bonus wraca natychmiast (max 100→110)
- Cinematic milestone NIE pokazuje się ponownie (`_milestoneShown.forma100=true`)
- Bonus +10 **NIE jest powiązany z cinematic** — jest computed z aktualnego stanu

**Hooki potrzebne dla notyfikacji "bonus stracony / odzyskany":**
- W `nextPeriod()` po decay: jeśli forma BYŁA >=100 a teraz <100 → komunikat "💪 Bonus +10 max znika"
- Po sesji siłowni: jeśli forma BYŁA <100 a teraz >=100 → komunikat "💪 Bonus +10 max wrócił!" (i NIE pokazuj cinematic)
- Każdy hook wywołuje `updateHUD()` żeby pasek max się odświeżył

**Decyzja "clamp wstecz czy nie"**: NIE clamp wstecz. Gracz zachowuje "nadwyżkę" zdrowia/energii/głodu po spadku formy poniżej 100. Naturalny decay obniży go do nowego max stopniowo. To bardziej przyjazne i mniej karzące.

**Edge case: oba bonusy 100**
- Forma=100 + Kondycja=100 → max = 120 (bonus +20)
- Tylko forma spada poniżej 100 → max = 110 (bonus +10 z kondycji nadal)
- Obie spadają → max = 100 (bez bonusu)
- Cykl niezależny dla każdej statystyki

### Test akceptacyjny CYKLU (rozszerzony)

- **Cykl 1**: forma 100 → +10 max → spadek do 85 → max 100 → trening do 100 → +10 max wraca
- **Cykl 2**: powtórzyć — sprawdzić że działa wielokrotnie
- **Niezależność**: kondycja 100 / forma <100 → max = 110 (tylko jeden bonus)
- **Notyfikacje**: pojawiają się komunikaty "bonus stracony" i "bonus odzyskany"
- **Cinematic NIE wyświetla się ponownie** po pierwszym razie

### UI / komunikacja gracza

- **SMS** ma być immersyjny — Gym Bro to "kumpel z siłki"
- W przyszłości można dodać **Gym Bro jako NPC** — np. spotyka gracza na siłowni, mówi coś jak "Hej bro, dawno cię nie było"
- Notyfikacja po spadku jasno mówi czemu (X dni bez treningu)

### Test akceptacyjny

- **Dzień 1**: ćwicz na siłce → `G._lastGymDay = 1`
- **Dzień 2**: nie ćwicz → bez efektów
- **Dzień 3 (rano)**: SMS "Bracie musisz wbijać..." pojawia się
- **Dzień 4 (rano)**: jeśli nie ćwiczył → forma & kondycja spadają o 10-20%
- **Dzień 5 (rano)**: jeśli dalej nie ćwiczył → kolejny spadek
- **Reset**: jeśli ćwiczy w dzień 4 → mechanika resetuje, brak spadku
- **Po wyciu**: gracz musi wrócić na siłownię żeby odbudować formę/kondycję

---

## SYSTEM UBRAŃ — pełna przebudowa (faktyczna widoczność, więcej ubrań, kolory)

> Cytat użytkownika: "Zrób żeby ogólnie system ubrań działał i wyglądał dobrze. Aktualnie jak gracz kupuje i zakłada jakieś ubranie to nic się nie zmienia w jego wyglądzie. Dodaj więcej ubrań i zrób żeby gracz mógł wybierać ich kolor i żeby faktycznie je było widać w grze. Popracuj nad tym żeby wyglądały one dobrze."

### Aktualny stan (bug)

Aktualnie outfit zmienia TYLKO `P.cloth` (kolor tułowia) — i to nawet słabo:
- `default` outfit ustawia P.cloth = G.cloth (oryginalny kolor z kreatora)
- Inne outfity (street/suit/sport/music/luxury) mają stałe ciemne kolory
- BRAK rozróżnienia wizualnego (wszyscy w garniturze i streetwear wyglądają prawie tak samo)
- BRAK akcesoriów (krawat dla garnituru, kaptur dla streetwear, czapka dla sport itd.)
- BRAK wpływu na spodnie, buty, włosy
- Gracz nie widzi że kupił coś za 400 zł

### 1. KAŻDE UBRANIE MUSI MIEĆ UNIKALNY WYGLĄD W GRZE

**Do zrobienia w drawPlayer / drawCharSprite:**

| Outfit | Element wizualny | Kolor podstawowy |
|--------|------------------|-------------------|
| 👕 Podstawowy | Zwykła koszulka (jak teraz) | wybór gracza |
| 🧥 Streetwear | Bluza z kapturem (kaptur na głowie lub na plecach), bardziej luźny krój | wybór gracza |
| 👔 Garnitur | Marynarka z białym kołnierzykiem + KRAWAT (kolor wybierany) + spodnie czarne | granat / czarny / szary |
| 🏋 Strój sportowy | Koszulka bez rękawów + krótkie spodenki + biała opaska | wybór gracza |
| 🎤 Outfit muzyczny | Skórzana kurtka (czarna z elementami) + łańcuch złoty na szyi | czarny + akcent |
| 💎 Luxury drip | Markowa koszulka z wzorem + złoty łańcuch + złoty zegarek | wybór gracza + złoty akcent |

### 2. WYBÓR KOLORU PER UBRANIE

- W szafie (`renderWardrobeChange`) dodać paletę kolorów dla każdego outfit (jak przy aucie w salonie)
- Paleta 9 kolorów: czerwony, niebieski, czarny, biały, szary, zielony, żółty, pomarańczowy, fioletowy
- Zapisywać wybór per outfit w `G.outfitColors = {street:'#XXX', suit:'#XXX', ...}`
- Garnitur dodatkowo: wybór koloru krawatu osobno
- Luxury: wybór koloru akcentu (złoty/srebrny)

### 3. NOWE UBRANIA DO DODANIA

Sklep z ubraniami (`renderClothingShop`) powinien mieć więcej opcji:

**Casualowe:**
- 👕 **T-shirt** — podstawowy, kolor wybierany
- 🧥 **Bluza z kapturem** — streetwear z kapturem na głowie/plecach
- 🧵 **Koszulka polo** — semi-elegancki, kołnierzyk
- 🥾 **Kurtka jeansowa** — uliczny vibe, niebieska/czarna

**Cieplejsze:**
- 🧣 **Kurtka zimowa** — chroni przed mrozem (bonus: -15% utraty zdrowia w mroźnej pogodzie)
- 🥾 **Puchówka** — gruba, ciepła
- 🧤 **Czapka + szalik komplet** — do mroźnej pogody

**Eleganckie:**
- 👔 **Garnitur** (jak jest, dopracować)
- 🎩 **Smoking** — luksusowy event-only, +15 sława

**Sceniczne:**
- 🎤 **Skórzana kurtka** (już jest jako "music")
- 🌟 **Designerski strój koncertowy** — z wzorem, dla scen luksusowych

**Sportowe:**
- 🏋 **Strój sportowy** (~150 zł) — +20% bonus do przyrostów na siłowni
- 🥋 **Strój treningowy PRO** (~700 zł, droższy) — +25% bonus + dodatkowa seria na ławce/wyciągu i bieżni (zgodnie z sekcją "STROJE TRENINGOWE" wcześniej). Wizualnie lepszy: inny krój, akcenty, lepszy materiał

**Luksusowe:**
- 💎 **Luxury drip** (jak jest)
- 👑 **Custom designerski** — najwyższy poziom, +20 sława

### 4. SZAFA — ULEPSZENIE UI

- Wizualna prezentacja każdego outfit (mini-podgląd postaci w danym ubraniu)
- Sekcje: Casualowe / Sceniczne / Sportowe / Luksusowe
- Sekcja "Kolory" gdzie gracz wybiera kolor założonego outfit
- Komunikat przy zmianie: "Założyłeś [outfit] w kolorze [kolor]"

### 5. WIDOCZNOŚĆ W GRZE

- W `drawPlayer` (na ulicy / w mieszkaniu / wszędzie) renderować kompletny outfit:
  - Tułów wg outfit
  - Spodnie wg outfit (sport→spodenki, garnitur→czarne formalne, casual→jeansy)
  - Buty wg outfit (sport→trampki białe, garnitur→czarne wizytowe, casual→domyślne)
  - Akcesoria (krawat, kaptur, łańcuch, opaska)
- Każda zmiana outfit MUSI być widoczna w `drawPlayer` w 100% wszystkich scen

### Test akceptacyjny

- Kupić każdy z outfitów, założyć go i sprawdzić że postać wygląda inaczej (różne tułowy, akcesoria)
- Wybrać różne kolory per outfit — kolory zapisane między sesjami
- W każdej scenie (ulica, mieszkanie, studio, siłownia) postać widoczna w aktualnym outfit
- Akcesoria widoczne (krawat, kaptur, łańcuch)

---

## CINEMATIC SIŁOWNIA — pierwszy raz, milestone 100, powrót do szczytu

> Cytat użytkownika: "Dodajmy przy pierwszym wejściu gracza na siłownie epicki cinematics, który nie zamyka się sam (zamyka się tylko gdy gracz go zamknie). Poza tym że ma być epicki zamieść tam wszystkie informacje o siłowni. Co daje forma, na co wpływa, co daje kondycja, na co wpływa. Informacje o stroju sportowym, limicie dziennym ćwiczeń o tym, że jak nie będzie ćwiczyć to jego forma i kondycja będzie spadać. Pamiętaj że cinematics miletone ma się uruchamiać tylko przy pierwszym wejściu na siłownie, za pierwszym razem gdy gracz osiągnie 100 formy/kondycji, jeżeli jego kondycja/forma spadnie poniżej 100 (bo nie ćwiczył) i gracz powróci z powrotem do 100 formy/kondycji to ma się odpalać inny cienmatic np. wróciłeś do swojej szczytowej formy, powrót do życiówki itp."

### Cel

3 osobne cinematicy na siłowni — każdy raz w danym kontekście:
1. **Pierwsze wejście** — "TUTORIAL EPIC" z pełną instrukcją siłowni (NIE zamyka się sam!)
2. **Pierwsze 100 formy / Pierwsze 100 kondycji** — "SZCZYT FORMY" / "MISTRZ KONDYCJI" (pełnoekranowy efekt)
3. **Powrót do 100 po spadku** — "POWRÓT DO ŻYCIÓWKI" (krótszy, cykliczny — może się powtarzać)

### CINEMATIC #1 — Pierwsze wejście (TUTORIAL EPIC)

**Trigger:** Gracz wchodzi pierwszy raz do siłowni (`G._gymFirstEntry` flag).

**Ważne właściwości:**
- ⚠️ **NIE zamyka się sam** — tylko gdy gracz kliknie przycisk "ROZUMIEM" / "ZACZNIJMY"
- ⚠️ **Pauzuje grę** w tle (jak inne modale)
- ⚠️ **Pełnoekranowy** — overlay z gradientem, efekty cząsteczek (dymki, "blasku")

**Treść (wszystkie info w jednym epickim cinematic):**

```
┌──────────────────────────────────────────────────┐
│  💪 WITAJ NA SIŁOWNI 💪                          │
│  [animacja sztangi, hantli, motywujące tło]      │
│                                                   │
│  TWÓJ ROZWÓJ FIZYCZNY ZACZYNA SIĘ TUTAJ          │
└──────────────────────────────────────────────────┘

────── 💪 FORMA (siła) ──────
• Trenowana na ŁAWCE i WYCIĄGU
• Wpływ na zarobki podczas pracy fizycznej
• Wpływ na atrakcyjność u NPC
• Wpływ na atrakcyjność na scenie (występy)
• Forma 100 → +10 max do zdrowia/energii/głodu
• Forma 100 → -5% wolniejszy spadek energii

────── 🏃 KONDYCJA (wytrzymałość) ──────
• Trenowana na BIEŻNI
• Wpływ na prędkość poruszania się postaci
• Wpływ na dystans, na jaki postać może biec bez zmęczenia
• Kondycja 100 → +10 max do zdrowia/energii/głodu
• Kondycja 100 → -5% wolniejszy spadek zdrowia

────── 🏋 STRÓJ SPORTOWY ──────
• Strój sportowy (~150 zł) → +20% przyrostów
• Strój treningowy PRO (~700 zł) → +25% + DODATKOWA seria
• Pamiętaj założyć strój przed treningiem!

────── ⏰ LIMIT DZIENNY ──────
• Maksymalnie X ćwiczeń dziennie (X = aktualny limit z gry)
• Przekroczenie limitu = przemęczenie, spadek zdrowia

────── ⚠️ BRAK TRENINGU = SPADEK ──────
• Jeśli nie ćwiczysz przez 2-3 dni, dostaniesz SMS od kumpla
• Po 3+ dniach bez treningu — forma i kondycja spadają o 10-20%!
• Trzymaj formę regularnie!

[ROZUMIEM, DO ROBOTY! 💪]   ← PRZYCISK GRACZA
```

**Implementacja UI:**
- Modal `<div id="gym-tutorial-cinematic">` — full-screen z `position:fixed` w `document.body` (nigdy w #wrap, zgodnie z memory `position_fixed_scale`)
- Ciemne tło z gradientem (czarny → granatowy)
- Animowane efekty: pulsujące ikony 💪 🏃 🏋
- Sekcje rozwijane lub wszystkie widoczne na raz (decyzja: WSZYSTKIE — gracz ma wiedzieć od razu)
- Przycisk "ROZUMIEM, DO ROBOTY!" duży, z efektem hover
- Brak `setTimeout(closeModal, X)` — tylko klik gracza zamyka

**Flagi:**
- `G._gymFirstEntry` (boolean) — `false` na start, `true` po pierwszym pokazaniu cinematic
- Persistence w save state

### CINEMATIC #2 — Pierwsze 100 formy / kondycji (SZCZYT FORMY / MISTRZ KONDYCJI)

**Trigger:** `G.forma >= 100` po raz pierwszy (`!_milestoneShown.forma100`) — analogicznie kondycja.

**Już opisane w sekcji "FORMA / KONDYCJA 100 — milestone cinematic + zwiększenie max statystyk"** wcześniej.

**Treść (przypomnienie):**
- 💪 SZCZYT FORMY OSIĄGNIĘTY!
- Animacja: gracz pozuje, błysk, motywujący tekst
- Info: "Twoje max zdrowie/energia/głód wzrosło o +10!"
- Można zamknąć przyciskiem lub (decyzja: krótki auto-close ~5s, bo to nagroda nie tutorial)
- Jednorazowy! Po pierwszym razie `_milestoneShown.forma100=true`

**Powiązanie z dynamicznym bonusem:**
- Cinematic = jednorazowy
- Bonus +10 max = cykliczny (computed z `getMaxStat` co klatka)
- Spadek poniżej 100 → bonus znika, cinematic NIE pokazuje się ponownie
- Powrót do 100 → bonus wraca, ale uruchamia się **CINEMATIC #3** (poniżej)

### CINEMATIC #3 — Powrót do szczytu po spadku (POWRÓT DO ŻYCIÓWKI)

**Trigger:** Gracz miał kiedyś forma=100 (`_milestoneShown.forma100=true`), spadła poniżej 100 (z decay), znowu osiąga 100.

**Logika:**
```js
function checkFormaPeak(){
  if(G.forma >= 100){
    if(!_milestoneShown.forma100){
      // PIERWSZY RAZ → cinematic #2 (SZCZYT FORMY)
      showMilestoneCinematic('SZCZYT FORMY OSIĄGNIĘTY!', '...');
      _milestoneShown.forma100 = true;
      G._formaWasAt100 = true;
    } else if(_milestoneShown.forma100 && !G._formaWasAt100){
      // POWRÓT po spadku → cinematic #3 (krótszy)
      showMilestoneCinematic('POWRÓT DO ŻYCIÓWKI! 💪', 'Wróciłeś do swojej szczytowej formy!');
      G._formaWasAt100 = true;
    }
  } else if(G.forma < 100 && G._formaWasAt100){
    G._formaWasAt100 = false; // armed for next return
  }
}
// wywoływana po każdym treningu i decay
```

**Warianty komunikatu (losowo, żeby nie było monotonii):**
- "💪 POWRÓT DO ŻYCIÓWKI! Wróciłeś do swojej szczytowej formy!"
- "🔥 ZNOWU NA SZCZYCIE! Twoja forma wróciła na maksimum!"
- "💪 COMEBACK! Wbiłeś znowu 100 formy. Pompa wróciła!"
- "🏆 NIGDY NIE ODPUSZCZAJ! Forma 100 — znowu jesteś na topie!"

**Ważne właściwości CINEMATIC #3:**
- **Krótszy** od pierwszej wersji (3-5 sekund auto-close, bo cykliczny)
- **Bez tutorialowych info** (gracz już wie)
- **Inny styl wizualny** — "comeback vibe" (np. zielone/złote akcenty zamiast białego błysku)
- Przycisk "DALEJ" + auto-close po 5s
- Może się powtarzać dowolną liczbę razy (każdy powrót do 100)

**Analogicznie dla kondycji:**
- "🏃 POWRÓT DO ŻYCIÓWKI! Twoja kondycja znowu na maksimum!"
- "🔥 COMEBACK KONDYCYJNY! Wbiłeś 100 kondycji znowu!"
- "🏃 ZNOWU SZYBKI! Kondycja 100 — biegniesz jak wiatr!"

### Stan flag

| Flaga | Typ | Opis |
|-------|-----|------|
| `G._gymFirstEntry` | bool | `false` na start, `true` po pokazaniu CINEMATIC #1 |
| `_milestoneShown.forma100` | bool | `false` na start, `true` po PIERWSZYM razie 100 formy (NIE resetuje się!) |
| `_milestoneShown.fitness100` | bool | analogicznie |
| `G._formaWasAt100` | bool | `true` gdy aktualnie >=100, `false` gdy spadło — używana do triggera CINEMATIC #3 |
| `G._fitnessWasAt100` | bool | analogicznie |

### Implementacja krok po kroku

1. **Dodać flagi do init G**:
   ```js
   G._gymFirstEntry = false;
   G._formaWasAt100 = false;
   G._fitnessWasAt100 = false;
   _milestoneShown = _milestoneShown || {};
   ```

2. **Hook na wejście do siłowni** (`enterGym()` lub `goToGym()`):
   ```js
   if(!G._gymFirstEntry){
     showGymTutorialCinematic();
     G._gymFirstEntry = true;
   }
   ```

3. **Funkcja `showGymTutorialCinematic()`** — modal z pełną treścią (sekcje powyżej)

4. **Funkcja `checkFormaPeak()` / `checkFitnessPeak()`** — wywoływane po każdej sesji siłowni I po decay z `nextPeriod()`

5. **Funkcje `showFormaPeakCinematic()` (#2)** i **`showFormaComebackCinematic()` (#3)** — różne wizualnie

6. **Persistence**: wszystkie flagi w save state

### Test akceptacyjny

- **CINEMATIC #1**: Nowa gra → wejście do siłowni → pełnoekranowy cinematic z 5 sekcjami info → BEZ auto-close → kliknięcie "ROZUMIEM" zamyka → drugie wejście do siłowni już bez cinematic
- **CINEMATIC #2**: Trening → forma osiąga 100 → 💪 SZCZYT FORMY → bonus +10 max → drugi raz osiągnięcia 100 (po spadku) NIE wyświetla #2
- **CINEMATIC #3**: Forma 100 → 4 dni bez treningu → spadek do 85 → trening → forma 100 znowu → 💪 POWRÓT DO ŻYCIÓWKI (krótki, inny styl) → spadek znowu → trening znowu → cinematic #3 znowu (cyklicznie)
- **Niezależność forma/kondycja**: cinematic dla formy nie wpływa na kondycję — osobne flagi
- **Pozycjonowanie**: cinematic w `document.body` (nie w `#wrap`), sprawdzić na 2560x1440

---

## DRZEWKO UMIEJĘTNOŚCI — pełna przebudowa (Power-ups + Ewolucje + nowe skille + epicki UI)

> Cytat użytkownika: "Potrzebujemy pracy nad drzewkiem umiejętności. Ulepsz całkowicie całą mechanikę. Zweryfikuj czy rzeczy typu odblokowanie faktycznie działają i czy bez odblokowania są faktycznie zablokowane. Ulepsz graficznie całą mechanikę, zrób żeby drzewko umiejętności wyglądało ładnie i epicko. To musi być na prawdę rozbudowana mechanika więcej dodaj do drzewka umiejętności sporo nowych, różnych umiejętności. Zrób żeby kondycja dawała 1% wolniejszego spadku energii/pkt. Pasywna regeneracja energii nie może być złamana, nie może być tak że gracz nie musi regenerować energii w ogóle, może być jakaś regeneracja energii, ale np w stylu, że co każde utracone 5 punktów energii regeneruje się 1 punkt czy coś w tym stylu. Drzewko umiejętności to ma być na prawdę rozbudowana, gruba mechanika. Ma tam gracz mieć na prawdę sporo fajnych, ciekawych możliwości. Popracuj nad tym żeby to wyglądało fajnie i żeby było więcej rzeczy i więcej możliwości. Dodaj może jakiś system 'ewolucji', że gdy gracz wymaksuje coś w drzewku umiejętności to może np. za pieniądze w grze ewoulować daną umiejętność. Podam przykład na podstawie którego możesz pracować i rozwijać dalej drzewko umiejętności, przykład: Gracz rozwija kondycja w drzewku umiejętności, za każdy dodany punkt umiejętności dostaje prędkość gracza, po wymaksowaniu ma system power up który np ma 3 etapy i kosztuje coś innego np. pieniądze w grze, każdy kolejny power up jest co raz droższy i daje więcej, np za 1 punkt power up gracz dostaje 1% wolniejszego spadku energii, za 2 punkt power up gracz dotaje 2% wolniejszego spadku energii, za 3 punkt power up dostaje 3% wolniejszego spadku energii i wtedy odblokowywuje ewolucje ktora jest najdrozsza (np. wymaga większej ilości pieniędzy + 1 pkt umiejętności) i ewloucja odblokowywuje pasywną regeneracje energii. To przykład na podstawie którego możesz rozwijać i udoskonalać drzewko umiejętności, chodzi mniej więcej o taką logikę i taki sens. Pamiętaj żeby nie przesadzać z wartościami żeby rzeczy nie były za bardzo OP i nie były 'złamane'."

### Aktualny stan (audyt + bugi)

**Aktualne 17 skills** w `SKILL_DEF` (linia 21701):

| Kategoria | Skills | Max |
|-----------|--------|-----|
| 💼 praca | pizza, supermarket, carwash, construction, kurier, zmywak | 3 |
| 🎤 kariera | raper(1!), youtuber, beatmaker, gamer, influencer, soundeng | 5 |
| ❤️ życie | kondycja(5), apetyt(3), odpornosc(3), charyzma(3) | 3-5 |

**🐛 BUGI WYKRYTE (do weryfikacji w implementacji):**

1. **Brak weryfikacji bonusów dla 8 skills** (grep nie znajduje użycia mnożnika):
   - `supermarket`, `carwash`, `construction`, `kurier`, `zmywak` — tylko **pizza** ma bonus +20%/pkt (linia 11983)
   - `beatmaker`, `gamer`, `influencer`, `soundeng` — odblokowanie działa (`G.careers.X.unlocked=true`), ale **brak bonusów +X%/lvl** dla poziomów 2-5
   - **Tylko youtuber** ma bonus (linia 7217, 8391: `+15%/pkt powyżej lv1`)
2. **Odporność -20%/pkt** (max 3 = -60%) — potencjalnie OP, do zbalansowania (rekomendacja: -10%/pkt = max -30%)
3. **Apetyt -8%/pkt** (max 3 = -24%) — OK
4. **Charyzma +10%/pkt** (max 3 = +30%) — OK
5. **Kondycja**: opis mówi "-8% spadku energii / pkt + prędkość gracza +5%/pkt. Lvl 5: pasywna regeneracja energii." — sprawdzić czy faktycznie działa (linia 7180, 7182) + użytkownik chce ZMIANY (zob. niżej)
6. **Brak realnych "lock"** — czy jeśli gracz nie ma `careers.beatmaker.unlocked` to faktycznie nie może wejść w karierę beatmakera? Audyt potrzebny.
7. **Niespójna mechanika opisu vs kod** — np. opis kondycji mówi o pasywnej regeneracji, ale kod może jej nie implementować

### NOWA ARCHITEKTURA: 3-poziomowy system

**Każda umiejętność ma 3 fazy progresji:**

```
[FAZA 1: SKILL POINTS]  →  [FAZA 2: POWER-UPS]  →  [FAZA 3: EVOLUTION]
   1 pkt umie/lvl              kupowane za $          1× za duże $$$ + 1 pkt
   max 3-5 lvl                 3 etapy                odblokowuje unique mechanic
```

**Faza 1 — SKILL POINTS (jak teraz):**
- Gracz dostaje 1 pkt umie/poziom postaci
- Wydaje na konkretną umiejętność (max 3-5 lvl)
- Każdy pkt = stały, niewielki bonus (np. kondycja: +5% prędkości /pkt)

**Faza 2 — POWER-UPS (NOWE!):**
- Po wymaksowaniu skill (np. kondycja 5/5) → **odblokowane Power-ups**
- 3 etapy power-up — każdy KUPOWANY ZA PIENIĄDZE (nie za pkt umie)
- Każdy etap droższy + daje więcej:
  - Power-up 1: tani, mały bonus
  - Power-up 2: 2× droższy, 2× większy bonus
  - Power-up 3: 4× droższy, 3× większy bonus

**Faza 3 — EVOLUTION (UNIQUE MECHANIC):**
- Po wykupieniu wszystkich 3 power-upów → **odblokowana Evolution**
- Najdroższa: kosztuje DUŻE pieniądze + **1 dodatkowy pkt umiejętności**
- Daje **unique mechanic** (np. pasywna regeneracja energii)
- 1× per skill (nie ma "level 2" ewolucji)

### Przykład: KONDYCJA (z cytatu użytkownika)

| Faza | Etap | Koszt | Bonus | Skumulowany |
|------|------|-------|-------|-------------|
| Skill | Lvl 1 | 1 pkt umie | +5% prędkości | 5% |
| Skill | Lvl 2 | 1 pkt umie | +5% prędkości | 10% |
| Skill | Lvl 3 | 1 pkt umie | +5% prędkości | 15% |
| Skill | Lvl 4 | 1 pkt umie | +5% prędkości | 20% |
| Skill | Lvl 5 (MAX) | 1 pkt umie | +5% prędkości | **25% prędkości** |
| Power-up 1 | — | **5 000 zł** | -1% spadku energii | -1% |
| Power-up 2 | — | **15 000 zł** | -2% spadku energii | -3% |
| Power-up 3 | — | **40 000 zł** | -3% spadku energii | **-6% spadku energii** |
| **EVOLUTION** | — | **150 000 zł + 1 pkt umie** | Pasywna regeneracja energii | "Co utracone 5 pkt energii → +1 pkt regeneracji" |

**Pasywna regeneracja (NIE OP, niezłamana):**
- Mechanika: gdy gracz traci energię (z każdej akcji), licznik `G._energyLostCounter += loss`
- Co osiągnie próg 5 → `G.energy += 1; G._energyLostCounter -= 5`
- Działa tylko gdy energia < max
- **NIE działa podczas snu** (sen ma osobny boost)
- Daje średnio 20% odzysku energii — gracz nadal MUSI jeść/spać, ale rzadziej

### Audyt i propozycje wartości dla wszystkich istniejących skills

**Praca dorywcza (max 3 pkt umie + 3 power-ups + 1 ewolucja):**

| Skill | Skill bonus | Power-up 1/2/3 | Evolution |
|-------|-------------|----------------|-----------|
| 🍕 Pizzaiolo | +15%/pkt zarobki (max +45%) | -10/20/30s czas dostawy | "VIP klient" — co 5 dostaw mega tip 200zł |
| 🛒 Kasjer | +15%/pkt zarobki | +1/2/3% szansa na napiwek | "Lojalność" — stały bonus 2x dziennie |
| 🚗 Myjarz | +15%/pkt zarobki | +5/10/15% szansa na drogie auta | "Detailing" — minigame premium auta |
| 🔨 Budowlaniec | +15%/pkt zarobki | -10/20/30% utrata energii | "Brygadzista" — kontrakty 2x większe |
| 🚲 Kurier | +15%/pkt zarobki | +5/10/15% prędkości w pracy | "Multi-zlecenie" — 2 paczki na raz |
| 🫧 Zmywak Pro | +15%/pkt zarobki | +1/2/3 dodatkowe naczynia/sesja | "Kuchnia" — odblokowuje karierę kucharza |

**Kariera (max 5 pkt umie + 3 power-ups + 1 ewolucja):**

| Skill | Skill bonus | Power-up 1/2/3 | Evolution |
|-------|-------------|----------------|-----------|
| 🎤 Raper | lvl 1 unlock + drzewko rapera | (Power-ups w drzewku rapera, nie tutaj) | "Legenda" — koncerty +50% |
| 📺 YouTuber | lvl 1 unlock, lv2-5: +15%/lvl views/AdSense | +5/10/15% szansa viral | "Algorithm Master" — 1 viral co tydzień gwarantowany |
| 🥁 Beatmaker | lvl 1 unlock, lv2-5: +15%/lvl sprzedaż bitów | +5/10/15% jakość bitów | "Producent" — kolaboracje z innymi |
| 🎮 Gamer | lvl 1 unlock, lv2-5: +15%/lvl turnieje/streaming | +1/2/3 dodatkowe turnieje/tydz | "E-sport Pro" — kontrakt zespołowy |
| 📱 Influencer | lvl 1 unlock, lv2-5: +15%/lvl posty/sponsorzy | +5/10/15% engagement | "Brand Owner" — własna marka |
| 🎙️ Sound Eng. | lvl 1 unlock, lv2-5: +15%/lvl projekty studyjne | +5/10/15% sesji/dzień | "Studio Owner" — pasywny dochód |

**Życie (mix max 3-5):**

| Skill | Skill bonus | Power-up 1/2/3 | Evolution |
|-------|-------------|----------------|-----------|
| ⚡ Kondycja | +5%/pkt prędkości (max 25%) | -1/-2/-3% spadku energii | **Pasywna regeneracja energii (1 pkt /5 utraconych)** |
| 🍔 Powolny apetyt | -8%/pkt głodu (max -24%) | +5/10/15% sytości z jedzenia | "Wege guru" — owoce/warzywa dają 2× sytość |
| ❤️ Odporność | -10%/pkt obrażeń (max -30%, **zbalansowane** z -20%) | +1/2/3% szansa na uniknięcie obrażeń | "Wytrzymały" — choroby trwają 50% krócej |
| ✨ Charyzma | +10%/pkt zarobki NPC (max +30%) | +1/2/3% szansa na bonus z NPC | "Magnetyzm" — NPC sami dają zaczepki |

### NOWE UMIEJĘTNOŚCI (do dodania, +20 nowych)

**🧠 KATEGORIA "INTELEKT"** (NOWA):
- 📚 **Czytanie** (max 3) — +5%/pkt XP z aktywności edukacyjnych | PU: +10/20/30% szybszy XP gain | Evo: "Mędrzec" — 1 darmowy pkt umie/poziom postaci
- 💡 **Kreatywność** (max 3) — +10%/pkt jakość projektów (bity, teksty, posty) | PU: szansa na "iskrę" (random bonus) | Evo: "Geniusz" — co 5 dni darmowy "nieoczekiwany hit"
- 🧮 **Logika** (max 3) — +5%/pkt szybsze minigry | PU: hint w minigrach | Evo: "Strateg" — odblokowuje minigame "Inwestycja"
- 🎯 **Skupienie** (max 3) — +5%/pkt mniej błędów w minigrach | PU: bullet time w trudnych | Evo: "Master Mind" — pomijasz tutorial minigier

**💰 KATEGORIA "EKONOMIA"** (NOWA):
- 💸 **Negocjacje** (max 3) — -5%/pkt ceny w sklepach | PU: +1/2/3% szansa na "deal of day" | Evo: "Master Trader" — własny sklep
- 📈 **Inwestycje** (max 3) — odblokowuje akcje/krypto z 5%/pkt boostem | PU: +5/10/15% mniej ryzyka | Evo: "Magnat" — pasywny dochód z portfela
- 🎰 **Hazard** (max 3) — +10%/pkt szansa wygranej w kasynie | PU: lepsze szanse w slotach | Evo: "Lucky Strike" — 1× /tydz darmowy spin "wins"
- 🤝 **Networking** (max 3) — +1 NPC kontakt/pkt | PU: szybciej rozwijasz znajomości | Evo: "Influencer Network" — wszystko 10% taniej z poleceń

**🎨 KATEGORIA "STYL & SCENA"** (NOWA):
- 💎 **Drip Master** (max 5) — +5%/pkt sława z outfitów | PU: dodatkowe akcesoria | Evo: "Trendsetter" — wszystkie ubrania 20% taniej
- 🎭 **Scena** (max 5) — +5%/pkt energia podczas występów | PU: większe trasy | Evo: "Showman" — koncerty trwają dłużej (więcej $)
- 🎤 **Flow** (max 5) — +5%/pkt jakość freestyle (jeśli nie raper) | PU: lepsze rymy | Evo: "Battle King" — wygrywasz battles auto
- 📸 **Foto** (max 3) — +5%/pkt jakość selfie | PU: filtry | Evo: "Visual Artist" — własny styl wizualny

**🏃 KATEGORIA "FIZYCZNE"** (rozbudowa istniejącej "życie"):
- 💪 **Siła** (max 5) — +5%/pkt forma z treningu | PU: nowe ćwiczenia | Evo: "Athletyk" — bonus permanentny do formy
- 🏃 **Bieg** (max 3) — +5%/pkt prędkość biegu | PU: sprint dłużej | Evo: "Maraton" — bezzmęczeniowy sprint
- 🧘 **Medytacja** (max 3) — +5%/pkt regeneracja w spoczynku | PU: szybsze sleep | Evo: "Wewnętrzny spokój" — zero stresu
- 🥗 **Dieta** (max 3) — +5%/pkt energia z jedzenia | PU: jedzenie daje też formę | Evo: "Nutricionist" — cooking 2x lepsze

### EPICKI UI — wygląd drzewka

**Aktualnie**: prosty grid 150px × N kafelków, brak hierarchii wizualnej, wszystko jednakowe.

**Nowy design (inspiracja: drzewka umiejętności z Path of Exile / Skyrim / Borderlands):**

1. **Layout drzewa**: zamiast grida — **graficzne drzewko z gałęziami** (linie SVG/Canvas łączące powiązane skills)
2. **Hub centralny** — postać gracza w środku, kategorie odchodzą promieniście
3. **Każdy skill = węzeł kafelka** z:
   - Ikoną emoji (większa, 36px)
   - Animowanym ringiem progresji (kolor wg poziomu: szary → niebieski → fioletowy → złoty)
   - 3 podświetlone "kropki" power-upów obok kafelka
   - Mała "korona" 👑 jeśli evolution wykupione
4. **Animacje**:
   - Hover na kafelku → świecenie + tooltip z pełnym opisem
   - Kupienie skill point → cząsteczki "+1" + dźwięk
   - Wykupienie evolution → krótki cinematic (czerwony/złoty błysk + tekst "EVOLUTION UNLOCKED")
5. **Kategorie z kolorami**:
   - 💼 Praca → niebieski
   - 🎤 Kariera → fioletowy
   - ❤️ Życie → zielony
   - 🧠 Intelekt → żółty
   - 💰 Ekonomia → złoty
   - 🎨 Styl & Scena → różowy
   - 🏃 Fizyczne → czerwony
6. **Zakładki kategorii** na górze — gracz przełącza między kategoriami (zamiast scrollować jeden long list)
7. **Pasek statystyk gracza** na dole — pokazuje aktywne bonusy (skumulowane efekty)
8. **Mini-podgląd ścieżki** — strzałki "co odblokujesz dalej" (np. po kondycji 5/5 strzałka do power-up 1)

### Implementacja techniczna

**Nowa struktura `SKILL_DEF`:**
```js
const SKILL_DEF = {
  kondycja: {
    label: 'Kondycja',
    cat: 'zycie',
    emoji: '⚡',
    desc: 'Prędkość i wytrzymałość',
    max: 5,
    skillBonus: (lvl) => `+${lvl*5}% prędkości`, // string display
    skillEffect: (lvl) => ({ speedMult: 1 + lvl*0.05 }), // object dla mechaniki
    powerUps: [
      { name: 'Energy Saver I', cost: 5000, bonus: '-1% spadku energii', effect: { energyDecayMult: 0.99 } },
      { name: 'Energy Saver II', cost: 15000, bonus: '-2% spadku energii (skum. -3%)', effect: { energyDecayMult: 0.97 } },
      { name: 'Energy Saver III', cost: 40000, bonus: '-3% spadku energii (skum. -6%)', effect: { energyDecayMult: 0.94 } },
    ],
    evolution: {
      name: 'Pasywna regeneracja',
      cost: 150000,
      skillPointCost: 1,
      effect: { passiveRegen: { ratio: 5 } }, // 1 pkt na 5 utraconych
      description: 'Co utracone 5 pkt energii → +1 pkt regeneracji'
    }
  },
  // ... reszta skills
};
```

**Nowa struktura `G.skills`:**
```js
G.skills = {
  kondycja: {
    lvl: 5,           // skill level (max wg def.max)
    powerUps: 3,      // 0-3
    evolution: true,  // false/true
  },
  // ...
};
G.skillPoints = X;
```
*Migracja*: stare `G.skills.kondycja=3` (number) → `G.skills.kondycja={lvl:3,powerUps:0,evolution:false}`

**Funkcje pomocnicze:**
```js
function getSkillTotalBonus(key){
  const skl = G.skills[key]; const def = SKILL_DEF[key];
  if(!skl||!def) return {};
  let total = def.skillEffect(skl.lvl);
  for(let i=0; i<skl.powerUps; i++){
    Object.assign(total, def.powerUps[i].effect);
  }
  if(skl.evolution){
    Object.assign(total, def.evolution.effect);
  }
  return total;
}
```

**Pasywna regeneracja energii (kondycja evolution):**
```js
// W loop'ie gry, przy każdej zmianie energii:
function modEnergy(delta){
  if(delta < 0){
    G.energy += delta;
    const evo = G.skills.kondycja?.evolution;
    if(evo){
      G._energyLostCounter = (G._energyLostCounter||0) + Math.abs(delta);
      while(G._energyLostCounter >= 5 && G.energy < getMaxStat('energy')){
        G.energy += 1;
        G._energyLostCounter -= 5;
      }
    }
  } else {
    G.energy = Math.min(getMaxStat('energy'), G.energy + delta);
  }
}
```

### Audyt blokad ("czy odblokowanie faktycznie działa")

Lista do weryfikacji w implementacji:
- [ ] **Kariera Beatmaker** — czy bez `careers.beatmaker.unlocked` faktycznie nie da się wejść w karierę?
- [ ] **Kariera Gamer** — to samo
- [ ] **Kariera Influencer** — to samo
- [ ] **Kariera Sound Eng.** — to samo
- [ ] **Kariera YouTuber** — to samo
- [ ] **Kariera Raper** — to samo + drzewko rapera ma osobne pkty (`G.careers.raper.skillPts`)
- [ ] **Bonusy +%** dla supermarket/carwash/construction/kurier/zmywak — DODAĆ kod (analogicznie do pizza)
- [ ] **Bonusy +%** dla beatmaker/gamer/influencer/soundeng — DODAĆ kod (analogicznie do youtuber)
- [ ] **Wszystkie nowe skills** muszą mieć faktyczne efekty w kodzie (nie tylko opis)

### Balansowanie (NIE OP, NIE złamane)

**Maksymalne kumulatywne wartości po pełnym wymaksowaniu:**

| Stat | Max bonus |
|------|-----------|
| Prędkość gracza | +25% (kondycja 5) + 5-15% z mocnego sprintu (osobne) |
| Energia decay | -6% z power-upów + ~10% z formy=100 = max -16% |
| Głód decay | -24% (apetyt 3) + power-ups +10/20/30% sytości (z innej strony) |
| Health decay | -30% (odpornosc 3 zbalansowane z -60% obecnych) |
| Zarobki praca | +45% per praca (15%/pkt × 3) |
| Pasywna regen energii | 20% odzysku (1/5) — gracz NADAL musi jeść/spać |

**Kluczowa zasada balansu:**
- Pełne wymax (+ wszystkie ewolucje) wymaga DUŻO czasu i $$$
- Każda ewolucja = ~150 000-300 000 zł (wymaga tygodni gameplay)
- Power-ups + Evolution kosztują pieniądze, nie tylko pkt umie → pieniądze są ograniczone
- Gracz musi WYBRAĆ na czym się skupić (nie wymaksuje wszystkiego)

### Test akceptacyjny

- **Audyt blokad**: 6 karier + 8 prac — sprawdzić że bez skill point faktycznie nic nie działa
- **Faza 1 (skill points)**: kondycja 5/5 → +25% prędkości faktycznie widoczne w grze
- **Faza 2 (power-ups)**: po wymax kondycji widać sekcję "Power-ups" z 3 etapami → każdy kupowalny za $ → bonusy działają
- **Faza 3 (evolution)**: po power-ups 3/3 widać sekcję "Evolution" → kosztuje 150k + 1 pkt → pasywna regeneracja faktycznie odzyskuje 1 energii co 5 utraconych
- **NIE OP**: po pełnym wymax kondycji gracz nadal musi jeść i spać (regen tylko 20%)
- **UI**: epicki wygląd, animacje, kategorie z kolorami, zakładki, ścieżki ewolucji widoczne
- **20 nowych skills**: wszystkie kategorie (Intelekt, Ekonomia, Styl, Fizyczne) działają
- **Migracja saves**: stary save z `G.skills.kondycja=3` → nowy format `{lvl:3,powerUps:0,evolution:false}` bez utraty progresu

---

## CINEMATIC MILESTONE — blokada ruchu + zabezpieczenie przed freeze

> Cytat użytkownika: "Dodaj żeby podczas cinematic milestone gracz nie mógł chodzić, bo aktualnie słychać kroki gdy gracz trzyma jakikolwiek przycisk chodzenia. Dopilnuj żeby nie było bugu z freeze, że np. cynematics milestone się skończy/zamknie/gracz wyłączy i postać nie będzie mogła chodzić."

### Aktualny stan (bug)

**`updatePlayer()` w linii 5341** ma 7 strażników wstrzymujących ruch:
```js
if(_paused) return;
if(overlayOpen()||phoneOpen()||mgOpen()) return;
if(npcDlgOpen()) return;
if(G._resting) return;
const sleepOv=document.getElementById('sleep-overlay');
if(sleepOv&&sleepOv.classList.contains('on')) return;
```

**🐛 BUG: BRAK strażnika dla cinematics milestone!**
- `showMilestoneCinematic()` (linia 15778) tworzy overlay `#milestone-cinematic` z z-index:9998
- Overlay tylko wizualnie zakrywa ekran — NIE pauzuje gry, NIE blokuje ruchu
- Efekt: gracz trzymając A/D/W/S podczas cinematic nadal porusza postacią → słychać `sfxStep()` co 28 klatek (linia 5403)
- `_paused` flag NIE jest ustawiana przy showMilestoneCinematic

### Zagrożenia "freeze" do uniknięcia

Bug freeze może wystąpić w 4 scenariuszach:

1. **Cinematic auto-close + setTimeout zostaje "wiszący"**: jeśli ustawimy flag `_cinematicActive=true`, ale finish() nie wyczyści flagi → gracz na zawsze zablokowany
2. **Klik gracza zamyka cinematic, ale klawisz K[] zostaje "down"**: gracz puści klawisz dopiero później, ale to OK (nie freeze, tylko jeden krok extra)
3. **Cinematic crashuje (błąd JS w setTimeout/finish)**: finish() nie wykonuje się → flaga zostaje na zawsze
4. **Drugi cinematic pokazuje się gdy pierwszy jeszcze trwa**: pierwszy finish() ustawia flagę false, drugi cinematic właśnie startuje → drugi działa bez blokady (rzadkie ale możliwe)

### Rozwiązanie: STRAŻNIK + DEFENSYWNY CLEANUP

**1. Dodać 8. strażnika w `updatePlayer()`:**
```js
function updatePlayer(){
  if(_paused) return;
  if(overlayOpen()||phoneOpen()||mgOpen()) return;
  if(npcDlgOpen()) return;
  if(G._resting) return;
  const sleepOv=document.getElementById('sleep-overlay');
  if(sleepOv&&sleepOv.classList.contains('on')) return;
  // NOWY STRAŻNIK: cinematic milestone aktywny
  if(document.getElementById('milestone-cinematic')) return;
  // ... reszta funkcji
}
```

**Dlaczego DOM check zamiast flagi `_cinematicActive`?**
- ✅ DOM check jest **samoresetujący się** — gdy element jest usunięty, blokada znika automatycznie
- ✅ NIE ma ryzyka że flaga "zawiesi się" w stanie true (główne źródło bugów freeze)
- ✅ Jest agnostyczny względem implementacji finish() — działa nawet jeśli finish() crashuje
- ✅ Nie wymaga sprzątania w cleanup

**2. Defensywne sprawdzenie w `finish()` (showMilestoneCinematic, linia 15816):**

Aktualny kod:
```js
let closed=false;
const finish=()=>{
  if(closed) return;closed=true;
  ov.style.transition='opacity .4s';ov.style.opacity='0';
  setTimeout(()=>{ov.remove();if(typeof o.onDone==='function')o.onDone();},400);
};
```

**Wzmocnienie**:
```js
let closed=false;
const finish=()=>{
  if(closed) return;closed=true;
  try {
    ov.style.transition='opacity .4s';ov.style.opacity='0';
  } catch(e) {}
  setTimeout(()=>{
    try { ov.remove(); } catch(e) {}
    // Defensywnie usuń wszystkie ewentualne pozostałe instancje milestone-cinematic
    document.querySelectorAll('#milestone-cinematic').forEach(el=>el.remove());
    if(typeof o.onDone==='function') {
      try { o.onDone(); } catch(e) { console.error('milestone onDone:', e); }
    }
  },400);
};
// Zabezpieczenie: maksymalny czas życia cinematic = duration + 5s
setTimeout(()=>{
  if(document.getElementById('milestone-cinematic')===ov){
    console.warn('milestone-cinematic safety cleanup');
    ov.remove();
  }
}, o.duration + 5000);
```

**3. Usunąć stale instancje przy NOWYM cinematic** (już jest w linii 15784: `document.getElementById('milestone-cinematic')?.remove();`):
- Wzmocnić: `document.querySelectorAll('#milestone-cinematic').forEach(el=>el.remove());` (na wypadek duplikatów)

**4. Reset state klawiszy po zamknięciu cinematic** (opcjonalne, do rozważenia):
- Po `finish()` można wyczyścić `K = {}` żeby gracz nie ruszył się "automatycznie" jeśli trzymał klawisz
- ALE: to może być zaskakujące dla gracza (musi puścić i znowu nacisnąć)
- **Decyzja: NIE czyścić K[]** — gracz nadal trzyma klawisz, ruch wraca naturalnie po finish

### Testy zabezpieczające przed freeze

**Test 1 — normalna ścieżka:**
- Gracz triggeruje cinematic (np. forma 100)
- Trzyma W → kroki NIE słychać, postać NIE rusza się
- Klika "POMIŃ" lub czeka 4s → cinematic znika
- Trzymając W → ruch wraca natychmiast, kroki słychać

**Test 2 — zamknięcie klikiem (nie POMIŃ):**
- Cinematic aktywny → gracz klika gdziekolwiek na ekranie → finish() → `#milestone-cinematic` znika
- Ruch wraca

**Test 3 — symulowany crash (chaos test):**
- W konsoli: `setTimeout(()=>{throw new Error('test')}, 100)` po showMilestoneCinematic
- Cinematic powinien się zamknąć po `duration + 5s` (safety cleanup)
- Ruch wraca

**Test 4 — podwójny cinematic:**
- W konsoli: 2× `showMilestoneCinematic({duration:5000})` w odstępie 100ms
- Pierwsza instancja od razu usuwana (linia 15784), pokazuje się tylko druga
- Po jej zamknięciu: ruch wraca

**Test 5 — Esc podczas cinematic:**
- Trigger cinematic → Esc → cinematic aktywny + togglePause aktywny? Konflikt?
- Decyzja: cinematic ignoruje Esc (nie używa Esc do zamykania), Esc tylko do pause game
- Sprawdzić że oba mogą koexistować bez bugu

**Test 6 — race condition save/load:**
- Cinematic aktywny → save → load → `#milestone-cinematic` nie istnieje już (został zniszczony przy reload) → ruch działa

### Kluczowa zasada DOM-first

Używamy **`document.getElementById('milestone-cinematic')`** jako "single source of truth":
- Element istnieje = cinematic aktywny = brak ruchu
- Element nie istnieje = brak cinematic = ruch działa
- Nie ma osobnej flagi do synchronizacji
- Każdy cleanup (zamierzony lub awaryjny) automatycznie odblokuje ruch

**Analogicznie dla cinematic siłowni** (sekcja CINEMATIC SIŁOWNIA wcześniej):
- Strażnik powinien sprawdzać też `document.getElementById('gym-tutorial-cinematic')`
- LUB: zrobić generic strażnik dla wszystkich cinematicow:
```js
if(document.querySelector('[id$="-cinematic"]')) return;
```
- Wymaga konwencji nazewnictwa: każdy cinematic ma id kończące się na `-cinematic`

### Test akceptacyjny

- **Cinematic + W trzymany**: postać nie rusza się, kroki nie słychać
- **Cinematic + WSAD trzymany**: żaden kierunek nie działa
- **Po zamknięciu**: gracz ma kontrolę natychmiast (bez opóźnienia)
- **Crash test**: nawet jeśli finish() crashuje → po `duration + 5s` ruch wraca
- **Podwójny cinematic**: nigdy 2 cinematici jednocześnie, ruch zablokowany dopóki jakikolwiek aktywny
- **Wszystkie cinematici** (forma100, kondycja100, level X, gym tutorial, comeback) — wszystkie blokują ruch
- **Gym tutorial (NIE auto-close)**: gracz nie rusza się przez cały czas dopóki nie kliknie "ROZUMIEM"

---
