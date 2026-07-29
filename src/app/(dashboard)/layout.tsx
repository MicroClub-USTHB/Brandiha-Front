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
    // A screen-tall column: the header takes its own height off the top and the
    // page below fills whatever is left. That's what lets a page fill the screen
    // without knowing the header's height — the header is `sticky`, so it stays
    // in flow and really does take that space.
    <div className="min-h-screen flex flex-col">
      <DashboardHeader userName={session?.name} userRole={session?.role} />
      {children}
    </div>
  );
}
