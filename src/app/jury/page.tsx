import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/jury/logout-button";

/**
 * Minimal protected landing for authenticated jury/staff. Middleware already
 * gates `/jury/*` on cookie presence; this re-checks authoritatively via
 * `getSession()` (backend `/auth/me`) and is where the real dashboard goes.
 */
export default async function JuryHomePage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/jury");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground">
        Jury Area
      </h1>
      <p className="font-sans text-muted-foreground">
        Signed in as{" "}
        <span className="font-semibold text-foreground">
          {session.name ?? session.email ?? session.judgeId}
        </span>{" "}
        ({session.role}).
      </p>
      <LogoutButton />
    </main>
  );
}
