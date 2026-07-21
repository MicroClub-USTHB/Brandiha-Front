"use client";

import Image from "next/image";
import { CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FieldPath } from "react-hook-form";
import { useRegistrationForm } from "@/hooks/use-registration-form";
import {
  registrationSchema,
  RegistrationFormData,
} from "@/lib/validators/registration-schema";
import { FormCheckbox, FormInput, FormSelect, FormTextarea } from "@/components/form";
import { FIELD_ICONS } from "@/components/register/field-icons";
import { RegistrationStepper } from "@/components/register/registration-stepper";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FieldConfig = { label: string; type?: string; options?: readonly string[] };

const STEP_HUES = [
  "var(--brand-marketing)",
  "var(--brand-communication)",
  "var(--brand-multimedia)",
  "var(--brand-design)",
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

  const isThirdStep = step === 2;
  const isFourthStep = step === 3;
  const hideStroke = isThirdStep || isFourthStep;

  return (
    <div className={cn("relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4")}>
      <div className={cn("fixed left-6 top-6 z-50")}>
        <Image src="/primary-logo.png" alt="Logo" width={208} height={60} className={cn("w-52 h-auto")} />
      </div>

      <div className={cn("w-full max-w-3xl flex justify-center mt-12")}>
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
        className={cn("flex w-full flex-col gap-10 border-0 bg-transparent px-32 pt-28 pb-36 text-card-foreground font-sans")}
      >
        <div className={cn("flex flex-col items-center")}>
          {isThirdStep ? (
            <h2 className={cn("text-center text-6xl font-extrabold uppercase tracking-wide font-heading")}>
              <span className={cn("text-foreground tracking-[0.1em]")}>
                Portfolio{" "}
              </span>
              <span 
                style={{
                  backgroundImage: "linear-gradient(to right, var(--grad-1), var(--grad-2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                &{" "}
              </span>
              <span className={cn("text-foreground tracking-[0.1em]")}>
                Motivation
              </span>
            </h2>
          ) : isFourthStep ? (
            <h2 className={cn("text-center text-6xl font-extrabold uppercase tracking-wide font-heading text-foreground")}>
              <span className={cn("tracking-[0.1em]")}>
                Availability
              </span>
            </h2>
          ) : (
            <h2 className={cn("text-center text-6xl font-extrabold uppercase tracking-wide font-heading")}>
              <span 
                style={{
                  backgroundImage: "linear-gradient(to right, var(--grad-1), var(--grad-2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Brandiha{" "}
              </span>
              <span className={cn("text-foreground tracking-[0.1em] ml-2")}>
                Registrations
              </span>
            </h2>
          )}
          {!hideStroke && (
            <div className={cn("w-full flex justify-end pr-4 mt-2")}>
              <Image 
                src="/underline-stroke.png" 
                alt="Underline"
                width={300}
                height={50}
                className={cn("w-1/2 max-w-md pointer-events-none object-contain scale-110 origin-right -translate-x-12")} 
              />
            </div>
          )}
        </div>

        <div className={cn("flex flex-col gap-8")}>
          <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 items-center")}>
            <div className={cn("lg:col-span-4 flex justify-center items-center")}>
              <div className={cn("relative w-56 h-56 lg:w-64 lg:h-64 flex items-center justify-center")}>
                <Image 
                  src="/frog-icon.png" 
                  alt="Frog Mascot" 
                  width={256}
                  height={256}
                  className={cn("w-full h-full object-contain pointer-events-none scale-125")}
                />
              </div>
            </div>

            <div className={cn("lg:col-span-8 flex flex-col justify-center gap-4")}>
              <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 items-start")}>
                {visibleFields.map((name) => {
                  const { label, type, options } = currentFields[name];
                  const fieldName = name as FieldPath<RegistrationFormData>;
                  const required = !registrationSchema.shape[
                    name as keyof typeof registrationSchema.shape
                  ].isOptional();
                  const common = { control: form.control, name: fieldName, label };

                  const isFullWidth = type === "textarea" || type === "boolean" || name === "discordId" || name === "discord" || name === "portfolio" || name === "portfolioLink" || name === "motivation" || name === "tools" || name === "allergies" || name === "foodAllergies" || name === "availability" || name === "tshirt" || name === "tShirtSize";

                  return (
                    <div 
                      key={name} 
                      className={cn("flex flex-col", isFullWidth ? "sm:col-span-2" : "sm:col-span-1")}
                    >
                      <style jsx global>{`
                        label {
                          font-family: var(--font-hand) !important;
                          font-size: 1.35rem !important;
                          font-weight: 700 !important;
                          letter-spacing: 0.025em !important;
                          color: var(--foreground) !important;
                          margin-bottom: 0.35rem !important;
                        }
                        input, textarea, select, [data-slot="control"] {
                          font-family: var(--font-hand) !important;
                        }
                        [data-slot="control"], button[role="combobox"], input, textarea {
                          background-color: hsl(var(--card)) !important;
                          border-color: hsl(var(--border)) !important;
                        }
                      `}</style>

                      {type === "textarea" ? (
                        <FormTextarea 
                          {...common} 
                          required={required} 
                        />
                      ) : type === "boolean" ? (
                        <FormCheckbox 
                          {...common} 
                        />
                      ) : type === "select" ? (
                        <FormSelect 
                          {...common} 
                          required={required}
                        >
                          {options?.map((option) => (
                            <SelectItem key={option} value={option} className={cn("font-sans")}>
                              {option}
                            </SelectItem>
                          ))}
                        </FormSelect>
                      ) : (
                        <FormInput
                          {...common}
                          type={type}
                          icon={FIELD_ICONS[name]}
                          required={required}
                        />
                      )}
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

          <div className={cn("flex justify-between items-center gap-4 px-6 mt-6")}>
            <Button
              type="button"
              onClick={previous}
              disabled={step === 0 || isSubmitting || isSubmitted}
              className={cn("relative h-14 -rotate-2 gap-3 rounded-2xl border-0 bg-transparent px-8 text-base font-bold text-white uppercase hover:bg-transparent disabled:opacity-100 overflow-visible font-sans")}
            >
              <Image 
                src="/black-button.png" 
                alt="Back"
                width={150}
                height={56}
                className={cn("absolute inset-0 w-full h-full pointer-events-none object-fill scale-110")} 
              />
              <span className={cn("relative z-10 flex items-center gap-2 text-white font-sans")}>
                <ArrowLeft className={cn("size-5 stroke-[3] text-white")} />
                Back
              </span>
            </Button>

            <div className={cn("relative isolate -rotate-3")}>
              <span
                aria-hidden
                className={cn("pointer-events-none absolute top-1/2 left-1/2 -z-10 size-40 translate-x-[calc(-50%+5px)] translate-y-[calc(-50%+15px)] bg-primary next-splash-mask")}
              />
              <Button
                type={isLastStep ? "submit" : "button"}
                onClick={isLastStep ? undefined : next}
                disabled={isSubmitting || isSubmitted}
                className={cn("relative h-14 gap-2 rounded-2xl border-0 bg-transparent px-8 text-base font-bold text-foreground uppercase hover:bg-transparent overflow-visible font-sans disabled:opacity-70")}
              >
                <div 
                  className={cn("absolute inset-0 w-full h-full pointer-events-none scale-110 rounded-2xl bg-primary")}
                  style={{
                    WebkitMaskImage: "url('/orange-button.png')",
                    maskImage: "url('/orange-button.png')",
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                  }}
                />
                <span className={cn("relative z-10 flex items-center gap-2 text-foreground font-sans")}>
                  {!isLastStep ? "Next" : isSubmitting ? "Submitting…" : "Submit"}
                  <ArrowRight className={cn("size-5 stroke-[2.5]")} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}