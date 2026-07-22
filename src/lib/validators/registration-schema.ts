import { z } from "zod";

export const registrationSchema = z.object({
  FullName: z.string().trim().min(1, "Please enter your full name."),
  Email: z.email("Please enter a valid email address, e.g. you@example.com."),
  Phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .regex(/^[+(]?[\d][\d\s().-]{5,}$/, "Please enter a valid phone number."),
  DiscordId: z.string().trim().min(1, "Please enter your Discord ID."),

  TeamName: z.string().trim().min(1, "Please enter your team name."),
  Role: z.enum(["Marketing", "Communication", "Design", "Multimedia"], {
    error: "Please select your department.",
  }),
  Knowledge: z.string().trim().min(1, "Please tell us what you know about Brandiha."),
  HackathonExperience: z.boolean(),
  PreviousHackathons: z.string().trim().optional(),

  Skills: z.string().trim().min(1, "Please tell us a bit about your skills."),
  Tools: z.string().trim().min(1, "Please list the tools you use."),
  Portfolio: z
    .url("Please enter a valid URL, including https://.")
    .optional()
    .or(z.literal("")),
  Links: z
    .url("Please enter a valid URL, including https://.")
    .optional()
    .or(z.literal("")),
  Motivation: z.string().trim().min(1, "Please tell us why you want to participate."),

  Availability: z.enum(["Yes", "No", "Other"], {
    error: "Please select your availability.",
  }),
  AvailabilityMessage: z.string().trim().optional(),
  TShirtSize: z.enum(["S", "M", "L", "XL", "XXL"], {
    error: "Please select your t-shirt size.",
  }),
  FoodAllergies: z
    .string()
    .trim()
    .min(1, 'Please list any food allergies, or write "None".'),
  PhotoConsent: z.boolean(),
  AdditionalInfo: z.string().trim().optional(),
}).superRefine((data, ctx) => {
  if (
    data.Availability === "Other" &&
    !data.AvailabilityMessage?.trim()
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["AvailabilityMessage"],
      message: "Please describe your availability.",
    });
  }
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
