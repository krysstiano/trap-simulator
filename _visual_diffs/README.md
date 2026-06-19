# _visual_diffs — Screenshoty PRZED/PO dla sekcji wizualnych

**Cel:** Obiektywne porównanie zmian wizualnych. Memory rule: `feedback_visual_diff.md`.

## Struktura

```
_visual_diffs/
├── <sekcja>/
│   ├── before.png   # stan przed implementacją
│   ├── after.png    # stan po implementacji
│   ├── diff.png     # (opcjonalne) side-by-side
│   └── notes.md     # (opcjonalne) opis co się zmieniło
```

## Workflow

1. Przed sekcją: `node _start_section.mjs "NAZWA"` automatycznie tworzy folder
2. PRZED kodem: zrób screenshot Playwright → `before.png`
3. Implementuj
4. PO kodzie: zrób screenshot → `after.png`
5. Porównaj wizualnie
6. Pokaż user'owi w raporcie końcowym

## Kiedy potrzebne

- ✅ Cinematici (forma 100, gym tutorial, comeback)
- ✅ NPC W PARKU (ławka, sittingNPC)
- ✅ DRZEWKO UI (epicki rebuild)
- ✅ KREATOR POSTACI
- ✅ APARTAMENT PREMIUM (fix migotania)
- ✅ HUD changes
- ✅ STROJE / SYSTEM UBRAŃ
- ✅ LATARNIE
- ✅ POGODA
- ❌ Czysto logiczne sekcje (anti-freeze, balans liczb)

## Cleanup

- Po sekcji DONE i potwierdzeniu wizualnym → folder można zarchiwizować
- Zachować: ważne kamienie milowe (cinematic 100 formy, drzewko UI)
- Usunąć: drobne sekcje gdzie diff jest trywialny
