"use server";

import { RegistrationFormData } from "@/lib/validators/registration-schema";
import { backendFetch, UnauthenticatedError } from "@/lib/api/fetch";
import { requireRole } from "@/lib/auth/session";
import { splitList } from "@/lib/list-field";
import type {
  PaginatedRegistrations,
  RegistrationDetail,
  RegistrationStatus,
} from "@/lib/api/registration-types";

/** Result returned to the client — errors are serialized, never thrown across the boundary. */
export type RegistrationResult = { ok: true } | { ok: false; error: string };

/** Body accepted by `POST /registrations` on the backend. */
interface RegistrationPayload {
  full_name: string;
  email: string;
  phone_number: string;
  discord_id: string;
  team_name: string;
  department: "marketing" | "communication" | "design" | "multimedia";
  knowledge_about_brandiha: string;
  participated_before: boolean;
  previous_competitions: string | null;
  skills: string;
  tools: string[];
  portfolio_url: string | null;
  other_links: string[];
  motivation: string;
  food_allergies: string | null;
  available_during_event: "yes" | "no" | "other";
  availability_note: string | null;
  okay_with_photos: boolean;
  t_shirt_size: "S" | "M" | "L" | "XL" | "XXL";
  additional_notes: string | null;
}

/** Empty/whitespace-only optional strings become `null` for the API. */
function nullable(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Map the multi-step form state onto the backend contract. */
function toPayload(data: RegistrationFormData): RegistrationPayload {
  return {
    full_name: data.FullName.trim(),
    email: data.Email.trim(),
    phone_number: data.Phone.trim(),
    discord_id: data.DiscordId.trim(),
    team_name: data.TeamName.trim(),
    // "Your Role" is the department track (lowercased to match the backend enum).
    department: data.Role.toLowerCase() as RegistrationPayload["department"],
    knowledge_about_brandiha: data.Knowledge.trim(),
    participated_before: data.HackathonExperience,
    previous_competitions: nullable(data.PreviousHackathons),
    skills: data.Skills.trim(),
    tools: splitList(data.Tools),
    portfolio_url: nullable(data.Portfolio),
    other_links: splitList(data.Links),
    motivation: data.Motivation.trim(),
    food_allergies: nullable(data.FoodAllergies),
    available_during_event: data.Availability.toLowerCase() as
      | "yes"
      | "no"
      | "other",
    availability_note: nullable(data.AvailabilityMessage),
    okay_with_photos: data.PhotoConsent,
    t_shirt_size: data.TShirtSize,
    additional_notes: nullable(data.AdditionalInfo),
  };
}

/**
 * Server Action: submit a registration to the backend. Runs on the server, so
 * the backend URL stays private and no CORS is involved. Returns a serializable
 * result — `409` (duplicate) and `422` (validation) map to user-facing messages.
 */
export async function submitRegistration(
  data: RegistrationFormData,
): Promise<RegistrationResult> {
  let response: Response;
  try {
    response = await backendFetch("/registrations", {
      method: "POST",
      body: JSON.stringify(toPayload(data)),
    });
  } catch {
    return {
      ok: false,
      error: "Couldn't reach the server. Please try again in a moment.",
    };
  }

  if (response.ok) return { ok: true };

  if (response.status === 409) {
    return { ok: false, error: "This email or Discord ID is already registered." };
  }

  if (response.status === 422) {
    return {
      ok: false,
      error: "Some details were rejected by the server. Please review your answers.",
    };
  }

  return {
    ok: false,
    error: "Something went wrong on our side. Please try again in a moment.",
  };
}

/** Serializable result for admin reads — data on success, a message on failure. */
export type FetchResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** Turn a fetch outcome into a user-facing error result (admin reads are authed). */
function readError(status: number): string {
  if (status === 401 || status === 403) return "You're not authorized to view this.";
  if (status === 404) return "Not found.";
  return "Something went wrong loading the data.";
}

/**
 * Server Action: fetch every registration's full details (Admin), following the
 * pagination on `GET /registrations` to the end. Used to export all rows at once.
 * Optionally filter by team status.
 */
export async function listAllRegistrations(
  status?: RegistrationStatus,
): Promise<FetchResult<RegistrationDetail[]>> {
  const denied = await requireRole("admin");
  if (denied) return denied;

  const limit = 100;
  const all: RegistrationDetail[] = [];

  try {
    let page = 1;
    let pages = 1;
    do {
      const q = status
        ? `/registrations?page=${page}&limit=${limit}&status=${status}`
        : `/registrations?page=${page}&limit=${limit}`;
      const res = await backendFetch(q, { auth: true });
      if (!res.ok) return { ok: false, error: readError(res.status) };
      const body = (await res.json()) as PaginatedRegistrations;
      all.push(...body.data);
      pages = body.pages;
      page += 1;
    } while (page <= pages);

    return { ok: true, data: all };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/** Server Action: fetch a single registration's full details (Admin). */
export async function getRegistration(
  id: string,
): Promise<FetchResult<RegistrationDetail>> {
  const denied = await requireRole("admin");
  if (denied) return denied;

  try {
    const res = await backendFetch(`/registrations/${id}`, { auth: true });
    if (!res.ok) return { ok: false, error: readError(res.status) };
    return { ok: true, data: (await res.json()) as RegistrationDetail };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/** Fields accepted by `PATCH /registrations/{id}`. */
export interface RegistrationPatch {
  /** New team name — the backend joins/creates it and reassigns `team_id`. */
  team_name?: string;
  status?: RegistrationStatus;
}

/**
 * Server Action: update a registration (Admin) via `PATCH /registrations/{id}`.
 * Applies a team move and/or a status change in a single request. Returns the
 * updated registration.
 */
export async function updateRegistration(
  id: string,
  patch: RegistrationPatch,
): Promise<FetchResult<RegistrationDetail>> {
  const denied = await requireRole("admin");
  if (denied) return denied;

  try {
    const res = await backendFetch(`/registrations/${id}`, {
      auth: true,
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    if (!res.ok) return { ok: false, error: readError(res.status) };
    return { ok: true, data: (await res.json()) as RegistrationDetail };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}
