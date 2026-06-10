"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RegistrationFormProps {
  category: "mens" | "womens" | "kids" | "playstation";
  title: string;
}

export function RegistrationForm({ category, title }: RegistrationFormProps) {
  // ── Registration is CLOSED ──────────────────────────────────
  return (
    <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8 text-center">
      <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3 className="text-xl font-bold text-yellow-400 mb-2">Registration Closed</h3>
      <p className="text-gray-400 text-sm">
        Registration for {title} is now closed. Thank you to everyone who signed up!
        Fixture details and schedules will be shared soon.
      </p>
    </div>
  );
  // ── End registration closed block ──────────────────────────

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [favouriteTeam, setFavouriteTeam] = useState("");
  const [age, setAge] = useState("");
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
          favourite_team: favouriteTeam || null,
          ...(category === "kids" && age ? { age: parseInt(age) } : {}),
          category,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You have already registered for this category.");
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

  if (success) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
        <svg className="w-10 h-10 text-green-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        <h3 className="text-xl font-bold text-green-400 mb-2">Registration Successful!</h3>
        <p className="text-gray-400 text-sm">
          You&apos;ve been registered for {title}. Fixture details will be shared soon.
        </p>
      </div>
    );
  }

  return (
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

      {category === "kids" && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Child&apos;s Age *</label>
          <input
            type="number"
            min="1"
            max="17"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
            required
            placeholder="e.g. 10"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Favourite Team <span className="text-gray-500">(Optional)</span></label>
        <input
          type="text"
          value={favouriteTeam}
          onChange={(e) => setFavouriteTeam(e.target.value)}
          className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
          placeholder="e.g. Brazil, Argentina..."
        />
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
  );
}
