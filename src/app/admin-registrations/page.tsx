"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Registration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  flat_number: string;
  favourite_team: string;
  category: string;
  created_at: string;
};

type Prediction = {
  id: number;
  user_id: string;
  winner: string;
  runner_up: string;
  top_scorer: string;
  best_player: string;
  best_goalkeeper: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"registrations" | "predictions">("registrations");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      // Load registrations
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (regs) setRegistrations(regs);

      // Load predictions (try - may not exist)
      try {
        const { data: preds } = await supabase
          .from("predictions")
          .select("*, profiles(full_name, email)")
          .order("created_at", { ascending: false });
        if (preds) setPredictions(preds);
      } catch {
        // predictions table may not exist
      }

      setLoading(false);
    }
    load();
  }, []);

  const filteredRegistrations =
    filterCategory === "all"
      ? registrations
      : registrations.filter((r) => r.category === filterCategory);

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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
        Admin Dashboard
      </h1>
      <p className="text-gray-400 mb-6">Registrations and prediction details</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{registrations.length}</p>
          <p className="text-xs text-gray-400">Total Registrations</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-600/20 to-green-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{categoryCounts["mens"] || 0}</p>
          <p className="text-xs text-gray-400">Men&apos;s Football</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{categoryCounts["womens"] || 0}</p>
          <p className="text-xs text-gray-400">Women&apos;s Football</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{categoryCounts["kids"] || 0}</p>
          <p className="text-xs text-gray-400">Kids Football</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{categoryCounts["playstation"] || 0}</p>
          <p className="text-xs text-gray-400">PlayStation</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-white/10 p-4">
          <p className="text-2xl font-bold">{predictions.length}</p>
          <p className="text-xs text-gray-400">Predictions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("registrations")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "registrations" ? "bg-primary text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Registrations ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab("predictions")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "predictions" ? "bg-primary text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Predictions ({predictions.length})
        </button>
      </div>

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
                      <td colSpan={8} className="text-center py-8 text-gray-500">
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

      {activeTab === "predictions" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
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
                      {pred.profiles?.full_name || pred.profiles?.email || pred.user_id?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-2.5">{pred.winner || "-"}</td>
                    <td className="px-4 py-2.5 text-gray-400">{pred.runner_up || "-"}</td>
                    <td className="px-4 py-2.5 text-gray-400">{pred.top_scorer || "-"}</td>
                    <td className="px-4 py-2.5 text-gray-400">{pred.best_player || "-"}</td>
                    <td className="px-4 py-2.5 text-gray-400">{pred.best_goalkeeper || "-"}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">
                      {new Date(pred.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {predictions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No predictions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
