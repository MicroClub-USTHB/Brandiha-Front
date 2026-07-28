import Link from "next/link";
import { getPublicChallenges } from "@/lib/api/challenges";
import ChallengeCard, { Department } from "@/components/challenge-card";

/**
 * The challenge picker shared by `/submit` and `/submissions`: same list, same
 * cards, only the route each card links into differs.
 *
 * Fetches on render rather than taking the list as a prop, so the two pages
 * can't drift on how a failed fetch is presented. Callers stay responsible for
 * their own access check — this component shows the public list either way.
 */
export default async function ChallengeGrid({
  hrefPrefix,
}: {
  /** Route the cards link into; the challenge id is appended. */
  hrefPrefix: string;
}) {
  const result = await getPublicChallenges();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 font-heading text-5xl font-bold text-white">Challenges</h1>
      {!result.ok ? (
        <p className="font-sans text-destructive">{result.error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {result.data.map((challenge) => (
            <Link key={challenge.id} href={`${hrefPrefix}/${challenge.id}`}>
              <ChallengeCard
                department={challenge.department as Department}
                title={challenge.title}
                unlocks_at={challenge.unlocks_at}
                ends_at={challenge.ends_at ?? undefined}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
