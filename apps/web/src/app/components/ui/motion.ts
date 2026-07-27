/**
 * SIGNAL motion constants — one house easing curve, short durations.
 * See REDESIGN_PLAN.md §2. Every consumer gates these on useReducedMotion().
 */

/** Expo-out. The only easing curve in the system. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  fast: 0.25,
  base: 0.45,
  reveal: 0.55,
  slow: 0.8,
} as const;

export const SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

/** Standard reveal: fade + short rise. */
export const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/** Parent container that staggers its children's reveals. */
export function staggerContainer(stagger = 0.06, delay = 0) {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

/** Line of type rising out of an overflow-hidden mask. */
export const maskedLineVariants = {
  hidden: { y: "105%" },
  show: { y: "0%" },
};
