-- Confirmed FIFA World Cup 2026 tournament results and prediction scoring.
--
-- Scoring:
--   Winner 400, finalist 360, Golden Boot 300,
--   Golden Ball 300, Golden Glove 300.
--
-- Player-name comparisons ignore case, surrounding whitespace, accents, and
-- punctuation. Golden Boot predictions containing "Mbappe" are accepted to
-- cover submitted variants such as "Mbappe", "Kylian Mbappé",
-- "Klyian Mbappe", and "Kylian Mbappe/M.Olise".

CREATE OR REPLACE FUNCTION public.normalize_tournament_name(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT trim(
    regexp_replace(
      translate(
        lower(coalesce(value, '')),
        'áàâäãåéèêëíìîïóòôöõúùûüñç',
        'aaaaaaeeeeiiiiooooouuuunc'
      ),
      '[^a-z0-9]+',
      ' ',
      'g'
    )
  );
$$;

INSERT INTO public.tournament_results (
  id,
  actual_winner,
  actual_finalist,
  actual_top_scorer,
  actual_best_player,
  actual_best_goalkeeper,
  updated_at
)
VALUES (
  1,
  'Spain',
  'Argentina',
  'Kylian Mbappe',
  'Rodri',
  'Unai Simon',
  now()
)
ON CONFLICT (id) DO UPDATE
SET
  actual_winner = EXCLUDED.actual_winner,
  actual_finalist = EXCLUDED.actual_finalist,
  actual_top_scorer = EXCLUDED.actual_top_scorer,
  actual_best_player = EXCLUDED.actual_best_player,
  actual_best_goalkeeper = EXCLUDED.actual_best_goalkeeper,
  updated_at = EXCLUDED.updated_at;

CREATE OR REPLACE FUNCTION public.calculate_tournament_points()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.tournament_results%ROWTYPE;
BEGIN
  SELECT * INTO r
  FROM public.tournament_results
  WHERE id = 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  UPDATE public.tournament_predictions AS tp
  SET points =
    CASE
      WHEN r.actual_winner IS NOT NULL
       AND public.normalize_tournament_name(tp.predicted_winner)
           = public.normalize_tournament_name(r.actual_winner)
      THEN 400 ELSE 0
    END
    + CASE
      WHEN r.actual_finalist IS NOT NULL
       AND public.normalize_tournament_name(tp.predicted_finalist)
           = public.normalize_tournament_name(r.actual_finalist)
      THEN 360 ELSE 0
    END
    + CASE
      WHEN r.actual_top_scorer IS NOT NULL
       AND (
         public.normalize_tournament_name(tp.predicted_top_scorer)
           = public.normalize_tournament_name(r.actual_top_scorer)
         OR (
           public.normalize_tournament_name(r.actual_top_scorer) = 'kylian mbappe'
           AND public.normalize_tournament_name(tp.predicted_top_scorer)
             LIKE '%mbappe%'
         )
       )
      THEN 300 ELSE 0
    END
    + CASE
      WHEN r.actual_best_player IS NOT NULL
       AND public.normalize_tournament_name(tp.predicted_best_player)
           = public.normalize_tournament_name(r.actual_best_player)
      THEN 300 ELSE 0
    END
    + CASE
      WHEN r.actual_best_goalkeeper IS NOT NULL
       AND public.normalize_tournament_name(tp.predicted_best_goalkeeper)
           = public.normalize_tournament_name(r.actual_best_goalkeeper)
      THEN 300 ELSE 0
    END;
END;
$$;

SELECT public.calculate_tournament_points();

-- Sanity check after running:
-- SELECT p.username, tp.points
-- FROM public.tournament_predictions AS tp
-- JOIN public.profiles AS p ON p.id = tp.user_id
-- ORDER BY tp.points DESC, p.username;
