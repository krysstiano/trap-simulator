# PLAN AUTONOMICZNY 2026-05-13

**Start:** 2026-05-13 (sesja autonomiczna minimum 3h)
**Backup:** index_backup_v1.8.41_2026-05-13.html
**Cel:** Realizować wszystkie zgłoszenia użytkownika, ulepszać grę, szukać i naprawiać bugi.

## Zgłoszenia z ostatniej wiadomości

### Krytyczne bugi
1. **showGain — zielone liczby nad HUDem** — audit za co dostaje, czy ma sens
2. **NPC nie przechodzą przez przejścia** — podchodzą, cofają się, "za nisko" przy dolnych przejściach
3. **Przystanek nad pizzeria/kurier obrócony w złą stronę** — wymaga 180° rotation
4. **Przystanek + hydrant** kolizja przy pizzeria
5. **Postać na przystanku za mała** — niewidoczna, powinna wyglądać jak NPC

### Ulepszenia
6. **Przystanki jeszcze większe** (pilnując kolizji)
7. **Linia fabularna kariery — nowe kroki**, logiczna progresja (łatwe → trudne)
8. **Achievements — więcej**
9. **Drzewko umiejętności — pracować**
10. **Wygląd okien, minigier — ulepszać**
11. **Mechaniki, kariery — rozwijać**

## Plan iteracji

### Iter 1 — Krytyczne bugi (showGain + NPC)
- [ ] Audit `showGain` — locate calls, sprawdzić wszystkie occurrences
- [ ] NPC crossing — debug position decision logic
- [ ] Test: verify zmiany syntax PASS

### Iter 2 — Przystanki redesign
- [ ] Rotacja per chodnik (N/S kierunek)
- [ ] Powiększenie (kolizje sprawdzone)
- [ ] Postać NPC na ławce wygląda jak normalny NPC
- [ ] Przesunięcie bs1 albo hydrantu by uniknąć kolizji

### Iter 3 — Storyline (linia fabularna)
- [ ] Audit obecnych kroków
- [ ] Reorder: łatwe→trudne
- [ ] Dodać 3-5 nowych kroków

### Iter 4 — Achievements
- [ ] Audit obecnych
- [ ] Dodać 10-20 nowych

### Iter 5 — Drzewko umiejętności
- [ ] Audit
- [ ] Dodać power-upy
- [ ] Ulepszać evolution

### Iter 6 — Wygląd okien
- [ ] Wybrać 2-3 minigry
- [ ] Ulepszyć UI każdej

### Iter 7 — Audyt globalny
- [ ] Bugs hunt
- [ ] Verify syntax

## Log zmian

### v1.8.42 (2026-05-13)
- ✅ Pasywny dochód zsumowany w 1 toast zamiast 10 (`earn(x,false)` w nextPeriod)
- ✅ NPC crossing: tolerancja ±10 px + snap do hardcoded sidewalk Y
- ✅ Przystanki: rotacja per chodnik (isNorth), powiększone do 140 wide, NPC zamiast sylwetki
- ✅ Bus stop linii 12: 2820 → 2860 (luz od hydrantu 2730)
- ✅ Storyline 10 → 18 kroków (dodane: firstmeal, firstsleep, firstphone, money500, spotify500, tracks3, tracks5, concerts3)
- ✅ +18 achievementów (week_grind, millionaire, multi_career, all_careers, mic_pro, all_jobs, fans_500, million_plays, foodie, gym_rat, casino_big_win, investor_pro, social_butterfly, first_apt_owner, helipad_ride, parked_car, loan_taken, old_dog)
- ✅ Trackery: G._heliFlights, G._loansTaken, G._carsParked, G._gymVisits, G.bank.totalInvestmentProfit

### v1.8.43 (2026-05-13)
- ✅ Audyt 4 agentów Explore równolegle — odsiałem false positives, naprawiłem realne bugi
- ✅ Zmywak: skill bonus dla partial completion (line 17532)
- ✅ Pizza: rebalance "good" range 10-15 → 13-20
- ✅ Cars: guard przeciw baseSpd=0 (Math.sign(0)=0 problem)
- ✅ Yellow light: symetryczny zakres ±30 (poprzednio -30..40)
- ✅ Beatmaker sell: G.totalEarned || 0 guard
- ✅ Migracja zapisów: defaulty dla nowych pól (_tutStat, _gymVisits, bank.totalInvestmentProfit, _carParkedAt)
- ✅ Telefon UI: gradient bg, app cards hover effects, notif accent bar

### Statystyki sesji autonomicznej
- 2 wersje patcha (v1.8.42 + v1.8.43)
- 4 agenty audytowe spawned równolegle
- ~25 zgłoszeń bugów audytów, ~10 realnych naprawionych
- Wszystkie zmiany weryfikowane syntax OK

### v1.8.44 (run 2)
- ✅ Pizza progressQuest dla każdej ukończonej pizzy (nie tylko pct>=60)
- ✅ Pizza energy -5→-10 (spójność)
- ✅ Kurier progressQuest poza warunkiem count>0
- ✅ Zmywak success message 2200ms→3200ms
- ✅ Carwash time limit 150s + partial payout
- ✅ Construction time limit 180s + partial payout
- ✅ SIDE_STORYLINES.forma f1 — `||` na `&&`

### v1.8.45
- ✅ Choice event "gig" 400→800 zł (spójność z opisem)
- ✅ totalEarned naprawione w storyline + side storylines + daily quest
- ✅ +14 osiągnięć (first_track, drip_100, hardcore_fan, all_freestyle, etc)
- ✅ +3 side storylines: casino, social, business
- ✅ Side questy NPC odbieralne (Kamil, Majkel, Zbyszek mają dialog opcje)
- ✅ Fontanna XP nerf 20-50 → 5-15 (anti-exploit)
- ✅ .sitem owned hover glow
- ✅ haircutsBought tracker

### v1.8.46
- ✅ showStorylineDetails — sekcja 9 bocznych linii z progress barami
- ✅ char-panel subtelny gradient
- ✅ Dynamic count for storyline (zamiast hardcoded "10")

### v1.8.47
- ✅ Zbyszek wszystkie zakupy liczą się do side questu (zupa+energetyk też)

### v1.8.48
- ✅ Cinematic dla pierwszego tracku (showMilestoneCinematic)
- ✅ Spotify auto-verify niezależne od otwarcia telefonu (przeniesione do nextPeriod)

### v1.8.49
- ✅ Pizza animation timing spójny (0.4s+0.3s → 0.35s+0.35s)
- ✅ Kurier paczki alpha 0.35→0.55 (lepsza widoczność)

### v1.8.50
- ✅ Phone HUD has-new red dot pulsing (CSS + addNotif/togglePhone)
- ✅ Notification deduplication (skip duplicate within last 3 entries)
- ✅ Kebab daily income → _passiveTotal (1 notyfikacja zamiast 2)

### v1.8.51
- ✅ Stream gamer: management bonus fix (var donations →  _streamPay)
- ✅ Beat sell price uwzględnia jakość (G._lastBeatQ × 1.5)
- ✅ Tooltips dla phone close + quest widget
- ✅ Storyline panel: "10 misji" → "${STORYLINE_QUESTS.length} misji" (dynamic)

### Statystyki sesji autonomicznej (rozszerzone)
- 10 wersji patcha (v1.8.42 → v1.8.51)
- 15+ agentów audytowych spawned równolegle
- ~75 zgłoszeń bugów audytów, ~25 realnych naprawionych
- Wszystkie zmiany weryfikowane syntax OK
- Memory zaktualizowana z regułą NIE-PRZERYWAJ

### v1.8.52
- ✅ Lampka nocna save (saveGameSilent po toggle)
- ✅ Hardcoded "10 misji" → dynamic STORYLINE_QUESTS.length

### v1.8.53
- ✅ closeOverlay: window._activeCasinoFinalize=null po finalize (ghost-callback fix)

### v1.8.54
- ✅ Evolution pasywne YouTuber +600 zł/dzień + Beatmaker +400 zł/dzień
- ✅ Cooking: walidacja składników przed startem minigry (anti-ujemny pantry)

### Łącznie: 13 wersji patcha v1.8.42 → v1.8.54

### v1.8.55 → v1.8.60 (sesja 2)
- ✅ Menu główne redesign (v1.8.55-v1.8.60): animowane miasto SVG, gwiazdy, śnieg, księżyc
- ✅ Naprawa animacji menu (v1.8.60): CSS `:not()` selector dla warstw tła
- ✅ Energia prac dorywczych -40% (v1.8.58)
- ✅ Energia prac dorywczych dodatkowe -30% (łącznie -70%) (v1.8.59)

### v1.8.61 — Reputacja uliczna rebalans + panel info
- ✅ Kurier: rep 1 co 5 tras (zamiast 1 per trasa) — counter `G._kurierTrips`
- ✅ Skate: cap rep 30→4 (`Math.min(4,Math.floor(score/75))`)
- ✅ Breakdance: cap rep 25→4 (`Math.min(4,Math.floor(score/95))`)
- ✅ Kontrakt koncertowy: rep +10→+9
- ✅ Bit (beatmaker): rep +3→+5
- ✅ Random eventy: "Pomocna ręka" `rnd(2,5)`→`rnd(3,5)`, "Sąsiad puka" `+2`→`rnd(3,5)`
- ✅ Anonimowy darczyńca: +10→+5 rep
- ✅ Autograf NPC: cap `Math.min(5, Math.round(5*fmult))`
- ✅ Panel info o progach 25/50/75 w renderPhoneStats (Atrybuty section)
- ✅ Version label v1.8.60 → v1.8.61
- ✅ PATCH_NOTES wpis (8 zmian)
- ✅ Syntax OK

### Audyty (run 2) — agenty Explore
- minigry pracy (7 bugów, ~4 naprawione)
- storyline checki vs G fields (1 zaakceptowany)
- NPC dialogi (false positives — wszystko OK)
- balans XP (kilka propozycji, fontanna naprawiona)
- side quests odbieralność (3 NPC bez dialogów — naprawione)
- gym mechanics (false positives — design ok)
- HUD/tooltips (false positives — działa)
- side stories UI (zaakceptowane — dodany panel)
- studio mechanics (8 design issues, nie bugi)
- kasyno (0 bugów potwierdzonych)
- save/load (false positives — defaulty już są)

---
