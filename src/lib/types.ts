export type Match = {
  id: number;
  stage: string;
  home_team: string;
  away_team: string;
  kickoff_utc: string;
  home_score: number | null;
  away_score: number | null;
  venue: string | null;
};

export type Prediction = {
  id: number;
  user_id: string;
  match_id: number;
  predicted_home: number;
  predicted_away: number;
  points: number | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
};

export type LeaderboardEntry = {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  matches_scored: number;
  exact_scores: number;
  correct_outcomes: number;
  rank: number;
};

export type MatchExtras = {
  id: number;
  user_id: string;
  match_id: number;
  predicted_potm: string | null;
  predicted_scorers: string | null;
  created_at: string;
  updated_at: string;
};

export type TournamentPrediction = {
  id: number;
  user_id: string;
  predicted_winner: string | null;
  predicted_finalist: string | null;
  predicted_top_scorer: string | null;
  predicted_best_player: string | null;
  predicted_best_goalkeeper: string | null;
  created_at: string;
  updated_at: string;
};
