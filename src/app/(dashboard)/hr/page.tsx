import { Users } from "lucide-react";

import { checkAccess } from "@/lib/auth/session";
import { listTeams } from "@/lib/api/teams";
import { AccessNotice } from "@/components/auth/access-notice";
import { HrPageClient } from "@/components/hr/hr-page-client";
import { Notice } from "@/components/notice";

/** HR view: one card per team, with drag-and-drop to move members between teams. */
export default async function HrPage() {
  // `/teams` is admin-only on the backend (`get_current_admin`).
  const access = await checkAccess("admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  const teamsResult = await listTeams();

  if (!teamsResult.ok) return <Notice icon={Users} title="Teams" message={teamsResult.error} />;

  return (
    <main className="mx-auto max-w-6xl p-6 font-sans">
      <HrPageClient teams={teamsResult.data} />
    </main>
  );
}
