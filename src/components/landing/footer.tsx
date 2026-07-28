"use client";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, type SVGProps } from "react";
import { useTheme } from "next-themes";
import { Mail, MapPin } from "lucide-react";
import { Gekko } from "@/components/gekko";

const useIsClient = () => useSyncExternalStore(() => () => {}, () => true, () => false);

function getActiveEffectLogo(theme?: string) {
  switch (theme) {
    case "design":
      return "/activeLogo-Design.svg";
    case "multimedia":
      return "/activeLogo-Multimedia.svg";
    case "communication":
      return "/activeLogo-Communication.svg";
    case "marketing":
      return "/activeLogo-Marketing.svg";
    case "chameleon":
    default:
      return "/nav-logo.svg";
  }
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#agenda", label: "Agenda" },
  { href: "#authors", label: "Authors" },
];

const socialLinks = [
  { title: "Instagram", href: "https://www.instagram.com/microclub_usthb/", Icon: InstagramIcon },
  { title: "LinkedIn", href: "https://www.linkedin.com/company/micro-club-usthb-85/posts/?feedView=all", Icon: LinkedInIcon },
  { title: "GitHub", href: "https://github.com/MicroClub-USTHB/", Icon: GitHubIcon },
  { title: "Email", href: "mailto:microclub.contact@gmail.com", Icon: Mail },
] as const;

export function Footer() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const activeLogo = getActiveEffectLogo(isClient ? theme : undefined);
  return (
    <footer className="relative overflow-hidden bg-black">
      <Image
        src="/footer-splash.svg"
        alt=""
        width={337}
        height={125}
        draggable={false}
        className="absolute top-0 left-0 w-full h-auto z-10"
      />

      <Gekko className="absolute left-[4%] bottom-[10%] h-[clamp(80px,12vh,150px)] w-auto opacity-[0.15] pointer-events-none select-none -rotate-[2deg]" />

      <div className="relative z-20 mx-auto max-w-7xl px-[clamp(1.5rem,4vw,4rem)] pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-28 lg:pb-16">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16 lg:gap-y-0">
          <div className="flex w-full flex-col items-center gap-6 sm:gap-8 lg:col-start-1 lg:row-start-1 lg:items-start">
            <Link
              href="/"
              className="transition-transform duration-300 ease-out hover:scale-[1.03]"
            >
              <Image
                src={activeLogo}
                alt="Brandiha"
                width={1280}
                height={313}
                draggable={false}
                className="w-[clamp(160px,40vw,180px)] sm:w-[clamp(170px,30vw,200px)] lg:w-[clamp(180px,18vw,230px)] h-auto"
              />
            </Link>

            <div className="flex flex-col items-center gap-4 sm:gap-6 lg:items-start">
              <p className="font-heading text-[clamp(0.625rem,2vw,0.75rem)] tracking-[0.08em] text-white/40 sm:text-sm">
                Follow Us
              </p>

              <div className="grid grid-cols-2 gap-x-12 gap-y-3 sm:flex sm:items-center sm:gap-8">
                {socialLinks.map(({ title, href, Icon }) => (
                  <Link
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex min-h-[44px] min-w-[44px] items-center justify-start gap-2 font-heading text-[clamp(0.75rem,2.5vw,0.875rem)] text-white/70 transition-colors duration-250 ease-out hover:text-primary sm:justify-center sm:text-[clamp(0.875rem,1.5vw,1rem)]"
                    aria-label={title}
                  >
                    <Icon className="h-[16px] w-[16px] transition-transform duration-250 ease-out group-hover:-translate-y-[2px] sm:h-[18px] sm:w-[18px]" />
                    <span className="relative">
                      {title}
                      <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out delay-75 group-hover:w-full" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 lg:items-start">
              <div className="flex items-center gap-2 font-heading text-[clamp(0.675rem,2vw,0.8rem)] text-white/45 sm:text-sm">
                <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span>USTHB, Algiers</span>
              </div>
              <div className="flex items-center gap-2 font-heading text-[clamp(0.675rem,2vw,0.8rem)] text-white/45 sm:text-sm">
                <Mail className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span>microclub.contact@gmail.com</span>
              </div>
            </div>
          </div>

          <nav className="grid w-full max-w-[280px] grid-cols-2 gap-x-16 gap-y-3 sm:flex sm:max-w-none sm:items-center sm:justify-center sm:gap-12 lg:col-start-2 lg:row-start-1 lg:flex-col lg:items-end lg:gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-[44px] items-center justify-center font-heading text-[clamp(1.125rem,4.5vw,1.5rem)] leading-tight text-white/70 transition-colors duration-250 ease-out hover:text-primary sm:text-[clamp(1.125rem,3vw,1.75rem)] lg:min-h-0 lg:justify-end lg:text-[clamp(1.5rem,2.5vw,2.25rem)]"
              >
                <span className="relative inline-block">
                  {label}
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out group-hover:w-full lg:w-0 lg:group-hover:w-full" />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-12 text-center font-heading text-[10px] text-white/20 sm:text-xs lg:mt-16">
          &copy; {new Date().getFullYear()} MicroClub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
