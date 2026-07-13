"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadVotingData();
  }, []);

  async function loadVotingData() {
    setEntriesLoading(true);

    const { data: entriesData } = await supabase
      .from("caricature_entries")
      .select("id,name,flat_number,file_url,file_name,created_at")
      .order("created_at", { ascending: true });

    setEntries((entriesData || []) as CaricatureEntry[]);
    setEntriesLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError("File size must be under 1 MB. Please compress or resize your image.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload your caricature drawing.");
      return;
    }

    setSubmitting(true);

    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `caricatures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("football-stories")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError("Failed to upload file: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("football-stories")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("caricature_entries")
        .insert({
          name,
          email,
          phone,
          flat_number: flatNumber,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You have already submitted a caricature entry.");
        } else {
          setError(insertError.message);
        }
      } else {
        setSuccess(true);
        await loadVotingData();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
          ← Back to Home
        </Link>
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
          <svg className="w-10 h-10 text-green-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          <h3 className="text-xl font-bold text-green-400 mb-2">Entry Submitted!</h3>
          <p className="text-gray-400 text-sm">
            Your caricature has been uploaded successfully. Best entries win!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          <path d="M2 2l7.586 7.586"/>
          <circle cx="11" cy="11" r="2"/>
        </svg>
        CARICATURE CONTEST
      </h1>

      <div className="text-gray-300 mb-8 space-y-4 text-sm leading-relaxed">
        <p>
          Every fan has a face that lives in their head.
        </p>
        <p>
          The keeper frozen mid-dive. The striker with arms wide, shirt over his head. The manager losing his mind on the touchline. The player you love so much you&apos;ve memorised the way he celebrates.
        </p>
        <p className="font-semibold text-white">Now draw them.</p>
        <p>
          Pull out the big nose, the wild hair, the impossible legs, the trophy held just a little too proudly. Make us laugh. Make us point and say <em>that&apos;s exactly him</em>.
        </p>
        <p>
          Footballers, fans, legends, your own mad uncle who thinks he&apos;s Messi. Anyone from the beautiful game is fair play. Pencil, paint, napkin. Talent optional. Cheek mandatory.
        </p>
        <p className="font-semibold text-accent">Bring the player. We&apos;ll bring the laughs. Best caricature wins.</p>
        <p className="rounded-2xl border border-accent/20 bg-accent/10 p-4 font-semibold text-white">
          Submit your caricature by Wednesday, July 15, 2026 at 7:00 PM IST.
          Community voting will start after that at 7:00 PM.
        </p>
        <p className="text-xs text-gray-400 border-t border-white/10 pt-3">
          <span className="font-semibold text-white">Rules:</span> Open to ALL age groups. Scan or photograph your drawing and upload below. Each file must be less than 1 MB.
        </p>
      </div>

      <section className="mb-8 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white/5 to-primary/10 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Caricature gallery</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Preview the entries</h2>
            <p className="mt-1 text-sm text-gray-400">
              Tap a picture to view it full screen. Artist names are hidden until voting opens.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Voting starts Wednesday, July 15, 2026 at 7:00 PM IST.
            Submissions are open until then.
          </div>
        </div>

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
            {entries.map((entry, index) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-xl transition hover:border-white/25"
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
                    <p className="font-bold text-white">Artist hidden</p>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    View
                  </span>
                </button>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white">Entry #{index + 1}</p>
                  <p className="text-xs text-gray-500">
                    Voting button will appear Wednesday, July 15 at 7:00 PM IST.
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
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
            <label className="block text-sm font-medium mb-1 text-gray-300">Upload Your Drawing *</label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max 1 MB. All image and scanner formats accepted.
            </p>
            {fileError && (
              <p className="text-xs text-red-400 mt-1">{fileError}</p>
            )}
            {file && !fileError && (
              <p className="text-xs text-green-400 mt-1">
                ✓ {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Submit Your Caricature"}
          </button>
        </form>
      </div>

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
                  Entry #{entries.findIndex((entry) => entry.id === selectedEntry.id) + 1} · Artist hidden
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
            <div className="border-t border-white/10 p-4">
              <p className="text-sm text-gray-400">
                Voting starts Wednesday, July 15, 2026 at 7:00 PM IST. Until then, enjoy the gallery and submit your own caricature.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
