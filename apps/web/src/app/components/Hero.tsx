"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "./ui/Container";
import GridLines from "./ui/GridLines";
import LiveDot from "./ui/LiveDot";
import SplitLines from "./ui/SplitLines";
import { ButtonLink } from "./ui/Button";
import { ArrowDownIcon, PhoneIcon } from "./ui/Icons";
import { DUR, EASE, staggerContainer, revealVariants } from "./ui/motion";

/**
 * Widely used stroke-care figures. Deliberately not dressed up as StrokeAlert's
 * own research — the footnote below keeps that honest.
 */
const TIME_FACTS = [
  { value: "1.9M", unit: "neurons", note: "lost every minute an ischaemic stroke goes untreated" },
  { value: "4.5", unit: "hours", note: "typical window for clot-dissolving medication" },
  { value: "24", unit: "hours", note: "outer window for clot removal in selected patients" },
];

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden border-b border-ink">
      <Container className="relative">
        <GridLines className="opacity-60" />

        <div className="relative grid grid-cols-12 gap-gutter pb-14 pt-12 sm:pb-20 sm:pt-20">
          {/* headline block */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-2.5"
            >
              <motion.span variants={revealVariants} transition={{ duration: DUR.base, ease: EASE }}>
                <LiveDot />
              </motion.span>
              <motion.span
                variants={revealVariants}
                transition={{ duration: DUR.base, ease: EASE }}
                className="label-ink"
              >
                Live 24 / 7 — Nepal ambulance 102
              </motion.span>
            </motion.div>

            <SplitLines
              as="h1"
              lines={["Stroke", "emergency?"]}
              className="mt-6 text-7xl font-extrabold uppercase"
              delay={0.1}
            />

            <motion.p
              className="mt-7 max-w-[38ch] text-body-l text-ink-2 sm:text-[1.1875rem]"
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.reveal, ease: EASE, delay: 0.45 }}
            >
              Call an ambulance first. Then find the nearest stroke-ready hospital, with its
              direct emergency number and route.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-px sm:flex-row"
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.reveal, ease: EASE, delay: 0.55 }}
            >
              <ButtonLink
                href="tel:102"
                variant="signal"
                size="lg"
                className="sm:min-w-[240px]"
                icon={<PhoneIcon className="h-4 w-4" />}
                aria-label="Call Nepal ambulance 102"
              >
                Call 102 now
              </ButtonLink>
              <ButtonLink
                href="#nearest"
                variant="outline"
                size="lg"
                icon={<ArrowDownIcon className="h-4 w-4" />}
              >
                Find nearest hospital
              </ButtonLink>
            </motion.div>
          </div>

          {/* time-to-treatment timetable */}
          <motion.div
            className="col-span-12 lg:col-span-4 lg:pl-6"
            variants={staggerContainer(0.08, 0.65)}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={revealVariants}
              transition={{ duration: DUR.base, ease: EASE }}
              className="label border-b border-ink pb-2"
            >
              Why minutes matter
            </motion.p>

            <dl>
              {TIME_FACTS.map((fact) => (
                <motion.div
                  key={fact.value}
                  variants={revealVariants}
                  transition={{ duration: DUR.base, ease: EASE }}
                  className="border-b border-rule py-4"
                >
                  <dt className="flex items-baseline gap-2">
                    <span className="font-mono text-display-m font-medium leading-none" data-numeric>
                      {fact.value}
                    </span>
                    <span className="label">{fact.unit}</span>
                  </dt>
                  <dd className="mt-1.5 text-small text-ink-2">{fact.note}</dd>
                </motion.div>
              ))}
            </dl>

            <motion.p
              variants={revealVariants}
              transition={{ duration: DUR.base, ease: EASE }}
              className="mt-3 text-[0.6875rem] leading-relaxed text-ink-3"
            >
              Figures reflect widely used stroke-care guidance. Treatment windows are decided by
              clinicians for each patient.
            </motion.p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
