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
    <main className="mx-auto w-full max-w-3xl p-6 pt-8 font-sans">
      <h1 className="font-heading text-4xl lg:text-8xl font-bold text-white">
        Vote results
      </h1>
      <p className="mt-2 text-sm text-white/70">
        Every alumni&apos;s ballot, first preference at the top — the breakdown
        the vote leaderboard is tallied from.
      </p>

      <VoteResultsList votes={result.data} />
    </main>
  );
}
