// _close_section.mjs — Auto sprawdzenie 6 wymagań protokołu zamykania sekcji
// Użycie: node _close_section.mjs "NAZWA SEKCJI"
//
// Co sprawdza:
// 1. Smoke regression PASS
// 2. Visual diff folder ma before.png i after.png
// 3. PATCH_NOTES — checkpoint manualnie
// 4. Memory check — checkpoint manualnie
// 5. Cytat zmapowany — checkpoint manualnie
// 6. Powiązane sekcje — checkpoint manualnie

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sectionName = process.argv[2];

if (!sectionName) {
  console.error('❌ Użycie: node _close_section.mjs "NAZWA SEKCJI"');
  process.exit(1);
}

const safeName = sectionName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
const vdPath = path.join(__dirname, '_visual_diffs', safeName);

console.log('='.repeat(70));
console.log(`🔒 CLOSE SECTION: ${sectionName}`);
console.log(`   PROTOKÓŁ 6 WYMAGAŃ`);
console.log('='.repeat(70));

const checks = [];

// CHECK 1: Smoke regression
console.log(`\n[1/6] 🟢 Smoke regression — uruchamiam _run_smoke.mjs...`);
const smokeResult = await new Promise((resolve) => {
  const proc = spawn('node', [path.join(__dirname, '_run_smoke.mjs')], {
    cwd: __dirname,
    stdio: 'inherit',
  });
  proc.on('close', (code) => resolve(code === 0));
  proc.on('error', () => resolve(false));
});
checks.push({ name: 'Smoke regression', pass: smokeResult });

// CHECK 2: Visual diffs (lub _NOT_VISUAL.md placeholder dla sekcji logicznych)
console.log(`\n[2/6] 📸 Visual diff — sprawdzam ${vdPath}...`);
let visualPass = false;
if (fs.existsSync(vdPath)) {
  const files = fs.readdirSync(vdPath);
  const hasBefore = files.some(f => f.startsWith('before'));
  const hasAfter = files.some(f => f.startsWith('after'));
  const hasNotVisual = files.includes('_NOT_VISUAL.md');
  if (hasBefore && hasAfter) {
    visualPass = true;
    console.log(`✅ before.png + after.png present`);
  } else if (hasNotVisual) {
    visualPass = true;
    console.log(`✅ _NOT_VISUAL.md — sekcja niewizualna (visual diff N/A)`);
  } else {
    console.log(`❌ Brak: ${!hasBefore ? 'before.png ' : ''}${!hasAfter ? 'after.png' : ''}`);
    console.log(`   (Jeśli sekcja niewizualna — utwórz _NOT_VISUAL.md w ${vdPath})`);
  }
} else {
  console.log(`❌ Folder _visual_diffs/${safeName} nie istnieje (start_section.mjs nie był uruchomiony?)`);
}
checks.push({ name: 'Visual diff PRZED/PO', pass: visualPass });

// CHECK 3: PATCH_NOTES — manualny
console.log(`\n[3/6] 📝 PATCH_NOTES — MANUALNE potwierdzenie:`);
console.log(`   Czy dopisałeś wpis do PATCH_NOTES w index.html?`);
console.log(`   Czy język jest przyjazny dla gracza (bez hex/koord/regex/drawXxx)?`);
console.log(`   → odpowiedz w raporcie końcowym`);
checks.push({ name: 'PATCH_NOTES', pass: 'MANUAL' });

// CHECK 4: Memory check — manualny
console.log(`\n[4/6] 🧠 Memory check — MANUALNE potwierdzenie:`);
console.log(`   Sprawdziłeś MEMORY.md? PLAN_DECISIONS.md? PLAN_GLOSSARY.md?`);
console.log(`   Czy żadna reguła nie naruszona?`);
console.log(`   → odpowiedz w raporcie końcowym`);
checks.push({ name: 'Memory check', pass: 'MANUAL' });

// CHECK 5: Cytat zmapowany — manualny
console.log(`\n[5/6] 🎨 Cytat zmapowany 1:1 — MANUALNE potwierdzenie:`);
console.log(`   Czy każde zdanie cytatu użytkownika ma przypisaną konkretną zmianę?`);
console.log(`   Sprawdź entry w PLAN_PROGRESS.md`);
console.log(`   → odpowiedz w raporcie końcowym`);
checks.push({ name: 'Cytat mapping 1:1', pass: 'MANUAL' });

// CHECK 6: Powiązane sekcje — manualny
console.log(`\n[6/6] 🔗 Powiązane sekcje — MANUALNE potwierdzenie:`);
console.log(`   Sprawdziłeś PLAN_DEPENDENCIES.md?`);
console.log(`   Czy nie zepsułeś sekcji powiązanych?`);
console.log(`   → odpowiedz w raporcie końcowym`);
checks.push({ name: 'Powiązane sekcje', pass: 'MANUAL' });

// SUMMARY
console.log(`\n${'='.repeat(70)}`);
console.log(`📊 PODSUMOWANIE PROTOKOŁU 6 WYMAGAŃ`);
console.log('='.repeat(70));
for (const [i, c] of checks.entries()) {
  const symbol = c.pass === true ? '✅' : c.pass === false ? '❌' : '⚠️ MANUAL';
  console.log(`   [${i + 1}/6] ${symbol} ${c.name}`);
}

const autoFails = checks.filter(c => c.pass === false).length;
const manualPending = checks.filter(c => c.pass === 'MANUAL').length;

console.log(`\n📈 STATS:`);
console.log(`   Auto-checked PASS: ${checks.filter(c => c.pass === true).length}`);
console.log(`   Auto-checked FAIL: ${autoFails}`);
console.log(`   Manual confirmations needed: ${manualPending}`);

if (autoFails > 0) {
  console.log(`\n❌ STATUS: NIEKOMPLETNE — auto-checks FAIL`);
  console.log(`   Napraw issues przed oznaczeniem sekcji jako DONE`);
  console.log(`   Update PLAN_PROGRESS.md → status: ❌ NIEKOMPLETNE + raport`);
  process.exit(1);
} else {
  console.log(`\n✅ AUTO-CHECKS PASS — pozostaje ${manualPending} manualnych potwierdzeń`);
  console.log(`\n📋 Zanim oznaczysz sekcję jako DONE w PLAN_PROGRESS.md:`);
  console.log(`   1. Potwierdź ręcznie 4 manualne checki`);
  console.log(`   2. Wypełnij retrospektywę 5 pytań`);
  console.log(`   3. Update PLAN_PROGRESS.md → status: ✅ DONE`);
  console.log(`   4. Update PLAN_LOG.md (krótki wpis sesji)`);
  console.log(`   5. Update PLAN_DECISIONS.md jeśli były nowe wartości balansowe`);
  console.log(`   6. Update PLAN_ANTIPATTERNS.md jeśli wykryłeś nowy AP`);
  console.log(`\n${'='.repeat(70)}\n`);
}
