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
 * `leaderboard_frozen_at` is absent: the public list strips it, and only the
 * staff-only detail endpoint exposes it — see `ChallengeWithFreeze`.
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

/**
 * A challenge as the *public* list hands it out, with `title` withheld while
 * the challenge is upcoming.
 *
 * The title hints at the brief, so it is redacted at the fetch rather than
 * masked in the UI: a component that renders a placeholder still receives the
 * real one as a prop, and props are readable in the page source. Null here
 * means the server declined to say — the only way it can't be read early.
 */
export interface PublicChallenge extends Omit<Challenge, "title"> {
  title: string | null;
}

/** Where the current moment sits relative to a challenge's submission window. */
export type ChallengeWindow = "upcoming" | "open" | "closed";

/**
 * A challenge together with its resolved submission window. The window is
 * derived server-side at fetch time rather than in the page: it depends on the
 * clock, and reading the clock during render is impure.
 */
export interface ChallengeStatus {
  challenge: PublicChallenge;
  window: ChallengeWindow;
}

/**
 * The challenge as returned by the staff-only `GET /challenges/{id}`, which
 * (unlike the public list) exposes the leaderboard freeze timestamp.
 */
export interface ChallengeWithFreeze extends Challenge {
  leaderboard_frozen_at: string | null;
}

/**
 * One row of the `submissions` array on `GET /challenges/{id}`.
 *
 * Note `team_code` is the same secret that authorises a submission, and the
 * backend deliberately withholds it from `GET /teams`. It arrives here, so
 * don't render it — the table shows team, link and timestamp only.
 */
export interface ChallengeSubmission {
  team_name: string;
  team_code: string;
  link: string;
  submitted_at: string;
}

/** Response shape of `GET /challenges/{id}` (staff). */
export interface ChallengeDetail {
  challenge: ChallengeWithFreeze;
  submissions: ChallengeSubmission[];
}
