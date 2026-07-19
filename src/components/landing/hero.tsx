import { Section } from "@/components/landing/section";

export function Hero() {
  return (
    <Section as="section" className="flex flex-col items-center text-center py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        Lorem ipsum dolor sit amet
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="#about"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Learn More
        </a>
        <a
          href="#agenda"
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted"
        >
          View Agenda
        </a>
      </div>
    </Section>
  );
}
