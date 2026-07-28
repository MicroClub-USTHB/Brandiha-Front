import Link from "next/link";
import { notFound } from "next/navigation";
import { checkAccess } from "@/lib/auth/session";
import { getChallengeDetail } from "@/lib/api/challenges";
import { AccessNotice } from "@/components/auth/access-notice";
import { SubmissionsTable } from "@/components/submissions/submissions-table";
import { ExportCsvButton } from "@/components/submissions/export-csv-button";

type Props = {
  params: Promise<{ "challenge-id": string }>;
};

/** Challenge ids are SERIAL integers on the backend, not uuids. */
function parseChallengeId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

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
  if (!result.ok) {
    return (
      <main className="mx-auto max-w-4xl p-6 font-sans">
        <p className="text-destructive">{result.error}</p>
        <Link
          href="/hr"
          className="mt-4 inline-block text-sm text-primary underline underline-offset-2"
        >
          &larr; Back to HR
        </Link>
      </main>
    );
  }

  const { challenge, submissions } = result.data;

  return (
    <main className="mx-auto max-w-4xl p-6 font-sans">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
            {challenge.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {challenge.department} &middot;{" "}
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
