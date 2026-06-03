"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match } from "@/lib/types";
import { format } from "date-fns";

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
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
      setLoading(false);
    }
    load();
  }, []);

  const saveResult = async (matchId: number, homeScore: string, awayScore: string) => {
    setSaving(matchId);

    // Update match result
    await supabase
      .from("matches")
      .update({ home_score: parseInt(homeScore), away_score: parseInt(awayScore) })
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

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!isAdmin) return <div className="text-center py-16 text-red-600">Access denied. Admin only.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Admin - Enter Results</h1>
      <p className="text-sm text-gray-500">
        Enter the actual match scores. Points are calculated automatically.
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
  onSave: (id: number, home: string, away: string) => void;
}) {
  const [home, setHome] = useState(match.home_score?.toString() || "");
  const [away, setAway] = useState(match.away_score?.toString() || "");

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border shadow-sm">
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
            className="w-12 text-center border rounded py-1 dark:bg-gray-800"
            placeholder="H"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            value={away}
            onChange={(e) => setAway(e.target.value)}
            className="w-12 text-center border rounded py-1 dark:bg-gray-800"
            placeholder="A"
          />
          <button
            onClick={() => onSave(match.id, home, away)}
            disabled={saving || !home || !away}
            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
          >
            {saving ? "..." : match.home_score !== null ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
