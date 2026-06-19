# PLAN_SECTION_TEMPLATE — Szablon entry w PLAN_PROGRESS.md

**Cel:** Wymusza wypełnienie WSZYSTKICH pól przy starcie sekcji. Nigdy nie zapomnę o czymś istotnym.

---

## 📋 SZABLON DO KOPIOWANIA

Kopiuj cały blok poniżej do `PLAN_PROGRESS.md` przy starcie nowej sekcji:

```markdown
#### [NUMER]. [NAZWA SEKCJI] (PLAN_SESJA.md linia [Y])

##### 📊 Status
- Status: 🟡 IN PROGRESS
- Started: [YYYY-MM-DD HH:MM]
- Closed: —
- Estimated time: [małe / średnie / duże = 1h / 4h / 8h+]
- Actual time: —

##### 📝 Cytat użytkownika (verbatim z PLAN_SESJA.md)
> "..."

##### 🗺 Dry-run szkic (PRZED kodem!)
1. Zmienię funkcję X (linia 12345) — dodam Y
2. Stworzę nową funkcję Z w linii 6789
3. Zaktualizuję strukturę W przez Q
4. Test akceptacyjny: napiszę dbg_xxx.mjs który sprawdzi A, B, C

##### 🎯 Powiązania międzysekcyjne (z PLAN_DEPENDENCIES.md)
- ⚠️ MUSI BYĆ PO: [sekcja X]
- ⚠️ MUSI BYĆ PRZED: [sekcja Y]
- 🔗 Wpływa na: [sekcja Z]

##### 🛡 Risk register (top 3 ryzyka)
1. **Ryzyko A:** [opis] → Mitygacja: [jak]
2. **Ryzyko B:** [opis] → Mitygacja: [jak]
3. **Ryzyko C:** [opis] → Mitygacja: [jak]

##### 🔄 Anti-pattern check (z PLAN_ANTIPATTERNS.md)
- [ ] AP-001 (cytat): mapping 1:1 zrobione?
- [ ] AP-004 (position:fixed): wszystkie modale w document.body?
- [ ] AP-005 (z-order): ruchome PO statycznych?
- [ ] AP-006 (wx vs sx): używam wx dla "stałego"?
- [ ] AP-007 (diagonal): normalizacja √2?
- [ ] AP-009 (OP wartości): max kumulatywne <40%?
- [ ] AP-019 (migracja save): zmiana struktury G ma migrację?

##### 📦 Backup
- [ ] `cp index.html index_backup_[sekcja]_[data].html`

##### 📸 Screenshots PRZED (Playwright)
- [ ] `node dbg_xxx.mjs` → `_visual_diffs/[sekcja]/before.png`

##### ⏱ Time-box
- Limit: [Xh]
- Po przekroczeniu: STOP, raport "utknąłem na Y", reassess

##### ✅ Test akceptacyjny (1:1 z PLAN_SESJA.md)
- [ ] Punkt 1: ...
- [ ] Punkt 2: ...
- [ ] Punkt 3: ...
- [ ] Punkt 4: ...

##### 🎨 Cytat zmapowany 1:1 (po implementacji)
- "fragment A" → ✅/❌ [konkretna zmiana w linii X]
- "fragment B" → ✅/❌ [konkretna zmiana w linii Y]
- "fragment C" → ✅/❌ [konkretna zmiana w funkcji Z]

##### 📦 Sub-commits (atomic)
- [ ] `commit 1: ...`
- [ ] `commit 2: ...`
- [ ] `commit 3: ...`

##### 🟢 Smoke regression (po implementacji)
- [ ] `node _run_smoke.mjs` → ALL PASS

##### 📸 Screenshots PO (Playwright) + visual diff
- [ ] `node dbg_xxx.mjs` → `_visual_diffs/[sekcja]/after.png`
- [ ] Diff side-by-side w `_visual_diffs/[sekcja]/diff.png`

##### 📝 PATCH_NOTES (przyjazny język gracza!)
- [ ] Wpis dopisany w `index.html`
- [ ] Język bez hex/koord/regex/drawXxx()

##### 🧠 Memory check
- [ ] Sprawdzono MEMORY.md — żadna reguła nie naruszona
- [ ] Sprawdzono PLAN_DECISIONS.md — wartości spójne
- [ ] Sprawdzono PLAN_GLOSSARY.md — terminy poprawne

##### 🐛 Bugs found
- [opis bugu jeśli znalezione]

##### ❓ Open questions for user
- [pytanie jeśli pojawi się ambivalencja → AskUserQuestion]

##### 📊 Final status
- [ ] **Wszystkie 6 punktów protokołu PASS** → DONE
- LUB
- [ ] **Status NIEKOMPLETNE** — raport: [co działa, co nie, dlaczego, hipotezy]

##### 🔍 Retrospektywa (5 pytań)
1. **Co poszło dobrze?** ...
2. **Co poszło źle?** ...
3. **Czy dry-run był dokładny?** ...
4. **Czy znalazłem nieprzewidziane bugi?** ...
5. **Co wniosę do następnej sekcji?** ...
```

---

## 📚 INSTRUKCJA UŻYCIA

1. **Start sekcji** → uruchom `node _start_section.mjs [nazwa]` (zrobi backup, screenshot before, otworzy szablon)
2. **Wypełnij blok PRZED kodem:**
   - Cytat verbatim (skopiuj z PLAN_SESJA.md)
   - Dry-run szkic (5-10 zdań co konkretnie zrobię)
   - Powiązania (sprawdź PLAN_DEPENDENCIES.md)
   - Risk register (3 ryzyka)
   - Anti-pattern check (sprawdź PLAN_ANTIPATTERNS.md)
   - Time-box (rozsądny limit)
3. **Implementuj** — atomic commits per checkbox
4. **Po każdym commit:**
   - Zaktualizuj checkbox
   - Mini-test
5. **Pod koniec:**
   - Smoke regression (`_run_smoke.mjs`)
   - Screenshot after + diff
   - Cytat zmapowany 1:1
   - PATCH_NOTES
   - Memory check
6. **Zamknięcie sekcji** → uruchom `node _close_section.mjs [nazwa]` (sprawdzi 6 wymagań)
7. **Retrospektywa** — 5 pytań
8. **Status** → DONE lub NIEKOMPLETNE z raportem
