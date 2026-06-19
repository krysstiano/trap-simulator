# PLAN_DEPENDENCIES — Graph zależności między sekcjami

**Cel:** Niemożliwe zrobić sekcje w złej kolejności. Pokazuje co MUSI iść PRZED czym.

---

## 🚨 KRYTYCZNE ZALEŻNOŚCI (must-go-first)

### Anti-freeze MUSI iść PRZED jakimkolwiek cinematic

```
CINEMATIC ANTI-FREEZE (linia 3338)
    ↓ MUSI BYĆ PIERWSZE
    ├─ CINEMATIC SIŁOWNIA (#1, #2, #3 — linia 2866)
    ├─ FORMA/KONDYCJA 100 cinematic (linia 2397)
    └─ Wszystkie inne cinematici w przyszłości
```

**Powód:** Nowy strażnik `if(document.getElementById('milestone-cinematic')) return;` w `updatePlayer()` jest infrastrukturą. Bez tego nowe cinematici będą miały bug "kroki podczas cinematic".

### Migracja G.skills MUSI iść PRZED drzewkiem

```
MIGRACJA G.skills number → object {lvl, powerUps, evolution}
    ↓ MUSI BYĆ PIERWSZE
    └─ DRZEWKO UMIEJĘTNOŚCI (linia 3048)
        ├─ Power-ups system
        ├─ Evolution system
        └─ Pasywna regeneracja energii
```

**Powód:** Cała logika drzewka czyta `G.skills.X.lvl` zamiast `G.skills.X`. Bez migracji save crashuje lub gracze tracą progres.

### Nowy getMaxStat() MUSI iść PRZED FORMA/KONDYCJA 100

```
getMaxStat(name) helper (z bonusami formy/kondycji 100)
    ↓ MUSI BYĆ PIERWSZE
    ├─ FORMA/KONDYCJA 100 max +10 (linia 2397)
    ├─ SPADEK FORMY (czyta max do clamp) (linia 2573)
    └─ Pasywna regeneracja energii (czyta max)
```

**Powód:** Bez `getMaxStat()` wszystkie funkcje `clamp(val, 0, 100)` używają sztywnego 100 — bonus +10 nie zadziała.

### Walidator chodników _isOnRoad() MUSI być stabilny PRZED LATARNIE/HYDRANTY/KOSZE

```
_isOnRoad(wx, wy) walidator
    ↓ MUSI BYĆ STABILNE
    ├─ LATARNIE chodnik only (linia 1650)
    ├─ HYDRANTY (z 44 punktów #2)
    ├─ KOSZE (z 44 punktów #4)
    └─ STUDZIENKI (z 44 punktów #5)
```

**Powód:** Wszystkie te elementy używają `_isOnRoad()` do walidacji pozycji.

---

## 🔗 POWIĄZANIA TEMATYCZNE (lepiej razem)

### BLOK SIŁOWNIA & FORMA/KONDYCJA — kolejność wewnętrzna

```
1. SIŁOWNIA krytyczny bug freeze (linia 1094)
   ↓ (gracz może w ogóle ćwiczyć)
2. SIŁOWNIA dalsze poprawki (linia 1262)
   ↓ (lepsze UI/UX)
3. WYCIĄG płyty (linia 1328)
   ↓ (wizualnie OK)
4. STROJE TRENINGOWE (linia 1580)
   ↓ (bonus z stroju)
5. FORMA → ENERGIA / KONDYCJA → ZDROWIE (linia 2182)
   ↓ (delikatne mechaniki)
6. FORMA/KONDYCJA 100 milestone + max +10 (linia 2397)
   ↓ (cinematic + bonus)
7. SPADEK FORMY/KONDYCJI + Gym Bro (linia 2573)
   ↓ (anti-grind)
8. CINEMATIC SIŁOWNIA (linia 2866)
   ↓ (3 cinematici z pełnymi info)
```

**Powód kolejności:** każda sekcja buduje na poprzedniej. Cinematici (#8) odwołują się do mechaniki z #4-7. Spadek (#7) używa max stat z #6.

### BLOK CINEMATIC

```
ANTI-FREEZE infrastruktura (linia 3338)
    ↓
FORMA/KONDYCJA 100 (linia 2397)
    ↓
CINEMATIC SIŁOWNIA #1 #2 #3 (linia 2866)
```

### BLOK DRZEWKO

```
1. Audyt blokad (czy careers.unlocked działa)
   ↓
2. Bonusy dla 8 brakujących skills
   ↓
3. Migracja G.skills number → object
   ↓
4. Nowa struktura SKILL_DEF (powerUps, evolution)
   ↓
5. getSkillTotalBonus() helper
   ↓
6. Power-ups UI
   ↓
7. Evolution UI
   ↓
8. 20 nowych skills (4 nowe kategorie)
   ↓
9. Epicki UI rebuild
   ↓
10. Balans wartości
```

### BLOK NPC PARK

```
1. Audyt aktualnego parkPeds (linia 615)
   ↓
2. Wykorzystanie palet z cityPeds
   ↓
3. Zastąpienie 6 starych NPC nowymi (runner, business, elderly, dogwalker, couple×2)
   ↓
4. PARK_BOUNDS odbijanie od płotu
   ↓
5. Kolizja z obiektami parku (fontanna, staw, breakdance)
   ↓
6. Ławka — wygląd (drewno + nogi metalowe + oparcie)
   ↓
7. drawSittingNPC() — siedzący sprite
   ↓
8. State machine: walking → goingToBench → sitting → leavingBench
   ↓
9. _occupiedBy + race protection
```

---

## 🔄 POWIĄZANIA CROSS-SEKCYJNE (wpływają na siebie)

### Drzewko ↔ Forma/Kondycja

- DRZEWKO: kondycja skill = +5%/pkt prędkości
- KONDYCJA→ZDROWIE: kondycja=100 = -5% spadku zdrowia
- Power-up kondycji: -1/2/3% spadku energii (skum -6%)
- Evolution kondycji: pasywna regeneracja
- **Test po obu sekcjach:** wszystkie 4 efekty kondycji widoczne i działające jednocześnie

### Cinematic ↔ Anti-freeze

- ANTI-FREEZE: strażnik DOM-first w updatePlayer()
- WSZYSTKIE cinematici: muszą mieć id `*-cinematic` żeby strażnik je wykrył
- **Test:** każdy cinematic blokuje ruch + nie freezuje po zamknięciu

### NPC park ↔ Płot ↔ Obiekty parku

- NPC PARK: PARK_BOUNDS odbijanie
- Płot: kolizje gracza (linia 5366-5375) — referencja
- Obiekty parku: fontanna, staw, breakdance, ławka — kolizje
- **Test:** 60s symulacja → żaden NPC poza bounds, żaden NA obiekcie

### Pogoda ↔ Prędkość

- POGODA: prędkość gracza zmienia się w śniegu/deszczu
- PRĘDKOŚĆ DIAGONAL: bug normalizacji √2
- KONDYCJA: +5%/pkt prędkości
- **Test:** wszystkie modyfikatory prędkości się sumują poprawnie (śnieg + diagonal + kondycja + auto bonus)

### HUD tooltips ↔ Drzewko

- TOOLTIPS HUD: kondycja tooltip pokazuje `G.fitness` (BŁĄD — powinien `G.skills.kondycja`)
- DRZEWKO: kondycja skill ma własną wartość
- **Test:** tooltipy pokazują ZGODNIE Z TYM CO REPREZENTUJĄ (forma=G.forma, kondycja-skill=G.skills.kondycja)

---

## 🎯 REKOMENDOWANA KOLEJNOŚĆ IMPLEMENTACJI (po protokole)

### Faza 1 — INFRASTRUCTURE (krytyczne fundamenty)
1. CINEMATIC ANTI-FREEZE (linia 3338) — strażnik DOM-first
2. getMaxStat() helper + clampStat() helper
3. Migracja G.skills number → object

### Faza 2 — SIŁOWNIA & FORMA (logiczna seria)
4. SIŁOWNIA bug freeze
5. SIŁOWNIA dalsze poprawki
6. WYCIĄG płyty
7. STROJE TRENINGOWE
8. FORMA → ENERGIA / KONDYCJA → ZDROWIE
9. FORMA/KONDYCJA 100 milestone + max +10
10. SPADEK FORMY + Gym Bro
11. CINEMATIC SIŁOWNIA #1, #2, #3

### Faza 3 — DRZEWKO (samodzielna duża sekcja)
12. Audyt blokad + bonusy 8 skills
13. Nowa struktura SKILL_DEF
14. Power-ups system
15. Evolution system
16. 20 nowych skills
17. Epicki UI
18. Balans

### Faza 4 — POLISH & NPC
19. NPC W PARKU + ławka
20. APARTAMENT PREMIUM bug
21. PRĘDKOŚĆ DIAGONAL
22. POGODA + emoji + mgła
23. LATARNIE chodnik only
24. KREATOR POSTACI

### Faza 5 — UI & SOCIAL
25. HUD kolejność
26. TOOLTIPS HUD
27. ADMIN PANEL rozszerzenie
28. SPOTIFY weryfikacja
29. SYSTEM UBRAŃ

### Faza 6 — RUCH MIASTA
30. SYGNALIZATORY ŚWIETLNE
31. NPC CROSSWALK
32. RANDOM EVENTS audyt

### Faza 7 — STARSZE PUNKTY (#1-#81)
33. Pozostałe sekcje numerowane wg priorytetu

### Faza 8 — 44 PUNKTY WIZUALNE
34. PLAN_44_PUNKTY.md sesje 3-10

---

## ⚠️ KONFLIKTY DO ROZWIĄZANIA

| Sekcja A | Sekcja B | Konflikt | Rozwiązanie |
|----------|----------|----------|-------------|
| TOOLTIPS HUD (kondycja=G.fitness) | DRZEWKO (G.skills.kondycja) | Tooltip kondycji pokazuje złą wartość | TOOLTIPS musi naprawić kondycja → `G.skills.kondycja` |
| FORMA/KONDYCJA 100 (max +10) | clamp(val, 0, 100) wszędzie | Sztywne 100 nie pozwala na 110 | Najpierw migracja na `getMaxStat(name)` + `clampStat(name, val)` |
| LATARNIE (44pkt) | LATARNIE chodnik only | Częściowo zrobione, częściowo nie | LATARNIE chodnik only ma być następny krok do 44pkt #1 |
| KREATOR POSTACI | KREATOR (44pkt #7-8 NPC) | NPC zróżnicowani już zrobieni | KREATOR dotyczy startu gry, NIE NPC w mieście |
