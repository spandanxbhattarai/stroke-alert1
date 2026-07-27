"use client";

import Container from "./ui/Container";
import SectionHeader from "./ui/SectionHeader";
import { RevealGroup, RevealItem } from "./ui/Reveal";

const FAST = [
  {
    letter: "F",
    label: "Face",
    question: "Ask them to smile.",
    sign: "One side of the face droops or feels numb.",
  },
  {
    letter: "A",
    label: "Arms",
    question: "Ask them to raise both arms.",
    sign: "One arm drifts down or cannot lift at all.",
  },
  {
    letter: "S",
    label: "Speech",
    question: "Ask them to repeat a simple sentence.",
    sign: "Speech is slurred, jumbled, or absent.",
  },
  {
    letter: "T",
    label: "Time",
    question: "Note the time symptoms started.",
    sign: "Call 102 immediately. The clock decides the treatment.",
  },
];

export default function FastProtocol() {
  return (
    <section id="fast" aria-label="The FAST stroke test" className="py-16 sm:py-24">
      <Container>
        <SectionHeader
          index="02"
          kicker="Recognise it"
          titleLines={["The FAST", "test"]}
          lede="Four checks, under a minute. Any single one of them is reason enough to call an ambulance."
        />

        {/* Grid cells divided by shared hairlines — cards, without the boxes. */}
        <RevealGroup
          className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
        >
          {FAST.map((item) => (
            <RevealItem
              key={item.letter}
              className="group relative bg-paper p-6 transition-colors duration-300 hover:bg-paper-2 sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="text-display-l font-extrabold leading-none tracking-tighter transition-colors duration-300 group-hover:text-signal">
                  {item.letter}
                </span>
                <span className="label mt-2">{item.label}</span>
              </div>

              <p className="mt-8 text-h3 font-semibold">{item.question}</p>
              <p className="mt-2 text-body text-ink-2">{item.sign}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
