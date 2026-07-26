import type { RegistrationStatus } from "@/lib/api/registration-types";

/** A single member within a team, as returned by `GET /teams`. */
export interface TeamMember {
  registration_id: string;
  user_id: string;
  full_name: string;
  email: string;
  status: RegistrationStatus;
}

/** Stats returned by `GET /teams/stats`. */
export interface TeamStats {
  total_teams: number;
  accepted_teams: number;
  rejected_teams: number;
  pending_teams: number;
}

/** A team with its members. The team `status` is derived by the backend. */
export interface Team {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  status: RegistrationStatus;
  members: TeamMember[];
}
