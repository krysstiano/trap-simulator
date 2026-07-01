/* Wspólne wzorce wykrywania ŻARGONU DEWELOPERSKIEGO w PATCH_NOTES.
   Zasada (user 2026-07-01): WSZYSTKIE patch notes musza byc pisane user-friendly —
   ZERO nazw funkcji, numerow linii, kodow faz/planow, nazw plikow, hex, zargonu, panelu admina.
   Uzywane przez: tools/check-patchnotes.mjs (gate) + sweep (scratchpad).
   Dostrojone by unikac false-positive: "autobus linia 12", ranking "#1", raper "MC Star". */

export const LEAK_PATTERNS = [
  // wywolania funkcji: identyfikator tuz przy nawiasie — openPhone(), changeRoom(x), Date().toDateString()
  ['func_call',  /\b[a-zA-Z_]\w*\([a-zA-Z0-9_"'.,\s]*\)/],
  // identyfikatory z kodu: camelCase czasownikowe, _prywatne, G.xxx, Math./Object./Date., P.wx
  ['code_ident', /\b(draw|render|handle|toggle|open|close|check|update|get|set|load|save|init|add|remove|calc|apply|progress|change|enter)[A-Z]\w+\b|\b_[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b|\bG\.[a-zA-Z_]\w+|\b(Math|Object|Date|JSON|Array)\.[a-zA-Z]\w*|\bP\.(wx|wy|spd|cloth|hp|energy|mood)\b/],
  // cokolwiek w backtickach = kod/identyfikator
  ['backtick',   /`[^`]+`/],
  // kody faz/iteracji deweloperskich: Faza X, Etap N, TIER N, AN.15, Round 2, iter292, Strumień A
  ['dev_phase',  /\bFaza\s+[A-Z0-9]|\bEtap\s+\d|\bTIER\s*\d|\b(AN|AR|AO|AQ|AP|AG|AH|AB|AC|AD|AE|AF|AI|AJ|AK|AL|AM)\.\d+\b|\bRound\s*2\b|\biter\d{2,}|\bStrumie[nń]\s+[A-Z]\b/],
  // nazwy plikow/planow: dbg_*, *.mjs/.js/.json/.html, PLAN_X, bledy.txt, DECYZJE_, _LEDGER, NARKO_
  ['plan_file',  /\bdbg_[a-z0-9_]+|\b[\w-]+\.(mjs|cjs|js|json|html)\b|PLAN_[A-Z]|bledy\.txt|DECYZJE_|_LEDGER\b|NARKO_/i],
  // zargon programisty
  ['dev_jargon', /\b(refactor|refaktor|dispatcher|wrapper|helper|root cause|defensive init|save migration|backward compat|auto-migration|Monte Carlo|invariant|regression|false-?positive|null-?deref|syntax check|dead code|no-?op|ghost feature|workflow|ultracode|backlog|adversarial|Playwright|runtime test|smoke test|setInterval|setTimeout|typeof|localStorage|anti-exploit)\b/i],
  // odwolania do wewnetrznych regul/rund audytu (NIE ranking "#1")
  ['rule_ref',   /regu[łl]a\s*#?\d+|Round\s*2\s*#\d+|#\d+\s+(analog|audit|overlap|final|milestone)/i],
  // kody kolorow hex
  ['hex_color',  /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/],
  // wewnetrzna notacja drog/chodnikow V1/V2/V3
  ['ver_nota',   /\bV[123]\b(?![\w-])/],
  // ⛔ panel admina/dev — ZERO w tekstach graczy
  ['admin_dev',  /admin panel|panel admin|\?dev=1|M\+M\+M|tryb dev|debug mode/i],
  // przewaga kasyna / house edge — jezyk korzysci, nie HE/RTP
  ['house_edge', /\bHE\s*\d|\bRTP\b|house edge/],
  // ⛔ emoji (PDF #8-18, user 2026-07-02): ZERO emoji w patch notes (naglowki + tresc). Detekcja = ta sama co strip.
  ['emoji',      /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]/u],
];

/* false-positive guard: "autobus/tramwaj linia 12" (linia kodu = "linia 123+" lub "L1234") */
// (numery linii kodu obsluzone osobno — patrz nizej; unikamy kolizji z "linia autobusowa")
LEAK_PATTERNS.push(['line_ref', /\bL~?\d{3,}\b|\blinia\s+\d{3,}\b/]);

export function findLeaks(text){
  if(typeof text!=='string') return [];
  const out=[];
  for(const [cat,re] of LEAK_PATTERNS){ const m=text.match(re); if(m) out.push({cat, match:m[0]}); }
  return out;
}
