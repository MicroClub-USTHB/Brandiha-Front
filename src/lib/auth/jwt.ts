import { decodeJwt } from "jose";

/** Name of the httpOnly cookie holding the backend-issued JWT. */
export const SESSION_COOKIE = "access_token";

/**
 * Roles the backend encodes in the token, mirroring its `StaffRole` enum. These
 * are disjoint sets, not a ladder — `super_admin` is not a superset of `admin`,
 * and the backend gates registrations and teams on `admin` alone. Guard with
 * `requireRole()` by naming every role that may pass, never by seniority.
 */
export type Role = "admin" | "super_admin" | "alumni";

/**
 * Why a page-level access check failed — selects which notice renders in the
 * page's place. `unauthenticated` is "no resolvable session" (the backend
 * couldn't confirm who you are), `forbidden` is "signed in, wrong role".
 */
export type AccessDenialReason = "unauthenticated" | "forbidden";

/** Display labels for `Role`, so raw enum values never reach the UI. */
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
  alumni: "Alumni",
};

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
