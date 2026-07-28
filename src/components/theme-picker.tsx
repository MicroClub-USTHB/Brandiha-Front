"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES } from "@/lib/themes";

const emptySubscribe = () => () => {};

function getThemeHand(theme: string) {
  switch (theme) {
    case "design":
      return "/hand-design.svg";
    case "multimedia":
      return "/hand-multi.svg";
    case "communication":
      return "/hand-comm.svg";
    case "marketing":
      return "/hand-marketing.svg";
    case "chameleon":
    default:
      return "/hand-default.svg";
  }
}

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const resolved = isClient ? theme : undefined;
  const activeEffectHand = getThemeHand(resolved ?? "chameleon");
  const active = THEMES.find((t) => t.value === (resolved ?? "chameleon"));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative h-15 w-25 rounded-full p-2 outline-none"
        >
          <Image
            src={activeEffectHand}
            alt="Profile"
            width={100}
            height={60}
            className="h-full w-full object-contain"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="font-heading min-w-40 border-none bg-[url('/dropDown-cover.svg')] bg-cover bg-center p-2 text-black shadow-lg"
      >
        <DropdownMenuRadioGroup
          value={active?.value ?? THEMES[0].value}
          onValueChange={(value) => setTheme(value)}
        >
          {THEMES.map((t) => (
            <DropdownMenuRadioItem
              key={t.value}
              value={t.value}
              className="gap-3 pr-2"
            >
              <Image
                src={getThemeHand(t.value)}
                alt=""
                aria-hidden="true"
                width={28}
                height={18}
                className="h-5 w-8 shrink-0 object-contain"
              />
              {t.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
