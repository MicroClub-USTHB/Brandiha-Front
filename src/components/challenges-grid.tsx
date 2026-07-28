import Link from "next/link";
import ChallengeCard from "./challenge-card";
import {getPublicChallenges } from "@/lib/api/challenges";
import { Department } from "./challenge-card";

interface ChallengesGridProps {
    link: string;
}
export default async function ChallengesGrid({ link }: ChallengesGridProps) {
    
    const challenges = await getPublicChallenges();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
                <Link key={challenge.id} href={link}>
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
    );
}