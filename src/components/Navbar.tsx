"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/matches";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1121]/90 backdrop-blur-md">
      {/* Main banner with player images */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
        <div className="max-w-7xl mx-auto px-4 h-36 md:h-48 flex items-center justify-center relative">
          {/* Yamal - far left */}
          <div className="absolute left-0 bottom-0 hidden md:block w-[9rem] h-[12rem]">
            <Image
              src="/players/yamal.png"
              alt="Yamal"
              width={200}
              height={366}
              className="w-full h-full object-contain object-bottom opacity-80 drop-shadow-[0_0_10px_rgba(139,21,56,0.4)]"
              priority
            />
          </div>

          {/* Messi - inner left */}
          <div className="absolute left-2 md:left-[9.5rem] bottom-0 w-20 h-24 md:w-[9rem] md:h-[12rem]">
            <Image
              src="/players/messi.png"
              alt="Messi"
              width={200}
              height={220}
              className="w-full h-full object-contain object-bottom drop-shadow-[0_0_10px_rgba(139,21,56,0.5)]"
              priority
            />
          </div>

          {/* Center title with World Cup logo */}
          <div className="flex flex-col items-center gap-0">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-accent">FIFA</span>
              <span className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white">World</span>
              <span className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-accent">CUP</span>
              <Image
                src="/players/worldcup-logo.png"
                alt="FIFA World Cup 2026"
                width={55}
                height={68}
                className="w-9 h-11 md:w-14 md:h-[68px] object-contain"
                priority
              />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-400 tracking-[0.3em] uppercase">
              Predictor
            </span>
          </div>

          {/* Ronaldo - inner right */}
          <div className="absolute right-2 md:right-[9.5rem] bottom-0 w-20 h-24 md:w-[9rem] md:h-[12rem]">
            <Image
              src="/players/ronaldo.png"
              alt="Ronaldo"
              width={200}
              height={200}
              className="w-full h-full object-contain object-bottom drop-shadow-[0_0_10px_rgba(139,21,56,0.5)]"
              priority
            />
          </div>

          {/* Mbappe - far right */}
          <div className="absolute right-0 bottom-0 hidden md:block w-[9rem] h-[12rem]">
            <Image
              src="/players/mbappe.png"
              alt="Mbappe"
              width={200}
              height={278}
              className="w-full h-full object-contain object-bottom opacity-80 drop-shadow-[0_0_10px_rgba(139,21,56,0.4)]"
              priority
            />
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="border-t border-white/5 bg-[#0b1121]/60">
        <div className="max-w-5xl mx-auto px-4 h-10 flex items-center justify-center gap-6">
          <Link href="/matches" className="text-sm text-gray-300 hover:text-accent transition">
            Matches
          </Link>
          <Link href="/tournament" className="text-sm text-gray-300 hover:text-accent transition">
            Tournament
          </Link>
          <Link href="/leaderboard" className="text-sm text-gray-300 hover:text-accent transition">
            Leaderboard
          </Link>
          <Link href="/rules" className="text-sm text-gray-300 hover:text-accent transition">
            Rules
          </Link>

          {user ? (
            <>
              <Link href="/profile" className="text-sm text-gray-300 hover:text-accent transition">
                My Predictions
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-3 py-1 bg-accent text-black font-semibold rounded-md hover:bg-accent/80 transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
