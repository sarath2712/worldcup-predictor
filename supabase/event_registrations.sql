-- Event registrations table for Men's/Women's/Kids/PlayStation
-- Run this ENTIRE script in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Drop table if exists to start fresh (remove this line if you want to keep existing data)
DROP TABLE IF EXISTS event_registrations;

CREATE TABLE event_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  flat_number text NOT NULL,
  favourite_team text,
  category text NOT NULL CHECK (category IN ('mens', 'womens', 'kids', 'playstation')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(email, category)
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (register)
CREATE POLICY "Allow public insert" ON event_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous users to read
CREATE POLICY "Allow public select" ON event_registrations
  FOR SELECT TO anon, authenticated
  USING (true);

-- Also grant table-level permissions to both anon and authenticated roles
GRANT INSERT, SELECT ON event_registrations TO anon;
GRANT INSERT, SELECT ON event_registrations TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
