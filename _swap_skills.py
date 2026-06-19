"""
Skrypt jednorazowy: zamiana G.skills.X na getSkillLvl('X')
Bezpieczna zamiana — tylko READING, NIE writing (setSkillLvl manualnie tam gdzie potrzeba).

WAŻNE WYŁĄCZENIA:
- G.skills= (init/assignment) — NIE zmieniać
- G.skills.X= (write) — NIE zmieniać (manual setSkillLvl)
- G.skills.X++ / G.skills.X-- (mutation) — NIE zmieniać (manual)
- G.skills.X===undefined — NIE zmieniać (init check)
- migrateSkillsToObjectFormat — NIE zmieniać (helper)

PATTERN: G.skills.X gdzie X to znana nazwa skilla, ALE:
- nie poprzedzona = (assignment)
- nie nastepujaca po = (assignment)
- nie ++/-- (mutation)
- nie ===undefined (init check)
"""
import re

path = r'E:\Snowy Simulator\index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Lista wszystkich skill nazw z SKILL_DEF
SKILLS = ['pizza', 'supermarket', 'carwash', 'construction', 'kurier', 'zmywak',
          'youtuber', 'beatmaker', 'gamer', 'influencer', 'soundeng',
          'kondycja', 'apetyt', 'odpornosc', 'charyzma', 'cooking', 'raper']

# Pattern: G.skills.X w kontekscie READ (nie write)
# Negative lookahead: NIE nastepujace po =, ===undefined, ++, --
# Negative lookbehind: NIE poprzedzane = (oprocz ==)
# Wzorzec uproszczony: G.skills.X NASTEPOWANY przez non-assignment, non-mutation
pattern = re.compile(
    r"G\.skills\.(" + "|".join(SKILLS) + r")(?!\s*=(?!=)|\s*\+\+|\s*--)"
)

count = 0
def replace(m):
    global count
    count += 1
    skill = m.group(1)
    return f"getSkillLvl('{skill}')"

new_content = pattern.sub(replace, content)
print(f"Zamienione: {count} miejsc")

# Save
if count > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"OK — zapisany {path}")
else:
    print("Brak zmian — pattern nie pasowal")
