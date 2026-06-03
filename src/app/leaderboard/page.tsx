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
        <p className="text-gray-500">No predictions scored yet. Check back after the first match!</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
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
                <tr key={entry.user_id} className={i < 3 ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}>
                  <td className="px-4 py-3 font-bold text-lg">
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                    {entry.rank > 3 && entry.rank}
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.username}</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">{entry.total_points}</td>
                  <td className="px-4 py-3 text-center text-sm">{entry.exact_scores}</td>
                  <td className="px-4 py-3 text-center text-sm">{entry.correct_outcomes}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">{entry.matches_scored}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <strong>Scoring:</strong> Exact score prediction = 3 points | Correct outcome (Win/Draw/Loss) = 1 point | Wrong = 0 points
      </div>
    </div>
  );
}
