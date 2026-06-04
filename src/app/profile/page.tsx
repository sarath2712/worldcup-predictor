"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Prediction, Match } from "@/lib/types";
import { format } from "date-fns";

type PredictionWithMatch = Prediction & { matches: Match };

export default function ProfilePage() {
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [username, setUsername] = useState("");
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
        .select("username")
        .eq("id", user.id)
        .single();

      setUsername(profile?.username || "");

      const { data } = await supabase
        .from("predictions")
        .select("*, matches(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const preds = (data || []) as PredictionWithMatch[];
      setPredictions(preds);
      setTotalPoints(preds.reduce((sum, p) => sum + (p.points || 0), 0));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Predictions</h1>
        <div className="text-right">
          <p className="text-sm text-gray-400">@{username}</p>
          <p className="text-2xl font-bold text-accent">{totalPoints} pts</p>
        </div>
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
            return (
              <div
                key={pred.id}
                className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-between"
              >
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
                    <>
                      <p className="font-bold text-sm">
                        {match.home_score} - {match.away_score}
                      </p>
                      <p className={`text-xs font-medium ${
                        pred.points === 30 ? "text-green-600" :
                        pred.points === 10 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {pred.points === 30 ? "Exact!" :
                         pred.points === 10 ? "✓ Correct" : "✗ Wrong"}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </div>

                <div className="text-right min-w-[50px]">
                  {pred.points !== null && (
                    <span className="font-bold text-accent">+{pred.points}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
