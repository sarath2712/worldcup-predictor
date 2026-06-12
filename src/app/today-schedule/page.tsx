import Link from "next/link";

const schedule = [
  {
    time: "6:00 PM",
    title: "Fans Celebration",
    subtitle: "Sinkari Melam & Opening Ceremony",
    category: "event",
    duration: "90 min",
  },
  {
    time: "7:30 PM",
    title: "Kids Semi-Final 1",
    subtitle: "Team 1 vs Team 4",
    category: "kids",
    duration: "16 min (7+2+7)",
  },
  {
    time: "7:49 PM",
    title: "Women\u2019s Shootout Semi-Final 1",
    subtitle: "Team 2 vs Team 3",
    category: "womens",
    duration: "15 min",
  },
  {
    time: "8:07 PM",
    title: "Men\u2019s Semi-Final 1",
    subtitle: "Team 1 vs Team 2",
    category: "mens",
    duration: "22 min (10+2+10)",
  },
  {
    time: "8:32 PM",
    title: "Kids Semi-Final 2",
    subtitle: "Team 2 vs Team 3",
    category: "kids",
    duration: "16 min (7+2+7)",
  },
  {
    time: "8:51 PM",
    title: "Women\u2019s Shootout Semi-Final 2",
    subtitle: "Team 1 vs Team 4",
    category: "womens",
    duration: "15 min",
  },
  {
    time: "9:09 PM",
    title: "Men\u2019s Semi-Final 2",
    subtitle: "Team 3 vs Team 4",
    category: "mens",
    duration: "22 min (10+2+10)",
  },
  {
    time: "9:34 PM",
    title: "Women\u2019s Final",
    subtitle: "Winner SF1 vs Winner SF2",
    category: "womens",
    duration: "15 min",
  },
  {
    time: "9:52 PM",
    title: "Kids Final",
    subtitle: "Winner SF1 vs Winner SF2",
    category: "kids",
    duration: "16 min (7+2+7)",
  },
  {
    time: "10:11 PM",
    title: "Men\u2019s Final",
    subtitle: "Winner SF1 vs Winner SF2",
    category: "mens",
    duration: "22 min (10+2+10)",
  },
  {
    time: "10:36 PM",
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

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        TODAY&apos;S SCHEDULE
      </h1>
      <p className="text-gray-400 mb-2">June 12, 2026 &middot; Sobha Lake Gardens</p>
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
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2"><span className="text-accent shrink-0">&#x2022;</span>All standard football rules apply.</li>
          <li className="flex gap-2"><span className="text-accent shrink-0">&#x2022;</span>Teams must report to the ground <strong className="text-white">30 minutes</strong> before their scheduled match.</li>
          <li className="flex gap-2"><span className="text-accent shrink-0">&#x2022;</span>3 minute changeover between matches.</li>
          <li className="flex gap-2"><span className="text-accent shrink-0">&#x2022;</span>Referee&apos;s decision is final.</li>
        </ul>
      </div>

      {/* Kids Rules */}
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-green-400 mb-3">Kids Football Rules</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2"><span className="text-green-400 shrink-0">&#x2022;</span><strong className="text-white">Format:</strong> 5 outfield players + 1 Goalkeeper (5+1)</li>
          <li className="flex gap-2"><span className="text-green-400 shrink-0">&#x2022;</span><strong className="text-white">Match Duration:</strong> 7 min half + 2 min break + 7 min half = 16 minutes</li>
          <li className="flex gap-2"><span className="text-green-400 shrink-0">&#x2022;</span><strong className="text-white">Squad Rotation:</strong> Each team has 8–9 players. Captains <strong className="text-white">must rotate players</strong> at half-time or during stoppages so that <strong className="text-white">every player gets a chance to play</strong>. No player should sit out for an entire match.</li>
          <li className="flex gap-2"><span className="text-green-400 shrink-0">&#x2022;</span>Rolling substitutions are allowed at any stoppage with referee&apos;s permission.</li>
          <li className="flex gap-2"><span className="text-green-400 shrink-0">&#x2022;</span>If drawn after full time, penalty shootout (3 kicks each, then sudden death).</li>
        </ul>
      </div>

      {/* Mens Rules */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-blue-400 mb-3">Men&apos;s Football Rules</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">&#x2022;</span><strong className="text-white">Format:</strong> 4 outfield players + 1 Goalkeeper (4+1)</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">&#x2022;</span><strong className="text-white">Match Duration:</strong> 10 min half + 2 min break + 10 min half = 22 minutes</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">&#x2022;</span>Rolling substitutions allowed.</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">&#x2022;</span>If drawn after full time, penalty shootout (3 kicks each, then sudden death).</li>
        </ul>
      </div>

      {/* Womens Rules */}
      <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-pink-400 mb-3">Women&apos;s Football Rules (Penalty Shootout)</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2"><span className="text-pink-400 shrink-0">&#x2022;</span><strong className="text-white">Format:</strong> Penalty shootout only (no open play).</li>
          <li className="flex gap-2"><span className="text-pink-400 shrink-0">&#x2022;</span><strong className="text-white">1 kick per player.</strong> Each team takes <strong className="text-white">5 penalty kicks</strong>.</li>
          <li className="flex gap-2"><span className="text-pink-400 shrink-0">&#x2022;</span>If scores are level after 5 kicks each, it goes to <strong className="text-white">sudden death</strong> — the team that misses first loses.</li>
          <li className="flex gap-2"><span className="text-pink-400 shrink-0">&#x2022;</span>Each match lasts approximately 15 minutes.</li>
        </ul>
      </div>
    </div>
  );
}
