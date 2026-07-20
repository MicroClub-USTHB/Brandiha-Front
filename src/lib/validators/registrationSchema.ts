import { z } from "zod";

export const registrationSchema = z
  .object({
  
    FullName: z.string().trim().min(1, "Full name is required"),
    Email: z.email("Invalid email address"),
    Phone: z.string().trim().min(1, "Invalid phone number"),
    DiscordId: z.string().trim().min(1, "Discord ID is required"),

    TeamName: z.string().trim().min(1, "This section is required"),
    Role: z.string().trim().min(1, "This section is required"),
    Knowledge: z.string().trim().min(1, "This section is required"),
    HackathonExperience: z.boolean(),
    PreviousHackathons: z.string().trim().optional(),

    Skills: z.string().trim().min(1, "This section is required"),
    Tools: z.string().trim().min(1, "This section is required"),
    Portfolio: z.url("Invalid URL").optional().or(z.literal("")),
    Links: z.url("Invalid URL").optional().or(z.literal("")),
    Motivation: z.string().trim().min(1, "This section is required"),

    Availability: z.enum(["Yes", "No", "Other"]),
    AvailabilityMessage: z.string().trim().optional(),
    TShirtSize: z.enum(["S", "M", "L", "XL", "XXL"]),
    FoodAllergies: z.string().trim().min(1, "This section is required"),
    PhotoConsent: z.boolean(),
    AdditionalInfo: z.string().trim().optional(),

  })

  .superRefine((data, ctx) => {
    if (
      data.Availability === "Other" &&
      !data.AvailabilityMessage?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["AvailabilityMessage"],
        message: "Please specify your availability.",
      });
    }
  });

  export type RegistrationSchema = z.infer<typeof registrationSchema>;