import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionElement = "section" | "div" | "article";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: SectionElement;
}

export function Section({
  children,
  className,
  as: Component = "section",
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        "w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
