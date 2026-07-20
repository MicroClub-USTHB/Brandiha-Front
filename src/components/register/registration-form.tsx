"use client";

import { CSSProperties } from "react";
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

type FieldConfig = { label: string; type?: string; options?: readonly string[] };

/** One brand hue per step (orange → blue → pink → teal), matching the stepper. */
const STEP_HUES = [
  "var(--brand-marketing)",
  "var(--brand-communication)",
  "var(--brand-multimedia)",
  "var(--brand-design)",
];

export default function RegistrationForm() {
  const { form, step, steps, visibleFields, next, previous } = useRegistrationForm();
  const currentFields = steps[step].fields as Record<string, FieldConfig>;

  // Drive the primary Button and the inputs' focus ring/border off the current
  // step's hue by scoping the --primary and --ring tokens to this form. The
  // default theme paints a 4-stop brand gradient over every .bg-primary, so we
  // also clear --primary-gradient here to let the solid step hue show through.
  const hue = STEP_HUES[step % STEP_HUES.length];
  const stepStyle = {
    "--primary": hue,
    "--ring": hue,
    "--primary-gradient": "none",
  } as CSSProperties;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <RegistrationStepper count={steps.length} current={step} />

      <form
        onSubmit={form.handleSubmit(console.log)}
        style={stepStyle}
        className="flex w-full flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Registration</h2>
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {visibleFields.map((name) => {
            const { label, type, options } = currentFields[name];
            const fieldName = name as FieldPath<RegistrationFormData>;
            const required = !registrationSchema.shape[
              name as keyof typeof registrationSchema.shape
            ].isOptional();
            const common = { control: form.control, name: fieldName, label };

            if (type === "textarea") {
              return <FormTextarea key={name} {...common} required={required} />;
            }

            if (type === "boolean") {
              return <FormCheckbox key={name} {...common} />;
            }

            if (type === "select") {
              return (
                <FormSelect key={name} {...common} required={required}>
                  {options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </FormSelect>
              );
            }

            return (
              <FormInput
                key={name}
                {...common}
                type={type}
                icon={FIELD_ICONS[name]}
                required={required}
              />
            );
          })}
        </div>

        <div className="flex justify-between gap-2">
          <Button type="button" variant="outline" onClick={previous} disabled={step === 0}>
            Previous
          </Button>

          {step < steps.length - 1 ? (
            <Button type="button" onClick={next} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={form.handleSubmit(console.log)}
              className="ml-auto"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
