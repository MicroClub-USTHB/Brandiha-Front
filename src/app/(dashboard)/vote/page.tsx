import { checkAccess } from "@/lib/auth/session";
import { AccessNotice } from "@/components/auth/access-notice";

/** The alumni landing page: rank every accepted team into a Borda vote. */
export default async function VotePage() {
  // `/alumni/voting` is `get_current_alumni_only` on the backend — alumni and
  // nobody else. `super_admin` is deliberately absent: the roles are disjoint,
  // and it reads the results (`/alumni/leaderboard`) rather than casting a vote.
  const access = await checkAccess("alumni");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  return (
    <main className="mx-auto max-w-4xl p-6 font-sans">
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
        Vote
      </h1>
      <p className="mt-2 text-sm text-white/70">
        Rank every accepted team, from your first preference to your last. You
        get one vote and it can&apos;t be changed once submitted.
      </p>

      <p className="mt-10 text-white/50">
        The ballot isn&apos;t open yet — check back shortly.
      </p>
    </main>
  );
}
