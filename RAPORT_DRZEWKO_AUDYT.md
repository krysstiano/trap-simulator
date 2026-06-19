# RAPORT — AUDYT DRZEWKA UMIEJĘTNOŚCI
Data: 2026-05-15
Plik: `E:\Snowy Simulator\index.html`
Zakres: SKILL_DEF (linie 37513–37621), helpery (1188–1190, 1192–1344, 1450–1496), renderCharPanel (37623+)

---

## Podsumowanie (TLDR)

- **32 skille** w SKILL_DEF, **7 kategorii**, **3 fazy** (skill → power-ups → evolution).
- **PROBLEM #1 — root cause widoczny u usera:** karty skill mają `width:200px` i wewnątrz nazwa PU ma `overflow:hidden;text-overflow:ellipsis;white-space:nowrap`. Długie PU1 (np. "Mistrz ciasta (+30% zarobki)") są ucinane do "…". PU2/PU3 są krótsze (autor specjalnie nie powtarzał jednostki — np. "Sekret sosu (+60%)"). Stąd user widzi *PU1 z jednostką, PU2/PU3 tylko procent*.
- **PROBLEM #2 — UI obiecuje za dużo dla 6 prac dorywczych + 4 karier:** opisy PU "+30/+60/+100%" sugerują +100% przy PU3, ale `getPracaBonus`/`getKarieraBonus` mnożą `_pu(key)*0.30`, więc PU3 = +90%, NIE +100%. (Identyczny rebalans był zrobiony w v2.1.28 dla 12 skilli z `*0.15` — ale TYCH 10 z `*0.30` przegapiono.)
- **PROBLEM #3 — ghost mechaniki w opisach evo:**
  - `youtuber` evo Algorithm Master: "każdy nowy film +50% views startowych" — **niezaimplementowane**.
  - `charyzma` evo Magnetyzm: "NPC sami proponują zlecenia" — **niezaimplementowane**.
  - `drip_master` evo Trendsetter: "+50% sławy z luxury" — **niezaimplementowane** (mnożnik drip działa tylko przy pierwszym zakupie outfitu).
  - `kurier` evo Multi-zlecenie: "dwie paczki na raz" — mechanika 2x wypłaty działa, ale "dwie paczki" są tylko flavour-text.
- **PROBLEM #4 — KONDYCJA PU nie aplikowane:** opisy PU obiecują "-3/-6/-10% extra spadku energii", ale `kondMult` w linii 11240 używa wyłącznie `kondLvl*0.08` — **`_pu('kondycja')` nigdzie nie używany**. Ghost.
- **PROBLEM #5 — dieta evo niespójność:** opis "Każde gotowanie daje +5 do max formy (do +25)" sugeruje kumulację do +25. Kod (linia 1355) daje STAŁY `max += 5` (=105), bez kumulacji.
- **PROBLEM #6 — `bieg` i `hazard` widoczne pomimo intencji:** komentarz w renderCharPanel (linia 37698) mówi `filtruj hidden skills (bieg/hazard)`, ale w SKILL_DEF brak `hidden:true`. W praktyce są normalnie widoczne. (Decyzja: zostawić widoczne — opisy działają.)
- **PROBLEM #7 — dwa skille mają „+100%" w PU3, ale kod daje +90%:** `youtuber` (powyżej) NIE — youtuber ma poprawnie "+30/+60/+90%" w opisach. Ten skill jest jedynym z PU `*0.30` które ma POPRAWNIE w UI "+90%". Pozostałe karierowe (beatmaker, gamer, influencer, soundeng) mają "+100%". Spójność łamana niespójnie.
- **PROBLEM #8 — funkcja `getLogikaSpeedBonus()` martwa:** zdefiniowana w linii 1269, NIGDY niewywoływana (logika faktycznie działa wewnątrz `getKarieraBonus()` linia 1340 — bez używania getLogikaSpeedBonus). Duplikat / dead code.
- **PROBLEM #9 — opisy PU dla 6 prac dorywczych: jednostka tylko w PU1.** PU1 ma `+30% zarobki`, PU2/PU3 mają samo "(+60%)" / "(+100%)". User explicit "niejasne, czego dotyczy".
- **PROBLEM #10 — comment w `_PU` (linia 1184): "Power-ups daja BAZOWE +30/+60/+100% (PU_STEP = 0.30 czyli pu*0.30)".** Sprzeczność wewnętrzna: PU_STEP=0.30 → suma 3 PU = 0.90 = +90%, NIE +100%. Komentarz dezinformuje autora.

**Łącznie:** 32 skille → 21 SPÓJNE, 1 GHOST (kondycja PU), 5 GHOST częściowe (youtuber views startowych, charyzma "zlecenia", drip Trendsetter luxury, kurier "2 paczki", dieta "do +25"), 10 NIESPÓJNE wartości UI/kod (PU3 +100% vs +90%), 22 skille z brakiem jednostek w PU2/PU3 (UX problem ucinania).

---

## Słownik helperów

| Helper | Definicja | Zwraca |
|--------|-----------|--------|
| `_sk(key)` | linia 1188 | `getSkillLvl(key)` — int 0..max |
| `_pu(key)` | linia 1189 | `getSkillPowerUps(key)` — int 0..3 |
| `_evo(key)` | linia 1190 | 1 jeśli `hasSkillEvolution(key)`, inaczej 0 |
| `getSkillLvl(key)` | linia 1450 | `G.skills[key].lvl` (lub legacy number) |
| `getSkillPowerUps(key)` | linia 1457 | `G.skills[key].powerUps` |
| `hasSkillEvolution(key)` | linia 1463 | `!!G.skills[key].evolution` |
| `_PU(n1,n2,n3, c1=3000,c2=9000,c3=22000)` | linia 37506 | `[{name,cost}*3]` — power-up array |
| `_EVO(name, desc, cost=50000, sp=1)` | linia 37510 | `{name, desc, cost, skillPointCost}` |

---

## Per skill (32 sekcje)

### 1. `pizza` — Pizzaiolo (kat: praca)
- max=3, perLvl=20, op='+', eff=zarobki, emoji=🍕
- Opis: "Większe zarobki w pizzerii" ✅
- PU1: "Mistrz ciasta (+30% zarobki)" [jednostka: TAK]
- PU2: "Sekret sosu (+60%)" [jednostka: NIE]
- PU3: "Włoska szkoła (+100%)" [jednostka: NIE; **NIESPÓJNE z kodem**]
- Evo: "Pizzaiolo Master — +50% wszystkich zarobków z pizzerii (kumulacja)" [kompletny: TAK]
- Kod: `getPracaBonus('pizza')` → `1 + sk*0.20 + pu*0.30 + evoBonus(0.5)`; max bonus = 1 + 0.60 + 0.90 + 0.50 = **2.00x** (=+100% nad bazą)
- Wywołanie: linia 19894 `pay=Math.floor(pay*getPracaBonus('pizza'))`
- **Werdykt:** DZIAŁA, NIESPÓJNE (PU3 UI mówi +100%, faktycznie +90%); PU2/PU3 bez jednostki

### 2. `supermarket` — Kasjer (kat: praca)
- max=3, perLvl=20, op='+', eff=zarobki, emoji=🛒
- PU1: "Szybkie ręce (+30% zarobki)" [TAK] · PU2: "Pamięć cenowa (+60%)" [NIE] · PU3: "Niezawodność (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Lojalność klientów — Stały bonus 1000 zł dziennie (raz/dzień)" cost=35000 [kompletny]
- Kod: `getPracaBonus('supermarket')` → max +60+90+50 = +200% (evo standard +50% bonus). Wywołanie linia 20036.
- Pasywny evo +1000 zł/dzień: linia 11555 ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI; PU2/PU3 bez jednostki

### 3. `carwash` — Detailer (kat: praca)
- max=3, perLvl=20, op='+', eff=zarobki, emoji=🚗
- PU1: "Mikrofibra (+30% zarobki)" [TAK] · PU2: "Polerka (+60%)" [NIE] · PU3: "Wax pro (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Premium Service — Co 5 myć — premium auto +500 zł" cost=50000 [kompletny]
- Kod: `getPracaBonus('carwash')` linia 20420, 20569
- Evo realnie: linia 20573 `if(_evo('carwash') && G._cwCount%5===0)` ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI; PU2/PU3 bez jednostki

### 4. `construction` — Budowlaniec (kat: praca)
- max=3, perLvl=20, op='+', eff=zarobki, emoji=🔨
- PU1: "Solidny chwyt (+30% zarobki)" [TAK] · PU2: "Murarz (+60%)" [NIE] · PU3: "Stalowy bicep (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Brygadzista — Każde zlecenie 2× większa wypłata" [kompletny]
- Kod: `getPracaBonus('construction')` z evoBonus=1.0 (=2x) linia 20678, 20889. ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI; PU2/PU3 bez jednostki

### 5. `kurier` — Kurier (kat: praca)
- max=3, perLvl=20, op='+', eff=zarobki, emoji=🚲
- PU1: "Lekki rower (+30% zarobki)" [TAK] · PU2: "Skróty (+60%)" [NIE] · PU3: "Pełna torba (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Multi-zlecenie — Każda sesja 2× zarobki (dwie paczki na raz)" [kompletny ale część flavour]
- Kod: `getPracaBonus('kurier')` z evoBonus=1.0 (=2x) linia 20313 ✅. "Dwie paczki" wizualnie NIE wprowadzone — tylko 2x wypłata.
- **Werdykt:** DZIAŁA (efektywnie 2x), NIESPÓJNE PU3 UI; PU2/PU3 bez jednostki; "dwie paczki na raz" to flavour text

### 6. `zmywak` — Zmywak Pro (kat: praca)
- max=3, perLvl=20, op='+', eff=zarobki, emoji=🫧
- PU1: "Zręczne ręce (+30% zarobki)" [TAK] · PU2: "Sztuka piany (+60%)" [NIE] · PU3: "Mistrz higieny (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Kuchnia Master — +50% wszystkich zarobków zmywaka (kumulacja)" [kompletny]
- Kod: `getPracaBonus('zmywak')` linia 21058, 21273 ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI; PU2/PU3 bez jednostki

### 7. `raper` — Raper (kat: kariera, max=1)
- max=1, brak `perLvl`/`op`/`eff` — pure unlock
- Opis: "Odblokuj — pełne drzewko (9 gałęzi: Flow, Teksty, Scena, Mikser…) w Telefon → 🎤 Raper"
- BRAK powerUps i evolution (max=1, unlock-only)
- Kod: `spendSkill('raper')` w linii 37780 unlockuje `G.careers.raper.unlocked=true` + bonus skillPts=1
- **Werdykt:** DZIAŁA, SPÓJNY — opis pełny, ze wskazaniem dodatkowego drzewka

### 8. `youtuber` — YouTuber (kat: kariera)
- max=5, perLvl=15, op='+', eff='views (lvl 2+)', emoji=📺
- PU1: "Thumbnail mistrz (+30% views)" [TAK] · PU2: "Tytuły clickbait (+60%)" [NIE] · PU3: "Algorytm pet (+90%)" [NIE; **SPÓJNE** — autor zauważył!]
- Evo: "Algorithm Master — Pasywny dochód 1200 zł / dzień + każdy nowy film +50% views startowych" cost=50000 [kompletny]
- Kod: `getKarieraBonus('youtuber')` → `1 + max(0,sk-1)*0.15 + pu*0.30 + evo*0.50` * logika * skupienie. Max bez side: lvl5 (4 punkty efektu) = 0.60 + 0.90 + 0.50 = +200%. Wywołanie linia 11315.
- Evo pasyw +1200/d linia 11559 ✅
- **GHOST CZĘŚCIOWY:** "każdy nowy film +50% views startowych" — brak implementacji w kodzie YT karier.
- **Werdykt:** DZIAŁA (pasyw + bonusy mnożnikowe), SPÓJNE PU; CZĘŚCIOWO GHOST evo (drugi efekt)

### 9. `beatmaker` — Beatmaker (kat: kariera)
- max=5, perLvl=15, op='+', eff='sprzedaż bitów (lvl 2+)', emoji=🥁
- PU1: "Sample bank (+30% sprzedaż)" [TAK] · PU2: "Mixing pro (+60%)" [NIE] · PU3: "Mastering (+100%)" [NIE; **NIESPÓJNE** — w kodzie +90%]
- Evo: "Producent — Pasywny dochód 900 zł / dzień + +50% wszystkich zarobków z bitów" cost=32000 [kompletny]
- Kod: `getKarieraBonus('beatmaker')` linia 15622, 15667. Evo pasyw +900/d linia 11560. ✅ Część "+50% wszystkich zarobków" — zawarta w `_evo*0.50`.
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI; PU2/PU3 bez jednostki

### 10. `gamer` — Gamer (kat: kariera)
- max=5, perLvl=15, op='+', eff='wygrane turnieje (lvl 2+)', emoji=🎮
- PU1: "APM trening (+30% wygranych)" [TAK] · PU2: "Strategia (+60%)" [NIE] · PU3: "Pro setup (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "E-sport Pro — Pasywny kontrakt 1000 zł / dzień" cost=35000 [kompletny]
- Kod: `getKarieraBonus('gamer')` linia 15850. Evo pasyw +1000/d linia 11556. ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI

### 11. `influencer` — Influencer (kat: kariera)
- max=5, perLvl=15, op='+', eff='engagement (lvl 2+)', emoji=📱
- PU1: "Hashtagi (+30% engagement)" [TAK] · PU2: "Trendy (+60%)" [NIE] · PU3: "Storytelling (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Brand Owner — Pasywny dochód 700 zł / dzień z własnej marki" cost=25000 [kompletny]
- Kod: `getKarieraBonus('influencer')` linia 23188 (Instagram followers). Evo pasyw +700/d linia 11557. ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI

### 12. `soundeng` — Sound Eng. (kat: kariera)
- max=5, perLvl=15, op='+', eff='projekty (lvl 2+)', emoji=🎙️
- PU1: "Equalizer pro (+30% projekty)" [TAK] · PU2: "Studio acoustic (+60%)" [NIE] · PU3: "Multi-track (+100%)" [NIE; **NIESPÓJNE**]
- Evo: "Studio Owner — Pasywny dochód 900 zł / dzień ze studia" cost=32000 [kompletny]
- Kod: `getKarieraBonus('soundeng')` linia 16731, 16879. Evo pasyw +900/d linia 11558. ✅
- **Werdykt:** DZIAŁA, NIESPÓJNE PU3 UI

### 13. `kondycja` — Kondycja (kat: zycie)
- max=5, perLvl=8, op='-', eff='spadek energii', emoji=⚡
- PU1: "Wytrzymałość (-3% extra)" [TAK ale tylko "extra"] · PU2: "Druga moc (-6%)" [NIE] · PU3: "Niewyczerpany (-10%)" [NIE]
- Evo: "Pasywna regeneracja — Co utracone 5 pkt energii → +1 regenerowany" [kompletny]
- Kod skill: linia 11240 `kondMult=1-(kondLvl*0.08)` — TYLKO skill (max -40%). **`_pu('kondycja')` NIGDZIE NIE WYWOŁANE.** Evo używane linia 11250 (20% szans regen +2/tick).
- **KRYTYCZNE GHOST:** PU obiecują kumulację -3/-6/-10% extra (suma -19% extra), ale w kodzie NIC. Player kupuje 3000+9000+22000=**34 000 zł** za bonus który nie istnieje.
- **Werdykt:** SKILL DZIAŁA, EVO DZIAŁA, **PU CAŁKOWICIE GHOST**

### 14. `apetyt` — Powolny apetyt (kat: zycie)
- max=3, perLvl=8, op='-', eff='spadek głodu', emoji=🍔
- PU1: "Wolniejszy metabolizm (-15%)" [NIE, "metabolizm" sugeruje głód] · PU2: "Oszczędne trawienie (-30%)" [NIE] · PU3: "Mistrz głodu (-45%)" [NIE]
- Evo: "Wege Guru — Głód spada 2× wolniej (mocna kumulacja)" [kompletny ale niedokładny — kod cap 0.05]
- Kod: `getApetytMult()` linia 1313–1316: `m = 1 - lvl*0.08 - pu*0.15 - evo*0.50`, cap 0.05. Wywołanie linia 11241. ✅
- Z evo+PU3 efektywnie: 1-0.24-0.45-0.50=-0.19 → clamp 0.05 (głód spada 20× wolniej z evo, nie 2× — opis konserwatywny).
- **Werdykt:** DZIAŁA, kod MOCNIEJSZY niż opis; PU bez jednostki "głodu"

### 15. `odpornosc` — Odporność (kat: zycie)
- max=3, perLvl=10, op='-', eff='obrażenia', emoji=❤️
- PU1: "Twardy charakter (-20% extra)" [TAK "extra"] · PU2: "Stalowe nerwy (-40%)" [NIE] · PU3: "Nieczuły na ból (-60%)" [NIE]
- Evo: "Niezniszczalny — Obrażenia z głodu/energii zredukowane do minimum (-50% extra)" [kompletny]
- Kod: `getOdpornoscMult()` linia 1306–1310: `m = 1 - lvl*0.10 - pu*0.20 - evo*0.50`, cap 0.05. Wywołanie linia 11257. ✅
- Max bonus: 1-0.30-0.60-0.50=-0.40 → clamp 0.05 (95% redukcja).
- **Werdykt:** DZIAŁA, SPÓJNE wartości; PU bez jednostki "obrażenia"

### 16. `charyzma` — Charyzma (kat: zycie)
- max=3, perLvl=10, op='+', eff='zarobki z NPC', emoji=✨
- PU1: "Pewny uśmiech (+30%)" [NIE — brak jednostki nawet w PU1!] · PU2: "Magnetyzm (+60%)" [NIE] · PU3: "Niezapomniany (+90%)" [NIE]
- Evo: "Magnetyzm — NPC dają 2× większe napiwki + sami proponują zlecenia"
- Kod: `getCharyzmaBonus()` linia 1295–1300. Skill +30% max, PU 30/60/90 ✅, evo +100%. Plus mnożnik z networking evo (+20%). Wywołanie 10480, 23534.
- **GHOST CZĘŚCIOWY:** "NPC sami proponują zlecenia" — brak mechaniki w kodzie.
- **Werdykt:** DZIAŁA, SPÓJNE PU; CZĘŚCIOWO GHOST evo (druga część); PU1 też bez jednostki

### 17. `czytanie` — Czytanie (kat: intelekt)
- max=3, perLvl=5, op='+', eff='XP gain', emoji=📚
- PU1: "Notatki (+15% XP)" [TAK] · PU2: "Spis treści (+30%)" [NIE] · PU3: "Szybkie czytanie (+45%)" [NIE]
- Evo: "Mędrzec — +1 darmowy pkt umiejętności co 3 poziomy postaci" [kompletny]
- Kod: linia 11656 `_czytMult = 1 + _sk('czytanie')*0.05 + _pu('czytanie')*0.15`. Max +15% skill + +45% PU = +60%. Evo linia 11669: `if(_evo('czytanie') && G.level%3===0) G.skillPoints+=1` ✅
- **Werdykt:** DZIAŁA, SPÓJNE wartości; **PU2/PU3 bez jednostki "XP" — DOKŁADNIE problem opisany przez usera**

### 18. `kreatywnosc` — Kreatywność (kat: intelekt)
- max=3, perLvl=10, op='+', eff='jakość', emoji=💡
- PU1: "Iskra (+15% jakość)" [TAK] · PU2: "Wena (+30%)" [NIE] · PU3: "Geniusz (+45%)" [NIE]
- Evo: "Geniusz — Co 3 dni nieoczekiwany hit — +1500 zł i +150 fanów" [kompletny]
- Kod: `getKreatywnoscQualityBonus()` linia 1264. Wywołanie linia 15563 (produkcja muzyki). Evo linia 11564 ✅
- **Werdykt:** DZIAŁA, SPÓJNE wartości; PU2/PU3 bez jednostki — user-quoted

### 19. `logika` — Logika (kat: intelekt)
- max=3, perLvl=5, op='+', eff='zarobki', emoji=🧮
- PU1: "Algorytm (+15% zarobki)" [TAK] · PU2: "Optymalizacja (+30%)" [NIE] · PU3: "Strategia (+45%)" [NIE]
- Evo: "Strateg — +25% wszystkich zarobków z karier (akumulacja)" [kompletny]
- Kod: aplikowane wewnątrz `getKarieraBonus()` linia 1340 → wpływa na youtuber/beatmaker/gamer/influencer/soundeng. **Funkcja `getLogikaSpeedBonus()` (linia 1269) NIGDY NIE WYWOŁANA — dead code.**
- **Werdykt:** DZIAŁA przez getKarieraBonus, SPÓJNE wartości; PU2/PU3 bez jednostki; `getLogikaSpeedBonus()` dead code do usunięcia

### 20. `skupienie` — Skupienie (kat: intelekt)
- max=3, perLvl=5, op='+', eff='jakość', emoji=🎯
- PU1: "Koncentracja (+15%)" [NIE — nawet PU1 bez jednostki!] · PU2: "Flow state (+30%)" [NIE] · PU3: "Zero rozproszeń (+45%)" [NIE]
- Evo: "Master Mind — Wszystkie aktywności +25% jakości (kumulacja)" [kompletny]
- Kod: `getSkupienieFocusBonus()` linia 1274. Wywołania: 15563 (produkcja), 21729 (freestyle), 1342 (getKarieraBonus). ✅
- **Werdykt:** DZIAŁA, SPÓJNE wartości; **WSZYSTKIE 3 PU bez jednostki**

### 21. `negocjacje` — Negocjacje (kat: ekonomia)
- max=3, perLvl=5, op='-', eff='ceny', emoji=💸
- PU1: "Twardy negocjator (-10% extra)" [TAK "extra"] · PU2: "Mistrz handlu (-20%)" [NIE] · PU3: "Kupiec roku (-30%)" [NIE]
- Evo: "Master Trader — Wszystkie sklepy mają -50% cen (akumulacja)" [kompletny]
- Kod: `getShopDiscount()` linia 1194: `d = max(0.20, 1 - lvl*0.05 - pu*0.10 - evo*0.50)`. ✅
- Max: -15% skill, -30% PU, -50% evo (stackable). Cap 80% (=0.20 min).
- **Werdykt:** DZIAŁA, SPÓJNE wartości; PU2/PU3 bez jednostki "cen"

### 22. `inwestycje` — Inwestycje (kat: ekonomia)
- max=3, perLvl=5, op='+', eff='zwrot', emoji=📈
- PU1: "Dywersyfikacja (+15% zwrot)" [TAK] · PU2: "Analiza techniczna (+30%)" [NIE] · PU3: "Insider tip (+45%)" [NIE]
- Evo: "Magnat — Pasywny dochód z portfela 800 zł / dzień" cost=28000 [kompletny]
- Kod: `getInwestycjeBankBonus()` linia 1254. Wywołanie linia 11629 (bank ROI). Evo pasyw +800/d linia 11561 ✅
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki

### 23. `hazard` — Hazard (kat: ekonomia)
- max=3, perLvl=10, op='+', eff='szansa wygranej', emoji=🎰
- PU1: "Hot streak (+20% szansa)" [TAK] · PU2: "Lucky charm (+40%)" [NIE] · PU3: "House always wins (+60%)" [NIE]
- Evo: "Lucky Strike — +50% prawdopodobieństwa wyższych nagród w daily spin (kumulacja)" [kompletny]
- Kod: `getHazardLuckBonus()` linia 1259. Wywołanie linia 9285 (Daily Spin w kantorze Royal). `r = Math.random()/_luck` — wyższe `_luck` = niższy `r` = lepsze progi.
- **UWAGA:** opis SKILL_DEF mówi tylko "Daily Spin (Kantor Royal)", a w głównym kasynie (sloty/ruletka/etc) hazard NIC nie robi. Wąski zakres.
- **Werdykt:** DZIAŁA dla Daily Spin, SPÓJNE; PU2/PU3 bez jednostki "szansa"

### 24. `networking` — Networking (kat: ekonomia)
- max=3, perLvl=1, op='+', eff='kontaktów NPC', unit='' (bo liczba kontaktów)
- PU1: "Wymiana wizytówek (+1 kontakt extra)" [TAK] · PU2: "LinkedIn pro (+2)" [NIE — sugeruje +2 kontakty] · PU3: "Insider network (+3)" [NIE]
- Evo: "Influencer Network — Wszyscy NPC dają bonus +20% z każdej interakcji" [kompletny]
- Kod: `getNetworkingExtraContacts()` linia 1289–1290: `_sk + _pu + _evo*2`. Wywołanie linia 33054 (NPC).
- Evo `_evo('networking')*1.20` mnożnik w `getCharyzmaBonus()` linia 1298 ✅
- **WAŻNE:** opis PU2 "(+2)" + PU3 "(+3)" — w kodzie `_pu` zwraca COUNT (0..3) więc bonus liczbowy = ile PU posiada, ale opis mówi PU2 daje "+2 kontakty extra"? Z `_pu()` zwraca 2 gdy player ma 2 PU → +2 kontakty ✅ (interpretacja: "+1 kontakt z każdym PU"). OK ale opis sugeruje że PU2 daje +2 a PU3 daje +3 (kumulacyjnie) — tak rzeczywiście jest.
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki "kontaktów"

### 25. `drip_master` — Drip Master (kat: styl)
- max=5, perLvl=5, op='+', eff='sława outfitów', emoji=💎
- PU1: "Akcesoria (+30% sława)" [TAK] · PU2: "Designer brand (+60%)" [NIE] · PU3: "Limited edition (+90%)" [NIE; **SPÓJNE z kodem (+90%)**]
- Evo: "Trendsetter — Wszystkie ubrania -20% ceny + +50% sławy z luxury" [kompletny]
- Kod: `getDripFameBonus()` linia 1227 → +25% skill + 90% PU + 50% evo. Wywołanie linia 19226 (Tylko PIERWSZY ZAKUP outfit!). Evo `-20%` ceny: linia 1210 `applyOutfitDiscount` ✅
- **GHOST CZĘŚCIOWY:** "+50% sławy z luxury" — kod NIE ma extra mnożnika dla luxury (linia 19227 używa standardowego `_dripMult`, nie ×1.5).
- **PROBLEM UX:** opis "Większa sława z noszonych outfitów" sugeruje powtarzalność, kod tylko pierwszy zakup (linia 19224 `if(firstTime)`).
- **Werdykt:** DZIAŁA (skill/PU/evo discount), SPÓJNE PU; CZĘŚCIOWO GHOST evo (+50% luxury); OPIS MYLĄCY

### 26. `scena` — Scena (kat: styl)
- max=5, perLvl=5, op='+', eff='zarobki koncertów', emoji=🎭
- PU1: "Charisma (+15% zarobki)" [TAK] · PU2: "Pyrotechnika (+30%)" [NIE] · PU3: "Encore (+45%)" [NIE]
- Evo: "Showman — +50% wszystkich zarobków z koncertów (kumulacja)" [kompletny]
- Kod: `getScenaEnergyBonus()` linia 1249. Wywołanie linia 19519 (koncert).
- Max: +25% skill, +45% PU, +50% evo = +120%.
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki "zarobki"

### 27. `flow` — Flow (kat: styl)
- max=5, perLvl=5, op='+', eff='score freestyle', emoji=🎤
- PU1: "Pewne rymy (+15% score)" [TAK] · PU2: "Multisylaby (+30%)" [NIE] · PU3: "Nieskrępowany flow (+45%)" [NIE]
- Evo: "Battle King — +50% score freestyle (kumulacja)" [kompletny]
- Kod: `getFlowFreestyleBonus()` linia 1284. Wywołanie linia 21729 (freestyle).
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki

### 28. `foto` — Foto (kat: styl)
- max=3, perLvl=5, op='+', eff='zasięg postów', emoji=📸
- PU1: "Naturalne światło (+15% zasięg)" [TAK] · PU2: "Filtry pro (+30%)" [NIE] · PU3: "Studio backdrop (+45%)" [NIE]
- Evo: "Visual Artist — Posty +30% zasięg (kumulacja z power-ups)" [kompletny]
- Kod: `getFotoQualityBonus()` linia 1279. Wywołanie linia 23188 (followers gain).
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki

### 29. `sila` — Siła (kat: fizyczne)
- max=5, perLvl=5, op='+', eff='forma z treningu', emoji=💪
- PU1: "Eksplozywność (+15% forma)" [TAK] · PU2: "Hipertrofia (+30%)" [NIE] · PU3: "Stalowa siła (+45%)" [NIE]
- Evo: "Athletyk — +10 stałego bonusu do max formy (110 zamiast 100)" [kompletny]
- Kod: `getSilaBonus()` linia 1320. Wywołanie linia 22097 (siłownia). Evo `getMaxStat('forma')` linia 1354 +10 ✅
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki

### 30. `bieg` — Bieg (kat: fizyczne)
- max=3, perLvl=5, op='+', eff='prędkość gracza', emoji=🏃
- PU1: "Wytrwałość (+10% prędkość)" [TAK] · PU2: "Drugi oddech (+20%)" [NIE] · PU3: "Maratończyk (+30%)" [NIE]
- Evo: "Maraton — +20% stałego dodatku prędkości ruchu" [kompletny]
- Kod: `getBiegSpeedBonus()` linia 1222. Wywołanie linia 26658 (P.spd). Cap 2.5.
- **NOTE:** komentarz w linii 37698 sugeruje że `bieg` powinno być ukryte (`hidden`), ALE flagi `hidden:true` brak — skill widoczny w drzewku.
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki; intencja hidden niezrealizowana

### 31. `medytacja` — Medytacja (kat: fizyczne)
- max=3, perLvl=5, op='+', eff='regen energii', emoji=🧘
- PU1: "Spokojny sen (+15% regen)" [TAK] · PU2: "Głęboka faza (+30%)" [NIE] · PU3: "REM mistrz (+45%)" [NIE]
- Evo: "Wewnętrzny spokój — Sen daje 2× więcej energii (kumulacja)" [kompletny]
- Kod: `getMedytacjaStressBonus()` linia 1244. Evo `*1.0` (=2x). Wywołanie linia 9900 (sen).
- **Werdykt:** DZIAŁA, SPÓJNE; PU2/PU3 bez jednostki

### 32. `dieta` — Zdrowa dieta (kat: fizyczne)
- max=3, perLvl=5, op='+', eff='energia z gotowania', emoji=🥗
- PU1: "Witaminy (+15% energia)" [TAK] · PU2: "Białko premium (+30%)" [NIE] · PU3: "Superfood (+45%)" [NIE]
- Evo: "Nutricionist — Każde gotowanie daje +5 do max formy (do +25)" [**NIESPÓJNE z kodem!**]
- Kod: `getDietaEnergyBonus()` linia 1238. Wywołanie linia 10659, 17702 (jedzenie/gotowanie).
- Evo: linia 1355 `if(_evo('dieta')) max += 5` — **STAŁE +5, BEZ KUMULACJI**. Opis obiecuje "do +25" (kumulacja 5×5).
- **Werdykt:** DZIAŁA (skill/PU/evo +5), **NIESPÓJNE evo** (kod daje +5 stały, opis sugeruje kumulację do +25); PU2/PU3 bez jednostki

---

## Lista FIXÓW do aplikacji (tabela do kopiowania do PLAN_SESJA.md)

| # | Typ | Linia | Old | New | Powód |
|---|-----|-------|-----|-----|-------|
| 1 | edit PU | 37516 | `_PU('Mistrz ciasta (+30% zarobki)', 'Sekret sosu (+60%)', 'Włoska szkoła (+100%)')` | `_PU('Mistrz ciasta (+30% zarobki)', 'Sekret sosu (+60% zarobki)', 'Włoska szkoła (+90% zarobki)')` | pizza: dopisać jednostkę PU2/PU3 + zmienić +100%→+90% (kod=`pu*0.30`) |
| 2 | edit PU | 37519 | `'Niezawodność (+100%)'` | `'Niezawodność (+90% zarobki)'` + PU2 jednostka | supermarket — kod +90% |
| 3 | edit PU | 37522 | `'Wax pro (+100%)'` | `'Wax pro (+90% zarobki)'` + PU2 jednostka | carwash — kod +90% |
| 4 | edit PU | 37525 | `'Stalowy bicep (+100%)'` | `'Stalowy bicep (+90% zarobki)'` + PU2 jednostka | construction — kod +90% |
| 5 | edit PU | 37528 | `'Pełna torba (+100%)'` | `'Pełna torba (+90% zarobki)'` + PU2 jednostka | kurier — kod +90% |
| 6 | edit PU | 37531 | `'Mistrz higieny (+100%)'` | `'Mistrz higieny (+90% zarobki)'` + PU2 jednostka | zmywak — kod +90% |
| 7 | edit PU | 37540 | `'Mastering (+100%)'` | `'Mastering (+90% sprzedaż)'` + PU2 jednostka | beatmaker — kod +90% |
| 8 | edit PU | 37543 | `'Pro setup (+100%)'` | `'Pro setup (+90% wygranych)'` + PU2 jednostka | gamer |
| 9 | edit PU | 37546 | `'Storytelling (+100%)'` | `'Storytelling (+90% engagement)'` + PU2 jednostka | influencer |
| 10 | edit PU | 37549 | `'Multi-track (+100%)'` | `'Multi-track (+90% projekty)'` + PU2 jednostka | soundeng |
| 11 | edit PU | 37537 | `'Tytuły clickbait (+60%)'` | `'Tytuły clickbait (+60% views)'` | youtuber — dodać jednostkę PU2 |
| 12 | edit PU | 37554 | `_PU('Wytrzymałość (-3% extra)', 'Druga moc (-6%)', 'Niewyczerpany (-10%)')` | jednostka "energii" | kondycja: jednostka PU2/PU3 — ALE TO GHOST! Patrz fix #25 |
| 13 | edit PU | 37557 | `'Oszczędne trawienie (-30%)', 'Mistrz głodu (-45%)'` | + "głodu" | apetyt jednostka |
| 14 | edit PU | 37560 | `'Stalowe nerwy (-40%)', 'Nieczuły na ból (-60%)'` | + "obrażenia" | odpornosc jednostka |
| 15 | edit PU | 37563 | `_PU('Pewny uśmiech (+30%)', 'Magnetyzm (+60%)', 'Niezapomniany (+90%)')` | + "zarobki z NPC" | charyzma — PU1/2/3 jednostka |
| 16 | edit PU | 37568 | `'Spis treści (+30%)', 'Szybkie czytanie (+45%)'` | + "XP" | czytanie — **explicit user feedback** |
| 17 | edit PU | 37571 | `'Wena (+30%)', 'Geniusz (+45%)'` | + "jakość" | kreatywnosc — **explicit user feedback** |
| 18 | edit PU | 37574 | `'Optymalizacja (+30%)', 'Strategia (+45%)'` | + "zarobki" | logika |
| 19 | edit PU | 37577 | `_PU('Koncentracja (+15%)', 'Flow state (+30%)', 'Zero rozproszeń (+45%)')` | + "jakość" (wszystkie 3!) | skupienie — wszystkie PU bez jednostki |
| 20 | edit PU | 37582 | `'Mistrz handlu (-20%)', 'Kupiec roku (-30%)'` | + "cen" | negocjacje |
| 21 | edit PU | 37585 | `'Analiza techniczna (+30%)', 'Insider tip (+45%)'` | + "zwrot" | inwestycje |
| 22 | edit PU | 37588 | `'Lucky charm (+40%)', 'House always wins (+60%)'` | + "szansa" | hazard |
| 23 | edit PU | 37591 | `'LinkedIn pro (+2)', 'Insider network (+3)'` | + "kontaktów" | networking |
| 24 | edit PU | 37596 | `'Designer brand (+60%)', 'Limited edition (+90%)'` | + "sława" | drip_master |
| 25 | edit PU | 37599 | `'Pyrotechnika (+30%)', 'Encore (+45%)'` | + "zarobki" | scena |
| 26 | edit PU | 37602 | `'Multisylaby (+30%)', 'Nieskrępowany flow (+45%)'` | + "score" | flow |
| 27 | edit PU | 37605 | `'Filtry pro (+30%)', 'Studio backdrop (+45%)'` | + "zasięg" | foto |
| 28 | edit PU | 37610 | `'Hipertrofia (+30%)', 'Stalowa siła (+45%)'` | + "forma" | sila |
| 29 | edit PU | 37613 | `'Drugi oddech (+20%)', 'Maratończyk (+30%)'` | + "prędkość" | bieg |
| 30 | edit PU | 37616 | `'Głęboka faza (+30%)', 'REM mistrz (+45%)'` | + "regen" | medytacja |
| 31 | edit PU | 37619 | `'Białko premium (+30%)', 'Superfood (+45%)'` | + "energia" | dieta |
| 32 | **code-add** | 11240 | `const kondMult=1-(kondLvl*0.08);` | `const kondMult=1-(kondLvl*0.08)-(_pu('kondycja')*0.03);` (lub odpowiednie skalowanie) | **KRYTYCZNE GHOST FIX — kondycja PU faktycznie aplikowane** |
| 33 | edit evo | 37620 | `'Nutricionist', 'Każde gotowanie daje +5 do max formy (do +25)'` | `'Nutricionist', '+5 do max formy (105 zamiast 100)'` | dieta evo — opis dopasować do kodu (NIE kumulacja) LUB rozbudować kod |
| 34 | edit evo | 37564 | `'Magnetyzm', 'NPC dają 2× większe napiwki + sami proponują zlecenia'` | `'Magnetyzm', 'NPC dają 2× większe napiwki'` (usuń obietnicę zleceń) LUB dopisać kod | charyzma — usunąć ghost część |
| 35 | edit evo | 37538 | `'Algorithm Master', 'Pasywny dochód 1200 zł / dzień + każdy nowy film +50% views startowych'` | `'Algorithm Master', 'Pasywny dochód 1200 zł / dzień'` LUB dopisać kod views | youtuber — usuń obietnicę albo zaimplementuj |
| 36 | edit evo | 37597 | `'Trendsetter', 'Wszystkie ubrania -20% ceny + +50% sławy z luxury'` | `'Trendsetter', 'Wszystkie ubrania -20% ceny'` LUB dopisać kod luxury×1.5 | drip_master — usuń obietnicę albo zaimplementuj |
| 37 | edit desc | 37595 | `desc:'Większa sława z noszonych outfitów'` | `desc:'Większa sława przy pierwszym zakupie outfitu'` | drip_master — opis sugeruje powtarzalność której nie ma |
| 38 | code-rm | 1269–1271 | `function getLogikaSpeedBonus(){ return ...; }` | usunąć (dead code) | logika — funkcja niewywoływana, logika działa przez getKarieraBonus |
| 39 | edit comment | 1184 | `Power-ups daja BAZOWE +30/+60/+100%` | `+30/+60/+90% (PU_STEP*3)` | komentarz dezinformuje |
| 40 | edit comment | 37698 | `filtruj hidden skills (bieg/hazard)` | usunąć komentarz lub dodać `hidden:true` do bieg/hazard | komentarz mylący — nic nie ukrywa |
| 41 | UI CSS | 37746 | `<span style="...overflow:hidden;text-overflow:ellipsis;white-space:nowrap"...>` | rozważyć `white-space:normal` + 2-line wrap, lub poszerzyć kartę z `width:200px` do `width:230px` | rozwiązanie root cause ucinania PU names |

---

## Rekomendacje balansowe

1. **Pizzaiolo etc. — max bonus 200% (kod) vs 270% (UI sugeruje):** po fix #1–#10 wartości spójne (200% = baza ×2). Sensowne dla 34 000 zł + 50 000 zł + 1 SP.
2. **Kondycja PU ghost:** gracz wydaje 34 000 zł za NIC. To MUSI być naprawione (fix #32) lub usunąć z drzewka PU dla tego skilla i zostawić tylko skill+evo.
3. **Dieta evo:** opis "do +25" sugeruje grindowanie 5× ale kod daje stały +5. Wybierz: (a) dopasować opis do kodu (+5), (b) zaimplementować inkrementację `G._dietaCookCount` → max formy +5/10/15/20/25.
4. **Hazard skill:** efekt TYLKO w Daily Spin (Kantor Royal). Opis sensowny, ale gracz może oczekiwać że hazard wpłynie na ruletkę/sloty/etc. Rozważyć rozszerzenie do całego kasyna lub dodać uwagę "tylko Daily Spin" w opisie.
5. **Drip Master:** opis "Większa sława z noszonych outfitów" jest mylący — bonus tylko PIERWSZY zakup. Albo dopisać kod do pasywnej sławy z noszonego outfitu (np. +1 sława/dzień przy luxury), albo poprawić opis.
6. **Charyzma evo "NPC proponują zlecenia":** brak ghost — rozważyć dodać mechanikę random event z evo gdzie NPC pyta gracza o zlecenie (1× / 2-3 dni z 30% szans).
7. **YouTuber evo "views startowych +50%":** dopisać kod do `publishVideo()` lub usunąć z opisu (rekomendacja: dopisać, bo jest najprostszy boost).
8. **Komentarz `_PU`:** sprzeczność wewnętrzna mylą autora przy reedycji. Naprawić (fix #39).
9. **Karta UI 200px:** zbyt wąska dla PU names typu "Mistrz ciasta (+30% zarobki)" (28 chars). Albo poszerzyć kartę do 230–250px, albo `white-space:normal` z `line-height:1.3` i 2 liniami tekstu.
10. **Spójność costów evo:** różne karierowe evo mają różne koszty (25k–50k). Najtańszy: Brand Owner 25k (+700/d ROI ~36d). Najdroższy: Algorithm Master 50k (+1200/d ROI ~42d). Spójne ekonomicznie, ROI 35–42 dni.

---

## Werdykt końcowy

| Status | Liczba | Skille |
|--------|--------|--------|
| **DZIAŁA + SPÓJNE PU** | 5 | youtuber (PU), raper, czytanie (wartości — UX problem), kreatywnosc (wartości — UX problem), drip_master (wartości — UX problem) |
| **DZIAŁA + NIESPÓJNE PU3 +100%/+90%** | 10 | pizza, supermarket, carwash, construction, kurier, zmywak, beatmaker, gamer, influencer, soundeng |
| **DZIAŁA z UX problem (brak jednostki PU2/PU3)** | 22 | wszystkie powyżej + większość ze "spójnych" + czytanie/kreatywnosc/logika/skupienie/etc. |
| **GHOST CAŁKOWITY** | 1 | **kondycja PU** (0% kosztu jest aplikowane do efektu) |
| **GHOST CZĘŚCIOWY (evo)** | 4 | youtuber (views startowych), charyzma (zlecenia), drip_master (+50% luxury), kurier ("2 paczki" wizualnie) |
| **NIESPÓJNE evo wartości** | 1 | dieta (+5 stały vs "do +25") |
| **NIEDZIAŁAJĄCE/dead code** | 1 | `getLogikaSpeedBonus()` (dead) — logika działa przez getKarieraBonus |
| **Komentarze mylące** | 2 | linia 1184 (_PU step), linia 37698 (hidden) |

**Najpilniejsze do napraw:** #32 (kondycja PU ghost — gracz traci 34k zł), #1–#10 (NIESPÓJNOŚCI PU3 +100% vs kod +90%), #16–#17 (jednostki w czytanie/kreatywnosc — explicit user feedback), #33 (dieta evo opis), #41 (UI CSS root cause).
