-- Migration: Replace "Goal Scorers" with "Team Scored First"
-- Run this in Supabase SQL Editor
-- The actual_scorers column in matches and predicted_scorers in match_extras
-- now store a single team name (or "None") instead of comma-separated scorer names.
-- No schema change needed - just the scoring function.

create or replace function public.calculate_points(p_match_id bigint)
returns void as $$
declare
  v_actual_potm text;
  v_actual_first_goal text;
begin
  -- Get actual match extras
  select actual_potm, actual_scorers
  into v_actual_potm, v_actual_first_goal
  from public.matches where id = p_match_id;

  -- Score predictions (exact score = 30, correct outcome = 10, wrong = 0)
  update public.predictions
  set points = case
    -- Exact score
    when predicted_home = (select home_score from public.matches where id = p_match_id)
     and predicted_away = (select away_score from public.matches where id = p_match_id)
    then 30
    -- Correct outcome (home win, draw, away win)
    when sign(predicted_home - predicted_away) =
         sign((select home_score from public.matches where id = p_match_id) -
              (select away_score from public.matches where id = p_match_id))
    then 10
    else 0
  end
  where match_id = p_match_id;

  -- Score match extras (POTM = 20, correct first goal team = 15)
  update public.match_extras me
  set points = (
    -- POTM points
    (case when v_actual_potm is not null
          and lower(trim(me.predicted_potm)) = lower(trim(v_actual_potm))
     then 20 else 0 end)
    +
    -- First goal points (15 if correct team/none matches)
    (case when v_actual_first_goal is not null
          and me.predicted_scorers is not null
          and lower(trim(me.predicted_scorers)) = lower(trim(v_actual_first_goal))
     then 15 else 0 end)
  )::integer
  where me.match_id = p_match_id;
end;
$$ language plpgsql security definer;
