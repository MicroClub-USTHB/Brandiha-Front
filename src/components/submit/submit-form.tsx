"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRight, CircleCheckBig, KeyRound, Link2 } from "lucide-react";
import { FormInput } from "@/components/form";
import { ActionButton } from "@/components/action-button";
import { PaperFormCard } from "@/components/paper-form-card";
import { submissionSchema, SubmissionFormData } from "@/lib/validators/submission-schema";
import { submitChallenge } from "@/lib/api/challenges";
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
  // The confirm dialog closes the moment "Submit entry" is clicked, while the
  // request is still in flight — and `formState.isSubmitting` is already false
  // by then, since the form's own submit only opened the dialog. Without this
  // the Submit button came back to life mid-request and could send the entry
  // twice.
  const [sending, setSending] = useState(false);

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
    if (sending) return;
    const data = form.getValues();
    setSubmitError(null);
    setSending(true);
    // The action returns its errors rather than throwing, but the call itself
    // can still reject (the network drops, the deployment changes under the
    // page). Without the catch and finally, that left Submit disabled for good.
    const result = await submitChallenge(challengeId, data)
      .catch(() => ({
        ok: false as const,
        error: "Couldn't reach the server. Please try again in a moment.",
      }))
      .finally(() => setSending(false));
    if (!result.ok) {
      setSubmitError(result.error);
      setShowConfirm(false);
      return;
    }
    setSubmitted(true);
    setShowConfirm(false);
  };

  const isSubmitting = form.formState.isSubmitting || sending;

  return (
    <PaperFormCard
      title="Submit"
      subtitle={challengeTitle}
      onSubmit={form.handleSubmit(onValid)}
    >
      {submitted ? (
        <div
          role="status"
          className="flex flex-col items-center gap-3 text-center font-sans"
        >
          <CircleCheckBig className="size-10 text-primary" aria-hidden />
          <p className="text-lg font-bold text-foreground">Submission received</p>
          <p className="text-sm text-muted-foreground">
            Your team&apos;s entry is in. Each team gets one submission per challenge, so
            this one is final.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[clamp(1rem,3vh,1.5rem)]">
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
            Submit
            <ArrowRight className="size-5 stroke-[2.5]" />
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
    </PaperFormCard>
  );
}
