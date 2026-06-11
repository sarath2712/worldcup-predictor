import Link from "next/link";

const teams = [
  {
    name: "Team 1",
    players: [
      { name: "Preemy", isCaptain: true },
      { name: "Srilakshmi", isCaptain: false },
      { name: "Tanya", isCaptain: false },
      { name: "Reshma", isCaptain: false },
      { name: "Aiswarya", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Sushravya", isCaptain: true },
      { name: "Ahana", isCaptain: false },
      { name: "Aswathi", isCaptain: false },
      { name: "Fathima", isCaptain: false },
      { name: "Archana", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Maithri", isCaptain: true },
      { name: "Pavithra", isCaptain: false },
      { name: "Shruthi", isCaptain: false },
      { name: "Hana", isCaptain: false },
      { name: "Bakkiya", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Renjana", isCaptain: true },
      { name: "Anushka", isCaptain: false },
      { name: "Hala", isCaptain: false },
      { name: "Sreelakshmi", isCaptain: false },
      { name: "Surya", isCaptain: false },
    ],
  },
];

export default function WomensFootballPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> WOMEN&apos;S FOOTBALL — TEAMS</h1>
      <p className="text-gray-400 mb-8">4 Teams &middot; 20 Players</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {teams.map((team) => (
          <div key={team.name} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h2 className="text-lg font-bold text-accent">{team.name}</h2>
            <div className="space-y-2">
              {team.players.map((p) => (
                <div key={p.name} className={`rounded-lg p-3 text-sm ${p.isCaptain ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-white/5 border border-white/5"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{p.name}</span>
                    {p.isCaptain && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">CAPTAIN</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Event Details</h2>
        <ul className="text-gray-300 text-sm space-y-2 leading-relaxed">
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> Spot kicks are currently planned for this category.</li>
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Depending on the interest shown by participants, we may also arrange a full match with <strong className="text-white">5-minute halves</strong>.</span></li>
        </ul>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1.5"><svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Turf football shoes or normal shoes are allowed. <strong className="text-red-400">Please do not use Shoes with Studs or Spikes.</strong></li>
            <li>• Please play in a friendly spirit and at medium to low intensity.</li>
          </ul>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-gray-500 italic">All decisions taken by the committee will be final. Please abide by the rules set.</p>
        </div>
      </div>
    </div>
  );
}
