# PLAN_PROGRESS 2026-05-12 — Lista użytkownika

**31 klas problemów (~70 zgłoszeń pojedynczych), pracuję autonomicznie do rana.**

Memory rule: smoke testy WYŁĄCZONE. Reguła żelazna: nic nie nachodzi na nic.

## STRATEGIA — kolejność implementacji

### FAZA 1: USUWANIE (user prosi wprost "USUŃ TO!!!!!!")
- C. Dziwne obiekty (czerwone/żółte/zielone prostokąty na ulicy)
- R. Kumulacja.png — park zlany z blokami, kosz/fontanna na blokach, trawa
- S. Hit.png — demonstracja (kolorowi ludzicy)
- I. Mieszkanie podstawowe bałagan
- N. Reklamy NIKE/SAMSUNG/COCA/BURGER z niewłaściwych miejsc

### FAZA 2: NAPRAWA MECHANIKI
- F. Mechanika świateł (DECAY, auta zatrzymują PRZED skrzyżowaniem)
- Y. Prędkość gracza (bug diagonal)
- X. Bug głośnego dźwięku + nakładania pieniędzy
- V. Respawn, rachunki, mróz, cinematic kroki
- AC. NPC idle tylko na chodnikach
- E. Sygnalizatory stare wystające
- P. Pasy drogi — dziura

### FAZA 3: NAPRAWA NPC
- D. NPC bugy (biegacz, parasole, dziecko hulajnoga, psy, znikanie)
- J. Park NPC + ławka
- AD. NPC praca przesunąć
- AB. Boisko przenieść spod supermarketu
- H. Apt_premium chaos

### FAZA 4: POPRAW WIZUALNE
- A. Graffiti (max 16 znaków, pozycje, jakość)
- G. Autobus + przystanki
- K. Penthouse (skrzynka, lampka, H, animacja)
- L. Cykl dnia (gradient)
- M. Fullscreen czarne paski
- O. Świecenie zasłania napisy
- Q. Hologram ikony Dripu
- Z. Bieżnia + wyciag 120kg
- B. HUD prostokąt zasłania fanów

### FAZA 5: NOWE FUNKCJE (duże)
- T. Kasyno
- U. Wynajem mieszkań
- AA. Parking
- AC. Przystanki rebuild
- W. Kreator postaci dokończ

### FAZA 6: KONTROLA
- AE. Finalna kontrola podobnych błędów

## REGUŁA ŻELAZNA — pre-flight check

Per każdą nową/zmienianą pozycję obiektu sprawdzam:
1. `_isOnRoad(wx, wy)` — czy na jezdni
2. `_isOnBuilding(wx, wy)` — czy na budynku (ROOMS.ulica.objects, w>60, h>60)
3. `_isOnDecorBlock(wx, wy)` — czy na DB_DECORATIVE bloku
4. Min distance 40px od innych ozdób (hydranty, kosze, ławki, słupki peds, lampy)

KAŻDA pozycja zweryfikowana zanim trafi do kodu.
