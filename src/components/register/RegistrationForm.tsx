"use client";

import { Path } from "react-hook-form";
import { useRegistrationForm } from "@/hooks/useRegistration";
import { registrationSchema, RegistrationSchema } from "@/lib/validators/registrationSchema";

type FieldConfig = { label: string; type?: string; options?: readonly string[] };

export default function RegistrationForm() {
  const { form, step, steps, visibleFields, next, previous } = useRegistrationForm();
  const currentFields = steps[step].fields as Record<string, FieldConfig>;

  return (
    <form onSubmit={form.handleSubmit(console.log)} className="flex flex-col gap-4 p-4 border">
      <div>
        <h2>Registration</h2>
        <p>
          Step {step + 1} of {steps.length}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {visibleFields.map((name) => {
          const { label, type, options } = currentFields[name];
          const error = form.formState.errors[name as keyof typeof form.formState.errors];
          const required = !registrationSchema.shape[name as keyof typeof registrationSchema.shape].isOptional();
          const fieldName = name as Path<RegistrationSchema>;

          return (
            <div key={name} className="flex flex-col gap-1">
              <label>
                {label}
                {required && " *"}
              </label>

              {type === "textarea" && <textarea {...form.register(fieldName)} className="border" />}

              {type === "select" && (
                <select {...form.register(fieldName)} className="border">
                  {options?.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {type === "boolean" && (
                <select
                  {...form.register(fieldName, { setValueAs: (v) => v === "true" })}
                  className="border"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              )}

              {type !== "textarea" && type !== "select" && type !== "boolean" && (
                <input type={type ?? "text"} {...form.register(fieldName)} className="border" />
              )}

              {error?.message && <p>{String(error.message)}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-2">
        <button type="button" onClick={previous} disabled={step === 0} className="border px-2 py-1">
          Previous
        </button>

        {step < steps.length - 1 ? (
          <button type="button" onClick={next} className="border px-2 py-1 ml-auto">
            Next
          </button>
        ) : (
          <button type="submit" className="border px-2 py-1 ml-auto">
            Submit
          </button>
        )}
      </div>
    </form>
  );
}