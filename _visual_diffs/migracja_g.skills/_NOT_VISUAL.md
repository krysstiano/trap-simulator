# N/A — sekcja niewizualna

**Sekcja:** MIGRACJA G.skills (FAZA 1.3)
**Powód:** Czysto logiczna refactor — nowa struktura danych + helpers + migration. Gracz nie zobaczy żadnej różnicy (drzewko UI bez zmian).

**Verification:**
- dbg_skills_migration.mjs: 13/13 PASS
- Smoke: 11/11 PASS
- console.errors check: 0 errors

**Refactor stats:**
- 30 miejsc G.skills.X → getSkillLvl('X') (skrypt)
- 4 fix bugs regex (stringi, komentarze, ===undefined logic)
- 6 nowych helpers (getSkillLvl, setSkillLvl, getSkillPowerUps, setSkillPowerUps, hasSkillEvolution, setSkillEvolution, migrateSkillsToObjectFormat)
