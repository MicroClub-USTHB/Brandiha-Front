import { decodeJwt } from "jose";

/** Name of the httpOnly cookie holding the backend-issued JWT. */
export const SESSION_COOKIE = "access_token";

/** Roles the backend encodes. Only `admin` may call protected endpoints. */
export type Role = "admin" | "alumni";

/** The current authenticated user, as resolved by `getSession()`. */
export interface Session {
  judgeId: string;
  role: Role;
  /** Present when resolved via `GET /auth/me`; absent in the token-only stub. */
  name?: string;
  email?: string;
}

/**
 * Assumed response shape of `GET /auth/me` (to be added by the backend team).
 * Modelled on the backend's `StaffPublic`. Adjust here once the real contract
 * lands — this is the single place the frontend encodes that assumption.
 */
export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * Cheap client-side freshness check: token is well-formed and not expired.
 * No signature verification (the backend is the authority) — used by middleware
 * to gate routes and drop obviously-stale cookies without a round-trip.
 */
export function isTokenFresh(token: string): boolean {
  try {
    const claims = decodeJwt(token);
    return typeof claims.exp !== "number" || claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * TEMPORARY STUB — remove once `GET /auth/me` exists.
 *
 * Synthesizes a session from the JWT's own claims *without verifying the
 * signature* (we don't hold the secret, and the backend is the real authority).
 * Expiry is still honoured. This exists only so the app can be built before the
 * `/auth/me` endpoint ships; it returns no name/email since those aren't in the
 * token.
 */
export function decodeTokenStub(token: string): Session | null {
  try {
    const claims = decodeJwt(token);
    if (typeof claims.exp === "number" && claims.exp * 1000 <= Date.now()) return null;

    const judgeId = claims.judge_id;
    const role = claims.role;
    if (typeof judgeId !== "string" || (role !== "admin" && role !== "alumni")) return null;

    return { judgeId, role };
  } catch {
    return null;
  }
}
