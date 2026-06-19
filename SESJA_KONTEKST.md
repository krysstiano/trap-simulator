# Kontekst sesji testowej — Snowy Simulator

**Data startu sesji:** 2026-05-09
**Stan gry przy starcie:** v0.9.1 (commit ed5dade)
**Ostatni commit:** 40ebf43 (v0.9.61)

## Czym jest ta sesja

Użytkownik testuje grę i zgłasza wszystkie rzeczy do naprawy/zmiany/rozbudowy. Wiadomości są zapisywane jako plan do realizacji.

**Tryb pracy:**
- Faza 1 (zbieranie zgłoszeń): zakończona — 45 punktów + 1 deferred
- Faza 2 (implementacja): w toku, zaakceptowana kolejność wykonania

## Pliki referencyjne

1. **`PLAN_SESJA.md`** (główny) — pełen plan z protokołem działania, legendą i wszystkimi punktami z pełnymi cytatami
2. **`PLAN_DEFER.md`** — odłożone do realizacji PO PLAN_SESJA.md (Beat Sequencer z podpowiedziami + custom dźwięki)
3. **`SESJA_KONTEKST.md`** (ten plik) — meta-kontekst, postęp, kolejność wykonania
4. **`CLAUDE.md`** — instrukcje projektowe
5. **`NOTATKI.md`** — historyczny kontekst

## Protokół działania (z PLAN_SESJA.md)

Dla KAŻDEGO punktu:
1. PRZED — przeczytaj pełen opis w PLAN_SESJA.md (cytaty + szczegóły) + DEFER + CLAUDE + NOTATKI
2. W trakcie — zakres jak opisany (wąski/szeroki), brak regresji
3. PO — testy (state.mjs + Playwright), analiza, **ponowna lektura pełnego opisu**, update PATCH_NOTES, commit
4. Dopiero potem następny

Komunikacja: autonomicznie do końca każdego punktu, ale STOP przy 1% niepewności. Bugi po drodze → C (zatrzymuję się i pytam).

## Kolejność wykonania (zaakceptowana przez gracza)

**Faza 0 — narzędzie:** ✅ #24 Admin Panel
**Faza 1 — krytyczne:** ✅ #40 Major Label glitch, ✅ #41 Wyjścia z budynków
**Faza 2 — szybkie wygrane:** ZAKOŃCZONA ✅ KOMPLET (#1-7, #11, #15-19, #21, #27, #31-35, #38)
**Faza 3 — systemowe średnie:** #25, #26, #12, #28, #44+#51, #20, #23, #45, #8
**Faza 4 — Audyt:** #13 + #37 + #50 + #33 + #43
**Faza 5 — duże rebuildy:** #29, #30, #10, #9, #36, #22, #46, #42
**Faza 6 — DEFER:** D1 (Beat Sequencer custom)

## Postęp (78/78 PLAN_SESJA + D1 DEFER + audyt #20 finalny, v0.9.58)

| # | Punkt | Commit |
|---|---|---|
| 24 | Admin Panel rozszerzony | 13bf692 + b60a91f |
| 40 | Major Label exploit + apartments | 1b24f26 + d51b1a3 |
| 41 | Wyjścia z budynków + audyt respawnów | 233fefc |
| 32 | Freestyle drugi mikrofon | 9c107db |
| 19 | Fryzjer głowa | 163a477 |
| 11 | Pasy drogowe białe + crosswalk | b539250 |
| 5 | VIP Fontanna 4 strony | e2a5b6b |
| 18 | Zbyszek + Crew okno otwarte | c5cf0a8 |
| 38 | Bank limit 3 inwestycje | 8a58088 |
| 17 | Targ tylko do lodówki | 8b2b9fd |
| 15 | Strój sportowy realne bonusy | 9410cc4 |
| 16 | Czas gry 2× szybciej | 3053c83 |
| 7 | Anonimowa darowizna 1500→600 | d8889af |
| 31 | Kondycja → główne drzewko | 2a2fece |
| 1 | Storyline 1 fix auto-zaliczenia | 507168e |
| 2 | Storyline 2 opis freestyle | fb3c4b6 |
| 3 | Kompas firstjob multi (6 pinów) | dd2e47d |
| 4 | Job agents "Praca!" dymek z fade | f1b31d7 |
| 27 | Wskazówki guard (minigry/phone/overlay) | c59903a |
| 34 | Twitter/IG daily reset zweryfikowane + UX | 5376255 |
| 35 | Instagram sposoby zdobywania followers | 9240f6d |
| 21 | Zmywak kursor + session token | eaad1dd |
| 6 | Mapa filtruj apt_* zagospodarowanie | 81e276a |
| 47 | Anti-stuck-key (postać sama nie idzie) | a4f61cc |
| 25 | Studio/Siłownia pełny viewport + komputer | 8277c1e |
| 26 | Realizator wymóg zlecenia + msg z-index 200 | 33af0af |
| 23 | Godziny otwarcia — jedzenie 24/7 | 03b3f14 |
| 8 | Designerska ławka premium | b686b4a |
| 28 | Siłownia full fix (ławka/wyciąg/bieżnia/maty) | a24f6d0 |
| 46 | Browser confirm → in-game modale | 6861312 |
| 27 | Pizzeria praca+jedzenie (8 pizz) | 41b1d25 |
| 44 | Logika kontekstowa IG/sklep | bcb1317 |
| 37 | Merch random_event guard (część bcb1317) | bcb1317 |
| 21 | Storyline natychmiastowa aktualizacja | 5db1faf |
| 40 | Czas gry — autosync pora dnia + dzień | 34870b6 |
| 19 | HUD rework + zegar nie nachodzi | 2a838e3 |
| 29 | Polish (batch 1: zmywak) | b7cdba1 |
| 49 | Sloty zapisu — picker przy nowej grze | 8b3e31f |
| 52 | Home Studio w mieszkaniu | 1bd64d6 |
| 55 | Storyline V2 → naturalny opis | 15d8b65 |
| 56 | HUD: Dzień X (powrót) | 15d8b65 |
| 57 | Budka kebab +45% | 15d8b65 |
| 58 | NPC park z-order po obiektach | 15d8b65 |
| 59 | Menu nadpisz save działa | 7e8f4d8 |
| 60 | Traphouse plamy + tint usunięte | 7e8f4d8 |
| 61 | TRAPLIFE przesunięty na biuro | 7e8f4d8 |
| 62 | IKEA rebuildAptTile + sofa/bed lux | 7e8f4d8 |
| 43 | Spotify rozbudowa + IG posty (batch 1) | a676221 |
| 20 | Audyt: Zbyszek + random rewards (batch 1) | 63a7e9b |
| 63 | Audyt prac dorywczych — Tier 1 wyrównany | f276daa |
| 50 | 3 side storylines (Drip/Forma/Apt) | 8ca1c8d |
| 65-69 | rep/wskazówki/XP/mikrofon/sława rebalans | 376ed24 |
| 64+70 | System rachunków + eksmisja | d656498 |
| 36+37 | Studio fixy (sequencer/mikser/genre) batch 1 | 252de47 |
| 36B+37E | Studio batch 2 (pianki stack + upload flow) | 110da96 |
| 37D | LUFS rebuild — skala dB + mixQ-dependent | bf318c9 |
| 71-74 | tempo 5min, siłownia, freestyle, rachunki rebuild | 004e332 |
| 75-77 | nerf prędkości + IKEA polish + audyt bonusów (3 BUGI) | a0f35b5 |
| 53 | Spektakularny poradnik — cinematic intro + tutorial | 5504c08 |
| 17 | Samochody — wsiadanie V + nerf + bug bonus | 2539991 |
| 16 | Mapa zróżnicowana — 4 zielone skwery | 87890c4 |
| D1 | Beat Sequencer tryb SAM lub Z PODPOWIEDZIAMI | 09eec44 |
| #73 polish | Zapłać wszystkie rachunki — 1 klik | 53af75c |
| #43 batch 2 + #50 expand | Twitter rebuild + 3 nowe side storylines | 2f0e33d |
| #20 finalny | Pełny audyt gospodarki + Bank nerf | 804030b |
| #30A + #29A/B | Mikser/Kabina info + LED studio + akustyka stack | fa1450d |
| #9 dolny pas + #29D zlecenia | 4 nowe GREEN_PATCHES + system zleceń (4 typy) | 52a43da |
| #26 punkt 2 | msg z-index 9999 (zawsze na wierzchu) | 40ebf43 |

## Kontynuacja w nowej sesji

Jeśli sesja się skończy:
1. Czytaj ten plik (SESJA_KONTEKST.md) najpierw
2. Potem PLAN_SESJA.md (cały — protokół, legenda, 45 punktów)
3. Potem PLAN_DEFER.md
4. Sprawdź `git log --oneline -20` — ostatni commit 2a2fece
5. Pytaj użytkownika czy lecimy dalej, czy chce coś przetestować
6. Auto-memory powinno wskazać te pliki

**Zasady które obowiązują dalej:**
- 100% pewności przy autonomicznym przejściu
- bugi po drodze → STOP + pytanie (C)
- save compat = B (akceptujemy że stare saves mogą wymagać new game)
- czytanie pełnych wiadomości PRZED i PO każdym punkcie

## Aktualny stan gry

- Brak błędów JS (state.mjs ✓)
- Wszystkie 14 commitów testowane
- PATCH_NOTES aktualne (v0.9.1 → v0.9.14)
- Plan + DEFER + memory zsynchronizowane
