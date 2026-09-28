import "server-only";

import { backendFetch, UnauthenticatedError } from "@/lib/api/fetch";
import type { ActionResult, FetchResult } from "@/lib/api/result";
import { requireRole, type Role } from "@/lib/auth/session";

/**
 * The shared body of every role-gated Server Action: check the role, make the
 * authed call, and turn every way it can fail into user-facing copy.
 *
 * Deliberately *not* a `"use server"` module. Everything exported from one of
 * those is a publicly callable endpoint, and these helpers take an arbitrary
 * path — exposed, they would let any signed-in caller hit any backend route
 * with their own token. Only the named actions built on them are exposed.
 */

/** The copy for each way an endpoint can fail, mirroring its documented statuses. */
export interface ErrorCopy {
  /** Shown for `401`/`403`: the backend refused this caller. */
  forbidden: string;
  /** Other statuses the endpoint documents, each with its own message. */
  byStatus?: Partial<Record<number, string>>;
  /** Any other non-OK status. */
  fallback: string;
}

const NOT_SIGNED_IN = "You're not signed in.";
const UNREACHABLE = "Couldn't reach the server.";

async function send<T>(
  roles: Role[],
  path: string,
  copy: ErrorCopy,
  init: RequestInit,
  read: (res: Response) => Promise<T>,
): Promise<FetchResult<T>> {
  const denied = await requireRole(...roles);
  if (denied) return denied;

  try {
    const res = await backendFetch(path, { ...init, auth: true });
    if (res.status === 401 || res.status === 403) return { ok: false, error: copy.forbidden };
    if (!res.ok) return { ok: false, error: copy.byStatus?.[res.status] ?? copy.fallback };
    return { ok: true, data: await read(res) };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: NOT_SIGNED_IN };
    return { ok: false, error: UNREACHABLE };
  }
}

/**
 * An authed call whose JSON body is the result. `roles` mirrors the backend
 * dependency guarding `path` — see the table on `requireRole`.
 */
export function authedJson<T>(
  roles: Role[],
  path: string,
  copy: ErrorCopy,
  init: RequestInit = {},
): Promise<FetchResult<T>> {
  return send(roles, path, copy, init, (res) => res.json() as Promise<T>);
}

/** An authed mutation whose response body, if any, the caller has no use for. */
export async function authedAction(
  roles: Role[],
  path: string,
  copy: ErrorCopy,
  init: RequestInit = {},
): Promise<ActionResult> {
  const result = await send(roles, path, copy, init, async () => undefined);
  return result.ok ? { ok: true } : result;
}
