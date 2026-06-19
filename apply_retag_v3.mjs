/* Aplikuje retag z patchnotes_retag_v3.json do index.html.
   Dla każdego wpisu znajduje linię `ver:'<ver>',date:'...',cats:[...]` i zamienia cats. */
import fs from 'fs';

const SRC = 'E:/Snowy Simulator/index.html';
const PROPOSALS = JSON.parse(fs.readFileSync('E:/Snowy Simulator/patchnotes_retag_v3.json', 'utf8'));

let html = fs.readFileSync(SRC, 'utf8');
let applied = 0, skipped = [];

for(const p of PROPOSALS){
  const ver = p.ver;
  const newCatsStr = p.newCats.map(c => `'${c}'`).join(',');
  /* Match: ver:'v2.1.21',date:'...',cats:[...] — pojedyncza linia */
  const re = new RegExp(`(ver:'${ver.replace(/\./g,'\\.')}',date:'[^']+',)cats:\\[[^\\]]+\\]`, 'g');
  const matches = html.match(re);
  if(!matches || matches.length===0){
    /* Może to starszy format z `cat:'...'` zamiast `cats:[...]` */
    const reAlt = new RegExp(`(ver:'${ver.replace(/\./g,'\\.')}',date:'[^']+',)cat:'[^']+'`, 'g');
    const altM = html.match(reAlt);
    if(altM){
      html = html.replace(reAlt, `$1cats:[${newCatsStr}]`);
      applied++;
      continue;
    }
    skipped.push({ver, reason:'no match for ver+cats pattern'});
    continue;
  }
  if(matches.length>1){
    skipped.push({ver, reason:`ambiguous: ${matches.length} matches`});
    continue;
  }
  html = html.replace(re, `$1cats:[${newCatsStr}]`);
  applied++;
}

fs.writeFileSync(SRC, html);
console.log(`Applied: ${applied}/${PROPOSALS.length}`);
if(skipped.length){
  console.log(`Skipped:`);
  skipped.forEach(s => console.log(`  ${s.ver}: ${s.reason}`));
}
