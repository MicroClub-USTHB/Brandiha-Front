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

export const metadata: Metadata = {
  title: "Brandiha",
  description: "Brandiha creative agency",
  icons: {
    icon: "/primary-logo.svg",
    shortcut: "/primary-logo.svg",
    apple: "/primary-logo.svg",
  },
  openGraph: {
    title: "Brandiha",
    description: "Brandiha creative agency",
    images: [
      {
        url: "/primary-logo.svg",
        width: 620,
        height: 153,
        alt: "Brandiha",
      },
    ],
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