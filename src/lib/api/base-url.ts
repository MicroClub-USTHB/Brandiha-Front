/**
 * Backend base URL, trailing slash stripped. Deliberately free of `server-only`
 * so the proxy (which runs in middleware, not the Node server bundle) can share
 * the same value instead of re-deriving it and drifting.
 */
export const API_BASE_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/$/, "");
