import LeaderboardRow from "./leaderboard-row";

export default async function LeaderboardComponent( ) {
        return (
            <div className="flex-col items-center justify-center ">
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={2} teamName="berbochi" score={2015} />
                    <LeaderboardRow rank={3} teamName="berbochi" score={140} /> 
                    <LeaderboardRow rank={4} teamName="berbochi" score={8999} />
                    {/*<LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} />
                    <LeaderboardRow rank={1} teamName="berbochi" score={8999} /> */}
                  </div> 
        )
    }