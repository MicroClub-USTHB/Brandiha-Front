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
      className="size-3.5 rounded-full border border-border"
      style={{ backgroundColor: color }}
    />
  );
}

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  // The active theme is only known on the client, so avoid reflecting the
  // selection until mounted to prevent a hydration mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const active = mounted ? THEMES.find((t) => t.value === theme) : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Select theme">
          <PaletteIcon />
        </Button>
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
