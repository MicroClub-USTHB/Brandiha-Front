"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useRef } from "react";
import { FieldPath } from "react-hook-form";
import {
  useRegistrationForm,
  useRegistrationPersist,
} from "@/hooks/use-registration-form";
import {
  registrationSchema,
  RegistrationFormData,
} from "@/lib/validators/registration-schema";
import { RegistrationField } from "@/components/register/registration-field";
import { RegistrationStepper } from "@/components/register/registration-stepper";
import { BackNavButton, NextNavButton } from "@/components/register/nav-buttons";
import {
  AvailabilityTitle,
  PortfolioMotivationTitle,
  RegistrationsTitle,
} from "@/components/register/step-title";
import { Popup } from "@/components/ui/pop-up";
import { cn } from "@/lib/utils";

type FieldConfig = {
  label: string;
  type?: string;
  options?: readonly string[];
  fullWidth?: boolean;
};

const STEP_HUES = [
  "var(--brand-marketing)",
  "var(--brand-communication)",
  "var(--brand-multimedia)",
  "var(--brand-design)",
];

/** The title component to render for each step. */
const STEP_TITLES = [
  RegistrationsTitle,
  RegistrationsTitle,
  PortfolioMotivationTitle,
  AvailabilityTitle,
];


export default function RegistrationForm() {
  const {
    form,
    step,
    steps,
    visibleFields,
    next,
    previous,
    goToStep,
    submit,
    isSubmitting,
    submitError,
  } = useRegistrationForm();
  const currentFields = steps[step].fields as Record<string, FieldConfig>;
  const isLastStep = step === steps.length - 1;

  // Restore persisted answers after hydration. The first render always uses the
  // form defaults (matching SSR), and values are set here — post-mount — so there
  // is no hydration mismatch to guard against.
  const { setSavedStep, setSavedValues } = useRegistrationPersist();
  const isHydratedRef = useRef(false);

  useEffect(() => {
    const { savedStep, savedValues } = useRegistrationPersist.getState();

    for (const [key, value] of Object.entries(savedValues)) {
      if (value !== undefined) {
        form.setValue(key as FieldPath<RegistrationFormData>, value as never, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    }

    if (savedStep > 0 && savedStep < steps.length) {
      goToStep(savedStep);
    }

    isHydratedRef.current = true;
    // Restore once, on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror step changes into storage (skip the initial restore).
  useEffect(() => {
    if (isHydratedRef.current) setSavedStep(step);
  }, [step, setSavedStep]);

  // Mirror field edits into storage (skip the initial restore).
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (isHydratedRef.current) {
        setSavedValues(value as Partial<RegistrationFormData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setSavedValues]);

  const hue = STEP_HUES[step % STEP_HUES.length];
  const stepStyle = {
    "--primary": hue,
    "--ring": hue,
    "--primary-gradient": "none",
  } as CSSProperties;

  const StepTitle = STEP_TITLES[step];

  return (
    <div className={cn("relative mx-auto flex w-full max-w-6xl flex-col items-center gap-[clamp(1.5rem,5vh,4rem)] px-4")}>
      <div className={cn("w-[90%] sm:w-[70%] lg:w-[55%] flex justify-center mt-[clamp(0.75rem,3vh,3rem)]")}>
        <RegistrationStepper count={steps.length} current={step} />
      </div>

      <form
        onSubmit={submit}
        style={{
          ...stepStyle,
          backgroundImage: "url('/frame.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
        className={cn("reg-form grid w-full grid-rows-[auto_1fr_auto] gap-[clamp(1.5rem,5vh,4rem)] border-0 bg-transparent px-[clamp(1rem,4vw,5rem)] pt-[clamp(1.5rem,6vh,4.5rem)] pb-[clamp(1.5rem,6vh,5.5rem)] text-card-foreground font-sans")}
      >
        {/* Scoped to `.reg-form` so these overrides don't leak to labels/inputs
            elsewhere in the app. Rendered once, not per field. */}
        <style jsx global>{`
          .reg-form label {
            font-family: var(--font-hand) !important;
            font-size: clamp(1rem, 2.5vh, 1.35rem) !important;
            font-weight: 700 !important;
            letter-spacing: 0.025em !important;
            color: var(--foreground) !important;
            margin-bottom: 0.35rem !important;
          }
          .reg-form :is(input, textarea, select, [data-slot="control"]) {
            font-family: var(--font-hand) !important;
          }
          /* Checkbox labels sit beside the box, not above an input, so the
             stacking margin above would throw off vertical centering. */
          .reg-form [data-orientation="horizontal"] label {
            margin-bottom: 0 !important;
          }
        `}</style>

        <div className={cn("flex flex-col items-center")}>
          <StepTitle />
        </div>

        <div className={cn("flex flex-col justify-center gap-[clamp(1rem,3vh,2rem)]")}>
          <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-[clamp(0.75rem,2vw,1.5rem)] items-center")}>
            <div className={cn("lg:col-span-4 flex justify-center items-center")}>
              <div className={cn("relative w-[clamp(13rem,30vh,26rem)] h-[clamp(13rem,30vh,26rem)] flex items-center justify-center")}>
                <Image
                  src="/frog-icon.png"
                  alt="Frog Mascot"
                  width={256}
                  height={256}
                  className={cn("w-full h-full object-contain pointer-events-none")}
                />
              </div>
            </div>

            <div className={cn("lg:col-span-8 flex flex-col justify-center gap-4")}>
              <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-[clamp(0.75rem,2.5vh,1.25rem)] items-start")}>
                {visibleFields.map((name) => {
                  const { label, type, options, fullWidth } = currentFields[name];
                  const required = !registrationSchema.shape[
                    name as keyof typeof registrationSchema.shape
                  ].isOptional();

                  // Textareas and checkboxes always span the row; anything else can
                  // opt in via `fullWidth` in the step config.
                  const isFullWidth =
                    type === "textarea" || type === "boolean" || fullWidth === true;

                  return (
                    <div
                      key={name}
                      className={cn("flex flex-col", isFullWidth ? "sm:col-span-2" : "sm:col-span-1")}
                    >
                      <RegistrationField
                        control={form.control}
                        name={name as FieldPath<RegistrationFormData>}
                        label={label}
                        type={type}
                        options={options}
                        required={required}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {submitError && (
            <p
              role="alert"
              className={cn("text-center text-base font-semibold text-destructive font-sans")}
            >
              {submitError}
            </p>
          )}
        </div>

        <div className={cn("flex justify-between items-center gap-4 px-6")}>
          <BackNavButton
            onClick={previous}
            disabled={step === 0 || isSubmitting}
            className={cn("h-14")}
          />
          <NextNavButton
            type={isLastStep ? "submit" : "button"}
            onClick={isLastStep ? undefined : next}
            disabled={isSubmitting}
            className={cn("h-14")}
          />
        </div>
      </form>

      <Popup />
    </div>
  );
}
