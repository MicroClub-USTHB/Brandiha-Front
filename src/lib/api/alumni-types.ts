import type { Team } from "@/lib/api/team-types";

/**
 * Response shape of `GET /alumni/voting`.
 *
 * `teams` is every currently-accepted team either way — the alumni ranks all of
 * them or none. The order carries the meaning: unspecified while `has_voted` is
 * false, and the alumni's own ranking (1st preference first) once it's true.
 */
export interface VotingStatus {
  has_voted: boolean;
  teams: Team[];
}

/**
 * One row of `GET /alumni/leaderboard`.
 *
 * `borda_score` is the sum of `(N - rank + 1)` across every alumni's ballot, so
 * it is a count of preference points and has nothing to do with the challenge
 * scores on `/admin/leaderboard` — the two boards are never comparable.
 */
export interface AlumniLeaderboardEntry {
  team_name: string;
  borda_score: number;
}

/**
 * One alumni's ballot from `GET /alumni/votes`, the audit view behind the Borda
 * board. `ranked_teams` is team names in rank order, 1st preference first.
 */
export interface AlumniVote {
  alumni_name: string;
  alumni_email: string;
  ranked_teams: string[];
}
