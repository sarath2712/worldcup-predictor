"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Match } from "@/lib/types";
import { format } from "date-fns";

type Registration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  flat_number: string;
  favourite_team: string;
  age: number | null;
  category: string;
  created_at: string;
};

type Prediction = {
  id: number;
  user_id: string;
  predicted_winner: string;
  predicted_finalist: string;
  predicted_top_scorer: string;
  predicted_best_player: string;
  predicted_best_goalkeeper: string;
  created_at: string;
  profiles?: { username: string; };
};

type TournamentResults = {
  actual_winner: string;
  actual_finalist: string;
  actual_top_scorer: string;
  actual_best_player: string;
  actual_best_goalkeeper: string;
};

type MatchPrediction = {
  id: number;
  user_id: string;
  match_id: number;
  predicted_home: number;
  predicted_away: number;
  points: number | null;
  created_at: string;
  profiles?: { username: string };
  matches?: { home_team: string; away_team: string; kickoff_utc: string };
};

type SupportQuery = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  subject: string;
  message: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
};

const categoryLabels: Record<string, string> = {
  mens: "Men's Football",
  womens: "Women's Football",
  kids: "Kids Football",
  playstation: "PlayStation World Cup",
};

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [matchPredictions, setMatchPredictions] = useState<MatchPrediction[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"match-results" | "registrations" | "predictions" | "support">("match-results");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [matchFilter, setMatchFilter] = useState<"pending" | "completed" | "all">("pending");
  const [saving, setSaving] = useState<number | null>(null);
  const [tournamentResults, setTournamentResults] = useState<TournamentResults>({
    actual_winner: "",
    actual_finalist: "",
    actual_top_scorer: "",
    actual_best_player: "",
    actual_best_goalkeeper: "",
  });
  const [savingTournament, setSavingTournament] = useState(false);
  const [supportQueries, setSupportQueries] = useState<SupportQuery[]>([]);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
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

      // Load registrations
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (regs) setRegistrations(regs);

      // Load tournament predictions
      try {
        const { data: preds } = await supabase
          .from("tournament_predictions")
          .select("*, profiles(username)")
          .order("created_at", { ascending: false });
        if (preds) setPredictions(preds);
      } catch {
        // table may not exist
      }

      // Load match predictions
      try {
        const { data: mpreds } = await supabase
          .from("predictions")
          .select("*, profiles(username), matches(home_team, away_team, kickoff_utc)")
          .order("created_at", { ascending: false });
        if (mpreds) setMatchPredictions(mpreds);
      } catch {
        // table may not exist
      }

      // Load matches
      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .order("kickoff_utc", { ascending: true });

      setMatches(matchData || []);

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

      // Load support queries
      try {
        const { data: sq } = await supabase
          .from("support_queries")
          .select("*")
          .order("created_at", { ascending: false });
        if (sq) setSupportQueries(sq);
      } catch {
        // table may not exist yet
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

    await supabase.rpc("calculate_tournament_points");

    setSavingTournament(false);
  };

  const respondToQuery = async (queryId: string) => {
    if (!responseText.trim()) return;

    await supabase
      .from("support_queries")
      .update({
        admin_response: responseText,
        status: "responded",
        responded_at: new Date().toISOString(),
      })
      .eq("id", queryId);

    setSupportQueries((prev) =>
      prev.map((q) =>
        q.id === queryId ? { ...q, admin_response: responseText, status: "responded", responded_at: new Date().toISOString() } : q
      )
    );
    setRespondingTo(null);
    setResponseText("");
  };

  const closeQuery = async (queryId: string) => {
    await supabase
      .from("support_queries")
      .update({ status: "closed" })
      .eq("id", queryId);

    setSupportQueries((prev) =>
      prev.map((q) => (q.id === queryId ? { ...q, status: "closed" } : q))
    );
  };

  const filteredRegistrations =
    filterCategory === "all"
      ? registrations
      : registrations.filter((r) => r.category === filterCategory);

  const categoryCounts = registrations.reduce(
    (acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return <div className="text-center py-16 text-red-600">Access denied. Admin only.</div>;

  const pendingMatches = matches.filter((m) => m.home_score === null);
  const completedMatches = matches.filter((m) => m.home_score !== null);
  const filteredMatches = matchFilter === "pending" ? pendingMatches : matchFilter === "completed" ? completedMatches : matches;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex gap-4 mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
          &larr; Home
        </Link>
        <Link href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition">
          Leaderboard &rarr;
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        ⚙️ Admin Console
      </h1>
      <p className="text-gray-400 mb-6">Manage match results, registrations, and predictions</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{registrations.length}</p>
          <p className="text-xs text-gray-400">Total Registrations</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-600/20 to-green-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{pendingMatches.length}</p>
          <p className="text-xs text-gray-400">Pending Matches</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{completedMatches.length}</p>
          <p className="text-xs text-gray-400">Scored Matches</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{matchPredictions.length + predictions.length}</p>
          <p className="text-xs text-gray-400">Total Predictions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab("match-results")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "match-results" ? "bg-accent text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Match Results
        </button>
        <button
          onClick={() => setActiveTab("registrations")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "registrations" ? "bg-accent text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Registrations ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab("predictions")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "predictions" ? "bg-accent text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Predictions ({predictions.length})
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "support" ? "bg-accent text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Support ({supportQueries.filter(q => q.status === "open").length})
        </button>
      </div>

      {/* ===== MATCH RESULTS TAB ===== */}
      {activeTab === "match-results" && (
        <div className="space-y-6">
          {/* Scoring Guide */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <h3 className="text-sm font-bold text-accent mb-2">Scoring Reference</h3>
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

          {/* Match Filter Tabs */}
          <div className="flex items-center gap-2">
            {(["pending", "completed", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setMatchFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  matchFilter === f
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
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/><path d="M12 15v3"/><path d="M8 21h8"/></svg>
              Tournament Results
            </h2>
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
      )}

      {/* ===== REGISTRATIONS TAB ===== */}
      {activeTab === "registrations" && (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "mens", "womens", "kids", "playstation"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filterCategory === cat
                    ? "bg-accent text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat === "all" ? "All" : categoryLabels[cat] || cat} ({cat === "all" ? registrations.length : categoryCounts[cat] || 0})
              </button>
            ))}
          </div>

          {/* Registrations Table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs">
                    <th className="text-left px-4 py-3 font-medium">#</th>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Phone</th>
                    <th className="text-left px-4 py-3 font-medium">Flat</th>
                    <th className="text-left px-4 py-3 font-medium">Team/Skill</th>
                    <th className="text-left px-4 py-3 font-medium">Age</th>
                    <th className="text-left px-4 py-3 font-medium">Category</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg, idx) => (
                    <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-medium">{reg.name}</td>
                      <td className="px-4 py-2.5 text-gray-400">{reg.email}</td>
                      <td className="px-4 py-2.5 text-gray-400">{reg.phone}</td>
                      <td className="px-4 py-2.5 text-gray-400">{reg.flat_number}</td>
                      <td className="px-4 py-2.5 text-gray-400">{reg.favourite_team || "-"}</td>
                      <td className="px-4 py-2.5 text-gray-400">{reg.age || "-"}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300">
                          {categoryLabels[reg.category] || reg.category}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-gray-500">
                        No registrations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===== PREDICTIONS TAB ===== */}
      {activeTab === "predictions" && (
        <div className="space-y-6">
          {/* Prediction Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 border border-white/10 p-4">
              <p className="text-2xl font-bold">{new Set([...matchPredictions.map(p => p.user_id), ...predictions.map(p => p.user_id)]).size}</p>
              <p className="text-xs text-gray-400">Users Participating</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-white/10 p-4">
              <p className="text-2xl font-bold">{matchPredictions.length}</p>
              <p className="text-xs text-gray-400">Match Predictions</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-white/10 p-4">
              <p className="text-2xl font-bold">{predictions.length}</p>
              <p className="text-xs text-gray-400">Tournament Predictions</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-white/10 p-4">
              <p className="text-2xl font-bold">{new Set(matchPredictions.map(p => p.user_id)).size}</p>
              <p className="text-xs text-gray-400">Match Predictors</p>
            </div>
          </div>

          {/* Per-user summary */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-gray-300">Per-User Prediction Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs">
                    <th className="text-left px-4 py-3 font-medium">#</th>
                    <th className="text-left px-4 py-3 font-medium">User</th>
                    <th className="text-center px-4 py-3 font-medium">Match Predictions</th>
                    <th className="text-center px-4 py-3 font-medium">Tournament</th>
                    <th className="text-center px-4 py-3 font-medium">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const userMap = new Map<string, { username: string; matchCount: number; hasTournament: boolean; points: number }>();
                    matchPredictions.forEach((mp) => {
                      const uid = mp.user_id;
                      const existing = userMap.get(uid) || { username: mp.profiles?.username || uid.slice(0, 8), matchCount: 0, hasTournament: false, points: 0 };
                      existing.matchCount++;
                      existing.points += mp.points || 0;
                      userMap.set(uid, existing);
                    });
                    predictions.forEach((tp) => {
                      const uid = tp.user_id;
                      const existing = userMap.get(uid) || { username: tp.profiles?.username || uid.slice(0, 8), matchCount: 0, hasTournament: false, points: 0 };
                      existing.hasTournament = true;
                      if (tp.profiles?.username) existing.username = tp.profiles.username;
                      userMap.set(uid, existing);
                    });
                    const users = Array.from(userMap.entries()).sort((a, b) => b[1].matchCount - a[1].matchCount);
                    if (users.length === 0) return (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-500">No predictions yet</td></tr>
                    );
                    return users.map(([uid, u], idx) => (
                      <tr key={uid} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-medium">{u.username}</td>
                        <td className="px-4 py-2.5 text-center">{u.matchCount}</td>
                        <td className="px-4 py-2.5 text-center">{u.hasTournament ? <span className="text-green-400">✓</span> : <span className="text-gray-600">—</span>}</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-accent">{u.points}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tournament Predictions Table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-gray-300">Tournament Predictions ({predictions.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs">
                    <th className="text-left px-4 py-3 font-medium">#</th>
                    <th className="text-left px-4 py-3 font-medium">User</th>
                    <th className="text-left px-4 py-3 font-medium">Winner</th>
                    <th className="text-left px-4 py-3 font-medium">Runner-up</th>
                    <th className="text-left px-4 py-3 font-medium">Top Scorer</th>
                    <th className="text-left px-4 py-3 font-medium">Best Player</th>
                    <th className="text-left px-4 py-3 font-medium">Best GK</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => (
                    <tr key={pred.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-medium">
                        {pred.profiles?.username || pred.user_id?.slice(0, 8)}
                      </td>
                      <td className="px-4 py-2.5">{pred.predicted_winner || "-"}</td>
                      <td className="px-4 py-2.5 text-gray-400">{pred.predicted_finalist || "-"}</td>
                      <td className="px-4 py-2.5 text-gray-400">{pred.predicted_top_scorer || "-"}</td>
                      <td className="px-4 py-2.5 text-gray-400">{pred.predicted_best_player || "-"}</td>
                      <td className="px-4 py-2.5 text-gray-400">{pred.predicted_best_goalkeeper || "-"}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">
                        {new Date(pred.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {predictions.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        No tournament predictions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUPPORT QUERIES TAB ===== */}
      {activeTab === "support" && (
        <div className="space-y-3">
          {supportQueries.length === 0 && (
            <p className="text-center text-gray-500 py-8">No support queries yet.</p>
          )}
          {supportQueries.map((q) => (
            <div key={q.id} className={`rounded-xl border p-4 ${q.status === "closed" ? "border-gray-700 bg-white/[0.02]" : q.status === "responded" ? "border-green-500/20 bg-green-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{q.subject}</h3>
                  <p className="text-xs text-gray-500">{q.user_name || q.user_email} · {new Date(q.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${q.status === "open" ? "bg-amber-500/20 text-amber-400" : q.status === "responded" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                  {q.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{q.message}</p>

              {q.admin_response && (
                <div className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-[11px] text-green-500 font-semibold mb-1">YOUR RESPONSE</p>
                  <p className="text-sm text-gray-300">{q.admin_response}</p>
                </div>
              )}

              {q.status !== "closed" && (
                <div className="flex gap-2">
                  {respondingTo === q.id ? (
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white text-sm resize-none"
                        placeholder="Type your response..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToQuery(q.id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                        >
                          Send Response
                        </button>
                        <button
                          onClick={() => { setRespondingTo(null); setResponseText(""); }}
                          className="px-3 py-1.5 bg-white/10 text-gray-400 text-xs rounded-lg hover:bg-white/20 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => { setRespondingTo(q.id); setResponseText(""); }}
                        className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded-lg hover:bg-blue-600/30 transition"
                      >
                        Respond
                      </button>
                      <button
                        onClick={() => closeQuery(q.id)}
                        className="px-3 py-1.5 bg-white/10 text-gray-400 text-xs rounded-lg hover:bg-white/20 transition"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
