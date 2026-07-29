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
