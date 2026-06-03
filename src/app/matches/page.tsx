"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match, Prediction } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { format, isPast, addHours } from "date-fns";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
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
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading matches...</div>;

  // Group by stage
  const grouped = matches.reduce((acc, match) => {
    if (!acc[match.stage]) acc[match.stage] = [];
    acc[match.stage].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Matches</h1>

      {Object.entries(grouped).map(([stage, stageMatches]) => (
        <div key={stage}>
          <h2 className="text-xl font-semibold mb-4 text-accent">{stage}</h2>
          <div className="space-y-3">
            {stageMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                user={user}
                supabase={supabase}
                onPredictionSaved={(pred) =>
                  setPredictions((p) => ({ ...p, [match.id]: pred }))
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
  user,
  supabase,
  onPredictionSaved,
}: {
  match: Match;
  prediction?: Prediction;
  user: User | null;
  supabase: ReturnType<typeof createClient>;
  onPredictionSaved: (pred: Prediction) => void;
}) {
  const [home, setHome] = useState(prediction?.predicted_home?.toString() || "");
  const [away, setAway] = useState(prediction?.predicted_away?.toString() || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const kickoff = new Date(match.kickoff_utc);
  const deadline = addHours(kickoff, -1);
  const isLocked = isPast(deadline);
  const hasResult = match.home_score !== null;

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
        <span className="text-xs text-gray-500">
          {format(kickoff, "EEE, MMM d · h:mm a")}
        </span>
        {isLocked && (
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
            🔒 Locked
          </span>
        )}
        {prediction?.points !== null && prediction?.points !== undefined && (
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
            +{prediction.points} pts
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 text-right font-medium">{match.home_team}</div>

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

        <div className="flex-1 font-medium">{match.away_team}</div>
      </div>

      {user && !isLocked && !hasResult && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={saving || !home || !away}
            className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition"
          >
            {prediction ? "Update" : "Save"} Prediction
          </button>
          {msg && <span className="text-xs text-green-600">{msg}</span>}
        </div>
      )}

      {match.venue && (
        <p className="text-xs text-gray-400 mt-2">📍 {match.venue}</p>
      )}
    </div>
  );
}
