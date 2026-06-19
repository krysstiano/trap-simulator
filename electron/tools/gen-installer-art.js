// Renderuje grafiki kreatora NSIS: sidebar (164x314) + header (150x57) do build/ jako PNG.
// PNG -> BMP konwertuje potem PowerShell (NSIS wymaga BMP). Uruchom: electron tools/gen-installer-art.js
const { app, BrowserWindow } = require('electron');
const path = require('path'), fs = require('fs');
app.disableHardwareAcceleration();

function html(w, h, draw) {
  return 'data:text/html,' + encodeURIComponent(
    '<style>html,body{margin:0;padding:0;overflow:hidden}</style><canvas id="c" width="'+w+'" height="'+h+'"></canvas><script>const x=c.getContext("2d");('+draw.toString()+')(x,'+w+','+h+');window._r=1;<\/script>'
  );
}

const drawSidebar = (x,w,h)=>{
  const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,'#0b1020'); g.addColorStop(1,'#1c2748');
  x.fillStyle=g; x.fillRect(0,0,w,h);
  const rg=x.createRadialGradient(w/2,120,10,w/2,120,170);
  rg.addColorStop(0,'rgba(233,30,140,0.33)'); rg.addColorStop(1,'rgba(233,30,140,0)');
  x.fillStyle=rg; x.fillRect(0,0,w,h);
  x.textAlign='center';
  // TRAP
  x.shadowColor='#e91e8c'; x.shadowBlur=24; x.fillStyle='#f1c40f';
  x.font='900 52px "Arial Black",Arial,sans-serif'; x.fillText('TRAP',w/2,120);
  // SIMULATOR
  x.shadowBlur=10; x.shadowColor='rgba(126,200,227,0.8)'; x.fillStyle='#7ec8e3';
  x.font='800 24px "Arial Black",Arial,sans-serif'; x.fillText('SIMULATOR',w/2,152);
  // tagline na dole
  x.shadowBlur=0; x.fillStyle='rgba(230,230,240,0.85)';
  x.font='600 13px Arial,sans-serif'; x.fillText('Od ulicy do slawy', w/2, h-30);
  // cienka zlota linia akcent
  x.strokeStyle='rgba(241,196,15,0.5)'; x.lineWidth=2;
  x.beginPath(); x.moveTo(24,176); x.lineTo(w-24,176); x.stroke();
};
const drawHeader = (x,w,h)=>{
  const g=x.createLinearGradient(0,0,w,0); g.addColorStop(0,'#0b1020'); g.addColorStop(1,'#1c2748');
  x.fillStyle=g; x.fillRect(0,0,w,h);
  x.textAlign='left'; x.textBaseline='middle';
  x.fillStyle='#f1c40f'; x.font='900 20px "Arial Black",Arial'; x.fillText('TRAP', 12, h/2);
  x.fillStyle='#7ec8e3'; x.font='800 13px "Arial Black",Arial'; x.fillText('SIMULATOR', 64, h/2+1);
};

async function render(file, w, h, draw) {
  const win = new BrowserWindow({ width:w, height:h, show:false, useContentSize:true, webPreferences:{offscreen:false} });
  await win.loadURL(html(w,h,draw));
  await new Promise(r=>setTimeout(r,300));
  const img = await win.webContents.capturePage({x:0,y:0,width:w,height:h});
  const out = path.join(__dirname,'..','build',file);
  fs.writeFileSync(out, img.toPNG());
  console.log('ART-OK: '+out+' ('+w+'x'+h+', '+fs.statSync(out).size+'B)');
  win.destroy();
}

app.whenReady().then(async()=>{
  try{
    fs.mkdirSync(path.join(__dirname,'..','build'),{recursive:true});
    await render('installerSidebar.png',164,314,drawSidebar);
    await render('installerHeader.png',150,57,drawHeader);
    app.exit(0);
  }catch(e){ console.error('ART-FAIL: '+(e&&e.stack||e)); app.exit(1); }
});
