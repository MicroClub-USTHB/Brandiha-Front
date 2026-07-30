"use server";

import { toggleLeaderboardFreezeApi } from "@/lib/api/leaderboard";
import { revalidatePath } from "next/cache";

export async function toggleLeaderboardFreezeAction() {
  try {
    const data = await toggleLeaderboardFreezeApi();
    revalidatePath("/super-admin-leaderboard");
    revalidatePath("/leaderboard");
    return { success: true, frozen: data.frozen };
  } catch (error) {
    console.error("Error toggling freeze:", error);
    return { success: false, error: "Impossible de modifier l'état du gel." };
  }
}