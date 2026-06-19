import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, 'index.html');

const CYAN  = '\x1b[36m';
const GRN   = '\x1b[32m';
const YEL   = '\x1b[33m';
const RST   = '\x1b[0m';

console.log(`${CYAN}👁  Watch aktywny — monitoruję: index.html${RST}`);
console.log(`${CYAN}   Ctrl+C aby zatrzymać\n${RST}`);

let debounce = null;
let lastMtime = fs.statSync(target).mtimeMs;

function runState() {
  console.log(`\n${YEL}━━━ Zmiana wykryta — uruchamiam state.mjs ━━━${RST}`);
  try {
    const out = execSync('node state.mjs', {
      cwd: __dirname,
      timeout: 30000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    console.log(out);
    console.log(`${GRN}━━━ Gotowe ━━━${RST}\n`);
  } catch (err) {
    // execSync rzuca gdy exit code != 0 — stdout/stderr mogą być w err
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    console.log(`${YEL}━━━ Gotowe (z ostrzeżeniami) ━━━${RST}\n`);
  }
}

// Polling co 500ms — fs.watch bywa zawodny na Windows
setInterval(() => {
  try {
    const mtime = fs.statSync(target).mtimeMs;
    if (mtime !== lastMtime) {
      lastMtime = mtime;
      clearTimeout(debounce);
      debounce = setTimeout(runState, 500); // debounce 500ms po ostatniej zmianie
    }
  } catch {
    // plik chwilowo niedostępny podczas zapisu — ignoruj
  }
}, 500);
