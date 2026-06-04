import Link from "next/link";

export default function PlaystationWorldcupPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-4">🎮 PlayStation World Cup</h1>
      <p className="text-gray-400 text-lg">
        PlayStation FIFA tournament brackets and schedules coming soon.
      </p>
      <div className="mt-8 p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
        <p className="text-gray-500 text-sm">🚧 This section is under construction</p>
      </div>
    </div>
  );
}
