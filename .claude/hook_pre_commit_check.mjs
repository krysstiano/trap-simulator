#!/usr/bin/env node
/* Hook: PreToolUse przed Bash gdy command zawiera "git commit".
 * Wyświetla checklist post-impl: czy zrobiłem #3 (grep wszystkich miejsc), #9 (runtime test), #2 (syntax check).
 * Niezatrzymujący (exit 0) — to PRZYPOMNIENIE, nie blokada.
 */
import fs from 'fs';

let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch (e) { process.exit(0); }

let payload;
try { payload = JSON.parse(input); } catch (e) { process.exit(0); }

const toolInput = payload?.tool_input || {};
const command = toolInput.command || '';

// Tylko dla git commit (nie git status, log, diff)
if (!command.includes('git commit')) {
  process.exit(0);
}

const reminder = `
⚠️  PRE-COMMIT REMINDER (hook_pre_commit_check.mjs):

PRZED git commit upewnij się że zrobiłeś:
   □ ŻELAZNA #2: syntax check (extract JS + node --check _syntax_check.js) — auto-hook to sprawdza po Edit, ale upewnij się że nie ma zaległych
   □ ŻELAZNA #3: POST-impl grep WSZYSTKICH miejsc dla zmiany (UI/opisy/storyline/hints/achievementy/SMS/dialogi/mapa/save keys/PATCH_NOTES/tutorial/cinematic/telefon/NPC dialogi/smart hints)
   □ ŻELAZNA #6: grep KAŻDEJ analog feature (jeśli dodałeś nowy NPC/car/outfit/apartment → 8-15 miejsc)
   □ ŻELAZNA #9: Runtime test (dbg_*.mjs lub page.evaluate) — czy PASS? Jeśli nie test, commit tylko jeśli to dokumentacja/refactor/no-logic-change
   □ ŻELAZNA #10: NIGDY commit przy <100% PASS (jeśli test FAIL — najpierw napraw)
   □ ŻELAZNA #11: jeśli zmieniłeś balans — czy nie ma "wrażenia odbierania" (soft compression smooth, nie hard cap)
   □ ŻELAZNA #12: atomic commit — czy commit zawiera 1 logiczną zmianę (nie 3 osobne zmiany splecione)
   □ ŻELAZNA #14: jeśli zmieniłeś wartość/pozycję/stawkę/nazwę — pre-impl audit zrobiony PRZED edycją?
   □ PATCH_NOTES — czy dopisany wpis v2.1.X opisujący zmianę?

Jeśli któryś punkt NIE → zatrzymaj commit, dokończ, dopiero potem commituj.

Pełne reguły: CLAUDE.md.
`;

process.stderr.write(reminder);
process.exit(0);
