import Link from "next/link";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function KidsFootballPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.09 6.26L20.18 9l-5 4.09L16.82 20 12 16.54 7.18 20l1.64-6.91L4 9l5.91-.74L12 2z"/></svg> KIDS&apos; FOOTBALL — REGISTRATION</h1>
      <p className="text-gray-400 mb-8">Register your child below to participate</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
        <RegistrationForm category="kids" title="Kids' Football" />
      </div>

      {/* Info Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center gap-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Event Details</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          For children <strong>below 14 years of age</strong>. Matches will be played with <strong>5–7 minute halves</strong>. 
          Please note that we cannot guarantee placement in your preferred team, as teams will be formed based on the registrations received.
        </p>
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l0 20M12 2l-4 4M12 2l4 4"/></svg> Common Rules</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Registration closes on <strong className="text-white">Wednesday, 10th June</strong>.</li>
            <li>• Once teams are decided, everyone is kindly requested to bring their own team colours.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
