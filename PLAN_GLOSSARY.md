# PLAN_GLOSSARY — Słowniczek terminów Snowy Simulator

**Cel:** Koniec mylenia nazw między sekcjami. "Forma to NIE kondycja". "G.fitness to NIE G.skills.kondycja".

---

## 💪 STATY FIZYCZNE GRACZA

| Termin | Co to | Gdzie | Przykład użycia |
|--------|-------|-------|-----------------|
| **Forma** | `G.forma` (0-100, max 110/120) | Siła ciała | Wpływ na zarobki fizyczne, atrakcyjność |
| **Kondycja** | `G.fitness` (0-100, max 110/120) | Wytrzymałość | Wpływ na prędkość gracza |
| **Skill kondycja** | `G.skills.kondycja` (0-5, drzewko umie) | Drzewko UI | NIE TO SAMO co `G.fitness`! Daje +5%/pkt prędkości |
| **Zdrowie** | `G.health` (0-100, max 110/120) | HP | Spada przy głodzie/braku energii |
| **Energia** | `G.energy` (0-100, max 110/120) | Stamina | Spada z aktywności, regen przy śnie |
| **Głód** | `G.hunger` (0-100, max 110/120) | Sytość | Spada z czasem, jedzenie odnawia |
| **Drip** | `G.drip` | Styl | HUD stat |
| **Sława** | `G.fame` (0-100%) | Popularność | Wpływ na koncerty, eventy |
| **Rep uliczna** | `G.streetRep` (0-100) | Reputacja | Wpływ na NPC raperów |

⚠️ **UWAGA**: `G.fitness` (kondycja) ≠ `G.skills.kondycja` (skill point w drzewku)!

---

## 🏋 SIŁOWNIA

| Termin | Co to |
|--------|-------|
| **Ławka** | Bench press — trenuje formę |
| **Wyciąg** | Cable — trenuje formę |
| **Bieżnia** | Treadmill — trenuje kondycję |
| **G._gymSets** | `{day, count, cardio, strength}` — daily reset |
| **G._lastGymDay** | Dzień ostatniej sesji (do mechaniki spadku) |
| **Strój sportowy** | Tańszy ~150zł, +20% przyrostów |
| **Strój PRO** | Droższy ~700zł, +25% + extra seria |
| **Gym Bro** | NPC kontakt SMS (po 2 dniach bez treningu) |

---

## 🎮 CINEMATIC

| Termin | Co to |
|--------|-------|
| **showMilestoneCinematic()** | Generic cinematic z opcjami |
| **#milestone-cinematic** | DOM id overlay (single source of truth!) |
| **CINEMATIC #1 gym tutorial** | Pierwsze wejście na siłownię (NIE auto-close) |
| **CINEMATIC #2 SZCZYT FORMY** | Pierwsze 100 formy/kondycji |
| **CINEMATIC #3 POWRÓT DO ŻYCIÓWKI** | Powrót do 100 po spadku (cykliczny) |
| **_milestoneShown.formaXXX** | Flaga "już pokazane" (jednorazowość) |
| **G._formaWasAt100** | Re-arm flaga dla cinematic #3 |

---

## 🌳 DRZEWKO UMIEJĘTNOŚCI

| Termin | Co to |
|--------|-------|
| **Skill point** | 1 pkt / level postaci, max 3-5 per skill |
| **Power-up** | 3 etapy kupowane za $$, po wymax skill |
| **Evolution** | 1× najdroższa, +1 pkt umie + unique mechanic |
| **SKILL_DEF** | Definicje skills w kodzie (linia 21701) |
| **G.skills** | Aktualnie number, MIGRACJA → object {lvl, powerUps, evolution} |
| **getSkillTotalBonus(key)** | Funkcja agregująca bonusy (TODO) |
| **getMaxStat(name)** | Dynamiczna max stat z bonusami formy/kondycji 100 (TODO) |

---

## 🗺 MAPA & GEOMETRIA

| Termin | Co to |
|--------|-------|
| **T = 48** | Tile size pixeli (ZAWSZE 48!) |
| **wx, wy** | World coordinates (faktyczne pozycje) |
| **sx, sy** | Screen coordinates (po kamerze) |
| **wx2sx(), wy2sy()** | Konwersja world → screen |
| **V1, V2, V3** | Pionowe chodniki |
| **H1, H2, H3** | Poziome chodniki (H1=384-576, H2=1920-2112, H3=2880-3072) |
| **Z1, Z2, Z3, Z4** | Zachodnia/Centralna/Wschodnia/Skrajna prawa zona |
| **Prostokąt 1, 2, 3, 4** | Dolny pas: Mieszkanie, Penthouse, Drip, Apartament Premium |
| **PARK** | x:0-672, y:864-1248, bramka c=13 r=21-22 |
| **PARK_BOUNDS** | Wewnętrzna strefa NPC: 96-660, 880-1230 |

---

## 🚦 RUCH I KOLIZJE

| Termin | Co to |
|--------|-------|
| **P.spd** | Prędkość gracza (1.7 + bonus z fitness/kondycji) |
| **P.dir** | 0=N, 1=E, 2=S, 3=W |
| **P.moving** | Czy gracz aktualnie się porusza |
| **K[]** | Klawisze trzymane (KeyDown bez KeyUp) |
| **_isOnRoad(wx,wy)** | Walidator chodnika/drogi |
| **parkFence** | 4 segmenty kolizji wokół parku |
| **DB_DECORATIVE** | Dekoracyjne bloki budynków (kolizje) |

---

## 👥 NPC

| Termin | Co to |
|--------|-------|
| **parkPeds** | NPC w parku (linia 615) |
| **cityPeds** | NPC miejscy (24 sztuki, 6 typów) |
| **drawCityPed()** | Renderowanie miejskiego NPC z paletami |
| **drawParkLife()** | Renderowanie parku |
| **skinPalette, hairPalette, clothPalette** | Palety zróżnicowania |
| **NPC types** | casual, runner, business, elderly, kid, dogwalker |
| **Park NPC types** | runner, dogwalker, gardener, elderly, couple1, couple2 (DO ZMIANY) |

---

## 🏪 BUDYNKI & APARTAMENTY

| Termin | Co to |
|--------|-------|
| **Mieszkanie podstawowe** | Prostokąt 1, lewy dolny |
| **Penthouse** | Prostokąt 2 |
| **Drip District** | Prostokąt 3 (Balenciaga, Bottega, Dior, Prada) |
| **Apartament Premium** | Prostokąt 4, prawy dolny |
| **Sala Koncertowa** | Centralna |
| **Studio** | Studio nagraniowe |
| **Traphouse** | Mini studio z ograniczeniami |
| **Home Studio** | Nagrywanie w mieszkaniu |
| **drawBuilding flip=false/true** | Flip wschód/zachód |

---

## 💼 PRACE / KARIERY

| Termin | Co to |
|--------|-------|
| **Praca dorywcza** | Pizza, Supermarket, Carwash, Construction, Kurier, Zmywak |
| **Kariera** | Raper, YouTuber, Beatmaker, Gamer, Influencer, Sound Eng. |
| **G.careers.X.unlocked** | Czy kariera odblokowana |
| **G.careers.raper.skillPts** | Osobne skill pts dla rapera |
| **G.raperST** | Stary skill tree rapera (zmigrowany do G.skills.kondycja) |

---

## 📱 PHONE / APPS

| Termin | Co to |
|--------|-------|
| **Telefon** | UI w prawym górnym rogu |
| **Spotify** | Dystrybucja muzyki, weryfikacja artysty |
| **Instagram** | Posty, sponsorzy |
| **Twitter** | Reach, engagement |
| **Wiadomości** | SMS od NPC (Gym Bro, etc.) |
| **Bank** | Konto, oszczędności, inwestycje |

---

## 🎨 RENDERING

| Termin | Co to |
|--------|-------|
| **X** | Canvas 2D context (`canvas.getContext('2d')`) |
| **drawXxx()** | Funkcje rysujące |
| **Z-order** | Kolejność warstw (drawObjects PRZED drawCityLife/drawParkLife) |
| **G.timeOfDay** | 0=rano, 1=dzień, 2=wieczór, 3=noc |
| **timeOfDay >= 2** | Wieczór/noc (światła w oknach, latarnie) |

---

## 💾 SAVE / STATE

| Termin | Co to |
|--------|-------|
| **G** | Główny obiekt stanu gry |
| **P** | Player state (pozycja, kierunek, dirty flags) |
| **PATCH_NOTES** | Lista zmian w `index.html` (przyjazny język!) |
| **localStorage** | Główny save |
| **JSONL session** | `C:\Users\kryst\.claude\projects\...\sessionId.jsonl` |

---

## ⚠️ KOMUNIKATY UŻYTKOWNIKA

| Termin użytkownika | Co znaczy |
|--------------------|-----------|
| "Forma" | `G.forma` (siła) |
| "Kondycja" | `G.fitness` (NIE `G.skills.kondycja`!) |
| "Skill kondycja" | `G.skills.kondycja` (drzewko) |
| "Złamane" | OP, daje za dużą przewagę |
| "Naturalne" | Część świata, nie osobny system |
| "Immersyjne" | Realistyczne, klimatyczne |
| "Odpalać cinematic" | `showMilestoneCinematic()` |
| "Wbić" | Osiągnąć (np. "wbij 100 formy") |
| "Wymaksować" | Doprowadzić do max wartości |
| "Pompa" | Slang siłowy = forma/mięśnie |
| "Życiówka" | Personal best (rekord życiowy) |
