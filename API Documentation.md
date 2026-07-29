# Brandiha Backend — API Reference

Auth: `Authorization: Bearer <token>` (JWT from `POST /auth/login`).

---

## Roles & auth guards

| Role | Who | Access |
|------|-----|--------|
| `admin` | Organisers | Registrations, teams |
| `super_admin` | Head organisers | Everything admin can + challenges, leaderboards, scoring, alumni data |
| `alumni` | Former members | Vote on team rankings |

**Master password** (`.env` → `MASTER_ADMIN_PASSWORD`): a shared secret passed as header `password: xxx`. Used to bootstrap the first staff account and create/edit challenges (bypasses JWT entirely).

| Auth guard | Allows | Used by |
|---|---|---|
| `get_current_admin` | `admin` | Registrations & teams routes |
| `get_current_staff` | `admin`, `super_admin` | View challenge detail |
| `get_current_super_admin` | `super_admin` | Leaderboards, freeze, scoring, alumni admin |
| `get_current_alumni_only` | `alumni` | Voting |
| `get_any_authenticated_user` | `admin`, `super_admin`, `alumni` | Profile & logout |

---

## Endpoints

---

### `GET /health`

Runs `SELECT 1` against PostgreSQL — returns `pass` + latency if DB is up, `fail` + `503` otherwise. Includes version (from package metadata, fallback `0.1.0`), uptime in seconds, and timestamp. No auth.

```json
{"status":"pass","service":"brandiha-api","version":"0.1.0","timestamp":"...","uptime_s":1234,"checks":{"database":{"status":"pass","latency_ms":2}}}
```

---

### `POST /auth/login`

Authenticates staff (admin/super_admin/alumni) by email + password. On success returns an **access_token** (JWT, 15min default) and a **refresh_token** (random string, 7 days). The refresh token is stored as a SHA-256 hash (safe if DB leaks). Expired tokens cleaned up as side effect. No auth.

Send:
```json
{"email":"admin@brandiha.com","password":"..."}
```

Response `200`:
```json
{"access_token":"eyJ...","refresh_token":"abc...","token_type":"bearer"}
```

`401` on bad email/password (same message for both — prevents email enumeration).

---

### `POST /auth/refresh`

Token rotation: takes a refresh token, atomically deletes it, and issues a new access+refresh pair inside a DB transaction. If the old token was already used (replay attack), it finds nothing to delete and returns `401`. Expired tokens also `401` (and are deleted). If the staff account no longer exists, `401`. No auth (just the token).

Send: `{"refresh_token":"abc..."}`

Response `200`: same shape as login.

---

### `POST /auth/logout`

Deletes the given refresh token from DB so it can't be used again. Requires **any authenticated user** (admin/super_admin/alumni) — this prevents an attacker who stole a refresh token from calling logout to confirm it's valid. Response: `204` empty.

Send: `{"refresh_token":"abc..."}`

---

### `GET /auth/me`

Returns the authenticated user's profile (id, name, email, role, timestamps). `404` if the user was deleted after the token was issued.

```json
{"id":"uuid","name":"...","email":"...","role":"admin","created_at":"...","updated_at":"..."}
```

---

### `POST /auth/staff`

Creates a staff account. Password is bcrypt-hashed before storage. Requires the **master password** header (`password: master_secret`) — compared using constant-time comparison (HMAC) to prevent timing attacks. This bootstraps the first admin since no JWT exists yet.

Send:
```json
{"name":"New Staff","email":"staff@brandiha.com","password":"...","role":"admin"}
```
`role` is `"admin"`, `"alumni"`, or `"super_admin"`.

Response `201`: same shape as `auth/me` (password never returned). `401` bad master pwd. `409` duplicate email.

---

### `POST /registrations`

Public sign-up. Inside one DB connection (no explicit transaction):
1. **Create or reuse team** — `team_name` is trimmed + lowercased (`" Team Alpha "` → `"team alpha"`), `ON CONFLICT` makes it idempotent. A random 8-char `secret_code` is generated for new teams.
2. **Create user** — full_name, email, phone_number, discord_id (email and discord_id must be unique).
3. **Create registration** — links user to team with all application data.

Send:
```json
{
  "full_name":"John Doe","email":"john@example.com","phone_number":"+212600000000","discord_id":"john#1234",
  "team_name":"Team Alpha","knowledge_about_brandiha":"...","participated_before":false,"previous_competitions":null,
  "skills":"Python, Design","tools":["Figma"],"portfolio_url":null,"other_links":[],"motivation":"...",
  "department":"multimedia","food_allergies":null,"available_during_event":"yes","availability_note":null,
  "okay_with_photos":true,"t_shirt_size":"M","additional_notes":null
}
```

Fields with constraints:
- `participated_before=true` ⇒ `previous_competitions` required
- `available_during_event="other"` ⇒ `availability_note` required
- `department`: `"multimedia"` / `"design"` / `"communication"` / `"marketing"`
- `t_shirt_size`: `"S"` / `"M"` / `"L"` / `"XL"` / `"XXL"`
- `available_during_event`: `"yes"` / `"no"` / `"other"`

Response `201`: the full Registration (id, user_id, team_id, all fields, `status:"pending"`, timestamps). `409` on duplicate email or discord_id.

---

### `GET /registrations`

Paginated list of registrations with user info (name, email, phone, discord) and team info (name, secret_code). The admin's applicant review screen. Auth: `admin`.

Query params: `page` (1), `limit` (20, max 100), `status` (`"pending"` / `"accepted"` / `"rejected"`).

```json
{
  "data":[{"id":"uuid","user_id":"uuid","team_id":"uuid","knowledge_about_brandiha":"...","participated_before":false,"previous_competitions":null,"skills":"...","tools":[],"portfolio_url":null,"other_links":[],"motivation":"...","food_allergies":null,"available_during_event":"yes","availability_note":null,"okay_with_photos":true,"t_shirt_size":"M","additional_notes":null,"department":"multimedia","status":"pending","created_at":"...","updated_at":"...","user_full_name":"John Doe","user_email":"john@example.com","phone_number":"+212600000000","discord_id":"john#1234","team_name":"team alpha","team_secret_code":"a1b2"}],
  "total":50,"page":1,"limit":20,"pages":3
}
```

`pages` = `ceil(total / limit)`.

---

### `GET /registrations/{id}`

Single registration detail. Same shape as one list item. Auth: `admin`. `404` if not found.

---

### `PATCH /registrations/{id}`

Update a registration. Two independent actions (both optional):
1. **Change status** — `"pending"` → `"accepted"` or `"rejected"`.
2. **Transfer to another team** — `team_name` must reference an existing team (case-insensitive match).

Auth: `admin`.

Send: `{"status":"accepted","team_name":"team beta"}`

Response `200`: updated RegistrationDetail. `404` if registration or target team doesn't exist.

---

### `GET /teams/stats`

Aggregate team counts by status. A team's status = the first registration's status found (simplification — mixed-status teams report only the first member's status). Auth: `admin`.

```json
{"total_teams":10,"accepted_teams":5,"rejected_teams":2,"pending_teams":3}
```

---

### `GET /teams`

Lists non-deleted teams (`deleted_at IS NULL`) with members. Each team has a derived `status` (from its first registration) and a `members` array with individual statuses. `secret_code` is intentionally excluded (it's the auth for challenge submission). Auth: `admin`.

Query param: `status` (`"pending"` / `"accepted"` / `"rejected"`) filters by derived team status.

```json
[{"id":"uuid","name":"team alpha","status":"accepted","members":[{"registration_id":"uuid","user_id":"uuid","full_name":"John Doe","email":"john@example.com","status":"accepted"}],"created_at":"...","updated_at":"..."}]
```

---

### `PATCH /teams/{id}`

Updates status of **all** registrations in a team at once (batch approve/reject). Auth: `admin`.

Send: `{"status":"accepted"}`

Response `200`: updated team (same shape as list). `404` if team not found.

---

### `DELETE /teams/{id}`

Soft-deletes a team (`deleted_at = NOW()` — excluded from all queries, data preserved). Only works if the team has **zero** registrations or **all** are rejected. Auth: `admin`. Response: `204`.

`400` if the team still has active (pending/accepted) members. `404` if not found.

---

### `POST /challenges`

Creates a challenge with department, unlock time, and optional end time. `leaderboard_frozen_at` starts null, `id` is auto-incrementing SERIAL. Requires master password header (challenges are structural — not creatable by any JWT role).

Send:
```json
{"title":"Design Sprint","unlocks_at":"2026-08-01T09:00:00Z","ends_at":"2026-08-03T18:00:00Z","department":"design"}
```
`ends_at` optional (runs indefinitely if omitted). `department` enums as above.

Response `201`:
```json
{"id":1,"title":"Design Sprint","unlocks_at":"...","ends_at":"...","leaderboard_frozen_at":null,"department":"design","created_at":"...","updated_at":"..."}
```

---

### `PATCH /challenges/{challenge_id}`

Updates any subset of challenge fields. Set a field to `null` to clear it (e.g., remove end date). Requires master password.

Send: `{"title":"Updated","ends_at":null,"department":"multimedia"}` (all optional)

Response `200`: updated Challenge. `400` for empty body. `404` if not found.

---

### `GET /challenges`

Lists all challenges. `leaderboard_frozen_at` is excluded from the list (public doesn't need to know freeze status). No auth.

```json
[{"id":1,"title":"Design Sprint","unlocks_at":"...","ends_at":"...","department":"design","created_at":"...","updated_at":"..."}]
```

---

### `POST /challenges/{challenge_id}`

Team submits a solution. Uses the team's **secret_code** (from registration) as authentication — no JWT needed. Validation sequence:
1. Challenge must exist.
2. Current time >= `unlocks_at` (else `400`).
3. If `ends_at` is set, current time must be before it (else `400`).
4. Look up team by `secret_code` (else `404`).
5. Team must have at least one accepted registration (else `403`).
6. Team must not have already submitted to this challenge (else `409` — one submission per challenge per team).

On success, creates a submission with `score: null` (scores are set later by super_admin via annotation).

Send: `{"team_code":"a1b2","link":"https://github.com/team/repo"}`

Response `201`:
```json
{"challenge_id":1,"team_id":"uuid","link":"https://github.com/team/repo","submitted_at":"...","score":null,"frozen_score":null,"id":"uuid","created_at":"...","updated_at":"..."}
```

---

### `GET /challenges/{challenge_id}`

Challenge detail with all submissions (team name, code, link, timestamp). For staff (admin/super_admin) — alumni cannot access. Auth: `get_current_staff`.

```json
{"challenge":{"id":1,"title":"Design Sprint","unlocks_at":"...","ends_at":"...","leaderboard_frozen_at":null,"department":"design","created_at":"...","updated_at":"..."},"submissions":[{"team_name":"team alpha","team_code":"a1b2","link":"https://github.com/team/repo","submitted_at":"..."}]}
```

`404` if not found.

---

### `GET /admin/leaderboard`

Full global leaderboard: every accepted team with per-challenge scores (only scored submissions) plus total. Computed by joining all challenges × all scored submissions for accepted teams, grouped by team, sorted by total descending. Unscored submissions are excluded (no row appears until a score is set). Auth: `super_admin`.

```json
[{"team_id":"uuid","team_name":"team alpha","per_challenge":[{"challenge_id":1,"challenge_title":"Design Sprint","score":85.0,"submission_id":"uuid"},{"challenge_id":2,"challenge_title":"Coding","score":null,"submission_id":null}],"total_score":85.0}]
```

---

### `GET /leaderboard`

Public leaderboard: team name + total score only (no IDs, no per-challenge breakdown). Same scoring: only scored submissions from accepted teams. No auth.

```json
[{"team_name":"team alpha","total_score":85.0}]
```

---

### `PATCH /admin/challenge-submissions`

Score (or rescore) multiple submissions in one request. Score is a float ≥ 0 (enforced by DB). Setting `score: null` clears it. Processed sequentially. Auth: `super_admin`.

Send:
```json
[{"submission_id":"uuid-1","score":85.0},{"submission_id":"uuid-2","score":null}]
```

Response: `204`.

---

### `POST /admin/challenges/{challenge_id}/freeze`

Toggles leaderboard freeze:
- **Freeze:** sets `leaderboard_frozen_at = NOW()`, copies every submission's `score` → `frozen_score` (permanent snapshot).
- **Unfreeze:** clears both (`null`).

Use case: freeze at deadline so displayed rankings stay fixed, then continue scoring offline. Auth: `super_admin`.

Response `200`: `{"frozen": true}` (true = now frozen, false = now unfrozen). `404` if challenge not found.

---

### `GET /alumni/voting`

Returns voting page for an alumni. Two states:
- `has_voted: false` → all accepted teams, unsorted. The alumni must rank every one.
- `has_voted: true` → teams sorted by the alumni's submitted ranking (1st preference first).

Auth: `get_current_alumni_only` (alumni only — super_admin cannot call this).

```json
{"has_voted":false,"teams":[{"id":"uuid","name":"team alpha","status":"accepted","members":[{"registration_id":"uuid","user_id":"uuid","full_name":"John Doe","email":"john@example.com","status":"accepted"}],"created_at":"...","updated_at":"..."}]}
```

---

### `POST /alumni/voting`

Submit a Borda count vote. Alumni must rank **all** active (accepted) teams exactly once. Validation:
1. Alumni hasn't already voted (`409` — no re-votes).
2. The list contains exactly the same team IDs as currently active teams (`400` if wrong count, invalid/dulicate IDs, or missing teams).

Ranking stored as `rank` (1 = 1st preference, N = last). Borda score = `(N - rank + 1)` per voter. Auth: `get_current_alumni_only`.

Send: `{"ranked_team_ids":["uuid1","uuid2","uuid3"]}` (order matters: 1st preference first).

Response: `204`.

---

### `GET /alumni/leaderboard`

Borda leaderboard: each team's score = sum of `(N - rank + 1)` across all alumni votes (N = active team count at voting time). Sorted descending. Example: 5 active teams → 1st place gets 5 pts per vote, 2nd gets 4, ..., 5th gets 1. Auth: `super_admin`.

```json
[{"team_name":"team alpha","borda_score":15},{"team_name":"team beta","borda_score":12}]
```

---

### `GET /alumni/votes`

Detailed breakdown of every alumni's vote for audit/transparency. Grouped by alumni, teams in rank order. Auth: `super_admin`.

```json
[{"alumni_name":"Fatima Zahra","alumni_email":"fatima@brandiha.com","ranked_teams":["team alpha","team beta","team gamma"]}]
```

