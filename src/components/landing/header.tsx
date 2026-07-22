"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/landing/nav-bar";
import { ThemePicker } from "../theme-picker";
import { useTheme } from "next-themes";

function getActiveEffectButton(theme?: string) {
  switch (theme) {
    case "design":
      return "/activeButton-Design.svg";

    case "multimedia":
      return "/activeButton-Multimedia.svg";

    case "communication":
      return "/activeButton-Communication.svg";

    case "marketing":
      return "/join-button.svg";

    case "default":
    default:
      return "/join-button.svg";
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

    case "default":
    default:
      return "/nav-logo.svg";
  }
}

export function Header() {
  const { theme } = useTheme();
  const activeButton = getActiveEffectButton(theme);
  const activeLogo = getActiveEffectLogo(theme);
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full  bg-[#000000]">
      <div className="mx-auto flex h-23.75 max-w-6xl items-center gap-25 px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src={activeLogo}
            alt="Brandiha"
            width={253}
            height={62}
            priority
          />
        </Link>
        <NavBar />
        <ThemePicker/>
        <Link href="/register">
          <Image
            src={activeButton}
            alt="Join"
            width={211}
            height={69}
            priority
          />
        </Link>
      </div>
      <Image
        src="/fall-paint.svg"
        alt=""
        width={337}
        height={125}
        className="absolute top-[99%] left-0"
      />
    </header>
  );
}
