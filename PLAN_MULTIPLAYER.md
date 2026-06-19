# PLAN MULTIPLAYER — 5 OPCJI

**Utworzony**: 2026-05-18
**Stan**: PENDING — propozycje do dyskusji, brak implementacji
**Backend istniejący**: Supabase (już używany dla leaderboard — `submitAllScores`, `fetchLeaderboard`, L45485+)

## Kolejność rekomendowana

```
A. Async social chart    MAŁA       TOP    (reuse leaderboard)
B. Async beef battle     ŚREDNIA    Wysoki (klimat hip-hop)
C. Trading marketplace   ŚREDNIA    Średni (wymaga anti-abuse)
D. Crew system           JUŻ JEST ✅       (rozszerzenia: leaderboard crewów + rewards)
E. Real-time co-op       BARDZO DUŻA SKIP  (źle pasuje do single-player gameplay)
```

---

## OPCJA A: Async social chart (MAŁA, TOP)

**CO**: Top 10 chart z **prawdziwymi graczami** (z Supabase) zamiast fikcyjnych NPC.

**Mechanika**:
- Player score = `G.fame × 1000 + G.fans`
- Submit do Supabase przy każdym save (już istnieje w `submitAllScores`)
- Fetch top 10 + player rank przy otwarciu phone app
- Pokazywanie: rank, nick, fame, fans, ostatnia aktywność (days ago)

**Plus**:
- Widzisz prawdziwych raperów konkurencyjnie
- Bardzo niski koszt — istniejąca infrastruktura
- Motywuje grind (awans w real ranking)
- Można połączyć z **Krokiem 4** z PLAN_8_KROKOW.md (zamiast CHART_NPCS = real players)

**Minus**:
- Pasywne (tylko "patrz")
- Brak interakcji gracz-gracz

**Wymagania**:
- Nowa tabela Supabase `chart_scores` (lub reuse existing leaderboard)
- Phone app "📊 Chart" — fetch top 10 + render
- Polling co X minut (lub on-demand refresh button)

**Pliki**: 
- Reuse `fetchLeaderboard` (L45635)
- Nowy phone app entry
- Dodanie chart_scores w Supabase schema

---

## OPCJA B: Async beef battle (ŚREDNIA, Wysoki)

**CO**: Turn-based diss battles między prawdziwymi graczami przez Supabase.

**Flow**:
1. Gracz X otwiera "🥊 Beef" → wybiera rivala z top 100 chart
2. Nagrywa diss track (minigame) → score 0-100
3. Submit do Supabase `pending_beefs` z target_uuid
4. Gracz Y przy następnym save load dostaje notyfikację "Ktoś Cię wyzwał!"
5. Y nagrywa response (jeśli odpowie w 7 dni) lub Y traci by walkower
6. Compare scores → winner: +X% Y's fans converted, +fame
7. Loser: hejterzy + stress

**Mechanika balansowa**:
- Limit: 1 beef inicjowany/tydzień, max 3 pending równocześnie
- Power gap > 30 fame = handicap (NPC +20 score bonus)
- Win reward: 5-15% target fans converted
- Cooldown: 30 dni between same 2 players

**Plus**:
- Realna interakcja gracz-gracz
- Klimat hip-hop (beefy są core kultury)
- Powiązane z Krokiem 6 z PLAN_8_KROKOW.md (beef system NPC → real players)

**Minus**:
- Delays (gracz czeka 1-3 dni real-time na response)
- Wymaga moderacji content (lyrics inappropriate)
- Anti-abuse (smurf accounts dla farming)

**Wymagania**:
- Tabela Supabase `pending_beefs` (id, challenger_uuid, target_uuid, dissTrack, score, status, expires_at)
- Notification system on load (count pending)
- Phone app "🥊 Beef Inbox"
- Lyrics content filter (basic word blacklist)

**Pliki**:
- Nowy const NEW_BEEFS state w G
- `checkPendingBeefs()` w nextPeriod
- Phone app "beef_inbox"
- Minigame diss-track (reuse freestyle engine)

**Zależność**: Opcja A (top 100 chart jako pool rivali)

---

## OPCJA C: Trading marketplace (ŚREDNIA, Średni)

**CO**: Gracze wystawiają luxury items / drip / tracki na giełdę. Kupno za in-game zł.

**Mechanika**:
- Player wybiera item (luxury drip, ekskluzywne ubranie, track)
- Wystawia za zł cenę (Buy Now) lub aukcja (highest bid 24h)
- Inni gracze widzą "Marketplace" phone app
- Kupno = transfer item do kupującego, money transfer
- Fee 10% (anti-spam, lekko draining economy)

**Plus**:
- Ekonomia gracz-gracz
- Drip ma realny rynek (rzadkie items droższe)
- Late game endgame loop (kupuj, sprzedawaj, profit)

**Minus**:
- **Exploits**: smurf accounts, fake transactions (drugie konto przekazuje 1M dla pierwszego)
- Pricing balance: kto ustala fair value?
- Wymaga moderacji (raportowanie scam'ów)

**Anti-abuse**:
- Rate limit: max 5 trade'ów/dzień gry per player
- Min listing duration: 6h (anti-flip)
- Cap money transfer/dzień: 100k zł (anti-funneling)
- Player UUID tracking
- IP/device fingerprint optional

**Wymagania**:
- Tabela `marketplace` (id, seller_uuid, item_type, item_data, price, status, expires_at)
- Tabela `trade_history` (audit log)
- Phone app "🏪 Giełda"
- Listing UI + buy flow + cancel flow

**Pliki**:
- Nowy const MARKETPLACE state
- Marketplace API w Supabase
- Phone app `marketplace`
- Anti-abuse checks (rate limits, fingerprint)

---

## OPCJA D: Crew system real players — **JUŻ ZAIMPLEMENTOWANE** ✅

**Status**: W grze **już jest** rozbudowany crew system z prawdziwymi graczami przez Supabase.

**Co istnieje (sprawdzone w kodzie 2026-05-18)**:
- ✅ `G.playerCrew` state + `renderPhoneCrew()` (L46071)
- ✅ Phone app "🏆 Crew" w career folder (L27017)
- ✅ Max **4 członków** per crew
- ✅ 5 tabel Supabase: `crews`, `crew_members`, `crew_invites`, `crew_messages`, `crew_challenges`
- ✅ Leader role + kick member
- ✅ Crew invites flow (pending/accepted/rejected) z polling
- ✅ Crew chat (crew_messages) — limit 20 ostatnich wiadomości
- ✅ **4 weekly challenges** (`CREW_CHALLENGE_TYPES` L46270):
  - 💰 Zarobcie razem 100 000 zł (earn_money)
  - 🎤 Zagrajcie razem 5 koncertów (play_concerts)
  - 💿 Nagrajcie razem 3 tracki (record_tracks)
  - 👥 Zdobądźcie razem 5 000 fanów (gain_fans)
- ✅ ISO week keys dla challenges (rolling co tydzień)
- ✅ Progress hooks w `earn()`, `addFans()`, koncertach, recording (`_crewAddProgress`)
- ✅ Anti-spam (UNIQUE constraint na crew_id+to_uuid w invites)
- ✅ RLS + CASCADE delete dla wszystkich tabel

**Co MOŻE być dodane (rozszerzenia)**:
- 🔲 Crew vs crew leaderboard (ranking crewów po sumie fame/zarobków)
- 🔲 Crew payouts za completed challenges (aktualnie tylko progress tracking, brak rewardu?)
- 🔲 Crew name/logo customization (custom emoji + opis)
- 🔲 Crew levels/prestige (po X completed challenges → unlock features)
- 🔲 Cross-crew interactions (crew vs crew beef? — overlap z Opcją B)

**Wymagania dla rozszerzeń**:
- Backend: 1-2 nowe tabele (`crew_rankings`, `crew_payouts_log`) lub query agregaty na istniejących
- Frontend: zakładka "Ranking" w phone app crew + reward UI

**Pliki dla rozszerzeń**:
- L46071+ `renderPhoneCrew()` — dodać sekcje
- L46270 `CREW_CHALLENGE_TYPES` — może rozszerzyć o trudniejsze tier (np. 1M zł challenge dla crewów top)
- Nowe Supabase tables/queries

**Wniosek**: Główna funkcjonalność D **jest gotowa**. Można skupić się na **rozszerzeniach** (leaderboard crewów, rewards) — to **MAŁA-ŚREDNIA** złożoność, nie DUŻA.

---

## OPCJA E: Real-time co-op (BARDZO DUŻA, SKIP)

**CO**: Gracze widzą siebie na mapie w czasie rzeczywistym, chat, wspólne akcje.

**Mechanika** (teoretyczna):
- WebSocket lub Supabase Realtime channels
- Każdy player wysyła position update co ~200ms
- Inni gracze widzą avatar moving
- Chat window
- Wspólne koncerty (duet mode?)

**Plus**:
- Najbardziej immersyjne MMO-style

**Minus** (decydujące):
- **Architektoniczna przebudowa** — gra zaprojektowana solo
- WebSocket connection management (lost connection, reconnect, sync conflicts)
- **NIE pasuje do gameplay loop** — Snowy to rap career simulator, gracz robi własną karierę. Po co drugi gracz?
- Wymaga server-side authority (anti-cheat)
- Dramatic cost vs benefit

**Wymagania**: Cały nowy backend layer, redesign większości systemów.

**Decyzja**: **SKIP**. Zła inwestycja. Single-player career sim nie potrzebuje real-time MMO.

---

## Co istnieje dziś (baseline)

- ✅ Supabase backend (URL + headers w L45485)
- ✅ Player UUID (`G.playerUUID`)
- ✅ Player nick (`G.globalNick`)
- ✅ Opt-in flag (`G.leaderboardOptIn`)
- ✅ `submitAllScores` (push lokalne score'y)
- ✅ `fetchLeaderboard` (pull top X per kategoria)
- ✅ Rank cache (`localStorage trapsim_lb_ranks`)
- ✅ Network error handling (try/catch wokół fetch)

**Czyli infrastruktura już jest**. Multiplayer features = nowe tabele + nowe queries + nowe UI.

---

## Rekomendowana sekwencja

1. **Opcja A** — najprościej, reuse 100% istniejącego (kilka godzin pracy w sumie). Zamień NPC chart z Kroku 4 PLAN_8_KROKOW.md na real players.
2. **Opcja B** — naturalne rozszerzenie A (skoro mamy real chart, dodajemy beef przeciw real player). Średnia złożoność.
3. **Opcja C** — jeśli A+B się przyjmą i ludzie grają, marketplace dla rozwoju ekonomii.
4. **Opcja D** — TYLKO gdy >100 active users.
5. **Opcja E** — NIGDY (zła inwestycja dla single-player career sim).

---

## Zależności

```
Opcja A (chart) ───┐
                   ├─► Opcja B (beef używa A pool)
                   ├─► Opcja D (crew leaderboard używa A score)
Opcja C (market) — STANDALONE
Opcja E — SKIP
```

---

## Status

- A: PENDING (rekomendowane jako pierwsze)
- B: PENDING (po A)
- C: PENDING (opcjonalne, gdy A+B działa)
- D: **JUŻ ISTNIEJE** ✅ (pełna implementacja crew system z 5 tabelami Supabase, 4 weekly challenges, chat, invites, kick — patrz sekcja Opcja D). Możliwe rozszerzenia: crew vs crew leaderboard, rewards za challenges.
- E: REJECTED (zła inwestycja)
