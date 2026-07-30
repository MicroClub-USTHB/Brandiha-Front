"use client";

import { ServerCrash } from "lucide-react";

import "./globals.css";

/**
 * Last resort: an error thrown by the root layout itself, which `error.tsx`
 * sits inside of and so cannot catch. Next replaces the whole document here, so
 * this file has to supply its own `<html>` and `<body>` — there is no layout,
 * no `ThemeProvider`, and no paint wall behind it.
 *
 * That is why it doesn't use `Notice`: with no wall to sit on, white-on-dark
 * would be white-on-white. It falls back to the plain `background`/`foreground`
 * tokens, which `globals.css` defines on `:root` and so still resolve without
 * a theme attribute.
 *
 * Kept deliberately dependency-light. Anything clever in here risks failing for
 * the same reason the layout just did.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center font-sans">
          <ServerCrash className="size-10 text-muted-foreground" aria-hidden />
          <p className="font-mono text-sm text-muted-foreground">500</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide">
            Brandiha is having a moment
          </h1>
          <p className="text-muted-foreground">
            Something failed before the page could be built. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground/70">
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
