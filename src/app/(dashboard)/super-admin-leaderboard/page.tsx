import { Trophy } from "lucide-react";

import { AccessNotice } from "@/components/auth/access-notice";
import { Notice } from "@/components/notice";
import { getAdminLeaderboard } from "@/lib/api/leaderboard";
import type { AdminLeaderboardEntry } from "@/lib/api/leaderboard-types";
import { checkAccess } from "@/lib/auth/session";
import { SuperAdminLeaderboardClient } from "@/components/leaderboard/super-admin-leaderboard-client";
import { FreezeToggleSwitch } from "@/components/leaderboard/freeze-toggle-switch";
export function sortLeaderboardByScore(
  data: AdminLeaderboardEntry[],
): AdminLeaderboardEntry[] {
  return [...data].sort((a, b) => b.total_score - a.total_score);
}

export default async function SuperAdminLeaderboard() {
  const access = await checkAccess("super_admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const result = await getAdminLeaderboard();
  if (!result.ok)
    return <Notice icon={Trophy} title="Leaderboard" message={result.error} />;

  const leaderboardResponse = result.data;
  const sortedTeams = sortLeaderboardByScore(leaderboardResponse.leaderboard);

  // The board lists accepted teams with at least one scored submission, so an
  // empty one means nothing has been scored yet rather than a failed load.
  if (sortedTeams.length === 0)
    return (
      <Notice
        icon={Trophy}
        title="No scores yet"
        message="Teams appear here once their submissions are scored."
      />
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-2 pt-8">
      <h1 className="mb-4 text-4xl lg:text-8xl font-bold font-heading text-white">Leaderboard</h1>

      <FreezeToggleSwitch initialFrozen={leaderboardResponse.frozen} />

      <SuperAdminLeaderboardClient
        initialLeaderboard={sortedTeams}
        isFrozen={leaderboardResponse.frozen}
        frozenAt={leaderboardResponse.frozen_at}
      />
    </div>
  );
}