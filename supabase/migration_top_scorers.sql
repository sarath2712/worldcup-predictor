-- Migration: Top Scorers table for the World Cup
-- Admin updates this daily (morning 11 AM IST)

CREATE TABLE IF NOT EXISTS public.top_scorers (
  id serial PRIMARY KEY,
  rank integer NOT NULL,
  player_name text NOT NULL,
  team text NOT NULL,
  goals integer NOT NULL DEFAULT 0,
  assists integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- Allow public read access
ALTER TABLE public.top_scorers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Top scorers viewable by everyone"
  ON public.top_scorers FOR SELECT USING (true);

-- Only service role / admin can insert/update/delete (via API or dashboard)
