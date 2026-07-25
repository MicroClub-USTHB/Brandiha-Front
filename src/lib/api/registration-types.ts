/**
 * Response shapes for the admin registrations endpoints, mirroring the live
 * backend payloads (which are fuller than the API doc suggests). Kept free of
 * server-only code so client components can import these types too.
 */

export type RegistrationStatus = "pending" | "accepted" | "rejected";
export type Department = "multimedia" | "design" | "communication" | "marketing";
export type AvailabilityAnswer = "yes" | "no" | "other";
export type TShirtSize = "S" | "M" | "L" | "XL" | "XXL";

/** A single registration as returned by `GET /registrations` and `/registrations/{id}`. */
export interface RegistrationDetail {
  id: string;
  created_at: string;
  updated_at: string;

  user_id: string;
  team_id: string;

  knowledge_about_brandiha: string;
  participated_before: boolean;
  previous_competitions: string | null;

  skills: string;
  tools: string[];
  portfolio_url: string | null;
  other_links: string[];
  motivation: string;
  department: Department;

  food_allergies: string | null;
  available_during_event: AvailabilityAnswer;
  availability_note: string | null;
  okay_with_photos: boolean;
  t_shirt_size: TShirtSize;
  additional_notes: string | null;

  status: RegistrationStatus;

  // Joined display fields.
  user_full_name: string;
  user_email: string;
  /** Normalised by the backend: lowercased, whitespace collapsed. */
  team_name: string;
  team_secret_code: string;
}
