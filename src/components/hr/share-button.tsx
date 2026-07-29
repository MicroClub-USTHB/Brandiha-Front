"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
    >
      {copied ? (
        <>
          <Check className="size-4 text-success" />
          Copied
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
