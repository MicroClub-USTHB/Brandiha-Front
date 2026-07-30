import { checkAccess } from "@/lib/auth/session";
import { getVotingStatus } from "@/lib/api/voting";
import { AccessNotice } from "@/components/auth/access-notice";
import { VoteBallot } from "@/components/vote/vote-ballot";

/** The alumni landing page: rank every accepted team into a Borda vote. */
export default async function VotePage() {
  const access = await checkAccess("alumni");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const result = await getVotingStatus();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center p-6">
      <h1 className="mb-2 text-4xl lg:text-8xl font-bold font-heading text-white">
        Vote
      </h1>
      <p className="mb-4 max-w-2xl text-center text-base text-white/85">
        {result.ok && result.data.has_voted
          ? "Your ranking from first to last preference. You get one vote, so this is final."
          : <>Rank teams from your first to last preference. Drag the handle or use arrows.<br />One vote, final once submitted.</>}
      </p>

      {!result.ok ? (
        <p className="mt-8 text-destructive">{result.error}</p>
      ) : result.data.teams.length === 0 ? (
        // The backend ranks *accepted* teams only, so an empty ballot means none
        // have been accepted yet rather than a failed load.
        <p className="mt-8 text-white/50">
          No teams have been accepted yet — there&apos;s nothing to rank so far.
        </p>
      ) : (
        <VoteBallot
          initialTeams={result.data.teams}
          hasVoted={result.data.has_voted}
        />
      )}
    </main>
  );
}
