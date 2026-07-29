import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  REFRESH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  isTokenFresh,
  roleFromToken,
  type TokenPair,
} from "@/lib/auth/jwt";
import { HOME_BY_ROLE } from "@/lib/auth/home";
import { refreshSession } from "@/lib/auth/refresh";

/** Route prefixes that require an authenticated staff session. */
const PROTECTED_PREFIXES = ["/hr", "/submissions"];

/** Where to send unauthenticated users. */
const LOGIN_PATH = "/login";

/**
 * Where an already-authed visitor to `/login` goes when the token's role can't
 * be read — which `isTokenFresh` has effectively ruled out by decoding it
 * already. Present so the bounce always has somewhere to land.
 */
const AUTHED_HOME = "/hr";

/**
 * Optimistic gate based on the session cookie. This is UX, not security — the
 * backend is the real authority and validates the token on every protected call
 * (and in `getSession`). We do a cheap local expiry check so an expired cookie
 * is treated as logged-out rather than looping between the page's `getSession()`
 * redirect and this proxy's "already-authed" bounce.
 *
 * Silent refresh lives here rather than in a Server Component because only
 * middleware can write cookies during a navigation. Refreshed tokens are
 * applied to the request (so Server Components downstream see them on this very
 * pass) and to whatever response we return.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let hasSession = token ? isTokenFresh(token) : false;
  let refreshed: TokenPair | null = null;
  let clearCookies = false;

  if (!hasSession && refreshToken) {
    const outcome = await refreshSession(refreshToken);

    if (outcome.status === "refreshed") {
      refreshed = outcome.tokens;
      hasSession = true;
      // Downstream Server Components read cookies off the request, so mutate it
      // too — otherwise this pass still renders with the expired token.
      request.cookies.set(SESSION_COOKIE, refreshed.access_token);
      request.cookies.set(REFRESH_COOKIE, refreshed.refresh_token);
    } else if (outcome.status === "rejected") {
      clearCookies = true;
    }
    // "unavailable" → the backend is unreachable, not the session invalid. Leave
    // the cookies in place so the next request can retry the refresh.
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

  // Valid session sitting on /login → send them into the app, at the home for
  // their role. Read off the refreshed token when there is one: the original
  // cookie is spent by then, and its role claim is the stale copy.
  if (pathname === LOGIN_PATH && hasSession) {
    const activeToken = refreshed?.access_token ?? token;
    const role = activeToken ? roleFromToken(activeToken) : null;

    const url = request.nextUrl.clone();
    url.pathname = role ? HOME_BY_ROLE[role] : AUTHED_HOME;
    url.search = "";
    return withAuthCookies(NextResponse.redirect(url));
  }

  return withAuthCookies(NextResponse.next({ request }));
}

export const config = {
  // `/hr/:path*` matches the board and every registration detail page under it;
  // `/submissions/:path*` covers the per-challenge submission tables. The public
  // `/submit/:id` page is deliberately absent — a team authenticates there with
  // its secret code, not a session.
  matcher: ["/login", "/hr/:path*", "/submissions/:path*"],
};
