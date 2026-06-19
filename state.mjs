import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameFile = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

// ── 1. Przechwytuj błędy JS zanim strona się załaduje ──
const jsErrors = [];
const jsWarnings = [];
page.on('console', msg => {
  if (msg.type() === 'error') jsErrors.push(msg.text());
  if (msg.type() === 'warning') jsWarnings.push(msg.text());
});
page.on('pageerror', err => jsErrors.push(`PAGEERROR: ${err.message}`));

await page.goto(gameFile);
await page.waitForTimeout(2000);
await page.locator('text=NOWA GRA').click();
await page.waitForTimeout(1000);
await page.locator('.start-btn').click();
await page.waitForTimeout(4000);

// ── 2. Stan gry ──
const state = await page.evaluate(() => {
  const hm = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(Math.floor(m%60)).padStart(2,'0')}`;
  const onRoad = p =>
    (p.wy>=384&&p.wy<=576)||(p.wy>=1920&&p.wy<=2112)||(p.wy>=2880&&p.wy<=3072)||
    (p.wx>=768&&p.wx<=960)||(p.wx>=2208&&p.wx<=2400)||(p.wx>=3456&&p.wx<=3648);
  return {
    player:  { wx: Math.round(P.wx), wy: Math.round(P.wy), room: currentRoom },
    camera:  { x: Math.round(cam.x), y: Math.round(cam.y) },
    time:    hm(gameMin),
    stats: {
      health: G.health, energy: G.energy, hunger: G.hunger, stress: G.stress,
      money: G.money, fame: G.fame, followers: G.followers, day: G.day,
      fans: G.fans,
    },
    quest:   G.dailyQuest ? { title: G.dailyQuest.title, done: G.dailyQuest.done } : null,
    careers: Object.fromEntries(
      Object.entries(G.careers).map(([k,v]) => [k, { unlocked: v.unlocked }])
    ),
    npcs: cityPeds.map(p => ({
      wx: Math.round(p.wx), wy: Math.round(p.wy), dx: Math.round(p.dx*10)/10,
      onRoad: onRoad(p),
    })),
    cars: cityCars.map(c => ({ wx: Math.round(c.wx), wy: Math.round(c.wy), color: c.color })),
    npcCount: cityPeds.length,
    carCount:  cityCars.length,
    npcsOnRoad: cityPeds.filter(onRoad).length,
  };
});

// ── 3. Multi-screenshot ──
// Widok 1: pełny ekran (co widzi gracz)
const bufFull = await page.screenshot();
fs.writeFileSync(path.join(__dirname, 'view.png'), bufFull);

// Widok 2–4: kluczowe skrzyżowania — przesuwamy kamerę, robimy zdjęcie, przywracamy
const origCam = { x: state.camera.x, y: state.camera.y };
const shots = [
  { name: 'cross_v1h1.png', cx: 768, cy: 384 },   // V1 × H1
  { name: 'cross_v1h2.png', cx: 768, cy: 1920 },  // V1 × H2
  { name: 'cross_v2h1.png', cx: 2208, cy: 384 },  // V2 × H1
];

for (const s of shots) {
  // Centruj kamerę na skrzyżowaniu (środek V-road 96px, H-road 96px)
  const camX = s.cx + 96 - 640;
  const camY = s.cy + 96 - 360 + 62;
  await page.evaluate(({x,y}) => { cam.x = x; cam.y = y; }, { x: camX, y: camY });
  await page.waitForTimeout(150);
  const buf = await page.screenshot({ clip: { x: 290, y: 100, width: 700, height: 520 } });
  fs.writeFileSync(path.join(__dirname, s.name), buf);
}

// Przywróć kamerę
await page.evaluate(({x,y}) => { cam.x = x; cam.y = y; }, origCam);

await browser.close();

// ── 4. Wyniki ──
const RED   = '\x1b[31m';
const YEL   = '\x1b[33m';
const GRN   = '\x1b[32m';
const RST   = '\x1b[0m';

// Błędy JS
if (jsErrors.length > 0) {
  console.error(`\n${RED}══ BŁĘDY JS (${jsErrors.length}) ══${RST}`);
  jsErrors.forEach(e => console.error(`${RED}  ✗ ${e}${RST}`));
} else {
  console.log(`${GRN}✓ Brak błędów JS${RST}`);
}

// Stan gry
console.log('\n' + JSON.stringify(state, null, 2));

// Ostrzeżenia NPC
if (state.npcsOnRoad > 0) {
  console.warn(`\n${YEL}⚠  ${state.npcsOnRoad} NPC na jezdni!${RST}`);
  state.npcs.filter(p => p.onRoad).forEach(p =>
    console.warn(`${YEL}   → wx=${p.wx}, wy=${p.wy}${RST}`)
  );
} else {
  console.log(`${GRN}✓ Żaden NPC nie jest na jezdni${RST}`);
}

console.log(`\nScreenshoty: view.png | cross_v1h1.png | cross_v1h2.png | cross_v2h1.png`);
