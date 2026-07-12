-- Confirmed Semi-final fixtures and two-way "to advance/reach final" decimal odds.
-- Source: FOX Sports / FanDuel "To Reach World Cup Final", updated 2026-07-12.
-- Knockout odds are qualification odds, including extra time and penalties,
-- so draw_odds is intentionally NULL.
--
-- Points use PostgreSQL's nearest-integer rounding of decimal odds * 20.
-- Match extras are 30 points each for odds-based knockout matches.

UPDATE public.matches AS m
SET
  home_team = v.home_team,
  away_team = v.away_team,
  home_win_odds = v.home_odds,
  draw_odds = NULL,
  away_win_odds = v.away_odds,
  bonus_questions = v.bonus_questions::jsonb,
  bonus_actuals = NULL,
  actual_scorers = NULL,
  home_score = NULL,
  away_score = NULL
FROM (VALUES
  (
    333::bigint,
    'France',
    1.63::decimal,
    'Spain',
    1.95::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"mbappe_scores","question":"Will Mbappe score?","options":["Yes","No"]},
      {"type":"yamal_scores","question":"Will Yamal score?","options":["Yes","No"]}
    ]'
  ),
  (
    334::bigint,
    'Argentina',
    1.87::decimal,
    'England',
    2.20::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"messi_scores","question":"Will Messi score?","options":["Yes","No"]},
      {"type":"kane_scores","question":"Will Kane score?","options":["Yes","No"]}
    ]'
  )
) AS v(id, home_team, home_odds, away_team, away_odds, bonus_questions)
WHERE m.id = v.id
  AND m.stage = 'Semi-final';

-- Sanity check after running:
-- SELECT id, stage, home_team, away_team, kickoff_utc,
--        home_win_odds, draw_odds, away_win_odds, bonus_questions
-- FROM public.matches
-- WHERE id BETWEEN 333 AND 334
-- ORDER BY id;
