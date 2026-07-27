"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  NEPAL_DISTRICTS,
  NEPAL_PROVINCES,
  NEPAL_PROJECTION,
  NEPAL_VIEWBOX,
} from "../../data/nepal-map";
import { formatCoord, unitsPerKm } from "../../lib/nepal-geo";
import { DUR, EASE } from "../ui/motion";

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  name: string;
  city: string;
  available24x7: boolean;
  provinceNo: number | null;
}

interface Props {
  markers: MapMarker[];
  selectedId: string | null;
  hoveredId: string | null;
  activeProvince: number | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onProvinceHover?: (no: number | null) => void;
  onProvinceSelect?: (no: number | null) => void;
  hoveredProvince: number | null;
}

const { width: W, height: H } = NEPAL_VIEWBOX;

/**
 * Marker pin, drawn on the same 24-unit grid as ui/Icons so it reads as the
 * same family. Scaled down to map units and shifted so the *tip* — not the
 * centre — lands on the hospital's projected coordinate.
 */
const PIN = 0.9;
const PIN_PATH = "M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z";
const PIN_TRANSFORM = `translate(${-12 * PIN} ${-21 * PIN}) scale(${PIN})`;
const PIN_HEAD_Y = (10 - 21) * PIN; // head centre, in marker-local units

export default function NepalMap({
  markers,
  selectedId,
  hoveredId,
  activeProvince,
  onHover,
  onSelect,
  onProvinceHover,
  onProvinceSelect,
  hoveredProvince,
}: Props) {
  const reduced = useReducedMotion();
  const kmBar = unitsPerKm() * 100; // a 100 km rule, measured honestly
  const selected = markers.find((m) => m.id === selectedId) ?? null;
  const litProvince = hoveredProvince ?? activeProvince;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full select-none"
      role="img"
      aria-label="Map of Nepal showing stroke-ready hospitals by province"
    >
      {/* 1 — province fills */}
      <g>
        {NEPAL_PROVINCES.map((p) => {
          const dimmed = litProvince !== null && litProvince !== p.no;
          return (
            <motion.path
              key={`fill-${p.id}`}
              d={p.d}
              fill="var(--paper-2)"
              initial={false}
              animate={{ opacity: dimmed ? 0.35 : 1 }}
              transition={{ duration: DUR.fast, ease: EASE }}
              onPointerEnter={() => onProvinceHover?.(p.no)}
              onPointerLeave={() => onProvinceHover?.(null)}
              onClick={() => onProvinceSelect?.(activeProvince === p.no ? null : p.no)}
              className="cursor-pointer"
            />
          );
        })}
      </g>

      {/* 2 — 77 district hairlines: the fine mesh that gives the map its texture */}
      <g fill="none" stroke="var(--rule)" strokeWidth={0.6} vectorEffect="non-scaling-stroke">
        {NEPAL_DISTRICTS.map((d) => (
          <path key={d.name} d={d.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* 3 — province outlines on top, so borders stay crisp */}
      <g fill="none" pointerEvents="none">
        {NEPAL_PROVINCES.map((p) => (
          <motion.path
            key={`line-${p.id}`}
            d={p.d}
            stroke="var(--ink)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ opacity: litProvince !== null && litProvince !== p.no ? 0.25 : 1 }}
            transition={{ duration: DUR.fast, ease: EASE }}
          />
        ))}
      </g>

      {/* 4 — province name, only for the province under the cursor or filter */}
      {litProvince !== null &&
        (() => {
          const p = NEPAL_PROVINCES.find((x) => x.no === litProvince);
          if (!p) return null;
          return (
            <motion.text
              key={p.id}
              x={p.labelX}
              y={p.labelY}
              textAnchor="middle"
              className="font-mono uppercase"
              fill="var(--ink)"
              fontSize={13}
              letterSpacing={2}
              pointerEvents="none"
              // `y` here is a transform offset, not the SVG y attribute — the
              // attribute above already places the label.
              initial={reduced ? undefined : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.fast, ease: EASE }}
            >
              {p.name}
            </motion.text>
          );
        })()}

      {/* 5 — instrument crosshair on the selected hospital */}
      {selected && (
        <motion.g
          pointerEvents="none"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.fast, ease: EASE }}
        >
          <line
            x1={0}
            y1={selected.y}
            x2={selected.x}
            y2={selected.y}
            stroke="var(--signal)"
            strokeWidth={0.8}
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={selected.x}
            y1={selected.y}
            x2={selected.x}
            y2={H}
            stroke="var(--signal)"
            strokeWidth={0.8}
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
        </motion.g>
      )}

      {/* 6 — hospital markers */}
      <g>
        {markers.map((m, i) => {
          const isSelected = m.id === selectedId;
          const isHovered = m.id === hoveredId;
          const lit = isSelected || isHovered;
          const dimmed = activeProvince !== null && m.provinceNo !== activeProvince;
          const filled = m.available24x7 || isSelected;

          return (
            <motion.g
              key={m.id}
              transform={`translate(${m.x} ${m.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${m.name}, ${m.city}${m.available24x7 ? ", open 24/7" : ""}`}
              className="cursor-pointer focus:outline-none"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: dimmed ? 0.2 : 1 }}
              transition={{ duration: DUR.base, ease: EASE, delay: reduced ? 0 : i * 0.025 }}
              onPointerEnter={() => onHover(m.id)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(m.id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(m.id);
                }
              }}
            >
              {/* generous invisible hit target — the visible pin is deliberately small.
                  A rect, because the pin stands above the point rather than around it. */}
              <rect x={-11} y={-19} width={22} height={25} fill="transparent" />

              {lit && (
                <motion.circle
                  cy={PIN_HEAD_Y}
                  r={5.5}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={reduced ? { opacity: 0.7 } : { scale: 2.8, opacity: 0 }}
                  transition={
                    reduced
                      ? undefined
                      : { duration: 1.4, ease: EASE, repeat: Infinity, repeatDelay: 0.1 }
                  }
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}

              {/* grows out of its own tip, so the plotted point never moves */}
              <motion.g
                initial={reduced ? false : { scale: 0 }}
                animate={{ scale: lit ? 1.35 : 1 }}
                transition={{ duration: DUR.base, ease: EASE, delay: reduced ? 0 : i * 0.025 }}
                style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
              >
                <g transform={PIN_TRANSFORM}>
                  <path
                    d={PIN_PATH}
                    fill={filled ? "var(--signal)" : "var(--paper)"}
                    stroke={filled ? "var(--paper)" : "var(--ink)"}
                    strokeWidth={1.25}
                    strokeLinejoin="miter"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={12}
                    cy={10}
                    r={2.4}
                    fill={filled ? "var(--paper)" : "var(--ink)"}
                  />
                </g>
              </motion.g>
            </motion.g>
          );
        })}
      </g>

      {/* 7 — map margin: corner ticks, bbox coordinates, scale bar */}
      <g pointerEvents="none" fill="var(--ink-3)" className="font-mono uppercase">
        <g stroke="var(--ink-3)" strokeWidth={1} vectorEffect="non-scaling-stroke">
          <path d={`M0 14 V0 H14`} fill="none" vectorEffect="non-scaling-stroke" />
          <path d={`M${W - 14} 0 H${W} V14`} fill="none" vectorEffect="non-scaling-stroke" />
          <path d={`M0 ${H - 14} V${H} H14`} fill="none" vectorEffect="non-scaling-stroke" />
          <path
            d={`M${W} ${H - 14} V${H} H${W - 14}`}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <text x={20} y={12} fontSize={9} letterSpacing={1.4}>
          {formatCoord(NEPAL_PROJECTION.lonMin, "lng")}
        </text>
        <text x={W - 20} y={12} fontSize={9} letterSpacing={1.4} textAnchor="end">
          {formatCoord(NEPAL_PROJECTION.lonMax, "lng")}
        </text>
        <text x={20} y={H - 6} fontSize={9} letterSpacing={1.4}>
          {formatCoord(NEPAL_PROJECTION.latMin, "lat")}
        </text>

        {/* scale bar */}
        <g transform={`translate(${W - 20 - kmBar} ${H - 26})`}>
          <line
            x1={0}
            y1={8}
            x2={kmBar}
            y2={8}
            stroke="var(--ink-3)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <line x1={0} y1={4} x2={0} y2={12} stroke="var(--ink-3)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <line
            x1={kmBar}
            y1={4}
            x2={kmBar}
            y2={12}
            stroke="var(--ink-3)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <text x={kmBar / 2} y={2} fontSize={9} letterSpacing={1.4} textAnchor="middle">
            100 KM
          </text>
        </g>
      </g>
    </svg>
  );
}
