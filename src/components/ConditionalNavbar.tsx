"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

const PREDICTOR_ROUTES = ["/matches", "/tournament", "/leaderboard", "/rules", "/profile"];

export function ConditionalNavbar() {
  const pathname = usePathname();

  const showNavbar = PREDICTOR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!showNavbar) return null;

  return <Navbar />;
}
