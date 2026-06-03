import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center space-y-8 py-16">
      <div className="inline-block mb-2">
        <span className="text-6xl">⚽</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold">
        <span className="text-accent">FIFA</span><span className="text-white">WC2026</span>
        <br />
        <span className="text-3xl md:text-4xl font-bold text-gray-300">Predictor</span>
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Predict match scores for the FIFA World Cup 2026 across
        <span className="text-accent font-semibold"> USA </span>·
        <span className="text-green-400 font-semibold"> Mexico </span>·
        <span className="text-red-400 font-semibold"> Canada</span>.
        Earn points and climb the leaderboard!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-lg text-accent">Predict</h3>
          <p className="text-gray-400 text-sm mt-1">
            Submit your score predictions before each match kicks off
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="font-semibold text-lg text-accent">Compete</h3>
          <p className="text-gray-400 text-sm mt-1">
            Exact score = 3 pts, correct outcome = 1 pt
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-lg text-accent">Leaderboard</h3>
          <p className="text-gray-400 text-sm mt-1">
            See who&apos;s top and track your rank in real time
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Link
          href="/matches"
          className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/80 transition"
        >
          View Matches
        </Link>
        <Link
          href="/leaderboard"
          className="px-6 py-3 border border-accent text-accent rounded-lg font-medium hover:bg-accent/10 transition"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
