import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api/base-url";
import {
  SESSION_COOKIE,
  REFRESH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  isTokenFresh,
} from "@/lib/auth/jwt";

/** Route prefixes that require an authenticated staff session. */
const PROTECTED_PREFIXES = ["/hr", "/rh"];

/** Where to send unauthenticated users, and where to bounce already-authed ones. */
const LOGIN_PATH = "/login";
const AUTHED_HOME = "/hr";

/**
 * Optimistic gate based on the session cookie. This is UX, not security — the
 * backend is the real authority. Here we also handle silent token refresh using
 * the refresh token to keep the UX seamless and ensure Server Components receive
 * a fresh access token without crashing.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let hasSession = token ? isTokenFresh(token) : false;
  let refreshed: { access_token: string; refresh_token: string } | null = null;
  let clearCookies = false;

  // Try to refresh if the access token is dead but we have a refresh token.
  if (!hasSession && refreshToken) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const tokens = await res.json();
        refreshed = tokens;
        hasSession = true;

        // Downstream Server Components read cookies off the request, so mutate
        // it too — otherwise this pass still renders with the expired token.
        request.cookies.set(SESSION_COOKIE, tokens.access_token);
        request.cookies.set(REFRESH_COOKIE, tokens.refresh_token);
      } else {
        clearCookies = true;
      }
    } catch {
      // Network error, we can't refresh. Leave the cookies so a later request
      // can retry rather than ending a session that may well be valid.
    }
  } else if (!hasSession && token) {
    // Dead access token and nothing to refresh with.
    clearCookies = true;
  }

  /**
   * Apply pending cookie changes to whichever response we actually return.
   * Redirects included: the backend has already deleted the rotated token, so a
   * redirect that drops the new pair strands the browser holding one that no
   * longer exists — and the next request logs the user out for good.
   */
  const withAuthCookies = (res: NextResponse) => {
    if (refreshed) {
      res.cookies.set(SESSION_COOKIE, refreshed.access_token, AUTH_COOKIE_OPTIONS);
      res.cookies.set(REFRESH_COOKIE, refreshed.refresh_token, AUTH_COOKIE_OPTIONS);
    }
    if (clearCookies) {
      res.cookies.delete(SESSION_COOKIE);
      res.cookies.delete(REFRESH_COOKIE);
    }
    return res;
  };

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // No valid session on a protected route → login (remembering where headed).
  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return withAuthCookies(NextResponse.redirect(url));
  }

  // Valid session sitting on /login → send them into the app.
  if (pathname === LOGIN_PATH && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = AUTHED_HOME;
    url.search = "";
    return withAuthCookies(NextResponse.redirect(url));
  }

  return withAuthCookies(NextResponse.next({ request }));
}

export const config = {
  matcher: ["/login", "/hr/:path*", "/rh"],
};
