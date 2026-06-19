"""
Skrypt jednorazowy: zamiana clamp(G.health/energy/hunger ..., 0, 100) → clampStat('X', G.X...)
"""
import re

path = r'E:\Snowy Simulator\index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: clamp(G.health/energy/hunger<expr>, 0, 100)
# Capture: nazwa statu + cale wyrazenie wewnatrz pierwszego argumentu
# UWAGA: wyrazenie moze zawierac nawiasy zagniezdzone — musimy byc ostrozni
# Prosty pattern: clamp(<expr bez nawiasow zagniezdzonych>, 0, 100)
# clamp(G.X[+\-*/]? cos, 0, 100)

# Najprosciej: clamp(G.(health|energy|hunger)<co_kolwiek_nie_zawierajace_zewnetrznego_zamykajacego_nawiasu>, 0, 100)
# Restrykcja: argument 1 nie zawiera ',' ani '(' (90% przypadkow)
pattern = re.compile(r"clamp\((G\.(health|energy|hunger)[^,()]*?),\s*0\s*,\s*100\)")

count = 0
def replace(m):
    global count
    count += 1
    expr = m.group(1)
    name = m.group(2)
    return f"clampStat('{name}', {expr})"

new_content = pattern.sub(replace, content)
print(f"Zamienione: {count} miejsc")

# Save
if count > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"OK — zapisany {path}")
else:
    print("Brak zmian — pattern nie pasowal")
