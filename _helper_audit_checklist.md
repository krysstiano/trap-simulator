# Helper: Per-faza Audit Checklist Template

**Used by**: autonomic /loop, każda faza Etap 1/2 PRZED declare DONE.

## PRE-impl (reguły #13 + #14)
- [ ] Grep nazwy/wartości feature — czy NIE istnieje już.
- [ ] Grep analogie (8-15 miejsc per zmiana wartości/pozycji/stawki/nazwy).
- [ ] Read kod analog feature dla pattern reuse.
- [ ] Memory check (`MEMORY.md`) — czy feedback dotyczy tego obszaru.
- [ ] Save schema impact assessment (NIE łamać save'ów graczy — reguła #1).

## Implementacja (reguły #2, #4, #12)
- [ ] Atomic per element (1 logiczna zmiana per commit).
- [ ] Edit/Write (NIE PowerShell na index.html — reguła #4).
- [ ] Syntax check automatyczny przez hook PostToolUse.

## POST-impl audit szeroki (reguła #3 — 14 obszarów)
- [ ] **UI** — interfejs gracza.
- [ ] **Opisy** — tooltip/help text.
- [ ] **Storyline** — STORYLINE_QUESTS / SIDE_STORYLINES.
- [ ] **Hints** — SMART_HINTS array.
- [ ] **Achievementy** — ACHIEVEMENTS array + tier rewards.
- [ ] **SMS** — _smsTriggerOnce milestones.
- [ ] **Dialogi NPC** — NPC_DATA / DIALOG_TREES.
- [ ] **Mapa** — ROOMS.X.objects.
- [ ] **Save keys** — resetG defaults + loadGame defensive init.
- [ ] **PATCH_NOTES** — wpis dla wersji.
- [ ] **Tutorial** — TUTORIAL_STEPS jeśli relevant.
- [ ] **Cinematic** — taglines, showMilestoneCinematic presets.
- [ ] **Telefon panele** — apka folder + button.
- [ ] **Smart hints** — gates _hintShown_X.

## Analog feature audit (reguła #6)
- [ ] Grep KAŻDEJ analog feature — sprawdź 8-15 miejsc.
- [ ] Per finding: czy spójne z nową zmianą.

## Overlap audit (reguła #8 ZERO TOLERANCE)
**TYLKO dla nowych obiektów wizualnych:**
- [ ] Użyj `_helper_overlap_check.mjs` — sprawdź vs DB_DECORATIVE + budynki + chodniki + drogi.
- [ ] Conflicts === 0 mandatory.

## Runtime test (reguła #9)
- [ ] Playwright dbg_*.mjs lub page.evaluate() z asercją.
- [ ] PASS tylko gdy expected === actual.

## Round 2 "na pewno done?" (reguła #18) — MANDATORY 2-3 rundy
- [ ] **Re-grep UI promise vs code reality** — czy obietnica = implementacja.
- [ ] **Save compat defensive init** — wszystkie nowe pola w resetG + loadGame.
- [ ] **Cap-ladder-ghost check** — czy nie powstały floor caps zakryte upgrades.
- [ ] **Misleading text scan** — opisy zgodne z faktycznymi wartościami.
- [ ] **Analogi check** — 8-15 miejsc znowu (reguła #6).
- [ ] **Click=reward audit** (per Wymóg 6 Etap 1) — czy nowa akcja wymaga gracza, NIE tylko click.
- [ ] **Balans audit** (reguła #11) — gładka pochodna, monotonicznie rosnąca, brak hard cap.
- [ ] **Ghost feature audit** — czy nowy element ma REAL wpływ na grę.

**Zero findings → DONE.** Jeśli findings → fix + Round 3 audit.

## DONE criteria (reguła #10 — NIGDY DONE przy <100% PASS)
- [ ] Wszystkie powyższe checkboxy ✅.
- [ ] Atomic commit z opisem (NIE batch wielu zmian).
- [ ] Update plan status (PENDING → DONE + commit hash + notes).
- [ ] Update decision log (jeśli były decyzje samodzielne).
- [ ] ScheduleWakeup 60s (default) / 90-120s (po DUŻEJ fazie).

## Final integration (po wszystkich fazach Etap)
- [ ] Auto-weryfikacja (reguła #16) — re-grep wszystkich nazw z fazy.
- [ ] Głęboki audyt (reguła #17) — bugs/ghosts/exploit/misleading UI/dead code.
- [ ] Regression test (load save → wszystko działa).
