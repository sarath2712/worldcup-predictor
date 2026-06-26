-- Migration: Add Extra Time & Penalty Shootout bonus questions for all knockout matches
-- These two questions apply to every knockout match (Round of 32, Round of 16, Quarter-Final, Semi-Final, Final)
-- Points: 30 pts each (odds-based matches)

-- ============================================================
-- 1. ADD EXTRA TIME + PENALTY SHOOTOUT TO ALL KNOCKOUT MATCHES
-- ============================================================

-- For matches that already have bonus_questions set, append the two new questions
UPDATE public.matches
SET bonus_questions = COALESCE(bonus_questions, '[]'::jsonb) || '[
  {"type":"extra_time","question":"Will there be Extra Time?","options":["Yes","No"]},
  {"type":"penalty_shootout","question":"Will there be a Penalty Shootout?","options":["Yes","No"]}
]'::jsonb
WHERE stage IN ('Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Third-Place Play-off', 'Final');
