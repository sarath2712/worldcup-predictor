import Image from "next/image";
import Link from "next/link";

const individualWinners = [
  {
    name: "Mahesh Tirupati",
    flat: "2063",
    competition: "Prediction Contest",
    place: "Champion",
    detail: "8,523 points",
    image: "/winners/mahesh-tirupati.webp",
    imagePosition: "center 55%",
    badge: "1st",
    accent: "from-yellow-300 via-amber-400 to-orange-500",
  },
  {
    name: "Arjun",
    flat: "5182",
    competition: "Prediction Contest",
    place: "Runner-up",
    detail: "7,836 points",
    image: "/winners/arjun.webp",
    imagePosition: "center 42%",
    badge: "2nd",
    accent: "from-slate-200 via-gray-300 to-slate-500",
  },
  {
    name: "Pikanshu Kumar",
    flat: "7082",
    competition: "PlayStation FC26",
    place: "Champion",
    detail: "Final: 6–2",
    image: "/winners/pikanshu.webp",
    imagePosition: "center",
    badge: "1st",
    accent: "from-yellow-300 via-amber-400 to-orange-500",
  },
  {
    name: "Kshiraj Nair",
    flat: "8062",
    competition: "PlayStation FC26",
    place: "Runner-up",
    detail: "Finalist",
    image: "/winners/kshiraj.webp",
    imagePosition: "center",
    badge: "2nd",
    accent: "from-slate-200 via-gray-300 to-slate-500",
  },
];

const winnerSections = [
  {
    eyebrow: "World Cup Prediction Contest",
    title: "Prediction Champions",
    description: "The top two finishers after a tournament-long test of football knowledge and prediction skill.",
    winners: individualWinners.slice(0, 2),
  },
  {
    eyebrow: "PlayStation Tournament",
    title: "FC26 Champions",
    description: "The finalists who battled through the 33-player knockout bracket at the Clubhouse Mini Theatre.",
    winners: individualWinners.slice(2, 4),
  },
];

const championTeams = [
  {
    title: "Men’s Football Champions",
    team: "Team 2",
    runnerUp: "Team 4",
    accent: "border-blue-400/30 from-blue-500/15",
    badge: "bg-blue-400/15 text-blue-300 border-blue-400/30",
    players: [
      ["Kshiraj Nair", "8062", "Captain"],
      ["Rohan", "5154"],
      ["Kishor", "1067"],
      ["Sriram S", "7131"],
      ["Jay Patel", "2132"],
      ["Chethan", "8002"],
      ["Satyaki Das", "1076"],
      ["Sahil", "6002"],
    ],
  },
  {
    title: "Kids’ Football Champions",
    team: "Team 3",
    runnerUp: "Team 4",
    accent: "border-emerald-400/30 from-emerald-500/15",
    badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    players: [
      ["Aaradhya Rawat", "7062", "Captain"],
      ["Antonio Rishon", "L-6063"],
      ["Priyanshu", "8003"],
      ["Hreyansh", "5183"],
      ["Aaron Bennett", "L-6063"],
      ["Uddeshya", "5143"],
      ["Magizhan Ganeshan", "3143"],
      ["Surya Raj", "2152"],
      ["Krishna", "—"],
    ],
  },
  {
    title: "Women’s Football Champions",
    team: "Team 1",
    runnerUp: "Team 2",
    accent: "border-pink-400/30 from-pink-500/15",
    badge: "bg-pink-400/15 text-pink-300 border-pink-400/30",
    players: [
      ["Preemy Wilson", "6152", "Captain"],
      ["Srilakshmi", "—"],
      ["Tanya", "5181"],
      ["Reshma", "4072"],
      ["Aiswarya", "4032"],
    ],
  },
];

export default function HallOfChampionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-400 transition hover:text-white">
        &larr; Back to Home
      </Link>

      <header className="relative mb-8 overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/15 via-white/5 to-orange-500/10 px-5 py-8 text-center sm:px-8 sm:py-12">
        <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-300">
            FIFA WC 2026 · Sobha Lake Gardens
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Hall of Champions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Celebrating the winners, runners-up, and championship teams who made our
            community competitions unforgettable.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        {winnerSections.map((section) => (
          <section key={section.title}>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                {section.eyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">{section.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-400">{section.description}</p>
            </div>

            <div className="grid max-w-3xl grid-cols-2 gap-3 sm:gap-5">
              {section.winners.map((winner) => (
                <article
                  key={`${winner.competition}-${winner.place}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20"
                >
                  <div className={`h-1 bg-gradient-to-r ${winner.accent}`} />
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                    <Image
                      src={winner.image}
                      alt={`${winner.name}, ${winner.place} in the ${winner.competition}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 384px"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      style={{ objectPosition: winner.imagePosition }}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071225] via-transparent to-transparent" />
                    <span className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${winner.accent} px-2.5 py-1 text-xs font-black text-slate-950 shadow-lg`}>
                      {winner.badge}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-yellow-300 sm:text-[10px]">
                        {winner.competition}
                      </p>
                      <h3 className="mt-1 text-lg font-black leading-tight text-white sm:text-2xl">
                        {winner.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-gray-200 sm:text-sm">
                        {winner.place} · Flat {winner.flat}
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">{winner.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 overflow-hidden rounded-3xl border border-teal-400/20 bg-gradient-to-br from-teal-500/10 via-white/5 to-emerald-500/10">
        <div className="grid md:grid-cols-[1.35fr_1fr]">
          <div className="relative aspect-[3/2] min-h-[240px] overflow-hidden bg-white">
            <Image
              src="/winners/trupti-itagi-caricature.webp"
              alt="Winning caricature by Pavan Itagi"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
              Caricature Contest
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Pavan Itagi</h2>
            <p className="mt-1 font-semibold text-gray-300">Champion · Flat 8043</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              The community’s favourite artwork secured first place with 9 votes.
              Kirti Bagga of Flat 6043 finished runner-up with 8 votes.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
          Community Football
        </p>
        <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Championship Teams</h2>

        <div className="mt-5 space-y-6">
          {championTeams.map((category) => (
            <article
              key={category.title}
              className={`overflow-hidden rounded-3xl border bg-gradient-to-br ${category.accent} via-white/5 to-transparent`}
            >
              <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-2xl font-black text-white">{category.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {category.team} · Runner-up: {category.runnerUp}
                  </p>
                </div>
                <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${category.badge}`}>
                  Champions
                </span>
              </div>

              <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {category.players.map(([name, flat, role]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{name}</p>
                      {role && <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow-300">{role}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">
                      {flat === "—" ? "Flat —" : `Flat ${flat}`}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
