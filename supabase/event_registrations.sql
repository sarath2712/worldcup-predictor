-- Event registrations table for Men's/Women's/Kids Football
CREATE TABLE IF NOT EXISTS event_registrations (
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

-- Allow inserts from anon users (public registration)
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register" ON event_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read registrations" ON event_registrations
  FOR SELECT USING (true);
