"use client";

import { useEffect, useState } from "react";
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
          <RegistrationDetails r={data} />
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
