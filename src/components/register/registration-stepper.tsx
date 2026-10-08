import Image from "next/image";
import { Check } from "lucide-react";
import type { Department } from "@/lib/api/registration-types";
import { DEPARTMENTS } from "@/lib/departments";
import { cn } from "@/lib/utils";

type RegistrationStepperProps = {
  count: number;
  current: number;
};

/**
 * One department per step, in visual order (orange → blue → pink → teal). Each
 * step takes its department's brand colour, and the connector after it its
 * side-view mascot.
 */
const STEP_DEPARTMENTS: Department[] = ["marketing", "communication", "multimedia", "design"];

export function RegistrationStepper({ count, current }: RegistrationStepperProps) {
  return (
    <ol className="flex w-full items-center">
      {Array.from({ length: count }, (_, index) => {
        const label = String(index + 1).padStart(2, "0");
        const reached = index <= current;
        const isComplete = index < current;
        const { color, sideMascot } =
          DEPARTMENTS[STEP_DEPARTMENTS[index % STEP_DEPARTMENTS.length]];

        return (
          <li
            key={index}
            className={cn("flex items-center", index < count - 1 && "flex-1")}
          >
            <div
              className="relative flex size-16 shrink-0 items-center justify-center"
              aria-current={index === current ? "step" : undefined}
            >
              {reached ? (
                // The splash's painted mass sits above its geometric center
                // (drips pull it down), so push the whole splash down to seat
                // the blob under the centered label; drips spill below the track.
                <span
                  className="absolute inset-0 translate-y-3 splash-mask"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
              ) : (
                <Image
                  src="/step-circle.svg"
                  alt=""
                  width={62}
                  height={62}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 m-auto size-11 object-contain"
                />
              )}

              <span
                className={cn(
                  "relative font-hand text-xl leading-none",
                  reached ? "text-white" : "text-white/80"
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
                <span className="block h-0.5 overflow-hidden rounded-full bg-white/30">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width] duration-300",
                      isComplete ? "w-full" : index === current ? "w-1/2" : "w-0"
                    )}
                    style={{ backgroundColor: color }}
                  />
                </span>

                {/* mascot walks at the head of the fill toward the next step */}
                {index <= current && sideMascot && (
                  <Image
                    src={sideMascot}
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
