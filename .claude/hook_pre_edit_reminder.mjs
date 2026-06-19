#!/usr/bin/env node
/* Hook: PreToolUse przed Edit/Write/MultiEdit na index.html.
 * Wyświetla mi skrót reguł żelaznych #3, #6, #14 + checklist pre-impl.
 * Niezatrzymujący (exit 0) — to PRZYPOMNIENIE, nie blokada.
 * Hook output trafia do moich oczu zanim wykonam Edit — wymusza świadomość reguł.
 */
import fs from 'fs';

let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch (e) { process.exit(0); }

let payload;
try { payload = JSON.parse(input); } catch (e) { process.exit(0); }

const toolInput = payload?.tool_input || {};
const filePath = toolInput.file_path || '';

// Tylko dla index.html w Snowy Simulator
if (!filePath.endsWith('index.html') || !filePath.includes('Snowy Simulator')) {
  process.exit(0);
}

// Wypisz przypomnienie do stderr (widoczne dla mnie, nie wpływa na tool input)
const reminder = `
⚠️  PRE-EDIT REMINDER (hook_pre_edit_reminder.mjs) — przed edytowaniem index.html:

🔴 ŻELAZNA #14 (PRE-impl audit) — jeśli zmieniasz WARTOŚĆ/POZYCJĘ/STAWKĘ/NAZWĘ/WYMÓG:
   □ Grep starej wartości w całym kodzie
   □ Grep analogów (np. mansion → apt_premium)
   □ Lista 14 obszarów: UI/opisy/storyline/hints/achievementy/SMS/dialogi/mapa/save keys/PATCH_NOTES/tutorial/cinematic/telefon/NPC dialogi
   □ Test mentalny ścieżką gracza

🔴 ŻELAZNA #6 (DONE = grep analog feature) — jeśli dodajesz NPC/car/outfit/apartment/genre/mechaniki:
   □ Grep wszystkie istniejące analogi
   □ Sprawdź 8-15 miejsc gdzie analogi są zarejestrowane

🔴 ŻELAZNA #13 (Plan ≠ stan kodu) — jeśli implementujesz feature z planu:
   □ Grep nazwy feature → już istnieje? BLOCKED + skip

🔴 ŻELAZNA #5 (NIE zgaduj — weryfikuj) — przed napisaniem liczby/formuły:
   □ Grep/Read aktualną wartość w kodzie

🔴 POST-impl czeka żelazna #3 (grep WSZYSTKICH miejsc) + #2 (syntax check, hook auto-uruchomi).

Pełne reguły: CLAUDE.md (E:/Snowy Simulator/CLAUDE.md) + PLAN_NOC_2026-05-24.md.
`;

process.stderr.write(reminder);
process.exit(0); // exit 0 = niezablokowane, tylko przypomnienie
