import Image from "next/image";
import Link from "next/link";
import { ThemePicker } from "@/components/theme-picker";
import { NavBar } from "@/components/landing/nav-bar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[#000000]">
      <div className="mx-auto flex h-[135px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/primary-logo.png"
            alt="Brandiha"
            width={120}
            height={30}
            priority
          />
        </Link>
        <NavBar />
        <div className="flex items-center gap-3">
          <ThemePicker />
          <Link
            href="/register"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
