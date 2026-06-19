import fs from 'fs';
const c = fs.readFileSync('index.html', 'utf8');
const checks = {
  mic: ['🎙', '🎤', '🎙️'],
  studio: ['🎚', '🎚️', '🎛', '🎛️', '🎬'],
  apartment: ['🏠', '🏡', '🏘'],
  casino: ['🎰', '🎲', '🃏'],
  concert: ['🎪', '🎤', '🎶'],
  phone: ['📱', '📲'],
  money: ['💰', '💵', '💸', '💴', '💶'],
  fans: ['👥', '🎉', '❤️'],
  fame: ['⭐', '✨', '🌟'],
};
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const [k, vs] of Object.entries(checks)) {
  const counts = vs.map(e => ({ e, n: (c.match(new RegExp(esc(e), 'g')) || []).length }));
  console.log(k + ':', counts.map(c => c.e + ':' + c.n).join('  '));
}
