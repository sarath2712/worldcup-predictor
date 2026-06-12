import Link from "next/link";

export default function TodaySchedulePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        TODAY&apos;S SCHEDULE
      </h1>
      <p className="text-gray-400 mb-8">Match schedule for today</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <div className="text-6xl mb-4">🏗️</div>
        <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-400 text-sm">
          Today&apos;s match schedule will be updated here. Stay tuned!
        </p>
      </div>
    </div>
  );
}
