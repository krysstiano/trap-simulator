# Plan inspiracji z Schedule 1 + Gimper Simulator 3 (2026-05-25)

User-approved scope: SOLIDNA implementacja każdego systemu z runtime test + post-impl audit + balance. ZERO overlap (reguła #8). Atomic commits per faza (reguła #12).

## Kolejność wykonania (najmniejsza → największa)

| # | Faza | Inspiracja | Złożoność | Status |
|---|------|------------|-----------|--------|
| F6 | Polskie memy/easter eggs SMS+dialogi | GS3 | MAŁA | PENDING |
| F1 | SMS leady od klubów/festiwali deadline | S1 | ŚREDNIA | PENDING |
| F3 | Crew aktywne akcje (NIE auto) | S1 | ŚREDNIA | PENDING |
| F5 | Label artist pasywny cut + management | GS3 | ŚREDNIA | PENDING |
| F2 | Mixing recipes studio + recipe book | S1 | DUŻA | PENDING |
| F7 | 45+ mikro-aktywności | GS3 | DUŻA | PENDING |

## Skipped (do późniejszej sesji)

### F4 — Curfew nocny + Police wanted (Opcja 2 — pełen system)
**User decyzja 2026-05-25**: "Na razie opcja 3. ale zapisz gdzieś sobie opcje 2. bo później do niej wrócimy."

**Pełen wanted system (do późniejszej sesji)**:
- Po 23:00 patrole policji NPC na mapie (sprite + ruch jak inni NPC)
- Gracz może być zatrzymany (np. chase mini-game lub przypadkowy event)
- Kara = noc w celi (skip do rana, -10 mood) lub grzywna 200-500 zł
- Sklepy zamknięte 23:00-06:00 (część działa: kasyno, klub)
- Wymaga drawCityLife refactor + nowy police NPC sprite + cell building/courthouse
- Złożoność: DUŻA + KRYTYCZNE (zmiana day/night fundamentalnie)
- Decyzja designerska: jaki cell building? Komenda policji nowy lub w courthouse?

## Workflow per faza (mandatory)

1. **PRE-impl audit** (reguła #14) — grep istniejących analogów, sprawdzić co już jest
2. **Implementacja** — atomic edits
3. **Syntax check** — hook PostToolUse automatyczny
4. **POST-impl audit** (reguła #3) — grep wszystkich miejsc dla zmiany
5. **Runtime test** dbg_*.mjs (reguła #9 — gdy mechanika)
6. **Balance audit** — worst/best case mnożników, soft cap (reguła #11)
7. **PATCH_NOTES** wpis (mandatory)
8. **Atomic commit** (reguła #12)

## Decyzje user (sesja 2026-05-25)

| Pytanie | Decyzja |
|---------|---------|
| Strategia | Combo 1+2: wszystkie 6 faz, solidny polish per system |
| F2 Mixing scope | Combo 1+2: bit×producent×vocal + recipe book discovery |
| F7 Mikro-aktywności | Combo 1+2: 15-20 w istniejących + 30+ z nowymi lokacjami = ~45+ |
| F4 Curfew | Opcja 3 (skip) + zapisz opcję 2 do późniejszej sesji |
| Overlap | ZAWSZE zero overlap. Bloki DB_DECORATIVE można usunąć i zastąpić nowymi budynkami |

## Tracking

TaskCreate tasks #1-#6 utworzone, śledzenie postępu przez TaskList/TaskUpdate.
