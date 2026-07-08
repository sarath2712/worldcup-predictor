import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 1000;

export async function GET() {
  noStore();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "no-store",
            next: { revalidate: 0 },
          }),
      },
    }
  );

  const [{ data: leaderboard, error: leaderboardError }, { data: matches, error: matchesError }] =
    await Promise.all([
      supabase.from("leaderboard").select("*").order("total_points", { ascending: false }),
      supabase
        .from("matches")
        .select("id,home_score,away_score")
        .not("home_score", "is", null)
        .not("away_score", "is", null),
    ]);

  if (leaderboardError || matchesError) {
    return NextResponse.json(
      { error: leaderboardError?.message || matchesError?.message },
      { status: 500 }
    );
  }

  const resultByMatch = new Map(
    (matches || []).map((match) => [
      match.id,
      { home: match.home_score, away: match.away_score },
    ])
  );
  const matchIds = Array.from(resultByMatch.keys());
  const predictions: Array<{
    user_id: string;
    match_id: number;
    predicted_home: number;
    predicted_away: number;
  }> = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("predictions")
      .select("user_id,match_id,predicted_home,predicted_away")
      .in("match_id", matchIds)
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    predictions.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) break;
  }

  const exactByUser = new Map<string, number>();
  for (const prediction of predictions) {
    const result = resultByMatch.get(prediction.match_id);
    if (
      result &&
      prediction.predicted_home === result.home &&
      prediction.predicted_away === result.away
    ) {
      exactByUser.set(
        prediction.user_id,
        (exactByUser.get(prediction.user_id) || 0) + 1
      );
    }
  }

  return NextResponse.json(
    {
      entries: (leaderboard || []).map((entry) => ({
        ...entry,
        // Only this display field is corrected. Totals and ranks remain exactly
        // as calculated by the existing database leaderboard view.
        exact_scores: exactByUser.get(entry.user_id) || 0,
      })),
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
