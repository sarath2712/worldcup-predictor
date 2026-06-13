"use client";

import Link from "next/link";

const kidsWinners = {
  champion: {
    team: "Team 3",
    players: ["Aaradhya Rawat (C)", "Antonio Rishon", "Priyanshu", "Hreyansh", "Aaron Bennett", "Uddeshya", "Magizhan Ganeshan", "Surya Raj", "Krishna"],
  },
  runnerUp: {
    team: "Team 4",
    players: ["Kunal (C)", "Utkarsh", "Aaryan Abhilash", "Ritvik Chaturvedi", "Suyukth", "Naval Geete", "Gianna Takhelmayum", "Mayank Chauhan", "Satyam Pandey"],
  },
};

const womensWinners = {
  champion: {
    team: "Team 1",
    players: ["Preemy (C)", "Srilakshmi", "Tanya", "Reshma", "Aiswarya"],
  },
  runnerUp: {
    team: "Team 2",
    players: ["Sushravya (C)", "Ahana", "Aswathi", "Fathima", "Archana"],
  },
};

export default function WinnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-4xl">🏆</span>
          TOURNAMENT WINNERS
        </h1>
        <p className="text-sm text-gray-400 mb-8">SLG FIFA World Cup 2026 — Sobha Lake Gardens</p>

        {/* Kids Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚽</span>
            <h2 className="text-xl font-bold text-green-400">Kids Category</h2>
          </div>

          {/* Champion */}
          <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/30 rounded-xl p-5 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Champions</p>
                <p className="text-lg font-bold text-white">{kidsWinners.champion.team}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
              {kidsWinners.champion.players.map((name) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className={`text-xs ${name.includes("(C)") ? "font-bold text-yellow-300" : "text-gray-300"}`}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Runner-up */}
          <div className="bg-gradient-to-r from-gray-500/10 via-gray-500/5 to-transparent border border-gray-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🥈</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Runners-up</p>
                <p className="text-lg font-bold text-white">{kidsWinners.runnerUp.team}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
              {kidsWinners.runnerUp.players.map((name) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span className={`text-xs ${name.includes("(C)") ? "font-bold text-gray-200" : "text-gray-400"}`}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Women Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚽</span>
            <h2 className="text-xl font-bold text-pink-400">Women&apos;s Category</h2>
          </div>

          {/* Champion */}
          <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/30 rounded-xl p-5 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Champions</p>
                <p className="text-lg font-bold text-white">{womensWinners.champion.team}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
              {womensWinners.champion.players.map((name) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className={`text-xs ${name.includes("(C)") ? "font-bold text-yellow-300" : "text-gray-300"}`}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Runner-up */}
          <div className="bg-gradient-to-r from-gray-500/10 via-gray-500/5 to-transparent border border-gray-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🥈</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Runners-up</p>
                <p className="text-lg font-bold text-white">{womensWinners.runnerUp.team}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
              {womensWinners.runnerUp.players.map((name) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span className={`text-xs ${name.includes("(C)") ? "font-bold text-gray-200" : "text-gray-400"}`}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Men's - Coming Soon */}
        <div className="border border-dashed border-blue-500/30 rounded-xl p-5 text-center">
          <span className="text-lg">⚽</span>
          <p className="text-sm font-bold text-blue-400 mt-1">Men&apos;s Category</p>
          <p className="text-xs text-gray-500 mt-1">Tournament in progress...</p>
        </div>
      </div>
    </div>
  );
}
