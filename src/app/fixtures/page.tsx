import Link from "next/link";

const groups = [
  {
    name: "Group A",
    teams: ["Morocco", "Peru", "Canada", "Australia"],
    matches: [
      { date: "Jun 11", time: "20:00", team1: "Morocco", team2: "Peru", venue: "Buenos Aires" },
      { date: "Jun 12", time: "13:00", team1: "Canada", team2: "Australia", venue: "Toronto" },
      { date: "Jun 16", time: "16:00", team1: "Peru", team2: "Canada", venue: "Kansas City" },
      { date: "Jun 16", time: "19:00", team1: "Morocco", team2: "Australia", venue: "Miami" },
      { date: "Jun 20", time: "16:00", team1: "Australia", team2: "Peru", venue: "Los Angeles" },
      { date: "Jun 20", time: "16:00", team1: "Canada", team2: "Morocco", venue: "Toronto" },
    ],
  },
  {
    name: "Group B",
    teams: ["Spain", "Portugal", "Uruguay", "Uzbekistan"],
    matches: [
      { date: "Jun 11", time: "17:00", team1: "Spain", team2: "Uzbekistan", venue: "New York/NJ" },
      { date: "Jun 12", time: "16:00", team1: "Portugal", team2: "Uruguay", venue: "Miami" },
      { date: "Jun 16", time: "13:00", team1: "Uzbekistan", team2: "Portugal", venue: "Philadelphia" },
      { date: "Jun 16", time: "22:00", team1: "Spain", team2: "Uruguay", venue: "Atlanta" },
      { date: "Jun 20", time: "19:00", team1: "Uruguay", team2: "Uzbekistan", venue: "Dallas" },
      { date: "Jun 20", time: "19:00", team1: "Portugal", team2: "Spain", venue: "New York/NJ" },
    ],
  },
  {
    name: "Group C",
    teams: ["Mexico", "Ecuador", "Cameroon", "New Zealand"],
    matches: [
      { date: "Jun 12", time: "19:00", team1: "Mexico", team2: "Cameroon", venue: "Mexico City" },
      { date: "Jun 12", time: "22:00", team1: "Ecuador", team2: "New Zealand", venue: "Guadalajara" },
      { date: "Jun 17", time: "13:00", team1: "Cameroon", team2: "Ecuador", venue: "Houston" },
      { date: "Jun 17", time: "16:00", team1: "Mexico", team2: "New Zealand", venue: "Monterrey" },
      { date: "Jun 21", time: "16:00", team1: "New Zealand", team2: "Cameroon", venue: "Los Angeles" },
      { date: "Jun 21", time: "16:00", team1: "Ecuador", team2: "Mexico", venue: "Mexico City" },
    ],
  },
  {
    name: "Group D",
    teams: ["USA", "England", "Wales", "Qatar"],
    matches: [
      { date: "Jun 13", time: "13:00", team1: "USA", team2: "Wales", venue: "Seattle" },
      { date: "Jun 13", time: "16:00", team1: "England", team2: "Qatar", venue: "Philadelphia" },
      { date: "Jun 17", time: "19:00", team1: "Wales", team2: "England", venue: "Boston" },
      { date: "Jun 17", time: "22:00", team1: "USA", team2: "Qatar", venue: "San Francisco" },
      { date: "Jun 21", time: "19:00", team1: "Qatar", team2: "Wales", venue: "Houston" },
      { date: "Jun 21", time: "19:00", team1: "England", team2: "USA", venue: "New York/NJ" },
    ],
  },
  {
    name: "Group E",
    teams: ["France", "Colombia", "Saudi Arabia", "China PR"],
    matches: [
      { date: "Jun 13", time: "19:00", team1: "France", team2: "China PR", venue: "Kansas City" },
      { date: "Jun 13", time: "22:00", team1: "Colombia", team2: "Saudi Arabia", venue: "Dallas" },
      { date: "Jun 18", time: "13:00", team1: "China PR", team2: "Colombia", venue: "Atlanta" },
      { date: "Jun 18", time: "16:00", team1: "France", team2: "Saudi Arabia", venue: "Miami" },
      { date: "Jun 22", time: "16:00", team1: "Saudi Arabia", team2: "China PR", venue: "Cincinnati" },
      { date: "Jun 22", time: "16:00", team1: "Colombia", team2: "France", venue: "Nashville" },
    ],
  },
  {
    name: "Group F",
    teams: ["Brazil", "Japan", "Serbia", "Bahrain"],
    matches: [
      { date: "Jun 14", time: "13:00", team1: "Brazil", team2: "Serbia", venue: "Los Angeles" },
      { date: "Jun 14", time: "16:00", team1: "Japan", team2: "Bahrain", venue: "Vancouver" },
      { date: "Jun 18", time: "19:00", team1: "Serbia", team2: "Japan", venue: "Seattle" },
      { date: "Jun 18", time: "22:00", team1: "Brazil", team2: "Bahrain", venue: "San Francisco" },
      { date: "Jun 22", time: "19:00", team1: "Bahrain", team2: "Serbia", venue: "Charlotte" },
      { date: "Jun 22", time: "19:00", team1: "Japan", team2: "Brazil", venue: "Los Angeles" },
    ],
  },
  {
    name: "Group G",
    teams: ["Argentina", "Denmark", "Paraguay", "Indonesia"],
    matches: [
      { date: "Jun 14", time: "19:00", team1: "Argentina", team2: "Indonesia", venue: "Miami" },
      { date: "Jun 14", time: "22:00", team1: "Denmark", team2: "Paraguay", venue: "Charlotte" },
      { date: "Jun 19", time: "13:00", team1: "Indonesia", team2: "Denmark", venue: "Dallas" },
      { date: "Jun 19", time: "16:00", team1: "Argentina", team2: "Paraguay", venue: "Atlanta" },
      { date: "Jun 23", time: "16:00", team1: "Paraguay", team2: "Indonesia", venue: "Nashville" },
      { date: "Jun 23", time: "16:00", team1: "Denmark", team2: "Argentina", venue: "Miami" },
    ],
  },
  {
    name: "Group H",
    teams: ["Germany", "Nigeria", "South Korea", "Costa Rica"],
    matches: [
      { date: "Jun 15", time: "13:00", team1: "Germany", team2: "Costa Rica", venue: "Boston" },
      { date: "Jun 15", time: "16:00", team1: "Nigeria", team2: "South Korea", venue: "Philadelphia" },
      { date: "Jun 19", time: "19:00", team1: "Costa Rica", team2: "Nigeria", venue: "Houston" },
      { date: "Jun 19", time: "22:00", team1: "Germany", team2: "South Korea", venue: "New York/NJ" },
      { date: "Jun 23", time: "19:00", team1: "South Korea", team2: "Costa Rica", venue: "Kansas City" },
      { date: "Jun 23", time: "19:00", team1: "Nigeria", team2: "Germany", venue: "Philadelphia" },
    ],
  },
  {
    name: "Group I",
    teams: ["Italy", "Iran", "Honduras", "Egypt"],
    matches: [
      { date: "Jun 15", time: "19:00", team1: "Italy", team2: "Egypt", venue: "New York/NJ" },
      { date: "Jun 15", time: "22:00", team1: "Iran", team2: "Honduras", venue: "Guadalajara" },
      { date: "Jun 20", time: "13:00", team1: "Egypt", team2: "Iran", venue: "Cincinnati" },
      { date: "Jun 20", time: "22:00", team1: "Italy", team2: "Honduras", venue: "Monterrey" },
      { date: "Jun 24", time: "16:00", team1: "Honduras", team2: "Egypt", venue: "Mexico City" },
      { date: "Jun 24", time: "16:00", team1: "Iran", team2: "Italy", venue: "Dallas" },
    ],
  },
  {
    name: "Group J",
    teams: ["Belgium", "Chile", "Scotland", "Bolivia"],
    matches: [
      { date: "Jun 11", time: "14:00", team1: "Belgium", team2: "Bolivia", venue: "Dallas" },
      { date: "Jun 12", time: "10:00", team1: "Chile", team2: "Scotland", venue: "Nashville" },
      { date: "Jun 17", time: "10:00", team1: "Bolivia", team2: "Chile", venue: "Charlotte" },
      { date: "Jun 17", time: "13:00", team1: "Belgium", team2: "Scotland", venue: "Boston" },
      { date: "Jun 21", time: "13:00", team1: "Scotland", team2: "Bolivia", venue: "Seattle" },
      { date: "Jun 21", time: "13:00", team1: "Chile", team2: "Belgium", venue: "Cincinnati" },
    ],
  },
  {
    name: "Group K",
    teams: ["Netherlands", "Senegal", "Panama", "Tanzania"],
    matches: [
      { date: "Jun 14", time: "10:00", team1: "Netherlands", team2: "Tanzania", venue: "Nashville" },
      { date: "Jun 14", time: "13:00", team1: "Senegal", team2: "Panama", venue: "Houston" },
      { date: "Jun 18", time: "10:00", team1: "Tanzania", team2: "Senegal", venue: "Atlanta" },
      { date: "Jun 18", time: "13:00", team1: "Netherlands", team2: "Panama", venue: "Kansas City" },
      { date: "Jun 22", time: "13:00", team1: "Panama", team2: "Tanzania", venue: "Charlotte" },
      { date: "Jun 22", time: "13:00", team1: "Senegal", team2: "Netherlands", venue: "Dallas" },
    ],
  },
  {
    name: "Group L",
    teams: ["Croatia", "Switzerland", "Ghana", "Jamaica"],
    matches: [
      { date: "Jun 15", time: "10:00", team1: "Croatia", team2: "Jamaica", venue: "Toronto" },
      { date: "Jun 15", time: "13:00", team1: "Switzerland", team2: "Ghana", venue: "Vancouver" },
      { date: "Jun 19", time: "10:00", team1: "Jamaica", team2: "Switzerland", venue: "Cincinnati" },
      { date: "Jun 19", time: "13:00", team1: "Croatia", team2: "Ghana", venue: "San Francisco" },
      { date: "Jun 23", time: "13:00", team1: "Ghana", team2: "Jamaica", venue: "Toronto" },
      { date: "Jun 23", time: "13:00", team1: "Switzerland", team2: "Croatia", venue: "Vancouver" },
    ],
  },
];

const knockoutRounds = [
  {
    name: "Round of 32",
    dates: "Jun 25 – Jun 28",
    matches: 16,
  },
  {
    name: "Round of 16",
    dates: "Jun 29 – Jul 2",
    matches: 8,
  },
  {
    name: "Quarter-Finals",
    dates: "Jul 4 – Jul 5",
    matches: 4,
  },
  {
    name: "Semi-Finals",
    dates: "Jul 8 – Jul 9",
    matches: 2,
  },
  {
    name: "Third-Place Play-off",
    dates: "Jul 12",
    matches: 1,
  },
  {
    name: "Final",
    dates: "Jul 13",
    matches: 1,
    venue: "New York/New Jersey",
  },
];

export default function FixturesPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-2">📋 FIFA World Cup 2026 Fixtures</h1>
      <p className="text-gray-400 mb-8">
        Full group stage schedule &amp; knockout rounds — June 11 to July 13, 2026
      </p>

      {/* Group Stage */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div
            key={group.name}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <div className="px-6 py-3 bg-primary/20 border-b border-white/10">
              <h2 className="text-lg font-bold">{group.name}</h2>
              <p className="text-xs text-gray-400">
                {group.teams.join(" · ")}
              </p>
            </div>
            <div className="divide-y divide-white/5">
              {group.matches.map((match, idx) => (
                <div
                  key={idx}
                  className="px-6 py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-gray-500 w-20 shrink-0">
                    {match.date}
                  </span>
                  <span className="text-gray-500 w-14 shrink-0 text-center">
                    {match.time}
                  </span>
                  <span className="flex-1 text-right font-medium">
                    {match.team1}
                  </span>
                  <span className="text-accent font-bold px-2">vs</span>
                  <span className="flex-1 font-medium">{match.team2}</span>
                  <span className="text-gray-500 text-xs w-28 shrink-0 text-right hidden sm:block">
                    {match.venue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Knockout Rounds */}
      <h2 className="text-3xl font-bold mt-12 mb-6">🏟️ Knockout Rounds</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {knockoutRounds.map((round) => (
          <div
            key={round.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="text-lg font-bold mb-1">{round.name}</h3>
            <p className="text-sm text-gray-400">{round.dates}</p>
            <p className="text-sm text-gray-500 mt-1">
              {round.matches} {round.matches === 1 ? "match" : "matches"}
              {round.venue && ` — ${round.venue}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
