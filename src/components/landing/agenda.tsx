import { Section } from "@/components/landing/section";

const agendaItems = [
  { time: "09:00", title: "Lorem ipsum dolor", description: "Consectetur adipiscing elit." },
  { time: "10:30", title: "Sed do eiusmod", description: "Tempor incididunt ut labore." },
  { time: "12:00", title: "Ut enim ad minim", description: "Quis nostrud exercitation." },
  { time: "14:00", title: "Duis aute irure", description: "Dolor in reprehenderit." },
];

export function Agenda() {
  return (
    <Section as="section" id="agenda">
      <h2 className="text-3xl font-bold text-foreground">Agenda</h2>
      <ul className="mt-8 space-y-6">
        {agendaItems.map((item) => (
          <li
            key={item.time}
            className="flex gap-4 rounded-lg border border-border bg-background p-4"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {item.time}
            </span>
            <div>
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
