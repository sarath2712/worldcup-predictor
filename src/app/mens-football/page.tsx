import Link from "next/link";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function MensFootballPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> MEN&apos;S FOOTBALL — REGISTRATION</h1>
      <p className="text-gray-400 mb-8">Registration is open to participants aged 14 years and above</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
        <RegistrationForm category="mens" title="Men's Football" />
      </div>

      {/* Info Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Event Details</h2>
        <ul className="text-gray-300 text-sm space-y-2 leading-relaxed">
          <li className="flex gap-2"><span className="text-accent">⚽</span> This will be a <strong className="text-white">5-a-side</strong> match.</li>
          <li className="flex gap-2"><span className="text-accent">⏱</span> Each half will be of <strong className="text-white">10 minutes</strong>.</li>
          <li className="flex gap-2"><span className="text-accent">📋</span> Fixtures and time slots will be prepared and shared based on the total number of registrations received.</li>
        </ul>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">📌 Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Registration closes on <strong className="text-white">Wednesday, 10th June</strong>.</li>
            <li>• Turf football shoes or normal shoes are allowed. <strong className="text-red-400">Please do not use spiked shoes.</strong></li>
            <li>• Once teams are decided, everyone is kindly requested to bring their own team colours as mentioned by the committee.</li>
            <li>• Please play in a friendly spirit and at medium to low intensity.</li>
          </ul>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-gray-500 italic">All decisions taken by the committee will be final. Please abide by the rules set.</p>
        </div>
      </div>
    </div>
  );
}
