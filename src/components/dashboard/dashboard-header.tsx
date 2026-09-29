"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type Role } from "@/lib/auth/jwt";
import { UserMenu } from "@/components/dashboard/user-menu";
import { SiteHeader } from "@/components/site-header";
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

/** Top bar shared across the staff dashboard: the role's pages and a user menu. */
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
  const links = userRole ? NAV_LINKS[userRole] : undefined;

  return (
    <SiteHeader
      position="sticky"
      nav={
        links && (
          <nav className="flex h-14.75 w-auto items-center justify-center gap-8">
            {links.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "font-hand text-[28px] transition-colors hover:text-white",
                    isActive ? "text-white" : "text-white/70",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )
      }
      actions={
        userName &&
        userRole && (
          <div className="hidden sm:block">
            <UserMenu name={userName} email={userEmail ?? ""} role={userRole} />
          </div>
        )
      }
    />
  );
}
