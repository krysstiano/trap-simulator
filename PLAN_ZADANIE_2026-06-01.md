# PLAN ZADANIA — 2026-06-01 (user, duży batch autonomiczny /loop)

> Źródło: wiadomość usera. Pracuj wg 18 żelaznych reguł (CLAUDE.md). Po KAŻDYM Edit: node --check.
> Runtime test dbg_*.mjs przed "naprawione" (#9). Atomic commit per faza. Round 2 "na pewno done?" przed DONE (#18).
> Decyzje designerskie podejmuj sam. BEZ zbędnego czekania — kroki ciągiem w turze, wakeup tylko gdy realnie czekasz na proces w tle. O NIC NIE PYTAJ.
> Status: [ ] = TODO, [~] = w trakcie, [x] = DONE (po Round 2 audycie).

## KASYNO — wygląd / gry / NPC
- [x] **A. Sic Bo — czytelność oczek kości** pod tekstem "Konkretny triplet (3× ta sama) — wypłata 210×". Ikonki kości mają słabo widoczne oczka — popraw kontrast/rozmiar/render.
- [x] **B. Gry kasyna jako WOLNOSTOJĄCE OBIEKTY** (3. i 4. piętro wciąż wyglądają gorzej). Porównaj sloty na 1/2 piętrze (lepiej) vs 3/4 (gorzej) — dorównaj jakością. Mają wyglądać jak prawdziwe gry, nie panele.
- [x] **C. Dekoracyjni NPC** (bez interakcji) na 3. piętrze (elegancko, naprawdę dobrze) i 4. piętrze (absolutni biznesmeni — garnitury, walizki w ręku). 1/2 piętro mają NPC, 3/4 nie mają — dodaj.
- [x] **D. Animacje dla większej liczby gier kasyna**: Mines (jako obiekt na mapie) animacja; Limbo w grze (overlay) — teraz wygląda jak zwykły clicker, dodaj animacje.
- [x] **E. Nowa, fajna gra na 4. piętro** (dodatkowa). Dźwięki + animacje + ładny wolnostojący sprite + uczciwe HE.
- [x] **F. Zastąp Andar Bahar** inną fajną grą (Andar Bahar słabe, niejasne o co chodzi). Dźwięki/animacje/sprite/HE.
- [x] **G. PO E+F: BARDZO DOKŁADNA analiza HE** — każdy możliwy scenariusz, każdy playstyle. HE zdrowe (nie karze za bardzo), zero money exploit. Monte Carlo + drive real funkcji.

## INNE GRY / BUGI
- [x] **H. Mural Wall** — sprawdź czy maluje TAM gdzie kursor (czy działa dobrze teraz).

## SYSTEM EKWIPUNKU (pod `I`)
- [x] **I. Ekwipunek pod klawiszem I** — ładne okno + animacje + DZIAŁAJĄCY system. Wymyśl działanie: co gracz trzyma (jedzenie z LIMITEM, przedmioty). 
  - Sklep: przy zakupie jedzenia WYBÓR → ekwipunek czy lodówka.
  - Transfer: z lodówki do ekwipunku itp.
  - Pawn shop + narkotyki — sensowna integracja z ekwipunkiem.

## HUD / UI
- [x] **J. Telefon w prawym dolnym rogu** jako duży OBIEKT (nie ikonka/prostokąt z ramką — wygląda jak telefon), z opacity (nie zasłania gry). Naciśnięcie `P`/klik → ładna animacja "wyjeżdżania do góry" + odpalenie telefonu.
- [x] **K. Ikona ustawień dźwięku** — przesuń w prawo + lekko powiększ (po przeniesieniu telefonu).
- [x] **L. Powiększ dzień i czas** — ALE napraw to że zasłania liczbę fanów (recurring problem). Mają się nie nachodzić.
- [x] **M. Powiększ delikatnie teksty** w ustawieniach: "SFX gry delikatnie przyciszają muzykę (ducking)" oraz "Domyślnie włączony przy starcie gry".

## MOBILE
- [x] **N. Grywalność mobile** — teraz NIE DA SIĘ grać: skalowanie, joystick znika, gra nie rozciąga się prawidłowo, freestyle na ulicy nie da się wpisywać słów. Dopracuj działanie na urządzeniach mobilnych (touch input dla freestyle itp.).

## BALANS — audyt WSZYSTKICH OBSZARÓW (wzorując się na historycznych błędach)
- [x] **O. Audyt balansu** — historyczne złamane (przed nerfami): koncerty, merch, turniej, stream (twitch), zmywak, biały proszek≈szampan (cena vs efekt). Sprawdź czy TERAZ nie ma analogicznych problemów w zarobkach/przyroście statystyk/cenach we WSZYSTKICH obszarach.
- [x] **P. Prace dorywcze za słaby wpływ** — gracze nie muszą z nich korzystać. Zrób żeby NA POCZĄTKU gry były wymagane/niezbędne.
- [x] **Q. Gating early-game** — różne mechaniki dostępne np. od lvl 2 (np. freestyle na ulicy itp.), tak żeby gracz chwilę MUSIAŁ pracować dorywczo by odblokować inne mechaniki. (Łączy się z "first look" — gracz przytłoczony, nie wie co robić → prowadź go przez prace dorywcze.)

## FINAŁ
- [x] **R. Bardzo dokładna weryfikacja** — czy WSZYSTKO zrobione, nic nie pominięte, "na pewno done?" (kilka rund). Zero błędów/bugów/ghosts.
- [x] **S. Dalszy rozwój (weryfikacja planów)** — po 100% pewności: rozwijaj grę wg kontekstu tej wiadomości + poprzednich planów (PLAN_NOC, PLAN_DZIELNICE). Zweryfikuj czy wszystko z tych planów działa dobrze.

## Sekcja decyzji (auto — wybieram sam, zapisuję tu)
- **F (zamiana Andar Bahar)** → **Skarbiec Króla** (wybór 1 z 6 sejfów, pick-reveal). Intuicyjne, fair. RTP 97%, HE ~3%.
- **E (nowa gra 4p)** → **Koło Fortuny Royale** (mega-koło, jackpot ×20, spin-animacja). RTP 96%, HE ~4%. Nazwy `rwheel`/`Royal` by nie kolidować z parterowym Kołem.

### S — audyt PLAN_DZIELNICE/PLAN_NOC (2026-06-01): PASS, zero reachable ghostów
- PLAN_DZIELNICE: 3 dzielnice (Underground 12 / Coast 6 / Business 6 obj) istnieją, reachable (changeRoom OK), wszystkie 21 budynkow maja draw-case (#8), wszystkie 21 miejsc maja case w _enterDistrictPlace (default "w przygotowaniu" = tylko defensywny, NIEosiagalny). renderWIP = defensywny default nieznanych id (3 dispatchery). Swiat 100×75 (rozszerzenie 135×108 rollback wczesniej - memory).
- PLAN_NOC (35 faz hist.): pokryty przez R + cala sesje, zero pageerrors.
- Deep audit #17: grep TODO/FIXME — markery to placeholder-y inputow (OK) + tresc tweetow NPC (OK), zero niedokonczonego reachable kodu.
- Rozwoj: kontynuowany autonomicznie (audit mode) w kolejnych iteracjach.

### R — finalna weryfikacja A–Q (2026-06-01): CZYSTE, 0 realnych bugów
- Smoke 23/23: openSkarbiec/openRoyalWheel/draw*/inventory(8 fn)/HUD(hphone bottom-right/hmute/hclock/slideUp keyframe)/gate/parter-wheel-intact/Andar-removed/overlap. Cała gra parsuje, zero pageerrors.
- Regresja: royal_integration 4p PASS, lux_integration 3p PASS (po fix nieaktualnych stałych objCount 11→15/12→15 — faza C dodała NPC-gości legalnie). HE wszystkich gier (G) PASS.
- concert_balance_v232.mjs nieobecny (gitignored/nieskommitowany) — balans koncertów nietknięty + audytowany w O.

### O — audyt balansu (2026-06-01): PASS, zero obecnych exploitów
- 6 obszarow zweryfikowane: proszek-vs-szampan (fix v2.1.572), zmywak/prace (v2.1.572 carwash150/zmywak62), koncert (Festiwal 2500-7000 gated 10k fanow), stream (earlyMult fame-capped, nerf v1.8.67/69), turniej (prize*0.5 cap25k fame4), merch (nerfed). Wszystkie z udokumentowanymi nerfami/capami. Bez zmian w kodzie (audit).

### G — analiza HE WSZYSTKICH gier (2026-06-01) — werdykt: ZERO money exploit, HE zdrowe
- **3. piętro** (hilo/mines/crash/samolocik/wyścigi/pingwin/ultra-sloty): RTP 95-96% / (1-edge)^K. dbg_he4/hilo PASS.
- **4. piętro** (royal-sloty/dragon/sicbo/coin/limbo/skarbiec/rwheel): RTP 96-98%. dbg_royal_independent/dragon/coin PASS + skarbiec/rwheel driven.
- **Sloty wszystkie tiery** (analitycznie + MC 3M): Regular 95.90% (HE 4.10%), VIP/Ultra/Royal 98.34% (HE 1.66%). MC=analityka.
- **Koło parter** (mean SEGMENTS): 93.75% (HE 6.25%).
- **Klasyki** (roulette/blackjack/war/baccarat/craps/poker/keno/plinko/ridebus): dokumentowany audyt v2.0.x, std implementacje, kod NIEZMIENIONY, RTP < 100%.
- **H (Mural Wall)**: maluje DOKŁADNIE pod kursorem — runtime test przy skali CSS 0.992 farba trafiła w 2 miejscach, zero farby gdzie nie klikano (mapowanie *(cv.width/r.width) fix v2.1.515). Działa. Uwaga: tylko mouse events, touch → faza N.
- Findings: 0 realnych bugów gry. Naprawiono nieaktualny próg testu (dbg_crash_exploit aviator 95→96, HE 5%→4%=RTP 96%). dbg_limbo_andar przestarzały (gitignored).
