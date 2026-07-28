import LeaderboardComponent from "@/components/leaderboard/leaderboard";

export default function Leaderboard() {
  return (
    <div className="flex flex-col items-center justify-start gap-2 min-h-screen">
      <h1 className="text-8xl font-heading text-white font-bold mb-4">
        Leaderboard
      </h1>
    < LeaderboardComponent/>
    </div>
  );
}
