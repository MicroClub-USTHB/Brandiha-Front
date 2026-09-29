# Brandiha — front end

The website for **Brandiha**, Micro Club's branding competition: teams of five
build a brand in two phases, from marketing strategy and communication plan to
visual identity and a creative video.

The site covers the whole event:

- **Public:** the landing page, team registration, challenge submission (with a
  team code), and the live leaderboard.
- **Staff dashboard:** reviewing registrations and teams, browsing and exporting
  submissions, scoring, and the alumni vote.

It talks to [Brandiha-Backend](https://github.com/MicroClub-USTHB/Brandiha-Backend);
the contract it follows is [`API Documentation.md`](./API%20Documentation.md).

## Getting started

You need **Node 24** and **pnpm** (the repo is pinned to pnpm; don't use npm or
yarn).

```bash
pnpm install
cp .env.example .env.local   # then point API_URL at your backend
pnpm dev                     # http://localhost:3000
```

Most pages need the backend running. Without it the landing page still renders,
but challenges, the leaderboard, login, and the staff pages have nothing to load.

### Environment

| Variable               | What it is                                               | Default                           |
| ---------------------- | -------------------------------------------------------- | --------------------------------- |
| `API_URL`              | Backend base URL, used on the server and in the proxy    | `http://localhost:8000`           |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site, used for metadata and OG images | `https://brandiha.microclub.info` |

## Scripts

```bash
pnpm dev        # dev server
pnpm lint       # eslint — must be clean
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest unit tests
pnpm build      # production build
pnpm start      # serve the production build
```

CI runs lint, test, and build on pull requests and pushes to `dev` and `main`.

## Pages and roles

| Route                                | Who                                    |
| ------------------------------------ | -------------------------------------- |
| `/`                                  | Everyone                               |
| `/register`                          | Everyone, while registrations are open |
| `/submit`                            | Teams, with their team code            |
| `/leaderboard`                       | Everyone                               |
| `/login`                             | Staff                                  |
| `/hr`                                | `admin`                                |
| `/submissions`                       | `admin`, `super_admin`                 |
| `/super-admin-leaderboard`           | `super_admin`                          |
| `/vote-leaderboard`, `/vote-results` | `super_admin`                          |
| `/vote`                              | `alumni`                               |

Roles are separate sets, not a ladder: `super_admin` does not inherit `admin`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui on
Radix · next-themes (five themes) · react-hook-form + Zod · zustand · motion ·
vitest.

## Contributing

Branch off `dev` and open pull requests against `dev`; `main` is production.
Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the workflow and
[`AGENTS.md`](./AGENTS.md) for the project layout and the conventions that are
easy to get wrong.
