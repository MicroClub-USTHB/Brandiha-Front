/**
 * A leaderboard in rank order: highest `total_score` first, ties left in the
 * order the backend sent them. Returns a new array, so it's safe on props and
 * state. Shared by the public board and the super admin's, which re-sorts after
 * every score edit.
 */
export function byScore<T extends { total_score: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => b.total_score - a.total_score);
}
