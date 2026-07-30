"use server";

import { backendFetch } from "@/lib/api/fetch";

export type BulkScoreUpdatePayload = {
  submission_id: string;
  score: number;
};

export default async function bulkUpdateScoresAction(
  payload: BulkScoreUpdatePayload[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await backendFetch("/admin/challenge-submissions", {
      auth: true,
      method: "PATCH",
      body: JSON.stringify(payload),
    });


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