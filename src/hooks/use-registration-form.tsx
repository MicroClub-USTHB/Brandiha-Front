import { useState } from "react";
import { useForm, Path, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormData } from "@/lib/validators/registration-schema";
import { REGISTRATION_STEPS, RegistrationField } from "@/lib/registration-fields";
import { submitRegistration } from "@/lib/api/registrations";

export function useRegistrationForm() {
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    // Validate only when a step is submitted (Next/Submit), not on blur — so a
    // field never turns red just because focus moved away from it.
    mode: "onSubmit",
    defaultValues: {
      FullName: "",
      Email: "",
      Phone: "",
      DiscordId: "",
      TeamName: "",
      Knowledge: "",
      HackathonExperience: false,
      PreviousHackathons: "",
      Skills: "",
      Tools: "",
      Portfolio: "",
      Links: "",
      Motivation: "",
      AvailabilityMessage: "",
      FoodAllergies: "",
      PhotoConsent: false,
      AdditionalInfo: "",
    },
  });

  const steps = REGISTRATION_STEPS;
  const availability = form.watch("Availability");

  const stepFieldNames = Object.keys(steps[step].fields) as RegistrationField[];

  const visibleFields = stepFieldNames.filter(
    (name) => name !== "AvailabilityMessage" || availability === "Other"
  );

  const next = async () => {
    const valid = await form.trigger(stepFieldNames as Path<RegistrationFormData>[]);
    if (valid) {
      setSubmitError(null);
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const previous = () => {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    setSubmitError(null);
    const result = await submitRegistration(data);
    if (result.ok) {
      setIsSubmitted(true);
    } else {
      setSubmitError(result.error);
    }
  };

  // When the whole-form validation fails on the last step, the offending field
  // may live on an earlier (hidden) step. Jump to the first step that has an
  // error so the inline messages are actually visible, and flag it.
  const onInvalid: SubmitErrorHandler<RegistrationFormData> = (errors) => {
    const firstErrorStep = steps.findIndex((s) =>
      Object.keys(s.fields).some((name) => name in errors)
    );
    if (firstErrorStep !== -1) setStep(firstErrorStep);
    setSubmitError("Please fix the highlighted fields before submitting.");
  };

  const submit = form.handleSubmit(onSubmit, onInvalid);

  return {
    form,
    step,
    steps,
    visibleFields,
    next,
    previous,
    submit,
    isSubmitting: form.formState.isSubmitting,
    submitError,
    isSubmitted,
  };
}
