import "server-only";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api/base-url";
import { SESSION_COOKIE, isTokenFresh } from "@/lib/auth/jwt";

export { API_BASE_URL };

/** Thrown when a protected call is made without a session cookie present. */
export class UnauthenticatedError extends Error {
  constructor(message = "No session cookie") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Server-side fetch to the backend with the session cookie's bearer token
 * attached. Use for protected endpoints (registrations list, teams, judgments,
 * results, admin/*, and `/auth/me`).
 *
 * The backend is the authority: it validates the token and returns 401/403 for
 * invalid/expired/insufficient-role. Callers should treat those as "logged out"
 * (clear cookie + redirect to /login) rather than trusting any local check.
 *
 * This does not refresh. Rotation means a refresh here would mint a token we
 * often cannot persist — Next.js forbids writing cookies during a Server
 * Component render — leaving the browser holding one the backend has already
 * deleted. The proxy owns refreshing, where cookies can actually be written,
 * and hands the fresh token down on the request. An expired token reaching this
 * point therefore means the proxy couldn't renew it, so fail as unauthenticated
 * and let the caller bounce to /login rather than spend a round-trip on a call
 * that is certain to 401.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !isTokenFresh(token)) throw new UnauthenticatedError();

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
  });
}
