"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Player = {
  id: number;
  name: string;
  flat_number: string;
  favourite_team: string;
};

export default function PlaystationWorldcupPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("event_registrations")
        .select("id, name, flat_number, favourite_team")
        .eq("category", "playstation")
        .order("created_at", { ascending: true });
      setPlayers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
        FIFA WORLD CUP eTOURNAMENT
      </h1>

      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 mt-6 text-center">
        <p className="text-sm font-semibold text-red-400">Registration Closed</p>
      </div>

      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 mt-4 text-center">
        <p className="text-sm font-semibold text-yellow-400">Fixtures - Coming Soon</p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Registered Players</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {players.map((p, i) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{p.flat_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{p.favourite_team}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 px-4 py-2">{players.length} players registered</p>
        </div>
      )}
    </div>
  );
}
