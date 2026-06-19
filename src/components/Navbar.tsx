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
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1121]/90 backdrop-blur-md">
      {/* Main banner with player images */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
        <div className="max-w-7xl mx-auto px-4 h-28 sm:h-36 md:h-48 flex items-center justify-center relative">
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
          <div className="absolute left-2 md:left-[9.5rem] bottom-0 w-20 h-24 md:w-[10rem] md:h-[12rem] overflow-hidden">
            <Image
              src="/players/messi.png"
              alt="Messi"
              width={200}
              height={220}
              className="w-full h-full object-cover object-bottom drop-shadow-[0_0_10px_rgba(139,21,56,0.5)]"
              priority
            />
          </div>

          {/* Center - Official FIFA World Cup 2026 Logo */}
          <div className="flex flex-col items-center gap-0">
            <Image
              src="/players/wc2026-logo.png"
              alt="FIFA World Cup 2026"
              width={200}
              height={240}
              className="h-20 sm:h-28 md:h-36 w-auto object-contain"
              priority
            />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              Predictor
            </span>
          </div>

          {/* Ronaldo - inner right */}
          <div className="absolute right-2 md:right-[9.5rem] bottom-0 w-20 h-24 md:w-[10rem] md:h-[12rem] overflow-hidden">
            <Image
              src="/players/ronaldo.png"
              alt="Ronaldo"
              width={200}
              height={200}
              className="w-full h-full object-cover object-bottom drop-shadow-[0_0_10px_rgba(139,21,56,0.5)]"
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
      <nav className="border-t border-white/5 bg-[#0b1121]/80">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-1.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <Link href="/" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
            ← Home
          </Link>
          <Link href="/matches" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
            Matches
          </Link>
          <Link href="/tournament" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
            Tournament
          </Link>
          <Link href="/group-predictions" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
            Groups
          </Link>
          <Link href="/leaderboard" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
            Board
          </Link>
          <Link href="/rules" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
            Rules
          </Link>

          {user ? (
            <>
              <Link href="/profile" className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-200 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/10 transition">
                <span className="sm:hidden">Predictions</span>
                <span className="hidden sm:inline">My Predictions</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-sm font-medium text-gray-400 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full border border-white/10 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              className="px-4 py-1.5 text-sm font-semibold text-black bg-accent hover:bg-accent/80 rounded-full transition"
            >
              Home
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
