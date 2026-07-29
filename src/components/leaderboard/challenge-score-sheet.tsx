"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminLeaderboardEntry, ChallengeScore } from "@/lib/api/leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ScoreDrafts = Record<number, string>;

function buildDrafts(perChallenge: ChallengeScore[]): ScoreDrafts {
  return Object.fromEntries(
    perChallenge.map((challenge) => [challenge.challenge_id, String(challenge.score)]),
  );
}

function computeTotal(drafts: ScoreDrafts) {
  return Object.values(drafts).reduce((sum, value) => {
    const parsed = Number(value);
    return sum + (Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  }, 0);
}

export function ChallengeScoreSheet({
  team,
  onSave,
}: {
  team: AdminLeaderboardEntry;
  onSave: (updatedTeam: AdminLeaderboardEntry) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 Gestion du loading
  const [drafts, setDrafts] = useState<ScoreDrafts>(() => buildDrafts(team.per_challenge));

  useEffect(() => {
    if (!open) setDrafts(buildDrafts(team.per_challenge));
  }, [open, team.per_challenge]);

  const currentTotal = useMemo(() => computeTotal(drafts), [drafts]);
  
  const isDirty = team.per_challenge.some(
    (challenge) => String(challenge.score) !== drafts[challenge.challenge_id],
  );

  const updateScore = (challengeId: number, value: string) => {
    setDrafts((prev) => ({ ...prev, [challengeId]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedChallenges = team.per_challenge.map((challenge) => {
        const parsed = Number(drafts[challenge.challenge_id]);
        return {
          ...challenge,
          score: Number.isFinite(parsed) && parsed >= 0 ? parsed : challenge.score,
        };
      });

      const updatedTeam: AdminLeaderboardEntry = {
        ...team,
        per_challenge: updatedChallenges,
        total_score: updatedChallenges.reduce((sum, c) => sum + c.score, 0),
      };

      await onSave(updatedTeam);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update scores:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Edit scores
      </Button>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="pr-10">
          <SheetTitle className="capitalize">{team.team_name}</SheetTitle>
          <SheetDescription>
            Review every challenge, adjust its score, then save the updated team total.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4 mt-4">
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-foreground">Current total</span>
              <span className="font-heading text-2xl font-bold text-foreground">{currentTotal}</span>
            </div>
          </div>

          {team.per_challenge.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No challenge score is attached to this team yet.
            </p>
          ) : (
            <div className="space-y-3">
              {team.per_challenge.map((challenge) => (
                <article key={challenge.challenge_id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-base font-bold text-foreground">
                        {challenge.challenge_title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Challenge #{challenge.challenge_id} · Submission {challenge.submission_id}
                      </p>
                    </div>
                    <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      Score: {challenge.score}
                    </div>
                  </div>

                  <label className="block space-y-2 text-sm font-medium text-foreground">
                    <span>Update score</span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      disabled={loading}
                      value={drafts[challenge.challenge_id] ?? String(challenge.score)}
                      onChange={(e) => updateScore(challenge.challenge_id, e.target.value)}
                    />
                  </label>
                </article>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDrafts(buildDrafts(team.per_challenge))}
              disabled={!isDirty || loading}
            >
              Reset
            </Button>
            <Button type="button" onClick={handleSave} disabled={!isDirty || loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}