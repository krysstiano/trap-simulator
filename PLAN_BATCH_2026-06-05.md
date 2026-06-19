# PLAN — pozostałe z batcha (2026-06-05)

Wielki batch usera. Część zrobiona (v799–802), **5 punktów zostało**. Każdy: kod → syntax check → runtime test → commit → Round 2 audit (reguły #9/#10/#18).

## ✅ Zrobione + zacommitowane
- **v799** `81250ca` — LSD/Ecstasy heat sprzedaż (+8/+7); konsumpcja „brak produktu" (system OK, jaśniejszy komunikat + nota); rolowanie≠pakowanie (sekwencja); buy-finished = tylko składniki (OK); heat wyjaśniony.
- **v800** `f1eb1bb` — login czeka na koniec przelotu kamerą (był bug: zasłaniał); community-prompt nie koliduje (poll z guardami).
- **v801** `66267d4` — samolocik szybszy start (blend liniowy); rekordy kasyna zweryfikowane (metryki mult/total OK, nick+avatar+TOP1+alerty działają).
- **v802** `df51214` — okno logowania nie zlewa się (widget „Twój cel" chowa się podczas modali).

## ⏳ Zostało (kolejność 1→5)

**1. Liczniki kasyna — sesja + overall na KAŻDEJ grze**
Jak na slotach: licznik sesji (gier w tej sesji) + overall (łącznie, w SAVE, per-save, nie kasuje się).
- Dodać `_casinoCountPlay(game)` → `G.casinoRecords[game].games` (overall) + `_casinoSessionGames={}` (session, reset on load).
- Wpiąć w ~16 funkcji `_xStart(bet)` (każda ma `G.casinoChips-=bet`): hilo/mines/crash/plane/horse/peng/dragon/sicbo/coin/rwheel/roulette/slots/war/plinko/craps/wheel + blackjack/baccarat/keno/limbo/skarbiec/bus.
- Display: dodać do `_casinoTop1Banner` (pokaże na każdej grze).

**2. Szafka/magazyn zaopatrzenia pracowników**
Pracownicy mają mieć szafkę ze składnikami; gracz kupuje/uzupełnia żeby pracowali.
- UWAGA: gardener→stash→chemik to łańcuch; osobny worker-supply go zepsuje. Rozważ widoczny panel/szafkę zaopatrzenia (poziomy + zużycie + restock) na wspólnym stashu, albo osobne tylko seeds/krysztal/prosz/chem (nie traw).

**3. Balans narkotyków (Monte Carlo)**
Nie za mało za wysiłek, nie złamane. Sprawdź: jakość (qMult), LSD/Ecstasy, pasyw pracowników vs muzyka (~15-18k/dzień). Własny node-probe.

**4. Łapka — większa nieprzewidywalność + korona nie złamana**
`openLoginClawGame`. Większe wariacje, sprawdź że korona OK.

**5. Deep audity wszystkich obszarów** (trap/casino/onboarding/uprawa/lab/pracownicy/jakość + powiązane).

> Szczegóły + lokalizacje linii: memory `project_snowy_pending_batch_2026_06_05`.
