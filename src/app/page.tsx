"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const tiles = [
  {
    title: "Men's Football",
    subtitle: "GROUP A-L",
    href: "/mens-football",
    emoji: "⚽",
    color: "from-blue-500/80 to-blue-700/80",
  },
  {
    title: "Kids Football",
    subtitle: "FUTURE STARS",
    href: "/kids-football",
    emoji: "🧒",
    color: "from-green-500/80 to-green-700/80",
  },
  {
    title: "Women's Football",
    subtitle: "SQUAD",
    href: "/womens-football",
    emoji: "⚽",
    color: "from-pink-500/80 to-purple-600/80",
  },
  {
    title: "World Cup Prediction",
    subtitle: "PICK THE WINNER",
    href: "/matches",
    emoji: "🏆",
    color: "from-amber-400/80 to-amber-600/80",
  },
  {
    title: "PlayStation World Cup",
    subtitle: "eTOURNAMENT",
    href: "/playstation-worldcup",
    emoji: "🎮",
    color: "from-indigo-500/80 to-purple-700/80",
  },
  {
    title: "World Cup Fixture",
    subtitle: "MATCH SCHEDULE",
    href: "/fixtures",
    emoji: "📋",
    color: "from-red-500/80 to-red-700/80",
  },
];

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date("2026-06-11T20:00:00Z").getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">Kick-off in</span>
      {[
        { val: timeLeft.days, label: "DAYS" },
        { val: timeLeft.hours, label: "HRS" },
        { val: timeLeft.mins, label: "MIN" },
        { val: timeLeft.secs, label: "SEC" },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center gap-2 sm:gap-3">
          {i > 0 && <span className="text-2xl font-bold text-accent">:</span>}
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {String(item.val).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-gray-500 font-medium tracking-wider">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1d3a] to-[#0a2a1a] -z-10" />

      {/* Confetti/particles overlay */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[10%] w-2 h-2 bg-red-500 rotate-45 animate-pulse" />
        <div className="absolute top-20 left-[25%] w-1.5 h-1.5 bg-blue-400 rotate-12 animate-pulse delay-100" />
        <div className="absolute top-8 right-[20%] w-2 h-2 bg-green-400 -rotate-12 animate-pulse delay-200" />
        <div className="absolute top-16 right-[30%] w-1.5 h-1.5 bg-yellow-400 rotate-45 animate-pulse delay-300" />
        <div className="absolute top-24 left-[40%] w-1 h-3 bg-red-400 rotate-12 animate-pulse delay-150" />
        <div className="absolute top-12 right-[15%] w-1 h-3 bg-blue-500 -rotate-45 animate-pulse delay-250" />
        <div className="absolute top-32 left-[60%] w-2 h-2 bg-green-500 rotate-45 animate-pulse delay-75" />
        <div className="absolute top-6 left-[70%] w-1.5 h-1.5 bg-yellow-300 rotate-12 animate-pulse delay-200" />
      </div>

      {/* Green pitch gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/40 to-transparent -z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 -z-5"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.1) 48px, rgba(255,255,255,0.1) 50px)" }}
      />

      {/* Top badges */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 mb-4">
        {[
          { flag: "🔴", name: "CANADA" },
          { flag: "🟦", name: "USA" },
          { flag: "🟢", name: "MEXICO" },
          { flag: "🔴", name: "2026" },
        ].map((b) => (
          <span key={b.name} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-medium text-gray-300">
            <span className="text-[10px]">{b.flag}</span> {b.name}
          </span>
        ))}
      </div>

      {/* Header text */}
      <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.3em] mb-1">
        United · 16 Cities · 48 Teams
      </p>

      {/* Main title */}
      <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-center leading-none mb-1"
        style={{
          background: "linear-gradient(90deg, #3b82f6, #eab308, #22c55e, #ef4444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        FIFA WC 2026
      </h1>

      {/* Sobha Lake Gardens */}
      <p className="text-xs sm:text-sm text-gray-400 tracking-[0.3em] uppercase mb-8 sm:mb-10">
        Sobha Lake Gardens
      </p>

      {/* Main content area with players and tiles */}
      <div className="relative w-full max-w-6xl px-4 flex items-center justify-center">
        {/* Ronaldo - left */}
        <div className="absolute left-0 bottom-0 hidden md:block w-[220px] lg:w-[280px] pointer-events-none">
          <Image
            src="/players/ronaldo.png"
            alt="Ronaldo"
            width={400}
            height={500}
            className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            priority
          />
        </div>

        {/* Messi - right */}
        <div className="absolute right-0 bottom-0 hidden md:block w-[220px] lg:w-[280px] pointer-events-none">
          <Image
            src="/players/messi.png"
            alt="Messi"
            width={400}
            height={500}
            className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            priority
          />
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl w-full relative z-10">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className={`rounded-2xl bg-gradient-to-br ${tile.color} backdrop-blur-md border border-white/20
                flex flex-col items-start justify-end gap-1 p-4 sm:p-5 aspect-[4/3]
                hover:scale-105 hover:border-white/40 hover:shadow-2xl transition-all duration-300
                group cursor-pointer relative overflow-hidden`}
            >
              {/* Large icon - stands out */}
              <span className="absolute top-3 left-4 text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform">
                {tile.emoji}
              </span>
              {/* Title */}
              <span className="text-sm sm:text-base font-bold text-white leading-tight mt-auto">
                {tile.title}
              </span>
              {/* Subtitle */}
              <span className="text-[10px] sm:text-xs font-medium text-white/60 uppercase tracking-wider">
                {tile.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Countdown timer */}
      <div className="mt-12 sm:mt-16 mb-8">
        <Countdown />
      </div>
    </div>
  );
}
