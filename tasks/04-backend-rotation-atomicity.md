# Refresh rotation is not atomic (backend)

**Where:** `../brandiha-back`, PR #28 — `app/routers/auth.py` (`refresh_access_token`)
and `app/repositories/auth.py`
**Status:** not fixed — backend repo, raise on PR #28

## What happens

`refresh_access_token` runs three separate statements on three separate pool
connections, with the expiry check in Python in between:

1. `get_token()` — `SELECT` the row
2. `delete_token()` — `DELETE` it
3. `create_token()` — `INSERT` the successor

Two concurrent refreshes can both pass step 1 before either reaches step 2, so
both succeed and both mint a token. Nothing serialises them.

## Why it matters here

This is the server-side half of [03](./03-refresh-race-across-instances.md). The
frontend now de-duplicates within a middleware worker, which hides the common
case, but the underlying operation is still not safe under concurrency.

## Suggested fix

Collapse the read, the expiry check and the delete into one atomic statement:

```sql
DELETE FROM refresh_tokens
WHERE token_hash = %s AND expires_at > now()
RETURNING staff_id
```

A zero-row result then covers "unknown", "already used" and "expired" in a
single check, and only one of two racing callers can ever get a row back.

## Follow-on

While in there, the grace window that would let the frontend drop its cache:
briefly remember which successor a just-rotated token produced, and re-issue
that same pair if the old token is presented again within a few seconds. That
turns the losing side of a race into a success instead of a logout.
