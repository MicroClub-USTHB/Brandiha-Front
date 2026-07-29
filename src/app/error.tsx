"use client";

import { AlertTriangle } from "lucide-react";

import { Notice, NoticeLink, NOTICE_ACTION_CLASS } from "@/components/notice";
import { cn } from "@/lib/utils";

/**
 * Catches a render or data-fetch error anywhere below the root layout and
 * offers a retry, instead of the blank default error page.
 *
 * `error.tsx` must be a Client Component — Next needs `reset` to re-render the
 * segment on the client. The message itself is never shown: in production Next
 * replaces it with a generic string anyway, and in development it could carry
 * backend detail that means nothing to a visitor. The digest is shown so a
 * report can be matched to a server log.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Notice
      icon={AlertTriangle}
      status={500}
      title="Something went wrong"
      message="This page didn't load. Trying again often clears it — the problem is usually a moment's trouble reaching the server."
    >
      <button
        type="button"
        onClick={reset}
        className={cn(
          NOTICE_ACTION_CLASS,
          "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        Try again
      </button>
      <NoticeLink href="/">Back to home</NoticeLink>
      {error.digest && (
        <p className="w-full font-mono text-xs text-white/40">
          Reference: {error.digest}
        </p>
      )}
    </Notice>
  );
}
