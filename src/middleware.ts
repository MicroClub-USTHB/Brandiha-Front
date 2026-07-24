import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/jwt";

/**
 * Route prefixes that require an authenticated jury/staff session. Add the jury
 * dashboard routes here as they're built (e.g. "/jury").
 */
const PROTECTED_PREFIXES = ["/jury"];

/** Where to send unauthenticated users, and where to bounce already-authed ones. */
const LOGIN_PATH = "/login";
const AUTHED_HOME = "/jury";

/**
 * Cheap, optimistic gate: redirect based only on whether a session cookie is
 * present. This is UX, not security — the backend is the real authority and
 * validates the token on every protected call (and in `getSession`). An expired
 * cookie may pass here, but the page's `getSession()`/`apiFetch` will reject it.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // No cookie on a protected route → login, remembering where they were headed.
  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Cookie present but sitting on /login → send them into the app.
  if (pathname === LOGIN_PATH && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = AUTHED_HOME;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/jury/:path*"],
};
