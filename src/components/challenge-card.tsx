import  {ChallengeBackground} from './challenge-background';
import  Link  from 'next/link';
interface ChallengeCardProps {
  link: string;
  size?: number;
  Color?: string;
  darkColor?: string;
}
export default function ChallengeCard({ link, size, Color, darkColor }: ChallengeCardProps) {
    return (
        <div className="relative w-60 h-114">
            <Link href={link}>
                <ChallengeBackground  
                size={size}
                Color={Color}
                darkColor={darkColor}
                className="absolute inset-0"
            />
            </Link>   
        </div>
    );
}
