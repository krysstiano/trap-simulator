import fs from 'fs';
const file='index.html';
let s=fs.readFileSync(file,'utf8');
const orig=s.length;
// Wzorce # numerów do usunięcia (TYLKO w wpisach PATCH_NOTES — d:'...')
// Zachowujemy CSS hex colors (#aabbcc) i id selectory (#name)
// Atak: usuwamy tylko po `d:'` na początku stringa
const patterns=[
  // d:'Zadanie #N-N: ' → d:'
  [/d:'Zadanie #\d+-\d+:\s*/g,"d:'"],
  // d:'Zadanie #N-N ' → d:'
  [/d:'Zadanie #\d+-\d+\s+/g,"d:'"],
  // d:'Zadanie #N: ' → d:'
  [/d:'Zadanie #\d+:\s*/g,"d:'"],
  // d:'Zadanie #N ' → d:'
  [/d:'Zadanie #\d+\s+/g,"d:'"],
  // d:'#N punkt N: ' lub 'punkt N ' → d:'
  [/d:'#\d+ punkt \d+:\s*/g,"d:'"],
  [/d:'#\d+ punkt \d+\s+/g,"d:'"],
  // d:'#N/#N (...): ' → d:'
  [/d:'#\d+\/#\d+\s+\([^)]*\):\s*/g,"d:'"],
  // d:'#N/#N ' → d:'
  [/d:'#\d+\/#\d+\s+/g,"d:'"],
  // d:'#NA #NB (...): ' / 'd:'#NN[A-Z] (...): '
  [/d:'#\d+[A-Z]?:\s*/g,"d:'"],
  [/d:'#\d+[A-Z]?\s+/g,"d:'"],
  // d:'#N: '
  [/d:'#\d+:\s*/g,"d:'"],
  // d:'#N '  (najbardziej generyczne — na końcu)
  [/d:'#\d+\s+/g,"d:'"],
  // BUG #N
  [/BUG\s+#\d+\s+/g,'BUG '],
  [/REGRESJA\s+#\d+\s*/g,'REGRESJA '],
  [/regresja\s+#\d+\s*/g,'regresja '],
  // Inne odniesienia "#N" w środku tekstu (max 2 cyfry, NIE hex color)
  // (zostawimy CSS hex bo są w cudzysłowach z 6 znakami)
];
let total=0;
for(const [r,rep] of patterns){
  const before=s.length;
  const matches=s.match(r);
  if(matches) total+=matches.length;
  s=s.replace(r,rep);
}
fs.writeFileSync(file,s,'utf8');
console.log(`Replaced ${total} patterns. File size ${orig} → ${s.length}`);
