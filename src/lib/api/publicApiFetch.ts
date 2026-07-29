import "server-only";

import { API_BASE_URL } from "@/lib/api/base-url";

export { API_BASE_URL };

export async function publicApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...init,
    headers,
  });
}
