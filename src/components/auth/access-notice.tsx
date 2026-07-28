import Link from "next/link";
import { LockKeyhole, ShieldAlert, type LucideIcon } from "lucide-react";
import type { AccessDenialReason } from "@/lib/auth/jwt";

/** Copy and affordance per denial reason, keyed by `AccessDenialReason`. */
const VARIANTS: Record<
  AccessDenialReason,
  { icon: LucideIcon; status: number; title: string; message: string; href: string; label: string }
> = {
  unauthenticated: {
    icon: LockKeyhole,
    status: 401,
    title: "Not signed in",
    message: "Your session has ended, or it couldn't be verified. Sign in again to continue.",
    href: "/login",
    label: "Go to login",
  },
  forbidden: {
    icon: ShieldAlert,
    status: 403,
    title: "Unauthorized Access",
    // Sends them home rather than to /login: they *are* signed in, so the proxy
    // would bounce them straight off /login and back onto this same notice.
    message:
      "Your account doesn't have permission to view this page. If that seems wrong, ask an admin to check your role.",
    href: "/",
    label: "Back to home",
  },
};

/**
 * Shown in place of a page when `checkAccess()` denies it. Deliberately a plain
 * component rather than Next's `unauthorized.tsx` / `forbidden.tsx` conventions,
 * which need the experimental `authInterrupts` flag — so the response stays a
 * 200 and each page renders this itself.
 */
export function AccessNotice({ reason }: { reason: AccessDenialReason }) {
  const { icon: Icon, status, title, message, href, label } = VARIANTS[reason];

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center font-sans">
      {/* The dashboard shell sits on the dark paint wall, so this follows the
          header and HR pages in using explicit white rather than `foreground`,
          which resolves dark in every theme. */}
      <Icon className="size-10 text-white/60" aria-hidden />
      <p className="font-mono text-sm text-white/50">{status}</p>
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
        {title}
      </h1>
      <p className="text-white/70">{message}</p>
      <Link
        href={href}
        className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {label}
      </Link>
    </main>
  );
}
