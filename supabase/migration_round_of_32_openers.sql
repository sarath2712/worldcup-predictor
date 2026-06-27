-- Round of 32 opening fixtures
-- Confirmed teams, odds, and match-specific bonus question

UPDATE public.matches
SET
  home_team = 'South Africa',
  away_team = 'Canada',
  home_win_odds = 3.10,
  draw_odds = 3.20,
  away_win_odds = 2.30,
  bonus_questions = '[
    {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
    {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]}
  ]'::jsonb
WHERE id = 305 AND stage = 'Round of 32';

UPDATE public.matches
SET
  home_team = 'Brazil',
  away_team = 'Japan',
  home_win_odds = 1.45,
  draw_odds = 4.50,
  away_win_odds = 7.00,
  bonus_questions = '[
    {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
    {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
    {"type":"star_player_scores","question":"Will Neymar score?","options":["Yes","No"]}
  ]'::jsonb
WHERE id = 306 AND stage = 'Round of 32';
