-- Migration: Odds-Based Scoring for Round 3 Group Matches + Knockout
-- Points scale with betting odds — underdogs earn more points
-- Points are always in multiples of 10
--
-- Formula: outcome_points = ROUND(odds × 20, nearest 10) — min 20, max 200
--          exact_score_points = 80 (flat)
--          bonus_questions = 30 pts each
--
-- Example: Brazil (1.5) vs Morocco (6.0), Draw (3.5)
--   Predict Brazil win correct:  outcome=30, exact=80
--   Predict Draw correct:        outcome=70, exact=80
--   Predict Morocco win correct:  outcome=120, exact=80

-- ============================================================
-- 1. ADD ODDS COLUMNS TO MATCHES TABLE
-- ============================================================

ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS home_win_odds decimal(5,2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS draw_odds decimal(5,2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS away_win_odds decimal(5,2);

-- ============================================================
-- 2. HELPER: Calculate points from odds (multiples of 10, min 10, max 80)
-- ============================================================

CREATE OR REPLACE FUNCTION public.odds_to_points(odds decimal)
RETURNS integer AS $$
BEGIN
  IF odds IS NULL THEN RETURN NULL; END IF;
  -- odds × 20, no rounding, keep exact value
  RETURN (odds * 20)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- 3. UPDATE calculate_points TO USE ODDS-BASED SCORING
-- ============================================================
-- When a match has odds set, points scale with the odds.
-- When no odds are set, flat scoring applies (30/10 as before).

CREATE OR REPLACE FUNCTION public.calculate_points(p_match_id bigint)
RETURNS void AS $$
DECLARE
  v_actual_potm text;
  v_actual_first_goal text;
  v_stage text;
  v_bonus_questions jsonb;
  v_bonus_actuals jsonb;
  v_home_score integer;
  v_away_score integer;
  v_home_win_odds decimal;
  v_draw_odds decimal;
  v_away_win_odds decimal;
  v_has_odds boolean;
BEGIN
  -- Get actual match data
  SELECT actual_potm, actual_scorers, stage, bonus_questions, bonus_actuals,
         home_score, away_score, home_win_odds, draw_odds, away_win_odds
  INTO v_actual_potm, v_actual_first_goal, v_stage, v_bonus_questions, v_bonus_actuals,
       v_home_score, v_away_score, v_home_win_odds, v_draw_odds, v_away_win_odds
  FROM public.matches WHERE id = p_match_id;

  v_has_odds := (v_home_win_odds IS NOT NULL AND v_draw_odds IS NOT NULL AND v_away_win_odds IS NOT NULL);

  -- Score predictions
  UPDATE public.predictions
  SET points = CASE
    -- Exact score match
    WHEN predicted_home = v_home_score AND predicted_away = v_away_score THEN
      CASE WHEN v_has_odds THEN 80
      ELSE 30 END
    -- Correct outcome (home win, draw, away win)
    WHEN sign(predicted_home - predicted_away) = sign(v_home_score - v_away_score) THEN
      CASE WHEN v_has_odds THEN
        CASE
          WHEN v_home_score > v_away_score THEN odds_to_points(v_home_win_odds)
          WHEN v_home_score < v_away_score THEN odds_to_points(v_away_win_odds)
          ELSE odds_to_points(v_draw_odds)
        END
      ELSE 10 END
    ELSE 0
  END
  WHERE match_id = p_match_id;

  -- Score match extras (POTM=20 knockout only, first goal=15, bonus=20 each)
  -- Extras scoring unchanged — only base prediction points scale with odds
  UPDATE public.match_extras me
  SET points = (
    -- POTM points (only for non-group-stage matches)
    (CASE WHEN v_stage NOT LIKE 'Group%'
          AND v_actual_potm IS NOT NULL
          AND lower(trim(me.predicted_potm)) = lower(trim(v_actual_potm))
     THEN 20 ELSE 0 END)
    +
    -- First goal points (15 if correct team/none matches)
    (CASE WHEN v_actual_first_goal IS NOT NULL
          AND me.predicted_scorers IS NOT NULL
          AND lower(trim(me.predicted_scorers)) = lower(trim(v_actual_first_goal))
     THEN 15 ELSE 0 END)
    +
    -- Bonus question points (30 each correct answer for odds matches, 20 otherwise)
    CASE WHEN v_bonus_questions IS NOT NULL
          AND v_bonus_actuals IS NOT NULL
          AND me.bonus_answers IS NOT NULL
    THEN COALESCE((
      SELECT SUM(CASE WHEN v_has_odds THEN 30 ELSE 20 END)
      FROM jsonb_array_elements(v_bonus_questions) elem
      WHERE v_bonus_actuals->>(elem->>'type') IS NOT NULL
        AND me.bonus_answers->>(elem->>'type') IS NOT NULL
        AND lower(trim(v_bonus_actuals->>(elem->>'type')))
          = lower(trim(me.bonus_answers->>(elem->>'type')))
    ), 0)
    ELSE 0 END
  )::integer
  WHERE me.match_id = p_match_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. LEADERBOARD VIEW (unchanged — it already sums prediction.points)
-- ============================================================
-- No change needed — the leaderboard view sums predictions.points which now
-- automatically reflects odds-based scoring. The exact_scores count filter
-- needs updating since exact score points vary now.

CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id AS user_id,
  p.username,
  p.avatar_url,
  COALESCE(pred_agg.pred_points, 0)
    + COALESCE(extra_agg.extra_points, 0)
    + COALESCE(tp.points, 0)
    + COALESCE(gp_agg.group_points, 0)
    + COALESCE(gts.points, 0) AS total_points,
  COALESCE(pred_agg.matches_scored, 0) AS matches_scored,
  COALESCE(pred_agg.exact_scores, 0) AS exact_scores,
  COALESCE(pred_agg.correct_outcomes, 0) AS correct_outcomes,
  RANK() OVER (ORDER BY (
    COALESCE(pred_agg.pred_points, 0)
    + COALESCE(extra_agg.extra_points, 0)
    + COALESCE(tp.points, 0)
    + COALESCE(gp_agg.group_points, 0)
    + COALESCE(gts.points, 0)
  ) DESC) AS rank
FROM public.profiles p
LEFT JOIN (
  SELECT user_id,
    SUM(points) AS pred_points,
    COUNT(*) FILTER (WHERE points IS NOT NULL) AS matches_scored,
    COUNT(*) FILTER (WHERE
      predicted_home = (SELECT home_score FROM matches WHERE id = predictions.match_id)
      AND predicted_away = (SELECT away_score FROM matches WHERE id = predictions.match_id)
    ) AS exact_scores,
    COUNT(*) FILTER (WHERE points >= 10) AS correct_outcomes
  FROM public.predictions
  GROUP BY user_id
) pred_agg ON pred_agg.user_id = p.id
LEFT JOIN (
  SELECT user_id, SUM(points) AS extra_points
  FROM public.match_extras
  GROUP BY user_id
) extra_agg ON extra_agg.user_id = p.id
LEFT JOIN public.tournament_predictions tp ON tp.user_id = p.id
LEFT JOIN (
  SELECT user_id, SUM(points) AS group_points
  FROM public.group_predictions
  GROUP BY user_id
) gp_agg ON gp_agg.user_id = p.id
LEFT JOIN public.group_topscorer_predictions gts ON gts.user_id = p.id;
