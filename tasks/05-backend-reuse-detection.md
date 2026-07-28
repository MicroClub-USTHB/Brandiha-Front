# No refresh-token reuse detection (backend)

**Where:** `../brandiha-back`, PR #28 — `app/routers/auth.py` (`refresh_access_token`)
**Status:** not fixed — backend repo, raise on PR #28

## What happens

Rotation deletes the presented token and issues a successor. If a token is
presented a second time, the lookup simply misses and the caller gets a 401.
Nothing else happens.

## Why it matters

Detecting reuse is most of the reason to rotate at all. Two parties presenting
the same token means one of them stole it — but the backend cannot tell that
from an ordinary expired-token 401, so it does nothing. A stolen token stays
usable until the legitimate user happens to refresh, and even then only that one
token is invalidated; the attacker's freshly rotated successor keeps working.

## Suggested fix

Track a token family (a lineage id carried across rotations). On presentation of
a token that was already rotated, revoke the entire family, forcing a real login.

`delete_all_tokens_for_staff` already exists in `app/repositories/auth.py` for
exactly this and is currently unused — a blunter version of the same idea
(revoke everything for that staff member) would be a reasonable first step.

## Interaction with the grace window

A grace window (see [04](./04-backend-rotation-atomicity.md)) and reuse
detection pull in opposite directions: one forgives a replayed token, the other
treats it as theft. They coexist if the window is short and the replay returns
the *same* successor rather than minting a new one — replay inside the window is
benign, replay outside it is an alarm. Worth designing together rather than
separately.
