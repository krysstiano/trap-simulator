// CRAPS House Edge audit - all 3 bet types po fix v2.0.6+v2.0.7
console.log('CRAPS HOUSE EDGE — wszystkie zakłady po fix');
console.log('============================================\n');

// ========== PASS LINE ==========
// P(win) = come-out natural (7,11) + point win
// Natural 7,11: (6+2)/36 = 8/36
// Point 4 (3/36): P(4 before 7) = 3/(3+6) = 1/3
// Point 10 (3/36): same = 1/3
// Point 5 (4/36): 4/(4+6) = 0.4
// Point 9: 0.4
// Point 6 (5/36): 5/11
// Point 8: 5/11
const pPassWin = 8/36 + 2*(3/36)*(1/3) + 2*(4/36)*(0.4) + 2*(5/36)*(5/11);
const evPass = pPassWin * 2; // 2x payout (bet + winnings)
const hePass = (1-evPass)*100;
console.log('PASS LINE:');
console.log('  P(win) = ' + (pPassWin*100).toFixed(2) + '%');
console.log('  EV = ' + evPass.toFixed(4) + ' → HE = ' + hePass.toFixed(2) + '%');

// ========== DON'T PASS ==========
// P(win) = come-out 2,3 (3/36) + point lose (gracz wygrywa gdy 7 before point)
// Plus push przy 12 (1/36) — zwrot stawki, NIE win ani loss
const pDontWin = 3/36 + 2*(3/36)*(6/9) + 2*(4/36)*(6/10) + 2*(5/36)*(6/11);
const pDontPush = 1/36;
const evDont = pDontWin * 2 + pDontPush * 1; // wins 2x, push zwrot 1x
const heDont = (1-evDont)*100;
console.log('\nDON\'T PASS:');
console.log('  P(win) = ' + (pDontWin*100).toFixed(2) + '%, P(push 12) = ' + (pDontPush*100).toFixed(2) + '%');
console.log('  EV = ' + evDont.toFixed(4) + ' → HE = ' + heDont.toFixed(2) + '%');

// ========== FIELD (po fix v2.0.6) ==========
// 2 i 12: 3× payout (2:1 odds), prob 1/36 każdy
// 3, 4, 9, 10, 11: 2× payout (1:1 odds)
//   P(3)=2/36, P(4)=3/36, P(9)=4/36, P(10)=3/36, P(11)=2/36 → 14/36 total
// 5, 6, 7, 8: lose
//   P(5)=4/36, P(6)=5/36, P(7)=6/36, P(8)=5/36 → 20/36
const evField = (1/36)*3 + (1/36)*3 + (2/36)*2 + (3/36)*2 + (4/36)*2 + (3/36)*2 + (2/36)*2;
const heField = (1-evField)*100;
const winProb = 16/36; // 2,3,4,9,10,11,12
console.log('\nFIELD (po fix v2.0.6):');
console.log('  P(win) = ' + (winProb*100).toFixed(2) + '%, P(loss) = ' + ((20/36)*100).toFixed(2) + '%');
console.log('  EV = ' + evField.toFixed(4) + ' → HE = ' + heField.toFixed(2) + '%');

console.log('\n=== PODSUMOWANIE CRAPS HE ===');
console.log('  PASS LINE:  ' + hePass.toFixed(2) + '%');
console.log('  DON\'T PASS: ' + heDont.toFixed(2) + '%');
console.log('  FIELD:      ' + heField.toFixed(2) + '%');
console.log('  Średnia (jeśli równo): ' + ((hePass+heDont+heField)/3).toFixed(2) + '%');
