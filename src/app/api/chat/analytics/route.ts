import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_USER_IDS = new Set([
  "c650a8d0-428e-49e3-a225-f2787bd8fd77", // SARATHJS
]);

export async function GET() {
  const session = createServerSupabase();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user || !ADMIN_USER_IDS.has(user.id)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Analytics is not configured." },
      { status: 503 }
    );
  }

  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: usage, error } = await service
    .from("zizu_usage")
    .select(
      "user_id,category,status,model,latency_ms,input_tokens,output_tokens,created_at"
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = usage || [];
  const userIds = Array.from(
    new Set(rows.map((row) => row.user_id).filter(Boolean))
  );
  const { data: profiles } =
    userIds.length > 0
      ? await service.from("profiles").select("id,username").in("id", userIds)
      : { data: [] };
  const usernameById = new Map(
    (profiles || []).map((profile) => [profile.id, profile.username])
  );
  const perUser = new Map<string, number>();
  const perCategory = new Map<string, number>();

  rows.forEach((row) => {
    if (row.user_id) {
      perUser.set(row.user_id, (perUser.get(row.user_id) || 0) + 1);
    }
    perCategory.set(
      row.category,
      (perCategory.get(row.category) || 0) + 1
    );
  });

  return NextResponse.json(
    {
      period: "last_7_days",
      uniqueUsers: userIds.length,
      totalQueries: rows.length,
      successfulQueries: rows.filter((row) => row.status === "success").length,
      failedQueries: rows.filter((row) => row.status === "failed").length,
      averageLatencyMs: rows.length
        ? Math.round(
            rows.reduce((sum, row) => sum + (row.latency_ms || 0), 0) /
              rows.length
          )
        : 0,
      inputTokens: rows.reduce(
        (sum, row) => sum + (row.input_tokens || 0),
        0
      ),
      outputTokens: rows.reduce(
        (sum, row) => sum + (row.output_tokens || 0),
        0
      ),
      byCategory: Object.fromEntries(perCategory),
      byUser: Array.from(perUser, ([userId, queries]) => ({
        userId,
        username: usernameById.get(userId) || "Unknown participant",
        queries,
      })).sort((a, b) => b.queries - a.queries),
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
