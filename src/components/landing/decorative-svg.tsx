import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { Gekko } from "@/components/gekko";

const backgrounds = {
  "wall-background": "/wall-background.png",
} as const;

/** An `<img>`-backed decoration loaded from `/public`. */
type ImageDecoration = {
  src: string;
  width: number;
  height: number;
  className: string;
};

/** A decoration rendered from a React SVG component (e.g. the themed Gekko). */
type ComponentDecoration = {
  Component: ComponentType<SVGProps<SVGSVGElement>>;
  width: number;
  height: number;
  className: string;
};

type Decoration = ImageDecoration | ComponentDecoration;

const svgs = {
  "compound-path-17": {
    src: "/CompoundPath%2017.svg",
    width: 400,
    height: 400,
    className: "absolute top-[5svh] -left-[3%] w-[45%] sm:w-[35%] lg:w-[27.78%]",
  },
  "compound-path-18": {
    src: "/CompoundPath%2018.svg",
    width: 450,
    height: 450,
    className: "absolute bottom-0 right-0 w-[48%] sm:w-[38%] lg:w-[31.25%]",
  },
  vector: {
    Component: Gekko,
    width: 200,
    height: 214,
    className: "absolute right-[5%] top-[13svh] h-auto w-[28%] sm:w-[20%] lg:w-[13.89%]",
  },
  design: {
    src: "/Design.svg",
    width: 255,
    height: 269,
    className: "absolute left-[30%] top-[10svh] lg:left-[25%] lg:top-[2svh] z-20 w-[34%] sm:w-[25%] lg:w-[17.71%]",
  },
  marketing: {
    src: "/Markting.svg",
    width: 239,
    height: 253,
    className: "absolute top-[20svh] right-[1svw] lg:right-[3%] lg:top-[30svh] z-20 w-[32%] sm:w-[24%] lg:w-[16.6%] opacity-47",
  },
  multi: {
    src: "/multi.svg",
    width: 283,
    height: 283,
    className: "absolute left-[10%] lg:left-0 bottom-0 lg:-bottom-[15svh] z-20 w-[38%] sm:w-[28%] lg:w-[19.66%] opacity-47",
  },
  comm: {
    src: "/comm.svg",
    width: 283,
    height: 283,
    className: "absolute right-[10%] lg:right-[27.8472%] top-[55svh] lg:top-[60svh] z-20 w-[38%] sm:w-[28%] lg:w-[19.6582%] opacity-47",
  },
  dev: {
    src: "/dev-tag.svg",
    width: 303,
    height: 156,
    className: "absolute left-1/2 -translate-x-3/7 bottom-[4%] z-20 w-[15%] md:w-[5%] opacity-15",
  },
  bshhhhh: {
    src: "/bshhhhh.svg",
    width: 516,
    height: 516,
    className: "absolute hidden lg:block left-[5.50%] top-[23svh] z-0 w-[35.84%]",
  },
} as const satisfies Record<string, Decoration>;

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
  const svg: Decoration = svgs[name];
  const resolvedClassName = className ?? svg.className;

  if ("Component" in svg) {
    const { Component, width, height } = svg;
    return (
      <Component
        width={width}
        height={height}
        className={resolvedClassName}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={svg.src}
      alt=""
      width={svg.width}
      height={svg.height}
      className={resolvedClassName}
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
