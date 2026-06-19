# RAPORT AUDYTU PATCH_NOTES

**Data:** 2026-05-15
**Total wpisów:** 444

## ✅ CHRONOLOGIA — OK

- Najnowszy w array: **v2.1.21** (2026-05-15) ✓
- Najstarszy w array: **v0.1 — Initial** (2026-04-02) "Pierwsza wersja Snowy Simulator" ✓
- Kolejność: najnowsze na górze (po scrollu w dół najstarsze) — zgodne z preferencjami usera

## ✅ NAJSTARSZE WPISY W KATEGORIACH (każdy pierwszy = relevant origin)

| Kategoria | Najstarszy wpis | Status |
|---|---|---|
| **feature** | v0.1 Initial — "Pierwsza wersja Snowy Simulator" | ✓ POPRAWNY origin |
| **balance** | v0.2 Map & Jobs Wykończenie | ✓ OK |
| **visual** | v0.3 Visual Overhaul | ✓ OK |
| **gameplay** | v0.3 Visual Overhaul | ✓ OK |
| **critical/bugfix** | v0.5 Bugfix Sprint — "10 krytycznych bugów" | ✓ OK |
| **beta-tester** | v0.9.4 — Mirro reporter | ✓ OK |
| **system** | v0.9.30 — "Okna potwierdzeń w stylu gry" | ✓ OK |
| **kasyno** | v1.6.0 — "KASYNO ROYAL — nowy budynek z ruletką" | ✓ **POPRAWNY origin kasyna** |
| **online** | v1.8.73 — "🌍 Globalna tablica wyników — pierwszy element rywalizacji" | ✓ **POPRAWNY origin online** |
| **optimization** | v1.8.80 — "Tablica wyników mini-avatar" | ✓ OK |

## 🚨 SEKRETY — USUNIĘTE (6 wpisów)

Wpisy które ZDRADZAŁY istnienie ukrytego admin panela:

| Wersja | Usunięto/zmieniono |
|---|---|
| v0.9.2 | **CAŁY WPIS USUNIĘTY** ("Admin Panel — pełne narzędzia testowe") |
| v0.9.12 | Cenzurowane "Admin Panel mnożnik tempa czasu..." |
| v0.9.94 | "admin panel" → "leczenie w szpitalu" |
| v1.0.3 | **CAŁY WPIS USUNIĘTY** ("Admin Panel: rozszerzony o drzewko + skille + fani + MAKS WSZYSTKO") |
| v1.1.8 | "Wybór pogody w admin panelu" → "Komunikat 'Pogoda:'" |
| v1.7.9 | Item "Admin panel ma nowe quick buttony" usunięty + title bez "+ admin quick buttons" |
| v1.9.58 | "Admin keyboard sekwencja 'snowy'/'amper'..." **USUNIĘTE** (najgorszy — ujawniał shortcut!) |
| v2.0.26 | Title "+ admin chain" usunięty + item o "Admin functions Maks." usunięty |
| v2.0.27 | Item o admin chain reaction wyczyszczony — bez `_adminCheatUsed` mention |

**Plus dodatkowe mentions admin w listach** (z-index audit, blocking UI lists, hints guards) — wszystkie cenzurowane.

## ⚠️ KATEGORIE — 104 wpisów bez tagu

Wpisy bez `cat`/`cats` field — wszystkie stare (głównie v0.x i niektóre v1.x). To NIE łamie renderowania (są widoczne w filtrze "Wszystkie"), tylko nie pojawią się w filtrach kategorii.

**Decyzja:** zostawiam — recategoryzacja 100+ wpisów wymagałaby osobnej sesji + dokładnego mapowania. Treść jest widoczna w filtrze "Wszystkie".

## ✅ UCIĘCIA — TEST FALSE POSITIVE

Skrypt audytu zgłosił 103 "podejrzane zakończenia" — głównie wpisy kończące się na backtick + kropka (np. "...kolizji.") czyli **legitne końce zdań po code-spans**. Po sprawdzeniu — to są poprawnie zakończone wpisy. Audyt regex miał false positives.

Jedyny real ostrzegawczy case (`v2.1.21 item 8: niedomknięty <b>`) — to **literal text** w opisie funkcji `highlight()` (treść mówi "markdown `**bold**` → `<b>`" jako demonstrację). `highlight()` runtime escape'uje `<` na `&lt;` więc wyświetlane jako tekst, nie tag. **NIE jest to bug.**

## ✅ TITLE vs CATS — 2 false positives

- `v0.9.37` "Sloty zapisu" — "sloty" oznacza slot save, NIE kasyno-sloty → poprawnie BEZ kasyno cat
- `v0.9.8` "Zbyszek + Crew" — "crew" oznacza NPC crew (lokalne), NIE crew online → poprawnie BEZ online cat

## 📊 STATYSTYKI KATEGORII

```
audio:        1
balance:      54
beta-tester:  17
bugfix:       170
change:       4
critical:     64
feature:      88
gameplay:     82
kasyno:       56
online:       33
optimization: 5
system:       31
visual:       92
```

## WERDYKT

🟢 **PATCH_NOTES SĄ CZYSTE**

- Chronologia: ✓ poprawna
- Kategorie: ✓ wszystkie origin wpisów są właściwe
- Sekrety o admin panel: ✓ **USUNIĘTE** (6 wpisów + dodatkowe mentions)
- Ucięcia: ✓ żadnych prawdziwych (false positives w audyt regex)
- Spójność title vs cats: ✓ poprawna

## Pliki

- `dbg_audit_patchnotes.mjs` — pełen skrypt audytu (uruchom: `node dbg_audit_patchnotes.mjs`)
