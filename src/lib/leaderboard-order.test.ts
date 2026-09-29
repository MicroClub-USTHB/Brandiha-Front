import { describe, expect, it } from "vitest";

import { byScore } from "@/lib/leaderboard-order";

describe("byScore", () => {
  it("puts the highest total first", () => {
    const rows = [
      { team_name: "b", total_score: 10 },
      { team_name: "a", total_score: 30 },
      { team_name: "c", total_score: 20 },
    ];
    expect(byScore(rows).map((r) => r.team_name)).toEqual(["a", "c", "b"]);
  });

  it("keeps tied teams in the order they arrived", () => {
    const rows = [
      { team_name: "first", total_score: 5 },
      { team_name: "second", total_score: 5 },
    ];
    expect(byScore(rows).map((r) => r.team_name)).toEqual(["first", "second"]);
  });

  it("leaves the input untouched", () => {
    const rows = [
      { team_name: "low", total_score: 1 },
      { team_name: "high", total_score: 2 },
    ];
    byScore(rows);
    expect(rows[0].team_name).toBe("low");
  });
});
