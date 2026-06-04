"use client";

import { usePathname } from "next/navigation";

export function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Home page gets full-width (no container constraints)
  if (pathname === "/") {
    return <>{children}</>;
  }

  return <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>;
}
