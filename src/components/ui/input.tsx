import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  icon,
  wrapperClassName,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: React.ReactNode
  wrapperClassName?: string
}) {
  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        "relative flex h-12 w-full items-center gap-2.5 rounded-lg border-2 border-input bg-card px-4 text-base shadow-xs transition-[color,box-shadow] md:text-sm",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:focus-within:ring-destructive/20",
        "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50",
        wrapperClassName
      )}
    >
      {/* Decorative break in the top-left border: a card-coloured sliver painted
         over the stroke so it reads as a small gap, matching the mockup. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[3px] left-5 h-[3px] w-3.5 bg-card"
      />
      {icon && (
        <span className="flex shrink-0 items-center text-muted-foreground [&>svg]:size-[18px]">
          {icon}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-full w-full min-w-0 bg-transparent py-1 outline-none placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
