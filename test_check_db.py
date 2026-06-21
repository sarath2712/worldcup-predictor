"""Check for triggers on matches table and test calculate_points"""
import urllib.request, json

URL = "https://eypwhskqzwbgeadjzqtk.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHdoc2txendiZ2VhZGp6cXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDA5OSwiZXhwIjoyMDk2MDY2MDk5fQ.A2ZcaYBPiuXpslmXdhqBBPNt_gzf_QoslYv8IfMPuC0"
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

def rpc(fn, data):
    req = urllib.request.Request(f"{URL}/rest/v1/rpc/{fn}", json.dumps(data).encode(), H)
    try:
        with urllib.request.urlopen(req) as r:
            text = r.read().decode()
            return json.loads(text) if text.strip() else "OK"
    except urllib.request.HTTPError as e:
        return f"ERROR: {e.read().decode()}"

# 1. Check for triggers on matches table
print("=== TRIGGERS ON matches TABLE ===")
result = rpc("pg_get_triggers", {})
# This might not exist, let me try a raw approach instead

# Try querying information_schema for triggers
req = urllib.request.Request(
    f"{URL}/rest/v1/rpc/pg_get_triggers",
    json.dumps({}).encode(), H
)
try:
    with urllib.request.urlopen(req) as r:
        print(r.read().decode())
except Exception as e:
    print(f"  pg_get_triggers not available: {e}")

# 2. Check what calculate_points functions exist (overloading check)
print("\n=== Checking function definition via pg_proc ===")
# We can query pg_catalog through Supabase if there's a way...

# 3. Direct test: Reset match 243, call calculate_points, check result
print("\n=== Direct test: Reset + Score + Check ===")

# Reset predictions points
req = urllib.request.Request(
    f"{URL}/rest/v1/predictions?match_id=eq.243",
    json.dumps({"points": None}).encode(), H | {"Prefer": "return=representation"}
)
req.method = "PATCH"
with urllib.request.urlopen(req) as r:
    preds = json.loads(r.read().decode())
    print(f"  Reset {len(preds)} predictions to NULL")

# Now call calculate_points
result = rpc("calculate_points", {"p_match_id": 243})
print(f"  calculate_points result: {result}")

# Check what we got
req = urllib.request.Request(
    f"{URL}/rest/v1/predictions?match_id=eq.243&select=predicted_home,predicted_away,points&order=points.desc.nullslast",
    headers=H
)
with urllib.request.urlopen(req) as r:
    preds = json.loads(r.read().decode())
    for p in preds[:6]:
        print(f"  {p['predicted_home']}-{p['predicted_away']} → {p['points']} pts")
