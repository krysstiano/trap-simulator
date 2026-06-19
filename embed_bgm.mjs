import fs from 'fs';
import path from 'path';

const ROOT='E:/Snowy Simulator';
const MP3_DIR=path.join(ROOT,'mp3');
const HTML_PATH=path.join(ROOT,'index.html');

console.log('Wczytuję index.html…');
let html=fs.readFileSync(HTML_PATH,'utf8');

// Pliki do embedu — zgodne z BGM_LIST w grze
const FILES=[
  "#1 'Red Night' [155bpm] - Bm.mp3",
  "'What u Lookin for'.mp3",
  "Hoodtrap variation.mp3",
  "Jerk underground.mp3",
  "Scarlxrld.mp3",
  "Supertrap.mp3",
  "Supertrappppp.mp3",
  "dark trap instrumental.mp3"
];

console.log('Czytam pliki MP3 i koduję base64…');
const dataMap={};
let totalRaw=0,totalB64=0;
for(const f of FILES){
  const p=path.join(MP3_DIR,f);
  if(!fs.existsSync(p)){console.error(`✗ Brak pliku: ${f}`);process.exit(1);}
  const buf=fs.readFileSync(p);
  totalRaw+=buf.length;
  const b64=buf.toString('base64');
  totalB64+=b64.length;
  dataMap[f]='data:audio/mpeg;base64,'+b64;
  console.log(`  ✓ ${f}: ${(buf.length/1024/1024).toFixed(1)} MB → ${(b64.length/1024/1024).toFixed(1)} MB base64`);
}
console.log(`\nTotal: raw=${(totalRaw/1024/1024).toFixed(1)} MB, base64=${(totalB64/1024/1024).toFixed(1)} MB`);

// Czy już istnieje BGM_DATA — usuń stare
const startMarker='/* BGM_DATA_START */';
const endMarker='/* BGM_DATA_END */';
const sIdx=html.indexOf(startMarker);
if(sIdx!==-1){
  const eIdx=html.indexOf(endMarker,sIdx);
  if(eIdx!==-1){
    console.log('Usuwam stare BGM_DATA…');
    html=html.substring(0,sIdx)+html.substring(eIdx+endMarker.length);
  }
}

// Wstaw BGM_DATA zaraz po BGM_LIST
const insertAfter=`];\nlet bgmAudio=null;`;
const idxList=html.indexOf(insertAfter);
if(idxList===-1){console.error('✗ Nie znalazłem miejsca BGM_LIST w HTML');process.exit(1);}

const dataJSON=JSON.stringify(dataMap);
const dataBlock=`];\n${startMarker}\nconst BGM_DATA=${dataJSON};\n${endMarker}\nlet bgmAudio=null;`;
html=html.replace(insertAfter,dataBlock);

// Zmień bgmLoad() — użyj BGM_DATA jeśli dostępne, fallback do mp3/...
const oldLoadSrc=`bgmAudio.src='mp3/'+encodeURIComponent(BGM_LIST[bgmIdx]);`;
const newLoadSrc=`bgmAudio.src=(typeof BGM_DATA!=='undefined'&&BGM_DATA[BGM_LIST[bgmIdx]])||('mp3/'+encodeURIComponent(BGM_LIST[bgmIdx]));`;
if(html.indexOf(oldLoadSrc)===-1){console.error('✗ Nie znalazłem bgmLoad src lookup');process.exit(1);}
html=html.replace(oldLoadSrc,newLoadSrc);

console.log(`\nZapisuję index.html (${(html.length/1024/1024).toFixed(1)} MB)…`);
fs.writeFileSync(HTML_PATH,html,'utf8');
console.log('✓ Gotowe');
