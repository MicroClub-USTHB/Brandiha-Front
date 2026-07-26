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
    <>
      <DashboardHeader userName={session?.name} userRole={session?.role} />
      {children}
    </>
  );
}
