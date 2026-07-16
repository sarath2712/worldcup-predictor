"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type CaricatureEntry = {
  id: string;
  name: string;
  flat_number: string;
  file_url: string;
  file_name: string | null;
  created_at: string;
};

export default function CaricatureContestPage() {
  const [entries, setEntries] = useState<CaricatureEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<CaricatureEntry | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [voteEntryId, setVoteEntryId] = useState<string | null>(null);
  const [voteSubmitting, setVoteSubmitting] = useState<string | null>(null);
  const [voteMessage, setVoteMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadVotingData();
  }, []);

  async function loadVotingData() {
    setEntriesLoading(true);

    const [{ data: entriesData }, { data: authData }] = await Promise.all([
      supabase
        .from("caricature_entries")
        .select("id,name,flat_number,file_url,file_name,created_at")
        .order("created_at", { ascending: true }),
      supabase.auth.getUser(),
    ]);

    setEntries((entriesData || []) as CaricatureEntry[]);
    const currentUserId = authData.user?.id || null;
    setUserId(currentUserId);

    if (currentUserId) {
      const { data: voteData } = await supabase
        .from("caricature_votes")
        .select("entry_id")
        .eq("user_id", currentUserId)
        .maybeSingle();

      setVoteEntryId(voteData?.entry_id || null);
    }

    setEntriesLoading(false);
  }

  const handleVote = async (entryId: string) => {
    setVoteMessage("");

    if (!userId) {
      setVoteMessage("Please sign in first. Voting is one vote per logged-in person.");
      return;
    }

    setVoteSubmitting(entryId);
    const { error: voteError } = await supabase
      .from("caricature_votes")
      .upsert(
        {
          user_id: userId,
          entry_id: entryId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (voteError) {
      setVoteMessage(`Could not save your vote: ${voteError.message}`);
    } else {
      setVoteEntryId(entryId);
      setVoteMessage("Vote saved. You can change it by voting for another caricature.");
    }

    setVoteSubmitting(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <section className="mb-8 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white/5 to-primary/10 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Caricature gallery</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Vote for your favourite caricature</h1>
            <p className="mt-1 text-sm text-gray-400">
              Tap a picture to view it full screen. Each logged-in person gets one vote.
            </p>
          </div>
          {!userId && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-accent/30 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/25"
            >
              Sign in to vote
            </Link>
          )}
        </div>

        {voteMessage && (
          <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            voteMessage.startsWith("Vote saved")
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/30 bg-amber-400/10 text-amber-200"
          }`}>
            {voteMessage}
          </div>
        )}

        {entriesLoading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-gray-400">
            Loading caricatures...
          </div>
        ) : entries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-gray-400">
            No caricatures have been uploaded yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => {
              const isSelected = voteEntryId === entry.id;
              const isVoting = voteSubmitting === entry.id;

              return (
                <article
                  key={entry.id}
                  className={`overflow-hidden rounded-2xl border bg-black/25 shadow-xl transition ${
                    isSelected
                      ? "border-accent/70 shadow-accent/10"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedEntry(entry)}
                    className="group relative block aspect-[4/3] w-full overflow-hidden bg-black text-left"
                    aria-label={`Open caricature entry ${index + 1}`}
                  >
                    <img
                      src={entry.file_url}
                      alt={`Caricature entry ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-300">Entry #{index + 1}</p>
                    </div>
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      View
                    </span>
                  </button>
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">Entry #{index + 1}</p>
                      {isSelected && (
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">
                          Your vote
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVote(entry.id)}
                      disabled={isVoting}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                        isSelected
                          ? "border border-emerald-400/30 bg-emerald-400/15 text-emerald-300"
                          : "bg-gradient-to-r from-primary to-primary/80 text-white hover:opacity-90"
                      }`}
                    >
                      {isVoting
                        ? "Saving..."
                        : isSelected
                          ? "Voted ✓"
                          : voteEntryId
                            ? "Change vote"
                            : "Vote for this"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Caricature preview"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Caricature entry</p>
                <p className="font-bold text-white">
                  Entry #{entries.findIndex((entry) => entry.id === selectedEntry.id) + 1}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="max-h-[78vh] overflow-auto bg-black p-3">
              <img
                src={selectedEntry.file_url}
                alt="Caricature entry preview"
                className="mx-auto max-h-[74vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-400">
                Like this one? Save your vote below.
              </p>
              <button
                type="button"
                onClick={() => handleVote(selectedEntry.id)}
                disabled={voteSubmitting === selectedEntry.id}
                className="rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {voteSubmitting === selectedEntry.id
                  ? "Saving..."
                  : voteEntryId === selectedEntry.id
                    ? "Voted ✓"
                    : voteEntryId
                      ? "Change vote to this"
                      : "Vote for this"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
