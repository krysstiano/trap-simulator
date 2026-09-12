/* ===================================================================
   PDF v2.3.140 U6 - wybor jezyka strony (PL / EN)
   „proponuje, aby na aktualnej stronie domeny gry Trap Simulator byla wdrozona funkcja,
    dostepna za pomoca przycisku w rogu strony, odwolujaca sie do zmiany jezyka strony
    na jezyk angielski tak jak ma to miejsce w grze ze zmiana jezykowa."

   Dzialanie jest takie samo jak w grze: przycisk w rogu, zmiana od razu, wybor zapamietany.
   Napisy podmieniamy w wezlach tekstowych i atrybutach, a oryginal chowamy w data-pl,
   zeby powrot do polskiego byl dokladny. Tresci doladowywane pozniej (historia aktualizacji)
   lapie obserwator zmian DOM.
   =================================================================== */
(function () {
  'use strict';

  var KEY = 'ts_site_lang';
  var EN = {
    /* ── nawigacja i nagłówek ── */
    'Funkcje': 'Features',
    'Zrzuty': 'Screenshots',
    'Co nowego': 'What’s new',
    'FAQ': 'FAQ',
    '⬇ Pobierz': '⬇ Download',
    'Windows · macOS · Linux': 'Windows · macOS · Linux',
    'TRAP SIMULATOR - start': 'TRAP SIMULATOR - home',
    'Nawigacja główna': 'Main navigation',

    /* ── hero ── */
    'Od ulicy do sławy - zbuduj imperium.': 'From the street to fame - build your empire.',
    'Polski symulator kariery rapera i ulicznego biznesu. Koncerty, trasy, albumy, radio i streaming, kasyno, dzielnice miasta, telefon z aplikacjami i własny biznes - wszystko w jednej grze 2D.':
      'A rapper career and street business simulator. Concerts, tours, albums, radio and streaming, a casino, city districts, a phone full of apps and your own business - all in one 2D game.',
    'Pobierz na Windows': 'Download for Windows',
    'Zagraj w przeglądarce': 'Play in your browser',
    'Zagraj w przeglądarce - bez pobierania': 'Play in your browser - no download',
    'Wszystkie wersje / changelog': 'All versions / changelog',
    '💻 Windows 10/11 · ~166 MB · instalacja jednym klikiem ·': '💻 Windows 10/11 · ~166 MB · one-click install ·',
    'macOS i Linux - wkrótce': 'macOS and Linux - coming soon',
    'Zagraj od razu w przeglądarce': 'Play right away in your browser',
    '- bez pobierania. Zapis trzymany lokalnie w przeglądarce; pełną, najszybszą wersję z zapisem na dysku daje instalator.':
      '- no download. Your save stays in the browser; the installer gives you the full, fastest version with the save on your disk.',
    'Gra zawiera symulowany hazard, fikcyjne używki, tematykę uliczną i wulgarny język. To fikcja - wewnątrzgrowa „waluta hazardu" nie ma realnej wartości.':
      'The game contains simulated gambling, fictional substances, street themes and strong language. It is fiction - the in-game “gambling currency” has no real value.',

    /* ── zwiastun ── */
    '🎬 Zobacz grę w akcji': '🎬 See the game in action',
    'Od ulicy, przez studio i scenę, po kasyno i własne imperium.': 'From the street, through the studio and the stage, to the casino and your own empire.',
    'Kliknij - zwiastun z muzyką': 'Click - trailer with music',
    'Kliknij, by obejrzeć zwiastun z dźwiękiem.': 'Click to watch the trailer with sound.',
    'Gra w akcji': 'The game in action',
    'Odtwórz zwiastun z muzyką': 'Play the trailer with music',
    'Zwiastun TRAP SIMULATOR': 'TRAP SIMULATOR trailer',
    'Zamknij': 'Close',

    /* ── pasek info i statystyki ── */
    'Informacje o instalacji': 'Installation details',
    'rozmiar instalatora': 'installer size',
    'Zapis lokalny': 'Local save',
    'gra działa offline': 'the game works offline',
    'Polski język': 'Polish language',
    'w całości': 'in full',
    'Gra w liczbach': 'The game in numbers',
    'aktualizacji': 'updates',
    'dzielnice miasta': 'city districts',
    'po polsku': 'in Polish',
    'tylko dla dorosłych': 'adults only',

    /* ── funkcje ── */
    'Co znajdziesz w grze': 'What you get in the game',
    'Jedna gra, dziesiątki systemów - od sceny po ulicę.': 'One game, dozens of systems - from the stage to the street.',
    'Kariera muzyczna': 'Music career',
    'Koncerty, trasy, albumy, radio i streaming. Zbieraj fanów, nagrywaj hity i piecz się na szczyt list przebojów.':
      'Concerts, tours, albums, radio and streaming. Gather fans, record hits and climb to the top of the charts.',
    'Kasyno': 'Casino',
    'Sloty, ruletka, blackjack i autorskie gry losowe. Symulowany hazard - wyłącznie dla zabawy, bez prawdziwych stawek.':
      'Slots, roulette, blackjack and original games of chance. Simulated gambling - for fun only, with no real stakes.',
    'Dzielnice miasta': 'City districts',
    'Eksploruj Underground, Business i nadmorską Marina Coast - pływanie, jachty i imprezy na wodzie. Każda dzielnica to nowe miejsca, postacie i okazje.':
      'Explore Underground, Business and the seaside Marina Coast - swimming, yachts and parties on the water. Every district brings new places, characters and opportunities.',
    'Telefon i aplikacje': 'Phone and apps',
    'Instagram, bank, sejf, komunikatory i wewnątrzgrowe apki - zarządzaj życiem i karierą prosto z kieszeni.':
      'Social media, a bank, a safe, messengers and in-game apps - run your life and career straight from your pocket.',
    'Ekwipunek i biznes': 'Inventory and business',
    'Przedmioty, ulepszenia, pracownicy i własny (fikcyjny) biznes uliczny z całą ekonomią pod spodem.':
      'Items, upgrades, staff and your own (fictional) street business with a full economy underneath.',
    'Częste aktualizacje': 'Frequent updates',
    'Setki poprawek i nowości napędzanych opiniami beta-testerów. Sprawdź sekcję „Co nowego" niżej.':
      'Hundreds of fixes and additions driven by beta tester feedback. Check the “What’s new” section below.',

    /* ── zrzuty ── */
    'Zrzuty ekranu': 'Screenshots',
    'Rzut oka na świat gry.': 'A glimpse of the game world.',
    'Kliknij zrzut, aby powiększyć · strzałki ← → do przewijania': 'Click a screenshot to enlarge · arrows ← → to browse',
    'Podgląd zrzutu ekranu': 'Screenshot preview',
    'Poprzedni': 'Previous',
    'Następny': 'Next',
    'Powiększ: Mieszkanie - wnętrze traphouse': 'Enlarge: Apartment - inside the traphouse',
    'Powiększ: Studio nagrań - mikser i produkcja': 'Enlarge: Recording studio - mixer and production',
    'Powiększ: Kasyno - piętro high-roller': 'Enlarge: Casino - the high-roller floor',
    'Powiększ: Park miejski - życie ulicy': 'Enlarge: City park - street life',
    'Powiększ: Miasto - sklepy i sala koncertowa': 'Enlarge: The city - shops and the concert hall',
    'Powiększ: Ulica - usługi i kariera': 'Enlarge: The street - services and career',
    'Powiększ: Marina Coast - nadmorska dzielnica, łodzie i jachty': 'Enlarge: Marina Coast - the seaside district, boats and yachts',
    'Mieszkanie - wnętrze traphouse': 'Apartment - inside the traphouse',
    'Studio nagrań - mikser i produkcja': 'Recording studio - mixer and production',
    'Kasyno - piętro high-roller': 'Casino - the high-roller floor',
    'Park miejski - życie ulicy': 'City park - street life',
    'Miasto - sklepy i sala koncertowa': 'The city - shops and the concert hall',
    'Ulica - usługi i kariera': 'The street - services and career',
    'Marina Coast - nadmorska dzielnica: łodzie, jachty i imprezy na wodzie': 'Marina Coast - the seaside district: boats, yachts and parties on the water',

    /* ── historia aktualizacji ── */
    'Historia aktualizacji TRAP SIMULATOR. Najnowsze na górze.': 'TRAP SIMULATOR update history. Newest on top.',
    'Szukaj w aktualizacjach': 'Search the updates',
    'Szukaj w aktualizacjach…': 'Search the updates…',
    'Filtruj po typie zmiany': 'Filter by change type',
    'Wczytywanie aktualizacji…': 'Loading updates…',
    'Pokaż więcej': 'Show more',
    'Brak wpisów pasujących do wybranych filtrów.': 'No entries match the selected filters.',
    'Nie udało się wczytać listy aktualizacji.': 'Could not load the update list.',
    'Strona została otwarta bezpośrednio z dysku, więc przeglądarka blokuje wczytanie danych. Uruchom ją przez serwer lub hosting.':
      'The page was opened straight from disk, so the browser blocks the data request. Serve it over a local server or hosting.',
    'Spróbuj odświeżyć stronę za chwilę.': 'Try refreshing the page in a moment.',
    'Szybki sposób (w folderze website): ': 'Quick way (in the website folder): ',
    'lub': 'or',
    'Wszystkie': 'All',
    'Wyświetlono ': 'Showing ',
    ' pasujących wpisów (na ': ' matching entries (out of ',
    ' łącznie).': ' total).',
    'zgłoszone przez beta-testera': 'reported by a beta tester',
    'zgłoszone przez ': 'reported by ',
    /* etykiety typow zmian */
    'Poprawka': 'Fix', 'Krytyczne': 'Critical', 'Nowość': 'New', 'Dodane': 'Added',
    'Balans': 'Balance', 'Treść': 'Content', 'UX': 'UX', 'Wizualne': 'Visual', 'Szlif': 'Polish',
    'System': 'System', 'Pod maską': 'Under the hood', 'Optymalizacja': 'Optimisation',
    'Rozgrywka': 'Gameplay', 'Zmiana': 'Change', 'Audyt': 'Audit', 'Info': 'Info',

    /* ── FAQ ── */
    'Najczęstsze pytania': 'Frequently asked questions',
    'Zanim pobierzesz - szybkie odpowiedzi.': 'Before you download - quick answers.',
    'Windows pokazuje ostrzeżenie przy instalacji - czy gra jest bezpieczna?': 'Windows shows a warning during install - is the game safe?',
    'Tak. Ostrzeżenie „Windows ochronił Twój komputer" (SmartScreen) pojawia się, bo instalator nie ma jeszcze płatnego certyfikatu wydawcy - pracujemy nad tym. Kliknij':
      'Yes. The “Windows protected your PC” (SmartScreen) warning shows up because the installer does not have a paid publisher certificate yet - we are working on it. Click',
    '„Więcej informacji" → „Uruchom mimo to"': '“More info” → “Run anyway”',
    '. Gra nie zawiera złośliwego oprogramowania, a kod jest publiczny na GitHubie.': '. The game contains no malware and the code is public on GitHub.',
    'Czy gra jest darmowa?': 'Is the game free?',
    'Tak, w całości za darmo. Bez mikropłatności i bez prawdziwego hazardu - wewnątrzgrowa „waluta hazardu" nie ma realnej wartości i niczego nie wypłaca.':
      'Yes, completely free. No microtransactions and no real gambling - the in-game “gambling currency” has no real value and pays out nothing.',
    'Wolę nie pobierać - da się zagrać od razu?': 'I would rather not download - can I play right away?',
    'Tak - kliknij': 'Yes - click',
    '„▶ Zagraj w przeglądarce"': '“▶ Play in your browser”',
    'na górze strony. Wersja przeglądarkowa trzyma zapis lokalnie w przeglądarce. Wersja do pobrania działa szybciej i zapisuje grę na dysku (przeżywa czyszczenie przeglądarki).':
      'at the top of the page. The browser version keeps your save in the browser. The downloadable version runs faster and stores the save on your disk (it survives clearing the browser).',
    'Gdzie zapisuje się postęp i czy przetrwa aktualizację?': 'Where is progress saved and does it survive an update?',
    'W wersji do pobrania zapis trzymany jest lokalnie na Twoim komputerze i': 'In the downloadable version the save is kept locally on your computer and',
    'przeżywa aktualizacje oraz odinstalowanie': 'survives updates and uninstalling',
    '. Gra aktualizuje się automatycznie do najnowszej wersji.': '. The game updates itself automatically to the newest version.',
    'Jakie są wymagania i platformy?': 'What are the requirements and platforms?',
    'Windows 10/11 (64-bit), ~166 MB, instalacja jednym klikiem. Działa offline. Wersje macOS i Linux - wkrótce. Gra jest po polsku.':
      'Windows 10/11 (64-bit), ~166 MB, one-click install. Works offline. macOS and Linux versions - coming soon. The game is in Polish.',

    /* ── stopka ── */
    '- Gra zawiera symulowany hazard, fikcyjne używki, przemoc i tematykę uliczną oraz wulgarny język.':
      '- The game contains simulated gambling, fictional substances, violence, street themes and strong language.',
    'To fikcja. Gra': 'This is fiction. The game',
    'nie oferuje prawdziwego hazardu': 'does not offer real gambling',
    'ani nie wypłaca żadnych nagród pieniężnych - wewnątrzgrowa waluta nie ma realnej wartości.':
      'and pays out no money prizes - the in-game currency has no real value.',
    '⬇ Pobierz grę (Windows)': '⬇ Download the game (Windows)',
    'Polityka prywatności i regulamin': 'Privacy policy and terms',
    'TRAP SIMULATOR. Wszelkie prawa zastrzeżone.': 'TRAP SIMULATOR. All rights reserved.',

    /* ── tytul strony ── */
    'TRAP SIMULATOR - Od ulicy do sławy | Polski symulator rapera 18+': 'TRAP SIMULATOR - From the street to fame | Rapper career simulator 18+',
  };

  var ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];

  function get() {
    try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'pl'; } catch (e) { return 'pl'; }
  }
  function set(l) {
    try { localStorage.setItem(KEY, l); } catch (e) { }
  }

  function tr(t) {
    var k = String(t == null ? '' : t).trim();
    if (!k) return null;
    return Object.prototype.hasOwnProperty.call(EN, k) ? EN[k] : null;
  }

  /* Podmiana w jednym wezle tekstowym. Oryginal chowamy na rodzicu w data-pl<n>. */
  function applyNode(n, toEn) {
    var raw = n.nodeValue || '';
    var t = raw.trim();
    if (!t) return;
    if (toEn) {
      var en = tr(t);
      if (en == null || en === t) return;   /* identyczne tlumaczenie = brak zmiany (inaczej petla) */
      if (!n.__pl) n.__pl = raw;
      var nv = raw.replace(t, en);
      if (nv === raw) return;
      n.nodeValue = nv;
    } else if (n.__pl != null && n.nodeValue !== n.__pl) {
      n.nodeValue = n.__pl;
    }
  }

  function applyEl(el, toEn) {
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute || !el.hasAttribute(a)) return;
      var v = el.getAttribute(a);
      if (toEn) {
        var en = tr(v);
        if (en == null || en === v) return;
        if (!el.hasAttribute('data-pl-' + a)) el.setAttribute('data-pl-' + a, v);
        el.setAttribute(a, en);
      } else if (el.hasAttribute('data-pl-' + a)) {
        var pl = el.getAttribute('data-pl-' + a);
        if (pl !== v) el.setAttribute(a, pl);
      }
    });
  }

  function applyTree(root, toEn) {
    if (!root) return;
    if (root.nodeType === 3) { applyNode(root, toEn); return; }
    if (root.nodeType !== 1) return;
    if (/SCRIPT|STYLE/.test(root.tagName)) return;
    applyEl(root, toEn);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      if (n.parentElement && /SCRIPT|STYLE/.test(n.parentElement.tagName)) continue;
      applyNode(n, toEn);
    }
    var els = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (var i = 0; i < els.length; i++) applyEl(els[i], toEn);
  }

  function applyAll(lang) {
    var toEn = lang === 'en';
    applyTree(document.body, toEn);
    document.documentElement.setAttribute('lang', toEn ? 'en' : 'pl');
    if (!document.title.__pl) {
      var ten = tr(document.title);
      if (toEn && ten) { document.head.__plTitle = document.head.__plTitle || document.title; document.title = ten; }
    }
    if (!toEn && document.head.__plTitle) document.title = document.head.__plTitle;
    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.textContent = toEn ? 'PL' : 'EN';
      btn.setAttribute('aria-label', toEn ? 'Zmień język na polski' : 'Switch the page language to English');
      btn.setAttribute('title', toEn ? 'Polski' : 'English');
    }
  }

  window.siteLang = get();
  window.siteIsEn = function () { return window.siteLang === 'en'; };
  window.setSiteLang = function (l) {
    window.siteLang = (l === 'en') ? 'en' : 'pl';
    set(window.siteLang);
    applyAll(window.siteLang);
    document.dispatchEvent(new CustomEvent('sitelangchange', { detail: { lang: window.siteLang } }));
  };

  function init() {
    var btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', function () { window.setSiteLang(window.siteLang === 'en' ? 'pl' : 'en'); });
    applyAll(window.siteLang);
    /* tresci doladowywane pozniej (historia aktualizacji, filtry) */
    /* Obserwator nie moze reagowac na zmiany, ktore SAM wywolal - inaczej wpis, ktorego
       tlumaczenie brzmi tak samo (np. „FAQ"), zapetla strone na amen. */
    var busy = false;
    var mo = new MutationObserver(function (muts) {
      if (window.siteLang !== 'en' || busy) return;
      busy = true;
      try {
        muts.forEach(function (m) {
          for (var i = 0; i < m.addedNodes.length; i++) applyTree(m.addedNodes[i], true);
          if (m.type === 'characterData') applyNode(m.target, true);
        });
      } finally {
        mo.takeRecords();
        busy = false;
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
