import { LockKeyhole, ShieldAlert, type LucideIcon } from "lucide-react";
import type { AccessDenialReason } from "@/lib/auth/jwt";
import { Notice, NoticeLink } from "@/components/notice";

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
  const { icon, status, title, message, href, label } = VARIANTS[reason];

  return (
    <Notice icon={icon} status={status} title={title} message={message}>
      <NoticeLink href={href}>{label}</NoticeLink>
    </Notice>
  );
}
