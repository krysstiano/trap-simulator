# PLAN SESJA 2026-05-15 — ✅ WSZYSTKO ZROBIONE

## NPC / piesi
- [x] **1. NPC kolizja tylko na skrzyżowaniach** — v2.1.21: collision push ograniczone do crosswalk area
- [x] **2. NPC chodzi w miejscu po crossingu** — v2.1.21: `_pushedThisFrame` blokuje anim
- [x] **3. NPC migają** — v2.1.21: usunięty `ped.phase` (NPC znikał na 20-60 frame)

## Gracz
- [x] **4. Prędkość gracza niestabilna** — v2.1.21: cap _dt 3→6 + skip-frame przy >6

## Cinematic / Przelot kamerą
- [x] **5. Kroki podczas przelotu** — v2.1.21: P.moving=false na początku cinematic
- [x] **6. Odcięty pasek** — v2.1.21: letterbox 80→15vh + 60→12vh + visibility:hidden HUD
- [x] **7. Sterowanie strzałkami** — v2.1.21: keyboard handler ←/→/Esc + buttony UI
- [x] **8. Dziwny zoom** — v2.1.21: usunięty pośredni zoom-out 1.05

## PATCH_NOTES
- [x] **9. Kategoria Online** — istniała + zatagowano dodatkowe 9 wpisów
- [x] **10. Ucięte wpisy** — v2.1.21: `highlight()` escape'uje `<`/`>` + markdown
- [x] **11. Brakuje starych wpisów** — fix #10 odsłonił 444 wpisów (v0.1 do v2.1.21)

## Analiza kasyna
- [x] **12. Symulacja 1M prób** — `ANALIZA_KASYNO_RAPORT.md`, wszystkie HE zgodne ✅

## Analiza XP
- [x] **13. Zestawienie XP** — `ANALIZA_XP_RAPORT.md`, 80 źródeł XP zmapowane

## Bonus
- [x] **Smoke test po v2.1.21** — `dbg_smoke_v221.mjs`, 0 błędów JS, 30/30 NPC OK, 444 patch notes OK

## Pliki raportów
- `E:\Snowy Simulator\ANALIZA_KASYNO_RAPORT.md` — wszystkie HE zweryfikowane
- `E:\Snowy Simulator\ANALIZA_XP_RAPORT.md` — 80 źródeł XP w grze
- `E:\Snowy Simulator\ANALIZA_KASYNO.js` — kod symulacji (uruchom: `node ANALIZA_KASYNO.js`)
- `E:\Snowy Simulator\dbg_smoke_v221.mjs` — smoke test
- `E:\Snowy Simulator\AMBIVALENCJE.md` — pusty (brak ambiwalencji do końca sesji)
