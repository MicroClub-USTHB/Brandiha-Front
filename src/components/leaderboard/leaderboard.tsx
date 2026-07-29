import LeaderboardRow from "./leaderboard-row";
import { getGlobalLeaderboard, LeaderboardEntry } from "@/lib/api/leaderboard";

export default async function LeaderboardComponent( ) {
    const leaderboardData: LeaderboardEntry[] = await getGlobalLeaderboard();
  console.log("Leaderboard Data:", leaderboardData);

  // Cas où l'API est vide ou renvoie une erreur
  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-xl font-heading text-black">
          Aucun classement disponible pour le moment.
        </p>
      </div>
    );
  }
        return (
            <div className="flex flex-col items-center justify-center">
      {leaderboardData.map((team, index) => (
        <LeaderboardRow
          key={`${team.team_name}-${index}`}
          rank={index + 1}
          teamName={team.team_name}
          score={team.total_score}
        />
      ))}
    </div>
            // <div className="flex-col items-center justify-center ">
            //         <LeaderboardRow rank={1} teamName="mouss w yakuza" score={8999} />
            //         <LeaderboardRow rank={2} teamName="mottenmenschen" score={2015} />
            //         <LeaderboardRow rank={3} teamName="los galacticos" score={140} /> 
            //         <LeaderboardRow rank={4} teamName="berbochi" score={8999} />
            // </div> 
        )
    }