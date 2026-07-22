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
    className: "absolute  top-[5svh] -left-[3%]",
  },
  "compound-path-18": {
    src: "/CompoundPath%2018.svg",
    width: 450,
    height: 450,
    className: "absolute bottom-0 right-0",
  },
  vector: {
    Component: Gekko,
    width: 200,
    height: 214,
    className: "absolute left-[80.11%] top-[17svh]",
  },
  design: {
    src: "/Design.svg",
    width: 255,
    height: 269,
    className: "absolute left-[16%] top-[2svh] z-20",
  },
  marketing: {
    src: "/Markting.svg",
    width: 239,
    height: 253,
    className: "absolute left-[64.23%] top-[13svh] z-20 opacity-47",
  },
  multi: {
    src: "/multi.svg",
    width: 283,
    height: 283,
    className: "absolute left-[27.85%] top-[70svh] z-20 w-[19.66%] opacity-47",
  },
  comm: {
    src: "/comm.svg",
    width: 283,
    height: 283,
    className: "absolute right-[27.8472%] top-[60svh] z-20 w-[19.6582%] opacity-47",
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
