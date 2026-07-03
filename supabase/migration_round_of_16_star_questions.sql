-- Player-specific Round of 16 extras (30 points each).
-- Unique types allow multiple star questions on the same match.

update public.matches
set bonus_questions = bonus_questions || jsonb_build_array(
  jsonb_build_object(
    'type', 'mbappe_scores',
    'question', 'Will Mbappe score?',
    'options', jsonb_build_array('Yes', 'No')
  )
)
where id = 322
  and stage = 'Round of 16'
  and not bonus_questions @> '[{"type":"mbappe_scores"}]'::jsonb;

update public.matches
set bonus_questions = bonus_questions || jsonb_build_array(
  jsonb_build_object(
    'type', 'neymar_scores',
    'question', 'Will Neymar score?',
    'options', jsonb_build_array('Yes', 'No')
  ),
  jsonb_build_object(
    'type', 'haaland_scores',
    'question', 'Will Haaland score?',
    'options', jsonb_build_array('Yes', 'No')
  )
)
where id = 323
  and stage = 'Round of 16'
  and not bonus_questions @> '[{"type":"neymar_scores"}]'::jsonb
  and not bonus_questions @> '[{"type":"haaland_scores"}]'::jsonb;

update public.matches
set bonus_questions = bonus_questions || jsonb_build_array(
  jsonb_build_object(
    'type', 'ronaldo_scores',
    'question', 'Will Ronaldo score?',
    'options', jsonb_build_array('Yes', 'No')
  ),
  jsonb_build_object(
    'type', 'yamal_scores',
    'question', 'Will Yamal score?',
    'options', jsonb_build_array('Yes', 'No')
  )
)
where id = 325
  and stage = 'Round of 16'
  and not bonus_questions @> '[{"type":"ronaldo_scores"}]'::jsonb
  and not bonus_questions @> '[{"type":"yamal_scores"}]'::jsonb;

