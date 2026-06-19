# PLAN — Narkobiznes (PDF „Systemy i funkcjonalne moduły usprawniające narkobiznes")

Źródło: `Systemy i funkcjonalne moduły usprawniające narkobiznes (Trap Simulator).pdf` (3377 linii, ekstrakt `_narko_extract.txt`).
Triage (ultracode, 20 agentów) zapisany w sesji 2026-06-17. Wersja gry na start: **v2.1.980**.

## Zasady tego planu
1. **ADAPTACJA, nie duplikat** (decyzja usera 2026-06-17). Każda faza rozbudowuje ISTNIEJĄCE haki (`G.trap`/`G.trapInv`/`G.methlab`/`G.grow`/dealerzy/pracownicy/heat/raid/terytoria/`_trapAddGrade`/luxury), zero równoległych systemów.
2. **Save-safe (żelazna #1)** — każde nowe pole: defensywny init (`||0`/`??`/`typeof`-guard) wzorem `_growEnsure`/`_methlabEnsure` (l.17424/17904). NIE naliczać wstecz (waste/upkeep/heat liczą się od wdrożenia, nie z `cooked`). Test na **WCZYTANYM starym save**, nie tylko nowej grze (`feedback_repro_loaded_save_not_just_newgame`).
3. **Reguła #11** — gładka pochodna, asymptota, brak total-loss/hard-cap; cut/heat wyśrodkowane by nie złamać zbalansowanego trap (~15-18k MC).
4. **Dyscyplina per faza:** PRE-grep #13/#14 → Edit (NIE PowerShell #4) → syntax hook → `dbg_*.mjs` runtime/MC PASS (#9) → Round 2 #18 → patch note Vegan (`cats:['beta-tester','Vegan',typ]`, reporter:'Vegan', ZERO apostrofów, ZERO info admin/dev) → `git commit -F` → `cp -f index.html deploy/index.html`. Wersja = `PATCH_NOTES[0].ver`, bump v2.1.981+.
5. **/loop**: następna faza = pierwsza `PENDING` wg kolejności TIER. Decyzje designerskie podejmuję sam (wartości/nazwy) i loguję w „Pytania do usera". NIE pytać o kolejność.
6. **Fazy (były-DEFER) D1-D5 + logistyka — TERAZ W ZAKRESIE** (user 2026-06-18, `DECYZJE_NARKOBIZNES.md`). HIGH save-risk → EKSTRA ostrożność: OBOWIĄZKOWY test C (wczytany stary save) + MC, migrator stare=clean, optional-chain wszędzie. Miejsce: D1@TIER7 (front), D2 po D1, D3@TIER8, D4/D5/logistyka = TIER 11-12. NIC trwale pominięte.

## 🛡️ PROTOKÓŁ JAKOŚCI (user 2026-06-17 — „zrób wszystko z PDF, nic nie pomiń, zero bugów/ghostów")
Obok dyscypliny per faza (#1/#9/#18/#12/Vegan/deploy) OBOWIĄZUJE:
- **A. Ledger** `PLAN_NARKOBIZNES_LEDGER.md` — line-item PDF↔kod. **Aktualizować po KAŻDEJ fazie** (status DONE/PARTIAL/ADAPTED/SKIP+powód). Gwarancja „nic nie pominięte"; SKIP zawsze z powodem (≠ przypadkowe).
- **C. Test wczytanego starego save — per TIER.** dbg wstrzykuje save SPRZED narkobiznesu (bez nowych pól) → boot + core akcje trap (cook/sell/buy/cut) NIE crashują, nowe pola defaultują sensownie. ZANIM TIER = DONE. (bug #1 tej gry: `feedback_repro_loaded_save`).
- **D. MC całej ekonomii — w punktach kontrolnych** (po TIER 4, TIER 7, oraz na końcu). Symulacja sesji ze WSZYSTKIMI dźwigniami naraz (cut+utylizacja+lab+…): asercja trap ~15-18k w zakresie, brak runaway/spirali śmierci. Node MC.
- **E. Końcowy audyt całego PDF (ultracode)** — gdy wszystkie TIER-y DONE: workflow re-czyta cały PDF vs kod, poluje ghosty/exploity/luki na całej powierzchni, robi line-item sign-off ledgera. Dopiero potem „narkobiznes DONE".
- **Sprzężenia (Cz III):** każdy nowy moduł MUSI mieć hook do ≥2 innych (PDF: „wejście/wyjście/echo"). Notować w fazie które moduły dotyka.

## Triage — status per system (z workflow)
| System | Status | Złożoność | Save-risk |
|---|---|---|---|
| Surowce/wypełniacze (CUT) | PARTIAL | DUŻA | nisko-średnie |
| Pozyskiwanie (dostawcy/czarny rynek/kradzież) | PARTIAL | ŚREDNIA | niskie |
| Kamper (ryzyko/mobilność/ulepszenia) | PARTIAL | ŚREDNIA | niskie |
| Utylizacja odpadów (skala/firmy/NPC) | NEW | DUŻA | niskie (addytywne) |
| Koszty beczek / ślad odpadowy | NEW | DUŻA | średnie |
| Progi heat zakupowe | PARTIAL | ŚREDNIA | niskie |
| Profesjonalne lab — drzewko | PARTIAL | DUŻA | średnie-wysokie |
| Legalny front / przykrywka | NEW | DUŻA | niskie-średnie |
| Ekipy produkcyjne (morale/zmęczenie) | PARTIAL | DUŻA | średnie-wysokie |
| Lab front/koszty/ryzyka | PARTIAL | DUŻA | średnie-wysokie |
| Struktury org (pion/sieć) + logistyka | PARTIAL | DUŻA | średnie |
| Pranie (sztuka/antyki) | NEW | DUŻA | **WYSOKIE** |
| Łapówki / korupcja | NEW | DUŻA | średnie-niskie |
| Drzewko legalnego frontu / pranie | NEW | DUŻA | **WYSOKIE** |
| RDZEŃ stanów globalnych (dirty/clean/heat-kanały) | PARTIAL | DUŻA | **WYSOKIE** |
| Evidence_score | NEW | DUŻA | średnie-niskie |
| Konsekwencje publiczne (8 osi) | PARTIAL | DUŻA | średnie |
| Styl życia / trzeźwość (clarity) | PARTIAL | ŚREDNIA | niskie-średnie |
| Pamięć NPC (matryca 7-wym.) | PARTIAL | DUŻA | średnie-wysokie |
| Makrobalans + pętla upadku/odbudowy | PARTIAL | DUŻA | średnie |

---

## KOLEJNOŚĆ FAZ (TIER) — /loop wykonuje od góry

### TIER 1 — Anti-exploit + quick wins (MAŁA, niskie ryzyko, natychmiastowa wartość)
- **F1.1 Heat od zakupu prekursorów** `[DONE v2.1.981]` — zamyka exploit (dziś `_trapDoIngredientBuy` l.18708 i `_buyWorkerSupply` l.18216 dają ZERO heat — można kupić 20kg prekursora bez konsekwencji). Wspólny helper `_precursorBuyHeat(id,qty)`: `G.trap.heat=min(100,heat+gain)`, gain skalowany qty×ryzyko-surowca, próg dla chem/prosz/krysztal. Raid (`_trapRaidCheck`) zadziała sam. Test: runtime buy + brak regresji auto-zakupów chemika.
- **F1.2 Rolling-window wzorca zakupów (PDF 6.1-6.4)** `[DONE v2.1.981 — z F1.1]` — `G.trap.precursorLog=[{day,qty}]` (init `Array.isArray` guard), suma za 30 `G.day`, progi przeskalowane z kg→sztuki. Łączy się z F1.1.
- **F1.3 Rabat hurtowy zakupów** `[DONE v2.1.982]` — `_trapBulkDisc(qty)` gładka asymptota 18% (#11), naliczany w `_trapDoIngredientBuy` + etykiety przycisków. Trade-off z F1.1 (tańsza partia = wyższy heat). `dbg_bulk_disc.mjs` PASS.

**✅ TIER 1 KOMPLET** (F1.1+F1.2 heat-prekursory v981, F1.3 rabat hurtowy v982, F1.4 decay już w kodzie v874).
- **F1.4 Defamation decay + PR-sink** `[DONE/SKIP — weryfikacja kodu]` — ⚠️ triage był NIEAKTUALNY: `G.defamation` JUŻ decayuje -2/dobę (l.23431, v2.1.874, `nextPeriod`). Decay istnieje → nie dubluję (reguła #13/#7). PR-sink (płatne przyspieszenie) ODŁOŻONE jako niski priorytet — istnieje już `prCampaign()` (money-sink na haterów), dodatkowy PR-przycisk = ryzyko overlap UI, marginalna wartość. Wrócić tylko jeśli user chce dedykowanego sinku na defamację.

### TIER 2 — CUT / wypełniacze (RDZEŃ sekcji 2 PDF) ✅ KOMPLET v2.1.983
- **F2.1 Katalog FILLERS** `[DONE v2.1.983]` — `TRAP_FILLERS` (3 diluenty + 4 adulteranty), liczby w `G.trapInv[id]`, `_trapFillersEnsure()` lazy-init purity/danger.
- **F2.2 Akcja „Potnij produkt"** `[DONE v2.1.983]` — `_openCutMenu`/`_trapDoCut`/`_trapBuyFiller`. Wolumen↑, nowe pole `purity[prod]` (śr. ważona) tnie cenę przez `_trapPurityMult=0.35+0.65·purity` (wpięte w `_trapSell`), rep−ceil(qty·0.25). Cap +100% wolumenu/akcję (anti-exploit). Przycisk w panelu trap + czystość/☠️ przy recepturze.
- **F2.3 Skutki uboczne adulterantów** `[DONE v2.1.983]` — `danger[prod]` (śr. ważona) → zgon NPC na sprzedaży (`danger·0.12`) → skok heat + `addDefamation` + rep−. Świeży cook rozcieńcza purity↑/danger↓.
- **Balans MC (`dbg_trap_cut.mjs` PASS):** cut diluentem ×1.36 przychodu (opłacalny, NIE money-printer; dumping+rep+zgony równoważą), zgony 14/300 przy danger 0.4, clean 0. **DECYZJA (log):** purity-mult floor 0.35, cap +100%/akcję, fentanyl purityAdd 0.65/danger 0.40 (high-risk-high-reward gated zgonami/heat/defamacją). Monitorować inflację trap; nerf przez purityAdd/danger jeśli user zgłosi.

### TIER 3 — Pozyskiwanie surowców + Kamper (ŚREDNIA)
- **F3.1 Kanały pozyskania** `[DONE v2.1.985]` — `G.trap.supplyChannel` (black/legal) + toggle w `_trapBuyIngredient`. Czarny: taniej+hurt, 15% przekręt. Legal: +40%, pewna dostawa, prekursory +heat. `dbg_supply_channel` PASS.
- **F3.2 Kradzież surowca** `[DONE v2.1.987]` — `_trapRaidCompetitorLab`/`_trapRaidLabResolve` (przycisk w panelu Terytoriów): 3. kanał pozyskania = darmowe surowce (traw/krysztal/prosz/chem≥lvl8) do stashu. Szansa=f(dealerzy/loyalty/level/rep), 20⚡+cooldown 1/dobę+heat+porażka(uciekasz z niczym, dealer ranny). „Wzrost wrogów"=`G.trap._rivalAnger` (decay −3/dobę) karmi `_trapGangDailyTick` (szybsza erozja kontroli + częstsze ataki) — sprzężenie. `dbg_lab_raid_f32` PASS.
- **F3.3 Kamper: ryzyko + mobilność** `[DONE v2.1.986]` — pożar w `_trapCook` (gatowany filtrem, bez total-loss), `_trapRelocateKamper` (−heat raz/dobę, 15⚡) + przycisk w panelu. Ulepszenia = ADAPTED (istniejące filtry). `dbg_kamper_f33` PASS.

### TIER 4 — Utylizacja odpadów (NEW, DUŻA, czysto addytywne)
- **F4.1 Akumulacja odpadów** `[DONE v2.1.988]` — `G.trap.waste={liters,trace,contam,location,_lastAccrueDay}` (lazy `_trapWasteEnsure`, NIE wstecz z cooked). `TRAP_WASTE_FACTORS` (litry/jednostkę + tox per produkt: ecstasy 30/koka 16/lsd 14/meth 12/mushrooms 2/joint 1). `_trapAccrueWaste` hooki: `_trapCook`(6 receptur)/`_methCrystallize`/`_methSynthApply`/`_cocaineRefineApply`/`_mushroomHarvestApply`. Beczki=litry/200. `dbg_waste_f4` PASS.
- **F4.2 Waste→heat + eventy zaniedbania** `[DONE v2.1.988]` — daily-tick decay-block: >3 beczki duszą stygnięcie heat, przy dużym nagromadzeniu PODBIJAJĄ (cap 30, gładko #11). `_trapWasteDailyTick`: trace rośnie ze storage_time, contam opada −2/dobę, event „smród→anonimowy donos" (heat+) przy >5 beczek. Sprzężenie: skażenie (contam z zakopywania) podbija ryzyko pożaru w `_trapCook` (×1+contam/200).
- **F4.3 Metody utylizacji** `[DONE v2.1.988]` — panel `_openWastePanel` (reuse mg-job, zero overlap #8) + `_trapDisposeWaste`: 🏭 firma pro (250 zł/beczka, 95%, −heat, zatarcie śladu) / 🌲 czarny rynek (120 zł/beczka, 80%, +heat ryzyko) / ⛏ zakopywanie (free, 70%, +skażenie+heat). Przycisk + licznik beczek w panelu trap.
- **F4.4 Firmy + NPC brudnej utylizacji** `[DONE v2.1.989]` — `WASTE_VENDORS`: 4 firmy (Arkona/EcoVanta/Visó/MoleClean, eff 75-99%, heatMod −, gated lvl) + 6 NPC (Norbert/Kret/Tadeusz/Mira/Emir/Sasha, eff 50-96%, tańsi, betrayal 4-20% = „bierze kasę, nie czyści, donosi" PDF I-5.x). Panel `_openWastePanel` (firmy/NPC/zakopywanie) + grey-lock gated. `dbg_waste_f44_f45` PASS.
- **F4.5 Umowy abonamentowe** `[DONE v2.1.989]` — `DISPOSAL_CONTRACTS` Basic/Industrial/Pharma + `G.trap.disposalContract` + `_trapDisposalContractTick` (auto-clean w `_trapWasteDailyTick`, opłata dzienna, brak kasy=zawieszenie #11, premium gated reqLvl). UI subscribe/cancel w panelu.
- **✅ TIER 4 KOMPLET** — test C (wczytany pre-narko save) + MC ekonomii (`dbg_tier4_oldsave_mc`): utylizacja = ~2% przychodu trap (rozsądny sink), maxHeat ~10, zero spirali, stary save bezpieczny. **PROTOKÓŁ D (po TIER 4) ZALICZONY.**

### TIER 5 — Styl życia / trzeźwość operacyjna (ŚREDNIA, helper-pochodna) ✅ KOMPLET v2.1.990
- **F5.1 getClarity() + lifestyleDebt** `[DONE v2.1.990]` — `getClarity()` pochodna (100 − maxAddiction×0.6 − sleepDebt×6 − lifestyleDebt×0.35 − lowMood×0.3, clamp 0-100, NIE persystowana). `G.lifestyleDebt` (0-100, persyst, decay −3/dobę w `_addictionDailyTick`) akumulowany: zażycie +2 / prostytutki +3 / striptiz +2 (hazard/impreza ADAPTED przez addiction-proxy). Panel: pasek clarity + ostrzeżenie <40.
- **F5.2 Wpływ clarity** `[DONE v2.1.990]` — subtelnie/liniowo (#11): `_trapNegotiateDealer` bonus (cl-50)×0.3 (±15), betrayal vendora utylizacji ×(1+(100-cl)/200) [sprzężenie F5↔F4], heat sprzedaży ×(1+(100-cl)/400). Ostrzeżenia tylko <40. `dbg_clarity_f5` PASS (test C wczytany save: zero crash, defaulty).

### TIER 6 — Konsekwencje publiczne (ŚREDNIA-DUŻA, mapowanie istniejących osi) ✅ KOMPLET v2.1.991
- **F6.1 Mapa osi + publicRep** `[DONE v2.1.991]` — public_image=`G.fame`, infamy=`G._underworldRespect`, street_cred=`G.streetRep`, media_pressure=`getMediaPressure()` (f haters+heat). `G.publicRep={brandSafety,fanLoyalty,sponsorTrust,bookingTrust}` (`_publicRepEnsure` neutralny start 60, BEZ retro-kar). `_publicRepDailyTick` (nextPeriod): heat/media eroduje zaufanie marek/klubów do `78-illegalPressure`, czyste życie odbudowuje — asymptota `*0.08` (#11). Panel „Wizerunek publiczny" w aplikacji Trap (4 paski + status + media pressure).
- **F6.2 getPublicStatus() + eventy przecięcia** `[DONE v2.1.991]` — `getPublicStatus()` 6 archetypów PDF 4.4 (Czysty/Legenda/Skandalista/Toksyczny/Na celowniku/Spalony). Sprzężenie legal↔illegal: „Label scandal" severity×(1+heat/100) + fanLoyalty tłumi stratę fame + sponsorTrust/brandSafety hit + sponsor-break chance×heat; **booking_trust gate** w `performConcert` (mult 0.7-1.0, full≥60 neutralny; odwołanie przy bt<25+heat≥75). `dbg_publicrep_f6` PASS (test C old-save: neutralny init, zero crash). Round 2 fix: booking full przy neutralu (brak kary dla czystego gracza, #11).

### TIER 7 — Profesjonalne laboratorium + front + ekipy (DUŻA) — w toku
- **F7.1 Drzewko tierów lab + gating** `[DONE v2.1.992]` — `LAB_TIERS` 4 poziomy (Kamper/Mini 500k/Firmowe 1.2M/Certyfikowane 2.5M, reqLvl 1/6/10/13) + `G.lab.tier`. Czystość per tier `_labTierPurityCap` (0.80/0.90/0.96/1.00) w `_trapAddGrade`. **Save-safety KRYTYCZNA #1**: efektywny tier = `max(kupiony, _labGrandfatherTier())` — grandfather pokrywa reactorpro→2/cocaine→3/cooked→1 → ZERO nerfu starych save (zweryfikowane `dbg_lab_tier_f71`). `_labUpgradeTier` UI w panelu. Gate underground_lab/modal-heat = ADAPTED (dostęp do labu ZACHOWANY #1, tier to warstwa progresji, nie blokada wejścia).
- **F7.2 Legalny front / przykrywka** `[DONE v2.1.993]` — `FRONT_TYPES` 4 typy (agro 150k/zakład 250k/instytut 400k/pharma 800k, paperTrailQuality 0.4-0.9, auditRisk 0.3-0.9, upkeep) + `G.trap.front` (type===null=ZERO regresji) + `_openFrontPanel`/`_trapEstablishFront` (nazwa input+7 sugestii PDF 7.5, sanitized). paperTrail ×(1-pt·0.55) w `_trapRaidCheck` (mniej nalotów), `_trapFrontDailyTick` upkeep (zawieszenie #11) + kontrole skarbowe (auditRisk). Sprzężenia: front→publicRep (brandSafety↑) + front↔lab tier (rekomendacja przy tier≥2) + nazwa w raid-msg. `dbg_front_f72` PASS.
- **F7.3 Upkeep + ekipy produkcyjne** `[DONE v2.1.994]` — `_labUpkeepDailyTick` (upkeepMo per tier ÷10: 18k/54k/135k, brak kasy=zawieszenie produkcji #11, TYLKO kupiony tier=zero retro-kosztu). Ekipy: `w.morale`/`w.fatigue`/`w.lastBreak` (`??` fallback) + `_crewBatchQuality` (pasmo poziomu labu `crewBase` 0.60/0.68/0.80/0.90 + morale/fatigue) zamiast stałego 0.60 — ADAPTACJA „3 ekip" PDF (chemik=ekipa, nie osobna rekrutacja). `_crewWorkTick` (fatigue↑produkcja, morale↓heat/↑przerwa/↑utylizacja=sprzężenie F4). `_crewLiaison` (Samir/Ramin/Walter per tier) raportuje. ZERO nerf (tier0=0.60). `dbg_crew_f73` PASS.

### TIER 8 — Evidence_score (DUŻA, druga oś obok heat) — w toku
- **F8.1 evidence + raid logic** `[DONE v2.1.997]` — `G.trap.evidence` 6 typów + `_trapEvidenceScore` (suma − lawyer/front-paperTrail/informer) + `_trapAddEvidence` (zaimplementowany — D2-hook 'financial' działa) + `_trapEvidenceDailyTick` decay (media sticky). Haki: sprzedaż→digital/financial, zakopanie→physical, zdrada-dealera→witness, skandal→media, pro-utylizacja→physical−. **`_trapRaidCheck` GATING #11**: evidence<22 + wysoki heat = OBSERWACJA (NIE bust, −8 heat), evidence≥22 = bust; `_raidMGFinish` kara/areszt skalowane evidence (cap ×2/90k/8dni, evidence -60% po nalocie). Display panel (score + 6 typów). Sprzężenia: evidence↔raid + evidence↔D2 + evidence↔front. `dbg_evidence_f81` 16/16 PASS. **ZOSTAJE D3 multi-heat + test C TIER 8.**

### TIER 9 — Łapówki / korupcja (DUŻA) ✅ KOMPLET v2.1.999
- **F9.1 Łapówki przy kontrolach** `[DONE v2.1.999]` — `G.trap.corruptionDep` (0-100, lazy) + `_offerBribe` choice-modal PRZED nalotem (`_trapRaidCheck`) i kontrolą broni. `BRIBE_TIERS` 5 poziomów (÷10: 8k-1.2M). `_bribeSuccessScore` (corruptionDep+lawyer+informer − heat/media/evidence/prevFails, progi 75/50/25: sukces/częściowy/bierze-kasę/porażka). corruptionDep rośnie z każdą łapówką → koszt ×(1+dep/100) + `_corruptionDailyTick` szantaż (dep≥60) = „kredyt u diabła". **Anti-exploit**: sukces tylko −12 heat (NIE auto-clear), kosztuje+ryzyko+ślad finansowy/cyfrowy. Sprzężenia: bribe↔heat/evidence + corruptionDep↔szantaż + lawyer↔bribe. `dbg_bribe_f91` PASS.

### TIER 10 — Pętla upadku/odbudowy + makrobalans (ŚREDNIA) ✅ KOMPLET v2.2.0
- **F10.1 Recovery mode** `[DONE v2.2.0]` — `G.trap.recoveryMode` (string|null, lazy) + `RECOVERY_MODES` 5 trybów PDF 8.3 (laying_low/legal_cover/back_to_street/turf_war/clean_rebuild) + `getRecoveryMult(trap/heatDecay/legal)`. **MIĘKKA porażka**: `_offerRecovery` choice-modal po `_raidMGFinish(fail)` (NIE game over). Mults: trap-earn (sell/dealer/territory) + heat-decay block + `_globalEarnMult` (legal). Auto-exit gdy heat<exitHeat przez 2 dni + odbudowa publicRep. Sprzężenia: recovery↔trap-earn + recovery↔heat-decay + recovery↔legal/publicRep. `dbg_recovery_f101` 16/16 PASS (null=zero zmian).

---

## ✅ (były DEFER) — TERAZ W ZAKRESIE (user 2026-06-18, `DECYZJE_NARKOBIZNES.md`)
User odblokował WSZYSTKIE D1-D5. Robić z EKSTRA ostrożnością: OBOWIĄZKOWY test C (wczytany stary save) + MC. Miejsce w sekwencji: D1 dirty/clean przy TIER 7 (front), D2 pranie po D1, D3 multi-heat przy TIER 8, D4/D5 jako TIER 11-12. HIGH save-risk (dotyka `G.money`/`earn()`/achievementy) → migrator stare=clean, optional-chain wszędzie.

- **D1 Rozdział dirty/clean cash** `[DONE v2.1.995]` — `G.finance={dirty,clean,frozen}` WARSTWA nad `G.money` (single-source total NIETKNIĘTY, zero refaktoru odczytów). `_financeReconcile` (`dirty=clamp(dirty,0,money); clean=money-dirty`) = invariant + auto spend-clean-first. `_addDirty` w `_trapSell`/dealer-tick/territory/cocaine (utarg=brudny); earn() legalny→clean default. Migrator `_financeEnsure` stare money→clean. Display panel Trap. Sprzężenie D1↔F7.2 (audyt skarbowy skalowany dirty-ratio). `dbg_finance_d1` 16/16 PASS + 200-stress invariant. **ZOSTAJE D2 pranie (zależy od D1).**
- **D2 Pranie przez sztukę/antyki** `[DONE v2.1.996]` — **ADAPTACJA (NIE migracja luxuryAssets — string[] + achievementy NIETKNIĘTE)**: osobna warstwa `G.launderAssets` obj[]. `LAUNDER_ASSETS` 7 kolekcji PDF 9.2 + `LAUNDER_APPRAISALS` 3 wyceny (uczciwa/kreatywna/agresywna). `_buyLaunderAsset` (za dirty `_spendDirty`) → hold (liquidity) → `_sellLaunderAsset` (clean payout, audyt skalowany frontem). Anti-exploit: uczciwa=opłata prania, agresywna EV~neutral-negative bez frontu. Sprzężenia D2↔D1 (brud→czyste) + D2↔F7.2 (front↓audyt) + D2↔publicRep (prestiż). `_openLaunderPanel`. `dbg_launder_d2` 16/16 PASS.
- **D3 Heat 7-kanałowy jako pełny system** `[DONE v2.1.998]` — `G.trap.heatCh` 7 kanałów ADDYTYWNE rozbicie. **NIE-ŁAMIĄCE**: `_trapHeatChReconcile` skaluje kanały tak że ZAWSZE sum(heatCh)==heat → `G.trap.heat` zostaje NIETKNIĘTYM single-source UI/driverem (raid/decay/UI bez zmian). `_trapHeatChAdd` tagi (street/customs/fiscal/env/violence), nietagowane→street. Sprzężenia: media↔publicRep + kanały→evidence (env→physical/fiscal→financial/digital→digital) + env↔waste. Display pasek rozbicia. `dbg_multiheat_d3` 15/15 PASS.
- **D4 Model organizacyjny pion vs sieć** `[DONE v2.2.1]` — `G.trap.orgModel` (null=zero zmian) + `ORG_MODELS` + `getOrgMult(trap/disposal/raidSeverity/keepBonus)`. vertical: trap ×1.12 / raid-fine ×1.35; network: trap ×0.90 / disposal ×0.78 / keepFrac +0.3 / raid-fine ×0.65. `_openOrgPanel`/`_chooseOrgModel` (1. darmo, zmiana 200k). Sprzężenia org↔trap-earn/utylizacja/raid. `dbg_orgmodel_d4` 19/19 PASS.
- **D5 Pełna matryca pamięci NPC (7 wymiarów + memory_tags)** `[DONE v2.2.2]` — pilot na dealerach: `_dealerMemEnsure` lazy z loyalty + {trust,fear,respect,resentment,leverage,memoryTags}. Reaktywność: wypłata→trust/respect/tag, brak→resentment/tag, high-heat→leverage/tag. **Betrayal-by-resentment** (lojalny urażony zdradza; leverage→gorszy donos). respect→sprzedaż. Display panel. Sprzężenia: npc-memory↔betrayal + npc-memory↔sprzedaż + memoryTags↔reaktywność. `dbg_npcmem_d5` 16/16 PASS.
- **D6 Logistyka dystrybucji (PDF 8.1 — ledger I-8.1)** `[PENDING TIER 11]` — 4 metody transportu (dealerzy uliczni=istnieją / kurier-autostrada / kontener-samolot / przewóz w żywności) z {koszt/czas/pojemność-kg/ryzyko wykrycia/heatPerRun} + minigra unikania kontroli (reuse mg-job). Tablica `DISTRIBUTION_METHODS` analog `DEALER_NPCS`, tick wzorem `_trapDealersDailyTick`. Sprzężenie z D4 (model org wpływa na koszt/ryzyko transportu) + heat/łapówki celnikom (TIER 9).

---

## 🔧 DOMKNIĘCIE 100% (po świeżym audycie PDF↔kod, 2026-06-18, user „domknij braki") — REOPEN
**Status korekta:** „narkobiznes DONE" było PRZEDWCZESNE — audyt ledger↔kod był OK, ale świeży audyt SUROWY-PDF↔kod (5 sekcji Explore) wykrył realne braki MECHANICZNE (poza kuratorowaną treścią). Lista priorytetowa do zbudowania (jeden item/turę, pełny protokół):
- **G1 — `_crewBatchQuality` pełna formuła (PDF 7.11/6.6)** `[DONE v2.2.4]` — dodane czynniki: heatPen (heat>60↓), wastePen (beczki>5↓), frontBonus (+0.03 stabilny front), + hook `_trapRawQuality` (G2, guarded=0). morale/fatigue/tier/reagents zostają. floor 0.40/cap purityCap. `dbg_g1_crewquality` 11/11 PASS, zero nerf neutral.
- **G2 — raw_material_quality (PDF 6.5/6.6)** `[DONE v2.2.5]` — `G.trap.rawQuality` (0.30-0.95, lazy 0.70 neutral). `_trapRawQualitySet(channel,scammed)` na zakupie: legal→dryf ku 0.86, czarny→zmienne 0.55-0.87 (scam 0.42-0.70). `_trapRawQuality()` delta ±~0.06 wpięta w `_crewBatchQuality`(G1)/`_cookApply`(prekursory, NIE trawa)/`_methSynthApply`. Display w oknie zakupu. `dbg_g2_rawquality` 11/11 PASS. (Nazwane tiery E-Salt/... = content G7; kanał oddaje esencję.)
- **G3 — D6 logistyka dystrybucji (PDF 8.1)** `[DONE v2.2.6]` — `DISTRIBUTION_METHODS` (kurier cap8/żywność cap16-maskowanie/kontener cap40) gated reqLvl 6/9/13. `_openDistributionPanel`/`_distributeStart`/`_distributeRun`/`_distributeResolve`. Cena=`_trapUnitPrice` (=detal, zero inflacji) ×whole. Minigra `_prodCanvasMG` react (skill, NIE click). Wpadka→konfiskata+heat-customs+evidence-logistics; sukces→`_addDirty`+heat-customs. Łapówka celna: dodano `onAvoid` do `_offerBribe`/`_resolveBribe` (back-compat) → bribe-sukces=dostawa przechodzi. Sprzężenia: D1/D3-customs/D4-getOrgMult/F8-logistics/F9-bribe. `dbg_g3_distribution` 12/12 + `dbg_g3_mc`: bulk net/unit 700<street 1136 (caught 33%) = throughput-za-ryzyko, NIE printer (#11).
- **G4 — eventy publiczne (PDF 4.5)** `[DONE v2.2.7]` — 3 RANDOM_EVENTS (adaptacja publicRep, NIE dubluje Label-scandal/Zdjęcie-z-nocy): „Artykuł o skażeniu dzielnicy" (cond env-heat≥35+beczki≥4 → media/env-heat↑, brandSafety/fame↓, evidence; fanLoyalty tłumi), „Fani bronia gracza" (cond fanLoyalty≥70+mediaPressure≥35+fame≥45 → POZYTYW: brandSafety/fame↑, haters↓, media↓), „Dziennikarz laczy kropki" (cond financial-evidence≥25+media/mp wysoki+rich → fiscal/media-heat↑, sponsorTrust↓, evidence). `dbg_g4_pubevents` 15/15 PASS (gated, off bez trapu, zero crash old save). Sprzężenia ≥2 każdy.
- **G5 — drzewko legalnego frontu (PDF 13) + aukcja „Biały Kruk"** `[DONE v2.2.8]` — (a) `G.trap.front.tier` 1-3 (lazy=1, zero nerf): `_trapUpgradeFront` recompute paperTrail+(t-1)*0.06 cap 0.97 (raid nigdy 0, #11) / auditRisk×(1-(t-1)*0.15) / upkeep×(1+(t-1)*0.7). Display+button w `_openFrontPanel` (grey-lock). (b) Biały Kruk: LAUNDER_ASSETS `bialy_kruk` rare (prestiż 12), `_whiteRavenWindow()` (3 dni co 30, od d30), gate w `_buyLaunderAsset`, banner+filtr w panelu, RANDOM_EVENT „Aukcja Bialy Kruk" (raz/okno via `_ravenSeen`). `dbg_g5_front_raven` 20/20 PASS. Sprzężenia: front-tier↔raid/audit/pranie; raven↔D2/prestiż-publicRep.
- **G6 — ryzyka lab 7.16 (staff/reputation risk)** `[DONE v2.2.9]` — (a) staff_risk w `_workersDailyTick` (chemik): `_staffRisk=min(0.10, 0.008+(fat-50)*0.0011+(55-mor)*0.0011)` → botch (składniki przepadają + heat-street+1). (b) reputation_risk w `_trapSell`: grade<0.45 → reputation −2×, dodatkowy `_trapMarketSupplyHit`. Gładko #11 (tylko zaniedbana ekipa/wadliwy towar). `dbg_g6_labrisks` 7/7 PASS. Sprzężenia: staff↔morale/fatigue(F7.3)+G1; reputation↔jakość/cut(F2)+market+reputation. (supply_risk=ingredient-check / distribution_risk=G3 — nie dublowane.)
- **G7 (content-enrichment ku PDF)** `[DONE v2.3.0]` — WASTE_VENDORS firmy 4→8 (GreyRiver/Baltic/Donistenic/AlphaB, zbalansowane między tiery), NPC 6→11 (Oskar/Viktor/Grzegorz-Sanepid/Dorian-Cysterna/Leila-404, profile eff/cost/betrayal/reqLvl-reqRep), LAUNDER_ASSETS collectibles 8→12 (winyl 55k/sygnet 450k/rzeźba 600k/oldtimer 1.1M — różnorodność cen). `dbg_g7_content` 15/15 PASS (ID unikalne, pola spójne, balans, panele renderują, gating `_wasteVendorAvail`, kupno). Prawnicy=SKIP (RAID_UPGRADE lawyer wystarcza). Pure-data adaptacja, save-safe.
**FALSE-POSITIVE audytu (NIE ruszać — istnieją):** turf_war=„Wojna z konkurencją" (5. recovery), `_trapMarketMult` (dynamiczne ceny), scandal_break (sponsor), „Zdjęcie z nocy" event, heat 7-kanałowy, evidence 6-typów.

## 🔧🔧 DOMKNIĘCIE LITERALNE — H1-H8 (user „wszystko domknięte, nic pominięte" 2026-06-18)
Po G1-G7 zostały pozycje implementowane jako ADAPTED/PARTIAL (mechanika jest, ale NAZWANA treść z przykładów PDF nieliteralnie — wcześniej kuratorowane decyzje). User chce literalnego 0-pominięć. Też naprawiono Część IV #9 „Blokada kont" (v2.3.1). Worklist (jeden/turę, pełny protokół):
- **H1 — nazwane surowce/tiery (I-2.1 + I-6.5)** `[DONE v2.3.4]` — `RAW_TIERS` 6 nazwanych (street/industrial/pse-base/e-salt/farm/moleculex) z pasmami PDF 6.6 + priceMult; tier-selector w oknie zakupu prekursora; `_trapRawQualityFromTier` ustawia rawQuality wg pasma (scam obniża); moleculex front-gated; nazwy prekursorów w opisach. Warstwa nazw — id nietknięte (save-safe). `dbg_h1_rawtiers` 14/14.
- **H2 — brakujące fillery (I-2.2)** `[DONE v2.3.2]` — TRAP_FILLERS: +inozytol/+talk (diluenty), +sildenafil (adulterant). Lista PDF kompletna (5 diluentów + 5 adulterantów). `dbg_h2_fillers` 11/11.
- **H3 — 3 nazwane eventy łapówkowe (I-12)** `[DONE v2.3.3]` — RANDOM_EVENTS: Kontener(customs-heat→konfiskata/przejście)/Osy-Sanepid(env+beczki→mandat/bribe)/Galeria(financial-evidence+launderAssets→ślad/zamrożenie). `_offerBribe` onProceed/onAvoid. `dbg_h3_bribe_events` 13/13. Wzmianki o prawnikach (Joanna/Nadia/Oleg → H4).
- **H4 — 5 nazwanych prawników/księgowych (I-11.2)** `[DONE v2.3.5]` — `LEGAL_TEAM` 5 hireable (hire+retainer/dobę, reqLvl-gate, auto-fire brak-kasy): Maksymilian→front-audyt↓, Nadia→launder-audyt↓, Joanna→kary↓, Dawid→financial-decay↑, Oleg→bribe↑+infamia. Panel+button. `dbg_h4_legal` 12/12.
- **H5 — nazwane ekipy produkcyjne (I-7.6-7.9)** `[DONE v2.3.6]` — 3 ekipy w WORKER_NPCS (Samir 50-65/Ramin 70-85/Heisenberg 85-99), hireCost 400k/1.2M/2.4M, reqLvl 10/12/14, `crewBand`→`_crewBatchQuality`, łącznik per ekipa, `_crewLiaison` preferuje ekipę. `dbg_h5_crews` 15/15.
- **H6 — wielowarunkowe odblokowanie labu + trigger inwestycji (I-7.2 + I-7.17)** `[DONE v2.3.7]` — `_labUnlockReqs` (pierwszy pro-lab wymaga dealer+stash+kapitał+reqLvl; heat≥75%=ryzykowny ruch+ostrzeżenie+evidence). `_labInvestTriggerTick` (purchased tier 0 + warunki → notify raz). `dbg_h6_labunlock` 11/11. (Bug złapany: trigger bazuje na purchased tier, nie effective — grandfather kampera.)
- **H7 — wykrywanie wzorca zakupów (I-6.4)** `[DONE v2.3.8]` — `_precursorBuyHeat` +flaga „prekursor+sprzęt razem" (`_lastGearDay`≤5d, stempel z lab-tier/lab-upgrade/cocaine-equipment) +flaga „brak frontu" (qty≥5) → heat fiskalny + digital-evidence. `dbg_h7_pattern` 9/9. Trawa/małe zakupy nieszkodliwe.
- **H8 — czystość startowa 30-40% per kamper (I-3e) + I-6.7 cap** `[DONE v2.3.9]` — LAB_TIERS tier0 purityCap 0.80→0.40 (PDF 6.7). Save-safe (effective-tier-0 ⟺ cooked 0 ⟺ pusty stash → zero nerf; tier1+ cap 0.90 nietknięty). `dbg_h8_kamper` 8/8. **WSZYSTKIE H1-H8 DONE.**
Po H1-H8 → finalny MC + audyt → „narkobiznes 100% DONE (literalne)".

## Decyzje designerskie (podejmuję sam w /loop, loguję tu)
- Wartości heat/cut/wasteFactor: dobieram konserwatywnie + MC test, by nie złamać trap ~15-18k.
- Nazwy fillerów/firm/NPC: z PDF (fabularne).
- _(uzupełniane w trakcie)_

## ❓ Pytania do usera (rano)
- _(uzupełniane w trakcie /loop gdy natrafię na decyzję wymagającą usera)_

## Log postępu
- **TIER 1** ✅ — F1.1+F1.2 heat-prekursory (v2.1.981, `dbg_precursor_heat`), F1.3 rabat hurtowy (v2.1.982, `dbg_bulk_disc`), F1.4 decay już w kodzie (v874).
- **TIER 2** ✅ — CUT/wypełniacze F2.1+F2.2+F2.3 (v2.1.983, `dbg_trap_cut`, balans MC ×1.36). Round 2: dealerzy respektują purity + zgony (v2.1.984, `dbg_dealer_purity`, exploit domknięty).
- **TIER 3** ✅ KOMPLET — F3.1 kanały zaopatrzenia (v2.1.985, `dbg_supply_channel`), F3.3 kamper pożar+mobilność (v2.1.986, `dbg_kamper_f33`), **F3.2 napad na lab konkurencji** (v2.1.987, `dbg_lab_raid_f32`, sprzężenie z terytoriami przez `_rivalAnger`). **Test C wczytanego starego save dla całego TIER 3 PASS** (`dbg_tier3_oldsave`).
- **TIER 4** ✅ KOMPLET — F4.1+F4.2+F4.3 rdzeń odpadów (v2.1.988, `dbg_waste_f4`), F4.4 vendorzy (4 firmy + 6 NPC, betrayal) + F4.5 abonamenty (v2.1.989, `dbg_waste_f44_f45`). **Test C + MC (protokół D) PASS** (`dbg_tier4_oldsave_mc`: sink ~2%, brak spirali).
- **TIER 5** ✅ KOMPLET — F5.1 `getClarity()`+`lifestyleDebt` + F5.2 wpływ (negocjacje/betrayal/heat) (v2.1.990, `dbg_clarity_f5`, test C PASS). Sprzężenie F5↔F4.
- **TIER 6** ✅ KOMPLET — F6.1 `G.publicRep` + F6.2 `getPublicStatus()` + sprzężenie legal↔illegal (v2.1.991, `dbg_publicrep_f6`, test C PASS).
- **TIER 7** ✅ KOMPLET + ZWERYFIKOWANY (`dbg_tier7_close`: test C 18 entry-points + MC protokół D — invariant trzyma, 0 spiral, launder EV −0.29). 
- **TIER 8** ✅ KOMPLET — F8.1 evidence (v997) + D3 heat 7-kanałowy (v998).
- **TIER 9** ✅ KOMPLET — F9.1 łapówki/korupcja (v2.1.999, `dbg_bribe_f91`).
- **TIER 10** ✅ KOMPLET — F10.1 recovery mode (v2.2.0).
- **D4 org-model (TIER 11)** ✅ KOMPLET — pion vs sieć (v2.2.1, `dbg_orgmodel_d4` 19/19).
- **D5 NPC-memory (TIER 12, OSTATNIA FEATURE)** ✅ KOMPLET — matryca pamięci dealerów (v2.2.2, `dbg_npcmem_d5` 16/16).
- **✅✅✅ NARKOBIZNES DONE (v2.2.3, 2026-06-18)** — **MC KOŃCOWY (protokół D, `dbg_mc_final` 250 dni wszystkie dźwignie) PASS** (invariant trzyma, 0 spirali, trap bounded ~33.8k full-endgame, pranie EV<0, zero crash) + **E KOŃCOWY AUDYT (6 sekcji Explore PDF↔kod) PASS** (zero realnych findingów poza 1 naprawionym: `_cookApply` waste+fire — produkcja w minigrze była pomijana). Cały PDF zrealizowany TIER 1-12 + D1-D5, line-item sign-off w ledgerze. **TEMAT ZAMKNIĘTY.**
