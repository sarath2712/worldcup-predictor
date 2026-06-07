"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export default function FootballStoryPage() {
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
      setError("Please upload your handwritten football story.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `stories/${fileName}`;

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

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("football-stories")
        .getPublicUrl(filePath);

      // Save record
      const { error: insertError } = await supabase
        .from("football_stories")
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
          setError("You have already submitted your football story.");
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
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
          ← Back to Home
        </Link>
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
          <svg className="w-10 h-10 text-green-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          <h3 className="text-xl font-bold text-green-400 mb-2">Story Submitted!</h3>
          <p className="text-gray-400 text-sm">
            Thank you for sharing your football story! It will be reviewed and featured soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
        WHAT&apos;S YOUR FOOTBALL STORY?
      </h1>

      <div className="text-gray-300 mb-8 space-y-4 text-sm leading-relaxed">
        <p>
          Maybe it&apos;s something you saw, a goal that made you leap off the sofa, a final that went to the last kick, a player who made the impossible look easy. Maybe it&apos;s something you lived, the match you watched with your father, the night your colony spilled into the streets, the first time your kid kicked a ball back to you.
        </p>
        <p>
          Or maybe it hasn&apos;t happened yet, the dream. Your country lifting the cup. Being in the stadium when it does. The match you&apos;d give anything to witness.
        </p>
        <p>
          Write it down. Real or remembered or still to come. The moment, the match, the dream. Tell us what football means to you.
        </p>
        <p className="font-semibold text-accent">Best entries win.</p>
        <p className="text-xs text-gray-400 border-t border-white/10 pt-3">
          <span className="font-semibold text-white">Rules:</span> Handwritten only. Scan and upload the file. Each file must be less than 1 MB.
        </p>
      </div>

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
            <label className="block text-sm font-medium mb-1 text-gray-300">Upload Your Handwritten Story *</label>
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
            {submitting ? "Uploading..." : "Submit Your Story"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          How It Works
        </h2>
        <ul className="text-gray-300 text-sm space-y-2 leading-relaxed">
          <li className="flex gap-2"><span className="text-accent font-bold">1.</span> Write your football story, memory, or dream on paper — in your own handwriting!</li>
          <li className="flex gap-2"><span className="text-accent font-bold">2.</span> Scan or take a clear photo of your written story.</li>
          <li className="flex gap-2"><span className="text-accent font-bold">3.</span> Fill in your details and upload the image above.</li>
          <li className="flex gap-2"><span className="text-accent font-bold">4.</span> The best stories will be featured and celebrated!</li>
        </ul>
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-gray-500 italic">Stories should be in English or any language you&apos;re comfortable with. Keep it fun and heartfelt!</p>
        </div>
      </div>
    </div>
  );
}
