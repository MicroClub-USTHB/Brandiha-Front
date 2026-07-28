import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarClock, Lock } from "lucide-react";
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

/**
 * Fixed locale and time zone rather than the runtime's: this renders on the
 * server, so `undefined` would silently mean the deploy host's locale and zone
 * (UTC on most) and present it as if it were the reader's. Stating UTC outright
 * is the honest version, and it's the zone the deadline is actually kept in.
 */
const TIMESTAMP = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function formatDate(iso: string): string {
  // The zone is appended rather than asked of `timeZoneName`, which Intl rejects
  // alongside the `dateStyle`/`timeStyle` shorthands.
  return `${TIMESTAMP.format(new Date(iso))} UTC`;
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

  const body = (() => {
    if (!result.ok) {
      return <Notice icon={Lock} title="Unavailable" message={result.error} />;
    }

    // Destructured under a different name: `window` would shadow the global.
    const { challenge, window: submissionWindow } = result.data;

    // The backend rejects both edges of the window with a bare 400, so we act on
    // the resolved window to say which it is instead of letting the user submit
    // into an opaque error.
    if (submissionWindow === "upcoming") {
      return (
        <Notice
          icon={CalendarClock}
          title="Not open yet"
          message={`“${challenge.title}” opens for submissions on ${formatDate(challenge.unlocks_at)}.`}
        />
      );
    }

    if (submissionWindow === "closed") {
      return (
        <Notice
          icon={Lock}
          title="Submissions closed"
          message={
            challenge.ends_at
              ? `“${challenge.title}” closed on ${formatDate(challenge.ends_at)}.`
              : `“${challenge.title}” is no longer accepting submissions.`
          }
        />
      );
    }

    return <SubmitForm challengeId={challenge.id} challengeTitle={challenge.title} />;
  })();

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
      {body}
    </main>
  );
}
