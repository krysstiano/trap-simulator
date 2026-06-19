import fs from 'fs';
const h = fs.readFileSync('E:/Snowy Simulator/index.html', 'utf8');
const sd = h.match(/^const SKILL_DEF=\{[\s\S]*?^\};/m);
const sf = new Function('const _PU=(...a)=>a;const _EVO=(...a)=>a;'+sd[0]+';return SKILL_DEF;')();
console.log('SKILL_DEF OK,', Object.keys(sf).length, 'skille');
const pn = h.match(/^const PATCH_NOTES = \[[\s\S]*?^\];/m);
const pf = new Function(pn[0]+';return PATCH_NOTES;')();
console.log('PATCH_NOTES OK,', pf.length, 'wpisów');

console.log('\n═══ WYMOGI NA G.fans ═══');
const checks = [
  ['Studio Projektowania', "if((G.fans||0)<5000) txt="],
  ['Influencer car prompt', "wymaga 500 fanów (masz "],
  ['World Tour', "World Tour wymaga 50 000 fanów"],
  ['Apartment req', "if(req.fans && (G.fans||0)<req.fans)"],
  ['Prestige', "if((G.fans||0)<reqs.fans)"],
  ['Milestone 1K', "if(!G._mile1k&&(G.fans||0)>=1000)"],
  ['Milestone 1M', "if(!G._mile1m&&(G.fans||0)>=1000000)"],
  ['Achievement 1K Fanów', "name:'1K Fanów'"],
  ['Achievement Milion fanów', "name:'Milion fanów'"],
  ['Apt premium req.fans', "req:{level:4,fans:2000}"],
  ['Car Porsche req.fans', "req:{level:8,fame:40,fans:5000}"],
  ['APT_REQS const fans', "premium:{level:4,fans:2000}"],
  ['Scena raper minFans', "if(def.minFans){if((G.fans||0)<def.minFans)return false;}"],
  ['Speedrun fol=G.fans', "const fol=G.fans||0"],
  ['mainMission totalFans=G.fans', "const totalFans=(G.fans||0);"],
];
let pass = 0;
for(const [n, t] of checks){
  const ok = h.includes(t);
  console.log('  ' + (ok ? '✓' : '✗') + ' ' + n);
  if(ok) pass++;
}
console.log(`\n${pass}/${checks.length} pass`);

console.log('\n═══ SOCIAL ZOSTAŁ G.followers ═══');
const social = [
  ['IG header', '${G.followers.toLocaleString'],
  ['Hejt Twitter event', "G.followers>=2000"],
  ['Sponsorship event', "cond:()=>_evHome()&&G.followers>=1000"],
];
for(const [n, t] of social){
  console.log('  ' + (h.includes(t) ? '✓' : '✗') + ' ' + n);
}

console.log('\n═══ Auto-sync usunięta ═══');
console.log('  ' + (!h.includes('Math.max(G.haters||0, Math.floor(G.followers*0.01))') ? '✓' : '✗') + ' auto-sync haters removed');
