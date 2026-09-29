import { describe, expect, it } from "vitest";

import { parseChallengeId } from "@/lib/challenge-id";

describe("parseChallengeId", () => {
  it("reads a positive integer", () => {
    expect(parseChallengeId("1")).toBe(1);
    expect(parseChallengeId("42")).toBe(42);
  });

  it("rejects anything that isn't plain digits", () => {
    for (const raw of ["", "abc", "1a", "-1", "1.5", " 1", "1e3", "0x10"]) {
      expect(parseChallengeId(raw), raw).toBeNull();
    }
  });

  it("rejects zero, which no SERIAL id takes", () => {
    expect(parseChallengeId("0")).toBeNull();
  });

  it("rejects an id past the safe integer range", () => {
    expect(parseChallengeId("9007199254740993")).toBeNull();
  });
});
