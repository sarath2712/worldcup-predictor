-- Group Stage Predictions: predict 1st, 2nd, 3rd for each group + group stage top scorer
-- Scoring: 1st & 2nd correct = 50pts per group, 1st+2nd+3rd correct = 75pts per group
-- Group stage top scorer correct = 75pts

-- Table for group standings predictions (one row per user per group)
create table if not exists public.group_predictions (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  group_name text not null,          -- 'Group A', 'Group B', etc.
  predicted_first text not null,     -- Team predicted to finish 1st
  predicted_second text not null,    -- Team predicted to finish 2nd
  predicted_third text not null,     -- Team predicted to finish 3rd
  points integer,                    -- null until scored
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, group_name)
);

alter table public.group_predictions enable row level security;

create policy "Group predictions viewable by everyone"
  on public.group_predictions for select using (true);

create policy "Users can insert own group predictions"
  on public.group_predictions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own group predictions"
  on public.group_predictions for update
  using (auth.uid() = user_id);

-- Table for group stage top scorer prediction (one row per user)
create table if not exists public.group_topscorer_predictions (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  predicted_topscorer text not null,
  points integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.group_topscorer_predictions enable row level security;

create policy "Group topscorer predictions viewable by everyone"
  on public.group_topscorer_predictions for select using (true);

create policy "Users can insert own group topscorer prediction"
  on public.group_topscorer_predictions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own group topscorer prediction"
  on public.group_topscorer_predictions for update
  using (auth.uid() = user_id);

-- Updated leaderboard view to include group prediction points
create or replace view public.leaderboard as
select
  p.id as user_id,
  p.username,
  p.avatar_url,
  coalesce(pred_agg.pred_points, 0)
    + coalesce(extra_agg.extra_points, 0)
    + coalesce(tp.points, 0)
    + coalesce(gp_agg.group_points, 0)
    + coalesce(gts.points, 0) as total_points,
  coalesce(pred_agg.matches_scored, 0) as matches_scored,
  coalesce(pred_agg.exact_scores, 0) as exact_scores,
  coalesce(pred_agg.correct_outcomes, 0) as correct_outcomes,
  rank() over (order by (
    coalesce(pred_agg.pred_points, 0)
    + coalesce(extra_agg.extra_points, 0)
    + coalesce(tp.points, 0)
    + coalesce(gp_agg.group_points, 0)
    + coalesce(gts.points, 0)
  ) desc) as rank
from public.profiles p
left join (
  select user_id,
    sum(points) as pred_points,
    count(*) filter (where points is not null) as matches_scored,
    count(*) filter (where points = 30) as exact_scores,
    count(*) filter (where points >= 10) as correct_outcomes
  from public.predictions
  group by user_id
) pred_agg on pred_agg.user_id = p.id
left join (
  select user_id, sum(points) as extra_points
  from public.match_extras
  group by user_id
) extra_agg on extra_agg.user_id = p.id
left join public.tournament_predictions tp on tp.user_id = p.id
left join (
  select user_id, sum(points) as group_points
  from public.group_predictions
  group by user_id
) gp_agg on gp_agg.user_id = p.id
left join public.group_topscorer_predictions gts on gts.user_id = p.id;
