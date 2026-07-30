import type { AlumniVote } from "@/lib/api/alumni-types";

/**
 * Every alumni's ballot, one card each, teams in the order they were ranked.
 *
 * The ranking is the whole content, so it's an ordered list: the numbers are the
 * data, not decoration, and `<ol>` is what carries that to a screen reader
 * without a rank column to read out.
 */
export function VoteResultsList({ votes }: { votes: AlumniVote[] }) {
  return (
    <ul className="mt-8 flex flex-col gap-4">
      {votes.map((vote) => (
        <li
          key={vote.alumni_email}
          className="rounded-lg border border-border bg-card p-4 text-card-foreground"
        >
          <p className="text-sm font-semibold">{vote.alumni_name}</p>
          <p className="truncate text-xs text-muted-foreground">{vote.alumni_email}</p>

          <ol className="mt-3 flex flex-col gap-1.5">
            {vote.ranked_teams.map((teamName, index) => (
              <li key={teamName} className="flex items-center gap-3">
                <span className="w-7 shrink-0 text-center font-mono text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <span className="truncate text-sm capitalize">{teamName}</span>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  );
}
