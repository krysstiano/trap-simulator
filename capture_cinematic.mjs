// Kinowa pętla v3: panele systemów (PC/koncerty/label/merch jako zrzuty) + pokoje (lab/siłownia/strip/kasyno×4)
// + ulice/dzielnice. Szybkie cięcia, color grade, winieta, zoom, RZADSZE flashe, napisy. Serwuje przez http (bez taint).
// → website/gameplay-preview.webm. ZASADA #0: pixel/visual verify osobnym skryptem.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import http from 'http';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST = path.join(__dirname, 'website', 'gameplay-preview.webm');
const PANELDIR = path.join(__dirname, 'trailer_raw', 'panels');
fs.mkdirSync(PANELDIR, { recursive: true });

// ── http serwer (root repo, CORS + Range) — gra i panele z tego samego origin = brak taint ──
const MIME = { '.html':'text/html;charset=utf-8', '.png':'image/png', '.webm':'video/webm', '.js':'text/javascript', '.css':'text/css', '.mp3':'audio/mpeg' };
const srv = http.createServer((req,res)=>{
  let p = decodeURIComponent((req.url||'/').split('?')[0]); if(p==='/')p='/index.html';
  const fp = path.join(__dirname, p);
  if(!fp.startsWith(__dirname) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()){ res.writeHead(404); res.end(); return; }
  const size=fs.statSync(fp).size; const type=MIME[path.extname(fp)]||'application/octet-stream'; const cors={'Access-Control-Allow-Origin':'*'};
  const range=req.headers.range;
  if(range){ const m=/bytes=(\d*)-(\d*)/.exec(range); let s=m[1]?+m[1]:0,e=m[2]?+m[2]:size-1; res.writeHead(206,{...cors,'Content-Type':type,'Content-Range':`bytes ${s}-${e}/${size}`,'Accept-Ranges':'bytes','Content-Length':e-s+1}); fs.createReadStream(fp,{start:s,end:e}).pipe(res); }
  else { res.writeHead(200,{...cors,'Content-Type':type,'Accept-Ranges':'bytes','Content-Length':size}); fs.createReadStream(fp).pipe(res); }
});
await new Promise(r=>srv.listen(0,r)); const PORT=srv.address().port;
const BASE = `http://localhost:${PORT}`;

const b = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const pg = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await pg.goto(BASE + '/index.html'); await pg.waitForTimeout(2200);
await pg.evaluate(()=>{ try{ window._ageConfirm&&window._ageConfirm(); }catch(e){} const g=document.getElementById('agegate'); if(g)g.style.display='none'; });
const nb = await pg.$('button:has-text("Nowa gra")'); if(nb){ await nb.click(); await pg.waitForTimeout(900); }
const zb = await pg.$('button:has-text("ZACZYNAJ"), button:has-text("Zacznij grę")'); if(zb && await zb.isVisible().catch(()=>0)){ await zb.click({timeout:2500}).catch(()=>{}); await pg.waitForTimeout(1100); }
for(let k=0;k<6;k++){ const d=await pg.evaluate(()=>{ document.getElementById('ic-skip')?.click(); document.getElementById('intro-offer')?.remove(); if(typeof G!=='undefined'){G._introductionActive=false;G._introductionSeen=true;} return !document.getElementById('ic-stage'); }); if(d)break; await pg.waitForTimeout(400); }
// maxed + WYŁĄCZ celebracje kamieni milowych/dzielnic (zasłaniały panele) + clean chrome + render scale 1
await pg.evaluate(()=>{ try{
  window.showMilestoneCinematic=function(){};                 // no-op: brak celebracji "1000 FANÓW"
  window.confetti=function(){};                               // no-op: brak konfetti (zasłaniało panele)
  G.money=5e7; G.fame=420; G.fans=2.2e6; G.level=42; G.studioOwned=true;
  window._unlockedDistricts=['underground','coast','business']; if(G.trap){G.trap.unlocked=true;G.trap.level=15;}
  updateHUD&&updateHUD();
  const s=document.createElement('style'); s.textContent='#smart-hint,#itut-box,#tutorial-pill,#tutorial-popup,#intro-offer,#msg,#room-intro-toast,#onboarding-widget,#fs-link-toast,#agegate,#_achToast,[id*="celebr"],[class*="celebr"]{display:none!important;visibility:hidden!important;}'; document.head.appendChild(s);
  window._gfxRenderScale=1; const c=document.getElementById('gc'); if(c){ if(c.width!==1280)c.width=1280; if(c.height!==720)c.height=720; }
}catch(e){} });

// ── 1) ZRZUTY PANELI SYSTEMÓW (page.screenshot łapie DOM pełnoklatkowo) ──
const panelDefs = [
  ['pc', `if(typeof openComputerMenu==='function')openComputerMenu();`],
  ['koncert', `if(typeof renderSalaKoncertowa==='function'){renderSalaKoncertowa(); if(typeof openOverlay==='function')openOverlay();}`],
  ['label', `if(typeof renderLabelOverlay==='function'){renderLabelOverlay(); if(typeof openOverlay==='function')openOverlay();}`],
  ['merch', `if(typeof renderMerchDesigner==='function'){renderMerchDesigner(); if(typeof openOverlay==='function')openOverlay();}`],
];
const okPanels = [];
for(const [key,code] of panelDefs){
  await pg.evaluate(`(function(){try{${code}}catch(e){}})()`);
  await pg.waitForTimeout(700);
  await pg.evaluate(()=>{ try{ document.getElementById('msg')&&(document.getElementById('msg').style.display='none'); }catch(e){} });
  const has = await pg.evaluate(()=>{ const c=document.getElementById('ov-content'); return c ? c.textContent.trim().length>50 : false; });
  if(has){ await pg.screenshot({ path: path.join(PANELDIR, key+'.png') }); okPanels.push(key); console.log('panel zrzut:', key); }
  await pg.evaluate(()=>{ try{ closeOverlay&&closeOverlay(); }catch(e){} });
  await pg.waitForTimeout(300);
}
const panelUrls = {}; okPanels.forEach(k=>panelUrls[k]=`${BASE}/trailer_raw/panels/${k}.png`);

// ── 2) NAGRANIE KINOWE (kompozycja na stage canvas) ──
console.log('▶ nagrywam kinową pętlę v3...');
const b64 = await pg.evaluate(async (panelUrls) => {
  const gc = document.getElementById('gc');
  const loadImg = url => new Promise(res=>{ const i=new Image(); i.crossOrigin='anonymous'; i.onload=()=>res(i); i.onerror=()=>res(null); i.src=url; });
  const panels = {}; for(const k in panelUrls){ panels[k]=await loadImg(panelUrls[k]); }

  // ── MUZYKA wpinana w nagranie (jeden plik = obraz+dźwięk, sync wtopiony) ──
  const audioEl = new Audio(); audioEl.src='/mp3/film.mp3'; audioEl.crossOrigin='anonymous';
  await new Promise(r=>{ if(audioEl.readyState>=3)return r(); audioEl.addEventListener('canplaythrough', r, {once:true}); audioEl.load(); setTimeout(r,6000); });
  const actx = new (window.AudioContext||window.webkitAudioContext)();
  const asrc = actx.createMediaElementSource(audioEl);
  const adest = actx.createMediaStreamDestination();
  asrc.connect(adest);

  const stage=document.createElement('canvas'); stage.width=1280; stage.height=720; const x=stage.getContext('2d');
  const stream=stage.captureStream(30);
  adest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));   // dodaj ścieżkę muzyki do nagrania
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm';
  const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3000000});
  const chunks=[]; rec.ondataavailable=e=>{ if(e.data&&e.data.size)chunks.push(e.data); };
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  let flash=0, zoomT=0, sting='', stingSub='', shake=0;
  let src=gc, isPanel=false;
  const grade='contrast(1.16) saturate(1.30) brightness(1.04)';
  const CT=56, CB=14;  // przycięcie krawędzi tylko dla #gc (kill niebieskiego paska)
  let running=true;
  function frame(){
    if(!running) return;
    const z=1.05+Math.min(0.10,zoomT*0.10);
    const sx=shake>0?Math.sin(zoomT*60)*shake:0, sy=shake>0?Math.cos(zoomT*53)*shake:0;
    x.save(); x.filter=grade;
    const dw=1280*z, dh=720*z;
    if(isPanel && src){ x.drawImage(src, (1280-dw)/2+sx, (720-dh)/2+sy, dw, dh); }
    else { x.drawImage(gc, 0, CT, 1280, 720-CT-CB, (1280-dw)/2+sx, (720-dh)/2+sy, dw, dh); }
    x.filter='none';
    const g=x.createRadialGradient(640,360,180,640,360,760); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.55)'); x.fillStyle=g; x.fillRect(0,0,1280,720);
    if(sting){ x.textAlign='center'; x.fillStyle='#fff'; x.shadowColor='rgba(0,0,0,0.85)'; x.shadowBlur=24; x.shadowOffsetY=3; x.font='900 96px Impact, "Arial Black", sans-serif'; x.fillText(sting,640,375); if(stingSub){ x.font='800 40px Impact, "Arial Black", sans-serif'; x.fillStyle='#f1c40f'; x.fillText(stingSub,640,440);} x.shadowBlur=0; x.shadowOffsetY=0; }
    if(flash>0){ x.fillStyle='rgba(255,255,255,'+flash+')'; x.fillRect(0,0,1280,720); flash=Math.max(0,flash-0.16); }
    x.restore(); zoomT+=0.016; requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ── EDL od usera: cięcia na DOKŁADNE czasy (kick/808/werbel; 154 BPM, drop @ 0:00). ──
  // Pierwsza połowa podana ręcznie; druga = mirror (offset HALF). Czasy w sekundach (zegar audioEl.currentTime).
  const HALF = 12.46;
  // 0:77 USUNIĘTE — logo trzyma dłużej (0:00 → 1:16). To samo w mirrorze (13:23 usunięte).
  const H1 = [0,1.16,2.33,3.11,3.89,4.28, 5.45,5.58,5.71,5.84,5.97,6.10, 6.23,7.01,7.40,7.98,8.57,9.35,9.93,10.51, 11.29,11.42,11.55,11.68,11.81,11.94,12.07,12.20,12.33];
  const FLASHONLY = [4.09];
  const isBurst = t => (t>=5.45 && t<=6.10) || (t>=11.29 && t<=12.33);
  const POOL = [
    {room:'studio',wx:200,wy:300},{img:'pc'},{room:'casino',wx:600,wy:540},{room:'casino_vip',wx:600,wy:480},
    {room:'casino_lux',wx:600,wy:480},{room:'casino_royal',wx:600,wy:480},{img:'koncert'},{room:'lab',wx:400,wy:320},
    {img:'label'},{room:'mieszkanie',wx:618,wy:235},{room:'striptiz_club',wx:600,wy:400},{img:'merch'},
    {room:'ulica',wx:1200,wy:480,day:12},{room:'ulica',wx:2160,wy:1700,day:22},{room:'silownia',wx:300,wy:300},
    {room:'ulica',wx:2160,wy:1700,day:12},{room:'ulica',wx:720,wy:800,day:12}
  ];
  // DWA RÓŻNE loga — żeby gracz wiedział, że 12:46 to dalsza część, nie restart pętli.
  const LOGO_A = {room:'casino_royal',wx:600,wy:480, logo:'TRAP SIMULATOR', logoSub:''};            // 0:00 — Royal, samo logo
  const LOGO_B = {room:'ulica',wx:2160,wy:1700,day:12, logo:'TRAP SIMULATOR', logoSub:'OD ULICY DO SŁAWY'}; // 12:46 — miasto + tagline
  let pi=0; const nextScene=()=>POOL[(pi++)%POOL.length];
  const events=[];
  for(const off of [0, HALF]){
    H1.forEach((t,i)=>{
      const T=+(t+off).toFixed(3);
      let scene,fl,pn;
      if(i===0){ scene = (off===0 ? LOGO_A : LOGO_B); fl=1.0; pn=1; }  // logo (różne) na 0:00 i 12:46
      else if(t===4.28){ scene=nextScene(); fl=0.85; pn=1; }
      else if(isBurst(t)){ scene=nextScene(); fl=0.9; pn=0; }
      else { scene=nextScene(); fl=0; pn=0; }
      events.push({t:T, scene, fl, pn, change:true});
    });
    FLASHONLY.forEach(t=>events.push({t:+(t+off).toFixed(3), change:false, fl:0.85}));
  }
  events.sort((a,b)=>a.t-b.t);

  function applyScene(sc){ if(sc.img && panels[sc.img]){ isPanel=true; src=panels[sc.img]; } else { isPanel=false; src=gc; try{ if(sc.day!=null)G.timeOfDay=sc.day; if(sc.room)changeRoom(sc.room, sc.wx, sc.wy); }catch(e){} } sting=sc.logo||''; stingSub=sc.logoSub||''; }

  audioEl.currentTime=0; try{ await actx.resume(); }catch(e){}
  await audioEl.play();
  rec.start();
  for(const ev of events){
    while(audioEl.currentTime < ev.t){ await sleep(2); }
    if(ev.change){ applyScene(ev.scene); zoomT = ev.pn?0.55:0; shake = ev.pn?3:0; }
    flash = ev.fl||0;
  }
  // trzymaj ostatni klip do końca utworu → loop wraca na drop+logo (0:00)
  while(audioEl.currentTime>0.1 && audioEl.currentTime < 24.9){ await sleep(20); }

  running=false; await sleep(100);
  const blob = await new Promise(res=>{ rec.onstop=()=>res(new Blob(chunks,{type:'video/webm'})); rec.stop(); });
  try{ audioEl.pause(); }catch(e){}
  const hasAudio = stream.getAudioTracks().length>0;
  const b64 = await new Promise(res=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result.split(',')[1]); fr.readAsDataURL(blob); });
  return { b64, hasAudio };
}, panelUrls);

await b.close(); srv.close();
const buf=Buffer.from(b64.b64,'base64');
fs.writeFileSync(DEST, buf);
console.log('panele użyte:', okPanels.join(',')||'(żaden)');
console.log('ścieżka audio w streamie:', b64.hasAudio);
console.log('zapisano website/gameplay-preview.webm —', (buf.length/1024).toFixed(0),'KB');
process.exit(buf.length>50000?0:1);
