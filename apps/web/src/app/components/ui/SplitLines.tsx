"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE, maskedLineVariants, staggerContainer } from "./motion";

/**
 * Display headline that rises line-by-line out of an overflow-hidden mask.
 * Pass pre-broken lines — the break points are a typographic decision, not
 * something to leave to the browser at these sizes.
 */
export default function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.05,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "div";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className={clsx("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        variants={staggerContainer(stagger, delay)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {lines.map((line) => (
          // The mask has to clip, so the wrapper owns overflow and the child moves.
          <span key={line} className="block overflow-hidden">
            <motion.span
              className={clsx("block", lineClassName)}
              variants={maskedLineVariants}
              transition={{ duration: DUR.slow, ease: EASE }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
