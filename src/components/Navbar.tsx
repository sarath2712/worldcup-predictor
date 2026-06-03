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
        <div className="max-w-6xl mx-auto px-4 h-24 md:h-32 flex items-center justify-center relative">
          {/* Messi - left */}
          <div className="absolute left-2 md:left-8 bottom-0">
            <Image
              src="/players/messi.png"
              alt="Messi"
              width={140}
              height={154}
              className="w-20 h-22 md:w-32 md:h-36 object-contain drop-shadow-[0_0_10px_rgba(139,21,56,0.5)]"
              priority
            />
          </div>

          {/* Center title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center">
            <span className="text-accent">FIFA</span>
            <span className="text-white">WC2026</span>
            <span className="text-accent">Predictor</span>
          </h1>

          {/* Ronaldo - right */}
          <div className="absolute right-2 md:right-8 bottom-0">
            <Image
              src="/players/ronaldo.png"
              alt="Ronaldo"
              width={140}
              height={154}
              className="w-20 h-22 md:w-32 md:h-36 object-contain drop-shadow-[0_0_10px_rgba(139,21,56,0.5)]"
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
