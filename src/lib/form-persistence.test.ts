import { describe, expect, it } from "vitest";

import {
  isPersistExpired,
  REGISTRATION_PERSIST_TTL_MS,
} from "@/lib/form-persistence";

const NOW = Date.UTC(2026, 6, 30, 12, 0, 0);
const minute = 60 * 1000;

describe("isPersistExpired", () => {
  it("keeps a copy saved within the window", () => {
    expect(isPersistExpired(NOW - minute, NOW)).toBe(false);
    expect(isPersistExpired(NOW - REGISTRATION_PERSIST_TTL_MS + minute, NOW)).toBe(false);
  });

  it("expires a copy older than the window", () => {
    expect(isPersistExpired(NOW - REGISTRATION_PERSIST_TTL_MS - minute, NOW)).toBe(true);
    expect(isPersistExpired(NOW - 7 * 24 * 60 * minute, NOW)).toBe(true);
  });

  it("keeps a copy saved exactly on the boundary", () => {
    expect(isPersistExpired(NOW - REGISTRATION_PERSIST_TTL_MS, NOW)).toBe(false);
  });

  /**
   * Either an empty store or a copy written before the stamp existed. A copy of
   * unknown age is one we can't vouch for, so it goes.
   */
  it("expires a copy with no stamp", () => {
    expect(isPersistExpired(null, NOW)).toBe(true);
    expect(isPersistExpired(undefined, NOW)).toBe(true);
  });

  it("defaults to the current clock", () => {
    expect(isPersistExpired(Date.now())).toBe(false);
    expect(isPersistExpired(Date.now() - REGISTRATION_PERSIST_TTL_MS - minute)).toBe(true);
  });

  it("holds a form for a day, which is the point of the window", () => {
    expect(REGISTRATION_PERSIST_TTL_MS).toBe(24 * 60 * 60 * 1000);
  });
});
