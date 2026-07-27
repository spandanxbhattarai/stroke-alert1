import clsx from "clsx";

/**
 * Hairline column guides — the Swiss "show your grid" background layer.
 * Purely decorative; always aria-hidden.
 */
export default function GridLines({
  columns = 12,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={clsx("pointer-events-none absolute inset-0 flex", className)}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={clsx("h-full flex-1", i !== 0 && "border-l border-rule")}
        />
      ))}
    </div>
  );
}
