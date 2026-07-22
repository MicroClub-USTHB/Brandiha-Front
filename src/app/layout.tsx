import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Patrick_Hand } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteBackground } from "@/components/site-background";
import { GraffitiCursor } from "@/components/cursor/graffiti-cursor";
import { DEFAULT_THEME, THEME_VALUES } from "@/lib/themes";

const seekuw = localFont({
  src: "./fonts/SEEKUW.otf",
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandiha.microclub.info";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Brandiha",
  description: "one virage away from your brand !",
  icons: {
    icon: "/primary-logo.svg",
    shortcut: "/primary-logo.svg",
    apple: "/primary-logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Brandiha",
    url: siteUrl,
    title: "Brandiha",
    description: "one virage away from your brand !",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandiha",
    description: "one virage away from your brand !",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${patrickHand.variable} ${seekuw.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col overflow-x-hidden">
        <SiteBackground />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme={DEFAULT_THEME}
          themes={THEME_VALUES}
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <GraffitiCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}