import Image from "next/image";

const backgrounds = {
  "wall-background": "/wall-background.png",
} as const;

const svgs = {
  "compound-path-17": {
    src: "/CompoundPath%2017.svg",
    width: 500,
    height: 500,
    className: "absolute top-[-5svh] -left-[3%] md:top-[5svh]",
  },
  "compound-path-18": {
    src: "/CompoundPath%2018.svg",
    width: 500,
    height: 500,
    className: "absolute top-[60svh] right-0",
  },
  vector: {
    src: "/Vector.svg",
    width: 100,
    height: 100,
    className: "absolute left-[86.11%] top-[21svh]",
  },
  design: {
    src: "/Design.svg",
    width: 255,
    height: 269,
    className: "absolute left-[16%] top-[-2svh] z-20 md:top-[2svh]",
  },
  marketing: {
    src: "/Markting.svg",
    width: 239,
    height: 253,
    className: "absolute left-[54.23%] top-[17svh] z-20 opacity-47",
  },
  multi: {
    src: "/multi.svg",
    width: 283,
    height: 283,
    className: "absolute left-[23.85%] top-[85svh] z-20 w-[19.66%] opacity-47 md:left-[43.85%]",
  },
  comm: {
    src: "/comm.svg",
    width: 283,
    height: 283,
    className: "absolute left-[17.8472%] top-[595px] z-20 w-[19.6582%] opacity-47 md:left-[47.8472%] md:top-[75svh]",
  },
  bshhhhh: {
    src: "/bshhhhh.svg",
    width: 516,
    height: 516,
    className: "absolute left-[5.50%] top-[600px] z-0 w-[35.84%] md:top-[42svh]",
  },
} as const;

export type DecorativeSvgName = keyof typeof svgs;
export type BackgroundName = keyof typeof backgrounds;

interface DecorativeSvgProps {
  name: DecorativeSvgName;
  className?: string;
}

interface BackgroundDecorationProps {
  name: BackgroundName;
  className?: string;
}

export function DecorativeSvg({ name, className }: DecorativeSvgProps) {
  const svg = svgs[name];
  return (
    <Image
      src={svg.src}
      alt=""
      width={svg.width}
      height={svg.height}
      className={className ?? svg.className}
    />
  );
}

export function BackgroundDecoration({ name, className }: BackgroundDecorationProps) {
  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${backgrounds[name]})` }}
    />
  );
}
