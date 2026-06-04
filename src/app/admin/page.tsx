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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">⚙️ Admin - Enter Results</h1>
      <p className="text-sm text-gray-500">
        Enter match scores, POTM, and scorers. Points are calculated automatically.
      </p>

      <div className="space-y-3">
        {matches.map((match) => (
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

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{match.home_team} vs {match.away_team}</p>
          <p className="text-xs text-gray-500">
            {match.stage} · {format(new Date(match.kickoff_utc), "MMM d, HH:mm")} UTC
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={home}
            onChange={(e) => setHome(e.target.value)}
            className="w-12 text-center border border-white/20 rounded py-1 bg-white/10 text-white"
            placeholder="H"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            value={away}
            onChange={(e) => setAway(e.target.value)}
            className="w-12 text-center border border-white/20 rounded py-1 bg-white/10 text-white"
            placeholder="A"
          />
          <button
            onClick={() => onSave(match.id, home, away, potm, scorers)}
            disabled={saving || !home || !away}
            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
          >
            {saving ? "..." : match.home_score !== null ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* POTM and Scorers */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-white/5">
        <input
          type="text"
          value={potm}
          onChange={(e) => setPotm(e.target.value)}
          className="flex-1 border border-white/20 rounded px-2 py-1 bg-white/10 text-white text-xs"
          placeholder="Player of the Match (20 pts)"
        />
        <input
          type="text"
          value={scorers}
          onChange={(e) => setScorers(e.target.value)}
          className="flex-1 border border-white/20 rounded px-2 py-1 bg-white/10 text-white text-xs"
          placeholder="Scorers (comma-separated, 15 pts each)"
        />
      </div>
    </div>
  );
}
