/* v2.1.37 [Amper]: spójność liczby fanów we WSZYSTKICH miejscach wyświetlania.
   HUD = G.fans (lojalni). Wszystkie inne miejsca które pokazują "fanów" muszą używać tego samego licznika. */
import fs from 'fs';
const SRC = 'E:/Snowy Simulator/index.html';
let html = fs.readFileSync(SRC, 'utf8');
let applied = 0, missed = [];

const pairs = [
  /* === LEADERBOARD === */
  /* Kategoria fans — czyta G.followers, powinna G.fans (HUD pokazuje fanów lojalnych) */
  [`fans:{label:'🎤 Najwięcej fanów',emoji:'🎤',color:'#e91e8c',unit:'',get:()=>G.followers||0,max:5000000}, // 5M (było 10M)`,
   `fans:{label:'🎤 Najwięcej fanów',emoji:'🎤',color:'#e91e8c',unit:'',get:()=>G.fans||0,max:5000000}, // v2.1.37: G.fans (lojalnych) — spójne z HUD`],
  /* Master Score — includuje G.followers, zmień na G.fans */
  [`master:{label:'🏆 Master Score',emoji:'🏆',color:'#c8a520',unit:'pkt',
    get:()=>Math.floor(((G.totalEarned||0)/1000)+((G.followers||0)/100)+(((G.achievements||[]).length)*50)+(((G.prestige||0))*500)),
    max:10000000}, // 10M pkt (było 100M)`,
   `master:{label:'🏆 Master Score',emoji:'🏆',color:'#c8a520',unit:'pkt',
    get:()=>Math.floor(((G.totalEarned||0)/1000)+((G.fans||0)/100)+(((G.achievements||[]).length)*50)+(((G.prestige||0))*500)),
    max:10000000}, // v2.1.37: G.fans (lojalnych) — spójne z HUD`],
  /* Title 'legend' — wymóg 1M followers, zmień na fans */
  [`{id:'legend',     emoji:'💎',label:'LEGENDA',         color:'#e91e8c',cond:g=>(g.followers||0)>=1000000 && (g.prestige||0)>=2},`,
   `{id:'legend',     emoji:'💎',label:'LEGENDA',         color:'#e91e8c',cond:g=>(g.fans||0)>=1000000 && (g.prestige||0)>=2},`],

  /* === CELE / STORYLINE / MAIN MISSION OVERLAY === */
  /* Linia 26707 — mainMission overlay totalFans */
  [`  const totalFans=(G.followers||0)+(G.fans||0);
    if(!mm||!mm.active||mm.failed) return;
    if(!mm.milestones) return;
    for(const ms of mm.milestones){
      if(!ms.done&&totalFans>=ms.fans){`,
   `  /* v2.1.37 [Amper]: Cele/mainMission pokazują FANÓW LOJALNYCH (spójność z HUD) */
  const totalFans=(G.fans||0);
    if(!mm||!mm.active||mm.failed) return;
    if(!mm.milestones) return;
    for(const ms of mm.milestones){
      if(!ms.done&&totalFans>=ms.fans){`],

  /* Linia 27723 storyline pill / findNextGoal — totalFans */
  [`  if(G.mainMission && G.mainMission.active && !G.mainMission.failed){
    const totalFans=(G.followers||0)+(G.fans||0);
    const nextMs=G.mainMission.milestones.find(m=>!m.done);`,
   `  if(G.mainMission && G.mainMission.active && !G.mainMission.failed){
    /* v2.1.37 [Amper]: storyline pill pokazuje fany lojalnych — spójność z HUD */
    const totalFans=(G.fans||0);
    const nextMs=G.mainMission.milestones.find(m=>!m.done);`],

  /* Linia 38451 — overlay totalFans pct */
  [`  const totalFans=(G.followers||0)+(G.fans||0);
  const target=1000;
  const pct=Math.min(1,totalFans/target);`,
   `  /* v2.1.37 [Amper]: overlay 'Pierwsze 1000 fanów' = G.fans lojalnych */
  const totalFans=(G.fans||0);
  const target=1000;
  const pct=Math.min(1,totalFans/target);`],

  /* === KONCERTY UI === */
  /* Linia 18931 — koncerty UI totalFans */
  [`  const scena=getRaperST('scena');
  const totalFans=(G.followers||0)+(G.fans||0);`,
   `  const scena=getRaperST('scena');
  /* v2.1.37 [Amper]: koncerty wymagają fanów lojalnych (G.fans), nie obserwujących */
  const totalFans=(G.fans||0);`],

  /* === SMS / TELEFON === */
  /* Linia 23623 — SMS sections */
  [`  _ensureSMS();
  const fans=(G.followers||0)+(G.fans||0);
  const tracks=G.careers?.raper?.tracks||0;`,
   `  _ensureSMS();
  /* v2.1.37 [Amper]: SMS panel używa G.fans lojalnych (spójność) */
  const fans=(G.fans||0);
  const tracks=G.careers?.raper?.tracks||0;`],

  /* === findNextGoal === */
  /* Linia 27628 — findNextGoal */
  [`function findNextGoal(){
  const fans=(G.followers||0)+(G.fans||0);
  const fol=G.followers||0;`,
   `function findNextGoal(){
  /* v2.1.37 [Amper]: cele bazują na G.fans lojalnych (HUD) */
  const fans=(G.fans||0);
  const fol=G.followers||0;`],
];

for(const [oldS, newS] of pairs){
  const before = html;
  html = html.split(oldS).join(newS);
  if(html === before) missed.push(oldS.slice(0,90)+'...');
  else applied++;
}

fs.writeFileSync(SRC, html);
console.log(`Applied: ${applied}/${pairs.length}`);
if(missed.length){
  console.log('MISSED:');
  missed.forEach(m=>console.log('  '+m));
}
