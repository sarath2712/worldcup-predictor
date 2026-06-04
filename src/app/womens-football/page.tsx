import Link from "next/link";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function WomensFootballPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">⚽ WOMEN&apos;S FOOTBALL — REGISTRATION</h1>
      <p className="text-gray-400 mb-8">Register below to participate</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
        <RegistrationForm category="womens" title="Women's Football" />
      </div>

      {/* Info Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent">ℹ️ Event Details</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Spot kicks are currently planned for this category. Depending on the interest shown by participants, 
          we may also arrange a full match with <strong>5-minute halves</strong>.
        </p>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">📌 Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Registration closes on <strong className="text-white">Wednesday, 10th June</strong>.</li>
            <li>• Once teams are decided, everyone is kindly requested to bring their own team colours.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
