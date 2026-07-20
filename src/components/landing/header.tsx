import Image from "next/image";
import Link from "next/link";
import { ThemePicker } from "@/components/theme-picker";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/primary-logo.png"
            alt="Brandiha"
            width={120}
            height={30}
            priority
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="#agenda" className="text-sm text-muted-foreground hover:text-foreground">
            Agenda
          </a>
          <a href="#authors" className="text-sm text-muted-foreground hover:text-foreground">
            Authors
          </a>
        </nav>
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
