/* dbg TIER A (v2.3.44) — U10 cofanie do podgrupy + U8 nadawca TrapInfo + U3 marker + U1 intro.
   ZASADA #0: uruchamialny przez usera (node dbg_v2344_tierA.mjs), exit 1 przy błędzie. */
import { setupPage } from './_helper_runtime_template.mjs';

const fail=(m)=>{ console.error('❌ FAIL: '+m); process.exitCode=1; };
const ok=(m)=>console.log('✅ '+m);

const { page, browser, errors } = await setupPage();
try{
  const r = await page.evaluate(()=>{
    const out={};
    // --- U10: cofanie z apki do podgrupy (folderu) ---
    // znajdź folder zawierający 'instagram'
    out.foldInsta = (typeof _phFolderOfApp==='function') ? _phFolderOfApp('instagram') : null;
    out.foldBank  = (typeof _phFolderOfApp==='function') ? _phFolderOfApp('bank') : null;
    // otwórz telefon
    if(typeof togglePhone==='function' && !(typeof phoneOpen==='function'&&phoneOpen())) togglePhone();
    // wejdź do folderu instagrama
    if(out.foldInsta && typeof renderPhoneFolder==='function') renderPhoneFolder(out.foldInsta);
    out.viewAfterFolder = G._phView;
    // otwórz apkę instagram
    if(typeof renderPhoneApp==='function') renderPhoneApp('instagram');
    out.viewAfterApp = G._phView;
    // COFNIJ — powinno wrócić do folderu, NIE na home
    if(typeof window._phGoBack==='function') window._phGoBack();
    out.viewAfterBack = G._phView;
    // --- U8: nadawca TrapInfo istnieje ---
    out.trapinfoName = (typeof SMS_CONTACTS!=='undefined' && SMS_CONTACTS.trapinfo) ? SMS_CONTACTS.trapinfo.name : null;
    return out;
  });

  console.log('STATE:', JSON.stringify(r));

  // U10 asercje
  if(!r.foldInsta) fail('U10: _phFolderOfApp("instagram") nie znalazł folderu'); else ok('U10: instagram w folderze "'+r.foldInsta+'"');
  if(!r.foldBank) fail('U10: _phFolderOfApp("bank") nie znalazł folderu'); else ok('U10: bank w folderze "'+r.foldBank+'"');
  if(r.viewAfterFolder!=='folder:'+r.foldInsta) fail('U10: po wejściu do folderu _phView='+r.viewAfterFolder); else ok('U10: folder otwarty ('+r.viewAfterFolder+')');
  if(r.viewAfterApp!=='app:instagram') fail('U10: po otwarciu apki _phView='+r.viewAfterApp); else ok('U10: apka otwarta ('+r.viewAfterApp+')');
  if(r.viewAfterBack!=='folder:'+r.foldInsta) fail('U10: COFANIE wróciło do "'+r.viewAfterBack+'", oczekiwano "folder:'+r.foldInsta+'" (PDF: cofa do podgrupy, nie na pulpit!)'); else ok('U10: ✔ cofanie wraca do podgrupy ('+r.viewAfterBack+'), NIE na pulpit');

  // U8 asercja
  if(r.trapinfoName!=='TrapInfo') fail('U8: SMS_CONTACTS.trapinfo.name='+r.trapinfoName); else ok('U8: nadawca TrapInfo zarejestrowany');

  if(errors.length) fail('page errors: '+errors.join(' | ')); else ok('brak page-errors');
}catch(e){ fail('exception: '+e.message); }
finally{ await browser.close(); }

if(process.exitCode===1) console.error('\n=== TIER A: CZERWONY ==='); else console.log('\n=== TIER A: ZIELONY ===');
