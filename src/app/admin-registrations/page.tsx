"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Match, BonusQuestion } from "@/lib/types";
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

type SubmissionEntry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  flat_number: string;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
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
  const [activeTab, setActiveTab] = useState<"match-results" | "registrations" | "predictions" | "support" | "submissions">("match-results");
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
  const [copied, setCopied] = useState(false);
  const [groupPredCount, setGroupPredCount] = useState(0);
  const [groupPredUserIds, setGroupPredUserIds] = useState<Set<string>>(new Set());
  const [groupStandings, setGroupStandings] = useState<Record<string, { first: string; second: string; third: string }>>({});
  const [scoringGroup, setScoringGroup] = useState<string | null>(null);
  const [groupScoreResult, setGroupScoreResult] = useState<string | null>(null);
  const [groupTopScorer, setGroupTopScorer] = useState("");
  const [scoringGroupTopScorer, setScoringGroupTopScorer] = useState(false);
  const [groupTopScorerResult, setGroupTopScorerResult] = useState<string | null>(null);
  const [caricatureEntries, setCaricatureEntries] = useState<SubmissionEntry[]>([]);
  const [footballStories, setFootballStories] = useState<SubmissionEntry[]>([]);
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

      // Load group predictions count (distinct users who submitted)
      try {
        const { data: gpUsers } = await supabase
          .from("group_predictions")
          .select("user_id");
        if (gpUsers) {
          const uniqueUsers = new Set(gpUsers.map((r: { user_id: string }) => r.user_id));
          setGroupPredCount(uniqueUsers.size);
          setGroupPredUserIds(uniqueUsers);
        }
      } catch {
        // table may not exist yet
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

      // Load caricature entries and football stories
      try {
        const { data: ce } = await supabase
          .from("caricature_entries")
          .select("*")
          .order("created_at", { ascending: false });
        if (ce) setCaricatureEntries(ce);
        const { data: fs } = await supabase
          .from("football_stories")
          .select("*")
          .order("created_at", { ascending: false });
        if (fs) setFootballStories(fs);
      } catch {
        // tables may not exist yet
      }

      setLoading(false);
    }
    load();
  }, []);

  const saveResult = async (
    matchId: number,
    homeScore: string,
    awayScore: string,
    actualScorers: string,
    bonusActuals: Record<string, string> | null
  ) => {
    setSaving(matchId);

    await supabase
      .from("matches")
      .update({
        home_score: parseInt(homeScore),
        away_score: parseInt(awayScore),
        actual_scorers: actualScorers || null,
        bonus_actuals: bonusActuals && Object.keys(bonusActuals).length > 0 ? bonusActuals : null,
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

  function buildWhatsAppMessage(): string {
    const scored = matches.filter((m) => m.home_score !== null).sort((a, b) => new Date(b.kickoff_utc).getTime() - new Date(a.kickoff_utc).getTime());
    const recentMatch = scored[0] || null;
    const upcoming = matches.filter((m) => m.home_score === null).sort((a, b) => new Date(a.kickoff_utc).getTime() - new Date(b.kickoff_utc).getTime()).slice(0, 3);

    let msg = "*FIFA WC 2026 — PREDICTION LEADERBOARD*\n";
    msg += "---------------------------------------\n";
    if (recentMatch) {
      msg += `After: ${recentMatch.home_team} ${recentMatch.home_score}-${recentMatch.away_score} ${recentMatch.away_team}\n`;
    }
    msg += "\n*TOP 10*\n\n";

    // We'll fetch leaderboard inline
    return msg;
  }

  async function handleAdminShare() {
    const { data: lb } = await supabase.from("leaderboard").select("*").order("total_points", { ascending: false }).limit(10);
    const scored = matches.filter((m) => m.home_score !== null).sort((a, b) => new Date(b.kickoff_utc).getTime() - new Date(a.kickoff_utc).getTime());
    const recentMatch = scored[0] || null;
    const upcoming = matches.filter((m) => m.home_score === null).sort((a, b) => new Date(a.kickoff_utc).getTime() - new Date(b.kickoff_utc).getTime()).slice(0, 3);

    let msg = "*FIFA WC 2026 — PREDICTION LEADERBOARD*\n";
    msg += "---------------------------------------\n";
    if (recentMatch) {
      msg += `After: ${recentMatch.home_team} ${recentMatch.home_score}-${recentMatch.away_score} ${recentMatch.away_team}\n`;
    }
    msg += "\n*TOP 10*\n\n";
    for (const entry of (lb || [])) {
      const rank = String(entry.rank).padStart(2, " ");
      const exact = entry.exact_scores > 0 ? ` (${entry.exact_scores} exact)` : "";
      msg += `${rank}. ${entry.username} — *${entry.total_points} pts*${exact}\n`;
    }
    if (upcoming.length > 0) {
      msg += "\n*UPCOMING MATCHES*\n";
      for (const m of upcoming) {
        const kickoff = new Date(m.kickoff_utc);
        const ist = kickoff.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
        msg += `${m.home_team} vs ${m.away_team} — ${ist} IST\n`;
      }
      msg += "\nPredict before kickoff!\n";
    }
    msg += "---------------------------------------\n";
    msg += "https://www.slgevents.in/matches";
    return msg;
  }

  async function handleShareWhatsApp() {
    const msg = await handleAdminShare();
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  async function handleCopy() {
    const msg = await handleAdminShare();
    await navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredRegistrations =
    filterCategory === "all"
      ? registrations
      : registrations.filter((r) => r.category === filterCategory);

  // Calculate group standings from match results
  function calcGroupStandings(groupName: string): { team: string; pts: number; gd: number; gf: number }[] {
    const groupMatches = matches.filter((m) => m.stage === groupName && m.home_score !== null);
    const teams: Record<string, { pts: number; gd: number; gf: number }> = {};
    for (const m of groupMatches) {
      if (!teams[m.home_team]) teams[m.home_team] = { pts: 0, gd: 0, gf: 0 };
      if (!teams[m.away_team]) teams[m.away_team] = { pts: 0, gd: 0, gf: 0 };
      const hs = m.home_score!;
      const as_ = m.away_score!;
      teams[m.home_team].gf += hs;
      teams[m.home_team].gd += hs - as_;
      teams[m.away_team].gf += as_;
      teams[m.away_team].gd += as_ - hs;
      if (hs > as_) { teams[m.home_team].pts += 3; }
      else if (hs < as_) { teams[m.away_team].pts += 3; }
      else { teams[m.home_team].pts += 1; teams[m.away_team].pts += 1; }
    }
    return Object.entries(teams)
      .map(([team, s]) => ({ team, ...s }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }

  function getCompletedGroups(): string[] {
    const groupNames = [...new Set(matches.filter((m) => m.stage?.startsWith("Group")).map((m) => m.stage))];
    return groupNames.filter((g) => {
      const groupMatches = matches.filter((m) => m.stage === g);
      const completedMatches = groupMatches.filter((m) => m.home_score !== null);
      return groupMatches.length >= 6 && completedMatches.length >= 6;
    }).sort();
  }

  async function scoreGroupPredictions(groupName: string) {
    setScoringGroup(groupName);
    setGroupScoreResult(null);
    const standings = calcGroupStandings(groupName);
    if (standings.length < 3) {
      setGroupScoreResult(`Not enough teams in ${groupName}`);
      setScoringGroup(null);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch("/api/score-group-predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ action: "group", group_name: groupName }),
    });
    const result = await response.json();
    if (!response.ok) {
      setGroupScoreResult(result.error || "Unable to score predictions.");
      setScoringGroup(null);
      return;
    }
    const [first, second, third] = result.standings;
    setGroupStandings((prev) => ({ ...prev, [groupName]: { first, second, third } }));
    setGroupScoreResult(
      `${groupName} scored for all ${result.total} players: ${result.scored75} got 75pts, ${result.scored50} got 50pts.`
    );
    setScoringGroup(null);
  }

  async function scoreGroupTopScorerPredictions() {
    const actual = groupTopScorer.trim();
    if (!actual) {
      setGroupTopScorerResult("Enter the actual Group Stage Top Scorer.");
      return;
    }

    setScoringGroupTopScorer(true);
    setGroupTopScorerResult(null);

    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch("/api/score-group-predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ action: "top_scorer", actual }),
    });
    const result = await response.json();
    setGroupTopScorerResult(
      response.ok
        ? `Top scorer predictions scored: ${result.correct} of ${result.total} received 75 points for ${actual}.`
        : result.error || "Unable to score top scorer predictions."
    );
    setScoringGroupTopScorer(false);
  }

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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
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
        <div className="rounded-xl bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{groupPredCount}</p>
          <p className="text-xs text-gray-400">Group Predictions</p>
        </div>
      </div>

      {/* Share Leaderboard */}
      <div className="flex gap-3 mb-8">
        <button onClick={handleShareWhatsApp} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          Share Leaderboard to WhatsApp
        </button>
        <button onClick={handleCopy} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {copied ? "Copied!" : "Copy Message"}
        </button>
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
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "submissions" ? "bg-accent text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Submissions ({caricatureEntries.length + footballStories.length})
        </button>
      </div>

      {/* ===== MATCH RESULTS TAB ===== */}
      {activeTab === "match-results" && (
        <div className="space-y-6">
          {/* Scoring Guide */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <h3 className="text-sm font-bold text-accent mb-3">Scoring Reference</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-bold text-gray-200 mb-2">Standard matches (no odds)</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-white">30</p>
                    <p>Exact</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">10</p>
                    <p>Outcome</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">15</p>
                    <p>First Goal</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-400">20</p>
                    <p className="text-amber-400/80">Each Extra</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="font-bold text-emerald-300 mb-2">Odds-based matches</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-emerald-300">80 + outcome</p>
                    <p>Exact</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-300">Odds × 20</p>
                    <p>Outcome</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-300">30</p>
                    <p>First Goal</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-400">30</p>
                    <p className="text-amber-400/80">Each Extra</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Odds outcome points use the winning outcome&apos;s decimal odds × 20. An exact score on an odds match earns both the 80-point exact bonus and the outcome points. Match-specific values appear on every row below.
            </p>
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

          {/* Group Predictions Scoring Section */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              📊 Group Predictions Scoring
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Score group predictions once all 3 rounds are complete. 1st+2nd correct = 50pts, 1st+2nd+3rd = 75pts.
            </p>
            {groupScoreResult && (
              <div className="mb-4 p-3 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm">
                {groupScoreResult}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(() => {
                const groupNames = [...new Set(matches.filter((m) => m.stage?.startsWith("Group")).map((m) => m.stage))].sort();
                return groupNames.map((groupName) => {
                  const groupMatches = matches.filter((m) => m.stage === groupName);
                  const completedCount = groupMatches.filter((m) => m.home_score !== null).length;
                  const isComplete = groupMatches.length >= 6 && completedCount >= 6;
                  const standings = isComplete ? calcGroupStandings(groupName) : [];
                  const alreadyScored = groupStandings[groupName] !== undefined;

                  // Check if already scored in DB
                  const predsForGroup = groupPredCount > 0;

                  return (
                    <div
                      key={groupName}
                      className={`rounded-xl border p-4 ${
                        isComplete
                          ? "border-green-500/30 bg-green-600/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-sm">{groupName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isComplete ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {completedCount}/{groupMatches.length} matches
                        </span>
                      </div>

                      {isComplete && standings.length >= 3 && (
                        <div className="text-xs text-gray-300 space-y-1 mb-3">
                          {standings.map((s, i) => (
                            <div key={s.team} className="flex justify-between">
                              <span className={i < 2 ? "text-green-400 font-medium" : i === 2 ? "text-yellow-400" : "text-gray-500"}>
                                {i + 1}. {s.team}
                              </span>
                              <span className="text-gray-500">{s.pts}pts GD:{s.gd > 0 ? "+" : ""}{s.gd}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {isComplete ? (
                        <button
                          onClick={() => scoreGroupPredictions(groupName)}
                          disabled={scoringGroup === groupName}
                          className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition"
                        >
                          {scoringGroup === groupName ? "Scoring..." : alreadyScored ? "Re-score Group" : "Score Group Predictions"}
                        </button>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-2">Waiting for matches to complete</p>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-4">
              <h3 className="font-bold text-accent">⚽ Group Stage Top Scorer</h3>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                Enter the final group-stage top scorer exactly once all group matches are complete. Correct predictions receive 75 points.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={groupTopScorer}
                  onChange={(e) => setGroupTopScorer(e.target.value)}
                  placeholder="Enter player name"
                  className="flex-1 border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white text-sm"
                />
                <button
                  onClick={scoreGroupTopScorerPredictions}
                  disabled={scoringGroupTopScorer || !groupTopScorer.trim()}
                  className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg disabled:opacity-50 hover:bg-accent/90 transition"
                >
                  {scoringGroupTopScorer ? "Scoring..." : "Score Top Scorer Predictions"}
                </button>
              </div>
              {groupTopScorerResult && (
                <p className="text-sm text-green-300 mt-3">{groupTopScorerResult}</p>
              )}
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
                    <th className="text-center px-4 py-3 font-medium">Group</th>
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
                      <tr><td colSpan={6} className="text-center py-8 text-gray-500">No predictions yet</td></tr>
                    );
                    return users.map(([uid, u], idx) => (
                      <tr key={uid} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-medium">{u.username}</td>
                        <td className="px-4 py-2.5 text-center">{u.matchCount}</td>
                        <td className="px-4 py-2.5 text-center">{u.hasTournament ? <span className="text-green-400">✓</span> : <span className="text-gray-600">—</span>}</td>
                        <td className="px-4 py-2.5 text-center">{groupPredUserIds.has(uid) ? <span className="text-green-400">✓</span> : <span className="text-gray-600">—</span>}</td>
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

      {/* ===== SUBMISSIONS TAB ===== */}
      {activeTab === "submissions" && (
        <div className="space-y-8">
          {/* Caricature Contest Entries */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-6 py-4 bg-accent/10 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-accent">🎨 Caricature Contest ({caricatureEntries.length})</h3>
            </div>
            {caricatureEntries.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No caricature entries yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {caricatureEntries.map((entry) => (
                  <div key={entry.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{entry.name}</p>
                      <p className="text-xs text-gray-400">{entry.email} · {entry.phone} · Flat {entry.flat_number}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.file_name || "file"} {entry.file_size ? `(${(entry.file_size / 1024).toFixed(0)} KB)` : ""} · {format(new Date(entry.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <a
                      href={entry.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-accent/20 text-accent text-xs font-semibold rounded-lg hover:bg-accent/30 transition flex-shrink-0"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Football Story Entries */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-6 py-4 bg-accent/10 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-accent">📖 Football Stories ({footballStories.length})</h3>
            </div>
            {footballStories.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No football stories yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {footballStories.map((entry) => (
                  <div key={entry.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{entry.name}</p>
                      <p className="text-xs text-gray-400">{entry.email} · {entry.phone} · Flat {entry.flat_number}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.file_name || "file"} {entry.file_size ? `(${(entry.file_size / 1024).toFixed(0)} KB)` : ""} · {format(new Date(entry.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <a
                      href={entry.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-accent/20 text-accent text-xs font-semibold rounded-lg hover:bg-accent/30 transition flex-shrink-0"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
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
  onSave: (id: number, home: string, away: string, scorers: string, bonusActuals: Record<string, string> | null) => void;
}) {
  const [home, setHome] = useState(match.home_score?.toString() || "");
  const [away, setAway] = useState(match.away_score?.toString() || "");
  const [firstGoal, setFirstGoal] = useState(match.actual_scorers || "");
  const [bonusActuals, setBonusActuals] = useState<Record<string, string>>(
    (match.bonus_actuals as Record<string, string>) || {}
  );
  const isCompleted = match.home_score !== null;
  const kickoff = new Date(match.kickoff_utc);
  const isPast = kickoff < new Date();
  const bonusQuestions = (match.bonus_questions || []) as BonusQuestion[];
  const isKnockout = !match.stage.startsWith("Group");
  const hasOdds =
    match.home_win_odds !== null &&
    match.away_win_odds !== null &&
    (isKnockout || match.draw_odds !== null);
  const firstGoalPoints = hasOdds ? 30 : 15;
  const extraPoints = hasOdds || isKnockout ? 30 : 20;
  const oddsToPoints = (odds: number) => Math.floor(odds * 20);

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

      {/* Match-specific scoring */}
      {hasOdds ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Odds-based scoring
            </p>
            <p className="text-[10px] text-emerald-300">
              Exact score = 80 + correct outcome points{isKnockout ? " (including extra time)" : ""}
            </p>
          </div>
          <div className={`grid ${isKnockout ? "grid-cols-2" : "grid-cols-3"} gap-2 text-center text-xs`}>
            <div className="rounded-md bg-white/5 p-2">
              <p className="text-gray-400">{match.home_team} win · {match.home_win_odds!.toFixed(2)}</p>
              <p className="font-bold text-emerald-300">{oddsToPoints(match.home_win_odds!)} pts</p>
              <p className="text-[10px] text-gray-500">Exact: {80 + oddsToPoints(match.home_win_odds!)} pts</p>
            </div>
            {!isKnockout && (
              <div className="rounded-md bg-white/5 p-2">
                <p className="text-gray-400">Draw · {match.draw_odds!.toFixed(2)}</p>
                <p className="font-bold text-emerald-300">{oddsToPoints(match.draw_odds!)} pts</p>
                <p className="text-[10px] text-gray-500">Exact: {80 + oddsToPoints(match.draw_odds!)} pts</p>
              </div>
            )}
            <div className="rounded-md bg-white/5 p-2">
              <p className="text-gray-400">{match.away_team} win · {match.away_win_odds!.toFixed(2)}</p>
              <p className="font-bold text-emerald-300">{oddsToPoints(match.away_win_odds!)} pts</p>
              <p className="text-[10px] text-gray-500">Exact: {80 + oddsToPoints(match.away_win_odds!)} pts</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-gray-400">
          Standard scoring: exact score 30 pts · correct outcome 10 pts
        </div>
      )}

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
          onClick={() => onSave(match.id, home, away, firstGoal, bonusQuestions.length > 0 ? bonusActuals : null)}
          disabled={saving || !home || !away}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg disabled:opacity-50 hover:bg-green-700 transition font-semibold"
        >
          {saving ? "Saving..." : isCompleted ? "Update & Recalculate" : "Save & Calculate Points"}
        </button>
      </div>

      {/* First Goal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
        {isKnockout && (
          <div>
            <label className="text-[10px] text-emerald-400 uppercase tracking-wider">Winner (final outcome after penalties)</label>
            <select
              value={bonusActuals.winner_prediction || ""}
              onChange={(e) =>
                setBonusActuals((prev) => ({ ...prev, winner_prediction: e.target.value }))
              }
              className="w-full border border-emerald-500/30 rounded-lg px-3 py-2 bg-emerald-500/5 text-white text-sm"
            >
              <option value="">Select winner...</option>
              <option value={match.home_team}>{match.home_team}</option>
              <option value={match.away_team}>{match.away_team}</option>
            </select>
          </div>
        )}
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">Team Scored First ({firstGoalPoints} pts)</label>
          <select
            value={firstGoal}
            onChange={(e) => setFirstGoal(e.target.value)}
            className="w-full border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white text-sm"
          >
            <option value="">Select team...</option>
            <option value={match.home_team}>{match.home_team}</option>
            <option value={match.away_team}>{match.away_team}</option>
            <option value="None">None (0-0)</option>
          </select>
        </div>
      </div>
      {bonusQuestions.length > 0 && (
        <div className="pt-2 border-t border-amber-500/20">
          <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold mb-2">⚡ Match Extras ({extraPoints} pts each)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bonusQuestions.map((q) => (
              <div key={q.type}>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">{q.question}</label>
                <select
                  value={bonusActuals[q.type] || ""}
                  onChange={(e) =>
                    setBonusActuals((prev) => ({ ...prev, [q.type]: e.target.value }))
                  }
                  className="w-full border border-amber-500/30 rounded-lg px-3 py-2 bg-amber-500/5 text-white text-sm"
                >
                  <option value="">Select actual...</option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
