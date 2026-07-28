# `apiFetch` cannot recover from a mid-flight token expiry

**Where:** `src/lib/api/client.ts` — `apiFetch`
**Status:** accepted trade-off in 129787d, recorded for review

## What happens

`apiFetch` never refreshes. It checks the token is fresh, sends it, and lets a
401 surface to the caller as "You're not signed in." The proxy owns refreshing.

That leaves one uncovered case: a request whose token is fresh when sent but
expires before the backend reads it. The user sees an error on an action that
should have worked, and has to navigate (which triggers the proxy) to recover.

The window is now small — the pre-flight freshness check removed the much larger
"already expired when sent" case — but it is not zero.

## Why it was left

Refreshing inside `apiFetch` is worse than the problem. Under strict rotation
the backend deletes the presented token the moment it accepts it, so a refresh
whose result cannot be persisted permanently strands the browser. And it often
cannot be persisted: Next.js forbids writing cookies during a Server Component
render, which is where much of this code runs.

The proxy's single-flight cache does not help either — middleware is a separate
bundle from the server runtime, so the two do not share module state.

## What to do (if it proves to matter)

Do **not** add a blanket refresh-and-retry to `apiFetch`. The narrow version
that is safe: a separate helper used *only* from Server Actions, which can write
cookies, that on a 401 refreshes, persists both cookies, and retries once. Leave
Server Component reads failing fast as they do now.

Only worth building if this actually bites — measure before adding the surface.

## Related

Depends on [04](./04-backend-rotation-atomicity.md) and
[05](./05-backend-reuse-detection.md): a backend grace window would make a
lost-but-unpersisted rotation survivable, and shrink the risk this whole
trade-off is guarding against.
