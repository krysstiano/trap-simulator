# 🌙 Autonomous Etap 2 — 2026-05-28

User explicit start Etapu 2 (po PERFEKCYJNIE Etap 1):
> *"Lecimy z nowymi rzeczami do etapu 2. Ja daje pomysły, sugestie, propozycje, Ty na ich podstawie masz zbudować konkretne plany implementacji. Masz wolną rękę, możesz pracować autonomicznie, ale nie strzelaj i nie zgaduj. Wykorzystuj CAŁĄ swoją wiedzę na temat gry do podejmowania dobrych decyzji, budowy dobrego planu i dobrych implementacji i dobrych testów, audytów."*

**Sposób pracy**:
- User daje pomysły/sugestie/propozycje (high-level).
- Ja buduję konkretny plan implementacji (low-level, atomic).
- Decyzje designerskie podejmuję sam — analiza code + context + memory + game design.
- Workflow IDENTYCZNY jak Etap 1 (PRE/POST audit, runtime test, Round 2, NIE strzelać).
- Każda decyzja zapisana w tym pliku.

---

## 📋 Pomysły usera + moje plany implementacji

Format każdego wpisu:
- **Pomysł usera** (cytat).
- **Moja analiza** (read kodu, istniejące analogi, integracja).
- **Konkretny plan** (atomic kroki implementacji).
- **Decyzje designerskie** (per krok jeśli wymaga, z uzasadnieniem).
- **Audyty + testy** zaplanowane.
- **Status**: PENDING → IN PROGRESS → DONE (Round 2 zero findings).

### Pomysł #1 — Schedule 1 inspired drug business career

**Pomysł usera** (cytat):
> *"Schedule 1 influence. (...) dodać zupełnie nową, konkretną mechanikę polegającą na narkotykach. (...) nowej ścieżki kariery. Gracz ma mieć możliwość produkować, pakować, sprzedawać narkotyki. (...) Kamper → pokój → plantacje/laboratorium. (...) marihuana: lampy, doniczki, ziemia, podlewać, nawozić, ścinać, suszyć, pakować. (...) zatrudniać dealerów, sprzedawać, zażywać + różne efekty. Policja wypełniająca system."*

**Research wykonany**:
- Schedule 1 game: progression RV → motel → house → barn → warehouse. Botaniści $1500+$200/day, chemicy $300/day. 3 packaging stations. NPC dealers via phone Maps. Drugs: marijuana, meth, mushrooms, cocaine. Meth = acid+phosphorus+pseudo, distill 225-275°C.
- GTA 5 Online MC: 5 biz (Documents/Cash/Weed/Meth/Cocaine), upgrades equipment/staff/security, supply missions, cocaine $30k→$72k/h max profit, raids.

**Moja analiza**:
- Snowy ma istniejące 6 careers (raper/youtuber/gamer/beatmaker/influencer/soundeng) — analog skeleton ready.
- Reguła #1: NIE łamać save'ów (defensive init wymagany).
- Wymóg 6 (cytat user "akcje, nie click") — KAŻDA produkcja MUSI mieć mini-grę/akcję.
- Reguła #11: balans bez wrażenia odbierania (high profit OK ale balansed risk).
- Wymóg 5 (deep balance audit) — narcoking career nie może rozwalić economy (musi być scaled z innymi careers).
- Memory `feedback_no_job_cooldowns` — NIE dodawać cooldownów do prac dorywczych. Ale narkotyki to inna kategoria (illegal mechanic) — cooldowny growth uzasadnione plot-realistic.

**Decyzje designerskie podjęte samodzielnie**:

#### Decyzja D2.1 — Unlock przez ODKRYCIE w grze (NIE random event, NIE auto-unlock) ⚠️ REVISED 2026-05-28

> *"Raczej wolałbym żeby to nie było unlock ani przez random event ani auto-unlock. Raczej gracz ma w jakiś sposób odblokowywać, rozwijać i progresować w tej nowej mechanice."*

- **Wybór REVISED**: 2 ścieżki odkrycia (gracz wybiera lub natknie się):
  - **Ścieżka A — "Sklep Hodowca"** (legalny pretext): nowy fizyczny sklep w mapie głównej (lokal w Z3 zone, blisko Underground bramki). Sprzedaje "akcesoria ogrodowe" — lampy, doniczki, ziemia, nasiona (Tier 1 "regular seeds" labeled "tomato"). Gracz wchodzi, widzi inventory. Pierwszy zakup seed (50 zł) → narrator hint "Sprzedawca mruga okiem — wiesz że to nie pomidor" → unlock career narcoking + Tier 0 (Camper przyznawany).
  - **Ścieżka B — "Tajemniczy pakunek"** (street pickup): podczas chodzenia po mapie (po lvl 5 + street rep ≥ 20) rare drop (1% chance/day idąc po chodnikach) — ikona `📦` na ziemi. Interakcja [E] → "Znalazłeś pakunek z czymś dziwnym". Decision modal: Otwórz (start questu) / Wyrzuć (-suspicion 0, gracz może odrzucić). Otwórz → dialog z Kamil ("Wiem skąd to. Chcesz wiedzieć więcej?") → unlock career.
- **Rozwój + progresja**:
  - Career XP system jak inne careers — sianie/podlewanie/cook/sprzedaż dają XP.
  - Level 1 → Tier 0 (kamper, basic marijuana).
  - Level 5 → Tier 1 (pokój).
  - Level 10 → Tier 2 (małe lab, meth unlock).
  - Level 15 → Tier 3 (plantacja indoor, mushrooms+meth).
  - Level 20 → Tier 4 (imperium, cocaine endgame).
  - Każdy level up = unlock kolejne equipment/substancje.
- **Uzasadnienie**: gracz aktywnie odkrywa (sklep visible lub pakunek pickup) — NIE auto, NIE random event self-triggered. Gracz ma agency. Plus rozwój przez progresję XP/level zgodnie z user explicit "rozwijać i progresować".
- **Wpływ**: gracz NIGDY nie wchodzi w mechanikę chyba że sam zacznie. Naturalny discovery.
- **Alternatywa**: jeden punkt unlock (np. tylko sklep) — odrzucone bo 2 ścieżki daje variability.

#### Decyzja D2.2 — Brak settings toggle (system AKTYWNY ale ukryty dopóki gracz odkryje) ⚠️ REVISED 2026-05-28

> *"Nie rozumiem o co chodzi z Default OFF, ale prawdopodobnie nie chcę żeby domyślnie coś było OFF."*

- **Wybór REVISED**: system jest **AKTYWNY** zawsze — nie ma settings toggle ON/OFF. Ale dopóki gracz NIE wykona discovery action (zakup seed lub pakunek pickup), career narcoking jest `unlocked:false` i UI elementy ukryte (apka "Imperium" nie pokazuje się w telefonie, sklep widoczny jako "Sklep Hodowca" bez pretensji).
- **Uzasadnienie**: zgodnie z user — nie chcemy "OFF w domyśle". System gotowy + dostępny, ALE gracz musi aktywnie podjąć action żeby zacząć (analog do "ukrytego" contentu w grach).
- **Wpływ**: każdy gracz może znaleźć ścieżkę. NIE wymaga konfiguracji.
- **Alternatywa**: settings toggle (poprzednia wersja D2.2) — odrzucone per user explicit.

#### Decyzja D2.3 — 4 substancje (weed/mushrooms/meth/cocaine) zgodnie z Schedule 1
- **Wybór**: marijuana (start Tier 0), mushrooms (Tier 1), meth (Tier 2-3), cocaine (Tier 4 endgame).
- **Uzasadnienie**: analog Schedule 1 + GTA 5. Each substancja unique mechanika produkcji = replay value.
- **Alternatywa**: dodać heroin/LSD — odrzucone bo over-scope, focus na 4 sprawdzonych.

#### Decyzja D2.4 — 5 tiers progresji (Camper → Pokój → Małe Lab → Plantacja → Imperium)
- **Wybór**: Tier 0 Camper / 1 Pokój / 2 Lab / 3 Plantacja Indoor / 4 Imperium (warehouse + multiple dealers).
- **Uzasadnienie**: Breaking Bad arc + Schedule 1 progression. Każdy tier wymaga prior tier mastery.
- **Wpływ**: 50-100 dni game time to reach Tier 4 (long-term goal, endgame).
- **Alternatywa**: 3 tiers (uproszczone) — odrzucone bo nie daje progression feeling.

#### Decyzja D2.5 — Mini-gry per produkcja (NIE click=reward)
- **Wybór**: każdy major step = mini-akcja (posiej 5sek, podlej daily, cook 60sek MG z timing precision).
- **Uzasadnienie**: Wymóg 6 user "akcje, nie click". Plus engaging gameplay.
- **Wpływ**: produkcja nie jest passive AFK — gracz pracuje.
- **Alternatywa**: passive timer (idle game) — odrzucone bo user explicit "nie click".

#### Decyzja D2.6 — Police suspicion global + raid risk system
- **Wybór**: `G.policeSuspicion` 0-100, akcje narko +suspicion, czas -5/day. Raid chance scaled.
- **Uzasadnienie**: User explicit "policja wypełniająca logicznie cały system". Realistic mechanic.
- **Wpływ**: gracz musi balansować profit vs suspicion. Strategiczne.
- **Alternatywa**: hard cap (np. raid co 30 dni guaranteed) — odrzucone, dynamic risk lepszy.

#### Decyzja D2.7 — Addiction system per substancja
- **Wybór**: `G.addictions.<sub>` 0-100, withdrawal symptoms >50.
- **Uzasadnienie**: realistyczne efekty + balance mechanic. Plus gameplay loop "recover" jako storyline.
- **Wpływ**: gracz może wpaść w addiction, ale ma drogę wyjścia (recovery storyline + achievement).
- **Alternatywa**: brak addiction (zażyj = clean bonus) — odrzucone bo unrealistic + brak balance.

#### Decyzja D2.8 — Dealerzy NPC analog do label artists (Schedule 1 inspired)
- **Wybór**: lokalizacja NPCs w mapie z `?` na minimap. Hire dialog z wage negotiation + loyalty system.
- **Uzasadnienie**: analog do label artists hiring system już istnieje w grze — reuse skeleton.
- **Alternatywa**: dealerzy spawn losowo via phone (Schedule 1 style) — można zachować jako alternatywa ALE physical NPCs w mapie spójne z konceptem Snowy.

#### Decyzja D2.9 — UI w telefonie "Imperium" app (folder Specjalne)
- **Wybór**: nowa apka w telefonie, tab system (Plantacja / Stash / Dealerzy / Statystyki / Suspicion).
- **Uzasadnienie**: spójne z istniejącym phone system (analog Bank/Spotify apps).
- **Alternatywa**: osobna sekcja w map UI — odrzucone bo phone = centrum gry.

#### Decyzja D2.10 — Integracja z Underground district (jeśli new map Faza B' gotowa)
- **Wybór**: docelowa lokalizacja Tier 2-4 (Małe Lab, Plantacja) w Underground district nowej mapie.
- **Uzasadnienie**: tematyczna spójność (gritty underground + drug business). Sync z Faza B' new map.
- **Wpływ**: Faza AN wymagać może Faza B' Underground new map DONE PRZED Tier 2+. ALE Tier 0-1 (camper/pokój) może być w mapie głównej.
- **Alternatywa**: cały system w mapie głównej — odrzucone, Underground tematyczna idealna.

### Audyty + testy planowane (per faza AN.1-AN.15)
- PRE-impl: grep career systems analog (raper/youtuber).
- Per sub-faza: POST-impl 14 obszarów audit + analog grep + runtime test + Round 2.
- Final integration: balans audit (per Wymóg 5 / Faza AI workflow) — narcoking max daily profit vs other careers comparison.

### Status
- **PENDING** — plan dopisany, czekam na sygnał startu loop Etap 2 (po PERFEKCYJNIE Etap 1).

---

### Pomysł #2 — Kompletna rozbudowa social media (Instagram + Twitter)

**Pomysł usera** (cytat):
> *"Kompletna rozbudowa social media. (...) Na instagramie gracz wrzucając post ma widzieć okienko ze swoją postacią i możliwość wyboru tła (miejsca z gry), np. siłownia, park, kasyno, traphouse itd. Ma też widzieć komentarze ludzi (coś jak streamowanie na twitchu). Ma być też jakaś inna zakładka gdzie prawdziwi gracze mogą wrzucać raz dziennie (realny dzień) zdjęcie i inni prawdziwi gracze mogą je komentować i przeglądać zdjęcia innych graczy. Za wrzucanie gracze mają dostawać fajne nagrody (ale nie złamane). Jeżeli będzie potrzebne dodanie czegoś do supabase to wykonaj całą pracę, a dla mnie przygotuj do wklejenia do Supabase. Twitter też chciałbym żeby był bardziej rozbudowany. Pamiętaj, że na social mediach gracze mają zyskiwać obserwujących a nie fanów. Zrób żeby z social mediów gracze mogli zarabiać (może jakieś posty sponsorowane)."*

**Moja analiza istniejącego kodu**:
- `G.igPosts:[]` (cap 150 v1.9.45) — array z {label, likes, comments, day, growStage, maxLikes, ...}.
- `igPost(idx)` L29587 — current flow: gracz wybiera kategorie predefiniowanej, brak custom input.
- `renderPhoneApp('instagram')` L29560 — UI gradient cover + emoji + fake likes/comments.
- `renderPhoneApp('twitter')` L29621 — tweets generator dynamiczny, brak gracz input. Verified ≥1000 followers.
- `G.followers` vs `G.fans` — memory `project_fans_vs_followers`: followers = social media additional, fans = lojalni main metric. Reguła zachowana ✅.
- Supabase: SUPABASE_URL L50100, istniejące tabele (leaderboards, friendships, crews) — schema patch wymagany dla social.

**Decyzje designerskie podjęte samodzielnie**:

#### Decyzja D2.11 — Live preview postaci w Post Creator (reuse char-canvas)
- **Wybór**: w post creator modal, postać gracza renderowana na canvas (analog do `char-canvas` w creator menu) + wybrane tło overlay.
- **Uzasadnienie**: nie tworzymy nowego rendering pipeline — reuse istniejący. Spójność wizualna z creator.
- **Wpływ**: gracz widzi siebie w nowym kontekście (lokalizacja) co buduje immersion.
- **Alternatywa**: tylko emoji w post (current state) — odrzucone bo user explicit chce "okienko ze swoją postacią".

#### Decyzja D2.12 — 10+ teł lokalizacji w grze (gated unlock)
- **Wybór**: Traphouse (start) + 10 lokalizacji ukrytych za visit/zakup:
  - Siłownia / Park / Kasyno / Studio / Sala Koncertowa / Sklepy
  - Apartamenty (Premium/Penthouse/Mansion/Mega Villa po zakupie)
  - Dzielnice (Underground/Coast/Business po unlock)
- **Uzasadnienie**: zachęta do eksploracji + progresja "kolekcja teł" jako side achievement. Player engagement.
- **Wpływ**: gracz musi explore żeby unlock all teł.
- **Alternatywa**: 3 teł od początku — odrzucone bo trywialne, brak progresji.

#### Decyzja D2.13 — Live comments Twitch-style (NPC pool dynamiczny)
- **Wybór**: 15-20s "Live View" modal po post submit z floating NPC comments. Comment pool: dynamiczny per category/bg/caption keywords.
- **Uzasadnienie**: user explicit "coś jak streamowanie na Twitchu". Engaging, satisfaction loop.
- **Wpływ**: gracz feel like real influencer otrzymujący instant feedback.
- **Alternatywa**: static comment list (current state) — odrzucone bo passive UX.

#### Decyzja D2.14 — Real Players Tab (Supabase backend) — 1× per real day cap
- **Wybór**: nowa zakładka "📸 Społeczność", upload 1× per real day, Supabase `ig_photos` table z 50 ostatnich w feed.
- **Uzasadnienie**: user explicit. Real-day cap zapobiega spam + zachęta do daily login.
- **Wpływ**: społeczność rośnie naturally, gracze widzą siebie nawzajem.
- **Alternatywa**: unlimited uploads — odrzucone bo flooding Supabase + abuse.

#### Decyzja D2.15 — Nagrody za "Społeczność" interactions (NIE złamane)
- **Wybór** (reguła #11 — fajne ale nie złamane):
  - Upload self: +20 followers + XP achievement progress.
  - Likes received: +1 follower per 5 likes (cap 50/day).
  - Comment others: +5 followers per day (cap 3 rewardable/day).
- **Uzasadnienie**: total max ~55 followers/day z społeczności = ~1650/miesiąc real-time. Mid-game support, NIE endgame breaker.
- **Wpływ**: gracze chcą wrzucać + komentować dla rewardów ale balansed.
- **Alternatywa**: +100 followers per like — odrzucone bo złamane.

#### Decyzja D2.16 — Sponsored Posts tiers (zarabianie z IG)
- **Wybór**: random offer po fame ≥ 30 + followers ≥ 5k. Tier scaled:
  - 1k-10k: 200-500 zł/post
  - 10k-100k: 500-2000 zł/post
  - 100k+: 2000-10000 zł/post (cap)
- **Uzasadnienie**: max ~70k zł/month z IG sponsored = early-mid game support. NIE złamane (analog do sponsorship system już istniejący).
- **Wpływ**: alternatywne źródło dochodu, opcjonalne (gracz decyduje akceptu).
- **Alternatywa**: free 10k/post brak limit — odrzucone bo złamane.

#### Decyzja D2.17 — Twitter Composer (gracz pisze własny tweet)
- **Wybór**: text area 280 char (Twitter classic), `G.userTweets:[]` array, 1/day cap.
- **Uzasadnienie**: user explicit "Twitter rozbudowany". Plus Wymóg 6 Etap 1 ("akcje, nie click") — gracz musi wpisać tekst.
- **Wpływ**: aktywne tweetowanie zamiast passive button click.
- **Alternatywa**: tylko auto-generated tweets (current) — odrzucone, brak agency.

#### Decyzja D2.18 — Twitter Verified Status — 4 tiers
- **Wybór**: 1k+ ✓ basic / 10k+ ⭐ popular / 100k+ 💎 famous / 1M+ 👑 iconic. Bonus +5-15% engagement per tier.
- **Uzasadnienie**: progresja widoczna, milestone celebration. Nie wszyscy dostają same ✓.
- **Wpływ**: tiers jako mini-achievement system Twitter.
- **Alternatywa**: pojedyncze ✓ (current) — odrzucone, brak progresji.

#### Decyzja D2.19 — Supabase tabele 3 nowe (ig_photos, ig_comments, ig_likes)
- **Wybór**: 3 osobne tabele z FK + UNIQUE constraint anti-double-like.
- **Uzasadnienie**: normalizowane schema, anti-abuse via UNIQUE. RLS public read/insert + GRANTS dla anon.
- **Wpływ**: backend scales, gracze widzą się nawzajem.
- **Alternatywa**: 1 table z JSON arrays — odrzucone bo gorsza skalowalność + brak FK integrity.

#### Decyzja D2.20 — Trending Topics dynamic (game events + user progress)
- **Wybór**: top 5 trending list bazujący na: game events (koncerty/festivale/beef/awards) + user progress (latest track, fame milestones). Klikalne → auto-tweet z hashtag +50% engagement.
- **Uzasadnienie**: trending = realistic Twitter feature + zachęta do tweetowania o ważnych momentach.
- **Wpływ**: Twitter feels alive, kontekstowy do progressu gracza.
- **Alternatywa**: static list — odrzucone, no engagement.

### Audyty + testy planowane
- PRE-impl: grep istniejący IG/Twitter code dla analog reuse.
- POST-impl: 14 obszarów audit per sub-faza.
- Runtime testy 2+ scripts.
- Round 2 "na pewno done?" per sub-faza.
- Supabase schema test: live insert/select z test data.

### Status
- **PENDING** — plan dopisany, czekam na sygnał startu loop Etap 2.
- **Supabase**: plik `SUPABASE_PATCH_SOCIAL_2026-05-28.sql` do utworzenia podczas implementacji (zawiera 3 tabele + RLS + GRANTS).

---

### Pomysł #3 — Pies & Schronisko (z słodkością, treningiem, IG integration)

**Pomysł usera** (cytat):
> *"Dodanie do gry psów i schroniska. Schronisko jako kompletnie nowe miejsce (...) różne rasy i psy mają na prawdę ładnie wyglądać. (...) 'słodkość'. (...) działać trochę jak drip. (...) wrzucać z nim zdjęcia na instagrama. Psa ma być widać faktycznie na zdjęciach. (...) trenowania psa. (...) bieganie z psem, rzucanie zabawek i pies aportuje. (...) Im wyższy level psa tym większe mnożniki do social mediów. Ma być też na mapie sklep zoologiczny i weterynarz. (...) Pies ma też mieć nastrój. (...) Psa ma być faktycznie widać w mieszkaniu (każdym mieszkaniu jakie posiada gracz), ma też być widać jego miskę z jedzeniem i wodą."*

**Moja analiza istniejącego kodu**:
- Apartamenty: 6 typów (traphouse/basic/premium/luxury/mansion/mega_villa) — każdy własny `ROOMS.<apt>`.
- Drip system: G.drip 0-200, daje multipliery — analog dla słodkość.
- Mini-gry: freestyle/recording/beatmaker — pattern do reuse dla treningu.
- IG post: G.igPosts + post creator (przygotowane w Faza AO).
- Random events: 36 eventów już — analog dla choroba.

**Decyzje designerskie podjęte samodzielnie**:

#### Decyzja D2.21 — Schronisko jako nowy fizyczny budynek (NIE overlay)
- **Wybór**: nowy obiekt `shelter` w ROOMS.ulica.objects + osobny ROOMS.shelter z 6-8 boksów.
- **Uzasadnienie**: spójne z fizyczną mapą (NIE overlay jak v2.1.376 dzielnice). User explicit "kompletnie nowe miejsce, nowy budynek".
- **Alternatywa**: overlay modal — odrzucone bo user explicit.

#### Decyzja D2.22 — 12 ras psów z różną słodkością + cena
- **Wybór**: Husky/Golden/Pomeranian/Bulldog/Pudel/Owczarek/Beagle/Chihuahua/Border Collie/Yorkshire + Mieszaniec + Bezdomny. Słodkość 40-95, cena 50-500 zł.
- **Uzasadnienie**: variety + budget options. Mieszaniec/Bezdomny daje "charity" mechanic (tańszy ale niższa słodkość — choice gracza moralny).
- **Wpływ**: gracze decydują budget vs słodkość.
- **Alternatywa**: 5 ras — odrzucone bo brak variety.

#### Decyzja D2.23 — Słodkość 0-100 (analog drip)
- **Wybór**: G.dog.slodkosc = breed_base + level×2 + toys×1.5. Max 100.
- **Uzasadnienie**: analog do G.drip 0-200 system, mechanic znany graczom.
- **Alternatywa**: bezstopniowy słodkość scaling — odrzucone, bar widget czytelny.

#### Decyzja D2.24 — IG bonus engagement +X% (cap +50%)
- **Wybór**: post z psem daje słodkość/2 % bonus engagement (max +47.5% przy słodkość 95). Cap +50% nawet z maxed słodkość + level 20.
- **Uzasadnienie**: reguła #11 — fajne ale NIE złamane. +50% to znaczący bonus ale nie odbiera potrzeby grindu other systems.
- **Wpływ**: pies = legit social media tool, NIE p2w shortcut.
- **Alternatywa**: +100% bonus — odrzucone bo złamane endgame.

#### Decyzja D2.25 — 3 typy mini-gier treningowych
- **Wybór**: Aport (timing+accuracy), Bieganie (endurance + obstacle avoid), Posłuszeństwo (Simon Says memory).
- **Uzasadnienie**: 3 różne mechaniki = replay value + suit różnych preferencji.
- **Alternatywa**: 1 generic MG — odrzucone, brak variety.

#### Decyzja D2.26 — Level psa 1-20 z hunger decay slowdown
- **Wybór**: Level 1 hunger -3/day, Level 20 hunger -1.8/day (-40% slowdown). Wolniej niż gracz (-15/day = 5× wolniej baseline).
- **Uzasadnienie**: user explicit "kilkukrotnie wolniej + level slower decay". Plus Level 20 cap zachowuje meaningful pet care nawet endgame.
- **Wpływ**: late game pies prawie samowystarczalny ale gracz musi pilnować baseline.
- **Alternatywa**: 1× wolniej tylko — odrzucone, user explicit "kilkukrotnie".

#### Decyzja D2.27 — Sklep zoologiczny + Weterynarz jako fizyczne budynki
- **Wybór**: 2 nowe budynki na mapie. Zoologiczny Z3 (blisko schronisko), Weterynarz Z1 (blisko Szpital — tematycznie pasujące).
- **Uzasadnienie**: spójność z mapą fizyczną. Plus tematyczne grupowanie (zoologiczny w district pet, weterynarz w district medical).
- **Wpływ**: 2 nowe building additions + overlap audit per (reguła #8).

#### Decyzja D2.28 — Choroba random event (10-day check)
- **Wybór**: co 10 game-days, 5% chance (15+ dni od checkupa = 20%). 3 sickness types (kaszel/parvoviroza/zatrucie).
- **Uzasadnienie**: prevention reward (zwiększa visit vet incentive) + variety severity.
- **Wpływ**: pies wymaga regularnej opieki.
- **Alternatywa**: never sickness — odrzucone, brak immersion.

#### Decyzja D2.29 — Pies widoczny w **każdym** apartamencie + miski
- **Wybór**: `drawApartmentDog` + `bowl_food` + `bowl_water` w każdym ROOMS.<apartment> objects array (basic/premium/luxury/mansion/mega_villa). Traphouse NIE — bo zakaz adopcji w traphouse (decyzja D2.30).
- **Uzasadnienie**: user explicit "w każdym mieszkaniu jakie posiada gracz". Pies follow gracza w each apt.
- **Wpływ**: 5 apartamentów × draw function dog + 2 obj per apartment.

#### Decyzja D2.30 — Wymóg apartament (NIE traphouse) dla adopcji
- **Wybór**: gracz musi posiadać minimum Basic apartment (lub wyższy) żeby adoptować. Schronisko shows hint "Najpierw kup mieszkanie — pies potrzebuje miejsca".
- **Uzasadnienie**: realistic mechanic + zachęta do progresji apartamentów. Plus brak place w traphouse (gameplay flow).
- **Wpływ**: pies = mid-game reward, NIE day 1.
- **Alternatywa**: zawsze możliwe — odrzucone, brak realism + progresja.

#### Decyzja D2.31 — Śmierć psa jako trwała consequence (NIE auto-revive)
- **Wybór**: hunger 0 → HP loss → death → G.dog.owned=false + cinematic "Twój pies odszedł" + 7-dni cooldown przed nowa adopcją.
- **Uzasadnienie**: meaningful stakes, gracz musi dbać. Cooldown 7 dni = czas żalu (storytelling).
- **Wpływ**: gracze będą careful o feed schedule.
- **Alternatywa**: revival za 1000 zł w vet — odrzucone, brak weight do decyzji.

#### Decyzja D2.32 — Telefon apka "🐕 Mój Pies"
- **Wybór**: nowa apka w folderze Specjalne, 4 tabs (Info/Statystyki/Trening/Inwentarz).
- **Uzasadnienie**: central UI hub dla pet management (analog do innych apek telefonu).
- **Alternatywa**: tylko interakcja in-world — odrzucone, brak overview.

#### Decyzja D2.33 — Mieszaniec/Bezdomny adoption charity mechanic
- **Wybór**: 2 najtańsze opcje (50-100 zł) ale niższe słodkość. Plus achievement "Wybawca" za adopcję.
- **Uzasadnienie**: dobra wartość moralna + alt option dla budget players + storytelling depth.
- **Wpływ**: realistyczne adoption choices.

### Audyty + testy planowane
- PRE-impl: pełny grep pet/dog references (czy nie ma już ghost).
- POST-impl: 14 obszarów audit per sub-faza.
- Overlap audit dla 3 nowych budynków (reguła #8).
- Reguła #11 balans: max IG +50% engagement cap weryfikacja.
- Runtime test `dbg_dog_system.mjs` — full lifecycle.

### Status
- **PENDING** — plan dopisany, czekam na sygnał startu loop Etap 2.

---

### Pomysł #4 — Trader Career + Crypto Exchange

**Pomysł usera** (cytat):
> *"Dodanie nowej ścieżki kariery 'Trader' i nowej mechaniki giełdy kryptowalut. Gracz ma mieć możliwość na giełdzie kupować kryptowaluty, ma być staking, scalping, granie 'longów', granie 'shortów' itp."*

**Moja analiza istniejącego kodu**:
- `G.careers` 6 typów (analog skeleton) — łatwo dodać 7. typ trader.
- `G.bank.investments` — istniejące lokaty bankowe z APR (analog do staking ale niższa stopa zwrotu i brak volatility).
- Telefon apka `Bank` — UI rendering pattern do reuse dla Giełdy.
- Brak crypto/trading system — pure greenfield.

**Decyzje designerskie podjęte samodzielnie**:

#### Decyzja D2.34 — Trader jako 7. kariera (level 1-20)
- **Wybór**: nowa kariera `trader` z level + XP per akcja (analog soundeng/influencer).
- **Uzasadnienie**: spójność z istniejącym career skeleton. Plus progression unlocks features (staking lvl 5, longs lvl 8, shorts lvl 12, scalp lvl 15, max leverage lvl 20).
- **Wpływ**: gracz musi rozwijać karierę żeby unlock advanced features = grind respected.
- **Alternatywa**: tylko 1-time unlock na all features — odrzucone, brak progresji.

#### Decyzja D2.35 — Crypto market simulation (price walks z volatility per tier)
- **Wybór**: 4 tiers volatility (stable 0.5-2% BTC/ETH, mid 2-5% altcoiny, high 5-15% memcoiny, stablecoin ~0.1% USDT). Random walk co 30 game-min.
- **Uzasadnienie**: realistic market behavior + variety risk/reward.
- **Wpływ**: gracze mogą hold safe BTC lub gamble memcoiny.
- **Alternatywa**: 1 token z fixed volatility — odrzucone bo brak choice.

#### Decyzja D2.36 — 12 kryptowalut (analog do realnego rynku)
- **Wybór**: BTC, ETH, SOL, ADA, DOT, LINK, UNI, AAVE, PEPE, DOGE, SHIB, USDT — coverage stable/mid/memcoiny/DeFi/stablecoin.
- **Uzasadnienie**: variety + gracze rozpoznają tokeny z real life = immersion.
- **Alternatywa**: fikcyjne tokeny — odrzucone, brak rozpoznawalności.

#### Decyzja D2.37 — Market events (pump/dump/whale ~3% per tick)
- **Wybór**: 3% chance per tick na major event (pump +5-30%, dump -5-30%, whale move ±15%).
- **Uzasadnienie**: realistic crypto volatility, plus chance dla gracza catch pump/avoid dump = skill matter.
- **Wpływ**: market feels alive + opportunities + risks.
- **Alternatywa**: smooth price changes only — odrzucone bo nudne.

#### Decyzja D2.38 — Staking APR scaled per token risk (5% BTC → 50% memcoiny)
- **Wybór**: stable APR 5-7%, mid 10-15%, high risk 25-50%. Flexible staking + 1% penalty early unstake (<7 dni).
- **Uzasadnienie**: risk/reward proportional. High APR memcoiny = high price volatility risk = nie złamane.
- **Alternatywa**: fixed APR all tokens — odrzucone, brak balance.

#### Decyzja D2.39 — Leverage 2x/5x/10x (level-gated)
- **Wybór**: 2× po lvl 8, 5× po lvl 12, 10× po lvl 20. Liquidation thresholds: 2× = -45%, 5× = -18%, 10× = -9%.
- **Uzasadnienie**: leverage = endgame feature. Liquidation = consequences (NIE only profit).
- **Wpływ**: gracz musi understand risk PRZED leverage.
- **Alternatywa**: 100× max leverage — odrzucone, gameplay-breaking.

#### Decyzja D2.40 — Scalping mini-gra (Lv 15+ unlock)
- **Wybór**: 60s session, gracz manualnie kupuje/sprzedaje na fast chart. Combo bonus 3+ profit = ×2 multiplier. Max 5000 zł/session.
- **Uzasadnienie**: hands-on trading skill demo + analog freestyle MG (engaging gameplay loop).
- **Wpływ**: skill-based reward.
- **Alternatywa**: auto-scalping bot — odrzucone, brak agency gracza.

#### Decyzja D2.41 — Trader Skill Tree 8 nodes (raperST analog)
- **Wybór**: analiza/psychologia/risk_mgmt/whale_intel/staking_pro/scalp_master/leverage_lord/tax_lawyer — różne ścieżki specjalizacji.
- **Uzasadnienie**: analog istniejących skill trees gracza. Variety builds.
- **Wpływ**: gracz może specjalizować się (np. staker vs leveraged trader).
- **Alternatywa**: brak skill tree — odrzucone, less depth.

#### Decyzja D2.42 — Balans cap max daily profit scaled per level
- **Wybór**: Lv 5 max 5k zł profit/day, Lv 20 max 50k zł. Scaled gracza progression.
- **Uzasadnienie**: reguła #11 — NIE złamane. Crypto NIE może replace inne kariery (raper/youtuber pozostaje main path).
- **Wpływ**: crypto = side income, nie main grind.
- **Alternatywa**: bez cap — odrzucone, p2w shortcut.

#### Decyzja D2.43 — Unlock career przez level + earned (NIE auto)
- **Wybór**: Trader career unlocked po lvl 5 + 5000 zł totalEarned. Gracz musi zarobić basowo PRZED crypto trading.
- **Uzasadnienie**: prevention gracz "skip" inne kariery i tylko crypto. Plus story-friendly (zarobiłeś trochę, chcesz inwestować).
- **Alternatywa**: unlocked day 1 — odrzucone, breaks early game flow.

### Audyty + testy planowane
- PRE-impl: grep istniejących bank/investments systems.
- POST-impl: 14 obszarów audit per sub-faza.
- **Reguła #11 + Wymóg 5 audit**: 30-day simulation z portfelem $X → expected vs actual profit cap.
- Round 2 "na pewno done?" per sub-faza.
- Runtime test `dbg_crypto_trader.mjs`.

### Status
- **PENDING** — plan dopisany, czekam na sygnał startu loop Etap 2.

---





---

## AR Trader+Crypto decision log v2.1.405

- D2.44 unlock lvl 6+ analog gamer/beatmaker
- D2.45 6 fictional coins (SNOW stable, MOON volatile, DOGE-NCE memecoin, GOATCOIN, RAPCASH stable, HYPECOIN volatile)
- D2.46 random walk price oscylacja (stable +-2-5%, volatile +-5-15%, memecoin +-10-25%)
- D2.47 staking APY: hold 7+ dni = +0.5%/day compound
- D2.48 scalping mini-game 60s window, max 5 trade per +-1-3%
- D2.49 leverage 2x-5x, liquidation gdy strata 50% margin, cooldown 24h
- D2.50 telefon apka Crypto w folderze Finanse
- D2.51 trader XP = abs(profit_or_loss)/100
- D2.52 locked do lvl 6, apka pokazuje lock


---

## AN Drug career decision log v2.1.408

User cytat: Schedule 1 + GTA 5 inspired. NIE auto-unlock, NIE random event, NIE default OFF. Gracz musi aktywnie odkrywac.

- D2.53 Unlock przez NPC dialog w underground (NIE auto). Default OFF.
- D2.54 Trap mechanika: inventory + cook + sell. Bust risk = loss probability.
- D2.55 Bust = -1000 zl + 1 dzien jail cooldown.
- D2.56 Street slang (NIE legal name): G.trap. Items: traw/krysztal/prosz fictional.
- D2.57 Career XP = sales + cook_quality. Lvl 1-15.
- D2.58 Telefon apka Trap w folderze NPC.
- D2.59 Brak pasive — calkowicie aktywne.
- D2.60 5 achievementy + 5 questy storyline.
