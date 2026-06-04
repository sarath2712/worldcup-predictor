"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (isSignUp) {
      if (!/^\d{4}$/.test(flatNumber)) {
        setError("Flat Number must be exactly 4 digits");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, flat_number: flatNumber, mobile } },
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Auto-confirmed — redirect immediately
        window.location.href = "/";
      } else {
        setMessage("You are Signed Up, Good Luck with your Predictions!!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {isSignUp ? "Create Account" : "Login"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900"
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobile(val);
                }}
                placeholder="10 digit mobile number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900"
                required
                pattern="\d{10}"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flat Number</label>
              <input
                type="text"
                inputMode="numeric"
                value={flatNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setFlatNumber(val);
                }}
                placeholder="e.g. 1234"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900"
                required
                pattern="\d{4}"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">Must be exactly 4 digits</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900"
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-500">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline"
        >
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
