import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import { checkAccess } from "@/lib/auth/session";
import { getChallengeDetail } from "@/lib/api/challenges";
import { windowFor } from "@/lib/api/challenge-window";
import { parseChallengeId } from "@/lib/challenge-id";
import { DEPARTMENTS } from "@/lib/departments";
import { AccessNotice } from "@/components/auth/access-notice";
import { Notice, NoticeLink } from "@/components/notice";
import { SubmissionsTable } from "@/components/submissions/submissions-table";
import { ExportCsvButton } from "@/components/submissions/export-csv-button";

type Props = {
  params: Promise<{ "challenge-id": string }>;
};

/** Every submission against one challenge, for staff review. */
export default async function SubmissionsPage(props: Props) {
  // `GET /challenges/{id}` is `get_current_staff` on the backend: admin and
  // super_admin, but not alumni.
  const access = await checkAccess("admin", "super_admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const { "challenge-id": rawId } = await props.params;

  const challengeId = parseChallengeId(rawId);
  if (challengeId === null) notFound();

  const result = await getChallengeDetail(challengeId);
  if (!result.ok)
    return (
      <Notice icon={Inbox} title="Submissions" message={result.error}>
        <NoticeLink href="/submissions">&larr; All challenges</NoticeLink>
      </Notice>
    );

  const { challenge, submissions } = result.data;
  const department = DEPARTMENTS[challenge.department];

  // An upcoming challenge bounces back to the picker, the same way `/submit`
  // turns one away: there is nothing to review yet, and its title is still under
  // wraps everywhere else. The card in the grid isn't a link either, so this
  // only catches a typed or stale URL.
  //
  // A *closed* challenge deliberately stays reachable — the submissions it
  // collected outlive its deadline. The window comes off the detail response
  // rather than a second fetch, since `ChallengeWithFreeze` carries both
  // timestamps.
  if (windowFor(challenge.unlocks_at, challenge.ends_at) === "upcoming") {
    redirect("/submissions");
  }

  return (
    <main className="mx-auto max-w-7xl p-6 font-sans">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <Link
            href="/submissions"
            className="mb-4 inline-block text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-white"
          >
            &larr; All challenges
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
              {challenge.title}
            </h1>
            <span
              className="rounded-full px-3 py-0.5 text-xs font-bold uppercase leading-none tracking-wide text-black"
              style={{ backgroundColor: department.color }}
            >
              {department.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {submissions.length === 1 ? "1 submission" : `${submissions.length} submissions`}
          </p>
        </div>
        <div className="shrink-0">
          <ExportCsvButton submissions={submissions} challengeTitle={challenge.title} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-2 text-card-foreground">
        <SubmissionsTable data={submissions} />
      </div>
    </main>
  );
}
