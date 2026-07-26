"use server";

import { apiFetch, UnauthenticatedError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/session";
import type { FetchResult } from "@/lib/api/registrations";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import type { Team } from "@/lib/api/team-types";
import type { TeamStats } from "@/lib/api/team-types";

/**
 * Server Action: fetch all teams with their members (Admin). Optionally filter
 * by team status. The bearer token is attached by `apiFetch` from the session.
 */
export async function listTeams(
  status?: RegistrationStatus,
): Promise<FetchResult<Team[]>> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const query = status ? `?status=${status}` : "";
  try {
    const res = await apiFetch(`/teams${query}`);
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to view this." };
    if (!res.ok) return { ok: false, error: "Something went wrong loading teams." };
    return { ok: true, data: (await res.json()) as Team[] };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/**
 * Server Action: fetch team statistics (Admin) via `GET /teams/stats`.
 */
export async function getTeamStats(): Promise<FetchResult<TeamStats>> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const res = await apiFetch("/teams/stats");
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to view this." };
    if (!res.ok) return { ok: false, error: "Something went loading stats." };
    return { ok: true, data: (await res.json()) as TeamStats };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/**
 * Server Action: bulk-set the status of every member of a team (Admin) via
 * `PATCH /teams/{id}`. Returns the updated team.
 */
export async function updateTeamStatus(
  id: string,
  status: RegistrationStatus,
): Promise<FetchResult<Team>> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const res = await apiFetch(`/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to do this." };
    if (res.status === 404) return { ok: false, error: "Team not found." };
    if (!res.ok) return { ok: false, error: "Something went wrong updating the team." };
    return { ok: true, data: (await res.json()) as Team };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/** Result of a mutation with no returned payload — success flag or a message. */
export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Server Action: delete an (empty) team (Admin) via `DELETE /teams/{id}`. The
 * backend only allows deleting a team with no members and rejects a non-empty
 * one with `409 Conflict`, which we surface as a user-facing error even though
 * the UI also disables the button in that case.
 */
export async function deleteTeam(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const res = await apiFetch(`/teams/${id}`, { method: "DELETE" });
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to do this." };
    if (res.status === 404) return { ok: false, error: "Team not found." };
    if (res.status === 409)
      return { ok: false, error: "Only empty teams can be deleted." };
    if (!res.ok) return { ok: false, error: "Something went wrong deleting the team." };
    return { ok: true };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}
