import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Lock } from "lucide-react";
import SubmitForm from "@/components/submit/submit-form";
import { getChallenge } from "@/lib/api/challenges";
import { ThemePicker } from "@/components/theme-picker";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ "challenge-id": string }>;
};

/** Challenge ids are SERIAL integers on the backend, not uuids. */
function parseChallengeId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

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
      className={cn(
        "mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 text-center font-sans",
      )}
    >
      <Icon className={cn("size-10 text-muted-foreground")} aria-hidden />
      <h1
        className={cn(
          "font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground",
        )}
      >
        {title}
      </h1>
      <p className={cn("text-muted-foreground")}>{message}</p>
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
    <main className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:h-screen md:max-h-screen overflow-visible p-4">
      {/* On mobile the logo sits in normal flow, centered above the form; from
          md up it returns to its pinned top-left corner. */}
      <Link href="/" className="static mb-6 md:mb-0 md:absolute md:left-6 md:top-6 z-50">
        <Image
          src="/brandiha-logo.svg"
          alt="Brandiha"
          width={253}
          height={63}
          className="w-44 md:w-[clamp(5rem,9vw,9rem)] h-auto"
        />
      </Link>
      {/* Theme selector pinned to the top-right corner, mirroring the header. */}
      <div className="absolute right-4 top-4 md:right-6 md:top-6 z-50">
        <ThemePicker />
      </div>
      <div className="flex w-full flex-col items-center gap-6">
        {body}
        {/* The challenge picker this page is reached from — without it the page
            is a dead end, since there is no header here. */}
        <Link
          href="/submit"
          className="font-sans text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-white"
        >
          &larr; All challenges
        </Link>
      </div>
    </main>
  );
}
