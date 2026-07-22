"use client";

import Image from "next/image";
import { CSSProperties } from "react";
import { FieldPath } from "react-hook-form";
import { useRegistrationForm } from "@/hooks/use-registration-form";
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
    submit,
    isSubmitting,
    submitError,
    isSubmitted,
  } = useRegistrationForm();
  const currentFields = steps[step].fields as Record<string, FieldConfig>;
  const isLastStep = step === steps.length - 1;

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
          {isSubmitted && (
            <p
              role="status"
              className={cn("text-center text-base font-semibold text-green-600 font-sans")}
            >
              You&apos;re registered! We&apos;ll be in touch soon.
            </p>
          )}
        </div>

        <div className={cn("flex justify-between items-center gap-4 px-6")}>
          <BackNavButton
            onClick={previous}
            disabled={step === 0 || isSubmitting || isSubmitted}
            className={cn("h-14")}
          />
          <NextNavButton
            type={isLastStep ? "submit" : "button"}
            onClick={isLastStep ? undefined : next}
            disabled={isSubmitting || isSubmitted}
            className={cn("h-14")}
          />
        </div>
      </form>
    </div>
  );
}