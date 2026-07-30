"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { type Role } from "@/lib/auth/jwt";
import { ThemePicker } from "@/components/theme-picker";
import { UserMenu } from "@/components/dashboard/user-menu";

const NAV_LINKS: Partial<Record<Role, { href: string; label: string }[]>> = {
  admin: [
    { href: "/hr", label: "RH" },
    { href: "/submissions", label: "Submissions" },
  ],
  super_admin: [
    { href: "/super-admin-leaderboard", label: "Leaderboard" },
    { href: "/submissions", label: "Submissions" },
    { href: "/vote-leaderboard", label: "Vote board" },
    { href: "/vote-results", label: "Ballots" },
  ],
};

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

const useIsClient = () =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

/** Top bar shared across the staff dashboard. */
export function DashboardHeader({
  userName,
  userEmail,
  userRole,
}: {
  userName?: string;
  userEmail?: string;
  userRole?: Role;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isClient = useIsClient();
  const activeLogo = getActiveEffectLogo(isClient ? theme : undefined);

  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <div className="mx-auto flex h-24 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src={activeLogo}
            alt="Brandiha"
            width={253}
            height={62}
            draggable={false}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center">
          {userRole && NAV_LINKS[userRole] && (
            <nav className="flex h-14.75 w-auto items-center justify-center gap-8">
              {NAV_LINKS[userRole]!.map(({ href, label }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`font-hand text-[28px] transition-colors hover:text-white ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemePicker />
          {userName && userRole && (
            <div className="hidden sm:block">
              <UserMenu name={userName} email={userEmail ?? ""} role={userRole} />
            </div>
          )}
        </div>
      </div>
      <Image
        src="/fall-paint.svg"
        alt=""
        width={337}
        height={125}
        draggable={false}
        className="absolute top-[99%] left-0 w-44 sm:w-[337px] h-auto"
      />
    </header>
  );
}
