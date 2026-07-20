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
              <span
                className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-foreground/20"
                aria-hidden
              >
                {/* fills left→right in the left step's hue: full once done, half while current */}
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-[width] duration-300",
                    color,
                    isComplete ? "w-full" : index === current ? "w-1/2" : "w-0"
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
