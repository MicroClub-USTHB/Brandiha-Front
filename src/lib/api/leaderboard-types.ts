/**
 * Response shapes for the leaderboard endpoints, mirroring the backend
 * payloads. Kept free of server-only code so client components can import
 * these types too.
 */

/** One row of the public `GET /leaderboard`: name and total only. */
export type PublicLeaderboardEntry = {
  team_name: string;
  total_score: number;
};

/**
 * One challenge's score within an `AdminLeaderboardEntry`. `submission_id` is
 * null when the team never submitted, and `score` is null until a submission
 * is scored.
 */
export type ChallengeScore = {
  challenge_id: number;
  challenge_title: string;
  score: number | null;
  submission_id: string | null;
};

/** One row of `GET /admin/leaderboard`, with the per-challenge breakdown. */
export type AdminLeaderboardEntry = {
  team_id: string;
  team_name: string;
  per_challenge: ChallengeScore[];
  total_score: number;
};

export type PublicLeaderboardResponse = {
  frozen: boolean;
  frozen_at: string | null;
  leaderboard: PublicLeaderboardEntry[];
};

export type AdminLeaderboardResponse = {
  frozen: boolean;
  frozen_at: string | null;
  leaderboard: AdminLeaderboardEntry[];
};

/** One entry of the body `PATCH /admin/challenge-submissions` accepts. */
export type ScoreUpdate = {
  submission_id: string;
  score: number;
};
