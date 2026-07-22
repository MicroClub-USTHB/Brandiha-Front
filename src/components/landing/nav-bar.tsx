"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const links = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#agenda", label: "Agenda" },
  { href: "#authors", label: "Authors" },
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
      return "/active-effect.svg";

    case "default":
    default:
      return "/active-effect.svg";
  }
} 


export function NavBar() {
  const [active, setActive] = useState("/");
  const scrollingRef = useRef(false);
  const {theme} = useTheme();
  const activeImage = getActiveEffectImage(theme);
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
    <nav className="flex h-14.75 w-169.25 items-center justify-around">
      {links.map(({ href, label }) => {
        const isActive = active === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => handleClick(href)}
            className={`relative font-hand text-[28px] text-white/70 hover:text-white ${
              isActive ? "text-white" : ""
            }`}
          >
            {label}
            {isActive && (
              <Image
                src={activeImage}
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
