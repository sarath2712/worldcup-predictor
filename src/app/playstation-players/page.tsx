"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Only these users can access this page
const ALLOWED_USERS = [
  "c650a8d0-428e-49e3-a225-f2787bd8fd77", // SARATHJS (admin)
  "13883ac7-d7e1-4007-9d45-3ed2b69c1f44", // Mithin
];

type Player = {
  id: number;
  name: string;
  email: string;
  phone: string;
  flat_number: string;
  favourite_team: string; // skill level
  created_at: string;
};

export default function PlaystationPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ALLOWED_USERS.includes(user.id)) {
        setLoading(false);
        return;
      }
      setAuthorized(true);

      const { data } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("category", "playstation")
        .order("created_at", { ascending: true });

      setPlayers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!authorized) return <div className="text-center py-16 text-red-400">Access denied.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
        PlayStation Players
      </h1>
      <p className="text-gray-400 mb-6">{players.length} registered players</p>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {players.map((p, i) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.flat_number}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.email}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.favourite_team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
