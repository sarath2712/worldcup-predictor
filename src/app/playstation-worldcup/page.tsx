import Link from "next/link";

export default function PlaystationWorldcupPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
        FIFA WORLD CUP eTOURNAMENT
      </h1>
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 sm:p-8 mt-8 text-center">
        <p className="text-lg font-bold text-red-400 mb-2">Registration Closed</p>
        <p className="text-gray-400">PlayStation World Cup registrations are now closed. Fixtures and time slots will be shared soon with registered players.</p>
      </div>
    </div>
  );
}
