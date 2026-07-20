import { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormData } from "@/lib/validators/registrationSchema";
import { REGISTRATION_STEPS, RegistrationField } from "@/lib/registrationFields";

export function useRegistrationForm() {
  const [step, setStep] = useState(0);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      FullName: "",
      Email: "",
      Phone: "",
      DiscordId: "",
      TeamName: "",
      Role: "",
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
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const previous = () => setStep((s) => Math.max(s - 1, 0));

  return { form, step, steps, visibleFields, next, previous };
}
