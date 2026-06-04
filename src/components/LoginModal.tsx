"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  if (!open) return null;

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
        onSuccess();
      } else {
        setMessage("You are Signed Up! Please check your email to confirm, then login.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        onSuccess();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[#0f1d3a] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          {isSignUp ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(val);
                  }}
                  placeholder="10 digit mobile number"
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  pattern="\d{10}"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Flat Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={flatNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setFlatNumber(val);
                  }}
                  placeholder="e.g. 1234"
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  pattern="\d{4}"
                  maxLength={4}
                />
                <p className="text-[10px] text-gray-500 mt-1">Must be exactly 4 digits</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {message && <p className="text-green-400 text-xs">{message}</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition mt-2"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-xs text-gray-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            className="text-blue-400 hover:underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
