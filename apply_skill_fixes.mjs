/* Aplikuje fixy drzewka umiejętności z RAPORT_DRZEWKO_AUDYT.md.
   Każda para [old, new] jest unikalna w index.html (sprawdzone w raporcie). */
import fs from 'fs';

const SRC = 'E:/Snowy Simulator/index.html';
let html = fs.readFileSync(SRC, 'utf8');

const fixes = [
  /* ── 1-10: PU3 "+100%" → "+90%" + dodanie jednostek do PU2 dla 10 skilli z mnożnikiem *0.30 ── */
  ["_PU('Mistrz ciasta (+30% zarobki)', 'Sekret sosu (+60%)', 'Włoska szkoła (+100%)')",
   "_PU('Mistrz ciasta (+30% zarobki)', 'Sekret sosu (+60% zarobki)', 'Włoska szkoła (+90% zarobki)')"],
  ["_PU('Szybkie ręce (+30% zarobki)', 'Pamięć cenowa (+60%)', 'Niezawodność (+100%)')",
   "_PU('Szybkie ręce (+30% zarobki)', 'Pamięć cenowa (+60% zarobki)', 'Niezawodność (+90% zarobki)')"],
  ["_PU('Mikrofibra (+30% zarobki)', 'Polerka (+60%)', 'Wax pro (+100%)')",
   "_PU('Mikrofibra (+30% zarobki)', 'Polerka (+60% zarobki)', 'Wax pro (+90% zarobki)')"],
  ["_PU('Solidny chwyt (+30% zarobki)', 'Murarz (+60%)', 'Stalowy bicep (+100%)')",
   "_PU('Solidny chwyt (+30% zarobki)', 'Murarz (+60% zarobki)', 'Stalowy bicep (+90% zarobki)')"],
  ["_PU('Lekki rower (+30% zarobki)', 'Skróty (+60%)', 'Pełna torba (+100%)')",
   "_PU('Lekki rower (+30% zarobki)', 'Skróty (+60% zarobki)', 'Pełna torba (+90% zarobki)')"],
  ["_PU('Zręczne ręce (+30% zarobki)', 'Sztuka piany (+60%)', 'Mistrz higieny (+100%)')",
   "_PU('Zręczne ręce (+30% zarobki)', 'Sztuka piany (+60% zarobki)', 'Mistrz higieny (+90% zarobki)')"],
  ["_PU('Sample bank (+30% sprzedaż)', 'Mixing pro (+60%)', 'Mastering (+100%)')",
   "_PU('Sample bank (+30% sprzedaż)', 'Mixing pro (+60% sprzedaż)', 'Mastering (+90% sprzedaż)')"],
  ["_PU('APM trening (+30% wygranych)', 'Strategia (+60%)', 'Pro setup (+100%)')",
   "_PU('APM trening (+30% wygranych)', 'Strategia (+60% wygranych)', 'Pro setup (+90% wygranych)')"],
  ["_PU('Hashtagi (+30% engagement)', 'Trendy (+60%)', 'Storytelling (+100%)')",
   "_PU('Hashtagi (+30% engagement)', 'Trendy (+60% engagement)', 'Storytelling (+90% engagement)')"],
  ["_PU('Equalizer pro (+30% projekty)', 'Studio acoustic (+60%)', 'Multi-track (+100%)')",
   "_PU('Equalizer pro (+30% projekty)', 'Studio acoustic (+60% projekty)', 'Multi-track (+90% projekty)')"],

  /* ── 11: youtuber PU2 jednostka ── */
  ["_PU('Thumbnail mistrz (+30% views)', 'Tytuły clickbait (+60%)', 'Algorytm pet (+90%)')",
   "_PU('Thumbnail mistrz (+30% views)', 'Tytuły clickbait (+60% views)', 'Algorytm pet (+90% views)')"],

  /* ── 12: kondycja PU jednostka "energii" ── */
  ["_PU('Wytrzymałość (-3% extra)', 'Druga moc (-6%)', 'Niewyczerpany (-10%)')",
   "_PU('Wytrzymałość (-3% energii)', 'Druga moc (-6% energii)', 'Niewyczerpany (-10% energii)')"],

  /* ── 13: apetyt — dodać "głodu" do PU2/PU3 ── */
  ["_PU('Wolniejszy metabolizm (-15%)', 'Oszczędne trawienie (-30%)', 'Mistrz głodu (-45%)')",
   "_PU('Wolniejszy metabolizm (-15% głodu)', 'Oszczędne trawienie (-30% głodu)', 'Mistrz głodu (-45% głodu)')"],

  /* ── 14: odporność — dodać "obrażeń" ── */
  ["_PU('Twardy charakter (-20% extra)', 'Stalowe nerwy (-40%)', 'Nieczuły na ból (-60%)')",
   "_PU('Twardy charakter (-20% obrażeń)', 'Stalowe nerwy (-40% obrażeń)', 'Nieczuły na ból (-60% obrażeń)')"],

  /* ── 15: charyzma — "zarobki z NPC" do każdego PU ── */
  ["_PU('Pewny uśmiech (+30%)', 'Magnetyzm (+60%)', 'Niezapomniany (+90%)')",
   "_PU('Pewny uśmiech (+30% zarobki NPC)', 'Magnetyzm (+60% zarobki NPC)', 'Niezapomniany (+90% zarobki NPC)')"],

  /* ── 16: czytanie — "XP" do PU2/PU3 (user-quoted!) ── */
  ["_PU('Notatki (+15% XP)', 'Spis treści (+30%)', 'Szybkie czytanie (+45%)')",
   "_PU('Notatki (+15% XP)', 'Spis treści (+30% XP)', 'Szybkie czytanie (+45% XP)')"],

  /* ── 17: kreatywnosc — "jakość" do PU2/PU3 (user-quoted!) ── */
  ["_PU('Iskra (+15% jakość)', 'Wena (+30%)', 'Geniusz (+45%)')",
   "_PU('Iskra (+15% jakość)', 'Wena (+30% jakość)', 'Geniusz (+45% jakość)')"],

  /* ── 18: logika — "zarobki" ── */
  ["_PU('Algorytm (+15% zarobki)', 'Optymalizacja (+30%)', 'Strategia (+45%)')",
   "_PU('Algorytm (+15% zarobki)', 'Optymalizacja (+30% zarobki)', 'Strategia (+45% zarobki)')"],

  /* ── 19: skupienie — wszystkie 3 PU bez jednostki ── */
  ["_PU('Koncentracja (+15%)', 'Flow state (+30%)', 'Zero rozproszeń (+45%)')",
   "_PU('Koncentracja (+15% jakość)', 'Flow state (+30% jakość)', 'Zero rozproszeń (+45% jakość)')"],

  /* ── 20: negocjacje — "cen" ── */
  ["_PU('Twardy negocjator (-10% extra)', 'Mistrz handlu (-20%)', 'Kupiec roku (-30%)')",
   "_PU('Twardy negocjator (-10% cen)', 'Mistrz handlu (-20% cen)', 'Kupiec roku (-30% cen)')"],

  /* ── 21: inwestycje — "zwrot" ── */
  ["_PU('Dywersyfikacja (+15% zwrot)', 'Analiza techniczna (+30%)', 'Insider tip (+45%)')",
   "_PU('Dywersyfikacja (+15% zwrot)', 'Analiza techniczna (+30% zwrot)', 'Insider tip (+45% zwrot)')"],

  /* ── 22: hazard — "szansa" ── */
  ["_PU('Hot streak (+20% szansa)', 'Lucky charm (+40%)', 'House always wins (+60%)')",
   "_PU('Hot streak (+20% szansa)', 'Lucky charm (+40% szansa)', 'House always wins (+60% szansa)')"],

  /* ── 23: networking — "kontaktów" ── */
  ["_PU('Wymiana wizytówek (+1 kontakt extra)', 'LinkedIn pro (+2)', 'Insider network (+3)')",
   "_PU('Wymiana wizytówek (+1 kontakt)', 'LinkedIn pro (+2 kontakty)', 'Insider network (+3 kontakty)')"],

  /* ── 24: drip_master — "sława" ── */
  ["_PU('Akcesoria (+30% sława)', 'Designer brand (+60%)', 'Limited edition (+90%)')",
   "_PU('Akcesoria (+30% sława)', 'Designer brand (+60% sława)', 'Limited edition (+90% sława)')"],

  /* ── 25: scena — "zarobki" ── */
  ["_PU('Charisma (+15% zarobki)', 'Pyrotechnika (+30%)', 'Encore (+45%)')",
   "_PU('Charisma (+15% zarobki)', 'Pyrotechnika (+30% zarobki)', 'Encore (+45% zarobki)')"],

  /* ── 26: flow — "score" ── */
  ["_PU('Pewne rymy (+15% score)', 'Multisylaby (+30%)', 'Nieskrępowany flow (+45%)')",
   "_PU('Pewne rymy (+15% score)', 'Multisylaby (+30% score)', 'Nieskrępowany flow (+45% score)')"],

  /* ── 27: foto — "zasięg" ── */
  ["_PU('Naturalne światło (+15% zasięg)', 'Filtry pro (+30%)', 'Studio backdrop (+45%)')",
   "_PU('Naturalne światło (+15% zasięg)', 'Filtry pro (+30% zasięg)', 'Studio backdrop (+45% zasięg)')"],

  /* ── 28: sila — "forma" ── */
  ["_PU('Eksplozywność (+15% forma)', 'Hipertrofia (+30%)', 'Stalowa siła (+45%)')",
   "_PU('Eksplozywność (+15% forma)', 'Hipertrofia (+30% forma)', 'Stalowa siła (+45% forma)')"],

  /* ── 29: bieg — "prędkość" ── */
  ["_PU('Wytrwałość (+10% prędkość)', 'Drugi oddech (+20%)', 'Maratończyk (+30%)')",
   "_PU('Wytrwałość (+10% prędkość)', 'Drugi oddech (+20% prędkość)', 'Maratończyk (+30% prędkość)')"],

  /* ── 30: medytacja — "regen" ── */
  ["_PU('Spokojny sen (+15% regen)', 'Głęboka faza (+30%)', 'REM mistrz (+45%)')",
   "_PU('Spokojny sen (+15% regen)', 'Głęboka faza (+30% regen)', 'REM mistrz (+45% regen)')"],

  /* ── 31: dieta — "energia" ── */
  ["_PU('Witaminy (+15% energia)', 'Białko premium (+30%)', 'Superfood (+45%)')",
   "_PU('Witaminy (+15% energia)', 'Białko premium (+30% energia)', 'Superfood (+45% energia)')"],

  /* ── 32: KRYTYCZNE — kondycja PU ghost fix (dodaj _pu do kondMult) ── */
  ["const kondLvl=(G.skills&&getSkillLvl('kondycja')||0);\n  const kondMult=1-(kondLvl*0.08); // Główne drzewko: -8% spadku energii / pkt",
   "const kondLvl=(G.skills&&getSkillLvl('kondycja')||0);\n  // v2.1.29: kondycja PU faktycznie aplikowane (wcześniej GHOST). PU1=-3, PU2=-6, PU3=-10 → kumulacja -19%\n  const kondPU=(typeof _pu==='function'?_pu('kondycja'):0);\n  const kondPUBonus=kondPU>=3?0.19:(kondPU===2?0.09:(kondPU===1?0.03:0));\n  const kondMult=1-(kondLvl*0.08)-kondPUBonus; // Główne drzewko: -8% spadku energii / pkt + PU"],

  /* ── 33: dieta evo — opis dopasować do kodu (NIE kumulacja, stały +5) ── */
  ["evolution:_EVO('Nutricionist', 'Każde gotowanie daje +5 do max formy (do +25)')",
   "evolution:_EVO('Nutricionist', '+5 do max formy (105 zamiast 100)')"],

  /* ── 34: charyzma evo — usuń "sami proponują zlecenia" (ghost) ── */
  ["evolution:_EVO('Magnetyzm', 'NPC dają 2× większe napiwki + sami proponują zlecenia')",
   "evolution:_EVO('Magnetyzm', 'NPC dają 2× większe napiwki')"],

  /* ── 35: youtuber evo — usuń "+50% views startowych" (ghost) ── */
  ["evolution:_EVO('Algorithm Master', 'Pasywny dochód 1200 zł / dzień + każdy nowy film +50% views startowych', 50000)",
   "evolution:_EVO('Algorithm Master', 'Pasywny dochód 1200 zł / dzień', 50000)"],

  /* ── 36: drip_master evo — usuń "+50% sławy z luxury" (ghost) ── */
  ["evolution:_EVO('Trendsetter', 'Wszystkie ubrania -20% ceny + +50% sławy z luxury')",
   "evolution:_EVO('Trendsetter', 'Wszystkie ubrania -20% ceny')"],

  /* ── 37: drip_master desc — opis mylący ── */
  ["drip_master: {label:'Drip Master',max:5,cat:'styl',desc:'Większa sława z noszonych outfitów',emoji:'💎'",
   "drip_master: {label:'Drip Master',max:5,cat:'styl',desc:'Większa sława przy pierwszym założeniu nowego outfitu',emoji:'💎'"],

  /* ── 39: komentarz _PU (linia 1184) ── */
  ["Power-ups daja BAZOWE +30/+60/+100%",
   "Power-ups daja BAZOWE +30/+60/+90% (PU_STEP=0.30 × count, max count=3)"],
];

let applied = 0, failed = [];
for(let i=0;i<fixes.length;i++){
  const [oldS, newS] = fixes[i];
  const before = html;
  html = html.split(oldS).join(newS);
  if(html === before) failed.push({i:i+1, old: oldS.slice(0,70)+'...'});
  else applied++;
}

fs.writeFileSync(SRC, html);
console.log(`Applied: ${applied}/${fixes.length}`);
if(failed.length){
  console.log(`FAILED matches:`);
  failed.forEach(f => console.log(`  #${f.i}: ${f.old}`));
}
