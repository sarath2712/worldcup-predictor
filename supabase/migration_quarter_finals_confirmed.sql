-- Confirmed Quarter-final fixtures and two-way "to advance" decimal odds.
-- Source: FOX Sports / FanDuel "To Reach Semifinals", updated 2026-07-08.
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
    329::bigint,
    'France',
    1.25::decimal,
    'Morocco',
    3.80::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"mbappe_scores","question":"Will Mbappe score?","options":["Yes","No"]},
      {"type":"hakimi_scores","question":"Will Hakimi score?","options":["Yes","No"]}
    ]'
  ),
  (
    330::bigint,
    'Spain',
    1.27::decimal,
    'Belgium',
    3.50::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"yamal_scores","question":"Will Yamal score?","options":["Yes","No"]},
      {"type":"de_bruyne_scores","question":"Will De Bruyne score?","options":["Yes","No"]}
    ]'
  ),
  (
    331::bigint,
    'Norway',
    2.65::decimal,
    'England',
    1.42::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"haaland_scores","question":"Will Haaland score?","options":["Yes","No"]},
      {"type":"kane_scores","question":"Will Kane score?","options":["Yes","No"]}
    ]'
  ),
  (
    332::bigint,
    'Argentina',
    1.31::decimal,
    'Switzerland',
    3.20::decimal,
    '[
      {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
      {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
      {"type":"messi_scores","question":"Will Messi score?","options":["Yes","No"]},
      {"type":"xhaka_scores","question":"Will Xhaka score?","options":["Yes","No"]}
    ]'
  )
) AS v(id, home_team, home_odds, away_team, away_odds, bonus_questions)
WHERE m.id = v.id
  AND m.stage = 'Quarter-final';

-- Sanity check after running:
-- SELECT id, stage, home_team, away_team, kickoff_utc,
--        home_win_odds, draw_odds, away_win_odds, bonus_questions
-- FROM public.matches
-- WHERE id BETWEEN 329 AND 332
-- ORDER BY id;
