import  ChallengeCard  from "./challenge-card";

export default  function ChallengesGrid() {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap- border-2 ">
                <ChallengeCard link="/challenges/1" Color="#249AFF" />
                <ChallengeCard link="/challenges/2" Color="#EE6818" />
                <ChallengeCard link="/challenges/3" Color="#00C6B5" />
                <ChallengeCard link="/challenges/4" Color="#EB367B" />
                <p>imad eddine </p>
            </div>
        );
    }