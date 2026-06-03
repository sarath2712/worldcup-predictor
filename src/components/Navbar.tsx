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
    <nav className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary">
          ⚽ WC2026
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/matches" className="text-sm hover:text-primary transition">
            Matches
          </Link>
          <Link href="/leaderboard" className="text-sm hover:text-primary transition">
            Leaderboard
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm hover:text-primary transition">
                My Predictions
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
