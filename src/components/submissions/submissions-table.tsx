"use client";

import { useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ChallengeSubmission } from "@/lib/api/challenge-types";
import { cn } from "@/lib/utils";

/**
 * Fixed locale and time zone rather than the viewer's: this table is server-
 * rendered first, and a locale-dependent format would disagree with the client
 * pass and mismatch on hydration. UTC is also the honest unit for judging a
 * deadline, so the column says so in its header.
 */
const TIMESTAMP = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function SortableHeader({
  column,
  children,
}: {
  column: Column<ChallengeSubmission, unknown>;
  children: ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      // Pulled left so the label lines up with the plain headers and the cells
      // below, despite the button's own padding.
      className={cn("-ml-2.5")}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ArrowUpDown className={cn("size-3.5")} aria-hidden />
    </Button>
  );
}

/**
 * `submitted_at` is an ISO-8601 UTC string, so the default string comparison
 * already sorts chronologically — no custom sorting function needed.
 */
const columns: ColumnDef<ChallengeSubmission>[] = [
  {
    accessorKey: "team_name",
    header: ({ column }) => <SortableHeader column={column}>Team</SortableHeader>,
    cell: ({ row }) => (
      <span className={cn("font-medium")}>{row.original.team_name}</span>
    ),
  },
  {
    accessorKey: "link",
    header: "Link",
    enableSorting: false,
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex max-w-xs items-center gap-1.5 text-primary underline underline-offset-2 hover:no-underline",
        )}
      >
        <span className={cn("truncate")}>{row.original.link}</span>
        <ExternalLink className={cn("size-3.5 shrink-0")} aria-hidden />
      </a>
    ),
  },
  {
    accessorKey: "submitted_at",
    header: ({ column }) => (
      <SortableHeader column={column}>Submitted (UTC)</SortableHeader>
    ),
    cell: ({ row }) => (
      <time
        dateTime={row.original.submitted_at}
        className={cn("tabular-nums text-muted-foreground")}
      >
        {TIMESTAMP.format(new Date(row.original.submitted_at))}
      </time>
    ),
  },
];

/** Every submission against one challenge, newest first until re-sorted. */
export function SubmissionsTable({ data }: { data: ChallengeSubmission[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "submitted_at", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className={cn("h-24 text-center text-muted-foreground")}
            >
              No submissions yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
