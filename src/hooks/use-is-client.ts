import { useSyncExternalStore } from "react";

/** Nothing to subscribe to: the answer never changes after hydration. */
const subscribe = () => () => {};

/**
 * `false` on the server and during hydration, `true` once mounted in the
 * browser. For values only the client knows — chiefly the next-themes theme,
 * which reads localStorage — so the first client render matches the server
 * HTML instead of causing a hydration mismatch.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
