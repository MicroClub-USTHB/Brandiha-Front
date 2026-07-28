import React from 'react';

interface CustomSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number; // Pour ajuster la taille facilement si besoin
  Color?: string; // Pour personnaliser la couleur orange si nécessaire
  darkColor?: string;   // Pour personnaliser la couleur sombre
}

export const ChallengeBackground: React.FC<CustomSvgProps> = ({
  className = '',
  Color = '#EE6818',
  darkColor = '#322D2D',
  ...props
}) => {
  return (
    <svg
      width="237"
      height="458"
      viewBox="0 0 237 458"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full  ${className}`}
      {...props}
    >
      <path
        d="M26.8335 374.411L220.831 383.917L215.375 294.684L223.693 182.147L7.4248 187.667L26.8335 374.411Z"
        fill={darkColor}
      />
      <path
        d="M7.34126 187.054L14.7593 258.502L15.7487 213.424L36.4092 187.055L7.34126 187.054Z"
        fill={Color}
      />
      <path
        d="M220.737 383.611L215.372 294.063L214.924 373.79L174.586 381.15L220.737 383.611Z"
        fill={Color}
      />
      <path
        d="M223.782 181.84L215.464 293.766L216.895 206.066L115.201 185.521L223.782 181.84Z"
        fill={Color}
      />
    </svg>
  );
};