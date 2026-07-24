"use client";

import Image from "next/image";
import { CSSProperties, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { FormInput } from "@/components/form";
import { ActionButton } from "@/components/action-button";
import { loginSchema, LoginFormData } from "@/lib/validators/login-schema";
import { loginJudge } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

const LOGIN_PATH = "/login";
/** Where to land after login when there's no `?from=` to return to. */
const POST_LOGIN_HOME = "/jury";

function LoginTitle() {
  return (
    <h2 className={cn("text-center text-[clamp(1.75rem,min(4.2vw,6vh),3.75rem)] font-extrabold uppercase tracking-wide font-heading text-foreground")}>
      Login
    </h2>
  );
}

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
    const result = await loginJudge(data);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    // Return the user to wherever middleware bounced them from (?from=…), else
    // the default landing. Only accept internal paths to avoid open redirects.
    const from = new URLSearchParams(window.location.search).get("from");
    const dest =
      from && from.startsWith("/") && !from.startsWith("//") && from !== LOGIN_PATH
        ? from
        : POST_LOGIN_HOME;

    router.replace(dest);
    // Re-run Server Components so they observe the freshly-set session cookie.
    router.refresh();
  });

  // A single fixed hue (unlike the per-step recolouring of the register form),
  // with the gradient disabled so the button fill reads solid like the mask.
  const formStyle = {
    "--primary": "var(--brand-marketing)",
    "--ring": "var(--brand-marketing)",
    "--primary-gradient": "none",
  } as CSSProperties;

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className={cn("relative mx-auto flex w-full max-w-md flex-col items-center px-4")}>
      <form
        onSubmit={onSubmit}
        style={{
          ...formStyle,
          backgroundImage: "url('/paper.svg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
        className={cn("login-form flex w-full flex-col gap-[clamp(1.5rem,4vh,2.5rem)] border-0 bg-transparent px-[clamp(1.5rem,7vw,3.5rem)] pt-[clamp(2rem,6vh,4rem)] pb-[clamp(2.5rem,7vh,5rem)] text-card-foreground font-sans")}
      >
        {/* Scoped to `.login-form` so the hand font on inputs doesn't leak elsewhere. */}
        <style jsx global>{`
          .login-form label {
            font-family: var(--font-hand) !important;
            font-weight: 700 !important;
            color: var(--foreground) !important;
          }
          .login-form input {
            font-family: var(--font-hand) !important;
          }
        `}</style>

        <div className={cn("flex flex-col items-center gap-[clamp(0.75rem,2vh,1.5rem)]")}>
          <div className={cn("relative w-[clamp(7rem,18vh,11rem)] h-[clamp(7rem,18vh,11rem)]")}>
            <Image
              src="/chameleon-logo.png"
              alt="Chameleon logo"
              width={256}
              height={256}
              className={cn("w-full h-full object-contain pointer-events-none")}
            />
          </div>
          <LoginTitle />
        </div>

        <div className={cn("flex flex-col gap-[clamp(1rem,3vh,1.5rem)]")}>
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
            className={cn("text-center text-base font-semibold text-destructive font-sans")}
          >
            {submitError}
          </p>
        )}

        <ActionButton
          variant="primary"
          splash
          type="submit"
          disabled={isSubmitting}
          className={cn("h-14 w-full mt-[clamp(1rem,3vh,2rem)]")}
        >
          Login
          <ArrowRight className={cn("size-5 stroke-[2.5]")} />
        </ActionButton>
      </form>
    </div>
  );
}
