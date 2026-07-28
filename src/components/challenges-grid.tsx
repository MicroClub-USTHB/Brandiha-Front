import ChallengeCard from "./challenge-card";
export default  function ChallengesGrid() {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 gap-4">
                <ChallengeCard title="Marketing"/>
                <ChallengeCard title="Design"/>
                <ChallengeCard title="Multimedia"/>
                <ChallengeCard title="Communication"/>
            </div>
        );
    }