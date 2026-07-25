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

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm break-words">{children}</dd>
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 border-b border-border pb-1.5 font-heading text-sm font-bold uppercase tracking-wide">
        {title}
      </h3>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Details({ r }: { r: RegistrationDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Status
        </span>
        <StatusBadge status={r.status} />
      </div>

      <Section title="Team & Background">
        <Field label="Team" full>
          <span className="capitalize">{r.team_name}</span>{" "}
          <span className="font-mono text-xs text-muted-foreground">
            ({r.team_secret_code})
          </span>
        </Field>
        <Field label="Department">
          <span className="capitalize">{r.department}</span>
        </Field>
        <Field label="Participated before">{yesNo(r.participated_before)}</Field>
        <Field label="Previous competitions" full>
          {orDash(r.previous_competitions)}
        </Field>
        <Field label="What they know about Brandiha" full>
          {orDash(r.knowledge_about_brandiha)}
        </Field>
      </Section>

      <Section title="Portfolio & Motivation">
        <Field label="Skills" full>
          {orDash(r.skills)}
        </Field>
        <Field label="Tools" full>
          {r.tools.length ? r.tools.join(", ") : "—"}
        </Field>
        <Field label="Portfolio" full>
          {r.portfolio_url ? <ExtLink href={r.portfolio_url} /> : "—"}
        </Field>
        <Field label="Other links" full>
          {r.other_links.length ? (
            <div className="flex flex-col gap-1">
              {r.other_links.map((l) => (
                <ExtLink key={l} href={l} />
              ))}
            </div>
          ) : (
            "—"
          )}
        </Field>
        <Field label="Motivation" full>
          {orDash(r.motivation)}
        </Field>
      </Section>

      <Section title="Availability">
        <Field label="Available during event">
          <span className="capitalize">{r.available_during_event}</span>
        </Field>
        <Field label="T-shirt size">{r.t_shirt_size}</Field>
        <Field label="Availability note" full>
          {orDash(r.availability_note)}
        </Field>
        <Field label="Food allergies" full>
          {orDash(r.food_allergies)}
        </Field>
        <Field label="Okay with photos">{yesNo(r.okay_with_photos)}</Field>
        <Field label="Additional notes" full>
          {orDash(r.additional_notes)}
        </Field>
      </Section>
    </div>
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
