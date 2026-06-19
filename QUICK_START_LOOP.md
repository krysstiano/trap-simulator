# QUICK START — autonomiczna sesja /loop (2026-05-24)

## Komendy do wpisania KOLEJNO

```bash
# 1. Terminal (Bash/PowerShell)
cd "E:\Snowy Simulator"
claude
```

```
# 2. W Claude Code — przy pierwszym tool call CC zapyta:
"Trust these 4 hooks? (hook_syntax_check, hook_load_plan_noc, hook_pre_edit_reminder, hook_pre_commit_check)"
→ Kliknij Allow / Yes
```

```
# 3. Ustaw effort
/effort max
```

```
# 4. Start autonomicznej pracy (v2.1.295 efficient mode 2026-05-25)
/loop kontynuuj autonomiczną pracę nad Snowy zgodnie z PLAN_NOC_2026-05-24.md. **BATCH MODE**: wykonuj 2-5 powiązanych zadań per turn (audit + fix + verify + commit + następne audit razem), save state po każdym (PLAN_NOC log + atomic commit) żeby uniknąć context bloat. Workflow: krok 0 (read CLAUDE.md + MEMORY.md indeks) → krok 1-13 (PRE-flight → impl → commit). Reguły #15 (NIGDY nie kończ), #16 (auto-weryfikacja + Round 2 audit po DONE), #17 (deep audit całej gry), Faza R2 (Round 2 re-audit historycznych iter). NIE pytaj usera w trakcie. **ScheduleWakeup delaySeconds=60** (minimum, cache zostaje warm).
```

## Co MUSI być spełnione

| Warunek | Dlaczego |
|---|---|
| **Working dir = `E:\Snowy Simulator`** | Project CLAUDE.md + project hooks załadują się tylko gdy CC startuje w tym katalogu. Globalny CLAUDE.md działa wszędzie ale projektowy ma więcej szczegółów. |
| **Allow hooks trust prompt** | Hooks BLOKUJĄ broken JS po Edit + injektują CLAUDE.md przy każdej wiadomości. Bez Allow — działa tylko moja sumienność. |
| **`/effort max` przed `/loop`** | Per-session setting. Konieczne dla głębokich decyzji (Kasyno HE, Beef Arena rozbudowa). |
| **Self-paced `/loop` (bez intervalu)** | Lepsze niż fixed bo MAX effort iteracje trwają 5-20 min. ScheduleWakeup 90-180s utrzymuje cache hot. |

## Co dostaniesz rano

- **`git log --oneline -50`** — wszystkie commits z nocy (atomic per faza)
- **PLAN_NOC sekcja "Log iteracji"** — chronologia: faza X DONE / commit hash / problemy
- **PATCH_NOTES w index.html** — wpisy v2.1.234, v2.1.235, v2.1.236+ per faza
- Backupy `.backup_NOC_fazaX_*` dla każdej ŚREDNIA/DUŻA fazy (możesz usunąć po review)

## Przerwanie

Wpisz **cokolwiek** w CC — /loop natychmiast się zatrzyma. Nie trzeba specjalnej komendy.

## Setup zweryfikowany

| Element | Status |
|---|---|
| `~/.claude/CLAUDE.md` (globalny) | ✅ utworzony |
| `~/.claude/settings.json` (hooks globalne) | ✅ dodane |
| `E:\Snowy Simulator\CLAUDE.md` (project) | ✅ zaktualizowany (17 reguł) |
| `E:\Snowy Simulator\.claude\settings.json` (hooks project) | ✅ |
| `E:\Snowy Simulator\.claude\hook_*.mjs` (4 hooks) | ✅ wszystkie testowane PASS |
| `E:\Snowy Simulator\PLAN_NOC_2026-05-24.md` (35 faz) | ✅ gotowy |
| `MEMORY.md` indeks | ✅ aktualny (~70 wpisów) |
| Memory feedback_* | ✅ wszystkie aktualne (smoke przepisany, no_dead_code dodany, autonomous wzmocniony) |
| Commit checkpoint | ✅ `fb9faed` (smoke autonomia) — najnowszy stable |
| Test runtime ostatniego refactor (v2.1.229-233) | ✅ 70/70 PASS (`dbg_concert_balance_v232.mjs`) |
