import Link from "next/link";

const teams = [
  {
    name: "Team 1",
    players: [
      { name: "Chirag Tyagh", flat: "A1001", phone: "9599206101", email: "-", isCaptain: true },
      { name: "Sushant Kumar", flat: "2122", phone: "9643173925", email: "dashingsasuke@gmail.com", isCaptain: false },
      { name: "Rohan", flat: "5154", phone: "6363478396", email: "rohanreddy4640@gmail.com", isCaptain: false },
      { name: "Franklin Francis", flat: "8124", phone: "9986885362", email: "franklinfrancis995@gmail.com", isCaptain: false },
      { name: "Kishor", flat: "1067", phone: "8722814666", email: "kishor.rcr.08@gmail.com", isCaptain: false },
      { name: "Rithwik Sasikumar", flat: "2173", phone: "9447755778", email: "rithwik7sasikumar@gmail.com", isCaptain: false },
      { name: "Tushar", flat: "7111", phone: "9833588079", email: "tusharpawar3004@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Kshiraj Nair", flat: "8062", phone: "9880306334", email: "kshiraj2004@gmail.com", isCaptain: true },
      { name: "Shriragini Kowtarapu", flat: "8104", phone: "6300819297", email: "sairamragini@gmail.com", isCaptain: false },
      { name: "Sagar Kateel", flat: "Q-8004", phone: "9820208013", email: "sagarkateel03@gmail.com", isCaptain: false },
      { name: "Gitrajit", flat: "4042", phone: "7899177567", email: "gitrajit@gmail.com", isCaptain: false },
      { name: "Jay Patel", flat: "2132", phone: "8867822498", email: "jay08ec70@gmail.com", isCaptain: false },
      { name: "Chethan", flat: "8002", phone: "7899363535", email: "-", isCaptain: false },
      { name: "Satyaki Das", flat: "1076", phone: "9147768578", email: "satyakidas.work@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Anil Rawat", flat: "7062", phone: "9873183855", email: "anilrawat15882ar@gmail.com", isCaptain: true },
      { name: "Pankaj Kumawat", flat: "2061", phone: "9794326484", email: "pankajkumawat845@gmail.com", isCaptain: false },
      { name: "Sriram S", flat: "7131", phone: "9746033649", email: "sriramsharp@gmail.com", isCaptain: false },
      { name: "Pavan Itagi", flat: "8043", phone: "8971497765", email: "itagi75@gmail.com", isCaptain: false },
      { name: "Sachin Shiragola", flat: "6174", phone: "9591811199", email: "sachin.shiragola@gmail.com", isCaptain: false },
      { name: "Mitesh Rao V", flat: "7012", phone: "7829914246", email: "mallika.melingi@gmail.com", isCaptain: false },
      { name: "Arjun", flat: "5182", phone: "9902641107", email: "-", isCaptain: false },
      { name: "Pikanshu Kumar", flat: "7082", phone: "9835419814", email: "pikanshu.kr@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Mithin Mathew", flat: "4164", phone: "7022369049", email: "mithinmathew007@gmail.com", isCaptain: true },
      { name: "Mithun", flat: "7081", phone: "9052707150", email: "-", isCaptain: false },
      { name: "Nithin Nambiar", flat: "2172", phone: "8951582345", email: "nithin.nbr@hotmail.com", isCaptain: false },
      { name: "Praveesh", flat: "-", phone: "-", email: "-", isCaptain: false },
      { name: "Suvin", flat: "6152", phone: "9035689838", email: "-", isCaptain: false },
      { name: "Shanthibhushan", flat: "7013", phone: "9980997800", email: "shanthibhushanb@yahoo.co.in", isCaptain: false },
      { name: "Sarath", flat: "7163", phone: "9496353463", email: "-", isCaptain: false },
    ],
  },
];

export default function MensFootballPage() {

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> MEN&apos;S FOOTBALL — TEAMS</h1>
      <p className="text-gray-400 mb-8">4 Teams &middot; 28 Players</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {teams.map((team) => (
          <div key={team.name} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h2 className="text-lg font-bold text-accent">{team.name}</h2>
            <div className="space-y-2">
              {team.players.map((p) => (
                <div key={p.name} className={`rounded-lg p-3 text-sm ${p.isCaptain ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-white/5 border border-white/5"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{p.name}</span>
                    {p.isCaptain && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">CAPTAIN</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                    <span>Flat: {p.flat}</span>
                    <span>Ph: {p.phone}</span>
                    <span>{p.email}</span>
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
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> This will be a <strong className="text-white">5-a-side</strong> match.</li>
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Each half will be of <strong className="text-white">10 minutes</strong>.</li>
          <li className="flex gap-2"><svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> Fixtures and time slots will be prepared and shared based on the total number of registrations received.</li>
        </ul>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1.5"><svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Registration closes on <strong className="text-white">Wednesday, 10th June</strong>.</li>
            <li>• Turf football shoes or normal shoes are allowed. <strong className="text-red-400">Please do not use Shoes with Studs or Spikes.</strong></li>
            <li>• Once teams are decided, everyone is kindly requested to bring their own team colours as mentioned by the committee.</li>
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
