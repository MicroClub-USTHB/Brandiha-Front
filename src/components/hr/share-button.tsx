"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ShareButton() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  /**
   * `writeText` rejects rather than returning false — on a page served over
   * plain HTTP, or where the user has denied clipboard access. Unhandled, that
   * left the button silently claiming nothing and logging to the console; now
   * it says so, and the URL is in the address bar to copy by hand either way.
   */
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
    >
      {state === "copied" ? (
        <>
          <Check className="size-4 text-success" />
          Copied
        </>
      ) : state === "failed" ? (
        <>
          <Copy className="size-4 text-destructive" />
          Couldn&rsquo;t copy
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Share
        </>
      )}
    </button>
  );
}
