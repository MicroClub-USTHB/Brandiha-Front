# Backend outage bounces a valid session to a bare login form

**Where:** `src/proxy.ts` — the `"unavailable"` branch of the refresh outcome
**Status:** half fixed in eb4cf76 / 18bd650

## What happens

When the refresh call times out or returns 5xx, the proxy correctly treats it as
"the backend is unreachable", not "the session is invalid", and leaves both
cookies in place so a later request can retry. But a protected route with no
usable access token still falls through to the `/login` redirect. So a user
holding a perfectly valid refresh token sees a login form because the backend
blipped.

It self-heals: once the backend recovers, the next request refreshes and bounces
them back into the app. The session is never destroyed. The problem is purely
what they see in the meantime, and that the form gives them no idea their
session is fine.

## Why it was left

Closing it means deciding what `/login` should say in that state, which is a
copy and UI decision rather than a correctness one.

## What to do

Distinguish the two ways a user arrives at `/login`. Something like a
`?reason=unavailable` search param on the redirect, with the login page showing
"We couldn't reach the server. Your session is still valid — try again in a
moment." instead of the default form copy.

Worth checking first whether a redirect is even the right move: serving the
protected page with a retry/error state may beat bouncing, given the session is
not actually over.

## Verifying

Reproducible with the stub in the review: stop the backend, then request `/hr`
with an expired access token and a valid refresh token. Today that returns a 307
to `/login` with no `Set-Cookie` (cookies intact, which is correct) and no
signal about why.
