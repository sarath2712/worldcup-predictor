import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { ConditionalMain } from "@/components/ConditionalMain";
import { PredictionChat } from "@/components/PredictionChat";

export const metadata: Metadata = {
  title: "FIFAWC2026 Predictor",
  description: "Predict FIFA World Cup 2026 match scores and compete on the leaderboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen overflow-x-hidden">
        <ConditionalNavbar />
        <ConditionalMain>{children}</ConditionalMain>
        <PredictionChat />
      </body>
    </html>
  );
}
