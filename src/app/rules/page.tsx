export default function RulesPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center">
        <span className="text-accent">Scoring</span>{" "}
        <span className="text-white">Rules</span>
      </h2>

      {/* NEW: Round 3+ Odds-Based Scoring — TOP */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-500/20 bg-emerald-500/10">
          <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            🎯 Round 3 &amp; Knockout — Odds-Based Scoring
          </h3>
          <p className="text-sm text-emerald-300/70 mt-1">From Matchday 3 onwards, points scale with betting odds — predict an underdog win for more points!</p>
        </div>
        <div className="divide-y divide-emerald-500/10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Exact Score Prediction</p>
              <p className="text-sm text-gray-400">Predict the correct scoreline</p>
            </div>
            <span className="text-2xl font-bold text-emerald-400">80</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Correct Winner / Draw</p>
              <p className="text-sm text-gray-400">Right outcome, wrong scoreline — points = <strong className="text-emerald-400">Odds × 20</strong></p>
              <p className="text-xs text-gray-500 mt-1">e.g. Tunisia (23.00) beats Netherlands → <strong className="text-emerald-400">460 pts!</strong></p>
            </div>
            <span className="text-lg font-bold text-emerald-400">Odds×20</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Team Scored First</p>
              <p className="text-sm text-gray-400">Predict which team scores the first goal</p>
            </div>
            <span className="text-2xl font-bold text-emerald-400">30</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between bg-amber-500/5">
            <div>
              <p className="font-medium text-amber-400">⚡ Match Extras (Bonus Questions)</p>
              <p className="text-sm text-gray-400">Star player scoring, halftime leader, penalties — 1 or 2 per match</p>
            </div>
            <span className="text-2xl font-bold text-amber-400">30 <span className="text-sm font-normal text-gray-400">each</span></span>
          </div>
        </div>

        {/* Example: Portugal vs Uzbekistan */}
        <div className="px-6 py-5 border-t border-emerald-500/20 bg-emerald-900/20">
          <p className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider">📊 Example — How Odds Scoring Works</p>
          <div className="text-center mb-3">
            <p className="text-lg font-bold text-white">🇵🇹 Portugal <span className="text-gray-500 mx-2">vs</span> 🇺🇿 Uzbekistan</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
              <p className="text-xs text-gray-400 mb-1">🇵🇹 Portugal Win</p>
              <p className="text-xs text-gray-500">Odds: 1.40</p>
              <p className="text-xl font-black text-emerald-400 mt-1">28 <span className="text-xs font-normal text-gray-400">pts</span></p>
              <p className="text-[10px] text-gray-500 mt-1">1.40 × 20</p>
            </div>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-xs text-gray-400 mb-1">🤝 Draw</p>
              <p className="text-xs text-gray-500">Odds: 4.50</p>
              <p className="text-xl font-black text-amber-400 mt-1">90 <span className="text-xs font-normal text-gray-400">pts</span></p>
              <p className="text-[10px] text-gray-500 mt-1">4.50 × 20</p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-xs text-gray-400 mb-1">🇺🇿 Uzbekistan Win</p>
              <p className="text-xs text-gray-500">Odds: 8.00</p>
              <p className="text-xl font-black text-red-400 mt-1">160 <span className="text-xs font-normal text-gray-400">pts</span></p>
              <p className="text-[10px] text-gray-500 mt-1">8.00 × 20</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">⚡ Predict the underdog and get rewarded! Exact score always gives <strong className="text-emerald-400">80 pts</strong> regardless of odds.</p>
        </div>

        <div className="px-6 py-4 bg-emerald-500/10 text-center border-t border-emerald-500/20">
          <p className="text-sm font-semibold text-emerald-400">Maximum Points Per Match (Round 3+)</p>
          <p className="text-2xl font-black text-white mt-1">80 + 30 + 60 = 170</p>
          <p className="text-xs text-gray-400 mt-1">Exact (80) + First Goal (30) + Bonus (up to 2 × 30)</p>
        </div>
      </div>

      {/* OLD: Round 1 & 2 Group Stage Scoring */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-gray-400 flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            Round 1 &amp; 2 — Standard Scoring
          </h3>
          <p className="text-sm text-gray-500 mt-1">Matchday 1 &amp; 2 (Group Stage) — flat points, no odds</p>
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
              <p className="font-medium text-white">Correct Winner / Draw</p>
              <p className="text-sm text-gray-400">Right outcome, wrong scoreline</p>
            </div>
            <span className="text-2xl font-bold text-accent">10</span>
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
              <p className="font-medium text-amber-400">⚡ Match Extras (Bonus Questions)</p>
              <p className="text-sm text-gray-400">1 or 2 per match</p>
            </div>
            <span className="text-2xl font-bold text-amber-400">20 <span className="text-sm font-normal text-gray-400">each</span></span>
          </div>
        </div>
        <div className="px-6 py-3 bg-white/5 text-center border-t border-white/10">
          <p className="text-xs text-gray-500">Max per match: 30 + 15 + 40 = <strong className="text-gray-400">85</strong></p>
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

    </div>
  );
}
