import ChallengeGrid from "@/components/challenge-grid";

export const dynamic = "force-dynamic";

/** Picks a challenge to submit against. Public — anyone with a team code. */
export default function SubmitIndexPage() {
  return (
    <div className="h-screen flex">
      <ChallengeGrid hrefPrefix="/submit" />
    </div>
  );
}
