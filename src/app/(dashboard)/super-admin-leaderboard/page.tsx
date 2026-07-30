import { AccessNotice } from "@/components/auth/access-notice";
import {
  getAdminLeaderboard,
  AdminLeaderboardEntry,
  AdminLeaderboardResponse,
} from "@/lib/api/leaderboard";
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

  const leaderboardResponse: AdminLeaderboardResponse = await getAdminLeaderboard();
  const sortedTeams = sortLeaderboardByScore(leaderboardResponse.leaderboard);

  if (!sortedTeams || sortedTeams.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-xl font-heading text-black">
          No leaderboard available at the moment.
        </p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-2 pt-8">
      {leaderboardResponse.frozen ? (
        <h1 className="mb-4 text-4xl lg:text-8xl font-bold font-heading text-white">Leaderboard (frozen)</h1>
      ) :(
        <h1 className="mb-4 text-4xl lg:text-8xl font-bold font-heading text-white">Leaderboard</h1>
      
      )}
      
      <FreezeToggleSwitch initialFrozen={leaderboardResponse.frozen} />

      <SuperAdminLeaderboardClient
        initialLeaderboard={sortedTeams}
        isFrozen={leaderboardResponse.frozen}
        frozenAt={leaderboardResponse.frozen_at}
      />
    </div>
  );
}