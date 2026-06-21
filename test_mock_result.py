"""
Test script: Set mock result on match 243 (Switzerland vs Canada)
to verify odds-based scoring across all pages.
Run this, then check localhost:3000
"""
import urllib.request
import json

SUPABASE_URL = "https://eypwhskqzwbgeadjzqtk.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHdoc2txendiZ2VhZGp6cXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDA5OSwiZXhwIjoyMDk2MDY2MDk5fQ.A2ZcaYBPiuXpslmXdhqBBPNt_gzf_QoslYv8IfMPuC0"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

MATCH_ID = 243  # Switzerland vs Canada (Group B, Round 3)

def api(method, path, data=None):
    url = f"{SUPABASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            text = resp.read().decode()
            return json.loads(text) if text.strip() else "OK"
    except urllib.request.HTTPError as e:
        print(f"ERROR {e.code}: {e.read().decode()}")
        return None

def step(num, desc):
    print(f"\n{'='*50}")
    print(f"STEP {num}: {desc}")
    print('='*50)

# -------------------------------------------------------
# STEP 1: Check current state of match 243
# -------------------------------------------------------
step(1, "Current state of match 243")
result = api("GET", f"/rest/v1/matches?id=eq.{MATCH_ID}&select=id,home_team,away_team,home_score,away_score,home_win_odds,draw_odds,away_win_odds")
if result:
    m = result[0]
    print(f"  {m['home_team']} vs {m['away_team']}")
    print(f"  Score: {m['home_score']} - {m['away_score']}")
    print(f"  Odds: H={m['home_win_odds']} D={m['draw_odds']} A={m['away_win_odds']}")
    if not m['home_win_odds']:
        print("\n  ⚠️  No odds set! Run seed_round3_odds.sql in Supabase SQL Editor first.")
        print("  Continuing anyway to set mock score...")

# -------------------------------------------------------
# STEP 2: Set mock result: Switzerland 2 - Canada 1
# -------------------------------------------------------
step(2, "Setting mock result: Switzerland 2 - Canada 1")
result = api("PATCH", f"/rest/v1/matches?id=eq.{MATCH_ID}", {
    "home_score": 2,
    "away_score": 1,
    "actual_scorers": "Switzerland",  # team scored first
})
if result:
    m = result[0]
    print(f"  ✅ Score set: {m['home_score']} - {m['away_score']}")

# -------------------------------------------------------
# STEP 3: Call calculate_points via RPC
# -------------------------------------------------------
step(3, "Calling calculate_points for match 243")
result = api("POST", "/rest/v1/rpc/calculate_points", {"p_match_id": MATCH_ID})
print(f"  Result: {result}")

# -------------------------------------------------------
# STEP 4: Check predictions for this match
# -------------------------------------------------------
step(4, "Checking predictions + points for match 243")
preds = api("GET", f"/rest/v1/predictions?match_id=eq.{MATCH_ID}&select=user_id,predicted_home,predicted_away,points&order=points.desc")
if preds:
    print(f"  Found {len(preds)} predictions:")
    for p in preds[:10]:
        pred_str = f"{p['predicted_home']}-{p['predicted_away']}"
        pts = p['points']
        label = ""
        if pts == 80: label = "EXACT (odds)"
        elif pts == 30: label = "EXACT (no odds)"
        elif pts and pts > 0: label = f"CORRECT OUTCOME (odds×20)"
        else: label = "WRONG"
        print(f"    {pred_str} → {pts} pts  [{label}]")

# -------------------------------------------------------
# STEP 5: Check match_extras points
# -------------------------------------------------------
step(5, "Checking match_extras points for match 243")
extras = api("GET", f"/rest/v1/match_extras?match_id=eq.{MATCH_ID}&select=user_id,predicted_scorers,bonus_answers,points&order=points.desc")
if extras:
    print(f"  Found {len(extras)} extras:")
    for e in extras[:5]:
        print(f"    First goal: {e['predicted_scorers']} | Bonus: {e['bonus_answers']} | Points: {e['points']}")
else:
    print("  No match_extras found for this match")

print(f"""
{'='*50}
✅ MOCK RESULT SET! Now check these pages at localhost:3000:

  1. /matches       → Odds bar at top, score 2-1 shown
  2. /profile       → Match shows "Exact!" or "✓ +52" etc.
  3. /leaderboard   → Points updated

Expected scoring for Switzerland 2-1 Canada (odds H=2.60):
  - Predicted 2-1 exactly  → 80 pts (odds exact)
  - Predicted Swiss win    → 52 pts (2.60 × 20)
  - Predicted draw/Canada  → 0 pts

When done testing, run: python3 test_reset_mock.py
{'='*50}
""")
