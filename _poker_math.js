// Poker 5-Card Draw — dokładny math
// Player dostaje 5 kart, decyduje co zatrzymać, reszta wymieniana z deck.
// Z 52 kart -5 = 47 zostaje, gracz może wymienić 0-5 kart.
// W teorii optimal strategy (Jacks or Better video poker):
// PAYTABLE: royal=800, str_flush=50, four=25, full=9, flush=6, str=4, three=3, two_pair=2, pair_jacks=1
// Klasyczny "9/6 Jacks or Better" — RTP 99.54% (HE 0.46%)
//
// Moje payouts vs klasyczny:
// Royal: 800 = standard
// Str. flush: 50 = standard
// Four: 25 = standard
// Full: 9 = standard (9 to "9" w "9/6")
// Flush: 6 = standard (6 to "6" w "9/6")
// Straight: 4 = standard
// Three: 3 = standard
// Two pair: 2 = standard
// Pair J+: 1 = standard
//
// → Klasyczny 9/6 Jacks or Better = HE 0.46% przy OPTYMALNEJ strategii hold.
// Casual play (gracz nie zna optimal strategy): HE ~5-15%.
//
// Sprawdzenie podstawowych statystyk hand frequency (NO HOLDS — just deal 5 cards from 52):
// Te liczby pochodzą z combinatoryki (5-card hand z 52-card deck):
const C = (n,k) => {if(k<0||k>n)return 0;let r=1;for(let i=0;i<k;i++)r=r*(n-i)/(i+1);return r;};
const total = C(52,5);
console.log('Total 5-card hands:', total);

const royalFlush = 4; // 4 kolory, każdy 10-A
const strFlush = 36; // 4 * 9 (excluding royal)
const fourKind = 624; // 13 * 48
const fullHouse = 3744;
const flush = 5108;
const straight = 10200;
const threeKind = 54912;
const twoPair = 123552;
const onePair = 1098240; // all pairs (J+ to subset)
const pair_jacks = 1098240 * (4/13); // approx — pairs of J,Q,K,A = 4/13 of all pairs. Actually = C(4,2)*4kinds * remaining hands... uproszczenie
const high = 1302540;

console.log('Hand probabilities (no holds, raw deal):');
console.log('  Royal Flush:', (royalFlush/total*100).toFixed(6)+'% =', (royalFlush/total).toFixed(8));
console.log('  Str Flush:  ', (strFlush/total*100).toFixed(5)+'%');
console.log('  Four kind:  ', (fourKind/total*100).toFixed(4)+'%');
console.log('  Full House: ', (fullHouse/total*100).toFixed(3)+'%');
console.log('  Flush:      ', (flush/total*100).toFixed(3)+'%');
console.log('  Straight:   ', (straight/total*100).toFixed(3)+'%');
console.log('  Three kind: ', (threeKind/total*100).toFixed(3)+'%');
console.log('  Two pair:   ', (twoPair/total*100).toFixed(3)+'%');
console.log('  Pair (all): ', (onePair/total*100).toFixed(3)+'%');
console.log('');

// EV przy NO HOLD (gracz nigdy nie wymienia kart — najgorszy scenariusz):
const evNoHold = (royalFlush*800 + strFlush*50 + fourKind*25 + fullHouse*9 + flush*6 + straight*4 + threeKind*3 + twoPair*2 + pair_jacks*1) / total;
console.log('EV (no hold, gracz nigdy nie wymienia):', evNoHold.toFixed(4), '(HE ' + ((1-evNoHold)*100).toFixed(2) + '%)');

// W naszej grze gracz MOŻE wymieniać — czyli realnie EV będzie wyższe.
// Klasyczny 9/6 Jacks or Better z optimal play: 99.54%
// Casual play: ~85-95%
console.log('');
console.log('REAL EV dla naszego pokera:');
console.log('  Z optimal play: 99.54% (HE 0.46%)');
console.log('  Z casual play:  ~85-95% (HE 5-15%)');
console.log('  Casino EV: zdrowy edge');
