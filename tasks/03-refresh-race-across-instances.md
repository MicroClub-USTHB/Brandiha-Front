# Refresh de-duplication is per-worker, not fleet-wide

**Where:** `src/lib/auth/refresh.ts` — the `rotations` map
**Status:** mitigated in 18bd650, not closed

## What happens

A single navigation puts several requests through the proxy at once — RSC
prefetches, parallel route segments — each carrying the same refresh cookie
because the browser has not seen the new one yet. The backend rotates strictly,
so without coordination the first request wins and the rest take a 401 for a
token that was valid when they read it, logging the user out mid-navigation.

`refreshSession` collapses these: in-flight callers share one request, and
callers arriving within the 10s grace window get the same new pair back.
Verified — four parallel requests produce exactly one backend call and four
successful responses.

The limit is that this is module-level memory in one middleware worker. Requests
landing on **different workers or instances** still race, and the loser is still
logged out.

## Impact

Invisible on a single instance. On a multi-instance deploy the surviving race
window is small (both requests must be mid-refresh simultaneously *and* land on
different workers), but a logout is a harsh failure mode for it.

## What to do

The durable fix is server-side and belongs with
[04](./04-backend-rotation-atomicity.md): let the backend accept a just-rotated
token for a few seconds and re-issue its successor, so a losing request gets the
same new pair rather than a 401. Once that exists, this frontend cache becomes a
latency optimisation rather than a correctness crutch, and the grace window here
could be shortened or dropped.

A shared cache (Redis and friends) would also work, but is a lot of machinery
for a problem the backend can solve in one statement.

## Note

The cache holds refresh tokens in middleware process memory for up to 10s. They
already pass through this process, so it is not new exposure, but it is worth
knowing about — and is a second reason to prefer the backend fix.
