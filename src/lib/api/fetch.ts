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

/**
 * The one way this app talks to the backend.
 *
 * Every call — public or authed, read or mutation — goes through
 * `backendFetch`, so URL building, JSON content type, the request timeout, and
 * the bearer-token refresh dance are decided once instead of drifting across a
 * dozen server actions. `auth: true` is the only switch.
 *
 * The single exception is `lib/auth/refresh.ts`, which calls `fetch` directly:
 * it runs inside the proxy (a separate middleware bundle that cannot import
 * `server-only` code or read `next/headers`), and routing it through here would
 * recurse, since this is what asks it to refresh.
 */

/** Thrown when an authed call is made without a session cookie present. */
export class UnauthenticatedError extends Error {
  constructor(message = "No session cookie") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Ceiling on a single backend call. Every caller gets one by default: a hung
 * backend used to hang a registration submit or a login indefinitely, because
 * only the calls that opted in (logout, refresh) were bounded.
 */
export const DEFAULT_TIMEOUT_MS = 10_000;

export interface BackendFetchInit extends RequestInit {
  /**
   * Attach the session's bearer token, and on a 401 refresh the pair once and
   * retry. Throws `UnauthenticatedError` when there is no session cookie to
   * send, or when the backend rejects the refresh token outright.
   */
  auth?: boolean;
  /** Override `DEFAULT_TIMEOUT_MS` for a call that legitimately runs longer. */
  timeoutMs?: number;
}

/**
 * Best-effort cookie write during a Server Action. During Server Component
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

export async function backendFetch(
  path: string,
  { auth = false, timeoutMs = DEFAULT_TIMEOUT_MS, ...init }: BackendFetchInit = {},
): Promise<Response> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  /**
   * One attempt at the request. The timeout signal is built here rather than
   * once per call on purpose: it starts counting the moment it exists, so a
   * signal shared with the retry below would abort that retry with only
   * whatever time the first attempt left over.
   */
  const attempt = (token?: string): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const timeout = AbortSignal.timeout(timeoutMs);

    return fetch(url, {
      ...init,
      headers,
      // Honour a caller's own signal without losing the timeout.
      signal: init.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
    });
  };

  if (!auth) return attempt();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) throw new UnauthenticatedError();

  const res = await attempt(token);
  if (res.status !== 401) return res;

  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return res;

  const outcome = await refreshSession(refreshToken);

  if (outcome.status === "refreshed") {
    await setAuthCookies(outcome.tokens.access_token, outcome.tokens.refresh_token);
    return attempt(outcome.tokens.access_token);
  }

  if (outcome.status === "rejected") {
    await clearAuthCookies();
    throw new UnauthenticatedError("Session expired");
  }

  // "unavailable" — backend unreachable for the refresh call, so the original
  // 401 stands; the caller treats it as "logged out".
  return res;
}
