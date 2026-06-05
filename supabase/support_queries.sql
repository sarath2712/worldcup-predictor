-- Support queries table for "Contact for Help" feature
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS support_queries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  user_email text NOT NULL,
  user_name text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'responded', 'closed')),
  admin_response text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE support_queries ENABLE ROW LEVEL SECURITY;

-- Users can insert their own queries
CREATE POLICY "Users can insert own queries" ON support_queries
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own queries
CREATE POLICY "Users can read own queries" ON support_queries
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all queries (check is_admin in profiles)
CREATE POLICY "Admins can read all queries" ON support_queries
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Admins can update queries (to respond/close)
CREATE POLICY "Admins can update queries" ON support_queries
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
