"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { getFlag } from "@/lib/flags";
import { groups, knockoutRounds } from "./data";

type Tab = "fixtures" | "tables";
type MatchRow = { id: number; stage: string; home_team: string; away_team: string; kickoff_utc: string; venue: string | null };

export default function FixturesPage() {
  const [tab, setTab] = useState<Tab>("fixtures");
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadMatches() {
      const { data } = await supabase
        .from("matches")
        .select("id, stage, home_team, away_team, kickoff_utc, venue")
        .order("kickoff_utc", { ascending: true });
      setMatches(data || []);
      setLoading(false);
    }
    loadMatches();
  }, []);

  // Group matches by date (IST - browser local time)
  const grouped = matches.reduce((acc, match) => {
    const dateKey = format(new Date(match.kickoff_utc), "EEE, MMM d");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {} as Record<string, MatchRow[]>);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-2 flex items-center gap-3"><svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> FIFA World Cup 2026</h1>
      <p className="text-gray-400 mb-1">June 11 – July 19, 2026 | USA, Mexico & Canada</p>
      <p className="text-xs text-gray-500 mb-6">All times in IST (Indian Standard Time)</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("fixtures")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            tab === "fixtures"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Fixtures by Day
        </button>
        <button
          onClick={() => setTab("tables")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            tab === "tables"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Group Tables
        </button>
      </div>

      {tab === "fixtures" ? (
        loading ? (
          <div className="text-center py-16 text-gray-400">Loading fixtures...</div>
        ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, dayMatches]) => (
            <div key={day} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-6 py-3 bg-accent/10 border-b border-white/10">
                <h2 className="text-lg font-bold text-accent">{day}</h2>
                <p className="text-xs text-gray-500">{dayMatches.length} matches</p>
              </div>
              <div className="divide-y divide-white/5">
                {dayMatches.map((match) => (
                  <div key={match.id} className="px-4 sm:px-6 py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
                        {match.stage}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(match.kickoff_utc), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                        <span className="text-sm font-medium text-right">{match.home_team}</span>
                        <span className="text-xl shrink-0">{getFlag(match.home_team)}</span>
                      </div>
                      <span className="text-accent font-bold text-sm px-2">vs</span>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{getFlag(match.away_team)}</span>
                        <span className="text-sm font-medium">{match.away_team}</span>
                      </div>
                    </div>
                    {match.venue && (
                      <p className="text-xs text-gray-500 text-center">📍 {match.venue}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Knockout Rounds */}
          <h2 className="text-3xl font-bold mt-12 mb-4 flex items-center gap-2"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Knockout Rounds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {knockoutRounds.map((round) => (
              <div key={round.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold mb-1">{round.name}</h3>
                <p className="text-sm text-gray-400">{round.dates}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {round.matches} {round.matches === 1 ? "match" : "matches"}
                  {round.venue && ` — ${round.venue}`}
                </p>
              </div>
            ))}
          </div>
        </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div key={group.name} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-5 py-3 bg-primary/20 border-b border-white/10">
                <h2 className="text-base font-bold">{group.name}</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-white/5">
                    <th className="text-left px-5 py-2 font-medium">Team</th>
                    <th className="px-2 py-2 font-medium w-8">P</th>
                    <th className="px-2 py-2 font-medium w-8">W</th>
                    <th className="px-2 py-2 font-medium w-8">D</th>
                    <th className="px-2 py-2 font-medium w-8">L</th>
                    <th className="px-2 py-2 font-medium w-10">GD</th>
                    <th className="px-2 py-2 font-medium w-10">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((team, idx) => (
                    <tr
                      key={team}
                      className={`border-b border-white/5 ${
                        idx < 2 ? "text-white" : "text-gray-500"
                      }`}
                    >
                      <td className="px-5 py-2.5 font-medium">{team}</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center font-bold">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
