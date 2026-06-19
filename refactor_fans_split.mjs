/* v2.1.34: Rozdzielenie G.fans (obiekt) na trzy plain liczniki:
   - G.followers (number) = obserwujący (dawne casual)
   - G.fans (number) = lojalni fani (dawne hardcore)
   - G.haters (number) = hejterzy (dawne G.fans.haters)

   Cofamy też getter/setter z v2.1.31 — wszystkie 3 są plain numbers. */
import fs from 'fs';

const SRC = 'E:/Snowy Simulator/index.html';
let html = fs.readFileSync(SRC, 'utf8');
const origLen = html.length;

const replacements = [
  /* TotalFans / sum patterns (multi-source) — najpierw, bo zawierają substrings z prostszych patternów */
  [/\(G\.fans\?\.casual\|\|0\)\+\(G\.fans\?\.hardcore\|\|0\)/g, '(G.followers||0)+(G.fans||0)'],
  [/\(G\.fans\.casual\|\|0\)\+\(G\.fans\.hardcore\|\|0\)/g, '(G.followers||0)+(G.fans||0)'],
  [/\(\(G\.fans\.casual\|\|0\)\+\(G\.fans\.hardcore\|\|0\)\)\|\|G\.followers\|\|0/g, '(G.followers||0)+(G.fans||0)'],
  [/\(G\.fans&&\(G\.fans\.casual\|\|0\)\+\(G\.fans\.hardcore\|\|0\)\)\|\|G\.followers\|\|0/g, '(G.followers||0)+(G.fans||0)'],
  /* G.fans?.X — optional chaining read */
  [/G\.fans\?\.casual/g, 'G.followers'],
  [/G\.fans\?\.hardcore/g, 'G.fans'],
  [/G\.fans\?\.haters/g, 'G.haters'],
  /* G.fans.casual/hardcore/haters — assignments i odczyty */
  [/G\.fans\.casual/g, 'G.followers'],
  [/G\.fans\.hardcore/g, 'G.fans'],
  [/G\.fans\.haters/g, 'G.haters'],
  /* Migracje/inicjalizacje obiektu G.fans */
  [/G\.fans=G\.fans\|\|\{casual:0,hardcore:0\};/g, "if(typeof G.fans!=='number') G.fans=0;"],
  [/G\.fans=G\.fans\|\|\{casual:0,hardcore:0,haters:0\};/g, "if(typeof G.fans!=='number') G.fans=0; if(typeof G.haters!=='number') G.haters=0;"],
  [/if\(!G\.fans\) G\.fans=\{casual:0,hardcore:0,haters:0\};/g, "if(typeof G.fans!=='number') G.fans=0; if(typeof G.haters!=='number') G.haters=0;"],
  [/if\(!G\.fans\)G\.fans=\{casual:0,hardcore:0,haters:0\};/g, "if(typeof G.fans!=='number') G.fans=0; if(typeof G.haters!=='number') G.haters=0;"],
  [/if\(!G\.fans\|\|typeof G\.fans!=='object'\) G\.fans=\{casual:0,hardcore:0,haters:0\};/g, "/* v2.1.34: G.fans/haters jako plain numbers (migracja w loadGame) */"],
];

let applied = {};
for(const [re, sub] of replacements){
  const before = html;
  html = html.replace(re, sub);
  const count = (before.match(re)||[]).length;
  applied[re.source.slice(0,60)] = count;
}

fs.writeFileSync(SRC, html);

console.log(`Original length: ${origLen}, new: ${html.length}, diff: ${html.length-origLen}`);
console.log('Replacements applied:');
for(const [pat, count] of Object.entries(applied)){
  if(count>0) console.log(`  ${count}× ${pat}`);
}

/* Walidacja: czy zostały gdzieś G.fans.casual/hardcore/haters? */
const leftCasual = (html.match(/G\.fans\.casual/g)||[]).length;
const leftHardcore = (html.match(/G\.fans\.hardcore/g)||[]).length;
const leftHaters = (html.match(/G\.fans\.haters/g)||[]).length;
console.log(`Pozostałe G.fans.casual: ${leftCasual}, .hardcore: ${leftHardcore}, .haters: ${leftHaters}`);
