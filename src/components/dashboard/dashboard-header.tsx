"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api/auth";
import { ROLE_LABELS, type Role } from "@/lib/auth/jwt";
import { cn } from "@/lib/utils";

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

const ROLE_BADGE_STYLES: Record<Role, string> = {
  super_admin: "bg-primary text-primary-foreground",
  admin: "bg-primary/20 text-primary",
  alumni: "bg-white/10 text-white/60",
};

/** Top bar shared across the staff dashboard. */
export function DashboardHeader({
  userName,
  userRole,
}: {
  userName?: string;
  userRole?: Role;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-black/40 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
        <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-white">
          Brandiha Staff
        </span>

        <div className="flex flex-1 items-center justify-center">
          {userRole && NAV_LINKS[userRole] && (
            <nav className="flex items-center gap-6">
              {NAV_LINKS[userRole]!.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-white",
                    pathname === href || pathname.startsWith(`${href}/`)
                      ? "text-white"
                      : "text-white/60",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {userName && (
            <span className="flex items-center gap-2 text-sm text-white/70">
              <span>{userName}</span>
              {userRole && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase leading-none tracking-wide",
                    ROLE_BADGE_STYLES[userRole],
                  )}
                >
                  {ROLE_LABELS[userRole]}
                </span>
              )}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
