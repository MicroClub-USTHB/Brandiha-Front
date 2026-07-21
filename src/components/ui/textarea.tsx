import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  required,
  wrapperClassName,
  ...props
}: React.ComponentProps<"textarea"> & { wrapperClassName?: string }) {
  return (
    <div
      data-slot="textarea-wrapper"
      className={cn(
        "relative w-full rounded-lg border-2 border-input bg-card px-4 py-3 text-base shadow-xs transition-[color,box-shadow] md:text-sm",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
        "has-[textarea[aria-invalid=true]]:border-destructive has-[textarea[aria-invalid=true]]:focus-within:ring-destructive/20",
        "has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:opacity-50",
        wrapperClassName
      )}
    >
      {/* Decorative break in the top-left border, matching the inputs. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[3px] left-5 h-[3px] w-3.5 bg-card"
      />
      {required && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1.5 right-3 text-lg leading-none font-bold text-primary"
        >
          *
        </span>
      )}
      <textarea
        data-slot="textarea"
        className={cn(
          "field-sizing-content min-h-16 w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }
