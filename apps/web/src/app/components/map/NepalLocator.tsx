"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  NEPAL_DISTRICTS,
  NEPAL_PROVINCES,
  NEPAL_VIEWBOX,
  isInsideNepal,
  projectPoint,
} from "../../data/nepal-map";
import { provinceAtPoint } from "../../lib/nepal-geo";
import { DUR, EASE } from "../ui/motion";

const { width: W, height: H } = NEPAL_VIEWBOX;

/**
 * Single-hospital locator built from the same geometry as the public map —
 * enough to answer "where in the country is this?" at a glance.
 */
export default function NepalLocator({
  latitude,
  longitude,
  label,
}: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  const reduced = useReducedMotion();
  const onMap = isInsideNepal(latitude, longitude);
  const { x, y } = projectPoint(latitude, longitude);
  const province = onMap ? provinceAtPoint(x, y) : null;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Location of ${label} within Nepal`}
      >
        <g>
          {NEPAL_PROVINCES.map((p) => (
            <path
              key={p.id}
              d={p.d}
              fill={province?.no === p.no ? "var(--rule)" : "var(--paper-2)"}
            />
          ))}
        </g>

        <g fill="none" stroke="var(--rule)" strokeWidth={0.5} vectorEffect="non-scaling-stroke">
          {NEPAL_DISTRICTS.map((d) => (
            <path key={d.name} d={d.d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        <g fill="none" stroke="var(--ink)" strokeWidth={1} vectorEffect="non-scaling-stroke">
          {NEPAL_PROVINCES.map((p) => (
            <path key={`o-${p.id}`} d={p.d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {onMap && (
          <>
            <line
              x1={0}
              y1={y}
              x2={x}
              y2={y}
              stroke="var(--signal)"
              strokeWidth={0.8}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={H}
              stroke="var(--signal)"
              strokeWidth={0.8}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
            <motion.circle
              cx={x}
              cy={y}
              r={6}
              fill="var(--signal)"
              stroke="var(--paper)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              initial={reduced ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: DUR.base, ease: EASE, delay: 0.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </>
        )}
      </svg>

      <p className="mt-3 font-mono text-micro uppercase tracking-[0.14em] text-ink-3">
        {onMap
          ? `${province?.name ?? "Nepal"} · plotted from recorded coordinates`
          : "Coordinates fall outside Nepal — check the values"}
      </p>
    </div>
  );
}
