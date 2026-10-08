"use server";

import { RegistrationFormData } from "@/lib/validators/registration-schema";
import { authedJson, type ErrorCopy } from "@/lib/api/authed";
import { backendFetch } from "@/lib/api/fetch";
import { splitList } from "@/lib/list-field";
import type { ActionResult, FetchResult } from "@/lib/api/result";
import type {
  AvailabilityAnswer,
  Department,
  PaginatedRegistrations,
  RegistrationDetail,
  RegistrationStatus,
  TShirtSize,
} from "@/lib/api/registration-types";

/** Body accepted by `POST /registrations` on the backend. */
interface RegistrationPayload {
  full_name: string;
  email: string;
  phone_number: string;
  discord_id: string;
  team_name: string;
  department: Department;
  knowledge_about_brandiha: string;
  participated_before: boolean;
  previous_competitions: string | null;
  skills: string;
  tools: string[];
  portfolio_url: string | null;
  other_links: string[];
  motivation: string;
  food_allergies: string | null;
  available_during_event: AvailabilityAnswer;
  availability_note: string | null;
  okay_with_photos: boolean;
  t_shirt_size: TShirtSize;
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
    department: data.Role.toLowerCase() as Department,
    knowledge_about_brandiha: data.Knowledge.trim(),
    participated_before: data.HackathonExperience,
    previous_competitions: nullable(data.PreviousHackathons),
    skills: data.Skills.trim(),
    tools: splitList(data.Tools),
    portfolio_url: nullable(data.Portfolio),
    other_links: splitList(data.Links),
    motivation: data.Motivation.trim(),
    food_allergies: nullable(data.FoodAllergies),
    available_during_event: data.Availability.toLowerCase() as AvailabilityAnswer,
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
): Promise<ActionResult> {
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

/**
 * Copy for the admin endpoints below, all `get_current_admin` on the backend.
 * One set for all three: they fail the same ways, and none of them documents a
 * status of its own.
 */
const ADMIN_COPY: ErrorCopy = {
  forbidden: "You're not authorized to view this.",
  byStatus: { 404: "Not found." },
  fallback: "Something went wrong loading the data.",
};

/**
 * Server Action: fetch every registration's full details (Admin), following the
 * pagination on `GET /registrations` to the end. Used to export all rows at once;
 * the export narrows them to the board's filter itself, for the same reason
 * `listTeams` takes no status.
 */
export async function listAllRegistrations(): Promise<FetchResult<RegistrationDetail[]>> {
  const limit = 100;
  const all: RegistrationDetail[] = [];

  // Each page re-checks the role, but `getSession` is request-cached, so that
  // is one `/auth/me` round-trip for the whole walk.
  for (let page = 1, pages = 1; page <= pages; page++) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });

    const result = await authedJson<PaginatedRegistrations>(
      ["admin"],
      `/registrations?${query}`,
      ADMIN_COPY,
    );
    if (!result.ok) return result;

    all.push(...result.data.data);
    pages = result.data.pages;
  }

  return { ok: true, data: all };
}

/** Server Action: fetch a single registration's full details (Admin). */
export async function getRegistration(
  id: string,
): Promise<FetchResult<RegistrationDetail>> {
  return authedJson(["admin"], `/registrations/${id}`, ADMIN_COPY);
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
  return authedJson(["admin"], `/registrations/${id}`, ADMIN_COPY, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
