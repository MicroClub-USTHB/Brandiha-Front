import { decodeJwt } from "jose";

/** Name of the httpOnly cookie holding the backend-issued JWT. */
export const SESSION_COOKIE = "access_token";

/** Roles the backend encodes. Only `admin` may call protected endpoints. */
export type Role = "admin" | "alumni";

/** The current authenticated user, as resolved by `getSession()` via `/auth/me`. */
export interface Session {
  staffId: string;
  role: Role;
  name: string;
  email: string;
}

/** Response shape of `GET /auth/me` (the backend's `StaffPublic`). */
export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * Cheap client-side freshness check: token is well-formed and not expired.
 * No signature verification (the backend is the authority) — used by the proxy
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
