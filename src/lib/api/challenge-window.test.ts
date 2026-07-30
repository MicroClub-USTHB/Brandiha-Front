import { describe, expect, it } from "vitest";

import { resolveWindow, toTime } from "@/lib/api/challenge-window";

const NOW = Date.UTC(2026, 6, 30, 12, 0, 0);
const hour = 60 * 60 * 1000;

describe("toTime", () => {
  it("parses an ISO string and a Date alike", () => {
    expect(toTime("2026-07-30T12:00:00.000Z")).toBe(NOW);
    expect(toTime(new Date(NOW))).toBe(NOW);
  });

  it("returns null for nothing", () => {
    expect(toTime(null)).toBeNull();
    expect(toTime(undefined)).toBeNull();
    expect(toTime("")).toBeNull();
  });

  /** The point of the helper: NaN must never reach a comparison or the UI. */
  it("returns null rather than NaN for an unparseable value", () => {
    expect(toTime("not a date")).toBeNull();
    expect(toTime("2026-13-45")).toBeNull();
  });
});

describe("resolveWindow", () => {
  it("is upcoming before the unlock time", () => {
    expect(resolveWindow(NOW, NOW + hour, null)).toBe("upcoming");
  });

  it("is open from the unlock time until the end time", () => {
    expect(resolveWindow(NOW, NOW - hour, NOW + hour)).toBe("open");
    // No end time at all means it never closes.
    expect(resolveWindow(NOW, NOW - hour, null)).toBe("open");
  });

  it("is closed once the end time has passed", () => {
    expect(resolveWindow(NOW, NOW - 2 * hour, NOW - hour)).toBe("closed");
  });

  it("opens exactly at the unlock time and closes exactly at the end time", () => {
    // Unlock is inclusive: `unlocksAt > now` is what makes it upcoming.
    expect(resolveWindow(NOW, NOW, NOW + hour)).toBe("open");
    // End is exclusive: `endsAt <= now` is what makes it closed.
    expect(resolveWindow(NOW, NOW - hour, NOW)).toBe("closed");
  });

  /**
   * Fails closed. A challenge must never be shown as open on the strength of a
   * timestamp we could not parse.
   */
  it("treats a missing unlock time as upcoming", () => {
    expect(resolveWindow(NOW, null, null)).toBe("upcoming");
    expect(resolveWindow(NOW, null, NOW + hour)).toBe("upcoming");
  });
});
