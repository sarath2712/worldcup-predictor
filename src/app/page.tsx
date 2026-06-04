"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import UserHeader from "@/components/UserHeader";
import LoginModal from "@/components/LoginModal";
import { createClient } from "@/lib/supabase/client";

/* SVG Icon components - clean, standard icons */
function JerseyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 2L2 6v4l2 1v9a1 1 0 001 1h14a1 1 0 001-1v-9l2-1V6l-4.5-4h-3L12 4.5 9.5 2h-3z" />
      <path d="M9.5 2C9.5 3.38 10.62 4.5 12 4.5S14.5 3.38 14.5 2" />
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20.18 9l-5 4.09L16.82 20 12 16.54 7.18 20l1.64-6.91L4 9l5.91-.74L12 2z" />
      <circle cx="12" cy="12" r="3" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function TrophyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" />
      <path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
      <path d="M6 3h12v6a6 6 0 01-12 0V3z" />
      <path d="M12 15v3" />
      <path d="M8 21h8" />
      <path d="M10 18h4" />
    </svg>
  );
}

function GamepadIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="6" />
      <path d="M8 10v4M6 12h4" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
      <circle cx="18" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

const tiles = [
  {
    title: "Men's Football",
    subtitle: "CLASH OF THE TITANS",
    href: "/mens-football",
    Icon: JerseyIcon,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Kids Football",
    subtitle: "FUTURE STARS",
    href: "/kids-football",
    Icon: StarIcon,
    color: "from-green-500 to-green-700",
  },
  {
    title: "Women's Football",
    subtitle: "SQUAD",
    href: "/womens-football",
    Icon: JerseyIcon,
    color: "from-pink-500 to-purple-600",
  },
  {
    title: "World Cup Prediction",
    subtitle: "PICK THE WINNER",
    href: "/matches",
    Icon: TrophyIcon,
    color: "from-amber-400 to-amber-600",
  },
  {
    title: "PlayStation World Cup",
    subtitle: "eTOURNAMENT",
    href: "/playstation-worldcup",
    Icon: GamepadIcon,
    color: "from-indigo-500 to-purple-700",
  },
  {
    title: "World Cup Fixture",
    subtitle: "MATCH SCHEDULE",
    href: "/fixtures",
    Icon: CalendarIcon,
    color: "from-red-500 to-red-600",
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
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Kick-off in</span>
      {[
        { val: timeLeft.days, label: "DAYS" },
        { val: timeLeft.hours, label: "HRS" },
        { val: timeLeft.mins, label: "MIN" },
        { val: timeLeft.secs, label: "SEC" },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && <span className="text-lg font-bold text-accent">:</span>}
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {String(item.val).padStart(2, "0")}
            </div>
            <div className="text-[8px] text-gray-500 font-medium tracking-wider">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [user, setUser] = useState<{ email: string; username: string; isAdmin: boolean } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, is_admin")
        .eq("id", authUser.id)
        .single();

      setUser({
        email: authUser.email || "",
        username: profile?.username || authUser.user_metadata?.username || authUser.email || "",
        isAdmin: profile?.is_admin || false,
      });
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    window.location.href = "/matches";
  };

  const handleTileClick = (tile: typeof tiles[0], e: React.MouseEvent) => {
    if (tile.href === "/matches" && !user) {
      e.preventDefault();
      setShowLogin(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1d3a] to-[#0a2a1a] -z-10" />

      {/* Confetti/particles overlay */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[10%] w-2 h-2 bg-red-500 rotate-45 animate-pulse" />
        <div className="absolute top-20 left-[25%] w-1.5 h-1.5 bg-blue-400 rotate-12 animate-pulse" />
        <div className="absolute top-8 right-[20%] w-2 h-2 bg-green-400 -rotate-12 animate-pulse" />
        <div className="absolute top-16 right-[30%] w-1.5 h-1.5 bg-yellow-400 rotate-45 animate-pulse" />
        <div className="absolute top-24 left-[40%] w-1 h-3 bg-red-400 rotate-12 animate-pulse" />
        <div className="absolute top-12 right-[15%] w-1 h-3 bg-blue-500 -rotate-45 animate-pulse" />
        <div className="absolute top-32 left-[60%] w-2 h-2 bg-green-500 rotate-45 animate-pulse" />
        <div className="absolute top-6 left-[70%] w-1.5 h-1.5 bg-yellow-300 rotate-12 animate-pulse" />
        <div className="absolute top-40 left-[15%] w-2.5 h-1 bg-red-600 rotate-[30deg] animate-pulse" />
        <div className="absolute top-36 right-[25%] w-1 h-2.5 bg-green-600 -rotate-[20deg] animate-pulse" />
        <div className="absolute top-28 left-[80%] w-2 h-1.5 bg-blue-600 rotate-[60deg] animate-pulse" />
        <div className="absolute top-44 right-[40%] w-1.5 h-1.5 bg-yellow-500 -rotate-45 animate-pulse" />
      </div>

      {/* Green pitch gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/50 to-transparent -z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30 -z-5"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.08) 48px, rgba(255,255,255,0.08) 50px)" }}
      />

      {/* Top header bar */}
      <UserHeader user={user} onLoginClick={() => setShowLogin(true)} onLogout={handleLogout} />

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
      <p className="text-xs sm:text-sm text-gray-400 tracking-[0.3em] uppercase mb-4">
        Sobha Lake Gardens
      </p>

      {/* Countdown timer */}
      <div className="mb-4 sm:mb-10">
        <Countdown />
      </div>

      {/* Main content area with players and tiles */}
      <div className="relative w-full max-w-6xl px-4 flex items-center justify-center">
        {/* Ronaldo - left */}
        <div className="absolute left-0 bottom-0 hidden md:block w-[280px] lg:w-[360px] xl:w-[420px] pointer-events-none">
          <Image
            src="/players/ronaldo-landing.png"
            alt="Ronaldo"
            width={600}
            height={750}
            className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            priority
          />
        </div>

        {/* Messi - right */}
        <div className="absolute right-0 bottom-0 hidden md:block w-[280px] lg:w-[360px] xl:w-[420px] pointer-events-none">
          <Image
            src="/players/messi-landing.png"
            alt="Messi"
            width={600}
            height={750}
            className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            priority
          />
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 max-w-[580px] w-full relative z-10">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              onClick={(e) => handleTileClick(tile, e)}
              className={`rounded-xl sm:rounded-2xl bg-gradient-to-br ${tile.color} backdrop-blur-md border border-white/20
                flex flex-col items-start justify-end p-3 sm:p-5 aspect-[4/3] sm:aspect-square
                hover:scale-105 hover:border-white/40 hover:shadow-2xl transition-all duration-300
                group cursor-pointer relative overflow-hidden`}
            >
              {/* Layered transparent icon container */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                <div className="relative">
                  <div className="absolute -top-0.5 -left-0.5 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm" />
                  <div className="relative w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <tile.Icon className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
                  </div>
                </div>
              </div>

              {/* Arrow icon - top right */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition">
                  <ArrowIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                </div>
              </div>

              {/* Prediction tile tags */}
              {tile.href === "/matches" && !user && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 px-1.5 py-0.5 rounded-full bg-yellow-400/80 border border-yellow-300 text-[8px] sm:text-[9px] font-bold text-black tracking-wide animate-pulse shadow-lg shadow-yellow-400/30">
                  Signup to Predict
                </span>
              )}
              {tile.href === "/matches" && user && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 px-2 py-0.5 rounded-full bg-yellow-400/80 border border-yellow-300 text-[8px] sm:text-[9px] font-bold text-black tracking-wide animate-pulse shadow-lg shadow-yellow-400/30">
                  Predict Now
                </span>
              )}

              {/* Register Now tag on registration tiles */}
              {["/mens-football", "/kids-football", "/womens-football", "/playstation-worldcup"].includes(tile.href) && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 px-2 py-0.5 rounded-full bg-yellow-400/80 border border-yellow-300 text-[8px] sm:text-[9px] font-bold text-black tracking-wide animate-pulse shadow-lg shadow-yellow-400/30">
                  Register Now
                </span>
              )}

              {/* Title */}
              <span className="text-sm sm:text-lg font-bold text-white leading-tight">
                {tile.title}
              </span>
              {/* Subtitle */}
              <span className="text-[8px] sm:text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mt-0.5">
                {tile.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  );
}
