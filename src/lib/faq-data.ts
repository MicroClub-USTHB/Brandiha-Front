export interface FaqItem {
  value: string;
  trigger: string;
  content: string;
  subcontent?: string[];
  color: string;
  borderColor: string;
  icon: string;
  iconOffset: string;
}

export const faqItems: FaqItem[] = [
  {
    value: "item-1",
    trigger: "How will BRANDIHA be structured?",
    content: "BRANDIHA is divided into two phases:",
    subcontent: [
      "Phase 1: develop and submit their Marketing Strategy and Communication Plan in 24h.",
      "Phase 2: create their Visual Identity and produce a Creative Video to bring their brand to life for the next 48h."
    ],
    color: "text-brand-marketing",
    borderColor: "data-[state=open]:border-brand-marketing",
    icon: "/dropdown-icon-1.png",
    iconOffset: "translate-x-0",
  },
  {
    value: "item-2",
    trigger: "Who can participate ?",
    content: "BRANDIHA is open to all Micro Club members who are passionate about creativity, branding, and teamwork.",
    color: "text-brand-communication",
    borderColor: "data-[state=open]:border-brand-communication",
    icon: "/dropdown-icon-2.png",
    iconOffset: "translate-x-0",
  },
  {
    value: "item-3",
    trigger: "Can I participate alone?",
    content: "No. Participants compete in teams of five, combining different skills to build a complete brand.",
    color: "text-brand-multimedia",
    borderColor: "data-[state=open]:border-brand-multimedia",
    icon: "/dropdown-icon-3.png",
    iconOffset: "translate-x-0",
  },
  {
    value: "item-4",
    trigger: "Do I have to stay overnight?",
    content: "At least two members of each team are required to stay overnight to represent the team and ensure continuous participation during the event.",
    color: "text-brand-design",
    borderColor: "data-[state=open]:border-brand-design",
    icon: "/dropdown-icon-4.png",
    iconOffset: "translate-x-0",
  },
  {
    value: "item-5",
    trigger: "Will participants receive guidance?",
    content: "Yes, Throughout the competition, mentors and coaches will provide advice, feedback, and support to help teams develop their ideas.",
    color: "text-brand-marketing",
    borderColor: "data-[state=open]:border-brand-marketing",
    icon: "/dropdown-icon-5.png",
    iconOffset: "translate-x-0",
  },
  {
    value: "item-6",
    trigger: "Ready to take the Virage ?",
    content: "There's only one way to find out.",
    color: "text-brand-communication",
    borderColor: "data-[state=open]:border-brand-communication",
    icon: "/dropdown-icon-6.png",
    iconOffset: "translate-x-0",
  },
];