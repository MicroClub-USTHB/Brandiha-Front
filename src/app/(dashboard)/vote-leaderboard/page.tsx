import { Vote } from "lucide-react";

import { AccessNotice } from "@/components/auth/access-notice";
import LeaderboardComponent from "@/components/leaderboard/leaderboard";
import { Notice } from "@/components/notice";
import { getAlumniLeaderboard } from "@/lib/api/voting";
import { checkAccess } from "@/lib/auth/session";

/** The tallied alumni Borda vote — one row per team, highest score first. */
export default async function VoteLeaderboardPage() {
  // `/alumni/leaderboard` is `get_current_super_admin` on the backend. `alumni`
  // is deliberately absent: they cast the votes on `/vote` and don't see the
  // tally, and the roles are disjoint rather than a ladder.
  const access = await checkAccess("super_admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const result = await getAlumniLeaderboard();

  if (!result.ok)
    return <Notice icon={Vote} title="Vote leaderboard" message={result.error} />;

  // The board is built from cast ballots, so an empty one means no alumni has
  // voted yet rather than a failed load.
  if (result.data.length === 0)
    return (
      <Notice
        icon={Vote}
        title="No votes yet"
        message="The Borda tally appears here once alumni start ranking teams."
      />
    );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center p-6">
      <h1 className="mb-2 text-4xl lg:text-8xl font-bold font-heading text-white">
        Vote leaderboard
      </h1>
      <p className="mb-4 max-w-2xl text-center text-base text-white/85">
        Borda points from the alumni ballots. A team earns{" "}
        <span className="font-semibold text-white">(N − rank + 1)</span> per vote,
        where N is the number of teams ranked. These are preference points, not
        challenge scores.
      </p>

      {/* The shared board reads `total_score`; the Borda tally is that score for
          this page, so map it across rather than teaching the row a second field. */}
      <LeaderboardComponent
        leaderboardData={result.data.map((entry) => ({
          team_name: entry.team_name,
          total_score: entry.borda_score,
        }))}
      />
    </main>
  );
}
