"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getRegistration } from "@/lib/api/registrations";
import type { RegistrationDetail } from "@/lib/api/registration-types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/hr/status-badge";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 break-words">{children}</dd>
    </div>
  );
}

const yesNo = (v: boolean) => (v ? "Yes" : "No");
const orDash = (v: string | null | undefined) => (v && v.trim() ? v : "—");

function ExtLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-primary underline underline-offset-2"
    >
      {href}
    </a>
  );
}

function Details({ r }: { r: RegistrationDetail }) {
  return (
    <dl className="divide-y divide-border">
      <Row label="Status">
        <StatusBadge status={r.status} />
      </Row>
      <Row label="Team">
        <span className="capitalize">{r.team_name}</span>{" "}
        <span className="font-mono text-xs text-muted-foreground">
          ({r.team_secret_code})
        </span>
      </Row>
      <Row label="Department">
        <span className="capitalize">{r.department}</span>
      </Row>
      <Row label="Skills">{orDash(r.skills)}</Row>
      <Row label="Tools">{r.tools.length ? r.tools.join(", ") : "—"}</Row>
      <Row label="Portfolio">
        {r.portfolio_url ? <ExtLink href={r.portfolio_url} /> : "—"}
      </Row>
      <Row label="Other links">
        {r.other_links.length ? (
          <div className="flex flex-col gap-1">
            {r.other_links.map((l) => (
              <ExtLink key={l} href={l} />
            ))}
          </div>
        ) : (
          "—"
        )}
      </Row>
      <Row label="Motivation">{orDash(r.motivation)}</Row>
      <Row label="Knows Brandiha via">{orDash(r.knowledge_about_brandiha)}</Row>
      <Row label="Participated before">{yesNo(r.participated_before)}</Row>
      <Row label="Previous competitions">{orDash(r.previous_competitions)}</Row>
      <Row label="Available">
        <span className="capitalize">{r.available_during_event}</span>
      </Row>
      <Row label="Availability note">{orDash(r.availability_note)}</Row>
      <Row label="Food allergies">{orDash(r.food_allergies)}</Row>
      <Row label="Photo consent">{yesNo(r.okay_with_photos)}</Row>
      <Row label="T-shirt">{r.t_shirt_size}</Row>
      <Row label="Additional notes">{orDash(r.additional_notes)}</Row>
    </dl>
  );
}

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
          <Details r={data} />
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
      <SheetContent className="overflow-y-auto sm:max-w-md">
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
