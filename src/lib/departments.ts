import type { Department } from "@/lib/api/registration-types";

/**
 * Everything the UI shows for a department — its name, brand colour, challenge
 * card art, and mascot — so a department is described once rather than across
 * parallel lookup tables in every component that draws one.
 *
 * The colours are the theme-independent `--brand-*` variables in `globals.css`.
 */
export const DEPARTMENTS: Record<
  Department,
  {
    label: string;
    color: string;
    /** Challenge card art; its accents take whatever colour the card sets. */
    card: string;
    mascot: string;
  }
> = {
  marketing: {
    label: "Marketing",
    color: "var(--brand-marketing)",
    card: "/challenge-cards/marketing-card.svg",
    mascot: "/department-mascots/marketing-mascot.png",
  },
  communication: {
    label: "Communication",
    color: "var(--brand-communication)",
    card: "/challenge-cards/communication-card.svg",
    mascot: "/department-mascots/communication-mascot.png",
  },
  multimedia: {
    label: "Multimedia",
    color: "var(--brand-multimedia)",
    card: "/challenge-cards/multimedia-card.svg",
    mascot: "/department-mascots/multimedia-mascot.png",
  },
  design: {
    label: "Design",
    color: "var(--brand-design)",
    card: "/challenge-cards/design-card.svg",
    mascot: "/department-mascots/design-mascot.png",
  },
};
