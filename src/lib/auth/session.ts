import "server-only";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api/client";
import {
  SESSION_COOKIE,
  decodeTokenStub,
  type MeResponse,
  type Session,
} from "@/lib/auth/jwt";

export { SESSION_COOKIE, type Session, type Role } from "@/lib/auth/jwt";

/**
 * Resolve the current session by asking the backend who the caller is via
 * `GET /auth/me` (the backend is the source of truth — it verifies the token's
 * signature, expiry, and role). Returns `null` when unauthenticated.
 *
 * Server-side only. Middleware uses a cheap cookie-presence check instead; the
 * authoritative check happens here (and on every protected `apiFetch`).
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

  if (res.status === 401 || res.status === 403) return null;

  // ─── TEMPORARY STUB — remove once GET /auth/me ships ──────────────────────
  // The endpoint doesn't exist yet, so it 404s. Until then, fall back to the
  // token's own claims so the app can be built end-to-end.
  if (res.status === 404) return decodeTokenStub(token);
  // ──────────────────────────────────────────────────────────────────────────

  if (!res.ok) return null;

  try {
    const me = (await res.json()) as MeResponse;
    return { judgeId: me.id, role: me.role, name: me.name, email: me.email };
  } catch {
    return null;
  }
}
