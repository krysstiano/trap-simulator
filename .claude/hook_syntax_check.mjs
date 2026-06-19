#!/usr/bin/env node
/* Hook: PostToolUse syntax check po Edit/Write na index.html.
 * Czyta tool input z stdin (JSON), sprawdza czy edytowany plik to index.html,
 * jeśli tak — extract JS i node --check.
 * Exit code != 0 → hook blokuje (z notiifikacją).
 *
 * Wymusza ŻELAZNĄ REGUŁĘ #2 (CLAUDE.md): syntax check po każdym Edit.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

let input = '';
try {
  // Czytaj cały stdin sync
  input = fs.readFileSync(0, 'utf8');
} catch (e) {
  // Brak input → no-op
  process.exit(0);
}

let payload;
try { payload = JSON.parse(input); } catch (e) {
  // Niepoprawny JSON → no-op
  process.exit(0);
}

const toolInput = payload?.tool_input || {};
const filePath = toolInput.file_path || '';

// Tylko dla index.html w E:\Snowy Simulator
if (!filePath.endsWith('index.html') || !filePath.includes('Snowy Simulator')) {
  process.exit(0);
}

const indexPath = filePath;
const tmpPath = path.join(path.dirname(indexPath), '_syntax_check.js');

try {
  const html = fs.readFileSync(indexPath, 'utf8');
  const matches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
  let js = '';
  matches.forEach((s, i) => {
    const content = s.replace(/<script[^>]*>/, '').replace(/<\/script>$/, '');
    js += '// === script ' + i + ' ===\n' + content + '\n';
  });
  fs.writeFileSync(tmpPath, js);
  execSync(`node --check "${tmpPath}"`, { stdio: 'pipe' });
  // Cleanup tmp file
  try { fs.unlinkSync(tmpPath); } catch (_) {}
  // PASS — silent exit 0
  process.exit(0);
} catch (e) {
  const errMsg = (e.stderr?.toString() || e.message || 'unknown').slice(0, 1000);
  console.error(`⛔ ŻELAZNA REGUŁA #2 — SYNTAX CHECK FAIL po Edit ${indexPath}:\n${errMsg}\n\nNAPRAW PRZED kolejnymi Edit. Inaczej commitujesz BROKEN GRA.`);
  process.exit(2); // exit 2 = blokujący hook
}
