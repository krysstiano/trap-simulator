// Skrypt czyszczący PATCH_NOTES z technicznych fragmentów (hex kolorów,
// koordynatów wx/wy, ID typu V1/V2/V3, regex itp.) tak żeby były czytelne
// dla zwykłego gracza.
import fs from 'fs';
const file='index.html';
let s=fs.readFileSync(file,'utf8');

// Zlokalizuj zakres PATCH_NOTES (od "const PATCH_NOTES" do końca tablicy)
const startIdx = s.indexOf('const PATCH_NOTES');
// Znajdź pierwszy "function showPatchNotes" PO startIdx, cofnij się do "];"
const fnIdx = s.indexOf('function showPatchNotes', startIdx);
const endIdx = s.lastIndexOf('];', fnIdx) + 2;
if(startIdx<0||endIdx<0||fnIdx<0){console.error('PATCH_NOTES nie znaleziony! start='+startIdx+' fn='+fnIdx);process.exit(1);}
console.log(`Zakres: ${startIdx} - ${endIdx} (${endIdx-startIdx} znaków)`);

let pn = s.substring(startIdx, endIdx);
const origLen = pn.length;
let totalReplacements = 0;
const log = (label, regex) => {
  const matches = pn.match(regex);
  const c = matches ? matches.length : 0;
  if(c>0){totalReplacements+=c;console.log(`  ${label}: ${c} usuniętych`);}
};

// === REGEX zamian — wszystkie tylko WEWNĄTRZ d:'...' ===

// Hex kolory w nawiasach: (#abc), (#abc123) — np. "(#404040)", "(#0a0a0a)"
log('Hex w nawiasach (#XXX/#XXXXXX)', /\s*\(#[0-9a-fA-F]{3,8}\)/g);
pn = pn.replace(/\s*\(#[0-9a-fA-F]{3,8}\)/g, '');

// Hex z notką po slashu: " (#XXX → #YYY)" lub "#XXX→#YYY"
log('Hex transitions (#X → #Y)', /\s*\(?#[0-9a-fA-F]{3,8}\s*[→>]\s*#[0-9a-fA-F]{3,8}\)?/g);
pn = pn.replace(/\s*\(?#[0-9a-fA-F]{3,8}\s*[→>]\s*#[0-9a-fA-F]{3,8}\)?/g, '');

// Standalone hex w treści (np. "kolor #2c382a") — usuń sam hex zostawiając słowo
log('Standalone hex #XXXXXX', /\s+#[0-9a-fA-F]{6}\b/g);
pn = pn.replace(/\s+#[0-9a-fA-F]{6}\b/g, '');
log('Standalone hex #XXX', /\s+#[0-9a-fA-F]{3}\b(?!\d)/g);
pn = pn.replace(/\s+#[0-9a-fA-F]{3}\b(?!\d)/g, '');

// rgba(R,G,B,A) i rgb(R,G,B)
log('rgba(...) / rgb(...)', /\s*\(?rgba?\([^)]+\)\)?/g);
pn = pn.replace(/\s*\(?rgba?\([^)]+\)\)?/g, '');

// Koordynaty wx/wy: "wx:1500,wy:330", "wx 1500", "(1500,330)"
log('wx:X,wy:Y', /\s*\(?\s*wx[:\s]?\d+\s*,\s*wy[:\s]?\d+\s*\)?/g);
pn = pn.replace(/\s*\(?\s*wx[:\s]?\d+\s*,\s*wy[:\s]?\d+\s*\)?/g, '');
// Pozycje typu (np. ławka 1500,330)
log('Pozycje X,Y po słowie', /(ławka|kosz|hydrant|patch|punkt|spawn|pozycja|obiekt)\s+\d{2,4}\s*,\s*\d{2,4}/gi);
pn = pn.replace(/(ławka|kosz|hydrant|patch|punkt|spawn|pozycja|obiekt)\s+\d{2,4}\s*,\s*\d{2,4}/gi, '$1');

// V1/V2/V3, H1/H2/H3 + N/S/W/E suffixes
log('V1/V2/V3 H1/H2/H3 nazwy', /\b[VH][123](?:\s*[NSEW]?)?\b/g);
pn = pn.replace(/\b[VH][123]\s+chodnik\b/g, 'chodnik');
pn = pn.replace(/\b[VH][123]\s+jezdnia\b/g, 'jezdnia');
pn = pn.replace(/\bjezdnia\s+[VH][123]\b/g, 'jezdnia');
pn = pn.replace(/\bchodnik\s+[VH][123]\b/g, 'chodnik');
pn = pn.replace(/\b[VH][123]\b/g, '');

// Z1/Z2/Z3/Z4 strefy
log('Z1-Z4 strefy', /\bZ[1-4](?:\s+(?:zach|wsch|north|south|N|S))?\b/g);
pn = pn.replace(/\bZ[1-4]\s+zach\b/g, 'strefie zachodniej');
pn = pn.replace(/\bZ[1-4]\s+wsch\b/g, 'strefie wschodniej');
pn = pn.replace(/\bZ[1-4]\s+(north|N|NORTH)\b/g, 'strefie północnej');
pn = pn.replace(/\bZ[1-4]\s+(south|S|SOUTH)\b/g, 'strefie południowej');
pn = pn.replace(/\bZ[1-4]\b/g, '');

// ROW A/B/C/D/E
log('ROW A-E', /\bROW\s+[A-E]\b/g);
pn = pn.replace(/\bROW\s+[A-E]\b/g, '');

// "P1/P2/P3/P4" patches
log('P1-P4 patches', /\bP[1-4](?:-P[1-4])?\b/g);
pn = pn.replace(/\bP[1-4]-P[1-4]\b/g, 'trawniki');
pn = pn.replace(/\bP[1-4]\b/g, '');

// Pixel values w technicznym sensie: "30px" zostawiamy ale "13→14px" → "większy"
// "padding 240→285px" → "padding zwiększony"
log('XX→YYpx', /\b\d+\s*[→>]\s*\d+\s*px\b/g);
pn = pn.replace(/\b\d+\s*[→>]\s*\d+\s*px\b/g, 'więcej miejsca');
log('z-index XX → YY', /\bz-index[:\s]?\d+\s*[→>]\s*\d+/gi);
pn = pn.replace(/\bz-index[:\s]?\d+\s*[→>]\s*\d+/gi, 'wyżej w hierarchii');
log('z-index XX', /\bz-index[:\s]?\d+/gi);
pn = pn.replace(/\bz-index[:\s]?\d+/gi, '');

// Alpha values: ".4→.6 alpha" lub "alpha 0.5"
log('alpha .X→.Y', /\s*\(?\.\d+\s*[→>]\s*\.\d+\s*alpha\)?/gi);
pn = pn.replace(/\s*\(?\.\d+\s*[→>]\s*\.\d+\s*alpha\)?/gi, '');
log('alpha 0.X', /\b(alpha|opacity)\s+0?\.\d+\b/gi);
pn = pn.replace(/\b(alpha|opacity)\s+0?\.\d+\b/gi, '');

// Funkcje i właściwości CSS/JS w tekście
log('radialGradient/linearGradient/createRadialGradient', /\b(radial|linear)Gradient\b|createRadialGradient|createLinearGradient/g);
pn = pn.replace(/\b(radial|linear)\s*Gradient\b/gi, 'gradient');
pn = pn.replace(/createRadialGradient|createLinearGradient/g, 'gradient');

log('regex/lookahead', /\bregex\b|\blookahead\b|\bnegative\s+lookahead\b/gi);
pn = pn.replace(/\bnegative\s+lookahead\b/gi, 'sprawdzanie');
pn = pn.replace(/\bregex\b/gi, 'wzorzec');
pn = pn.replace(/\blookahead\b/gi, 'sprawdzanie');

// Funkcje JS w tekście np. _isOnRoad(), Math.floor(), drawXxx()
log('_funkcjaCamelCase()', /\b_?[a-z][a-zA-Z]+\(\)/g);
pn = pn.replace(/\bdrawCarHint\(\)/g, 'wskazówkę');
pn = pn.replace(/\bGREEN_PATCHES\b/g, 'trawniki');
pn = pn.replace(/\bDB_DECORATIVE\b/g, 'bloki dekoracyjne');
pn = pn.replace(/\bRoOMS\.ulica\.objects\b/gi, 'obiekty');
pn = pn.replace(/\bROOMS\b/g, '');
pn = pn.replace(/\b_(isOnRoad|collidesWithSt|validateStPositions|milestoneShown)\(\)?/g, 'walidator');
pn = pn.replace(/\b(buyApartment|buyCar|releaseAlbum|performConcert|addXP|checkAchievements|showMilestoneCinematic|showIntroCinematic|showPatchNotes|drawMiniMap|drawNightGlows|drawStreetDetails|drawGreenPatches|buildMaps|nextPeriod|tickBills|drawLightingOverlay)\(\)?/g, '');

// Style atrybuty: "style='color:...' "
log('color:X w treści', /color:\s*#[0-9a-fA-F]+;?/g);
pn = pn.replace(/color:\s*#[0-9a-fA-F]+;?\s*/g, '');
log('font-weight:XXX', /font-weight:\s*\d+;?/g);
pn = pn.replace(/font-weight:\s*\d+;?\s*/g, '');
log('font-size:XXpx', /font-size:\s*\d+px;?/g);
pn = pn.replace(/font-size:\s*\d+px;?\s*/g, '');

// CSS atrybuty: padding-right:240, top:115 itp.
log('CSS padding/top/right values', /\b(padding(?:-\w+)?|margin(?:-\w+)?|top|left|right|bottom|width|height):\s*\d+(?:px|%)?/g);
pn = pn.replace(/\b(padding(?:-\w+)?|margin(?:-\w+)?|top|left|right|bottom|width|height):\s*\d+(?:px|%)?/g, '');

// Atrybut display:none/block/flex
log('display:X', /display:\s*\w+/g);
pn = pn.replace(/display:\s*\w+/g, '');

// position:absolute/fixed/relative
log('position:X', /position:\s*\w+/g);
pn = pn.replace(/position:\s*\w+/g, '');

// transform:scale, transform:translate
log('transform:X', /transform:\s*[^,'";]+/g);
pn = pn.replace(/transform:\s*[^,'";]+/g, '');

// Wartości typu sy-30, sy+8 (canvas coords)
log('sy-/+XX, sx-/+XX', /\bs[xy][\+\-]\d+\b/g);
pn = pn.replace(/\bs[xy][\+\-]\d+\b/g, '');

// "12 keyframe-ów" → "płynne klatki"
pn = pn.replace(/\b\d+\s*keyframe[-óe]?w?\b/gi, 'płynne klatki');

// Hard clip, soft mask, blob shapes
pn = pn.replace(/\bHARD\s+CLIP\b/g, 'ograniczenie');
pn = pn.replace(/\bsoft\s+(mask|fade)\b/gi, 'miękkie przejście');

// "padding XX" → "odstęp"
log('padding XXpx', /\bpadding\s+\d+\s*px\b/gi);
pn = pn.replace(/\bpadding\s+\d+\s*px\b/gi, 'odstęp');
log('font XXpx', /\bfont\s+\d+\s*px\b/gi);
pn = pn.replace(/\bfont\s+\d+\s*px\b/gi, 'czcionka');

// Skróty technical: PROBLEM:, ROOT CAUSE:, FIX:, BUG:
pn = pn.replace(/\bROOT\s+CAUSE\b\s*:?/gi, 'powód');
pn = pn.replace(/\bPROBLEM\b\s*:?/g, 'problem');
pn = pn.replace(/\bBUG\s+FIX\b\s*:?/gi, 'naprawa');
pn = pn.replace(/\bUSUNIĘTE\b/g, 'usunięte');

// Wielokrotne spacje
pn = pn.replace(/[ \t]{2,}/g, ' ');

// Spacje przed znakami interpunkcyjnymi
pn = pn.replace(/\s+([,.;:!?])/g, '$1');

// Pozostałe puste nawiasy
pn = pn.replace(/\(\s*\)/g, '');
pn = pn.replace(/\(\s*[—–]\s*\)/g, '');

// Nadmierne myślniki na końcu np. "tekst —" lub "tekst —."
pn = pn.replace(/\s+—\s*([.,'])/g, '$1');

s = s.substring(0, startIdx) + pn + s.substring(endIdx);
fs.writeFileSync(file, s, 'utf8');
console.log(`\nGOTOWE. Łącznie ${totalReplacements} zamian. Plik: ${origLen} → ${pn.length} znaków.`);
