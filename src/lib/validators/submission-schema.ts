import { z } from "zod";

export const submissionSchema = z.object({
  TeamCode: z.string().trim().min(1, "Please enter your team code."),
  Link: z.url("Please enter a valid link, e.g. https://github.com/your-team/repo."),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
