import "server-only";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api/client";
import { SESSION_COOKIE, type MeResponse, type Session } from "@/lib/auth/jwt";

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

/**
 * Guard for admin server actions: resolve the session (which `getSession` gates
 * to admins via `/auth/me`) before touching the backend. Server actions are
 * publicly callable endpoints, so each one re-checks rather than trusting the
 * page. Returns an error result to short-circuit, or `null` when authorized.
 */
export async function requireAdmin(): Promise<{ ok: false; error: string } | null> {
  const session = await getSession();
  if (!session) return { ok: false, error: "You're not authorized to view this." };
  return null;
}
