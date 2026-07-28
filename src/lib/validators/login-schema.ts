import { z } from "zod";

export const loginSchema = z.object({
  Email: z.email("Please enter a valid email address, e.g. you@example.com."),
  Password: z.string().min(1, "Please enter your password."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
