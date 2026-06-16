-- Migration: Add Match Extras (Bonus Questions) for big-team group matches
-- Each bonus question is worth 20 points
-- Only assigned to group matches involving: France, Brazil, Argentina, Portugal, Spain, England, Germany
-- Each qualifying match gets 1–2 randomly assigned bonus questions

-- ============================================================
-- 1. ADD COLUMNS
-- ============================================================

-- matches: stores the assigned questions and admin-entered actual answers
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS bonus_questions jsonb DEFAULT NULL;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS bonus_actuals jsonb DEFAULT NULL;

-- match_extras: stores each user's bonus answers
ALTER TABLE public.match_extras ADD COLUMN IF NOT EXISTS bonus_answers jsonb DEFAULT NULL;


-- ============================================================
-- 2. SEED BONUS QUESTIONS FOR BIG-TEAM GROUP MATCHES
-- ============================================================
-- Format: bonus_questions = [{"type":"...","question":"...","options":["A","B",...]}]
-- Types: star_player_scores, red_card, halftime_leader, penalty_awarded

-- GROUP C — Brazil (star: Vinicius Jr)
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Vinicius Jr score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Brazil","Morocco","Draw"]}
]'::jsonb WHERE home_team = 'Brazil' AND away_team = 'Morocco' AND stage = 'Group C';

UPDATE public.matches SET bonus_questions = '[
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Brazil' AND away_team = 'Haiti' AND stage = 'Group C';

UPDATE public.matches SET bonus_questions = '[
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Scotland' AND away_team = 'Brazil' AND stage = 'Group C';

-- GROUP E — Germany (star: Musiala)
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Musiala score?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Germany' AND away_team = 'Curaçao' AND stage = 'Group E';

UPDATE public.matches SET bonus_questions = '[
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Germany' AND away_team = 'Ivory Coast' AND stage = 'Group E';

UPDATE public.matches SET bonus_questions = '[
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Ecuador","Germany","Draw"]}
]'::jsonb WHERE home_team = 'Ecuador' AND away_team = 'Germany' AND stage = 'Group E';

-- GROUP H — Spain (star: Lamine Yamal)
UPDATE public.matches SET bonus_questions = '[
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Spain","Cape Verde","Draw"]}
]'::jsonb WHERE home_team = 'Spain' AND away_team = 'Cape Verde' AND stage = 'Group H';

UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Lamine Yamal score?","options":["Yes","No"]},
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Spain' AND away_team = 'Saudi Arabia' AND stage = 'Group H';

UPDATE public.matches SET bonus_questions = '[
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Uruguay' AND away_team = 'Spain' AND stage = 'Group H';

-- GROUP I — France (star: Mbappé)
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Mbappé score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'France' AND away_team = 'Senegal' AND stage = 'Group I';

UPDATE public.matches SET bonus_questions = '[
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'France' AND away_team = 'Iraq' AND stage = 'Group I';

UPDATE public.matches SET bonus_questions = '[
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Norway","France","Draw"]}
]'::jsonb WHERE home_team = 'Norway' AND away_team = 'France' AND stage = 'Group I';

-- GROUP J — Argentina (star: Messi)
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Messi score?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Argentina' AND away_team = 'Algeria' AND stage = 'Group J';

UPDATE public.matches SET bonus_questions = '[
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Argentina","Austria","Draw"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Argentina' AND away_team = 'Austria' AND stage = 'Group J';

UPDATE public.matches SET bonus_questions = '[
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Jordan' AND away_team = 'Argentina' AND stage = 'Group J';

-- GROUP K — Portugal (star: Ronaldo)
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Ronaldo score?","options":["Yes","No"]},
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Portugal' AND away_team = 'DR Congo' AND stage = 'Group K';

UPDATE public.matches SET bonus_questions = '[
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Portugal' AND away_team = 'Uzbekistan' AND stage = 'Group K';

UPDATE public.matches SET bonus_questions = '[
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Colombia","Portugal","Draw"]}
]'::jsonb WHERE home_team = 'Colombia' AND away_team = 'Portugal' AND stage = 'Group K';

-- GROUP L — England (star: Kane)
UPDATE public.matches SET bonus_questions = '[
  {"type":"red_card","question":"Will there be a red card?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'England' AND away_team = 'Croatia' AND stage = 'Group L';

UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Kane score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["England","Ghana","Draw"]}
]'::jsonb WHERE home_team = 'England' AND away_team = 'Ghana' AND stage = 'Group L';

UPDATE public.matches SET bonus_questions = '[
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Panama' AND away_team = 'England' AND stage = 'Group L';


-- ============================================================
-- 3. UPDATE SCORING FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.calculate_points(p_match_id bigint)
RETURNS void AS $$
DECLARE
  v_actual_potm text;
  v_actual_first_goal text;
  v_stage text;
  v_bonus_questions jsonb;
  v_bonus_actuals jsonb;
BEGIN
  -- Get actual match data
  SELECT actual_potm, actual_scorers, stage, bonus_questions, bonus_actuals
  INTO v_actual_potm, v_actual_first_goal, v_stage, v_bonus_questions, v_bonus_actuals
  FROM public.matches WHERE id = p_match_id;

  -- Score predictions (exact score = 30, correct outcome = 10, wrong = 0)
  UPDATE public.predictions
  SET points = CASE
    WHEN predicted_home = (SELECT home_score FROM public.matches WHERE id = p_match_id)
     AND predicted_away = (SELECT away_score FROM public.matches WHERE id = p_match_id)
    THEN 30
    WHEN sign(predicted_home - predicted_away) =
         sign((SELECT home_score FROM public.matches WHERE id = p_match_id) -
              (SELECT away_score FROM public.matches WHERE id = p_match_id))
    THEN 10
    ELSE 0
  END
  WHERE match_id = p_match_id;

  -- Score match extras (POTM=20 knockout only, first goal=15, bonus=20 each)
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
    -- Bonus question points (20 each correct answer)
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
