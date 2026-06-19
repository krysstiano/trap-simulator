# PLAN_DECISIONS — Centralny rejestr decyzji balansowych

**Cel:** Wszystkie liczbowe decyzje balansu w jednym miejscu. Spójność w całej grze. Bez tego: w drzewku +5%/pkt, w gym +10%/pkt — niespójnie.

**Format:** każda decyzja ma: kontekst | wartość | uzasadnienie | sekcja PLAN_SESJA.md

---

## 💪 FORMA / KONDYCJA

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| Bonus prędkości / pkt kondycji (skill) | +5%/pkt | Max 25% — niezbyt OP | DRZEWKO + KONDYCJA |
| Spadek energii — bonus z formy=100 | -5% | Delikatna mechanika | FORMA→ENERGIA |
| Spadek zdrowia — bonus z kondycji=100 | -5% | Delikatna mechanika | KONDYCJA→ZDROWIE |
| Max stat bonus z formy=100 | +10 (110/120) | Cinematic milestone | FORMA/KONDYCJA 100 |
| Max stat bonus z kondycji=100 | +10 (analogicznie) | Cinematic milestone | FORMA/KONDYCJA 100 |
| Decay forma/kondycja przy braku treningu | 10-20% / dzień (random) | Po 3+ dniach | SPADEK FORMY |
| Cooldown dni przed SMS Gym Bro | 2 dni (sms na dzień 3) | "Bracie wbijaj na siłke" | SPADEK FORMY |
| Cooldown dni przed decay | 3 dni (decay od dnia 4) | Bardziej immersyjne | SPADEK FORMY |
| Pasywna regen energii (kondycja evolution) | 1 pkt /5 utraconych | NIE OP — gracz nadal musi spać | DRZEWKO kondycja evo |

## 🏋 SIŁOWNIA / STROJE

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| Strój sportowy bonus | +20% przyrostów | Tańszy ~150zł | STROJE TRENINGOWE |
| Strój PRO bonus | +25% + 1 dodatkowa seria | Droższy ~700zł | STROJE TRENINGOWE |
| Limit dziennych ćwiczeń | (do ustalenia) | Anti-grind | SIŁOWNIA |

## 🌳 DRZEWKO UMIEJĘTNOŚCI

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| Kondycja Power-up 1 koszt | 5 000 zł | Cheap entry | DRZEWKO |
| Kondycja Power-up 2 koszt | 15 000 zł | 3× droższy | DRZEWKO |
| Kondycja Power-up 3 koszt | 40 000 zł | 8× droższy niż 1 | DRZEWKO |
| Kondycja Power-up bonusy | -1% / -2% / -3% spadku energii | Skumulowane -6% | DRZEWKO |
| Kondycja Evolution koszt | 150 000 zł + 1 pkt umie | Najdroższy | DRZEWKO |
| Praca bonus zarobki / pkt | +15%/pkt (max 3 = +45%) | Wszystkie 6 prac | DRZEWKO |
| Kariera bonus / lvl powyżej 1 | +15%/lvl (lv2-5 = +60%) | YouTuber, Beatmaker, etc. | DRZEWKO |
| Odporność rebalans | -10%/pkt (max 3 = -30%) | Było -20%/pkt = -60% OP | DRZEWKO |
| Apetyt | -8%/pkt (max -24%) | OK, bez zmian | DRZEWKO |
| Charyzma | +10%/pkt (max +30%) | OK, bez zmian | DRZEWKO |

## 🎬 CINEMATIC

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| Cinematic gym tutorial — auto-close | NIE (klik gracza) | Wymaganie | CINEMATIC SIŁOWNIA |
| Cinematic forma/kondycja 100 — duration | ~5s auto-close | Krótka nagroda | CINEMATIC #2 |
| Cinematic comeback — duration | ~5s auto-close | Krótszy, cykliczny | CINEMATIC #3 |
| Anti-freeze safety cleanup | duration + 5s | Crash protection | CINEMATIC ANTI-FREEZE |

## 🪑 PARK NPC

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| PARK_BOUNDS | minX=96, maxX=660, minY=880, maxY=1230 | Margines od płotu (FT=14) | NPC W PARKU |
| Liczba NPC w parku | 6 (1 runner, 1 business, 1 elderly, 1 dogwalker, couple×2) | Bez zmian liczby | NPC W PARKU |
| Sit timer | 30-60s losowo | Dynamicznie | NPC W PARKU opcja B |
| Bench cooldown po wstaniu | 10s | Żeby ten sam NPC nie wracał | NPC W PARKU |
| Szansa próby siadania | 0.1% / tick / NPC | Średnio nowy gość co ~16-30s | NPC W PARKU |
| Próg dystansu siadania | 5px | Snap do sitX/sitY | NPC W PARKU |

## 📱 SOCIAL / SPOTIFY

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| Spotify weryfikacja stany | Niezweryfikowany / W weryfikacji / Zweryfikowany | Opcja B+C połączone | SPOTIFY |

## ⏱ TEMPO CZASU

| Decyzja | Wartość | Uzasadnienie | Sekcja |
|---------|---------|--------------|--------|
| 1 dzień real | 5 min | Punkt #74 | TEMPO CZASU |

---

## ⚠️ JAK UŻYWAĆ

1. **PRZED** podjęciem nowej decyzji balansowej → sprawdź czy nie istnieje już w tym pliku
2. Jeśli decyzja powiązana z istniejącą → utrzymuj proporcje (np. wszystkie +%/pkt zarobków = 15%)
3. **PO** podjęciu decyzji → zapisz tutaj + odnieś do sekcji PLAN_SESJA.md
4. Jeśli zmieniasz istniejącą decyzję → zaktualizuj WSZYSTKIE powiązane miejsca
5. Konflikty (np. dwie sekcje proponują inną wartość dla tego samego stat'a) → zgłoś użytkownikowi przed implementacją

## 🎯 ZASADY BALANSU OGÓLNE

- ❌ NIE OP — żadna pojedyncza statystyka nie daje gracza "złamanej" przewagi
- ❌ NIE złamane — gracz nadal musi grać (jeść, spać, ćwiczyć, pracować)
- ✅ Każdy bonus % per pkt = MAŁA wartość (3-15%)
- ✅ Maksy umiarkowane (kondycja max 25% prędkości, nie 100%)
- ✅ Power-ups rosnące geometrycznie (5k → 15k → 40k = 1×/3×/8×)
- ✅ Evolution = pieniądze + skill point (nie tylko pieniądze)
- ✅ Wszystko cykliczne (bonus +10 max wraca po powrocie do 100)
