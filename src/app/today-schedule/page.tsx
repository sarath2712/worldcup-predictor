import Link from "next/link";

// Yesterday's Semi-Final Results
const results = [
  {
    title: "Kids Semi-Final 1",
    subtitle: "Team 1 vs Team 4",
    result: "Team 4 wins 1-0",
    winner: "Team 4",
    category: "kids",
  },
  {
    title: "Kids Semi-Final 2",
    subtitle: "Team 3 vs Team 2",
    result: "Team 2 wins (1-1, Shootout 3-2)",
    winner: "Team 2",
    category: "kids",
  },
  {
    title: "Women\u2019s Semi-Final 1",
    subtitle: "Team 1 vs Team 4",
    result: "Team 1 wins 2-0",
    winner: "Team 1",
    category: "womens",
  },
  {
    title: "Women\u2019s Semi-Final 2",
    subtitle: "Team 2 vs Team 3",
    result: "Team 2 wins 1-0",
    winner: "Team 2",
    category: "womens",
  },
  {
    title: "Men\u2019s Semi-Final 1",
    subtitle: "Team 1 vs Team 2",
    result: "TBD",
    winner: "",
    category: "mens",
  },
  {
    title: "Men\u2019s Semi-Final 2",
    subtitle: "Team 3 vs Team 4",
    result: "TBD",
    winner: "",
    category: "mens",
  },
];

// Today's Schedule
const schedule = [
  {
    time: "4:00 PM",
    title: "Men\u2019s Semi-Final 1",
    subtitle: "Team 1 vs Team 2",
    category: "mens",
    duration: "22 min (10+2+10)",
  },
  {
    time: "4:25 PM",
    title: "Men\u2019s Semi-Final 2",
    subtitle: "Team 3 vs Team 4",
    category: "mens",
    duration: "22 min (10+2+10)",
  },
  {
    time: "5:00 PM",
    title: "Kids Final",
    subtitle: "Team 4 vs Team 2",
    category: "kids",
    duration: "16 min (7+2+7)",
  },
  {
    time: "5:20 PM",
    title: "Women\u2019s Final",
    subtitle: "Team 1 vs Team 2",
    category: "womens",
    duration: "15 min",
  },
  {
    time: "5:40 PM",
    title: "Men\u2019s Final",
    subtitle: "Winner SF1 vs Winner SF2",
    category: "mens",
    duration: "22 min (10+2+10)",
  },
  {
    time: "6:05 PM",
    title: "Presentation & Prize Distribution",
    subtitle: "Awards for all categories",
    category: "event",
    duration: "",
  },
];

const categoryStyles: Record<string, { bg: string; border: string; badge: string; badgeText: string; label: string }> = {
  event: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", badge: "bg-yellow-500/20", badgeText: "text-yellow-400", label: "EVENT" },
  kids: { bg: "bg-green-500/10", border: "border-green-500/30", badge: "bg-green-500/20", badgeText: "text-green-400", label: "KIDS" },
  mens: { bg: "bg-blue-500/10", border: "border-blue-500/30", badge: "bg-blue-500/20", badgeText: "text-blue-400", label: "MENS" },
  womens: { bg: "bg-pink-500/10", border: "border-pink-500/30", badge: "bg-pink-500/20", badgeText: "text-pink-400", label: "WOMENS" },
};

export default function TodaySchedulePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      {/* Results Section */}
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/><path d="M12 15v3"/><path d="M8 21h8"/>
        </svg>
        SEMI-FINAL RESULTS
      </h1>
      <p className="text-gray-400 mb-6">June 12, 2026 &middot; Sobha Lake Gardens</p>

      <div className="space-y-3 mb-12">
        {results.map((item, i) => {
          const style = categoryStyles[item.category];
          return (
            <div
              key={i}
              className={`rounded-xl border ${style.border} ${style.bg} p-4 flex items-start gap-4`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.badge} ${style.badgeText} tracking-wider`}>
                    {style.label}
                  </span>
                </div>
                <p className="font-semibold text-white text-sm mt-1">{item.title}</p>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                {item.winner ? (
                  <>
                    <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                      {item.winner} ✓
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">{item.result}</p>
                  </>
                ) : (
                  <span className="text-xs text-gray-500 italic">Today</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        TODAY&apos;S SCHEDULE
      </h1>
      <p className="text-gray-400 mb-2">June 13, 2026 &middot; Finals Day &middot; Sobha Lake Gardens</p>
      <p className="text-xs text-gray-500 mb-8">3 min changeover between matches</p>

      <div className="space-y-3">
        {schedule.map((item, i) => {
          const style = categoryStyles[item.category];
          return (
            <div
              key={i}
              className={`rounded-xl border ${style.border} ${style.bg} p-4 flex items-start gap-4`}
            >
              <div className="text-right min-w-[70px] shrink-0">
                <span className="text-sm font-bold text-white">{item.time}</span>
                {item.duration && (
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.duration}</p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.badge} ${style.badgeText} tracking-wider`}>
                    {style.label}
                  </span>
                  {item.title.includes("Final") && !item.title.includes("Semi") && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 tracking-wider">
                      FINAL
                    </span>
                  )}
                </div>
                <p className="font-semibold text-white text-sm mt-1">{item.title}</p>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* General Rules */}
      <div className="mt-10 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Rules & Format
        </h2>
      </div>

      {/* General */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-4">
        <h3 className="text-sm font-bold text-white mb-3">General Rules</h3>
        <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
          <li>All standard football rules apply.</li>
          <li>Teams must report to the ground <strong className="text-white">30 minutes</strong> before their scheduled match.</li>
          <li>3 minute changeover between matches.</li>
          <li>Referee&apos;s decision is final.</li>
        </ul>
      </div>

      {/* Kids Rules */}
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-green-400 mb-3">Kids Football Rules</h3>
        <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside marker:text-green-400">
          <li><strong className="text-white">Format:</strong> 5 outfield players + 1 Goalkeeper (5+1)</li>
          <li><strong className="text-white">Match Duration:</strong> 7 min half + 2 min break + 7 min half = 16 minutes</li>
          <li><strong className="text-white">Squad Rotation:</strong> Each team has 8–9 players including girls. Captains must rotate players at half-time or during stoppages. <span className="text-green-300">Every player must get a chance to play. No player should sit out for an entire match.</span></li>
          <li>Rolling substitutions allowed at any stoppage with referee&apos;s permission.</li>
          <li>If drawn after full time, penalty shootout (3 kicks each, then sudden death).</li>
        </ul>
      </div>

      {/* Mens Rules */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-blue-400 mb-3">Men&apos;s Football Rules</h3>
        <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside marker:text-blue-400">
          <li><strong className="text-white">Format:</strong> 4 outfield players + 1 Goalkeeper (4+1)</li>
          <li><strong className="text-white">Match Duration:</strong> 10 min half + 2 min break + 10 min half = 22 minutes</li>
          <li>Rolling substitutions allowed.</li>
          <li>If drawn after full time, penalty shootout (3 kicks each, then sudden death).</li>
        </ul>
      </div>

      {/* Womens Rules */}
      <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-pink-400 mb-3">Women&apos;s Football Rules (Penalty Shootout)</h3>
        <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside marker:text-pink-400">
          <li><strong className="text-white">Format:</strong> Penalty shootout only (no open play).</li>
          <li><strong className="text-white">1 kick per player.</strong> Each team takes <strong className="text-white">5 penalty kicks.</strong></li>
          <li>If scores are level after 5 kicks each, it goes to <strong className="text-white">sudden death</strong> — the team that misses first loses.</li>
          <li>Each match lasts approximately 15 minutes.</li>
        </ul>
      </div>
    </div>
  );
}
