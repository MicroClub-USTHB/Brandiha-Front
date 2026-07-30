"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRight, CircleCheckBig, KeyRound, Link2 } from "lucide-react";
import { FormInput } from "@/components/form";
import { ActionButton } from "@/components/action-button";
import { submissionSchema, SubmissionFormData } from "@/lib/validators/submission-schema";
import { submitChallenge } from "@/lib/api/challenges";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function SubmitTitle({ challengeTitle }: { challengeTitle: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1")}>
      <h2 className={cn("text-center text-[clamp(1.75rem,min(4.2vw,6vh),3.75rem)] font-extrabold uppercase tracking-wide font-heading text-foreground")}>
        Submit
      </h2>
      <p className={cn("text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground font-sans")}>
        {challengeTitle}
      </p>
    </div>
  );
}

export default function SubmitForm({
  challengeId,
  challengeTitle,
}: {
  challengeId: number;
  challengeTitle: string;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    // Validate on submit, not on blur — a field never turns red just from losing focus.
    mode: "onSubmit",
    defaultValues: { TeamCode: "", Link: "" },
  });

  const onValid = () => {
    setSubmitError(null);
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    const data = form.getValues();
    setSubmitError(null);
    const result = await submitChallenge(challengeId, data);
    if (!result.ok) {
      setSubmitError(result.error);
      setShowConfirm(false);
      return;
    }
    setSubmitted(true);
    setShowConfirm(false);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className={cn("relative mx-auto flex w-full max-w-md flex-col items-center px-4 overflow-visible")}>
      <form
        onSubmit={form.handleSubmit(onValid)}
        style={{
          backgroundImage: "url('/paper.svg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
        className={cn("submit-form flex w-full flex-col gap-[clamp(1.5rem,4vh,2.5rem)] overflow-visible border-0 bg-transparent px-[clamp(1.5rem,7vw,3.5rem)] pt-[clamp(2rem,6vh,4rem)] pb-[clamp(2.5rem,7vh,5rem)] text-card-foreground font-sans")}
      >
        {/* Scoped to `.submit-form` so the hand font on inputs doesn't leak elsewhere. */}
        <style jsx global>{`
          .submit-form label {
            font-family: var(--font-hand) !important;
            font-weight: 700 !important;
            color: var(--foreground) !important;
          }
          .submit-form input {
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
          <SubmitTitle challengeTitle={challengeTitle} />
        </div>

        {submitted ? (
          <div
            role="status"
            className={cn("flex flex-col items-center gap-3 text-center font-sans")}
          >
            <CircleCheckBig className={cn("size-10 text-primary")} aria-hidden />
            <p className={cn("text-lg font-bold text-foreground")}>Submission received</p>
            <p className={cn("text-sm text-muted-foreground")}>
              Your team&apos;s entry is in. Each team gets one submission per challenge, so
              this one is final.
            </p>
          </div>
        ) : (
          <>
            <div className={cn("flex flex-col gap-[clamp(1rem,3vh,1.5rem)]")}>
              <FormInput
                control={form.control}
                name="TeamCode"
                label="Team Code"
                icon={<KeyRound />}
                required
              />
              <FormInput
                control={form.control}
                name="Link"
                label="Link"
                type="url"
                icon={<Link2 />}
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
              Submit
              <ArrowRight className={cn("size-5 stroke-[2.5]")} />
            </ActionButton>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="size-5 text-warning" />
                    Submit your entry?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Each team gets one submission per challenge. This entry is final
                    once it&rsquo;s in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSubmit}>
                    Submit entry
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </form>
    </div>
  );
}
