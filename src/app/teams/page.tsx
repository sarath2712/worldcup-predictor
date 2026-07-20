"use client";

import Link from "next/link";
import { useState } from "react";

type Player = {
  name: string;
  age?: number;
  flat?: string;
  isCaptain: boolean;
};

type Team = {
  name: string;
  players: Player[];
};

const kidsTeams: Team[] = [
  {
    name: "Team 1",
    players: [
      { name: "Nivin Saju", age: 12, flat: "6133", isCaptain: true },
      { name: "Aditya Sai Uppala", age: 14, isCaptain: false },
      { name: "Swayash Jha", age: 12, flat: "3042", isCaptain: false },
      { name: "Liyan Deshmukh", age: 9, flat: "7171", isCaptain: false },
      { name: "Alvin Jibi", age: 10, flat: "3051", isCaptain: false },
      { name: "Hanah M Mathew", age: 8, flat: "4164", isCaptain: false },
      { name: "Nithin Nambiar", age: 7, flat: "2172", isCaptain: false },
      { name: "Rajen Shaw", age: 7, flat: "2024", isCaptain: false },
      { name: "Aryan Singh", flat: "2112", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Aryush", age: 14, flat: "8152", isCaptain: true },
      { name: "Johan Shinu Mathew", age: 12, flat: "6164", isCaptain: false },
      { name: "Aayansh Singh", age: 11, flat: "5033", isCaptain: false },
      { name: "Krishang Sinha", age: 11, flat: "8041", isCaptain: false },
      { name: "Riyanshu Guha", age: 9, flat: "8014", isCaptain: false },
      { name: "Aadhrit Pandey", age: 8, flat: "6074", isCaptain: false },
      { name: "Kiara", age: 7, flat: "2174", isCaptain: false },
      { name: "Avyaan Biswas", age: 7, flat: "4121", isCaptain: false },
      { name: "Dhruv Saharan", age: 11, flat: "4082", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Aaradhya Rawat", age: 13, flat: "7062", isCaptain: true },
      { name: "Antonio Rishon", age: 13, flat: "L-6063", isCaptain: false },
      { name: "Priyanshu", age: 11, flat: "8003", isCaptain: false },
      { name: "Hreyansh", age: 11, flat: "5183", isCaptain: false },
      { name: "Aaron Bennett", age: 10, flat: "L-6063", isCaptain: false },
      { name: "Uddeshya", age: 8, flat: "5143", isCaptain: false },
      { name: "Magizhan Ganeshan", age: 7, flat: "3143", isCaptain: false },
      { name: "Surya Raj", age: 7, flat: "2152", isCaptain: false },
      { name: "Krishna", age: 14, isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Kunal", age: 13, flat: "5111", isCaptain: true },
      { name: "Utkarsh", age: 13, flat: "5183", isCaptain: false },
      { name: "Aaryan Abhilash", age: 11, flat: "5124", isCaptain: false },
      { name: "Ritvik Chaturvedi", age: 11, flat: "5133", isCaptain: false },
      { name: "Suyukth", age: 9, isCaptain: false },
      { name: "Naval Geete", age: 8, flat: "3034", isCaptain: false },
      { name: "Gianna Takhelmayum", age: 7, flat: "4042", isCaptain: false },
      { name: "Mayank Chauhan", age: 7, flat: "3104", isCaptain: false },
      { name: "Satyam Pandey", age: 11, flat: "8073", isCaptain: false },
    ],
  },
];

const mensTeams: Team[] = [
  {
    name: "Team 1",
    players: [
      { name: "Chirag Tyagh", flat: "A1001", isCaptain: true },
      { name: "Sushant Kumar", flat: "2122", isCaptain: false },
      { name: "Pikanshu Kumar", flat: "7082", isCaptain: false },
      { name: "Franklin Francis", flat: "8124", isCaptain: false },
      { name: "Sagar Kateel", flat: "Q-8004", isCaptain: false },
      { name: "Arjun", flat: "5182", isCaptain: false },
      { name: "Tushar", flat: "7111", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Kshiraj Nair", flat: "8062", isCaptain: true },
      { name: "Rohan", flat: "5154", isCaptain: false },
      { name: "Kishor", flat: "1067", isCaptain: false },
      { name: "Sriram S", flat: "7131", isCaptain: false },
      { name: "Jay Patel", flat: "2132", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Anil Rawat", flat: "7062", isCaptain: true },
      { name: "Pankaj Kumawat", flat: "2061", isCaptain: false },
      { name: "Gitrajit", flat: "4042", isCaptain: false },
      { name: "Pavan Itagi", flat: "8043", isCaptain: false },
      { name: "Sachin Shiragola", flat: "6174", isCaptain: false },
      { name: "Mitesh Rao V", flat: "7012", isCaptain: false },
      { name: "Rithwik Sasikumar", flat: "2173", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Mithin Mathew", flat: "4164", isCaptain: true },
      { name: "Mithun", flat: "7081", isCaptain: false },
      { name: "Nithin Nambiar", flat: "2172", isCaptain: false },
      { name: "Praveesh", isCaptain: false },
      { name: "Suvin", flat: "6152", isCaptain: false },
      { name: "Shanthibhushan", flat: "7013", isCaptain: false },
      { name: "Sarath", flat: "7163", isCaptain: false },
    ],
  },
];

const womensTeams: Team[] = [
  {
    name: "Team 1",
    players: [
      { name: "Preemy", isCaptain: true },
      { name: "Srilakshmi", isCaptain: false },
      { name: "Tanya", isCaptain: false },
      { name: "Reshma", isCaptain: false },
      { name: "Aiswarya", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Sushravya", isCaptain: true },
      { name: "Ahana", isCaptain: false },
      { name: "Aswathi", isCaptain: false },
      { name: "Fathima", isCaptain: false },
      { name: "Archana", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Maithri", isCaptain: true },
      { name: "Pavithra", isCaptain: false },
      { name: "Shruthi", isCaptain: false },
      { name: "Hana", isCaptain: false },
      { name: "Bakkiya", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Renjana", isCaptain: true },
      { name: "Anushka", isCaptain: false },
      { name: "Hala", isCaptain: false },
      { name: "Sreelakshmi", isCaptain: false },
      { name: "Surya", isCaptain: false },
    ],
  },
];

const kidsResults = { champion: "Team 3", runnerUp: "Team 4" };
const mensResults = { champion: "Team 2", runnerUp: "Team 4" };
const womensResults = { champion: "Team 1", runnerUp: "Team 2" };
const mensFixtures = [
  { stage: "Semi-Final 1", fixture: "Team 2 vs Team 1", result: "Team 2 wins by walkover" },
  { stage: "Semi-Final 2", fixture: "Team 3 vs Team 4", result: "Team 4 wins by walkover" },
  { stage: "Final", fixture: "Team 2 vs Team 4", result: "Team 2 wins — Champion" },
];

function WinnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" />
        <path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
        <path d="M6 3h12v6a6 6 0 01-12 0V3z" />
        <path d="M12 15v3" /><path d="M8 21h8" />
      </svg>
      Champion
    </span>
  );
}

function RunnerUpBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-400/20 border border-gray-400/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
      🥈 Runner-up
    </span>
  );
}

function ResultTeamCard({ team, result }: { team: Team; result: "champion" | "runner-up" | null }) {
  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${
      result === "champion"
        ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent"
        : result === "runner-up"
        ? "border-gray-400/30 bg-gradient-to-br from-gray-500/10 via-gray-500/5 to-transparent"
        : "border-white/10 bg-white/5"
    }`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-accent">{team.name}</h2>
        {result === "champion" && <WinnerBadge />}
        {result === "runner-up" && <RunnerUpBadge />}
      </div>
      <div className="space-y-2">
        {team.players.map((p) => (
          <div
            key={p.name}
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 rounded-lg ${
              p.isCaptain ? "bg-accent/10 border border-accent/30" : "bg-white/5"
            }`}
          >
            <span className="font-semibold text-white text-sm">
              {p.name}
              {p.isCaptain && <span className="ml-1.5 text-accent text-xs">(C)</span>}
            </span>
            {p.age && <span className="text-xs text-gray-500">Age {p.age}</span>}
            {p.flat && <span className="text-xs text-gray-500">Flat {p.flat}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompetitionPage() {
  const [activeSection, setActiveSection] = useState<"kids" | "mens" | "womens">("kids");

  const sections = [
    { key: "kids" as const, label: "Kids", color: "from-green-500 to-green-700", subtitle: "4 Teams · 35 Players · Ages 7–14" },
    { key: "mens" as const, label: "Men's", color: "from-blue-500 to-blue-700", subtitle: "4 Teams · 30 Players" },
    { key: "womens" as const, label: "Women's", color: "from-pink-500 to-purple-600", subtitle: "4 Teams · 20 Players" },
  ];

  const current = sections.find((s) => s.key === activeSection)!;

  function getTeamResult(teamName: string, category: "kids" | "mens" | "womens"): "champion" | "runner-up" | null {
    const results = category === "kids" ? kidsResults : category === "mens" ? mensResults : womensResults;
    if (teamName === results.champion) return "champion";
    if (teamName === results.runnerUp) return "runner-up";
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" />
          <path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
          <path d="M6 3h12v6a6 6 0 01-12 0V3z" />
          <path d="M12 15v3" /><path d="M8 21h8" />
        </svg>
        COMPETITION
      </h1>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeSection === s.key
                ? `bg-gradient-to-r ${s.color} text-white shadow-lg scale-105`
                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-gray-400 mb-6">{current.subtitle}</p>

      {/* Kids - Results with winner badges */}
      {activeSection === "kids" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kidsTeams.map((team) => (
            <ResultTeamCard key={team.name} team={team} result={getTeamResult(team.name, "kids")} />
          ))}
        </div>
      )}

      {/* Men's - Results with winner badges */}
      {activeSection === "mens" && (
        <>
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 mb-6">
            <h2 className="text-lg font-bold text-blue-400 mb-4">Men&apos;s Football Results</h2>
            <div className="space-y-3">
              {mensFixtures.map((match) => (
                <div key={match.stage} className="rounded-xl bg-black/20 border border-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-400">{match.stage}</p>
                  <p className="font-semibold text-white mt-1">{match.fixture}</p>
                  <p className="text-sm text-green-400 mt-1">{match.result}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mensTeams.map((team) => (
              <ResultTeamCard key={team.name} team={team} result={getTeamResult(team.name, "mens")} />
            ))}
          </div>
        </>
      )}

      {/* Women's - Results with winner badges */}
      {activeSection === "womens" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {womensTeams.map((team) => (
            <ResultTeamCard key={team.name} team={team} result={getTeamResult(team.name, "womens")} />
          ))}
        </div>
      )}
    </div>
  );
}
