import Link from "next/link";
import { checkAccess } from "@/lib/auth/session";
import { getRegistration } from "@/lib/api/registrations";
import { AccessNotice } from "@/components/auth/access-notice";
import { RegistrationDetails } from "@/components/hr/registration-details";
import { ShareButton } from "@/components/hr/share-button";

type Props = {
  params: Promise<{ "registration-id": string }>;
};

/** Detail view for one registration, deep-linked from the HR board and shareable. */
export default async function RegistrationPage(props: Props) {
  // `/registrations` is admin-only on the backend (`get_current_admin`).
  const access = await checkAccess("admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const { "registration-id": registrationId } = await props.params;

  const result = await getRegistration(registrationId);
  if (!result.ok) {
    return (
      <main className="mx-auto max-w-4xl p-6 font-sans">
        <p className="text-destructive">{result.error}</p>
        <Link
          href="/hr"
          className="mt-4 inline-block text-sm text-primary underline underline-offset-2"
        >
          &larr; Back to HR
        </Link>
      </main>
    );
  }

  const r = result.data;

  return (
    <main className="mx-auto max-w-4xl p-6 font-sans">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
            {r.user_full_name}
          </h1>
          <p className="text-sm text-muted-foreground">{r.user_email}</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          <Link
            href="/hr"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            &larr; Back to HR
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
        <RegistrationDetails r={r} />
      </div>
    </main>
  );
}
