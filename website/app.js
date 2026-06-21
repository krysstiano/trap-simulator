/* ===================================================================
   TRAP SIMULATOR — landing page logic
   - reveal-on-scroll
   - patch notes: fetch + render (paginated), search, type filter
   Bezpieczeństwo: opisy z patchnotes.json renderujemy przez textContent
   (NIGDY innerHTML z surowych danych) — chroni przed XSS i łamaniem HTML.
   =================================================================== */
(function () {
  'use strict';

  /* ---------- rok w stopce ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- reveal-on-scroll ---------- */
  (function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ===================================================================
     PATCH NOTES
     =================================================================== */
  var PAGE_SIZE = 15;

  var listEl = document.getElementById('pnList');
  var loadingEl = document.getElementById('pnLoading');
  var moreBtn = document.getElementById('pnMore');
  var metaEl = document.getElementById('pnMeta');
  var searchEl = document.getElementById('pnSearch');
  var filtersEl = document.getElementById('pnFilters');

  // Czytelne polskie etykiety dla typów (klucz = surowa wartość item.t / kategorii)
  var TYPE_LABELS = {
    fix: 'Poprawka', bugfix: 'Poprawka', critical: 'Krytyczne',
    feature: 'Nowość', 'new': 'Nowość', add: 'Dodane',
    balance: 'Balans', balans: 'Balans', rebalance: 'Balans',
    content: 'Treść',
    ux: 'UX', visual: 'Wizualne', polish: 'Szlif',
    system: 'System', refactor: 'Pod maską', optimization: 'Optymalizacja',
    gameplay: 'Rozgrywka', change: 'Zmiana', audit: 'Audyt', info: 'Info'
  };

  // Beta-testerzy — subtelny podpis
  var BETA_TESTERS = { Vegan: true, Amper: true };

  var ALL = [];          // wszystkie wpisy (z patchnotes.json)
  var FILTERED = [];     // po filtrach
  var shown = 0;         // ile aktualnie wyrenderowanych
  var activeFilter = ''; // '' = wszystkie
  var query = '';

  function labelFor(t) {
    if (!t) return 'Zmiana';
    var key = String(t).toLowerCase();
    return TYPE_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));
  }
  function tagClass(t) {
    var key = String(t || '').toLowerCase().replace(/[^a-z]/g, '');
    return 'tag tag-' + key;
  }

  /* ---------- budowa pojedynczego wpisu (bez innerHTML z danych) ---------- */
  function buildEntry(entry) {
    var art = document.createElement('article');
    art.className = 'pn-entry';

    var head = document.createElement('div');
    head.className = 'pn-entry-head';

    var ver = document.createElement('span');
    ver.className = 'pn-ver';
    ver.textContent = entry.ver || '—';
    head.appendChild(ver);

    if (entry.date) {
      var date = document.createElement('span');
      date.className = 'pn-date';
      date.textContent = entry.date;
      head.appendChild(date);
    }

    if (entry.reporter) {
      var rep = document.createElement('span');
      rep.className = 'pn-reporter';
      rep.textContent = BETA_TESTERS[entry.reporter]
        ? 'zgłoszone przez beta-testera'
        : ('zgłoszone przez ' + entry.reporter);
      head.appendChild(rep);
    }

    art.appendChild(head);

    if (entry.title) {
      var title = document.createElement('h3');
      title.className = 'pn-title';
      title.textContent = entry.title;
      art.appendChild(title);
    }

    var items = Array.isArray(entry.items) ? entry.items : [];
    if (items.length) {
      var ul = document.createElement('ul');
      ul.className = 'pn-items';
      items.forEach(function (it) {
        if (!it) return;
        var li = document.createElement('li');
        li.className = 'pn-item';

        var tag = document.createElement('span');
        tag.className = tagClass(it.t);
        tag.textContent = labelFor(it.t);
        li.appendChild(tag);

        var p = document.createElement('p');
        p.textContent = it.d != null ? String(it.d) : '';
        li.appendChild(p);

        ul.appendChild(li);
      });
      art.appendChild(ul);
    }

    return art;
  }

  /* ---------- filtrowanie ---------- */
  function entryMatches(entry) {
    // filtr po typie: wpis pasuje, jeśli jakikolwiek item ma ten typ
    if (activeFilter) {
      var has = (entry.items || []).some(function (it) {
        return it && String(it.t || '').toLowerCase() === activeFilter;
      });
      if (!has) return false;
    }
    // wyszukiwarka tekstowa
    if (query) {
      var hay = entry._search || '';
      if (hay.indexOf(query) === -1) return false;
    }
    return true;
  }

  function applyFilters() {
    FILTERED = ALL.filter(entryMatches);
    shown = 0;
    listEl.innerHTML = '';
    renderNextPage();
    updateMeta();
  }

  function renderNextPage() {
    var frag = document.createDocumentFragment();
    var end = Math.min(shown + PAGE_SIZE, FILTERED.length);
    for (var i = shown; i < end; i++) {
      frag.appendChild(buildEntry(FILTERED[i]));
    }
    listEl.appendChild(frag);
    shown = end;

    if (FILTERED.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'pn-empty';
      empty.textContent = 'Brak wpisów pasujących do wybranych filtrów.';
      listEl.appendChild(empty);
    }
    moreBtn.hidden = shown >= FILTERED.length;
  }

  function updateMeta() {
    var total = ALL.length;
    var f = FILTERED.length;
    if (activeFilter || query) {
      metaEl.textContent = 'Wyświetlono ' + Math.min(shown, f) + ' z ' + f +
        ' pasujących wpisów (na ' + total + ' łącznie).';
    } else {
      metaEl.textContent = 'Wyświetlono ' + Math.min(shown, f) + ' z ' + total + ' aktualizacji.';
    }
  }

  /* ---------- chipy filtrów ---------- */
  function buildFilters() {
    // policz typy występujące w danych, posortuj po częstości
    var counts = {};
    ALL.forEach(function (e) {
      (e.items || []).forEach(function (it) {
        if (it && it.t) {
          var k = String(it.t).toLowerCase();
          counts[k] = (counts[k] || 0) + 1;
        }
      });
    });
    var types = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });

    function makeChip(value, text) {
      var b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = text;
      b.setAttribute('aria-pressed', value === activeFilter ? 'true' : 'false');
      b.addEventListener('click', function () {
        activeFilter = (activeFilter === value) ? '' : value;
        Array.prototype.forEach.call(filtersEl.children, function (c) {
          c.setAttribute('aria-pressed', c === b && activeFilter === value ? 'true' : 'false');
        });
        // re-sync "Wszystkie"
        if (allChip) allChip.setAttribute('aria-pressed', activeFilter === '' ? 'true' : 'false');
        applyFilters();
      });
      return b;
    }

    var allChip = makeChip('', 'Wszystkie');
    allChip.setAttribute('aria-pressed', 'true');
    filtersEl.appendChild(allChip);

    types.forEach(function (t) {
      filtersEl.appendChild(makeChip(t, labelFor(t)));
    });
  }

  /* ---------- wyszukiwarka (debounce) ---------- */
  function initSearch() {
    var timer = null;
    searchEl.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        query = searchEl.value.trim().toLowerCase();
        applyFilters();
      }, 180);
    });
  }

  /* ---------- przygotowanie indeksu wyszukiwania ---------- */
  function prepare(data) {
    ALL = data.map(function (e) {
      var parts = [e.ver, e.date, e.title, e.reporter];
      (e.items || []).forEach(function (it) { if (it) { parts.push(it.t); parts.push(it.d); } });
      e._search = parts.filter(Boolean).join(' ').toLowerCase();
      return e;
    });
  }

  /* ---------- start ---------- */
  moreBtn.addEventListener('click', renderNextPage);

  fetch('patchnotes.json', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      if (!Array.isArray(data)) throw new Error('Nieprawidłowy format danych');
      if (loadingEl) loadingEl.remove();
      prepare(data);
      // Dynamiczny badge wersji — zawsze najnowszy wpis (nigdy się nie zestarzeje).
      var _topVer = (data[0] && data[0].ver) ? data[0].ver : null;
      if (_topVer) { var _vb = document.querySelectorAll('.badge-ver'); for (var _i = 0; _i < _vb.length; _i++) _vb[_i].textContent = _topVer; }
      buildFilters();
      initSearch();
      applyFilters();
    })
    .catch(function (err) {
      if (loadingEl) loadingEl.remove();
      var box = document.createElement('div');
      box.className = 'pn-error';

      var h = document.createElement('strong');
      h.textContent = 'Nie udało się wczytać listy aktualizacji.';
      box.appendChild(h);

      var p = document.createElement('p');
      // Najczęstsza przyczyna: otwarcie przez file:// blokuje fetch().
      var isFile = location.protocol === 'file:';
      p.textContent = isFile
        ? 'Strona została otwarta bezpośrednio z dysku, więc przeglądarka blokuje wczytanie danych. Uruchom ją przez serwer lub hosting.'
        : 'Spróbuj odświeżyć stronę za chwilę.';
      box.appendChild(p);

      if (isFile) {
        var tip = document.createElement('p');
        tip.style.marginTop = '.6rem';
        tip.appendChild(document.createTextNode('Szybki sposób (w folderze website): '));
        var code = document.createElement('code');
        code.textContent = 'npx --yes serve';
        tip.appendChild(code);
        tip.appendChild(document.createTextNode(' lub '));
        var code2 = document.createElement('code');
        code2.textContent = 'python -m http.server';
        tip.appendChild(code2);
        box.appendChild(tip);
      }

      // debug w konsoli, nie dla użytkownika
      if (window.console) console.warn('patchnotes load error:', err);

      listEl.appendChild(box);
      moreBtn.hidden = true;
      metaEl.textContent = '';
    });
})();

/* ===================== LIGHTBOX ZRZUTOW ===================== */
(function () {
  var imgs = [
    { src: 'screeny/01-mieszkanie.png', cap: 'Mieszkanie — wnętrze traphouse' },
    { src: 'screeny/02-studio.png',     cap: 'Studio nagrań — mikser i produkcja' },
    { src: 'screeny/03-kasyno.png',     cap: 'Kasyno — piętro high-roller' },
    { src: 'screeny/04-park.png',       cap: 'Park miejski — życie ulicy' },
    { src: 'screeny/05-miasto.png',     cap: 'Miasto — sklepy i sala koncertowa' },
    { src: 'screeny/06-ulica.png',      cap: 'Ulica — usługi i kariera' }
  ];
  var lb = document.getElementById('lb');
  if (!lb) return;
  var lbImg = document.getElementById('lbImg'), lbCounter = document.getElementById('lbCounter');
  var cur = 0;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    lbImg.style.backgroundImage = "url('" + imgs[cur].src + "')";
    lbImg.setAttribute('aria-label', imgs[cur].cap);
    lbCounter.textContent = (cur + 1) + ' / ' + imgs.length + ' — ' + imgs[cur].cap;
  }
  function open(i) { show(i); lb.hidden = false; lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function close() { lb.hidden = true; lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  document.querySelectorAll('.shot[data-i]').forEach(function (b) {
    b.addEventListener('click', function () { open(parseInt(b.getAttribute('data-i'), 10) || 0); });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
  });
})();

/* ---------- v2.3.46: hero neon skyline (canvas) ---------- */
(function heroSkyline() {
  var cv = document.getElementById('hero-skyline');
  if (!cv || !cv.getContext) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = cv.getContext('2d'), raf = 0, t = 0, layers = [], stars = [], ember = [];
  var neon = ['#f1c40f', '#e91e8c', '#7ec8e3', '#9b59b6'], cols = ['#0a1430', '#0d1a3d', '#11224e'];
  function build() {
    cv.width = cv.offsetWidth || cv.parentElement.offsetWidth; cv.height = cv.offsetHeight || cv.parentElement.offsetHeight;
    layers = []; stars = []; ember = [];
    for (var L = 0; L < 3; L++) { var b = [], x = -60, maxH = cv.height * (0.18 + L * 0.12); while (x < cv.width + 90) { var w = 34 + Math.random() * 76, h = maxH * (0.45 + Math.random() * 0.75); b.push({ x: x, w: w, h: h, seed: Math.floor(Math.random() * 97) }); x += w + 6 + Math.random() * 16; } layers.push({ b: b, col: cols[L] }); }
    for (var i = 0; i < 60; i++) stars.push({ x: Math.random(), y: Math.random() * 0.6, s: Math.random() * 1.5 + 0.4, p: Math.random() * 6.28 });
    for (var j = 0; j < 26; j++) ember.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vy: -(0.2 + Math.random() * 0.7), r: Math.random() * 2 + 0.5, a: Math.random() });
  }
  build();
  function draw() {
    t++; var W = cv.width, H = cv.height, base = H, k, s, ly, bld, cx, cy, e;
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(7,10,24,0)'); g.addColorStop(1, '#070a18'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (k = 0; k < stars.length; k++) { s = stars[k]; var tw = 0.5 + 0.5 * Math.sin(t * 0.04 + s.p); ctx.fillStyle = 'rgba(180,210,255,' + (0.1 + tw * 0.4) + ')'; ctx.fillRect(s.x * W, s.y * H, s.s, s.s); }
    for (var li = 0; li < layers.length; li++) { ly = layers[li]; for (var bi = 0; bi < ly.b.length; bi++) { bld = ly.b[bi]; ctx.fillStyle = ly.col; ctx.fillRect(bld.x, base - bld.h, bld.w, bld.h);
      var cc = Math.max(2, Math.floor(bld.w / 12)), rr = Math.max(3, Math.floor(bld.h / 16));
      for (cx = 0; cx < cc; cx++) for (cy = 0; cy < rr; cy++) { if (((cx * 7 + cy * 13 + bld.seed) % 5) === 0) { var tw2 = 0.4 + 0.6 * Math.sin(t * 0.06 + cx + cy + bld.x); ctx.fillStyle = neon[(cx + cy + bld.seed) % neon.length]; ctx.globalAlpha = 0.2 + tw2 * 0.5; ctx.fillRect(bld.x + 6 + cx * 12, base - bld.h + 8 + cy * 16, 4, 5); ctx.globalAlpha = 1; } } } }
    for (k = 0; k < ember.length; k++) { e = ember[k]; e.y += e.vy; e.a -= 0.003; if (e.y < 0 || e.a <= 0) { e.y = H + 5; e.x = Math.random() * W; e.a = 0.5 + Math.random() * 0.4; } ctx.fillStyle = 'rgba(241,196,15,' + (Math.max(0, e.a) * 0.5) + ')'; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.fill(); }
    raf = requestAnimationFrame(draw);
  }
  draw();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200); });
})();

/* Zwiastun: w sekcji gra wyciszona pętla-teaser (gameplay-preview.webm, MediaRecorder → duration=Infinity,
   zapętlamy ręcznie). Klik → lightbox: wideo + film.mp3 startują RAZEM (sync 155 BPM), zapętlane razem. */
(function trailer() {
  var teaser = document.querySelector('.trailer-vid');
  if (teaser) {
    teaser.addEventListener('ended', function () { try { teaser.currentTime = 0; teaser.play(); } catch (e) {} });
    teaser.play && teaser.play().catch(function () {});
    document.addEventListener('click', function () { if (teaser.paused) teaser.play().catch(function () {}); }, { once: true });
  }
  var open = document.getElementById('trailerOpen'), vlb = document.getElementById('vlb');
  var vid = document.getElementById('vlbVideo'), aud = document.getElementById('vlbAudio'), closeBtn = document.getElementById('vlbClose');
  if (!open || !vlb || !vid || !aud) return;
  function syncStart() { try { vid.currentTime = 0; aud.currentTime = 0; } catch (e) {} var p = aud.play(); if (p && p.catch) p.catch(function () {}); vid.play().catch(function () {}); }
  function openLb() {
    vlb.hidden = false; vlb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    try { teaser && teaser.pause(); } catch (e) {}
    syncStart();
  }
  function closeLb() {
    vlb.hidden = true; vlb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    try { vid.pause(); aud.pause(); aud.currentTime = 0; } catch (e) {}
    try { teaser && teaser.play(); } catch (e) {}
  }
  /* wideo (23,2s = 60 bitów) krótsze niż mp3 (~25s) — gdy wideo się kończy, restart OBA razem → re-sync co pętlę */
  vid.addEventListener('ended', syncStart);
  open.addEventListener('click', openLb);
  open.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(); } });
  closeBtn.addEventListener('click', closeLb);
  vlb.addEventListener('click', function (e) { if (e.target === vlb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !vlb.hidden) closeLb(); });
})();
