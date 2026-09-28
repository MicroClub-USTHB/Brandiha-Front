"use server";

import { authedAction, authedJson } from "@/lib/api/authed";
import type { ActionResult, FetchResult } from "@/lib/api/result";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import type { Team, TeamStats } from "@/lib/api/team-types";

// Every endpoint here is `get_current_admin` on the backend.

/**
 * Server Action: fetch all teams with their members (Admin). Optionally filter
 * by team status. The bearer token is attached by `backendFetch` from the session.
 */
export async function listTeams(
  status?: RegistrationStatus,
): Promise<FetchResult<Team[]>> {
  const query = status ? `?status=${status}` : "";
  return authedJson(["admin"], `/teams${query}`, {
    forbidden: "You're not authorized to view this.",
    fallback: "Something went wrong loading teams.",
  });
}

/**
 * Server Action: fetch team statistics (Admin) via `GET /teams/stats`.
 */
export async function getTeamStats(): Promise<FetchResult<TeamStats>> {
  return authedJson(["admin"], "/teams/stats", {
    forbidden: "You're not authorized to view this.",
    fallback: "Something went wrong loading stats.",
  });
}

/**
 * Server Action: bulk-set the status of every member of a team (Admin) via
 * `PATCH /teams/{id}`. Returns the updated team.
 */
export async function updateTeamStatus(
  id: string,
  status: RegistrationStatus,
): Promise<FetchResult<Team>> {
  return authedJson(
    ["admin"],
    `/teams/${id}`,
    {
      forbidden: "You're not authorized to do this.",
      byStatus: { 404: "Team not found." },
      fallback: "Something went wrong updating the team.",
    },
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

/**
 * Server Action: soft-delete a team (Admin) via `DELETE /teams/{id}`. The
 * backend allows this for a team with no registrations or with all of them
 * rejected, and answers `400 Bad Request` when one is still pending or
 * accepted — surfaced as a user-facing error even though `canDeleteTeam` also
 * disables the button in that case.
 */
export async function deleteTeam(id: string): Promise<ActionResult> {
  return authedAction(
    ["admin"],
    `/teams/${id}`,
    {
      forbidden: "You're not authorized to do this.",
      byStatus: {
        400: "This team still has pending or accepted members, so it can't be deleted.",
        404: "Team not found.",
      },
      fallback: "Something went wrong deleting the team.",
    },
    { method: "DELETE" },
  );
}
