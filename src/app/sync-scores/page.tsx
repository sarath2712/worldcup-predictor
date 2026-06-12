"use client";

import { useState } from "react";

type MatchPreview = {
  home: string;
  away: string;
  home_score: string;
  away_score: string;
  status: string;
  state: string;
  goals: { minute: string; scorer: string }[];
};

type SyncDetail = {
  match: string;
  action: string;
};

type SyncResult = {
  matched: number;
  updated: number;
  skipped: number;
  errors: string[];
  details: SyncDetail[];
};

export default function SyncScoresPage() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0].replace(/-/g, "");
  });
  const [preview, setPreview] = useState<MatchPreview[] | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const formattedDate = date
    ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
    : "today";

  async function handlePreview() {
    setLoading(true);
    setError("");
    setSyncResult(null);
    try {
      const res = await fetch(`/api/sync-scores?date=${date}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPreview(data.matches || []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    }
    setLoading(false);
  }

  async function handleSync() {
    setSyncing(true);
    setError("");
    try {
      const res = await fetch("/api/sync-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSyncResult(data);
        // Refresh preview
        handlePreview();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    }
    setSyncing(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">⚡ Score Sync</h1>
      <p className="text-gray-400 text-sm mb-6">
        Fetch live scores from ESPN and update predictions automatically
      </p>

      {/* Date selector */}
      <div className="flex gap-2 mb-6">
        <input
          type="date"
          value={formattedDate}
          onChange={(e) => setDate(e.target.value.replace(/-/g, ""))}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white flex-1"
        />
        <button
          onClick={handlePreview}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded font-medium transition-colors"
        >
          {loading ? "Loading..." : "Preview"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded p-3 mb-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            ESPN Matches ({formattedDate})
          </h2>
          {preview.length === 0 ? (
            <p className="text-gray-500">No matches found for this date</p>
          ) : (
            <div className="space-y-3">
              {preview.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 border ${
                    m.state === "post"
                      ? "bg-green-900/20 border-green-800"
                      : m.state === "in"
                        ? "bg-yellow-900/20 border-yellow-800"
                        : "bg-gray-800/50 border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">
                      {m.home} {m.home_score} - {m.away_score} {m.away}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        m.state === "post"
                          ? "bg-green-800 text-green-200"
                          : m.state === "in"
                            ? "bg-yellow-800 text-yellow-200 animate-pulse"
                            : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  {m.goals.length > 0 && (
                    <div className="text-sm text-gray-400">
                      ⚽{" "}
                      {m.goals
                        .map((g) => `${g.scorer} (${g.minute})`)
                        .join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sync button - only if there are completed matches */}
          {preview.some((m) => m.state === "post") && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-4 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              {syncing
                ? "Syncing..."
                : "🔄 Sync Completed Matches to Database"}
            </button>
          )}
        </div>
      )}

      {/* Sync result */}
      {syncResult && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-3">Sync Results</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-blue-900/30 rounded">
              <div className="text-2xl font-bold">{syncResult.matched}</div>
              <div className="text-xs text-gray-400">Matched</div>
            </div>
            <div className="text-center p-2 bg-green-900/30 rounded">
              <div className="text-2xl font-bold">{syncResult.updated}</div>
              <div className="text-xs text-gray-400">Updated</div>
            </div>
            <div className="text-center p-2 bg-gray-700/30 rounded">
              <div className="text-2xl font-bold">{syncResult.skipped}</div>
              <div className="text-xs text-gray-400">Skipped</div>
            </div>
          </div>

          {syncResult.errors.length > 0 && (
            <div className="mb-3">
              <h3 className="text-red-400 text-sm font-semibold mb-1">
                Errors:
              </h3>
              {syncResult.errors.map((e, i) => (
                <div key={i} className="text-red-300 text-xs">
                  {e}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            {syncResult.details.map((d, i) => (
              <div key={i} className="text-sm flex gap-2">
                <span className="text-gray-300 font-medium">{d.match}:</span>
                <span className="text-gray-400">{d.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
