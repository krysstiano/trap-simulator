# 🤖 Dziennik decyzji autonomicznych — praca nad PDF (loop)

**Cel:** rejestr pytań, które zadałbym userowi, + odpowiedzi które wybrałem sam (z uzasadnieniem), żeby user mógł później przejrzeć i dostroić/zmienić. Loop dopisuje tu KAŻDĄ decyzję designerską/balansową podjętą bez pytania.

**Format wpisu:**
```
### [vXXX] <feature> — <data>
- ❓ Pytanie: <co bym zapytał>
- ✅ Wybór: <co wybrałem>
- 💡 Uzasadnienie: <dlaczego, na bazie wiedzy o grze>
- 🔧 Łatwo zmienić: <gdzie w kodzie + jak dostroić>
```

---

## Decyzje sesji 2026-06-15 (wznowienie loop)

### [v904] Prace dorywcze — kontener „Gigi" (telefon) zamiast N budynków na mapie
- ❓ Pytanie: każda nowa praca dorywcza = nowy budynek na mapie (jak pizzeria/myjnia), czy wspólny hub?
- ✅ Wybór: **telefoniczna tablica zleceń „Gigi"** (folder Kariera) — reużywalny kontener `GIG_DEFS`, każda kolejna praca = 1 wpis + 1 funkcja minigry. Pierwsza: Ulotki (canvas, 45 s, klikasz chętnych przechodniów).
- 💡 Uzasadnienie: ~10 nowych budynków = osobny DUŻY task „nowe lokacje" + wysokie ryzyko overlap #8 / draw case / minimapa (memory `feedback_new_map_objects_need_draw_functions`). Gig-app: zero ryzyka mapy, jeden punkt integracji, atomowe dokładanie prac, realistyczne (gig-economy apka). Prace dorywcze BEZ hard-limitu (`feedback_no_job_cooldowns`) — naturalny limiter = koszt energii/głodu (jak istniejące prace, NIE `_careerSoftCap`).
- 🔧 Łatwo zmienić: `GIG_DEFS` w `renderPhoneApp('gigs')` (dodaj wpis), funkcja `start<Nazwa>MG` wzorowana na `startFlyerMG`. Część prac z PDF (mechanik/fotograf/ochroniarz) może później dostać własny budynek, jeśli user zechce — wtedy przeniesienie launchera z gig-app do tryInteract.

### [v904 / SKIP #13] PARTIAL „gatunki + manualny BPM w sekwencerze" — JUŻ ISTNIEJE
- ❓ Pytanie: budować od zera czy istnieje?
- ✅ Wybór: **SKIP — feature kompletny, zweryfikowany runtime (reguła #13).** Bez zmiany kodu, bez commita.
- 💡 Uzasadnienie: PRE-impl grep wykrył pełną implementację (jak relacje NPC i odzież). **Gatunki**: `GENRES` (9 gatunków: trap/boombap/drill/reggaeton/jerk/afrobeat/electronic/rnb/jazz_fusion) + `GENRE_KEYS`, dropdown `sq-genre-pick` w standalone beatmakerze (v2.1.821) ORAZ `daw-genre` w pełnym DAW — gatunek wpływa na hinty + sugerowany BPM + `genreScore` w `calcQuality` (REALNY wpływ na jakość, nie ghost). **Manualny BPM**: slider `sq-bpm` (type=range, min 70 max 160), ustawia `window._sqBpm`, `_sqRestartTimer` realnie restartuje interwał `60000/(_sqBpm*4)` = live zmiana tempa. DAW `dawLaunchBeatMaker()` → ten sam `startBeatSequencerMG()`. Runtime `dbg_v904_sequencer_genre_bpm.mjs` ALL PASS (9 gatunków, picker, sugerowany BPM drill=145, slider 70-160, _sqBpm 145→155 live, restart timer), 0 błędów.
- 🔧 Łatwo zmienić: `GENRES` (L~29805) dodać gatunki; `sq-bpm` slider zakres (L~28057). DAW pokazuje tylko „Preset BPM: zakres", manualny slider jest w samym sekwencerze (wystarcza — gracz edytuje tempo tam).

---

## Decyzje już podjęte tej sesji (2026-06-14, v867–v881) — do ewentualnego dostrojenia

### [v869] Pogoda ↔ relaks — mnożniki nastroju
- ✅ Wybór: słońce ×1.15, pochmurno ×1.0, mgła ×0.6, śnieg ×−0.3, deszcz ×−0.6, burza ×−1.0 (ujemne = pogarsza).
- 💡 Wzorzec z istniejącego skateparku (deszcz 0.5/burza 0.4); ujemne by „wręcz pogarszało" wg PDF.
- 🔧 `getWeatherMoodMod()` — wartości w switch.

### [v870] Suplementy Zbyszka — tiery/ceny/progi przyjaźni
- ✅ Wybór: 4 tiery (progi przyjaźni 25/45/60/80), ceny 600/1300/2200/3800 zł; efekty +forma/+health/+energy + buff XP ×1.2–1.4 (1500–2700 s); dostępność dzienna ~50–70%.
- 💡 forma żywy stat (IG zasięg), buff xp żywy (L31843). Ceny rosną z tierem, drogie wg PDF.
- 🔧 `ZBYSZEK_SUPPS` array + `_zbyszekSuppsAvailable()`.

### [v874] Status zniesławienia — progi/wartości
- ✅ Wybór: 0–100; sponsorzy ≥50 tylko duże marki, ≥80 blok wszystkich; decay −2/dobę; +streetRep notoriety n/4; źródła: bust kokainowy +8, broń-przy-kontroli +25, kradzież +15.
- 💡 Notoriety = mniej mainstreamu, więcej ulicy (PDF). Decay łagodny (reguła #11).
- 🔧 `addDefamation()`, `sponsorBrandAvailable()` gate, decay w `nextPeriod`.

### [v875] Broń palna — parametry
- ✅ Wybór: cena 10 000 zł (user), durability 30, obrona w napadzie 70%, kontrola 40% wykrycie (konfiskata+mandat≤2000+defamation 25), utylizacja 800 zł.
- 💡 Risk/reward: ochrona ~30 napadów vs ryzyko zniesławienia/konfiskaty.
- 🔧 `_buyWeapon`/`_disposeWeapon`, eventy „Drobny kradzież"/„Kontrola policyjna".

### [v876] Kradzież gracza — parametry
- ✅ Wybór: sukces 65%, cap 4/dobę, łup gotówka 60–250 + 35% fant (telefon/portfel/zegarek/torebka → Lombard), wykrycie 35% (mandat 200–800 + defamation 15 + haters 15–40 + fame− + 25% areszt 1–2d).
- 💡 Konsekwencje reużywają zniesławienia/haters/jail. Cap anti-spam.
- 🔧 `_attemptTheft`, `STOLEN_ITEMS`, event „Okazja do kradzieży".

### [v877] Studio — ceny
- ✅ Wybór: 45k (lvl5+) / 60k (lvl3-4) / 85k (lvl1-2) (było 25/35/50k; user „droższe").
- 🔧 `studioPrice` L~14813.

### [v878] Ulepszenia merchu — ceny (audyt 14-ag: wszystkie 13 REAL)
- ✅ Wybór: capacity 8k/25k/75k, dist 13k/38k, marketing 11k, collab 20k, materiały 6k/20k, sloty 3.5k/10k/30k, brand 6k (wg rekomendacji ROI audytu).
- 🔧 `MERCH_UPGRADES` array cost.

### [v881] Lokaty długoterminowe — dni/stopy
- ✅ Wybór: 15 dni/+40%, 25 dni/+60% (user dał dni 15/25 i gradację; % moje); max 100k każda, max 1/tier.
- 💡 Gradacja: short-term 34% < 15d 40% < 25d 60%. Dni dopasowane do doby 15 min.
- 🔧 `investLokata(amount,days)`.

### [audyt 2026-06-14] Wtyczki DAW/beatmaker — ceny i działanie (Workflow 11 ag)
- ❓ Pytanie: czy ceny wtyczek wymagają zmiany i czy wszystkie faktycznie działają?
- ✅ Wybór: **NIE zmieniam cen.** Wszystkie 10 wtyczek = APPLIED_REAL (zero ghostów): efekty czytane w `dawDoMix` (L30273), `dawDoMaster` (L30329), `calcQuality` sequencera (L27972) + sufit `getDAWPluginCeiling` (cap +30, anti-stack). Mnożnik 1.0 (stary bug 0.4 naprawiony v122).
- 💡 Uzasadnienie: audyt ocenił ceny jako „optimal/fair" — rekomendacje były marginalne (drumPro lekko za tanio 1200→~1400; limiterLoud 1500→~1400 i stereoImager 1000→~950 lekko za drogo = ZNIŻKI). Zniżki kłócą się z kierunkiem usera „drożej", a reszta zbalansowana → churn niewart. Ceny: eqPro 800/punchComp 1200/reverbSpace 900/deEsser 500/tapeSat 700(miks+master)/limiterLoud 1500/stereoImager 1000/multibandComp 2000/synth808 1500(trap/drill only)/drumPro 1200.
- 🔧 Łatwo zmienić: `plugList` array ~L29978 (pole `price`).
- 🔁 **UPDATE (user 2026-06-14): „delikatnie zwiększ ceny wtyczek" → podniesione ~+30% (v883 `f8e6354`):** eqPro 800→1050, punchComp 1200→1550, reverbSpace 900→1150, deEsser 500→650, tapeSat 700→900, limiterLoud 1500→1950, stereoImager 1000→1300, multibandComp 2000→2600, synth808 1500→1950, drumPro 1200→1550. Kolejność zachowana. (Mój pierwotny „nie zmieniaj" był oparty na audycie „ceny fair" — user wolał lekko w górę, zgodnie z ogólnym kierunkiem „drożej".)

### [v885] Myjnia — magnituda napiwku premium + rep-90 (audyt 6 prac dorywczych, user 2026-06-14)
- ❓ Pytanie: user zgłosił „któraś praca (prawdopodobnie zmywak) — bonus kilkukrotnie większy niż główny zarobek". Którą pracę naprawić i o ile zmniejszyć bonus?
- ✅ Wybór: **MYJNIA** (nie zmywak — user pomylił „zmywak"↔„myjnia", oba mycie). Flat +500 zł co 5. mycie → **proporcjonalny +60% wartości mycia** (`Math.max(60,floor(pay*0.6))`). Dodatkowo zaimplementowany **ghost rep-90 „+30% napiwki carwash"** (`pay*1.3` przy streetRep≥90).
- 💡 Uzasadnienie: audyt workflow (6 ag) flagował 4 prace, ale weryfikacja kodu (reguła #5): **zmywak OK** (combo capnięty +35 w v572), **pizza/budowa/supermarket = stack mnożników getPracaBonus** (normalny dla WSZYSTKICH prac, NIE osobny bonus = false positive), **kurier rush 300-525 = zamierzony quest „Pilna przesyłka"** (30% okazjonalnie). Tylko myjnia miała **flat osobny napiwek** dławiący bazę (~247) 2-3×. Proporcjonalny +60% = solidny evo-reward który skaluje się z progresją i NIGDY nie przebija bazy (reguła #11). +60% bo: PU dają +30/60/90% — napiwek premium powinien być w tej skali, poniżej najwyższego PU.
- 🔧 Łatwo zmienić: `_finCW()` L~38550 (`pay*0.6` → inna stawka napiwku; `pay*1.3` → inny rep-90 bonus). Opis evo L~65996.

---

### [v886] Inwestycje bankowe — kształt progresywnego nerfu (LOOP, user backlog 2026-06-14)
- ❓ Pytanie: user „inwestycje dają za dużo, większe kwoty mocniej znerfić" — jaką krzywą nerfu i jak mocno?
- ✅ Wybór: **Baza (+pct% z przycisku) ZAWSZE w pełni** (obietnica honorowana); BONUS ponad bazę (skill+global) capowany progresywnie: **`bonusCapMult(amount)=0.3 + 1.0/(1+amount/30000)`** → 5k≈1.16× / 40k≈0.73× / 100k≈0.53× / 250k≈0.41× / ∞→0.3×. Cap WIĄŻE po globalMult (fix bypassu).
- 💡 Uzasadnienie: prosty cap-na-totalu psułby bazowe stawki dużych produktów (Diamond +100%: cap<baza). Capowanie tylko BONUSU ponad bazę honoruje obietnicę przycisku + daje progresję wg kwoty (reguła #11: gładko, monotoniczny total, asymptota). 40k @ maxed → ~83k (było 100k) — realny nerf bez gnębienia (skill wciąż się opłaca). Pivot 30000 + asymptota 0.3 dobrane tak by: małe lokaty prawie nietknięte (skill feel), whale'e mocno przycięte.
- 🔧 Łatwo zmienić: `nextPeriod()` maturity tick (`_bonusCapMult` ~L23186) + helper `_investReturnPreview` (~L1808) — TE SAME wartości muszą być w obu (UI=wypłata). Mocniejszy nerf → obniż asymptotę 0.3 lub pivot 30000. Słabszy → podnieś.
- 📌 Crypto staking (daily compound, asymptota v773) i kruszec (trading) = osobne mechaniki, NIE ruszane (osobne itemy backlogu).

### [diagnoza 2026-06-14] Crypto + Kruszec „nie działają" → STALE BUILD (NIE kod) — bez zmian
- ❓ Pytanie: user „crypto znowu nie działa, kruszec nie działa" — naprawić kod czy to stary build?
- ✅ Wybór: **NIE zmieniam kodu** — oba systemy DZIAŁAJĄ lokalnie (runtime-proven). Crypto (`dbg_v887_crypto`): unlock lvl6 via `checkCareerUnlocks` ✓, render/buy/sell/staking/12 coinów/helpery ✓. Kruszec (`dbg_v888_metals`): render/buy(spent dokładnie 2000)/sell/tick/4 metale ✓. `deploy/index.html` = BAJT-W-BAJT identyczny z index.html (ma _cryptoBuy/METALS/v886). 0 błędów.
- 💡 Uzasadnienie: instrukcja usera wprost — „jeśli działa lokalnie → info re-deploy, nie re-kod". Wzorzec sesji: WSZYSTKIE „nie działa" usera = stale build (7 bugów PDF + crypto + metals). Naprawianie działającego kodu = ryzyko regresji bez zysku (reguła #7 nie psuj).
- 🔧 Akcja USERA (nie kodu): re-upload folderu `deploy/` na Netlify + **Ctrl+Shift+R** (twardy refresh, omija cache). Weryfikacja: wersja w menu głównym (lewy-dół) powinna pokazać **v2.1.886** — jeśli mniej, to stary build.
- 📌 Zbadana ciekawostka (nie bug): pierwszy zakup coina zwraca ~1650 zł = jednorazowe nagrody (quest crypto_buy 220 + achievement first_trade + storyline) — NIE per-buy, NIE exploit.

### [v887] Sejf domowy — zakres, cena, parametry napadu (LOOP, PDF linia 28)
- ❓ Pytanie: jak zaimplementować „sejf" z PDF — co chroni, ile kosztuje, jak duże ryzyko napadu, czy per-lokację?
- ✅ Wybór: **Sejf na GOTÓWKĘ** (1 globalny, phone-app „Sejf" w folderze Finanse). Cena **25 000 zł** (drogi/pożądany wg PDF). Wpłata/wypłata gotówki; kasa w sejfie 100% chroniona, BEZ odsetek (≠ bank/lokaty). Ryzyko: event „Napad rabunkowy" — on-hand ≥8000 zł, noc, ulica → max **10% / sufit 3000 zł** z gotówki PRZY SOBIE, nigdy z sejfu; broń odstrasza 70%; rzadkie (0.006, maxPerDay 1).
- 💡 Uzasadnienie: PDF chce sejfu drogiego+pożądanego, chroniącego przed kradzieżą. Cash-safe integruje się z istniejącym crime-clusterem (defamation/broń/kradzież v874-876) — analogowo do „Drobny kradzież". Napad CAPOWANY+unikalny (reguła #11, user wrażliwy na „odbieranie") = sejf ma sens bez gnębienia. Bez odsetek = wyraźne odróżnienie od banku (bank=pomnażanie, sejf=bezpieczeństwo).
- 🔧 Łatwo zmienić: `SAFE_PRICE` (~L20300), event „Napad rabunkowy" (RANDOM_EVENTS — `0.10`/`3000` cap, próg `8000`, chance `0.006`). Mocniejszy nerf gotówki → podnieś % lub obniż próg.
- 📌 ŚWIADOMIE POMINIĘTE (możliwe rozszerzenie, gdyby user chciał): (1) sejf PER-LOKACJĘ (PDF: max 1 na mieszkanie/willa/studio/kamper) — zrobiłem 1 globalny „domowy"; (2) ochrona TOWARU narkotykowego w sejfie (PDF wspomina towar/materiały) — obecnie tylko gotówka, towar chroni stash/Kryjówka. Nie obiecywałem tych w UI (brak ghosta).

### [v888] OLX — model sprzedaży, premia, opóźnienie, ryzyko (LOOP, PDF linia 49)
- ❓ Pytanie: jak zrobić OLX żeby NIE dublował Lombardu (który płaci pełną wartość instant)? Premia? Opóźnienie? Ryzyko kradzionego?
- ✅ Wybór: OLX = **premia +30%** (value×1.3) ale **opóźnienie 1-3 dni** (kupiec via daily tick). Lombard ZOSTAJE: instant, pełna wartość, anonimowy. **Kradzione na OLX: 20% wykrycia** → konfiskata + defamation+10 + hejterzy 5-20. Zakres: itemy z ekwipunku (valuable/equip/material z value>0; quest/consumable wykluczone; equipped auto-poza-inventory).
- 💡 Uzasadnienie: Lombard płaci pełną value od ręki → OLX musi dać COŚ więcej (premia) za COŚ (czas) = czysty trade-off (impatient→Lombard, patient→OLX). Kradzione: Lombard anonimowy(safe) vs OLX drożej+ryzyko = realny wybór (PDF chce ryzyka sprzedaży kradzionego). 20% detection = 80% sukces przy +30% premii = EV dodatni ale z napięciem (reguła #11, nie gnębi). Kredyt bezpośredni (nie earn()) = jak Lombard, premia nie inflowana globalnymi mnożnikami.
- 🔧 Łatwo zmienić: `OLX_PREMIUM` (1.3) i `OLX_STOLEN_DETECT` (0.20) — stałe przy funkcjach OLX (~L20388). Dni: `1+floor(random*3)` w `_olxList`. Mocniejsza zachęta → podnieś premię; więcej ryzyka kradzionego → podnieś detect.
- 📌 ŚWIADOMIE: ciuchy/odzież NIE w OLX jeśli są osobnym wardrobe (sprawdzić przy „odzież Lumpeks/PEPCO"); obecnie OLX = itemy z G.inventory (valuable/equip/material).

### [skip] Relacje NPC — JUŻ ZAIMPLEMENTOWANE (reguła #13, brak duplikatu) — 2026-06-14
- ❓ Pytanie: budować system relacji NPC (poziomy/SMS) z PDF linia 22?
- ✅ Wybór: **NIE budować — już istnieje kompletny system** (PRE-impl grep #13). `renderPhoneFriendships` (panel 8 NPC, tier ×1.0-1.5, bonusy, lokacje), `addFriendship`/`getFriendshipBonus` (progi 25/50/75/100), `_smsReply` (player↔NPC SMS), `renderPhoneNPCMap`, story-arcs 5-krokowe, daily-talks. Runtime-zweryfikowane: działa.
- 💡 Uzasadnienie: budowa duplikatu = naruszenie #13 + bloat + ryzyko bugów. PRE-impl grep (zanim cokolwiek napisałem) wykrył istniejący system — dokładnie po to jest reguła #13.
- 📌 PDF linia 22 „**zwiększenie poziomów historii relacji + ilości NPC**" = content-expansion (więcej story-beatów per NPC, nowe postacie) = DUŻA → **defer do sesji z userem** (nowe wielkie systemy nie autonomicznie, best-practice). Można też dodać player-initiated SMS „napisz pierwszy" (drobny kanał) — opcjonalne, low-value (jest _smsReply + dialogi + mapa).

### [v889] Odzież zwykła (PEPCO/Lumpeks) — zakres + parametry (LOOP, PDF l.85)
- ❓ Pytanie: PDF chce taniej „odzieży zwykłej" 0-drip + lokacji PEPCO/Lumpeks. Co zbudować, skoro OUTFIT_CATALOG już ma tanie outfity?
- ✅ Wybór: Dodać 2 outfity 0-drip do ISTNIEJĄCEGO sklepu/wardrobe (NIE nowy budynek): „Codzienny ciuch" (50zł, 0 bonus — czysty tani ubiór zamienny) + „Robocza czerń" (90zł, +3 rep + +4% prace fizyczne, dyskretny czarny look). **Nowy BUDYNEK PEPCO na mapie = DUŻE → defer z lokacjami** (mapa/overlap #8).
- 💡 Uzasadnienie: istniejące tanie outfity (polo/street/sport) dają drobne bonusy (sława/rep) ale brak czystej „zwykłej" 0-bonus (PDF „standardowa/zamienna, nie dodaje drip") + brak „czarnej roboczej" (PDF l.81 ochroniarz wymaga czarnego outfitu). „work_black" = dual: PDF pracownicza + setup pod przyszłego ochroniarza + crime-flavor (pasuje do klastra defamation/broń/kradzież). 0-drip = wprost wg PDF. Budynek na mapie odłożony bo to ta sama robota co reszta nowych lokacji (zrobić razem).
- 🔧 Łatwo zmienić: OUTFIT_CATALOG/allOutfits (~L33356/33446) ceny/bonusy; getPracaBonus (~L1898 work_black ×1.04); buyOutfit first-buy (~L35071 work_black +3 rep).

### [v892] Luksusy zakładalne — model „noszenia" (user direct task, „chcę móc je nosić")
- ❓ Pytanie: jak zrobić luksusy (torby/paski/buty z LV/Chanel/Hermès) „noszone", skoro drip dają już przy ZAKUPIE (permanentnie, cap 200)?
- ✅ Wybór: noszenie = AKTYWNY bonus DODATKOWY (nie rusza drip-z-zakupu): `G._wornLux` max 3, `getWornLuxDrip()` = Σ floor(item.drip/2) noszonych, cap +40 → hook w `getEffectiveDrip` (clout). Toggle w Kolekcji w Szafie.
- 💡 Uzasadnienie: drip-z-zakupu zostaje (save-safe, brak nerfu posiadaczy) — noszenie to osobny aktywny „flex" bonus (PDF l.48: noszenie marek → drip/clout). Cap +40 + max 3 = bounded (getEffectiveDrip steruje followersami/koncertami globalnie, nie może eksplodować). NIE robiłem wearable-sprite (zbyt duże); „noszenie" = stan + bonus + widoczność, nie zmiana sylwetki gracza.
- 🔧 Łatwo zmienić: `getWornLuxDrip` (~L1779, dzielnik /2 i cap 40), max 3 w `_toggleWornLux`.

### [v894] Wiele aut + sprzedaż — architektura (user direct task, pełna spec)
- ❓ Pytanie: jak zrobić „kilka aut na mapie, każde z V, wybór którym jeździć, sprzedaż 35-50%", skoro jest pojedyncze G.car?
- ✅ Wybór: **garaż przy Salonie** (NIE N aut rozsianych po mapie). Aktywne `G.car` (na mapie, V jak dotąd) + `G._carCond={nazwa:{cond,color}}` (per-auto stan+kolor, zapis/odczyt przy przesiadce). Przesiadka + sprzedaż w Salonie. Cena = `wartość×(0.35+0.15×stan/100)` (35%@0→50%@100). Dialog gameConfirm: stan + rekomendacja przeglądu + cena teraz vs po naprawie do 100%.
- 💡 Uzasadnienie: literalne „N aut rozsianych po mapie z V przy każdym" = duże ryzyko (per-auto pozycje + draw + overlap #8 + V-nearest logic) — sprzeczne z „ZERO bugów". Garaż-przy-Salonie dostarcza CAŁĄ funkcjonalność (posiadanie wielu, wybór którym jeździć, sprzedaż wg stanu) bezpiecznie i minimalnym refaktorem (G.car=aktywne nietknięte, cała jazda/parkowanie/wear/draw działa). Aktywne auto JEST na mapie (V). gameConfirm zamiast mg-job (po lekcji z niewidocznymi modalami).
- 🔧 Łatwo zmienić: `_carSellPrice` (~L34356, 0.35/0.15 = widełki 35-50%), CAR_CATALOG (ceny). Gdyby user chciał literalnie auta-rozsiane-po-mapie → osobny, większy temat (mapa).

### [v895] Czysty onboarding — kolejność realizacji UX (user direct, AskUserQuestion)
- ❓ Pytanie (zadane userowi — duży wieloczęściowy temat): od czego zacząć? Czysty onboarding vs interaktywny poradnik vs wszystko-po-kolei.
- ✅ Odpowiedź usera: **„Wszystko w tej kolejności"** → Faza 1 (czysty onboarding + mniejszy „Twój cel") TERAZ, Faza 2 (interaktywny poradnik-cutscena) jako kolejny duży krok, przyrostowo.
- 💡 Faza 1 zrobiona (v895): toasty kolejkowane podczas poradnika (root cause: #msg z9999 > intro z9998), widget mniejszy. Faza 2 = framework teleport+kamera+highlight+scripted, najpierw temat „jedzenie" (wzorzec), potem reszta — plan w memory [[project_snowy_session_2026_06_14_pdf_quickwins]].
- 🔧 Łatwo zmienić: widget rozmiar (~L48282 cssText + L48288 innerHTML fonty); gating toastów (showMsg L59806 warunek; flush w _introClose).

## Decyzje z loop (dopisywane poniżej):

### [v896] Interaktywny poradnik (cut-scenki) — Faza 2 UX, architektura + zakres pierwszego tematu
- ❓ Pytanie: jak zbudować poradnik-cutscenę (teleport do sklepu/lodówki, kamera, podświetlanie) i ile tematów objąć w pierwszym kroku?
- ✅ Wybór: **silnik data-driven** (`_INTERACTIVE_TUTORIALS` = mapa tematów; krok = {room,px,py,wx,wy,zoom,r,title,body}) + 1 temat referencyjny JEDZENIE (4 kroki). Reuży prymitywów cinematic (`_cinemCam` snap/target/highlight, `body.cinematic-active` HUD-off, kolejka toastów). Trigger = przycisk w Telefon→Pomoc→Mechaniki→Najedzenie. Kolejne tematy = dopisać obiekt do `_INTERACTIVE_TUTORIALS` + pole `itut:'<id>'` na mechanice.
- 💡 Uzasadnienie: jeden silnik + wzorzec (food) = bezpieczny, testowalny przyrost (reguła #10/#15 — DZIAŁAJĄCY kawałek, nie wszystko naraz). Reuse cinematic = zero nowego ryzyka kamery. Trigger w Mechanikach jest kontekstowy („czytasz o jedzeniu → pokaż mi na mapie"). Round 2 wykrył 5 integracji do naprawy (ESC/[E]/skróty-podczas-sceny/snapCamera/loadGame-cleanup) — wszystkie naprawione, runtime PASS.
- 📌 DEFER (następny krok, NIE autonomicznie-na-siłę): więcej tematów (sen/energia/praca/studio/koncert/kasyno/trap) + ew. bardziej widoczny entry-point dla NOWEGO gracza (np. przycisk „🎬 Pokaż mi" w powitaniu/Przewodniku). Wzorzec gotowy — dokładanie tematów to drobne edycje danych.
- 🔧 Łatwo zmienić: `_INTERACTIVE_TUTORIALS` (~L48304, dodaj temat); `itut:'<id>'` na wpisie w `GAME_MECHANICS` (~L43231) odsłania przycisk; współrzędne kroków = pozycje obiektów z ROOMS.

### [v897] Diagnoza 3 bugów (IG-post + poradnik-miga/pauza) — metodologia + wybór fixa
- ❓ Pytanie: user 3x zgłasza „nie da się wrzucać postów IG" + „poradnik miga / nie da się pauzować", a moje repro na NOWEJ grze przechodzi. Stale-build czy realny bug? + jak naprawić BUG B (poison display:none) — gonić ~50 openerów/closerów czy single-point?
- ✅ Wybór: (1) NIE ogłaszać „stale build" bez wyczerpującej weryfikacji (raz już byłem w błędzie). Workflow 8 agentów (repro pod realnymi warunkami: loaded-save/mobile/stress/bad-flag + adversarialny skan kodu). Znalazł 3 AKTYWNE bugi w v896. (2) BUG B fix = **CSS `!important` na `#mg-*.on{display:flex}`** (single-point catch-all), NIE edycja 50 openerów. + tryInteract sanity-check inline→computed display.
- 💡 Uzasadnienie: `!important` w stylesheet bije inline `display:none` (bez !important) → klasa `.on` staje się JEDYNYM źródłem prawdy widoczności, niezależnie od ilu closerów zostawia poison i ile będzie nowych openerów w przyszłości. 50-edycyjny refactor openerów = wysokie ryzyko + niekompletność (łatwo pominąć closer/przyszły kod). `!important` = 4 linie, robust. Skutek uboczny (sanity-check w tryInteract używał inline-display jako detektora stuck) naprawiony przez getComputedStyle. BUG A/A-bis = punktowe (usun 'tutorial-popup' z _dynModals; tutorialTick→_uiIsBlocking jako single source of truth wspólny z loop). loadGame cleanup = save-safety (Object.assign przywracał zapisane poison-flagi).
- 📌 LEKCJA (krytyczna): **repro MUSI obejmować ścieżkę WCZYTANEGO ZAPISU + po-wyjściu-z-minigry, nie tylko nową grę.** BUG A manifestował się tylko po continueGame (coach na ekranie), BUG B tylko po wyjściu z minigry zostawiającej poison — nowa gra ich nie pokazuje. Mój pierwszy (pojedynczy) repro dał false-clean. Workflow z wieloma warunkami złapał. → przy „user widzi a ja nie" zawsze testuj loaded-save + stany przejściowe.
- 🔧 Łatwo zmienić: CSS L181-187 (`!important`), `_dynModals` L1600, `tutorialTick` L49388 (`_uiIsBlocking`), loadGame cleanup L62269, tryInteract L12704 (computed). Skan/synteza w transcript workflow wf_ab707e4d-b58.

### [v942] Storyline kariery legal vs illegal (PDF "Trap Simulator" l.25) — 2026-06-15
- ❓ Pytanie: pełny rozgałęziony storyline z wyborami i konsekwencjami, czy lżejsza wersja? (DUŻA, wieloznaczne)
- ✅ Wybór: **najbezpieczniejsza wersja edukacyjno-onboardingowa** — wpis "🎬 Ścieżki kariery — od czego zacząć" w Mechanikach (GAME_MECHANICS id `career_paths`) + jednorazowy smart-hint `career_paths_intro` (G.level>=2, NIE auto-modal). Zero nowej mechaniki/save/balansu.
- 💡 Uzasadnienie: sednem PDF jest "USWIADOMIENIE gracza jak zaczac i jaki typ kariery prowadzic" = cel informacyjny, nie mechaniczny. Gra JUZ MA obie sciezki (prace/muzyka/inwestycje=legal; Trap/kradziez=illegal) — brakowalo ich WYJASNIENIA w jednym miejscu. Pelny branching = nowe pola stanu + ryzyko save (#1) i balansu (#11). NIE auto-modal na starcie (anti-overlap przelot, lekcja login-reward x przelot). Wszystkie wymienione aktywnosci zweryfikowane w kodzie (#5): Gigi/pizzeria/kurier/myjnia/magazyn, Studio/koncerty/streaming/merch/radio, Bank+krypto, Trap(Kamper/Lab/dealerzy), kradziez kieszonkowa(v876, Lombard/OLX), heat/bust/areszt/znieslawienie, rep uliczna, dealer 3 poziomy(v941).
- ⏭️ Pominieto (do sesji z userem): rozgaleziony quest-storyline z trwalymi konsekwencjami; "wyludzanie" jako mechanika (brak w kodzie — nie wspomniane, anti-ghost #7).
- 🔧 Łatwo zmienić: wpis `GAME_MECHANICS` id `career_paths` (po wpisie 'money'); smart-hint `career_paths_intro` w `SMART_HINTS`. Jesli user zechce branching → osobna sesja DUZA.
- 🧪 Test: `dbg_v942_careerpaths.mjs` — wpis renderuje sie w Mechanikach, smart-hint zarejestrowany+jednorazowy, 0 bledow.

### [v949] Voice Star restrukturyzacja (PDF "Bledy & wdrozenia" #3) — 2026-06-15
- ❓ Pytanie: PDF chce -70% fanow / -60% kasy "tylko za 1. miejsce, reszta bez zmian" — ale 1. miejsce 100k->40k spada PONIZEJ 2. miejsca (50k). Inwersja cash. Akceptowac? + "+5% szansy za album >80%" gdy albumy nie maja zapisanej jakosci.
- ✅ Wybor: (1) Implementacja DOSLOWNA per PDF: 1. miejsce money 100k->40k (-60%), fans 5000->1500 (-70%); 2./3. miejsce i fani-za-udzial BEZ ZMIAN. Inwersja cash (1st 40k < 2nd 50k) AKCEPTOWANA — prawdziwa nagroda za 1. miejsce to +1 Prestige Skill Point + 20 slawy (prestiz, nie jackpot); modal mowi to wprost. (2) "+5% za album >80%" -> PROXY: wysokojakosciowe single (studioTracks quality>80), bo G.albumsReleased to tylko licznik bez jakosci. Kazdy taki utwor -9 do sily NPC (~+5% szansy). (3) Gating: 2 albumy EP/LP LUB 6 singli o lacznie >=10k odsluchow. (4) Chance 0.005->0.003 (podniesiony prog losowosci). (5) 1. miejsce ~-30% szansy = +45 do score NPC (cap, lagodzone przez HQ single).
- 💡 Uzasadnienie: inwersja cash jest celowa i tematyczna (TV-show win = prestiz). User explicite chcial 1. miejsce mniej oplacalne finansowo (anti-windfall early-game). Proxy HQ-single bo brak danych jakosci albumu w modelu. NPC boost = przyblizenie -30% (dokladny % przez score trudny, udokumentowane jako approx).
- 🔧 Łatwo zmienić: nagrody `_tvContestFinish` (L~31624), gating `_voiceStarEligible` + cond eventu, NPC boost `_npcBoost=45-9*hq`, modal `_msg`. Jesli inwersja cash przeszkadza -> podniesc 1st do 55k (powyzej 2nd) zachowujac -fans/PSP.
- 🧪 Test: dbg_v949_voicestar.mjs PASS (gating, chance 0.003, 1st 40k/1500/PSP, HQ proxy, modal text).
