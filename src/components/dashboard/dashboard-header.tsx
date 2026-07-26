"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api/auth";
import type { Role } from "@/lib/auth/jwt";

/** Top bar shared across the staff dashboard. */
export function DashboardHeader({
  userName,
  userRole,
}: {
  userName?: string;
  userRole?: Role;
}) {
  const router = useRouter();

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

        {userName && (
          <span className="ml-auto mr-4 flex items-center gap-2 text-sm text-white/70">
            <span>{userName}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase leading-none tracking-wide ${
                userRole === "admin"
                  ? "bg-primary/20 text-primary"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {userRole}
            </span>
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
    </header>
  );
}
