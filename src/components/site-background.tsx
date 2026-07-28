import { DecorativeSvg } from "@/components/landing/decorative-svg";

const decorations = [
  "pink-splash",
  "blue-splash",
  "gekko",
  "design-tag",
  "marketing-tag",
  "multimedia-tag",
  "dev-tag",
  "communication-tag",
  "spray-bomb",
] as const;

/**
 * Full-page background shared by every page: the wall texture plus the graffiti
 * decorations. Absolutely positioned so it spans the whole document and scrolls
 * with the page (not pinned to the viewport). The wall tiles via `bg-repeat`,
 * and each decoration keeps a fixed spot in the document. Sits behind all
 * content (`-z-10`) and clips off-canvas pieces to avoid horizontal scroll.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-repeat bg-top"
      style={{ backgroundImage: "url(/wall-background.png)" }}
    >
      {decorations.map((name) => (
        <DecorativeSvg key={name} name={name} />
      ))}
    </div>
  );
}
