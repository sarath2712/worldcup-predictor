"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PlaystationWorldcupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from("event_registrations")
        .insert({
          name,
          email,
          phone,
          flat_number: flatNumber,
          favourite_team: skillLevel,
          category: "playstation",
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You have already registered for this tournament.");
        } else {
          setError(insertError.message);
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg> PLAYSTATION WORLD CUP — REGISTRATION</h1>
      <p className="text-gray-400 mb-8">Register below to participate in the FIFA eTournament</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
        {success ? (
          <div className="text-center">
            <svg className="w-10 h-10 text-green-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            <h3 className="text-xl font-bold text-green-400 mb-2">Registration Successful!</h3>
            <p className="text-gray-400 text-sm">
              You&apos;ve been registered for the PlayStation World Cup. Fixture details will be shared soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                required
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                required
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Flat Number *</label>
              <input
                type="text"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                required
                placeholder="e.g. A-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Skill Level *</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                required
              >
                <option value="" disabled>Select your skill level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Registering..." : "Register Now"}
            </button>
          </form>
        )}
      </div>

      {/* Info Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Event Details</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          FIFA eTournament on PlayStation. Knockout-style brackets. 
          Fixtures and time slots will be prepared and shared based on the total number of registrations received.
        </p>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l0 20M12 2l-4 4M12 2l4 4"/></svg> Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Registration closes on <strong className="text-white">Wednesday, 10th June</strong>.</li>
            <li>• Matches will be played on <strong className="text-white">PS5</strong> with <strong className="text-white">EA FC 26</strong>.</li>
            <li>• Brackets will be seeded by skill level.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
