import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ESPN API - free, no auth needed
const ESPN_WC_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

// ESPN name → DB name mapping (only where they differ)
const TEAM_NAME_MAP: Record<string, string> = {
  Czechia: "Czech Republic",
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
  "Côte d'Ivoire": "Ivory Coast",
  "Curacao": "Curaçao",
  "Korea Republic": "South Korea",
  "IR Iran": "Iran",
  "Dem. Rep. Congo": "DR Congo",
  "Congo DR": "DR Congo",
  USA: "United States",
  "United States of America": "United States",
  "Cabo Verde": "Cape Verde",
  "Aotearoa New Zealand": "New Zealand",
};

function normalizeTeamName(espnName: string): string {
  return TEAM_NAME_MAP[espnName] || espnName;
}

type SyncResult = {
  matched: number;
  updated: number;
  skipped: number;
  errors: string[];
  details: { match: string; action: string }[];
};

export async function POST(request: Request) {
  try {
    // Check for cron secret (optional — allows automated calls)
    const authHeader = request.headers.get("x-cron-secret");
    const cronSecret = process.env.CRON_SECRET;
    const isCronCall = cronSecret && authHeader === cronSecret;

    // Parse optional params
    const body = await request.json().catch(() => ({}));
    const dateParam = body.date; // format: YYYYMMDD
    const force = body.force === true; // only manual force skips time check (cron respects it)

    // 2. Connect to Supabase with service role or anon key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if there are any unscored matches that started within last 4 hours
    // (covers ~2h match + 1h buffer + timezone slack)
    // Skip this check if force=true (manual sync from admin page)
    if (!force) {
      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
      const thirtyMinFromNow = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const { data: pendingMatches } = await supabase
        .from("matches")
        .select("id")
        .is("home_score", null)
        .lte("kickoff_utc", thirtyMinFromNow)
        .gte("kickoff_utc", fourHoursAgo)
        .limit(1);

      if (!pendingMatches || pendingMatches.length === 0) {
        return NextResponse.json({
          message: "No active or recently finished matches to sync",
          matched: 0,
          updated: 0,
          skipped_reason: "outside_match_window",
        });
      }
    }

    // Build ESPN URL
    let espnUrl = ESPN_WC_URL;
    if (dateParam) {
      espnUrl += `?dates=${dateParam}`;
    }

    // 1. Fetch scores from ESPN
    const espnRes = await fetch(espnUrl, {
      headers: { "User-Agent": "WorldCupPredictor/1.0" },
    });
    if (!espnRes.ok) {
      return NextResponse.json(
        { error: `ESPN API returned ${espnRes.status}` },
        { status: 502 }
      );
    }
    const espnData = await espnRes.json();
    const events = espnData.events || [];

    if (events.length === 0) {
      return NextResponse.json({
        message: "No matches found from ESPN for this date",
        matched: 0,
        updated: 0,
      });
    }

    const result: SyncResult = {
      matched: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      details: [],
    };

    for (const event of events) {
      const comp = event.competitions?.[0];
      if (!comp) continue;

      const statusState = comp.status?.type?.state; // "pre" | "in" | "post"
      const competitors = comp.competitors || [];
      if (competitors.length !== 2) continue;

      const homeComp = competitors.find(
        (c: { homeAway: string }) => c.homeAway === "home"
      );
      const awayComp = competitors.find(
        (c: { homeAway: string }) => c.homeAway === "away"
      );
      if (!homeComp || !awayComp) continue;

      const espnHome = normalizeTeamName(homeComp.team.name);
      const espnAway = normalizeTeamName(awayComp.team.name);
      const matchLabel = `${espnHome} vs ${espnAway}`;

      // 3. Find matching match in DB by team names (try both home/away orders)
      let dbMatches: { id: number; home_team: string; away_team: string; home_score: number | null; away_score: number | null; stage: string }[] | null = null;
      let swapped = false;

      const { data: exactMatches, error: dbError } = await supabase
        .from("matches")
        .select("id, home_team, away_team, home_score, away_score, stage")
        .eq("home_team", espnHome)
        .eq("away_team", espnAway)
        .order("kickoff_utc", { ascending: true })
        .limit(1);

      if (dbError) {
        result.errors.push(`DB error for ${matchLabel}: ${dbError.message}`);
        continue;
      }

      dbMatches = exactMatches;

      // If no exact match, try reversed home/away
      if (!dbMatches || dbMatches.length === 0) {
        const { data: reversedMatches } = await supabase
          .from("matches")
          .select("id, home_team, away_team, home_score, away_score, stage")
          .eq("home_team", espnAway)
          .eq("away_team", espnHome)
          .order("kickoff_utc", { ascending: true })
          .limit(1);

        if (reversedMatches && reversedMatches.length > 0) {
          dbMatches = reversedMatches;
          swapped = true;
        }
      }

      if (!dbMatches || dbMatches.length === 0) {
        result.details.push({
          match: matchLabel,
          action: "No DB match found",
        });
        continue;
      }

      const dbMatch = dbMatches[0];
      result.matched++;

      // Skip if match hasn't finished yet
      if (statusState !== "post") {
        result.skipped++;
        result.details.push({
          match: matchLabel,
          action: `Skipped — status: ${comp.status?.type?.description || statusState}`,
        });
        continue;
      }

      const espnHomeScore = parseInt(homeComp.score, 10);
      const espnAwayScore = parseInt(awayComp.score, 10);

      // Map ESPN scores to DB home/away (swap if teams were found reversed)
      const homeScore = swapped ? espnAwayScore : espnHomeScore;
      const awayScore = swapped ? espnHomeScore : espnAwayScore;

      // Extract first goal team from match details (do this BEFORE skip check)
      let firstGoalTeam: string | null = null;
      const details = comp.details || [];
      const goals = details.filter(
        (d: { scoringPlay: boolean }) => d.scoringPlay
      );
      if (goals.length > 0) {
        goals.sort(
          (a: { clock: { value: number } }, b: { clock: { value: number } }) =>
            (a.clock?.value || 0) - (b.clock?.value || 0)
        );
        const firstGoal = goals[0];
        const scoringTeamId = firstGoal.team?.id;
        if (scoringTeamId) {
          const scoringComp = competitors.find(
            (c: { team: { id: string } }) => c.team.id === scoringTeamId
          );
          if (scoringComp) {
            firstGoalTeam = normalizeTeamName(scoringComp.team.name);
            // If teams were swapped, map the first goal team to DB perspective
            if (swapped) {
              if (firstGoalTeam === espnHome) firstGoalTeam = dbMatch.away_team;
              else if (firstGoalTeam === espnAway) firstGoalTeam = dbMatch.home_team;
            }
          }
        }
      } else if (homeScore === 0 && awayScore === 0) {
        firstGoalTeam = "None";
      }

      // Check if we need to update first goal team even if scores match
      const scoresMatch = dbMatch.home_score === homeScore && dbMatch.away_score === awayScore;

      // Skip only if scores match AND we don't have new first-goal info to add
      if (scoresMatch && !firstGoalTeam) {
        result.skipped++;
        result.details.push({
          match: matchLabel,
          action: `Already up to date (${homeScore}-${awayScore})`,
        });
        continue;
      }

      if (scoresMatch && firstGoalTeam) {
        // Scores exist but first goal team might be missing — update it
        const { error: fgError } = await supabase
          .from("matches")
          .update({ actual_scorers: firstGoalTeam })
          .eq("id", dbMatch.id);

        if (fgError) {
          result.errors.push(`First goal update failed for ${matchLabel}: ${fgError.message}`);
        } else {
          result.details.push({
            match: matchLabel,
            action: `Scores existed, added first goal: ${firstGoalTeam}`,
          });
        }

        // Always recalculate points to pick up first goal bonus
        const { error: calcError } = await supabase.rpc("calculate_points", {
          p_match_id: dbMatch.id,
        });
        if (calcError) {
          result.errors.push(`calculate_points failed for ${matchLabel}: ${calcError.message}`);
        } else {
          result.updated++;
          result.details.push({ match: matchLabel, action: "Points recalculated ✓" });
        }
        continue;
      }

      // 5. Update match in DB
      const updateData: Record<string, unknown> = {
        home_score: homeScore,
        away_score: awayScore,
      };
      if (firstGoalTeam) {
        updateData.actual_scorers = firstGoalTeam;
      }

      const { error: updateError } = await supabase
        .from("matches")
        .update(updateData)
        .eq("id", dbMatch.id);

      if (updateError) {
        result.errors.push(
          `Update failed for ${matchLabel}: ${updateError.message}`
        );
        continue;
      }

      result.updated++;
      result.details.push({
        match: matchLabel,
        action: `Updated: ${homeScore}-${awayScore}${firstGoalTeam ? ` | First goal: ${firstGoalTeam}` : ""}`,
      });

      // 6. Trigger calculate_points for this match
      const { error: calcError } = await supabase.rpc("calculate_points", {
        p_match_id: dbMatch.id,
      });
      if (calcError) {
        result.errors.push(
          `calculate_points failed for ${matchLabel}: ${calcError.message}`
        );
      } else {
        result.details.push({
          match: matchLabel,
          action: "Points calculated ✓",
        });
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Preview what ESPN has (no DB changes)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    let espnUrl = ESPN_WC_URL;
    if (dateParam) {
      espnUrl += `?dates=${dateParam}`;
    }

    const espnRes = await fetch(espnUrl, {
      headers: { "User-Agent": "WorldCupPredictor/1.0" },
    });
    if (!espnRes.ok) {
      return NextResponse.json(
        { error: `ESPN API returned ${espnRes.status}` },
        { status: 502 }
      );
    }
    const espnData = await espnRes.json();
    const events = espnData.events || [];

    const matches = events.map(
      (event: {
        competitions: Array<{
          status: { type: { description: string; state: string } };
          competitors: Array<{
            homeAway: string;
            score: string;
            team: { name: string };
          }>;
          details: Array<{
            scoringPlay: boolean;
            clock: { value: number; displayValue: string };
            team: { id: string };
            athletesInvolved: Array<{
              displayName: string;
              shortName: string;
            }>;
          }>;
        }>;
      }) => {
        const comp = event.competitions?.[0];
        if (!comp) return null;

        const competitors = comp.competitors || [];
        const homeComp = competitors.find(
          (c: { homeAway: string }) => c.homeAway === "home"
        );
        const awayComp = competitors.find(
          (c: { homeAway: string }) => c.homeAway === "away"
        );
        if (!homeComp || !awayComp) return null;

        // Extract goal scorers
        const goals = (comp.details || [])
          .filter((d: { scoringPlay: boolean }) => d.scoringPlay)
          .sort(
            (
              a: { clock: { value: number } },
              b: { clock: { value: number } }
            ) => (a.clock?.value || 0) - (b.clock?.value || 0)
          )
          .map(
            (g: {
              clock: { displayValue: string };
              athletesInvolved: Array<{ shortName: string }>;
            }) => ({
              minute: g.clock?.displayValue || "?",
              scorer: g.athletesInvolved?.[0]?.shortName || "Unknown",
            })
          );

        return {
          home: normalizeTeamName(homeComp.team.name),
          away: normalizeTeamName(awayComp.team.name),
          home_score: homeComp.score,
          away_score: awayComp.score,
          status: comp.status?.type?.description || "Unknown",
          state: comp.status?.type?.state || "unknown",
          goals,
        };
      }
    );

    return NextResponse.json({
      date: dateParam || "today",
      matches: matches.filter(Boolean),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
