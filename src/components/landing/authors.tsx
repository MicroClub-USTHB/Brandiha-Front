import { Section } from "@/components/landing/section";

const authors = [
  { name: "Lorem Ipsum", role: "Dolor Sit" },
  { name: "Consectetur Adipiscing", role: "Elit Sed" },
  { name: "Eiusmod Tempor", role: "Incididunt Ut" },
];

export function Authors() {
  return (
    <Section as="section" id="authors" className="bg-muted">
      <h2 className="text-3xl font-bold text-foreground">Authors</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <div
            key={author.name}
            className="rounded-lg border border-border bg-background p-6"
          >
            <div className="mb-4 size-16 rounded-full bg-muted" />
            <h3 className="font-medium text-foreground">{author.name}</h3>
            <p className="text-sm text-muted-foreground">{author.role}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
