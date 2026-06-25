import urllib.request, re, json
from datetime import datetime, timezone

url = "https://www.espn.com/soccer/stats/_/league/FIFA.WORLD/season/2026/view/scoring"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode()

match = re.search(r"window\[.{0,20}espnfitt.{0,5}\]\s*=\s*(\{.*?\});", html, re.DOTALL)
data = json.loads(match.group(1))
stats = data["page"]["content"]["statistics"]
table_rows = stats["tableRows"]

# tableRows is [[row1, row2, ...], [row1, row2, ...]] where each row = [rank, player, team, stat1, stat2]
scorers = []
for group in table_rows:
    if not isinstance(group, list):
        continue
    # Check if this is a single row or list of rows
    if len(group) > 0 and isinstance(group[0], int):
        # Single row: [rank, {player}, {team}, {stat}, {stat}]
        row = group
        rank = row[0]
        player = row[1]
        team = row[2]
        stat_vals = [r for r in row[3:] if isinstance(r, dict) and r.get("isStats")]
        goals = int(stat_vals[-1]["value"]) if stat_vals else 0
        scorers.append({"rank": rank, "player_name": player["name"], "team": team["name"], "goals": goals})
    elif len(group) > 0 and isinstance(group[0], list):
        # List of rows
        for row in group:
            if not isinstance(row, list) or len(row) < 4:
                continue
            rank = row[0]
            player = row[1]
            team = row[2]
            stat_vals = [r for r in row[3:] if isinstance(r, dict) and r.get("isStats")]
            goals = int(stat_vals[-1]["value"]) if stat_vals else 0
            scorers.append({"rank": rank, "player_name": player["name"], "team": team["name"], "goals": goals})

print(f"Parsed {len(scorers)} scorers from ESPN:")
for s in scorers[:15]:
    print(f"  {s['rank']}. {s['player_name']} ({s['team']}) - {s['goals']} goals")

if len(scorers) == 0:
    print("ERROR: No scorers parsed, aborting update")
    exit(1)

# Update Supabase
SUPABASE_URL = "https://eypwhskqzwbgeadjzqtk.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHdoc2txendiZ2VhZGp6cXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDA5OSwiZXhwIjoyMDk2MDY2MDk5fQ.A2ZcaYBPiuXpslmXdhqBBPNt_gzf_QoslYv8IfMPuC0"

# Delete existing
delete_req = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/top_scorers?id=gte.0",
    method="DELETE",
    headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json"}
)
urllib.request.urlopen(delete_req)

# Insert top 15
now = datetime.now(timezone.utc).isoformat()
rows = [{"rank": s["rank"], "player_name": s["player_name"], "team": s["team"], "goals": s["goals"], "updated_at": now} for s in scorers[:15]]
insert_data = json.dumps(rows).encode()
insert_req = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/top_scorers",
    data=insert_data,
    method="POST",
    headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
)
urllib.request.urlopen(insert_req)
print(f"\nSuccessfully updated top_scorers table with {len(rows)} entries at {now}")
