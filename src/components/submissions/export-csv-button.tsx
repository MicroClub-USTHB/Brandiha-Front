"use client";

import { Download } from "lucide-react";
import type { ChallengeSubmission } from "@/lib/api/challenge-types";
import { cn } from "@/lib/utils";

/**
 * CSV columns: [header, accessor]. Order defines the column order in the file.
 *
 * `team_code` is available on the row but deliberately left out: it is the
 * credential that authorises a submission, and this page never surfaces it.
 * `submitted_at` goes out as the raw ISO string — same as the HR export does
 * with `created_at`, and the form spreadsheets sort correctly on.
 */
const COLUMNS: [string, (s: ChallengeSubmission) => string | null | undefined][] = [
  ["Team", (s) => s.team_name],
  ["Link", (s) => s.link],
  ["Submitted At", (s) => s.submitted_at],
];

/** Quote a value per RFC 4180 — wrap in quotes and double any embedded quotes. */
function csvCell(value: string | null | undefined): string {
  const text = value ?? "";
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(submissions: ChallengeSubmission[]): string {
  const header = COLUMNS.map(([label]) => csvCell(label)).join(",");
  const rows = submissions.map((s) =>
    COLUMNS.map(([, accessor]) => csvCell(accessor(s))).join(","),
  );
  // Prepend a BOM so Excel opens UTF-8 (accents in team names) correctly.
  return "﻿" + [header, ...rows].join("\r\n");
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "challenge"
  );
}

function download(csv: string, challengeTitle: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `submissions-${slugify(challengeTitle)}-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
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
      onClick={() => download(toCsv(submissions), challengeTitle)}
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
