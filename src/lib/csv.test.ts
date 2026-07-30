import { describe, expect, it } from "vitest";

import { datedCsvFilename, toCsv, type CsvColumns } from "@/lib/csv";

type Row = { name: string; note: string | null };

const COLUMNS: CsvColumns<Row> = [
  ["Name", (r) => r.name],
  ["Note", (r) => r.note],
];

const BOM = "﻿";

/** The rows of a rendered file, without the BOM, split on the CRLF line ending. */
function lines(csv: string): string[] {
  expect(csv.startsWith(BOM)).toBe(true);
  return csv.slice(BOM.length).split("\r\n");
}

describe("toCsv", () => {
  it("writes a header row from the column labels", () => {
    expect(lines(toCsv([], COLUMNS))).toEqual(['"Name","Note"']);
  });

  it("quotes every cell and renders null as empty", () => {
    expect(lines(toCsv([{ name: "Ada", note: null }], COLUMNS))[1]).toBe('"Ada",""');
  });

  it("escapes embedded quotes by doubling them, per RFC 4180", () => {
    const [, row] = lines(toCsv([{ name: 'He said "hi"', note: null }], COLUMNS));
    expect(row).toBe('"He said ""hi""",""');
  });

  it("keeps a comma or newline inside its quoted cell", () => {
    const csv = toCsv([{ name: "Doe, Jane", note: "line one\nline two" }], COLUMNS);
    // Two data lines, because the embedded newline is inside the quotes — the
    // header plus the row's own two physical lines.
    expect(csv).toContain('"Doe, Jane"');
    expect(csv).toContain('"line one\nline two"');
  });

  it("leads with a BOM so Excel reads the file as UTF-8", () => {
    expect(toCsv([{ name: "Amélie", note: null }], COLUMNS)).toContain("Amélie");
    expect(toCsv([], COLUMNS).startsWith(BOM)).toBe(true);
  });

  describe("formula injection", () => {
    /**
     * Quoting alone does not protect a spreadsheet: it strips the quotes and
     * then evaluates what was inside. Each of these must come out inert.
     */
    it.each([
      ['=HYPERLINK("http://attacker","click")', "="],
      ["+1+1", "+"],
      ["-1+1", "-"],
      ["@SUM(A1:A9)", "@"],
      ["\t=1+1", "tab"],
      ["\r=1+1", "carriage return"],
    ])("neutralizes a cell starting with %s (%s)", (payload) => {
      const [, row] = lines(toCsv([{ name: payload, note: null }], COLUMNS));
      // The `'` lands inside the quotes, ahead of the payload's first character.
      expect(row.startsWith(`"'${payload[0]}`)).toBe(true);
    });

    it("guards and escapes together, so a quoted payload stays inert", () => {
      const payload = '=HYPERLINK("http://attacker","click")';
      const [, row] = lines(toCsv([{ name: payload, note: null }], COLUMNS));
      expect(row).toBe('"\'=HYPERLINK(""http://attacker"",""click"")",""');
    });

    it("leaves an ordinary value untouched", () => {
      const [, row] = lines(toCsv([{ name: "Ada Lovelace", note: null }], COLUMNS));
      expect(row).toBe('"Ada Lovelace",""');
      expect(row).not.toContain("'");
    });

    it("only guards the first character, not one appearing later", () => {
      const [, row] = lines(toCsv([{ name: "2+2", note: null }], COLUMNS));
      expect(row).toBe('"2+2",""');
    });
  });
});

describe("datedCsvFilename", () => {
  it("stamps the base name with today's date", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(datedCsvFilename("registrations")).toBe(`registrations-${today}.csv`);
  });
});
