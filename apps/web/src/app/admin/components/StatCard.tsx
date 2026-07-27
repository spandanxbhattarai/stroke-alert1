import CountUp from "../../components/ui/CountUp";

/**
 * Stat cell. Grid cells on shared hairlines — no coloured boxes, the number
 * carries the emphasis on its own.
 */
export default function StatCard({
  label,
  value,
  index,
  note,
}: {
  label: string;
  value: number;
  index: string;
  note?: string;
}) {
  return (
    <div className="group bg-paper p-6 transition-colors duration-300 hover:bg-paper-2 sm:p-7">
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        <span className="font-mono text-micro tracking-[0.14em] text-ink-3" data-numeric>
          {index}
        </span>
      </div>

      <p className="mt-8 font-mono text-display-l font-medium leading-none tracking-tight">
        <CountUp to={value} />
      </p>

      {note && <p className="mt-3 text-small text-ink-2">{note}</p>}
    </div>
  );
}
