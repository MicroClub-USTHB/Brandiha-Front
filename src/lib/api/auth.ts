"use server";

import { cookies } from "next/headers";
import { LoginFormData } from "@/lib/validators/login-schema";
import { backendFetch } from "@/lib/api/fetch";
import {
  SESSION_COOKIE,
  REFRESH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  isTokenPair,
  roleFromToken,
  type Role,
} from "@/lib/auth/jwt";

/**
 * Result returned to the client — errors are serialized, never thrown across
 * the boundary. The role comes back so the caller can route by it; it is the
 * token's own claim, not a grant, and the backend re-checks it on every call.
 */
export type LoginResult = { ok: true; role: Role } | { ok: false; error: string };

/**
 * Server Action: authenticate a staff member against the backend. Runs on the
 * server, so the backend URL stays private and no CORS is involved. On success
 * the JWT is stored in an httpOnly cookie for later protected requests; failures
 * map to user-facing messages.
 */
export async function loginStaff(data: LoginFormData): Promise<LoginResult> {
  let response: Response;
  try {
    response = await backendFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: data.Email.trim(), password: data.Password }),
    });
  } catch {
    return {
      ok: false,
      error: "Couldn't reach the server. Please try again in a moment.",
    };
  }

  if (response.status === 401 || response.status === 403) {
    return { ok: false, error: "Incorrect email or password." };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: "Something went wrong on our side. Please try again in a moment.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      error: "Something went wrong on our side. Please try again in a moment.",
    };
  }

  // A 200 missing either token would otherwise be stored as a cookie reading
  // "undefined" and pass for a live session until the first protected call.
  if (!isTokenPair(body)) {
    return {
      ok: false,
      error: "Something went wrong on our side. Please try again in a moment.",
    };
  }

  // Checked before the cookies are written, for the same reason as the shape
  // above: a token whose role we can't read is a session with nowhere to land,
  // and storing it would leave the user signed in on a page that rejects them.
  const role = roleFromToken(body.access_token);
  if (role === null) {
    return {
      ok: false,
      error: "Something went wrong on our side. Please try again in a moment.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, body.access_token, AUTH_COOKIE_OPTIONS);
  cookieStore.set(REFRESH_COOKIE, body.refresh_token, AUTH_COOKIE_OPTIONS);

  return { ok: true, role };
}

/** Server Action: clear the session cookies and notify backend, logging the user out. */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(SESSION_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      // Not `auth: true`: that would refresh an expired token purely to spend
      // it on the call that ends the session, and throw when there is nothing
      // to refresh — where here a missing token is simply nothing to revoke.
      await backendFetch("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ refresh_token: refreshToken }),
        timeoutMs: 5_000,
      });
    } catch {
      // Ignore network errors on logout, proceed to clear local cookies
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
