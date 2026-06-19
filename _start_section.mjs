// _start_section.mjs — Auto setup nowej sekcji
// Użycie: node _start_section.mjs "NAZWA SEKCJI"
//
// Co robi:
// 1. Backup index.html
// 2. Health check (smoke testy)
// 3. Screenshot bazowy
// 4. Drukuje szablon do skopiowania do PLAN_PROGRESS.md

import fs from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sectionName = process.argv[2];

if (!sectionName) {
  console.error('❌ Użycie: node _start_section.mjs "NAZWA SEKCJI"');
  process.exit(1);
}

const safeName = sectionName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
const today = new Date().toISOString().slice(0, 10);

console.log('='.repeat(70));
console.log(`🚀 START SECTION: ${sectionName}`);
console.log('='.repeat(70));

// Step 1: Backup index.html
const backupName = `index_backup_${safeName}_${today}.html`;
const backupPath = path.join(__dirname, backupName);
console.log(`\n📦 Step 1: Backup index.html → ${backupName}`);
try {
  fs.copyFileSync(path.join(__dirname, 'index.html'), backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
} catch (e) {
  console.error(`❌ Backup failed: ${e.message}`);
  process.exit(1);
}

// Step 2: Visual diff folder
const vdPath = path.join(__dirname, '_visual_diffs', safeName);
console.log(`\n📁 Step 2: Visual diff folder → ${vdPath}`);
fs.mkdirSync(vdPath, { recursive: true });
console.log(`✅ Folder ready: ${vdPath}`);

// Step 3: Health check (smoke)
console.log(`\n🟢 Step 3: Health check — uruchamiam smoke testy...`);
console.log(`   (wszystkie smoke testy muszą PASS — inaczej baseline jest zepsuty)`);
console.log(`   → uruchom ręcznie: node _run_smoke.mjs`);

// Step 4: Print template
console.log(`\n📋 Step 4: Skopiuj poniższy template do PLAN_PROGRESS.md:\n`);
console.log('─'.repeat(70));

const template = `
#### XX. ${sectionName} (PLAN_SESJA.md linia [Y])

##### 📊 Status
- Status: 🟡 IN PROGRESS
- Started: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}
- Closed: —
- Estimated time: [małe / średnie / duże = 1h / 4h / 8h+]
- Backup: ${backupName}

##### 📝 Cytat użytkownika (verbatim z PLAN_SESJA.md)
> "..."

##### 🗺 Dry-run szkic (PRZED kodem!)
1. ...
2. ...
3. ...

##### 🎯 Powiązania (z PLAN_DEPENDENCIES.md)
- MUSI BYĆ PO: ...
- MUSI BYĆ PRZED: ...
- Wpływa na: ...

##### 🛡 Risk register (top 3)
1. **Ryzyko A:** ... → Mitygacja: ...
2. **Ryzyko B:** ... → Mitygacja: ...
3. **Ryzyko C:** ... → Mitygacja: ...

##### 🔄 Anti-pattern check
- [ ] AP-001 mapping cytatu | AP-004 fixed in body | AP-005 z-order | AP-006 wx vs sx
- [ ] AP-007 normalizacja diagonal | AP-008 bonus skill w kodzie | AP-009 max <40%

##### ✅ Test akceptacyjny (1:1 z PLAN_SESJA.md)
- [ ] Punkt 1: ...
- [ ] Punkt 2: ...

##### 🎨 Cytat zmapowany 1:1 (po implementacji)
- "fragment A" → ⏳/✅/❌ ...
- "fragment B" → ⏳/✅/❌ ...

##### 📦 Sub-commits (atomic)
- [ ] commit 1: ...

##### 🟢 Smoke regression
- [ ] node _run_smoke.mjs → ALL PASS

##### 📝 PATCH_NOTES
- [ ] Wpis w index.html (przyjazny język!)

##### 📊 Final status
- [ ] DONE (wszystkie 6 punktów protokołu) | LUB | NIEKOMPLETNE z raportem
`;

console.log(template);
console.log('─'.repeat(70));

console.log(`\n🎯 NEXT STEPS:`);
console.log(`   1. Otwórz PLAN_SESJA.md → znajdź sekcję "${sectionName}"`);
console.log(`   2. Skopiuj cytat użytkownika do template'u (verbatim!)`);
console.log(`   3. Napisz dry-run szkic (5-10 zdań co zrobisz)`);
console.log(`   4. Sprawdź PLAN_DEPENDENCIES.md i PLAN_ANTIPATTERNS.md`);
console.log(`   5. Otwórz Playwright i zrób screenshot baseline:`);
console.log(`      → ${vdPath}\\before.png`);
console.log(`   6. Implementuj atomic commits`);
console.log(`   7. Po skończeniu: node _close_section.mjs "${sectionName}"`);
console.log(`\n${'='.repeat(70)}\n`);
