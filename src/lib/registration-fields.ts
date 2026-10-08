/** How a field renders; plain text input when absent. */
export type RegistrationFieldType = "email" | "select" | "textarea" | "boolean";

/** One field's config within a registration step. */
export interface RegistrationFieldConfig {
  label: string;
  type?: RegistrationFieldType;
  options?: readonly string[];
  /** Span both columns. Textareas and checkboxes always do. */
  fullWidth?: boolean;
}

export const REGISTRATION_STEPS = [
  {
    fields: {
      FullName: { label: "Full Name" },
      Email: { label: "Email", type: "email" },
      Phone: { label: "Phone Number" },
      DiscordId: { label: "Discord ID" },
    },
  },
  {
    fields: {
      TeamName: { label: "Team Name" },
      Role: {
        label: "Your Role",
        type: "select",
        options: ["Marketing", "Communication", "Design", "Multimedia"],
      },
      Knowledge: { label: "What do you know about Brandiha?", type: "textarea" },
      HackathonExperience: {
        label: "Have you ever participated in similar competitions before?",
        type: "boolean",
      },
      PreviousHackathons: { label: "If yes, which one?" },
    },
  },
  {
    fields: {
      Skills: { label: "Tell us more about your skills.", type: "textarea" },
      Tools: { label: "What tools do you use?", type: "textarea" },
      Portfolio: { label: "Portfolio" },
      Links: { label: "Other Links" },
      Motivation: { label: "Why do you want to participate?", type: "textarea" },
    },
  },
  {
    fields: {
      Availability: {
        label: "Will you be available during the competition days?",
        type: "select",
        options: ["Yes", "No", "Other"],
      },
      AvailabilityMessage: { label: "Explain your availability", type: "textarea" },
      TShirtSize: {
        label: "What's your t-shirt size?",
        type: "select",
        options: ["S", "M", "L", "XL", "XXL"],
      },
      FoodAllergies: { label: "Do you have any food allergies?" },
      PhotoConsent: { label: "Are you okay with being photographed?", type: "boolean" },
      AdditionalInfo: { label: "Anything to add?", type: "textarea" },
    },
  },
] as const satisfies readonly { fields: Record<string, RegistrationFieldConfig> }[];

export type RegistrationField = keyof (typeof REGISTRATION_STEPS)[number]["fields"];