"""
Reset script: Clear mock result from match 243 (Switzerland vs Canada)
Run after testing to restore the match to pending state.
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

MATCH_ID = 243

def api(method, path, data=None):
    url = f"{SUPABASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.request.HTTPError as e:
        print(f"ERROR {e.code}: {e.read().decode()}")
        return None

# Reset match score to NULL
print("Resetting match 243 score to NULL...")
result = api("PATCH", f"/rest/v1/matches?id=eq.{MATCH_ID}", {
    "home_score": None,
    "away_score": None,
    "actual_scorers": None,
})
if result:
    m = result[0]
    print(f"  ✅ Score reset: {m['home_score']} - {m['away_score']}")

# Reset prediction points to NULL
print("Resetting prediction points for match 243...")
result = api("PATCH", f"/rest/v1/predictions?match_id=eq.{MATCH_ID}", {"points": None})
print(f"  ✅ Predictions reset")

# Reset match_extras points to NULL
print("Resetting match_extras points for match 243...")
result = api("PATCH", f"/rest/v1/match_extras?match_id=eq.{MATCH_ID}", {"points": None})
print(f"  ✅ Extras reset")

print("\n✅ Match 243 restored to pending state. All points cleared.")
