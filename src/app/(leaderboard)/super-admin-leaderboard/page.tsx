import LeaderboardComponent from "@/components/leaderboard/leaderboard";
import { AccessNotice } from "@/components/auth/access-notice";
import {
  getAdminLeaderboard,
  AdminLeaderboardEntry,
} from "@/lib/api/leaderboard";
import { checkAccess } from "@/lib/auth/session";

export function sortLeaderboardByScore(
  data: AdminLeaderboardEntry[],
): AdminLeaderboardEntry[] {
  return [...data].sort((a, b) => b.total_score - a.total_score);
}
export default async function SuperAdminLeaderboard() {
  const access = await checkAccess("super_admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const leaderboardData: AdminLeaderboardEntry[] = await getAdminLeaderboard();
  const sortedLeaderboardData = sortLeaderboardByScore(leaderboardData);
  console.log("Leaderboard Data:", leaderboardData);

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-xl font-heading text-black">
          No leaderboard available at the moment.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-start gap-2 min-h-screen">
      <h1 className="text-8xl font-heading text-white font-bold mb-4">
        Leaderboard
      </h1>
      <LeaderboardComponent leaderboardData={sortedLeaderboardData} />
    </div>
  );
}
