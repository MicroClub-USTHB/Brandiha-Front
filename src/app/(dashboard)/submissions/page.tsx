import Link from "next/link";
import {getPublicChallenges } from "@/lib/api/challenges";
import ChallengeCard, { Department } from "@/components/challenge-card";
import { checkAccess } from "@/lib/auth/session";
import { AccessNotice } from "@/components/auth/access-notice";

export const dynamic = "force-dynamic";

export default async  function submissionChallenge() {
    // Picks a challenge to review submissions for, so it needs the same staff
    // roles as the detail page it links into (`get_current_staff`).
    const access = await checkAccess("admin", "super_admin");
    if (!access.ok) return <AccessNotice reason={access.reason} />;

    const result = await getPublicChallenges();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-heading text-white font-bold mb-4">Challenges</h1>
            {!result.ok ? (
                <p className="font-sans text-destructive">{result.error}</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.data.map((challenge) => (
                <Link key={challenge.id} href={`/submissions/${challenge.id}`}>
                    <ChallengeCard
                        department={challenge.department as  Department}
                        title={challenge.title}
                        unlocks_at={challenge.unlocks_at}
                        ends_at={challenge.ends_at ?? undefined}
                    />
                </Link>
            ))}
            </div>
            )}
        </div>
    );
}