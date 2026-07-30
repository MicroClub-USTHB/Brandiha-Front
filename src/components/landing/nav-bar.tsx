"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const links = [
  { href: "/", label: "Home" },
  { href: "/#agenda", label: "Agenda" },
  { href: "/#faq", label: "FAQ" },
];

function getActiveEffectImage(theme?: string) {
  switch (theme) {
    case "design":
      return "/activeLink-Design.svg";
    case "multimedia":
      return "/activeLink-Multi.svg";
    case "communication":
      return "/activeLink-Comm.svg";
    case "marketing":
      return "/activeLink-Marketing.svg";
    case "chameleon":
    default:
      return "/activeLink-Default.svg";
  }
}

const useIsClient = () => useSyncExternalStore(() => () => {}, () => true, () => false);

/** Distance from the viewport top at which a section is considered "active". */
const ACTIVE_THRESHOLD = 120;

export function NavBar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [active, setActive] = useState<string | null>("/");
  const lockRef = useRef(false);
  const { theme } = useTheme();
  const isClient = useIsClient();
  const activeImage = getActiveEffectImage(theme);

  useEffect(() => {
    if (!isLanding) return;

    const update = () => {
      if (lockRef.current) return;

      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      // The last section whose top has crossed the threshold wins — that's the
      // one the user most recently scrolled into view.
      let current: string = "/";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= ACTIVE_THRESHOLD) {
          current = section.id === "hero" ? "/" : `/#${section.id}`;
        }
      }
      setActive(current);
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          update();
          rafId = null;
        });
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isLanding]);

  const handleClick = (href: string) => {
    setActive(href);
    lockRef.current = true;
    setTimeout(() => {
      lockRef.current = false;
    }, 1000);
  };

  const shouldShow = isLanding ? active : null;

  return (
    <nav className="flex h-14.75 w-auto items-center justify-center gap-8">
      {links.map(({ href, label }) => {
        const isActive = shouldShow === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => isLanding && handleClick(href)}
            className={`relative font-hand text-[28px] text-white/70 hover:text-white ${
              isActive ? "text-white" : ""
            }`}
          >
            {label}
            {isClient && isActive && (
              <Image
                src={activeImage}
                alt=""
                width={72}
                height={16}
                draggable={false}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
