"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => setIsAdmin(profile?.is_admin ?? false));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) setIsAdmin(false);
      }
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
      <nav className="border-t border-white/5 bg-[#0b1121]/60 overflow-x-auto">
        <div className="max-w-5xl mx-auto px-4 h-10 flex items-center justify-start sm:justify-center gap-4 sm:gap-6 min-w-max">
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
              {isAdmin && (
                <Link href="/admin" className="text-sm text-yellow-400 hover:text-yellow-300 transition">
                  Admin
                </Link>
              )}
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
