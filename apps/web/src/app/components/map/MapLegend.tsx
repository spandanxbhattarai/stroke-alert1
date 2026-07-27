/** The map's marker at legend size, so the two read as the same mark. */
function PinSwatch({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="4 2 16 20" className="h-3.5 w-3" aria-hidden>
      <path
        d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"
        fill={filled ? "var(--signal)" : "var(--paper)"}
        stroke={filled ? "var(--signal)" : "var(--ink)"}
        strokeWidth={1.5}
        strokeLinejoin="miter"
      />
      <circle cx={12} cy={10} r={2.4} fill={filled ? "var(--paper)" : "var(--ink)"} />
    </svg>
  );
}

export default function MapLegend({ offMapCount }: { offMapCount: number }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <li className="flex items-center gap-2">
        <PinSwatch filled />
        <span className="label">Open 24 / 7</span>
      </li>
      <li className="flex items-center gap-2">
        <PinSwatch filled={false} />
        <span className="label">Limited hours</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="h-px w-4 bg-rule" aria-hidden />
        <span className="label">District boundary</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="h-px w-4 bg-ink" aria-hidden />
        <span className="label">Province boundary</span>
      </li>
      {offMapCount > 0 && (
        <li className="label text-signal">
          {offMapCount} outside Nepal — listed, not plotted
        </li>
      )}
    </ul>
  );
}
