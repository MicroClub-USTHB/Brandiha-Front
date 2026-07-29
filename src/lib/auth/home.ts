import type { Role } from "@/lib/auth/jwt";

/**
 * Where each role lands after signing in, and where an already-signed-in
 * visitor to `/login` gets sent.
 *
 * Every role names its own home rather than sharing a default: the roles are
 * disjoint sets, not a ladder, so there is no page all three can use — a
 * `super_admin` sent to `/hr` would only meet an access notice.
 *
 * Deliberately free of imports beyond the `Role` type (erased at build), so the
 * login form can read this map without pulling `jose` into the browser bundle.
 */
export const HOME_BY_ROLE: Record<Role, string> = {
  admin: "/hr",
  super_admin: "/leaderboard",
  alumni: "/vote",
};
