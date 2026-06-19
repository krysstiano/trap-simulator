/* ANALIZA KASYNA — symulacja 1M iteracji każdej gry żeby zweryfikować HE.
   Wszystkie gry używają bet=100 (powyżej min stawki w każdej grze). */

const N = 1_000_000;
const BET = 100;
const results = {};

function simulate(name, fn, claim) {
  let totalBet = 0, totalWin = 0;
  for (let i = 0; i < N; i++) {
    const { bet, win } = fn();
    totalBet += bet;
    totalWin += win;
  }
  const rtp = totalWin / totalBet;
  const he = (1 - rtp) * 100;
  results[name] = { rtp: rtp.toFixed(4), he: he.toFixed(2) + '%', claim };
  console.log(`${name.padEnd(22)} | RTP: ${rtp.toFixed(4)} | HE: ${(he>=0?' ':'')}${he.toFixed(2)}% | claim: ${claim}`);
}

// ============ SLOTS REGULAR ============
function slotsRegular() {
  const SYM = [
    { prob: 25, pay3: 7,  pay2: 0   },
    { prob: 22, pay3: 12, pay2: 0   },
    { prob: 20, pay3: 20, pay2: 0.4 },
    { prob: 18, pay3: 37, pay2: 0.6 },
    { prob: 15, pay3: 60, pay2: 1.0 },
  ];
  const pick = () => {
    let r = Math.random() * 100;
    for (let i = 0; i < SYM.length; i++) {
      r -= SYM[i].prob;
      if (r <= 0) return i;
    }
    return SYM.length - 1;
  };
  const r = [pick(), pick(), pick()];
  let win = 0;
  if (r[0] === r[1] && r[1] === r[2]) {
    win = BET * SYM[r[0]].pay3;
  } else {
    let pairIdx = -1;
    if (r[0] === r[1] || r[0] === r[2]) pairIdx = r[0];
    else if (r[1] === r[2]) pairIdx = r[1];
    if (pairIdx >= 0 && SYM[pairIdx].pay2 > 0) {
      win = Math.max(1, Math.floor(BET * SYM[pairIdx].pay2));
    }
  }
  return { bet: BET, win };
}

// ============ SLOTS VIP ============
function slotsVip() {
  const SYM = [
    { prob: 25, pay3: 7,  pay2: 0.04 },
    { prob: 22, pay3: 12, pay2: 0.08 },
    { prob: 20, pay3: 20, pay2: 0.4  },
    { prob: 18, pay3: 37, pay2: 0.65 },
    { prob: 15, pay3: 60, pay2: 1.1  },
  ];
  const pick = () => {
    let r = Math.random() * 100;
    for (let i = 0; i < SYM.length; i++) {
      r -= SYM[i].prob;
      if (r <= 0) return i;
    }
    return SYM.length - 1;
  };
  const r = [pick(), pick(), pick()];
  let win = 0;
  if (r[0] === r[1] && r[1] === r[2]) {
    win = BET * SYM[r[0]].pay3;
  } else {
    let pairIdx = -1;
    if (r[0] === r[1] || r[0] === r[2]) pairIdx = r[0];
    else if (r[1] === r[2]) pairIdx = r[1];
    if (pairIdx >= 0 && SYM[pairIdx].pay2 > 0) {
      win = Math.max(1, Math.floor(BET * SYM[pairIdx].pay2));
    }
  }
  return { bet: BET, win };
}

// ============ ROULETTE ============
const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
function rouletteRed() {
  const num = Math.floor(Math.random() * 37);
  return { bet: BET, win: RED.has(num) ? BET * 2 : 0 };
}
function rouletteNumber() {
  const num = Math.floor(Math.random() * 37);
  return { bet: BET, win: num === 7 ? BET * 36 : 0 };
}
function rouletteColumn() {
  const num = Math.floor(Math.random() * 37);
  return { bet: BET, win: (num >= 1 && num <= 12) ? BET * 3 : 0 };
}

// ============ WHEEL OF FORTUNE ============
function wheel() {
  const SEG = [0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,2];
  const idx = Math.floor(Math.random() * 16);
  return { bet: BET, win: BET * SEG[idx] };
}

// ============ PLINKO ============
function plinko() {
  const SLOTS = [20, 4, 1.5, 0.5, 0.5, 0.5, 1.5, 4, 20];
  const ROWS = 12;
  let pos = 0;
  for (let i = 0; i < ROWS; i++) {
    pos += Math.random() < 0.5 ? -1 : 1;
  }
  const slotIdx = Math.max(0, Math.min(SLOTS.length - 1, Math.floor((pos + ROWS) / (2 * ROWS / SLOTS.length))));
  return { bet: BET, win: Math.floor(BET * SLOTS[slotIdx]) };
}

// ============ KENO ============
const KENO_PAYOUT = {
  4: {4:90,3:5,2:1},
  5: {5:400,4:18,3:3},
  6: {6:1000,5:80,4:5,3:1},
  7: {7:1000,6:200,5:20,4:3,3:1},
  8: {8:1000,7:500,6:50,5:10,4:2},
  9: {9:1000,8:500,7:80,6:15,5:3},
  10:{10:1000,9:500,8:100,7:25,6:5,5:2}
};
function kenoMake(pickCount) {
  return function() {
    const picked = new Set();
    while (picked.size < pickCount) picked.add(Math.floor(Math.random() * 80) + 1);
    const drawn = new Set();
    while (drawn.size < 20) drawn.add(Math.floor(Math.random() * 80) + 1);
    let hits = 0;
    for (const p of picked) if (drawn.has(p)) hits++;
    const mult = KENO_PAYOUT[pickCount][hits] || 0;
    return { bet: BET, win: BET * mult };
  };
}

// ============ CRAPS ============
function craps(betType) {
  const roll = () => (Math.floor(Math.random()*6)+1) + (Math.floor(Math.random()*6)+1);
  const first = roll();
  if (betType === 'pass') {
    if (first === 7 || first === 11) return { bet: BET, win: BET * 2 };
    if (first === 2 || first === 3 || first === 12) return { bet: BET, win: 0 };
    const point = first;
    while (true) {
      const r = roll();
      if (r === point) return { bet: BET, win: BET * 2 };
      if (r === 7) return { bet: BET, win: 0 };
    }
  } else if (betType === 'dontpass') {
    if (first === 7 || first === 11) return { bet: BET, win: 0 };
    if (first === 2 || first === 3) return { bet: BET, win: BET * 2 };
    if (first === 12) return { bet: BET, win: BET }; // push
    const point = first;
    while (true) {
      const r = roll();
      if (r === point) return { bet: BET, win: 0 };
      if (r === 7) return { bet: BET, win: BET * 2 };
    }
  } else if (betType === 'field') {
    if (first === 2 || first === 12) return { bet: BET, win: BET * 3 }; // 2:1
    if ([3,4,9,10,11].includes(first)) return { bet: BET, win: BET * 2 }; // 1:1
    return { bet: BET, win: 0 };
  }
}

// ============ WAR ============
// Faktyczny kod gry: tie → wojna z opcją (gracz decyduje). Tu założenie: zawsze idzie do wojny.
// Wojna: stawka 2× (rezygnacja by była 1× loss).
function war() {
  // Faktyczna logika z _warDeal/_warGoToWar:
  // Initial: bet B, player win → 2B return (+B net), loss → 0 (-B), tie → choice
  // Go to war: extra B stake (total 2B), if pv>=dv → 3B return (+B net), else 0 (-2B)
  // Założenie: gracz ZAWSZE idzie do war (lepiej niż surrender 50%).
  const cards = () => Math.floor(Math.random()*13)+2; // 2-14
  const p = cards(), d = cards();
  if (p > d) return { bet: BET, win: BET * 2 };
  if (p < d) return { bet: BET, win: 0 };
  // Tie — go to war: stake becomes 2*BET
  const pw = cards(), dw = cards();
  if (pw >= dw) return { bet: BET * 2, win: BET * 3 }; // win or tie in war = +B net
  return { bet: BET * 2, win: 0 }; // lose war = -2B
}

// ============ BACCARAT ============
function baccaratBanker() {
  const card = () => Math.floor(Math.random()*13);
  const v = (c) => {
    if (c === 0) return 1;
    if (c <= 8) return c+1;
    return 0;
  };
  const sum = (cards) => cards.reduce((s, c) => s + v(c), 0) % 10;
  const p = [card(), card()];
  const b = [card(), card()];
  const pSum = sum(p);
  const bSum = sum(b);
  if (pSum >= 8 || bSum >= 8) {
    if (bSum > pSum) return { bet: BET, win: Math.floor(BET * (1 + 0.95)) };
    if (pSum > bSum) return { bet: BET, win: 0 };
    return { bet: BET, win: BET };
  }
  let p3 = null;
  if (pSum <= 5) { p3 = card(); p.push(p3); }
  const p3v = p3 === null ? null : v(p3);
  let bDraw = false;
  if (p3 === null) bDraw = bSum <= 5;
  else {
    if (bSum <= 2) bDraw = true;
    else if (bSum === 3) bDraw = p3v !== 8;
    else if (bSum === 4) bDraw = p3v >= 2 && p3v <= 7;
    else if (bSum === 5) bDraw = p3v >= 4 && p3v <= 7;
    else if (bSum === 6) bDraw = p3v === 6 || p3v === 7;
  }
  if (bDraw) b.push(card());
  const pF = sum(p), bF = sum(b);
  if (bF > pF) return { bet: BET, win: Math.floor(BET * 1.95) };
  if (pF > bF) return { bet: BET, win: 0 };
  return { bet: BET, win: BET };
}
function baccaratPlayer() {
  const card = () => Math.floor(Math.random()*13);
  const v = (c) => { if (c === 0) return 1; if (c <= 8) return c+1; return 0; };
  const sum = (cards) => cards.reduce((s, c) => s + v(c), 0) % 10;
  const p = [card(), card()];
  const b = [card(), card()];
  const pSum = sum(p);
  const bSum = sum(b);
  if (pSum >= 8 || bSum >= 8) {
    if (pSum > bSum) return { bet: BET, win: BET * 2 };
    if (bSum > pSum) return { bet: BET, win: 0 };
    return { bet: BET, win: BET };
  }
  let p3 = null;
  if (pSum <= 5) { p3 = card(); p.push(p3); }
  const p3v = p3 === null ? null : v(p3);
  let bDraw = false;
  if (p3 === null) bDraw = bSum <= 5;
  else {
    if (bSum <= 2) bDraw = true;
    else if (bSum === 3) bDraw = p3v !== 8;
    else if (bSum === 4) bDraw = p3v >= 2 && p3v <= 7;
    else if (bSum === 5) bDraw = p3v >= 4 && p3v <= 7;
    else if (bSum === 6) bDraw = p3v === 6 || p3v === 7;
  }
  if (bDraw) b.push(card());
  const pF = sum(p), bF = sum(b);
  if (pF > bF) return { bet: BET, win: BET * 2 };
  if (bF > pF) return { bet: BET, win: 0 };
  return { bet: BET, win: BET };
}

// ============ BLACKJACK basic strategy ============
function blackjack() {
  const card = () => {
    const v = Math.floor(Math.random()*13)+1;
    if (v === 1) return 11;
    if (v >= 10) return 10;
    return v;
  };
  const handVal = (h) => {
    let s = h.reduce((a, c) => a + c, 0);
    let a = h.filter(c => c === 11).length;
    while (s > 21 && a > 0) { s -= 10; a--; }
    return s;
  };
  const player = [card(), card()];
  const dealer = [card(), card()];
  const pV = handVal(player);
  const dV = handVal(dealer);
  const pBJ = (pV === 21);
  const dBJ = (dV === 21);
  if (pBJ && dBJ) return { bet: BET, win: BET };
  if (pBJ) return { bet: BET, win: Math.floor(BET * 2.5) }; // 3:2 BJ
  if (dBJ) return { bet: BET, win: 0 };

  // Basic strategy (approx): hit until 17, soft 17 stand
  while (handVal(player) < 17) player.push(card());
  const pF = handVal(player);
  if (pF > 21) return { bet: BET, win: 0 };

  while (handVal(dealer) < 17) dealer.push(card());
  const dF = handVal(dealer);
  if (dF > 21) return { bet: BET, win: BET * 2 };

  if (pF > dF) return { bet: BET, win: BET * 2 };
  if (pF < dF) return { bet: BET, win: 0 };
  return { bet: BET, win: BET };
}

// ============ POKER 5-CARD (z optymalną wymianą — uproszczony) ============
function poker() {
  // Dla uproszczenia: gracz wymienia karty < J, zachowuje pary i wyższe karty
  const deck = [];
  for (let s = 0; s < 4; s++) for (let r = 2; r <= 14; r++) deck.push({s, r});
  for (let i = deck.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  let hand = deck.slice(0, 5);
  let nextCard = 5;

  // Detect pairs/triples/quads
  const counts = {};
  for (const c of hand) counts[c.r] = (counts[c.r]||0)+1;
  const keep = new Set();
  // Keep cards from pairs/triples/quads
  for (const c of hand) if (counts[c.r] >= 2) keep.add(c);
  // Keep aces, kings, queens, jacks (high cards)
  for (const c of hand) if (c.r >= 11) keep.add(c);

  // Replace non-keep cards
  hand = [...hand].map(c => keep.has(c) ? c : deck[nextCard++]);

  // Evaluate
  const ranks = hand.map(c=>c.r).sort((a,b)=>a-b);
  const suits = hand.map(c=>c.s);
  const isFlush = suits.every(s => s === suits[0]);
  let isStraight = ranks.every((r,i) => i === 0 || r === ranks[i-1]+1);
  if (!isStraight && JSON.stringify(ranks) === JSON.stringify([2,3,4,5,14])) isStraight = true;
  const cnt = {};
  for (const r of ranks) cnt[r] = (cnt[r]||0)+1;
  const cv = Object.values(cnt).sort((a,b)=>b-a);

  let mult = 0;
  if (isFlush && isStraight && ranks[0] === 10) mult = 250;
  else if (isFlush && isStraight) mult = 50;
  else if (cv[0] === 4) mult = 25;
  else if (cv[0] === 3 && cv[1] === 2) mult = 9;
  else if (isFlush) mult = 6;
  else if (isStraight) mult = 4;
  else if (cv[0] === 3) mult = 3;
  else if (cv[0] === 2 && cv[1] === 2) mult = 2;
  else {
    const pairR = Object.keys(cnt).find(r => cnt[r] === 2);
    if (pairR && parseInt(pairR) >= 11) mult = 1;
  }
  return { bet: BET, win: BET * mult };
}

console.log('=== SYMULACJA 1M ITERACJI DLA KAŻDEJ GRY (bet=100) ===\n');
console.log('Game                   | RTP    | HE     | Patchnotes claim');
console.log('-'.repeat(80));

simulate('Slots Regular', slotsRegular, '4.10% HE');
simulate('Slots VIP', slotsVip, '1.66% HE');
simulate('Roulette Red', rouletteRed, '2.70% HE');
simulate('Roulette Number', rouletteNumber, '2.70% HE');
simulate('Roulette Column', rouletteColumn, '2.70% HE');
simulate('Wheel of Fortune', wheel, '6.25% HE');
simulate('Plinko', plinko, '3.54% HE');
simulate('Keno 4-pick', kenoMake(4), '27-78% HE');
simulate('Keno 5-pick', kenoMake(5), '27-78% HE');
simulate('Keno 6-pick', kenoMake(6), '27-78% HE');
simulate('Keno 7-pick', kenoMake(7), '27-78% HE');
simulate('Keno 8-pick', kenoMake(8), '27-78% HE');
simulate('Keno 9-pick', kenoMake(9), '27-78% HE');
simulate('Keno 10-pick', kenoMake(10), '27-78% HE');
simulate('Craps Pass', () => craps('pass'), '1.4% HE');
simulate('Craps DontPass', () => craps('dontpass'), '1.36% HE typowy');
simulate('Craps Field (1:1+2:1)', () => craps('field'), 'HE typowy ~5.6% (1-edge fix)');
simulate('War', war, '2.88% HE');
simulate('Blackjack', blackjack, '0.15-0.5% HE (claim — symulacja używa "hit do 17")');
simulate('Baccarat Banker', baccaratBanker, '1.06% HE typowy');
simulate('Baccarat Player', baccaratPlayer, '1.24% HE typowy');
simulate('Poker 5-card', poker, '0.46% HE');

console.log('\n=== KONIEC ===');
