-- Confirmed Round of 16 fixtures and two-way "to advance" decimal odds.
-- Source: FanDuel via FOX Sports, updated 2026-07-02.
-- Points continue to use floor(decimal odds * 20), matching Round of 32.

update public.matches
set home_team = 'Canada',
    away_team = 'Morocco',
    home_win_odds = 3.25,
    draw_odds = null,
    away_win_odds = 1.33
where id = 321 and stage = 'Round of 16';

update public.matches
set home_team = 'Paraguay',
    away_team = 'France',
    home_win_odds = 12.40,
    draw_odds = null,
    away_win_odds = 1.06
where id = 322 and stage = 'Round of 16';

update public.matches
set home_team = 'Brazil',
    away_team = 'Norway',
    home_win_odds = 1.41,
    draw_odds = null,
    away_win_odds = 2.96
where id = 323 and stage = 'Round of 16';

update public.matches
set home_team = 'Mexico',
    away_team = 'England',
    home_win_odds = 2.10,
    draw_odds = null,
    away_win_odds = 1.75
where id = 324 and stage = 'Round of 16';

update public.matches
set home_team = 'Portugal',
    away_team = 'Spain',
    home_win_odds = 2.98,
    draw_odds = null,
    away_win_odds = 1.40
where id = 325 and stage = 'Round of 16';

update public.matches
set home_team = 'United States',
    away_team = 'Belgium',
    home_win_odds = 1.91,
    draw_odds = null,
    away_win_odds = 1.91
where id = 326 and stage = 'Round of 16';

