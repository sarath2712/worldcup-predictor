-- FIFA World Cup 2026 Predictor - Database Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New Query)

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  flat_number text check (flat_number ~ '^\d{4}$'),
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, flat_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'flat_number'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Matches
create table public.matches (
  id bigint generated always as identity primary key,
  stage text not null,              -- 'Group A', 'Round of 32', 'Quarter-final', etc.
  home_team text not null,
  away_team text not null,
  kickoff_utc timestamptz not null,
  home_score integer,               -- null until result entered
  away_score integer,               -- null until result entered
  venue text,
  actual_potm text,                 -- Player of the Match (entered by admin)
  actual_scorers text,              -- Comma-separated scorer names (entered by admin)
  created_at timestamptz default now()
);

alter table public.matches enable row level security;

create policy "Matches are viewable by everyone"
  on public.matches for select using (true);

create policy "Only admins can insert matches"
  on public.matches for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Only admins can update matches"
  on public.matches for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Predictions
create table public.predictions (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  match_id bigint references public.matches(id) on delete cascade not null,
  predicted_home integer not null,
  predicted_away integer not null,
  points integer,                   -- null until scored
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, match_id)
);

alter table public.predictions enable row level security;

create policy "Users can view own predictions"
  on public.predictions for select
  using (auth.uid() = user_id);

create policy "Users can view others predictions after kickoff"
  on public.predictions for select
  using (
    exists (
      select 1 from public.matches
      where matches.id = predictions.match_id
      and matches.kickoff_utc < now()
    )
  );

create policy "Users can insert own predictions before deadline"
  on public.predictions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.matches
      where matches.id = match_id
      and matches.kickoff_utc > now() + interval '1 hour'
    )
  );

create policy "Users can update own predictions before deadline"
  on public.predictions for update
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.matches
      where matches.id = predictions.match_id
      and matches.kickoff_utc > now() + interval '1 hour'
    )
  );

-- Scoring function: call after admin enters a result
-- Points: Exact score = 30, Correct outcome (W/D/L) = 10, Wrong = 0
-- POTM = 20, Each correct scorer = 15
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
    -- Exact score
    when predicted_home = (select home_score from public.matches where id = p_match_id)
     and predicted_away = (select away_score from public.matches where id = p_match_id)
    then 30
    -- Correct outcome (home win, draw, away win)
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
    -- POTM points
    (case when v_actual_potm is not null
          and lower(trim(me.predicted_potm)) = lower(trim(v_actual_potm))
     then 20 else 0 end)
    +
    -- Scorer points (15 per correct scorer)
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

-- Leaderboard view (aggregates score, extras, and tournament points)
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

-- Match extras: Player of the Match & Scorers predictions per match
create table public.match_extras (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  match_id bigint references public.matches(id) on delete cascade not null,
  predicted_potm text,             -- Player of the Match prediction
  predicted_scorers text,          -- Comma-separated scorer names
  points integer,                  -- null until scored (POTM 20 + each scorer 15)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, match_id)
);

alter table public.match_extras enable row level security;

create policy "Users can view own match_extras"
  on public.match_extras for select using (auth.uid() = user_id);

create policy "Users can view others match_extras after kickoff"
  on public.match_extras for select
  using (exists (select 1 from public.matches where matches.id = match_extras.match_id and matches.kickoff_utc < now()));

create policy "Users can insert own match_extras before deadline"
  on public.match_extras for insert
  with check (auth.uid() = user_id and exists (select 1 from public.matches where matches.id = match_id and matches.kickoff_utc > now() + interval '1 hour'));

create policy "Users can update own match_extras before deadline"
  on public.match_extras for update
  using (auth.uid() = user_id and exists (select 1 from public.matches where matches.id = match_extras.match_id and matches.kickoff_utc > now() + interval '1 hour'));

-- Tournament predictions: one row per user
create table public.tournament_predictions (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  predicted_winner text,           -- World Cup Winner
  predicted_finalist text,         -- Runner-up / Finalist
  predicted_top_scorer text,       -- Golden Boot winner
  predicted_best_player text,      -- Player of the Tournament (Golden Ball)
  predicted_best_goalkeeper text,  -- Golden Glove
  points integer,                  -- null until scored
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tournament_predictions enable row level security;

create policy "Tournament predictions viewable by everyone"
  on public.tournament_predictions for select using (true);

create policy "Users can insert own tournament predictions"
  on public.tournament_predictions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tournament predictions before tournament starts"
  on public.tournament_predictions for update
  using (auth.uid() = user_id and now() < '2026-06-11 19:00:00+00'::timestamptz);

-- Tournament results: singleton table for admin to enter actual results
create table public.tournament_results (
  id integer primary key default 1 check (id = 1),
  actual_winner text,
  actual_finalist text,
  actual_top_scorer text,
  actual_best_player text,
  actual_best_goalkeeper text,
  updated_at timestamptz default now()
);

alter table public.tournament_results enable row level security;

create policy "Tournament results viewable by everyone"
  on public.tournament_results for select using (true);

create policy "Only admins can insert tournament results"
  on public.tournament_results for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Only admins can update tournament results"
  on public.tournament_results for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Tournament scoring function
-- Winner = 200, Finalist = 180, Top Scorer = 150, Best Player = 150, Best GK = 150
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
