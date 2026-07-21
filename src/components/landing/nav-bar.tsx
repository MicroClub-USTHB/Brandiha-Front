"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#agenda", label: "Agenda" },
  { href: "#authors", label: "Authors" },
];

interface NavBarProps {
  onNavigate?: () => void;
}

export function NavBar({ onNavigate }: NavBarProps) {
  const [active, setActive] = useState("/");
  const scrollingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingRef.current) return;

        let best: Element | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.boundingClientRect.top < best.getBoundingClientRect().top) {
            best = entry.target;
          }
        }
        if (best) {
          const id = best.id;
          setActive(id ? `#${id}` : "/");
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (href: string) => {
    scrollingRef.current = true;
    setActive(href);
    onNavigate?.();
    setTimeout(() => {
      scrollingRef.current = false;
    }, 800);
  };

  return (
    <nav className="flex flex-col md:flex-row md:h-[59px] md:w-[677px] items-center justify-around gap-4 md:gap-0 py-4 md:py-0">
      {links.map(({ href, label }) => {
        const isActive = active === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => handleClick(href)}
            className={`relative font-[family-name:var(--font-hand)] text-xl md:text-[28px] text-white/70 hover:text-white ${
              isActive ? "text-white" : ""
            }`}
          >
            {label}
            {isActive && (
              <Image
                src="/active-effect.svg"
                alt=""
                width={72}
                height={16}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
