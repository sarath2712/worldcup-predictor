-- Migration: Remove red_card bonus question, replace with star_player / halftime / penalty
-- Every big-team match now gets star_player + one other bonus
-- Only updates upcoming matches (Jun 20 onwards). Already-played matches are untouched.

-- ============================================================
-- GROUP E — Germany (star: Musiala)
-- ============================================================
-- Jun 20: Germany vs Ivory Coast — was red_card + penalty → star_player + penalty
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Musiala score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Germany' AND away_team = 'Ivory Coast' AND stage = 'Group E';

-- Jun 25: Ecuador vs Germany — was halftime_leader only → add star_player
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Musiala score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Ecuador","Germany","Draw"]}
]'::jsonb WHERE home_team = 'Ecuador' AND away_team = 'Germany' AND stage = 'Group E';

-- ============================================================
-- GROUP H — Spain (star: Lamine Yamal)
-- ============================================================
-- Jun 21: Spain vs Saudi Arabia — was star_player + red_card → star_player + penalty
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Lamine Yamal score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Spain' AND away_team = 'Saudi Arabia' AND stage = 'Group H';

-- Jun 26: Uruguay vs Spain — was penalty only → add star_player
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Lamine Yamal score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Uruguay","Spain","Draw"]}
]'::jsonb WHERE home_team = 'Uruguay' AND away_team = 'Spain' AND stage = 'Group H';

-- ============================================================
-- GROUP I — France (star: Mbappé)
-- ============================================================
-- Jun 22: France vs Iraq — was red_card only → star_player + halftime
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Mbappé score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["France","Iraq","Draw"]}
]'::jsonb WHERE home_team = 'France' AND away_team = 'Iraq' AND stage = 'Group I';

-- Jun 26: Norway vs France — was halftime_leader only → add star_player
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Mbappé score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Norway' AND away_team = 'France' AND stage = 'Group I';

-- ============================================================
-- GROUP J — Argentina (star: Messi)
-- ============================================================
-- Jun 22: Argentina vs Austria — was halftime_leader + penalty → star_player + halftime
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Messi score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Argentina","Austria","Draw"]}
]'::jsonb WHERE home_team = 'Argentina' AND away_team = 'Austria' AND stage = 'Group J';

-- Jun 27: Jordan vs Argentina — was red_card only → star_player + penalty
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Messi score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Jordan' AND away_team = 'Argentina' AND stage = 'Group J';

-- ============================================================
-- GROUP K — Portugal (star: Ronaldo)
-- ============================================================
-- Jun 23: Portugal vs Uzbekistan — was penalty only → add star_player
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Ronaldo score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Portugal' AND away_team = 'Uzbekistan' AND stage = 'Group K';

-- Jun 27: Colombia vs Portugal — was halftime_leader only → add star_player
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Ronaldo score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Colombia","Portugal","Draw"]}
]'::jsonb WHERE home_team = 'Colombia' AND away_team = 'Portugal' AND stage = 'Group K';

-- ============================================================
-- GROUP L — England (star: Kane)
-- ============================================================
-- Jun 23: England vs Ghana — already has star_player + halftime ✓ (no change needed)

-- Jun 27: Panama vs England — was penalty only → add star_player
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Kane score?","options":["Yes","No"]},
  {"type":"penalty_awarded","question":"Will there be a penalty?","options":["Yes","No"]}
]'::jsonb WHERE home_team = 'Panama' AND away_team = 'England' AND stage = 'Group L';

-- ============================================================
-- GROUP C — Brazil (star: Vinicius Jr)
-- ============================================================
-- Jun 24: Scotland vs Brazil — was red_card only → star_player + halftime
UPDATE public.matches SET bonus_questions = '[
  {"type":"star_player_scores","question":"Will Vinicius Jr score?","options":["Yes","No"]},
  {"type":"halftime_leader","question":"Halftime Leader?","options":["Scotland","Brazil","Draw"]}
]'::jsonb WHERE home_team = 'Scotland' AND away_team = 'Brazil' AND stage = 'Group C';
