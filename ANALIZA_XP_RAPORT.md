# RAPORT — ŹRÓDŁA XP W TRAP SIMULATOR

**Data:** 2026-05-15

## Mechanika XP (linia 11656 `function addXP`)

```js
amount = Math.max(0, amount|0)  // negative guard + truncate
G.xp += amount * 0.5 * (1 + _sk('czytanie')*0.05 + _pu('czytanie')*0.15)
```

**Czytanie:** `max:3` poziomy umiejętności (po +5% każdy → max **+15%**) + `_pu()` zwraca COUNT 0-3 (po +15% każdy → max **+45%**).
**Evolution "Mędrzec"** daje +1 darmowy pkt umiejętności co 3 lvl postaci — **NIE jest mnożnikiem XP**.

**Czyli:** `addXP(100)` daje faktycznie ~50 XP (mnożnik 0.5 wpisany w funkcji).
Z max skill czytanie 3/3 + max PU 3/3: bonus **+60%** (15% + 45%) — `addXP(100)` daje **~80 XP**.

**Krzywa wymagania:**
- Lvl 1 → 2: **150 XP** (czyli addXP(300))
- Lvl 2 → 3: **270 XP** (czyli addXP(540))
- Lvl 3 → 4: **486 XP**
- Lvl 4 → 5: **874 XP**
- Lvl 5 → 6: **1574 XP**
- Formuła: `150 * 1.8^(level-1)`
- Cap: Level 100

---

## ŹRÓDŁA XP (74 unikalnych wywołań `addXP()` w kodzie)

### 🛋️ ODPOCZYNEK / REGENERACJA (małe XP)
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Sen w łóżku (per tick, gdy >=20 ticks) | 5 | 9782 |
| Odpoczynek na ławce (relaks) | 5 | 8720 |
| Odpoczynek przy stawie | 3 | 8732 |
| Patrzenie w akwarium | 2 | 8807 |
| Rzut monetą do fontanny | 5-15 (losowe) | 8745 |

### 🍔 JEDZENIE
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Jedzenie (`eat()` recipe) | recipe.xp (variable, typowo 3-15) | 10585, 18727, 18777 |

### 💼 PRACE DORYWCZE
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Pizzeria (per customer obsłużony) | 15 × count | 19937 |
| Kurier (per dostawa) | 12 × count | 20234 |
| Carwash (per stage) | 20 × stage/6 ≈ 0-20 | 20343 |
| Carwash (quest) | 20 | 20500 |
| Construction (per frac) | 25 × frac (0-25) | 20601 |
| Construction quest | 22 | 20814 |
| Zmywak | earned/5 | 20967 |
| Zmywak (small bonus) | 5 | 21217 |
| Zmywak akcja | 5 | 21341 |

### 🎤 KARIERA RAPERA
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Nagranie tracku w studio | 15 | 12097 |
| Koncert (uproszczony) | 40 + quality × 0.5 | 17186 |
| Koncert payment + sława | 60 | 17236 |
| Wydanie albumu | 100 | 16779 |
| Freestyle minigame | 50 + accuracy/2 | 19482 |
| Major Label (regional) | 50 | 17302 |
| Global Label | 100 | 17302 |

### 🎵 BEATMAKER
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Sprzedaż beatu | 20 | 15564 |
| Mass beats produkcja | 30 | 15570 |
| Radio beats | 20 | 15579 |
| Beat pack (5 beatów) | 70 | 15601 |

### 🎬 YOUTUBER
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Edycja video | 15 | 15187 |
| Premiera video (typ 1) | 20 | 15227 |
| Premiera video (typ 2) | 25 | 15259 |
| Quest YT | 30 | 15282 |
| YouTube quality post | round(15 × quality/100 × 2) | 15503 |

### 🎮 GAMER
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Tournament win | 50 | 15777 |
| Game played | 15 | 15785 |
| Combo (FPS) | 20 + maxCombo | 16154 |
| Rank up | 30 | 16296 |
| Standard game played | 12 | 16297 |
| FPS Game (xpGain variable) | xpGain | 22033, 22434 |

### 📸 INFLUENCER
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Post (sponsored) | 25 | 16335 |
| Post quality | round(10 + quality/10) ≈ 10-20 | 16479 |
| Quick post | 5 | 16518 |
| Sponsorship | 30 | 16524 |
| Big sponsorship | 50 | 16536 |

### 🎧 SOUND ENGINEER
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Projekt audio | o.xpGain (variable) | 16748 |
| Ghostwrite | 35 | 16805 |

### 🎼 PRODUKCJA / STREAM
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Spotify quality release | round(15 + quality × 0.2) | 16659 |
| Studio sesja | 15 | 17076 |
| DAW edit | 10 | 17114 |

### 📱 SOCIAL MEDIA (codzienne)
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Instagram post | 5 | 23122 |
| Twitter post | 3 | 23257 |

### 🎯 QUESTY / MILESTONES
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Daily Quest (Wiktor) | quest.xp (typowo 50-200) | 10412 |
| Milestone (fans) | ms.reward.xp (typowo 100-500) | 11520, 26553 |
| Storyline reward | q.reward.xp (typowo 50-300) | 32972, 33123 |
| Daily reward (sleep) | 4 | 32781 |
| Daily reward | 4 | 32824 |
| Crew Challenge | 500 (lub challenge.reward_xp) | 39143 |

### 🎰 KASYNO / DZIAŁANIA POMOCNICZE
| Akcja | XP | Lokalizacja |
|-------|---|----|
| Casino win | 10 (warz, slots) | 14746, 14770 |
| Concert (NPC interakcja) | 30 | 9405 |
| Sklep | 3 | 9335 (×5) |
| Side quest NPC | 25 | 10058 |
| Side quest big | 50 | 10863 |
| Trening siłownia | 20 | 11768 |
| Minigra score | score/5 | 21341 |
| Minigra score (weak) | score/80 | 21664 |
| Minigra score (medium) | score/8 | 21833 |

### 🎵 MIXING / MASTERING
| Akcja | XP | Lokalizacja |
|-------|---|----|
| FPS quality minigame | 15 (>=60% pct) lub 5 | 19822-19823 |

---

## TOP 10 NAJWIĘKSZYCH ŹRÓDEŁ XP (jednorazowe)

| Akcja | XP | Notatki |
|-------|---|---------|
| 1. Wydanie albumu | 100 | Wymaga 5+ trackow |
| 2. Global Label deal | 100 | Late game |
| 3. Crew Challenge | 500 (jeśli ustawione) | Tygodniowy |
| 4. Beat pack (5 beatów) | 70 | Beatmaker career |
| 5. Koncert payment | 60 | Z bonusem sława |
| 6. Freestyle minigame perfect | 50+50/2 = 100 | Accuracy 100% |
| 7. Tournament win | 50 | Gamer career |
| 8. Major Label / Big Sponsorship | 50 | Mid game |
| 9. Koncert quality | 40 + q × 0.5 | Up to 90 z quality |
| 10. Ghostwrite | 35 | Sound engineering |

## Średnie XP per godzina gry (estymacja przy normalnym graniu)

- **Casual gracz** (1-2 akcje/min): ~30-60 XP/min, ~1800-3600/godz
- **Aktywny gracz** (career + questy): ~80-150 XP/min, ~5000-9000/godz

## Po 0.5× multipliera + skill bonus

- addXP(100) → faktycznie +50 do XP G.xp (bez skill)
- addXP(100) → +80 z max czytanie (skill 3/3 + PU 3/3, łącznie +60%)

## Tempo levelowania (bez czytanie skill)

- Z 0 do lvl 5: potrzeba 150 + 270 + 486 + 874 = **1780 XP**
- W addXP wartościach: trzeba `addXP(3560)` (przed multiplier 0.5)
- = ~36 koncertów (×100 XP koncerty), albo ~120 questów małych, albo ~50 średnich akcji

## Sprawdzenie spójności

✅ Wszystkie ścieżki kariery (rap, beatmaker, YT, gamer, influencer, soundeng) dają XP
✅ Prace dorywcze dają XP (proporcjonalne do wysiłku/wyniku)
✅ Daily quests + Crew challenges dają XP
✅ Milestones (fans) dają jednorazowe duże XP
✅ Czytanie skill multiplier działa (linia 11656: `_czytMult`)
✅ Level 100 cap (linia 11577 `if(G.level>=100) return`)
✅ Multi-level handling przy duże addXP (v1.9.21 while-loop fix linia 11581)
⚠️ NIESPÓJNOŚĆ UI ↔ kod naprawiona v2.1.28: PU "+50%" w drzewku dla 12 skilli faktycznie dawał +45%; PU "+100%" dla charyzma/drip_master/youtuber faktycznie daje +90%.
⚠️ Ghost PU (wykryte v2.1.28, do decyzji): Beatmaker/Gamer/Influencer/Sound Eng./Zmywak Pro mają w opisie PU "+30/+60/+100%" — ale w kodzie te PU NIE są nigdzie naliczane (brak `_pu('<skill>')`).

## Plik źródłowy
Wszystkie 80 wywołań `addXP()` w `E:\Snowy Simulator\index.html`. Pełna lista linii: grep `addXP\(`.
