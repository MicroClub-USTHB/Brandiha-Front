"use client";

import { usePathname } from "next/navigation";

import { type Role } from "@/lib/auth/jwt";
import { UserMenu } from "@/components/dashboard/user-menu";
import { SiteHeader, SiteNav, SiteNavLink } from "@/components/site-header";

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
          <SiteNav>
            {links.map(({ href, label }) => (
              <SiteNavLink
                key={href}
                href={href}
                active={pathname === href || pathname.startsWith(`${href}/`)}
              >
                {label}
              </SiteNavLink>
            ))}
          </SiteNav>
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
