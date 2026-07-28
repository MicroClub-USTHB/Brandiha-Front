"use client";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, type SVGProps } from "react";
import { useTheme } from "next-themes";
import { Mail } from "lucide-react";
import { motion } from "motion/react";

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
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-black to-black"
    >
      <div
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.025) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 sm:gap-8">
          {socialLinks.map(({ title, href, Icon }) => (
            <Link
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-sans text-sm text-white/70 transition-all duration-250 ease-out hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black max-sm:min-h-11 max-sm:min-w-11 max-sm:justify-center"
              aria-label={title}
            >
              <Icon className="h-5 w-5 transition-all duration-250 ease-out group-hover:text-white" />
              <span className="hidden sm:inline transition-all duration-250 ease-out group-hover:text-white">
                {title}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="block transition-all duration-300 ease-out hover:scale-[1.02] hover:rotate-[0.5deg] hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Image
              src={activeLogo}
              alt="Brandiha"
              width={253}
              height={62}
              draggable={false}
              className="h-12"
            />
          </Link>
        </div>

        <div className="mt-7 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <p className="mt-[18px] font-sans text-xs text-white/30">
          &copy; {new Date().getFullYear()} MicroClub. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
