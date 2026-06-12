import { NextResponse } from "next/server";

// This endpoint is called by Vercel Cron every 5 minutes
// It syncs today's match scores from ESPN → Supabase
export async function GET(request: Request) {
  // Verify cron secret if set
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  // Also sync yesterday (for late-night matches in different timezones)
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

  const results = [];

  for (const date of [yesterday, today]) {
    try {
      const res = await fetch(`${baseUrl}/api/sync-scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      results.push({ date, ...data });
    } catch (err) {
      results.push({
        date,
        error: err instanceof Error ? err.message : "Failed",
      });
    }
  }

  return NextResponse.json({ synced_at: new Date().toISOString(), results });
}
