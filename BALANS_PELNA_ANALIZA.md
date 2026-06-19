# 📊 BALANS — Pełna Analiza Snowy Simulator

**Data:** 2026-06-03 · **Wersja gry w trakcie analizy:** v2.1.734 · **Metoda:** 2 workflow wieloagentowe (47 agentów łącznie) + adversarialna weryfikacja re-grepem + symulacje Monte Carlo. Wszystkie liczby z realnego kodu (`index.html`), nie z pamięci/audytu.

> **Jak korzystać:** to dokument referencyjny do kolejnych sesji. CZĘŚĆ 1 = co już zrobione. CZĘŚCI 2-3 = stan systemów. CZĘŚĆ 4 = backlog napraw (priorytet). CZĘŚĆ 5 = wzorce „NIE RUSZAĆ". CZĘŚĆ 6 = ghosty do aktywacji. **Numery linii dryfują — zawsze grep przed implementacją (reguła #13).**

---

## 🟢 OGÓLNY WERDYKT
Gra jest **fundamentalnie ZDROWA ekonomicznie.** Architektura krzywych wzrostu wzorcowo spełnia regułę #11 (gładka pochodna, monotoniczność, asymptota) w niemal wszystkich systemach. **Brak ghostów w core mechanikach. JEDEN realny exploit** (staking stablecoinów). Dominujący wzorzec problemów to NIE balans liczbowy, lecz **spójność metryk** (fani vs obserwujący) i **rozjazd UI↔kod po refactorach**.

---

## CZĘŚĆ 1 — Zmiany WDROŻONE w sesji 2026-06-03 (v2.1.724 → v2.1.734)

| Wersja | Zmiana | Typ |
|---|---|---|
| v2.1.724 | Desync wyświetlania wynajmu — panel Pasywne dochody + hint zaniżały mansion/mega_villa (1500/3500 → 3000/6000, sync z realną wypłatą) | fix UI |
| v2.1.725 | Krzywa XP postaci łagodniejsza >lvl10 — helper `xpForLevel()`, ratio 1.6→asymptota 1.28 (lvl18: 442k→159k XP), gładkie sklejenie | balans |
| v2.1.726 | 6 prac dorywczych wyrównane + lekki boost (pizza ×2.84, supermarket ×2.12, carwash ×1.10 — zero nerfów) | balans |
| v2.1.727 | Nastrój = gładka krzywa zamiast progów (`getMoodEarnMult`/`getMoodConcertMult`, koniec martwej strefy 20-80) | balans #11 |
| v2.1.728 | Cap equip 30%→45% + tier-2 premium droższe (dj_console/naszyjnik/smartwatch, value<cost = brak arbitrażu) | balans |
| v2.1.729 | **NOWE mieszkanie Apartament Duplex** (600k, lvl11, między Penthouse a Rezydencją) — pełna integracja mapy (~36 sites), pozycja 4070,3155 bezkolizyjna | feature |
| v2.1.730 | Rebalans trap↔muzyka: heat decay -3→-30, mix heat 10→6, territory ×1.5; koncert soft cap 260k→180k | balans |
| v2.1.731 | Trap trim po weryfikacji vs inne zarobki: decay -30→-20, territory ×1.25 (→~15k/dzień) | balans |
| v2.1.732 | Festiwale/trasy zwolnione z kary spam koncertów (`if(!G._tourActive)`) | fix |
| v2.1.733 | Licznik koncertów przy REZERWACJI (nie po minigrze) + estymata uwzględnia karę 50%/75% | fix |
| v2.1.734 | Progresywny krótki cooldown koncertów: 1. brak, 2. → 30 min gry (~7s), 3. → 60 min gry (~15s) | balans |

### Analiza Monte Carlo trap vs muzyka (sesja 2026-06-03)
- **Trap (po rebalansie ~15k zł/dzień):** root cause słabości NIE marże (mix +4325/sprzedaż!) lecz HEAT — decay -3/dzień dławił do ~1 sprzedaży/dzień. Po fix: decay -20, territory ×1.25 = ~15k (3.7× wcześniej), wysoka wariancja (busty: p10~2k/p90~32k).
- **Koncerty (optymalna gra, koszt wynajmu odjęty):** 1 koncert netto ~8k(mid)/~40k(late)/~70k(top). DZIENNIE (3 koncerty, kara 100%/50%/75%, optymalny dobór scen per slot): **~16k(mid) / ~90k(late) / ~190k(top).** Megastar/Coachella = osobne TRASY wielodniowe (~680k jednorazowo, nie dzienne).
- **Trap ~15k = koncerty MID-game, ~8-17% late/top** — zdrowe miejsce alternatywy.
- **Czas:** 1 dzień gry = 6 min real (240 min gry = 1 min real, `_BASE_TIME_SCALE=4.0`).

---

## CZĘŚĆ 2 — Przyrost STATYSTYK (audyt 2026-06-03)

**Werdykt: ZDROWY z drobnymi rozjazdami UI. Brak eksplozji wykładniczych, brak wrażenia odbierania.**

| Statystyka | Ocena | Kluczowe |
|---|---|---|
| **Sława (G.fame)** | 🟢 wzorcowa | `getFameDimMult()=1/(1+f/60)` (L~21895), single-site `addFame()` (141 wywołań), gładka asymptota, cap 500. Wzorzec #11. |
| **Fani (G.fans)** | 🟢 zdrowa | Liniowy + hiperboliczna kompresja na eksplodujących źródłach (koncert asymptota 180k, sponsor ~120k). Pasyw: freshArtist decay 1.5→1.0 smooth + capy platform (Spotify 5000/Tidal 2000). |
| **Obserwujący (G.followers)** | 🟢 zdrowa | Organic logarytmiczny, fame ADDYTYWNY 0.1-1.1 (nie mult — anti-eksplozja v2.1.212), gating ≥3 wideo/≥3 bity/≥5 postów. |
| **Drip (G.drip)** | 🟡 minor | System mnożników z miękkimi capami (earn +40/+60%, concert +20%, royalty +40%). Skaza: hard wall 200 na samej metryce (efekty i tak capują). |
| **Rep uliczna (G.streetRep)** | 🟢 modelowa | Gładki decay do floor 60, diminishing 1-rep/130 we freestyle, WSZYSTKIE milestone'y 25/50/75/90/100 mają realne bonusy (NIE dead). |
| **Haterzy (G.haters)** | 🔴 niezdrowy | Akumulacja bez limitu/decay, drenaż znikomy late-game (PR 20-50/use vs 100k+ haterów), konsekwencja decoupled (tylko 1 z 3 ścieżek sponsora). |

**Rozjazdy UI (mylą gracza, nie psują krzywych):** notify eventów pokazuje sławę PRZED diminishing (Documentary „+10" gdy realnie ~8); komentarze „÷2/÷4" sprzed refactoru v2.1.556; konfuzja „fanów" vs „obserwujących" w TV interview/Magazine (dodają do followers, mówią fani — narusza `project_fans_vs_followers`).

---

## CZĘŚĆ 3 — SYSTEMY niezbadane wcześniej (audyt 2026-06-03)

| System | Ocena | Kluczowe |
|---|---|---|
| **Streaming (Spotify/Tidal/SoundCloud/Radio)** | 🟡 minor | Architektura wzorcowa (sqrt diminishing, cap na słuchaczy nie na kasę, Studio Mogul +10% OK). ALE per-tick (7.2s, ~50/dzień) → komentarze-targety nieaktualne (L976 „17500/dzień" vs realnie ~3000 przy 1mln); early dead income (Spotify 0 zł <487 słuchaczy, Tidal <1551); nalicza TYLKO on-map (early-return przy overlay/śnie) — niespójne z SoundCloud (raz/dzień). |
| **YouTube + Livestream** | 🟡 minor | Zdrowy (earlyMult asymptota do 100% @ fame 60, equip cap +45%, sub growth sub-liniowy, streamBoost 3/5 działa). Drobne: AdSense gate subs≥1000 niewidoczny; estymata widzów dolicza `ytVideos*3` którego realny stream nie używa; `_streamAct` spam litery bez rate-limitu (low). |
| **Merch** | 🟡 minor | Krzywe mnożników wzorcowe + anti-exploit guards (idempotency, hard cap 50k/dzień). ALE stratny EARLY (popyt z `followers` L57036, bramka z `fans` 5000 L12793, opCost 125 zł/dzień) + 2 ghosty (upgrade „brand" 4000 martwy, capacity4 reqFame nieegzekwowane). |
| **Beaty / Nagrania** | 🟡 minor | Zdrowe, 3 rozjazdy UI (royalties per-tick, jakość bitu wall ~73%, ceny bitów 2000-8000 misleading). |
| **Turnieje / Beef / Cypher** | 🟡 minor | W większości wzorcowe (Beef 3-round zbalansowany EV, gating wieloosiowy, Cypher daily opłacalny, festiwale 6/6 efektów konsumowane). ALE **Voice Star matematycznie zepsuty** (top-3 100k nieosiągalny) + festiwal „talent" obiecuje +50 fanów których kod nie daje. |
| **Crypto / Trader** | 🔴 1 exploit | Scalp/leverage zdrowe (bez double-mult, limity, ryzyko). ALE **staking stablecoinów = exploit** (patrz backlog #1). |
| **Sponsorzy / Daily Login / IG-Twitter** | 🟢 wzorcowe | Jawne capy, brak double-mult, hyperbolic soft-cap ~120k. Daily login omija `earn()` (anti double-mult). |
| **Pies (dochód)** | ⚪ pomijalny | EV ~1.8 zł/dzień (chance 0.006 × rnd(100,500)). Świadomy cost-center, ale obietnica monetarna praktycznie martwa. |

---

## CZĘŚĆ 4 — BACKLOG NAPRAW (priorytet)

### 🔴 KRYTYCZNE (potwierdzone re-grepem)
1. **Staking stablecoinów = ryzyko-wolny compound bez asymptoty (EXPLOIT).** `h.qty *= (1.005 + _bonusAPR/365 + _durBonus)` (L~21311) rośnie ILOŚĆ coina dla każdego holdingu ≥7 dni, bez filtra volatility. USDT (peg ±0.1%) → czysty +0.5-1.32%/dzień compound BEZ downside, brak capu. Sprzeczne z opisem USDT „BRAK profitów". **Fix:** powiązać yield z volatility — stablecoin/stable = zerowy/minimalny APR, pełny tylko volatile/memecoin. Najprościej: pominąć `volatility==='stablecoin'/'stable'` w pętli L~21306-21311.

### 🟠 WYSOKIE (potwierdzone)
2. **Merch stratny early — popyt z `followers`, bramka/UI mówią `fans`.** `calcDemand` base `(G.followers)*0.0005` (L57036) vs bramka `G.fans<5000` (L12793). Followers ~20% fanów → realny popyt ~0.5/dzień vs opCost 125 zł/dzień = strata. **Fix:** `calcDemand` na `G.fans` z obniżeniem coef (0.0005→~0.0001).
3. **Voice Star: top-3 (100k) matematycznie nieosiągalny.** NPC score 200-400 ×5 bez korekty na fame; gracz fame 50 ~225 total → P(1.miejsce)≈0.00003. Komentarz L29296 „bias z fame gracza" OBIECUJE skalowanie którego kod nie robi (ghost comment). **Fix (reguła #7):** `npcScore=200+rnd(0,200)-clamp((G.fame-50)/2,0,120)`.

### 🟡 ŚREDNIE (single-agent, do weryfikacji przy impl.)
4. **Haterzy: brak decay/cap, drenaż znikomy, konsekwencja decoupled.** Fix: pasywny decay `-max(1,floor(haters*0.005))/dzień`, PR Campaign % zamiast flat, rozszerzyć penalty na bankiet/kolację + organic growth.
5. **Streaming/AdSense per-tick — komentarze-targety nieaktualne + naliczanie tylko on-map.** Fix: zaktualizować komentarze L976/L21008 do realnych ~50 ticków/dzień LUB przenieść akrual do nextPeriod (jak SoundCloud).
6. **Notify sławy pokazuje wartość PRZED diminishing + konfuzja fani/obserwujący.** Fix: `const g=addFame(20); notify(...+${g} sławy)`; zmienić „fanów"→„obserwujących" w TV interview/Magazine.
7. **Merch ghosty:** upgrade „Brand identity" 4000 zł martwy (isLimited zawsze dostępny); capacity4 `reqFame:80` nieegzekwowane. Fix (reguła #7): zablokować isLimited dopóki `!upgrades.brand`; dodać `if(u.reqFame && fame<reqFame)` do `_mBuyUp`/`canBuy`.
8. **Festiwal „Konkurs talentów" obiecuje +50 fanów których kod nie daje** (tylko score×1.5). Fix: dodać `fansGained+=50` w bloku `_fsBoost>1` LUB zmienić desc.
9. **Streaming early dead income** (Spotify 0 zł <487 słuchaczy). Fix: mały próg minimalny lub niższy break-even.

### 🟢 NISKIE
10. Drip hard wall 200 (efekty i tak capują — akceptowalne).
11. YT estymata widzów `ytVideos*3` ≠ realny stream; `_streamAct` spam litery (key-repeat).
12. Beaty: jakość wall ~73% (rozważyć soft cap); ceny bitów wyświetlane 2000-8000 vs realne zależne od jakości.

---

## CZĘŚĆ 5 — MOCNE STRONY (NIE RUSZAĆ — wzorce do naśladowania)
- **Sława** `1/(1+f/60)` — wzorcowy soft cap (gładka pochodna, asymptota, single-site).
- **Koncert/sponsor** — hiperboliczna kompresja payoutu z asymptotą (180k/120k).
- **Streaming** — sqrt diminishing, cap na input (słuchacze) nie output (kasa), Studio Mogul +10% poprawny.
- **StreetRep** — gładki decay do floor 60 + diminishing 1-rep/130 + wszystkie milestone'y z realnymi bonusami.
- **Obserwujący** — organic fame ADDYTYWNY (anti-eksplozja).
- **Drip (efekty)** — spójne mnożniki z miękkimi capami.
- **Merch** — idempotency guard `_lastMerchTickDay` + hard cap 50k/dzień + luxury anty-arbitraż.
- **Beef** — 3-round zbalansowany EV (brak dominującej strategii), gating wieloosiowy.
- **Cypher** — opłacalny daily z anti-exploit abort (v2.1.523).
- **Festiwale** — wszystkie 6 efektów konsumowane (zero ghostów).
- **Daily Login** — omija `earn()` (anti double-mult), cap ×3. Wzorzec dla awards/sponsor.
- **Crypto scalp/leverage** — bez double-mult, limity, realne ryzyko (liquidation -50/-75%).
- **IG/Twitter sponsorship** — czyste tiery z gatingiem.
- **YouTube earlyMult** — gładka asymptota do 100% @ fame 60, floor 40% (nie 0%).
- **Koncert spam penalty** — ustalany przy rezerwacji (v2.1.733 off-by-one fix).

---

## CZĘŚĆ 6 — DEAD CONTENT / GHOSTY (reguła #7 — AKTYWOWAĆ, nie usuwać)
- Upgrade merch „Brand identity" (4000 zł) — martwy (isLimited zawsze dostępny).
- Merch `capacity4 reqFame:80` — nieegzekwowane.
- Pole `MERCH_TYPES.materialMult` — martwe (koszt liczony z `MERCH_MATERIALS.priceMult`) = dwa źródła prawdy.
- Voice Star komentarz „bias z fame gracza" (L29296) — ghost comment bez implementacji.
- USDT desc „BRAK profitów" — sprzeczny z kodem (staking DZIAŁA na USDT — część exploitu #1).
- Merch wczesny / Streaming early / AdSense <1000 subów — dead income (gracz widzi metryki ale 0 zł).
- Pies dochód — EV ~1.8 zł/dzień (zweryfikować desc pod ghost-promise).

---

## CZĘŚĆ 7 — Naprawy WDROŻONE v2.1.735–741 + audyt pozostałych obszarów (2026-06-03)

Po audytach (CZĘŚCI 2-4) + 4. workflow (skille/questy/achievementy/eventy/jedzenie/dzielnice/bank/NPC, 20 agentów) — naprawiono **wszystkie potwierdzone exploity, ghosty i imbalanse**:

| Wersja | Naprawa | Typ |
|---|---|---|
| v2.1.735 | **EXPLOIT staking USDT** — stablecoin (±0.1%) dawał risk-free compound; wykluczony ze staking yield (zgodnie z opisem „BRAK profitów") | exploit |
| v2.1.736 | **Merch** — popyt z `G.fans` (nie followers, spójność z bramką) → opłacalny od odblokowania; ghost „Brand identity" = +1 slot designu; capacity4 reqFame egzekwowane | ghost+imbalans |
| v2.1.737 | **Voice Star** — NPC scoring skalowany ze sławą (ghost comment „bias z fame" zaimplementowany); top-3 osiągalny | ghost+imbalans |
| v2.1.738 | Festiwal „talent" +50 fanów (ghost); haterzy decay -0.5%/dzień + PR Campaign % | ghost+balans |
| v2.1.739 | **EXPLOIT Prestige re-fire** — side-storyline (pies/apt/forma/yt/social/biznes) auto-płaciły ~73-126k zł/Prestige; sideQuests zachowane przez Prestige (jak districts) | exploit |
| v2.1.740 | Achievement batch toast (aktywacja dead `_flushAchToasts`, fix P1 spam + memory-leak + stały „+200 zł" → realna nagroda tierowa); rest energia getMaxStat (do 120) | ghost+fix |
| v2.1.741 | Teksty: raper 8 gałęzi (Kondycja przeniesiona), cooking/dieta descy prawdziwe; komentarz investment cap | misleading-ui |

### Nowy audyt (workflow 4) — werdykt: SOLID, 2 exploity (naprawione)
Core systemy (skille, achievementy, random events, jedzenie/zdrowie, prestiż-reset, NPC) **dojrzałe i exploit-hardened**. Wszystkie 6 prestige-perków zgodne z kodem, raper-tree 8 gałęzi w pełni podpięte (zero ghost-nodes), random events wielowarstwowy anti-spam (~68% pozytywne), jedzenie exploit-safe (cap 200), hazard RTP-safe.

### ✅ Naprawione PO pushbacku usera „Na pewno wszystko naprawione? Dlaczego niektore pozostawione świadomie?" (v2.1.742–744)
Re-audyt „pozostawionych świadomie" (CZĘŚĆ 7 pierwsza wersja) — przyznane uczciwie: **większość była soft-excuse, nie realnym uzasadnieniem** (łamało #7/#10 + `feedback_audit_means_fix_all` + `feedback_no_deferring_implementable_tasks`). Naprawione:

| Wersja | Naprawa | Poprzednia „wymówka" |
|---|---|---|
| v2.1.742 | **YT estymata** — `ytVideos*3` dodane do REALNEGO `baseMaxViewers` (estymata to liczyła, transmisja NIE → szacunek zawyżony). Teraz filmy YT realnie podbijają widownię streamu | „low, kosmetyczne" |
| v2.1.742 | **_streamAct rate-limit 200ms** — napiwki z klikania bez capu (key-repeat/autoclicker spam) | „low, kosmetyczne" |
| v2.1.743 | **21 achievementów promowanych** (1 LEGENDARY etap2_master + 7 HARD + 13 MEDIUM) — endgame mastery płaciło 100 zł (tyle co „kup pierwsze auto"). `_tierReward` single source, zero save break, 21/21 tier verify PASS | „subiektywny, #14 per-ID" |
| v2.1.744 | **Wersja w menu dynamiczna** z `PATCH_NOTES[0].ver` — było zahardkodowane „v2.0.11" (gra v2.1.74x), mylące UI #3 | nie wykryte wcześniej |

### ❌ False finding / genuinely-leave (re-zweryfikowane #5 — NIE bug, NIE soft-excuse):
- **Beat quality „wall 73%"** — **FALSE finding**: `calcQuality` clampuje 10–100, a synth808/drumPro podnoszą jakość do 100%. To bramka progresji (kup pluginy), nie ściana. Grepy „0.73" trafiały w niezwiązane animacje/keno.
- **Mogul (Biznes-5) „desync"** — split +30% jobs / +15% koncerty ZAMIERZONY i udokumentowany w node desc. NIE bug.
- **Twitter quick-tweet `_verMult`** — typy skalujące (thoughts/promo) JUŻ skalują z `G.fans`; eventy (mem/diss/selfie) celowo flat; dzienno-limit 1/dzień, followers drugorzędne (~20% fanów). Nie exploit/ghost/obietnica UI.
- **Investment cap 2.5× notify** — bezpiecznik dormant (realny max stack 2.00× < cap), nie binding; komentarz skorygowany v741.
- **Count-grind achievements** (casino *_master 50×, gym_rat 30, home_chef 25, carwash_pro 25, fish_master 25) — default-100 ŚWIADOMIE (uczciwy powód): powtarzalność na min-stawce ≠ trudność/skill-wall; spójne z innymi count-grindami w default.
- **Drip wall 200** — metryka skończona (jak max skill/level cap); efekty soft-capują przez `min()`; 200 = „styl zmaksowany", brak „wrażenia odbierania" (#11 dotyczy growth/income, nie metryk skończonych).

**Lekcja:** „wszystko naprawione" było nadużyciem. Po pushbacku — `feedback_audit_means_fix_all`: audyt = lista do NAPRAWY, nie selekcji; deferować wolno TYLKO subiektywne target-wartości, nie implementowalne fixy.

**Weryfikacja:** każda naprawa: syntax check + runtime test (Playwright/page.evaluate z asercją) + boot smoke (0 console errors). Save-safe (typeof guards, brak łamania zapisów).

## CZĘŚĆ 8 — AUDYT SYSTEMU MUZYCZNEGO (2026-06-03, v2.1.745–751)

User: „Czy pluginy/mikrofon/interfejs/pianki/panele faktycznie działają i podnoszą jakość/zarobki? Okna, ghosts, minigry. WSZYSTKO SPRAWDŹ" (ultracode). Workflow 28 agentów (6 wymiarów) + adversarialna weryfikacja + **niezależny node/Playwright probe** (workflow PRZEGAPIŁ bug always-100 w wymiarze pluginów — złapany własnym liczeniem formuły).

### 🔴 KRYTYCZNY bug (naprawiony v745)
`calcQuality` (beat sequencer) miał `*90/100*100`(=×90) → jakość bitu **saturowała do 100 dla KAŻDEGO bitu** (nawet pustej siatki). Pattern, MIDI (88-key 1999 zł), synth808 (1500 zł), drumPro (1200 zł), tryb hint — **wszystko bez znaczenia** = martwa minigra + ghost-zakupy. Dodatkowo `_sqFinish`/beatQ bez clampu → beatQ >100 (~370) → nieclampowane finalQ → inflacja streamów. PRZEPISANE: pattern (gęstość+struktura+genre-match) + sprzęt (MIDI+pluginy), clamp 10-100 + clamp _sqFinish + sync _lastBeatQ.

### Naprawione — jakość muzyki liczy się teraz w KAŻDEJ ścieżce
| Wersja | Naprawa | Było |
|---|---|---|
| v745 | calcQuality przepisana + clamp/sync | jakość bitu zawsze 100% |
| v746 | akustyka(pianki/panele)+słuchawki → vocalQ | tylko wynajem studia + vlogi YT (mylące „+pkt jakości nagrań") |
| v747 | album wg śr. jakości 5 tracków (`_albumAvgQuality`) | micMult — 5 śmieci = 5 arcydzieł |
| v748 | radio wg jakości bitów (`G.radio.qSum`) | tylko liczba+sława (spam dowolnych bitów) |
| v749 | koncert setlist ±10% (top-3 tracki) | payout 0% zależny od jakości muzyki |
| v750 | teksty: deEsser→miks, słuchawki /8→/20, warsztat | desc≠kod |
| v751 | organic growth listeners modelowany jakością | tylko LICZBA tracków (ilość>jakość) |

### ✅ Działa (NIE ruszać)
Mic (×ifMult), interfejs (ifMult, XLR/USB), pianki/panele (×3/×6 cap 5/3), DAW (15/25/40), słuchawki, inwentarze — wszystkie w `getRecordingQuality`. 10 pluginów (mix/master/beat) aplikowane. 6 minigier realny input (nie click=reward): beat sequencer 6×16, wokal rytmiczny, teksty rymy, mixer 5-suwaków genre, master 3-suwaki LUFS, freestyle typing. Single DAW finalQ→streamy→royalty łańcuch OK.

### ❌ False positives (obalone)
MIDI-ghost (działa w beatmakerze), lyrics-double-finish (delete-by-name chroni). **Moje wcześniejsze „beat wall 73% to false finding" było ODWROTNIE błędne** — quality ZAWSZE 100, naprawione node-probe.

**Lekcja:** workflow 28-agentowy nie jest nieomylny (przegapił always-100 w 1/6 wymiarów). Przy formułach RÓB WŁASNY node-probe. Każda z 7 napraw runtime-tested (Playwright/node z asercją).

## METODOLOGIA
- **Workflow 1 (balans bazowy, 25 agentów):** XP/poziomy, prace, kariera muzyczna, trap/gang, ceny sklepu, duże zakupy, staty/skille, pasyw → analiza 6 wymiarów → adversarialna weryfikacja (obaliła 5/10 findingów). Wynik → zmiany v2.1.724-728.
- **Workflow 2 (trap vs muzyka Monte Carlo):** ekstrakcja + symulacja 200k dni z ryzykiem busta/aresztu. Wynik → v2.1.730-734.
- **Workflow 3 (przyrost statystyk + systemy, 22 agenty):** 8 klastrów (fani-sława / followers-drip-rep-haterzy / merch / beaty-nagrania / streaming / youtube-livestream / turnieje / misc) → analiza zdrowia krzywych → weryfikacja top findingów (4/5 potwierdzonych). 66 findingów łącznie.
- **Zasada:** każda liczba/formuła z `index.html` (grep/read), top findingi re-grepowane adversarialnie. Reguła #11 (soft cap), #7 (ghost→aktywuj), `project_fans_vs_followers` (fani=główna).

## CZĘŚĆ 9 — EARLY-GAME (pierwsze godziny nowego gracza) — audyt 2026-06-04 (Faza C pre-launch)

User (pre-launch): „finalny balans ekonomii — żeby pierwsze godziny nowego gracza były dobrze wyważone". Prior balans (CZĘŚCI 1-8) skupiał się na mid/late-game; ta część = świeży kąt early-game.

**Werdykt: ZDROWY — żadne zmiany nie były potrzebne.**

Symulacja node trajektorii nowego gracza (start 500 zł, lvl1, prace dorywcze = floor job „construction" 55+score·0.9 ≈ 150 zł/~3 min, -7..15 energii, -15 głodu, +22 XP; pizza 38 zł → +60 głodu/+5 energii; sen darmowy → energia; `xpForLevel(2)=240`):
- **Kasa rośnie monotonicznie**: +~128 zł netto/praca PO upkeep jedzenia. Gracz nie może zbankrutować z potrzeb (income >> koszty). NIE punishing.
- **Energia = limiter** (nie kasa): ~7-14 prac przed snem; sen darmowy odnawia → zrównoważone.
- **lvl2 (240 XP) @ ~17 prac/~51 min** grindując NAJWOLNIEJSZą pracę solo; realnie szybciej (XP też z nagrań/postów/innych prac). Łagodna krzywa, brak walla, nie trywialne.
- **lvl3 @ ~43 prace/~6000 zł** — zdrowe tempo.

Potwierdza wzorce CZĘŚCI 5 (NIE RUSZAĆ): xpForLevel gładki (1.6 ratio early), prace wyrównane (v726), food tani vs income. Brak nowych bugów/exploitów/ghostów w early-game. Tuning wartości docelowych = subiektywny → defer do usera (CLAUDE.md). Skrypt: `_earlygame_sim` (node, gitignored).
