# RAPORT: Dodanie "Dz. X" w tablicy rankingu (Leaderboard)

**Data:** 2026-05-15
**Plik:** `E:\Snowy Simulator\index.html` (~39200 linii)
**Feature request:** Amper — pokazać ile dni gry gracz grał, obok wyniku w rzędzie LB.

---

## 1. Aktualna struktura rzędu (renderowanie)

**Funkcja:** `renderPhoneLeaderboard()` — linia **24551**
**Pętla rzędów:** `list.map((e,i)=>...)` — linia **24710-24727**

Każdy rząd to flex-row z kolumnami (od lewej):

| # | Element | Linia | Pole z DB |
|---|---|---|---|
| 1 | Rank (#1/🥇/🥈/🥉) + delta (↑↓✨) | 24721 | (index `i`) |
| 2 | Mini-avatar (skin/hair/cloth) | 24722 | `e.avatar` (JSON) |
| 3 | Flaga (PL/inny) | 24723 | `e.country` |
| 4 | Nick + `(ja)` + title-chip | 24724 | `e.nick`, `e.title` |
| 5 | **Wynik + jednostka** (np. `12 345 zł`) | **24725** | `e.score`, `cat.unit` |

Brak kolumny dla `game_day` — **pole nie jest renderowane nigdzie w UI rzędu**.

---

## 2. Czy `game_day` jest w response z Supabase?

**TAK — jest dostępne automatycznie.**

- **Submit (linia 38887-38895):** `submitScore()` wysyła w body `game_day:G.day||0` (linia **38892**) razem ze score, country, avatar, title. Supabase więc ma wartość per (user_id, category, period_key).
- **Fetch (linia 38966):** `fetchLeaderboard()` woła `GET /leaderboard?category=eq.X&period_key=eq.Y&order=Z&limit=100` — **bez `select=` filtra**, więc PostgREST zwraca **wszystkie kolumny tabeli**, łącznie z `game_day`.
- **Potwierdzenie:** jedyne miejsce gdzie używamy `select=` to linie 25181/25183 (`select=user_id` dla rank-count) — to oddzielny query, NIE ten z `fetchLeaderboard()`.

Wniosek: `e.game_day` jest **już dostępne** w obiekcie `e` w pętli rzędów. **Nie trzeba zmieniać backendu, schematu ani fetch query.**

---

## 3. Edge case — kategoria `speedrun`

**LB_CATEGORIES.speedrun** (linia **38773**):
```js
speedrun:{label:'⏱ Speedrun 1M fanów',emoji:'⏱',color:'#27ae60',unit:'dni',
  get:()=>G._mile1m?(G._mile1mDay||0):0, max:10000, lowerIsBetter:true}
```

W tej kategorii `score` to **liczba dni do osiągnięcia 1M fanów** (im mniej tym lepiej — `lowerIsBetter:true`). Jednostka `unit:'dni'` jest już renderowana w score (np. `47 dni`).

**Pokazywanie "Dz. X" w speedrun = DUPLIKAT.** Gracz #1 ze score `47 dni` miałby obok "Dz. 89" (89 = ile w sumie gra teraz), co jest mylące. Trzeba **conditional skip** dla speedrun.

---

## 4. Propozycja edycji (old → new)

### Lokalizacja: linia **24725** w funkcji `renderPhoneLeaderboard()`

### OLD (1 linia):
```html
      <span style="color:${cat.color};font-weight:700;flex-shrink:0">${(e.score||0).toLocaleString('pl')}${cat.unit?' '+cat.unit:''}</span>
```

### NEW (zachowując formatowanie):
```html
      <span style="display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;line-height:1.1">
        <span style="color:${cat.color};font-weight:700">${(e.score||0).toLocaleString('pl')}${cat.unit?' '+cat.unit:''}</span>
        ${_lbCurrentCat!=='speedrun' && e.game_day ? `<span style="color:#778;font-size:9px;font-weight:600;margin-top:1px" title="Dni gry kiedy wynik został zapisany">Dz. ${e.game_day}</span>` : ''}
      </span>
```

### Co się zmienia (krok po kroku):
1. Score zostaje w `<span>` jak był (kolor kategorii, bold) — żeby nie burzyć rytmu wizualnego.
2. Dodajemy zewnętrzny `<span style="display:flex;flex-direction:column;align-items:flex-end">` żeby ułożyć score + dni w stacku pionowym wyrównanym do prawej.
3. Drugi span "Dz. X" — **mały (9px), szary (`#778`), pod scorem**. Tooltip: "Dni gry kiedy wynik został zapisany".
4. **Conditional:**
   - `_lbCurrentCat!=='speedrun'` — w speedrun dni są już w score, NIE duplikujemy.
   - `e.game_day` — jeśli pole null/0/undefined (stare wpisy sprzed dodania `game_day` do submit, lub Day 0), nie pokazujemy żeby nie pisać "Dz. 0".

### Edge case dla starych wpisów:
Jeśli ktoś submitował przed dodaniem `game_day` w body (sprawdź historię — to było ~v1.8.x, pewnie wszystko już ma), `e.game_day` będzie `null`. Warunek `e.game_day` to obsłuży (truthy check). Można też być bardziej eksplicitny: `(e.game_day && e.game_day > 0)`.

---

## 5. Opcjonalne rozszerzenia (do rozważenia z userem)

### A. Pokazać dni także w Hall of Fame (`renderHallOfFame`, linia 24732)
Linia **24763** ma score: `<span><b style="color:${c.color}">${(row.score||0).toLocaleString('pl')}...`. Można dorzucić `· Dz. ${row.game_day}` obok "Aktualizacja: X" w linii 24764. Skip jeśli `k==='speedrun'`.

### B. Pokazać dni w live ticker (linia 24624)
Ticker pokazuje `nick · emoji score · time_ago`. Można wstawić `· Dz. X` przed time_ago dla większego kontekstu. Skip dla speedrun.

### C. Tooltip rozszerzony
Zamiast samego "Dz. 89" → tooltip: `"Dz. 89 — Tomek osiągnął ten wynik w 89. dniu gry"`. Bardziej zrozumiałe dla nowych graczy.

### D. Wskaźnik efektywności (PRO move)
Dla kategorii `money`/`fans`/`master` można dodać score/day ratio (np. `12 345 zł · Dz. 89 (139 zł/dzień)`) — ale to już agresywna zmiana UI, raczej do osobnego feature requesta.

---

## 6. Test plan (po edycji)

1. Otwórz telefon → 🌍 Tablica wyników.
2. Sprawdź każdą zakładkę: master/money/level/fans/achievements/casino — **musi być "Dz. X" pod score**.
3. Sprawdź **speedrun** — **NIE** może być "Dz. X" (bo dni są już w score).
4. Sprawdź **Weekly** i **Znajomi** scope — to ten sam render, więc powinno działać automatycznie.
5. Sprawdź rząd z `(ja)` — czy "Dz. X" pokazuje aktualny `G.day` (po auto-submit co 60s).
6. Sprawdź rząd ze starym wpisem (np. konto bez `game_day` w bazie) — czy "Dz. X" się nie pokazuje (zamiast "Dz. 0" / "Dz. null").
7. Sprawdź szerokość rzędu na 320px (iPhone SE) i 800px (desktop) — nick nie powinien być ucinany.

---

## 7. PATCH_NOTES wpis (po implementacji)

```js
{t:'add',d:'Tablica wyników: pod każdym wynikiem pokazujemy ile dni gry zajęło graczowi osiągnięcie tego wyniku (np. "Dz. 89"). Pomaga ocenić tempo postępu rywali. Kategoria Speedrun bez zmian (tam dni są już w głównym wyniku).'},
```

---

## Podsumowanie

| Pytanie | Odpowiedź |
|---|---|
| Lokalizacja zmiany | `index.html` linia **24725** (render rzędu w `renderPhoneLeaderboard`) |
| Backend/schema | **Bez zmian** — `game_day` już jest w submit body i w response |
| Ile linii zmiany | ~5 linii (1 span → wrapping span z conditional) |
| Edge case'y | speedrun (skip — duplikat) + stary wpis z `game_day=null` (skip) |
| Ryzyko save compat | **Zero** — tylko render logic, brak zmian w state/save |
| Czy łamie save'y? | **NIE** |
