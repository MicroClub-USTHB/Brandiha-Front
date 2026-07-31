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
          className="size-12 cursor-pointer overflow-hidden rounded-full ring-1 ring-white/15 transition-colors hover:ring-white/30"
          style={{
            backgroundImage: "url('/chameleon-logo.png')",
            backgroundSize: "200%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="font-heading w-64 border-none bg-[url('/dropDown-cover.svg')] bg-cover bg-center p-4 text-black shadow-lg"
      >
        <div className="flex flex-col gap-1.5 px-1 pt-1">
          <span className="text-base font-bold">{name}</span>
          <span className="text-sm text-black/60">{email}</span>
          <span className="mt-1.5 inline-block self-start rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase leading-none tracking-wide text-black/70">
            {ROLE_LABELS[role]}
          </span>
        </div>
        <hr className="my-3 border-black/10" />
        <DropdownMenuItem
          className="cursor-pointer gap-2.5 font-heading text-base font-medium text-black/70 focus:bg-black/5"
          onClick={handleLogout}
        >
          <LogOut className="size-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
