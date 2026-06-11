import Link from "next/link";

const teams = [
  {
    name: "Team 1",
    players: [
      { name: "Nivin Saju", age: 12, flat: "6133", phone: "9495527837", email: "sajukallur@gmail.com", isCaptain: true },
      { name: "Aditya Sai Uppala", age: 14, flat: "-", phone: "-", email: "-", isCaptain: false },
      { name: "Swayash Jha", age: 12, flat: "3042", phone: "8861847081", email: "sdivyajha2008@gmail.com", isCaptain: false },
      { name: "Liyan Deshmukh", age: 9, flat: "7171", phone: "9178300000", email: "surbhisalode19@gmail.com", isCaptain: false },
      { name: "Alvin Jibi", age: 10, flat: "3051", phone: "9880356389", email: "jibijose@yahoo.com", isCaptain: false },
      { name: "Hanah M Mathew", age: 8, flat: "4164", phone: "7022369049", email: "mithinmathew007@gmail.com", isCaptain: false },
      { name: "Nithin Nambiar", age: 7, flat: "2172", phone: "8951582345", email: "nithin.nbr@hotmail.com", isCaptain: false },
      { name: "Rajen Shaw", age: 7, flat: "2024", phone: "9632570011", email: "sumitshaw007@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Aryush", age: 14, flat: "8152", phone: "9819267116", email: "robloxsecure067@gmail.com", isCaptain: true },
      { name: "Johan Shinu Mathew", age: 12, flat: "6164", phone: "8097294569", email: "johanshinu2014@gmail.com", isCaptain: false },
      { name: "Aayansh Singh", age: 11, flat: "5033", phone: "9590986094", email: "adivya3.singh@gmail.com", isCaptain: false },
      { name: "Krishang Sinha", age: 11, flat: "8041", phone: "8660903376", email: "kummadhuri.s@gmail.com", isCaptain: false },
      { name: "Riyanshu Guha", age: 9, flat: "8014", phone: "8095456785", email: "soumyak.guha@gmail.com", isCaptain: false },
      { name: "Aadhrit Pandey", age: 8, flat: "6074", phone: "9741226877", email: "pandeyabhavya2510@gmail.com", isCaptain: false },
      { name: "Kiara", age: 7, flat: "2174", phone: "9611101157", email: "sap.kunalap@gmail.com", isCaptain: false },
      { name: "Avyaan Biswas", age: 7, flat: "4121", phone: "9049813810", email: "biswasgaurav1@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Aaradhya Rawat", age: 13, flat: "7062", phone: "9873183855", email: "anilrawat15882ar@gmail.com", isCaptain: true },
      { name: "Antonio Rishon", age: 13, flat: "L-6063", phone: "9880603407", email: "ash.norbert@gmail.com", isCaptain: false },
      { name: "Priyanshu", age: 11, flat: "8003", phone: "6361686119", email: "9supriyapatil@gmail.com", isCaptain: false },
      { name: "Hreyansh", age: 11, flat: "5183", phone: "9845783377", email: "shweta.nic@gmail.com", isCaptain: false },
      { name: "Aaron Bennett", age: 10, flat: "L-6063", phone: "9945081024", email: "antben.1216@gmail.com", isCaptain: false },
      { name: "Uddeshya", age: 8, flat: "5143", phone: "8652224778", email: "utkarshi.p@gmail.com", isCaptain: false },
      { name: "Magizhan Ganeshan", age: 7, flat: "3143", phone: "9500174822", email: "tamilselviamity@gmail.com", isCaptain: false },
      { name: "Surya Raj", age: 7, flat: "2152", phone: "9185540000", email: "lakshmibs512@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Kunal", age: 13, flat: "5111", phone: "7353483115", email: "-", isCaptain: true },
      { name: "Utkarsh", age: 13, flat: "5183", phone: "9845783377", email: "shemendrakumar@hotmail.com", isCaptain: false },
      { name: "Aaryan Abhilash", age: 11, flat: "5124", phone: "9197390000", email: "abhilash.chalippat@gmail.com", isCaptain: false },
      { name: "Ritvik Chaturvedi", age: 11, flat: "5133", phone: "7406601601", email: "response.ritvik@gmail.com", isCaptain: false },
      { name: "Suyukth", age: 9, flat: "-", phone: "-", email: "drgknareshgoud@gmail.com", isCaptain: false },
      { name: "Naval Geete", age: 8, flat: "3034", phone: "9428573450", email: "geete.ashvin@gmail.com", isCaptain: false },
      { name: "Gianna Takhelmayum", age: 7, flat: "4042", phone: "9916246693", email: "gitrajit@gmail.com", isCaptain: false },
      { name: "Mayank Chauhan", age: 7, flat: "3104", phone: "9196630000", email: "mayank.r.chauhan@gmail.com", isCaptain: false },
    ],
  },
];

export default function KidsFootballPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.09 6.26L20.18 9l-5 4.09L16.82 20 12 16.54 7.18 20l1.64-6.91L4 9l5.91-.74L12 2z"/></svg>
        KIDS&apos; FOOTBALL — TEAMS
      </h1>
      <p className="text-gray-400 mb-8">4 Teams &middot; 32 Players &middot; Ages 7–14</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.name} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h2 className="text-lg font-bold text-accent">{team.name}</h2>
            <div className="space-y-2">
              {team.players.map((p) => (
                <div key={p.name} className={`rounded-lg p-3 text-sm ${p.isCaptain ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-white/5 border border-white/5"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-xs text-gray-500">(Age {p.age})</span>
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

      {/* Rules */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4 mt-8">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          Event Details &amp; Rules
        </h2>
        <ul className="text-gray-300 text-sm space-y-2 leading-relaxed">
          <li>&bull; Matches will be played with <strong className="text-white">5–7 minute halves</strong>.</li>
          <li>&bull; Turf football shoes or normal shoes are allowed. <strong className="text-red-400">No studs or spikes.</strong></li>
          <li>&bull; Team captains (oldest player) will coordinate with the committee.</li>
          <li>&bull; Play in a friendly spirit and at medium to low intensity.</li>
        </ul>
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-gray-500 italic">All decisions taken by the committee will be final.</p>
        </div>
      </div>
    </div>
  );
}
