import { Header } from "@/components/landing/header";
import { getGlobalLeaderboard } from "@/lib/api/leaderboard";
import type { PublicLeaderboardResponse } from "@/lib/api/leaderboard-types";
import { byScore } from "@/lib/leaderboard-order";
import LeaderboardComponent from "@/components/leaderboard/leaderboard";
import { Snowflake, Table2 } from "lucide-react";
import { Notice } from "@/components/notice";

export default async function Leaderboard() {
  const leaderboardResponse: PublicLeaderboardResponse = await getGlobalLeaderboard();

  const sortedLeaderboardData = byScore(leaderboardResponse.leaderboard);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 px-6 pb-6 pt-40 lg:pt-32">
      <Header />
      <h1 className="mt-8 mb-6 text-4xl lg:text-8xl font-bold font-heading text-white flex items-center gap-4">
        Leaderboard
        {leaderboardResponse.frozen && <Snowflake className="size-8 lg:size-12 text-white/80" />}
      </h1>

      {sortedLeaderboardData.length === 0 ? (
        <Notice
          icon={Table2}
          title="No entries yet"
          message="Scores will appear here once teams start submitting."
        />
      ) : (
        <LeaderboardComponent leaderboardData={sortedLeaderboardData} />
      )}
      <div className="h-12" />
    </div>
  );
}