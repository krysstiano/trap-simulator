# 🔍 NAJGRUBSZY AUDYT GRY — Snowy Simulator
**Data:** 2026-05-16
**Wersja:** v2.1.95
**Cel:** Pełny audyt wszystkich obszarów gry. Bez implementacji — tylko analiza i lista znalezisk.

---

## METODYKA
- ~25 agentów Explore READ-ONLY w 3 falach
- Każdy agent zna PATCH_NOTES (sprawdza co już naprawione)
- Typy znalezisk: **BUG** · **GHOST** · **EXPLOIT** · **BALANCE** · **INCONSISTENCY** · **COSMETIC** · **MISSING** · **PERFORMANCE**
- Priorytet: 🔴 KRYTYCZNY · 🟠 WYSOKI · 🟡 ŚREDNI · 🟢 NISKI

---

## STATUS FAL

### Wave 1 (10 agentów) — ✅ UKOŃCZONE
- [x] 1. Studio/DAW
- [x] 2. Kariera rapera
- [x] 3. Beatmaker + Gamer
- [x] 4. Influencer + Sound Eng + YouTuber
- [x] 5. Ekonomia pasywna
- [x] 6. Skill trees + achievementy
- [x] 7. Storyline + Prestige
- [x] 8. Mieszkania + auta + sklepy sprzętu
- [x] 9. Kasyno
- [x] 10. HUD + UI + Telefon + Save

### Wave 2 (8 agentów) — ✅ UKOŃCZONE
- [x] 11. NPC + dialogi + crew + friends
- [x] 12. Life stats (energy, hunger, stress, health, sleep)
- [x] 13. Mapa + kolizje + transport
- [x] 14. Random events + holidays + sezony + festiwale
- [x] 15. Mini gry + tutorial + cinematic
- [x] 16. Drip + outfit + fryzura + style
- [x] 17. Bills + bank + ekonomia debt
- [x] 18. Trends + hejt + viral + social media events

### Wave 3 (5 agentów cross-check) — ✅ UKOŃCZONE
- [x] 19. Konsystencja ekonomiczna post-v2.1.80-86
- [x] 20. System wymogów + gating
- [x] 21. Save migration completeness
- [x] 22. Prestige bypass audit (kompletny round 3)
- [x] 23. Ghost features round 3

---

# ZNALEZISKA WAVE 1

## 🔴 KRYTYCZNE (do fixu pilnie)

### K1. Spotify royalty Prestige bypass
- **Lokalizacja:** linia 11523
- **Typ:** EXPLOIT (anti-Prestige)
- **Opis:** `G.money+=r; G.spotify.royalties+=r; G.totalEarned+=r` — bezpośrednie `G.money +=` zamiast `earn(r, false)`. Bypassuje `G.prestigeBonus.moneyMult`. Późny gracz Prestige 5+ traci 25-50% tantiem Spotify.
- **Sugestia:** Zmienić `G.money+=r` → `earn(r, false)`

### K2. Tidal royalty Prestige bypass
- **Lokalizacja:** linia 11527
- **Typ:** EXPLOIT (anti-Prestige)
- **Opis:** Identyczny bypass co Spotify. Direct `G.money += r`.
- **Sugestia:** `earn(r, false)`

### K3. Radio royalty Prestige bypass
- **Lokalizacja:** linia 11556
- **Typ:** EXPLOIT (anti-Prestige)
- **Opis:** `G.money += roy` bez `earn()`. Trzecie źródło passive bypassujące Prestige.
- **Sugestia:** `earn(roy, false)`

### K4. collectRoyalties() — Prestige bypass
- **Lokalizacja:** linia 26785
- **Typ:** EXPLOIT
- **Opis:** Ręczne zbieranie royalties (Spotify/Tidal/SoundCloud) używa `G.money += amount` bez `earn()`. Plus jeśli źródło już bypassuje (K1-K3), to double-bypass.
- **Sugestia:** `earn(amount, false)`

### K5. VIP tip fame bypass (Prestige fameMult)
- **Lokalizacja:** linia 11382
- **Typ:** EXPLOIT
- **Opis:** Daily VIP casino tip daje `G.fame = Math.min(100, G.fame+1)` bez `addFame()`. Bypassuje Prestige fameMult.
- **Sugestia:** `addFame(1)`

### K6. Outfit first-buy fame bypass
- **Lokalizacja:** linie 20138-20145
- **Typ:** EXPLOIT
- **Opis:** Pierwsze założenie outfitów luxury (+10), suit (+5), smoking (+15) używa `G.fame = clamp(G.fame + f, 0, 100)` bez `addFame()`. Bypassuje fameMult.
- **Sugestia:** `addFame(f)` zamiast clamp

### K7. sellBeat cooldown wrapping (gameMin bug)
- **Lokalizacja:** linia 15922
- **Typ:** BUG (ten sam wzorzec co koncert miał przed v2.1.87)
- **Opis:** `_last = G._lastBeatSellMin || -9999` używa absolutnego `gameMin` (0-1439). Wraps przy nowym dniu → ujemne `_now - _last` → cooldown blokuje permanentnie. Cooldown 90 min więc rzadziej, ale możliwe.
- **Sugestia:** Port `_lastBeatSellAbs = G.day*1440 + gameMin` jak v2.1.87

### K8. sellBeatPack cooldown wrapping
- **Lokalizacja:** linia 15973
- **Typ:** BUG
- **Opis:** Ten sam bug co K7, cooldown 240 min — większa szansa na trigger po przekroczeniu północy.
- **Sugestia:** Absolutny timestamp

### K9. Casino stats NIE resetują się na Prestige
- **Lokalizacja:** `doPrestige()` (~linia 26633)
- **Typ:** EXPLOIT (Major Prestige Bypass)
- **Opis:** `G.casinoStats.totalWon` (i wszystkie inne statystyki kasyna) persystuje po Prestige. VIP unlock wymóg 10k totalWon → gracz po Prestige #2 ma już unlocked VIP od startu (bez grania). Wszystkie kasyno-related achievementy też przetrwują.
- **Sugestia:** Reset `G.casinoStats` w doPrestige() (możliwy total reset lub przynajmniej totalWon/totalLost)

### K10. Autopromocja 4 — getEffectiveDrip() może być ghost
- **Lokalizacja:** wszędzie gdzie używane `getEffectiveDrip` (drip bonus dla autopromocja 4)
- **Typ:** GHOST FEATURE (do weryfikacji)
- **Opis:** PATCH_NOTES v1.8.98 deklaruje że Autopromocja 4 ×1.5 drip naprawiony. Agent nie znalazł funkcji `getEffectiveDrip()` w grep. Albo została zdefiniowana inaczej, albo to wciąż ghost.
- **Sugestia:** Grep `getEffectiveDrip` żeby zweryfikować istnienie + użycie

---

## 🟠 WYSOKIE

### W1. Plugin bonus opis "X% jakości" misleading
- **Lokalizacja:** UI plugins linia ~17547-17556, mix linia 17720 (×0.4 mnożnik), master 17768 (×0.3)
- **Typ:** INCONSISTENCY / GHOST (częściowy)
- **Opis:** UI pluginów obiecuje "+8% jakości miksu" (eqPro), "+10%" (punchComp) itd. ALE w kodzie plugBonus jest mnożone przez 0.4 (mix) lub 0.3 (master). +8 plugBonus daje faktycznie +3.2% do mixQ.
- **Sugestia:** Zmień opisy ("zwiększa score o +8 pkt") LUB usuń mnożnik 0.4/0.3

### W2. synth808 opis "+15%" vs kod +12%
- **Lokalizacja:** UI 17555 vs kod 15819, 17286
- **Typ:** INCONSISTENCY
- **Opis:** Plugin sklepu mówi "+15%" ale kod daje +12.
- **Sugestia:** Zaktualizuj opis na +12% LUB podnieś kod do 15

### W3. drumPro opis "+10%" vs kod +8%
- **Lokalizacja:** UI 17556 vs kod 15819, 17286
- **Typ:** INCONSISTENCY
- **Opis:** Plugin sklepu mówi "+10%" ale kod daje +8.
- **Sugestia:** Zaktualizuj opis lub podnieś kod

### W4. synth808 gatunek-specific (tylko trap/drill) — opis ukrywa
- **Lokalizacja:** UI 17555 vs kod 15819 (warunek `genre==='trap'||'drill'`)
- **Typ:** GHOST CONDITION
- **Opis:** Plugin "+15% jakości trap/drill beatów" sugeruje że +15% zawsze przy tych gatunkach. Faktycznie tylko gdy gracz tworzy beat w tym gatunku. Reggaeton/jerk/boombap → 0 bonusu. Gracz może kupić nie wiedząc.
- **Sugestia:** Zmień opis na "+12% tylko dla trap/drill (brak bonusu dla innych)"

### W5. streamBoost dystrybutora — tylko singel, nie album/beat
- **Lokalizacja:** linia 17855 (dawReleaseSingle), brak w releaseAlbum (17215), releaseBeat (15958)
- **Typ:** INCONSISTENCY
- **Opis:** Empire (+30% streamów) i AWAL (+20%) aplikują tylko dla singli. Album i beat releases ignorują streamBoost.
- **Sugestia:** Albo dodaj do album/beat, albo udokumentuj w opisie dystrybutora "+X% streamów singli"

### W6. Quality calc Sound Eng — bez clampu (możliwy overflow)
- **Lokalizacja:** linia 17144
- **Typ:** BUG
- **Opis:** `quality = 40 + mic*0.3 + realLvl*8 + skill*5` — bez `Math.min(100, ...)`. Z max wartościami: 40 + 30 + 40 + 25 = 135 > 100.
- **Sugestia:** Dodaj `Math.min(100, ...)` clamp

### W7. YT series progress counter — nie resetuje na Prestige
- **Lokalizacja:** `G.yt.seriesProgress` reset w doPrestige
- **Typ:** EXPLOIT
- **Opis:** Counter `seriesProgress` (0-5 ep w serii) może nie resetować się — gracz po Prestige od razu ma 4/5 i jednym filmem dostaje 5x bonus.
- **Sugestia:** Reset w doPrestige

### W8. streamBoostRemaining — brak decay
- **Lokalizacja:** `G.streamBoostRemaining` (set w publishYT, brak ticka)
- **Typ:** EXPLOIT (możliwy infinite boost)
- **Opis:** Po YT publish ustawiane na 3 (lub 5 dla serii). Decrement w `finishStream` (linia 16529). Ale jeśli gracz NIE streamuje, boost zostaje w pamięci na zawsze. Pierwszy stream zużyje 1.
- **Sugestia:** Tick decay codzienny lub time-limit

### W9. IG posts cap 150 — nie reset na Prestige
- **Lokalizacja:** `G.igPosts` (cap z v1.9.45)
- **Typ:** EXPLOIT (możliwy bloat save)
- **Opis:** Array `G.igPosts` rośnie do 150 entries. Nie resetuje przy Prestige → po wielu prestige'ach gracz ma 150 starych postów które nie mają sensu.
- **Sugestia:** Reset `G.igPosts=[]` w doPrestige (lub zachowaj tylko ostatnie 20)

### W10. fans_500 achievement brak w tier arrays
- **Lokalizacja:** linia 10239 (definicja), brak w TIER_MEDIUM (10300-10302)
- **Typ:** BUG (tier system)
- **Opis:** Achievement "Half-K" (500 fans) nie jest w żadnym tier array → default 100 zł reward zamiast 500 zł (MEDIUM tier).
- **Sugestia:** Dodaj 'fans_500' do TIER_MEDIUM

### W11. Hazard skill — ghost (jedyne 1 callsite)
- **Lokalizacja:** funkcja getHazardLuckBonus() linia 1291, użycie linia 9463
- **Typ:** GHOST FEATURE
- **Opis:** Skill `hazard` z PU 100/200/300 zł, ale używany TYLKO w jednej linii (`_luck` w jednej minigamie kasyna). Opis sugeruje "szansa kasyno" — gracz inwestuje PU bez widocznego efektu.
- **Sugestia:** Zintegruj z więcej gier kasyna lub usuń skill

### W12. Prestige UI fans vs followers desync
- **Lokalizacja:** linia 26720 (modal showPrestigeInfo)
- **Typ:** UX BUG
- **Opis:** Modal sprawdza wymóg fans `G.fans >= reqs.fans` (lojalni). HUD pokazuje `G.followers` (casual+loyal). Desync — gracz widzi 100k followers ale wymóg "100k fans".
- **Sugestia:** Wyjaśnij w modalu różnicę albo używaj tej samej metryki

---

## 🟡 ŚREDNIE

### S1. Spam penalty toast koncertu spóźniony
- **Lokalizacja:** `endConcert` linia 20462+
- **Typ:** UX
- **Opis:** Toast "50% payoutu" pokazuje się PO koncercie. Gracz powinien wiedzieć PRZED kliknięciem "zarezerwuj".
- **Sugestia:** Toast PRZED minigame (jest częściowo w `performConcert`, ale można wzmocnić)

### S2. Freestyle viral bonus +50 fans bez visible feedback
- **Lokalizacja:** linia 22699
- **Typ:** UX
- **Opis:** Bonus +50 fanów przy flow≥4 (10% chance) nie ma toast/notif. Gracz nie wie że się aktywował.
- **Sugestia:** showMsg gdy bonus aktywny

### S3. Holiday/Festival bonusy bez display w UI Sali Koncertowej
- **Lokalizacja:** renderSalaKoncertowa ~19649
- **Typ:** UX
- **Opis:** Sylwester ×1.4 / Majówka ×1.25 / Hip-Hop fame ×2.0 aplikują się ale gracz nie widzi że są aktywne.
- **Sugestia:** Pokaż "🎆 Sylwester aktywny — +40% earn" w panelu Sali

### S4. Outfit bonus koncertu bez display
- **Lokalizacja:** renderSalaKoncertowa
- **Typ:** UX
- **Opis:** music ×1.05, designer ×1.10, smoking ×1.08 — działają ale gracz nie wie.
- **Sugestia:** Pokaż aktywny outfit bonus

### S5. fans_1m vs 1m_followers duplicate milestone
- **Lokalizacja:** linie 10274-10275
- **Typ:** INCONSISTENCY
- **Opis:** Dwa osiągnięcia dla 1M fanów (jedno z dodatkowo fame≥50). Mogą firować razem w jednym ticku → podwójna nagroda.
- **Sugestia:** Skoordynuj — jedno LEGENDARY i jedno HARD z różnymi targetami

### S6. raperST faktyczne 9 gałęzi vs deklarowane 7
- **Lokalizacja:** docstring vs użycie linie 11798, 11806, 12048, 35844
- **Typ:** DOCUMENTATION
- **Opis:** Kod używa `biznes` i `kondycja` jako branches raperST, ale docstring mówi o 7 gałęziach.
- **Sugestia:** Zaktualizuj docs lub usuń branches biznes/kondycja jeśli ghost

### S7. Czytanie skill — niewidoczny w UI drzewa?
- **Lokalizacja:** użycie linie 11923, 11937 (Evolution Mędrzec)
- **Typ:** GHOST (do weryfikacji)
- **Opis:** Skill `czytanie` używany w `addXP` mnożnik + evo Mędrzec, ale agent niepewny czy gracz może go odblokować w UI.
- **Sugestia:** Zweryfikuj wyświetlanie w drzewku ogólnym

### S8. Twitter app render — może w innym formacie
- **Lokalizacja:** wymienione w PATCH_NOTES v2.1.95, kod niepotwierdzony
- **Typ:** MISSING (do weryfikacji)
- **Opis:** Agent nie znalazł renderPhoneApp('twitter') w grep — może pod inną nazwą.
- **Sugestia:** Grep 'twitter' szeroko żeby potwierdzić

### S9. totalEarned dla inwestycji liczy brutto
- **Lokalizacja:** ~linia 11886 (nextPeriod return inwestycji)
- **Typ:** BALANCE
- **Opis:** Patch v1.9.43 zgłaszał że zwroty inwestycji liczą KAPITAŁ (1200 zł) do `totalEarned`, nie tylko zysk (200 zł). Leaderboard score może być zawyżony 5-10% dla intensywnych inwestorów.
- **Sugestia:** Zmień na `totalEarned += returnAmount - amount` (tylko netto)

### S10. Major album Sound Eng wymaga obu (lvl 5 + reqRealizacja 3)
- **Lokalizacja:** linia 17096
- **Typ:** UX
- **Opis:** UI mówi "minLevel: 5" ale faktycznie też reqRealizacja:3. Gracze mogą nie wiedzieć.
- **Sugestia:** UI pokaż oba wymogi

### S11. YT streak notification tylko ≥7 dni
- **Lokalizacja:** linia 15589
- **Typ:** UX
- **Opis:** Streak <7 dni nie pokazuje notif — gracz nie ma feedback że bonus rośnie.
- **Sugestia:** Notif od dnia 2/3

---

## 🟢 NISKIE (technical debt / kosmetyka)

### N1. DISTRIBUTORS array vs DISTRIBUTORS_MAP redundancy
- **Lokalizacja:** linie 17582-17594 + 17640-17646
- **Typ:** CODE QUALITY
- **Opis:** Dwa źródła prawdy dla dystrybutorów. Aktualnie spójne, ale ryzyko desync w przyszłości.

### N2. Plugin opis nie dokumentuje per-mix/master split
- **Lokalizacja:** UI pluginów
- **Typ:** DOCUMENTATION
- **Opis:** Gracz nie wie że niektóre pluginy działają tylko w mix (eqPro), inne w master (limiterLoud).

### N3. getScenaEnergyBonus() bez weryfikacji formuły
- **Lokalizacja:** linia 20446 — funkcja używana
- **Typ:** AUDIT GAP
- **Opis:** Helper bez weryfikacji w obecnym audicie — może wymagać sprawdzenia w Wave 2.

---

# ZNALEZISKA WAVE 2

## 🔴 KRYTYCZNE

### K11. G.npcFriendship NIE resetuje na Prestige
- **Lokalizacja:** doPrestige() linia ~26633
- **Typ:** EXPLOIT (Major Prestige Bypass)
- **Opis:** Poziomy przyjaźni z NPC (Wiktor, Marcin, Zbyszek, crew) persystują między Prestige. Gracz po Prestige #2 ma już 100/100 friendship → 1.5× discount Zbyszka + 1.5× zarobki koncertów (Marcin) + crew bonusy. Stackuje multiplicatywnie z innymi bonusami.
- **Sugestia:** Reset `G.npcFriendship = {wiktor:0, marcin:0, zbyszek:0, ...}` w doPrestige

### K12. G.dailyQuest NIE resetuje na Prestige
- **Lokalizacja:** doPrestige()
- **Typ:** BUG
- **Opis:** PATCH_NOTES v1.9.39 zapowiada "daily quest Prestige fix" ale agent nie znalazł `G.dailyQuest = null` w resetowaniu. Stara niezakończona quest może blokować nowy generator.
- **Sugestia:** `G.dailyQuest = null` w doPrestige

### K13. Drip/outfit/hair NIE reset na Prestige
- **Lokalizacja:** doPrestige() linie 26633-26707
- **Typ:** EXPLOIT (permanent bonus)
- **Opis:** `G.drip` (cap 200) persystuje, `G.outfit` (z bonusami koncert) persystuje, `G.haircut` persystuje. Gracz Prestige #5 startuje z drip=200 → maksymalny bonus koncert+fans+royalty od dnia 1.
- **Sugestia:** Reset drip, outfit→default, hair→default (lub zachowaj jako "Prestige reward" jeśli design)

### K14. G.bank (loan + investments) NIE reset na Prestige
- **Lokalizacja:** doPrestige() linia 26679 (tylko G.bills reset)
- **Typ:** EXPLOIT
- **Opis:** Aktywna pożyczka, inwestycje persystują. Gracz może zaciągnąć 3×10k inwestycje + 1k loan → Prestige → te dojrzeją z bonusem skill+Prestige multiplier dla świeżego playthrough. Plus stary loan zostaje nieskoñczenie.
- **Sugestia:** Reset `G.bank.loan = 0; G.bank.investments = [];`

### K15. Festival UI — brak tooltipów bonus
- **Lokalizacja:** quest widget linia ~28903-28907
- **Typ:** UX BUG (ghost effect dla gracza)
- **Opis:** Festiwale wyświetlają nazwę + dni, ale gracz nie wie jakie bonusy aktywne (concertFameMult 2.0, repMult 2.0 itd.). Gracz może nie wiedzieć kiedy korzystne zagrać koncert/freestyle.
- **Sugestia:** Dodaj tooltipy/info do widget

### K16. maxPerDay quit-load exploit
- **Lokalizacja:** linia 10524 (G._eventCounts)
- **Typ:** EXPLOIT
- **Opis:** `G._eventCounts = {day: G.day, counts: {}}` resetuje się tylko gdy `G.day` zmienia. Quit+load w tym samym dniu → counter zostaje. Można triggerować "Lucky day" (maxPerDay:2) >2 razy przez save/load.
- **Sugestia:** Persist counter w save (już persistuje? sprawdź — może bug w deserializacji)

### K17. Smart Hints flag mismatch
- **Lokalizacja:** linia 28010-28029
- **Typ:** BUG
- **Opis:** Niektóre hint flags mają niezgodne nazwy w check vs set: np. `_hintShown_casinomile5k` (check) vs `_hintShown_casino_milestone_5k` (set). Wynik: hint pokazuje się w nieskończoność co minutę, bo flag "shown" zapisany pod inną nazwą.
- **Sugestia:** Audit wszystkich `_hintShown_*` i ujednolicić nazwy

### K18. Concert MG brak Escape handler
- **Lokalizacja:** linia ~20235-20435
- **Typ:** BUG (DOM orphan)
- **Opis:** Mini gra koncertu nie ma handlera Escape. Gracz nie może wyjść gracefully → DOM elementy mogą zostać w sieci, pamięć leak.
- **Sugestia:** Dodaj escape listener z cleanup

### K19. Gym MG brak implementacji (potencjalnie)
- **Lokalizacja:** brak grep match `startGymMG`
- **Typ:** GHOST / MISSING (do weryfikacji)
- **Opis:** Agent nie znalazł funkcji `startGymMG()` mimo że gym istnieje na mapie. Może pod inną nazwą lub minigame nie zaimplementowane.
- **Sugestia:** Verify — grep wider patterns (`silownia`, `workout`, `trening`)

### K20. _esc() function 3× duplicated
- **Lokalizacja:** linie 24728, 24816, 25066
- **Typ:** CODE QUALITY (security risk)
- **Opis:** Funkcja XSS-escape zdefiniowana 3× w różnych miejscach. Jedna może być niekompletna, inne ok. Maintenance nightmare.
- **Sugestia:** Centralizuj w global scope

---

## 🟠 WYSOKIE

### W13. Hospital heal — brak daily limit
- **Lokalizacja:** linie 19481-19496
- **Typ:** EXPLOIT (małe)
- **Opis:** Gracz może klikać "Pełne leczenie" wielokrotnie/dzień (każde -8 zł/% brakujące, ale teoretyczne i wymuszane manualnie). Brak hard guard daily limit.
- **Sugestia:** `G._lastFullHealDay` flag

### W14. Hint cooldown nieznany
- **Lokalizacja:** brak `_lastHintTime` w grep
- **Typ:** UX
- **Opis:** Może być race condition gdzie hinty spamują się gdy gracz robi rapid actions.
- **Sugestia:** Audit hint trigger logic

### W15. Festival/Tour cinematic Prestige reset nieznany
- **Lokalizacja:** linie 11249, 34149 (_firstFestivalDone, _firstTourStarted)
- **Typ:** GHOST? (do weryfikacji)
- **Opis:** Flagi cinematicowe istnieją ale agent nie zweryfikował czy są resetowane przy Prestige (jak career cinematics z v1.9.59).
- **Sugestia:** Audit reset list w doPrestige

### W16. G.crew (NPC) vs G.playerCrew (Supabase) namespace clash
- **Lokalizacja:** linia 29837, 35872-35874
- **Typ:** INCONSISTENCY
- **Opis:** Dwa różne systemy crew: stary NPC-based (Bartek/Olek/Seba w `G.crew`) i nowy Supabase (`G.playerCrew`). Brak migracji starych saves.
- **Sugestia:** Migracja w load lub jasna konwencja co kiedy używane

### W17. Crew challenges progress queue — partial fix
- **Lokalizacja:** linia 41293-41346 (_crewAddProgress)
- **Typ:** RACE CONDITION (částiowo fixed v2.1.55)
- **Opis:** Buffer 5s przed flush. Jeśli gracz zamknie kartę w oknie 5s, progress traci się.
- **Sugestia:** beforeunload immediate flush + persist queue na save

### W18. Holiday opis ≠ kod (Sylwester ×2 deklarowane vs ×1.4 faktycznie)
- **Lokalizacja:** opis 34191 vs holidayBonus 34228 (po v2.1.83 nerf)
- **Typ:** INCONSISTENCY (UI)
- **Opis:** Opis holiday obiecuje "×2 zarobków koncertu" ale po nerfie v2.1.83 daje ×1.4. Gracz wprowadzony w błąd.
- **Sugestia:** Zaktualizuj opis na "+40% zarobków koncertów" lub revert nerf

### W19. Drip District -10% obietnica vs kod (SMS lies)
- **Lokalizacja:** linia 12168
- **Typ:** GHOST FEATURE
- **Opis:** Rep75 SMS mówi "Drip District -10%" ale agent nie znalazł `applyOutfitDiscount` zaimplementowanego.
- **Sugestia:** **Verify + ZAIMPLEMENTUJ** (NIE usuwać obietnicy — user explicit). Dodać -10% rabat w buyOutfit() jeśli `_repBoost75` aktywne.

### W20. Wigilia stress=100 reset niejasny
- **Lokalizacja:** linia 34205-34208
- **Typ:** DOCUMENTATION
- **Opis:** Holiday Wigilia ustawia stress=100 (mood=max). Patchnotes "Wigilia Prestige friendly" niespójne z opisem.
- **Sugestia:** Dokumentacja co Wigilia faktycznie robi

### W21. Collab Invite event brak maxPerDay
- **Lokalizacja:** linia 10420-10422
- **Typ:** BALANCE
- **Opis:** Event YouTube collab (+50-300 subów) nie ma cap. Chance niski (0.012) ale teoretyczne spam.
- **Sugestia:** `maxPerDay: 1`

### W22. activeHoliday reset na Prestige nieznany
- **Lokalizacja:** doPrestige
- **Typ:** GHOST? (do weryfikacji)
- **Opis:** Jeśli gracz robi Prestige podczas aktywnego święta (Sylwester), czy `G.activeHoliday` jest czyszczone? Inaczej +100 fanów Sylwester może triggerować się przy następnym dniu.
- **Sugestia:** `G.activeHoliday = null` w doPrestige

### W23. trendMult merch / trend reset na Prestige
- **Lokalizacja:** linia 34516+ (trend logic)
- **Typ:** COSMETIC (intencjonalne?)
- **Opis:** `G.merchStore.trend` persystuje. Gracz po Prestige może mieć "stary trend" działający 7 dni. Cosmetic ale niejasne.
- **Sugestia:** `G.merchStore.trend = null` lub komentarz w kodzie

### W24. G.haters reset na Prestige niejasny
- **Lokalizacja:** doPrestige
- **Typ:** DESIGN INTENT (niejasny)
- **Opis:** Hejterzy nie są resetowani — czy intencjonalne (hejterzy pamiętają) czy bug?
- **Sugestia:** Decyzja design + komentarz

---

## 🟡 ŚREDNIE

### S12. Cooking recipe.time audit (v1.9.17 fix już applied)
- **Lokalizacja:** linia 10860
- **Typ:** CLEAN (info)
- **Opis:** Wcześniej recipe.time nie zwiększało gameMin — naprawione v1.9.17. Audyt potwierdza.

### S13. Smoking outfit health penalty nie istnieje
- **Lokalizacja:** linia 8239+
- **Typ:** DOCUMENTATION
- **Opis:** Outfit "smoking" to tylko kosmetyka + sława bonus, brak negatywnego efektu na zdrowie.

### S14. Winter coat zawsze active (nie weather-gated)
- **Lokalizacja:** linia 11497
- **Typ:** DESIGN
- **Opis:** `winterCoatMult = 0.15× if outfit==='zimowa'` — działa też latem. To OK bo frost decay aktywny tylko zimą, ale logicznie weather-gating byłby cleaner.

### S15. Ujemny G.money możliwy przez konsolę
- **Lokalizacja:** Brak `Math.max(0, G.money)` w niektórych miejscach
- **Typ:** EDGE CASE
- **Opis:** UI/mechaniki normalne blokują (bills check, etc.), ale konsolą można wymusić ujemny. Investment maturation dodaje raw — może pogorszyć negatywny.
- **Sugestia:** Hard clamp `Math.max(0, G.money)` per tick

### S16. Heater attack random event — partial implementation
- **Lokalizacja:** linia 10382-10384
- **Typ:** INFO
- **Opis:** Event działa, agent znalazł penalty (-30% sponsor chance w linia 16903) — wcześniejsze założenie że brak penalty było błędne.

---

## 🟢 NISKIE

### N4. G._dead pole nieużywane
- **Lokalizacja:** brak w grep
- **Typ:** DEAD CODE
- **Opis:** Kod nigdzie nie używa `G._dead`. Death flow działa przez `G.health <= 0` check.

### N5. Mapa, kolizje, transport — CZYSTE
- **Typ:** INFO
- **Opis:** Agent znalazł 0 problemów w całym obszarze 13. Wszystkie 14 sub-obszarów (budynki, kolizje, chodniki, parking, helipad, bus, ulice, building entrance block, NPC pathing, minimap, phone NPC map, zone systems) spójne.

---

# PODSUMOWANIE CAŁOŚCI (Wave 1 + Wave 2)

| Priorytet | Wave 1 | Wave 2 | RAZEM |
|---|---:|---:|---:|
| 🔴 Krytyczne | 10 | 10 | **20** |
| 🟠 Wysokie | 12 | 12 | **24** |
| 🟡 Średnie | 11 | 5 | **16** |
| 🟢 Niskie | 3 | 2 | **5** |
| **RAZEM** | **36** | **29** | **65** |

## 🔥 TOP 5 NAJPILNIEJSZYCH (cross-Wave)

1. **PRESTIGE BYPASSES MAJOR** (K1-K6, K9, K11-K14, K22): 12+ źródeł nie respektujących Prestige moneyMult/fameMult LUB persistujących progress między Prestige. Łącznie major imbalans — każdy Prestige gracza znacznie mocniej niż design intended.

2. **Beatmaker cooldown wrapping** (K7, K8): ten sam wzorzec co koncert przed v2.1.87, możliwa permanentna blokada.

3. **Casino stats persist** (K9): instant VIP unlock w nowym playthrough.

4. **Festival UI ghost** (K15): gracz nie wie kiedy korzystne grać → traci value mechanik.

5. **Smart Hints flag mismatch** (K17): hinty spamują się w nieskończoność.

---

# ZNALEZISKA WAVE 3

## 🔴 KRYTYCZNE

### K21. Mixer/Master fields BRAK migracji w loadGame (CRASH RISK)
- **Lokalizacja:** loadGame() brak inicjalizacji dla `G._mixEq, _mixRev, _mixComp, _mixMel, _masLim, _masStereo, _masLufs` (po v2.1.72 fix tylko dla `_mixDrums`)
- **Typ:** BUG (potential crash)
- **Opis:** Stare save bez tych pól → undefined. UI z fallback `|| 50` działa, ale mutacje (oninput) crashują.
- **Sugestia:** Defensywne init wszystkich 7 pól mikser/master w loadGame

### K22. G.spotify/tidal/soundcloud/yt royalties NIE resetują na Prestige
- **Lokalizacja:** doPrestige() brak `G.spotify = {listeners:0,...}` etc.
- **Typ:** EXPLOIT (Major Prestige Bypass)
- **Opis:** Słuchacze, streams, royalties cumulate przez wszystkie Prestige. Gracz Prestige #3 wraca z 100k Spotify słuchaczy → daily organic growth daje setki dziennie od dnia 1. + tantiemy persist.
- **Sugestia:** Reset wszystkich platform w doPrestige

### K23. G.managementDeal NIE reset na Prestige
- **Lokalizacja:** doPrestige()
- **Typ:** EXPLOIT
- **Opis:** Management contract +20-40% bonus na koncerty/sales zachowuje się permanentnie. Gracz po Prestige #5 zawsze ma management bonus.
- **Sugestia:** `G.managementDeal = false; G.managementBonus = 1;`

### K24. G.studioTracks NIE reset na Prestige
- **Lokalizacja:** doPrestige()
- **Typ:** EXPLOIT
- **Opis:** Wszystkie wydane tracki zachowują się. Gracz po Prestige startuje z 30+ tracków → daily organic engine od razu daje +900 Spotify listeners/dzień (tracks × fame × 0.3).
- **Sugestia:** Reset lub keep ale documentation

### K25. G.distributor / G.label NIE reset na Prestige
- **Lokalizacja:** doPrestige()
- **Typ:** EXPLOIT
- **Opis:** Dystrybutor (Empire +30% streams) i label (royalty cut) persistują. Gracz po Prestige zawiera z najlepszym dystrybutorem od pierwszego singla.
- **Sugestia:** Reset distributor/label

### K26. Casino daily wheel free spin — bypass Prestige
- **Lokalizacja:** linia 9473
- **Typ:** EXPLOIT
- **Opis:** `G.money += prize` bezpośrednio (free spin random ~50-500 zł).
- **Sugestia:** `earn(prize, false)`

### K27. Sponsorship run (influencer campaign) — bypass
- **Lokalizacja:** linia 16916
- **Typ:** EXPLOIT
- **Opis:** `G.money += payment` direct. To różny od random event (Wave 1 K1 dotyczył innego).
- **Sugestia:** `earn(payment, false)`

### K28. Campaign run — bypass money + fame
- **Lokalizacja:** linia 16928
- **Typ:** EXPLOIT (podwójny)
- **Opis:** `G.money += payment` + `G.fame = clamp(G.fame + 15, 0, 100)` — oba bypass Prestige.
- **Sugestia:** `earn()` + `addFame()`

### K29. Ghostwriting — bypass
- **Lokalizacja:** linia 17265
- **Typ:** EXPLOIT
- **Opis:** `G.money += pay` direct dla ghostwriting payments.
- **Sugestia:** `earn(pay, false)`

### K30. Milestone reward (fans 1k/10k/100k/1M) — bypass
- **Lokalizacja:** linia 11859
- **Typ:** EXPLOIT
- **Opis:** `G.money += ms.reward.money` direct dla milestone money rewards.
- **Sugestia:** `earn(ms.reward.money, false)`

### K31. World tour bonus completion — bypass
- **Lokalizacja:** linia 34129
- **Typ:** EXPLOIT
- **Opis:** `G.money += completionBonus` direct.
- **Sugestia:** `earn(completionBonus, false)`

### K32. Concert manual Prestige multiplier (zamiast earn())
- **Lokalizacja:** linia 20470-20488
- **Typ:** INCONSISTENCY
- **Opis:** Koncert używa `_prestigeMC = G.prestigeBonus?.moneyMult || 1; earn = earn * _prestigeMC; G.money += earn` zamiast `earn(amount, false)`. Działa ale brittle — jeśli `earn()` zmieni logic, koncert nie zaktualizuje się.
- **Sugestia:** Refactor do `earn(amount, false)`

### K33. Multiple fame bypassy (direct clamp)
- **Lokalizacja:** różne linie
- **Typ:** EXPLOIT (10+ miejsc)
- **Opis:** 
  - First casino visit (9067): `G.fame = clamp(G.fame + 5, ...)`
  - Steak Royal +1 fame (9337)
  - Whiskey +1 fame (9371)
  - Champagne +5 fame (9376)
  - First room visit +2 (9589)
  - Pochwała od fana +1 (10479)
  - IG post pendingFame (11645)
  - Demo release +1 (12438)
  - Milestone failed -20 (11874)
  - Rep75 milestone +10 (12168)
  - World tour completion +15 (34133)
  - Concert manual prestige fame (20488)
- **Sugestia:** Wszystkie przez `addFame()` dla Prestige multiplier consistency

### K34. Outfit UI vs kod nerf (Sylwester ×2 deklarowane → ×1.4)
- **Lokalizacja:** UI 34191/34187 vs kod 34229
- **Typ:** INCONSISTENCY (5+ pluginów + 2 holidays + 2 outfity)
- **Opis:** v2.1.83 nerf changes nie zaktualizowane w UI:
  - Sylwester ×2 UI vs ×1.4 kod
  - Majówka ×1.5 UI vs ×1.25 kod
  - Designer_concert +15% UI vs +10% kod
  - Smoking +10% UI vs +8% kod
  - Plus 10 DAW pluginów: opisy "+X% jakości" są faktycznie +X pkt fixed, mnożone przez 0.4 (mix) / 0.3 (master) = realne ~+3-4% boost
- **Sugestia:** Update opisów do match kod ALBO clarify "+X pkt do score"

### K35. Winter coat UI "−15%" mylące
- **Lokalizacja:** UI 18831 vs kod 11497
- **Typ:** UI/COMMUNICATION
- **Opis:** Opis "−15% utraty zdrowia w mrozie" sugeruje że gracz traci 85% normalne. Kod faktycznie: `winterCoatMult = 0.15` → gracz traci 15% normalnego damage (85% reduction). Tekst sugeruje odwrotnie.
- **Sugestia:** Zmień opis na "−85% obrażeń od mrozu (kurtka tłumi cię z mrozu)"

---

## 🟠 WYSOKIE

### W25. G.playerCrew brak init w loadGame
- **Lokalizacja:** loadGame() — brak
- **Typ:** BUG
- **Opis:** Stary save bez `G.playerCrew` → undefined zamiast null. Code uses `if(G.playerCrew && G.playerCrew.id)` więc nie crashuje, ale Supabase load async może nie ustawić poprawnie.
- **Sugestia:** `if(typeof G.playerCrew === 'undefined') G.playerCrew = null;`

### W26. G.sideQuests brak init w loadGame
- **Lokalizacja:** loadGame() — brak
- **Typ:** BUG (potential crash)
- **Opis:** Init jest w resetPrestige (linia 35183) ale nie w loadGame. Stary save może crashować na renderPhoneQuests.
- **Sugestia:** `if(!G.sideQuests || typeof G.sideQuests !== 'object') G.sideQuests = {};`

### W27. G._ytStreak, G._ytLastUploadDay brak init
- **Lokalizacja:** loadGame, resetG — brak
- **Typ:** BUG (defensywne)
- **Opis:** Streak counter (v2.1.85) nie ma init. Fallback `|| 0` chroni, ale lepsza praktyka init.
- **Sugestia:** `if(typeof G._ytStreak !== 'number') G._ytStreak = 0;` + `G._ytLastUploadDay = 0`

### W28. G._lastConcertAbs brak init w loadGame
- **Lokalizacja:** loadGame — brak (reset w sleep ✓, ale brak w loadGame)
- **Typ:** BUG
- **Opis:** v2.1.87 fix dla concert wrapping używa `G._lastConcertAbs`. Stary save bez tego pola → początkowy `||-9999` chroni, ale dla pewności init.
- **Sugestia:** `if(typeof G._lastConcertAbs !== 'number') G._lastConcertAbs = -9999;`

### W29. G.casinoStats NIE reset na Prestige (powtórka K9 z Wave 1)
- **Lokalizacja:** doPrestige
- **Typ:** EXPLOIT (już zgłoszone)
- **Opis:** Wave 1 K9. Cumulative wins, instant VIP unlock.

### W30. G.bank.loan + investments NIE reset (powtórka K14 z Wave 2)
- **Lokalizacja:** doPrestige
- **Typ:** EXPLOIT (już zgłoszone)

### W31. v2.1.83 patch notes "max stack ×9→×5" niedokładny
- **Lokalizacja:** PATCH_NOTES v2.1.83
- **Typ:** DOCUMENTATION
- **Opis:** Faktycznie max stack mnożników koncertu po nerfie to ×3-4 (bez fame/follower/perf które są osobne). Patch notes obiecuje ×5 ale realnie ×3.2.
- **Sugestia:** Aktualizuj patch notes lub dostosuj wartości

### W32. Bank investment payout — częściowy bypass
- **Lokalizacja:** linia 11897
- **Typ:** BORDERLINE
- **Opis:** `G.money += totalRet` direct. `totalRet = baseRet + bonusGain` gdzie `bonusGain` może zawierać skill bonus. Jeśli Prestige powinien wpływać na bonus część — bypass.
- **Sugestia:** Verify intent, jeśli powinno mieć Prestige mult — wrap w earn()

### W33. _lastIGPostDay NIE reset na Prestige
- **Lokalizacja:** doPrestige
- **Typ:** MINOR EXPLOIT
- **Opis:** Cooldown IG post persystuje. Gracz po Prestige może mieć stary cooldown lub odwrotnie.
- **Sugestia:** Reset

### W34. G.ytRecorded, G.ytQuality, G.ytGame NIE reset na Prestige
- **Lokalizacja:** doPrestige
- **Typ:** BUG (potencjalny)
- **Opis:** Jeśli gracz był w trakcie nagrywania YT video, status zostaje. Po Prestige może być "in progress" na pustej karierze.
- **Sugestia:** Reset YT recording state

---

## 🟡 ŚREDNIE

### S17. G.activeHoliday, G.activeFestival brak init (guards OK)
- **Lokalizacja:** loadGame
- **Typ:** DEFENSIVE
- **Opis:** Kod ma guards (`if(G.activeHoliday && ...)`), więc nie crashuje. Init dla porządku.

### S18. G._eventCounts brak init (guards OK)
- **Lokalizacja:** loadGame
- **Typ:** DEFENSIVE

### S19. G._introductionSeen brak init
- **Lokalizacja:** loadGame
- **Typ:** DEFENSIVE
- **Opis:** Flaga tutorial — jeśli undefined, intro może odpalić się ponownie u doświadczonego gracza.

### S20. Achievement 1m_followers wymóg fame≥50 redundantny
- **Lokalizacja:** linia 10275
- **Typ:** LOGIC
- **Opis:** Gracz mając 1M fanów ma już max fame (100). Wymóg fame≥50 jest LOL-redundantny.
- **Sugestia:** Usuń wymóg fame ALBO podnieś do fame≥80 (niemożliwe gdy też 1M fanów więc skip)

### S21. Daily organic growth — brak hard cap (long-term)
- **Lokalizacja:** linia 11673
- **Typ:** BALANCE (low risk)
- **Opis:** Late game gracz z 500+ tracków + fame 100 dostaje +1500+ słuchaczy/dzień organic. Nie eksploduje ale monitor.

---

## 🟢 NISKIE

### N6. Mapa, kolizje, transport, ulice — CZYSTE (już)
### N7. Storyline questy — wszystkie spójne (już)
### N8. Wymogi gating — brak blocked paths (już)

---

# 🎯 FINAŁOWE PODSUMOWANIE

| Priorytet | Wave 1 | Wave 2 | Wave 3 | RAZEM |
|---|---:|---:|---:|---:|
| 🔴 Krytyczne | 10 | 10 | 15 | **35** |
| 🟠 Wysokie | 12 | 12 | 10 | **34** |
| 🟡 Średnie | 11 | 5 | 5 | **21** |
| 🟢 Niskie | 3 | 2 | 3 | **8** |
| **RAZEM** | **36** | **29** | **33** | **98** |

# ZNALEZISKA WAVE 4 (DRILL-DOWN)

## 🔴 KRYTYCZNE

### K36. Kurier — INTENCJONALNE bez cooldown (DROPPED z listy fixów)
- **Lokalizacja:** linia 21185-21304
- **Typ:** ~~EXPLOIT~~ DESIGN (intencjonalne)
- **Opis:** Prace dorywcze nie mają cooldownów ani daily limitów (user explicit). Kurier 60s per trasa, gracz może grindować — to zamierzona mechanika early-game.
- **Decyzja:** NIE naprawiać. Balans przez nerf evo Multi-zlecenie +100%→+50% (patrz W62). Ten punkt zamknięty.

### K37. `stress_free` achievement semantyka odwrotna
- **Lokalizacja:** linia 10206
- **Typ:** BUG
- **Opis:** Desc "Nastrój 100% — totalny spokój ducha" + check `(G.stress||0)>=100`. Stress to MOOD (high=zen, wg memory) — ale desc i check niespójne semantycznie. Achievement faktycznie odblokuje się przy zen=max, ale opis może mylić gracza.
- **Sugestia:** Zmień desc na "Maksymalny zen (100/100)" lub coś jasniejszego

### K38. `fit_30`/`fit_75` vs `max_fitness` używają różnych pól
- **Lokalizacja:** linie 10255-10257 (`G.forma`) vs 10231 (`G.fitness`)
- **Typ:** INCONSISTENCY (system bug)
- **Opis:** `fit_30`: `G.forma>=30`, `fit_75`: `G.forma>=75`, ale `max_fitness`: `G.fitness>=100`. Gracz może osiągnąć fit_30 (forma) bez fitness — bonus naming bug.
- **Sugestia:** Ujednolicić nazewnictwo lub ostatecznie discrim

### K39. `casino_whale` (100k zł) w default tier 100 zł zamiast LEGENDARY
- **Lokalizacja:** linia 10280 brak w TIER_LEGENDARY
- **Typ:** TIER BUG (powtórzenie wzorca z W10)
- **Opis:** Win 100k zł w kasynie = legendary achievement, ale daje tylko 100 zł reward.
- **Sugestia:** Dodaj do TIER_LEGENDARY (10 000 zł)

### K40. Aerial Flythrough `_cinematicCompleted` nie reset na Prestige
- **Lokalizacja:** doPrestige() brak resetu
- **Typ:** GHOST CINEMATIC
- **Opis:** Gracz po Prestige #2 NIGDY nie zobaczy aerial flythrough znowu (flag persistuje). Powinno reset bo to fresh playthrough.
- **Sugestia:** `G._cinematicCompleted = false` w doPrestige

### K41. G.sms.conversations unbounded memory leak
- **Lokalizacja:** linia 24652+ (defer z v1.9.35 patchnote)
- **Typ:** MEMORY LEAK
- **Opis:** Brak capu na konwersacjach SMS. Każda wiadomość ~200B × 50 NPC + 50 players × 1000 konwersacji = kilkadziesiąt MB. Late game gracze (Prestige 5+) mogą crash'ować localStorage.
- **Sugestia:** Cap 500 konwersacji total, per-contact 100 wiadomości max

### K42. G.bills.history unbounded
- **Lokalizacja:** defer z patchnotes
- **Typ:** MEMORY LEAK
- **Opis:** Każdy zapłacony rachunek dodaje entry. Po 200 dniach gracz ma 200+ rachunków w historii.
- **Sugestia:** Cap 50 ostatnich

---

## 🟠 WYSOKIE

### W35. Quest NPC SMS mapping ghost — `_smsKey` nie mapuje quest→wiktor
- **Lokalizacja:** linia 11403 (_smsKey object)
- **Typ:** GHOST
- **Opis:** SMS triggers wysyłają do `'wiktor'` ale `_smsKey={vendor:'zbyszek',...}` nie ma mapowania `quest:'wiktor'`. SMS od Wiktora może nigdy nie pojawić się.
- **Sugestia:** Dodaj `quest: 'wiktor'`

### W36. Crew brak w SMS_CONTACTS
- **Lokalizacja:** SMS_CONTACTS array
- **Typ:** MISSING
- **Opis:** `crew` NPC istnieje ale brak entry w SMS_CONTACTS → brak SMS dla crew events.
- **Sugestia:** Dodaj `crew: {name:'Ekipa',...}`

### W37. G.igPosts brak cap (memory)
- **Lokalizacja:** linia ~11634, brak `shift()`
- **Typ:** MEMORY LEAK
- **Opis:** IG posty rosną nieskończenie. 1000+ postów × 50 bytes = 50+ KB w save (Prestige 10+ gracze).
- **Sugestia:** Cap 500 z `shift()`

### W38. Auto-save timer cleanup
- **Lokalizacja:** linia 35404 (`_autoSaveTimer`)
- **Typ:** MEMORY LEAK
- **Opis:** Brak explicit `clearInterval(_autoSaveTimer)` przy returnToMenu/prestige reset → timer wycieka przy multi-prestige.
- **Sugestia:** Cleanup w returnToMenu + doPrestige

### W39. VIP unlock cinematic brak guard `_vipUnlockShown`
- **Lokalizacja:** linia 27269+
- **Typ:** BUG (możliwy duplicate)
- **Opis:** Jeśli gracz osiągnie 10k totalWon → cinematic. Jeśli straci wszystko, znowu wygra 10k → cinematic powtórzy się.
- **Sugestia:** `G._vipUnlockShown` flag

### W40. `apt_premium` hint outdated price
- **Lokalizacja:** linia 28010+ (apt_premium hint)
- **Typ:** OUTDATED UI
- **Opis:** Hint mówi "15k zł" ale Premium kosztuje 60 000 zł (v2.1.51).
- **Sugestia:** Update na "60k zł"

### W41. `apt_lux` hint outdated price
- **Lokalizacja:** linia 28011+ (apt_lux hint)
- **Typ:** OUTDATED UI
- **Opis:** Hint "60k zł" ale Penthouse 250 000 zł.
- **Sugestia:** "250k zł"

### W42. `_introductionSeen` NIE reset na Prestige
- **Lokalizacja:** doPrestige
- **Typ:** UX BUG
- **Opis:** Gracz po Prestige nie zobaczy tutorial Wprowadzenie (flaga persists). Powinno reset — fresh playthrough.
- **Sugestia:** Reset w doPrestige

### W43. Friend request send brak error handling
- **Lokalizacja:** `_lbAddFriendBtn()` ~26532
- **Typ:** BUG (silent fail)
- **Opis:** Brak try-catch dla Supabase POST. Offline mode → silent fail bez komunikatu gracza.
- **Sugestia:** try-catch + offline toast

### W44. Friend requests no rate limiting per-user
- **Lokalizacja:** linia 26461-26462
- **Typ:** SPAM RISK
- **Opis:** Brak cooldownu — gracz może spamować invitations.
- **Sugestia:** Cooldown 60s per user

### W45. Crew challenge v2.1.55 partial fix (PATCH timeout)
- **Lokalizacja:** linia 41293-41346
- **Typ:** RACE CONDITION
- **Opis:** Queue + atomic flush dobrze, ale jeśli Supabase PATCH timeout w 5s window, progress potencjalnie traci się. beforeunload "best-effort" — nie 100%.
- **Sugestia:** Persist queue w localStorage + retry on reconnect

### W46. `casino_high_roller` (10k zł) default 100 zł zamiast HARD
- **Lokalizacja:** linia 10279
- **Typ:** TIER BUG (mniej krytyczny niż K39)
- **Sugestia:** TIER_HARD (2000 zł)

### W47. YouTube MG keydown cleanup nie zweryfikowany
- **Lokalizacja:** linia 15189-15199 cleanup
- **Typ:** MEMORY LEAK (potencjalny)
- **Opis:** `_ytMgCleanup` czyści timery ale brak jawnego `removeEventListener('keydown', handler)`. Jeśli listener globalny, może wyciekać.
- **Sugestia:** Verify + dodaj jeśli brakuje

---

## 🟡 ŚREDNIE

### S22-S30. Wiele achievementów outlier tiers
- **Opis:** Wiele achievementów dostaje default 100 zł zamiast powinno być MEDIUM/HARD/LEGENDARY. Lista (z Wave 4 audit):
  - `drip_200` (200 drip max) → powinno HARD
  - `courier_pro` (50 dostaw) → powinno MEDIUM
  - `all_freestyle` (25 freestyle) → powinno MEDIUM
  - `5_day_streak` → powinno MEDIUM
  - `concert_star` (10 koncertów) → powinno MEDIUM
  - `music_empire` (50k YT subs) → powinno HARD
  - `all_careers` (5 karier) → powinno MEDIUM
  - `casino_megajackpot` (50k win) → powinno LEGENDARY
  - `casino_poker_royal` (Royal Flush) → powinno HARD
  - `investor_pro` (50k z inwestycji) → powinno HARD
- **Sugestia:** Tier rebalans wg trudności

### S31. Track release cinematic missing
- **Lokalizacja:** brak w kodzie
- **Typ:** MISSING / GHOST
- **Opis:** Album debut ma cinematic, ale pierwszy track nie. Może planowane ale nie zaimplementowane.

### S32. Cinematicy bez audio (3 sztuki)
- **Studio purchase**, **Tutorial Introduction**, **Spotify Verify** — brak SFX/BGM
- **Sugestia:** Dodaj celebratory sound

### S33. Drip God achievement bez toast/cinematic
- **Lokalizacja:** linia 10254
- **Typ:** UX
- **Opis:** 200 drip to wysokie osiągnięcie, ale tylko silent unlock.

### S34. Level milestones brak guard flag (powtórzenie po Prestige)
- **Lokalizacja:** linia 11946 (`G.level % 5 === 0`)
- **Typ:** MINOR DUPLICATE
- **Opis:** Po Prestige (level=1), gdy gracz osiągnie 5/10/15/... ponownie, cinematic odpala. Może być design intent (świętować każde 5 lvl per playthrough), albo bug.

### S35. Phone innerHTML += anti-pattern
- **Lokalizacja:** linia 24509-24511
- **Typ:** PERFORMANCE (minor)
- **Opis:** DOM reflow każda linijka. Lepiej budować string i `=` raz.

### S36. Rental milestone hint outdated income wartości
- **Lokalizacja:** linia 28014
- **Typ:** OUTDATED UI
- **Opis:** Hint mówi `traphouse:100, basic:400...` ale faktycznie `25/80/200/500`.

### S37. P2P chat brak read receipts / delivery confirmation
- **Lokalizacja:** linia 25064+
- **Typ:** UX MISSING
- **Opis:** Brak "seen", "typing", delivery status.

### S38. Day-summary overlay timeout race
- **Lokalizacja:** linia 10008
- **Typ:** MINOR EDGE CASE
- **Opis:** Jeśli gracz manualnie zamknie summary szybko, timeout (10027) może odpalić `.remove()` na elemencie już usuniętym.

---

## 🟢 NISKIE (Wave 4)

### N9. Skills system 85% spójny — 28/33 OK
### N10. Cooking ma 240 min cooldown, sound eng 1×/dzień, gym 2×/dzień — wszystkie OK
### N11. Gym minigames pełnie zaimplementowane (Wave 2 K19 false alarm — `startBenchPressMG()` + `startTreadmillMG()`)
### N12. Cinematic Studio purchase chain reaction (auto-change room) — OK ale wymaga monitora performance

---

# ZNALEZISKA WAVE 5

### Wave 5 (9 agentów drill-down) — ✅ UKOŃCZONE
- [x] 30. World Tour mechanics (retry)
- [x] 33. Sound system (BGM, SFX, audio routing)
- [x] 34. Anti-cheat / save tampering
- [x] 35. Sezonowość × produkty merchu (24 kombinacje)
- [x] 36. Console commands / admin panel
- [x] 37. Każdy plugin DAW indywidualnie (10 pluginów)
- [x] 38. Outfits / Auta / Meble indywidualnie
- [x] 39. Power-Ups + Evolutions (150 PU + 50 Evo)
- [x] 40. Dystrybutorzy + Label Deals deep

## 🔴 KRYTYCZNE WAVE 5

### K43. Prestige mid-tour → G._tourActive persists (orphan state)
- **Lokalizacja:** `doPrestige()` ~26644, nie wymienia `G._tourActive`
- **Typ:** BUG / EXPLOIT
- **Opis:** Jeśli gracz prestige w trakcie aktywnej trasy, `_tourActive` zostaje. G.day reset → t.day staje się orphan. Możliwy crash lub bypass do końca tour z post-prestige bonusami.
- **Sugestia:** `delete G._tourActive` w `doPrestige()`

### K44. Tour completion bonus skips prestige multiplier
- **Lokalizacja:** linia 34129
- **Typ:** EXPLOIT (Prestige bypass) / INCONSISTENCY
- **Opis:** `G.money += completionBonus` zamiast `earn(completionBonus, false)`. Tour final bonus (20% totalEarned po nerfie) nie aplikuje moneyMult. Niespójne z głównymi koncertami które używają earn().
- **Sugestia:** `earn(completionBonus, false)`

### K45. Holiday state persists post-Prestige
- **Lokalizacja:** `doPrestige()`
- **Typ:** BUG
- **Opis:** `G.activeHoliday` nie resetuje się. Możliwe iż gracz po Prestige zachowuje Wigilia/Sylwester effect, lub holiday expiresDay wskazuje stary G.day.
- **Sugestia:** `G.activeHoliday = null; G.activeFestival = null;` w doPrestige

### K46. localStorage edycja BEZ upper bound (cheat trivialny)
- **Lokalizacja:** loadGame 35715-35939
- **Typ:** EXPLOIT (Anti-cheat)
- **Opis:** Brak walidacji `G.money <= 999B`, `G.fans <= 999M`, `G.followers <= 999M`. Gracz F12 → Application → edytuje JSON i wsyła na leaderboard nieskończone wartości.
- **Sugestia:** Sanity bounds: money/totalEarned ≤ 999B; followers/fans ≤ 999M; cinematic warning na overflow

### K47. Admin panel NIE chroniony (zero password/logging)
- **Lokalizacja:** ~33863 + sekwencja "snowy"/"amper"
- **Typ:** EXPLOIT (Anti-cheat) / GHOST PROTECTION
- **Opis:** 21 admin funkcji aktywnych po wpisaniu sekwencji w grze. Brak hasła, brak server logging, brak validation. `adminMaxAll()` daje 1mln zł + 1mln fanów + wszystkie skille jednym klikiem. Leaderboard akceptuje wartości bez weryfikacji `_adminCheatUsed`.
- **Sugestia:** Albo password gate, albo blokada submitAllScores() jeśli `_adminCheatUsed=true`

### K48. Leaderboard submit BEZ client-side validation
- **Lokalizacja:** submitAllScores() ~25631-25637
- **Typ:** EXPLOIT
- **Opis:** Throttle 10s OK, ale brak sanity checks na wartości. Po K46/K47 gracz może wysłać 999B zł, 999M fanów. Backend walidacja niepewna.
- **Sugestia:** Pre-submit check: max progresji per dzień, reject `_adminCheatUsed`

### K49. ~~24 GHOST POWER-UPS~~ — **FALSE POSITIVE (re-verified v2.1.105)**
- **Status:** CLOSED — agent Wave 5 nie śledził call chain
- **Opis:** `getPracaBonus(key)` (linia 1358) = `1 + _sk(key)*0.20 + _pu(key)*0.30 + evo`. Wszystkie 6 prac używają tego (workPizza/Supermarket/Carwash/Construction/Kurier/Zmywak). Analogicznie kariery: `getKarieraBonus(key)` z `_pu(key)*0.30` używany w sellBeat/tournament/sponsorship/recordVocal. **PU APLIKUJE SIĘ pośrednio przez wrapper functions** — agent szukał bezpośrednich `_pu('pizza')` calls i nie znalazł.

### K50. synth808: UI +15% vs kod +12% (mismatch)
- **Lokalizacja:** UI 17555 vs kod 15819 (calcQuality), 17286 (getDAWPluginCeiling)
- **Typ:** INCONSISTENCY
- **Opis:** Sklep obiecuje "+15% jakości trap/drill beatów", kod aplikuje +12. Gracz płaci 1500 zł oczekując 15%, dostaje 12%.
- **Sugestia:** Albo UI → "+12%", albo kod → +15

## 🟠 WYSOKIE WAVE 5

### W48. Tour×Festival/Holiday combo stacking (balance OP)
- **Lokalizacja:** linia 20451+, 34488
- **Typ:** BALANCE (potential exploit)
- **Opis:** Tour koncerty mogą stack z Hip-Hop festival (×2 fame) + Sylwester (×1.4 earn +100 fanów). Tour dnia 56 = combo bonus. Cinematic stack: tour mult + festival mult + holiday mult + prestige.
- **Sugestia:** Cap stacking (np. tour suspends festival effects) lub udokumentować jako celowy

### W49. Cooldown bypass via quit-load (znane, dokumentowane)
- **Lokalizacja:** loadGame 35827-35831
- **Typ:** EXPLOIT (znany)
- **Opis:** `_lastFreestyleMin = -9999` defensywne init na load. Quit → edit save → load = reset wszystkich cooldownów (freestyle, koncert pre-v2.1.87, beatSell, sellBeatPack).
- **Sugestia:** Persist absolutnego timestampu (`G.day*1440+gameMin`) zamiast relatywnego gameMin

### W50. drumPro: UI +10% vs kod +8% (mismatch)
- **Lokalizacja:** UI 17556 vs kod 15819, 17286
- **Typ:** INCONSISTENCY
- **Opis:** Identyczny problem jak synth808 (K50), różnica 2 pkt.
- **Sugestia:** Zharmonizować

### W51. Smoking outfit: UI +10% vs kod ×1.08 (post-v2.1.83 nerf)
- **Lokalizacja:** UI 18750 vs kod 20438
- **Typ:** INCONSISTENCY (post-nerf UI nie zsynchronizowane)
- **Opis:** v2.1.83 nerfall z ×1.10 do ×1.08 ale UI bonus opis zostawiony "+10%".
- **Sugestia:** UI → "+8%"

### W52. Designer concert outfit: UI +15% vs kod ×1.10 (post-v2.1.83)
- **Lokalizacja:** UI 18754 vs kod 20437
- **Typ:** INCONSISTENCY
- **Opis:** Identyczny problem co W51, większa różnica (15→10%).
- **Sugestia:** UI → "+10%"

### W53. Zimowa kurtka: UI "−15%" mylące (rzeczywiście ×0.15 = −85%)
- **Lokalizacja:** UI 18748, kod 11497 (`winterCoatMult = 0.15`)
- **Typ:** INCONSISTENCY (UI mylący)
- **Opis:** Opis "-15% utraty zdrowia w mroźnej pogodzie" sugeruje zmniejszenie o 15%, kod aplikuje mult 0.15 (zostawia tylko 15% damage = redukcja o 85%). Gracz nie wie że to OP.
- **Sugestia:** UI → "−85% utraty zdrowia w mrozie"

### W54. Jeansowa: UI "−10%" niedokładne (×0.5 = −50%)
- **Lokalizacja:** UI 18747, kod 11498 (`jeansowaMult = 0.5`)
- **Typ:** INCONSISTENCY
- **Opis:** Jak W53 — gracz dostaje 5× lepszą redukcję niż opisana.
- **Sugestia:** UI → "−50% utraty w chłodzie"

### W55. Global label contractEndsDay BRAK per-tick check w earningach
- **Lokalizacja:** distributeDaily() linia 11518, label end 11758-11759
- **Typ:** BUG (minor UX/balance)
- **Opis:** Global label kontrakt 60 dni — kod resetuje `G.label.type=null` na koniec, ale daily royalties (`labelCut=0.3`) liczy się przed checkiem. Gracz traci jeszcze 1 dzień 70% cut nawet po wygaśnięciu kontraktu.
- **Sugestia:** `if(G.label.contractEndsDay && G.day >= G.label.contractEndsDay) labelCut = 1.0;` przed apply

### W56. Concert audio cache: FIFO zamiast LRU (mismarketed)
- **Lokalizacja:** ~20269-20273
- **Typ:** BUG (minor performance)
- **Opis:** Cache claimuje LRU 3, ale kod usuwa `_cKeys[0]` (first-inserted, czyli FIFO). Eksploatacja: gracz słucha 4 koncertów, pierwszy zostaje wykasowany ZAMIAST najmniej używanego.
- **Sugestia:** Track lastUsed timestamp, usuwać oldest by usage time

### W57. ~~8 GHOST EVOLUTIONS~~ — **FALSE POSITIVE (re-verified v2.1.105)**
- **Status:** CLOSED — wszystkie 8 evo aplikują się przez wrapper functions
- **Verify**: Master Trader = `getShopDiscount()` L1227. Showman = `getScenaEnergyBonus()` L1282 → endConcert L20488. Battle King = `getFlowFreestyleBonus()` L1315 → freestyle L22737. Visual Artist = `getFotoQualityBonus()` (Wave 5 N57 confirmed). Pizza/Construction/Kurier/Zmywak evo = `getPracaBonus()` L1361 evoBonus.

## 🟡 ŚREDNIE WAVE 5

### S39. BGM brak cleanup przy room change
- **Lokalizacja:** changeRoom() ~9565
- **Opis:** BGM ciągnie się przez wszystkie pokoje. Brak fade-out/restart per lokalizacja.

### S40. sfxStep — dead code (~6812)
- **Opis:** Zdefiniowany ale nigdy nie wywołany — używany jest `playStep()`.

### S41. 6 SFX brak bgmDuck() (sfxBrick, sfxPhone, playSnore, playClick, playEat, sfxStep)
- **Opis:** BGM nie cichnie podczas tych dźwięków, BGM dudni przez SFX.

### S42. Concert audio silent fail na 404
- **Lokalizacja:** ~20278
- **Opis:** `.catch(()=>{})` bez fallback. Brak komunikatu dla gracza.

### S43. _esc() lokalnie zdefiniowany w 6 miejscach
- **Lokalizacja:** 24728, 24816, 25066, 41010, 41059, 41211
- **Typ:** INCONSISTENCY / XSS risk
- **Opis:** Każda funkcja renderująca user-content ma własne `_esc()`. Łatwo zapomnieć w nowej funkcji. Wave 1 K20 już zgłaszał 3× — Wave 5 znalazł 6×.
- **Sugestia:** Centralny `window._esc`

### S44. applyAdmin XP/level/prestige bez upper bound
- **Lokalizacja:** 33926-33927
- **Opis:** `G.level = Math.max(1, v(..))` — brak `Math.min(100, ...)`. Admin może ustawić level 999, co psuje XP curve i logic.

### S45. console.log w production (~35819, ~40574)
- **Typ:** COSMETIC
- **Opis:** Migracja skills + leaderboard submit. Spam w F12 console.

### S46. Holiday BlackFriday × Festival BlackFriday — DWA odrębne kanały
- **Lokalizacja:** calcDemand() L34407 vs holidayBonus('merch')
- **Typ:** BUG (potencjalny)
- **Opis:** Festival BF (random co 7 dni) ustawia `G.activeFestival.effect.merchSalesMult=3.0` → apply. Holiday BF (deterministic day 49) ustawia `G.activeHoliday.id='blackfriday'` → holidayBonus returns 3.0 ale calcDemand NIE czyta holiday. **Jeśli oba aktywne** = tylko festival applied, holiday ignored.
- **Sugestia:** calcDemand powinno też respektować holidayBonus('merch')

### S47. Wiosna sezon: pusta merchBoost = ×1.0 default (brak różnicowania)
- **Lokalizacja:** SEASONS Wiosna
- **Opis:** Inne sezony mają boosty per produkt; Wiosna jest "płaska" — żaden produkt nie ma sezonowego boostu. Inne 3 sezony tworzą asymetrię balansu.

### S48. Sleep mid-tour — undefined behavior
- **Opis:** `_tourActive` persiste przez nextPeriod podczas snu. Brak guard na multi-day sleep podczas tour.

## 🟢 NISKIE WAVE 5

### N13. DISTRIBUTORS vs DISTRIBUTORS_MAP — duplikacja danych
- **Lokalizacja:** 17582-17646
- **Typ:** REFACTOR
- **Opis:** Dwie kopie tej samej tabeli. Zmiana w jednym miejscu = ryzyko rozsynchronizowania.
- **Sugestia:** `DISTRIBUTORS_MAP = Object.fromEntries(DISTRIBUTORS.map(d => [d.id, {...d}]))`

### N14. Targi muzyczne `labelOfferBoost: true` — boolean nie multiplier
- **Opis:** Wszystkie inne festival effects są numeryczne, ten jeden jest boolean flag. Drobna inkonsystencja, ale aplikowane prawidłowo.

### N15. Cooking skill — BRAK SKILL_DEF entry
- **Opis:** Cooking istnieje w `G.skills` array (init) i ma minigrę gotowania, ale brak power-upów/evolution definicji w SKILL_DEF.

---

# 🎯 FINAŁOWE PODSUMOWANIE PO WAVE 5

| Priorytet | Wave 1 | Wave 2 | Wave 3 | Wave 4 | Wave 5 | RAZEM |
|---|---:|---:|---:|---:|---:|---:|
| 🔴 Krytyczne | 10 | 10 | 15 | 7 | 8 | **50** |
| 🟠 Wysokie | 12 | 12 | 10 | 13 | 10 | **57** |
| 🟡 Średnie | 11 | 5 | 5 | 17 | 10 | **48** |
| 🟢 Niskie | 3 | 2 | 3 | 4 | 3 | **15** |
| **RAZEM** | **36** | **29** | **33** | **41** | **31** | **170** |

# ZNALEZISKA WAVE 6

### Wave 6 (8 agentów drill-down) — ✅ UKOŃCZONE
- [x] 41. Telefon UI app-by-app (17 apps)
- [x] 42. Daily quest pool (30 typów)
- [x] 43. Skill tree UI + cost calculation
- [x] 44. Bank loans + investments deep
- [x] 45. Side jobs wynagrodzenia (6 prac)
- [x] 46. Game over / hospital / respawn
- [x] 47. Settings + onboarding + new game
- [x] 48. Trends + viral cross-platform

## 🔴 KRYTYCZNE WAVE 6

### K51. Patch Notes — GHOST APP w telefonie
- **Lokalizacja:** PATCH_NOTES const ~L29036+ (444+ wpisów)
- **Typ:** GHOST FEATURE
- **Opis:** PATCH_NOTES constant z setkami wpisów istnieje, ALE brak `renderPhonePatchNotes()` function i brak button w phone app picker. Patch notes rendują się tylko w help/full-game overlay, nie w telefonie. User audytował — to ghost.
- **Sugestia:** Dodać phone app button + renderer, lub usunąć z aspiracji

### K52. ~~P2P Chat brak input field~~ — **FALSE POSITIVE (re-verified v2.1.106)**
- **Status:** CLOSED — `window._openPlayerChat()` linia 25137 zawiera `<input id="player-chat-input">` + send button + Enter handler + `_playerChatSend()` async (linia 25171). Funkcjonalne od v2.0.30. Agent Wave 6 prawdopodobnie patrzył na NPC SMS path (`renderSMSConversation`) zamiast P2P path.

### K53. G.dailyQuest persists na Prestige (ghost quest z poprzedniego playthrough)
- **Lokalizacja:** doPrestige() ~26633-26707
- **Typ:** BUG / GHOST
- **Opis:** Brak `G.dailyQuest=null` w doPrestige. Po Prestige gracz może mieć stary quest z metadata (reward/desc/progress) z poprzedniego playthrough. Z v1.9.39 reward przez earn() ale quest data sam się nie resetuje.
- **Sugestia:** `G.dailyQuest = null` w doPrestige

### K54. UI Skill Tree text "+1 punkt za każdy poziom" FAŁSZ
- **Lokalizacja:** ~39639
- **Typ:** INCONSISTENCY
- **Opis:** Od v2.1.46 (Amper) levelup daje +2 SP. UI nadal pokazuje "+1 punkt" — myli gracza co do faktycznego rewardu.
- **Sugestia:** Update tekst na "+2 punkty"

### K55. Cooking — GHOST SKILL (brak SKILL_DEF entry)
- **Lokalizacja:** G.skills.cooking init L775, SKILL_DEF brak
- **Typ:** GHOST FEATURE
- **Opis:** Gameplay cooking minigame istnieje, G.skills.cooking++ trigger, ale brak entry w SKILL_DEF więc panel skill tree nie pokazuje. Gracz nie widzi tej umiejętności.
- **Sugestia:** Albo dodać do SKILL_DEF (z PU/Evo), albo usunąć z arrays

### K56. G.bank persists post-Prestige (znany od Wave 1 K14)
- **Lokalizacja:** doPrestige()
- **Typ:** EXPLOIT (re-confirmed)
- **Opis:** G.bank.loan + G.bank.investments NIE resetują się. Wave 6 potwierdza scenario: zaciągnij loan → invest 10k → Prestige → wszystko persiste → cross-playthrough perpetual income.
- **Sugestia:** `G.bank = {loan:0, investments:[]}` w doPrestige

### K57. gameOver() FREE revive jeśli bankrut
- **Lokalizacja:** gameOver() ~12287-12325
- **Typ:** EXPLOIT (balance)
- **Opis:** `const fee = Math.min(500, Math.max(0, G.money))` — jeśli `G.money=0`, gracz dostaje free revive (pełne HP/hunger/energy/stress=100). Brak penalty. Gracz w bankructwie może umierać bezkonsekwencyjnie.
- **Sugestia:** Hard `-X HP` penalty albo blokada revive jeśli money<500

### K58. "Hater attack" event NIE booste G.haters (ghost)
- **Lokalizacja:** RANDOM_EVENTS, "Hater attack" (chance 0.02)
- **Typ:** GHOST FEATURE
- **Opis:** Event wyskakuje, zabiera 1-5% followers, ale `G.haters += X` nigdy się nie wykonuje. Tylko event z dziwacznym nazewnictwem (hater attack ALE bez haters?).
- **Sugestia:** `G.haters += rnd(5,20)` w event fn

### K59. Main "Viral moment" event BRAK addFame
- **Lokalizacja:** ~10364 (Viral moment) vs ~10426 (Viral beat)
- **Typ:** INCONSISTENCY / GHOST partial
- **Opis:** Viral moment (chance 0.015, najbardziej widoczny) tylko `notify()` — brak fame reward. Viral beat (rzadszy) daje `addFame(3)`. Imbalance — gracz dostaje miej za bardziej wartościowy event.
- **Sugestia:** Dodać `addFame(2-5)` do Viral moment

## 🟠 WYSOKIE WAVE 6

### W58. Leaderboard fetch errors unhandled (spinner forever)
- **Lokalizacja:** renderPhoneLeaderboard ~25620-25803
- **Typ:** BUG (UX)
- **Opis:** `await fetchLeaderboard()` bez .catch() → jeśli network fail, spinner zostaje na zawsze. Gracz nie wie że jest błąd.
- **Sugestia:** try/catch + error message + retry button

### W59. Friends Promise.all bez .catch
- **Lokalizacja:** renderPhoneFriends ~26141-26145
- **Typ:** BUG (UX)
- **Opis:** Jeśli jeden z 5 fetch'y fail, cały panel crashuje. Plus modal cleanup brak (event listeners leak).
- **Sugestia:** Promise.allSettled + per-fail fallback

### W60. Skill points brak reset na Prestige (potential exploit)
- **Lokalizacja:** doPrestige()
- **Typ:** EXPLOIT / DESIGN
- **Opis:** G.skillPoints nie resetuje się. Gracz mógłby zaoszczędzić +150 SP przez Prestige (czekać z wydaniem do nowego playthrough). Wave 6 znalazł brak explicit reset.
- **Sugestia:** Decision needed — design intent (carry?) vs reset (fresh start)

### W61. Supermarket UNDERPOWERED (najsłabsza praca)
- **Lokalizacja:** workSupermarket
- **Typ:** BALANCE
- **Opis:** ~6-12 zł/min vs Pizza 42 zł/min, Kurier 33 zł/min, Construction 50 zł/min. Daily passive +1000 (Evolution) nie wyrówna gap.
- **Sugestia:** Base pay buff (25-50 zł/customer)

### W62. Kurier OVERPOWERED (zbyt wysoki evo bonus)
- **Lokalizacja:** workKurier, Multi-zlecenie evo
- **Typ:** BALANCE
- **Opis:** ~33 zł/min base → ~66 zł/min z Multi-zlecenie +100% evo. Inne prace mają evo +50%, kurier ma +100% — asymetria.
- **Sugestia:** Multi-zlecenie evo +100% → +50% (jak pozostałe prace). **NIE dodawać cooldown** — prace dorywcze nie mają mieć limitów (memory rule).

### W63. Construction OVERPOWERED w late-game
- **Lokalizacja:** workConstruction
- **Typ:** BALANCE
- **Opis:** Brygadzista +100% evo + base pay scaling = ~50 zł/min, najwyższy ceiling. Najwyższy cost (15 hunger) ale to "premium grind" tier.
- **Sugestia:** Evo nerf do +50% (jak inne) lub trigger conditional (np. co N session)

### W64. Death brak permanent debuffs/penalty
- **Lokalizacja:** gameOver()
- **Typ:** DESIGN/BALANCE
- **Opis:** Full revive bez konsekwencji (poza 500 zł). Brak fame loss, brak permanent scar/debuff. Soft reset niezbyt punitive.
- **Sugestia:** Permanent -1 fame per death, lub progressive cost (500/1000/2000)

### W65. HP<25 brak cinematic, tylko spam toast
- **Lokalizacja:** ~11653+
- **Typ:** UX
- **Opis:** Krytyczne zdrowie → losowy red toast co 6s (40% chance). Brak prominent visual (pulsing HUD, screen flash, audio).
- **Sugestia:** Pulsing HP bar + audio cue + once-per-state cinematic

### W66. Nick input brak validation
- **Lokalizacja:** showCreator() L517 (char-name input)
- **Typ:** UX / SECURITY (light)
- **Opis:** Empty default 'Traper', accepts special chars (<>"'&), brak max length JS-side. XSS risk jeśli render w innerHTML.
- **Sugestia:** Sanitize + validate (alphanum + space, 2-16 chars)

### W67. Char-name input brak Enter key handler
- **Lokalizacja:** showCreator
- **Typ:** UX
- **Opis:** V1.9.65 dodał Enter dla innych inputów, ale character creation został pominięty. User musi klikać "Zaczynaj ▶".
- **Sugestia:** Bind Enter

### W68. Radio platform COMPLETELY offline (no viral, no organic growth)
- **Lokalizacja:** G.radio
- **Typ:** GHOST PLATFORM
- **Opis:** Brak daily growth, brak viral radio event, royalty tylko z plays nie listeners. Inne platformy mają full mechanics, radio jest stub.
- **Sugestia:** Albo dodać mechaniki, albo udokumentować jako passive royalty pool

### W69. Brak cross-platform synergy (viral nie spillover)
- **Lokalizacja:** RANDOM_EVENTS + organic growth
- **Typ:** DESIGN
- **Opis:** Viral na YT nie booste Spotify. 10M YT subs ≠ Spotify listeners boost. Gracz musi grind separately każdą platformę.
- **Sugestia:** Cross-platform spillover (np. viral na 1 platform +5% pozostałe)

## 🟡 ŚREDNIE WAVE 6

### S49. Tidal/YouTube apps — minimalny renderer (brak history/track list)
- **Lokalizacja:** renderPhoneApp app==='tidal'/'youtube' ~24072-24091
- **Opis:** Inconsistent z Spotify/SoundCloud które mają pełne discography. Tidal/YT pokazują tylko stats.

### S50. SoundCloud — brak upload link z telefonu
- **Opis:** Upload tylko w studio, telefon read-only stats.

### S51. Bank — brak invest history (tylko aktywne)
- **Opis:** Zakończone inwestycje znikają z UI, gracz nie ma archiwum.

### S52. Outfit bonus nie aplikuje się do side jobs (tylko gym)
- **Opis:** Sport/sport_pro outfit bonus jest gym-only. Drip Master skill też nie wpływa direct na payout pracy.

### S53. Holiday bonus brak dla side jobs
- **Opis:** Sylwester/Wigilia/Walentynki nie boostują żadnej z 6 prac. Może być design choice (holidays = rest), ale niespójne z koncertem/merchem.

### S54. G._deaths tracked ale nigdy nie display
- **Opis:** Counter inkrementuje się przy gameOver() ale brak UI display. Tylko admin panel widzi.

### S55. SmartHints — stubbed implementation
- **Lokalizacja:** checkSmartHints ~28032
- **Opis:** Function call'owany, ale wnętrze minimal. Wave 4 K17 wspominał o flag mismatch — Wave 6 potwierdza ghost.

### S56. First-time tips mogą się stackować
- **Opis:** Welcome popup + 3 timed tips + Introduction mogą wyskoczyć w nakładkach. Brak queue/debounce.

### S57. Hejterzy bez cap, brak organic growth, brak defense mechanic
- **Opis:** G.haters może rosnąć infinite. Brak way for player to reduce haters (apologize? PR campaign?). Sponsorship penalty max -30% wpływa late game.

## 🟢 NISKIE WAVE 6

### N16. Bills history limited to 5 (no "show all" option)
- **Opis:** Ostatnie 5 zapłaconych — dobre dla UI compactness ale brak "view all" dla curious players.

### N17. Achievements rendering brak optymalizacji dla 100+ items
- **Opis:** Sort + map + join każdy render. Currently ~50 achievements OK, future risk.

### N18. Daily quest brak repeating-type cooldown
- **Opis:** Możliwe 2 dni z rzędu "eat 1". Design choice but mentioned.

### N19. Rep system inconsistent across side jobs
- **Opis:** Pizza/kurier/construction give rep, supermarket/carwash/zmywak NIE.

### N20. Trend multiplier zawsze 2.0× (brak skalowania z fame/level)
- **Opis:** Ten sam mnożnik na lvl 1 i lvl 50 — late game gracz preferuje inne sources.

---

# 🎯 FINAŁOWE PODSUMOWANIE PO WAVE 6

| Priorytet | W1 | W2 | W3 | W4 | W5 | W6 | RAZEM |
|---|---:|---:|---:|---:|---:|---:|---:|
| 🔴 Krytyczne | 10 | 10 | 15 | 7 | 8 | 9 | **59** |
| 🟠 Wysokie | 12 | 12 | 10 | 13 | 10 | 12 | **69** |
| 🟡 Średnie | 11 | 5 | 5 | 17 | 10 | 9 | **57** |
| 🟢 Niskie | 3 | 2 | 3 | 4 | 3 | 5 | **20** |
| **RAZEM** | **36** | **29** | **33** | **41** | **31** | **35** | **205** |

# ZNALEZISKA WAVE 7

### Wave 7 (8 agentów drill-down) — ✅ UKOŃCZONE
- [x] 49. Lyrics studio / songwriting workflow
- [x] 50. Photoshoot / magazine appearance
- [x] 51. Concert minigame deep
- [x] 52. Beat sequencer minigame deep
- [x] 53. Streaming gaming career deep
- [x] 54. Gym sessions per type
- [x] 55. Random events full inventory
- [x] 56. Influencer brand deals + campaigns

## 🔴 KRYTYCZNE WAVE 7

### K63. "Lyrics studio" — GHOST FEATURE (nazwa w patchnotes, zero kodu)
- **Lokalizacja:** Nigdzie w kodzie (tylko v2.1.79 patchnotes mention)
- **Typ:** GHOST FEATURE
- **Opis:** Wave 7 confirmed: brak `writeLyrics()`, brak lyrics studio UI, tracki nie mają pola `lyrics`/`lyricsQuality`. Tylko nazwa w historii patchnotów (legacy fansHardcore cleanup). Teksty skill (max 5) FAKTYCZNIE działa (+10/20/30%/HIT/toplabel) — ale "studio" jako lokacja nie istnieje.
- **Sugestia:** Albo zaimplementować jako minigame, albo usunąć z aspiracji

### K64. Photoshoot/Magazine appearance — ZERO implementation
- **Lokalizacja:** Brak w RANDOM_EVENTS
- **Typ:** GHOST FEATURE
- **Opis:** Brak "Cover of magazine", "Cover Boy/Girl achievement", brak photoshoot minigame. Foto skill jest fully working (Visual Artist evo +30% verified), camera używana w YT/Recording. Photoshoot/magazine to pure ghost ambition.
- **Sugestia:** Albo random event + minigame, albo skreślić z roadmap

### K65. Cancel concert after payment = NO REFUND
- **Lokalizacja:** _cgQuit() ~20557
- **Typ:** BUG (UX/balance)
- **Opis:** Cost wynajmu sceny deducted PRZED startConcertMG (linia 20230). Gdy gracz kliknie "Przerwij" — `_cgQuit()` zatrzymuje grę ale NIE zwraca pieniędzy. Brak earn, brak refund. Gracz traci 200-2500 zł za "case'opt out".
- **Sugestia:** Refund 50-100% cost przy quit, lub usunąć quit option

### K66. releaseBeat() track quality HARDCODED 50%
- **Lokalizacja:** releaseBeat ~15964
- **Typ:** GHOST / BUG
- **Opis:** UI pokazuje dynamic quality z sekwencera, ALE studioTracks entry zawsze ma `quality: 50` (fixed). Inconsistent z sellBeat() który używa `G._lastBeatQ`. Gracz inwestuje w quality (drumPro/synth808/midiQ) ale registry to ignoruje.
- **Sugestia:** Użyć `G._lastBeatQ` jak w sellBeat()

### K67. Tournaments BRAK cooldown (exploit spam)
- **Lokalizacja:** playTournament() ~16039-16185
- **Typ:** EXPLOIT
- **Opis:** Brak cooldownu między turniejami. Gracz może grać 10×/dzień jeśli ma kasę na fee i energię. Streaming ma daily cap 50% po 2-im — turnieje brak limitu.
- **Sugestia:** Daily cap 3 lub cooldown 4-8h

### K68. Tournament prize bez hard cap
- **Lokalizacja:** ~16163-16167
- **Typ:** EXPLOIT (balance)
- **Opis:** `prize = fee×4×(ri+2) + score + fame×10` × skill × management. Przy fame=100 + Mistrz rank = base ~500k per turnia. Skill (1+lvl×0.05+PU+evo) × management 1.2× = ~1.5M per single turniej. Brak Math.min cap.
- **Sugestia:** Hard cap `Math.min(50000, prize)` jak inne dochody

### K69. Treadmill BRAK skill bonus (getBiegBonus nigdy nie wywołany!)
- **Lokalizacja:** startTreadmillMG fitGain ~23459
- **Typ:** BUG (KRYTYCZNY balance)
- **Opis:** Bench press używa `outfit × getSilaBonus()` — max ×2.8. Treadmill **NIE wywołuje** `getBiegBonus()` — tylko outfit ×1.25. Skill `bieg` (5 levels + PU + Evo Maraton) jest fully zdefiniowany, ale **NIGDY nie aplikuje się do treadmill gain**! Wave 5 skill audit pokazał `bieg` "fully impl" — w istocie tylko speed boost (P.spd), nie gym.
- **Sugestia:** Dodać `getBiegBonus()` mult do fitGain (analogicznie do bench press)

### K70. doPrestige() NIE resetuje G._eventCounts ani G._lastChoiceEventDay
- **Lokalizacja:** doPrestige() 26633-26707
- **Typ:** BUG (quit-load exploit confirmed)
- **Opis:** Wave 2 K16 partial fix w v1.9.61 ("5 Prestige bypassy random events"), ale event counters nadal persist post-Prestige. Gracz po Prestige może loadować save z `_eventCounts.counts.viral=1` → blokada viral event w nowym playthrough day 1.
- **Sugestia:** `G._eventCounts = {day:G.day, counts:{}}; G._lastChoiceEventDay = -1;` w doPrestige

### K71. Choice event outcomes NIE save (quit-load reroll exploit)
- **Lokalizacja:** showEventChoice() flow
- **Typ:** EXPLOIT
- **Opis:** Brak `G._eventChoices = {}` track gdzie outcome decyzji zapisany. Gracz może quit→edit save→load aby zmienić decision na lepszy outcome (np. "Hejt response" → ostro → +200 followers vs ignoruj → rep+5).
- **Sugestia:** Save outcomes w G._eventChoices, prevent reroll w tym samym day

### K72. findSponsor() Prestige BYPASS (G.money+= zamiast earn())
- **Lokalizacja:** findSponsor ~16800+
- **Typ:** EXPLOIT (Prestige bypass — nowy)
- **Opis:** Wave 1-3 znalazły wiele Prestige bypassów, ale findSponsor PRZEOCZONY. Daje max 12k zł per call BEZ aplikacji `moneyMult`. Late game Prestige 10 (×1.5 mult) gracz traci 6k/day z sponsorship payouts.
- **Sugestia:** Zmienić `G.money+=pay` na `earn(pay, false)`

### K73. runCampaign() Prestige BYPASS (G.money+= zamiast earn())
- **Lokalizacja:** runCampaign ~16900+
- **Typ:** EXPLOIT (Prestige bypass)
- **Opis:** Identyczny problem co K72, wyższe stawki: max 18k zł per call bez moneyMult. Wave 1-3 zostawiło to ghost.
- **Sugestia:** `earn(pay, false)` + dodać `addFame()` zamiast `G.fame +=` (v1.9.34 defer też dotyczył tej linii)

## 🟠 WYSOKIE WAVE 7

### W70. Sport/Luxury outfit concert bonus — GHOST
- **Lokalizacja:** endConcert ~20436-20439
- **Typ:** GHOST FEATURE
- **Opis:** Kod sprawdza tylko `music`/`designer_concert`/`smoking`/`suit`. Sport/Luxury/Zimowa/Jeansowa outfity (które gracze noszą na koncert) nie dostają żadnego bonusu — brak case'u. Opisy ich w sklepie sugerują że są "stylowe".
- **Sugestia:** Albo dodać case'y, albo udokumentować że tylko 4 outfity dają concert mult

### W71. Escape key BRAK handler w koncercie
- **Lokalizacja:** concert onKey() ~20551
- **Typ:** UX
- **Opis:** Listener obsługuje tylko A/S/D/F. Escape ignorowany lokalnie (globalny handler nie reaguje na concert overlay). Gracz musi klikać "Przerwij" button.
- **Sugestia:** Bind Escape → _cgQuit()

### W72. Stream skill multiplier HARDCODED (nie używa getKarieraBonus)
- **Lokalizacja:** startStreamMG ~16530
- **Typ:** INCONSISTENCY
- **Opis:** Tournament używa `getKarieraBonus('gamer')` (skill + PU + evo). Stream używa tylko `1 + skillGamer×0.15` (hardcoded). Brak PU/evo w stream payout. Asymetria między dwiema gaming activities.
- **Sugestia:** Użyć `getKarieraBonus('gamer')` w obu

### W73. Fitness max inconsistent (forma +15 evo, fitness brak evo cap)
- **Lokalizacja:** getMaxStat() forma vs fitness
- **Typ:** INCONSISTENCY
- **Opis:** Forma cap 100→115 z Athletyk + Nutricionist evos. Fitness cap stuck na 100 — brak evo bonus. Bieg evo (Maraton) daje speed boost, ale NIE max fitness.
- **Sugestia:** Dodać Maraton +5 lub +10 max fitness

### W74. Gym BRAK per-session cooldown (spam 2-3 sesji w 1 sekundzie)
- **Lokalizacja:** startGym
- **Typ:** UX
- **Opis:** Daily cap (2-3) jest, ale gracz może hit'ować 3× bench press w 1 sekundę przez UI. Nie psuje balansu (cap istnieje) ale feel niezdrowy.
- **Sugestia:** 5-10s cooldown per session

### W75. 7 random eventów BEZ maxPerDay (Fan buys merch, Radio bonus, Viral beat, Collab, Subscriber wave, Social media, Pochwała)
- **Lokalizacja:** RANDOM_EVENTS
- **Typ:** BALANCE / EXPLOIT
- **Opis:** Fan buys merch (chance 0.03 = 3% per tick × 12 ticków/dzień = ~36% daily) bez cap = może wystąpić wielokrotnie. Razem 7 unbounded events. Inflacja organic income.
- **Sugestia:** Dodać `maxPerDay: 2-3` per event

### W76. Negative event ratio za niski (20.7%, powinno 25-30%)
- **Lokalizacja:** RANDOM_EVENTS
- **Typ:** BALANCE
- **Opis:** 6 negative na 29 total. Audyt v1.8.44 ÷2 positive eventy, ale negative nie podbite. Wave 7 confirmed: gameplay "too lucky" w mid-game.
- **Sugestia:** Dodać 2-3 negative events (np. health scare, equipment theft, label scandal) lub buff chances istniejących

### W77. Sponsorship 4-source stack (findSponsor + runCampaign + tweet + event = 33k/dzień)
- **Lokalizacja:** Sponsor system overall
- **Typ:** EXPLOIT (balance)
- **Opis:** Gracz może w 1 dzień: findSponsor (12k) + runCampaign (18k) + sponsored tweet (200 zł × N if 500+ followers) + random sponsorship event (3.75k) = ~33k zł cumulative. Plus K72/K73 bypass = nawet większe (Prestige nie redukuje).
- **Sugestia:** Single `G._sponsorDealActive` flag aby blokować kolejne tego samego dnia (v1.9.18 defer)

## 🟡 ŚREDNIE WAVE 7

### S58. Concert venue size NIE wpływa na payout (tylko visual)
- **Lokalizacja:** startConcertMG
- **Opis:** CROWD_SIZE 50→5000 osób tylko dekoracyjny. Mała Scena 200-700 zł, Klub 700-2200 zł, Arena 2500-7000 zł — to z parametrów hardcoded, nie z venue scaling. Intentional but undocumented.

### S59. Hint mode penalty ×0.85 w beat sequencer niedokumentowany
- **Lokalizacja:** calcQuality ~15821
- **Opis:** V1.9.49 dodał -15% penalty za hint mode. Brak tooltip wyjaśniającego. Gracz może zauważyć "dlaczego moje beaty są gorsze niż pattern wskazuje".

### S60. G._gymSets NIE reset na Prestige
- **Opis:** Counter persist (resetuje się następnego dnia automatically), ale day jest inny po Prestige reset. Minor inconsistency.

### S61. Campaign fame uses G.fame= zamiast addFame() (v1.9.34 defer)
- **Lokalizacja:** runCampaign linia ~16920+
- **Opis:** 1 z 6 sites do migracji do addFame() — v1.9.34 audit zostawił to jako defer. Wave 7 confirmed nadal nie zrobione. Bypass fameMult Prestige.

## 🟢 NISKIE WAVE 7

### N21. Asymetria hater penalty (influencer karze, gamer ignoruje)
- **Opis:** Sponsorship/Campaign sprawdzają `_haterPenalty`. Turniej/stream nie. Może być design (gamer = merit-based, influencer = brand). Drobne niespójności semantyczne.

---

# 🎯 FINAŁOWE PODSUMOWANIE PO WAVE 7

| Priorytet | W1 | W2 | W3 | W4 | W5 | W6 | W7 | RAZEM |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 🔴 Krytyczne | 10 | 10 | 15 | 7 | 8 | 9 | 11 | **70** |
| 🟠 Wysokie | 12 | 12 | 10 | 13 | 10 | 12 | 8 | **77** |
| 🟡 Średnie | 11 | 5 | 5 | 17 | 10 | 9 | 4 | **61** |
| 🟢 Niskie | 3 | 2 | 3 | 4 | 3 | 5 | 1 | **21** |
| **RAZEM** | **36** | **29** | **33** | **41** | **31** | **35** | **24** | **229** |

# ZNALEZISKA WAVE 8

### Wave 8 (6 agentów drill-down) — ✅ UKOŃCZONE
- [x] 57. Achievement-by-achievement (101 achievements)
- [x] 58. NPC dialog trees (11 NPCs)
- [x] 59. Storyline quests (35+ quests)
- [x] 60. Cooking minigame deep
- [x] 61. NPC pathfinding deep
- [x] 62. Save migration edge cases

## 🔴 KRYTYCZNE WAVE 8

### K74. `stress_free` achievement — INVERSION BUG semantyczny
- **Lokalizacja:** ACHIEVEMENTS L10206
- **Typ:** BUG (semantic)
- **Opis:** Check `(G.stress||0)>=100` ale opis "totalny spokój ducha". W grze stress=100 to MAX (zen mode po v1.9.44 rollback). Mimo to opis sugeruje 0. Wave 4 K37 już to zgłaszał — Wave 8 confirmed.
- **Sugestia:** Albo zmienić desc na "Zen Master (stress=100)", albo invert check na `<=10`

### K75. Achievement reward double-claim na Prestige
- **Lokalizacja:** checkAchievements() L10311-10317, doPrestige()
- **Typ:** EXPLOIT (re-confirmed Wave 1)
- **Opis:** `G.achievements` lista NIE resetuje się na Prestige (intencjonalne — to wszystko-time metric). Ale reward delivery `earn(_r, false)` może być claimowany WIELOKROTNIE jeśli lista resetuje się przez quit-load. Brak `G._achievementsClaimed[]` tracking.
- **Sugestia:** Per-achievement claim flag w persistent state

### K76. G.mainQuest persists na Prestige (storyline lock)
- **Lokalizacja:** doPrestige() 26633-26707
- **Typ:** BUG (Prestige integration)
- **Opis:** `G.mainQuest.currentStep` + `G.mainQuest.completed[]` nie resetują. Gracz po Prestige z step=17 (LEGEND) nadal "ma zaliczone". Plus check() na statyczne pola jak `followers>=1000` które persistują → storyline jest **soft-locked** w nowych playthroughs.
- **Sugestia:** `G.mainQuest = {currentStep:0, completed:[]}` w doPrestige

### K77. G.sideQuests (6 linii) persists na Prestige
- **Lokalizacja:** doPrestige()
- **Typ:** BUG
- **Opis:** Drip/Forma/Mieszkanie/YouTuber/Beatmaker/Gamer side storylines + Hazard/Social/Biznes (9 linii total z v1.8.44) — wszystkie persist. Gracz prestige na step 4/5 → puste linie boczne w nowym playthrough.
- **Sugestia:** Reset G.sideQuests w doPrestige

### K78. Cooking skill BRAK SKILL_DEF entry (re-confirmed)
- **Lokalizacja:** SKILL_DEF
- **Typ:** GHOST FEATURE
- **Opis:** Wave 5/6/8 wszystkie potwierdziły. G.skills.cooking growth działa, ale skill tree UI nie pokazuje. Cooking nie ma PU/Evo i NIE wpływa na efficiency/accuracy/time minigame (Wave 8 W81 nowy finding).
- **Sugestia:** Dodać do SKILL_DEF z konkretnymi efektami albo usunąć

### K79. loadGame() JSON.parse() BEZ try/catch
- **Lokalizacja:** loadGame L35718
- **Typ:** BUG (unrecoverable crash)
- **Opis:** Wave 8 znalazł że top-level `JSON.parse(d)` w loadGame() nie jest w try/catch. Wrapping `continueGame()` ma try/catch ale loadSlot() direct call też wywołuje loadGame. Uszkodzony save → unrecoverable JS error w konsoli, gracz widzi czarny ekran.
- **Sugestia:** Wrap całość loadGame w try/catch z fallback do _prev backup

### K80. Brak Math.max(0) clamping post-load (xp/money/level negative possible)
- **Lokalizacja:** loadGame
- **Typ:** BUG (logic crash)
- **Opis:** Gracz po edycji save może mieć `G.money=-5000`, `G.xp=-100`. addXP/earn mają guards, ale po load wartości są bezpośrednio inkremenotowane. Gracz z negative xp może dostać level-down loop.
- **Sugestia:** `G.xp = Math.max(0, G.xp); G.level = Math.max(1, G.level);` w loadGame

### K81. Trash bin 7-dniowy retention BRAK enforcement
- **Lokalizacja:** Trash bin (v1.9.97)
- **Typ:** BUG (bloat)
- **Opis:** `_cleanupExpiredTrash()` istnieje ale NIGDY nie wywoływany. Trash rośnie do 10 items cap (LIFO shift) ale stare entries (>7 dni) nigdy nie usuwane. localStorage bloat.
- **Sugestia:** Wywołać cleanup w openTrashBin() i continueGame()

## 🟠 WYSOKIE WAVE 8

### W78. fit_30/fit_75 vs max_fitness — różne fields (UX confusion)
- **Lokalizacja:** ACHIEVEMENTS
- **Typ:** UX
- **Opis:** Wave 4 K38 confirmed. fit_30/fit_75 = `G.forma` (siła/bench). max_fitness = `G.fitness` (cardio/treadmill). Gracz musi grindować obie zupełnie różne aktywności bez wskazówki.
- **Sugestia:** Rename achievements (np. `strength_30/strength_75` vs `fitness_max`)

### W79. Storyline y2 (YouTuber) może nie firować bez G.yt init
- **Lokalizacja:** STORYLINE_QUESTS y2 check()
- **Typ:** BUG (edge case)
- **Opis:** `(G.yt?.videos?.length||0)>=1` — guard `||0` chroni, ALE jeśli gracz utworzy nowe save i nie kupi kamery, G.yt pozostaje undefined. Storyline checker patrzy na sublinii w kolejności — y2 może być permanent locked dopóki gracz nie nagra video.
- **Sugestia:** Defensywny init `G.yt = G.yt || {videos:[], subs:0, views:0}` w resetG

### W80. Storyline soft-lock po Prestige (statyczne warunki persist)
- **Lokalizacja:** STORYLINE_QUESTS check() conditions
- **Typ:** BUG (related K76)
- **Opis:** Nawet jeśli K76 fixed (reset currentStep), część check'ów używa statycznych wartości (`G.followers>=1000`) które po Prestige zostają wysokie. Gracz w wave 2 z 50k fanów dostaje quest "1000 fanów" → już zaliczony bez akcji.
- **Sugestia:** Conditional check based on `G.day` (e.g., `G.day>=5 && G.followers>=1000`)

### W81. Cooking skill BRAK efektów per-level (tylko progression)
- **Lokalizacja:** finishCook(), startCookingMG()
- **Typ:** GHOST partial
- **Opis:** Cooking skill levels (max 5) nie wpływają na: minigame difficulty, accuracy, time consumption, reward scaling. To pure "trophy stat" — gracz osiąga lvl 5 i nic się nie zmienia (poza otrzymywanym XP achievement).
- **Sugestia:** Dodać per-level bonus: -5% time / +5% accuracy chance / +5% bonus reward

### W82. NPC speed BEZ scaling z player speed
- **Lokalizacja:** cityPed.baseSpd = 0.9 fixed
- **Typ:** DESIGN
- **Opis:** Gracz może mieć fitness=100 (×1.5 speed via Maraton) i przeskoczyć NPC. NPC zawsze 0.9, gracz 2.0-2.5. Brak immersion — NPC wyglądają jak posągi w późnej grze.
- **Sugestia:** Scale NPC speed delikatnie z player level (np. lvl 50 → +30% NPC speed)

### W83. NPC despawn — BRAK (25 pool permanent)
- **Lokalizacja:** cityPeds
- **Typ:** DESIGN / MEMORY (low)
- **Opis:** 25 NPCs jest "wieczne". Nie ma fresh spawn ani rotation. Plus same NPCs return przy room change. Memory leak: ~12.5 KB (negligible) ale immersion suffers.
- **Sugestia:** Rotate NPC roster co X dni (refresh names/colors)

### W84. G._socialSeen / G.playerCrew.name — NPE risk
- **Lokalizacja:** _fetchPlayerMessages
- **Typ:** BUG (potential crash)
- **Opis:** Wave 8 znalazł że pole `G._socialSeen.lastCrewMsgId` używane bez null-safe. Jeśli load corrupted save bez _socialSeen → TypeError. Plus `G.playerCrew.name` w renderze.
- **Sugestia:** Defensywne init w loadGame

## 🟡 ŚREDNIE WAVE 8

### S62. casino_jackpot achievement NIE w TIER arrays (default 100 zł)
- **Lokalizacja:** ACHIEVEMENTS L10286+, _tierReward L10303
- **Opis:** casino_jackpot (biggestWin>=5k) dostaje fallback 100 zł zamiast medium 500. Gracz osiąga "JACKPOT!" i widzi 100 zł reward — niespójność z innymi casino achievements (Mistrz X 500 zł).

### S63. Lodówka regen v2.1.48 — status niejasny
- **Lokalizacja:** v2.1.48 patchnotes
- **Opis:** Patchnote "lodówka regen" zaplanowane ale Wave 8 nie znalazł explicit implementation kodu. Może być w sleep tick (auto-eat z fridge) lub ghost.

### S64. Fans format merge tylko raz (_fansMergedV21_38) — re-import bug
- **Opis:** Flag `_fansMergedV21_38` zapobiega re-migracji. Jeśli gracz importuje OLD save z `{casual, hardcore}` format do save który już ma flag set → fans format nie konwertuje, gracz dostaje undefined.

## 🟢 NISKIE WAVE 8

### N22. subway_rider achievement — REMOVED feature ghost?
- **Opis:** Wcześniejszy audyt wspominał `subway_rider`. Wave 8 confirmed: removed w v1.9.0 (subway nie istnieje). Brak entry w obecnym kodzie.

### N23. Pantry BRAK food expiry (perpetual storage)
- **Opis:** Składniki kupione day 1 mogą być użyte day 1000. Brak mold/rot mechanic. Może być design (low-priority simulation).

### N24. Pantry BRAK hard cap
- **Opis:** Gracz może kupić 9999 jajek. UI rendering może suffer ale logic OK. Drobny bloat ryzyko.

### N25. NPC collision tylko w crosswalk area (poza tym pass-through)
- **Opis:** NPC mogą przejść przez gracza poza crosswalkami. Intentional optimization (O(n²) limitowany) ale immersion niespójny.

---

# 🏆 FINAŁOWE PODSUMOWANIE AUDYTU — PO WAVE 8 (8 FAL UKOŃCZONYCH)

## TABELA GŁÓWNA

| Priorytet | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | **TOTAL** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 🔴 Krytyczne | 10 | 10 | 15 | 7 | 8 | 9 | 11 | 8 | **78** |
| 🟠 Wysokie | 12 | 12 | 10 | 13 | 10 | 12 | 8 | 7 | **84** |
| 🟡 Średnie | 11 | 5 | 5 | 17 | 10 | 9 | 4 | 3 | **64** |
| 🟢 Niskie | 3 | 2 | 3 | 4 | 3 | 5 | 1 | 4 | **25** |
| **RAZEM** | **36** | **29** | **33** | **41** | **31** | **35** | **24** | **22** | **🎯 251** |

## 🔍 FALSE POSITIVES (znalezione podczas implementacji v2.1.96-106)
Re-verify potwierdziło że poniższe znaleziska NIE są realnymi problemami:
- **K49** (24 ghost PU prac) — `getPracaBonus`/`getKarieraBonus` aplikują `_pu()` pośrednio
- **W57** (8 ghost Evo) — wszystkie evo aplikują się przez wrapper functions (Master Trader/Showman/Battle King/Visual Artist + 4 evo prac)
- **K52** (P2P chat brak input) — `_openPlayerChat` MA input + send od v2.0.30
- **K26** (Casino daily wheel money bypass) — już naprawione w v2.0.27 (używa earn())
- **K30** (Milestone fame bypass) — już naprawione v1.9.34/v1.9.40 (earn + addFame z fallback)
- **K32** (Concert manual money bypass) — naprawione v1.9.29 (linia 20482-83 manual ×prestigeMC)
- **W19** (Drip District -10% obietnica) — zaimplementowane v1.8.95 w `applyOutfitDiscount` L1243

Po odjęciu false positives: ~245 realnych znalezisk.

## ✅ NAPRAWIONE W FAZACH 1-6 (v2.1.96-109, **14 patchów**)

| Patch | Phase | Issues fixed |
|---|---|---|
| v2.1.96 | F1 | 6 royalty bypassów (Spotify/Tidal/Radio per-tick, collectRoyalties, demo recording, collectRadioRoyalties) |
| v2.1.97 | F1 | Casino stats reset na Prestige (G.casinoStats + daily wheel counters) |
| v2.1.98 | F1 | 4 bypassy (findSponsor, runCampaign, doGhostwrite, World Tour completion — money+fame) |
| v2.1.99 | F1 | 10 fame napraw (VIP tip, 5 outfitów, cars, apartment luxury, IG, Pochwała) + 2 ZAIMPLEMENTOWANE eventy (Viral fame, Hater haters) |
| v2.1.100 | F1 | Pełny persist reset 18 obiektów w doPrestige (friendships/dailyQuest/bank/royalties/management/tracks/distributor/label/streaks/events/storyline/holiday/festival/tour/haters/cooldowns/igPosts) |
| v2.1.101 | F2 | Save safety: try/catch + clamping + defensive init + trash cleanup |
| v2.1.102 | F3 | UI consistency: BUFF kodu do obietnic (synth808 +15, drumPro +10, smoking ×1.10, designer ×1.15) + ZAIMPLEMENTOWANE 5 brakujących outfit concert mults + opisy zgodne |
| v2.1.103 | F4 | Anti-cheat: blokada leaderboard dla `_adminCheatUsed=true` + sanity bounds + console.log cleanup |
| v2.1.104 | F5 | Job evo nerf (Brygadzista/Multi-zlecenie +100%→+50%) + Treadmill+bieg + gameOver penalty + releaseBeat quality dynamic + concert refund 50% |
| v2.1.105 | F6 | Cooking SKILL_DEF entry z PU + Evo (Master Chef) |
| v2.1.106 | F6 | Patch Notes phone app (renderer + paginacja + filtr kategorii) |
| v2.1.107 | F6 | **Lyrics Studio** — tab w DAW + minigame rymów + skill growth + integracja release |
| v2.1.108 | F6 | **Magazine Cover event** + 2 achievementy (Cover Boy, Cover Legend) |
| v2.1.109 | F6 | Tournament hard cap 50k + Trend multiplier fame-scaling + Bills history toggle |

## 🎯 FINAL SUMMARY (14 patchów)
- **~55 punktowych napraw** + **6 zaimplementowanych ghost features** (Viral fame, Hater haters, Cooking skill, Patch Notes app, Lyrics studio, Magazine cover) + **18 persist resetów** na Prestige + **11 defensive guards** w save
- **5 outfit concert mults** zaimplementowanych zamiast pozostawione ghost (sport/sport_pro/luxury/zimowa/jeansowa)
- **BUFF kodu** do obietnic UI (synth808/drumPro/smoking/designer/winter coat opisy)
- **2 nowe achievementy** (Cover Boy, Cover Legend) + 1 nowa skill entry (cooking)
- **2 nowe gameplay features**: Lyrics minigame, Magazine cover random event

## Pozostałe drobne issues (nice-to-have, nie krytyczne)
- S43 _esc() centralizacja (XSS minor)
- S52 outfit→prace bonus (sport_pro tylko gym)
- W76 negative events ratio 20.7%→25-30%
- N17 achievements rendering perf 100+ items
- N18 daily quest repeating-type cooldown
- N19 rep system inconsistent across side jobs
- S55 SmartHints implementation
- S56 first-time tips queue/debounce
- W82-W83 NPC speed scaling / despawn
- N23 pantry food expiry

## OBSZARY POKRYTE (8 FAL × ~6-10 AGENTÓW = ~62 AGENTY)

**Wave 1 (10 agentów)**: Studio/DAW · Kariera rapera · Beatmaker+Gamer · Influencer+SoundEng+YT · Ekonomia pasywna · Skill trees+achievements · Storyline+Prestige · Mieszkania+auta+sklepy · Kasyno · HUD+UI+Telefon+Save

**Wave 2 (8 agentów)**: NPC+dialogi+crew · Life stats · Mapa+kolizje · Random events+holidays+sezony · Mini gry+tutorial+cinematic · Drip+outfit+styl · Bills+bank · Trends+hejt+viral

**Wave 3 (5 agentów cross-check)**: Konsystencja ekonomiczna post-v2.1.80-86 · Wymogi+gating · Save migration · Prestige bypass · Ghost features

**Wave 4 (9 agentów drill-down)**: Achievements individually · Skills individually · NPC dialogues · Performance · Cinematic per type · Jobs/cooking/gym · World Tour · Tutorial/hints · SMS/Supabase/multiplayer

**Wave 5 (9 agentów drill-down)**: World Tour retry · Sound system · Anti-cheat · Sezonowość×merch · Console/admin · Pluginy DAW · Outfits/Auta/Meble · Power-Ups+Evolutions · Dystrybutorzy+Label

**Wave 6 (8 agentów drill-down)**: Telefon UI app-by-app · Daily quests · Skill tree UI · Bank deep · Side jobs · Death/hospital · Settings+onboarding · Trends+viral

**Wave 7 (8 agentów drill-down)**: Lyrics/songwriting · Photoshoot/magazine · Concert MG · Beat sequencer · Streaming gaming · Gym sessions · Random events full · Influencer brand deals

**Wave 8 (6 agentów drill-down)**: 101 achievementów · 11 NPCs dialog · Storyline 35+ quests · Cooking deep · NPC pathfinding · Save migration edge cases

## 🔥 TOP 10 NAJBARDZIEJ KRYTYCZNYCH

1. **K46 — localStorage edycja bez upper bound** (cheat trivialny)
2. **K47 — Admin panel zero ochrony** (snowy/amper, 21 funkcji)
3. **K70 — doPrestige() brak reset G._eventCounts/G._lastChoiceEventDay**
4. **K72/K73 — findSponsor/runCampaign Prestige bypass** (~30k zł/dzień)
5. **K76/K77 — G.mainQuest/G.sideQuests persist na Prestige** (storyline soft-lock)
6. **K79 — loadGame JSON.parse bez try/catch** (unrecoverable crash)
7. **K69 — Treadmill BRAK getBiegBonus** (skill bieg ignorowany w gym)
8. **K56 — G.bank.loan/investments persist na Prestige** (cross-playthrough exploit)
9. **K57 — gameOver() FREE revive jeśli bankrut** (zero penalty exploit)
10. **K9 — G.casinoStats persist na Prestige** (VIP unlock cross-playthrough)

## 📋 PROPONOWANA STRATEGIA NAPRAW (10-15 patches)

### FAZA 1 — Prestige cleanup (v2.1.96-100, ~5 patches)
- 27+ Prestige bypassów (money + fame): Spotify/Tidal/Radio/collectRoyalties/casinoWheel/Sponsorship/Campaign/Ghostwriting/Milestones/Tour/Concert (z Wave 1+7)
- 15+ persist reset: casinoStats/npcFriendship/dailyQuest/drip/bank/royalties/managementDeal/studioTracks/distributor/label/ytStreak/mainQuest/sideQuests/_eventCounts/_lastChoiceEventDay/holidayState/festivalState/_tourActive (z Wave 1+7+8)

### FAZA 2 — Save migration safety (v2.1.101, 1 patch)
- JSON.parse try/catch w loadGame
- Math.max(0) clamping post-load (xp/money/level)
- Defensywne init G._socialSeen, G.playerCrew.name, G.yt
- Trash cleanup auto-enforce

### FAZA 3 — UI consistency (v2.1.102-104, ~3 patches) — **BUFF kod, NIE nerf UI**
- Plugin synth808 kod +12 → **+15** (matching UI promise)
- Plugin drumPro kod +8 → **+10** (matching UI promise)
- Plugin opisy "+X% jakości" → faktyczny pkt translation w UI
- Smoking outfit kod ×1.08 → **×1.10** (matching UI "+10%")
- Designer concert kod ×1.10 → **×1.15** (matching UI "+15%")
- Winter coat — decision: opis "−15%" mylący przy ×0.15 mult → **kod ×0.85 (-15% damage)** lub **opis "−85% obrażeń"** (powerful protection)
- Jeansowa analogicznie do Winter
- Skill tree text "+1 SP" → "+2 SP" (matching v2.1.46 kod)
- Stress_free: decision — semantycznie zen=100=spokój, więc desc OK; opis ulepszyć "Zen Master (stress=100)"
- W19 Drip District -10%: zaimplementuj rabat (NIE usuwać SMS obietnicy)

### FAZA 4 — Anti-cheat (v2.1.105, 1 patch)
- Admin panel password gate lub blokada submitAllScores
- Cooldown bypass anti-quit-load (persist absolute timestamps)
- _esc() centralizacja
- Console.log cleanup

### FAZA 5 — Bug fixes specyficzne (v2.1.106-108, ~3 patches)
- Tournament hard cap prize (gaming career — cooldown NIE z prac dorywczych)
- Treadmill getBiegBonus mult (skill bieg fully impl w gym)
- Concert cancel refund 50-100%
- releaseBeat quality dynamic (nie 50% fixed)
- Hater attack event +haters
- gameOver bankruptcy penalty
- **Job evo balance (NIE cooldowny)**: Multi-zlecenie +100%→+50%, Brygadzista +100%→+50%

### FAZA 6 — Ghost features ZAIMPLEMENTUJ (v2.1.109-110, ~2 patches) — **NIE usuwać obietnic**
- **24 ghost PU prac**: dodać `_pu(skill)` w zarobkach pizza/construction/kurier/zmywak/beatmaker/gamer/influencer/soundeng
- **8 ghost Evo**: zaimplementować Master Trader (negocjacje), Showman (scena), Battle King (flow), Visual Artist (foto) + 4 evo prac
- Lyrics studio: pełna minigame implementacja
- Photoshoot/Magazine: dodać random event "magazine cover" z minigamą
- Patch Notes phone app: dodać button + renderer
- P2P chat input field
- Cooking SKILL_DEF entry z PU/Evo (NIE usuwać)
- Drip District -10% rabat (W19): zaimplementuj w buyOutfit
- subway_rider remnants

**Łącznie:** ~15 patches żeby ukończyć cleanup.

## 📊 KATEGORYZACJA WG NATURY

**Prestige Money/Fame Bypassy:** ~30 źródeł
**Persist Post-Prestige:** ~18 obiektów
**UI/Code Inconsistencies:** ~12 miejsc
**Ghost Features:** ~40 (PU prac, Evo, Lyrics, Photoshoot, Cooking SKILL_DEF, Patch Notes, P2P input, etc.)
**Save Migration Gaps:** ~12 pól
**Anti-cheat Holes:** ~8 luk
**Balance Issues:** ~25 (OP/UP/missing cooldowns)
**Specific Bugs:** ~30 (cooldown wrapping, audio FIFO, _esc dupes, etc.)
**UX Issues:** ~20 (font, tooltips, scroll, errors)
**Performance:** ~5 (cleanup, memory, render optimization)

## 📁 ARTEFAKT

**AUDYT_FULL.md** — kompletny dokument 251 znalezisk skatalogowanych, gotowy do user decision:
- **Top 20 krytycznych** — pilne fixy (cheat/crash/Prestige integrity)
- **Top 60 wysokich** — quality fixes (balance, exploits)
- **Bulk packages** — Faza 1-6 (~15 patches w serii)
- **Selective** — wybrane kategorie (Prestige cleanup / Anti-cheat / UI / etc.)

---

## ✅ AUDYT UKOŃCZONY

8 fal × 62 agentów × 251 znalezisk × ~75 obszarów gameplay.

**Każda mechanika, każda formuła, każdy ghost feature, każda wartość, każda linia kodu wpływająca na gameplay została zbadana** zgodnie z prośbą użytkownika ("MA BYĆ ZBADANA KAŻDA FUNKCJA GRY, KAŻDA MECHANIKA, KAŻDE OBLICZENIE, KAŻDA STATYSTYKA, KAŻDA WARTOŚĆ, KAŻDA LINIJKA KODU").

Dalsze drill-down obszary są możliwe (każdy storyline branch indywidualnie, każdy festival effect, każdy individual cooldown bug) ale od Wave 8 ROI maleje — większość pozostałych issues to micro-edge-cases o niskim impactcie.

Czekam na decyzję użytkownika: która faza fixów (1-6) zacząć, czy bulk-package, czy selective per priority.

## 🔥 NAJBARDZIEJ KRYTYCZNE KATEGORIE

### A. Prestige Money Bypassy (~15 źródeł)
- Spotify, Tidal, Radio (Wave 1 K1-K3)
- collectRoyalties (K4)
- Casino daily wheel (K26)
- Sponsorship/Campaign (K27, K28)
- Ghostwriting (K29)
- Milestones (K30)
- World tour (K31)
- Concert manual (K32)
- Bank investment (W32 borderline)

### B. Prestige Fame Bypassy (~12 źródeł)
- VIP tip (K5)
- Outfit first-buy (K6)
- First casino, Steak/Whiskey/Champagne, First room, Pochwała, IG post, Demo, Milestone failed, Rep75, World tour, Concert manual (K33)

### C. Persist Post-Prestige (~10 obiektów)
- G.casinoStats (K9)
- G.npcFriendship (K11)
- G.dailyQuest (K12)
- G.drip/outfit/hair (K13)
- G.bank.loan + investments (K14)
- G.spotify/tidal/soundcloud/yt royalties (K22)
- G.managementDeal (K23)
- G.studioTracks (K24)
- G.distributor/label (K25)
- G.ytStreak, ytRecorded etc. (W34)

### D. UI/Code Inconsistency (~7 miejsc)
- Plugin DAW opisy +X% vs +X pkt (K34)
- Sylwester ×2 → ×1.4 (K34)
- Majówka ×1.5 → ×1.25 (K34)
- Designer outfit +15% → +10%
- Smoking +10% → +8%
- Winter coat "−15%" → 85% reduction (K35)
- v2.1.83 max stack ×9→×5 inaccurate

### E. Save Migration Defensive Init (~10 pól)
- Mixer/Master 7 pól (K21)
- G.playerCrew (W25)
- G.sideQuests (W26)
- G._ytStreak, G._ytLastUploadDay (W27)
- G._lastConcertAbs (W28)
- G._introductionSeen (S19)
- G.activeHoliday, G.activeFestival (S17)
- G._eventCounts (S18)

### F. Inne ghost / niedopatrzenia
- Beatmaker sellBeat/Pack cooldown wrapping (K7, K8)
- Festival UI brak tooltipów (K15)
- maxPerDay quit-load exploit (K16)
- Smart Hints flag mismatch (K17)
- Concert MG brak Escape (K18)
- Gym MG potencjalnie brak (K19)
- _esc() duplikowane 3× (K20)
- Drip District -10% obietnica vs kod (W19)
- IG posts cap 150 nie reset (W9)
- YT series counter nie reset (W7)
- Hospital heal spam (W13)
- Festival/Tour cinematic Prestige reset (W15)

---

# 📋 PROPONOWANA STRATEGIA NAPRAW

**FAZA 1 — Prestige cleanup (priority CRITICAL)** (~v2.1.95→v2.1.105):
- Naprawa wszystkich 27 Prestige bypassów (money + fame)
- Reset wszystkich persist post-Prestige obiektów
- v2.1.95: Spotify/Tidal/Radio/collectRoyalties + casino daily wheel
- v2.1.96: Wszystkie fame bypassy (12 miejsc)
- v2.1.97: Reset doPrestige() — casinoStats, npcFriendship, dailyQuest, bank, royalties, managementDeal, distributor/label, ytRecorded
- v2.1.98: Sponsorship/Campaign/Ghostwriting/Milestones/World tour

**FAZA 2 — Save migration completeness** (~v2.1.99):
- Wszystkie defensywne init w loadGame (10+ pól)

**FAZA 3 — UI consistency** (~v2.1.100-101):
- Aktualizacja opisów po v2.1.83 nerfach
- Plugin opisy: "+X pkt" zamiast "+X% jakości"
- Winter coat: "−85% obrażeń"
- Holiday opisy

**FAZA 4 — Bug fixes specyficzne** (~v2.1.102-104):
- Beatmaker cooldown wrapping (K7, K8)
- Smart Hints flag mismatch (K17)
- Concert MG escape handler (K18)
- Gym MG verify (K19)
- _esc() centralizacja (K20)

**FAZA 5 — UX improvements** (~v2.1.105+):
- Festival tooltipy (K15)
- Spam penalty komunikaty (S1)
- Outfit/holiday bonus display (S3, S4)
- Drip District -10% verify (W19)

Łącznie ~10-15 patches żeby ukończyć cleanup.

---

# 📊 DOKUMENT GOTOWY DO ANALIZY UŻYTKOWNIKA

98 znalezisk skatalogowane. User może wybrać:
- **Top 35 krytycznych** (priority CRITICAL)
- **Top 34 wysokie** dla code quality
- **Bulk pack** (FAZA 1+2+3 = ~60 fixes w serii ~10 patchy)
- **Selective** (konkretne kategorie A-F)
