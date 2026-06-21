"""Reset both mock matches"""
import urllib.request, json

URL = "https://eypwhskqzwbgeadjzqtk.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHdoc2txendiZ2VhZGp6cXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDA5OSwiZXhwIjoyMDk2MDY2MDk5fQ.A2ZcaYBPiuXpslmXdhqBBPNt_gzf_QoslYv8IfMPuC0"
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json", "Prefer": "return=representation"}

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

# Find the no-odds match that was used
matches = api("GET", "/rest/v1/matches?home_win_odds=is.null&home_score=not.is.null&select=id,home_team,away_team&order=id&limit=5")
no_odds_ids = [m['id'] for m in (matches or [])]

# Reset match 243 (odds match)
all_ids = [243] + no_odds_ids
for mid in all_ids:
    api("PATCH", f"/rest/v1/matches?id=eq.{mid}", {"home_score": None, "away_score": None, "actual_scorers": None})
    api("PATCH", f"/rest/v1/predictions?match_id=eq.{mid}", {"points": None})
    api("PATCH", f"/rest/v1/match_extras?match_id=eq.{mid}", {"points": None})
    print(f"✅ Match {mid} reset")

print("\n✅ All mock matches restored to pending state.")
