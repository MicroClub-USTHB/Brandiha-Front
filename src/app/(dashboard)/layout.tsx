import { DashboardHeader } from "@/components/dashboard/dashboard-header";

/** Shared shell (header) for the authenticated staff dashboard. */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}
