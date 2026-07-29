# `/vote` renders a placeholder, not the ballot

`src/app/(dashboard)/vote/page.tsx` exists as the alumni home — routed,
role-gated, and reachable from login — but its body is a placeholder. Nothing
calls `GET /alumni/voting` or `POST /alumni/voting` yet.

Shipped this way on purpose: the route had to land first so alumni have
somewhere to log into (`HOME_BY_ROLE.alumni`), and the ballot itself is a
separate piece of work — a reorderable list of every accepted team, plus the
two-state split the endpoint returns (`has_voted: false` → unsorted teams to
rank; `has_voted: true` → the submitted ranking, read-only).

To finish it:

- Add `src/lib/api/voting.ts` alongside the other `@/lib/api` modules, wrapping
  both endpoints with the same `Result` shape they use.
- Build the ranking UI in `src/components/vote/`. The HR board already does
  drag-and-drop (`src/components/hr/hr-board.tsx`) — match it rather than
  introducing a second approach.
- Guard the submit action with `requireRole("alumni")`, mirroring
  `get_current_alumni_only`.
- Handle the `409` on a second vote: the backend refuses re-votes outright, so
  the UI has to state that rather than retry.
