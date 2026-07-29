import LeaderboardRow from "./leaderboard-row";
import { getGlobalLeaderboard } from "@/lib/api/leaderboard";

export default async function LeaderboardComponent( ) {
    const leaderboardData = await getGlobalLeaderboard();
    console.log("Leaderboard Data:", leaderboardData);
        return (
            <div className="flex-col items-center justify-center ">
                    <LeaderboardRow rank={1} teamName="mouss w yakuza" score={8999} />
                    <LeaderboardRow rank={2} teamName="mottenmenschen" score={2015} />
                    <LeaderboardRow rank={3} teamName="los galacticos" score={140} /> 
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