"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { listAllRegistrations } from "@/lib/api/registrations";
import type { RegistrationDetail, RegistrationStatus } from "@/lib/api/registration-types";

/** CSV columns: [header, accessor]. Order defines the column order in the file. */
const COLUMNS: [string, (r: RegistrationDetail) => string | null | undefined][] = [
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

/** Quote a value per RFC 4180 — wrap in quotes and double any embedded quotes. */
function csvCell(value: string | null | undefined): string {
  const text = value ?? "";
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(registrations: RegistrationDetail[]): string {
  const header = COLUMNS.map(([label]) => csvCell(label)).join(",");
  const rows = registrations.map((r) =>
    COLUMNS.map(([, accessor]) => csvCell(accessor(r))).join(","),
  );
  // Prepend a BOM so Excel opens UTF-8 (accents in names) correctly.
  return "﻿" + [header, ...rows].join("\r\n");
}

function download(csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportCsvButton({
  disabled,
  filter,
}: {
  disabled?: boolean;
  filter?: RegistrationStatus | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportCsv = async () => {
    setLoading(true);
    setError(null);
    const result = await listAllRegistrations(filter ?? undefined);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    download(toCsv(result.data));
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={exportCsv}
        disabled={disabled || loading}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Exporting…
          </>
        ) : (
          <>
            <Download className="size-4" />
            Export to CSV
          </>
        )}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
