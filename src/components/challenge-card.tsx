interface ChallengeCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export default function ChallengeCrd({ title, description, imageUrl, onClick }: ChallengeCardProps) {
  return (
    <div className="w-65 h-35 md:w-100 md:h-55 2xl:w-150 2xl:h-80 bg-[url('/Subtract.svg')] bg-contain bg-center bg-no-repeat flex-col items-center justify-center border p-4">
      <h1 className="text-2xl font-bold text-orange text-center">
        {title}
      </h1>
      
    </div>
  );
}