-- Store knockout winner predictions/actuals in match_extras bonus JSON:
--   winner_prediction = team name
-- Winner points use qualification odds and are independent of the exact score.

CREATE OR REPLACE FUNCTION public.calculate_points(p_match_id bigint)
RETURNS void AS $$
DECLARE
  v_actual_potm text;
  v_actual_first_goal text;
  v_stage text;
  v_bonus_questions jsonb;
  v_bonus_actuals jsonb;
  v_home_team text;
  v_away_team text;
  v_home_score integer;
  v_away_score integer;
  v_home_win_odds decimal;
  v_draw_odds decimal;
  v_away_win_odds decimal;
  v_actual_winner text;
  v_has_odds boolean;
  v_is_knockout boolean;
BEGIN
  SELECT actual_potm, actual_scorers, stage, bonus_questions, bonus_actuals,
         home_team, away_team, home_score, away_score,
         home_win_odds, draw_odds, away_win_odds
  INTO v_actual_potm, v_actual_first_goal, v_stage, v_bonus_questions, v_bonus_actuals,
       v_home_team, v_away_team, v_home_score, v_away_score,
       v_home_win_odds, v_draw_odds, v_away_win_odds
  FROM public.matches WHERE id = p_match_id;

  v_is_knockout := v_stage NOT LIKE 'Group%';
  v_actual_winner := v_bonus_actuals->>'winner_prediction';
  v_has_odds := v_home_win_odds IS NOT NULL
    AND v_away_win_odds IS NOT NULL
    AND (v_is_knockout OR v_draw_odds IS NOT NULL);

  UPDATE public.predictions p
  SET points = CASE
    WHEN v_is_knockout THEN
      (CASE WHEN p.predicted_home = v_home_score
                  AND p.predicted_away = v_away_score THEN 80 ELSE 0 END)
      +
      (CASE
        WHEN v_actual_winner IS NOT NULL
             AND (SELECT me.bonus_answers->>'winner_prediction'
                  FROM public.match_extras me
                  WHERE me.match_id = p_match_id AND me.user_id = p.user_id)
                 = v_actual_winner
        THEN CASE
          WHEN v_actual_winner = v_home_team THEN odds_to_points(v_home_win_odds)
          WHEN v_actual_winner = v_away_team THEN odds_to_points(v_away_win_odds)
          ELSE 0
        END
        ELSE 0
      END)
    WHEN p.predicted_home = v_home_score AND p.predicted_away = v_away_score THEN
      CASE WHEN v_has_odds THEN 80 + CASE
        WHEN v_home_score > v_away_score THEN odds_to_points(v_home_win_odds)
        WHEN v_home_score < v_away_score THEN odds_to_points(v_away_win_odds)
        ELSE odds_to_points(v_draw_odds)
      END ELSE 30 END
    WHEN sign(p.predicted_home - p.predicted_away) = sign(v_home_score - v_away_score) THEN
      CASE WHEN v_has_odds THEN CASE
        WHEN v_home_score > v_away_score THEN odds_to_points(v_home_win_odds)
        WHEN v_home_score < v_away_score THEN odds_to_points(v_away_win_odds)
        ELSE odds_to_points(v_draw_odds)
      END ELSE 10 END
    ELSE 0
  END
  WHERE p.match_id = p_match_id;

  UPDATE public.match_extras me
  SET points = (
    CASE WHEN v_actual_first_goal IS NOT NULL
          AND me.predicted_scorers IS NOT NULL
          AND lower(trim(me.predicted_scorers)) = lower(trim(v_actual_first_goal))
      THEN CASE WHEN v_has_odds THEN 30 ELSE 15 END ELSE 0 END
    +
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
      ELSE 0
    END
  )::integer
  WHERE me.match_id = p_match_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
