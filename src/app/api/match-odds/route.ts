import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST /api/match-odds — Set odds for a match (admin only)
// Body: { match_id, home_win_odds, draw_odds, away_win_odds }
// Or bulk: { matches: [{ match_id, home_win_odds, draw_odds, away_win_odds }] }
export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader =
    request.headers.get("x-cron-secret") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (cronSecret && authHeader !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await request.json();

    // Support bulk updates
    const updates: {
      match_id: number;
      home_win_odds: number;
      draw_odds: number;
      away_win_odds: number;
    }[] = body.matches || [body];

    const results = [];
    for (const u of updates) {
      if (!u.match_id || !u.home_win_odds || !u.draw_odds || !u.away_win_odds) {
        results.push({ match_id: u.match_id, error: "Missing fields" });
        continue;
      }

      const { error } = await supabase
        .from("matches")
        .update({
          home_win_odds: u.home_win_odds,
          draw_odds: u.draw_odds,
          away_win_odds: u.away_win_odds,
        })
        .eq("id", u.match_id);

      if (error) {
        results.push({ match_id: u.match_id, error: error.message });
      } else {
        results.push({ match_id: u.match_id, success: true });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET /api/match-odds — Get matches with odds info
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("matches")
    .select(
      "id, stage, home_team, away_team, kickoff_utc, home_win_odds, draw_odds, away_win_odds"
    )
    .not("home_win_odds", "is", null)
    .order("kickoff_utc", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich with computed points
  const enriched = (data || []).map((m) => ({
    ...m,
    home_win_points: oddsToPoints(m.home_win_odds),
    draw_points: oddsToPoints(m.draw_odds),
    away_win_points: oddsToPoints(m.away_win_odds),
    home_win_exact_points: oddsToPoints(m.home_win_odds) * 3,
    draw_exact_points: oddsToPoints(m.draw_odds) * 3,
    away_win_exact_points: oddsToPoints(m.away_win_odds) * 3,
  }));

  return NextResponse.json({ matches: enriched });
}

function oddsToPoints(odds: number): number {
  return Math.min(Math.max(Math.round(odds) * 10, 10), 80);
}
