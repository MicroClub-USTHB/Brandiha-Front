import { getSession } from "@/lib/auth/session";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

/** Shared shell (header) for the authenticated staff dashboard. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    // `--shell-offset` is the header's height, and the one place it's defined —
    // the header reads it too. Published to the content below so a page that
    // wants to fill the viewport can subtract the strip the header already
    // occupies: the header is `sticky`, so it stays in flow and its height comes
    // out of what's left for the page.
    <div className="[--shell-offset:3.5rem]">
      <DashboardHeader userName={session?.name} userRole={session?.role} />
      {children}
    </div>
  );
}
