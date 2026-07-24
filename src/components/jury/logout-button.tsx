"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { logout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <ActionButton
      variant="secondary"
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={cn("h-12")}
    >
      <LogOut className={cn("size-5 stroke-[2.5]")} />
      Log out
    </ActionButton>
  );
}
