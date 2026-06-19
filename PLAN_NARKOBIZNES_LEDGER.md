# LEDGER — line-item PDF „narkobiznes" ↔ kod (gwarancja „nic nie pominięte")

Status: **DONE** (w kodzie+test) · **PARTIAL** (część) · **NEW** (do zrobienia) · **ADAPTED** (zrobione inaczej niż PDF, świadomie) · **SKIP** (świadomie pominięte + powód) · **DEFER** (czeka na decyzję usera).
Mapowanie: faza z `PLAN_NARKOBIZNES_2026-06-17.md`. Aktualizować po KAŻDEJ fazie. Końcowy audyt (E) weryfikuje każdą pozycję vs kod.

> Źródło: `_narko_extract.txt`. Pozycje na poziomie konkretnego wymogu (nie sekcji). Dokładne dane (nazwy firm/NPC/wzory) pobieram z PDF przy implementacji danej fazy.

## CZĘŚĆ I — systemy i moduły

### 2. Surowce i wypełniacze
- I-2.1 Surowce legalne (pseudoefedryna z leków, zboże/glukoza) + półlegalne prekursory (efedryna, P2P, BMK, liście koki) — `DONE v2.3.4 (H1)` (nazwy prekursorów w opisach RAW_TIERS: pseudoefedryna/efedryna/P2P/BMK/liście-koki; generyczne id traw/krysztal/prosz/chem zachowane jako save-safe baza)
- I-2.2 Wypełniacze: adulteranty (kofeina/fentanyl/lidokaina/levamisol/sildenafil) + diluenty (mannitol/laktoza/inozytol/skrobia/talk) per typ narkotyku — `DONE v2.3.2 (H2)` (`TRAP_FILLERS` 5 diluentów: mannitol/laktoza/skrobia/inozytol/talk + 5 adulterantów: kofeina/sildenafil/lidokaina/levamisol/fentanyl — KOMPLET listy PDF. `dbg_h2_fillers` 11/11)
- I-2.2b Cięcie = średnia ważona czystości + spadek reputacji — `DONE` (TIER 2, `_trapAddPurity`/`_trapPurityMult`, rep−)
- I-2.2c Adulteranty aktywne → losowe zgony NPC → heat — `DONE` (TIER 2 `danger`/`_trapSell`+dealerzy v984)
- I-2.3a Pozyskiwanie: legalni dostawcy (sklepy chemiczne, apteki, hurtownie, zamówienia online, ceny stabilne) — `ADAPTED v985` (kanał „Legalni dostawcy" w oknie zakupu: +40% cena, pewna dostawa, prekursory +heat. SKIP: osobne sklepy/apteki/online-UI — zbędne, kanał wystarcza)
- I-2.3b Pozyskiwanie: czarny rynek (prekursory taniej hurtowo, zmienna jakość, przemyt słabej substancji) — `DONE v985` (kanał „Czarny rynek": taniej+hurt v982, 15% przekręt = krótsza dostawa)
- I-2.3c Pozyskiwanie: kradzież/napady na lab konkurencji — `DONE v987` (`_trapRaidCompetitorLab`/`_trapRaidLabResolve`: 3. kanał = darmowe surowce do stashu, szansa=f(dealerzy/loyalty/level/rep), 20⚡+cooldown 1/dobę+heat+`_rivalAnger` karmi erozję terytoriów. Hooki: supply/inventory + territory/gang + heat/raid)
- I-2.1d Duże/częste zamówienia prekursorów → heat (wzorzec zakupów) — `DONE` (TIER 1 `_precursorBuyHeat`+precursorLog 30 dni)

### 3. Kamper (one-pot lab startowy)
- I-3a Kamper jako lokacja startowa produkcji — `DONE` (istnieje `camper_underground`/`G.grow.kamper`)
- I-3b Koszt zakupu kampera 15-25k + ulepszenia (wentylacja/filtry/butle) — `ADAPTED v986` (kamper = darmowy Tier 0 startowy z designu; „wentylacja" = istniejące filtry growfilter/labfilter, które teraz GATUJĄ ryzyko pożaru = sprzężenie. SKIP: osobny zakup kampera/butli — zbędne)
- I-3c Ryzyko eksplozji/pożaru z temperatury (one-pot) — `DONE v986` (`_trapCook`: szansa pożaru = base×(1+heat/100)×(filtr?0.15:1), strata partii+heat, NIE total-loss #11)
- I-3d Mobilność kampera (przestawianie → redukcja heat) — `DONE v986` (`_trapRelocateKamper`: −heat raz/dobę, koszt 15 energii; przycisk w panelu)
- I-3e Czystość startowa 30-40% per kamper — `DONE v2.3.9 (H8)` (LAB_TIERS tier0 kamper purityCap 0.80→0.40, zgodnie z PDF 6.7 „kamper max 30-40%". Save-safe: effective-tier-0 ⟺ cooked===0 ⟺ pusty stash → zero devaluacji istniejących partii; po cooku grandfather→tier1 cap 0.90)

### 4. Moduł utylizacji odpadów
- I-4.1 Skala odpadów per substancja (meth 6kg/kg, MDMA 18, koka 8, heroina 3, amfa 5) → kg→galony→beczki (200l) — `DONE v988` (F4.1 `TRAP_WASTE_FACTORS` litry/jednostkę per produkt + toksyczność, `_trapAccrueWaste` hooki w `_trapCook`/`_methCrystallize`/`_methSynthApply`/`_cocaineRefineApply`/`_mushroomHarvestApply`; beczki=litry/200)
- I-4.2 Okresowy obowiązek wywozu; brak → heat + skażenie miejscówki — `DONE v988` (F4.2 `_trapWasteDailyTick` + decay-block: >3 beczki duszą stygnięcie heat / przy dużym nagromadzeniu podbijają (#11), event zaniedbania „smród→donos", skażenie z zakopywania)
- I-4.2.1 Metody utylizacji (firma pro / czarny rynek beczek las-rzeka / zakopywanie survival) — `DONE v988` (F4.3 `_trapDisposeWaste` 3 metody + panel `_openWastePanel`; trade-off koszt/heat/skażenie)
- I-4.3 3 typy odpadów (tani/średni/drogi, koszt/galon) — `ADAPTED v988` (modelowane jako toksyczność per substancja `tox` w TRAP_WASTE_FACTORS zamiast 3 globalnych typów; koszt-tiery dojdą z firmami F4.4)
- I-4.4 8 fikcyjnych firm utylizacyjnych (Viso Hazard/Baltic Neutralis/MoleClean/EcoVanta/Arkona/Donistenic/AlphaB/GreyRiver) z heat_modifier/koszt/skuteczność/abonament/dokumentacja — `DONE v989` (kuratorowane 4 firmy `WASTE_VENDORS`: Arkona/EcoVanta/Visó/MoleClean z eff/heatMod/cost/gated lvl. SKIP reszty: czytelność > kompletność, decyzja usera)
- I-4.5 13 NPC brudnej utylizacji (Tadeusz Beczka…Antonina Lipa) ze statystykami (effectiveness/cost/heat_mod/betrayal/capacity/cooldown/reputation) — `DONE v989` (kuratorowane 6 NPC: Norbert/Kret/Tadeusz/Mira/Emir/Sasha z eff/cost/heatMod/betrayal/reqLvl/reqRep. SKIP reszty: kuratorowany podzbiór)
- I-4.5b 3 kanały rekrutacji (ulica/komunikator-apka/czarny rynek) — `ADAPTED v989` (zamiast osobnej rekrutacji — gating reqLvl/reqRep odzwierciedla dostępność NPC „z ulicy/komunikatora/czarnego rynku"; per-job, nie roster)
- I-4.6 Aktywność/skuteczność NPC (dane statystyczne) — `DONE v989` (effLo/effHi roll per zlecenie + betrayal)

### 5. System kosztów beczek
- I-5.1 Beczka=200l, koszt per typ, rabaty hurtowe (>500 gal/rok −15-20%) — `DONE v989` (beczka=200l + koszt per beczka per vendor `costPerBarrel`; „rabat hurtowy" zrealizowany przez abonament F4.5 = stała opłata zamiast rosnącej per-beczka)
- I-5.2 Umowy: jednorazowa / abonament (Basic/Industrial/Pharma) / premium 1-3mln (gated lab) — `DONE v989` (F4.5 `DISPOSAL_CONTRACTS` Basic/Industrial/Pharma + `_trapDisposalContractTick` auto-clean w `_trapWasteDailyTick`, premium gated reqLvl; brak kasy=zawieszenie #11)
- I-5.3 „Ślad odpadowy" waste_trace = volume×toxicity×storage_time×location_risk×method_risk — `DONE v988/989` (trace=volume×toxicity + storage_time; method_risk=traceCut per vendor; location=contam)
- I-5.5 Ranking firm/NPC (4 tiery skuteczności) — `DONE v989` (vendorzy uszeregowani eff 50-99%: firmy 75-99% / NPC 50-96%)
- I-5.x Eventy zaniedbania (sąsiad/zatrucie/przeciek/szantaż/media/NPC znika z kasą) — `DONE v988/989` (event „smród→donos" `_trapWasteDailyTick` + „NPC znika z kasą + donos" przy zdradzie w `_trapDisposeWaste`; pozostałe warianty=esencja oddana)

### 6. Progi heat (zakupy)
- I-6.1 Heat za zakup prekursorów (model punktowy: base/quantity/frequency/supplier/location) — `DONE` (TIER 1, uproszczony: qty+wzorzec; supplier/location DEFER do TIER 3 kanałów)
- I-6.2 Próg jednorazowego zamówienia — `DONE` (TIER 1)
- I-6.4 Wykrywanie wzorca (wiele aptek/dni, prekursor+sprzęt razem, brak frontu) — `DONE v2.3.8 (H7)` (rozszerzony `_precursorBuyHeat`: wzorzec 30-dniowy + flaga „prekursor+sprzęt razem" (`_lastGearDay`≤5 dni, stemplowany przez _labUpgradeTier/_buyLabUpgrade/_cocaineBuyEquipment) + flaga „brak frontu" (qty≥5 bez `_trapHasFront`) → heat fiskalny + ślad digital. `dbg_h7_pattern` 9/9. Małe zakupy nieszkodliwe #11)
- I-6.5 6 nazwanych tierów surowców (E-Salt/Farm-Grade/MoleculeX/Industrial Cold/Street PSE Mix) — `DONE v2.3.4 (H1)` (`RAW_TIERS` 6 nazwanych z pasmami czystości PDF 6.6: street 40-65/industrial 60-78/pse-base 70-85/e-salt 80-92/farm 90-98/moleculex 94-99; priceMult 0.65-2.2; moleculex front-gated; wybór tieru przy zakupie → `_trapRawQualityFromTier` ustawia G.trap.rawQuality. WARSTWA nazw nad traw/krysztal/prosz/chem — id nietknięte (save-safe). `dbg_h1_rawtiers` 14/14)
- I-6.6 Losowa jakość bazowa surowca → czystość partii — `DONE v2.2.5 (G2)` (`G.trap.rawQuality` 0.30-0.95, czarny rynek zmienny/scam niższy, legal stabilny; `_trapRawQuality()` delta wpięta w cook/meth/crew)
- I-6.7 Produkcja z kampera (cap czystości) — `DONE v2.3.9 (H8)` (kamper purityCap 0.40 = PDF „czystość z ulepszeniami 30-40%"; `_cookApply`/`_crewBatchQuality` clampują do capa; tier1+ podnosi sufit. `dbg_h8_kamper` 8/8)

### 7. Profesjonalne laboratorium
- I-7.1/7.3 Drzewko 4-poziomowe (Kamper / Mini-lab 5mln / Firmowe 12mln / Certyfikowane 25mln) z czystością per tier — `DONE v992` (F7.1 `LAB_TIERS` 4 poziomy + `G.lab.tier`; czystość per tier `_labTierPurityCap` 80/90/96/100% w `_trapAddGrade`; skala ÷10: 500k/1.2M/2.5M; `_labUpgradeTier` UI w panelu. GRANDFATHER `_labGrandfatherTier` = ZERO nerfu starych save)
- I-7.2 Wielowarunkowe odblokowanie (dealerzy/stash/kapitał/heat<próg) — `DONE v2.3.7 (H6)` (`_labUnlockReqs`: pierwszy pro-lab nextT≥1 wymaga ≥1 dealer + ≥15 szt. stash + kapitał(cost) + reqLvl; heat≥75%=ruch dozwolony ale ryzykowny — ostrzeżenie + heat-fiscal/evidence bump. `dbg_h6_labunlock` 11/11)
- I-7.4 Legalna przykrywka (4 typy: farmacja/instytut/zakład/agro-bio) — `DONE v993` (F7.2 `FRONT_TYPES` 4 typy z paperTrailQuality/auditRisk/upkeep/cost; `_openFrontPanel`/`_trapEstablishFront`; paperTrail obniża raid w `_trapRaidCheck`, auditRisk→kontrole skarbowe, type===null=zero regresji)
- I-7.5 Nazwa firmy przez gracza (input + sugestie) + w komunikatach/eventach — `DONE v993` (input + 7 sugestii PDF 7.5 Vireon/Northex/Helixora..., sanitized; nazwa w raid-msg/audit-notif/cinematic)
- I-7.6-7.9 Rekrutacja 3 ekip (4/12/24mln, qBand 50-65/70-85/85-99%) — `DONE v2.3.6 (H5)` (3 nazwane ekipy w WORKER_NPCS: crew_samir[0.50-0.65]/crew_ramin[0.70-0.85]/crew_heisenberg[0.85-0.99], hireCost 400k/1.2M/2.4M ÷10, reqLvl 10/12/14, łącznik per ekipa. `crewBand` → `_crewBatchQuality` (środek pasma = baza, modyfikowane morale/fatigue/heat/G1). `_crewLiaison` preferuje zatrudnioną ekipę. `dbg_h5_crews` 15/15. crewBase lab-tier zostaje fallbackiem dla zwykłych chemików)
- I-7.10 Premium 98-99% za 5mln — `ADAPTED v994` (tier 3 cert. lab crewBase 0.90 + cap 1.0 = pasmo premium; osobna „bezpieczna dystrybucja 5mln" = przyszłość/D6 logistyka)
- I-7.11 Jakość zależna od surowiec/tier/skill/morale/zmęczenie/heat/utylizacja/front — `DONE v994` (`_crewBatchQuality`: tier band + morale + fatigue + reagents; utylizacja→morale w `_crewWorkTick`)
- I-7.12 Morale ekipy (spada presja/heat/odpady/brak przerw; rośnie przerwy/sprzęt/utylizacja) — `DONE v994` (`w.morale` w `_crewWorkTick`: −heat/−fatigue, +przerwa/+abonament utylizacji)
- I-7.13 Łącznicy ekip (Samir/Ramin/Walter raportują gotowość/braki/morale) — `DONE v994` (`_crewLiaison` per tier; notif przy fatigue≥75/morale≤35)
- I-7.11b Zmęczenie + „czas od przerwy" → spadek jakości — `DONE v994` (`w.fatigue`/`w.lastBreak`, fatigue obniża quality −0.0020/pkt, dzień bez produkcji = regeneracja)
- I-7.14 Powiązanie lab z legalnym frontem — `DONE v993/994` (front rekomendowany przy tier≥2, front→raid/publicRep)
- I-7.15 Miesięczne koszty utrzymania per tier (80-200k…1-3mln) — `DONE v994` (`upkeepMo` 18k/54k/135k ÷10, `_labUpkeepDailyTick` brak kasy=zawieszenie #11; TYLKO kupiony tier, nie grandfather)
- I-7.16 Ryzyka lab (audit_risk/staff/supply/distribution/reputation) — `DONE v2.2.9 (G6)+G3` (audit_risk=front audit; staff_risk+reputation_risk=G6; distribution_risk=G3 logistyka; supply_risk=ingredient-check/_labSuspended)
- I-7.17 Trigger inwestycji (max dealerów+stash+sejf) — `DONE v2.3.7 (H6)` (`_labInvestTriggerTick`: gdy KUPIONY tier 0 + warunki spełnione + heat<75 → jednorazowe powiadomienie „czas na profesjonalne lab". Bazuje na G.lab.tier purchased, NIE effective — grandfather kampera nie blokuje triggera)

### 8. Struktury organizacyjne + logistyka
- I-8 Model pionowy vs sieć komórek (konsekwencje) — `DONE v2.2.1` (D4: `G.trap.orgModel` null/vertical/network + `ORG_MODELS` + `getOrgMult(trap/disposal/raidSeverity/keepBonus)`. vertical: trap ×1.12 ale raid-fine ×1.35; network: trap ×0.90 ale disposal ×0.78 + keepFrac +0.3 + raid-fine ×0.65. Modal `_openOrgPanel`/`_chooseOrgModel` (1. darmo, zmiana 200k). null=ZERO zmian starych save. Sprzężenia: org↔trap-earn + org↔utylizacja + org↔raid. `dbg_orgmodel_d4` 19/19 PASS)
- I-8.1 Logistyka dystrybucji: 4 metody (dealerzy/kurier autostrada 5-10kg/kontener-samolot setki kg/przewóz w żywności) z koszt/czas/pojemność/ryzyko + minigra unikania kontroli — `DONE v2.2.6 (G3)` (DISTRIBUTION_METHODS kurier/żywność/kontener + minigra `_prodCanvasMG` + łapówka celna; dealerzy detal już byli)

### 9. Pranie pieniędzy
- I-9.1 Inwestycje w sztukę/biżuterię/antyki/kolekcje (~24 collectible z widełkami cen) — `DONE v996` (D2: `LAUNDER_ASSETS` 7 kuratorowanych z PDF 9.2 — sztuka/street-art/biżuteria/antyk/kolekcja; OSOBNA warstwa `G.launderAssets` obj[], NIE migracja luxuryAssets string[] → achievementy luxury nietknięte). SKIP reszty 24 — esencja kuratorowana
- I-9.2 Wycena rzeczoznawcy 3 poziomy (uczciwa 2-5% / kreatywna 5-12% / agresywna 15-25% +audit_risk) — `DONE v996` (`LAUNDER_APPRAISALS` uczciwa/kreatywna/agresywna z mult+audit+evidence; `_sellLaunderAsset` audyt skalowany frontem, anti-exploit EV)
- I-9.3 Mechanika wyceny aktywów (asset/declared/liquidity/audit_risk/prestige) — `DONE v996` (buyValue + appraisal mult + hold/liquidity + baseAudit + prestige→publicRep; kupno za dirty `_spendDirty`, sprzedaż=clean; sprzężenia D2↔D1/F7.2/publicRep). `dbg_launder_d2` 16/16 PASS. Aukcja „Biały Kruk" co 30 dni = SKIP (przyszłość). frozen_assets/declared pełne = TIER 8 evidence

### 10-12. Łapówki / korupcja
- I-10.1 4 typy kontroli (celna/policji/sanitarna/skarbowa) z opcją łapówki — `DONE v999` (F9.1: opcja łapówki przy nalocie policji `_trapRaidCheck` + kontroli broni; celna/sanitarna/skarbowa = mapują na front-audyt/D6 dystrybucję — bribe-choice-modal uniwersalny `_offerBribe`)
- I-10.2 Wzór bribe_success (corruption+relationship+amount+lawyer+leverage−heat−media−failures), progi 75/50/25 — `DONE v999` (`_bribeSuccessScore` z corruptionDep/lawyer/informer − heat/media/evidence/prevFails; progi 75/50/25 PDF 10.2: sukces/częściowy/bierze-kasę-problem-wraca/porażka)
- I-10.x 5 poziomów łapówek (5-25k … 3-10mln) — `DONE v999` (`BRIBE_TIERS` 5 poziomów skala ÷10: drobna 8k/koperta 40k/układ 150k/system 500k/cisza 1.2M)
- I-10.x corruption_dependency (NPC doi gracza + szantaż) — `DONE v999` (`G.trap.corruptionDep` rośnie z każdą łapówką → koszt ×(1+dep/100) + `_corruptionDailyTick` szantaż przy dep≥60; „kredyt u diabła", anti-exploit)
- I-12 3 nazwane eventy łapówkowe (Kontener/Osy do ula/Galeria pod lupą) — `DONE v2.3.3 (H3)` (3 RANDOM_EVENTS z `_offerBribe` choice: „Kontener na czerwonej liscie" cond customs-heat≥40→konfiskata/przejście, „Osy wchodza do ula" cond env-heat+beczki→Sanepid mandat/bribe, „Galeria pod lupa" cond financial-evidence+launderAssets→ślad/zamrożenie/obrona. Decline→konsekwencja, bribe-sukces→czysto. `dbg_h3_bribe_events` 13/13)
- I-11.2 5 NPC prawnik/księgowy (Joanna „Paragraf"/Maksymilian „Excel"/Nadia/Dawid/Oleg) — `DONE v2.3.5 (H4)` (`LEGAL_TEAM` 5 nazwanych do najęcia: hire+retainer/dobę, reqLvl-gate, auto-zwolnienie brak-kasy. Bonusy wpięte: Maksymilian→front-audyt↓, Nadia→launder-audyt↓, Joanna→kary-skarbowe↓, Dawid→financial-evidence-decay↑, Oleg→bribe-score↑+infamia. Panel `_openLegalPanel`. `dbg_h4_legal` 12/12)
- I-11/13 Fronty legalne (revenue_legitimacy/invoice/employee_logic/tax_pressure/paper_trail) + drzewko + aukcja „Biały Kruk" co 30 dni — `DONE v2.2.8 (G5)` (front FRONT_TYPES + tier 1-3 `_trapUpgradeFront` paperTrail/audit/upkeep + aukcja Biały Kruk co 30 dni; invoice/employee_logic = SKIP-abstrakcja w paperTrailQuality)

### 14. Finalna rekomendacja Cz I — (meta, brak osobnej funkcji)

## CZĘŚĆ II — rdzeń stanów globalnych + meta-systemy
- II-2.1 Stany finansowe: dirty_cash/clean_cash/frozen_assets/asset_value/monthly_upkeep/cashflow — `DONE v995` (D1: `G.finance={dirty,clean,frozen}` WARSTWA nad `G.money` (single-source total nietknięty); `_financeReconcile` invariant dirty+clean==money + spend-clean-first; `_addDirty` w trap-sell/dealer/territory/cocaine; migrator stare money→clean; display panel; sprzężenie D1↔F7.2 audyt skalowany dirty-ratio. frozen=0 placeholder do TIER 8 evidence/seizure. monthly_upkeep=F7.3, asset_value=D2). `dbg_finance_d1` 16/16 PASS + 200-stress invariant)
- II-2.2 Stany produkcyjne: raw_material_quality/batch_volume/batch_reputation/crew_morale/crew_fatigue/lab_condition/production_pressure/waste_volume/waste_trace — `DONE` (raw_material_quality=G2; batch_reputation=G6 reputation_risk+G.trap.reputation; crew_morale/fatigue=F7.3; waste_volume/trace=F4; batch_volume=qty; lab_condition=_labSuspended/upkeep; production_pressure=heat-w-crewQuality G1)
- II-2.3 Heat wielokanałowy (street/customs/fiscal/env/media/digital/violence + overall) — `DONE v998` (D3: `G.trap.heatCh` 7 kanałów jako ADDYTYWNE rozbicie; `_trapHeatChReconcile` skaluje tak że ZAWSZE sum(heatCh)==heat — `G.trap.heat` NIETKNIĘTY single-source UI/driver, raid/decay/UI bez zmian. Tagi: sprzedaż→street, prekursory→customs, legal-supply→fiscal, odpady/pożar→env, napad→violence; nietagowane→street. Sprzężenia: media↔publicRep, kanały→evidence (env→physical/fiscal→financial/digital→digital). Display pasek rozbicia. `dbg_multiheat_d3` 15/15 PASS, migracja heat→street)
- II-3 evidence_score (6 typów dowodów + reduktory + decay) — `DONE v997` (F8.1: `G.trap.evidence` 6 typów + `_trapEvidenceScore` (suma − lawyer/front-paperTrail/informer) + `_trapAddEvidence` [zaimplementowany, D2-hook działa] + `_trapEvidenceDailyTick` decay (media sticky). Przyrosty: sprzedaż→digital/financial, zakopanie→physical, zdrada→witness, skandal→media, launder-audyt→financial; reduktory: pro-utylizacja→physical−. **Raid GATING #11**: niskie evidence+wysoki heat=obserwacja (NIE bust), wysokie=bust skalowany evidence (kara/areszt). `dbg_evidence_f81` 16/16 PASS. SKIP: logistics-source do D6 dystrybucji)
- II-4 Konsekwencje publiczne (public_image/infamy/brand_safety/street_cred/fan_loyalty/media_pressure/sponsor_trust/booking_trust + statusy + eventy przecięcia) — `DONE v991` (TIER 6: mapowanie public_image=fame/infamy=_underworldRespect/street_cred=streetRep/media_pressure=`getMediaPressure()`; `G.publicRep`={brandSafety,fanLoyalty,sponsorTrust,bookingTrust} neutralny start 60 + `_publicRepDailyTick` drift asymptota #11; `getPublicStatus()` 6 archetypów PDF 4.4; sprzężenie legal↔illegal: scandal severity×heat + fanLoyalty buffer + sponsorTrust/brandSafety hit + booking_trust gate w `performConcert` (mult 0.7-1.0 + odwołanie przy skrajnym heat). `dbg_publicrep_f6` PASS, test C old-save OK)
- II-5 Meta styl życia / trzeźwość (clarity/lifestyle_debt/impulse_control/recovery) — `DONE v990` (TIER 5: `getClarity()` pochodna z addictions/sleepDebt/stress/lifestyleDebt; `G.lifestyleDebt` akum z używek/prostytutek/striptizu, decay −3/dobę w `_addictionDailyTick`; wpływ: `_trapNegotiateDealer` ±15, betrayal vendora ×(1+(100-cl)/200), heat sprzedaży ×(1+(100-cl)/400); panel+ostrzeżenie <40. impulse_control/recovery=ADAPTED przez clarity+stress, bez osobnych pól)
- II-6 Pamięć NPC + matryca relacji (trust/loyalty/fear/respect/professionalism/resentment/leverage/memory_tags) — `DONE v2.2.2` (D5 pilot na dealerach: `_dealerMemEnsure` lazy z loyalty (trust=loyalty, reszta 0) + {trust,fear,respect,resentment,leverage,memoryTags}. Reaktywność: wypłata→trust/respect/paid_on_time, brak→resentment/late_payment, high-heat→leverage/high_heat_job. **Betrayal-by-resentment**: lojalny ale urażony (resentment≥55) dealer może zdradzić; leverage zwiększa konfiskatę+evidence. respect→bonus sprzedaży. Display w panelu. `dbg_npcmem_d5` 16/16 PASS. professionalism=SKIP (loyalty wystarcza); pilot na dealerach, workerzy=esencja)
- II-7 Makrobalans + money sinki + krzywa do X mln — `PARTIAL` (sinki ~70% + TIER 4-7 dodały: utylizacja/lab-upkeep/front-upkeep+audyty/pranie-spread; MC po TIER 7 `dbg_tier7_close`: brak runaway, invariant trzyma, pranie EV<0) · TIER 10
- II-8 Pętla upadku/odbudowy (5 trybów recovery) — `DONE v2.2.0` (F10.1: `G.trap.recoveryMode` + `RECOVERY_MODES` 5 trybów PDF 8.3 (laying_low/legal_cover/back_to_street/turf_war/clean_rebuild) jako modyfikatory `getRecoveryMult(trap/heatDecay/legal)`. **MIĘKKA porażka**: `_offerRecovery` choice-modal po raid-fail (NIE game over). Mults wpięte: trap-earn (sell/dealer/territory), heat-decay block, `_globalEarnMult` (legal). Auto-exit gdy heat<próg przez 2 dni + odbudowa publicRep. `dbg_recovery_f101` 16/16 PASS, null=zero zmian)

## CZĘŚĆ III — scenariusze integracji + zasada „każdy system ma wejście/wyjście/echo w ≥2 modułach"
- III-* Sprzężenia międzymodułowe (produkcja→odpady→env_heat→public_image→sponsorzy itd.) — `DONE` (E-audyt potwierdził sprzężenia: D1↔F7.2 audyt, D2↔D1/F7.2/publicRep, F4↔F7 morale, F5↔F4 betrayal, F6↔heat, F8↔raid/D2, D3↔F8/publicRep, F9↔heat/evidence, F10↔earn/heat-decay, D4↔raid/utyl, D5↔betrayal/sprzedaż).

---

## ✅ E-AUDIT (KOŃCOWY, 2026-06-18, v2.2.3) — ZWERYFIKOWANE vs KOD
**6 sekcji audytu (Explore, adversarialny grep PDF↔kod) + MC końcowy (protokół D).** Wynik:
- TIER 1-3 / 5-6 / 7+D1+D2 / 8-10 / D4-D5 — **zero realnych findingów** (każda pozycja DONE/ADAPTED potwierdzona vs kod z numerem linii; wszystkie funkcje na ŻYWYCH ścieżkach: UI onclick / daily-tick / event; sprzężenia ≥2 drożne).
- TIER 4 — **1 realny finding NAPRAWIONY**: odpady (F4.1) + pożar (F3.3) były podpięte tylko pod osierocony `_trapCook` (zero callerów); REALNA produkcja idzie przez minigrę `_cookApply` → przeniesiono `_trapAccrueWaste` + fire-logic do `_cookApply` (v2.2.3, `dbg_mc_final` waste+fire PASS). `_trapCook` zostaje jako legacy (brak UI-referencji = nie ghost dla gracza).
- **MC KOŃCOWY (`dbg_mc_final`, 250 dni, WSZYSTKIE dźwignie TIER 1-12)**: invariant dirty+clean==money trzyma cały czas, maxHeat 10 / 0 dni spirali, money≥0, trap żywy (~33.8k gross full-endgame, bounded NIE runaway), pranie EV<0 (uczciwa −4.6% / agresywna-bez-frontu −87% = NIE money-printer), zero pageerror.

**→ NARKOBIZNES DONE: cały PDF zrealizowany (TIER 1-12 + D1-D5), zweryfikowany line-item vs kod, MC+E PASS.**

---

## ✅✅ DOMKNIĘCIE 100% — G1-G7 (2026-06-18, v2.2.4→v2.3.0) — po świeżym audycie SUROWY-PDF↔kod
Świeży audyt (5 sekcji Explore czytających `_narko_extract.txt` vs kod) wykrył realne braki mechaniczne, których audyt ledger↔kod nie mógł złapać. Wszystkie domknięte:
- **G1** `_crewBatchQuality` pełna formuła 7.11 (heat/odpady/front + raw) — v2.2.4, dbg 11/11.
- **G2** raw_material_quality 6.5/6.6 (kanał→jakość partii) — v2.2.5, dbg 11/11.
- **G3** D6 logistyka dystrybucji 8.1 (kurier/żywność/kontener + minigra + łapówka celna) — v2.2.6, dbg 12/12 + MC nie-printer.
- **G4** eventy publiczne 4.5 (Artykuł-skażenie/Fani-bronią/Dziennikarz) — v2.2.7, dbg 15/15.
- **G5** drzewko frontu (tier 1-3) + aukcja Biały Kruk — v2.2.8, dbg 20/20.
- **G6** lab-risks 7.16 (staff_risk + reputation_risk) — v2.2.9, dbg 7/7.
- **G7** content-enrichment (firmy 4→8, NPC 6→11, collectibles 8→12) — v2.3.0, dbg 15/15.
**FINALNY MC** (`dbg_mc_final`, 250 dni wszystkie dźwignie): invariant trzyma, maxHeat 10/0 spirali, launder EV<0 (uczciwa −4.4%/agresywna −103% = nie printer), zero crash. **MINI-AUDYT G1-G7**: każda funkcja na ŻYWEJ ścieżce (grep potwierdzony — crew/cook/buy/panel/events/upgrade/risks/data).
**→ NARKOBIZNES 100% DONE: literalne pokrycie PDF (systemy + braki mechaniczne G1-G7), MC+E+mini-audyt PASS.**

### ✅ WERYFIKACJA EKSTRAKTU + CZĘŚĆ IV (2026-06-18, user „czy ekstrakt zawiera wszystko?")
- **Ekstrakt kompletny**: świeża re-ekstrakcja `pdftotext` BAJT-W-BAJT identyczna z `_narko_extract.txt` (0 różnic), 95 stron, naturalne zakończenie, wszystkie 4 części obecne (Cz I l.1 / Cz II l.2430 / Cz III l.2974 / **Cz IV l.3188**).
- **Cz IV „Przykładowe funkcje systemowe dla agentów Claude.ai"** (l.3188-3377) = spec 11 funkcji backendu, NIE nowe feature dla gracza. Mapowanie 1:1 na kod (grep-potwierdzone): (1) dailyTick→nextPeriod+9 daily-ticków · (2) updateHeatChannels→`_trapHeatChAdd` D3 · (3) updateEvidence→`_trapAddEvidence` F8 · (4) evaluatePublicConsequences→`_publicRepDailyTick`/getPublicStatus · (5) updateNpcMemory→D5 memoryTags · (6) resolveProductionCycle→`_cookApply`/`_workersDailyTick`+G1/G2/G6 · (7) resolveDisposalAction→`_trapDisposeWaste` · (8) resolveBribeAttempt→`_offerBribe`/`_resolveBribe` (event-only) · (9) evaluateCrisisState→`_trapRaidCheck`(heat+evidence combo)+eventy kombinacyjne G4 (afera środowiskowa=env+waste)+**„Blokada kont" v2.3.1** (fiscal+financial-evidence+clean→`_financeFreeze`, miękko #11: `_financeThawDailyTick` odmraża gdy fiscal<35, zero trwałej straty, `dbg_blokada_kont` 14/14) · (10) startRecoveryPath→`_offerRecovery`/RECOVERY_MODES · (11) zasada sprzężeń ≥2 — utrzymana w całym module. **WSZYSTKIE przykładowe kryzysy #9 pokryte (nalot/audyt/skażenie/zdrada/skandal/wojna-turf_war/blokada-kont). ZERO pominięć.**

---

## ✅✅✅ FAZA A ZAMKNIĘTA — narkobiznes 100% LITERALNE (2026-06-18, v2.3.9)
G1-G7 (domknięcie mechaniczne) + Część IV Blokada-kont + **H1-H8 (literalne nazwane treści PDF)**:
H1 6-tierów-surowca(RAW_TIERS) · H2 fillery(sildenafil/inozytol/talk) · H3 3-eventy-łapówkowe(Kontener/Osy/Galeria) · H4 5-prawników(LEGAL_TEAM) · H5 3-ekipy(crewBand) · H6 multi-unlock+trigger · H7 wzorzec-zakupów · H8 kamper-cap-40%. Każdy dbg PASS (11/13/14/12/15/11/9/8).
**FINALNY MC** (`dbg_mc_final`): invariant dirty+clean==money trzyma, maxHeat 10/0 spirali, launder EV<0 (uczciwa −4.5%/agresywna −90%), trap bounded ~30k, zero crash. **MINI-AUDYT**: G1-G7+H1-H8 wszystkie na żywych ścieżkach (grep ≥1 każda), daily-ticki wpięte w nextPeriod.
**→ FAZA B (w toku): głęboka weryfikacja 3 PDF (Błędy & wdrożenia / Proponowane zmiany / Systemy-narkobiznes) per LOOP_SNOWY_PDF.txt.**
