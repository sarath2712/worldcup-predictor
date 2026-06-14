import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request) {
  // Verify this is a Vercel Cron call
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = new URL(request.url).origin;
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "");

  const results = [];

  // Sync today
  try {
    const res = await fetch(`${baseUrl}/api/sync-scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, force: true }),
    });
    results.push({ date: today, ...(await res.json()) });
  } catch (e) {
    results.push({ date: today, error: String(e) });
  }

  // Sync yesterday
  try {
    const res = await fetch(`${baseUrl}/api/sync-scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: yesterday, force: true }),
    });
    results.push({ date: yesterday, ...(await res.json()) });
  } catch (e) {
    results.push({ date: yesterday, error: String(e) });
  }

  return NextResponse.json({ synced_at: new Date().toISOString(), results });
}
