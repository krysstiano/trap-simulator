# Notatki projektowe — kontekst od właściciela gry

---

## Zadanie #28 — System Progresji + Studio jako centrum kariery

### Filozofia:
Gracz ma ZAWSZE do czegoś dążyć. Każda sesja gry odblokowuje coś nowego. Nuda po kilku minutach = porażka designu. Wszystko jest za bramką postępu.

### Studio — pełna mechanika:
**Zakup studia:**
- Studio jest do kupienia (drogie, np. 15 000–30 000 zł)
- Przed zakupem gracz może wejść ale widzi puste pomieszczenie z komunikatem "To studio jest na sprzedaż"
- Po zakupie staje się własnością gracza i centrum kariery muzycznej

**Wyposażenie studia (kupowane osobno):**
- Mikrofon (różne jakości: budżetowy 500zł, semi-pro 2000zł, pro 8000zł) → widoczny fizycznie w studio jako narysowany obiekt
- Interfejs audio (500–5000zł) → widoczny na blacie
- Panele akustyczne (100zł/szt) → gracz rozmieszcza je na ścianach/suficie, widoczne w pokoju
- Monitor odsłuchowy (1000–4000zł/para)
- Klawiatura MIDI (800–3000zł)
- Komputer/DAW (2000–10000zł) → wymagany do miksowania

**Co można robić w studio (odblokowania przez sprzęt + skill pointy):**
- Nagrywanie wokal → wymaga: mikrofon + interfejs + DAW
- Tworzenie bitów → wymaga: klawiatura MIDI + DAW
- Miksowanie → wymaga: DAW + monitor odsłuchowy + skill "Mikser" odblokowany
- Mastering → wymaga: wysokiego poziomu umiejętności + pro sprzęt
- Przyjmowanie zleceń od artystów → wymaga: reputacji + odpowiedniego sprzętu
- Nagrywanie gości (feat.) → wymaga: wysokiej reputacji

**Jakość nagrania:**
- Zależy od jakości sprzętu + poziomu umiejętności gracza
- Wyższa jakość = więcej streamów, więcej fanów, lepsze oferty

### System Progresji — bramki:
Każda akcja w grze powinna być za jakąś bramką:

**Wczesna gra (Dzień 1-10):**
- Praca dorywcza (pizza, zmywak, myjnia) → zarabianie na pierwsze wyposażenie
- Freestyle na ulicy → pierwsi fani, pierwsze skill pointy
- Zakup budżetowego mikrofonu → pierwszy nagrany wokal

**Środkowa gra (Dzień 11-30):**
- Zakup studia lub wynajęcie godzin w cudzym
- Wydanie pierwszego singla → Instagram zaczyna rosnąć
- Odblokowanie kariery YouTubera/Beatmakera
- Pierwsze zlecenia od NPC artystów

**Późna gra (Dzień 30+):**
- Własne studio w pełni wyposażone
- Kontrakt z labelem
- Dzielnica Dripu odblokowana przez prestiż
- Kolaboracje z innymi artystami
- Trasy koncertowe

### Drzewko umiejętności powiązane ze studiem:
- **Realizacja wokalu** (odblokuj żeby przyjmować zlecenia)
- **Mikser** (odblokuj żeby miksować tracki)
- **Producent** (odblokuj żeby tworzyć bity na sprzedaż)
- **Sound Engineer** (odblokuj żeby masterować)

### Fizyczne rozmieszczanie sprzętu w studio:
- Po zakupie sprzętu gracz może go "postawić" w studio
- Mikrofon pojawia się na statywie w konkretnym miejscu pokoju
- Panele akustyczne można klikając na ściany — zaznaczasz gdzie je montujesz
- Komputer pojawia się na biurku
- Studio wizualnie ewoluuje wraz z zakupami

### Własne propozycje (dodaj bez pytania):
- System "godzin nagrania" — każda sesja kosztuje energię i czas
- Losowe zdarzenia w studio (zacinający się mikrofon, wizyta managera)
- System reputacji studia — im lepszy sprzęt tym bardziej znane studio, inni artyści przychodzą sami
- Możliwość wynajmu własnego studia innym gdy gracz nie nagrywa → pasywny przychód
- Albumy vs single — album wymaga 8-12 tracków, daje więcej prestiżu ale dłużej się robi

---

## Zadanie #27 — Kariera Rapera + Drzewko Umiejętności

### Kontekst:
G.careers.raper już istnieje w kodzie ({level, freestyles, tracks, xp}) ale prawdopodobnie nie jest w pełni zaimplementowana. SKILL_DEF (~linia 7636) zawiera definicje umiejętności ale może nie mieć drzewka dla rapera.

### Kariera Rapera:
- Progresja przez: freestyle na ulicy, nagrywanie tracków w studio, wydawanie singli/albumów, koncerty
- Poziomy kariery: Początkujący → Underground → Rising → Known → Famous → Legend
- Każdy poziom odblokowuje nowe możliwości (lepsze studio, większe koncerty, label deals)
- Powiązanie z G.fans, G.followers, G.spotify, G.yt

### Drzewko Umiejętności — szczegółowe opisy każdego węzła:

**GAŁĄŹ: FLOW (wymaga: brak)**
- Poziom 1 (1 pkt) — "Podstawowy rytm": freestyle trwa 10% dłużej bez potknięcia
- Poziom 2 (2 pkt) — "Płynne rymy": +15% XP za każdy freestyle
- Poziom 3 (3 pkt) — "Multisylabowe": odblokowanie trudniejszych freestylów za większy reward
- Poziom 4 (4 pkt) — "Improwizacja": losowa szansa na "viral freestyle" +50 fanów jednorazowo
- Poziom 5 (5 pkt) — "Legendarny Flow": każdy nagrany track ma +25% bazowej jakości

**GAŁĄŹ: TEKSTY (wymaga: Flow 2)**
- Poziom 1 (1 pkt) — "Pierwsze rymy": tracki generują +10% streamów na Spotify/Tidal
- Poziom 2 (2 pkt) — "Głębsze znaczenie": +20% szans że track trafi na playlistę
- Poziom 3 (3 pkt) — "Storytelling": albumy sprzedają się o 30% lepiej
- Poziom 4 (4 pkt) — "Kultowe wersy": co 5. track automatycznie staje się "hitem" (+200% streamów)
- Poziom 5 (5 pkt) — "Poeta ulicy": odblokowanie kontraktów z top labelami

**GAŁĄŹ: PRODUKCJA (wymaga: studio + klawiatura MIDI)**
- Poziom 1 (1 pkt) — "Pierwsze bity": możliwość tworzenia bitów, sprzedaż za 50-200 zł
- Poziom 2 (2 pkt) — "Sampling": bity wyższej jakości, sprzedaż za 200-800 zł
- Poziom 3 (3 pkt) — "Własny styl": rozpoznawalny sound, +10% do reputacji studia
- Poziom 4 (4 pkt) — "Ekskluzywne bity": znani artyści kupują bity za 2000-8000 zł
- Poziom 5 (5 pkt) — "Producent roku": pasywny przychód z bitów nawet gdy gracz robi coś innego

**GAŁĄŹ: REALIZACJA (wymaga: mikrofon + interfejs audio)**
- Poziom 1 (1 pkt) — "Podstawowe nagranie": możliwość nagrania wokalu innym artystom, zarobek 100-300 zł
- Poziom 2 (2 pkt) — "Czysty dźwięk": wyższa jakość nagrań, zarobek 300-800 zł
- Poziom 3 (3 pkt) — "Profesjonalna realizacja": zlecenia od znanych artystów, zarobek 800-2000 zł
- Poziom 4 (4 pkt) — "Złote ucho": klienci wracają, stałe zlecenia co kilka dni
- Poziom 5 (5 pkt) — "Legenda realizacji": zarobek 5000-15000 zł za sesję, pasywna reputacja studia

**GAŁĄŹ: MIKSER (wymaga: DAW + monitor odsłuchowy + Realizacja 2)**
- Poziom 1 (1 pkt) — "Podstawowy mix": możliwość miksowania własnych tracków, +10% jakości
- Poziom 2 (2 pkt) — "Balans częstotliwości": tracki brzmią profesjonalniej, +20% streamów
- Poziom 3 (3 pkt) — "Miksowanie dla innych": zlecenia na miks od innych artystów
- Poziom 4 (4 pkt) — "Signature sound": twój miks jest rozpoznawalny, +25% fanów z każdego wydanego tracku
- Poziom 5 (5 pkt) — "World class mix": odblokowanie masteringu, możliwość pracy dla labelów

**GAŁĄŹ: AUTOPROMOCJA (wymaga: brak)**
- Poziom 1 (1 pkt) — "Pierwsze posty": +10% followersów za każdy post na Instagramie
- Poziom 2 (2 pkt) — "Content creator": możliwość postowania 2x dziennie (zamiast 1x)
- Poziom 3 (3 pkt) — "Viral mindset": +25% szans na viral post, każdy viral = +500 followersów
- Poziom 4 (4 pkt) — "Personal brand": mnożnik prestiżu ×1.5 dla wszystkich akcji promocyjnych
- Poziom 5 (5 pkt) — "Social media king": pasywny przyrost +50 followersów/dzień bez robienia niczego

**GAŁĄŹ: BIZNES (wymaga: Autopromocja 2)**
- Poziom 1 (1 pkt) — "Negocjacje": kontrakty z labelem o 10% korzystniejsze
- Poziom 2 (2 pkt) — "Tantiemy": +15% royalties ze Spotify/Tidal/YouTube
- Poziom 3 (3 pkt) — "Własny label": możliwość założenia własnego labelu, podpisywanie innych artystów
- Poziom 4 (4 pkt) — "Investor mindset": odblokowanie inwestycji giełdowych w grze
- Poziom 5 (5 pkt) — "Music mogul": pasywny przychód z własnego labelu, +30% do wszystkich zarobków

**GAŁĄŹ: SCENA (wymaga: Flow 3 + min. 500 fanów)**
- Poziom 1 (1 pkt) — "Pierwszy koncert": małe eventy (50 osób), zarobek 200-500 zł
- Poziom 2 (2 pkt) — "Charyzma na scenie": +20% zarobku z każdego eventu, więcej fanów po koncercie
- Poziom 3 (3 pkt) — "Festival slots": możliwość grania na festiwalach, zarobek 2000-8000 zł
- Poziom 4 (4 pkt) — "Headliner": własne trasy koncertowe, zarobek 10 000-50 000 zł
- Poziom 5 (5 pkt) — "Arena shows": koncerty w wielkich halach, ikoniczny status, +1000 fanów za event

**GAŁĄŹ: KONDYCJA (wymaga: bieżnia w siłowni)**
- Poziom 1 (1 pkt) — "Pierwsze kroki": prędkość gracza +10% (1.8 → 2.0)
- Poziom 2 (2 pkt) — "Regularny trening": prędkość +20%, energia spada wolniej o 10%
- Poziom 3 (3 pkt) — "Wytrzymałość": prędkość +35%, można chodzić dalej bez odpoczynku
- Poziom 4 (4 pkt) — "Sprinter": prędkość +50%, możliwość "sprintu" (shift = bieg)
- Poziom 5 (5 pkt) — "Atleta": prędkość +75% (1.8 → 3.15), energia regeneruje się 20% szybciej

### UI Drzewka:
- Widoczne w telefonie (nowa zakładka "Umiejętności")
- Węzły połączone liniami, ikony dla każdej gałęzi
- Zablokowane (szare), dostępne (świecące), aktywne (złote)
- Tooltip z dokładnym opisem przy najechaniu
- Licznik dostępnych skill pointów widoczny u góry
- Skill pointy zdobywane przez: freestyle, nagrywanie, koncerty, leveling up

### Weryfikacja:
- Przejść przez wszystkie etapy kariery rapera
- Wydać skill pointy w drzewku i zobaczyć efekt
- Sprawdzić powiązanie z innymi systemami (fani, pieniądze, instagram)

---

## Zadanie #26 — Dzielnica Dripu, Prestiż i Forma

### Dzielnica Dripu — co to jest:
Luksusowa dzielnica na mapie z ekskluzywnymi sklepami odzieżowymi:
Louis Vuitton, Chanel, Hermès, Gucci, Balenciaga, Bottega Veneta, Dior, Prada.
Gracz kupuje tam drogie ubrania → dostaje punkty prestiżu.
Dzielnica powinna wyglądać ekskluzywnie — inne budynki niż reszta mapy (marmur, złote akcenty, elegancja).

### System Prestiżu (G.prestige):
- Zdobywany przez: kupowanie luksusowych ubrań w Dzielnicy Dripu
- Wpływa na rozgrywkę jako mnożnik — np.:
  - Więcej followersów za post na Instagramie
  - Lepsze oferty od labelów
  - Wyższe zarobki z eventów
  - Lepszy odbiór muzyki
- Wyświetlany w UI (HUD lub telefon)
- Im droższe ubranie tym więcej prestiżu

### Przykładowe ceny i prestiż ubrań:
- Zwykłe ubrania (sklep): 50-200 zł, 0 prestiżu
- Gucci/Balenciaga: 2000-5000 zł, +5-10 prestiżu
- Louis Vuitton/Chanel/Hermès/Dior/Prada: 5000-15000 zł, +15-25 prestiżu

### G.forma (siłownia) + G.skills.kondycja (bieżnia):
- Forma ułatwia ćwiczenia na siłowni (np. minigry wymagają mniej ruchów/kliknięć)
- Forma przyspiesza rozwój na Instagramie (mnożnik podobny do prestiżu)
- **Bieżnia** → daje punkty kondycji (G.skills.kondycja)
- Im więcej kondycji → tym szybciej gracz porusza się po mapie (P.spd)
  - Przykład: kondycja 0 = prędkość 1.8 (zmniejszona z obecnych 2.8), kondycja 10 = 2.2, kondycja 50 = 3.5, kondycja 100 = 5.0
- **Zmniejszyć domyślną prędkość gracza** z obecnych 2.8 do ~1.8 — kondycja ma być odczuwalną nagrodą
- Widoczne w UI: pasek kondycji lub wartość liczbowa

### Co zaimplementować:
1. Dzielnicę Dripu na mapie z 8 sklepami luksusowymi
2. System zakupu luksusowych ubrań
3. G.prestige jako aktywny mnożnik w systemach gry
4. G.forma jako aktywna statystyka z siłowni
5. UI dla prestiżu i formy

---

## Zadanie #15 — Prawy dolny róg mapy — pełna naprawa

### Problem:
Prawy dolny róg mapy (skrzyżowanie V3×H3) jest kompletnie zbugowany:
- Chodnik pojawia się pomiędzy trawą (błędny tile)
- Przejście dla pieszych narysowane na chodniku zamiast na ulicy
- To jest róg mapy = skrzyżowanie tylko 2 ulic (nie 4) → powinny być tylko 2 przejścia dla pieszych, nie 4
- Auta respią się i znikają w nieodpowiednich miejscach — wjeżdżają w chodnik i znikają lub pojawiają się z chodnika

### Co zrobić:
- Sprawdzić kafelki w prawym dolnym rogu mapy — poprawić błędny chodnik między trawą
- Crosswalki dla V3×H3: usunąć 2 z 4 przejść (zostawić tylko te przy krawędzi mapy, nie po "wewnętrznej" stronie rogu)
- Naprawić spawn/despawn samochodów — auta powinny pojawiać się i znikać poza ekranem, nie na chodniku
- Sprawdzić granice mapy dla samochodów — V3 i H3 kończą się przy krawędzi świata

### Weryfikacja:
- Screenshot prawego dolnego rogu
- Auta płynnie wjeżdżają/wyjeżdżają poza krawędź mapy
- Tylko 2 przejścia dla pieszych na tym rogu
- Brak chodnika między trawą

---

## Zadanie #17 — Kolor ubrania z kreatora nie przenosi się do gry

### Problem:
Gracz wybiera np. zieloną koszulkę w kreatorze postaci, ale w grze nie widać żadnego koloru — ubranie ignoruje wybór z kreatora.

### Co zrobić:
- Sprawdzić jak kreator zapisuje wybór koloru ubrania (prawdopodobnie creatorState.cloth lub G.cloth)
- Sprawdzić czy drawPlayer() faktycznie używa G.cloth / P.cloth do rysowania tułowia
- Prawdopodobny bug: kolor jest zapisywany do jednej zmiennej ale odczytywany z innej
- Sprawdzić też spodnie (G.pants) i buty (G.shoes) — czy też nie przenoszą się
- Powiązane z zadaniem #20 (ogólny wygląd postaci)

### Weryfikacja:
- Wybrać zieloną koszulkę w kreatorze → postać w grze ma zieloną koszulkę
- Sprawdzić wszystkie elementy ubioru: koszulka, spodnie, buty

---

## Zadanie #16 — Wygląd postaci gracza w grze vs kreator

### Problem:
Postać wygląda dobrze w kreatorze postaci, ale zupełnie inaczej w grze. W grze wygląda jakby miała czapkę na pół głowy z oczami i uśmiechem namalowanymi na tej czapce. Niedopuszczalne.

### Co zrobić:
- Porównać kod rysujący postać w kreatorze (creatorState, ~linia 6981) z kodem drawPlayer() (~linia 1180)
- Znaleźć rozbieżności — prawdopodobnie inne proporcje głowy/ciała, inny offset, inna kolejność rysowania elementów
- Zsynchronizować drawPlayer() żeby używał tych samych proporcji i stylu co kreator
- Zasada: postać w grze = postać z kreatora, tylko top-down zamiast frontalnego widoku

### Weryfikacja:
- Screenshot kreatora obok screenshotu postaci w grze — powinny wyglądać spójnie
- Twarz czytelna: oczy na głowie, nie na "czapce"

---

## Zadanie #18 — Wnętrza budynków — klimat i detale

### Problem:
Wnętrza są puste i nie oddają charakteru miejsca. Przykład: siłownia to puste pomieszczenie z drewnianą podłogą — brak jakiegokolwiek sprzętu sportowego.

### Co zrobić dla każdego pomieszczenia:
- **Siłownia** — hantle na podłodze, sztangi z talerzami, ławka do wyciskania, wyciąg, lustro na ścianie, tablica z planem treningowym
- **Studio nagrań** — mikrofon na statywie, konsoleta mikserska, piankowe panele akustyczne na ścianach, komputer, słuchawki. Rysować ręcznie na canvas: gradient metalu na mikrofonie, diody LED na interfejsie audio, gałki na konsolecie, kable. Spójne ze stylem gry, nie wrzucać fotografii.
- **Fryzjer** — fotele fryzjerskie, lustra, półki z produktami, umywalka
- **Restauracja** — stoły z krzesłami, bar, menu na ścianie, rośliny ozdobne, kasa
- **Sklep** — półki z towarem, kasa, koszyki
- **Mieszkanie gracza** — bardziej przytulne, plakaty na ścianie, dywan, lampa nocna
- **Każde pomieszczenie** — odpowiednia podłoga (kafelki w restauracji, dywan w mieszkaniu, guma w siłowni, parkiet u fryzjera)

### Zasady:
- Żadne pomieszczenie nie może mieć więcej niż 20% pustej przestrzeni
- Elementy dekoracyjne nie blokują przejścia do interakcji
- Wszystko rysowane na canvas (bez zewnętrznych assetów)
- Inspiracja: jak wygląda to miejsce w prawdziwym życiu

### Weryfikacja:
- Screenshot każdego wnętrza po zmianach
- Wejść do każdego budynku i sprawdzić wizualnie

---

## ZASADA OGÓLNA — Gra ma być mądra i logiczna

### Ta zasada tyczy się KAŻDEGO zadania. Czytaj przed implementacją.

Gra musi być spójna i logiczna — każda mechanika ma realny wpływ na inne. Nic nie istnieje w próżni. Przed dodaniem czegokolwiek zadaj sobie pytanie: "jak to wpływa na resztę gry?"

### Zmienne które MUSZĄ mieć faktyczny impact:

**G.prestige** — mnożnik do zasięgu Instagrama, lepsze oferty labelów, dostęp do Dzielnicy Dripu, wyższe zarobki z eventów, lepszy odbiór muzyki przez NPC artystów

**G.forma / G.skills.kondycja** — prędkość gracza, łatwość mini-gier na siłowni, regeneracja energii, wytrzymałość w trakcie pracy

**G.fans (casual/hardcore/haters)** — fani hardcore generują więcej streamów, haters obniżają rating postów, casual fani mogą stać się hardcore przez aktywność

**G.followers** — zasięg postów na Instagramie, oferty sponsorskie, dostęp do lepszych dystrybutorów

**G.streetRep** — jak NPC reagują na gracza na ulicy, dostęp do freestyle battli, lepsze opcje dialogowe

**G.fame** — ogólna sławność: wpływa na ceny biletów na koncerty, zainteresowanie mediów, oferty od labelów

**G.stress** — wysoki stres = gorsza jakość nagrań, wolniejszy growth, ryzyko random event (załamanie, kontuzja)

**Pora dnia** — dostępność miejsc, zarobki (nocna zmiana = więcej), jakość nagrań (cisza w nocy = lepiej)

**Jakość sprzętu** — mikrofon, interfejs, DAW, wtyczki — każdy ma liczbowy wpływ na jakość produkcji

**Poziom umiejętności** — każdy skill ma konkretny % wpływ na wynik akcji (nie tylko odblokowanie)

### Wypadkowe — przykłady logicznych połączeń:
- Wysoki prestiż + dużo followersów → oferty sponsorskie przychodzą same
- Niska kondycja + dużo pracy → stres rośnie szybciej
- Zły miks + słaby dystrybutor → mało streamów mimo dobrych fanów
- Wysoki streetRep → NPC freestyle challengers, bonus do fanów casual
- Dużo haters → algorytm Instagram obniża zasięg
- Brak snu (sleepDebt) → wolniejszy ruch, gorsze nagrania, więcej błędów w minigrach

### Zasady implementacji:
- Każda nowa mechanika MUSI połączyć się min. z 2 innymi istniejącymi systemami
- Żaden stat nie może być "dekoracyjny" — jeśli wyświetlasz wartość, musi ona na coś wpływać
- Przed dodaniem nowej zmiennej sprawdź czy istniejąca już to robi
- Testuj wypadkowe: zmień jeden stat i obserwuj co się dzieje z innymi (state.mjs)

---

## Zadanie #32 — Koncerty — minigra rytmiczna

### Filozofia:
Koncert to jedno z największych wydarzeń w grze — musi wyglądać i czuć się jak prawdziwy koncert. Minigra rytmiczna, narysowana scena, publiczność. Bramka progresji — nie każdy może grać od razu.

### Wizualne:
- Narysowana scena: podest, kurtyny, reflektory (animowane koła światła), tłum ludzi z przodu
- Gracz stoi przy mikrofonie na środku sceny (widok z boku lub z przodu)
- Tłum reaguje na jakość wykonania — "fale" rąk w górę, oklaski
- Im popularniejszy gracz → więcej ludzi na sali (50 → 500 → 5000 → arena)

### Minigra rytmiczna:
- Nuty/kółka spływają w dół (Guitar Hero / osu! styl)
- Gracz klika/wciska w odpowiednim momencie → trafienie = efekt wizualny + punkty
- Combo system — im dłuższe combo tym wyższy mnożnik zarobku
- Pudło → publiczność się krzywi, spada "hype meter"
- Pełny hype meter → "crowd goes wild" — bonus ×2 zarobku i fanów

### System progresji dla koncertów:
- Wymogi do pierwszego koncertu: Scena Lv1 + min. 50 fanów + min. Level 3
- Małe eventy (50 osób): 200–500 zł, wymogi podstawowe
- Średnie (500 osób): Scena Lv2 + 500 fanów + Level 6
- Festiwale (5000 osób): Scena Lv3 + 2000 fanów + Level 9
- Arena (50 000 osób): Scena Lv5 + własna wytwórnia lub label deal

### Efekty po koncercie:
- +fani (ilość zależna od tłumu i jakości wykonania)
- +G.fame
- +G.streetRep
- +pieniądze (zależne od rozmiaru eventu × jakość wykonania)
- +XP i skill pointy do gałęzi Scena

### Weryfikacja:
- Screenshot ekranu koncertu — scena, tłum, minigra widoczne
- Sprawdzić czy wymogi są egzekwowane
- Porównać zarobki z koncertów z innymi źródłami dochodu (state.mjs)

---

## Zadanie #31 — Instagram: załączanie piosenki do postów

### Mechanika:
Gdy gracz tworzy post na Instagramie, pojawia się opcja "Dodaj piosenkę" — dostępna tylko jeśli gracz ma minimum 1 wydany utwór na streamingach.

### Jak działa:
- Przy tworzeniu postu: przycisk "🎵 Dodaj utwór" → lista wydanych singli/albumów
- Gracz wybiera utwór do promowania
- Post z piosenką ma wyższy zasięg niż zwykły post
- Po opublikowaniu: liczba streamów wybranego utworu rośnie proporcjonalnie do followersów

### Wpływ na statystyki:
- Post bez piosenki: +followersów, +fani (jak dotychczas)
- Post z piosenką (basic): +20% streamów na Spotify/Tidal tego dnia, +5% nowych słuchaczy
- Post z piosenką + prestiż (Dzielnica Dripu): dodatkowy mnożnik ×1.5 zasięgu
- Post z piosenką + skill Autopromocja Lv3+: szansa na viral = +500% streamów jednorazowo
- Im więcej followersów → tym więcej streamów generuje post z piosenką

### Typy postów muzycznych:
- **Snippet** (fragment 15 sek) — mały boost streamów, duży boost ciekawości fanów
- **Lyric video** — wymaga: Autopromocja Lv2, boost słuchaczy +30%
- **Behind the scenes** (studio session) — boost fanów hardcore +15%
- **Cover reveal** (zapowiedź) — boost pre-save (nowa mechanika: pre-save = gwarantowane streamy w dniu premiery)

### Pre-save:
- Przed wydaniem singla gracz może wrzucić post z "Pre-save link"
- Followersi "zapisują" — w dniu premiery automatyczny stream od każdego który zapisał
- Pre-save dostępny 1-7 dni przed premierą

### Weryfikacja:
- Wydać singiel → wrzucić post z piosenką → sprawdzić G.spotify.streams w state.mjs po poście
- Sprawdzić czy prestiż i skill Autopromocja wpływają na wynik

---

## Zadanie #30 — Dystrybutorzy i wydawanie muzyki na streaming

### Filozofia:
Wrzucenie piosenki na Spotify/Tidal nie jest darmowe ani natychmiastowe. Wymaga dystrybutora, spełnienia wymogów i inwestycji. To kolejna bramka progresji.

### Dystrybutorzy (kupowane przez komputer w studio — przeglądarka):

**Tier 1 — Podstawowi dystrybutorzy (wczesna gra):**
- **DistroKid Indie** (150 zł/rok) — max 5 singli/rok, brak albumu, 80% royalties, wymogi: min. Level 2
- **TuneCore Basic** (200 zł/singiel) — nieograniczone platformy, 100% royalties, wymogi: min. Level 3

**Tier 2 — Średni dystrybutorzy (środkowa gra):**
- **CD Baby Pro** (500 zł/album) — albumy + single, sync licensing, 91% royalties, wymogi: min. 100 followersów + Level 5
- **Amuse Pro** (300 zł/rok) — nieograniczone wydania, analityki, 100% royalties, wymogi: min. 250 fanów

**Tier 3 — Premium dystrybutorzy (późna gra):**
- **Empire Distribution** (0 zł — biorą 15% royalties) — wymogi: min. 1000 fanów + 10 000 streamów
- **AWAL** (0 zł — 15%) — wymogi: min. 500 fanów hardcore + udowodniony growth
- **Własna Wytwórnia** (odblokowana przez Biznes Lv5) — 0% prowizji, 100% kontroli, wymogi: odblokowanie kariery wytwórnia

### Wymogi do wydania singla/albumu:
**Każde wydanie musi spełniać:**
- Ukończony master (zakładka MASTER w DAW) z wynikiem min. 60%
- Okładka (gracz wybiera kolor/styl — generator okładek w komputerze)
- Tytuł i metadane (gatunek, rok)
- Aktywny kontrakt z dystrybutorem

**Dodatkowe wymogi zależne od poziomu:**
- Singiel podstawowy: Level 2 + dystrybutor Tier 1
- EP (3-5 tracków): Level 5 + dystrybutor Tier 2 + min. 100 fanów
- Album (8-12 tracków): Level 8 + dystrybutor Tier 2+ + min. 500 fanów
- Platinum release: Własna wytwórnia lub label deal

### Własna Wytwórnia (Biznes Lv5):
- Gracz zakłada własny label (wybiera nazwę)
- Wydaje muzykę bez pośrednika — 100% royalties
- Może podpisywać innych artystów NPC — pasywny przychód z ich muzyki
- Wymagania: Biznes Lv5 + min. 5000 zł na koncie + min. 500 fanów + Level 7

### Streaming royalties — jak to działa:
- Po wydaniu: royalties kapią co "tydzień" gry (7 dni in-game)
- Stawki: 0.003–0.005 zł/stream (Spotify), 0.005–0.008 zł/stream (Tidal)
- Liczba streamów zależy od: jakości tracku × liczby fanów × promocji (Instagram posty)
- Dystrybutor pobiera swoją prowizję automatycznie
- Widoczne w telefonie: zakładka "Moja Muzyka" z listą wydań i statystykami

### Weryfikacja:
- Przejść przez pipeline: nagranie → miks → master → wybór dystrybutora → wydanie → royalties po tygodniu
- Sprawdzić czy wymogi są egzekwowane (gracz bez Level 2 nie może wydać)
- Sprawdzić royalties w state.mjs po upływie tygodnia in-game

---

## Zadanie #29 — Komputer w Studio + Fejkowy DAW — rozbudowana mechanika

### Komputer w Studio:
- Osobny obiekt w pokoju studia — widoczny jako monitor+klawiatura narysowany na canvas
- Gracz podchodzi i wciska E → otwiera się ekran komputera (fullscreen overlay)
- Ekran komputera: fejkowy pulpit z ikonami (DAW, przeglądarka do zakupów, może plik muzyczny)
- W przeglądarce: sklep internetowy gdzie gracz kupuje DAW (różne wersje: Basic 500zł, Pro 2000zł, Ultimate 5000zł)
- Lepsza DAW = więcej możliwości, lepsza jakość produkcji

### Fejkowy DAW — interfejs:
- Wygląda jak prawdziwy program (FL Studio / Ableton inspiracja)
- Ciemny motyw, kolorowe ścieżki, sekwencer na dole, efekty po prawej
- Zakładki: BEAT MAKER | NAGRYWANIE | MIKSER | MASTER
- Pasek narzędzi u góry: Play/Stop/Record, BPM, tonacja

### ZAKŁADKA: BEAT MAKER
**Wybór gatunku:**
Po otwarciu gracz wybiera gatunek — każdy ma inne charakterystyczne elementy:
- **Trap**: hi-haty co 1/8 z tripletami, bas 808 na 1 i 3, kick na 2 i 4, wolne BPM (130-145)
- **Boom Bap**: kick na 1 i 3, snare na 2 i 4, sample jazzowe, BPM 85-95
- **Reggaeton**: dembow rhythm (kick-snare-kick kick-snare), BPM 95-100
- **Drill**: hi-haty bardzo szybkie (triplet), bas ciężki przesunięty, BPM 140-150
- **Jersey Club**: kick co ćwierćnutę bardzo szybko, BPM 130-140
- **Jerk**: synkopa, BPM 120-130
- **Detroit**: głęboki bas, minimalistyczny, BPM 130-145

**Sekwencer:**
- Siatka 16 kroków × 8 ścieżek (kick, snare, hi-hat, 808, melody, chords, perc, fx)
- Gracz klika kratki żeby aktywować dany krok
- Każdy gatunek ma preset — wyświetla "wzorzec dla tego gatunku" jako podpowiedź
- Im bliżej wzorca dla gatunku → wyższa jakość beatu (0-100%)
- Jakość beatu = % trafnych kroków + kreatywność (losowy bonus 0-20%)
- Play button odtwarza sekwencer z efektami dźwiękowymi (Web Audio API)
- Po ułożeniu patternu: "Eksportuj beat" → zapisuje się do G.careers.beatmaker.beats
- Jakość wpływa na cenę sprzedaży

**Propozycje własne:**
- Możliwość zapisu patternu jako "mój beat #X"
- Biblioteka zapisanych beatów do ponownego użycia
- Zmienianie BPM suwaczkiem wpływa na "feeling" gatunku
- Wybór tonacji (C, Cm, G, Am itd.) wpływa na jakość melody

### ZAKŁADKA: NAGRYWANIE
**Realizacja wokalu NPC:**
- Gdy artysta NPC przychodzi do studia (zlecenie), pojawia się w oknie DAW jako "Artysta: [imię]"
- Gracz widzi: mikrofon wejściowy (poziom głosu — pasek VU meter), przycisk REC
- NPC "śpiewa" — VU meter reaguje (animacja fali dźwiękowej)
- Gracz musi:
  1. Ustawić poziom wejścia (suwak gain) żeby nie było clippingu (za głośno = czerwony)
  2. Wcisnąć REC w odpowiednim momencie (nie za wcześnie, nie za późno)
  3. Utrzymać stabilny poziom przez całe nagranie
  4. Wcisnąć STOP gdy NPC skończy
- Jakość nagrania = % czasu bez clippingu × timing startu × stabilność poziomu
- Wyższy skill Realizacji → tolerancja błędów większa, NPC "czeka" dłużej

### ZAKŁADKA: MIKSER
**Nakładanie efektów na utwór:**
- Lista ścieżek (Kick, Snare, Bass, Vocals, Melody itd.)
- Na każdej ścieżce: EQ (bass/mid/treble suwaczki), Reverb (suchy/mokry), Kompressor (attack/release), Volume, Pan (lewo/prawo)
- Gracz "nakłada efekty" — każdy efekt ma zakres "dobrych wartości" dla danego gatunku
- Im bliżej optymalnych wartości → wyższy wynik miksu (0-100%)
- Wizualizacja: waveform każdej ścieżki, animacja przy zmianie efektów
- Podpowiedzi: "Bas w trapie powinien mieć dużo kompresji"
- Po zakończeniu: wynik miksu wpływa na streaming royalties

### ZAKŁADKA: MASTER
**Finalizacja utworu:**
- Limiter (ceiling -1dB — nie przekraczaj!)
- Stereo widener
- Loudness (LUFS meter — cel: jak najgłośniej bez clippingu, mniej LUFS = głośniej)
- EQ końcowy
- Gracz musi osiągnąć jak najniższe LUFS bez clippingu → "Approved for release"
- Zły master → utwór wydany ale mniejszy zasięg

### Wtyczki (Plugins) do kupienia w sklepie online:
Poza zakupem DAW gracz może kupować wtyczki które rozszerzają możliwości i podnoszą jakość:

**Wtyczki do miksu:**
- EQ Pro (800 zł) — dokładniejszy EQ z większą liczbą pasm, +10% jakości miksu
- Compressor "Punch" (1200 zł) — lepszy kompressor, +15% do dynamiki
- Reverb "Space" (900 zł) — premium reverb, +10% do przestrzenności
- De-esser (500 zł) — usuwa syczenie z wokali, +8% jakości wokalu
- Chorus/Flanger (600 zł) — efekty modulacji, +5% kreatywności

**Wtyczki do masteringu:**
- Limiter "Loud" (1500 zł) — profesjonalny limiter, łatwiejsze osiągnięcie celu LUFS
- Stereo Imager Pro (1000 zł) — lepsze stereo, +12% do masteringu
- Multiband Compressor (2000 zł) — kontrola każdego pasma osobno, +20% jakości finału
- Tape Saturation (700 zł) — ciepłe brzmienie analogowe, +8% do odbioru u słuchaczy

**Wtyczki do beatów:**
- Sample Pack (300–800 zł/pack) — nowe dźwięki dla konkretnych gatunków
- Synth "808 Pro" (1500 zł) — lepsze brzmienie basu 808, +15% do jakości trapowych beatów
- Drum Machine Pro (1200 zł) — więcej wzorców perkusyjnych dostępnych w sekwencerze

**Mechanika wtyczek:**
- Kupione wtyczki widoczne w DAW jako nowe opcje/suwaki
- Jakość bez wtyczek: max 70% w danym obszarze
- Z odpowiednimi wtyczkami: możliwość osiągnięcia 95-100%
- Wtyczki to inwestycja długoterminowa — im lepszy zestaw tym wyższy sufit jakości

### Powiązanie z resztą gry:
- Gotowy beat → sprzedaj (NPC kupuje) lub użyj w własnym tracku
- Gotowy vokal → NPC płaci za realizację
- Gotowy miks → wydaj utwór na Spotify/Tidal/YouTube
- Jakość na każdym etapie mnoży się: beat 80% × miks 70% × master 90% = 50% jakości końcowej
- Wyższa jakość = więcej streamów, więcej fanów, lepsze oferty

### Weryfikacja:
- Przejść przez cały pipeline: beat → nagranie → miks → master → wydanie
- Sprawdzić czy jakość wpływa na zarobki (porównać state.mjs przed/po)
- Screenshot każdej zakładki DAW

---

## Zadanie #24 — Ogólny wygląd i design gry — kompleksowy audit

### Filozofia:
Wszystko w grze ma wyglądać spójnie, estetycznie i profesjonalnie. Nie ma miejsca na rozmazane napisy, płaskie prostokąty i brak detali. Gra ma być ładna.

### Obszary do poprawy:

**CZCIONKI I NAPISY:**
- Jeden spójny styl czcionki dla całej gry (nie mieszać 5 różnych fontów)
- Wzorzec: dialog z Wiktorem + napisy HUD — to jest standard jakości
- Żaden napis nie może mieć shadowBlur który go rozmywa (chyba że efekt celowy)
- Napisy na budynkach: ostre, czytelne, odpowiedni rozmiar do budynku
- Napisy UI: bold, wyraźny kontrast z tłem
- Napisy pomocnicze (instrukcje): mniejsze ale nadal czytelne
- Wszystkie polskie znaki muszą się wyświetlać poprawnie

**MAPA I TEREN:**
- Chodniki spójnej szerokości (wzorzec: okolice Sklep/Fryzjer/IKEA)
- Trawa ma mieć jakiś detal (tekstura, lekki gradient, ciemniejsze brzegi)
- Drogi z subtelną teksturą asfaltu (nie jednolity szary prostokąt)
- Pasy na drodze równe i wyraźne
- Przejścia dla pieszych równomierne i czytelne

**BUDYNKI:**
- Każdy budynek unikalny (zadanie #8) ale też ogólnie lepiej narysowany
- Okna z refleksem (mały jasny prostokąt w rogu okna)
- Drzwi wejściowe wyraźnie zaznaczone
- Szyldy czytelne i estetyczne
- Cienie pod budynkami (lekki shadowBlur od strony słońca)
- Dachy z jakimś detalem (krawędź, antena, AC)

**NPC:**
- Patrz zadanie #6 — bardziej ludzkie proporcje
- Różnorodność: różne ubrania, kolory, dodatki zimowe (to Snowy Simulator!)
- Cień pod NPC (mały owalny cień na ziemi)
- Animacja chodu płynna i naturalna

**POSTAĆ GRACZA:**
- Patrz zadania #20 i #21 — spójność z kreatorem, kolory ubrań
- Cień pod postacią
- Lepsza animacja ruchu

**POJAZDY:**
- Patrz zadanie #7 — szyby, koła, gradient karoserii
- Cień pod samochodem (owalny, ciemny)
- Różne typy aut wyraźnie różne od siebie

**HUD:**
- HUD już jest dobry ale sprawdzić czy wszystkie ikony są czytelne
- Paski statystyk z animacją przy zmianie wartości
- Powiadomienia estetyczne (nie brzydkie prostokąty)

**EFEKTY OGÓLNE:**
- Pora dnia wpływa na kolorystykę całej mapy (zadanie #30 powiązane)
- Deszcz/śnieg mają ładne efekty cząsteczkowe
- Przejścia między pomieszczeniami płynne (fade in/out)
- Każda interakcja ma krótką animację lub efekt

### Metodologia:
1. Screenshot każdego elementu osobno
2. Ocena: co wygląda źle i dlaczego
3. Poprawka
4. Screenshot porównawczy przed/po
5. Nie kończyć dopóki nie jest ładne

### Wzorce jakości w grze (już dobrze wyglądające — nie ruszać):
- Dialog z NPC Wiktor (czcionka, układ)
- Napisy HUD (health, energy, money)
- "Trzymaj SPACJĘ żeby karcherować!" — styl napisów instrukcji

---

## Zadanie #14 — Godziny otwarcia — pora dnia ma znaczenie

### Filozofia:
Pora dnia realnie wpływa na gameplay. Gracz planuje dzień — rano praca, w ciągu dnia zakupy, w nocy życie nocne. Nie wszystko dostępne zawsze.

### Harmonogram miejsc:

**Otwarte 24/7:**
- Sklep spożywczy (bo gracz musi jeść o każdej porze)
- Restauracja (zaplecze — zmywak działa na nocną zmianę)
- Myjnia samochodowa
- Mieszkanie gracza (zawsze)

**Rano/Dzień (06:00–22:00):**
- Fryzjer (06:00–20:00)
- Sklep muzyczny (09:00–21:00)
- Salon samochodowy (09:00–19:00)
- Supermarket (06:00–23:00)
- Budowlanka (07:00–18:00)
- Siłownia (06:00–23:00)
- Poczta/kurier (08:00–20:00)

**Zamknięte w nocy (22:00–06:00):**
- Fryzjer
- Sklep muzyczny
- Salon samochodowy
- Budowlanka

**Otwarte TYLKO w nocy (22:00–06:00) lub wieczór/noc:**
- Klub nocny (jeśli będzie) — tylko od 22:00
- Freestyle na ulicy działa lepiej w nocy (więcej gapiów, wyższy zarobek)
- Dzielnica Dripu — ekskluzywne eventy tylko wieczorami (18:00–02:00)

**Elastyczne (zależnie od pory):**
- Studio nagrań: najlepiej wieczór/noc (cisza, skupienie) — opcjonalnie bonus do jakości nagrania w nocy
- Pizza delivery: dostępna cały dzień ale nocne dostawy = wyższy napiwek (+50%)

### Implementacja:
- Funkcja isOpen(place, gameMin) → true/false
- Przy próbie wejścia do zamkniętego miejsca: komunikat "Zamknięte — otwarte od HH:MM"
- Budynek wizualnie różni się: w nocy zamknięty = zgaszone światła w oknach, opcjonalnie napis "CLOSED"
- Godziny widoczne na drzwiach budynku (mały napis przy wejściu)
- NPC też reagują na porę dnia — w nocy mniej na ulicy

### Weryfikacja:
- Sprawdzić każde miejsce o różnych porach (node state.mjs + screenshot)
- Fryzjer zamknięty o 23:00 — komunikat przy próbie wejścia
- Sklep 24/7 działa zawsze

---

## Zadanie #13 — Gospodarka i balans progresji

### Filozofia:
Gracz NIE może odblokować wszystkiego w kilka minut. Każda warstwa gry wymaga czasu i zaangażowania. Ekonomia musi być spójna — gracz czuje progres ale nigdy nie ma "za łatwo".

### Hierarchia dochodów (od najniższego do najwyższego):
**Tier 1 — Prace dorywcze (wczesna gra, brak wymagań):**
- Zmywak: 35–50 zł/zmiana
- Supermarket: 40–60 zł/zmiana
- Kurier: 45–70 zł/zmiana (zależy od odległości)
- Pizza: 50–80 zł/zmiana + napiwki 5–20 zł
- Budowlanka: 60–90 zł/zmiana (ciężka praca, więcej kasy)
- Myjnia: 40–65 zł/zmiana

**Tier 2 — Muzyka podstawowa (wymaga sprzętu/umiejętności):**
- Freestyle na ulicy: 10–30 zł + XP + fani
- Sprzedaż bitu (basic): 50–200 zł
- Nagranie singla i wydanie: 0 zł od razu, ale generuje streaming royalties
- Streaming royalties (Spotify/Tidal): 0.01–0.05 zł/stream, pasywnie

**Tier 3 — Usługi studyjne (wymaga studia + umiejętności):**
- Realizacja wokalu dla artysty: 150–500 zł/sesja
- Miksowanie tracku: 300–1000 zł/utwór
- Sprzedaż bitu (pro): 500–3000 zł
- Masterowanie: 500–2000 zł/utwór

**Tier 4 — Kariera muzyczna (późna gra):**
- Koncerty małe: 300–800 zł
- Koncerty średnie: 1000–5000 zł
- Kontrakty labelowe: advance 10 000–50 000 zł + tantiemy
- Własny label: pasywny przychód 500–5000 zł/dzień
- Ekskluzywne bity dla znanych: 2000–15 000 zł

### Koszty i czas do osiągnięcia celów:
- Budżetowy mikrofon (500 zł) → ~8-10 zmian dorywczych → ok. 3-4 dni gry
- Interfejs audio (1500 zł) → ~25-30 zmian → ok. 10 dni
- Studio (20 000 zł) → niemożliwe samymi pracami, wymaga muzyki
- Dzielnica Dripu (5000–15 000 zł/ubranie) → tylko dla graczy którzy "zrobili karierę"

### XP i skill pointy:
- Prace dorywcze: 5–15 XP/zmiana, 0 skill pointów
- Freestyle: 20–40 XP, 1 skill point co 5 freestyle'ów
- Nagranie tracku: 30–60 XP, 1 skill point
- Koncert: 50–150 XP, 2 skill pointy
- Level up co 100 XP → +1 skill point do drzewka

### Czas gry vs postęp:
- Dzień 1-5: gracz pracuje dorywczo, pierwszy freestyle, kupuje budżetowy mic
- Dzień 6-15: pierwsze nagrania, Instagram rośnie, kupuje interfejs
- Dzień 16-30: studio lub zlecenia, misja 1000 fanów w toku
- Dzień 30+: własne studio, label, dzielnica dripu osiągalna

### System poziomów — rosnące wymagania XP:
Obecny system (100 XP/level) jest za łatwy. Zastąpić krzywą wykładniczą:
- Level 1→2: 100 XP
- Level 2→3: 180 XP
- Level 3→4: 300 XP
- Level 4→5: 480 XP
- Level 5→6: 750 XP
- Level 6→7: 1100 XP
- Level 7→8: 1600 XP
- Level 8→9: 2200 XP
- Level 9→10: 3000 XP
- Wzór: XP_do_levelu(n) = Math.floor(100 * Math.pow(1.5, n-1))
Każdy level = +1 skill point. Wyższe levele = rzadsze odblokowania = większe poczucie osiągnięcia.

### WAŻNE — metodologia pracy nad balansem:
NIE zmieniać wartości na podstawie intuicji. Postępować tak:
1. Najpierw zmierzyć obecne wartości (node state.mjs po każdej czynności)
2. Zapisać wyniki pomiarów
3. Porównać z krzywą progresji docelową
4. Wprowadzić zmianę
5. Przetestować ponownie
6. Dopiero zacommitować gdy testy potwierdzają balans
Żadnych pochopnych decyzji — każda zmiana liczbowa musi być oparta na teście.

### Testy do przeprowadzenia:
- Zmierzyć ile trwa jedna zmiana każdej pracy (w minutach realnych)
- Sprawdzić czy wypłata = dokładnie tyle co komunikat (bug myjni!)
- Sprawdzić XP za każdą akcję i porównać z wymaganiami level up
- Sprawdzić czy drzewko umiejętności jest osiągalne w rozsądnym czasie
- Porównać ceny sklepu/sprzętu z zarobkami — czy ma sens ekonomicznie

### UWAGA OD WŁAŚCICIELA — progres ma być WOLNIEJSZY:
- Obecne propozycje wartości (zarobki, XP) są wciąż za szybkie — gracz za łatwo przechodzi przez etapy
- NIE pracuj intuicyjnie — wykonaj rzetelne testy: zmierz ile gracz zarabia i ile XP dostaje za każdą akcję
- Dopiero po pomiarach dostosuj wartości tak żeby progres był powolny, wciągający i wymagał planowania
- Gracz ma DĄŻYĆ do kolejnych etapów — każdy odblokowywany element ma być nagrodą, nie czymś oczywistym
- Jeśli coś wydaje się za łatwe do osiągnięcia — prawdopodobnie jest. Zaostrz wymagania.

---

## Zadanie #12 — Prace dorywcze — pełna przebudowa wizualna i mechaniczna

### Filozofia:
Każda praca to mini-gra, nie okienko ze średnimi obrazkami. Ma być estetyczna, angażująca, z etapami, efektami i uczuciem satysfakcji po ukończeniu.

### PIZZA (dostawa):
- Etapy: Odbiór zamówienia → Jazda do klienta → Dostawa
- Wizualne: mapa mini z punktem docelowym, gracz "jedzie" (animacja ruchu), timer
- Efekty: para z pudełka pizzy, dzwonek przy dostawie
- Im szybsza dostawa → wyższy napiwek (system tip)
- Poziomy trudności: dalsze adresy, ruch uliczny do ominięcia

### ZMYWAK (restauracja):
- Patrz zadanie #17 — sztućce, patelnia, bąbelki mydlane
- Etapy: Namaczanie → Szorowanie → Płukanie → Odkładanie
- Efekty: bąbelki mydlane unoszące się ze zlewu, para z gorącej wody
- Animacja rąk gracza szorujących naczynia
- Licznik umytych naczyń, premia za szybkość

### MYJNIA (karcher):
- Patrz zadanie #10 — 6 etapów już zaplanowanych
- Dodać: efekt piany rozchodzący się po karoserii, woda spływająca po aucie
- Wizualne: auto błyszczy bardziej po każdym etapie (gradient refleksu rośnie)
- Animacja karchera w ręku gracza

### BUDOWLANKA:
- Etapy: Kopanie fundamentów → Murowanie → Betonowanie → Wykończenie
- Wizualne: plac budowy z rusztowaniami, cegły, worek cementu
- Efekty: kurz przy kopaniu, dźwięk młota, cegły układające się w ścianę
- Minigra: kliknij w odpowiednim momencie żeby cegła idealnie padła (QTE)
- Im wyższy skill budowlanki → mniej QTE, więcej automatyki

### SUPERMARKET (kasjer):
- Etapy: Skanowanie towaru → Pakowanie → Inkasowanie
- Wizualne: taśma z produktami przesuwająca się, produkty z różnymi ikonami
- Efekty: beep skanera, animacja kasy
- Minigra: klikaj produkty w odpowiedniej kolejności, nie pomyl ceny
- Rush hour: więcej klientów = wyższy zarobek ale większy stres

### KURIER (rower/pieszo):
- Podobnie do pizzy ale paczki zamiast jedzenia
- Etapy: Odbiór paczki → Nawigacja → Dostawa → Podpis
- Wizualne: plecak z paczką na plecach gracza, mini-mapa z trasą
- Efekty: animacja wkładania paczki do skrzynki, odcisk palca przy podpisie

### ZASADY OGÓLNE dla wszystkich prac:
- Każda praca ma ekran startowy z: nazwą pracy, stawką godzinową, poziomem trudności, przyciskiem "Zacznij"
- Pasek postępu zmiany (np. "Zmiana: 2/4 zadań ukończone")
- Ekran końcowy z podsumowaniem: zarobek, bonus za jakość, XP zdobyte, skill points
- Animacje przejść między etapami (nie nagłe cięcia)
- Efekty dźwiękowe na każdej interakcji
- Wizualne tło specyficzne dla każdej pracy (nie generyczne szare okno)
- Możliwość przerwania pracy (ale bez wypłaty za niedokończoną zmianę)

### Weryfikacja:
- Screenshot każdej pracy w trakcie
- Każda praca ma min. 3 etapy i 2 efekty wizualne
- Ekran końcowy z podsumowaniem działa poprawnie
- Wypłata = dokładnie tyle ile pokazuje ekran końcowy (bug z myjnią!)

---

## Zadanie #4 — Spawn gracza przy mieszkaniu

### Problem:
Gracz respuje się przy sklepie. Powinien startować przy swoim mieszkaniu (traphouse/apartment).

### Co zrobić:
- Znaleźć pozycję mieszkania gracza na mapie (G.apartment = 'traphouse' domyślnie)
- Ustawić startową pozycję gracza P.wx/P.wy na współrzędne przed drzwiami mieszkania
- Kamera powinna też startować wycentrowana na mieszkaniu (cam.x, cam.y)
- Jeśli gracz zmienia mieszkanie (kupuje lepsze) → spawn przy nowym mieszkaniu

### Weryfikacja:
- Nowa gra → gracz stoi przed drzwiami mieszkania, nie przy sklepie

---

## Zadanie #8 — Chodniki i wyrównanie budynków do krawędzi

### Problem:
- Chodnik przy górnej części mapy jest za szeroki — ma być taki sam jak przy Sklep/Fryzjer/IKEA (te są wzorcem)
- Budynki i bloki ozdobne nie stykają się z chodnikiem — jest odstęp między chodnikiem a budynkiem/blokiem
- Nie może być żadnego odstępu: budynek/blok ma stać dokładnie przy krawędzi chodnika, nie cofnięty

### Wzorzec do naśladowania:
Sklep, Fryzjer, IKEA — chodnik odpowiedniej szerokości, budynki stykają się z nim bezpośrednio.

### Co zrobić:
- Zmierzyć szerokość chodnika przy Sklep/Fryzjer/IKEA → to jest wzorcowa szerokość
- Dostosować chodnik przy górnej części mapy do tej szerokości
- Sprawdzić WSZYSTKIE budynki i bloki na mapie — każdy musi stykać się z krawędzią chodnika bez odstępu
- Poprawić pozycje wx/wy budynków które mają odstęp od chodnika
- Spójność na całej mapie — jeden standard szerokości chodnika wszędzie

### Weryfikacja:
- Screenshot górnej części mapy + innych obszarów
- Linijka: żaden budynek nie ma odstępu od chodnika
- Chodnik wszędzie tej samej szerokości

---

## Zadanie #7 — Bloki ozdobne — rozmieszczenie, kolizje, drzewa

### Problem:
Bloki ozdobne (ciemne prostopadłościany bez funkcji, tło miejskie) są źle rozmieszczone:
- Nierówne, chaotyczne odstępy między nimi
- Niektóre są złączone ze sobą (brak odstępu)
- Na niektórych stoją drzewa (bug — drzewo na bloku)
- Brak kolizji — gracz może przez nie przechodzić

### Co zrobić:
- Znaleźć wszystkie bloki ozdobne w ROOMS (obiekty bez interakcji, tylko dekoracyjne)
- Ustawić równomierne, logiczne odstępy — bloki tworzą spójną zabudowę miejską
- Żaden blok nie może być złączony z innym (minimalny odstęp np. 16px)
- Usunąć drzewa które stoją na blokach (lub przesunąć drzewa obok)
- Dodać kolizje do bloków — gracz nie może przez nie przejść (tak jak nie może wejść w ścianę budynku)

### Weryfikacja:
- Screenshot okolic bloków — równe odstępy, brak drzew na blokach
- Test kolizji — gracz nie przechodzi przez blok
- node state.mjs — brak błędów JS

---

## Zadanie #11 — Połącz restaurację i zmywak + wygląd zmywaka

### Połączenie:
Zmywak przeniesiony do restauracji jako praca w zapleczu kuchennym.

### Wygląd zmywaka — do poprawy:
- **Napisy nieczytelne** — naprawić zgodnie z zasadami z zadania #9 (wzorzec: HUD, dialog Wiktor)
- **Dodać sztućce** — widelce, łyżki, noże leżące przy zlewie lub w pojemniku
- **Patelnia** — rączka patelni jest za blisko garnka, wygląda źle. Obrócić patelnię lub zmienić pozycję tak żeby rączka nie nachodziła na garnek. Patelnia powinna leżeć naturalnie obok garnka z rączką skierowaną na zewnątrz
- **Ogólny wygląd** — zlew bardziej realistyczny, bańki mydlane podczas mycia, ścierka, gąbka

### Weryfikacja:
- Screenshot zmywaka w trakcie pracy
- Napisy czytelne, sztućce widoczne, patelnia nie nachodzi na garnek

---

## Zadanie #11 — stare: Połącz restaurację i zmywak w jeden budynek

### Koncepcja:
Restauracja i zmywak to nie dwa osobne budynki — zmywak jest częścią restauracji (zaplecze kuchenne). Gracz wchodzi do restauracji i tam ma opcję pracy na zmywaku jako jedna z dostępnych interakcji/pracy.

### Co zrobić:
- Usunąć osobny budynek zmywaka z mapy
- W restauracji dodać opcję "Pracuj na zmywaku" obok innych interakcji
- Mechanika zmywaka pozostaje taka sama — tylko przenoszona do wnętrza restauracji
- Wnętrze restauracji powinno wizualnie odzwierciedlać że jest tam też zmywak (zaplecze)
- Zwolnione miejsce po zmywaku można przeznaczyć na coś innego lub zostawić jako przestrzeń

### Weryfikacja:
- Wejście do restauracji → widoczna opcja pracy na zmywaku
- Brak osobnego budynku zmywaka na mapie
- Mechanika zmywaka działa poprawnie z poziomu restauracji

---

## Zadanie #3 — Restauracja wystaje na chodnik

### Problem:
Budynek restauracji jest źle ustawiony — wychodzi na połowę chodnika. Budynki muszą stać za linią chodnika, nie na nim.

### Co zrobić:
- Znaleźć restaurację w ROOMS (index.html, sekcja ROOMS ~600) — szukać obiektu z etykietą restauracja/restaurant
- Sprawdzić jej wx/wy i wymiary (w/h)
- Przesunąć ją tak żeby cały budynek stał za krawędzią chodnika (nie na nim)
- Sprawdzić czy inne budynki nie mają tego samego problemu przy okazji

### Weryfikacja:
- Screenshot okolic restauracji — budynek w całości na swoim miejscu, chodnik wolny

---

## Zadanie #2 — Emoji na budynkach — jakość i rozmiar

### Problem:
Emoji na budynkach (np. ikony nad wejściami) wyglądają rozmazanie i są za małe.

### Co zrobić:
- Zwiększyć rozmiar emoji o ~30-50%
- Poprawić ostrość: przed rysowaniem emoji wyłączyć shadowBlur (ctx.shadowBlur=0), emoji nie lubią cieni — rozmazują się
- Upewnić się że font jest ustawiony precyzyjnie: `ctx.font = 'Xpx sans-serif'` bez dodatkowych efektów
- Sprawdzić funkcję drawBuilding() — tam rysowane są emoji na budynkach
- Porównać przed/po screenshotem

### Weryfikacja:
- Screenshot budynków — emoji czytelne, ostre, odpowiedni rozmiar

---

## Zadanie #1 — Zbugowane fragmenty latarni na skrzyżowaniu

### Problem:
Na skrzyżowaniu V1×H1 widoczne są dwa fragmenty latarni (słupy bez głowy). To dlatego że lamps są rozmieszczane co 400px od x=160, więc x=960 wypada dokładnie na wschodniej krawędzi V1 (768-960).

### Rozwiązanie (gotowe — tylko zaimplementować):
W funkcji drawLamps(), przed rysowaniem każdej latarni, sprawdź czy wx jest w strefie V-road (z marginesem 60px). Jeśli tak — pomiń.
```js
const vRoadZones=[[768,960],[2208,2400],[3456,3648]];
// w pętli: if(vRoadZones.some(([a,b])=>x>a-60&&x<b+60)) continue;
```
Sprawdzić też inne skrzyżowania (V2×H1, V3×H1 itd.) czy też mają ten problem.

### Weryfikacja:
Screenshot cross_v1h1.png, cross_v2h1.png — brak fragmentów latarni na skrzyżowaniach.

---

## Zadanie #5 — Obiekty nachodzące na siebie na mapie

### Problem:
Wiele obiektów na mapie nakłada się na siebie — wygląda to źle i nieprofesjonalnie.

### Zgłoszone przykłady:
- Latarnia i drzewo przy IKEA stoją jedno na drugim
- Drzewa stoją na środku chodnika przy IKEA (nie na trawniku)
- Drzewo stoi na bloku ozdobnym pod IKEA
- Prawdopodobnie podobne problemy w innych miejscach mapy

### Co zrobić:
- Przejrzeć całą mapę — wszystkie pozycje drzew, latarni, bloków ozdobnych, ławek
- Zasada: drzewa tylko na trawie/trawniku, nigdy na chodniku, drodze, bloku, latarni
- Latarnie tylko na chodniku, nigdy na trawie ani na innym obiekcie
- Zbudować system który sprawdza kolizje przy rozmieszczaniu — lub ręcznie poprawić współrzędne
- Szczególna uwaga: okolice IKEA, park, skrzyżowania

### Weryfikacja:
- Screenshot całej widocznej mapy (kilka kadrów z różnych miejsc)
- Żaden obiekt nie leży na innym

---

## Zadanie #9 — NPC blokuje interakcję z budynkiem

### Problem:
Gdy NPC stoi przy wejściu do budynku, gracz zamiast wejść do budynku łapie dialog z NPC.
Przykład: gracz chce wejść do Fryzjera ale stojący obok Wiktor przechwytuje interakcję klawiszem E.

### Rozwiązanie:
- Priorytet interakcji: budynki (wejście) mają być ważniejsze niż NPC
- Jeśli gracz jest przy drzwiach budynku → wejście do budynku ma pierwszeństwo
- NPC dialog odpala się tylko gdy gracz NIE jest przy wejściu do żadnego budynku
- Sprawdzić funkcję tryInteract() — tam jest logika kolejności interakcji
- Alternatywnie: NPC nie mogą stać bezpośrednio przy drzwiach budynków (strefa buforowa)

### Weryfikacja:
- Ustawić się przy wejściu do Fryzjera gdy Wiktor stoi obok → wcisnąć E → powinno otworzyć Fryzjera
- Sprawdzić przy innych budynkach i innych NPC

---

## Zadanie #6 — Park: pełna przebudowa

### Bugi do naprawy:
- Drzewa nachodzą na skatepark
- Staw nachodzi na skatepark
- Ławka jest zasłonięta przez drzewa
- Blok/budynek stoi w środku parku (nie powinno go tam być)
- Park jest za mały — potrzebuje więcej wolnej przestrzeni na mapie

### Co zrobić:
- Znaleźć park na mapie i sprawdzić jego aktualne współrzędne
- Zwolnić miejsce: odsunąć lub usunąć kolidujące budynki
- Powiększyć strefę parku znacznie
- Rozstawić elementy (skatepark, staw, ławka, drzewa) tak żeby nie nachodziły na siebie
- Drzewa jako naturalne obramowanie parku, nie w środku przy obiektach
- Logiczna kolejność: skatepark w jednym rogu, staw w innym, ławki przy ścieżkach, drzewa dookoła

### Napisy w parku:
- "SKATEPARK" — brzydka czcionka, rozmazana. Zastąpić lepszą.
- Wzorzec do naśladowania: dialog z "Zleceniodawca - Wiktor" — czcionka czytelna, wyraźna, świetna jakość
- Sprawdzić wszystkie inne napisy w parku i ujednolicić

### Weryfikacja:
- Screenshot parku po zmianach
- Żaden element nie nachodzi na inny
- Park wygląda jak prawdziwy park (przestronny, logicznie rozplanowany)

---

## Zadanie #10 — Myjnia: pełny remont

### Bugi krytyczne (naprawić obowiązkowo):
1. **Bug pieniędzy (NISZCZY GRĘ)** — gracz dostaje wielokrotnie więcej pieniędzy niż pokazuje komunikat. Np. wyskakuje "~40 zł" a gracz dostaje kilka tysięcy. Znaleźć i naprawić źródło błędnego mnożenia wypłaty.
2. **Bug szorowania** — wystarczy trzymać mysz w miejscu żeby etap był zaliczany. Powinno wymagać przeciągania (ruchu myszy). Naprawić detekcję ruchu.
3. **Błędna liczba etapów** — gra pokazywała 5 etapów a miała 4. Teraz ma mieć dokładnie 6.

### Nowe etapy (6 zamiast 4-5):
1. Aktywna Piana — z karchera leci piana (efekt wizualny)
2. Szorowanie — wymaga ruchu myszy (przeciąganie)
3. Mycie pod ciśnieniem
4. Spłukiwanie
5. Woskowanie
6. Nabłyszczanie

### Wizualne:
- Usunąć brzydki prostokąt wokół auta — ma być samo auto (jak na ulicy)
- Z karchera ma lecieć piana (efekt cząsteczkowy lub bąbelki)
- Napisy: "Etap", "Karcher", "PERFEKCJA" są rozmazane — naprawić (patrz zadanie #9)

### Weryfikacja po implementacji:
- Sprawdzić że gracz dostaje dokładnie tyle pieniędzy ile pokazuje komunikat
- Sprawdzić że szorowanie wymaga ruchu myszy
- Sprawdzić że jest dokładnie 6 etapów i poprawne nazwy
- Screenshot myjni + node state.mjs



Plik zawiera pełne opisy zadań z przykładami i intencją. Czytaj przed każdym zadaniem.

---

## Zadanie #33 — Siłownia: dzienny limit ćwiczeń

### Problem:
Gracz może ćwiczyć na siłowni bez końca, co psuje progresję formy i kondycji — statystyki można wbić zbyt szybko.

### Co zrobić:
- Wprowadzić dzienny limit sesji treningowych bazujący na G.day (czas w grze, nie rzeczywisty)
- Bench press ma już limit 3 serii/dzień (G._gymSets) — rozszerzyć ten system na bieżnię
- Łączny dzienny limit dla całej siłowni: np. 3 sesje łącznie (bench press + bieżnia razem)
- Przy próbie przekroczenia limitu: komunikat "Już wyćwiczyłeś dzisiaj maksimum. Wróć jutro!"
- Limit resetuje się automatycznie gdy G.day się zmienia (nowy dzień w grze)
- Limit ma sens w kontekście progresji — gracz musi planować dzień, nie może farmić formy/kondycji w kółko

### System kondycji — prędkość gracza:
- Bazowa prędkość gracza (P.spd) ma być ZMNIEJSZONA z obecnych 2.8 do ~1.8
- Kondycja (G.fitness) zdobywana na bieżni jest jedynym sposobem na zwiększenie prędkości
- Krzywa prędkości w zależności od kondycji:
  - kondycja 0 → prędkość 1.8 (wolno, odczuwalnie)
  - kondycja 25 → prędkość 2.2
  - kondycja 50 → prędkość 2.8 (obecna bazowa — osiągalna dopiero po treningu)
  - kondycja 75 → prędkość 3.2
  - kondycja 100 → prędkość 3.8 (maksimum, dla wytrenowanych graczy)
- Wzór: P.spd = 1.8 + (G.fitness / 100) * 2.0
- Prędkość aktualizowana na żywo przy każdej zmianie G.fitness
- Gracz ODCZUWA różnicę — poruszanie się po mapie na początku jest powolne, trening to nagradza

### Powiązanie z progresją:
- Forma (G.forma) i kondycja (G.fitness) mają być nagrodą za regularne granie przez wiele dni, nie za farmienie jednego dnia
- Limit wymusza powrót do siłowni kolejnego dnia — buduje nawyk i rytm gry
- Wolna bazowa prędkość = motywacja do treningu od pierwszego dnia gry

### Weryfikacja:
- Nowa gra → sprawdzić P.spd w state.mjs = 1.8
- Po treningu bieżni → sprawdzić czy P.spd wzrosła proporcjonalnie do G.fitness
- Wejść do siłowni, wykonać limit sesji → przy kolejnej próbie komunikat o limicie
- Następnego dnia (G.day++) → limit reset, można ćwiczyć znowu
- Sprawdzić że G._gymSets.day poprawnie śledzi dzień in-game

---

## ZASADA OGÓLNA — Progresja i "mądra" gra

Przy każdej zmianie pamiętaj:
- Gra ma być **mądra, logiczna i ciekawa** — każdy system musi mieć sens i realny wpływ na rozgrywkę
- **Prestiż, forma, kondycja, punkty umiejętności** mają faktyczny impact — nie są tylko cyferkami w UI
- Każda statystyka musi gdzieś "pracować": wpływać na zarobki, szybkość, jakość nagrań, odbiór fanów, dostęp do treści
- Progresja ma być odczuwalna — gracz musi czuć że rozwój postaci ma sens i prowadzi do czegoś
- Systemy mają być ze sobą powiązane — forma wpływa na prędkość, prestiż na oferty labelów, kondycja na wytrzymałość
- Nigdy nie dodawaj mechaniki bez zastanowienia jak wpasowuje się w całość progresji

---

## Zadanie #19 — Grafika (cienie, gradienty, detale)
Gra jest w 100% rysowana na Canvas. Chcemy lepszej grafiki bez pobierania zewnętrznych assetów.
Aktualny problem: wszystko jest płaskie — jednolite kolory, brak głębi, brak kontrastu między elementami.
Co konkretnie poprawić:
- shadowBlur + shadowColor na budynkach (cień rzucony na chodnik), NPCach, samochodach
- Gradienty na jezdni (ciemniejsza przy krawędzi), chodnikach (lekka tekstura), fasadach budynków
- Efekty świetlne latarni w nocy — krąg ciepłego światła na chodniku (radialGradient)
- Ogólna zasada: każdy element ma mieć minimum jeden detail który go wyróżnia wizualnie
Nie pobieramy żadnych plików — tylko canvas API.

---

## Zadanie #25 — Misja: 1000 fanów w 30 dni
Misja ma dawać fajne uczucie satysfakcji i przygody. Coś jak "Zdobądź swoje pierwsze 1000 fanów w 30 dni".
Etapy pośrednie z nagrodami: 100 fanów → nagroda, 250 → nagroda, 500 → nagroda, 1000 → wielka nagroda końcowa.
Implementacja:
- Osobny obiekt misji (nie mylić z G.dailyQuest — to jest misja główna, długoterminowa)
- Licznik dni widoczny w UI — "Dzień X/30"
- Pasek postępu fanów zawsze widoczny gdy misja aktywna
- Po 30 dniach bez 1000 fanów — game over lub kara, żeby był prawdziwy stakes
- Nagrody pośrednie: pieniądze, nowy sprzęt, odblokowanie kariery
- Uczucie przygody: przy każdym milestone animacja/fanfary, nie tylko suche dodanie liczby
- G.fans.casual + G.fans.hardcore = łączna liczba fanów do sprawdzenia
- Misja startuje automatycznie od początku gry (dzień 1)

---

## Zadanie #20 — NPC: wygląd i animacja
Aktualnie NPC to bardzo proste prostokąty z głową — brak charakteru, wszyscy wyglądają tak samo.
Co poprawić:
- Bardziej ludzkie proporcje: głowa okrągła, tułów trapezoidalny, nogi jako dwa prostokąty
- Animacja chodu: nogi naprzemiennie się poruszają synchronicznie z ruchem (używać p.anim który już istnieje)
- Zróżnicowanie: różne kolory ubrań, różne kolory skóry (już jest SKIN_COLS), różne rozmiary
- Drobne detale: twarz (oczy jako dwa małe kółka), szalik, czapka zimowa (to Snowy Simulator!)
- NPC powinni wyglądać jak mali ludzie, nie jak chodzące bloki
Nie zmieniaj logiki ruchu ani kolizji — tylko kod rysujący (drawNPC lub odpowiednik w drawCityLife)

## Zadanie #21 — Samochody: wygląd
Aktualnie samochody to prostokąty z małymi detalami — brak charakteru, wyglądają jak pudełka.
Co poprawić:
- Szyby: ciemnoniebieskie/szare prostokąty z lekkim gradientem i refleksem
- Koła: czarne kółka z szarą obręczą, widoczne z góry (top-down) jako elipsy przy bocznych krawędziach
- Karoseria: gradient na dachu (błyszcząca blacha — jaśniejszy środek, ciemniejsze boki)
- Sedan/SUV/sports mają mieć naprawdę różne sylwetki — SUV wyższy i szerszy, sports niższy i wydłużony
- Opcjonalnie: reflektory/tylne światła jako małe prostokąty w kolorze
- Nie zmieniaj logiki ruchu — tylko kod rysujący w drawCityLife (sekcja rysowania cars)

## Zadanie #22 — Budynki
"Wszystkie budynki wyglądają praktycznie tak samo. Różnią się głównie kolorem. Nie może tak być.
Budynki mają być zróżnicowane dużo bardziej aby było ciekawiej. Mają mieć różne kształty itp.
Budynki z zewnątrz i wewnątrz mają bardziej odzwierciedlać to czym są."

Intencja: IKEA wygląda jak IKEA, studio nagran jak studio, siłownia jak siłownia — nie tylko inny kolor prostokąta.

---

## Zadanie #23 — Napisy
"Wiele napisów w grze ma słabą jakość. Mamy dobre napisy takie jak np. są w Hudzie, ale napisy
na budynkach wyglądają bardzo słabo. Są takie jakby rozmazane, jakby po prostu miały niską jakość."

Złe przykłady: napisy na budynkach, "MAPA", "PERFEKCJA" (w budowie), "Etap", "Karcher" w Myjni.
Dobry wzorzec: "Trzymaj SPACJĘ żeby karcherować!" i napisy w HUD — czytelne, ostre, dobrze wystylowane.
"Zainspiruj się innymi dobrymi napisami jak np: 'Trzymaj SPACJĘ żeby karcherować!'. Te napisy są świetne."

---

## LISTA BUGÓW DO NAPRAWY

### Bug #1 — Przejścia dla pieszych (crosswalk)
**Status:** DO NAPRAWY
**Opis:** W grze przejścia dla pieszych wyglądają jak pionowe linie łączące chodnik z chodnikiem wzdłuż drogi — to zupełnie niepodobne do prawdziwego przejścia. Na referencyjnym `crosswalk.png` widać klasyczne zebry: szerokie poziome pasy biegnące W POPRZEK drogi (prostopadle do kierunku jazdy), równomiernie rozmieszczone, jasnoszare na ciemnym asfalcie. Cała logika rysowania pasów jest w złym kierunku.
**Naprawa:** Przebuduj funkcje `crosswalkV()` i `crosswalkH()` tak, żeby pasy biegły prostopadle do drogi (nie wzdłuż). Dla drogi poziomej (H-road) pasy są pionowe (stacked horizontally). Dla drogi pionowej (V-road) pasy są poziome (stacked vertically). Szerokość pasa ~14px, przerwa ~11px, kolor solidny jasnoszary `#c8c4be`. Dodaj ciemny podkład pod cały obszar przejścia.

---

### Bug #33 — System progresji: bramki, odkrywanie, drzewko jako rdzeń (WYKONAĆ PO #24 i #25)
**Status:** DO NAPRAWY
**Opis:** Gracz od początku ma dostęp do zbyt wielu rzeczy naraz. Gra powinna być odkrywana stopniowo — każdy etap odblokowuje nowy etap. Drzewko umiejętności ma być centralną mechaniką progresji, nie ozdobnikiem.
**Zasada:** Nic nie jest za darmo. Każda akcja/miejsce/praca ma wymaganie.
**Przykładowy system bramek:**

**Dzień 1 — start:**
- Dostępne: chodzenie po mapie, praca na zmywaku/pizzy, freestyle (wymaga Flow 1)
- Zablokowane: wszystko inne

**Wczesna gra (Flow 1-2, pierwsze zarobki):**
- Odblokowanie: Instagram (wymaga Autopromocja 1), siłownia (zawsze dostępna), sklep z podstawowymi ciuchami
- Freestyle odblokowany przez Flow 1 w drzewku

**Środkowa gra (Flow 3+, kilka tysięcy zł):**
- Odblokowanie: studio (zakup), nagrywanie (wymaga mic + Realizacja 1), myjnia/budowa/kurier
- Koncerty małe (wymaga Scena 1 + 100 fanów)
- Dzielnica Dripu (wymaga minimalny drip/prestiż)

**Późna gra (Flow 5, Teksty 3+, duże pieniądze):**
- Odblokowanie: DAW (zakup Mac Studio), wielkie koncerty (Scena 3+), label deals (Teksty 5)
- Własny label (Biznes 3), inwestycje (Biznes 4)

**Naprawa:** Przejrzyj KAŻDĄ akcję i miejsce w grze. Dodaj warunki dostępu (`if(!G.raperST.flow >= X) → pokaż komunikat "Odblokuj X w drzewku"`). Drzewko umiejętności musi mieć realny wpływ na to co gracz może robić — bez odpowiednich skillów część gry jest niedostępna. Powiąż z Bug #24 (drzewko) i Bug #25 (kariera rapera).

---

### Bug #32 — Testy zarobków + balans progresji (PRZEDOSTATNI KROK)
**Status:** DO NAPRAWY — wykonać przed Bug #31
**Opis:** Znany bug: myjnia pokazywała ~40 zł zarobku ale gracz dostawał kilka tysięcy — błąd w obliczaniu wypłaty. Mogą istnieć podobne bugi w innych pracach. Dodatkowo progresja finansowa wymaga zbalansowania.
**Testy do przeprowadzenia:**
- Wielokrotnie wykonaj każdą pracę (myjnia, pizza, zmywak, budowa, kurier) i zmierz faktyczny zarobek vs wyświetlany
- Sprawdź czy `G.money` rośnie o dokładnie tyle ile wyświetla komunikat
- Przetestuj wszystkie źródła dochodu: prace, koncerty, streamy, royalties, sklep, YouTube
- Sprawdź czy żadne źródło nie daje absurdalnie dużo pieniędzy przez bug
**Balans progresji (przykładowe widełki):**
- Dzień 1-5: 50-150 zł/sesja pracy → na pierwsze wyposażenie (mic 500 zł) trzeba ~5 sesji
- Dzień 5-15: 150-400 zł/sesja → studio (15 000 zł) wymaga kilku tygodni gry
- Dzień 15-30: streamy + prace → 500-1500 zł/dzień
- Późna gra: koncerty + royalties → 5 000-20 000 zł/dzień
- Drogie rzeczy (LV 8000 zł, Mac Studio 12 000 zł) mają być osiągalne ale wymagać zaangażowania
**Naprawa:** Znajdź i napraw wszystkie bugi wypłat. Dostosuj wartości zarobków we wszystkich pracach i źródłach dochodu do powyższych widełków.

---

### Bug #31 — Ogólna estetyka: gra ma być ładna i "żywa" (OSTATNI KROK)
**Status:** DO NAPRAWY — wykonać jako ostatnie, po naprawieniu wszystkich poprzednich bugów
**Opis:** Po naprawieniu wszystkich bugów — końcowy pass estetyczny. Gra ma wyglądać ładnie i sprawiać wrażenie żywego miasta.
**Propozycje "żywości":**
- Losowe animacje NPC (zatrzymują się, rozglądają, gestykulują)
- Ptaki/gołębie latające nad mapą
- Chmury przesuwające się po niebie (jeśli jest niebo w tle)
- Liście/śmieci unoszone wiatrem na ulicy
- Migające neony na budynkach nocą
- Przechodnie wchodzący/wychodzący z budynków
- Auta zatrzymujące się na czerwonym świetle (interakcja z sygnalizacją)
- Efekty pogodowe bardziej widoczne (deszcz odbijający się od asfaltu, kałuże)
- Drzewa lekko kołyszące się na wietrze
- Ambient: tłum w tle przy popularnych miejscach
**Estetyka mapy:**
- Spójna paleta kolorów dla każdej dzielnicy
- Cienie budynków dopasowane do pory dnia
- Chodniki z subtelnymi detalami (plamy, pęknięcia, wzory)
- Oświetlenie nocne — latarnie rzucają krąg światła na ziemię

---

### Bug #30 — Ogólny polish: UI, minigry, overlaye — wszystko ma być ładniejsze
**Status:** DO NAPRAWY
**Opis:** Wszystkie okienka, minigry i interakcje wymagają ogólnego polishu wizualnego. Dotyczy: prac (budowa, zmywak, myjnia, pizza, kurier), YouTube/Instagram overlay, DAW, sklepy, telefon, overlaye kariery — dosłownie wszystkiego co gracz widzi i robi.
**Propozycje ulepszeń do wdrożenia:**
- Animacje wejścia/wyjścia overlayów (fade-in, slide-in zamiast nagłego pojawienia)
- Przyciski z hover effects, ripple effect przy kliknięciu
- Pasek postępu z animacją fill zamiast skokowej zmiany
- Efekty cząsteczkowe przy sukcesie (confetti, iskry, błysk)
- Dźwiękowe/wizualne potwierdzenie każdej akcji gracza (flash koloru, shake przy błędzie)
- Liczniki z animacją roll-up przy zmianie wartości (pieniądze, fani, XP)
- Tło overlayów z subtelnym gradientem/wzorem zamiast jednolitego ciemnego
- Ikony i emoji większe, wyraźniejsze, z cieniem dla głębi
- Sekcje oddzielone eleganckimi separatorami z akcentowym kolorem
- Minigry: wyraźniejszy feedback (co poszło dobrze, co źle), animacja combo/streak
- YouTube overlay: animowane wykresy, efekt "uploading", progress bar nagrania
- Ogólnie: spójny design system — jeden styl dla wszystkich elementów gry
**Naprawa:** Przejdź przez KAŻDE okienko i minigaminę. Dla każdego dodaj min. 2-3 ulepszenia wizualne z powyższej listy. Implementuj własne pomysły jeśli pasują do klimatu gry.

---

### Bug #29 — Praca Budowa: brak możliwości cofnięcia/poprawy belki
**Status:** DO NAPRAWY
**Opis:** Jeśli gracz umieści belkę za wysoko, nie ma żadnej opcji cofnięcia, poprawy ani przesunięcia. Jedyne wyjście to opuszczenie i ponowne wejście do pracy. To blokuje gracza i psuje UX.
**Naprawa:** Dodaj możliwość cofnięcia ostatniej akcji (np. klawisz Z lub przycisk "Cofnij") który usuwa ostatnio położoną belkę i pozwala ją położyć ponownie. Ewentualnie pozwól na chwytanie i przesuwanie już położonych elementów zanim się "zablokują".

---

### Bug #28 — Praca Myjnia: przycisk "Zacznij" nie działa
**Status:** DO NAPRAWY
**Opis:** Minigra Myjni jest kompletnie zepsuta — po naciśnięciu "Zacznij" nic się nie dzieje. Minigra się nie uruchamia.
**Naprawa:** Znajdź handler przycisku "Zacznij" w minigamce myjni. Sprawdź czy funkcja startująca minigaminę jest poprawnie podpięta, czy nie ma błędu JS który blokuje uruchomienie (sprawdź konsolę). Upewnij się że wszystkie zmienne są zainicjowane przed startem.

---

### Bug #27 — Minigra Zmywak: sztućce nachodzą na płyn, kran bez funkcji
**Status:** DO NAPRAWY
**Opis:** Dwa problemy w minigamce zmywaka:
- Sztućce (cutlery) nakładają się graficznie na płyn do naczyń — kolizja elementów UI
- Jest kran z którego leci woda ale nie robi niczego — nie ma żadnego wpływu na przebieg minigry (dekoracja bez funkcji)
**Naprawa:** Popraw pozycje sztućców żeby nie nachodziły na płyn. Albo nadaj kranowi funkcję (np. trzeba go odkręcić żeby zacząć myć, lub woda przyspiesza mycie), albo usuń animację wody jeśli kran ma pozostać dekoracją — nie może wyglądać jak funkcjonalny element który nic nie robi.

---

### Bug #26 — Osierocony NPC "Praca" przy Ubrania
**Status:** DO NAPRAWY
**Opis:** Obok budynku "Ubrania" stoi NPC który wyświetla prompt "Praca" — ale żadnej pracy tam nie ma. Prawdopodobnie pozostałość po połączeniu zmywaka z restauracją — NPC nie został usunięty.
**Naprawa:** Znajdź w ROOMS.ulica.objects NPC przy współrzędnych blisko budynku "Ubrania" z `act` powiązanym z pracą/zmywakiem. Usuń go jeśli nie pełni żadnej funkcji.

---

### Bug #25 — Kariera Rapera: niewidoczna/niezaimplementowana
**Status:** DO NAPRAWY
**Opis:** Kariera Rapera z Zadania #27 nie jest widoczna w grze. `G.careers.raper` istnieje w kodzie ale progresja i UI nie działają.
**Wymagania (z Zadania #27):**
- Poziomy kariery: Początkujący → Underground → Rising → Known → Famous → Legend
- Progresja przez: freestyle na ulicy, nagrywanie tracków w studio, wydawanie singli/albumów, koncerty
- Każdy poziom odblokowuje nowe możliwości: lepsze studio, większe koncerty, label deals
- Powiązanie z G.fans, G.followers, G.spotify, G.yt
- Widoczny postęp kariery w UI (telefon lub overlay) — aktualny poziom, XP do następnego, co się odblokuje
**Naprawa:** Sprawdź obecny stan `G.careers.raper` w kodzie. Podłącz akcje (freestyle, nagrywanie, koncerty) do przyrostu XP kariery. Zaimplementuj awanse poziomów z konkretnymi odblokowanymi możliwościami. Dodaj widoczny panel kariery rapera w telefonie lub overlayach.

---

### Bug #24 — Drzewko umiejętności: niewidoczne zmiany, brak mechaniki, brak wpływu na grę
**Status:** DO NAPRAWY
**Opis:** Zmiany w drzewku umiejętności z Zadania #27 nie są widoczne w grze. Drzewko ma być **fajną, ciekawą i rozbudowaną mechaniką** z realnym wpływem na progresję. Nie może być tylko ozdobnikiem.
**Wymagania:**
- Umiejętności mają się **łączyć ze sobą** — żeby odblokować wyższą umiejętność, trzeba mieć niższą (np. Teksty wymaga Flow 2, Scena wymaga Flow 3 + 500 fanów, Mikser wymaga DAW + Realizacja 2 itd.)
- Każda umiejętność i każdy poziom ma mieć **opis co konkretnie gracz dostaje** za dodanie punktu
- Każdy skill ma realny efekt na grę (prędkość, jakość tracków, zarobki, streamy, dostęp do miejsc/akcji)
- UI: węzły połączone liniami, zablokowane=szare, dostępne=świecące, aktywne=złote, tooltip z opisem, licznik skill pointów u góry
- Skill pointy zdobywane przez: freestyle, nagrywanie, koncerty, levelowanie
**Gałęzie (z Zadania #27):** FLOW, TEKSTY (wymaga Flow 2), PRODUKCJA (wymaga studio+MIDI), REALIZACJA (wymaga mic+interfejs), MIKSER (wymaga DAW+Realizacja 2), AUTOPROMOCJA, BIZNES (wymaga Autopromocja 2), SCENA (wymaga Flow 3+500 fanów), KONDYCJA (wymaga bieżni)
**Szczegółowe opisy każdego poziomu każdej gałęzi — patrz Zadanie #27 w NOTATKI.md (linie 90–161)**

---

### Bug #23 — Freestyle minigra: dostęp bez odblokowania + zepsuta mechanika + nowy design
**Status:** DO NAPRAWY
**Opis (3 problemy):**
- Freestyle na ulicy jest dostępny od razu bez żadnych wymagań — powinien wymagać odblokowania w drzewku umiejętności (np. skill "flow" poziom 1 lub podobny).
- Obecna minigra jest zepsuta — można spamować spację bez żadnego rytmu i wygrać. Brak prawdziwej mechaniki.
- Nowa mechanika: gracz musi **przepisywać słowa** które pojawiają się na ekranie. Słowa wyskakują jedno po drugim, gracz wpisuje je na klawiaturze, im szybciej i poprawniej — tym lepszy wynik freestyle'u.
**Naprawa:**
1. Dodaj warunek dostępu: sprawdź `getRaperST('flow') >= 1` (lub odpowiedni skill) przed uruchomieniem minigry.
2. Przeprojektuj minigaminę: wyświetlaj losowe słowa/rymy jedno po drugim, gracz wpisuje je przez klawiaturę. Punktacja za szybkość + poprawność. Timer całości np. 30s. Im więcej słów przepisanych poprawnie i szybko → wyższy wynik → więcej XP/fanów.

---

### Bug #22 — Freestyle spot: złe miejsce i niedziałająca interakcja
**Status:** DO NAPRAWY
**Opis:** Różowe kółko z mikrofonem (freestyle_spot) pojawia się obok IKEA — złe umiejscowienie. Dodatkowo interakcja `[E] Freestyle na ulicy` nie działa (nic się nie dzieje po naciśnięciu E).
**Naprawa:** Przesuń freestyle_spot w sensowne miejsce na mapie (park, rejon skateparku lub osobny kąt ulicy — nie przy IKEA). Sprawdź czy `act:'freestyle'` jest obsługiwane w `handleAct` — jeśli nie, podłącz do istniejącej minigry freestyle'u. Powiększ strefę interakcji (w, h) freestyle_spot — aktualnie jest za mała (`w:80, h:60`), trzeba bardzo precyzyjnie podejść żeby prompt się pokazał. Zwiększ do co najmniej `w:120, h:100` lub więcej.

---

### Bug #21 — Kompleksowy audyt mapy: umiejscowienie budynków, bloków, drzew, latarni
**Status:** DO NAPRAWY
**Opis:** Cała mapa wymaga kompleksowego przeglądu i poprawienia układu. Konkretne problemy:
- Budynki i bloki nie łączą się z chodnikiem ze wszystkich stron — np. IKEA łączy się od góry (dobrze) ale nie od boku (źle). Widać trawę w szparach.
- Bloki są krzywo ustawione względem siebie — pod Salą Koncertową i Targiem dwa rzędy bloków mają różne odstępy od chodnika (pierwszy rząd większy, drugi mniejszy). Muszą być równo.
- Latarnie i drzewa w złych miejscach (powiązane z Bug #10, #13, #17).
- Całość ma wyglądać jak prawdziwe miasto.
**WAŻNE:** NIE zmieniaj rozmiaru chodników. Dopracuj tylko pozycje (wx, wy) i rozmiary (w, h) budynków/bloków.
**Naprawa:** Zrób wiele screenshotów całej mapy (różne obszary). Przejrzyj każdy blok zabudowy. Ustaw budynki tak żeby: (1) przylegały do chodnika z każdej strony bez przerwy, (2) były w równych odstępach od siebie w rzędach, (3) tworzyły spójny miejski układ. Sprawdź szczególnie rejon Sali Koncertowej i Targu. Przed zakończeniem zrób ponowne screenshoty i zweryfikuj każdy rejon mapy.

---

### Bug #20 — Budowa: przycisk "Porzuć" nie zamyka okienka + brak awaryjnego zamknięcia
**Status:** DO NAPRAWY
**Opis:** Na minigamce budowy przycisk "Porzuć" nie zamknął okienka — gracz chodzi po mapie z otwartym overlayem którego nie może zamknąć. To poważny bug blokujący grę.
**Naprawa (dwa kroki):**
1. Napraw przycisk "Porzuć" w minigamce budowy — upewnij się że wywołuje `closeOverlay()` lub właściwe zamknięcie wszystkich aktywnych paneli.
2. Przetestuj WSZYSTKIE inne okienka/overlaye w grze (siłownia, studio, sklepy, telefon, DAW, pizza, zmywak itd.) — każdy przycisk "wyjdź/zamknij/porzuć" musi działać.
3. Dodaj globalny mechanizm awaryjnego zamknięcia: klawisz **Escape** zamyka KAŻDE aktywne okienko/overlay/minigame. Jeden handler `keydown` dla `Escape` który zamyka wszystko co jest aktualnie otwarte.

---

### Bug #19 — NPC chodzą po jezdni
**Status:** DO NAPRAWY
**Opis:** NPC poruszają się po jezdni — nie chodzi o przechodzenie przez ulicę (to jest ok), ale o zwykłe chodzenie wzdłuż drogi jak po chodniku. NPC powinni chodzić tylko po chodnikach i terenach zielonych.
**Naprawa:** Sprawdź logikę pathfindingu/wędrówki NPC. Trasy spacerowe NPC muszą być ograniczone do obszarów poza jezdnią. Dodaj sprawdzanie czy punkt docelowy NPC nie leży na drodze — jeśli tak, wybierz inny punkt. Ewentualnie zdefiniuj strefy dozwolone dla NPC (chodniki, parki) i losuj cele tylko z tych stref.

---

### Bug #18 — Kolor koszulki z kreatora postaci nie widoczny w grze
**Status:** DO NAPRAWY
**Opis:** Przy tworzeniu postaci gracz wybiera kolor koszulki (np. zielony) ale w grze postać nie ma tego koloru — koszulka jest niewidoczna lub ma domyślny kolor. Wybór z kreatora nie jest przekazywany do renderowania postaci.
**Naprawa:** Sprawdź gdzie kolor koszulki jest zapisywany przy tworzeniu postaci (kreator → G.cloth lub podobne pole). Następnie sprawdź funkcję rysującą gracza (drawPlayer) — upewnij się że używa `G.cloth` jako koloru tułowia. Możliwe że kolor jest zapisywany pod inną nazwą niż ta której szuka drawPlayer.

---

### Bug #17 — Prawa dolna część mapy: latarnie na trawie, auta na chodniku
**Status:** DO NAPRAWY
**Opis:** Prawa dolna część mapy jest zbugowana na kilka sposobów:
- Latarnie stoją na trawie zamiast na chodniku
- Auta wjeżdżają w chodnik i tam znikają
- Auta pojawiają się (spawn) na chodniku i zaczynają stamtąd jechać
Wszystkie te elementy powinny być tylko na drodze/w prawidłowych miejscach.
**Naprawa:** Sprawdź pozycje latarni w prawym dolnym rogu mapy — przesuń je na chodnik. Sprawdź logikę spawnu i trasy aut (`cars` array, spawn points, waypoints) w tej części mapy — upewnij się że trasy aut przebiegają tylko przez jezdnię, a punkty startowe (spawn) są na drodze, nie na chodniku.

---

### Bug #16 — Witryny sklepów Dzielnicy Dripu zasłaniają nazwy
**Status:** DO NAPRAWY
**Opis:** W `drawLuxuryBuilding()` witryna sklepowa (show-window prostokąt) jest rysowana na tej samej pozycji co nazwa marki — zasłania napis lub nakłada się na niego, co wygląda brzydko.
**Naprawa:** Przeprojektuj układ fasady: nazwa marki na górze budynku (wyraźnie widoczna), witryna poniżej nazwy — albo zrezygnuj z witryny jako osobnego prostokąta i zamiast tego użyj jej jako tła pod nazwą. Kolejność rysowania: najpierw witryna, potem napis na wierzchu z pełną czytelnością.

---

### Bug #15 — Dzielnica Dripu: interakcja ze sklepem od złej strony
**Status:** DO NAPRAWY
**Opis:** Sklepy w Dzielnicy Dripu mają punkt interakcji (prompt [E]) od strony trawy zamiast od strony chodnika. Gracz musi wchodzić od tyłu budynku żeby zobaczyć prompt wejścia.
**Naprawa:** Sprawdź obiekty sklepów w ROOMS.ulica.objects — pole `act` / strefa interakcji jest po złej stronie. Przesuń punkt interakcji (lub odwróć orientację obiektu) tak żeby prompt pojawiał się od strony chodnika, czyli od strony ulicy.

---

### Bug #14 — Dzielnica Dripu: sklepy za małe i za ciasno
**Status:** DO NAPRAWY
**Opis:** Sklepy w Dzielnicy Dripu są za małe i stłoczone. Powinny być 2× większe i rozłożone po obu stronach ulicy: 4 sklepy po lewej stronie, 4 sklepy po prawej stronie.
**Naprawa:** Znajdź obiekty sklepów Dzielnicy Dripu w ROOMS.ulica.objects. Podwój ich wymiary (w, h). Rozłóż 4 sklepy po jednej stronie ulicy i 4 po drugiej stronie — z równymi odstępami, przylegające do chodnika, bez ciasnego skupiska.

---

### Bug #13 — Tabliczka "Dzielnica Dripu" na chodniku
**Status:** DO NAPRAWY
**Opis:** Tabliczka/napis "Dzielnica Dripu" wystaje na połowę chodnika — jest źle umiejscowiona. Przy okazji w tym samym miejscu widać drzewa stojące na chodniku (powiązane z Bug #10).
**Naprawa:** Znajdź obiekt/napis "Dzielnica Dripu" w ROOMS.ulica.objects lub w kodzie rysującym. Przesuń go tak żeby w całości znajdował się poza chodnikiem — np. przy ścianie budynku lub na terenie zielonym. Przy okazji usuń drzewa które stoją na chodniku w tym rejonie.

---

### Bug #12 — Wizualne bloki bez kolizji
**Status:** DO NAPRAWY
**Opis:** Dekoracyjne/wizualne bloki na mapie (niefunkcyjne prostokąty tworzące zabudowę) nie mają kolizji — gracz może przez nie przechodzić. Wcześniej było to zgłaszane i nie zostało naprawione.
**Naprawa:** Każdy wizualny blok w ROOMS.ulica.objects który ma `solid:true` lub powinien blokować ruch musi być uwzględniony w systemie kolizji. Sprawdź funkcję kolizji gracza (checkCollision lub podobną) — upewnij się że iteruje po wszystkich obiektach z flagą blokującą ruch, nie tylko po budynkach z interakcją.

---

### Bug #11 — Park: za mały, zdublowany staw, złe napisy, drzewa na atrakcjach
**Status:** DO NAPRAWY
**Opis (5 problemów):**
- Park jest za mały — powinien być ok. 5× większy. Trzeba zwolnić miejsce usuwając niepotrzebne "niefunkcyjne" bloki wizualne z mapy.
- Park ma zdublowany staw: jest niebieski kwadrat na środku ORAZ bardziej okrągły staw w lewym górnym rogu parku. Usunąć niebieski kwadrat — zostawić tylko okrągły staw.
- Drzewa w parku nachodzą na Breakdance i Skatepark — nie może tak być.
- Napis "B BOY" zmienić na "Breakdance".
**Naprawa:** Powiększ obszar parku na mapie (rozszerz granice). Usuń bloki niefunkcyjne które zajmują miejsce. Usuń zdublowany staw (niebieski kwadrat). Przesuń/usuń drzewa które kolidują z Breakdance/Skatepark. Zmień label "B BOY" → "Breakdance" w ROOMS.ulica.objects lub w miejscu gdzie jest rysowany napis.

---

### Bug #10 — Drzewa na chodnikach, budynkach i latarniach
**Status:** DO NAPRAWY
**Opis:** Drzewa są rozmieszczone losowo i nachodzą na chodniki, budynki i latarnie. Drzewa mogą stać TYLKO na wolnej przestrzeni (trawa/zieleń między blokami zabudowy). Nie na chodnikach, nie na drogach, nie na budynkach, nie na latarniach.
**Naprawa:** NIE generuj drzew losowo. Przeskanuj całą mapę i zdefiniuj ręcznie (lub przez whitelist stref) dozwolone obszary dla drzew — tylko tereny zielone między budynkami. Stwórz listę konkretnych pozycji drzew (wx, wy) które NIE kolidują z: obiektami w ROOMS.ulica.objects (budynki, latarnie), chodnikami (sidewalk strips), drogami (road bands), Breakdance, Skatepark. Każda pozycja drzewa musi być zweryfikowana względem tych stref przed umieszczeniem. Drzewa NIE mogą stać na budynkach/blokach.

---

### Bug #9 — Szpary między budynkami a chodnikiem + krzywe rozmieszczenie bloków
**Status:** DO NAPRAWY
**Opis:** Budynki/bloki są krzywo rozmieszczone na mapie — nierówne odstępy, nie przylegają do chodników, widać szpary przez które prześwituje trawa. Przykład: między dolnym chodnikiem a IKEA jest przerwa. Bloki nie są w równych odstępach względem siebie.
**WAŻNE:** NIE zmieniaj rozmiaru chodników. Napraw tylko pozycje i rozmiary budynków/bloków.
**Naprawa:** Sprawdź współrzędne (wx, wy, w, h) każdego budynku w ROOMS.ulica.objects. Dopasuj je tak żeby: (1) każdy budynek dokładnie przylegał do chodnika bez przerwy, (2) bloki były równo rozmieszczone względem siebie, (3) nie było widocznych luk z trawą między budynkiem a chodnikiem. Zmieniaj tylko wx/wy/w/h budynków, nie dotykaj geometrii chodników.

---

### Bug #8 — Zdublowane chodniki w wielu miejscach
**Status:** DO NAPRAWY
**Opis:** W kilku miejscach na mapie widać podwójne chodniki — jeden przed budynkiem (poprawny) i dodatkowy za budynkiem lub obok (błędny). Potwierdzone lokalizacje: górna część mapy, przy "Ubrania", przy "Salon Aut". Każde miejsce powinno mieć tylko jeden chodnik.
**Naprawa:** Znajdź kod rysujący chodniki w drawCity/drawMap. Sprawdź czy chodnik nie jest rysowany dwa razy — raz jako część układu ulic i raz jako margines budynków. Przeskanuj całą mapę screenshotami i usuń wszystkie duplikaty chodników.

---

### Bug #7 — Emoji z czarnym tłem i rozmazane
**Status:** DO NAPRAWY
**Opis:** Emoji rysowane na canvasie (na budynkach, mapie itp.) mają czarne tło i są rozmazane. Emoji w HUD (HTML) wyglądają perfekcyjnie — ostre, bez tła. Emoji w grze mają wyglądać DOKŁADNIE jak emoji w HUD.
**Wzorzec:** Emoji w HUD są zwykłym tekstem HTML — brak canvas, brak shadowBlur, brak żadnego tła.
**Naprawa:** Znajdź wszystkie miejsca gdzie emoji są rysowane przez canvas `fillText`. Przed każdym: `X.shadowBlur=0; X.shadowColor='transparent'; X.globalCompositeOperation='source-over'`. Usuń wszelkie `fillRect` rysowane przed emoji jako "tło". Sprawdź czy `imageSmoothingEnabled=false` jest ustawione. Celem: emoji identyczne wizualnie z tymi w HUD — ostre, bez tła, czyste.

---

### Bug #6 — Złe napisy (rozmyte, rozjechane, tanie)
**Status:** DO NAPRAWY
**Opis:** Wiele napisów w grze wygląda słabo — rozmyte, rozjechane, rozpikselowane. Przykłady: "PERFEKCJA", "MAPA", wszystkie nazwy budynków/sklepów/skatepark itp. Dobry wzorzec to napis "Połóż cegłę!" z minigry budowy — ostry, wyraźny, czytelny. WSZYSTKIE złe napisy mają wyglądać jak "Połóż cegłę!".
**Wzorzec dobrego napisu ("Połóż cegłę!" styl):** Znajdź w kodzie jak rysowany jest napis "Połóż cegłę!" i użyj dokładnie tego samego podejścia (font, shadowBlur=0, strokeText jako kontur, fillText na wierzchu) dla wszystkich innych napisów.
**Naprawa:** Zrób wiele screenshotów różnych części gry. Znajdź KAŻDY napis rysowany przez canvas `fillText`/`strokeText`. Porównaj z wzorcem. Zamień wszystkie złe napisy na styl "Połóż cegłę!". Przed zakończeniem zrób ponowne screenshoty i sprawdź że żaden zły napis nie pozostał. Nie pomijaj niczego: MAPA, PERFEKCJA, nazwy budynków, sklepu, skateparku, parku, każda etykieta na mapie, napisy w minigamkach (np. "talerz", "Garnek", "Patelnia" w zmywaku są złe — "Zmywak - Myj naczynia" jest dobre; "DOCELOWE MIEJSCE" w budowie jest złe — "Plac Budowy" jest dobre), pasek misji głównej (słaba czcionka — poprawić razem z naprawianiem nakładania z Questem z Bug #2a).

---

### Bug #5 — Budynki wyglądają jak bloki mieszkalne
**Status:** DO NAPRAWY
**Opis:** Praktycznie każdy budynek w grze ma siatkę okien z losowo zapalonymi/zgaszonymi światłami — jak typowy blok mieszkalny. Sklep, fryzjer, IKEA, studio — wszystkie wyglądają tak samo. Sklep ma być biały i bez okien (lub z witrynami sklepowymi, nie oknami mieszkalnymi). Każdy budynek powinien wizualnie odzwierciedlać swoje przeznaczenie.
**Naprawa:** Znajdź funkcję rysującą budynki (drawBuildings lub rysowanie w drawCityLife). Dla każdego typu budynku zdefiniuj indywidualny wygląd: sklep = biała fasada, witryny sklepowe lub brak okien, szyldy; IKEA = niebieski prostokąt z żółtym logiem, bez okien mieszkalnych; fryzjer = charakterystyczna barberska kolorystyka. Usuń generyczny kod losowych okien dla budynków usługowych/handlowych.

---

### Bug #4 — Wygląd gracza: twarz za nisko + złe fryzury
**Status:** DO NAPRAWY
**Opis:** Kilka problemów z wyglądem postaci gracza:
- Oczy i uśmiech są za nisko — siedzą na tułowiu zamiast na głowie. Twarze chodzących NPC wyglądają dobrze — wzoruj się na ich proporcjach.
- Fryzura "długa" dosięga do ziemi — jest wielokrotnie za długa.
- Fryzura "krótka" wygląda jak czapka, nie jak włosy.
- Dredy wyglądają jakby wystawały z czapki, a nie jak naturalne dredy.
**Naprawa:** Znajdź funkcję rysującą gracza (drawPlayer). Porównaj kod rysowania twarzy gracza z kodem NPC — przenieś oczy/usta wyżej na głowę. Skróć fryzurę długą drastycznie (powinna sięgać max do ramion). Przeprojektuj fryzurę krótką żeby leżała na głowie jak włosy. Popraw dredy żeby wychodziły z głowy naturalnie, nie z czapki.

---

### Bug #2 — HUD (4 pod-bugi)
**Status:** DO NAPRAWY
**Opis czterech problemów:**

**2a) Nowy pasek misji zakryty przez Quest:**
Funkcja `drawMissionBar()` rysuje pasek na canvas na pozycji `by=66`. Element HTML `#hquest` ma `position:absolute; top:66px` — nachodzą dokładnie na siebie. Pasek misji nie jest widoczny.
**Naprawa:** Przesuń `by` w `drawMissionBar()` na ok. `by=88` LUB przesuń `#hquest` niżej. Lepiej przesuń pasek misji niżej, np. `by=90`, żeby był pod questem.

**2b) Pogoda + telefon nachodzą na siebie:**
`#hphone` ma `position:absolute; right:14px` — wyciągnięty z normalnego flow HUD. Elementy `hweath` (pogoda) rysują się obok i nachodzą na przycisk telefonu.
**Naprawa:** Ustaw `padding-right` HUD na tyle żeby telefon się nie nakładał, lub zmień układ — np. `right:120px` dla telefonu.

**2c) Pieniądze i fani za małe + emoji pieniędzy ucięte:**
Elementy z pieniędzmi i fanami w HUD mają `font-size` ustawiony za mały w stosunku do pozostałych elementów HUD. Dodatkowo emoji 💰 przy pieniądzach jest ucięte — nie wyświetla się w całości.
**Naprawa:** Sprawdź i zwiększ font-size dla `#hmoney` i `#hfans` do ok. 18–20px. Napraw ucięcie emoji — prawdopodobnie `overflow:hidden` lub za małe `height` na elemencie rodzicu. Dodaj `overflow:visible` i odpowiedni `line-height`.

**2d) Luka między HUD a górą przeglądarki:**
`body` ma `display:flex; justify-content:center; align-items:center` co powoduje że canvas jest wyśrodkowany a nad HUD-em pojawia się pusta przestrzeń.
**Naprawa:** Zmień `align-items` na `flex-start` lub dodaj `margin-top:0` do `#hud`.

---

### Bug #3 — NPC (2 pod-bugi)
**Status:** DO NAPRAWY
**Opis dwóch problemów:**

**3a) Ciągła zmiana koloru ubioru/czapki:**
NPC-e co klatkę zmieniają kolor ubrania i czapki — miga to co chwilę. Prawdopodobna przyczyna: kolory NPC są losowane przy każdym wywołaniu funkcji rysowania zamiast być przypisane do każdego NPC raz na stałe przy jego tworzeniu.
**Naprawa:** Upewnij się, że każdy obiekt NPC ma `clothColor`, `hatColor`, `skinColor` itp. przypisane przy tworzeniu (np. w funkcji spawnNPC/initNPC) i nie są re-losowane przy każdym `draw`.

**3b) Nogi NPC obok postaci zamiast pod:**
Nogi NPC rysują się z przesunięciem poziomym — widać je obok ciała, nie pod nim. Prawdopodobna przyczyna: błędne współrzędne X przy rysowaniu nóg w funkcji rysującej NPC.
**Naprawa:** Sprawdź offset X nóg w funkcji rysującej NPC i ustaw je centralnie pod ciałem (`cx` zamiast `cx ± offset`).
