// AUDYT MATH WSZYSTKICH GIER KASYNOWYCH
console.log('===============================================================');
console.log('  AUDYT MATH WSZYSTKICH GIER KASYNOWYCH (Trap Simulator)');
console.log('  EV < 1.0 = house edge OK (kasyno zarabia)');
console.log('  EV > 1.0 = PLAYER EXPLOIT (gracz zarabia w długim run)');
console.log('  Cel: EV 0.85-0.97 (house edge 3-15%)');
console.log('===============================================================\n');

// =====================================================
// 1. SLOTS
// =====================================================
console.log('=== 1. SLOTY (3 bebny, 5 symboli) ===');
// SYMBOLS payouts: cherry=5, lemon=7, grape=10, 7=18, diamond=70
// 3 takie same = wygrana. Każdy bęben uniform 1/5 symbol.
const SLOTS_PAYS=[5,7,10,18,70];
let slotsEV = 0;
for(const pay of SLOTS_PAYS){
  // P(3 takie same dla danego symbolu) = (1/5)^3 = 1/125
  const prob = 1/125;
  slotsEV += prob*pay;
  console.log('  3x ' + pay + 'x: prob=' + (prob*100).toFixed(2) + '%, EV=' + (prob*pay).toFixed(4));
}
console.log('  TOTAL EV (no bonus) = ' + slotsEV.toFixed(4) + ' (HE ' + ((1-slotsEV)*100).toFixed(2) + '%)');
console.log('  Plus diament bonus 10x stawki (cinematic) - dodaje 1/125 * 10 = 0.08');
const slotsFinalEV = slotsEV + 1/125 * 10;
console.log('  Z bonusem: EV = ' + slotsFinalEV.toFixed(4) + ' (HE ' + ((1-slotsFinalEV)*100).toFixed(2) + '%)');
console.log(slotsFinalEV<1 ? '  STATUS: OK (kasyno zarabia)' : '  STATUS: PLAYER EXPLOIT!\n');

// =====================================================
// 2. RULETKA (37 pól European)
// =====================================================
console.log('\n=== 2. RULETKA European 37 pól ===');
const rTypes = [
  {n:'red/black', prob:18/37, mul:2},
  {n:'even/odd', prob:18/37, mul:2},
  {n:'low/high', prob:18/37, mul:2},
  {n:'single number', prob:1/37, mul:36},
  {n:'zero (green)', prob:1/37, mul:36},
];
for(const t of rTypes){
  const ev = t.prob*t.mul;
  console.log('  ' + t.n + ': prob=' + (t.prob*100).toFixed(2) + '%, mul=' + t.mul + 'x, EV=' + ev.toFixed(4) + ' (HE ' + ((1-ev)*100).toFixed(2) + '%)');
}
console.log('  STATUS: European roulette standard, single 0 = 2.70% HE on color bets');

// =====================================================
// 3. WAR
// =====================================================
console.log('\n=== 3. WAR (1-vs-1) ===');
const tieProb = 13*(4/52)*(3/51);
const winProb = (1-tieProb)/2;
console.log('  P(remis) = ' + tieProb.toFixed(4) + ' (' + (tieProb*100).toFixed(2) + '%)');
console.log('  P(player wins outright) = ' + winProb.toFixed(4));
const warEV_surrender = winProb*2 + tieProb*0.5;
console.log('  EV przy zawsze-rezygnacja w remis: ' + warEV_surrender.toFixed(4) + ' (HE ' + ((1-warEV_surrender)*100).toFixed(2) + '%)');
// Wojna: stawia 2x bet, wygrywa 3x bet (czyli odzyskuje +1 bet over total commitment 2x)
// W kodzie: refund original 0.5x + 3x extra = 3.5x; loss = -1x (poszedł na 2x but stracił)
// Wartości payout w grze:
//   Tie + war won: gracz dostał refund pierwszej stawki (0.5x) + 3x extra = total 3.5x. Net = +2.5x stawki względem 2x committed.
//   Albo lepiej: efektywnie wygrał 3x extra bet = +3x bet. Cost = 2x bet (oryginalny + extra). Profit = +1x bet.
// To analiza wyższego poziomu, klasyczny WAR ma HE ~2.88% z optimal strategy.
console.log('  STATUS: Z grą war i optymalną strategią ~2.88% HE (klasyczny WAR)');

// =====================================================
// 4. WHEEL OF FORTUNE
// =====================================================
console.log('\n=== 4. KOŁO FORTUNY (16 segmentów) ===');
const SEGMENTS=[0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,2];
const wheelSum = SEGMENTS.reduce((a,b)=>a+b,0);
const wheelEV = wheelSum/16;
console.log('  Segmenty: ' + SEGMENTS.join(','));
console.log('  Liczność: 0x=' + SEGMENTS.filter(x=>x===0).length + ', 1x=' + SEGMENTS.filter(x=>x===1).length + ', 2x=' + SEGMENTS.filter(x=>x===2).length + ', 5x=' + SEGMENTS.filter(x=>x===5).length);
console.log('  Suma: ' + wheelSum + '/16 = EV ' + wheelEV.toFixed(4) + ' (HE ' + ((1-wheelEV)*100).toFixed(2) + '%)');
console.log(wheelEV<1 ? '  STATUS: OK' : '  STATUS: EXPLOIT!');

// =====================================================
// 5. PLINKO
// =====================================================
console.log('\n=== 5. PLINKO ===');
const PLINKO_SLOTS=[20,4,1.5,0.5,0.2,0.5,1.5,4,20];
const ROWS = 12;
function binom(n,k){let r=1;for(let i=0;i<k;i++)r=r*(n-i)/(i+1);return r;}
const probsByPos = [];
for(let lefts=0; lefts<=ROWS; lefts++){
  const pos = ROWS - 2*lefts;
  const p = binom(ROWS,lefts) * Math.pow(0.5, ROWS);
  probsByPos.push({pos, p});
}
const slotProbs = new Array(PLINKO_SLOTS.length).fill(0);
for(const ent of probsByPos){
  const slotIdx = Math.max(0, Math.min(PLINKO_SLOTS.length-1, Math.floor((ent.pos+ROWS)/(2*ROWS/PLINKO_SLOTS.length))));
  slotProbs[slotIdx] += ent.p;
}
let plinkoEV = 0;
for(let i=0;i<PLINKO_SLOTS.length;i++){
  const contrib = slotProbs[i]*PLINKO_SLOTS[i];
  plinkoEV += contrib;
  console.log('  Slot ' + i + ' (' + PLINKO_SLOTS[i] + 'x): prob=' + (slotProbs[i]*100).toFixed(3) + '%, EV=' + contrib.toFixed(4));
}
console.log('  TOTAL EV = ' + plinkoEV.toFixed(4) + ' (HE ' + ((1-plinkoEV)*100).toFixed(2) + '%)');
console.log(plinkoEV<1 ? '  STATUS: OK' : '  STATUS: EXPLOIT!');

// =====================================================
// 6. KENO
// =====================================================
console.log('\n=== 6. KENO ===');
function C(n,k){if(k<0||k>n)return 0;let r=1;for(let i=0;i<k;i++)r=r*(n-i)/(i+1);return r;}
function hypergeom(n,k){return C(20,k)*C(60,n-k)/C(80,n);}
const KENO_PAYOUT={
  4:{4:90,3:5,2:1},
  5:{5:400,4:18,3:3},
  6:{6:1000,5:80,4:5,3:1},
  7:{7:1000,6:200,5:20,4:3,3:1},
  8:{8:1000,7:500,6:50,5:10,4:2},
  9:{9:1000,8:500,7:80,6:15,5:3},
  10:{10:1000,9:500,8:100,7:25,6:5,5:2},
};
for(let n=4;n<=10;n++){
  let evK=0;
  for(let k=0;k<=n;k++){
    const prob=hypergeom(n,k);
    const pay=KENO_PAYOUT[n][k]||0;
    evK += prob*pay;
  }
  const status = evK<1 ? 'OK' : 'EXPLOIT!';
  console.log('  Pick ' + n + ': EV=' + evK.toFixed(4) + ' (HE ' + ((1-evK)*100).toFixed(2) + '%) ' + status);
}

// =====================================================
// 7. BACCARAT
// =====================================================
console.log('\n=== 7. BACCARAT ===');
const P_PLAYER = 0.4462, P_BANKER = 0.4586, P_TIE = 0.0952;
const EV_player = P_PLAYER*1.95 + P_TIE*1.0;
const EV_banker = P_BANKER*1.9 + P_TIE*1.0;
const EV_tie = P_TIE*8;
console.log('  PLAYER bet (1.95x): EV=' + EV_player.toFixed(4) + ' (HE ' + ((1-EV_player)*100).toFixed(2) + '%)');
console.log('  BANKER bet (1.9x):  EV=' + EV_banker.toFixed(4) + ' (HE ' + ((1-EV_banker)*100).toFixed(2) + '%)');
console.log('  TIE bet (8x):       EV=' + EV_tie.toFixed(4) + ' (HE ' + ((1-EV_tie)*100).toFixed(2) + '%)');

// =====================================================
// 8. CRAPS
// =====================================================
console.log('\n=== 8. CRAPS ===');
const realPass = 8/36 + (2*3/36)*(3/9) + (2*4/36)*(4/10) + (2*5/36)*(5/11);
console.log('  PASS LINE win prob: ' + realPass.toFixed(4) + ' (' + (realPass*100).toFixed(2) + '%)');
const EV_pass = realPass*2;
console.log('  EV PASS (2x): ' + EV_pass.toFixed(4) + ' (HE ' + ((1-EV_pass)*100).toFixed(2) + '%)');
// FIELD: 7 numbers win (2,3,4,9,10,11,12), 4 numbers lose (5,6,7,8)
// W kodzie: 2 i 12 pay 3x, reszta 1.5x (czyli 2.5x w mojej formule co dziwne - sprawdzam)
// Patrzac na _crapsRoll: 'FIELD ' + sum + ' → +(payout-bet)' gdzie payout=bet*3 dla sum=2 lub 12, payout=Math.floor(bet*2.5) dla reszty
// Czyli mul=3 dla 2/12, mul=2.5 dla 3/4/9/10/11
const EV_field = (1/36)*3 + (1/36)*3 + (2/36)*2.5 + (3/36)*2.5 + (4/36)*2.5 + (3/36)*2.5 + (2/36)*2.5;
console.log('  EV FIELD: ' + EV_field.toFixed(4) + ' (HE ' + ((1-EV_field)*100).toFixed(2) + '%)');
if(EV_field>1) console.log('  WARNING: FIELD EV > 1 - PLAYER EXPLOIT!');

// =====================================================
// 9. POKER 5-CARD DRAW
// =====================================================
console.log('\n=== 9. POKER 5-CARD DRAW (Video Poker) ===');
console.log('  Theoretical RTP with optimal strategy: ~95-99% w klasycznym poker. Wymaga symulacji.');
console.log('  Approximate breakdown:');
console.log('    Royal: 0.0025% x 800 = 0.020');
console.log('    Straight flush: 0.0109% x 50 = 0.0055');
console.log('    Four kind: 0.168% x 25 = 0.042');
console.log('    Full: 1.151% x 9 = 0.1036');
console.log('    Flush: 1.103% x 6 = 0.0662');
console.log('    Straight: 1.123% x 4 = 0.0449');
console.log('    Three: 7.45% x 3 = 0.2236');
console.log('    Two pair: 12.93% x 2 = 0.2585');
console.log('    Pair J+: 21.46% x 1 = 0.2146');
const pokerEV = 0.020+0.0055+0.042+0.1036+0.0662+0.0449+0.2236+0.2585+0.2146;
console.log('  TOTAL APPROX EV = ' + pokerEV.toFixed(4) + ' (HE ' + ((1-pokerEV)*100).toFixed(2) + '%)');

console.log('\n===============================================================');
console.log('  KONIEC AUDYTU');
console.log('===============================================================');
