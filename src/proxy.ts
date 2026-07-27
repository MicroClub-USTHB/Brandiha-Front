import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isTokenFresh } from "@/lib/auth/jwt";

/** Route prefixes that require an authenticated staff session. */
const PROTECTED_PREFIXES = ["/hr", "/rh"];

/** Where to send unauthenticated users, and where to bounce already-authed ones. */
const LOGIN_PATH = "/login";
const AUTHED_HOME = "/hr";

/**
 * Optimistic gate based on the session cookie. This is UX, not security — the
 * backend is the real authority and validates the token on every protected call
 * (and in `getSession`). We do a cheap local expiry check so an expired cookie
 * is treated as logged-out (and cleared) rather than looping between the page's
 * `getSession()` redirect and this proxy's "already-authed" bounce.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const hasSession = token ? isTokenFresh(token) : false;

  // Drop a present-but-invalid/expired cookie so it can't linger or loop.
  const clearStale = (res: NextResponse) => {
    if (token && !hasSession) res.cookies.delete(SESSION_COOKIE);
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
    return clearStale(NextResponse.redirect(url));
  }

  // Valid session sitting on /login → send them into the app.
  if (pathname === LOGIN_PATH && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = AUTHED_HOME;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return clearStale(NextResponse.next());
}

export const config = {
  matcher: ["/login", "/hr/:path*", "/rh"],
};
