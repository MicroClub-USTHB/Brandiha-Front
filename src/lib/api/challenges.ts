import "server-only";

import { publicApiFetch } from "./publicApiFetch";

export interface Challenge {
  id: number;
  title: string;
  unlocks_at: string;
  ends_at: string;
  department: string;
  created_at: string;
  updated_at: string;
}


export async function getPublicChallenges(): Promise<Challenge[]> {
  const res = await publicApiFetch("/challenges");
  if (!res.ok) {
    throw new Error(`Error (${res.status})`);
  }

  const challenges: Challenge[] = await res.json();
  return challenges;
}