import { Section } from "@/components/landing/section";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Section as="div" className="py-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Brandiha. Lorem ipsum dolor sit amet.
        </p>
      </Section>
    </footer>
  );
}
