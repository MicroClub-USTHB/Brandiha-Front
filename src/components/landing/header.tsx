"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

import { NavBar } from "@/components/landing/nav-bar";
import { SiteHeader } from "@/components/site-header";
import { useIsClient } from "@/hooks/use-is-client";

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

/** The public pages' header: section nav and a way into the challenges. */
export function Header() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const activeButton = getActiveEffectButton(isClient ? theme : undefined);

  return (
    <SiteHeader
      position="fixed"
      nav={<NavBar />}
      actions={
        <Link
          href="/submit"
          className="flex h-15 w-[211px] items-center justify-center bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${activeButton})` }}
        >
          <span className="font-heading text-xl text-black">Challenges</span>
        </Link>
      }
    />
  );
}
