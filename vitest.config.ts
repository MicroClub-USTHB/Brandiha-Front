import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Unit tests for the pure logic under `src/lib` — status rules, the challenge
 * window, CSV encoding, list splitting, the Zod schemas, and the refresh
 * single-flight cache.
 *
 * `environment: "node"` because none of that touches the DOM. Component tests
 * would need jsdom and a React setup; there are none yet, and this config
 * shouldn't pretend otherwise.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    // Mirrors the `@/*` path in tsconfig.json, so tests import modules by the
    // same specifier the app does.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
