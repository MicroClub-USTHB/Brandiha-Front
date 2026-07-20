import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type RegistrationStepperProps = {
  count: number;
  current: number;
};

/** One fixed brand hue per step, in visual order (orange → blue → pink → teal). */
const STEP_COLORS = [
  "bg-brand-marketing",
  "bg-brand-communication",
  "bg-brand-multimedia",
  "bg-brand-design",
];

/** The side-view mascot that walks each connector, matching the left step's pillar. */
const STEP_MASCOTS = [
  "/mascot-marketing-side.png",
  "/mascot-communication-side.png",
  "/mascot-multimedia-side.png",
];

export function RegistrationStepper({ count, current }: RegistrationStepperProps) {
  return (
    <ol className="flex w-full items-center">
      {Array.from({ length: count }, (_, index) => {
        const label = String(index + 1).padStart(2, "0");
        const reached = index <= current;
        const isComplete = index < current;
        const color = STEP_COLORS[index % STEP_COLORS.length];

        return (
          <li key={index} className="flex flex-1 items-center">
            <div
              className="relative flex size-16 shrink-0 items-center justify-center"
              aria-current={index === current ? "step" : undefined}
            >
              {reached ? (
                // The splash's painted mass sits above its geometric center
                // (drips pull it down), so push the whole splash down to seat
                // the blob under the centered label; drips spill below the track.
                <span
                  className={cn("absolute inset-0 translate-y-3 splash-mask", color)}
                  aria-hidden
                />
              ) : (
                <span
                  className="absolute inset-2.5 rounded-full border-2 border-foreground/70"
                  aria-hidden
                />
              )}

              <span
                className={cn(
                  "relative font-hand text-xl leading-none",
                  reached ? "text-white" : "text-foreground/70"
                )}
              >
                {isComplete ? (
                  <Check className="size-5 stroke-3" aria-label="completed" />
                ) : (
                  label
                )}
              </span>
            </div>

            {index < count - 1 && (
              <span className="relative flex-1 self-center" aria-hidden>
                {/* track + fill: left→right in the left step's hue (full once done, half while current) */}
                <span className="block h-0.5 overflow-hidden rounded-full bg-foreground/20">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width] duration-300",
                      color,
                      isComplete ? "w-full" : index === current ? "w-1/2" : "w-0"
                    )}
                  />
                </span>

                {/* mascot walks at the head of the fill toward the next step */}
                {index <= current && (
                  <Image
                    src={STEP_MASCOTS[index % STEP_MASCOTS.length]}
                    alt=""
                    width={68}
                    height={60}
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 h-9 w-auto -translate-x-full -translate-y-full transition-[left] duration-300"
                    style={{ left: isComplete ? "100%" : "50%" }}
                  />
                )}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
