"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhoneIcon } from "./ui/Icons";
import { DUR, EASE } from "./ui/motion";

/**
 * Mobile-only sticky emergency bar. The one element in this system allowed to
 * shout — see REDESIGN_PLAN.md §0.
 */
export default function EmergencyBar() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-30 sm:hidden"
      initial={reduced ? undefined : { y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: DUR.slow, ease: EASE, delay: 0.9 }}
    >
      <a
        href="tel:102"
        className="tap-emergency flex w-full items-center justify-center gap-3 border-t border-ink
                   bg-signal font-mono text-label uppercase tracking-[0.16em] text-signal-ink
                   active:bg-ink active:text-paper"
        aria-label="Call Nepal ambulance 102"
      >
        <PhoneIcon className="h-4 w-4" />
        Call 102 — ambulance
      </a>
    </motion.div>
  );
}
