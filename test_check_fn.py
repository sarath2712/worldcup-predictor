"""Check the actual source of calculate_points in the DB"""
import urllib.request, json

URL = "https://eypwhskqzwbgeadjzqtk.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHdoc2txendiZ2VhZGp6cXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDA5OSwiZXhwIjoyMDk2MDY2MDk5fQ.A2ZcaYBPiuXpslmXdhqBBPNt_gzf_QoslYv8IfMPuC0"
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

# Create a temporary helper function to read pg_proc
create_fn_sql = """
CREATE OR REPLACE FUNCTION public.get_function_source(fn_name text)
RETURNS text AS $$
DECLARE
  src text;
BEGIN
  SELECT prosrc INTO src
  FROM pg_proc
  WHERE proname = fn_name
  ORDER BY oid DESC
  LIMIT 1;
  RETURN src;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
"""

# First, we need to create this helper. But we can't run raw SQL via REST...
# Instead, let's create a test function that checks what value calculate_points gives
create_test_sql = """
CREATE OR REPLACE FUNCTION public.test_scoring_formula()
RETURNS json AS $$
DECLARE
  fn_count integer;
  fn_sources text[];
BEGIN
  -- Count how many calculate_points functions exist
  SELECT count(*), array_agg(left(prosrc, 200))
  INTO fn_count, fn_sources
  FROM pg_proc
  WHERE proname = 'calculate_points';

  RETURN json_build_object(
    'function_count', fn_count,
    'sources_preview', fn_sources
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
"""

print("This requires running SQL directly in Supabase SQL Editor.")
print("Please run this in the SQL Editor to check:")
print()
print("-- Check how many calculate_points functions exist:")
print("SELECT proname, proargtypes::text, left(prosrc, 300)")
print("FROM pg_proc")
print("WHERE proname = 'calculate_points';")
print()
print("-- Quick test: what does the function give for a specific case?")
print("-- (We already know: exact=156, should be 80)")
print()
print("-- Check if THEN 80 appears in the function source:")
print("SELECT prosrc LIKE '%THEN 80%' as has_80,")
print("       prosrc LIKE '%THEN 30%' as has_30,")
print("       left(prosrc, 500)")
print("FROM pg_proc WHERE proname = 'calculate_points';")
