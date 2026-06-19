# 🌙 Autonomous Night Session — 2026-05-28

User explicit (2026-05-28 02:XX): "Ja będę teraz szedł spać, wiec nic nie ma być defered. (...) Samodzielnie udzielaj odpowiedzi na wszystkie pytania, ale nie strzelaj. Wybieraj je w taki sposób jaki będą najlepsze do gry. Wszystkie Defered, 'na rano', zrób autonomicznie i tak pracuj dopóki nie wrócę. Zapisuj gdzieś wszystkie pytania i wszystkie odpowiedzi, na które samodzielnie udzielałeś odpowiedzi i pracowałeś autonomicznie tak abyś mógł mi przejrzyście to wskazać jak już wrócę."

**Stan startowy**: v2.1.375, Faza A+E TIER 5 DONE z Round 2 audit (4 findings naprawione).

**Pending defer-y**:
- Faza B Underground content (DUŻA, defer w PLAN_DZIELNICE)
- Faza C Coast content (DUŻA, defer)
- Faza D Business content (DUŻA, defer)
- Faza F Auto-weryfikacja + Deep audit po B/C/D
- Sekcja "Pytania do usera (rano)" w PLAN_DZIELNICE

**Strategia**: TIER 5 Faza B/C/D content z atomic commits per element. Najmniejszy scope first — 1 NPC + 1 prosta MG per dzielnica, potem rozszerzaj. Po Faza B/C/D: Faza F deep audit.

---

## 📋 Decyzje designerskie (samodzielne) — chronologia

Format każdego wpisu:
- **Iter X / Faza Y / Pytanie**: co trzeba było zdecydować
- **Mój wybór**: jaką opcję wybrałem
- **Uzasadnienie**: dlaczego
- **Wpływ**: jak wpływa na grę / gracza
- **Alternatywa**: co byłoby drugą opcją

(wpisy poniżej dopisywane po każdej decyzji)

### Decyzja #1 — NPC dzielnic: overlay modal vs fizyczna mapa

**Pytanie**: Czy Faza B/C/D Underground/Coast/Business NPCs (Bracha/Yza/Kai/Roxanne/Aleksander/Magdalena) mają być **fizyczni** w mapie czy **w overlay modal**?

**Mój wybór**: NPC dialogi **w overlay modal dzielnicy**.

**Uzasadnienie**:
- Bramki dzielnic dały już overlay UI (Faza A: analog sklepu — brak fizycznych sektorów). Konsekwentne.
- Fizyczne NPC dodanie = ryzyko overlap z DB_DECORATIVE/budynkami (reguła #8 ZERO TOLERANCE).
- Mapa już zatłoczona (95 obiektów w ROOMS.ulica.objects). 6 nowych NPC × 32×32 = ryzyko kolizji.
- Overlay modal = zero overlap risk + gracz widzi NPC kontekstowo "wewnątrz" dzielnicy.

**Wpływ**: gracz wchodzi do dzielnicy → overlay → klika "Wejdź" do miejsca (np. Cypher Club) → modal z NPC dialogem.

**Alternatywa**: Dodać NPC do mapy w specific positions (np. Bracha obok bramki Underground na chodniku). Wymagałoby map expansion lub szukanie wolnych pozycji + 6× overlap audit.

---

### Decyzja #2 — Faza B/C/D scope dla autonomic session

**Pytanie**: Ile content per dzielnica zaimplementować autonomicznie (DUŻA fazy)?

**Mój wybór**: **Minimum viable** — 2 funkcjonalne miejsca + 1 prosty NPC dialog overlay per dzielnica. Pozostałe miejsca = lepsze placeholdery z preview functionality.

**Uzasadnienie**:
- User explicit "nie strzelaj. Wybieraj w taki sposób jaki będą najlepsze do gry."
- Atomic commits = łatwa rollback per iteracja.
- 2 funkcjonalne miejsca per dzielnica = 6 gameplay actions ogółem = znaczący progress.
- Pełen scope 7+5+5 miejsc × MG = nierealne w autonomic session.

**Wpływ**: gracz po unlock dostaje 6 nowych gameplay actions (2 per dzielnica) plus rozbudowany context per placeholder.

**Alternatywa**: Pełen scope = 35+ atomic commits, ryzyko niedokończenia + ghost features.

---

### Decyzja #3 — Wybór które 2 miejsca per dzielnica (v2.1.376 INTERIM)

**Pytanie**: Które miejsca najlepsze do impl w autonomic session (najmniejsza komplikacja, max value)?

**Mój wybór**: Underground (Smolarnia + Piwnica), Coast (SPA + Marina), Business (Steakhouse + Bank VIP).

**Uzasadnienie**: prostsze niż MG, analog do existing actions.

**Wpływ**: każda dzielnica dostaje 1 chillout + 1 reward action w overlay.

**Status**: ✅ Zrealizowane w v2.1.376 caca179. **ALE PRZESTARZAŁE** — user 2026-05-28 03:XX dodał wymóg żeby dzielnice były **fizycznymi mapami** (open world), nie overlay. Patrz Decyzje #4-#7 niżej.

---

## 📌 NOWE WYMAGANIA USERA (2026-05-28 03:XX — przed snem)

User explicit:
1. **Underground/Coast/Business jako nowe mapy** — gracz po przejściu bramy pojawia się na nowej mapie i może wrócić bramą. Każda charakterystyczna, bardzo wyróżniająca się. Open world, NIE przycisk "wejdź" w overlay.
2. **Drzewko umiejętności** — niektóre nie działają / niezbalansowane. NIE zmieniać prędkości/mnożników/capa. Po ewolucji gracz nie widzi co daje. **Inwestycje** wydaje się nie działać lub jest bardzo słabe (gracze nie czują różnicy).
3. **Potrącenie przez samochód spektakularne**: odrzut minimalnie większy + smooth + lekki błysk czerwonego ekranu + spowolnienie 2s→3s + mocniejsze spowolnienie.
4. **Prędkość gracza wolniej bez powodu** — regresja, wraca wolniej "z czasem". NIE zmieniać capa/mnożnika/etc. — tylko bug fix.

### Decyzja #4 — Underground/Coast/Business jako fizyczne mapy

**Pytanie**: Implementacja jako overlay (v2.1.376) czy nowe mapy?

**Mój wybór**: **Nowe mapy** zgodnie z user explicit. Overlay v2.1.376 staje się **legacy** — zachowuję jako fallback button "Przejdź do dzielnicy" dla gracze którzy nie chcą się przemieszczać, ale main flow = przejście bramą → nowa mapa.

**Uzasadnienie**:
- User explicit "ma być open world, nie przycisk wejdź"
- Każda dzielnica ma być charakterystyczna (visualna identity)
- Bramka teraz: gracz interakcją [E] → roomFade → teleport do `ROOMS.underground` / `ROOMS.coast` / `ROOMS.business`
- W każdej dzielnicy: small map (np. 25×20 tiles = 1200×960 px), powrót bramą do `ulica`

**Wpływ**:
- 3 nowe `ROOMS.*` entries z map + objects + drogi
- Każda dzielnica: charakter (Underground = czarne ulice, neony, graffiti / Coast = piasek, palmy, ocean / Business = wieżowce, asfalt premium)
- Cinematic transition po pierwszym wejściu
- Gracz może wracać → znalezione mechaniki + miejsca zachowane

**Alternatywa**: Zachować overlay v2.1.376 jako tylko UI — user explicit odrzucił.

### Decyzja #5 — Skill tree audit scope

**Pytanie**: Które skille audytować (NIE zmieniać speed/mult/cap)?

**Mój wybór**: Audit **Inwestycje skill** (priority — user explicit "nie działa lub bardzo słabe") + Add evolution tooltips (po ewolucji co daje) + Audit innych skilli pod kątem realnego efektu.

**Uzasadnienie**: User specific complaint o Inwestycje. Plus brak tooltipu ewolucji to UX issue.

**Wpływ**: gracze widzą efekty skilli + Inwestycje faktycznie buff'uje bank ROI.

### Decyzja #6 — Car hit visual improvements

**Pytanie**: Jak zaimplementować spektakularne potrącenie?

**Mój wybór**:
- Odrzut +50% (np. było 30px → 45px)
- Smooth ease-out (zamiast skoku linear)
- Red flash screen ~200ms (semi-transparent fade)
- Slowdown 2s → 3s
- Slowdown multiplier silniejszy (np. 0.5x → 0.35x speed)

**Uzasadnienie**: user explicit specs.

### Decyzja #7 — Speed bug regresja

**Pytanie**: Co powoduje regression spadku prędkości "bez powodu"?

**Mój wybór**: Investigation first — sprawdzić wszystkie miejsca modyfikujące P.spd lub speed multipliers. Szukać miejsc gdzie set without reset.

**Uzasadnienie**: User explicit "NIE zmieniać capa/mnożnika/etc." — to bug fix, nie balans.

**Wpływ**: gracz nie traci speed without cause.

---

## 📋 Plan TIER 5 v2 (po nowych wymaganiach 2026-05-28 03:XX)

Order priorytet:
- **Faza AH** Speed bug regresja (#4) — SHORT investigation
- **Faza AG** Car hit spectacular (#3) — MEDIUM visual + multiplier
- **Faza AF** Skill tree audit + tooltips (#2) — MEDIUM
- **Faza B' / C' / D'** New maps Underground/Coast/Business (#1) — DUŻA, każda osobno
- **Faza F** Auto-weryfikacja + deep audit

---


