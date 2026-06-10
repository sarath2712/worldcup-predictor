"use client";

import Link from "next/link";

export default function PlaystationWorldcupPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
        FIFA WORLD CUP eTOURNAMENT
      </h1>
      <p className="text-gray-400 mb-8">This is a FIFA eTournament on PlayStation. We will follow knockout-style brackets.</p>

      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8 text-center">
        <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Registration Closed</h3>
        <p className="text-gray-400 text-sm">
          Registration for the PlayStation World Cup eTournament is now closed. Thank you to everyone who signed up!
          Fixture details and schedules will be shared soon.
        </p>
      </div>
    </div>
  );
}
