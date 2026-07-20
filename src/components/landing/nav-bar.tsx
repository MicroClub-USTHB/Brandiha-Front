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

export function NavBar() {
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
    setTimeout(() => {
      scrollingRef.current = false;
    }, 800);
  };

  return (
    <nav className="flex h-[59px] w-[677px] items-center justify-around">
      {links.map(({ href, label }) => {
        const isActive = active === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => handleClick(href)}
            className={`relative font-[family-name:var(--font-hand)] text-[28px] text-white/70 hover:text-white ${
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
