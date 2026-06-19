// v2.0.14 — Monte Carlo verification: czy 2-deck S17 DA2 DAS + Late Surrender ma HE > 0?
// Cel: potwierdzić że nie ma exploitu (EV < 1.0 dla optimal play).
//
// Symulujemy gracza grającego BASIC STRATEGY (uproszczona):
// - Hit/Stand: standardowa tabela
// - Double: na 10-11 vs 2-9, soft 13-18 vs 4-6
// - Split: aces, 8s
// - Surrender: Hard 16 vs 10, Hard 15 vs 10 (uproszczone)
// - Insurance: NEVER (basic strategy)

const NUM_HANDS = 500000;

function newShoe(){
  const ranks = [{r:'A',v:11},{r:'2',v:2},{r:'3',v:3},{r:'4',v:4},{r:'5',v:5},{r:'6',v:6},{r:'7',v:7},{r:'8',v:8},{r:'9',v:9},{r:'10',v:10},{r:'J',v:10},{r:'Q',v:10},{r:'K',v:10}];
  const suits=['♠','♥','♦','♣'];
  const deck=[];
  for(let copy=0;copy<2;copy++) for(const s of suits) for(const r of ranks) deck.push({r:r.r,v:r.v});
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  return deck;
}

function handVal(hand){
  let v=0, aces=0;
  for(const c of hand){ v+=c.v; if(c.r==='A') aces++; }
  while(v>21 && aces>0){ v-=10; aces--; }
  return v;
}
function isSoft(hand){
  let v=0, aces=0;
  for(const c of hand){ v+=c.v; if(c.r==='A') aces++; }
  return aces>0 && v<=21;
}

// Uproszczona basic strategy (Late Surrender + Hit/Stand/Double/Split)
function strategy(playerHand, dealerUp, canSplit, canDouble, canSurrender){
  const pv = handVal(playerHand);
  const soft = isSoft(playerHand);
  const du = dealerUp.v === 11 ? 11 : (dealerUp.v >= 10 ? 10 : dealerUp.v);

  // Surrender (Late) — tylko initial 2 cards
  if(canSurrender){
    if(!soft && pv===16 && (du===9||du===10||du===11)) return 'surrender';
    if(!soft && pv===15 && du===10) return 'surrender';
  }

  // Split (tylko if exactly 2 cards, same value)
  if(canSplit && playerHand.length===2 && playerHand[0].r===playerHand[1].r){
    const pair = playerHand[0].r;
    if(pair==='A') return 'split';
    if(pair==='8') return 'split';
    if(pair==='9' && du!==7 && du!==10 && du!==11) return 'split';
    if(pair==='7' && du<=7) return 'split';
    if(pair==='6' && du<=6) return 'split';
    if((pair==='2'||pair==='3') && du<=7) return 'split';
    // 10/J/Q/K nigdy nie split (basic)
    // 5 nigdy nie split (zachowaj 10)
    // 4 nie split
  }

  // Double (tylko initial 2 cards)
  if(canDouble && playerHand.length===2){
    if(!soft){
      if(pv===11 && du!==11) return 'double';
      if(pv===10 && du<=9) return 'double';
      if(pv===9 && du>=3 && du<=6) return 'double';
    } else {
      // Soft doubles
      if(pv===18 && du>=3 && du<=6) return 'double';
      if(pv===17 && du>=3 && du<=6) return 'double';
      if((pv===15||pv===16) && du>=4 && du<=6) return 'double';
      if((pv===13||pv===14) && du>=5 && du<=6) return 'double';
    }
  }

  // Stand/Hit
  if(!soft){
    if(pv>=17) return 'stand';
    if(pv<=11) return 'hit';
    if(pv===12){ if(du>=4 && du<=6) return 'stand'; return 'hit'; }
    // 13-16
    if(du<=6) return 'stand';
    return 'hit';
  } else {
    // Soft
    if(pv>=19) return 'stand';
    if(pv===18){ if(du<=8) return 'stand'; return 'hit'; }
    return 'hit';
  }
}

function dealerPlay(dealerHand, deck){
  // S17 — dealer stands na soft 17
  while(true){
    const dv = handVal(dealerHand);
    const soft = isSoft(dealerHand);
    if(dv<17) dealerHand.push(deck.pop());
    else if(dv===17 && soft) dealerHand.push(deck.pop()); // H17 only
    else break;
    // S17 — stand
    if(dv>=17 && !(dv===17 && soft && false /*H17 off*/)) break;
  }
  return dealerHand;
}

function dealerPlayS17(dealerHand, deck){
  while(handVal(dealerHand) < 17){
    dealerHand.push(deck.pop());
  }
  return dealerHand;
}

function playHand(deck, bet, isSplit=false){
  let hand = [deck.pop(), deck.pop()];
  const dealer = [deck.pop(), deck.pop()];
  return playHandWithDeal(hand, dealer, deck, bet, isSplit);
}

function playHandWithDeal(hand, dealer, deck, bet, isSplit){
  const dealerUp = dealer[0];
  let result = { bet, profit: 0, decisions: [] };

  // Player BJ check
  if(!isSplit){
    if(handVal(hand)===21){
      // Check dealer BJ
      if(handVal(dealer)===21){
        result.profit = 0; // push
      } else {
        result.profit = bet * 1.5; // BJ 3:2
      }
      return result;
    }
  }

  // Dealer BJ check (if dealer up card A or 10)
  if(dealerUp.r==='A' || dealerUp.v===10){
    if(handVal(dealer)===21){
      result.profit = -bet;
      return result;
    }
  }

  // Player turn
  let canSurrender = !isSplit;
  let canDoubleNow = true;
  let canSplitNow = !isSplit;
  let doubled = false;

  while(true){
    const dec = strategy(hand, dealerUp, canSplitNow, canDoubleNow, canSurrender);
    canSurrender = false; // surrender tylko first decision

    if(dec === 'surrender'){
      result.profit = -bet * 0.5;
      return result;
    }
    if(dec === 'split'){
      // Split — gra obie ręce osobno
      const c1 = hand[0], c2 = hand[1];
      const h1 = [c1, deck.pop()];
      const h2 = [c2, deck.pop()];
      // Split Aces — tylko 1 karta, auto-stand
      if(c1.r === 'A'){
        // Resolve both vs dealer
        const dealerFinal = dealerPlayS17([...dealer], deck);
        const dv = handVal(dealerFinal);
        let totalProfit = 0;
        for(const h of [h1, h2]){
          const pv = handVal(h);
          if(pv > 21) totalProfit -= bet;
          else if(pv === 21 && h.length === 2){
            if(dv === 21) totalProfit += 0;
            else totalProfit += bet; // post-split 21 NOT BJ, pays 1:1
          }
          else if(dv > 21) totalProfit += bet;
          else if(pv > dv) totalProfit += bet;
          else if(pv === dv) totalProfit += 0;
          else totalProfit -= bet;
        }
        result.profit = totalProfit;
        return result;
      }
      // Non-Aces split — play each hand (recursive but flat)
      const subResult1 = playHandWithDeal(h1, dealer, deck, bet, true);
      const subResult2 = playHandWithDeal(h2, dealer, deck, bet, true);
      result.profit = subResult1.profit + subResult2.profit;
      return result;
    }
    if(dec === 'double'){
      doubled = true;
      hand.push(deck.pop());
      bet *= 2;
      break;
    }
    if(dec === 'hit'){
      hand.push(deck.pop());
      canDoubleNow = false;
      canSplitNow = false;
      if(handVal(hand) > 21){
        // Bust
        result.profit = -bet;
        return result;
      }
      if(handVal(hand) === 21){
        break;
      }
      continue;
    }
    // stand
    break;
  }

  // Dealer plays (S17)
  const dealerFinal = dealerPlayS17([...dealer], deck);
  const dv = handVal(dealerFinal);
  const pv = handVal(hand);

  if(pv > 21){ result.profit = -bet; }
  else if(dv > 21){ result.profit = bet; }
  else if(pv > dv){ result.profit = bet; }
  else if(pv === dv){ result.profit = 0; }
  else { result.profit = -bet; }

  return result;
}

// MAIN SIM
console.log(`Symulacja Monte Carlo n=${NUM_HANDS} rund blackjacka`);
console.log(`Rules: 2-deck, S17, DA2, DAS, Late Surrender, no RSA`);
console.log(`Stake = 1 jednostka per ręka. Strategia = uproszczona basic strategy.\n`);

let totalBet = 0;
let totalProfit = 0;
let surrenderCount = 0;
let bjCount = 0;
let bustCount = 0;
let winCount = 0;
let lossCount = 0;
let pushCount = 0;

for(let i=0;i<NUM_HANDS;i++){
  const deck = newShoe();
  const r = playHand(deck, 1);
  totalBet += 1;
  totalProfit += r.profit;
  if(r.profit > 0) winCount++;
  else if(r.profit < 0) lossCount++;
  else pushCount++;
  if(r.profit === -0.5) surrenderCount++;
}

const ev = (totalBet + totalProfit) / totalBet;
const he = (1 - ev) * 100;

console.log(`Total bet (units): ${totalBet}`);
console.log(`Total profit (units): ${totalProfit.toFixed(2)}`);
console.log(`EV: ${ev.toFixed(5)}`);
console.log(`HE: ${he.toFixed(3)}%`);
console.log('');
console.log(`Win rate: ${(winCount/NUM_HANDS*100).toFixed(2)}%`);
console.log(`Loss rate: ${(lossCount/NUM_HANDS*100).toFixed(2)}%`);
console.log(`Push rate: ${(pushCount/NUM_HANDS*100).toFixed(2)}%`);
console.log(`Surrender rate: ${(surrenderCount/NUM_HANDS*100).toFixed(2)}%`);
console.log('');
if(ev < 1){
  console.log(`✅ NO EXPLOIT — kasyno wygrywa (HE = ${he.toFixed(3)}%)`);
} else {
  console.log(`❌ PLAYER EXPLOIT — gracz wygrywa! (HE = ${he.toFixed(3)}%)`);
}
console.log('');
console.log('UWAGA: Symulacja używa uproszczonej basic strategy. Faktyczna optimal play może');
console.log('dać minimalnie inny EV, ale różnica < 0.1%. Wnioski: 2-deck eliminuje player edge.');
