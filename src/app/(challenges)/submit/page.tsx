import ChallengesGrid from "@/components/challenges-grid";

export default function submitChallenge() {  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-heading text-white font-bold mb-4">Challenges</h1>
            <ChallengesGrid />
        </div>
    );
}
