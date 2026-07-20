"use client";

import { FieldPath } from "react-hook-form";
import { useRegistrationForm } from "@/hooks/useRegistration";
import {
  registrationSchema,
  RegistrationFormData,
} from "@/lib/validators/registrationSchema";
import { FormCheckbox, FormInput, FormSelect, FormTextarea } from "@/components/form";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";

type FieldConfig = { label: string; type?: string; options?: readonly string[] };

export default function RegistrationForm() {
  const { form, step, steps, visibleFields, next, previous } = useRegistrationForm();
  const currentFields = steps[step].fields as Record<string, FieldConfig>;

  return (
    <form
      onSubmit={form.handleSubmit(console.log)}
      className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground"
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

          return <FormInput key={name} {...common} type={type} required={required} />;
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
          <Button type="submit" className="ml-auto">
            Submit
          </Button>
        )}
      </div>
    </form>
  );
}
