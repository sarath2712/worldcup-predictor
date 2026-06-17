"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Prediction, Match } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

type PredictionWithMatch = Prediction & { matches: Match };
type Registration = { id: number; category: string; favourite_team: string; created_at: string };

export default function ProfilePage() {
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [userInfo, setUserInfo] = useState<{ username: string; email: string; mobile: string; flatNumber: string }>({ username: "", email: "", mobile: "", flatNumber: "" });
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, is_admin")
        .eq("id", user.id)
        .single();

      setUserInfo({
        username: profile?.username || user.user_metadata?.username || "",
        email: user.email || "",
        mobile: user.user_metadata?.mobile || "",
        flatNumber: user.user_metadata?.flat_number || "",
      });

      // Load event registrations by email
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("id, category, favourite_team, created_at")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      setRegistrations(regs || []);

      const { data } = await supabase
        .from("predictions")
        .select("*, matches(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const preds = (data || []) as PredictionWithMatch[];
      setPredictions(preds);

      // Calculate total points matching leaderboard (predictions + match_extras + tournament)
      const predPoints = preds.reduce((sum, p) => sum + (p.points || 0), 0);

      const { data: extrasData } = await supabase
        .from("match_extras")
        .select("points")
        .eq("user_id", user.id);
      const extraPoints = (extrasData || []).reduce((sum, e) => sum + (e.points || 0), 0);

      const { data: tournamentData } = await supabase
        .from("tournament_predictions")
        .select("points")
        .eq("user_id", user.id)
        .single();
      const tournamentPoints = tournamentData?.points || 0;

      setTotalPoints(predPoints + extraPoints + tournamentPoints);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-16">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-8">
      <div className="flex gap-4 mb-2">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
          &larr; Home
        </Link>
        <Link href="/help" className="text-sm text-gray-400 hover:text-white transition">
          My Help Tickets &rarr;
        </Link>
      </div>

      {/* Profile Info */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{userInfo.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{userInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="font-medium">{userInfo.mobile || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Flat No.</p>
            <p className="font-medium">{userInfo.flatNumber || "—"}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link href="/change-password" className="text-sm text-primary hover:text-primary/80 transition">
            🔒 Change Password
          </Link>
        </div>
      </div>

      {/* Event Registrations */}
      {registrations.length > 0 && (
        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-3">My Registrations</h2>
          <div className="space-y-2">
            {registrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="font-medium capitalize">{reg.category.replace("_", " ")} Football</p>
                  {reg.favourite_team && <p className="text-xs text-gray-400">Team: {reg.favourite_team}</p>}
                </div>
                <p className="text-xs text-gray-500">{format(new Date(reg.created_at), "MMM d, yyyy")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My Predictions</h2>
          <p className="text-2xl font-bold text-accent">{totalPoints} pts</p>
        </div>

      {predictions.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t made any predictions yet. Go to{" "}
          <a href="/matches" className="text-primary hover:underline">Matches</a> to start!
        </p>
      ) : (
        <div className="space-y-3">
          {predictions.map((pred) => {
            const match = pred.matches;
            return (
              <div
                key={pred.id}
                className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {match.home_team} vs {match.away_team}
                  </p>
                  <p className="text-xs text-gray-500">
                    {match.stage} · {format(new Date(match.kickoff_utc), "MMM d, h:mm a")}
                  </p>
                </div>

                <div className="text-center">
                  <p className="font-bold">
                    {pred.predicted_home} - {pred.predicted_away}
                  </p>
                  <p className="text-xs text-gray-500">Your prediction</p>
                </div>

                <div className="text-center min-w-[60px]">
                  {match.home_score !== null ? (
                    <>
                      <p className="font-bold text-sm">
                        {match.home_score} - {match.away_score}
                      </p>
                      <p className={`text-xs font-medium ${
                        pred.points === 30 ? "text-green-600" :
                        pred.points === 10 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {pred.points === 30 ? "Exact!" :
                         pred.points === 10 ? "✓ Correct" : "✗ Wrong"}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </div>

                <div className="text-right min-w-[50px]">
                  {pred.points !== null && (
                    <span className="font-bold text-accent">+{pred.points}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
