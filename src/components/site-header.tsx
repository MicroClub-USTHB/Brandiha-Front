import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/theme-art/brand-logo";
import { ThemePicker } from "@/components/theme-picker";
import { cn } from "@/lib/utils";

/**
 * The black top bar every page wears: theme-aware logo on the left, `nav` in
 * the middle (from `md` up), the theme picker and `actions` on the right, and
 * the paint drip hanging off its bottom edge.
 *
 * `position` is the one real difference between its two users. The landing
 * pages are `fixed` and pad their own content below it; the dashboard is
 * `sticky`, so the header stays in flow and its page fills what's left.
 */
export function SiteHeader({
  position,
  nav,
  actions,
}: {
  position: "fixed" | "sticky";
  nav?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header
      className={cn(
        "top-0 z-50 w-full bg-black",
        position === "fixed" ? "fixed left-0 right-0" : "sticky",
      )}
    >
      <div className="mx-auto flex h-24 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandLogo className="h-12 w-auto" />
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center">{nav}</div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemePicker />
          {actions}
        </div>
      </div>
      <Image
        src="/fall-paint.svg"
        alt=""
        width={337}
        height={125}
        draggable={false}
        className="absolute top-[99%] left-0 w-44 sm:w-[337px] h-auto"
      />
    </header>
  );
}

/** The row of links passed to `SiteHeader` as its `nav`. */
export function SiteNav({ children }: { children: ReactNode }) {
  return (
    <nav className="flex h-14.75 w-auto items-center justify-center gap-8">{children}</nav>
  );
}

/** One `SiteNav` link, lit up while `active`. */
export function SiteNavLink({
  active,
  className,
  ...props
}: ComponentProps<typeof Link> & { active: boolean }) {
  return (
    <Link
      {...props}
      className={cn(
        "font-hand text-[28px] text-white/70 transition-colors hover:text-white",
        active && "text-white",
        className,
      )}
    />
  );
}
