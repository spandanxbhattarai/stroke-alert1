import clsx from "clsx";

/** The one round element in a square system: a live status pulse. */
export default function LiveDot({ className }: { className?: string }) {
  return (
    <span className={clsx("relative flex h-1.5 w-1.5 shrink-0", className)} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-signal animate-pulse-ring" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
    </span>
  );
}
