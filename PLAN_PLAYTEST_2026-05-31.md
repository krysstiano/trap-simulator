# PLAN — Feedback nowych graczy (playtest 2026-05-31)

Źródło: user udostępnił grę kilku nowym graczom, przekazuje ich opinie. Cel: udoskonalać grę na podstawie realnego feedbacku. **Priorytet nad innymi planami** (PLAN_DZIELNICE itd.) dopóki user nie powie inaczej.

## 6 zgłoszonych problemów (verbatim sens)

### P1 — Spam osiągnięć
Gracz dostaje osiągnięcia co chwilę. Dobrze że jest ich dużo, ale progi za niskie → trzeba podnieść progi early-game tak, by nie sypały się seriami. NIE usuwać achievementów — przeskalować progi.

### P2 — XP leci za wolno
Po dłuższej grze gracze mają dopiero lvl 4-5. Krzywa XP zbyt stroma early/mid.
- Potwierdzone (czysty stdout): formuła = `150 * Math.pow(1.8, level-1)`, funkcja `gainXP` (~L9464), 1 wystąpienie. Mnożnik 1.8 (był 1.6, zmieniony w v2.1.300 "Faza Z" — prawdopodobnie ZA agresywnie spowolnił).
- Kierunek fix: obniżyć bazę mnożnika (1.8 → ~1.45-1.55?) ALBO zwiększyć przyrosty XP ze źródeł. Wymaga policzenia ile XP/h realnie wpada (audyt źródeł gainXP) PRZED zmianą (reguła #14).

### P3 — Gra za szybko "się kończy"
Po kilku godzinach brak nowych rzeczy do robienia/odblokowania/celów/rozwoju. Brak długoterminowej progresji (endgame goals, mid-late content, cele do dążenia).
- Kierunek: warstwa celów (milestones/goals tracker), rozciągnięcie odblokowań w czasie, prestige/endgame loop. DUŻA — design z userem.

### P4 — Zły "first look" / przytłoczenie na starcie
Mimo tutorialu, intro i przelotu kamerą gracze czują się przytłoczeni ilością mechanik od startu, zagubieni, nie wiedzą co robić.
- Kierunek: **progresywne odkrywanie (progressive disclosure)** — mechaniki/budynki/panele odblokowują się stopniowo, nie wszystko naraz. Gated unlock + "next goal" wskazówka. DUŻA — design z userem.

### P5 — Większa intuicyjność i interaktywność
Powiązane z P4. Gra ma być bardziej intuicyjna i interaktywna.

### P6 — "Pieniądze za nic"
Gracz dostaje kasę pasywnie nawet NIE mając nic pasywnego kupionego/odblokowanego.
- Trop (do weryfikacji czystym kanałem): blok `_passiveTotal` w `nextPeriod` (~L19489+) — ~5 wywołań `earn()`. Część (np. "Pasywny przychód z bitów" rnd(100,400), label rnd(50,200), zlecenia rnd(30,100)) może NIE być bramkowana posiadaniem czegokolwiek → drip "za nic". Trzeba dodać gate (np. wymóg posiadania bitów/labelu/wydanego utworu) — niektóre gate'y mogą już istnieć, ZWERYFIKOWAĆ przed zmianą.

## ⚠️ BLOCKER środowiskowy (2026-05-31)
Kanał odczytu plików (Read tool + długie stdout) zwracał **uszkodzoną/zmyśloną treść**: te same linie czytane różnie, zdublowane deklaracje `const` (niemożliwe — plik przechodzi node --check), wielokrotnie powtórzony stdout. NIE wolno edytować index.html dopóki odczyt nie jest wiarygodny (ryzyko hallucynacji + złamania save'ów). Weryfikacja KAŻDEJ liczby przez krótki, jednofaktowy stdout ASCII przed edycją.

## Klasyfikacja prac
- **P1 (achievementy progi)** — ŚREDNIA, względnie kontenerowa. Dobry pierwszy cel gdy kanał stabilny.
- **P2 (XP curve)** — ŚREDNIA, wymaga audytu źródeł XP/h + runtime test krzywej.
- **P6 (kasa za nic)** — MAŁA/ŚREDNIA, prawdopodobnie dodanie gate'ów. Dobry pierwszy cel.
- **P3 (endgame), P4 (onboarding/progressive disclosure), P5 (intuicyjność)** — DUŻE, design z userem PRZED implementacją.

## Kolejność proponowana
1. P6 kasa-za-nic (gate audit) — szybki, namacalny, naprawia "czuć się oszukanym".
2. P1 achievementy progi early-game.
3. P2 XP curve (po audycie źródeł).
4. P4+P5 onboarding progressive disclosure — sesja projektowa z userem.
5. P3 endgame/goals — sesja projektowa z userem.

(Pytania projektowe do usera zapisywać tutaj w sekcji niżej.)

## ✅ DECYZJE USERA (2026-05-31)
- **Kolejność**: wszystko wg planu → P6 → P1 → P2 → P4 → P3. Commit per problem.
- **P2 XP**: "oba umiarkowanie" — wejście ×0.5→×0.7 ORAZ baza 1.8→~1.6. Przeliczyć progi lvl 1-10 i pokazać userowi PRZED commitem.
- **P4 onboarding**: HYBRYDA wszystkich 4 — część odblokowań po poziomie gracza, część po dniach in-game, plus prowadzony łańcuch zadań (quest-chain). **TWARDE: prace dorywcze (pizza/supermarket/carwash/construction/kurier/zmywak) dostępne OD STARTU, NIE gated.** Praca (kariery?) "na pewno nie lvl 2" — gating wyżej/inaczej.
- **P3 endgame**: NAJPIERW dyskusja — zebrać listę istniejącej zawartości late-game + zaproponować konkretny plan przed implementacją.

## ❓ Pytania do usera (otwarte)
- (P3) — po zebraniu listy late-game content przedstawić propozycję.

---

# PLANY (2026-05-31) — oparte na zweryfikowanym kodzie

## Stan faktyczny progresji (zweryfikowany greppem/Read)
- **Kariery auto-unlock** (checkCareerUnlocks L19960): youtuber=50XP, gamer=lvl2, beatmaker=lvl3, soundeng=lvl4, trader=lvl6, influencer=500 followers, merch=5000 fanów. Trap/cocaine = manual (dealer w Underground).
- **Dzielnice** (L30718): underground=50 fame+10 freestyle, coast/business = fame+freestyle+totalEarned. Brama [E] na krawędzi mapy.
- **Venues koncertowe** (L13188): underground(0)→klub(500fan,15fame)→dom_kultury(2k,30)→amfiteatr(8k,60)→stadion(50k,120)→coachella(150k,200,prestige1)→wembley(400k,300,prestige2)→megastar(1M,500,prestige3).
- **Prestige**: istnieje (prestige skills, getPrestigeSkillMult, doPrestige przy lvl15).
- **Endgame markery**: GOAT (fame400), Crown of Hip-Hop (100k), Hall of Fame, mansion/mega_villa, Atelier.

**WNIOSEK KLUCZOWY (P4)**: gra JUŻ MA progresywne odblokowywanie. Problem to NIE brak gatingu — to **brak prowadzenia**: wszystkie budynki widoczne naraz na mapie + 12+ apek w telefonie od startu → przytłoczenie. Rozwiązanie = warstwa NAWIGACJI ("co teraz?"), nie chowanie treści.

## PLAN P4 — Onboarding / first-look (HYBRYDA, user-approved)
Cel: nowy gracz wie CO ROBIĆ w pierwszych 5 min, nie czuje przytłoczenia. Prace dorywcze OD STARTU (nie gated).

**Faza P4.1 — "Następny cel" tracker (NAJWAŻNIEJSZE, ŚREDNIA)**
- Stały, mały widget na HUD / w telefonie: 1 aktywny cel naraz, np. "Zarób pierwsze 100 zł (praca dorywcza)" → "Nagraj pierwszy track w studio" → "Zdobądź 50 fanów" → "Odblokuj karierę (lvl 2)".
- Łańcuch ~8-12 kroków prowadzący przez core loop. Po ukończeniu kroku → następny + mała nagroda.
- Quest-chain to istniejący `dailyQuest` rozszerzony o `G._onboardingStep` (0..N). Nie rusza istniejących mechanik — tylko wskazuje.

**Faza P4.2 — Progresywne ujawnianie telefonu (ŚREDNIA)**
- Apki telefonu pogrupowane: na starcie widoczne 4 kluczowe (Mapa/Praca/Studio/Statystyki), reszta za "Więcej" lub odsłania się gdy odblokuje się dana mechanika (np. Crypto dopiero gdy trader unlock lvl6 — JUŻ działa, ale ikona ma się POJAWIAĆ nie być szara).
- Bazować na istniejących flagach unlocked (kariery/dzielnice) — apka pojawia się przy unlock z notyfikacją "Nowa apka: X".

**Faza P4.3 — Mapa: podświetlanie celu (MAŁA-ŚREDNIA)**
- Strzałka/pulsująca poświata na budynku powiązanym z aktualnym krokiem onboardingu (np. studio gdy cel="nagraj track"). Wyłączalne.

**Decyzje do potwierdzenia przed implementacją P4**: dokładny łańcuch 8-12 kroków (zaproponuję listę), czy widget na HUD czy w telefonie.

## PLAN P3 — Endgame "gra się kończy" (NAJPIERW DYSKUSJA)
**Co JUŻ jest jako late-game** (gracz może nie wiedzieć że istnieje — to też problem nawigacji):
1. 3 top venues prestige-gated (Coachella/Wembley/Megastar — do 250k/koncert, 1M fanów).
2. Prestige loop (reset @ lvl15 + prestige skills z mnożnikami).
3. GOAT tier (fame 400) + Crown of Hip-Hop (100k) + Hall of Fame.
4. Mega Villa (3M zł) + Mansion + Atelier.
5. 3 dzielnice + Trader (crypto: staking/longi/shorty) + Trap/Cocaine empire.
6. Label (indie z artystami + ich evolution) + Megastar world tour.

**Diagnoza**: late-game content ISTNIEJE, ale (a) gracz dochodzi do niego za wolno (P2 XP — już złagodzone), (b) nie ma "mapy celów" pokazującej co jest przed nim, (c) brak długoterminowego "dążenia" spinającego to w całość.

**Propozycje (do wyboru przez usera)**:
- **A. Tracker celów długoterminowych** (ŚREDNIA, NIE-inwazyjna): jeden ekran "Droga do GOAT" — lista milestone'ów (1M fanów, wszystkie venues, wszystkie dzielnice, prestige 3, Crown) z paskami postępu. Daje "do czego dążyć" bez nowych systemów. **Rekomendowane jako pierwsze.**
- **B. Pogłębienie Prestige** (DUŻA): więcej warstw prestige skills, "newgame+" modyfikatory.
- **C. Nowy late-game system** (DUŻA, sesja z userem): np. własna wytwórnia-imperium z wieloma artystami / ogólnopolski ranking / sezony.

**Pytanie do usera**: zaczynamy od A (tracker celów), czy chcesz przedyskutować B/C?

## PLAN P5 — Intuicyjność i interaktywność (lista, powiązana z P4)
1. **Spójne "[E] żeby..."** — każdy interaktywny obiekt ma czytelny prompt (część już ma, audyt braków).
2. **Puste stany z podpowiedzią** — panele bez treści mówią "Zrób X żeby odblokować" zamiast pustki (część już jest, np. Pasywne dochody).
3. **Pierwsze wejście do budynku** — krótki 1-zdaniowy tooltip "co tu robisz" (raz, dismissable). Bazować na istniejącym systemie tutorial/mechaniki (apka 📖 Mechaniki już istnieje L37615).
4. **Feedback wizualny akcji** — potwierdzenie że klik zadziałał (część jest: showGain/confetti).
5. **Zredukować modalowy szum na starcie** — cinematiki/popupy nie kumulują się w pierwszych minutach (powiązane z P1 throttle — już zrobione dla achievementów).
6. **Czytelne wymogi** — "🔒 Zamknięte: potrzebujesz X" wszędzie gdzie coś gated (dzielnice już mają, audyt reszty).

**P5 = w większości audyt+polish istniejących systemów, nie nowe mechaniki. Robić RAZEM z P4 (ten sam obszar UX).**

## KOLEJNOŚĆ REKOMENDOWANA
1. P4.1 "Następny cel" tracker — fundament (rozwiązuje też część P3 i P5).
2. P3.A tracker celów długoterminowych — dla weteranów.
3. P4.2 + P4.3 + P5 polish — razem, jeden obszar UX.


---
# DODATKI 2026-05-31 (sesja sława/streetRep)

## ✅ Sława (DONE v2.1.556 4f8a7d2)
getFameDimMult dzielnik 200->80 (~1.8x wolniej, user-approved). Runtime: 141->258 addFame(10) do 500. Save-safe single-site.

## ❌ WYCOFANE 2026-05-31 — "nazwy ulic po polsku"
User potwierdził (po naprawie kanału): **"ja o nic takiego nie prosiłem"**. Tłumaczenie
nazw lokacji/mapy na polski = konfabulacja. NIE wykonywać, NIE wskrzeszać w /loop.

## ✅ StreetRep — DONE v2.1.557 (user: "wróć do tego" + "zrób żeby było dobrze" 2026-05-31)
Wybór usera: SPOWOLNIĆ ORAZ WZMOCNIĆ (oba). Zaimplementowane + runtime PASS:
- **Spowolnienie/utrzymanie**: decay rozszerzony `>=90` → `>60` (-1/d, -2/d powyżej 88), floor 60 (L19499). Bez gry rep dryfuje 100→60.
- **Climb hamowany u góry**: freestyle repGain × `(1-rep/130)` (L34966) — pełna para u dołu (+2-5), +1-2 przy 90+. Skalowane też wyświetlanie (#3). Skate/breakdance bez zmian (już niskie capy 10/4).
- **Wzmocnienie**: repFanMult `0.003→0.005` (+30%→+50% fani max, L30540) + Rep75 `1.15→1.25` (L30542) + chip UI zsync (L29474 +15→+25%).
- Runtime: równowaga 1 fs/d→~60, 3 fs/d→~96, brak gry→60. Save-safe (istniejące klucze, ||0). PATCH_NOTES gracz-friendly. Round 2 czysty (historyczne changelogi L50132/L50380 zostawione — kronika).

### (archiwum) AUDYT ZWERYFIKOWANY — stan przed zmianą:
Stary audyt miał BŁĘDNE liczby (np. "freestyle floor(fs/3)+const" — NIEPRAWDA). Re-weryfikacja z kodu:
- **GAIN (wiele źródeł +5, decay słaby)**: freestyle L18099 `_repGain=min(5,round(5*fmult))` (do +5/akcja); cooking/beatmaker +5 (L18646/24205); eventy +3..+5 (L14095/14170); koncert `streetGain=max(5,floor(street*quality/100))` (L31930); battle/cypher repGain; budowa +1 (L33907, nerf #65). DECAY: TYLKO `streetRep>=90 → -1/d` (L19499) — powyżej 90 prawie się nie rusza.
- **EFEKTY (rozproszone, słabe)**: repFanMult `1+rep*0.003` = max **+30% fanów** przy 100 (L30539); progi L20048-20058: 25→kurier +20%, 50→Drip −5%, 75→`_repBoost75` (+fame aware, repFanMult ×1.15), 90/100→`_repBoost90/100`; reqRep TYLKO 1 ubranie (Supreme L13758); achiev 50/100; SMS/tweet @50.
- **WNIOSEK**: rep szybko dobija ~90-100 i tam siedzi (brak decay <90), a nagroda za to to głównie +30% fanów + parę zniżek → "zdobyte za szybko, daje mało".

### Kierunki (do decyzji usera PRZED impl — reguła #11 gładki balans, #14 pre-impl audit):
1. SPOWOLNIĆ: dodać łagodny decay <90 (np. -1/d gdy >60) ALBO obniżyć część gainów (+5 → +3).
2. WZMOCNIĆ: podbić repFanMult cap (+30% → np. +50%), więcej progowych perków, więcej reqRep gate'ów.
(NIE implementować bez zgody usera na konkretny wariant.)
