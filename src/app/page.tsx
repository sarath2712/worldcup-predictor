import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0a15] via-[#0b1121] to-[#0a1628] min-h-[340px] md:min-h-[400px] flex items-center justify-center">
        {/* Decorative glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[80px]" />
        
        {/* Player images */}
        <div className="absolute left-4 md:left-8 bottom-0 opacity-80">
          <Image
            src="/players/messi.png"
            alt="Messi"
            width={180}
            height={180}
            className="w-28 h-28 md:w-44 md:h-44 object-contain drop-shadow-[0_0_15px_rgba(139,21,56,0.5)]"
            priority
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 opacity-70 hidden md:block">
          <Image
            src="/players/neymar.png"
            alt="Neymar"
            width={150}
            height={150}
            className="w-32 h-32 md:w-36 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            priority
          />
        </div>
        <div className="absolute right-4 md:right-8 bottom-0 opacity-80">
          <Image
            src="/players/ronaldo.png"
            alt="Ronaldo"
            width={180}
            height={180}
            className="w-28 h-28 md:w-44 md:h-44 object-contain drop-shadow-[0_0_15px_rgba(139,21,56,0.5)]"
            priority
          />
        </div>

        {/* Title content */}
        <div className="relative z-10 text-center px-4 py-12">
          <p className="text-sm md:text-base text-accent font-medium tracking-[0.3em] uppercase mb-3">
            ⚽ The Beautiful Game
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
            <span className="text-white">FIFA </span>
            <span className="text-accent">WORLD CUP</span>
            <br />
            <span className="text-white">20</span>
            <span className="text-accent">26</span>
            <span className="text-white ml-3 md:ml-4">PREDICTOR</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-400">
            <span className="text-accent">USA</span> · <span className="text-green-400">Mexico</span> · <span className="text-red-400">Canada</span>
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="text-center space-y-6">
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Predict match scores, compete with friends, and climb the leaderboard!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
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
    </div>
  );
}
