import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/landing/nav-bar";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full  bg-[#000000]">
      <div className="mx-auto flex h-23.75 max-w-6xl items-center gap-25 px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/nav-logo.svg"
            alt="Brandiha"
            width={253}
            height={62}
            priority
          />
        </Link>
        <NavBar />
        <Link href="/register">
          <Image
            src="/join-button.svg"
            alt="Join"
            width={211}
            height={69}
            priority
          />
        </Link>
      </div>
      <Image
        src="/fall-paint.svg"
        alt=""
        width={337}
        height={125}
        className="absolute top-[99%] left-0"
      />
    </header>
  );
}
