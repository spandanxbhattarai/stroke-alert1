import clsx from "clsx";

/**
 * Status / metadata chip. Status is encoded with ink weight and the signal —
 * never a colour rainbow. See REDESIGN_PLAN.md §1.2.
 */
export default function Chip({
  children,
  tone = "hair",
  className,
}: {
  children: React.ReactNode;
  tone?: "hair" | "ink" | "signal" | "muted";
  className?: string;
}) {
  const tones = {
    hair: "border border-rule text-ink-2",
    ink: "bg-ink text-paper",
    signal: "bg-signal text-signal-ink",
    muted: "border border-rule text-ink-3",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center whitespace-nowrap px-2 py-1 font-mono text-micro uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
