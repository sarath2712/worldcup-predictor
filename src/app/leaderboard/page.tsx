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
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("total_points", { ascending: false });

      setEntries(data || []);

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
          <table className="w-full min-w-[500px]">
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
                    {entry.rank === 1 && <span className="text-yellow-400">1st</span>}
                    {entry.rank === 2 && <span className="text-gray-300">2nd</span>}
                    {entry.rank === 3 && <span className="text-amber-600">3rd</span>}
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
        <p><strong>Match Scoring:</strong> Exact score = 30 pts | Correct outcome = 10 pts | POTM (knockout only) = 20 pts | First Goal = 15 pts</p>
        <p><strong>Tournament:</strong> Winner = 200 pts | Finalist = 180 pts | Golden Boot/Ball/Glove = 150 pts each</p>
      </div>

      {entries.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share to WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
