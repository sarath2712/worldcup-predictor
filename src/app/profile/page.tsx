"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Prediction, Match } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

type PredictionWithMatch = Prediction & { matches: Match };
type MatchExtra = { match_id: number; predicted_scorers: string | null; predicted_potm: string | null; bonus_answers: Record<string, string> | null; points: number | null };
type Registration = { id: number; category: string; favourite_team: string; created_at: string };
type GroupPred = { group_name: string; predicted_first: string; predicted_second: string; predicted_third: string; points: number | null };
type TournamentPred = { predicted_winner: string | null; predicted_finalist: string | null; predicted_top_scorer: string | null; predicted_best_player: string | null; predicted_best_goalkeeper: string | null; points: number | null };
type GroupTopscorerPred = { predicted_topscorer: string; points: number | null };

export default function ProfilePage() {
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [extras, setExtras] = useState<Record<number, MatchExtra>>({});
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [groupPreds, setGroupPreds] = useState<GroupPred[]>([]);
  const [tournamentPred, setTournamentPred] = useState<TournamentPred | null>(null);
  const [groupTopscorer, setGroupTopscorer] = useState<GroupTopscorerPred | null>(null);
  const [userInfo, setUserInfo] = useState<{ username: string; email: string; mobile: string; flatNumber: string }>({ username: "", email: "", mobile: "", flatNumber: "" });
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, is_admin")
        .eq("id", user.id)
        .single();

      setUserInfo({
        username: profile?.username || user.user_metadata?.username || "",
        email: user.email || "",
        mobile: user.user_metadata?.mobile || "",
        flatNumber: user.user_metadata?.flat_number || "",
      });

      // Load event registrations by email
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("id, category, favourite_team, created_at")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      setRegistrations(regs || []);

      const { data } = await supabase
        .from("predictions")
        .select("*, matches(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const preds = (data || []) as PredictionWithMatch[];
      setPredictions(preds);

      // Load match extras (first scorer, bonus questions) for this user
      const { data: extrasData } = await supabase
        .from("match_extras")
        .select("match_id, predicted_scorers, predicted_potm, bonus_answers, points")
        .eq("user_id", user.id);
      const extrasMap: Record<number, MatchExtra> = {};
      (extrasData || []).forEach((e: MatchExtra) => { extrasMap[e.match_id] = e; });
      setExtras(extrasMap);

      // Calculate total points matching leaderboard (predictions + match_extras + tournament)
      const predPoints = preds.reduce((sum, p) => sum + (p.points || 0), 0);
      const extraPoints = (extrasData || []).reduce((sum: number, e: MatchExtra) => sum + (e.points || 0), 0);

      const { data: tournamentData } = await supabase
        .from("tournament_predictions")
        .select("predicted_winner, predicted_finalist, predicted_top_scorer, predicted_best_player, predicted_best_goalkeeper, points")
        .eq("user_id", user.id)
        .single();
      const tournamentPoints = tournamentData?.points || 0;
      if (tournamentData) setTournamentPred(tournamentData);

      // Load group predictions
      const { data: gpData } = await supabase
        .from("group_predictions")
        .select("group_name, predicted_first, predicted_second, predicted_third, points")
        .eq("user_id", user.id)
        .order("group_name");
      setGroupPreds(gpData || []);
      const groupPoints = (gpData || []).reduce((sum: number, g: GroupPred) => sum + (g.points || 0), 0);

      // Load group topscorer prediction
      const { data: gtsData } = await supabase
        .from("group_topscorer_predictions")
        .select("predicted_topscorer, points")
        .eq("user_id", user.id)
        .single();
      if (gtsData) setGroupTopscorer(gtsData);
      const gtsPoints = gtsData?.points || 0;

      setTotalPoints(predPoints + extraPoints + tournamentPoints + groupPoints + gtsPoints);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-8">
      <div className="flex gap-4 mb-2">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
          &larr; Home
        </Link>
        <Link href="/help" className="text-sm text-gray-400 hover:text-white transition">
          My Help Tickets &rarr;
        </Link>
      </div>

      {/* Profile Info */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{userInfo.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{userInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="font-medium">{userInfo.mobile || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Flat No.</p>
            <p className="font-medium">{userInfo.flatNumber || "—"}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link href="/change-password" className="text-sm text-primary hover:text-primary/80 transition">
            🔒 Change Password
          </Link>
        </div>
      </div>

      {/* Event Registrations */}
      {registrations.length > 0 && (
        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-3">My Registrations</h2>
          <div className="space-y-2">
            {registrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="font-medium capitalize">{reg.category.replace("_", " ")} Football</p>
                  {reg.favourite_team && <p className="text-xs text-gray-400">Team: {reg.favourite_team}</p>}
                </div>
                <p className="text-xs text-gray-500">{format(new Date(reg.created_at), "MMM d, yyyy")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Points */}
      <div className="p-5 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl border border-accent/30 backdrop-blur-sm text-center">
        <p className="text-sm text-gray-400 mb-1">Total Points</p>
        <p className="text-4xl font-extrabold text-accent">{totalPoints}</p>
        <p className="text-xs text-gray-500 mt-1">Match + Group + Tournament</p>
      </div>

      {/* Group Stage Predictions */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Group Stage Predictions</h2>
          <p className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">Points calculated after group stage</p>
        </div>
        {groupPreds.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupPreds.map((g) => (
                <div key={g.group_name} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-accent text-sm">{g.group_name}</p>
                    {g.points !== null ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        g.points >= 75 ? "bg-green-500/20 text-green-400" :
                        g.points >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        +{g.points}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-600">Pending</span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>{g.predicted_first}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-gray-300/20 text-gray-300 flex items-center justify-center text-[10px] font-bold">2</span>
                      <span>{g.predicted_second}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center text-[10px] font-bold">3</span>
                      <span>{g.predicted_third}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {groupTopscorer && (
              <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Group Stage Top Scorer</p>
                  <p className="text-xs text-gray-400">{groupTopscorer.predicted_topscorer}</p>
                </div>
                {groupTopscorer.points !== null ? (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    groupTopscorer.points > 0 ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}>
                    +{groupTopscorer.points}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600">Pending</span>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">
            No group predictions submitted. 🔒 Group stage predictions are now closed.
          </p>
        )}
      </div>

      {/* Tournament Predictions */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tournament Predictions</h2>
          <p className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">Points calculated after Final</p>
        </div>
        {tournamentPred ? (
          <div className="space-y-2">
            {[
              { label: "Winner", value: tournamentPred.predicted_winner, pts: 400 },
              { label: "Finalist", value: tournamentPred.predicted_finalist, pts: 360 },
              { label: "Top Scorer", value: tournamentPred.predicted_top_scorer, pts: 300 },
              { label: "Best Player", value: tournamentPred.predicted_best_player, pts: 300 },
              { label: "Best Goalkeeper", value: tournamentPred.predicted_best_goalkeeper, pts: 300 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.value || "—"}</p>
                </div>
                <span className="text-xs text-gray-500">Worth {item.pts} pts</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No tournament predictions submitted. Predictions are now locked.
          </p>
        )}
      </div>

      {/* Match Predictions */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Match Predictions</h2>
        </div>

      {predictions.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t made any predictions yet. Go to{" "}
          <a href="/matches" className="text-primary hover:underline">Matches</a> to start!
        </p>
      ) : (
        <div className="space-y-3">
          {predictions.map((pred) => {
            const match = pred.matches;
            const extra = extras[match.id];
            const matchTotal = (pred.points || 0) + (extra?.points || 0);
            const isKnockout = !match.stage.startsWith("Group");
            const hasOdds = Boolean(
              match.home_win_odds &&
              match.away_win_odds &&
              (isKnockout || match.draw_odds)
            );
            const isExactScore =
              match.home_score !== null &&
              match.away_score !== null &&
              pred.predicted_home === match.home_score &&
              pred.predicted_away === match.away_score;
            const predictedWinner = extra?.bonus_answers?.winner_prediction;
            const actualWinner = match.bonus_actuals?.winner_prediction;
            const winnerCorrect =
              isKnockout &&
              Boolean(predictedWinner) &&
              predictedWinner === actualWinner;
            const winnerOdds =
              predictedWinner === match.home_team
                ? match.home_win_odds
                : predictedWinner === match.away_team
                  ? match.away_win_odds
                  : null;
            const winnerPoints =
              winnerCorrect && winnerOdds ? Math.round(winnerOdds * 20) : 0;
            return (
              <div
                key={pred.id}
                className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {match.home_team} vs {match.away_team}
                    </p>
                    <p className="text-xs text-gray-500">
                      {match.stage} · {format(new Date(match.kickoff_utc), "MMM d, h:mm a")}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="font-bold">
                      {pred.predicted_home} - {pred.predicted_away}
                    </p>
                    <p className="text-xs text-gray-500">Your prediction</p>
                  </div>

                  <div className="text-center min-w-[60px]">
                    {match.home_score !== null ? (
                      (() => {
                        const isCorrect = (pred.points ?? 0) > 0 && !isExactScore;
                        return (
                          <>
                            <p className="font-bold text-sm">
                              {match.home_score} - {match.away_score}
                            </p>
                            <p className={`text-xs font-medium ${
                              isExactScore ? "text-green-600" :
                              isCorrect ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {isExactScore ? "Exact!" :
                               isCorrect ? `✓ +${pred.points}` : "✗ Wrong"}
                            </p>
                          </>
                        );
                      })()
                    ) : (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                  </div>

                  <div className="text-right min-w-[50px]">
                    {match.home_score !== null && (
                      <span className="font-bold text-accent">+{matchTotal}</span>
                    )}
                  </div>
                </div>

                {/* Points Breakdown */}
                {match.home_score !== null && (extra || pred.points !== null) && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-2 text-xs">
                    {pred.points !== null && !isKnockout && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                        Score: +{pred.points}
                      </span>
                    )}
                    {pred.points !== null && isKnockout && (
                      <>
                        <span className={`px-2 py-0.5 rounded-full ${
                          isExactScore
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          Exact score: {isExactScore ? "+80" : "+0"}
                        </span>
                        {predictedWinner && (
                          <span className={`px-2 py-0.5 rounded-full ${
                            winnerCorrect
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            Winner: {predictedWinner}{" "}
                            {winnerCorrect
                              ? `+${winnerPoints} (${winnerOdds?.toFixed(2)} × 20)`
                              : "+0"}
                          </span>
                        )}
                      </>
                    )}
                    {extra?.predicted_scorers && (() => {
                      const correct = match.actual_scorers && match.actual_scorers === extra.predicted_scorers;
                      const hasOddsMatch = match.home_win_odds && match.away_win_odds &&
                        (!match.stage.startsWith("Group") || match.draw_odds);
                      const fgPts = hasOddsMatch ? 30 : 15;
                      return (
                        <span className={`px-2 py-0.5 rounded-full ${
                          correct ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          First Goal: {extra.predicted_scorers} {correct ? `+${fgPts}` : "+0"}
                        </span>
                      );
                    })()}
                    {extra?.bonus_answers && (() => {
                      const actuals = match.bonus_actuals;
                      const hasOdds = match.home_win_odds && match.away_win_odds &&
                        (!match.stage.startsWith("Group") || match.draw_odds);
                      const bonusPts = hasOdds ? 30 : 20;
                      return Object.entries(extra.bonus_answers)
                        .filter(([key]) => key !== "winner_prediction")
                        .map(([key, val]) => {
                        const correct = actuals && actuals[key] === val;
                        return (
                          <span key={key} className={`px-2 py-0.5 rounded-full ${
                            correct ? "bg-purple-500/10 text-purple-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {key.replace(/_/g, " ")}: {val} {correct ? `+${bonusPts}` : "+0"}
                          </span>
                        );
                        });
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
