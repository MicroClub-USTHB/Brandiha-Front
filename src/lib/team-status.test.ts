import { describe, expect, it } from "vitest";

import { canDeleteTeam, countTeamsByStatus, teamStatus } from "@/lib/team-status";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import type { Team, TeamMember } from "@/lib/api/team-types";

/** A member is only ever inspected for its status here. */
function members(...statuses: RegistrationStatus[]): TeamMember[] {
  return statuses.map((status, i) => ({
    registration_id: `r${i}`,
    user_id: `u${i}`,
    full_name: `Member ${i}`,
    email: `member${i}@example.com`,
    status,
  }));
}

describe("teamStatus", () => {
  it("takes the majority", () => {
    expect(teamStatus(members("accepted", "accepted", "pending"))).toBe("accepted");
    expect(teamStatus(members("rejected", "rejected", "accepted"))).toBe("rejected");
    expect(teamStatus(members("pending", "pending", "rejected"))).toBe("pending");
  });

  it("reads a unanimous team as that status", () => {
    expect(teamStatus(members("accepted", "accepted"))).toBe("accepted");
    expect(teamStatus(members("rejected"))).toBe("rejected");
  });

  it("falls back to pending when there is no single majority", () => {
    // One each — three-way tie.
    expect(teamStatus(members("accepted", "rejected", "pending"))).toBe("pending");
    // Two-way tie, neither of them pending.
    expect(teamStatus(members("accepted", "rejected"))).toBe("pending");
  });

  it("reads an empty team as pending", () => {
    expect(teamStatus([])).toBe("pending");
  });
});

describe("canDeleteTeam", () => {
  it("allows an empty team", () => {
    expect(canDeleteTeam([])).toBe(true);
  });

  it("allows a team whose every member is rejected", () => {
    expect(canDeleteTeam(members("rejected", "rejected", "rejected"))).toBe(true);
  });

  it("refuses a team with any pending or accepted member", () => {
    expect(canDeleteTeam(members("rejected", "accepted"))).toBe(false);
    expect(canDeleteTeam(members("rejected", "pending"))).toBe(false);
    expect(canDeleteTeam(members("accepted"))).toBe(false);
  });

  /**
   * The bug this function was extracted to fix: the button used to gate on
   * `teamStatus(...) === "rejected"`, which a majority satisfies, so this team
   * offered a delete the backend could only answer with a 400.
   */
  it("refuses a majority-rejected team that is not unanimously rejected", () => {
    const mixed = members("rejected", "rejected", "rejected", "accepted", "accepted");
    expect(teamStatus(mixed)).toBe("rejected");
    expect(canDeleteTeam(mixed)).toBe(false);
  });
});

describe("countTeamsByStatus", () => {
  /** A team is only ever inspected for its members here. */
  function team(...statuses: RegistrationStatus[]): Team {
    return {
      id: statuses.join("-"),
      created_at: "",
      updated_at: "",
      name: "team",
      secret_code: "code",
      // The backend's own status, deliberately at odds with the members, so a
      // count that read it instead of the majority would fail.
      status: "rejected",
      members: members(...statuses),
    };
  }

  it("counts each team under its majority status", () => {
    expect(
      countTeamsByStatus([
        team("accepted", "accepted", "pending"),
        team("accepted"),
        team("pending", "pending", "rejected"),
        team(),
      ]),
    ).toEqual({ accepted: 2, pending: 2, rejected: 0 });
  });

  it("counts nothing for no teams", () => {
    expect(countTeamsByStatus([])).toEqual({ accepted: 0, pending: 0, rejected: 0 });
  });
});
