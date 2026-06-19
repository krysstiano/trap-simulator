/**
 * Helper: Analog feature grep (reguła #6)
 * Sprawdza w 14 obszarach (UI/opisy/storyline/hints/achievementy/SMS/dialogi/mapa/save keys/PATCH_NOTES/tutorial/cinematic/telefon panele/smart hints)
 *
 * Usage:
 *   node _helper_analog_grep.mjs <pattern> [<pattern2>...]
 *
 * Output: JSON z liczbą hit-ów per obszar + sample lines.
 */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, 'index.html');

const AREAS = {
  ui: { name: 'UI elements', patterns: ['innerHTML', 'phRender', 'renderPhone', 'div class', 'button'] },
  opisy: { name: 'Opisy/desc/help', patterns: ['desc:', 'help:', 'tooltip', 'showMsg'] },
  storyline: { name: 'Storyline quests', patterns: ['STORYLINE_QUESTS', 'SIDE_STORYLINES', 'mainQuest', 'sideQuests'] },
  hints: { name: 'Smart hints', patterns: ['SMART_HINTS', '_hintShown_'] },
  achievements: { name: 'Achievements', patterns: ['ACHIEVEMENTS', 'TIER_HARD', 'TIER_MEDIUM', 'TIER_LEGENDARY', 'checkAchievements'] },
  sms: { name: 'SMS triggers', patterns: ['_smsTriggerOnce', 'SMS_CONTACTS', '_smsSend'] },
  dialogi: { name: 'NPC dialogi', patterns: ['NPC_DATA', 'DIALOG_TREES', 'closeNPCDlg'] },
  mapa: { name: 'Mapa ROOMS', patterns: ['ROOMS.', 'objects:', 'wx:', 'wy:'] },
  save: { name: 'Save schema', patterns: ['resetG', 'loadGame', 'defensive init', 'G._'] },
  patchnotes: { name: 'PATCH_NOTES', patterns: ['PATCH_NOTES', 'ver:', 'date:'] },
  tutorial: { name: 'Tutorial', patterns: ['TUTORIAL_STEPS', 'tutorialTick', 'showTutorialMessage'] },
  cinematic: { name: 'Cinematic', patterns: ['showMilestoneCinematic', 'cinematic', '_cinemCam'] },
  telefon: { name: 'Telefon apps', patterns: ['_phApp', 'renderPhoneApp', 'phoneFolders'] },
  decorative: { name: 'Decorative DB', patterns: ['DB_DECORATIVE', 'drawCityDecorations'] },
};

function grepCount(pattern, text) {
  try {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    const matches = text.match(re);
    return matches ? matches.length : 0;
  } catch { return 0; }
}

function grepLines(pattern, text, maxLines = 5) {
  const lines = text.split('\n');
  const results = [];
  for (let i = 0; i < lines.length && results.length < maxLines; i++) {
    if (lines[i].includes(pattern)) results.push(`L${i + 1}: ${lines[i].trim().slice(0, 120)}`);
  }
  return results;
}

const searchPatterns = process.argv.slice(2);
if (searchPatterns.length === 0) {
  console.log('Usage: node _helper_analog_grep.mjs <pattern> [<pattern2>...]');
  process.exit(1);
}

const text = readFileSync(INDEX_PATH, 'utf8');
const totalLines = text.split('\n').length;
console.log(`📋 Analog grep w ${INDEX_PATH} (${totalLines} lines)`);
console.log(`🔍 Patterns: ${searchPatterns.join(', ')}\n`);

const report = {};
for (const pattern of searchPatterns) {
  const totalHits = grepCount(pattern, text);
  if (totalHits === 0) {
    console.log(`❌ "${pattern}" — 0 hits (NIE istnieje w kodzie)`);
    report[pattern] = { totalHits: 0, byArea: {}, sample: [] };
    continue;
  }
  const sample = grepLines(pattern, text, 8);
  console.log(`✅ "${pattern}" — ${totalHits} hits w pliku`);
  console.log('   Sample:');
  sample.forEach(l => console.log('   ' + l));
  console.log('');
  report[pattern] = { totalHits, sample };
}

console.log('\n📊 Per obszar (14 kategorii):');
for (const pattern of searchPatterns) {
  console.log(`\n  "${pattern}":`);
  for (const [key, area] of Object.entries(AREAS)) {
    // Search lines containing both pattern AND any of area keywords
    const lines = text.split('\n');
    const matches = lines.filter(line => line.includes(pattern) && area.patterns.some(p => line.includes(p)));
    if (matches.length > 0) {
      console.log(`    ${key.padEnd(12)} (${area.name}): ${matches.length} matches`);
    }
  }
}
