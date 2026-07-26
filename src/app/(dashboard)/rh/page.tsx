import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getRegistration } from "@/lib/api/registrations";
import { RegistrationDetails } from "@/components/hr/registration-details";
import { ShareButton } from "@/components/hr/share-button";

type Props = {
  searchParams: Promise<{ "registration-id"?: string }>;
};

export default async function RhPage(props: Props) {
  const session = await getSession();
  if (!session) redirect("/login?from=/rh");

  const searchParams = await props.searchParams;
  const registrationId = searchParams["registration-id"];
  if (!registrationId) redirect("/hr");

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
