# AGENTS.md

Guidance for AI agents (and humans) working in the Brandiha front-end. Read
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full workflow — this file is the
fast, agent-focused summary of how the codebase is built and the rules that are
easy to get wrong.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config in `globals.css`, no `tailwind.config`)
- **shadcn/ui** on **Radix** (`radix-ui`), style `radix-vega` — see `components.json`
- **next-themes** for theming
- **lucide-react** for icons
- **react-hook-form** + **Zod v4** for forms and validation
- **zustand** for the little client state that outlives a component
- **motion** (Framer Motion) for animation and drag
- **jose** for reading JWT claims (decode only — the backend verifies)
- **@tanstack/react-table** for the submissions table
- **vitest** for unit tests
- **pnpm** (Node 24). Use pnpm only; do not introduce npm/yarn lockfiles.

## Commands

```bash
pnpm install
pnpm dev        # dev server at http://localhost:3000
pnpm lint       # eslint — must be clean
pnpm typecheck  # tsc --noEmit (faster than a build when you only changed types)
pnpm test       # vitest, unit tests — must pass
pnpm build      # production build — must pass
```

"Verified" means `pnpm lint`, `pnpm test`, and `pnpm build` all pass; run them
after any non-trivial change. CI runs the same three.

Tests live beside what they test as `*.test.ts` and cover the pure logic in
`src/lib` — status rules, the challenge window, CSV encoding, the Zod schemas,
the refresh cache. There is **no component or browser test setup** (no jsdom, no
Playwright), so anything visual still needs looking at in a browser.

## Outstanding work

`tasks/` records known-outstanding work — one file per item, covering things
left undone on purpose and the reasoning behind it. Read it before picking up
auth, proxy, or session code, where most of it currently sits.

Add a file when you knowingly leave something unfinished, so the reasoning
outlives the PR thread; delete one when its item ships. It is not a general
backlog — issues are for that.

## Project layout

```
src/
  proxy.ts                 # Middleware: route gate + silent token refresh
  app/
    layout.tsx             # Root layout (ThemeProvider, fonts, background, splash, cursor)
    globals.css            # Tailwind v4 config + the 5 theme blocks
    page.tsx               # Landing page
    register/              # Registration page
    login/                 # Staff login page
    leaderboard/           # Public leaderboard — read-only, no session
    not-found.tsx          # 404
    error.tsx              # Error boundary below the root layout
    global-error.tsx       # Error boundary for the root layout itself
    opengraph-image.tsx    # Generated OG image
    (dashboard)/           # Authenticated staff area — proxy-gated, shared header
      layout.tsx           #   Dashboard shell
      loading.tsx          #   Shared pending state for these routes
      hr/                  #   Admin: team board + registration detail
      submissions/         #   Staff: challenge list + per-challenge submissions
      vote/                #   Alumni: Borda ballot
      super-admin-leaderboard/  # Super admin: score editing + leaderboard freeze
    (challenges)/
      submit/              # Public: challenge list + submission form (team code, no session)
  components/
    ui/                    # shadcn primitives — add via CLI
    landing/               # Landing sections (hero, agenda, faq, footer, header, nav-bar, …)
    register/              # Registration form, stepper, fields
    login/                 # Login form
    dashboard/             # Dashboard header
    hr/                    # Team board, member rows, status badge, team actions, CSV export
    submissions/           # Submissions table + CSV export
    vote/                  # Ballot and ballot rows
    leaderboard/           # Public board, score sheet, freeze toggle
    submit/                # Public submission form
    auth/access-notice.tsx # Rendered in place of a page a role may not see
    cursor/                # Graffiti cursor, trail, splatter
    notice.tsx             # Shared full-page notice (404, error, access denial)
    form.tsx               # FormInput, FormTextarea, FormSelect, FormCheckbox wrappers
    pop-up.tsx             # Popup + zustand store for success/error/warning
    site-background.tsx    # Paint wall + decorations, behind every page
    splash-screen.tsx      # One-per-session intro animation
    theme-picker.tsx       # Theme picker UI
    theme-provider.tsx     # "use client" boundary for next-themes
  hooks/
    use-registration-form.tsx  # Multi-step form logic (react-hook-form + Zod)
    use-graffiti-cursor.ts     # Pointer tracking for the graffiti cursor
  lib/
    api/
      fetch.ts             # backendFetch — the ONE way to call the backend
      base-url.ts          # API_BASE_URL (no server-only: the proxy shares it)
      auth.ts              # loginStaff / logout Server Actions
      registrations.ts     # Registration submit + admin reads/updates
      teams.ts             # Team reads, bulk status, delete
      challenges.ts        # Public challenge list, submission, staff detail
      voting.ts            # Alumni ballot read + vote
      leaderboard.ts       # Public + admin leaderboard, freeze toggle
      actions.ts           # Bulk score update Server Action
      freezeAction.ts      # Freeze toggle Server Action
      challenge-window.ts  # upcoming / open / closed, shared server and client
      *-types.ts           # Backend response shapes
    auth/
      jwt.ts               # Cookie names/options, Role, claim decoding
      session.ts           # getSession (request-cached), checkAccess, requireRole
      refresh.ts           # Token rotation with a single-flight cache
      home.ts              # HOME_BY_ROLE — where each role lands after login
    validators/            # Zod schemas (registration, login, submission)
    team-status.ts         # Majority team status + the delete rule
    csv.ts                 # CSV encoding (quoting + formula-injection guard)
    list-field.ts          # splitList — comma/newline free text to a list
    form-persistence.ts    # Expiry rule for the saved registration form
    registration-fields.ts # Step/field definitions for the registration form
    themes.ts              # Theme list (single source of truth)
    agenda-data.ts         # Landing agenda content
    faq-data.ts            # Landing FAQ content
    utils.ts               # cn() helper
```

## Conventions (the ones that matter)

- **Imports use the `@/…` alias** (maps to `src/`). Never `../../`.
- **UI primitives come from `src/components/ui/`.** Add new ones with the shadcn
  CLI (`pnpm dlx shadcn@latest add <component>`) — do not hand-roll them or add a
  competing UI library. They're Radix under the hood.
- **Colors are semantic tokens only** — `bg-background`, `text-foreground`,
  `bg-primary`, etc., which resolve to CSS variables in `globals.css`. No raw
  Tailwind palette (`bg-red-500`), hex, or inline `oklch(...)` in components.
  Outcomes have tokens too: `success` (accepted), `warning` (pending), and
  `destructive` (rejected, errors). If you find yourself reaching for
  `bg-green-500`, the token you want already exists.
- **Merge classes with `cn()`** from `@/lib/utils`, never string concatenation.
- **Server Components by default.** Add `"use client"` only when a component
  needs interactivity, browser APIs, or a client-only library.
- **Client-only libraries need a boundary.** e.g. `theme-provider.tsx` is a thin
  `"use client"` wrapper so the server `layout.tsx` can use next-themes without
  becoming a client component.
- Match the structure of an existing analogous component before inventing a new
  pattern.

## Theming

- Themes are **5 standalone** looks selected via a `data-theme` attribute on
  `<html>` (managed by next-themes). There is no light/dark toggle.
- Each theme is a `[data-theme="…"]` block of CSS variables in
  `src/app/globals.css`. Shared `--white` (#FFFFF0) and `--black` (#111111)
  anchors are defined once in `:root` and referenced by every theme.
- Some values are deliberately **theme-independent** and declared only in
  `:root`, so every theme inherits them: the four `--brand-*` pillar hues, and
  `--success` / `--warning`. An accepted registration should read as the same
  green whichever theme is on.
- The theme list lives in `src/lib/themes.ts` — the single source of truth shared
  by the provider (`theme-provider.tsx`) and the picker (`theme-picker.tsx`). To
  add or change a theme, edit both `themes.ts` and the matching `globals.css`
  block. Brand colors are authored in hex, then converted to oklch.

## Talking to the backend

- **Every backend call goes through `backendFetch`** (`src/lib/api/fetch.ts`).
  Do not call `fetch` directly and do not add a second helper — that is exactly
  the drift this replaced. It owns URL building, the JSON content type, a 10s
  default timeout, and the bearer token.
- `auth: true` attaches the session token and, on a 401, refreshes the pair once
  and retries. Without it the call is public.
- It throws `UnauthenticatedError` when there is no session cookie, or when the
  backend rejects the refresh token. Catch it and map it to a message.
- The one exception is `lib/auth/refresh.ts`, which calls `fetch` itself: it runs
  in the proxy's middleware bundle, which can't import `server-only` code, and
  it is what `backendFetch` calls to refresh.
- **Server Actions return serializable results, never throw across the
  boundary** — `{ ok: true, data }` / `{ ok: false, error }`. The error string is
  user-facing copy, so map each status the backend documents to its own message.
- `API Documentation.md` is the backend contract. Mirror it exactly; when the UI
  and the contract disagree, the contract wins.

## Auth and roles

- **Roles are disjoint sets, not a ladder.** `super_admin` is *not* a superset of
  `admin` — the backend gates registrations and teams on `admin` alone. Always
  name every role that may pass; never assume seniority.
- Two guards, both in `src/lib/auth/session.ts`, and both mirroring the backend
  dependency on the endpoint you're calling (the mapping table is in that file):
  - `checkAccess(...roles)` in a **page** — render `<AccessNotice />` in the
    page's place when it denies.
  - `requireRole(...roles)` in a **Server Action** — return the denial to
    short-circuit. Actions are publicly callable, so each re-checks rather than
    trusting the page that rendered it.
- `getSession()` is wrapped in React's `cache`, so the several guards on one page
  share a single `/auth/me` round-trip. Keep it that way.
- **The proxy is UX, not security** (`src/proxy.ts`). It does a local expiry
  check to gate routes and refresh tokens — the backend is the authority, and it
  revalidates on every call. Cookie writes during a navigation only work in
  middleware, which is why refresh lives there.
- `HOME_BY_ROLE` (`src/lib/auth/home.ts`) is where each role lands after login.
  Every role names its own home, because there is no page all three can use.
- Add a route that needs a session to `PROTECTED_PREFIXES` **and** the `matcher`
  in `src/proxy.ts`.

## Registration form

- Multi-step form (4 steps) using **react-hook-form** + **Zod** validation.
- Field definitions live in `src/lib/registration-fields.ts` (label, type, options).
- Zod schema in `src/lib/validators/registration-schema.ts` with `superRefine` for
  conditional validation (AvailabilityMessage required when Availability === "Other").
- Form wrappers (`FormInput`, `FormTextarea`, `FormSelect`, `FormCheckbox`) in
  `src/components/form.tsx` — use these instead of raw shadcn inputs.
- Custom hook `src/hooks/use-registration-form.tsx` manages step state, field
  visibility, and validation triggers.
- Form fields use PascalCase names (e.g. `FullName`, `Email`) to match the schema.
- **`Tools` and `Links` are list fields.** They're free text split on commas and
  newlines by `splitList` (`src/lib/list-field.ts`) into the backend's `tools[]`
  and `other_links[]`. The schema validates them the same way — validate a list
  field entry-by-entry, never as a single value.
- Answers are persisted to localStorage so a reload doesn't lose them, and
  **expire after 24h of inactivity** (`src/lib/form-persistence.ts`). They
  include name, email, phone and Discord ID, so don't extend that window without
  a reason.

## Git

- Branch off `dev`; all PRs target `dev`. `main` is production.
- Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `chore`), one concern
  per commit.
- **Link the issue in the PR body** with a closing keyword — `Closes #42`
  (or `Fixes`/`Resolves`). Repeat the line per issue; a comma-separated list
  does not work. The `.github/pull_request_template.md` has a `Closes #` line for
  this. Note: because PRs target `dev`, GitHub only auto-closes the issue once the
  change reaches the default branch `main` (i.e. on the next dev→main promotion).
- **Never add attribution trailers** — no `Co-Authored-By`, no "Generated with
  Claude Code" — in commits or PR descriptions.
- **Don't rename a branch that already has an open PR** by deleting and
  recreating the remote ref (the `branches/{branch}/rename` API, or a
  delete-and-push). GitHub closes the PR when its head branch disappears instead
  of retargeting it, orphaning the review. Rename *before* opening the PR, or use
  GitHub's web UI "Rename branch", which retargets open PRs in place.
