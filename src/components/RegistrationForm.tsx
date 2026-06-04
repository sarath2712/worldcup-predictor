"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RegistrationFormProps {
  category: "mens" | "womens" | "kids";
  title: string;
}

export function RegistrationForm({ category, title }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [favouriteTeam, setFavouriteTeam] = useState("");
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
        <p className="text-2xl mb-2">🎉</p>
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
