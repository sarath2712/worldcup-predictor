-- Football Quiz & Story tables
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ========== QUIZ REGISTRATIONS ==========
CREATE TABLE IF NOT EXISTS quiz_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  flat_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert quiz" ON quiz_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public select quiz" ON quiz_registrations
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT INSERT, SELECT ON quiz_registrations TO anon;
GRANT INSERT, SELECT ON quiz_registrations TO authenticated;

-- ========== FOOTBALL STORIES ==========
CREATE TABLE IF NOT EXISTS football_stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  flat_number text NOT NULL,
  file_url text NOT NULL,
  file_name text,
  file_size integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE football_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert stories" ON football_stories
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public select stories" ON football_stories
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT INSERT, SELECT ON football_stories TO anon;
GRANT INSERT, SELECT ON football_stories TO authenticated;

-- ========== STORAGE BUCKET ==========
-- Create this manually in Supabase Dashboard > Storage > New Bucket:
-- Bucket name: football-stories
-- Public bucket: YES (so uploaded images can be viewed)
-- File size limit: 1048576 (1 MB)
-- Allowed MIME types: image/jpeg, image/png, image/heic, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
--
-- Then add these storage policies in SQL:
--
-- INSERT policy (allow anyone to upload):
-- CREATE POLICY "Allow public uploads" ON storage.objects
--   FOR INSERT TO anon, authenticated
--   WITH CHECK (bucket_id = 'football-stories');
--
-- SELECT policy (allow anyone to view):
-- CREATE POLICY "Allow public read stories" ON storage.objects
--   FOR SELECT TO anon, authenticated
--   USING (bucket_id = 'football-stories');
