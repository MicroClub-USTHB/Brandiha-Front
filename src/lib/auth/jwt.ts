import { decodeJwt } from "jose";

/** Name of the httpOnly cookie holding the backend-issued JWT. */
export const SESSION_COOKIE = "access_token";

/** Name of the httpOnly cookie holding the long-lived refresh token. */
export const REFRESH_COOKIE = "refresh_token";

/**
 * Cookie lifetime for both auth cookies, matching the backend's 7-day refresh
 * window. Without an explicit `maxAge` these are session cookies that the
 * browser drops on close, which would throw away the refresh token — and with
 * it the long session it exists to provide.
 *
 * The access-token cookie gets the same (much longer than its own 15-minute
 * JWT) lifetime on purpose: expiry is decided by the JWT's `exp` via
 * `isTokenFresh`, and the proxy needs to still *see* an expired token to know
 * a refresh is warranted.
 */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Shared options for both auth cookies, so the proxy and the login action agree. */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: AUTH_COOKIE_MAX_AGE,
} as const;

/** The token pair as the backend serializes it, on both login and refresh. */
export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

/**
 * Narrow an untrusted JSON body to a token pair. A 200 with an unexpected shape
 * would otherwise store the string `"undefined"` as a cookie and present it as
 * a live session, failing later and further from the cause.
 */
export function isTokenPair(value: unknown): value is TokenPair {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  return (
    typeof body.access_token === "string" &&
    body.access_token.length > 0 &&
    typeof body.refresh_token === "string" &&
    body.refresh_token.length > 0
  );
}

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

/** Narrow the token's `role` claim, which is untrusted JSON like any other. */
function isRole(value: unknown): value is Role {
  return value === "admin" || value === "super_admin" || value === "alumni";
}

/**
 * The role the backend encoded in the token, or `null` if it isn't one we know.
 *
 * Reads the claim rather than asking `/auth/me`, so callers that only need to
 * route somewhere — the login form, the proxy's `/login` bounce — don't pay for
 * a round-trip. Like `isTokenFresh` this is unverified: fine for choosing a
 * destination, never for granting access, which the backend decides on its own.
 */
export function roleFromToken(token: string): Role | null {
  try {
    const { role } = decodeJwt(token);
    return isRole(role) ? role : null;
  } catch {
    return null;
  }
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
