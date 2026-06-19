# DECYZJE designerskie — narkobiznes PDF (user 2026-06-18, front-load do /loop)

Autorytatywne odpowiedzi usera. /loop stosuje je BEZ pytania ponownie. Wszystko z PDF jest w zakresie (zero pominięć poza świadomymi SKIP w ledgerze).

## 1. Skala ekonomii — PRZESKALUJ do ekonomii gry
PDF operuje millionami (lab 5/12/25 mln, ekipy 4/12/24 mln, premium 5 mln, łapówki do 10 mln). Trap zarabia ~15-18k/dobę → millions = setki-tysiące dób grindu. **Decyzja: przeskaluj w dół do osiągalnych late-game** (baseline ~÷10, dostroję per próg z MC):
- Lab tiery: ~Mini 400-600k / Firmowe ~1.2M / Certyfikowane ~2.5M.
- Ekipy: ~400k / 1.2M / 2.4M (lub jednorazowy koszt + utrzymanie).
- Premium 98-99%: ~500k. Umowy utylizacji premium: ~100-300k. Łapówki: 5-25k … ~300k-1M.
- **Każdy próg MC-weryfikowany** (osiągalny mid-late aktywną grą, NIE trywialny). Trzymaj soft-gate + reqLvl, NIE odbieraj dostępu staremu save (grandfather).

## 2. Sprzężenie legalny↔illegalny (TIER 6) — WYRAŹNE, ale gładkie (#11)
Duży trap / wysoki heat / zgony klientów / skandale → realne uderzenie w karierę muzyczną: **utrata sponsorów** (istniejący `scandal_break`/`activeSponsors`), **gorsze/odwołane koncerty** (booking_trust gate), spadek public_image/fame. Progi i gładkie krzywe — napięcie „dwa życia", NIE frustrujące hard-cliffy. To rdzeń sprzężeń Cz III PDF.

## 3. Treść — KURATOROWANY podzbiór (nie pełne listy)
- Utylizacja: ~**4 firmy** (zróżnicowane: tania-ryzykowna / średnia / pro-droga / premium-abonament) + ~**5-6 NPC** brudnej utylizacji (różne effectiveness/cost/betrayal/cooldown). Nazwy z PDF (wybrane).
- Łapówki: ~**3 prawników/księgowych** (różne role/koszt/skuteczność/ryzyko błędu).
- Substancje/wypełniacze/firmy chemiczne: esencja, nie każda nazwa. Czytelne UI > kompletność listy.

## 4. Porażka + łapówki (TIER 9-10) — MIĘKKA porażka + łapówki z kosztem
- **Porażka = tryb odbudowy** (`recoveryMode`), NIE game over (PDF 8). Sprzedaj aktywa / obniż skalę / odzyskaj relacje → powrót.
- **Łapówki działają** (czyszczą kontrolę/heat sytuacyjnie) ALE `corruptionDep` rośnie → przyszłe łapówki droższe + ryzyko szantażu NPC („kredyt u diabła"). Anti-exploit: łapówka NIE kasuje heat za darmo na stałe; MC-balans.

## 5. DEFER → WSZYSTKIE W ZAKRESIE (z ekstra ostrożnością)
Nic nie jest trwale pominięte. Robić z OBOWIĄZKOWYM testem C (wczytany stary save) + MC (D):
- **D1 dirty/clean cash** — warstwa NAD `G.money` (synchronizator dirty+clean==money), `earn(...,careerSource)` kieruje nielegalne→dirty / legalne→clean. **Migrator: stare G.money = clean** (NIE legalizować wstecz). Fundament prania. NAJWYŻSZE ryzyko save → test wczytanego save absolutnie obowiązkowy.
- **D2 pranie** — sztuka/biżuteria/antyki + wycena rzeczoznawcy (uczciwa/kreatywna/agresywna+audit_risk) → konwersja dirty→clean. Rozbudowa `LUXURY_ASSETS` (migrator string→obj) + nowy tier „Kolekcje". Zależy od D1.
- **D3 heat 7-kanałowy** — `G.trap.heatCh{street,customs,fiscal,env,media,digital,violence}`, overall=śr. ważona; `G.trap.heat` ZOSTAJE jako UI single-source (kompat). Mapuj istniejące przyrosty na kanały. Integruj z TIER 4 (env) / 6 (media) / 8 (evidence).
- **D4 model pion/sieć** — `G.trap.orgModel` (null default = brak kary dla starych save), konsekwencje (pion: szybciej ale nalot=utrata wszystkiego; sieć: cut zysku ale taniej utylizacja + odporność).
- **D5 pamięć NPC** — matryca {trust,fear,respect,resentment,professionalism,leverage,memoryTags} nad dealerami/pracownikami (lazy default z loyalty), reaktywność wg tagów. Pilot na 1-2 NPC potem rozszerz.

## 6. Kolejność (ROI) + miejsce DEFER-ów
TIER 3 (dokończ F3.2 kradzież) → **TIER 4 utylizacja** → 5 clarity → 6 publiczne (sprzężenia) → **7 lab+front+ekipy** (tu wstaw **D1 dirty/clean** bo front/legalizacja go wymaga, potem **D2 pranie**) → 8 evidence (+**D3 multi-heat**) → 9 łapówki → 10 odbudowa → **D4 org-model + D5 NPC-memory** (TIER 11-12) → **E: końcowy audyt całego PDF (ultracode)** = dopiero wtedy „narkobiznes DONE".

## Stałe zasady (z lekcji projektu)
Adaptacja nie duplikat · save-safe defensywny init + **test wczytanego starego save per TIER (C)** · MC ekonomii (D) po TIER 4/7/koniec · reguła #11 (gładko, asymptota, NIE łamać trap ~15-18k bez świadomej decyzji) · click=nagroda/spam ZAKAZANE · grey-lock zamiast znikania · każdy moduł hook do ≥2 innych (Cz III) · ledger aktualizowany per faza · patch note Vegan ZERO apostrofów · commit -F + deploy sync · NIE pytać o decyzje (są tu) · turę kończyć STATUSEM.
