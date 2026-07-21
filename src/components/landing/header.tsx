"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavBar } from "@/components/landing/nav-bar";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 relative w-full border-b border-border bg-[#000000]">
      <div className="mx-auto flex h-auto min-h-[80px] md:h-[135px] max-w-6xl items-center justify-between gap-4 md:gap-[100px] px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/nav-logo.svg"
            alt="Brandiha"
            width={253}
            height={62}
            priority
            className="h-[40px] w-auto md:h-[62px]"
          />
        </Link>

        <div className="hidden md:block">
          <NavBar />
        </div>

        <div className="flex items-center gap-3">
          <Link href="/register" className="hidden sm:block">
            <Image
              src="/join-button.svg"
              alt="Join"
              width={211}
              height={69}
              priority
              className="h-[50px] w-auto md:h-[69px]"
            />
          </Link>
          <Link
            href="/register"
            className="sm:hidden inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Join
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#000000]">
          <NavBar onNavigate={() => setMobileOpen(false)} />
        </div>
      )}

      <Image
        src="/fall-paint.svg"
        alt=""
        width={337}
        height={125}
        className="absolute top-[99%] left-0 hidden md:block"
      />
    </header>
  );
}
