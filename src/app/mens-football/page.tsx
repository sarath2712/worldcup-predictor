"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RegistrationForm } from "@/components/RegistrationForm";

type Registration = {
  name: string;
  flat_number: string;
  favourite_team: string | null;
  created_at: string;
};

const teams = [
  {
    name: "Team 1",
    players: [
      { name: "Chirag", isCaptain: true },
      { name: "Sushant Kumar", isCaptain: false },
      { name: "Rohan", isCaptain: false },
      { name: "Franklin", isCaptain: false },
      { name: "Kishor", isCaptain: false },
      { name: "Rithwik Sasikumar", isCaptain: false },
      { name: "Tushar", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Kshiraj", isCaptain: true },
      { name: "Shriragini Kowtarapu", isCaptain: false },
      { name: "Sagar Kateel", isCaptain: false },
      { name: "Gitrajit", isCaptain: false },
      { name: "Jay Patel", isCaptain: false },
      { name: "Chethan", isCaptain: false },
      { name: "Satyaki Das", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Anil Rawat", isCaptain: true },
      { name: "Pankaj Kumawat", isCaptain: false },
      { name: "Sriram S", isCaptain: false },
      { name: "Pavan Itagi", isCaptain: false },
      { name: "Sachin Shiragola", isCaptain: false },
      { name: "Mitesh", isCaptain: false },
      { name: "Arjun", isCaptain: false },
      { name: "Pikanshu Kumar", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Mithin Mathew", isCaptain: true },
      { name: "Mithun", isCaptain: false },
      { name: "Nithin Nambiar", isCaptain: false },
      { name: "Praveesh", isCaptain: false },
      { name: "Suvin", isCaptain: false },
      { name: "Shanthibhushan", isCaptain: false },
    ],
  },
];

export default function MensFootballPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("event_registrations")
        .select("name, flat_number, favourite_team, created_at")
        .eq("category", "mens")
        .order("created_at", { ascending: true });
      setRegistrations(data || []);
    }
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> MEN&apos;S FOOTBALL — TEAMS</h1>
      <p className="text-gray-400 mb-8">4 Teams &middot; 28 Players</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {teams.map((team) => (
          <div key={team.name} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h2 className="text-lg font-bold text-accent">{team.name}</h2>
            <div className="space-y-2">
              {team.players.map((p) => (
                <div key={p.name} className={`rounded-lg p-3 text-sm ${p.isCaptain ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-white/5 border border-white/5"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{p.name}</span>
                    {p.isCaptain && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">CAPTAIN</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
        <RegistrationForm category="mens" title="Men's Football" closed={false} />
      </div>

      {/* Registered Players */}
      {registrations.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Registered Players ({registrations.length})
          </h2>
          <div className="space-y-2">
            {registrations.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-4 py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-mono w-5">{i + 1}</span>
                  <span className="font-medium text-white">{r.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Flat: {r.flat_number}</span>
                  {r.favourite_team && <span>{r.favourite_team}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Event Details</h2>
        <ul className="text-gray-300 text-sm space-y-2 leading-relaxed">
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> This will be a <strong className="text-white">5-a-side</strong> match.</li>
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Each half will be of <strong className="text-white">10 minutes</strong>.</li>
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> Fixtures and time slots will be prepared and shared based on the total number of registrations received.</li>
        </ul>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1.5"><svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Registration closes on <strong className="text-white">Wednesday, 10th June</strong>.</li>
            <li>• Turf football shoes or normal shoes are allowed. <strong className="text-red-400">Please do not use Shoes with Studs or Spikes.</strong></li>
            <li>• Once teams are decided, everyone is kindly requested to bring their own team colours as mentioned by the committee.</li>
            <li>• Please play in a friendly spirit and at medium to low intensity.</li>
          </ul>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-gray-500 italic">All decisions taken by the committee will be final. Please abide by the rules set.</p>
        </div>
      </div>
    </div>
  );
}
