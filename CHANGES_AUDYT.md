# Trap Simulator — Lista wszystkich zmian z sesji audytu
## Sesja 2026-05-14 (v1.9.36 → bieżąca)

Plik z opisem WSZYSTKICH zmian wprowadzonych do gry przez ten audyt, do testowania przez gracza.
Aktualizowany automatycznie przy każdej kolejnej zmianie.

---

## v1.9.36 — Migracja 5 krytycznych pól save'ów (anty-crash)
- **Migracja prestigeBonus** (stare save'y sprzed Prestige) — bonusy przeliczane z poziomu Prestige przy wczytaniu (5% kasa, 3% sława za poziom).
- **Migracja aptColors** — zapisy bez kolorów mieszkania crashowały rebuildAptTile. Teraz fallback do defaults.
- **Migracja G.fans** — stare save'y bez {casual, hardcore, haters} crashowały w pierwszym dniu.
- **Migracja G.label** — zepsuty/null label crashował na osiągnięciach. Walidacja zapewnia obiekt.
- **Walidacja G.apartment enum** — ręczna edycja save'u na niedozwoloną wartość cofa do traphouse.

## v1.9.37 — Achievement+XP audit (5 napraw)
- **Stress_free achievement**: ZMIENIONE WSTECZNIE w v1.9.44 — patrz tam.
- **Contract failure stres +30**: ZMIENIONE WSTECZNIE w v1.9.44.
- **6 osiągnięć dodanych** (tracks_5, tracks_50, fame_75, fans_1m, 1m_followers, prestige5) — referencjonowane w tier-arrays nagród ale nigdy nie zdefiniowane.
- **Cap koncert friendship**: bonus przyjaźń Marcin × Crew był 2.25× max, teraz cap 2.0×.

## v1.9.38 — NPC events Prestige bypass + save migracje
- 5 Prestige bypassów: festival, fan merch event, radio royalty bonus, manager bonus, gig dialogue.
- 2 nowe save migracje: mainMission (główna misja 1000 fanów), visitedRooms.

## v1.9.39 — Przyjaźnie żywe + daily quest Prestige + audio
- Daily quest reward przez earn() (Prestige multiplier).
- Zbyszek friendship: każdy zakup (kebab/zupa/energetyk) +1 przyjaźni.
- Wiktor friendship: odbiór nagrody dziennej +5 przyjaźni.
- Daily quest też zalicza się do "Wielokierunkowy".
- Audio: Prestige cinematic ma teraz fanfarę (sparkle x2).
- Audio: Achievement popup zamiast click ma teraz pełną fanfarę.

## v1.9.40 — 8 Prestige bypassów (milestones, label, soundeng, kontrakty, turnieje, YT)
- Followers milestones (1K/10K/100K/1M): premie pieniężne + sława przez earn() + addFame().
- Wokalna sesja w studio: wypłata przez earn().
- Zlecenia realizatora dźwięku: wypłata przez earn().
- Kontrakt zakończony: wypłata + sława przez earn() + addFame().
- Turniej gamerski: nagroda + sława przez earn() + addFame().
- Zaliczki Major Label + Global Deal: przez earn().
- YT bonus za serię (5 filmów): przez earn() + addFame().

## v1.9.41 — Storyline UI
- Telefon → Quest pokazuje teraz 6 LINII BOCZNYCH (Drip, Forma, Mieszkanie, YouTuber, Beatmaker, Gamer) z paskami postępu.
- Counter "X ukończonych" w Storyline panel: stepIdx zamiast completed.length (były rozjazdy).
- Daily quest reward w telefonie: pokazuje faktyczną kwotę po Charisma bonus (oznaczone ✨).

## v1.9.42 — Side questy NPC + opisy skilli
- Side questy NPC (Kamil "Branża", Majkel "Producent", Zbyszek "Stały klient", Marcin "Koncerty") — wszystkie 4 wypłacały bezpośrednio do G.money. Naprawione earn()/addFame().
- Skill Flow 3 "Multisylabowe" — opis dopasowany do efektu (+10% jakości nagrań rapowych).
- Skill Mikser 3 "Miksowanie dla innych" — opis dopasowany (+9 punktów jakości do nagrań).

## v1.9.43 — Notifications cap + czynsz Prestige + furniture audit
- Czynsz z najmu (passive income z wynajmowanych mieszkań) — przez earn() + showGain.
- Telefon → log powiadomień: cap 60 → 100 wpisów.
- Audyt mebli: 11 items verified — wszystko działa.

## v1.9.44 — ROLLBACK v1.9.37 stress inversion
- ⚠️ ROLLBACK: w v1.9.37 błędnie odwróciłem mechanikę G.stress. To NASTROJ (100=zen, 0=wypalenie).
- Achievement "Zen" wraca do wymóg: nastrój ≥100.
- Kontrakt wygasły: wraca do -30 mood (kara — stresuje porażką).

## v1.9.45 — Instagram + Autopromocja 5 + sklepy pre-clamp
- KRYTYCZNE: G.igPosts cap 150 (był unbounded → save bloat).
- Autopromocja 5: opis +40% follower growth, kod miał tylko +25%. Brakujący +15% dodany.
- getShopDiscount: pre-clamp przed Black Friday (matematycznie czyste).

## v1.9.46 — Album cinematic guard + Prestige career counters reset
- Debiutancki album cinematic odpalał się ponownie jeśli G.albumsReleased=1 (np. ręczna edycja save). Dodany flag G._debutAlbumShown.
- Prestige reset: liczniki karier (raper.tracks, beatmaker.beats, youtuber.subs, influencer.posts/sponsorships, soundeng.projects, gamer.tourneysWon) NIE były zerowane. Naprawione.

## v1.9.47 — Beat pack + YT serii Prestige + pantry cleanup
- YT publishYTSeries: pomijała ytSkMult + Prestige multiplier (direct G.money). Naprawione.
- Beat pack: cena ~2× single (powinna być ~5×). Zwiększone + bonus za jakość bita.
- Pantry: ujemne liczby składników (-2 jajka) po gotowaniu. Cleanup + migracja.
- Składniki: cap 999 sztuk per slot (anti save bloat).

## v1.9.48 — Prestige cap 10 + tutorial 2 bugs
- Prestige max poziom 10 (bez cap = unbounded scaling).
- Tutorial step "Sleep": warunek lastSleepDay>0 był pre-spełniony (init=1). Teraz tracker _tutStat.slept.
- Tutorial step "Movement": counter inkrementował 60× na sekundę. Throttle 1:10 (teraz ~5s minimum).

## v1.9.49 — Concert tooltip + DAW hint penalty
- Tooltip sławy pokazywał błędne wymogi koncertów (mały 20+, średni 35+, wielki 55+) ale kod gates 10/25/55. Dopasowane.
- Sequencer (Studio): tryb "Z Podpowiedziami" daje -15% jakości (wcześniej zero penalty).

## v1.9.50 — Sylwester +100 fanów + Wigilia Prestige + 4 save migracje
- Sylwester: opis obiecywał "+100 fanów" ale kod nigdy ich nie dawał. Dodane.
- Wigilia bonus +500 zł szedł direct G.money. Teraz przez earn().
- Defensywne migracje: G.yt, G.tidal, G.spotify, G.radio.

## v1.9.51 — Drip stack fix + Rep boost 75 ghost + Drip God achievement
- KRYTYCZNE: _repBoost75 "Koncerty więcej fanów" — flag był ustawiany ale nigdy nie czytany (ghost feature). Teraz +15% fanów koncertu.
- Drip bonus koncertów (earnings + fani): używał raw G.drip zamiast getEffectiveDrip() (pomijał Autopromocja 4 bonus). Naprawione.
- Nowe osiągnięcie "Drip God" — drip 200 (max cap).
- Tooltip dripa: pokazywał błędne wartości. Dostosowany do formuł.

## v1.9.52 — Auto-save quota + immediate save on start
- Auto-save zapisuje natychmiast po starcie (poprzednio 30s delay).
- Auto-save quota error: czytelny komunikat "Pamięć przeglądarki pełna" z propozycją save do pliku.

## v1.9.53 — Achievement reward + Sponsored tweet Prestige
- KRYTYCZNE: Nagroda pieniężna z osiągnięcia (100-10k zł) bypass Prestige. Naprawione przez earn().
- Twitter "Sponsorowany tweet" — pomijał Prestige multiplier. Naprawione.

## v1.9.54 — Track stream cap 500k + drzwi race guard
- Single track streams: cap 500k per release (late-game stack mógł dać 540k = exploit).
- Race condition: szybkie E-pressy podczas fade między pokojami mogły double-trigger transition. Guard sprawdza _roomFadeDir.

## v1.9.55 — Kamera origQuality + G.plugins migracja
- Kamera: brakowało origQuality przy zakupie (repair system zawsze fail). Naprawione.
- Defensywna migracja G.plugins — bez tego silently zero bonusów z pluginów.

## v1.9.56 — Mikrofon USB spójność + repair origQuality
- getRecordingQuality (studio) używał USB micQ*0.7 vs doRecord 1.0. Ujednolicone.
- Repair mikrofonu: origQuality nie był aktualizowany. Teraz 100 po naprawie.

## v1.9.57 — Friends cap 50 + Smoking opis pełny
- Lista znajomych: cap 50 osób (anti save bloat).
- Outfit Smoking: opis nie wspominał +10% zarobki koncertów. Pełny opis dodany.

## v1.9.58 — Basic apt + helipad sleep + eksmisja + admin guard
- KRYTYCZNE: Mieszkanie Basic (4000 zł) obiecywało +5% regen + lepszy nastrój ale kod NIGDY ich nie aplikował. Teraz +5% energii + +1 nastrój dziennie.
- Helipad cooldown 30min nie resetował się po śnie. Teraz reset jak inne.
- Eksmisja: G.apartment nie był resetowany do traphouse. Gracz mógł zachowywać bonusy bez płacenia.
- Admin keyboard "snowy"/"amper" budowała się podczas wpisywania w input. Guard !_typing.

## v1.9.59 — Cinematics reset on Prestige
- Cinematic flags (_debutAlbumShown, _spotifyVerifyCinematic, _milestonesShown, _formaWasAt100) NIE były resetowane na Prestige. Po pierwszym playthrough kolejne nie widziały animacji.

## v1.9.60 — Help panel Ctrl+S
- Help panel pokazywał "S — szybki zapis" ale skrót to Ctrl+S. Tooltip dostosowany.

## v1.9.61 — 5 Prestige bypassów random events
- Event "Sponsorship offer" — bypass Prestige. Naprawiony.
- Event "Lucky day" — bypass Prestige. Naprawiony.
- Event "Fan donation" — bypass Prestige. Naprawiony.
- Event "TV interview" — bypass Prestige. Naprawiony.
- Choice "Anonimowy darczyńca" → "Bierz 300 zł" — bypass Prestige. Naprawiony.

## v1.9.62 — Bills reset on Prestige
- Rachunki (G.bills): NIE były resetowane przy Prestige. Gracz mógł nieść debt do nowego playthrough.

## v1.9.63 — YouTube PU bonus aplikowany
- KRYTYCZNE: Power-Ups Youtuber (PU 1/2/3 = +30/+60/+100% bonus) NIE były aplikowane w publishYT i publishYTSeries. Gracz płacił za PU ale efektu nie było. Naprawione.

## v1.9.64 — Notifications reset on Prestige
- Notifications phone log NIE był resetowany na Prestige. Gracz wchodził z 100 starymi powiadomieniami. Fresh log.

## v1.9.65 — Nick input Enter key + 3 audyty info
- Nick input (leaderboard rejestracja): Enter teraz potwierdza nick.

## v1.9.66 — 4 ostatnie Prestige bypassy
- Daily bonus (50 + lvl*10 zł) — bypass Prestige. Naprawione.
- Weekly bonus (500 + lvl*50 zł co 7 dni) — bypass Prestige. Naprawione.
- Kebab stand daily income — bypass Prestige. Naprawione.
- Merch passive sales (codziennie + collab weekly) — bypass Prestige. Naprawione.

## v1.9.67 — AdSense Prestige + outfit sprite sync
- YT AdSense (passive income z odsłon): direct G.money+= pomijał Prestige. Naprawione.
- Po wczytaniu: P.cloth wracał do save value bez sprawdzenia G.outfit. Sync z outfitem.

## v1.9.68 — 3 audyty info (viral/shop/dead code)
- Info-only, brak zmian kodu.

## v1.9.69 — SMS eval() usunięty
- SMS handler miał branch dla action.fn jako string z eval() — dead code, usunięty defensywnie.

## v1.9.70 — 4 fame bypasses
- TV interview, viral beat, newspaper feature, mission rewards — wszystkie przez addFame() teraz.

## v1.9.71 — 4 więcej fame bypassów + duplicate achievement
- Fontanna, idol Instagram story, charity donation, haters response — przez addFame().
- Duplicate achievement: fans_1m i 1m_followers obydwa odpalały na 1M fanów = double-reward 20000 zł. 1m_followers wymaga teraz +50 sławy (legenda).

---

## SUMA: ~75+ Prestige bypassów + ~10 ghost features + 8 save migracji + 7 brakujących osiągnięć + masa drobnych usprawnień.

---

## v1.9.72 — Respi szpital + NPC crossing + większe toast + SMS naprawy
- **Respi po śmierci**: gracz teraz respi pod szpitalem (wx:1980, wy:820) zamiast w mieszkaniu — bardziej naturalne wyjście ze szpitala.
- **NPC crossing fix**: gdy NPC zbliżał się do przejścia dla pieszych z włączonym zielonym światłem + był blisko pasa (sourceY), wchodzi w pas i przechodzi PO zebrze. Wcześniej odbijał się od V-road krawędzi i nigdy nie wchodził w crossing.
- **Większe powiadomienia (toast)**: font 18px, padding 16px, border 2px, glow. Wcześniej 15px/11px/1px — gracze przegapiali.
- **SMS time fix**: usunięto fraction z _mm (np. "06:28.819199" → "06:28"). Floor na gameMin%60.
- **SMS quick reply efekty**:
  - 👍 Dzięki: +1 przyjaźń z NPC
  - 🚶 Wpadnę: +3 przyjaźń, -5 energii (zobowiązanie)
  - ⏳ Później: -1 przyjaźń (NPC zniechęcony)
  - Pokazuje toast z efektem ("+1 przyjaźń").
- **Cleanup PATCH_NOTES**: usunięto "Zgłoszone przez: Amper" z 10 wpisów (tag system jest wystarczający).

---

## v1.9.73 — Kasyno: 3 nowe gry (Plinko, Keno, Koło Fortuny)
- **PLINKO**: kulka spada przez 12 wierszy kołeczków, ląduje w 1 z 9 slotów (0.5× do 100×). Bell-curve probability — uczciwe.
- **KENO**: wybierz 4-10 liczb z 1-80. 20 losowanych. Mnożniki za trafienia od 1× do 1000× (klasyczne casino payout).
- **KOŁO FORTUNY**: 16 segmentów, multiplier 1.5×, 2×, 5×, 10×, JACKPOT 50×. Realistyczna animacja spin.
- Wszystkie gry: rozliczane w żetonach, śledzą statystyki (plinkoPlayed/kenoPlayed/wheelPlayed).

---

## v1.9.74 — NPC inteligentne trasy
- NPC dostają cel wędrówki (_goalX) — losowy punkt 400-1200 px stąd. Po dotarciu wybierają nowy. Dłuższe trasy, mniej chodzenia w kółko.
- NPC override losowych zmian dx — idzie w stronę celu, zapobiega odbijaniu się wpół trasy.

---

## v1.9.75 — Tutorial "Wprowadzenie" 9 slajdów + patchnotes cleanup
- **Nowy tutorial**: po cinematic intra → propozycja "Wprowadzenie". 9 slajdów: powitanie, statystyki życiowe, sława/fani, drip, forma, drzewko umiejętności, linia fabularna, prestige, sterowanie. Animowane emoji + progress indicators.
- **Skippable + replayable**: G._introductionSeen flag, ponowne uruchomienie z telefonu (planowane).
- **Patchnotes cleanup**: v1.8.36 (skrzyżowania/parking/minimapa) i v1.8.84 (system patchnotes) usunięto z beta-tester — to nie były zgłoszenia Ampera.

---

## v1.9.76 — Ruletka multi-bet + tutorial replay z telefonu
- **Ruletka multi-bet**: jak w prawdziwym kasynie. Przycisk ➕ DODAJ ZAKŁAD dodaje kolejne zakłady do listy (różne kolory, parzyste/nieparzyste, liczby). Po spinie sprawdza wszystkie zakłady i sumuje wygrane. KRĘĆ pokazuje liczbę aktualnych zakładów.
- **Tutorial replay**: 🎬 Wprowadzenie dodane do folderu Pomoc w telefonie. Gracz może uruchomić tutorial ponownie w każdej chwili.

---

## v1.9.77 — Casino VIP + Player-to-player SMS
- **Casino 2 PIĘTRO VIP LOUNGE**: odblokowane przy 60+ sławy. 5 gier (Roulette, Blackjack, Sloty, Plinko, Koło Fortuny). Min stawki 10× wyższe. Premium aesthetic.
- **Player-to-player SMS**: wysyłanie wiadomości między graczami przez Supabase. Funkcje _sendPlayerMessage, _fetchPlayerMessages, _openPlayerChat. UI: pole tekstowe + przycisk. Wymaga tabeli `player_messages` w Supabase z kolumnami: from_user_id, to_user_id, from_nick, text, sent_at, day.

---

## v1.9.78-v1.9.80 — NPC final fix + SMS anti-spam + przyjaźń panel
- **v1.9.79 ROLLBACK NPC**: pathfinding v1.9.72+v1.9.74 powodował freezing. Powrót do prostej logiki.
- **v1.9.80 NPC crossing v3**: NPC zbliża się do V-road → jeśli green + cross-Y match → snap X do krawędzi pasa zebry, snap Y do sourceY, walk vertically. Inaczej bounce.
- **SMS anti-spam cooldown** (v1.9.79): 1 odpowiedź per NPC per dzień. "Wpadnę" tworzy zobowiązanie — trzeba podejść do NPC (max 2 dni) żeby zaliczyć +3 przyjaźń.
- **Telefon → 🤝 NPC → Przyjaźnie**: panel z 7 NPC. Każdy z paskiem 0-100, tier, mnożnikiem ×1.0-1.5, opisem bonusu.
- **Telefon → 🤝 NPC → Mapa NPC**: minimapa z lokalizacjami 5 stałych NPC.
- **XSS fix** (v1.9.79): P2P SMS chat — _esc() dla nick i text.
- **Patchnotes cleanup v1.9.80**: v1.8.38, v1.8.41, v1.8.55 wyciągnięte z beta-tester. v0.9.24 Anti-stuck reporter: Mirro→Amper.
- **G._smsLastReply, G._smsPendingVisit** — nowe save fields (anti-spam cooldown + pending visits).
- **window._smsCheckPendingVisit** hooked in openNPCDialogue — zaliczenie wizyty przy podejściu do NPC.

---

## v1.9.81 — P2P chat UI + Casino VIP slots jackpot
- **Player-to-player chat UI**: telefon → SMS → przycisk "💬 Czat ze znajomymi" (widoczny jeśli G.friends.length>0). Lista wszystkich friends z unread counter. Click → otwiera chat.
- **Auto-fetch P2P wiadomości**: przy otwarciu SMS wywołuje _fetchPlayerMessages (jeśli Supabase tabela player_messages istnieje, pobiera nowe).
- **Casino VIP slots jackpot 2×**: gdy G._casinoVip=true, slot 💎💎💎 daje bonus 20× bet zamiast 10× (jackpot 140× zamiast 70×).

---

## v1.9.82 — SMS per-msg + bigger toast + Wprowadzenie fixes
- **SMS per-msg tracking**: każda wiadomość od NPC może być odpowiedziana RAZ. NPC wysyła wiele, gracz odpowiada na każdą osobno. Wcześniej było per NPC per day.
- **Toast: jeszcze większe** (22px font, 22px padding, 3px border, gradient bg, glow). Default duration 8000ms (z 6000ms).
- **Wprowadzenie: pause game time** podczas oglądania, tłumi normalne tutorial tooltips, fix flicker (in-place modal update).
- **Wprowadzenie REWRITE**: 10 slajdów z poprawionymi treściami — gra jako sandbox o budowaniu kariery artysty, fani jako STATYSTYKA, PU dodają kumulatywne bonusy, slajd o ewolucjach, rozszerzone sugestie startu.

## v1.9.83 — NPC waypoint routes
- Każdy NPC dostaje trasę 4 waypointów (150-4280 px). Idzie sekwencyjnie przez nie.
- Po skończeniu — generuje nową trasę.
- Anti-stuck: jeśli wx nie zmienił się >5px w 100 klatkach → skip do następnego waypointu.

---

## v1.9.84 — KRYTYCZNE: Koło Fortuny rebalance + 4 audit fixes
- **KRYTYCZNY money exploit**: Koło Fortuny EV=6.375× (gracz wygrywał 6× stawki średnio). Rebalanced: 8 segmentów 0× (loss 50%), 4 1× (zwrot), 3× 2×, 1× 5×. EV=0.94× (6% house edge — realistic casino).
- **NPC waypoint validation**: punkty nie generowane na V-roadach. NPC nie stoi już na środku ulicy w stack-loop.
- **Wprowadzenie pause state**: zachowuje poprzedni _paused (jeśli gracz był na pauzie, po Wprowadzeniu wraca do pauzy).
- **NPC mapa wymiary**: odczyt z ROOMS.ulica.wT/hT zamiast hardcoded (4280×3260 → 4320×3600).
- **_smsCheckPendingVisit validation**: contactId musi istnieć w SMS_CONTACTS.

---

## v1.9.85 — KRYTYCZNY Plinko EV rebalance + Keno verified
- **KRYTYCZNY money exploit**: Plinko EV ręcznie wyliczone = 2.26× (gracz wygrywał 2.26× stawki). Sloty [100,10,3,1,0.5,1,3,10,100] → [20,4,1.5,0.5,0.2,0.5,1.5,4,20]. EV = 0.897× (10.3% house edge).
- **Keno EV verified**: 4 picks=0.70×, 5=0.73×, 6=0.67×, 7=0.68×, 8=0.55×, 9=0.40×, 10=0.38×. Wszystko poniżej 1.0× — bez exploit. Klasyczny casino keno.

## v1.9.86 — NPC_DATA ↔ SMS_CONTACTS mapping
- openNPCDialogue() pendingVisit nie zaliczał wizyty u Zbyszka bo używał NPC_DATA key (vendor) zamiast SMS_CONTACTS key (zbyszek). Mapping dodany.

---

## STATUS WSZYSTKICH REQUESTÓW Z ORYGINALNEJ WIADOMOŚCI:
- ✅ Plik tekstowy CHANGES_AUDYT.md (aktualizowany)
- ✅ Respi pod szpitalem (v1.9.72)
- ✅ NPC PORZĄDNIE crossuje (v1.9.80) + waypoint routes 4 punkty (v1.9.83) + waypoint walidacja (v1.9.84)
- ✅ "Zgłoszone przez:" cleanup (v1.9.72) + v1.8.36/38/41/55/84 re-categorized + v0.9.24 Mirro→Amper
- ✅ Tutorial Wprowadzenie 10 slajdów z REWRITE treści (v1.9.82), pause game time, no tooltip spam, replay z telefonu, pause state preserve (v1.9.84)
- ✅ Większe toast (22px, 8000ms — v1.9.82)
- ✅ Player-to-player SMS (Supabase + UI w telefonie)
- ✅ SMS time fix (no longer 06:28.819...), per-msg tracking (nie per NPC per dzień), Wpadnę pending visit z mapowaniem NPC_DATA→SMS_CONTACTS
- ✅ Plinko + Keno + Koło Fortuny + Ruletka multi-bet + Casino 2 piętro VIP — WSZYSTKO przeanalizowane EV, BEZ money exploit
- ✅ Wygląd kasyna zachowany — tylko dodane gry i 2 piętro bez zmiany istniejącego interioru
- ✅ Panel Przyjaźnie + Mapa NPC w telefonie

## v1.9.87 — CINEMATIC FLYTHROUGH (aerial camera)
- **Nowy tryb: PRZELOT PO MIEŚCIE** — freecam aerial camera przelatująca przez 9 kluczowych lokalizacji:
  1. Traphouse (start)
  2. Zbyszek/Kebab
  3. Studio nagrań
  4. Sala koncertowa
  5. Siłownia
  6. Szpital
  7. Drip District
  8. Kasyno Royal
  9. Cel: budowanie kariery
- Każdy shot z animowaną etykietą + opisem mechaniki na dole ekranu.
- Płynna lerp kamery (0.05 — filmowy effect), ~4.5-5.5s per shot.
- Dostęp: tutorial Wprowadzenie → "🎬 PRZELOT PO MIEŚCIE" + telefon → Pomoc → 🎥 Przelot po mieście.
- Pomijalny przyciskiem "Pomiń przelot ✕" w prawym górnym rogu.
- Pauzuje grę z preserve poprzedniego stanu _paused.

---

## v1.9.88 — Mapa apt landmarks + bus number + tutorial spam fix
- **Pełna mapa**: dodane brakujące landmarki: Mieszkanie Basic (350,3253), Penthouse (1550,3243), Apartament Premium (3900,3253).
- **Numer linii autobusu**: rozpikselowany napis naprawiony. Display 14×12 → 20×16px, font Impact 11px → Segoe UI Bold 14px. Żółty LED z glow.
- **Poradnik anti-spam**: po manualnym zamknięciu ✕ czeka 60s przed pokazaniem tego samego kroku. Wcześniej pokazywał się natychmiast w pętli.
- **Poradnik/toast overlap fix**: poradnik przesunięty wyżej (bottom 80→140px), toast zostaje na bottom 30px — nie nachodzą.

**Kasyno (informacyjnie)**: PLINKO + KENO + KOŁO FORTUNY + 2 piętro VIP SĄ w kodzie (od v1.9.73/v1.9.77). Jeśli ich nie widzisz w grze — Ctrl+F5 (force reload, browser cache).

---

## v1.9.89 — Cinematic flythrough: kamera FAKTYCZNIE rusza + highlight + tutorial anti-overlap
- **Krytyczny fix**: w v1.9.87 dodałem cinematic flythrough ale kamera nie ruszała się. Powód: `updatePlayer()` ma early return przy `if(_paused)return`, a `updateCamera()` jest wywoływane Z WEWNĄTRZ updatePlayer. Cinematic ustawia `_paused=true` → kamera nigdy nie aktualizowana. Fix: dodano early bypass `if(_cinemCam.active){updateCamera();return}` PRZED `if(_paused)return`.
- **11 ujęć (było 9)**: dodane Sklep Spożywczy + Prace Dorywcze. Każde ujęcie ma własny duration (4.5-6s), highlight wx/wy/r, tytuł + opis mechaniki.
- **Letterbox bars**: czarne pasy u góry (80px) i u dołu (60px) — efekt kinowy. Fade-in animation .8s.
- **Highlight overlay**: nowa funkcja `drawCinemHighlight()` w głównej pętli renderowania (przed drawVignette). Rysuje:
  - przyciemnione tło z dziurą wokół podświetlanego obiektu (rgba(0,0,0,.45) + evenodd fill rule)
  - 3 pulsujące pierścienie (złote rgba(200,165,32))
  - radial gradient glow w centrum (rgba(241,196,15) → transparent)
  - tempo pulsacji: sin(t/600), amplituda 18px
- **Tutorial anti-overlap (REWORK)**: w v1.9.88 przesunąłem poradnik na bottom 140px ale user zauważył, że zasłania środek ekranu. Cofnięto na bottom 80px, ale dodano:
  - W `showMsg()` ustawiam `tutorial-popup.dataset._tutHidden=1` + opacity 0 + bottom -260px (zjeżdża poniżej ekranu)
  - W `setTimeout` po zamknięciu toasta: jeśli `_tutHidden===1`, przywracam bottom 80 + opacity 1
  - Efekt: poradnik znika gdy toast się pojawia, wraca gdy toast znika. Zero zachodzenia.

---

## v1.9.90 — Mapa: per-label width + klawisz E debounce
- **Mapa - napisy nakładające się**: algorytm placeLabels używał stałej szerokości lblHalfW=65 dla wszystkich nazw, ale "🍴 Restauracja" / "🌆 Penthouse" / "🏘 Mieszkanie Basic" mają różne długości. Wprowadzono heurystykę `measureLbl(name) = max(55, len*4.2+18)` która zwraca pół-szerokości proporcjonalne do długości nazwy.
- **Mapa - więcej kandydatów**: z 19 do 33 pozycji offset (dodane: -180,±30 / ±90,±60 / -270/+270,0 / 0,±150). Awaryjny offset zwiększony z 200 do 350 (X) / 180 (Y).
- **Klawisz E spamuje interakcje**: user "Zamykam i 4 razy pod rząd wyskoczyły mi interakcje". Brak debounce → keyboard auto-repeat = wielokrotne `tryInteract()`. Fix: `if(e.repeat) return` + global lock `window._lastInteractE` z 250ms cooldown.
- **Numer linii autobusu — dalej rozpikselowany (v2)**: w v1.9.88 zwiększyłem font do 14px Segoe UI z shadow blur 3 — user zgłasza że nadal niewyraźny. Przyczyna: `X.shadowBlur=3` rozmazywało wszystko. Fix v2: większy display (24×18), font Arial Black 13px, `Math.round()` na pozycji, technique stroke (kontur 2.5px czarny) + fill (żółty) zamiast shadow. Klasyczny trick dla ostrego canvas text.

---

## v1.9.91 — KASYNO restrukturyzacja: gry jako obiekty + winda zamiast menu
- **User:** "Po pierwsze to nie mamy żadnego menu kasyna. To było wcześniej i usuwaliśmy to. Plinko/Keno/Koło mają być w interiorze jak sloty/ruletka. VIP ma być przez windę z interiorem windy."
- **Menu kasyna USUNIĘTE**: openCasinoOverlay() i window.openCasinoVIP() zastąpione no-op stubami. Stare funkcje przemianowane na `_LEGACY_UNUSED`.
- **3 nowe obiekty w pokoju `casino`** (lobby/parter):
  - `casino_plinko` (wx:340, wy:400) — interakcja E uruchamia openPlinko()
  - `casino_keno` (wx:520, wy:400) — interakcja E uruchamia openKeno()
  - `casino_wheel` (wx:700, wy:400) — interakcja E uruchamia openWheel()
- **Winda jako obiekt** (`casino_elevator`, wx:1200, wy:160): po E teleportuje do nowego pokoju `elevator`.
- **Nowy pokój `elevator`** (wT:8 hT:7 = 384×336px, marble floor + wallp_lux):
  - 2 obiekty interaktywne: `elev_lobby_btn` (Parter — wraca do casino), `elev_vip_btn` (1 piętro VIP — wymaga 60+ sławy, idzie do casino_vip)
- **Nowy pokój `casino_vip`** (wT:27 hT:14, premium dywany):
  - 9 gier premium: 3× Sloty VIP, Ruletka VIP, Blackjack VIP, Plinko VIP, Koło VIP, Keno VIP, **+2 ekskluzywne**: 🀄 Baccarat (BETA), 🎲 Craps (BETA)
  - Bar VIP, Gospodyni VIP (zamiast krupiera), 3 NPC goście
  - Winda po prawej (cvip_elevator)
- **Logika VIP**: `G._casinoVip` ustawiane na `currentRoom==='casino_vip'` w każdym act handlerze dla casino gier — high-stakes tylko gdy gracz fizycznie jest w pokoju VIP.
- **Powroty z gier**: `onclick="openCasinoOverlay()"` → `onclick="closeOverlay()"` (3 miejsca: Plinko, Keno, Wheel). Gracz wraca do interioru gdzie był.
- **Nowe draw functions**:
  - `drawCasinoMachine(sx,sy,w,h,emoji,label,color)` — uniwersalna szafka kasynowa z ekranem i pulsującym LED
  - `drawElevatorDoor(sx,sy,w,h)` — metalowe srebrne drzwi windy z gold accent + ▲▼ + przycisk LED
  - `drawElevatorButton(sx,sy,w,h,emoji,label,color)` — okrągły guzik z emoji + napisem
  - `_lightenHex(hex,amt)` — helper

---

## v1.9.92 — Cinematic flythrough EPIC: zoom + smooth transitions + radar sweep
- **User:** "Przelot kamery teraz juz dziala, ale pracuj dalej i ulepszaj zeby to bylo bardziej epickie. Kamera powinna sie na niego zoomować + budynek się podświetlać. Smooth przejścia."
- **Camera zoom**: dodano `cam.zoom` (default 1). Każdy shot ma własny `zoom` (1.45-1.6 dla bliskich budynków, 1.1-1.15 dla panoram, 1.0 dla finałowego ujęcia "Wybierz ścieżkę"). Implementacja: `X.save(); X.translate(640,391); X.scale(cam.zoom,cam.zoom); X.translate(-640,-391)` przed drawTileMap, `X.restore()` przed drawMiniMap. HUD/minimap/vignette POZA zoomem (nie skalowane).
- **Adaptacyjne lerp**: kamera w cinematic używa zmiennego tempa zależnie od dystansu: dist>200 → 0.075, dist>50 → 0.045, blisko → 0.025. Natural ease-out hamowania.
- **Zoom lerp**: cam.zoom lerpuje do targetZoom z 0.04 (~0.4s pełnego ruchu). Reset do 1 po wyjściu z cinematic (lerp 0.1 + snap przy <0.005 diff).
- **Highlight fade-in/out**: nowy `hlOpacity` field animowany ease-in-out cubic. Przy transition: stary highlight fade-out (.6s) → kamera porusza się → nowy highlight fade-in (.9s).
- **Radar sweep**: 2 rozszerzające się pierścienie wybiegające z centrum budynku (3s loop, drugi z offsetem 1.5s). Plus 3 pulsujące pierścienie z phase desync. Plus 4 punkty kierunkowe N/E/S/W.
- **Soft mask zamiast hard cutoff**: ciemne tło dookoła highlightu używa radial gradient (rgba(0,0,0,0) → 0.7 na brzegach) zamiast czarnego z dziurą. Bardziej "miękki" efekt skupienia.
- **Letterbox slide-in/out**: bary kinowe slide-in z góry/dołu (.9s cubic) przy starcie, slide-out + opacity przy zakończeniu. Skip button też fade-in (.8s).
- **Overlay opis in-place**: zamiast remove+create, ten sam div jest reused. Stary content fade-out z lekkim scale-down, po 350ms wymiana HTML, potem fade-in z scale-up. Smooth (.7s cubic-bezier).
- **Updated shot list**: tytuł Kasyna zaktualizowany ("9 gier + Baccarat/Craps na VIP, przez windę") — spójny z v1.9.91 restrukturyzacją kasyna.

---

## v1.9.93 — Daily Wheel of Fortune w kasynie (darmowy spin dziennie)
- **User:** "wheel of fortune dodaj na kasyno"
- **Kontekst**: Koło Fortuny ze stawkami już jest w kasynie (v1.9.91 `casino_wheel` + `cvip_wheel`). Wniosek: user chce DODATKOWO darmowy "daily wheel" — popularne w grach mobile/social casino.
- **Nowy obiekt `casino_daily_wheel`** (wx:880, wy:510, w:100, h:90) w pokoju casino — prawy dolny róg, między War a wyjściem. Prompt `[E] 🎡 Daily Wheel — darmowy spin`.
- **Nowy obiekt `cvip_daily_wheel`** (wx:1040, wy:510) w casino_vip — wersja premium z 5× lepszymi nagrodami.
- **drawDailyWheel(sx,sy,w,h,isVip)** — nowa funkcja rysująca obiekt w pokoju:
  - 8 kolorowych segmentów koła (auto-rotacja gdy spin dostępny, stop gdy używałeś)
  - Wskaźnik biały trójkąt na górze koła
  - Gold pin (radial gradient) w centrum
  - Banner FREE SPIN (zielony) / WRÓĆ JUTRO (czerwony) na dole
  - Pulsujący zielony glow border gdy dostępny
- **window.openDailyWheel(isVip)** — overlay z gry:
  - Canvas 340×340 z 8 segmentami, każdy z emoji + label nagrody
  - Reward array regular: 300/500/1000 zł, 50/200 żetonów, 100 XP, 1 sławy, JACKPOT 5000 zł
  - Reward array VIP: 1500/2500/5000 zł, 250/1000 żetonów, 500 XP, 3 sławy, VIP JACKPOT 25000 zł
  - Animacja spin 4500ms, ease-out quint, 5-7 pełnych obrotów + landing dokładnie na środku wybranego segmentu (matematycznie obliczone `finalRotation`)
  - Confetti(80) + showMsg 6s przy JACKPOT
  - Przy aplikacji nagrody: `earn()` dla money (Prestige multiplier), `addXP()` dla XP, direct dla żetonów/sławy
  - `G._lastDailyWheel` / `G._lastVipDailyWheel` = G.day tracking — porównywane przez `lastSpin !== G.day` (raz na dzień gry, nie real-time)
- **Handler act**: `casino:daily_wheel` → openDailyWheel(false), `casino:daily_wheel_vip` → openDailyWheel(true)
- **Save kompatybilność**: jeśli `G._lastDailyWheel` undefined (stare save), `||-1` traktuje jako "nigdy nie spina" → spin dostępny.

---

## v1.9.94 — NPC: koniec freeze + faktycznie przechodzą pasy zebry
- **User:** "NPC sie bugują, freezują, zatrzymują, nie chodzą po przejściu dla pieszych."
- **GŁÓWNY BUG**: oscylacja waypoint vs V-road. NPC z waypoint po drugiej stronie V-roadu dochodzi do krawędzi, RED LIGHT → bounce (dx=-dx), waypoint override (line 32272) widzi że dx idzie w przeciwnym kierunku niż wp → resetuje dx na +baseSpd. NPC znów leci do V-road, znów bounce, znów reset... endless loop.
- **Fix 1 (red light wait)**: w `_vRoadHit && !_alreadyInVRoad` zamiast bounce gdy `_cross && !_pedsGreen` → `dx=0; idleTimer=15` (czekaj przy krawędzi). NPC stoi i czeka aż peds=green, potem przejdzie. Wcześniej tylko `dx=-dx`.
- **Fix 2 (waypoint bounce cooldown)**: `_bounceFromVRoad=Date.now()+800` ustawiane gdy NPC bounce z V-road (brak _cross target lub cooldown). Waypoint override check: `if(ped.dx!==0 && !_bounceActive && ...)` — przez 800ms waypoint NIE nadpisuje dx, NPC ma czas oddalić się.
- **Fix 3 (freeze after crossing)**: blok "czekaj w pasie gdy peds=RED" (line 32138) odpalał się TAKŻE dla NPC tuż po crossing (gdy cykl świateł zmienił się w trakcie). Dodany warunek `ped._crossCooldown<=0` — świeżo po crossingu blok nie zamraża.
- **Fix 4 (faster stuck detection)**: stuck threshold 100 → 60 frames (1s zamiast 1.67s). Plus deep stuck failsafe: >180 frames stuck → TELEPORT na losowy bezpieczny chodnik + regeneracja trasy. Zapobiega permanent stuck w edge cases.
- **Fix 5 (no waypoint override gdy dx=0)**: gdy NPC czeka (dx=0), waypoint NIE nadpisuje dx — pozwala NPC stać. Wcześniej waypoint nadpisywał dx natychmiast po przybyciu do krawędzi V-roadu, omijając "czekam na zielone" logic.

---

## v1.9.95 — Kasyno: GIGANTYCZNY rewrite
- **User:** "Kasyno kompletnie zepsute. Niebieskie kursor wait. Plinko 0.5x → WYGRYWASZ. Wszystkie nowe gry mają ten problem. Parter i VIP te same gry. Baccarat/Craps nie działają. Winda małe okienko. Gospodyni VIP nic nie robi. Brzydkie żółte prostokąty."
- **"Niebieskie kółko" = cursor:wait**: gdy gracz nie ma żetonów, button miał `cursor:wait` (default Windows = niebieskie kółko ładowania). Zamieniony na `not-allowed` we wszystkich grach + duży banner ostrzegawczy "Brak żetonów, wymień w Kantorze".
- **Plinko 0.5× WYGRYWASZ**: tekst "WYGRYWASZ" pokazywał się gdy win>0 mimo strat netto. Fix: `if(profit>0) WYGRYWASZ; if(profit===0) ZWROT; else STRATA`.
- **Plinko spam mode**: kulki teraz lecą wielokrotnie naraz. Nowa struktura `activeBalls[]`, każda kulka osobno animowana na `requestAnimationFrame` (60fps), własny kolor + trail.
- **Plinko smooth**: setInterval 50ms (20fps) → requestAnimationFrame (60fps), interpolacja między rzędami pegs.
- **BACCARAT**: pełna gra Player vs Banker. Karty rysowane jako HTML (A♥ 7♠ etc.). Payout: Player 1.95×, Banker 1.9× (komisja), Tie 8×. Min 500 żet.
- **CRAPS**: pełna gra Pass Line + Don't Pass + Field. Animowane 2 kostki. Point system (jeśli 4-10 → point, musisz powtórzyć przed 7). Min 200 żet.
- **POKER 5-Card Draw**: NOWA gra. 5 kart, click do hold, reszta wymieniana. Payouty: 1 para J+ (1×) → Royal Flush (800×). Min 300 żet.
- **PARTER ≠ VIP**: różne gry:
  - PARTER: Sloty(3), Ruletka, Blackjack, Plinko, Koło Fortuny, Daily Wheel
  - VIP: High-Roller Sloty(3), Baccarat, Craps, Poker, War (przeniesione z partera), Keno (przeniesione), Daily Wheel VIP
- **WINDA powiększona**: 8×7 → 16×11 pól (384×336px → 768×528px). Przyciski większe (120×130). Przeniesiona z prawego górnego do dolnego rogu (daleko od Kantora).
- **GOSPODYNI VIP**: dialog z 4 opcjami:
  - 🍾 Drink od domu (raz dziennie +10 nastrój)
  - 🎁 Napiwek 500 zł (+1 sławy)
  - ❓ Zasady VIP (info)
  - Wyjdź
- **NOWY WYGLĄD MASZYN** (zamiast żółtych prostokątów):
  - `drawPlinkoMachine` — pionowy automat z bell-shape pegs board + spadającą kulką
  - `drawWheelMachine` — obracające się koło z 8 kolorowymi segmentami + wskaźnik
  - `drawKenoMachine` — siatka 6×4 migających liczb (animacja)
  - `drawBaccaratTable` — owalny zielony stół z PLAYER/BANKER + 2 kartami
  - `drawCrapsTable` — czerwony filc z gridem zakładów + 2 animowanymi kostkami
  - `drawPokerTable` — owalny stół z 5 kartami w łuku + chips stack
- **KOŁO FORTUNY**:
  - Opis ZGODNY: 8× LOSS (czerwone 50%), 4× zwrot 1× (zielone 25%), 3× 2× wygrana (żółte 18.75%), 1× JACKPOT 5× (gold 6.25%).
  - Nowy wygląd: gold rim, gradient segmenty per slice, czerwony pointer z highlightem, gold hub z 8 małymi dotami.
- **KENO**: dla wybranej ilości liczb pokazywana tabela payoutów ("4 traf. → 90× = X żet."). Rebalans 9/10 picks (mniejszy edge).
- **KANTOR**: USUNIĘTY darmowy spin (był duplikat z Daily Wheel). Kantor tylko wymiana + statystyki.

### Test Playwright v1.9.95 verified:
- Lobby kasyna: 6 gier + kantor + winda + bar (0 errors)
- VIP: 7 INNYCH gier (HR sloty, Baccarat, Craps, Poker, War, Keno, Daily Wheel VIP)
- Winda 16×11 (powiększona)
- Baccarat/Craps/Poker overlays renderują się
- Plinko spam: 3 drops odejmuje 150 żet poprawnie
- 0 JS errors po pełnym teście

---

## v1.9.96 — Przelot kamerą REWRITE: poprawny zoom + multi-shot + auto-run + guards
- **User:** "Przelot kamerą kompletnie zepsuty. Toast wyskakuje w trakcie. Zoom kompletnie zepsuty (Traphouse zoomuje na blok obok, Sklep spożywczy zoomuje na fryzjera). Ma być częścią intro nie pytanie. Multi-position per topic (Traphouse + biuro nieruchomości + mieszkania). Funkcja sprawdzająca czy gracz odbył."
- **Bug zoom**: cinemCam.targetX i hl.wx były OSOBNE i ROZJECHANE. Np. SHOT Traphouse miał cameraTarget wx=340 (zły), highlight wx=170 (poprawny). Przy zoom=1.45, widok pokazywał obszar ~(199,1081), a Traphouse (170) był poza viewportem. Highlight rysował się na pozycji budynku ALE budynek nie był w centrum ekranu.
- **Fix zoom**: targetX = wx-640, targetY = wy-329, highlight.wx = wx, highlight.wy = wy (TA SAMA pozycja). Po transformacie zoom centrum jest dokładnie na środku ekranu i highlight pojawia się na budynku.
- **Multi-position TOPICS** (10 topiców zamiast 11 statycznych shotów):
  - 🏠 TWÓJ DOM I PROGRESJA: 5 pozycji (Traphouse → Biuro Nieruchomości → Basic → Penthouse → Apartament Premium)
  - 🛒 JEDZENIE I PICIE: 5 pozycji (Sklep, Zbyszek, Restauracja, Targ, Pizzeria)
  - 🎙 KARIERA MUZYCZNA: 5 (Studio, Sklep Muzyczny, Media Markt, Sala, Radio)
  - 💼 PRACE DORYWCZE: 6 (Supermarket, Myjnia, Budowa, Kurier, Pizzeria praca, Warsztat)
  - 🏋️ ZDROWIE: 3 (Siłownia, Szpital, Fryzjer)
  - 💎 DRIP DISTRICT: 8 butików (LV, Chanel, Hermès, Gucci, Balenciaga, Bottega, Dior, Prada)
  - 🎰 KASYNO: 1
  - 🚘 TRANSPORT: 3 (Salon, Parking, Helipad)
  - 🌳 PARK: 1
  - 🎮 WYBIERZ ŚCIEŻKĘ: 1 (panorama)
  - **W ramach topica** opis NIE zmienia się (jedna fabuła), TYLKO etykieta lokacji + counter (1/5, 2/5, etc) fade-update'uje się.
- **Nowa sekwencja przelotu per shot**:
  1. Fade-out poprzedni highlight (250ms)
  2. Cam target = nowa pozycja, zoom = 1.1 (szeroki, "lecący")
  3. Kamera płynie (1100ms)
  4. PO dotarciu: zoom in do s.zoom (1.3-1.7) + highlight pojawia się
  - Czyli zoom nie jest od razu — kamera leci szeroka, dopiero gdy budynek jest na środku, zaczyna się zoom + highlight.
- **Guards anti-spam podczas cinematic**:
  - `showMsg(t,type,duration)` — jeśli `G._cinematicActive`, ZAPISUJE do `_cinemQueuedMsgs[]` zamiast wyświetlać
  - `addNotif(text)` — zapisuje do log ale nie sfxPhone() / nie has-new badge
  - `tutorialTick()` — jeśli `G._cinematicActive`, return (tutorial popup nie pokazuje się)
  - Po zakończeniu cinematic: max 3 ostatnie queued msgs odtwarzane z opóźnieniem 1.1s + 4.5s między każdym
- **Auto-run jako część intro**: po zamknięciu Wprowadzenia (`_introClose`) jeśli `currentRoom==='ulica' && !G._cinematicCompleted` → automatyczne wywołanie `openCinematicFlythrough()` po 800ms. Z ostatniego slajdu intro usunięto przycisk "PRZELOT", zastąpiony info-boxem "Po zamknięciu zobaczysz PRZELOT KAMERĄ".
- **Tracking + prompt dla starych save'ów**:
  - `G._cinematicCompleted = true` ustawiane w `_closeCinematic`
  - Po `loadGame` w `continueGame` — `setTimeout(_showCinematicOffer, 1500)`
  - `_showCinematicOffer()`: pokazuje modal "Nie odbyłeś przelotu, chcesz?" tylko gdy: nie completed + currentRoom==='ulica' + nie aktywne intro/cinematic
  - Opcje: ▶ URUCHOM PRZELOT lub "Pomiń (już nie pytaj)" → ustawia _cinematicCompleted=true bez przelotu

### Test Playwright v1.9.96 verified:
- Cinematic startuje poprawnie po init, paused=true
- camTarget = (0, 0) dla Traphouse (wx=170 < 640, clamped)
- Queue toast działa (queueLen=1 dla showMsg podczas cinematic)
- closeCinematic ustawia G._cinematicCompleted = true
- 0 JS errors

---

## v1.9.97 — Recycle bin dla save'ów
- **User:** "Tak, dodaj recycle bin"
- **TRASH_KEY** = `snowy_v5_trash` (JSON array, max 10 itemów)
- **deleteSlot** rewrite: zamiast `removeItem`, przenosi do trash z `{slot, data, deletedAt, meta}`. Meta zawiera nick, day, money, level dla wyświetlenia w UI.
- **openTrashBin()** modal — listuje wszystkie usunięte save'y z metadanymi, opcje per item: ♻ Przywróć / ✗ Usuń permanentnie
- **_restoreFromTrash(idx)** — przywraca do oryginalnego slotu. Jeśli slot zajęty, pyta czy nadpisać (i obecny save trafia do trash).
- **TRASH_RETENTION_DAYS** = 7 (auto-cleanup przy każdym openTrashBin)
- **Rolling backups rozszerzone**: zamiast 1 `_prev`, teraz 5 (`_prev`, `_prev1`...`_prev5`). Przy każdym save shift-down.
- **Przycisk w menu**: 🗑 Kosz (border orange, color gold)

## v1.9.98 — Kasyno batch 2: poker działa + winda full + opisy + 1 piętro 10k + 15 osiągnięć
- **User:** "Poker w kasynie kompletnie nie działa. Rozdaj karty bo gracz nie krupier. Winda zamiast okienka pół ekranu. Koło tylko raz dobrze. Min stawka info. Craps nie wiem co to. 1 piętro 10k czyste wygrane. Cinematics. Osiągnięcia kasyno."
- **Poker fix**: zmienia "ROZDAJ KARTY" → "▶ ZAGRAJ (-X żet.)". Dodany tutorial JAK GRAĆ + rozwijana tabela wygranych (Royal Flush 800× → para J+ 1×).
- **Baccarat fix**: "ROZDAJ KARTY" → "▶ ZAGRAJ". Dodany pełny tutorial + tabela zakładów.
- **Craps tutorial**: 4-stopniowy opis JAK GRAĆ + rozwijana tabela PASS / DON'T PASS / FIELD z dokładnym wyjaśnieniem każdego.
- **Koło Fortuny BUG FIX**: Po pierwszym spinie `rotation` zostawał w ~10π. Drugi spin targetAngle też ~10π → różnica mała → "koło lekko się rusza". Fix: `rotation = rotation % (Math.PI*2)` przed spinem, target = startRot + finalDelta + 5 pełnych obrotów. Zawsze pełna animacja.
- **WINDA pełny ekran**: 16×11 → **27×14** (1296×672 px). Przyciski 120×130 → 140×160.
- **Wymaganie VIP**: 60 sławy → **10 000 zł czystych wygranych** (totalWon - totalLost). Sprawdzane w act handler `elevator:vip`.
- **Cinematic odblokowania VIP**: `showVipUnlockCinematic(cb)` — pełnoekranowa animacja z 👑 + confetti + przycisk "WEJDŹ NA 1 PIĘTRO". G._vipUnlocked flag chroni przed wielokrotnym pokazem.
- **Min stawka WIDOCZNA**: w każdej grze (Slots, Roulette, Blackjack, Plinko, Wheel, Keno, Baccarat, Craps, Poker) nagłówek pokazuje minimalną stawkę + szybkie info. Banner "💸 Brak żetonów - wymień w Kantorze" przy 0 żetonów.
- **15 NOWYCH OSIĄGNIĘĆ kasynowych**:
  - casino_first (pierwsza wizyta)
  - casino_high_roller (10k netto)
  - casino_whale (100k netto)
  - casino_slots_master (50×)
  - casino_roulette_master (50×)
  - casino_blackjack_master (50×)
  - casino_plinko_master (30×)
  - casino_wheel_master (20×)
  - casino_jackpot (5k+ jednorazowo)
  - casino_megajackpot (50k+)
  - casino_vip_visitor (1 piętro)
  - casino_poker_royal (Royal Flush)
  - casino_baccarat_pro (20×)
  - casino_craps_pro (20×)
  - casino_daily_streak (7 daily wheel)
- **G._gotRoyalFlush** ustawiane w pokerze gdy result==='royal'
- **G._dailyWheelSpins** counter w Daily Wheel
- **G._vipUnlocked** flag dla achievement

---

## v1.9.99 — Cinematic v3: HUD off + smooth + poprawne pozycje + drip pan sweep
- **User**: "Dalej kamera nie wyśrodkowana. Za szybko. HUD ucięty w połowie. Kebab zoomuje na Studio Merchu (BUG). Drip District jeden płynny przelot zamiast osobnych. Zdrowie/forma BEZ fryzjera."
- **BUG kebab = Studio Merch**: pozycja w cinematic była **wx:1180** = `merch_studio` (Studio Merch), powinno być **wx:1545** = `npc_vendor` (Zbyszek z budką kebab). Zweryfikowane pozycje wszystkich 30+ budynków:
  - traphouse (170,208), sklep (184,750), fryzjer (505,750), merch_studio (1180,750), **npc_vendor=1545,748** (kebab!), silownia (1324,211), studio (1714,211), szpital (1974,750), sala_konce (2785,750), casino (3838,750), biuro_nieruch (4004,211)
  - Prace (wy=2286): supermarket 400, carwash 1154, construction 1874, kurier 2694, pizzeria 2994, warsztat 3274
  - Mieszkania (wy=3243-3253): basic 350, penthouse 1550, premium 3900
  - Drip góra (wy=2707): LV 2596, Chanel 2812, Hermès 3028, Gucci 3244
  - Drip dół (wy=3246): Balenciaga 2596, Bottega 2812, Dior 3028, Prada 3244
- **HUD HIDDEN** podczas cinematic:
  - CSS: `body.cinematic-active #hud, #minimap-wrap, #quest-widget, #hclock, #ms-track-pill, #hphone { opacity:0!important; pointer-events:none!important; transition:opacity .6s ease-out; }`
  - `openCinematicFlythrough` dodaje klasę, `_closeCinematic` usuwa
- **WOLNIEJSZY ruch**: adaptacyjne tempo:
  - Było: 0.075 / 0.045 / 0.025
  - Teraz: **0.04 / 0.025 / 0.012** (dist>500 / 150-500 / <150)
  - Lerp zoom: 0.04 → **0.025**
  - Czas per place: 2400-2800 → **3500-4000ms**
  - Czas wait przed zoom-in: 1100 → **1600ms**
- **PAN SWEEP** dla Drip District + Prace Dorywcze:
  - flag `panSweep:true` w TOPIC
  - lerpMul=0.6 = 40% wolniej niż normal
  - Brak `targetZoom=1.05` przed (kamera utrzymuje zoom z first place)
  - Highlight delikatny (opacity 0.4, r:300) przesuwa się razem z kamerą
  - Brak "wait → zoom in" — ciągły gładki ruch
- **DRIP DISTRICT**: 5 waypoints zamiast 8 osobnych zoomów:
  1. Góra LV (2596, 2707) zoom 1.25
  2. Góra Gucci (3244, 2707) → kamera płynnie pana po górnym rzędzie
  3. Dół Prada (3244, 3246) → pana w dół
  4. Dół Balenciaga (2596, 3246) → pana po dolnym rzędzie wstecz
  5. Centrum (2920, 2975) zoom 1.05 → finalne "wszystkie 8 butików widoczne"
- **PRACE DORYWCZE jako PAN**: panSweep:true. Kamera płynnie przelatuje wszystkie 6 prac (wszystkie na wy=2286).
- **Zdrowie i Forma BEZ fryzjera**: usunięty fryzjer z topica "ZDROWIE I FORMA" — teraz tylko Siłownia + Szpital. Fryzjer + Park → nowy topic "STYL I ROZRYWKA".

### Test Playwright v1.9.99 verified:
- Pozycje budynków zgadzają się z ROOMS.ulica.objects (npc_vendor=1545 dla kebabu ≠ 1180 merch_studio)
- body.cinematic-active=true podczas cinematic, HUD opacity:0, pointer-events:none
- Cam target Traphouse: (0,0) clamped poprawnie
- lerpMul=1 dla normalnego topica, 0.6 dla panSweep
- 0 JS errors

---

## KONTYNUACJA AUDYTÓW (v2.0.0+):
Audytuję pozostałe obszary gry — koncentracja na nowych zmianach + edge cases.

