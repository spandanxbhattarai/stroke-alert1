import clsx from "clsx";

/**
 * Wordmark. Mono "STROKE" set against a heavy grotesque "ALERT" — the two faces
 * of the type system stated in one lockup, plus a signal square as the mark.
 */
export default function Logo({
  className,
  size = "md",
  invert = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  invert?: boolean;
}) {
  const scale = {
    sm: { mark: "h-2.5 w-2.5", text: "text-[0.8125rem]" },
    md: { mark: "h-3 w-3", text: "text-[0.9375rem]" },
    lg: { mark: "h-4 w-4", text: "text-[1.25rem]" },
  }[size];

  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <span className={clsx(scale.mark, "shrink-0 bg-signal")} aria-hidden />
      <span className={clsx("leading-none tracking-tight", scale.text)}>
        <span
          className={clsx(
            "font-mono font-normal tracking-[0.06em]",
            invert ? "text-paper/70" : "text-ink-2"
          )}
        >
          STROKE
        </span>
        <span className={clsx("font-extrabold", invert ? "text-paper" : "text-ink")}>ALERT</span>
      </span>
    </span>
  );
}
