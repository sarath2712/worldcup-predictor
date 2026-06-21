import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST /api/top-scorers — Update top scorers (admin/cron only)
// Body: { scorers: [{ rank, player_name, team, goals, assists }] }
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
    const scorers = body.scorers as { rank: number; player_name: string; team: string; goals: number; assists: number }[];

    if (!scorers || !Array.isArray(scorers) || scorers.length === 0) {
      return NextResponse.json({ error: "Invalid body: expected { scorers: [...] }" }, { status: 400 });
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
