#!/usr/bin/env node
/* Hook: UserPromptSubmit → auto-doładuje PLAN_NOC + skrót 14 żelaznych reguł
 * do kontekstu na początku każdej iteracji (np. /loop wybudzenia).
 *
 * Output (stdout) zostaje dołączony do system prompt iteracji.
 * Wymusza ŻELAZNĄ REGUŁĘ #13 (CLAUDE.md): plan ≠ stan kodu, czytaj PLAN przed implementacją.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(__dirname); // .claude/ → projekt

let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch (e) { process.exit(0); }

let payload;
try { payload = JSON.parse(input); } catch (e) { process.exit(0); }

const userPrompt = (payload?.prompt || '').toLowerCase();

/* v3 (2026-05-27): ZAWSZE wstrzykuj CLAUDE.md (wzmocnienie A — 100% gwarancja regul w kontekscie).
 * PLAN_DZIELNICE jest aktualnym PRIORYTETEM (user 2026-05-27); PLAN_NOC reference background.
 * Plan files dorzucane tylko przy trigger words (zeby nie zaspamowac kontekstu poza /loop). */
const triggerWords = ['kontynuuj', 'snowy', 'plan_noc', 'plan_dzielnice', 'dzielnice', 'wracamy do pracy', 'wracamy'];
const shouldInjectPlan = triggerWords.some(w => userPrompt.includes(w));

const planDzielnicePath = path.join(projectRoot, 'PLAN_DZIELNICE_2026-05-26.md');
const planNocPath = path.join(projectRoot, 'PLAN_NOC_2026-05-24.md');
const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

let output = '\n\n=== AUTO-INJECTED CONTEXT (hook_load_plan_noc) ===\n\n';

if (fs.existsSync(claudeMdPath)) {
  try {
    const claudeMd = fs.readFileSync(claudeMdPath, 'utf8');
    output += '## Z CLAUDE.md (auto-loaded):\n\n';
    output += claudeMd.trim() + '\n\n';
  } catch (e) { /* ignore */ }
}

if (shouldInjectPlan) {
  /* PRIORYTET: PLAN_DZIELNICE (aktywny plan 2026-05-27). PLAN_NOC reference background. */
  if (fs.existsSync(planDzielnicePath)) {
    try {
      const plan = fs.readFileSync(planDzielnicePath, 'utf8');
      output += '## Z PLAN_DZIELNICE_2026-05-26.md (PRIORYTET, auto-loaded — szukaj fazy PENDING wg TIER 1-7):\n\n';
      output += plan + '\n\n';
    } catch (e) { /* ignore */ }
  }
  /* PLAN_NOC ladujemy tylko gdy user explicit pyta o NOC, zeby nie zaspamowac kontekstu */
  const wantsNoc = userPrompt.includes('plan_noc') || userPrompt.includes('noc');
  if (wantsNoc && fs.existsSync(planNocPath)) {
    try {
      const plan = fs.readFileSync(planNocPath, 'utf8');
      output += '## Z PLAN_NOC_2026-05-24.md (reference background — workflow + audit mode + Faza R2 procedura):\n\n';
      output += plan + '\n\n';
    } catch (e) { /* ignore */ }
  }
}

output += '=== END AUTO-INJECTED ===\n\n';
output += 'UWAGA: Reguly 1-18 sa ZELAZNE (w tym #18 "Na pewno done?" = 2-3 rundy Round 2 audit przed declare DONE). NIGDY "wait user" w /loop. PRIORYTET: PLAN_DZIELNICE_2026-05-26. Workflow + Audit Mode + Faza R2 w PLAN_NOC_2026-05-24.\n';

process.stdout.write(output);
process.exit(0);
