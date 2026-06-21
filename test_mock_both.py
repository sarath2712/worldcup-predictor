"""
Test: Mock results for TWO matches:
  1. Match 243 (Switzerland vs Canada) - Round 3 WITH odds (2.60/3.20/2.80)
  2. A Round 1/2 match WITHOUT odds
Then verify scoring is correct for both.
"""
import urllib.request, json

URL = "https://eypwhskqzwbgeadjzqtk.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHdoc2txendiZ2VhZGp6cXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDA5OSwiZXhwIjoyMDk2MDY2MDk5fQ.A2ZcaYBPiuXpslmXdhqBBPNt_gzf_QoslYv8IfMPuC0"
H = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

def api(method, path, data=None):
    url = f"{URL}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=H, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            text = resp.read().decode()
            return json.loads(text) if text.strip() else "OK"
    except urllib.request.HTTPError as e:
        print(f"  ERROR {e.code}: {e.read().decode()}")
        return None

def step(num, desc):
    print(f"\n{'='*60}")
    print(f"  STEP {num}: {desc}")
    print('='*60)

# -------------------------------------------------------
# Find a Round 1 or 2 match without odds that has predictions
# -------------------------------------------------------
step(0, "Finding a non-odds match with predictions")
# Get matches without odds that haven't been scored yet
matches = api("GET", "/rest/v1/matches?home_win_odds=is.null&home_score=is.null&select=id,home_team,away_team,stage&order=id&limit=20")
no_odds_match = None
if matches:
    for m in matches:
        # Check if it has predictions
        preds = api("GET", f"/rest/v1/predictions?match_id=eq.{m['id']}&select=id&limit=1")
        if preds and len(preds) > 0:
            no_odds_match = m
            break
    if no_odds_match:
        print(f"  Found: ID={no_odds_match['id']} {no_odds_match['home_team']} vs {no_odds_match['away_team']} ({no_odds_match['stage']})")
    else:
        print("  No unscored non-odds match with predictions found. Testing odds match only.")

ODDS_MATCH = 243  # Switzerland vs Canada
NO_ODDS_MATCH = no_odds_match['id'] if no_odds_match else None

# -------------------------------------------------------
# STEP 1: Reset both matches
# -------------------------------------------------------
step(1, "Resetting matches")
for mid in [ODDS_MATCH, NO_ODDS_MATCH]:
    if mid is None:
        continue
    api("PATCH", f"/rest/v1/matches?id=eq.{mid}", {"home_score": None, "away_score": None, "actual_scorers": None})
    api("PATCH", f"/rest/v1/predictions?match_id=eq.{mid}", {"points": None})
    api("PATCH", f"/rest/v1/match_extras?match_id=eq.{mid}", {"points": None})
    print(f"  ✅ Match {mid} reset")

# -------------------------------------------------------
# STEP 2: Set mock results
# -------------------------------------------------------
step(2, "Setting mock results")

# Odds match: Switzerland 2 - Canada 1
api("PATCH", f"/rest/v1/matches?id=eq.{ODDS_MATCH}", {
    "home_score": 2, "away_score": 1, "actual_scorers": "Switzerland"
})
print(f"  ✅ Match {ODDS_MATCH} (Switzerland vs Canada): 2-1 [HAS ODDS: H=2.60 D=3.20 A=2.80]")

if NO_ODDS_MATCH:
    api("PATCH", f"/rest/v1/matches?id=eq.{NO_ODDS_MATCH}", {
        "home_score": 1, "away_score": 0, "actual_scorers": no_odds_match['home_team']
    })
    print(f"  ✅ Match {NO_ODDS_MATCH} ({no_odds_match['home_team']} vs {no_odds_match['away_team']}): 1-0 [NO ODDS]")

# -------------------------------------------------------
# STEP 3: Calculate points
# -------------------------------------------------------
step(3, "Calculating points")
api("POST", "/rest/v1/rpc/calculate_points", {"p_match_id": ODDS_MATCH})
print(f"  ✅ calculate_points({ODDS_MATCH}) done")

if NO_ODDS_MATCH:
    api("POST", "/rest/v1/rpc/calculate_points", {"p_match_id": NO_ODDS_MATCH})
    print(f"  ✅ calculate_points({NO_ODDS_MATCH}) done")

# -------------------------------------------------------
# STEP 4: Check results - ODDS MATCH
# -------------------------------------------------------
step(4, f"Results: Match {ODDS_MATCH} - Switzerland 2-1 Canada [WITH ODDS]")
print("  Expected: Exact=80, Correct outcome=52 (2.60×20), Wrong=0\n")
preds = api("GET", f"/rest/v1/predictions?match_id=eq.{ODDS_MATCH}&select=predicted_home,predicted_away,points&order=points.desc.nullslast")
if preds:
    for p in preds[:10]:
        ph, pa, pts = p['predicted_home'], p['predicted_away'], p['points']
        is_exact = (ph == 2 and pa == 1)
        is_correct = (ph > pa)  # predicted home win
        expected = 80 if is_exact else (52 if is_correct else 0)
        status = "✅" if pts == expected else f"❌ EXPECTED {expected}"
        print(f"    {ph}-{pa} → {pts} pts  {status}")

extras = api("GET", f"/rest/v1/match_extras?match_id=eq.{ODDS_MATCH}&select=predicted_scorers,points&order=points.desc.nullslast&limit=5")
if extras:
    print(f"\n  Match extras:")
    for e in extras:
        print(f"    First goal: {e['predicted_scorers']} → {e['points']} pts")

# -------------------------------------------------------
# STEP 5: Check results - NO ODDS MATCH
# -------------------------------------------------------
if NO_ODDS_MATCH:
    step(5, f"Results: Match {NO_ODDS_MATCH} - {no_odds_match['home_team']} 1-0 {no_odds_match['away_team']} [NO ODDS]")
    print("  Expected: Exact=30, Correct outcome=10, Wrong=0\n")
    preds = api("GET", f"/rest/v1/predictions?match_id=eq.{NO_ODDS_MATCH}&select=predicted_home,predicted_away,points&order=points.desc.nullslast")
    if preds:
        for p in preds[:10]:
            ph, pa, pts = p['predicted_home'], p['predicted_away'], p['points']
            is_exact = (ph == 1 and pa == 0)
            is_correct = (ph > pa)
            expected = 30 if is_exact else (10 if is_correct else 0)
            status = "✅" if pts == expected else f"❌ EXPECTED {expected}"
            print(f"    {ph}-{pa} → {pts} pts  {status}")

# -------------------------------------------------------
# Summary
# -------------------------------------------------------
print(f"""
{'='*60}
  SUMMARY - Check these pages at localhost:3000:

  /matches  → Match {ODDS_MATCH}: odds at top, score 2-1, points shown
             {f'Match {NO_ODDS_MATCH}: no odds bar, score 1-0, old scoring' if NO_ODDS_MATCH else ''}
  /profile  → Both matches with correct points
  /leaderboard → Updated totals

  When done: python3 test_reset_mock2.py
{'='*60}
""")
