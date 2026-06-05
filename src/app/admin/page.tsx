"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match } from "@/lib/types";
import { format } from "date-fns";

type TournamentResults = {
  actual_winner: string;
  actual_finalist: string;
  actual_top_scorer: string;
  actual_best_player: string;
  actual_best_goalkeeper: string;
};

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [filter, setFilter] = useState<"pending" | "completed" | "all">("pending");
  const [tournamentResults, setTournamentResults] = useState<TournamentResults>({
    actual_winner: "",
    actual_finalist: "",
    actual_top_scorer: "",
    actual_best_player: "",
    actual_best_goalkeeper: "",
  });
  const [savingTournament, setSavingTournament] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const { data } = await supabase
        .from("matches")
        .select("*")
        .order("kickoff_utc", { ascending: true });

      setMatches(data || []);

      // Load tournament results
      const { data: tr } = await supabase
        .from("tournament_results")
        .select("*")
        .eq("id", 1)
        .single();

      if (tr) {
        setTournamentResults({
          actual_winner: tr.actual_winner || "",
          actual_finalist: tr.actual_finalist || "",
          actual_top_scorer: tr.actual_top_scorer || "",
          actual_best_player: tr.actual_best_player || "",
          actual_best_goalkeeper: tr.actual_best_goalkeeper || "",
        });
      }

      setLoading(false);
    }
    load();
  }, []);

  const saveResult = async (
    matchId: number,
    homeScore: string,
    awayScore: string,
    actualPotm: string,
    actualScorers: string
  ) => {
    setSaving(matchId);

    // Update match result + extras
    await supabase
      .from("matches")
      .update({
        home_score: parseInt(homeScore),
        away_score: parseInt(awayScore),
        actual_potm: actualPotm || null,
        actual_scorers: actualScorers || null,
      })
      .eq("id", matchId);

    // Calculate points for all predictions on this match
    await supabase.rpc("calculate_points", { p_match_id: matchId });

    // Refresh
    const { data } = await supabase.from("matches").select("*").eq("id", matchId).single();
    if (data) {
      setMatches((prev) => prev.map((m) => (m.id === matchId ? data : m)));
    }
    setSaving(null);
  };

  const saveTournamentResults = async () => {
    setSavingTournament(true);

    // Upsert tournament results
    await supabase
      .from("tournament_results")
      .upsert({
        id: 1,
        actual_winner: tournamentResults.actual_winner || null,
        actual_finalist: tournamentResults.actual_finalist || null,
        actual_top_scorer: tournamentResults.actual_top_scorer || null,
        actual_best_player: tournamentResults.actual_best_player || null,
        actual_best_goalkeeper: tournamentResults.actual_best_goalkeeper || null,
        updated_at: new Date().toISOString(),
      });

    // Calculate tournament points
    await supabase.rpc("calculate_tournament_points");

    setSavingTournament(false);
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!isAdmin) return <div className="text-center py-16 text-red-600">Access denied. Admin only.</div>;

  const pendingMatches = matches.filter((m) => m.home_score === null);
  const completedMatches = matches.filter((m) => m.home_score !== null);
  const filteredMatches = filter === "pending" ? pendingMatches : filter === "completed" ? completedMatches : matches;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">⚙️ Admin - Enter Results</h1>

      {/* Scoring Guide */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
        <h3 className="text-sm font-bold text-accent mb-2">Scoring Reference (What Users Predict)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-300">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">30</p>
            <p>Exact Score</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">10</p>
            <p>Correct Winner</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">20</p>
            <p>POTM</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">15</p>
            <p>Each Scorer</p>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Fill in: Home Score, Away Score, Player of the Match, Goal Scorers (comma-separated). Points are auto-calculated on save.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["pending", "completed", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === f
                ? "bg-accent text-black"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            {f === "pending" ? `Pending (${pendingMatches.length})` : f === "completed" ? `Completed (${completedMatches.length})` : `All (${matches.length})`}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-3">
        {filteredMatches.length === 0 && (
          <p className="text-center text-gray-500 py-8">No matches in this category.</p>
        )}
        {filteredMatches.map((match) => (
          <AdminMatchRow
            key={match.id}
            match={match}
            saving={saving === match.id}
            onSave={saveResult}
          />
        ))}
      </div>

      {/* Tournament Results Section */}
      <div className="border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/><path d="M12 15v3"/><path d="M8 21h8"/></svg> Tournament Results</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter after tournament ends. Winner=200, Finalist=180, others=150 each.
        </p>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm space-y-3">
          {[
            { key: "actual_winner", label: "Winner (200 pts)" },
            { key: "actual_finalist", label: "Finalist (180 pts)" },
            { key: "actual_top_scorer", label: "Golden Boot (150 pts)" },
            { key: "actual_best_player", label: "Golden Ball (150 pts)" },
            { key: "actual_best_goalkeeper", label: "Golden Glove (150 pts)" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="w-40 text-sm text-gray-400">{label}</label>
              <input
                type="text"
                value={tournamentResults[key as keyof TournamentResults]}
                onChange={(e) =>
                  setTournamentResults((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="flex-1 border border-white/20 rounded px-3 py-1.5 bg-white/10 text-white text-sm"
                placeholder={`Enter ${label.split(" (")[0].toLowerCase()}`}
              />
            </div>
          ))}
          <button
            onClick={saveTournamentResults}
            disabled={savingTournament}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
          >
            {savingTournament ? "Saving..." : "Save & Score Tournament"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminMatchRow({
  match,
  saving,
  onSave,
}: {
  match: Match;
  saving: boolean;
  onSave: (id: number, home: string, away: string, potm: string, scorers: string) => void;
}) {
  const [home, setHome] = useState(match.home_score?.toString() || "");
  const [away, setAway] = useState(match.away_score?.toString() || "");
  const [potm, setPotm] = useState(match.actual_potm || "");
  const [scorers, setScorers] = useState(match.actual_scorers || "");
  const isCompleted = match.home_score !== null;
  const kickoff = new Date(match.kickoff_utc);
  const isPast = kickoff < new Date();

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm space-y-3 ${isCompleted ? "bg-green-500/5 border-green-500/20" : isPast ? "bg-yellow-500/5 border-yellow-500/20" : "bg-white/5 border-white/10"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{match.home_team} vs {match.away_team}</p>
            {isCompleted && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold">SCORED</span>}
            {!isCompleted && isPast && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-semibold">NEEDS RESULT</span>}
            {!isCompleted && !isPast && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-500 font-semibold">UPCOMING</span>}
          </div>
          <p className="text-xs text-gray-500">
            {match.stage} · {format(kickoff, "EEE, MMM d · HH:mm")}
          </p>
        </div>
      </div>

      {/* Score inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-end">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">{match.home_team} Goals</label>
          <input
            type="number"
            min="0"
            value={home}
            onChange={(e) => setHome(e.target.value)}
            className="w-full text-center border border-white/20 rounded-lg py-2 bg-white/10 text-white font-bold text-lg"
            placeholder="0"
          />
        </div>
        <span className="text-gray-500 font-bold text-center pb-2 hidden sm:block">—</span>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">{match.away_team} Goals</label>
          <input
            type="number"
            min="0"
            value={away}
            onChange={(e) => setAway(e.target.value)}
            className="w-full text-center border border-white/20 rounded-lg py-2 bg-white/10 text-white font-bold text-lg"
            placeholder="0"
          />
        </div>
        <button
          onClick={() => onSave(match.id, home, away, potm, scorers)}
          disabled={saving || !home || !away}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg disabled:opacity-50 hover:bg-green-700 transition font-semibold"
        >
          {saving ? "Saving..." : isCompleted ? "Update & Recalculate" : "Save & Calculate Points"}
        </button>
      </div>

      {/* POTM and Scorers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">Player of the Match (20 pts)</label>
          <input
            type="text"
            value={potm}
            onChange={(e) => setPotm(e.target.value)}
            className="w-full border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white text-sm"
            placeholder="e.g. Mbappé"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">Goal Scorers — comma separated (15 pts each)</label>
          <input
            type="text"
            value={scorers}
            onChange={(e) => setScorers(e.target.value)}
            className="w-full border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white text-sm"
            placeholder="e.g. Mbappé, Messi, Ronaldo"
          />
        </div>
      </div>
    </div>
  );
}
