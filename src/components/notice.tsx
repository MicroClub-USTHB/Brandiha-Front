import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The full-page stand-in for a page that can't be shown — a denied access
 * check, a route that doesn't exist, a render that threw.
 *
 * Everything sits on the dark paint wall from the root layout's
 * `SiteBackground`, so this uses explicit white rather than `foreground`, which
 * resolves dark in every theme. Same reasoning as the dashboard header.
 *
 * Actions go in as children so a caller can offer a link, a retry button, or
 * both, without this component knowing which.
 */
export function Notice({
  icon: Icon,
  status,
  title,
  message,
  children,
}: {
  icon: LucideIcon;
  /** The HTTP status this stands in for, shown small above the title. */
  status?: number;
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center font-sans">
      <Icon className="size-10 text-white/60" aria-hidden />
      {status !== undefined && (
        <p className="font-mono text-sm text-white/50">{status}</p>
      )}
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
        {title}
      </h1>
      <p className="text-white/70">{message}</p>
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </main>
  );
}

/** Shared button shape for a notice's actions, so a link and a retry match. */
export const NOTICE_ACTION_CLASS =
  "rounded-md px-4 py-2 text-sm font-semibold transition-colors";

/** Primary action: the one thing we'd like them to do next. */
export function NoticeLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        NOTICE_ACTION_CLASS,
        "bg-primary text-primary-foreground hover:bg-primary/90",
      )}
    >
      {children}
    </Link>
  );
}
