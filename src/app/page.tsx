import Link from "next/link";

const tiles = [
  {
    title: "Men's Football",
    href: "/mens-football",
    emoji: "⚽",
    gradient: "from-blue-600 to-blue-900",
  },
  {
    title: "Kids Football",
    href: "/kids-football",
    emoji: "🧒",
    gradient: "from-green-500 to-green-800",
  },
  {
    title: "Women's Football",
    href: "/womens-football",
    emoji: "⚽",
    gradient: "from-pink-500 to-purple-800",
  },
  {
    title: "World Cup Prediction",
    href: "/matches",
    emoji: "🏆",
    gradient: "from-amber-500 to-amber-800",
  },
  {
    title: "PlayStation World Cup",
    href: "/playstation-worldcup",
    emoji: "🎮",
    gradient: "from-indigo-500 to-indigo-900",
  },
  {
    title: "World Cup Fixture",
    href: "/fixtures",
    emoji: "📋",
    gradient: "from-red-600 to-red-900",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      {/* Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
        FIFAWC2026
      </h1>
      <p className="text-xs sm:text-sm text-gray-400 tracking-[0.25em] uppercase text-center mb-12">
        Sobha Lake Gardens
      </p>

      {/* Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl w-full px-4">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            href={tile.href}
            className={`aspect-square rounded-2xl bg-gradient-to-br ${tile.gradient} border border-white/10 
              flex flex-col items-center justify-center gap-3 p-6 
              hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300
              group cursor-pointer`}
          >
            <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform">
              {tile.emoji}
            </span>
            <span className="text-sm sm:text-base font-semibold text-white text-center leading-tight">
              {tile.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
