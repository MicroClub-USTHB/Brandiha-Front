import { describe, expect, it } from "vitest";

import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/validators/registration-schema";

/** A submission that passes, so each test can vary one field against it. */
const VALID: RegistrationFormData = {
  FullName: "Ada Lovelace",
  Email: "ada@example.com",
  Phone: "+213600000000",
  DiscordId: "ada#0001",
  TeamName: "team alpha",
  Role: "Design",
  Knowledge: "A branding hackathon.",
  HackathonExperience: false,
  PreviousHackathons: "",
  Skills: "Illustration",
  Tools: "Figma",
  Portfolio: "",
  Links: "",
  Motivation: "To learn.",
  Availability: "Yes",
  AvailabilityMessage: "",
  TShirtSize: "M",
  FoodAllergies: "None",
  PhotoConsent: true,
  AdditionalInfo: "",
};

const parse = (patch: Partial<RegistrationFormData> = {}) =>
  registrationSchema.safeParse({ ...VALID, ...patch });

/** The field paths a failed parse complained about. */
const errorPaths = (result: ReturnType<typeof parse>) =>
  result.success ? [] : result.error.issues.map((i) => i.path.join("."));

describe("registrationSchema", () => {
  it("accepts a complete submission", () => {
    expect(parse().success).toBe(true);
  });

  it("requires the fields the form marks required", () => {
    expect(errorPaths(parse({ FullName: "" }))).toContain("FullName");
    expect(errorPaths(parse({ Email: "not-an-email" }))).toContain("Email");
    expect(errorPaths(parse({ Skills: "  " }))).toContain("Skills");
    expect(errorPaths(parse({ FoodAllergies: "" }))).toContain("FoodAllergies");
  });

  it("leaves the genuinely optional fields optional", () => {
    expect(parse({ PreviousHackathons: "", Portfolio: "", AdditionalInfo: "" }).success).toBe(
      true,
    );
  });

  describe("Links", () => {
    /**
     * The field is labelled "Other Links" and is mapped into the backend's
     * `other_links[]` by splitting on commas and newlines. Validating it as one
     * `z.url()` rejected exactly the input it asks for.
     */
    it("accepts several links separated by commas or newlines", () => {
      expect(parse({ Links: "https://a.com, https://b.com" }).success).toBe(true);
      expect(parse({ Links: "https://a.com\nhttps://b.com" }).success).toBe(true);
    });

    it("accepts one link, or none", () => {
      expect(parse({ Links: "https://a.com" }).success).toBe(true);
      expect(parse({ Links: "" }).success).toBe(true);
      expect(parse({ Links: "   " }).success).toBe(true);
    });

    it("rejects the list when any entry is not a URL", () => {
      expect(errorPaths(parse({ Links: "https://a.com, nope" }))).toContain("Links");
      expect(errorPaths(parse({ Links: "nope" }))).toContain("Links");
    });

    /** The form reads this to decide whether to show a required marker. */
    it("still reports as optional", () => {
      expect(registrationSchema.shape.Links.isOptional()).toBe(true);
    });
  });

  describe("AvailabilityMessage", () => {
    it('is required when Availability is "Other"', () => {
      const result = parse({ Availability: "Other", AvailabilityMessage: "" });
      expect(errorPaths(result)).toContain("AvailabilityMessage");
    });

    it('is accepted when Availability is "Other" and it is filled in', () => {
      expect(
        parse({ Availability: "Other", AvailabilityMessage: "Mornings only" }).success,
      ).toBe(true);
    });

    it("is ignored otherwise", () => {
      expect(parse({ Availability: "Yes", AvailabilityMessage: "" }).success).toBe(true);
      expect(parse({ Availability: "No", AvailabilityMessage: "" }).success).toBe(true);
    });
  });

  describe("Phone", () => {
    it("accepts the formats people actually type", () => {
      for (const Phone of ["+213600000000", "0600 00 00 00", "(213) 600-0000"]) {
        expect(parse({ Phone }).success, Phone).toBe(true);
      }
    });

    it("rejects a value with no digits or too few", () => {
      expect(errorPaths(parse({ Phone: "abcdef" }))).toContain("Phone");
      expect(errorPaths(parse({ Phone: "123" }))).toContain("Phone");
    });
  });
});
