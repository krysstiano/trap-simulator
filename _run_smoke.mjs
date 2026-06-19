// _run_smoke.mjs — Regression suite. Uruchamia kluczowe smoke testy po każdej sekcji.
// Wymóg w protokole zamykania sekcji: WSZYSTKIE muszą PASS.
// Użycie: node _run_smoke.mjs

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lista smoke testów — każdy musi PASS
const SMOKE_TESTS = [
  'dbg_start.mjs',          // czy gra w ogóle startuje
  'dbg_park.mjs',           // park (NPC, ławka, fontanna)
  'dbg_silownia.mjs',       // siłownia (krytyczne dla forma/kondycja)
  'dbg_skill_tree.mjs',     // drzewko umiejętności
  'dbg_hud_audit.mjs',      // HUD layout
  'dbg_tooltip_2560.mjs',   // rozdzielczość 2560×1440 (memory rule!)
  'dbg_all_buildings.mjs',  // wszystkie budynki widoczne
  'dbg_all_npc.mjs',        // wszyscy NPC poprawnie
  'dbg_cinematic_antifreeze.mjs', // anti-freeze guard działa (5 scenariuszy)
  'dbg_max_stat.mjs',             // getMaxStat + clampStat (forma/kondycja 100 = +10/+20)
  'dbg_skills_migration.mjs',     // G.skills migracja number → object + helpers (9 scenariuszy)
  'dbg_silownia_freeze.mjs',      // anti-freeze siłowni (bug lx/ly fixed)
  'dbg_stroje_treningowe.mjs',    // stroje treningowe sport/pro (+20%/+25% + extra sesje)
  'dbg_forma_energy_kondycja_health.mjs', // delikatne mechaniki forma→energy, kondycja→health
  'dbg_milestone_forma_kondycja.mjs',     // cinematic milestone + max +10 przy 100 formy/kondycji
  'dbg_gym_decay_sms.mjs',                // mechanika "use it or lose it" + Gym Bro SMS
  'dbg_cinematic_silownia_3.mjs',         // 3 cinematici silowni (#1 tutorial, #2 milestone, #3 comeback)
  'dbg_powerups_evolution.mjs',           // drzewko: power-ups (3 etapy) + evolution (1 unique)
  'dbg_nowe_skills.mjs',                  // 20 nowych skills (Intelekt, Ekonomia, Styl, Fizyczne)
  'dbg_skills_efekty.mjs',                // F3-FIX: faktyczne efekty 14 nowych skills (helpers + integracja)
  'dbg_evolution_efekty.mjs',             // F3-FIX-B: hierarchia skill < PU < Evo + hidden + nazwy
  'dbg_drzewko_pelen_audyt.mjs',          // F3-AUDYT: PEŁNE testy WSZYSTKIE skills (75 assertions)
  'dbg_admin_panel.mjs',                  // F5.2: Admin Panel — wszystkie nowe akcje + przyciski (21 assertions)
  'dbg_spotify_verify.mjs',               // F5.3: Spotify — system weryfikacji artysty (3 etapy, 20 assertions)
  'dbg_outfit_palette.mjs',               // F5.4 E2: paleta kolorów per outfit (20 assertions)
  'dbg_outfit_e3.mjs',                    // F5.4 E3: 5 nowych outfitów (polo/jeansowa/zimowa/smoking/designer_concert)
  'dbg_outfit_e4.mjs',                    // F5.4 E4: szafa UI z sekcjami + mini-podgląd canvas (18 assertions)
  'dbg_npc_crosswalk.mjs',                // F6 E2: NPC przechodzą przez crosswalk gdy peds=green
  'dbg_random_events_audit.mjs',          // Random Events: kontekst lokacji (ulica/mieszk/studio/silownia)
  'dbg_speed_health_audit.mjs',           // Regresja: P.spd niezależne od G.health/G.energy
  'dbg_lamps_validation.mjs',             // Lampy: na chodnikach + brak nakładania SPECIAL/street
];

function runTest(file) {
  return new Promise((resolve) => {
    const fullPath = path.join(__dirname, file);
    const proc = spawn('node', [fullPath], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => stdout += d.toString());
    proc.stderr.on('data', d => stderr += d.toString());
    const timeout = setTimeout(() => {
      proc.kill();
      resolve({ file, ok: false, code: 'TIMEOUT', stderr: 'killed after 60s' });
    }, 60000);
    proc.on('close', (code) => {
      clearTimeout(timeout);
      resolve({ file, ok: code === 0, code, stdout: stdout.slice(-500), stderr: stderr.slice(-500) });
    });
    proc.on('error', (err) => {
      clearTimeout(timeout);
      resolve({ file, ok: false, code: 'ERROR', stderr: err.message });
    });
  });
}

console.log('='.repeat(70));
console.log('SMOKE REGRESSION SUITE');
console.log('='.repeat(70));

let pass = 0, fail = 0;
const failures = [];

for (const test of SMOKE_TESTS) {
  process.stdout.write(`▶ ${test}... `);
  const result = await runTest(test);
  if (result.ok) {
    console.log('✅ PASS');
    pass++;
  } else {
    console.log(`❌ FAIL (code=${result.code})`);
    failures.push(result);
    fail++;
  }
}

console.log('='.repeat(70));
console.log(`RESULTS: ${pass} PASS / ${fail} FAIL (total ${SMOKE_TESTS.length})`);
console.log('='.repeat(70));

if (failures.length > 0) {
  console.log('\n🔴 FAILURES:');
  for (const f of failures) {
    console.log(`\n--- ${f.file} ---`);
    if (f.stderr) console.log('STDERR:', f.stderr);
    if (f.stdout) console.log('STDOUT (last 500):', f.stdout);
  }
  process.exit(1);
}

console.log('\n✅ All smoke tests PASS — no regressions detected.');
process.exit(0);
