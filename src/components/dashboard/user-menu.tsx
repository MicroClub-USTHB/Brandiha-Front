"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logout } from "@/lib/api/auth";
import { ROLE_LABELS, type Role } from "@/lib/auth/jwt";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: Role;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/80 transition-colors hover:bg-white/20"
        >
          {getInitials(name)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="font-heading w-56 border-none bg-[url('/dropDown-cover.svg')] bg-cover bg-center p-3 text-black shadow-lg"
      >
        <div className="flex flex-col gap-1 px-1 pt-1">
          <span className="text-sm font-bold">{name}</span>
          <span className="text-xs text-black/60">{email}</span>
          <span className="mt-1 inline-block self-start rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-bold uppercase leading-none tracking-wide text-black/70">
            {ROLE_LABELS[role]}
          </span>
        </div>
        <hr className="my-2 border-black/10" />
        <DropdownMenuItem
          className="cursor-pointer gap-2 font-heading text-sm font-medium text-black/70 focus:bg-black/5"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
