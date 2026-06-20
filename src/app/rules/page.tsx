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
          <h3 className="text-xl font-bold text-accent flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> Match Predictions</h3>
          <p className="text-sm text-gray-400 mt-1">Points awarded per match</p>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Exact Score Prediction</p>
              <p className="text-sm text-gray-400">Predict the correct scoreline (includes winner bonus)</p>
            </div>
            <span className="text-2xl font-bold text-accent">30</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Correct Winner / Draw Only</p>
              <p className="text-sm text-gray-400">Right outcome but wrong scoreline</p>
            </div>
            <span className="text-2xl font-bold text-accent">10</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Player of the Match (POTM)</p>
              <p className="text-sm text-gray-400">Knockout stages only</p>
            </div>
            <span className="text-2xl font-bold text-accent">20</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Team Scored First</p>
              <p className="text-sm text-gray-400">Predict which team scores the first goal</p>
            </div>
            <span className="text-2xl font-bold text-accent">15</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between bg-amber-500/5">
            <div>
              <p className="font-medium text-amber-400">⚡ Match Extras</p>
              <p className="text-sm text-gray-400">Big-team group matches only — 1 or 2 per match</p>
              <p className="text-xs text-gray-500 mt-1">Star player scoring, halftime leader, penalties</p>
            </div>
            <span className="text-2xl font-bold text-amber-400">20</span>
          </div>
        </div>
      </div>

      {/* Tournament Predictions */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-accent flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/><path d="M12 15v3"/><path d="M8 21h8"/></svg> Tournament Predictions</h3>
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

      {/* Group Stage Predictions */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-accent flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg> Group Stage Predictions</h3>
          <p className="text-sm text-gray-400 mt-1">Predict final standings for each group (12 groups)</p>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Only 1st Place Correct</p>
              <p className="text-sm text-gray-400">No points if only the group winner is right</p>
            </div>
            <span className="text-2xl font-bold text-gray-500">0</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">1st &amp; 2nd Place Correct</p>
              <p className="text-sm text-gray-400">Predict the top 2 teams in the right order</p>
            </div>
            <span className="text-2xl font-bold text-accent">50</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">1st, 2nd &amp; 3rd Place Correct</p>
              <p className="text-sm text-gray-400">Predict the top 3 teams in the right order</p>
            </div>
            <span className="text-2xl font-bold text-accent">75</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Group Stage Top Scorer</p>
              <p className="text-sm text-gray-400">Player with most goals in Matchday 1–3</p>
            </div>
            <span className="text-2xl font-bold text-accent">75</span>
          </div>
        </div>
      </div>

      {/* Deadlines */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-accent flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Prediction Deadlines</h3>
          <p className="text-sm text-gray-400 mt-1">Important timing rules</p>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <p className="text-gray-300 text-sm">Every match prediction finishes <strong className="text-white">1 hour before</strong> the start of the match.</p>
          </div>
          <div className="px-6 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <p className="text-gray-300 text-sm">Tournament Prediction will close on <strong className="text-white">June 11, 12:01 AM</strong>.</p>
          </div>
          <div className="px-6 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <p className="text-gray-300 text-sm">Group Stage Predictions will close on <strong className="text-white">June 19, 11:59 PM IST</strong>.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
        <p className="text-lg font-semibold text-accent">Maximum Points Per Match</p>
        <p className="text-3xl font-black text-white mt-2">30 + 20 + 15 + 40 = 105</p>
        <p className="text-sm text-gray-400 mt-2">
          Exact Score + POTM (knockout) + First Goal + Match Extras (big-team groups, up to 2 × 20)
        </p>
      </div>
    </div>
  );
}
