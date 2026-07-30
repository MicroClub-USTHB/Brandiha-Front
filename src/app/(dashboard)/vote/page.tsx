import { checkAccess } from "@/lib/auth/session";
import { getVotingStatus } from "@/lib/api/voting";
import { AccessNotice } from "@/components/auth/access-notice";
import { VoteBallot } from "@/components/vote/vote-ballot";

/** The alumni landing page: rank every accepted team into a Borda vote. */
export default async function VotePage() {
  // `/alumni/voting` is `get_current_alumni_only` on the backend — alumni and
  // nobody else. `super_admin` is deliberately absent: the roles are disjoint,
  // and it reads the results (`/alumni/leaderboard`) rather than casting a vote.
  const access = await checkAccess("alumni");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const result = await getVotingStatus();

  return (
    <main className="mx-auto w-full max-w-3xl p-6 font-sans">
      <h1 className="font-heading text-4xl lg:text-8xl font-bold text-white">
        Vote
      </h1>
      <p className="mt-2 text-sm text-white/70">
        {result.ok && result.data.has_voted
          ? "Your ranking, from first preference at the top to last at the bottom. You get one vote, so it's now final."
          : "Rank every team from your first preference at the top to your last at the bottom. Drag a row by its handle, or use the arrows. You get one vote, and it's final once submitted."}
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
