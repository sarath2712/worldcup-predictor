-- ============================================
-- ODDS FEATURE: Run this in Supabase SQL Editor
-- Adds odds columns + seeds Round 3 odds + scoring function
-- ============================================

-- 1. ADD COLUMNS
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS home_win_odds decimal(5,2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS draw_odds decimal(5,2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS away_win_odds decimal(5,2);

-- 2. HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.odds_to_points(odds decimal)
RETURNS integer AS $$
BEGIN
  IF odds IS NULL THEN RETURN NULL; END IF;
  RETURN LEAST(GREATEST(ROUND(odds) * 10, 10), 80)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. SEED ROUND 3 ODDS (source: Oddschecker, Jun 21 2026)
-- Format: home_win_odds, draw_odds, away_win_odds (decimal)

-- GROUP A
UPDATE public.matches SET home_win_odds=5.75, draw_odds=3.90, away_win_odds=1.67
  WHERE id=238; -- South Africa vs South Korea
UPDATE public.matches SET home_win_odds=4.00, draw_odds=3.80, away_win_odds=2.00
  WHERE id=237; -- Czech Republic vs Mexico

-- GROUP B
UPDATE public.matches SET home_win_odds=2.60, draw_odds=3.20, away_win_odds=2.80
  WHERE id=243; -- Switzerland vs Canada
UPDATE public.matches SET home_win_odds=2.40, draw_odds=3.30, away_win_odds=3.10
  WHERE id=244; -- Bosnia and Herzegovina vs Qatar

-- GROUP C
UPDATE public.matches SET home_win_odds=8.00, draw_odds=4.50, away_win_odds=1.40
  WHERE id=249; -- Scotland vs Brazil
UPDATE public.matches SET home_win_odds=1.25, draw_odds=5.50, away_win_odds=12.00
  WHERE id=250; -- Morocco vs Haiti

-- GROUP D
UPDATE public.matches SET home_win_odds=3.50, draw_odds=3.30, away_win_odds=2.10
  WHERE id=255; -- Turkey vs United States
UPDATE public.matches SET home_win_odds=2.70, draw_odds=3.20, away_win_odds=2.70
  WHERE id=256; -- Paraguay vs Australia

-- GROUP E
UPDATE public.matches SET home_win_odds=6.00, draw_odds=3.80, away_win_odds=1.55
  WHERE id=261; -- Curacao vs Ivory Coast
UPDATE public.matches SET home_win_odds=4.50, draw_odds=3.50, away_win_odds=1.80
  WHERE id=262; -- Ecuador vs Germany

-- GROUP F
UPDATE public.matches SET home_win_odds=2.15, draw_odds=3.50, away_win_odds=3.75
  WHERE id=267; -- Japan vs Sweden
UPDATE public.matches SET home_win_odds=23.00, draw_odds=8.00, away_win_odds=1.20
  WHERE id=268; -- Tunisia vs Netherlands

-- GROUP G
UPDATE public.matches SET home_win_odds=2.60, draw_odds=3.10, away_win_odds=2.90
  WHERE id=273; -- Egypt vs Iran
UPDATE public.matches SET home_win_odds=8.50, draw_odds=4.50, away_win_odds=1.35
  WHERE id=274; -- New Zealand vs Belgium

-- GROUP H
UPDATE public.matches SET home_win_odds=6.50, draw_odds=4.50, away_win_odds=1.57
  WHERE id=280; -- Uruguay vs Spain
UPDATE public.matches SET home_win_odds=2.80, draw_odds=3.70, away_win_odds=2.50
  WHERE id=279; -- Cape Verde vs Saudi Arabia

-- GROUP I
UPDATE public.matches SET home_win_odds=4.50, draw_odds=3.50, away_win_odds=1.80
  WHERE id=285; -- Norway vs France
UPDATE public.matches SET home_win_odds=1.90, draw_odds=3.40, away_win_odds=4.20
  WHERE id=286; -- Senegal vs Iraq

-- GROUP J
UPDATE public.matches SET home_win_odds=9.00, draw_odds=4.50, away_win_odds=1.30
  WHERE id=292; -- Jordan vs Argentina
UPDATE public.matches SET home_win_odds=3.20, draw_odds=3.30, away_win_odds=2.30
  WHERE id=291; -- Algeria vs Austria

-- GROUP K
UPDATE public.matches SET home_win_odds=3.75, draw_odds=3.50, away_win_odds=2.10
  WHERE id=297; -- Colombia vs Portugal
UPDATE public.matches SET home_win_odds=2.15, draw_odds=3.70, away_win_odds=3.50
  WHERE id=298; -- DR Congo vs Uzbekistan

-- GROUP L
UPDATE public.matches SET home_win_odds=10.00, draw_odds=5.00, away_win_odds=1.25
  WHERE id=303; -- Panama vs England
UPDATE public.matches SET home_win_odds=1.90, draw_odds=3.40, away_win_odds=4.20
  WHERE id=304; -- Croatia vs Ghana

-- 4. UPDATE SCORING FUNCTION (odds-aware)
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
  SELECT actual_potm, actual_scorers, stage, bonus_questions, bonus_actuals,
         home_score, away_score, home_win_odds, draw_odds, away_win_odds
  INTO v_actual_potm, v_actual_first_goal, v_stage, v_bonus_questions, v_bonus_actuals,
       v_home_score, v_away_score, v_home_win_odds, v_draw_odds, v_away_win_odds
  FROM public.matches WHERE id = p_match_id;

  v_has_odds := (v_home_win_odds IS NOT NULL AND v_draw_odds IS NOT NULL AND v_away_win_odds IS NOT NULL);

  UPDATE public.predictions
  SET points = CASE
    WHEN predicted_home = v_home_score AND predicted_away = v_away_score THEN
      CASE WHEN v_has_odds THEN
        CASE
          WHEN v_home_score > v_away_score THEN odds_to_points(v_home_win_odds) * 3
          WHEN v_home_score < v_away_score THEN odds_to_points(v_away_win_odds) * 3
          ELSE odds_to_points(v_draw_odds) * 3
        END
      ELSE 30 END
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

  UPDATE public.match_extras me
  SET points = (
    (CASE WHEN v_stage NOT LIKE 'Group%'
          AND v_actual_potm IS NOT NULL
          AND lower(trim(me.predicted_potm)) = lower(trim(v_actual_potm))
     THEN 20 ELSE 0 END)
    +
    (CASE WHEN v_actual_first_goal IS NOT NULL
          AND me.predicted_scorers IS NOT NULL
          AND lower(trim(me.predicted_scorers)) = lower(trim(v_actual_first_goal))
     THEN 15 ELSE 0 END)
    +
    CASE WHEN v_bonus_questions IS NOT NULL
          AND v_bonus_actuals IS NOT NULL
          AND me.bonus_answers IS NOT NULL
    THEN COALESCE((
      SELECT SUM(20)
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

-- 5. VERIFY
SELECT id, home_team, away_team, home_win_odds, draw_odds, away_win_odds,
       odds_to_points(home_win_odds) as home_pts,
       odds_to_points(draw_odds) as draw_pts,
       odds_to_points(away_win_odds) as away_pts
FROM public.matches
WHERE home_win_odds IS NOT NULL
ORDER BY kickoff_utc;
