"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SiteNav, SiteNavLink } from "@/components/site-header";
import { NavUnderline } from "@/components/theme-art/nav-underline";

const links = [
  { href: "/", label: "Home" },
  { href: "/#agenda", label: "Agenda" },
  { href: "/#faq", label: "FAQ" },
];

/** Distance from the viewport top at which a section is considered "active". */
const ACTIVE_THRESHOLD = 120;

export function NavBar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [active, setActive] = useState<string | null>("/");
  const lockRef = useRef(false);

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
    <SiteNav>
      {links.map(({ href, label }) => {
        const isActive = shouldShow === href;
        return (
          <SiteNavLink
            key={href}
            href={href}
            active={isActive}
            onClick={() => isLanding && handleClick(href)}
            className="relative"
          >
            {label}
            {isActive && (
              <NavUnderline className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </SiteNavLink>
        );
      })}
    </SiteNav>
  );
}
