import Gekko from "@/components/gekko";
import Image from "next/image";

interface LeaderboardRowProps {
    rank: number ;
    teamName: string;
    score: number;
}

export default function LeaderboardRow({rank,teamName,score} : LeaderboardRowProps) {
    return (
        <div className="w-200 h-15 2xl:w-290 2xl:h-25  bg-[#E9DFD4] py-2 px-4 flex  items-center justify-between mb-2">
          <div className="flex flex-row items-center justify-start gap-4">
            {rank === 1 && <Image height={22} width={22} src="/gold.svg" alt="Gold Medal" className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"/>}
            {rank === 2 && <Image height={22} width={22} src="/silver.svg" alt="Silver Medal" className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"/>}
            {rank === 3 && <Image height={22} width={22} src="/bronze.svg" alt="Bronze Medal" className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"/>}
            {rank > 3 && 
              <span className="text-5xl 2xl:text-7xl lg:mb-3 2xl:mb-3 h-22 w-22 2xl:w-35 2xl:h-35 flex items-center justify-center font-heading font-bold text-center text-black">
                {rank}
              </span>
            }
            <h1 className=" ml-2 flex items-center justify-center">
              <span className="text-5xl 2xl:text-7xl lg:mb-3 2xl:mb-3 font-heading text-black font-bold ">
                {teamName}
              </span>
            </h1>
          </div>
          <h1 className="h-full w-40 2xl:w-60 2xl:h-35  text-center text-black bg-[url('/timer-default.svg')] bg-contain bg-center bg-no-repeat flex items-center justify-center">
            <span className="text-4xl 2xl:text-7xl lg:mb-3 2xl:mb-3 font-heading text-black font-bold ">
                {score}
            </span>
          </h1>
        </div>
    )
}