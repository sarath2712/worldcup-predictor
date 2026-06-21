"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match, Prediction, MatchExtras, BonusQuestion } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { format, isPast, addHours } from "date-fns";
import { getFlag } from "@/lib/flags";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [extras, setExtras] = useState<Record<number, MatchExtras>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/";
        return;
      }
      setUser(user);

      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .order("kickoff_utc", { ascending: true });

      setMatches(matchData || []);

      if (user) {
        const { data: predData } = await supabase
          .from("predictions")
          .select("*")
          .eq("user_id", user.id);

        const predMap: Record<number, Prediction> = {};
        predData?.forEach((p) => (predMap[p.match_id] = p));
        setPredictions(predMap);

        const { data: extrasData } = await supabase
          .from("match_extras")
          .select("*")
          .eq("user_id", user.id);

        const extrasMap: Record<number, MatchExtras> = {};
        extrasData?.forEach((e) => (extrasMap[e.match_id] = e));
        setExtras(extrasMap);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading matches...</div>;

  // Group by date (matches already sorted by kickoff_utc)
  const grouped = matches.reduce((acc, match) => {
    const dateKey = format(new Date(match.kickoff_utc), "EEEE, MMMM d, yyyy");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Matches</h1>

      {Object.entries(grouped).map(([date, dateMatches]) => (
        <div key={date}>
          <h2 className="text-xl font-semibold mb-4 text-accent">{date}</h2>
          <div className="space-y-3">
            {dateMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                matchExtras={extras[match.id]}
                user={user}
                supabase={supabase}
                onPredictionSaved={(pred) =>
                  setPredictions((p) => ({ ...p, [match.id]: pred }))
                }
                onExtrasSaved={(ext) =>
                  setExtras((e) => ({ ...e, [match.id]: ext }))
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchCard({
  match,
  prediction,
  matchExtras,
  user,
  supabase,
  onPredictionSaved,
  onExtrasSaved,
}: {
  match: Match;
  prediction?: Prediction;
  matchExtras?: MatchExtras;
  user: User | null;
  supabase: ReturnType<typeof createClient>;
  onPredictionSaved: (pred: Prediction) => void;
  onExtrasSaved: (ext: MatchExtras) => void;
}) {
  const [home, setHome] = useState(prediction?.predicted_home?.toString() || "");
  const [away, setAway] = useState(prediction?.predicted_away?.toString() || "");
  const [potm, setPotm] = useState(matchExtras?.predicted_potm || "");
  const [firstGoal, setFirstGoal] = useState(matchExtras?.predicted_scorers || "");
  const [bonusAnswers, setBonusAnswers] = useState<Record<string, string>>(
    matchExtras?.bonus_answers || {}
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const kickoff = new Date(match.kickoff_utc);
  const deadline = addHours(kickoff, -1);
  const isLocked = isPast(deadline);
  const hasResult = match.home_score !== null;
  const bonusQuestions = (match.bonus_questions || []) as BonusQuestion[];
  const hasOdds = match.home_win_odds && match.draw_odds && match.away_win_odds;

  function oddsToPoints(odds: number): number {
    return Math.floor(odds * 20);
  }

  useEffect(() => {
    if (isLocked || hasResult) return;

    function updateCountdown() {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Locked");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isLocked, hasResult]);

  const handleSave = async () => {
    if (!user || isLocked) return;
    setSaving(true);
    setMsg("");

    const payload = {
      user_id: user.id,
      match_id: match.id,
      predicted_home: parseInt(home),
      predicted_away: parseInt(away),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("predictions")
      .upsert(payload, { onConflict: "user_id,match_id" })
      .select()
      .single();

    // Save match extras (POTM, first goal, bonus answers)
    const hasBonusAnswers = Object.keys(bonusAnswers).length > 0;
    if (potm || firstGoal || hasBonusAnswers) {
      const extrasPayload = {
        user_id: user.id,
        match_id: match.id,
        predicted_potm: potm || null,
        predicted_scorers: firstGoal || null,
        bonus_answers: hasBonusAnswers ? bonusAnswers : null,
        updated_at: new Date().toISOString(),
      };
      const { data: extData } = await supabase
        .from("match_extras")
        .upsert(extrasPayload, { onConflict: "user_id,match_id" })
        .select()
        .single();
      if (extData) onExtrasSaved(extData);
    }

    if (error) {
      setMsg(error.message);
    } else {
      onPredictionSaved(data);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
    }
    setSaving(false);
  };

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
            {match.stage}
          </span>
          <span className="text-xs text-gray-500">
            {format(kickoff, "h:mm a")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isLocked && !hasResult && timeLeft && (
            <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full font-mono">
              ⏱ {timeLeft}
            </span>
          )}
          {isLocked && (
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
              🔒 Locked
            </span>
          )}
          {(() => {
            const predPts = prediction?.points ?? 0;
            const extraPts = matchExtras?.points ?? 0;
            const totalPts = predPts + extraPts;
            if (totalPts > 0 || (prediction?.points !== null && prediction?.points !== undefined)) {
              return (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  +{totalPts} pts
                </span>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {hasOdds && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold">
            {match.home_team.split(" ").pop()} {match.home_win_odds!.toFixed(2)} → <b>{oddsToPoints(match.home_win_odds!)} pts</b>
          </span>
          <span className="px-3 py-1 rounded-lg bg-gray-500/10 text-gray-400 font-semibold">
            Draw {match.draw_odds!.toFixed(2)} → <b>{oddsToPoints(match.draw_odds!)} pts</b>
          </span>
          <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 font-semibold">
            {match.away_team.split(" ").pop()} {match.away_win_odds!.toFixed(2)} → <b>{oddsToPoints(match.away_win_odds!)} pts</b>
          </span>
          <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-semibold">
            Exact Score: <b>80 pts</b>
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 text-right font-medium">
          {match.home_team} <span className="text-xl ml-1">{getFlag(match.home_team)}</span>
        </div>

        {hasResult ? (
          <div className="text-center font-bold text-lg min-w-[60px]">
            {match.home_score} - {match.away_score}
          </div>
        ) : user && !isLocked ? (
          <div className="flex items-center gap-1 min-w-[100px]">
            <input
              type="number"
              min="0"
              max="20"
              value={home}
              onChange={(e) => setHome(e.target.value)}
              className="w-10 text-center border border-white/20 rounded py-1 bg-white/10 text-white"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              max="20"
              value={away}
              onChange={(e) => setAway(e.target.value)}
              className="w-10 text-center border border-white/20 rounded py-1 bg-white/10 text-white"
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 min-w-[60px]">vs</div>
        )}

        <div className="flex-1 font-medium">
          <span className="text-xl mr-1">{getFlag(match.away_team)}</span> {match.away_team}
        </div>
      </div>

      {user && !isLocked && !hasResult && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={firstGoal}
              onChange={(e) => setFirstGoal(e.target.value)}
              className="text-xs px-3 py-1.5 border border-white/20 rounded-lg bg-white/10 text-white"
            >
              <option value="">Team Scored First?</option>
              <option value={match.home_team}>{match.home_team}</option>
              <option value={match.away_team}>{match.away_team}</option>
              <option value="None">None (0-0)</option>
            </select>
          </div>
          {bonusQuestions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">⚡ Match Extras ({hasOdds ? 30 : 20} pts each)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bonusQuestions.map((q) => (
                  <select
                    key={q.type}
                    value={bonusAnswers[q.type] || ""}
                    onChange={(e) =>
                      setBonusAnswers((prev) => ({ ...prev, [q.type]: e.target.value }))
                    }
                    className="text-xs px-3 py-1.5 border border-amber-500/30 rounded-lg bg-amber-500/5 text-white"
                  >
                    <option value="">{q.question}</option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          )}
          {hasOdds && home !== "" && away !== "" && (
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <span className="font-semibold">💰 Your potential:</span>
              {(() => {
                const h = parseInt(home), a = parseInt(away);
                if (isNaN(h) || isNaN(a)) return null;
                const outcome = h > a ? "home" : h < a ? "away" : "draw";
                const odds = outcome === "home" ? match.home_win_odds! : outcome === "away" ? match.away_win_odds! : match.draw_odds!;
                const outcomePts = oddsToPoints(odds);
                return (
                  <>
                    <span>Outcome: <b>{outcomePts}</b> pts</span>
                    <span className="text-gray-600">|</span>
                    <span>Exact: <b>80</b> pts</span>
                  </>
                );
              })()}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !home || !away}
              className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition"
            >
              {prediction ? "Update" : "Save"} Prediction
            </button>
            {msg && <span className="text-xs text-green-600">{msg}</span>}
          </div>
        </div>
      )}

      {match.venue && (
        <p className="text-xs text-gray-400 mt-2">📍 {match.venue}</p>
      )}


    </div>
  );
}
