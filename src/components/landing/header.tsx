"use client";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ThemePicker } from "../theme-picker";
import { useTheme } from "next-themes";

const useIsClient = () => useSyncExternalStore(() => () => {}, () => true, () => false);

function getActiveEffectButton(theme?: string) {
  switch (theme) {
    case "design":
      return "/activeButton-Design.svg";

    case "multimedia":
      return "/activeButton-Multimedia.svg";

    case "communication":
      return "/activeButton-Communication.svg";

    case "marketing":
      return "/activeButton-Marketing.svg";

    case "chameleon":
    default:
      return "/activeButton-Default.svg";
  }
}

function getActiveEffectLogo(theme?: string) {
  switch (theme) {
    case "design":
      return "/activeLogo-Design.svg";

    case "multimedia":
      return "/activeLogo-Multimedia.svg";

    case "communication":
      return "/activeLogo-Communication.svg";

    case "marketing":
      return "/activeLogo-Marketing.svg";

    case "chameleon":
    default:
      return "/nav-logo.svg";
  }
}

export function Header() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const activeButton = getActiveEffectButton(isClient ? theme : undefined);
  const activeLogo = getActiveEffectLogo(isClient ? theme : undefined);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#000000]">
      <div className="mx-auto flex h-24 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src={activeLogo}
            alt="Brandiha"
            width={253}
            height={62}
            draggable={false}
            className="h-12"
            priority
          />
        </Link>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemePicker />
          <Link href="/register">
            <Image
              src={activeButton}
              alt="Join"
              width={211}
              height={69}
              draggable={false}
              className="h-15"
              priority
            />
          </Link>
        </div>
      </div>
      <Image
        src="/fall-paint.svg"
        alt=""
        width={337}
        height={125}
        draggable={false}
        className="absolute top-[99%] left-0"
      />
    </header>
  );
}

