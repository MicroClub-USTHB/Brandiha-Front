import { Section } from "@/components/landing/section";

export function About() {
  return (
    <Section as="section" id="about" className="bg-muted">
      <h2 className="font-heading text-3xl font-bold text-foreground">About</h2>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure
        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
        inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
    </Section>
  );
}
