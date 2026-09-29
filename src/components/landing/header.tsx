import Link from "next/link";

import { NavBar } from "@/components/landing/nav-bar";
import { SiteHeader } from "@/components/site-header";
import { ButtonFrame } from "@/components/theme-art/button-frame";

/** The public pages' header: section nav and a way into the challenges. */
export function Header() {
  return (
    <SiteHeader
      position="fixed"
      nav={<NavBar />}
      actions={
        <Link
          href="/submit"
          className="relative isolate flex h-15 w-[211px] items-center justify-center"
        >
          <ButtonFrame className="pointer-events-none absolute inset-0 -z-10 size-full" />
          <span className="font-heading text-xl text-black">Challenges</span>
        </Link>
      }
    />
  );
}
