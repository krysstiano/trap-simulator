import fs from 'fs';
let s=fs.readFileSync('index.html','utf8');
const startIdx = s.indexOf('const PATCH_NOTES');
const fnIdx = s.indexOf('function showPatchNotes', startIdx);
const endIdx = s.lastIndexOf('];', fnIdx) + 2;
let pn = s.substring(startIdx, endIdx);
const orig = pn.length;

// SŁOWNIK slangowych terminów — case-sensitive zamiany
const dict = [
  // Pill → pasek misji
  [/\bStoryline pill\b/g, 'Pasek misji głównej'],
  [/\bstoryline pill\b/g, 'pasek misji głównej'],
  [/\bStoryline Pill\b/g, 'Pasek misji głównej'],
  [/\bPill\b/g, 'Pasek'],
  [/\bpill\b/g, 'pasek'],
  // Nerf/Buff
  [/\bNERF\b/g, 'OSŁABIENIE'],
  [/\bnerf\b/g, 'osłabienie'],
  [/\bNerf\b/g, 'Osłabienie'],
  [/\bBUFF\b/g, 'WZMOCNIENIE'],
  [/\bbuff\b/g, 'wzmocnienie'],
  [/\bBuff\b/g, 'Wzmocnienie'],
  // Overlay → okno
  [/\bOverlay\b/g, 'Okno'],
  [/\boverlay\b/g, 'okno'],
  // Modal → okno (już jest w użytkowniku)
  [/\bModal\b/g, 'Okno'],
  [/\bmodal(?:em|nym|nego|nych|ne)?\b/g, (m)=>{const e=m.slice(5);return 'okn'+(e||'em');}],
  // Spawn
  [/\bspawn(?:em|ie|ach|ował|ował się|owanie|y|ował się)?\b/gi, (m)=>{
    const lower=m.toLowerCase();
    if(lower.endsWith('owanie'))return 'pojawienie się';
    if(lower.endsWith('ował'))return 'pojawiał się';
    return 'pojawienie';
  }],
  // Toggle
  [/\bToggle\b/g, 'Przełącznik'],
  [/\btoggle\b/g, 'przełącznik'],
  // Tier
  [/\bTier\s*(\d)/gi, 'Poziom $1'],
  // Cleanup
  [/\bcleanup(?:u|em|ie)?\b/gi, 'zakończenie'],
  // Audit
  [/\bAudit\b/g, 'Audyt'],
  [/\baudit\b/g, 'audyt'],
  // Compass
  [/\bcompass(?:em|ie|y|owy|owa|owe|owej|ową)?\b/gi, 'kompas'],
  // Guard
  [/\bguard(?:y|ów|em|ami)?\b/gi, 'zabezpieczenie'],
  // z-order
  [/\bz-order\b/gi, 'kolejność warstw'],
  // REGRESJA
  [/\bREGRESJA\b/g, 'POWRÓT BUGA'],
  [/\bregresja\b/g, 'powrót buga'],
  // Canvas (gdy odnosi się do techniki, nie nazwy minigry)
  [/\bcanvas(?:ie|em|ach)?\b/g, 'ekran'],
  [/\bCanvas\b/g, 'Ekran'],
  // Debug
  [/\bDebug\b/g, 'Narzędzia testowe'],
  [/\bdebug\b/g, 'narzędzia testowe'],
  // BUG FREEZE → zamrożenie gry
  [/\bBUG FREEZE\b/g, 'Zamrożenie gry'],
  // hsl rotacja → opisowo
  [/\bhsl rotacja\b/gi, 'zmieniające się kolory'],
  [/\bhsl\b/gi, 'kolor'],
  // RGB LED strip → kolorowy pasek LED
  [/\bRGB LED strip\b/gi, 'kolorowy pasek LED'],
  // LED-ów / diod
  [/\bLED-ów\b/gi, 'diod'],
  // KRYTYCZNY (już używane)
  // ... zostaw
  // Fixy → naprawy
  [/\bFixy\b/g, 'Naprawy'],
  [/\bfixy\b/g, 'naprawy'],
  // Polish
  [/\bpolish\b/g, 'wykończenie'],
  [/\bPolish\b/g, 'Wykończenie'],
  // Rework
  [/\bRework\b/g, 'Przebudowa'],
  [/\brework\b/g, 'przebudowa'],
  // Rebuild
  [/\bRebuild\b/g, 'Przebudowa'],
  [/\brebuild(?:em|u|ie)?\b/gi, 'przebudowa'],
  // RGB neon stripes → neonowe paski
  [/\bRGB neon stripes\b/gi, 'neonowe paski'],
  // Tagi techniczne kodu — usuń (dla prostoty)
  [/`document\.body\.style\.cursor=""`/g, 'kursor'],
  [/`[^`]+`/g, ''], // wszystkie wstawki w backtickach
  // Plik/funkcja w treści: tutorialTick, mg-job, recordVocal, checkSmartHints, showSmartHint
  [/\btutorialTick\b/gi, 'wskazówki'],
  [/\bmg-(?:job|yt|pizza|edit)\b/gi, 'minigra'],
  [/\brecordVocal\b/gi, 'nagrywanie'],
  [/\b(check|show)SmartHints?\b/gi, 'wskazówki'],
  [/\bclosedOverlay?\b/gi, 'zamykanie okna'],
  [/\bclick-outside-to-dismiss\b/gi, 'kliknięcie w tło'],
  [/\bbackdrop blur\b/gi, 'rozmyte tło'],
  [/\bcountdown UI\b/gi, 'odliczanie'],
  // shadowBlur
  [/\bshadowBlur=0\b/gi, 'bez rozmycia'],
  // strokeText, fillText
  [/\bstrokeText\+fillText\b/gi, 'wzmocniony tekst'],
  // sub-wymagania
  [/\bsub-wymagania?\b/gi, 'podwymagania'],
  // batch (już w wcześniej)
  [/\bbatch\b/gi, ''],
  // FREEZE
  [/\bFREEZE\b/g, 'zamrożenie'],
  [/\bfreeze\b/g, 'zamrożenie'],
  // Wielokrotne spacje
];

let n = 0;
for(const [re, rep] of dict){
  const before = pn.length;
  if(typeof rep === 'function') pn = pn.replace(re, rep);
  else pn = pn.replace(re, rep);
  if(pn.length !== before) n++;
}

// Czyszczenie: wielokrotne spacje, spacje przed znakami, puste nawiasy
pn = pn.replace(/[ \t]{2,}/g, ' ');
pn = pn.replace(/\s+([,.;:!?])/g, '$1');
pn = pn.replace(/\(\s*\)/g, '');
pn = pn.replace(/\(\s*[—–]\s*\)/g, '');

// Naprawa uciętych wpisów: te które kończą się "(...przez '" - dodaj zakończenie
const truncatedRe = /(d:'[^']*?\([^)']*?)\s*'/g;
let truncFixed = 0;
pn = pn.replace(truncatedRe, (full) => {
  // Sprawdź czy zawiera otwarty nawias bez zamkniętego
  const dStart = full.indexOf("d:'");
  const content = full.substring(dStart+3, full.length-1);
  const opens = (content.match(/\(/g)||[]).length;
  const closes = (content.match(/\)/g)||[]).length;
  if(opens > closes){
    truncFixed++;
    return full.replace(/\s*'$/, ").'");
  }
  return full;
});

s = s.substring(0, startIdx) + pn + s.substring(endIdx);
fs.writeFileSync('index.html', s, 'utf8');
console.log(`${n} kategorii zamian. ${truncFixed} uciętych nawiasów naprawionych.`);
console.log(`Rozmiar: ${orig} → ${pn.length}`);
