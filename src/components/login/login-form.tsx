"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { FormInput } from "@/components/form";
import { ActionButton } from "@/components/action-button";
import { PaperFormCard } from "@/components/paper-form-card";
import { loginSchema, LoginFormData } from "@/lib/validators/login-schema";
import { loginStaff } from "@/lib/api/auth";
import { HOME_BY_ROLE } from "@/lib/auth/home";

const LOGIN_PATH = "/login";

export default function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    // Validate on submit, not on blur — a field never turns red just from losing focus.
    mode: "onSubmit",
    defaultValues: { Email: "", Password: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    const result = await loginStaff(data);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    // Return the user to wherever the proxy bounced them from (?from=…), else
    // the home for their role — the roles are disjoint, so there is no single
    // landing page that suits all three. Only accept internal paths for `from`,
    // to avoid open redirects.
    const from = new URLSearchParams(window.location.search).get("from");
    const dest =
      from && from.startsWith("/") && !from.startsWith("//") && from !== LOGIN_PATH
        ? from
        : HOME_BY_ROLE[result.role];

    router.replace(dest);
    // Re-run Server Components so they observe the freshly-set session cookie.
    router.refresh();
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <PaperFormCard title="Login" onSubmit={onSubmit}>
      <div className="flex flex-col gap-[clamp(1rem,3vh,1.5rem)]">
        <FormInput
          control={form.control}
          name="Email"
          label="Email"
          type="email"
          icon={<Mail />}
          required
        />
        <FormInput
          control={form.control}
          name="Password"
          label="Password"
          type="password"
          icon={<Lock />}
          required
        />
      </div>

      {submitError && (
        <p
          role="alert"
          className="text-center text-base font-semibold text-destructive font-sans"
        >
          {submitError}
        </p>
      )}

      <ActionButton
        variant="primary"
        splash
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full mt-[clamp(1rem,3vh,2rem)]"
      >
        Login
        <ArrowRight className="size-5 stroke-[2.5]" />
      </ActionButton>
    </PaperFormCard>
  );
}
