"use client";

import Container from "./ui/Container";
import SectionHeader from "./ui/SectionHeader";
import { RevealGroup, RevealItem } from "./ui/Reveal";

const DO = [
  "Call 102 for an ambulance before anything else.",
  "Note the exact time the first symptom appeared.",
  "Lay the person on their side with the head slightly raised.",
  "Loosen tight clothing and keep the airway clear.",
  "Stay with them and keep talking calmly.",
  "Collect their medicine list and ID for the hospital.",
];

const DONT = [
  "Do not give food, water, or medicine by mouth.",
  "Do not let them sleep it off or wait to see if it passes.",
  "Do not drive them yourself if an ambulance can reach you.",
  "Do not give aspirin — some strokes are bleeds, not clots.",
  "Do not leave them alone at any point.",
  "Do not wait for symptoms to worsen before calling.",
];

function Column({ title, items, tone }: { title: string; items: string[]; tone: "do" | "dont" }) {
  return (
    <div className="bg-paper p-6 sm:p-8">
      <p
        className={
          tone === "do"
            ? "label-ink border-b border-ink pb-3"
            : "border-b border-signal pb-3 font-mono text-label uppercase tracking-[0.14em] text-signal"
        }
      >
        {title}
      </p>
      <RevealGroup as="ol" className="mt-1" stagger={0.05}>
        {items.map((item, i) => (
          <RevealItem
            as="li"
            key={item}
            className="flex gap-4 border-b border-rule py-3.5 last:border-b-0"
          >
            <span
              className="mt-0.5 shrink-0 font-mono text-micro tracking-[0.14em] text-ink-3"
              data-numeric
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-body">{item}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export default function WhatToDo() {
  return (
    <section id="what-to-do" aria-label="What to do while help arrives" className="py-16 sm:py-24">
      <Container>
        <SectionHeader
          index="04"
          kicker="While you wait"
          titleLines={["What to do", "and not do"]}
          lede="The minutes before the ambulance arrives are yours to protect. Keep it simple."
        />

        <RevealGroup className="grid grid-cols-1 gap-px border border-rule bg-rule lg:grid-cols-2">
          <RevealItem>
            <Column title="Do" items={DO} tone="do" />
          </RevealItem>
          <RevealItem>
            <Column title="Do not" items={DONT} tone="dont" />
          </RevealItem>
        </RevealGroup>

        <p className="mt-6 max-w-[70ch] text-small text-ink-3">
          This page helps you reach care quickly. It is not medical advice and does not replace
          assessment by a clinician.
        </p>
      </Container>
    </section>
  );
}
