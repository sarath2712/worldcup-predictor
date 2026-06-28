-- Add star-player scoring questions to marquee Round-of-32 fixtures.
-- Existing extra-time and penalty-shootout questions are retained.

UPDATE public.matches
SET bonus_questions = '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
  {"type":"star_player_scores","question":"Will Haaland score?","options":["Yes","No"]}
]'::jsonb
WHERE id = 309 AND stage = 'Round of 32';

UPDATE public.matches
SET bonus_questions = '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
  {"type":"star_player_scores","question":"Will Mbappe score?","options":["Yes","No"]}
]'::jsonb
WHERE id = 310 AND stage = 'Round of 32';

UPDATE public.matches
SET bonus_questions = '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
  {"type":"star_player_scores","question":"Will Kane score?","options":["Yes","No"]}
]'::jsonb
WHERE id = 312 AND stage = 'Round of 32';

UPDATE public.matches
SET bonus_questions = '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
  {"type":"star_player_scores","question":"Will Yamal score?","options":["Yes","No"]}
]'::jsonb
WHERE id = 315 AND stage = 'Round of 32';

UPDATE public.matches
SET bonus_questions = '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
  {"type":"star_player_scores","question":"Will Ronaldo score?","options":["Yes","No"]}
]'::jsonb
WHERE id = 316 AND stage = 'Round of 32';

UPDATE public.matches
SET bonus_questions = '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]},
  {"type":"star_player_scores","question":"Will Messi score?","options":["Yes","No"]}
]'::jsonb
WHERE id = 319 AND stage = 'Round of 32';
