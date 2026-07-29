import ChallengeGrid from "@/components/challenge-grid";
import { checkAccess } from "@/lib/auth/session";
import { AccessNotice } from "@/components/auth/access-notice";

export const dynamic = "force-dynamic";

/** Picks a challenge to review submissions for. */
export default async function SubmissionsIndexPage() {
  // Needs the same staff roles as the detail page it links into
  // (`get_current_staff`).
  const access = await checkAccess("admin", "super_admin");
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  return <ChallengeGrid hrefPrefix="/submissions" />;
}
