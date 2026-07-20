/**
 * The available standalone themes. `swatch` is an oklch color used only to
 * preview the theme in the picker — the real tokens live in `globals.css`
 * under the matching `[data-theme="…"]` block.
 */
export const THEMES = [
  { value: "default", label: "Default", swatch: "oklch(0.205 0 0)" },
  { value: "marketing", label: "Marketing", swatch: "oklch(0.6734 0.1841 45.03)" },
  { value: "multimedia", label: "Multimedia", swatch: "oklch(0.6298 0.2193 3.49)" },
  { value: "communication", label: "Communication", swatch: "oklch(0.6747 0.1787 250.27)" },
  { value: "design", label: "Design", swatch: "oklch(0.8971 0.1605 180.46)" },
] as const;

export type Theme = (typeof THEMES)[number]["value"];

export const THEME_VALUES = THEMES.map((t) => t.value);

export const DEFAULT_THEME: Theme = "default";
