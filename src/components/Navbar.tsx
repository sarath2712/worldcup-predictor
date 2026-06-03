"use client";

import Link from "next/link";
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
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-white/10 bg-[#0b1121]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          <span className="text-accent">FIFA</span><span className="text-white">WC2026</span>
          <span className="text-xs font-normal text-gray-400 ml-1.5">Predictor</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/matches" className="text-sm text-gray-300 hover:text-accent transition">
            Matches
          </Link>
          <Link href="/tournament" className="text-sm text-gray-300 hover:text-accent transition">
            Tournament
          </Link>
          <Link href="/leaderboard" className="text-sm text-gray-300 hover:text-accent transition">
            Leaderboard
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm text-gray-300 hover:text-accent transition">
                My Predictions
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-400 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent/80 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
