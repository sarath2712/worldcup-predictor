"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Query = {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
};

export default function HelpPage() {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", authUser.id)
        .single();

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: profile?.username || authUser.user_metadata?.username || "",
      });

      // Load user's queries
      const { data: userQueries } = await supabase
        .from("support_queries")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (userQueries) setQueries(userQueries);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase.from("support_queries").insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.name,
      subject,
      message,
    });

    if (!error) {
      setSuccess(true);
      setSubject("");
      setMessage("");
      // Refresh queries
      const { data } = await supabase
        .from("support_queries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setQueries(data);
    }
    setSubmitting(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex gap-4 mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
          &larr; Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <path d="M12 7v2M12 13h.01" />
        </svg>
        Contact for Help
      </h1>
      <p className="text-gray-400 mb-8">Have a question or issue? Send us a message and we&apos;ll get back to you.</p>

      {/* Submit New Query */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 space-y-4">
        <h2 className="text-lg font-semibold mb-2">New Query</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Subject *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white"
            required
            placeholder="e.g. Issue with registration, Match timing query..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Message *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent text-white resize-none"
            required
            placeholder="Describe your query in detail..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Query"}
        </button>
        {success && <p className="text-green-400 text-sm">Your query has been sent! We&apos;ll respond soon.</p>}
      </form>

      {/* Previous Queries */}
      {queries.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Queries</h2>
          <div className="space-y-3">
            {queries.map((q) => (
              <div key={q.id} className={`rounded-xl border p-4 ${q.status === "closed" ? "border-gray-700 bg-white/[0.02]" : q.status === "responded" ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{q.subject}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${q.status === "open" ? "bg-amber-500/20 text-amber-400" : q.status === "responded" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {q.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{q.message}</p>
                <p className="text-[11px] text-gray-600">{new Date(q.created_at).toLocaleDateString()}</p>

                {q.admin_response && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-[11px] text-green-500 font-semibold mb-1">ADMIN RESPONSE</p>
                    <p className="text-sm text-gray-300">{q.admin_response}</p>
                    {q.responded_at && (
                      <p className="text-[11px] text-gray-600 mt-1">{new Date(q.responded_at).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
