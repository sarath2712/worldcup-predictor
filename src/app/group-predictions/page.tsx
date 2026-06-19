"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { groups } from "@/app/fixtures/data";
import { countryFlags } from "@/lib/flags";

function getFlag(team: string): string {
  return countryFlags[team] || "🏳️";
}

type GroupPrediction = {
  group_name: string;
  predicted_first: string;
  predicted_second: string;
  predicted_third: string;
};

export default function GroupPredictionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [topScorer, setTopScorer] = useState("");
  const [savedTopScorer, setSavedTopScorer] = useState(false);
  const supabase = createClient();

  // State: { "Group A": { first: "Mexico", second: "...", third: "..." }, ... }
  const [predictions, setPredictions] = useState<
    Record<string, { first: string; second: string; third: string }>
  >({});

  // Lock: predictions close June 19 at 11:59 PM IST
  const lockDeadline = new Date("2026-06-19T18:29:00Z"); // 11:59 PM IST
  const isLocked = Date.now() > lockDeadline.getTime();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Load existing group predictions
        const { data: gp } = await supabase
          .from("group_predictions")
          .select("group_name, predicted_first, predicted_second, predicted_third")
          .eq("user_id", user.id);

        if (gp && gp.length > 0) {
          const map: Record<string, { first: string; second: string; third: string }> = {};
          gp.forEach((g: GroupPrediction) => {
            map[g.group_name] = {
              first: g.predicted_first,
              second: g.predicted_second,
              third: g.predicted_third,
            };
          });
          setPredictions(map);
        }

        // Load top scorer prediction
        const { data: ts } = await supabase
          .from("group_topscorer_predictions")
          .select("predicted_topscorer")
          .eq("user_id", user.id)
          .single();
        if (ts) {
          setTopScorer(ts.predicted_topscorer);
          setSavedTopScorer(true);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const setPrediction = (
    groupName: string,
    position: "first" | "second" | "third",
    team: string
  ) => {
    setPredictions((prev) => ({
      ...prev,
      [groupName]: {
        ...prev[groupName],
        [position]: team,
      },
    }));
  };

  const getAvailableTeams = (
    groupName: string,
    position: "first" | "second" | "third",
    teams: string[]
  ) => {
    const pred = predictions[groupName] || { first: "", second: "", third: "" };
    const used = new Set<string>();
    if (position !== "first" && pred.first) used.add(pred.first);
    if (position !== "second" && pred.second) used.add(pred.second);
    if (position !== "third" && pred.third) used.add(pred.third);
    return teams.filter((t) => !used.has(t));
  };

  const handleSave = async () => {
    if (!user || isLocked) return;
    setSaving(true);
    setMsg("");

    // Validate all groups are filled
    const incomplete = groups.filter((g) => {
      const p = predictions[g.name];
      return !p || !p.first || !p.second || !p.third;
    });

    if (incomplete.length > 0) {
      setMsg(
        `Please complete predictions for: ${incomplete.map((g) => g.name).join(", ")}`
      );
      setSaving(false);
      return;
    }

    if (!topScorer.trim()) {
      setMsg("Please enter your Group Stage Top Scorer prediction");
      setSaving(false);
      return;
    }

    // Upsert all group predictions
    const rows = groups.map((g) => ({
      user_id: user.id,
      group_name: g.name,
      predicted_first: predictions[g.name].first,
      predicted_second: predictions[g.name].second,
      predicted_third: predictions[g.name].third,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("group_predictions")
      .upsert(rows, { onConflict: "user_id,group_name" });

    if (error) {
      setMsg(error.message);
      setSaving(false);
      return;
    }

    // Upsert top scorer prediction
    const { error: tsError } = await supabase
      .from("group_topscorer_predictions")
      .upsert(
        {
          user_id: user.id,
          predicted_topscorer: topScorer.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (tsError) {
      setMsg(tsError.message);
      setSaving(false);
      return;
    }

    setSavedTopScorer(true);
    setMsg("All predictions saved!");
    setTimeout(() => setMsg(""), 3000);
    setSaving(false);
  };

  if (loading)
    return <div className="text-center py-16">Loading...</div>;

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">
          Please{" "}
          <a href="/login" className="text-accent hover:underline">
            login
          </a>{" "}
          to make group predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
            <path d="M9 3v18" />
          </svg>
          Group Stage Predictor
        </h1>
        <p className="text-gray-400 mt-2">
          Predict the final standings for each group!
        </p>
        {isLocked ? (
          <p className="text-sm text-red-400 mt-2">
            🔒 Group stage predictions are locked.
          </p>
        ) : (
          <p className="text-sm text-accent mt-2">
            ⏰ Lock deadline: June 19, 2026 at 11:59 PM IST
          </p>
        )}
      </div>

      {/* Scoring Info */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-500">0</span>
            <p className="text-gray-400">Only 1st correct</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-accent">50</span>
            <p className="text-gray-400">1st &amp; 2nd correct</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-accent">75</span>
            <p className="text-gray-400">1st, 2nd &amp; 3rd correct</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-accent">75</span>
            <p className="text-gray-400">Top Scorer correct</p>
          </div>
          <div className="text-center border-l border-white/10 pl-6">
            <span className="text-2xl font-bold text-white">975</span>
            <p className="text-gray-400">Max possible</p>
          </div>
        </div>
      </div>

      {/* Group Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const pred = predictions[group.name] || {
            first: "",
            second: "",
            third: "",
          };
          return (
            <div
              key={group.name}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-primary/20 border-b border-white/10">
                <h3 className="font-bold text-accent">{group.name}</h3>
              </div>
              <div className="p-4 space-y-3">
                {(["first", "second", "third"] as const).map((pos, idx) => (
                  <div key={pos} className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : idx === 1
                          ? "bg-gray-300/20 text-gray-300"
                          : "bg-amber-700/20 text-amber-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <select
                      value={pred[pos]}
                      onChange={(e) =>
                        setPrediction(group.name, pos, e.target.value)
                      }
                      disabled={isLocked}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 focus:outline-none focus:border-accent/50"
                    >
                      <option value="" className="bg-[#0b1121]">
                        Select {idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd"}{" "}
                        place
                      </option>
                      {getAvailableTeams(group.name, pos, group.teams).map(
                        (team) => (
                          <option
                            key={team}
                            value={team}
                            className="bg-[#0b1121]"
                          >
                            {getFlag(team)} {team}
                          </option>
                        )
                      )}
                    </select>
                    {pred[pos] && (
                      <span className="text-lg shrink-0">
                        {getFlag(pred[pos])}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Stage Top Scorer */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-primary/20 border-b border-white/10">
          <h3 className="font-bold text-accent flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            Group Stage Top Scorer — 75 Points
          </h3>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={topScorer}
            onChange={(e) => setTopScorer(e.target.value)}
            disabled={isLocked}
            placeholder="e.g. Kylian Mbappé"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 disabled:opacity-50 focus:outline-none focus:border-accent/50"
          />
          <p className="text-xs text-gray-500 mt-2">
            Predict the player with the most goals in the group stage (Matchday 1–3)
          </p>
        </div>
      </div>

      {/* Save Button */}
      {!isLocked && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-accent text-black font-bold rounded-full hover:bg-accent/80 transition disabled:opacity-50 text-lg"
          >
            {saving ? "Saving..." : "Save All Predictions"}
          </button>
          {msg && (
            <p
              className={`text-sm ${
                msg.includes("saved") ? "text-green-400" : "text-red-400"
              }`}
            >
              {msg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
