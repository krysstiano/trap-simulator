# Publikacja Snowy / Trap Simulator (web / itch.io)

Gra to **pojedynczy plik** — do publikacji wystarczy `index.html`.

## Co wgrać
- ✅ **`index.html`** — to cała gra (HTML5 Canvas, ~4.9 MB).
- ❌ NIE wgrywać reszty folderu: pliki `_*.mjs` / `_*.js` (testy), `PLAN_*.md`, `SUPABASE_*.sql`, `.backup_*`, `node_modules/` itp. To pliki robocze.

### itch.io
1. Spakuj **sam `index.html`** do ZIP (plik MUSI nazywać się `index.html` w korzeniu ZIP-a).
2. Na stronie projektu: „Upload files" → wgraj ZIP → zaznacz **„This file will be played in the browser"**.
3. Embed: szer. ~1280, wys. ~720 (gra skaluje się responsywnie), zaznacz „Fullscreen button".
4. Ustaw klasyfikację treści: **dorośli / 18+** (hazard symulowany, narkotyki, język).

## Funkcje online (opcjonalne, wymagają Supabase)
Ranking, Społeczność (zdjęcia/komentarze), znajomi, crew i rekordy kasyna działają tylko po skonfigurowaniu backendu:
1. W panelu Supabase (SQL Editor) uruchom **`SUPABASE_WSZYSTKO.sql`** (tworzy wszystkie tabele + polityki RLS).
2. Po uruchomieniu zrób **„Reload schema cache"** (Settings → API) lub odczekaj chwilę.
3. Klucz w grze to `anon`/`publishable` (publiczny, bezpieczny do osadzenia).

Bez tego kroku gra działa w pełni offline — online pokazuje komunikaty „społeczność chwilowo niedostępna".

## Gotowość przed publikacją — zrobione w kodzie
- 🔞 **Age-gate 18+** na starcie (v2.1.764) — jednorazowe potwierdzenie wieku + disclaimer treści.
- 🔒 **Panel deweloperski ukryty** (v2.1.763) — cheaty tylko z `?dev=1`; wyniki z narzędzi dev nie trafiają do rankingu.
- 🛡️ **Moderacja Społeczności** (v2.1.766) — bezpieczne wyświetlanie cudzych treści (anty-injection), filtr wulgaryzmów, przycisk „Zgłoś".
- 🔒 **Nota o danych** (v2.1.767) — okno dołączania mówi, jakie dane trafiają na serwer; brak danych osobowych.
- 👑 Spójne progi/teksty (v2.1.765).
