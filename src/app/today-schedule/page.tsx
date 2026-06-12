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

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-bold text-white mb-2">Match Format</h3>
        <div className="grid grid-cols-3 gap-3 text-xs text-gray-400">
          <div>
            <span className="text-green-400 font-bold">Kids</span>
            <p>7 + 2 + 7 min</p>
          </div>
          <div>
            <span className="text-blue-400 font-bold">Mens</span>
            <p>10 + 2 + 10 min</p>
          </div>
          <div>
            <span className="text-pink-400 font-bold">Womens</span>
            <p>15 min shootout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
