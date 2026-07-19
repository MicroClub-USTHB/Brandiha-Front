# Contributing to Brandiha

Thanks for contributing! This guide covers the workflow and conventions for the
Brandiha front-end (Next.js App Router, React 19, Tailwind CSS v4, shadcn/ui).

## Getting set up

See the [README](./README.md) for the basics. In short:

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Use **pnpm** — the repo is pinned to it (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).
Don't commit an `npm` or `yarn` lockfile.

## Branching

- `main` — production. Do not commit to it directly.
- `dev` — integration branch. **All PRs target `dev`.**
- Work on a short-lived branch off `dev`, named by type:
  - `feat/<short-name>` — new feature
  - `fix/<short-name>` — bug fix
  - `refactor/<short-name>`, `docs/<short-name>`, `chore/<short-name>`

```bash
git switch dev && git pull
git switch -c feat/my-feature
```

## Commits

- **Conventional Commits**: `type(scope): summary` — e.g. `feat(landing): add hero section`, `fix(button): correct disabled styles`.
  Types in use: `feat`, `fix`, `refactor`, `docs`, `chore`.
- **One logical concern per commit.** Keep them small so they're easy to review, revert, and bisect. If a change touches multiple concerns, split it.
- Write clear messages; do not add automated attribution trailers (e.g. `Co-Authored-By` / tool-generated lines).

## Before opening a PR

Run the checks locally — CI runs them too:

```bash
pnpm lint     # eslint
pnpm build    # production build must succeed
```

Always re-run these after resolving merge conflicts — a clean `git merge` is not a compiling merge.

## Code conventions (essentials)

- **UI:** use shadcn/ui primitives from `src/components/ui/` — never hand-roll equivalents or add a competing UI library. Add new primitives with the shadcn CLI (`pnpm dlx shadcn@latest add <component>`).
- **Colors:** only semantic Tailwind tokens that resolve to CSS variables in `src/app/globals.css` (`bg-primary`, `text-foreground`, …). No raw `bg-red-500`, hex, or `oklch(...)` in components.
- **Class merging:** compose conditional classes with the `cn` helper from `src/lib/utils.ts`; don't concatenate class strings by hand.
- **Icons:** use `lucide-react`.
- **Atomic components:** one responsibility each; keep components small and push shared logic into hooks (`use-*`) or helpers in `src/lib/`.
- **Imports:** always use the `@/...` alias, never `../../`.
- **Server vs client:** prefer Server Components; add `"use client"` only when a component needs interactivity or browser APIs.
- **Consistency-first:** find an analogous component and mirror its structure before inventing a new pattern.

## Pull requests

- Target `dev`, keep the scope focused, and fill in what changed and why.
- Make sure `pnpm lint` and `pnpm build` both pass.
- Include screenshots or a short clip for any visible UI change.
- Document any deliberate deviation from a convention in the PR description.
