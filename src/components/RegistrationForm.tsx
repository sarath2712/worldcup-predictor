interface RegistrationFormProps {
  category: "mens" | "womens" | "kids" | "playstation";
  title: string;
}

export function RegistrationForm({ title }: RegistrationFormProps) {
  return (
    <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8 text-center">
      <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3 className="text-xl font-bold text-yellow-400 mb-2">Registration Closed</h3>
      <p className="text-gray-400 text-sm">
        Registration for {title} is now closed. Thank you to everyone who signed up!
        Fixture details and schedules will be shared soon.
      </p>
    </div>
  );
}
