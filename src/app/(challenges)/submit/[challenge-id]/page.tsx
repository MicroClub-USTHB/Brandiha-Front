import { notFound, redirect } from "next/navigation";
import { Lock } from "lucide-react";
import SubmitForm from "@/components/submit/submit-form";
import { getChallenge } from "@/lib/api/challenges";
import { parseChallengeId } from "@/lib/challenge-id";
import { Header } from "@/components/landing/header";

type Props = {
  params: Promise<{ "challenge-id": string }>;
};

/** Stands in for the form when there's nothing to submit to (or not yet). */
function Notice({
  icon: Icon,
  title,
  message,
}: {
  icon: typeof Lock;
  title: string;
  message: string;
}) {
  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 text-center font-sans"
    >
      <Icon className="size-10 text-muted-foreground" aria-hidden />
      <h1
        className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground"
      >
        {title}
      </h1>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

/**
 * Public submission page. A team authenticates with its `secret_code` rather
 * than a session, so this route is deliberately outside the proxy's protected
 * prefixes — no login required.
 */
export default async function SubmitPage(props: Props) {
  const { "challenge-id": rawId } = await props.params;

  const challengeId = parseChallengeId(rawId);
  if (challengeId === null) notFound();

  const result = await getChallenge(challengeId);

  // A locked challenge has no form to offer and no title to print, so there is
  // nothing here to render — back to the picker, which says why it's locked
  // (a countdown, or "Closed"). Also closes the direct-URL route to a title the
  // cards take care not to show.
  if (result.ok && result.data.window !== "open") redirect("/submit");

  const body = result.ok ? (
    // Reachable only when the window is open, and only an upcoming challenge
    // has its title withheld — the fallback is unreachable, not an empty state.
    <SubmitForm
      challengeId={result.data.challenge.id}
      challengeTitle={result.data.challenge.title ?? ""}
    />
  ) : (
    <Notice icon={Lock} title="Unavailable" message={result.error} />
  );

  return (
    <main className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:h-screen md:max-h-screen overflow-visible p-4 pt-32 lg:pt-24">
      <Header />
      <div className="flex w-full flex-col items-center gap-6">
        {body}
      </div>
    </main>
  );
}
