"use client";

import { Download } from "lucide-react";
import type { ChallengeSubmission } from "@/lib/api/challenge-types";
import { datedCsvFilename, downloadCsv, toCsv, type CsvColumns } from "@/lib/csv";
import { cn } from "@/lib/utils";

/**
 * CSV columns: [header, accessor]. Order defines the column order in the file.
 *
 * `team_code` is available on the row but deliberately left out: it is the
 * credential that authorises a submission, and this page never surfaces it.
 * `submitted_at` goes out as the raw ISO string — same as the HR export does
 * with `created_at`, and the form spreadsheets sort correctly on.
 */
const COLUMNS: CsvColumns<ChallengeSubmission> = [
  ["Team", (s) => s.team_name],
  ["Link", (s) => s.link],
  ["Submitted At", (s) => s.submitted_at],
];

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "challenge"
  );
}

/**
 * Exports the submissions the page already loaded. Unlike the HR export there
 * is no refetch: `GET /challenges/{id}` returns every submission in one go, so
 * the rows are already in hand and a second call could only produce a file that
 * disagrees with the table on screen.
 */
export function ExportCsvButton({
  submissions,
  challengeTitle,
}: {
  submissions: ChallengeSubmission[];
  challengeTitle: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        downloadCsv(
          toCsv(submissions, COLUMNS),
          datedCsvFilename(`submissions-${slugify(challengeTitle)}`),
        )
      }
      disabled={submissions.length === 0}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      <Download className={cn("size-4")} />
      Export to CSV
    </button>
  );
}
