import ChallengeGrid from "@/components/challenge-grid";
import { Header } from "@/components/landing/header";
export const dynamic = "force-dynamic";

/** Picks a challenge to submit against. Public — anyone with a team code. */
export default function SubmitIndexPage() {
  return (
    <div id="challenges" className="h-screen flex">
      <Header />
      <ChallengeGrid hrefPrefix="/submit" />
    </div>
  );
}
