"use server";

import { apiFetch } from "@/lib/api/client";

export type BulkScoreUpdatePayload = {
  submission_id: string;
  score: number;
};

export default async function bulkUpdateScoresAction(
  payload: BulkScoreUpdatePayload[]
): Promise<{ success: boolean; error?: string }> {
  console.log("bulkUpdateScoresAction called with payload:", payload);
  try {
    const res = await apiFetch("/admin/challenge-submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("bulkUpdateScoresAction response:", res);

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        success: false,
        error: errorData?.detail?.[0]?.msg || "Failed to update challenge scores",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}