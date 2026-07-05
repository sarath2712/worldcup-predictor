-- Count exact scores by comparing predictions with results.
-- This changes no stored points, totals, or ranks.

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
  select predictions.user_id,
    sum(predictions.points) as pred_points,
    count(*) filter (where predictions.points is not null) as matches_scored,
    count(*) filter (
      where predictions.predicted_home = matches.home_score
        and predictions.predicted_away = matches.away_score
    ) as exact_scores,
    count(*) filter (where predictions.points >= 10) as correct_outcomes
  from public.predictions
  left join public.matches on matches.id = predictions.match_id
  group by predictions.user_id
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
