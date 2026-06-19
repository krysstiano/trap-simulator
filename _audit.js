const fs = require('fs');
const s = fs.readFileSync('E:/Snowy Simulator/index.html', 'utf8');
const lines = s.split('\n');

const checkFn = ['_autoInitNick', '_lbStartOptIn', '_lbManualSubmit', '_lbShowNickPicker', '_lbTryClaimNick', 'submitScore', 'submitAllScores', 'fetchLeaderboard', 'checkNickAvailable', 'claimNick'];

console.log('=== DEAD CODE / USAGE check ===');
for (const fn of checkFn) {
  const defRe = new RegExp('function\\s+' + fn + '\\b');
  const useRe = new RegExp('\\b' + fn + '\\s*\\(');
  const defs = lines.filter(l => defRe.test(l)).length;
  const uses = lines.filter(l => useRe.test(l) && !defRe.test(l)).length;
  console.log(`${fn}: def=${defs} uses=${uses} ${uses === 0 ? '⚠️ DEAD' : 'OK'}`);
}

console.log('\n=== Sprawdz on_conflict w POST do leaderboard ===');
lines.forEach((l, i) => {
  if (/_lbFetch\(['"]leaderboard/.test(l)) console.log((i + 1) + ': ' + l.trim().slice(0, 200));
});

console.log('\n=== Wszystkie miejsca gdzie pisze do bazy ===');
lines.forEach((l, i) => {
  if (/method:'POST'|method:"POST"/.test(l) && /_lbFetch/.test(s.split('\n').slice(Math.max(0,i-2), i+1).join(' '))) {
    console.log((i + 1) + ': ' + l.trim().slice(0, 200));
  }
});
