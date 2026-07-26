"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getRegistration } from "@/lib/api/registrations";
import type { RegistrationDetail } from "@/lib/api/registration-types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RegistrationDetails } from "@/components/hr/registration-details";

/**
 * Body that fetches one registration. Mounted fresh per member (via `key`), so
 * its state resets on change without synchronous setState in the effect.
 */
function MemberDetailBody({ registrationId }: { registrationId: string }) {
  const [state, setState] = useState<{
    data?: RegistrationDetail;
    error?: string;
  }>({});

  useEffect(() => {
    let active = true;
    getRegistration(registrationId).then((res) => {
      if (!active) return;
      setState(res.ok ? { data: res.data } : { error: res.error });
    });
    return () => {
      active = false;
    };
  }, [registrationId]);

  const { data, error } = state;

  return (
    <>
      <SheetHeader>
        <SheetTitle>{data?.user_full_name ?? "Registration"}</SheetTitle>
        <SheetDescription>
          {data?.user_email ?? (error ? "" : "Loading…")}
        </SheetDescription>
      </SheetHeader>
      <div className="px-4 pb-6">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : data ? (
          <>
            <RegistrationDetails r={data} showAudit={false} />
            <div className="mt-6 border-t border-border pt-4 text-center">
              <Link
                href={`/rh?registration-id=${data.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
              >
                <ExternalLink className="size-3.5" />
                Open full page
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
      </div>
    </>
  );
}

/** Side drawer showing a member's full registration, fetched on open. */
export function MemberDetail({
  registrationId,
  onClose,
}: {
  registrationId: string | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={registrationId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto data-[side=right]:sm:max-w-lg">
        {registrationId ? (
          <MemberDetailBody key={registrationId} registrationId={registrationId} />
        ) : (
          <SheetHeader>
            <SheetTitle>Registration</SheetTitle>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
}
