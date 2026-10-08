import type { ComponentProps } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** The "Export to CSV" button both exports share, spinning while `loading`. */
export function ExportButton({
  loading = false,
  disabled,
  ...props
}: Omit<ComponentProps<typeof Button>, "children" | "variant"> & { loading?: boolean }) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || loading}
      className="bg-card px-4 font-semibold text-card-foreground"
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Exporting…
        </>
      ) : (
        <>
          <Download className="size-4" />
          Export to CSV
        </>
      )}
    </Button>
  );
}
