import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// This endpoint is designed to be called by an external cron service (e.g., cron-job.org)
// every 15-30 minutes. It checks for matches that should have recently finished
// and triggers score sync + point recalculation only when needed.

export async function GET(request: Request) {
  // Verify cron secret to prevent abuse
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Find unscored matches where kickoff was 1.5 to 4 hours ago
  // (match lasts ~2h, so 1.5h after kickoff it might be done, 4h is max buffer)
  const now = new Date();
  const oneAndHalfHoursAgo = new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString();
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();

  const { data: pendingMatches } = await supabase
    .from("matches")
    .select("id, home_team, away_team, kickoff_utc")
    .is("home_score", null)
    .lte("kickoff_utc", oneAndHalfHoursAgo)
    .gte("kickoff_utc", fourHoursAgo);

  if (!pendingMatches || pendingMatches.length === 0) {
    return NextResponse.json({
      message: "No matches to sync right now",
      checked_at: now.toISOString(),
      next_unscored: null,
    });
  }

  // Determine which dates to sync (ESPN uses YYYYMMDD format)
  const datesToSync = new Set<string>();
  for (const match of pendingMatches) {
    const matchDate = new Date(match.kickoff_utc);
    const yyyymmdd = matchDate.toISOString().split("T")[0].replace(/-/g, "");
    datesToSync.add(yyyymmdd);
  }

  // Also add today's date in case of timezone edge cases
  const todayStr = now.toISOString().split("T")[0].replace(/-/g, "");
  datesToSync.add(todayStr);

  // Call our own sync-scores endpoint for each date
  const baseUrl = request.url.replace("/api/auto-sync", "");
  const results = [];

  for (const date of datesToSync) {
    try {
      const syncRes = await fetch(`${baseUrl}/api/sync-scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, force: true }),
      });
      const syncResult = await syncRes.json();
      results.push({ date, ...syncResult });
    } catch (err) {
      results.push({ date, error: err instanceof Error ? err.message : "Failed" });
    }
  }

  // Find next upcoming unscored match for informational purposes
  const { data: nextMatch } = await supabase
    .from("matches")
    .select("home_team, away_team, kickoff_utc")
    .is("home_score", null)
    .gte("kickoff_utc", now.toISOString())
    .order("kickoff_utc", { ascending: true })
    .limit(1);

  return NextResponse.json({
    checked_at: now.toISOString(),
    pending_matches: pendingMatches.map(m => `${m.home_team} vs ${m.away_team}`),
    dates_synced: Array.from(datesToSync),
    results,
    next_match: nextMatch?.[0] ? `${nextMatch[0].home_team} vs ${nextMatch[0].away_team} at ${nextMatch[0].kickoff_utc}` : null,
  });
}
