import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: { user } } = await service.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await service
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  if (body.action === "top_scorer") {
    const actual = String(body.actual || "").trim();
    if (!actual) return NextResponse.json({ error: "Top scorer is required" }, { status: 400 });

    const { data: predictions, error } = await service
      .from("group_topscorer_predictions")
      .select("id, predicted_topscorer");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const normalize = (value: string) =>
      value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLocaleLowerCase();
    const normalizedActual = normalize(actual);
    const surname = normalizedActual.split(/\s+/).at(-1) || normalizedActual;
    let correct = 0;
    for (const prediction of predictions || []) {
      const normalizedPrediction = normalize(prediction.predicted_topscorer);
      const isCorrect =
        normalizedPrediction === normalizedActual ||
        normalizedPrediction.split(/\s+/).includes(surname);
      const points = isCorrect ? 75 : 0;
      if (points) correct++;
      await service.from("group_topscorer_predictions").update({ points }).eq("id", prediction.id);
    }
    return NextResponse.json({ total: predictions?.length || 0, correct, actual });
  }

  const groupName = String(body.group_name || "");
  const { data: matches, error: matchError } = await service
    .from("matches")
    .select("home_team, away_team, home_score, away_score")
    .eq("stage", groupName);
  if (matchError || !matches || matches.length < 6 || matches.some((m) => m.home_score === null)) {
    return NextResponse.json({ error: "Group results are incomplete" }, { status: 400 });
  }

  const teams: Record<string, { pts: number; gd: number; gf: number }> = {};
  for (const match of matches) {
    teams[match.home_team] ||= { pts: 0, gd: 0, gf: 0 };
    teams[match.away_team] ||= { pts: 0, gd: 0, gf: 0 };
    const home = match.home_score!;
    const away = match.away_score!;
    teams[match.home_team].gf += home;
    teams[match.home_team].gd += home - away;
    teams[match.away_team].gf += away;
    teams[match.away_team].gd += away - home;
    if (home > away) teams[match.home_team].pts += 3;
    else if (away > home) teams[match.away_team].pts += 3;
    else {
      teams[match.home_team].pts++;
      teams[match.away_team].pts++;
    }
  }
  const standings = Object.entries(teams)
    .sort((a, b) => b[1].pts - a[1].pts || b[1].gd - a[1].gd || b[1].gf - a[1].gf)
    .map(([team]) => team);

  const { data: predictions, error } = await service
    .from("group_predictions")
    .select("id, predicted_first, predicted_second, predicted_third")
    .eq("group_name", groupName);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let scored75 = 0;
  let scored50 = 0;
  for (const prediction of predictions || []) {
    const perfect = prediction.predicted_first === standings[0]
      && prediction.predicted_second === standings[1]
      && prediction.predicted_third === standings[2];
    const topTwo = prediction.predicted_first === standings[0]
      && prediction.predicted_second === standings[1];
    const points = perfect ? 75 : topTwo ? 50 : 0;
    if (points === 75) scored75++;
    if (points === 50) scored50++;
    await service.from("group_predictions").update({ points }).eq("id", prediction.id);
  }

  return NextResponse.json({
    total: predictions?.length || 0,
    scored75,
    scored50,
    standings: standings.slice(0, 3),
  });
}
