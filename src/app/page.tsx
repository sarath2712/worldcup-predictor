import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center space-y-8 py-16">
      <h1 className="text-5xl font-bold text-primary">
        ⚽ World Cup 2026 Predictor
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Predict match scores for the FIFA World Cup 2026. Earn points for correct
        outcomes and exact scores. Compete with friends on the leaderboard!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm border">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-lg">Predict</h3>
          <p className="text-gray-500 text-sm mt-1">
            Submit your score predictions before each match kicks off
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm border">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="font-semibold text-lg">Compete</h3>
          <p className="text-gray-500 text-sm mt-1">
            Exact score = 3 pts, correct outcome = 1 pt
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm border">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-lg">Leaderboard</h3>
          <p className="text-gray-500 text-sm mt-1">
            See who&apos;s top and track your rank in real time
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Link
          href="/matches"
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
        >
          View Matches
        </Link>
        <Link
          href="/leaderboard"
          className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
