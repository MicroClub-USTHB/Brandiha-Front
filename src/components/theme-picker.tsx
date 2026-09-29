"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES } from "@/lib/themes";
import { useIsClient } from "@/hooks/use-is-client";
import { ThemeHand } from "@/components/theme-art/theme-hand";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const resolved = isClient ? theme : undefined;
  const active = THEMES.find((t) => t.value === (resolved ?? "chameleon"));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Choose a theme"
          className="relative h-15 w-25 rounded-full p-2 outline-none"
        >
          {/* Follows the page's theme through CSS, so it's right on first paint. */}
          <ThemeHand className="h-full w-full" />
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
              {/* Each preview wears its own theme, whatever the page's is. */}
              <span data-theme={t.value} className="contents">
                <ThemeHand className="h-5 w-8 shrink-0" />
              </span>
              {t.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
