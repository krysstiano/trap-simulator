// v2.0.12 — weryfikacja math slotów po redesign
// Sprawdza EV regular i VIP, oraz win frequency.

const SYMBOLS_REGULAR=[
  {s:'🍒',prob:25,pay3:7,  pay2:0   },
  {s:'🍋',prob:22,pay3:12, pay2:0   },
  {s:'🍇',prob:20,pay3:20, pay2:0.4 },
  {s:'7️⃣',prob:18,pay3:37, pay2:0.6 },
  {s:'💎',prob:15,pay3:60, pay2:1.0 },
];
const SYMBOLS_VIP=[
  {s:'🍒',prob:25,pay3:7,  pay2:0.04},
  {s:'🍋',prob:22,pay3:12, pay2:0.08},
  {s:'🍇',prob:20,pay3:20, pay2:0.4 },
  {s:'7️⃣',prob:18,pay3:37, pay2:0.65},
  {s:'💎',prob:15,pay3:60, pay2:1.1 },
];

function analyze(name, SYMBOLS){
  const total=SYMBOLS.reduce((a,b)=>a+b.prob,0);
  let ev3=0, ev2=0, freq3=0, freq2=0;
  for(const s of SYMBOLS){
    const p=s.prob/total;
    const p3=p*p*p;
    const p2=3*p*p*(1-p);
    ev3 += p3 * s.pay3;
    if(s.pay2>0){
      ev2 += p2 * s.pay2;
      freq2 += p2;
    }
    freq3 += p3;
  }
  const ev=ev3+ev2;
  const he=(1-ev)*100;
  const freq=freq3+freq2;
  console.log(`=== ${name} ===`);
  console.log(`  EV 3-of-kind: ${ev3.toFixed(4)}`);
  console.log(`  EV 2-of-kind: ${ev2.toFixed(4)}`);
  console.log(`  TOTAL EV: ${ev.toFixed(4)}`);
  console.log(`  HE: ${he.toFixed(2)}%`);
  console.log(`  Win frequency: ${(freq*100).toFixed(2)}% (3-of-kind ${(freq3*100).toFixed(2)}% + 2-of-kind ${(freq2*100).toFixed(2)}%)`);
  console.log(`  Average spin: 1 win per ${(1/freq).toFixed(2)} spins`);
  console.log(`  STATUS: ${ev<1?'OK (kasyno zarabia)':'PLAYER EXPLOIT!'}\n`);
}

console.log('SLOTY v2.0.12 — weryfikacja math\n');
analyze('REGULAR (parter)', SYMBOLS_REGULAR);
analyze('VIP (1 piętro)', SYMBOLS_VIP);

// Porównanie z poprzednim systemem
console.log('=== Poprzedni system (v2.0.11) ===');
const OLD_SYMBOLS=[5,7,10,18,70];
let oldEV=0;
for(const p of OLD_SYMBOLS) oldEV += (1/125)*p;
oldEV += (1/125)*10; // jackpot bonus bet*10
console.log(`  OLD Regular EV: ${oldEV.toFixed(4)} (HE ${((1-oldEV)*100).toFixed(2)}%)`);
const oldVipEV = (5+7+10+18+70)/125 + (1/125)*10*1.4;
console.log(`  OLD VIP EV: ${oldVipEV.toFixed(4)} (HE ${((1-oldVipEV)*100).toFixed(2)}%)`);
console.log(`  OLD Win frequency: ${(5/125*100).toFixed(2)}% (4% — co 25 spinów coś)\n`);
