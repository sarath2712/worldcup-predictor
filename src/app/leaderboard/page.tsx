"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/types";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("total_points", { ascending: false });

      setEntries(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading leaderboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>

      {entries.length === 0 ? (
        <p className="text-gray-400">No predictions scored yet. Check back after the first match!</p>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Points</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Exact</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Correct</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry, i) => (
                <tr key={entry.user_id} className={i < 3 ? "bg-accent/5" : ""}>
                  <td className="px-4 py-3 font-bold text-lg">
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                    {entry.rank > 3 && entry.rank}
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.username}</td>
                  <td className="px-4 py-3 text-center font-bold text-accent">{entry.total_points}</td>
                  <td className="px-4 py-3 text-center text-sm">{entry.exact_scores}</td>
                  <td className="px-4 py-3 text-center text-sm">{entry.correct_outcomes}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">{entry.matches_scored}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-gray-400 bg-white/5 border border-white/10 p-4 rounded-lg space-y-1">
        <p><strong>Match Scoring:</strong> Exact score = 30 pts | Correct outcome = 10 pts | POTM = 20 pts | Each scorer = 15 pts</p>
        <p><strong>Tournament:</strong> Winner = 200 pts | Finalist = 180 pts | Golden Boot/Ball/Glove = 150 pts each</p>
      </div>
    </div>
  );
}
