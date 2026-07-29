import Link from "next/link";
import { getPublicChallenges } from "@/lib/api/challenges";
import { windowFor } from "@/lib/api/challenge-window";
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
  allowClosed = false,
}: {
  /** Route the cards link into; the challenge id is appended. */
  hrefPrefix: string;
  /**
   * Whether a closed challenge links in too. Reviewing submissions outlives the
   * submission window — the entries are still there once the deadline passes —
   * but submitting to a closed challenge doesn't, so `/submit` leaves this off
   * and `/submissions` turns it on.
   */
  allowClosed?: boolean;
}) {
  const result = await getPublicChallenges();

  return (
    // Fills the viewport minus whatever chrome sits above it: `--shell-offset`
    // is published by the layout that owns that chrome (the staff dashboard's
    // header), and defaults to nothing on a route with none, like `/submit`.
    // Without the subtraction a route with a header overflows by exactly the
    // header's height. `svh` rather than `vh` so mobile browser UI doesn't push
    // it over either.
    <div className="flex min-h-[calc(100svh-var(--shell-offset,0px))] flex-col items-center justify-center">
      <h1 className="mb-4 font-heading text-5xl font-bold tracking-wider text-white">
        Challenges
      </h1>
      {!result.ok ? (
        <p className="font-sans text-destructive">{result.error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {result.data.map((challenge) => {
            // Resolved here so the card's first paint is already right. The
            // page is `force-dynamic`, so this is the request's clock, not a
            // stale build-time one.
            const submissionWindow = windowFor(
              challenge.unlocks_at,
              challenge.ends_at,
            );

            const card = (
              <ChallengeCard
                department={challenge.department as Department}
                // Null for an upcoming challenge — the fetch withholds it, so
                // the real title isn't in this page's payload to begin with.
                title={challenge.title ?? undefined}
                unlocks_at={challenge.unlocks_at}
                ends_at={challenge.ends_at ?? undefined}
                initialWindow={submissionWindow}
              />
            );

            // A card only links where the page behind it will actually let the
            // caller in; anywhere else it isn't a link at all, rather than one
            // that bounces off a redirect. An upcoming challenge is never
            // navigable — there is nothing behind it yet, in either route.
            // Wrapped in a plain element either way, to keep it a grid item and
            // the columns even.
            const isNavigable =
              submissionWindow === "open" ||
              (allowClosed && submissionWindow === "closed");

            return isNavigable ? (
              <Link key={challenge.id} href={`${hrefPrefix}/${challenge.id}`}>
                {card}
              </Link>
            ) : (
              <div key={challenge.id}>{card}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
