import "server-only";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api/base-url";
import {
  SESSION_COOKIE,
  REFRESH_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth/jwt";
import { refreshSession } from "@/lib/auth/refresh";

export { API_BASE_URL };

/** Thrown when a protected call is made without a session cookie present. */
export class UnauthenticatedError extends Error {
  constructor(message = "No session cookie") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Best-effort cookie write during a Server Action.  During Server Component
 * rendering `cookies().set()` throws, so we swallow the error — the proxy has
 * already refreshed the token before the render started, and on the next
 * navigation anywhere it runs again.
 */
async function setAuthCookies(access_token: string, refresh_token: string) {
  try {
    const c = await cookies();
    c.set(SESSION_COOKIE, access_token, AUTH_COOKIE_OPTIONS);
    c.set(REFRESH_COOKIE, refresh_token, AUTH_COOKIE_OPTIONS);
  } catch {
    /* render context — proxy handles persistence */
  }
}

async function clearAuthCookies() {
  try {
    const c = await cookies();
    c.delete(SESSION_COOKIE);
    c.delete(REFRESH_COOKIE);
  } catch {
    /* render context */
  }
}

/**
 * Server-side fetch to the backend with the session cookie's bearer token
 * attached. Use for protected endpoints (registrations list, teams, judgments,
 * results, admin/*, and `/auth/me`).
 *
 * The backend is the authority: it validates the token and returns 401/403 for
 * invalid/expired/insufficient-role. If we get a 401 we try to refresh via
 * `POST /auth/refresh` before giving up, matching the backend contract.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const doFetch = (token: string): Promise<Response> => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(url, { ...init, headers });
  };

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) throw new UnauthenticatedError();

  let res = await doFetch(token);

  if (res.status === 401) {
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      const outcome = await refreshSession(refreshToken);

      if (outcome.status === "refreshed") {
        await setAuthCookies(outcome.tokens.access_token, outcome.tokens.refresh_token);
        res = await doFetch(outcome.tokens.access_token);
      } else if (outcome.status === "rejected") {
        await clearAuthCookies();
        throw new UnauthenticatedError("Session expired");
      }
      // "unavailable" — backend unreachable for the refresh call, so the
      // original 401 stands; the caller treats it as "logged out".
    }
  }

  return res;
}
