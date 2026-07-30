import { describe, expect, it } from "vitest";

import { canDeleteTeam, teamStatus } from "@/lib/team-status";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import type { TeamMember } from "@/lib/api/team-types";

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
