import "server-only";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api/client";
import { SESSION_COOKIE, type MeResponse, type Role, type Session } from "@/lib/auth/jwt";

export { SESSION_COOKIE, type Session, type Role } from "@/lib/auth/jwt";

/**
 * Resolve the current session by asking the backend who the caller is via
 * `GET /auth/me` (the backend verifies the token's signature, expiry, and role).
 * Returns `null` when unauthenticated. Server-side only.
 */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let res: Response;
  try {
    res = await apiFetch("/auth/me");
  } catch {
    // Network/unreachable backend — treat as no session rather than crashing.
    return null;
  }

  // 401/403 (invalid token / not admin) or 404 (user not found) → no session.
  if (!res.ok) return null;

  try {
    const me = (await res.json()) as MeResponse;
    return { staffId: me.id, role: me.role, name: me.name, email: me.email };
  } catch {
    return null;
  }
}

/** Denial returned by `requireRole`, shaped to short-circuit an action result. */
export type RoleDenial = { ok: false; error: string };

/**
 * Guard for role-gated server actions: resolve the session and require that it
 * carries one of `allowed`. Server actions are publicly callable endpoints, so
 * each one re-checks rather than trusting the page that rendered it. Returns an
 * error result to short-circuit, or `null` when authorized.
 *
 * Mirror the backend dependency guarding the endpoint you're calling — roles are
 * disjoint sets there, with no hierarchy to fall back on, so list every role
 * that may pass:
 *
 * | Backend dependency (`app/security.py`) | `requireRole(…)`              |
 * | -------------------------------------- | ----------------------------- |
 * | `get_current_admin`                    | `"admin"`                     |
 * | `get_current_staff`                    | `"admin", "super_admin"`      |
 * | `get_current_alumni`                   | `"alumni", "super_admin"`     |
 * | `get_current_alumni_only`              | `"alumni"`                    |
 * | `get_current_super_admin`              | `"super_admin"`               |
 * | `get_any_authenticated_user`           | every role                    |
 *
 * This is defence in depth and a fast, specific error message; the backend
 * re-validates the token's role on every call regardless.
 */
export async function requireRole(...allowed: Role[]): Promise<RoleDenial | null> {
  const session = await getSession();
  if (!session) return { ok: false, error: "You're not signed in." };
  if (!allowed.includes(session.role))
    return { ok: false, error: "You're not authorized to do this." };
  return null;
}
