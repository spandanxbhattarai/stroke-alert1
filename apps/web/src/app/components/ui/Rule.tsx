"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE } from "./motion";

/** A hairline that draws itself in from the left when scrolled into view. */
export default function Rule({
  className,
  weight = "hair",
  delay = 0,
  animate = true,
}: {
  className?: string;
  weight?: "hair" | "ink";
  delay?: number;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const base = clsx("h-px w-full origin-left", weight === "ink" ? "bg-ink" : "bg-rule", className);

  if (reduced || !animate) return <div className={base} aria-hidden />;

  return (
    <motion.div
      aria-hidden
      className={base}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
    />
  );
}
