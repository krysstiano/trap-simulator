// Czyszczenie tytułów wersji z numerów zadań #X
import fs from 'fs';
let s=fs.readFileSync('index.html','utf8');
const startIdx = s.indexOf('const PATCH_NOTES');
const fnIdx = s.indexOf('function showPatchNotes', startIdx);
const endIdx = s.lastIndexOf('];', fnIdx) + 2;
let pn = s.substring(startIdx, endIdx);
const orig = pn.length;

// Czyszczenie tytułów (title:'...')
// Patterns:
// "tytuł #N" → "tytuł"
// "(#N)" → ""
// "(#N-N)" → ""
// "(#N+#N)" → ""
// "#N tytuł" → "tytuł"
// "#N punkt N" → ""
let n = 0;
const replace = (re, rep) => {const m=pn.match(re);if(m)n+=m.length;pn=pn.replace(re,rep);};

// W title: tylko
const titleRe = /(title:'[^']*')/g;
const newPn = pn.replace(titleRe, (full) => {
  let t = full;
  t = t.replace(/\s*\(#\d+(?:[+\-]#\d+)*(?:\s+batch\s+\d+)?\)/g, '');
  t = t.replace(/\s*\(#\d+\)/g, '');
  t = t.replace(/\s*\(#\d+-\d+\)/g, '');
  t = t.replace(/^title:'#\d+\s+/, "title:'");
  t = t.replace(/title:'#\d+\s+fix:/, "title:'Naprawa:");
  t = t.replace(/\s+#\d+\s+(batch|finalny|fix:|punkt)\s*\d*\b/gi, '');
  t = t.replace(/\s+#\d+(?=[\s'])/g, '');
  // Wielokrotne spacje
  t = t.replace(/[ \t]{2,}/g, ' ');
  // Spacje przed znakami
  t = t.replace(/\s+([,.;:!?])/g, '$1');
  if(t!==full) n++;
  return t;
});
pn = newPn;

s = s.substring(0, startIdx) + pn + s.substring(endIdx);
fs.writeFileSync('index.html', s, 'utf8');
console.log(`${n} tytułów zmienionych. ${orig} → ${pn.length}`);
