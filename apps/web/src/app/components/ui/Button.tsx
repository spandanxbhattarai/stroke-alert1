"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE } from "./motion";

type Variant = "signal" | "ink" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  full?: boolean;
}

const SIZES: Record<Size, string> = {
  sm: "min-h-[36px] px-4 text-micro",
  md: "tap px-6 text-label",
  lg: "tap-emergency px-8 text-label sm:text-[0.8125rem] sm:tracking-[0.14em]",
};

// Base surface + the colour the sweep layer paints on hover.
const VARIANTS: Record<Variant, { base: string; sweep: string; label: string }> = {
  signal: {
    base: "bg-signal text-signal-ink",
    sweep: "bg-ink",
    label: "group-hover:text-paper",
  },
  ink: {
    base: "bg-ink text-paper",
    sweep: "bg-signal",
    label: "group-hover:text-signal-ink",
  },
  outline: {
    base: "border border-ink text-ink",
    sweep: "bg-ink",
    label: "group-hover:text-paper",
  },
  ghost: {
    base: "border border-rule text-ink-2",
    sweep: "bg-paper-2",
    label: "group-hover:text-ink",
  },
};

function useClasses(variant: Variant, size: Size, full?: boolean, className?: string) {
  const v = VARIANTS[variant];
  return {
    v,
    root: clsx(
      "group relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden",
      "font-mono uppercase tracking-[0.14em] font-medium",
      "transition-colors duration-200 ease-swiss",
      "disabled:opacity-40 disabled:pointer-events-none",
      SIZES[size],
      v.base,
      full && "w-full",
      className
    ),
  };
}

/** The colour panel that wipes in from the left on hover. */
function Sweep({ className }: { className: string }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.span
      aria-hidden
      className={clsx("absolute inset-0 -z-10 origin-left", className)}
      initial={{ scaleX: 0 }}
      variants={{ hover: { scaleX: 1 } }}
      transition={{ duration: DUR.base, ease: EASE }}
    />
  );
}

export function Button({
  variant = "ink",
  size = "md",
  children,
  className,
  icon,
  full,
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { v, root } = useClasses(variant, size, full, className);
  return (
    <motion.button whileHover="hover" whileFocus="hover" className={root} {...(rest as any)}>
      <Sweep className={v.sweep} />
      <span className={clsx("relative flex items-center gap-2.5 transition-colors duration-200", v.label)}>
        {icon}
        {children}
      </span>
    </motion.button>
  );
}

export function ButtonLink({
  variant = "ink",
  size = "md",
  children,
  className,
  icon,
  full,
  ...rest
}: BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { v, root } = useClasses(variant, size, full, className);
  return (
    <motion.a whileHover="hover" whileFocus="hover" className={root} {...(rest as any)}>
      <Sweep className={v.sweep} />
      <span className={clsx("relative flex items-center gap-2.5 transition-colors duration-200", v.label)}>
        {icon}
        {children}
      </span>
    </motion.a>
  );
}
