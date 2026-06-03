-- Migration: Full Scoring System
-- Run this in Supabase SQL Editor to upgrade from 3/1/0 to the new scoring system
-- Safe to run multiple times (uses IF NOT EXISTS and CREATE OR REPLACE)

-- 1. Add actual POTM and scorers columns to matches
alter table public.matches add column if not exists actual_potm text;
alter table public.matches add column if not exists actual_scorers text;

-- 2. Add points column to match_extras
alter table public.match_extras add column if not exists points integer;

-- 3. Add points column to tournament_predictions
alter table public.tournament_predictions add column if not exists points integer;

-- 4. Create tournament_results table (singleton)
create table if not exists public.tournament_results (
  id integer primary key default 1 check (id = 1),
  actual_winner text,
  actual_finalist text,
  actual_top_scorer text,
  actual_best_player text,
  actual_best_goalkeeper text,
  updated_at timestamptz default now()
);

alter table public.tournament_results enable row level security;

-- Drop existing policies if they exist (safe re-run)
drop policy if exists "Tournament results viewable by everyone" on public.tournament_results;
drop policy if exists "Only admins can insert tournament results" on public.tournament_results;
drop policy if exists "Only admins can update tournament results" on public.tournament_results;

create policy "Tournament results viewable by everyone"
  on public.tournament_results for select using (true);

create policy "Only admins can insert tournament results"
  on public.tournament_results for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Only admins can update tournament results"
  on public.tournament_results for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 5. Updated scoring function (exact=30, outcome=10, POTM=20, scorer=15 each)
create or replace function public.calculate_points(p_match_id bigint)
returns void as $$
declare
  v_actual_potm text;
  v_actual_scorers text[];
begin
  -- Get actual match extras
  select actual_potm, string_to_array(actual_scorers, ',')
  into v_actual_potm, v_actual_scorers
  from public.matches where id = p_match_id;

  -- Score predictions (exact score = 30, correct outcome = 10, wrong = 0)
  update public.predictions
  set points = case
    when predicted_home = (select home_score from public.matches where id = p_match_id)
     and predicted_away = (select away_score from public.matches where id = p_match_id)
    then 30
    when sign(predicted_home - predicted_away) =
         sign((select home_score from public.matches where id = p_match_id) -
              (select away_score from public.matches where id = p_match_id))
    then 10
    else 0
  end
  where match_id = p_match_id;

  -- Score match extras (POTM = 20, each correct scorer = 15)
  update public.match_extras me
  set points = (
    (case when v_actual_potm is not null
          and lower(trim(me.predicted_potm)) = lower(trim(v_actual_potm))
     then 20 else 0 end)
    +
    coalesce((
      select count(*) * 15
      from unnest(string_to_array(me.predicted_scorers, ',')) as ps(name)
      where v_actual_scorers is not null
        and lower(trim(ps.name)) = any(
          select lower(trim(s)) from unnest(v_actual_scorers) as s
        )
    ), 0)
  )::integer
  where me.match_id = p_match_id;
end;
$$ language plpgsql security definer;

-- 6. Tournament scoring function
create or replace function public.calculate_tournament_points()
returns void as $$
declare
  r record;
begin
  select * into r from public.tournament_results where id = 1;
  if not found then return; end if;

  update public.tournament_predictions tp
  set points = (
    (case when r.actual_winner is not null and lower(trim(tp.predicted_winner)) = lower(trim(r.actual_winner)) then 200 else 0 end)
    + (case when r.actual_finalist is not null and lower(trim(tp.predicted_finalist)) = lower(trim(r.actual_finalist)) then 180 else 0 end)
    + (case when r.actual_top_scorer is not null and lower(trim(tp.predicted_top_scorer)) = lower(trim(r.actual_top_scorer)) then 150 else 0 end)
    + (case when r.actual_best_player is not null and lower(trim(tp.predicted_best_player)) = lower(trim(r.actual_best_player)) then 150 else 0 end)
    + (case when r.actual_best_goalkeeper is not null and lower(trim(tp.predicted_best_goalkeeper)) = lower(trim(r.actual_best_goalkeeper)) then 150 else 0 end)
  );
end;
$$ language plpgsql security definer;

-- 7. Updated leaderboard view (includes match extras + tournament points)
create or replace view public.leaderboard as
select
  p.id as user_id,
  p.username,
  p.avatar_url,
  coalesce(pred_agg.pred_points, 0)
    + coalesce(extra_agg.extra_points, 0)
    + coalesce(tp.points, 0) as total_points,
  coalesce(pred_agg.matches_scored, 0) as matches_scored,
  coalesce(pred_agg.exact_scores, 0) as exact_scores,
  coalesce(pred_agg.correct_outcomes, 0) as correct_outcomes,
  rank() over (order by (
    coalesce(pred_agg.pred_points, 0)
    + coalesce(extra_agg.extra_points, 0)
    + coalesce(tp.points, 0)
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
left join public.tournament_predictions tp on tp.user_id = p.id;
