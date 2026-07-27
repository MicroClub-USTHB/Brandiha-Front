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
