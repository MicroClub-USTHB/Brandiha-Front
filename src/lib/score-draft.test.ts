import { describe, expect, it } from "vitest";

import { draftToScore, scoreToDraft } from "@/lib/score-draft";

describe("scoreToDraft", () => {
  it("shows an unscored submission as an empty box", () => {
    expect(scoreToDraft(null)).toBe("");
  });

  it("shows a score as its number, including zero", () => {
    expect(scoreToDraft(85)).toBe("85");
    expect(scoreToDraft(0)).toBe("0");
  });
});

describe("draftToScore", () => {
  it("reads an empty box as no change, never as zero", () => {
    expect(draftToScore("", null)).toBeNull();
    expect(draftToScore("   ", null)).toBeNull();
    expect(draftToScore("", 40)).toBe(40);
  });

  it("reads a number of 0 or more as the score", () => {
    expect(draftToScore("0", null)).toBe(0);
    expect(draftToScore("72.5", 10)).toBe(72.5);
  });

  it("keeps the previous score for anything else", () => {
    expect(draftToScore("-3", 12)).toBe(12);
    expect(draftToScore("abc", null)).toBeNull();
  });

  it("round-trips every score unchanged", () => {
    for (const score of [null, 0, 85]) {
      expect(draftToScore(scoreToDraft(score), score)).toBe(score);
    }
  });
});
