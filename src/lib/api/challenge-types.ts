/**
 * Response shapes for the challenge endpoints, mirroring the backend payloads.
 * Kept free of server-only code so client components can import these types too.
 */

import type { Department } from "@/lib/api/registration-types";

/**
 * A challenge as returned by the public `GET /challenges` list. `id` is a
 * SERIAL integer, unlike the uuids the rest of the API uses.
 *
 * `ends_at` is nullable — the backend treats it as optional and a challenge
 * without one runs indefinitely.
 *
 * `leaderboard_frozen_at` is deliberately absent: the backend strips it from the
 * public list and only exposes it on the staff-only detail endpoint.
 */
export interface Challenge {
  id: number;
  title: string;
  unlocks_at: string;
  ends_at: string | null;
  department: Department;
  created_at: string;
  updated_at: string;
}

/** Where the current moment sits relative to a challenge's submission window. */
export type ChallengeWindow = "upcoming" | "open" | "closed";

/**
 * A challenge together with its resolved submission window. The window is
 * derived server-side at fetch time rather than in the page: it depends on the
 * clock, and reading the clock during render is impure.
 */
export interface ChallengeStatus {
  challenge: Challenge;
  window: ChallengeWindow;
}
