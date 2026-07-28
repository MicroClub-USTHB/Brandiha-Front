import  {ChallengeBackground} from './challenge-background';
import  Link  from 'next/link';
interface ChallengeCardProps {
  link: string;
  title?: string;
  Color?: string;
  darkColor?: string;
}
export default function ChallengeCard({ link, title, Color, darkColor }: ChallengeCardProps) {
    return (
            <Link href={link} className="border relative block w-full max-w-[237px] aspect-[237/458] p-6 flex flex-col justify-end hover:scale-105 transition-transform duration-200">
                <ChallengeBackground  
                Color={Color}
                darkColor={darkColor}
                className="absolute inset-0 w-full h-full -z-10"
            />
                <div className="relative z-10 text-white font-bold text-center text-lg">
        {title}
      </div>
            </Link> 
    );
}
