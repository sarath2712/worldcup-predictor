"""Fix production: Reset mock scores from matches 243 and 271"""
import urllib.request
import json

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

MATCH_IDS = [243, 271]

for mid in MATCH_IDS:
    print(f"\n--- Resetting Match {mid} ---")

    # 1. Clear match score and actuals
    result = api("PATCH", f"/rest/v1/matches?id=eq.{mid}", {
        "home_score": None,
        "away_score": None,
        "actual_scorers": None,
        "actual_potm": None,
        "bonus_actuals": None,
    })
    if result and isinstance(result, list) and len(result) > 0:
        m = result[0]
        print(f"  Match: {m['home_team']} vs {m['away_team']}")
        print(f"  Score cleared: home_score={m['home_score']}, away_score={m['away_score']}")
    else:
        print(f"  Match update result: {result}")

    # 2. Reset prediction points to NULL
    result = api("PATCH", f"/rest/v1/predictions?match_id=eq.{mid}", {"points": None})
    count = len(result) if isinstance(result, list) else 0
    print(f"  Predictions points cleared: {count} rows")

    # 3. Reset match_extras points to NULL
    result = api("PATCH", f"/rest/v1/match_extras?match_id=eq.{mid}", {"points": None})
    count = len(result) if isinstance(result, list) else 0
    print(f"  Match extras points cleared: {count} rows")

print("\n=== VERIFICATION ===")
for mid in MATCH_IDS:
    req = urllib.request.Request(
        f"{URL}/rest/v1/matches?id=eq.{mid}&select=id,home_team,away_team,home_score,away_score,actual_scorers",
        headers=H,
    )
    with urllib.request.urlopen(req) as resp:
        m = json.loads(resp.read().decode())[0]
        status = "OPEN" if m["home_score"] is None else f"LOCKED ({m['home_score']}-{m['away_score']})"
        print(f"  Match {mid}: {m['home_team']} vs {m['away_team']} -> {status}")

    # Check if any predictions still have points
    req2 = urllib.request.Request(
        f"{URL}/rest/v1/predictions?match_id=eq.{mid}&points=not.is.null&select=id,points",
        headers=H,
    )
    with urllib.request.urlopen(req2) as resp2:
        preds = json.loads(resp2.read().decode())
        if preds:
            print(f"    WARNING: {len(preds)} predictions still have points!")
        else:
            print(f"    All prediction points cleared")
