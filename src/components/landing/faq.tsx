import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Section } from "@/components/landing/section";
import { faqItems } from "@/lib/faq-data";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export function Faq() {
  return (
    <Section
      as="section"
      id="faq"
      className="flex w-full items-center justify-center py-16 scroll-mt-24"
    >
      <div className="flex w-full max-w-4xl flex-col items-center px-4">
        <h2 className="mb-4 font-heading text-8xl font-black uppercase tracking-wider text-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)] md:text-[11rem]">
          FAQ
        </h2>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-8 text-center text-xl md:text-2xl">
          <div className="relative inline-flex items-center px-10 py-6 -rotate-3 scale-125 translate-y-16">
            <Image
              src="/black-outline.png"
              alt=""
              width={380}
              height={120}
              priority
              className="absolute inset-0 -z-10 h-full w-full object-contain scale-150"
            />
            <span className="relative z-10 font-bold text-white -translate-y-9">
              Got questions?
            </span>
          </div>

          <div className="relative inline-flex flex-col items-center px-6 py-3 -rotate-3 -translate-y-3">
            <span className="relative z-10 font-bold text-brand-marketing translate-y-2 -translate-x-1">
              We got answers.
            </span>
            <div className="absolute -bottom-7 left-0 w-full flex justify-center">
              <Image
                src="/orange-underline.png"
                alt=""
                width={260}
                height={40}
                priority
                className="h-auto w-full object-contain scale-110"
              />
            </div>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4 font-hand"
        >
          {faqItems.map((item, index) => {
            const numberPrefix = String(index + 1).padStart(2, "0");

            return (
              <AccordionItem
                key={item.value}
                value={item.value}
                className={`relative rounded-lg border-2 border-white/30 bg-black/40 backdrop-blur-sm px-6 text-white transition-colors ${item.borderColor}`}
              >
                <AccordionTrigger className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer hover:no-underline" />

                <div className="pointer-events-none flex w-full items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 flex-1 items-center gap-6 text-left">
                    <span
                      className={`shrink-0 font-montserrat text-3xl font-bold uppercase md:text-4xl ${item.color}`}
                    >
                      {numberPrefix}.
                    </span>

                    <div className="flex flex-col items-center self-stretch">
                      <div className="h-full w-px bg-white/70" />
                    </div>

                    <span className="min-w-0 break-words whitespace-normal font-hand text-2xl font-medium text-white md:text-3xl">
                      {item.trigger}
                    </span>
                  </div>

                  <ChevronDown
                    className={`h-8 w-8 shrink-0 stroke-[2] transition-transform duration-200 [details[open]_&]:rotate-180 [[data-state=open]_&]:rotate-180 ${item.color}`}
                  />
                </div>

                <AccordionContent className="flex pb-6 font-hand text-xl text-white/80 md:text-2xl">
                  <div className={`flex shrink-0 items-start pr-6 ${item.iconOffset}`}>
                    <div className="relative mt-1 h-10 w-10 shrink-0">
                      <Image
                        src={item.icon}
                        alt=""
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center self-stretch mr-6">
                    <div className="absolute -top-4 bottom-0 w-px bg-white/70" />
                  </div>

                  <div className="w-full space-y-3 pt-2">
                    <p>{item.content}</p>

                    {item.subcontent && (
                      <div className="mt-2 space-y-2">
                        {item.subcontent.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-3"
                          >
                            <span
                              className={
                                sIdx === 0
                                  ? "text-brand-marketing"
                                  : "text-brand-communication"
                              }
                            >
                              →
                            </span>

                            <span>{sub}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </Section>
  );
}