"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE, revealVariants, staggerContainer } from "./motion";

/**
 * Scroll-triggered reveal. Fires once. Wrap a group in <RevealGroup> and its
 * <Reveal> children stagger automatically.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "span" | "p" | "section" | "article";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DUR.reveal, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/** A <Reveal> that inherits its timing from a parent RevealGroup's stagger. */
export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span" | "p" | "article";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      className={clsx(className)}
      variants={revealVariants}
      transition={{ duration: DUR.reveal, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
