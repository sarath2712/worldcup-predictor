import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ESPN_STATS_URL = "https://www.espn.com/soccer/stats/_/league/FIFA.WORLD/season/2026/view/scoring";

async function fetchFromESPN(): Promise<{ rank: number; player_name: string; team: string; goals: number; assists: number }[]> {
  const res = await fetch(ESPN_STATS_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();

  // Parse the scoring table from ESPN HTML
  // ESPN embeds data in __espnfitt__ or we can parse the stats table
  const scorers: { rank: number; player_name: string; team: string; goals: number; assists: number }[] = [];

  // Look for the JSON data embedded in the page (ESPN uses server-rendered data)
  const tableRegex = /<tr[^>]*class="Table__TR[^"]*"[^>]*>([\s\S]*?)<\/tr>/g;
  const rows = html.match(tableRegex) || [];

  let currentRank = 0;
  for (const row of rows) {
    // Extract player name
    const nameMatch = row.match(/class="[^"]*Athlete[^"]*"[^>]*>([^<]+)/i) ||
                      row.match(/title="([^"]+)"[^>]*class="[^"]*AnchorLink/i);
    if (!nameMatch) continue;

    // Extract team
    const teamMatch = row.match(/class="[^"]*team[^"]*"[^>]*>([^<]+)/i) ||
                      row.match(/<span[^>]*class="[^"]*pl2[^"]*"[^>]*>([^<]+)/i);

    // Extract stats cells
    const statCells = row.match(/<td[^>]*>([\d]+)<\/td>/g) || [];
    const stats = statCells.map(c => parseInt(c.replace(/<[^>]+>/g, "")) || 0);

    if (stats.length >= 2) {
      currentRank++;
      scorers.push({
        rank: currentRank,
        player_name: nameMatch[1].trim(),
        team: teamMatch ? teamMatch[1].trim() : "Unknown",
        goals: stats[stats.length - 1], // last stat is usually goals
        assists: 0,
      });
    }

    if (scorers.length >= 15) break;
  }

  return scorers;
}

// POST /api/top-scorers — Update top scorers (admin/cron only)
// Body: { scorers: [...] } for manual, or { auto: true } to fetch from ESPN
export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace("Bearer ", "");

  if (cronSecret && authHeader !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await request.json();
    let scorers: { rank: number; player_name: string; team: string; goals: number; assists: number }[];

    if (body.auto) {
      // Auto-fetch from ESPN
      scorers = await fetchFromESPN();
      if (scorers.length === 0) {
        return NextResponse.json({ error: "Failed to parse ESPN data" }, { status: 500 });
      }
    } else if (body.scorers && Array.isArray(body.scorers) && body.scorers.length > 0) {
      scorers = body.scorers;
    } else {
      return NextResponse.json({ error: "Invalid body: expected { scorers: [...] } or { auto: true }" }, { status: 400 });
    }

    // Clear existing and insert fresh
    await supabase.from("top_scorers").delete().gte("id", 0);

    const now = new Date().toISOString();
    const rows = scorers.map((s) => ({
      rank: s.rank,
      player_name: s.player_name,
      team: s.team,
      goals: s.goals,
      assists: s.assists || 0,
      updated_at: now,
    }));

    const { error } = await supabase.from("top_scorers").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: rows.length, updated_at: now });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

// GET /api/top-scorers — Public read
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("top_scorers")
    .select("*")
    .order("rank", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scorers: data });
}
