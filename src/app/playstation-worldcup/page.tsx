"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const ADMIN_USERS = [
  "c650a8d0-428e-49e3-a225-f2787bd8fd77", // SARATHJS
  "13883ac7-d7e1-4007-9d45-3ed2b69c1f44", // Mithin Mathew
];

type Match = { id: string; p1: string; p2: string; time: string };
type Round = { title: string; date: string; matches: Match[] };
type Score = { match_id: string; score_p1: number; score_p2: number };

const fixtures: Round[] = [
  {
    title: "Preliminary / Play-in",
    date: "Sat 20 Jun",
    matches: [
      { id: "P0", p1: "Chirag Tyagi", p2: "Dhruv", time: "2:10-2:25 PM" },
    ],
  },
  {
    title: "Round of 32 - Day 1",
    date: "Sat 20 Jun",
    matches: [
      { id: "M1", p1: "Sachin Shiragola", p2: "Mrinal", time: "2:25-2:40 PM" },
      { id: "M2", p1: "Kshiraj Nair", p2: "Saju", time: "2:40-2:55 PM" },
      { id: "M3", p1: "Pavan Itagi", p2: "Jay Patel", time: "2:55-3:10 PM" },
      { id: "M4", p1: "Krishang Sinha", p2: "Winner P0", time: "3:10-3:25 PM" },
      { id: "M5", p1: "Shriragini Kowtarapu", p2: "Alvin Jibi", time: "3:25-3:40 PM" },
      { id: "M6", p1: "Rithwik K Sasikumar", p2: "Aryush", time: "3:40-3:55 PM" },
      { id: "M7", p1: "Akhil Shaju", p2: "Swayash Jha", time: "3:55-4:10 PM" },
      { id: "M8", p1: "Dheeraj Goyal", p2: "Shivam Jakhmola", time: "4:10-4:25 PM" },
    ],
  },
  {
    title: "Round of 32 - Day 2",
    date: "Sun 21 Jun",
    matches: [
      { id: "M9", p1: "Mithin Mathew", p2: "Mitesh Rao V", time: "2:10-2:25 PM" },
      { id: "M10", p1: "Pikanshu Kumar", p2: "Mahesh Tirupati", time: "2:25-2:40 PM" },
      { id: "M11", p1: "Sushant Kumar", p2: "Tejas", time: "2:40-2:55 PM" },
      { id: "M12", p1: "Kunal", p2: "Avyaan Biswas", time: "2:55-3:10 PM" },
      { id: "M13", p1: "Abhinav Rastogi", p2: "Sriram S", time: "3:10-3:25 PM" },
      { id: "M14", p1: "Tanmay", p2: "Vihaan", time: "3:25-3:40 PM" },
      { id: "M15", p1: "Suvin", p2: "Ritvik", time: "3:40-3:55 PM" },
      { id: "M16", p1: "Swarnadeep Dutta", p2: "Satyam Pandey", time: "3:55-4:10 PM" },
    ],
  },
  {
    title: "Round of 16",
    date: "Sat 27 Jun",
    matches: [
      { id: "M17", p1: "Winner M1", p2: "Winner M2", time: "2:10-2:25 PM" },
      { id: "M18", p1: "Winner M3", p2: "Winner M4", time: "2:25-2:40 PM" },
      { id: "M19", p1: "Winner M5", p2: "Winner M6", time: "2:40-2:55 PM" },
      { id: "M20", p1: "Winner M7", p2: "Winner M8", time: "2:55-3:10 PM" },
      { id: "M21", p1: "Winner M9", p2: "Winner M10", time: "3:10-3:25 PM" },
      { id: "M22", p1: "Winner M11", p2: "Winner M12", time: "3:25-3:40 PM" },
      { id: "M23", p1: "Winner M13", p2: "Winner M14", time: "3:40-3:55 PM" },
      { id: "M24", p1: "Winner M15", p2: "Winner M16", time: "3:55-4:10 PM" },
    ],
  },
  {
    title: "Quarter-Finals",
    date: "Sun 28 Jun",
    matches: [
      { id: "QF1", p1: "Winner M17", p2: "Winner M18", time: "2:10-2:28 PM" },
      { id: "QF2", p1: "Winner M19", p2: "Winner M20", time: "2:28-2:46 PM" },
      { id: "QF3", p1: "Winner M21", p2: "Winner M22", time: "2:46-3:04 PM" },
      { id: "QF4", p1: "Winner M23", p2: "Winner M24", time: "3:04-3:22 PM" },
    ],
  },
  {
    title: "Semi-Finals",
    date: "Sun 28 Jun",
    matches: [
      { id: "SF1", p1: "Winner QF1", p2: "Winner QF2", time: "3:32-3:52 PM" },
      { id: "SF2", p1: "Winner QF3", p2: "Winner QF4", time: "3:52-4:12 PM" },
    ],
  },
  {
    title: "3rd Place (Optional)",
    date: "Sun 28 Jun",
    matches: [
      { id: "3rd", p1: "Loser SF1", p2: "Loser SF2", time: "4:12-4:30 PM" },
    ],
  },
  {
    title: "Final",
    date: "Sun 28 Jun",
    matches: [
      { id: "F", p1: "Winner SF1", p2: "Winner SF2", time: "4:30-4:55 PM" },
    ],
  },
];

export default function PlaystationWorldcupPage() {
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, Score>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      // Check admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user && ADMIN_USERS.includes(user.id)) {
        setIsAdmin(true);
      }
      // Load scores
      const { data } = await supabase
        .from("ps_scores")
        .select("match_id, score_p1, score_p2");
      if (data) {
        const map: Record<string, Score> = {};
        data.forEach((s: Score) => { map[s.match_id] = s; });
        setScores(map);
      }
    }
    load();
  }, []);

  async function saveScore(matchId: string, scoreP1: number, scoreP2: number) {
    setSaving(matchId);
    await supabase.from("ps_scores").upsert(
      { match_id: matchId, score_p1: scoreP1, score_p2: scoreP2 },
      { onConflict: "match_id" }
    );
    setScores((prev) => ({ ...prev, [matchId]: { match_id: matchId, score_p1: scoreP1, score_p2: scoreP2 } }));
    setSaving(null);
  }

  // Build a lookup: match_id -> { p1, p2 } from fixtures
  const matchPlayers: Record<string, { p1: string; p2: string }> = {};
  fixtures.forEach((r) => r.matches.forEach((m) => { matchPlayers[m.id] = { p1: m.p1, p2: m.p2 }; }));

  // Resolve winner for a match based on scores
  function getWinner(matchId: string): string | null {
    const sc = scores[matchId];
    if (!sc) return null;
    const mp = matchPlayers[matchId];
    if (!mp) return null;
    const p1Resolved = resolveName(mp.p1);
    const p2Resolved = resolveName(mp.p2);
    if (sc.score_p1 > sc.score_p2) return p1Resolved;
    if (sc.score_p2 > sc.score_p1) return p2Resolved;
    return null; // draw - needs penalties, admin should update
  }

  // Resolve "Winner MX" / "Loser SFX" references to actual names
  function resolveName(name: string): string {
    const winnerMatch = name.match(/^Winner (.+)$/);
    if (winnerMatch) {
      const resolved = getWinner(winnerMatch[1]);
      return resolved || name;
    }
    const loserMatch = name.match(/^Loser (.+)$/);
    if (loserMatch) {
      const sc = scores[loserMatch[1]];
      if (!sc) return name;
      const mp = matchPlayers[loserMatch[1]];
      if (!mp) return name;
      const p1Resolved = resolveName(mp.p1);
      const p2Resolved = resolveName(mp.p2);
      if (sc.score_p1 < sc.score_p2) return p1Resolved;
      if (sc.score_p2 < sc.score_p1) return p2Resolved;
      return name;
    }
    return name;
  }

  const champion = getWinner("F");

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-3">
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
        PS5 FC26 Tournament
      </h1>
      <p className="text-gray-400 text-sm mb-5">Sobha Lake Gardens - Clubhouse Mini Theatre</p>

      {/* Registration closed */}
      <div className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-center mb-4 inline-block">
        <p className="text-xs font-semibold text-red-400">Registration Closed</p>
      </div>

      {/* Tournament Info Capsules */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          20 Jun - 28 Jun
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-300">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Clubhouse Mini Theatre
        </span>


      </div>

      {/* Game Rules Capsule */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 mb-4">
        <p className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Game Rules
        </p>
        <p className="text-xs text-gray-300 font-medium">4-min halves till Quarter-Finals | 6-min halves from Quarter-Finals onwards | Direct penalties if drawn</p>
      </div>

      {/* Important Rules */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 mb-8">
        <p className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Important Guidelines
        </p>
        <ul className="space-y-2.5 text-xs text-gray-300">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>Kindly arrive at least <strong className="text-white">15 minutes before</strong> your scheduled time. We are working on a tight schedule and even a single delayed match affects the entire fixture.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64A9 9 0 015.64 18.36 9 9 0 0118.36 6.64z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <span>If a player does not arrive within the <strong className="text-white">scheduled start time</strong>, it will be a walkover for the opponent.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span>No last-minute registrations are accepted. If you missed the window, you are welcome to play casual matches once the scheduled games are over.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1"/><circle cx="18" cy="12" r="1"/></svg>
            <span>Please bring your own controllers. The console will be provided by the committee. In case of limited availability, the committee may provide controllers on a best-effort basis.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Please come prepared with knowledge of your controller layout and button mapping so there are no delays at kick-off.</span>
          </li>
        </ul>
      </div>

      {/* Fixtures */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Fixtures &amp; Schedule
      </h2>

      <div className="space-y-3">
        {fixtures.map((round, idx) => (
          <div key={idx} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => setExpandedRound(expandedRound === idx ? null : idx)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition"
            >
              <div>
                <p className="text-sm font-bold text-white">{round.title}</p>
                <p className="text-xs text-gray-400 font-medium">{round.date} &middot; {round.matches.length} match{round.matches.length > 1 ? "es" : ""}</p>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRound === idx ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {expandedRound === idx && (
              <div className="border-t border-white/5 divide-y divide-white/5">
                {round.matches.map((m) => (
                  <MatchRow
                    key={m.id}
                    match={{ ...m, p1: resolveName(m.p1), p2: resolveName(m.p2) }}
                    score={scores[m.id]}
                    isAdmin={isAdmin}
                    saving={saving === m.id}
                    onSave={saveScore}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Champion Trophy */}
      <div className="mt-10 mb-4 flex flex-col items-center">
        <img src="/trophy.png" alt="Champion Trophy" className="w-32 h-32 object-contain drop-shadow-[0_0_24px_rgba(255,215,0,0.5)]" />
        <h2 className="text-2xl font-black mt-4 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent tracking-wider">CHAMPION</h2>
        {champion ? (
          <p className="text-lg font-bold text-white mt-2">{champion}</p>
        ) : (
          <>
            <p className="text-sm text-gray-400 mt-1">Winner</p>
            <div className="mt-3 w-48 h-10 rounded-lg border-2 border-dashed border-yellow-500/30 flex items-center justify-center">
              <span className="text-xs text-yellow-500/50 italic">To be decided</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MatchRow({ match, score, isAdmin, saving, onSave }: {
  match: Match;
  score?: Score;
  isAdmin: boolean;
  saving: boolean;
  onSave: (matchId: string, s1: number, s2: number) => void;
}) {
  const [s1, setS1] = useState(score?.score_p1 ?? 0);
  const [s2, setS2] = useState(score?.score_p2 ?? 0);

  useEffect(() => {
    if (score) { setS1(score.score_p1); setS2(score.score_p2); }
  }, [score]);

  const hasScore = score !== undefined;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono font-bold text-gray-500 w-8 shrink-0">{match.id}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${hasScore && score!.score_p1 > score!.score_p2 ? "text-green-400" : "text-white"}`}>{match.p1}</span>
            {hasScore && !isAdmin ? (
              <span className="font-bold text-white bg-white/10 rounded px-2 py-0.5 text-xs">{score!.score_p1} - {score!.score_p2}</span>
            ) : (
              <span className="text-gray-500 text-xs">vs</span>
            )}
            <span className={`font-medium ${hasScore && score!.score_p2 > score!.score_p1 ? "text-green-400" : "text-white"}`}>{match.p2}</span>
          </div>
        </div>
        <span className="text-[11px] text-gray-400 shrink-0">{match.time}</span>
      </div>

      {/* Admin: inline score boxes always visible */}
      {isAdmin && (
        <div className="mt-2 ml-11 flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="99"
            value={s1}
            onChange={(e) => setS1(Number(e.target.value))}
            className="w-10 h-7 rounded bg-white/10 border border-white/20 text-center text-xs text-white focus:border-blue-500 focus:outline-none"
          />
          <span className="text-xs text-gray-500">-</span>
          <input
            type="number"
            min="0"
            max="99"
            value={s2}
            onChange={(e) => setS2(Number(e.target.value))}
            className="w-10 h-7 rounded bg-white/10 border border-white/20 text-center text-xs text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => onSave(match.id, s1, s2)}
            disabled={saving}
            className="px-2 py-1 text-[11px] font-medium rounded bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
          >
            {saving ? "..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
