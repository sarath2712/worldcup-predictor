export default function RulesPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center">
        <span className="text-accent">Scoring</span>{" "}
        <span className="text-white">Rules</span>
      </h2>

      {/* Match Predictions */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-accent">⚽ Match Predictions</h3>
          <p className="text-sm text-gray-400 mt-1">Points awarded per match</p>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Exact Score Prediction</p>
              <p className="text-sm text-gray-400">Predict the correct scoreline</p>
            </div>
            <span className="text-2xl font-bold text-accent">30</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Match Winner Prediction</p>
              <p className="text-sm text-gray-400">Predict the winning team (or draw)</p>
            </div>
            <span className="text-2xl font-bold text-accent">10</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Player of the Match (POTM)</p>
              <p className="text-sm text-gray-400">Predict the best player of the match</p>
            </div>
            <span className="text-2xl font-bold text-accent">20</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Goal Scorer Prediction</p>
              <p className="text-sm text-gray-400">Each correct goal scorer</p>
            </div>
            <span className="text-2xl font-bold text-accent">15</span>
          </div>
        </div>
      </div>

      {/* Tournament Predictions */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-accent">🏆 Tournament Predictions</h3>
          <p className="text-sm text-gray-400 mt-1">Bonus points for tournament-level predictions</p>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Tournament Winner</p>
              <p className="text-sm text-gray-400">Predict the World Cup champion</p>
            </div>
            <span className="text-2xl font-bold text-accent">200</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Finalist</p>
              <p className="text-sm text-gray-400">Predict the runner-up team</p>
            </div>
            <span className="text-2xl font-bold text-accent">180</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Player of the Tournament</p>
              <p className="text-sm text-gray-400">Best overall player</p>
            </div>
            <span className="text-2xl font-bold text-accent">150</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Golden Glove</p>
              <p className="text-sm text-gray-400">Best goalkeeper of the tournament</p>
            </div>
            <span className="text-2xl font-bold text-accent">150</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Golden Boot</p>
              <p className="text-sm text-gray-400">Top scorer of the tournament</p>
            </div>
            <span className="text-2xl font-bold text-accent">150</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
        <p className="text-lg font-semibold text-accent">Maximum Points Per Match</p>
        <p className="text-3xl font-black text-white mt-2">30 + 10 + 20 + 15×(scorers)</p>
        <p className="text-sm text-gray-400 mt-2">
          Score predictions + Winner + POTM + Goal scorers
        </p>
      </div>
    </div>
  );
}
