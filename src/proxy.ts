import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api/base-url";
import { SESSION_COOKIE, REFRESH_COOKIE, isTokenFresh } from "@/lib/auth/jwt";

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
  
  let token = request.cookies.get(SESSION_COOKIE)?.value;
  let hasSession = token ? isTokenFresh(token) : false;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  let response = NextResponse.next({ request });
  let cookiesCleared = false;

  // Try to refresh if the access token is dead but we have a refresh token
  if (!hasSession && refreshToken) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const body = await res.json();
        
        token = body.access_token;
        hasSession = true;

        // 1. Update the request so downstream Server Components see the new tokens
        request.cookies.set(SESSION_COOKIE, body.access_token);
        request.cookies.set(REFRESH_COOKIE, body.refresh_token);
        
        // 2. Re-create the response to capture the mutated request
        response = NextResponse.next({ request });
        
        // 3. Set the Set-Cookie headers so the browser saves the new tokens
        response.cookies.set(SESSION_COOKIE, body.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        response.cookies.set(REFRESH_COOKIE, body.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      } else {
        // Refresh token rejected/expired
        hasSession = false;
        cookiesCleared = true;
      }
    } catch {
      // Network error, we can't refresh. We leave cookies alone so it can retry later.
      hasSession = false;
    }
  } else if (!hasSession && token) {
    // No refresh token and access token is dead
    cookiesCleared = true;
  }

  // Helper to clear cookies on whatever response we end up sending
  const applyClear = (res: NextResponse) => {
    if (cookiesCleared) {
      res.cookies.delete(SESSION_COOKIE);
      res.cookies.delete(REFRESH_COOKIE);
    }
    return res;
  };

  // No valid session on a protected route → login (remembering where headed).
  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return applyClear(NextResponse.redirect(url));
  }

  // Valid session sitting on /login → send them into the app.
  if (pathname === LOGIN_PATH && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = AUTHED_HOME;
    url.search = "";
    return NextResponse.redirect(url); // Don't clear, cookies are valid
  }

  return applyClear(response);
}

export const config = {
  matcher: ["/login", "/hr/:path*", "/rh"],
};
