import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Vercel's preview toolbar loads from `vercel.live` and talks to Pusher over a
 * websocket. Allowed outside production so previews stay usable, and kept out
 * of the production policy where the toolbar never runs.
 */
const isProductionDeploy = process.env.VERCEL_ENV === "production";
const vercelToolbar = isProductionDeploy
  ? { script: "", connect: "", frame: "" }
  : {
      script: " https://vercel.live",
      connect: " https://vercel.live wss://ws-us3.pusher.com",
      frame: " https://vercel.live",
    };

/**
 * Content Security Policy.
 *
 * Everything this app loads is same-origin: `next/font` self-hosts the Google
 * fonts at build time, every image lives in `public/`, and the backend is only
 * ever called from the server (Server Actions and Server Components), never
 * from the browser — so `connect-src 'self'` is enough.
 *
 * `style-src` has to keep `'unsafe-inline'`: the registration and login forms
 * use styled-jsx, and several components set `style={{ … }}` for background
 * images and per-step theme variables.
 *
 * `script-src` keeps `'unsafe-inline'` too, which is the honest limit of this
 * policy — Next's hydration bootstrap is inline, and nonce-ing it means routing
 * every response through the proxy. What the policy does buy is that no
 * *external* origin can serve script, connect, frame, or font, so an injected
 * tag has nowhere to send anything. Tightening to a nonce is the next step if
 * this app ever renders untrusted HTML; today it renders none.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelToolbar.script}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${vercelToolbar.connect}`,
  `frame-src 'self'${vercelToolbar.frame}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Belt-and-braces with `frame-ancestors` above, for anything that predates it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL within the site, only the origin when leaving it — the
  // dashboard has registration ids in its paths.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Ignored over plain HTTP, so it costs nothing in local dev.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
