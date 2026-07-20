"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry, Match } from "@/lib/types";
import { countryFlags } from "@/lib/flags";

function getFlag(team: string): string {
  return countryFlags[team] || "🏳️";
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [recentMatch, setRecentMatch] = useState<Match | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [
        leaderboardResponse,
        { data: groupPoints },
        { data: topScorerPoints },
        { data: tournamentPoints },
      ] = await Promise.all([
        fetch("/api/leaderboard", { cache: "no-store" }),
        supabase.from("group_predictions").select("user_id, points"),
        supabase.from("group_topscorer_predictions").select("user_id, points"),
        supabase.from("tournament_predictions").select("user_id, points"),
      ]);
      const leaderboardPayload = leaderboardResponse.ok
        ? await leaderboardResponse.json()
        : { entries: [] };
      const data = leaderboardPayload.entries as LeaderboardEntry[];

      const groupTotals = new Map<string, number>();
      for (const row of groupPoints || []) {
        groupTotals.set(row.user_id, (groupTotals.get(row.user_id) || 0) + (row.points || 0));
      }
      const topScorerTotals = new Map<string, number>();
      for (const row of topScorerPoints || []) {
        topScorerTotals.set(row.user_id, (topScorerTotals.get(row.user_id) || 0) + (row.points || 0));
      }
      const tournamentTotals = new Map<string, number>();
      for (const row of tournamentPoints || []) {
        tournamentTotals.set(row.user_id, (tournamentTotals.get(row.user_id) || 0) + (row.points || 0));
      }

      setEntries((data || []).map((entry) => ({
        ...entry,
        group_stage_points: groupTotals.get(entry.user_id) || 0,
        group_top_scorer_points: topScorerTotals.get(entry.user_id) || 0,
        tournament_points: tournamentTotals.get(entry.user_id) || 0,
      })));

      // Get most recent completed match
      const { data: recent } = await supabase
        .from("matches")
        .select("*")
        .not("home_score", "is", null)
        .order("kickoff_utc", { ascending: false })
        .limit(1);
      if (recent && recent.length > 0) setRecentMatch(recent[0]);

      // Get next 3 upcoming matches
      const { data: upcoming } = await supabase
        .from("matches")
        .select("*")
        .is("home_score", null)
        .order("kickoff_utc", { ascending: true })
        .limit(3);
      setUpcomingMatches(upcoming || []);

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading leaderboard...</div>;

  function buildWhatsAppMessage(): string {
    const top10 = entries.slice(0, 10);

    let msg = "*FIFA WC 2026 — PREDICTION LEADERBOARD*\n";
    msg += "---------------------------------------\n";

    if (recentMatch) {
      msg += `After: ${recentMatch.home_team} ${recentMatch.home_score}-${recentMatch.away_score} ${recentMatch.away_team}\n`;
    }

    msg += "\n*TOP 10*\n\n";

    for (const entry of top10) {
      const rank = String(entry.rank).padStart(2, " ");
      const exact = entry.exact_scores > 0 ? ` (${entry.exact_scores} exact)` : "";
      msg += `${rank}. ${entry.username} — *${entry.total_points} pts*${exact}\n`;
    }

    if (upcomingMatches.length > 0) {
      msg += "\n*UPCOMING MATCHES*\n";
      for (const m of upcomingMatches) {
        const kickoff = new Date(m.kickoff_utc);
        const ist = kickoff.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        msg += `${m.home_team} vs ${m.away_team} — ${ist} IST\n`;
      }
      msg += "\nPredict before kickoff!\n";
    }

    msg += "---------------------------------------\n";
    msg += "https://www.slgevents.in/matches";

    return msg;
  }

  function handleShareWhatsApp() {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  function handleCopy() {
    const msg = buildWhatsAppMessage();
    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/><path d="M12 15v3"/><path d="M8 21h8"/></svg> Leaderboard</h1>

      {entries.length === 0 ? (
        <p className="text-gray-400">No predictions scored yet. Check back after the first match!</p>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-x-auto">
          <table className="w-full min-w-[880px]">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Points</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Group Stage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Group Top Scorer</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tournament</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Exact</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Correct</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry, i) => (
                <tr key={entry.user_id} className={i < 3 ? "bg-accent/5" : ""}>
                  <td className="px-4 py-3 font-bold text-lg">
                    {entry.rank === 1 && <span className="text-yellow-400">1st</span>}
                    {entry.rank === 2 && <span className="text-gray-300">2nd</span>}
                    {entry.rank === 3 && <span className="text-amber-600">3rd</span>}
                    {entry.rank > 3 && entry.rank}
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.username}</td>
                  <td className="px-4 py-3 text-center font-bold text-accent">{entry.total_points}</td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-emerald-400">{entry.group_stage_points || 0}</td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-amber-400">{entry.group_top_scorer_points || 0}</td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-purple-400">{entry.tournament_points || 0}</td>
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
        <p><strong>Match Scoring:</strong> Exact score = 30 pts | Correct outcome = 10 pts | POTM (knockout only) = 20 pts | First Goal = 15 pts</p>
        <p><strong>Tournament:</strong> Winner = 400 pts | Finalist = 360 pts | Golden Boot/Ball/Glove = 300 pts each</p>
      </div>

      {entries.length > 0 && (
        <div className="flex gap-3">
        </div>
      )}
    </div>
  );
}
