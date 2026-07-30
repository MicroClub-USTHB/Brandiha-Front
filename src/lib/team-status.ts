import type { RegistrationStatus } from "@/lib/api/registration-types";
import type { TeamMember } from "@/lib/api/team-types";

/**
 * What the HR board means by a team's status and what it may do with one.
 *
 * Extracted from `hr-board.tsx` so `TeamActions` can apply the same rules
 * without importing the board that renders it.
 */

/**
 * A team's status is the majority of its members' statuses. Ties (no clear
 * majority, including an empty team) resolve to `pending`. Replaces the
 * backend's `status`, which its own docs derive from the team's *first*
 * registration and is therefore arbitrary.
 */
export function teamStatus(members: TeamMember[]): RegistrationStatus {
  const counts: Record<RegistrationStatus, number> = {
    pending: 0,
    accepted: 0,
    rejected: 0,
  };
  for (const m of members) counts[m.status]++;

  const max = Math.max(counts.pending, counts.accepted, counts.rejected);
  const leaders = (["accepted", "rejected", "pending"] as const).filter(
    (s) => counts[s] === max,
  );
  return leaders.length === 1 ? leaders[0] : "pending";
}

/**
 * Mirrors `DELETE /teams/{id}`, which soft-deletes a team with **zero**
 * registrations or with **all** of them rejected, and answers `400` for a team
 * that still has a pending or accepted member.
 *
 * Note this is *not* `teamStatus(members) === "rejected"`. A majority is not
 * unanimity: three rejected members alongside two accepted ones reads as a
 * rejected team on the board, but the backend refuses to delete it — which is
 * how this button used to offer a delete that could only fail.
 *
 * An empty team satisfies `every` vacuously, which is the other half of the
 * contract rather than an accident.
 */
export function canDeleteTeam(members: TeamMember[]): boolean {
  return members.every((m) => m.status === "rejected");
}
