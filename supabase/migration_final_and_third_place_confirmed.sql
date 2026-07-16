-- Confirmed Third Place and Final fixtures.
--
-- Final odds source: FOX Sports / FanDuel "TO ADVANCE", updated 2026-07-15.
--   Spain -154 => 1.65 decimal, Argentina +134 => 2.34 decimal.
--
-- Third-place odds source: DraftKings Network opening 3-way regulation odds,
-- updated 2026-07-15. DraftKings listed France +105, Draw +255, England +255.
-- The app's knockout scoring expects a two-way winner/advance style market, so
-- these third-place odds are converted from France/England regulation implied
-- probabilities excluding draw: France 1.58, England 2.73.
--
-- Knockout odds are winner/placement odds, including extra time and penalties
-- where applicable, so draw_odds is intentionally NULL.
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
    335::bigint,
    'France',
    1.58::decimal,
    'England',
    2.73::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"mbappe_scores","question":"Will Mbappe score?","options":["Yes","No"]},
      {"type":"kane_scores","question":"Will Kane score?","options":["Yes","No"]}
    ]'
  ),
  (
    336::bigint,
    'Spain',
    1.65::decimal,
    'Argentina',
    2.34::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"yamal_scores","question":"Will Yamal score?","options":["Yes","No"]},
      {"type":"messi_scores","question":"Will Messi score?","options":["Yes","No"]}
    ]'
  )
) AS v(id, home_team, home_odds, away_team, away_odds, bonus_questions)
WHERE m.id = v.id
  AND m.stage IN ('Third Place', 'Third-Place Play-off', 'Final');

-- Sanity check after running:
-- SELECT id, stage, home_team, away_team, kickoff_utc,
--        home_win_odds, draw_odds, away_win_odds, bonus_questions
-- FROM public.matches
-- WHERE id BETWEEN 335 AND 336
-- ORDER BY id;
