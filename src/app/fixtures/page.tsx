"use client";

import Link from "next/link";
import { useState } from "react";

type Match = {
  time: string;
  team1: string;
  team2: string;
  group: string;
  venue: string;
};

const fixturesByDay: Record<string, Match[]> = {
  "Jun 11 (Wed)": [
    { time: "14:00", team1: "Belgium", team2: "Bolivia", group: "J", venue: "Dallas" },
    { time: "17:00", team1: "Spain", team2: "Uzbekistan", group: "B", venue: "New York/NJ" },
    { time: "20:00", team1: "Morocco", team2: "Peru", group: "A", venue: "Buenos Aires" },
  ],
  "Jun 12 (Thu)": [
    { time: "10:00", team1: "Chile", team2: "Scotland", group: "J", venue: "Nashville" },
    { time: "13:00", team1: "Canada", team2: "Australia", group: "A", venue: "Toronto" },
    { time: "16:00", team1: "Portugal", team2: "Uruguay", group: "B", venue: "Miami" },
    { time: "19:00", team1: "Mexico", team2: "Cameroon", group: "C", venue: "Mexico City" },
    { time: "22:00", team1: "Ecuador", team2: "New Zealand", group: "C", venue: "Guadalajara" },
  ],
  "Jun 13 (Fri)": [
    { time: "13:00", team1: "USA", team2: "Wales", group: "D", venue: "Seattle" },
    { time: "16:00", team1: "England", team2: "Qatar", group: "D", venue: "Philadelphia" },
    { time: "19:00", team1: "France", team2: "China PR", group: "E", venue: "Kansas City" },
    { time: "22:00", team1: "Colombia", team2: "Saudi Arabia", group: "E", venue: "Dallas" },
  ],
  "Jun 14 (Sat)": [
    { time: "10:00", team1: "Netherlands", team2: "Tanzania", group: "K", venue: "Nashville" },
    { time: "13:00", team1: "Brazil", team2: "Serbia", group: "F", venue: "Los Angeles" },
    { time: "13:00", team1: "Senegal", team2: "Panama", group: "K", venue: "Houston" },
    { time: "16:00", team1: "Japan", team2: "Bahrain", group: "F", venue: "Vancouver" },
    { time: "19:00", team1: "Argentina", team2: "Indonesia", group: "G", venue: "Miami" },
    { time: "22:00", team1: "Denmark", team2: "Paraguay", group: "G", venue: "Charlotte" },
  ],
  "Jun 15 (Sun)": [
    { time: "10:00", team1: "Croatia", team2: "Jamaica", group: "L", venue: "Toronto" },
    { time: "13:00", team1: "Germany", team2: "Costa Rica", group: "H", venue: "Boston" },
    { time: "13:00", team1: "Switzerland", team2: "Ghana", group: "L", venue: "Vancouver" },
    { time: "16:00", team1: "Nigeria", team2: "South Korea", group: "H", venue: "Philadelphia" },
    { time: "19:00", team1: "Italy", team2: "Egypt", group: "I", venue: "New York/NJ" },
    { time: "22:00", team1: "Iran", team2: "Honduras", group: "I", venue: "Guadalajara" },
  ],
  "Jun 16 (Mon)": [
    { time: "13:00", team1: "Uzbekistan", team2: "Portugal", group: "B", venue: "Philadelphia" },
    { time: "16:00", team1: "Peru", team2: "Canada", group: "A", venue: "Kansas City" },
    { time: "19:00", team1: "Morocco", team2: "Australia", group: "A", venue: "Miami" },
    { time: "22:00", team1: "Spain", team2: "Uruguay", group: "B", venue: "Atlanta" },
  ],
  "Jun 17 (Tue)": [
    { time: "10:00", team1: "Bolivia", team2: "Chile", group: "J", venue: "Charlotte" },
    { time: "13:00", team1: "Cameroon", team2: "Ecuador", group: "C", venue: "Houston" },
    { time: "13:00", team1: "Belgium", team2: "Scotland", group: "J", venue: "Boston" },
    { time: "16:00", team1: "Mexico", team2: "New Zealand", group: "C", venue: "Monterrey" },
    { time: "19:00", team1: "Wales", team2: "England", group: "D", venue: "Boston" },
    { time: "22:00", team1: "USA", team2: "Qatar", group: "D", venue: "San Francisco" },
  ],
  "Jun 18 (Wed)": [
    { time: "10:00", team1: "Tanzania", team2: "Senegal", group: "K", venue: "Atlanta" },
    { time: "13:00", team1: "China PR", team2: "Colombia", group: "E", venue: "Atlanta" },
    { time: "13:00", team1: "Netherlands", team2: "Panama", group: "K", venue: "Kansas City" },
    { time: "16:00", team1: "France", team2: "Saudi Arabia", group: "E", venue: "Miami" },
    { time: "19:00", team1: "Serbia", team2: "Japan", group: "F", venue: "Seattle" },
    { time: "22:00", team1: "Brazil", team2: "Bahrain", group: "F", venue: "San Francisco" },
  ],
  "Jun 19 (Thu)": [
    { time: "10:00", team1: "Jamaica", team2: "Switzerland", group: "L", venue: "Cincinnati" },
    { time: "13:00", team1: "Indonesia", team2: "Denmark", group: "G", venue: "Dallas" },
    { time: "13:00", team1: "Croatia", team2: "Ghana", group: "L", venue: "San Francisco" },
    { time: "16:00", team1: "Argentina", team2: "Paraguay", group: "G", venue: "Atlanta" },
    { time: "19:00", team1: "Costa Rica", team2: "Nigeria", group: "H", venue: "Houston" },
    { time: "22:00", team1: "Germany", team2: "South Korea", group: "H", venue: "New York/NJ" },
  ],
  "Jun 20 (Fri)": [
    { time: "13:00", team1: "Egypt", team2: "Iran", group: "I", venue: "Cincinnati" },
    { time: "16:00", team1: "Australia", team2: "Peru", group: "A", venue: "Los Angeles" },
    { time: "16:00", team1: "Canada", team2: "Morocco", group: "A", venue: "Toronto" },
    { time: "19:00", team1: "Uruguay", team2: "Uzbekistan", group: "B", venue: "Dallas" },
    { time: "19:00", team1: "Portugal", team2: "Spain", group: "B", venue: "New York/NJ" },
    { time: "22:00", team1: "Italy", team2: "Honduras", group: "I", venue: "Monterrey" },
  ],
  "Jun 21 (Sat)": [
    { time: "13:00", team1: "Scotland", team2: "Bolivia", group: "J", venue: "Seattle" },
    { time: "13:00", team1: "Chile", team2: "Belgium", group: "J", venue: "Cincinnati" },
    { time: "16:00", team1: "New Zealand", team2: "Cameroon", group: "C", venue: "Los Angeles" },
    { time: "16:00", team1: "Ecuador", team2: "Mexico", group: "C", venue: "Mexico City" },
    { time: "19:00", team1: "Qatar", team2: "Wales", group: "D", venue: "Houston" },
    { time: "19:00", team1: "England", team2: "USA", group: "D", venue: "New York/NJ" },
  ],
  "Jun 22 (Sun)": [
    { time: "13:00", team1: "Panama", team2: "Tanzania", group: "K", venue: "Charlotte" },
    { time: "13:00", team1: "Senegal", team2: "Netherlands", group: "K", venue: "Dallas" },
    { time: "16:00", team1: "Saudi Arabia", team2: "China PR", group: "E", venue: "Cincinnati" },
    { time: "16:00", team1: "Colombia", team2: "France", group: "E", venue: "Nashville" },
    { time: "19:00", team1: "Bahrain", team2: "Serbia", group: "F", venue: "Charlotte" },
    { time: "19:00", team1: "Japan", team2: "Brazil", group: "F", venue: "Los Angeles" },
  ],
  "Jun 23 (Mon)": [
    { time: "13:00", team1: "Ghana", team2: "Jamaica", group: "L", venue: "Toronto" },
    { time: "13:00", team1: "Switzerland", team2: "Croatia", group: "L", venue: "Vancouver" },
    { time: "16:00", team1: "Paraguay", team2: "Indonesia", group: "G", venue: "Nashville" },
    { time: "16:00", team1: "Denmark", team2: "Argentina", group: "G", venue: "Miami" },
    { time: "19:00", team1: "South Korea", team2: "Costa Rica", group: "H", venue: "Kansas City" },
    { time: "19:00", team1: "Nigeria", team2: "Germany", group: "H", venue: "Philadelphia" },
  ],
  "Jun 24 (Tue)": [
    { time: "16:00", team1: "Honduras", team2: "Egypt", group: "I", venue: "Mexico City" },
    { time: "16:00", team1: "Iran", team2: "Italy", group: "I", venue: "Dallas" },
  ],
};

const groups = [
  { name: "Group A", teams: ["Morocco", "Peru", "Canada", "Australia"] },
  { name: "Group B", teams: ["Spain", "Portugal", "Uruguay", "Uzbekistan"] },
  { name: "Group C", teams: ["Mexico", "Ecuador", "Cameroon", "New Zealand"] },
  { name: "Group D", teams: ["USA", "England", "Wales", "Qatar"] },
  { name: "Group E", teams: ["France", "Colombia", "Saudi Arabia", "China PR"] },
  { name: "Group F", teams: ["Brazil", "Japan", "Serbia", "Bahrain"] },
  { name: "Group G", teams: ["Argentina", "Denmark", "Paraguay", "Indonesia"] },
  { name: "Group H", teams: ["Germany", "Nigeria", "South Korea", "Costa Rica"] },
  { name: "Group I", teams: ["Italy", "Iran", "Honduras", "Egypt"] },
  { name: "Group J", teams: ["Belgium", "Chile", "Scotland", "Bolivia"] },
  { name: "Group K", teams: ["Netherlands", "Senegal", "Panama", "Tanzania"] },
  { name: "Group L", teams: ["Croatia", "Switzerland", "Ghana", "Jamaica"] },
];

const knockoutRounds = [
  { name: "Round of 32", dates: "Jun 25 – Jun 28", matches: 16 },
  { name: "Round of 16", dates: "Jun 29 – Jul 2", matches: 8 },
  { name: "Quarter-Finals", dates: "Jul 4 – Jul 5", matches: 4 },
  { name: "Semi-Finals", dates: "Jul 8 – Jul 9", matches: 2 },
  { name: "Third-Place Play-off", dates: "Jul 12", matches: 1 },
  { name: "Final", dates: "Jul 13", matches: 1, venue: "New York/New Jersey" },
];

type Tab = "fixtures" | "tables";

export default function FixturesPage() {
  const [tab, setTab] = useState<Tab>("fixtures");
  const days = Object.keys(fixturesByDay);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-2">📋 FIFA World Cup 2026</h1>
      <p className="text-gray-400 mb-6">June 11 – July 13, 2026</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("fixtures")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            tab === "fixtures"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Fixtures by Day
        </button>
        <button
          onClick={() => setTab("tables")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            tab === "tables"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Group Tables
        </button>
      </div>

      {tab === "fixtures" ? (
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-6 py-3 bg-accent/10 border-b border-white/10">
                <h2 className="text-lg font-bold text-accent">{day}</h2>
                <p className="text-xs text-gray-500">{fixturesByDay[day].length} matches</p>
              </div>
              <div className="divide-y divide-white/5">
                {fixturesByDay[day].map((match, idx) => (
                  <div key={idx} className="px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-4 text-sm">
                    <span className="text-gray-500 w-12 shrink-0 text-center">{match.time}</span>
                    <span className="text-xs text-gray-600 w-8 shrink-0">Gp {match.group}</span>
                    <span className="flex-1 text-right font-medium truncate">{match.team1}</span>
                    <span className="text-accent font-bold px-1">vs</span>
                    <span className="flex-1 font-medium truncate">{match.team2}</span>
                    <span className="text-gray-500 text-xs w-28 shrink-0 text-right hidden sm:block">{match.venue}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Knockout Rounds */}
          <h2 className="text-3xl font-bold mt-12 mb-4">🏟️ Knockout Rounds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {knockoutRounds.map((round) => (
              <div key={round.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold mb-1">{round.name}</h3>
                <p className="text-sm text-gray-400">{round.dates}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {round.matches} {round.matches === 1 ? "match" : "matches"}
                  {round.venue && ` — ${round.venue}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div key={group.name} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-5 py-3 bg-primary/20 border-b border-white/10">
                <h2 className="text-base font-bold">{group.name}</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-white/5">
                    <th className="text-left px-5 py-2 font-medium">Team</th>
                    <th className="px-2 py-2 font-medium w-8">P</th>
                    <th className="px-2 py-2 font-medium w-8">W</th>
                    <th className="px-2 py-2 font-medium w-8">D</th>
                    <th className="px-2 py-2 font-medium w-8">L</th>
                    <th className="px-2 py-2 font-medium w-10">GD</th>
                    <th className="px-2 py-2 font-medium w-10">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((team, idx) => (
                    <tr
                      key={team}
                      className={`border-b border-white/5 ${
                        idx < 2 ? "text-white" : "text-gray-500"
                      }`}
                    >
                      <td className="px-5 py-2.5 font-medium">{team}</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center">0</td>
                      <td className="px-2 py-2.5 text-center font-bold">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
