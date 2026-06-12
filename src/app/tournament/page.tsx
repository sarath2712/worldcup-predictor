"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TournamentPrediction } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export default function TournamentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [prediction, setPrediction] = useState<TournamentPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const [winner, setWinner] = useState("");
  const [finalist, setFinalist] = useState("");
  const [topScorer, setTopScorer] = useState("");
  const [bestPlayer, setBestPlayer] = useState("");
  const [bestGk, setBestGk] = useState("");

  // Extended deadline: June 12, 2026 11:59 PM IST (18:29 UTC)
  const tournamentStart = new Date("2026-06-12T18:29:00Z");
  const isLocked = new Date() >= tournamentStart;

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("tournament_predictions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setPrediction(data);
          setWinner(data.predicted_winner || "");
          setFinalist(data.predicted_finalist || "");
          setTopScorer(data.predicted_top_scorer || "");
          setBestPlayer(data.predicted_best_player || "");
          setBestGk(data.predicted_best_goalkeeper || "");
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!user || isLocked) return;
    setSaving(true);
    setMsg("");

    const payload = {
      user_id: user.id,
      predicted_winner: winner || null,
      predicted_finalist: finalist || null,
      predicted_top_scorer: topScorer || null,
      predicted_best_player: bestPlayer || null,
      predicted_best_goalkeeper: bestGk || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("tournament_predictions")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      setMsg(error.message);
    } else {
      setPrediction(data);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Please <a href="/login" className="text-accent hover:underline">login</a> to make tournament predictions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/><path d="M12 15v3"/><path d="M8 21h8"/></svg> Tournament Predictor</h1>
        <p className="text-gray-400 mt-2">
          Predict the big outcomes before the tournament starts!
        </p>
        {isLocked && (
          <p className="text-sm text-red-400 mt-2">
            🔒 Tournament has started — predictions are locked.
          </p>
        )}
        {!isLocked && (
          <p className="text-sm text-accent mt-2">
            ⏰ Lock deadline: June 11, 2026 at kickoff
          </p>
        )}
      </div>

      <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="space-y-4">
          <PredictionField
            icon="●"
            label="World Cup Winner"
            value={winner}
            onChange={setWinner}
            locked={isLocked}
            placeholder="e.g. Brazil"
          />
          <PredictionField
            icon="●"
            label="Finalist (Runner-up)"
            value={finalist}
            onChange={setFinalist}
            locked={isLocked}
            placeholder="e.g. France"
          />
          <PredictionField
            icon="○"
            label="Top Scorer (Golden Boot)"
            value={topScorer}
            onChange={setTopScorer}
            locked={isLocked}
            placeholder="e.g. Kylian Mbappé"
          />
          <PredictionField
            icon="☆"
            label="Player of the Tournament (Golden Ball)"
            value={bestPlayer}
            onChange={setBestPlayer}
            locked={isLocked}
            placeholder="e.g. Lionel Messi"
          />
          <PredictionField
            icon="◆"
            label="Best Goalkeeper (Golden Glove)"
            value={bestGk}
            onChange={setBestGk}
            locked={isLocked}
            placeholder="e.g. Thibaut Courtois"
          />
        </div>

        {!isLocked && (
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/80 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : prediction ? "Update Predictions" : "Save Predictions"}
            </button>
            {msg && <span className="text-sm text-green-400">{msg}</span>}
          </div>
        )}
      </div>

      {prediction && isLocked && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="font-semibold text-lg mb-4 text-accent">Your Predictions</h2>
          <div className="space-y-2 text-sm">
            <Row icon="★" label="Winner" value={prediction.predicted_winner} />
            <Row icon="●" label="Finalist" value={prediction.predicted_finalist} />
            <Row icon="○" label="Top Scorer" value={prediction.predicted_top_scorer} />
            <Row icon="☆" label="Best Player" value={prediction.predicted_best_player} />
            <Row icon="◆" label="Best GK" value={prediction.predicted_best_goalkeeper} />
          </div>
        </div>
      )}
    </div>
  );
}

function PredictionField({
  icon,
  label,
  value,
  onChange,
  locked,
  placeholder,
}: {
  icon: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  locked: boolean;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {icon} {label}
      </label>
      {locked ? (
        <p className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400">
          {value || "—"}
        </p>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string | null }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{icon} {label}</span>
      <span className="font-medium text-white">{value || "—"}</span>
    </div>
  );
}
