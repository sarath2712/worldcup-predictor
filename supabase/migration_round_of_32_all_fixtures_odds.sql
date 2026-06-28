-- Complete Round of 32 bracket after all group matches.
-- Knockout odds are two-way qualification odds (including extra time and
-- penalties), so draw_odds is intentionally NULL.

UPDATE public.matches AS m
SET
  home_team = v.home_team,
  away_team = v.away_team,
  home_win_odds = v.home_odds,
  draw_odds = NULL,
  away_win_odds = v.away_odds
FROM (VALUES
  (305::bigint, 'South Africa', 2.45::decimal, 'Canada', 1.55::decimal),
  (306::bigint, 'Brazil', 1.25::decimal, 'Japan', 4.00::decimal),
  (307::bigint, 'Germany', 1.15::decimal, 'Paraguay', 5.50::decimal),
  (308::bigint, 'Netherlands', 1.65::decimal, 'Morocco', 2.15::decimal),
  (309::bigint, 'Ivory Coast', 2.70::decimal, 'Norway', 1.45::decimal),
  (310::bigint, 'France', 1.12::decimal, 'Sweden', 6.00::decimal),
  (311::bigint, 'Mexico', 1.65::decimal, 'Ecuador', 2.15::decimal),
  (312::bigint, 'England', 1.12::decimal, 'DR Congo', 6.50::decimal),
  (313::bigint, 'Belgium', 1.65::decimal, 'Senegal', 2.15::decimal),
  (314::bigint, 'United States', 1.40::decimal, 'Bosnia and Herzegovina', 2.80::decimal),
  (315::bigint, 'Spain', 1.25::decimal, 'Austria', 4.00::decimal),
  (316::bigint, 'Portugal', 1.45::decimal, 'Croatia', 2.70::decimal),
  (317::bigint, 'Switzerland', 1.35::decimal, 'Algeria', 3.20::decimal),
  (318::bigint, 'Australia', 1.90::decimal, 'Egypt', 1.90::decimal),
  (319::bigint, 'Argentina', 1.08::decimal, 'Cape Verde', 8.00::decimal),
  (320::bigint, 'Colombia', 1.35::decimal, 'Ghana', 3.20::decimal)
) AS v(id, home_team, home_odds, away_team, away_odds)
WHERE m.id = v.id
  AND m.stage = 'Round of 32';
