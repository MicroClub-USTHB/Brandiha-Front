"use server";

import { cookies } from "next/headers";
import { LoginFormData } from "@/lib/validators/login-schema";
import { SESSION_COOKIE, REFRESH_COOKIE } from "@/lib/auth/jwt";

const API_BASE_URL =
  (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    .replace(/\/$/, "");

/** Result returned to the client — errors are serialized, never thrown across the boundary. */
export type LoginResult = { ok: true } | { ok: false; error: string };

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * Server Action: authenticate a staff member against the backend. Runs on the
 * server, so the backend URL stays private and no CORS is involved. On success
 * the JWT is stored in an httpOnly cookie for later protected requests; failures
 * map to user-facing messages.
 */
export async function loginStaff(data: LoginFormData): Promise<LoginResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  let body: LoginResponse;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      error: "Something went wrong on our side. Please try again in a moment.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, body.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(REFRESH_COOKIE, body.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { ok: true };
}

/** Server Action: clear the session cookies and notify backend, logging the user out. */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {
      // Ignore network errors on logout, proceed to clear local cookies
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
