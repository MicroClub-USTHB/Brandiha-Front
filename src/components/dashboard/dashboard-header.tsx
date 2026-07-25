"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api/auth";

/** Top bar shared across the staff dashboard. */
export function DashboardHeader() {
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
        <button
          type="button"
          onClick={handleLogout}
          className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </header>
  );
}
