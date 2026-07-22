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
- **pnpm** (Node 24). Use pnpm only; do not introduce npm/yarn lockfiles.

## Commands

```bash
pnpm install
pnpm dev      # dev server at http://localhost:3000
pnpm lint     # eslint — must be clean
pnpm build    # production build — must pass
```

There is **no test suite** yet. "Verified" means `pnpm lint` and `pnpm build`
both pass; run them after any non-trivial change.

## Project layout

```
src/
  app/
    page.tsx               # Landing page
    register/page.tsx      # Registration page
    globals.css            # Tailwind v4 config + theme CSS variables
    layout.tsx             # Root layout (ThemeProvider, fonts)
  components/
    ui/                    # shadcn primitives — add via CLI
    landing/               # Landing page sections (hero, about, agenda, authors, footer, header, section)
    register/              # Registration form (registration-form.tsx)
    form.tsx               # FormInput, FormTextarea, FormSelect, FormCheckbox wrappers
    theme-picker.tsx       # Theme picker UI
    theme-provider.tsx     # "use client" boundary for next-themes
  hooks/
    use-registration-form.tsx  # Multi-step form logic (react-hook-form + Zod)
  lib/
    utils.ts               # cn() helper
    themes.ts              # Theme list (single source of truth)
    registration-fields.ts # Step/field definitions for the registration form
    validators/
      registration-schema.ts  # Zod schema (superRefine for AvailabilityMessage)
```

## Conventions (the ones that matter)

- **Imports use the `@/…` alias** (maps to `src/`). Never `../../`.
- **UI primitives come from `src/components/ui/`.** Add new ones with the shadcn
  CLI (`pnpm dlx shadcn@latest add <component>`) — do not hand-roll them or add a
  competing UI library. They're Radix under the hood.
- **Colors are semantic tokens only** — `bg-background`, `text-foreground`,
  `bg-primary`, etc., which resolve to CSS variables in `globals.css`. No raw
  Tailwind palette (`bg-red-500`), hex, or inline `oklch(...)` in components.
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
- The theme list lives in `src/lib/themes.ts` — the single source of truth shared
  by the provider (`theme-provider.tsx`) and the picker (`theme-picker.tsx`). To
  add or change a theme, edit both `themes.ts` and the matching `globals.css`
  block. Brand colors are authored in hex, then converted to oklch.

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
