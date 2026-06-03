-- FIFA World Cup 2026 Predictor - Database Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New Query)

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
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
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
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
-- Points: Exact score = 3, Correct outcome (W/D/L) = 1, Wrong = 0
create or replace function public.calculate_points(p_match_id bigint)
returns void as $$
begin
  update public.predictions
  set points = case
    -- Exact score
    when predicted_home = (select home_score from public.matches where id = p_match_id)
     and predicted_away = (select away_score from public.matches where id = p_match_id)
    then 3
    -- Correct outcome (home win, draw, away win)
    when sign(predicted_home - predicted_away) =
         sign((select home_score from public.matches where id = p_match_id) -
              (select away_score from public.matches where id = p_match_id))
    then 1
    else 0
  end
  where match_id = p_match_id;
end;
$$ language plpgsql security definer;

-- Leaderboard view
create or replace view public.leaderboard as
select
  p.id as user_id,
  p.username,
  p.avatar_url,
  coalesce(sum(pr.points), 0) as total_points,
  count(pr.id) filter (where pr.points is not null) as matches_scored,
  count(pr.id) filter (where pr.points = 3) as exact_scores,
  count(pr.id) filter (where pr.points >= 1) as correct_outcomes,
  rank() over (order by coalesce(sum(pr.points), 0) desc) as rank
from public.profiles p
left join public.predictions pr on pr.user_id = p.id
group by p.id, p.username, p.avatar_url;
