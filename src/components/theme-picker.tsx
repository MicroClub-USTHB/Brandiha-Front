"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { PaletteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES } from "@/lib/themes";

const emptySubscribe = () => () => {};

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-3.5 shrink-0 rounded-full border border-border"
      style={{ backgroundColor: color }}
    />
  );
}
function getActiveEffectHand(theme?: string) {
  switch (theme) {
    case "design":
      return "/hand-design.svg";

    case "multimedia":
      return "/hand-multi.svg";

    case "communication":
      return "/hand-comm.svg";

    case "marketing":
      return "/hand-marketing.svg";

    case "default":
    default:
      return "/hand-default.svg";
  }
} 
export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const activeEffectHand = getActiveEffectHand(theme);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const active = mounted ? THEMES.find((t) => t.value === theme) : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative h-17 w-30  rounded-full  outline-none "
        >
          <img
            src={activeEffectHand}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuRadioGroup
          value={active?.value}
          onValueChange={(value) => setTheme(value)}
        >
          {THEMES.map((t) => (
            <DropdownMenuRadioItem key={t.value} value={t.value}>
              <Swatch color={t.swatch} />
              {t.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
