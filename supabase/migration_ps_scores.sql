-- Create ps_scores table for PlayStation tournament scores
CREATE TABLE IF NOT EXISTS ps_scores (
  id SERIAL PRIMARY KEY,
  match_id TEXT UNIQUE NOT NULL,
  score_p1 INTEGER NOT NULL DEFAULT 0,
  score_p2 INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ps_scores ENABLE ROW LEVEL SECURITY;

-- Everyone can read scores
CREATE POLICY "Anyone can read ps_scores"
  ON ps_scores FOR SELECT
  USING (true);

-- Only admin and Mithin can insert/update
CREATE POLICY "Admin can insert ps_scores"
  ON ps_scores FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      'c650a8d0-428e-49e3-a225-f2787bd8fd77'::uuid,  -- SARATHJS
      '13883ac7-d7e1-4007-9d45-3ed2b69c1f44'::uuid   -- Mithin Mathew
    )
  );

CREATE POLICY "Admin can update ps_scores"
  ON ps_scores FOR UPDATE
  USING (
    auth.uid() IN (
      'c650a8d0-428e-49e3-a225-f2787bd8fd77'::uuid,
      '13883ac7-d7e1-4007-9d45-3ed2b69c1f44'::uuid
    )
  );
