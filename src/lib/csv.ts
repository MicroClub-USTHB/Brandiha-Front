/**
 * Shared CSV export helpers. Both the HR registrations export and the
 * per-challenge submissions export write files that get opened in Excel, so the
 * quoting and encoding rules live here once rather than drifting apart in each
 * component.
 */

/**
 * Column definitions for one export: `[header, accessor]`. Array order defines
 * the column order in the file.
 */
export type CsvColumns<T> = [string, (row: T) => string | null | undefined][];

/**
 * Characters that make a spreadsheet read a cell as a formula rather than text.
 * `=` and `+` are the obvious ones; `-` starts a negation, `@` is Excel's
 * legacy function-call sigil, and a leading tab or carriage return can carry a
 * formula past a filter that only checks the first four (OWASP lists all six).
 */
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

/**
 * Quote a value per RFC 4180 — wrap in quotes and double any embedded quotes —
 * and defuse anything a spreadsheet would evaluate.
 *
 * Every field in these exports is free text an untrusted public registrant
 * typed, and it lands in an admin's Excel. `=HYPERLINK(...)` in a Motivation
 * box is a live formula on open, so a leading formula character gets a `'`
 * ahead of it: Excel and LibreOffice both read that as "the rest is text" and
 * hide the quote, while a plain reader (or `git diff`) still shows the value.
 *
 * Note that RFC 4180 quoting alone does *not* prevent this — a spreadsheet
 * strips the surrounding quotes and then evaluates what's inside.
 */
function csvCell(value: string | null | undefined): string {
  const text = value ?? "";
  const safe = FORMULA_PREFIX.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/**
 * Render `rows` as RFC 4180 CSV. The leading U+FEFF byte-order mark is what
 * makes Excel read the file as UTF-8 — without it, accented names arrive
 * mojibaked.
 */
export function toCsv<T>(rows: T[], columns: CsvColumns<T>): string {
  const header = columns.map(([label]) => csvCell(label)).join(",");
  const body = rows.map((row) =>
    columns.map(([, accessor]) => csvCell(accessor(row))).join(","),
  );
  return "﻿" + [header, ...body].join("\r\n");
}

/** `"registrations"` → `"registrations-2026-07-28.csv"`. */
export function datedCsvFilename(base: string): string {
  return `${base}-${new Date().toISOString().slice(0, 10)}.csv`;
}

/** Trigger a browser download of `csv` under `filename`. Client-side only. */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
