/* v2.1.36 phase 2: pozostałe wymogi gry i obiekty req.followers → req.fans */
import fs from 'fs';
const SRC = 'E:/Snowy Simulator/index.html';
let html = fs.readFileSync(SRC, 'utf8');
let applied = 0, missed = [];

const pairs = [
  /* Wejście do merch_studio (drugi check) */
  [`if(room==='merch_studio' && G.followers<5000){`,
   `if(room==='merch_studio' && (G.fans||0)<5000){`],
  /* Showmsg dla merch_studio */
  [`showMsg('🔒 Studio Projektowania odblokowane przy 5000 fanach (masz '+G.followers.toLocaleString('pl')+')','r');`,
   `showMsg('🔒 Studio Projektowania odblokowane przy 5000 fanach (masz '+(G.fans||0).toLocaleString('pl')+')','r');`],
  /* Idle hint Studio Merch */
  [`{id:'merch',cond:()=>G.followers>=5000&&!G.merchStore?.products?.length,text:'💡 Studio Projektowania: zaprojektuj merch i zarabiaj pasywnie (cap zysku zależy od capacity).'},`,
   `{id:'merch',cond:()=>(G.fans||0)>=5000&&!G.merchStore?.products?.length,text:'💡 Studio Projektowania: zaprojektuj merch i zarabiaj pasywnie (cap zysku zależy od capacity).'},`],
  /* Idle hint apt premium */
  [`{id:'apt',cond:()=>G.apartment==='traphouse'&&G.followers>=2000,text:'💡 Spełniasz wymogi Apartamentu Premium (15k zł). Lepsza regeneracja energii + nastrój dziennie.'},`,
   `{id:'apt',cond:()=>G.apartment==='traphouse'&&(G.fans||0)>=2000,text:'💡 Spełniasz wymogi Apartamentu Premium (15k zł). Lepsza regeneracja energii + nastrój dziennie.'},`],
  /* Merch active check */
  [`if(!G.merch.active&&G.followers>=5000){`,
   `if(!G.merch.active&&(G.fans||0)>=5000){`],
  /* Pochwała od fana (faktyczny fan, nie obserwujący) */
  [`{name:'Pochwała od fana',chance:0.014,cond:()=>currentRoom==='ulica'&&G.followers>=200&&G.fame>=10,fn:()=>{`,
   `{name:'Pochwała od fana',chance:0.014,cond:()=>currentRoom==='ulica'&&(G.fans||0)>=200&&G.fame>=10,fn:()=>{`],
  /* Dystrybucja req: followers→fans */
  [`req:{level:5,followers:100},desc:'Albumy + single, sync licensing, 91% royalties.',emoji:'🔵'},`,
   `req:{level:5,fans:100},desc:'Albumy + single, sync licensing, 91% royalties.',emoji:'🔵'},`],
  /* Dystrybucja UI labelka — używa key 'followers' */
  [`const reqText=Object.entries(d.req).map(([k,v])=>\`\${k==='level'?'Poziom':k==='followers'?'Followers':k==='fans'?'Fani':k==='fansHardcore'?'Fani Hardcore':k==='streams'?'Streamy':k} \${v.toLocaleString('pl')}\`).join(', ');`,
   `const reqText=Object.entries(d.req).map(([k,v])=>\`\${k==='level'?'Poziom':k==='fans'?'Fani':k==='fansHardcore'?'Fani Hardcore':k==='streams'?'Streamy':k} \${v.toLocaleString('pl')}\`).join(', ');`],
  /* Samochody req:followers → req:fans */
  [`{name:'Porsche 911',speed:1.70,price:150000,desc:'Klasyk Stuttgart. +70% prędkość. +15 sława.',emoji:'🏎', req:{level:8,fame:40,followers:5000}},`,
   `{name:'Porsche 911',speed:1.70,price:150000,desc:'Klasyk Stuttgart. +70% prędkość. +15 sława.',emoji:'🏎', req:{level:8,fame:40,fans:5000}},`],
  [`{name:'Lamborghini',speed:1.85,price:300000,desc:'Italiana ekstrawagancja. +85% prędkość. +25 sława.',emoji:'🏎️', req:{level:10,fame:55,followers:20000}},`,
   `{name:'Lamborghini',speed:1.85,price:300000,desc:'Italiana ekstrawagancja. +85% prędkość. +25 sława.',emoji:'🏎️', req:{level:10,fame:55,fans:20000}},`],
  [`{name:'Ferrari',speed:2.00,price:450000,desc:'Cavallino Rampante. ×2 prędkość. +30 sława.',emoji:'🐎', req:{level:12,fame:65,followers:50000}},`,
   `{name:'Ferrari',speed:2.00,price:450000,desc:'Cavallino Rampante. ×2 prędkość. +30 sława.',emoji:'🐎', req:{level:12,fame:65,fans:50000}},`],
  [`{name:'Bugatti Chiron',speed:2.25,price:1200000,desc:'Hipersamochód najwyższej klasy. ×2.25 prędkość. +50 sława.',emoji:'⚡', req:{level:15,fame:80,followers:100000}},`,
   `{name:'Bugatti Chiron',speed:2.25,price:1200000,desc:'Hipersamochód najwyższej klasy. ×2.25 prędkość. +50 sława.',emoji:'⚡', req:{level:15,fame:80,fans:100000}},`],
  /* Apartamenty Premium/Penthouse req */
  [`{id:'premium',name:'Apartament Premium',cost:15000,desc:'Przestronne, stylowe. Kuchnia z wyspą, regał z trofeami.',bonusText:'+15% regeneracja energii, +3 nastrój/doba (komfort)',req:{level:4,followers:2000}},`,
   `{id:'premium',name:'Apartament Premium',cost:15000,desc:'Przestronne, stylowe. Kuchnia z wyspą, regał z trofeami.',bonusText:'+15% regeneracja energii, +3 nastrój/doba (komfort)',req:{level:4,fans:2000}},`],
  [`{id:'luxury',name:'Penthouse Luksusowy',cost:60000,desc:'Najlepsze w mieście. Basen, sauna, jacuzzi, ognisko, panorama.',bonusText:'+25% regeneracja energii, +6 nastrój/doba, +15 sława, wszystkie luksusowe udogodnienia',req:{level:7,followers:10000,fame:50}},`,
   `{id:'luxury',name:'Penthouse Luksusowy',cost:60000,desc:'Najlepsze w mieście. Basen, sauna, jacuzzi, ognisko, panorama.',bonusText:'+25% regeneracja energii, +6 nastrój/doba, +15 sława, wszystkie luksusowe udogodnienia',req:{level:7,fans:10000,fame:50}},`],
  /* APT_REQS const */
  [`const APT_REQS={traphouse:{},basic:{level:2},premium:{level:4,followers:2000},luxury:{level:7,followers:10000,fame:50}};`,
   `const APT_REQS={traphouse:{},basic:{level:2},premium:{level:4,fans:2000},luxury:{level:7,fans:10000,fame:50}};`],
];

for(const [oldS, newS] of pairs){
  const before = html;
  html = html.split(oldS).join(newS);
  if(html === before) missed.push(oldS.slice(0,80)+'...');
  else applied++;
}

fs.writeFileSync(SRC, html);
console.log(`Phase 2 applied: ${applied}/${pairs.length}`);
missed.forEach(m => console.log('  MISS: '+m));
