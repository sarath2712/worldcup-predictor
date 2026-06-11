import csv
import random

random.seed(42)

# Read data
kids = []
with open('kids_registrations.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        age = int(row['Age']) if row['Age'] else 0
        kids.append({
            'name': row['Name'].strip(),
            'age': age,
            'flat': row['Flat Number'],
            'email': row['Email'],
            'phone': row['Phone'],
        })

# Remove kids under 7
eligible = [k for k in kids if k['age'] >= 7]
removed = [k for k in kids if k['age'] < 7]

print("=== REMOVED (Under 7 years) ===")
for k in removed:
    print(f"  {k['name']} (Age {k['age']})")

print(f"\n=== ELIGIBLE: {len(eligible)} kids ===")

# Split into two groups
juniors = [k for k in eligible if k['age'] < 12]  # 7-11
seniors = [k for k in eligible if k['age'] >= 12]  # 12+

print(f"  Juniors (7-11): {len(juniors)}")
print(f"  Seniors (12+): {len(seniors)}")

# Indian girl names heuristic
girl_names = {'Kiara', 'Gianna', 'Hanah', 'surbhi', 'Shriragini', 'Aaradhya'}

def is_likely_girl(name):
    first = name.split()[0]
    return first.lower() in {n.lower() for n in girl_names}

print("\n=== Identified as likely girls ===")
for k in eligible:
    if is_likely_girl(k['name']):
        print(f"  {k['name']} (Age {k['age']})")


def allocate_teams(players, num_teams):
    girls = [p for p in players if is_likely_girl(p['name'])]
    boys = [p for p in players if not is_likely_girl(p['name'])]

    random.shuffle(girls)
    random.shuffle(boys)

    teams = [[] for _ in range(num_teams)]

    # Step 1: Distribute 7-year-olds first (one per team max)
    sevens = [p for p in players if p['age'] == 7]
    others = [p for p in players if p['age'] != 7]
    random.shuffle(sevens)
    for i, kid in enumerate(sevens[:num_teams]):
        teams[i].append(kid)

    # Step 2: Separate remaining into girls and boys (non-7-year-olds)
    remaining_girls = [p for p in others if is_likely_girl(p['name'])]
    remaining_boys = [p for p in others if not is_likely_girl(p['name'])]
    random.shuffle(remaining_girls)

    # Place girls in teams that don't already have a girl (spread evenly)
    teams_without_girl = [i for i in range(num_teams) if not any(is_likely_girl(p['name']) for p in teams[i])]
    for i, girl in enumerate(remaining_girls):
        if i < len(teams_without_girl):
            teams[teams_without_girl[i]].append(girl)
        else:
            # Find team with fewest members
            min_team = min(range(num_teams), key=lambda t: len(teams[t]))
            teams[min_team].append(girl)

    # Step 3: Sort remaining boys by age for serpentine draft
    remaining_boys.sort(key=lambda x: x['age'])

    # Serpentine draft filling smallest teams first
    for boy in remaining_boys:
        # Pick team with fewest members; tiebreak by index
        min_size = min(len(t) for t in teams)
        candidates = [i for i in range(num_teams) if len(teams[i]) == min_size]
        # Among candidates, use serpentine-style age balancing
        # Pick team with lowest avg age if boy is old, highest if young
        if boy['age'] >= 11:
            target = min(candidates, key=lambda i: sum(p['age'] for p in teams[i]) / max(len(teams[i]), 1))
        else:
            target = max(candidates, key=lambda i: sum(p['age'] for p in teams[i]) / max(len(teams[i]), 1))
        teams[target].append(boy)

    return teams


print("\n" + "=" * 60)
print("8 MIXED TEAMS (All eligible kids, age 7-14)")
print("=" * 60)

all_teams = allocate_teams(eligible, 8)

for i, team in enumerate(all_teams):
    avg_age = sum(p['age'] for p in team) / len(team) if team else 0
    girls_count = sum(1 for p in team if is_likely_girl(p['name']))
    captain = max(team, key=lambda p: p['age'])
    print(f"\n  Team {i+1} (Avg age: {avg_age:.1f}, Girls: {girls_count}, Size: {len(team)}, Captain: {captain['name']}):")
    for p in sorted(team, key=lambda x: x['age']):
        marker = " [G]" if is_likely_girl(p['name']) else ""
        cap = " (C)" if p == captain else ""
        print(f"    - {p['name']} (Age {p['age']}, Flat {p['flat']}, Phone: {p['phone']}, Email: {p['email']}){cap}{marker}")

print(f"\n\nSUMMARY:")
print(f"  Removed (under 7): {len(removed)}")
print(f"  Total eligible: {len(eligible)} in 8 teams")
print(f"  Team sizes: {[len(t) for t in all_teams]}")

# Generate JSON for the page
import json
teams_data = []
for i, team in enumerate(all_teams):
    captain = max(team, key=lambda p: p['age'])
    players = []
    for p in sorted(team, key=lambda x: -x['age']):
        players.append({
            'name': p['name'],
            'age': p['age'],
            'flat': p['flat'],
            'phone': p['phone'],
            'email': p['email'],
            'isCaptain': p == captain,
        })
    teams_data.append(players)

with open('kids_teams.json', 'w') as f:
    json.dump(teams_data, f, indent=2)
print("\nWritten kids_teams.json")
