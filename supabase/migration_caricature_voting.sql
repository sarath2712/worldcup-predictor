-- Caricature contest voting.
-- One current vote per authenticated user. Users may change their vote by
-- voting for a different entry; the unique(user_id) constraint guarantees
-- there is only one stored vote per person.

CREATE TABLE IF NOT EXISTS public.caricature_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_id uuid NOT NULL REFERENCES public.caricature_entries(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.caricature_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own caricature vote" ON public.caricature_votes;
CREATE POLICY "Users can view own caricature vote"
  ON public.caricature_votes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own caricature vote" ON public.caricature_votes;
CREATE POLICY "Users can insert own caricature vote"
  ON public.caricature_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own caricature vote" ON public.caricature_votes;
CREATE POLICY "Users can update own caricature vote"
  ON public.caricature_votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.caricature_votes TO authenticated;

-- Optional admin/result query:
-- SELECT ce.id, ce.name, ce.flat_number, ce.file_url, count(cv.id) AS votes
-- FROM public.caricature_entries ce
-- LEFT JOIN public.caricature_votes cv ON cv.entry_id = ce.id
-- GROUP BY ce.id
-- ORDER BY votes DESC, ce.created_at ASC;
