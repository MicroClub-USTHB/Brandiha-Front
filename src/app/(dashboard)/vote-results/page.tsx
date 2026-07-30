import { ListOrdered } from "lucide-react";

import { AccessNotice } from "@/components/auth/access-notice";
import { Notice } from "@/components/notice";
import { VoteResultsList } from "@/components/vote/vote-results-list";
import { getAlumniVotes } from "@/lib/api/voting";
import { checkAccess } from "@/lib/auth/session";

/** The audit view behind the Borda board: who ranked which team where. */
export default async function VoteResultsPage() {
  // `/alumni/votes` is `get_current_super_admin` on the backend — the same gate
  // as the tallied board, and not one the voting alumni pass.
  const access = await checkAccess("super_admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const result = await getAlumniVotes();

  if (!result.ok)
    return <Notice icon={ListOrdered} title="Vote results" message={result.error} />;

  // Only cast ballots come back, so an empty list means nobody has voted yet
  // rather than a failed load.
  if (result.data.length === 0)
    return (
      <Notice
        icon={ListOrdered}
        title="No votes yet"
        message="Each alumni's ranking shows up here once they submit their ballot."
      />
    );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center p-6">
      <h1 className="mb-2 text-4xl lg:text-8xl font-bold font-heading text-white">
        Vote results
      </h1>
      <p className="mb-4 max-w-2xl text-center text-base text-white/85">
        Every alumni&apos;s ballot, first preference at the top. This is the breakdown
        the vote leaderboard is tallied from.
      </p>

      <div className="w-full">
        <VoteResultsList votes={result.data} />
      </div>
    </main>
  );
}
