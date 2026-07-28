import Link from "next/link";
import {getPublicChallenges } from "@/lib/api/challenges";
import ChallengeCard, { Department } from "@/components/challenge-card";

export const dynamic = "force-dynamic";

export default async  function submitChallenge() {  
    const challenges = await getPublicChallenges();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-heading text-white font-bold mb-4">Challenges</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
                <Link key={challenge.id} href={`/submit/${challenge.id}`}>
                    <ChallengeCard
                        key={challenge.id}
                        department={challenge.department as  Department}
                        title={challenge.title}
                        unlocks_at={challenge.unlocks_at}
                        ends_at={challenge.ends_at}
                    />
                </Link>
            ))}
            </div>
        </div>
    );
}
