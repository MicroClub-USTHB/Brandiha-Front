"use client";

import { useState } from "react";
import { ExportButton } from "@/components/export-button";
import { listAllRegistrations } from "@/lib/api/registrations";
import type { RegistrationDetail } from "@/lib/api/registration-types";
import { datedCsvFilename, downloadCsv, toCsv, type CsvColumns } from "@/lib/csv";

/**
 * CSV columns: [header, accessor]. Order defines the column order in the file.
 *
 * `Team Code` is here on purpose, and deliberately differs from the submissions
 * export, which leaves the same field out. This is the admin roster the codes
 * are handed out *from* — an organiser needs each team's code to give it to
 * them, and going back to the API row-by-row for that is not a workflow. The
 * submissions page only reviews what was already submitted, so it has no reason
 * to surface the credential at all.
 *
 * So: the asymmetry is the decision, not an oversight. Treat an export of this
 * file as carrying live credentials — it authorises challenge submissions on
 * behalf of every team in it.
 */
const COLUMNS: CsvColumns<RegistrationDetail> = [
  ["Full Name", (r) => r.user_full_name],
  ["Email", (r) => r.user_email],
  ["Phone", (r) => r.phone_number],
  ["Discord ID", (r) => r.discord_id],
  ["Team Name", (r) => r.team_name],
  ["Team Code", (r) => r.team_secret_code],
  ["Department", (r) => r.department],
  ["Status", (r) => r.status],
  ["Participated Before", (r) => (r.participated_before ? "yes" : "no")],
  ["Previous Competitions", (r) => r.previous_competitions],
  ["Skills", (r) => r.skills],
  ["Tools", (r) => r.tools.join("; ")],
  ["Portfolio", (r) => r.portfolio_url],
  ["Other Links", (r) => r.other_links.join("; ")],
  ["Motivation", (r) => r.motivation],
  ["Knowledge About Brandiha", (r) => r.knowledge_about_brandiha],
  ["Food Allergies", (r) => r.food_allergies],
  ["Available During Event", (r) => r.available_during_event],
  ["Availability Note", (r) => r.availability_note],
  ["Okay With Photos", (r) => (r.okay_with_photos ? "yes" : "no")],
  ["T-Shirt Size", (r) => r.t_shirt_size],
  ["Additional Notes", (r) => r.additional_notes],
  ["Registered At", (r) => r.created_at],
];

export function ExportCsvButton({
  disabled,
  teamIds,
}: {
  disabled?: boolean;
  /**
   * Export only the members of these teams — the ones the board's filter is
   * showing. Filtered here rather than by the endpoint's `status` query, which
   * matches the backend's per-team status instead of the majority the board
   * filters on. Omit to export everyone.
   */
  teamIds?: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportCsv = async () => {
    setLoading(true);
    setError(null);
    const result = await listAllRegistrations();
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const keep = teamIds && new Set(teamIds);
    const rows = keep ? result.data.filter((r) => keep.has(r.team_id)) : result.data;
    downloadCsv(toCsv(rows, COLUMNS), datedCsvFilename("registrations"));
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <ExportButton onClick={exportCsv} disabled={disabled} loading={loading} />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
