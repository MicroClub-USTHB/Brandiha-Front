# Tasks

Known-outstanding work, one file per item. These are things deliberately *not*
done, with the reasoning recorded — not a general backlog. Delete a file when
its item ships.

| # | Item | Where | Blocking? |
|---|------|-------|-----------|
| [01](./01-login-bounce-on-backend-outage.md) | Backend outage bounces a valid session to a bare login form | frontend | no |
| [02](./02-apifetch-midflight-401.md) | `backendFetch` cannot recover from a mid-flight token expiry | frontend | no |
| [03](./03-refresh-race-across-instances.md) | Refresh de-duplication is per-worker, not fleet-wide | frontend + backend | no |
| [04](./04-backend-rotation-atomicity.md) | Refresh rotation is not atomic | backend | **yes** |
| [05](./05-backend-reuse-detection.md) | No refresh-token reuse detection | backend | no |
| [06](./06-pr-closes-link.md) | PR #42 body is missing its `Closes #` line | process | no |
| [07](./07-decorative-svg-payload.md) | ~6.5 MB of decorative SVG loads on every page | frontend + design | no |

Items 04 and 05 live in `../brandiha-back` and are recorded here only so they
are not lost — they need raising on that repo's PR #28.

Item 07 was opened from the project audit of 2026-07-30; the rest came from the
review of PR #42.
