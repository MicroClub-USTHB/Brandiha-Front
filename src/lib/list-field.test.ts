import { describe, expect, it } from "vitest";

import { splitList } from "@/lib/list-field";

describe("splitList", () => {
  it("splits on commas and newlines alike", () => {
    expect(splitList("Figma, Photoshop\nNotion")).toEqual([
      "Figma",
      "Photoshop",
      "Notion",
    ]);
  });

  it("trims each entry", () => {
    expect(splitList("  Figma ,   Notion  ")).toEqual(["Figma", "Notion"]);
  });

  it("collapses runs of separators instead of yielding blanks", () => {
    expect(splitList("a,,b")).toEqual(["a", "b"]);
    expect(splitList("a,\n,b")).toEqual(["a", "b"]);
    expect(splitList(",a,")).toEqual(["a"]);
  });

  it("returns an empty list for nothing", () => {
    expect(splitList("")).toEqual([]);
    expect(splitList("   ")).toEqual([]);
    expect(splitList(undefined)).toEqual([]);
    expect(splitList(null)).toEqual([]);
  });

  it("keeps a single entry as a one-item list", () => {
    expect(splitList("https://example.com")).toEqual(["https://example.com"]);
  });
});
