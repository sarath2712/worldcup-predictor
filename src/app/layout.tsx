import type { Metadata } from "next";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "FIFAWC2026 Predictor",
  description: "Predict FIFA World Cup 2026 match scores and compete on the leaderboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <ConditionalNavbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
