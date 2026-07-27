"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Hospital } from "@strokealert/shared";
import { NEPAL_VIEWBOX } from "../../data/nepal-map";
import Chip from "../ui/Chip";
import { ArrowRightIcon } from "../ui/Icons";
import { DUR, EASE } from "../ui/motion";

/**
 * Hover card pinned to a marker. Shows the hospital's name and location —
 * the two things you need to recognise it — plus the way into full details.
 *
 * Positioned in percentages of the map box. That only works because the map
 * container is locked to the SVG's exact aspect ratio, so viewBox units and
 * box percentages line up 1:1.
 */
export default function MapTooltip({
  hospital,
  x,
  y,
  provinceName,
  distanceKm,
  onViewMore,
  onPointerEnter,
  onPointerLeave,
}: {
  hospital: Hospital;
  x: number;
  y: number;
  provinceName: string | null;
  distanceKm: number | null;
  onViewMore: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const leftPct = (x / NEPAL_VIEWBOX.width) * 100;
  const topPct = (y / NEPAL_VIEWBOX.height) * 100;

  // Flip the card away from whichever edge it would otherwise overflow.
  const flipX = leftPct > 66 ? "right" : leftPct < 20 ? "left" : "center";
  const flipY = topPct < 34 ? "below" : "above";

  const translate = clsx(
    flipX === "center" && "-translate-x-1/2",
    flipX === "right" && "-translate-x-[calc(100%-14px)]",
    flipX === "left" && "-translate-x-[14px]",
    // Above needs extra clearance: the pin stands ~16 map units tall above its tip.
    flipY === "above" ? "-translate-y-[calc(100%+30px)]" : "translate-y-4"
  );

  return (
    <motion.div
      className={clsx("pointer-events-auto absolute z-20 w-[260px]", translate)}
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      initial={{ opacity: 0, y: flipY === "above" ? 6 : -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.fast, ease: EASE }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="tooltip"
    >
      <div className="border border-ink bg-paper">
        <div className="flex items-center justify-between gap-2 border-b border-rule bg-paper-2 px-3 py-1.5">
          <span className="label-ink truncate">
            {provinceName ?? "Nepal"}
          </span>
          {distanceKm !== null && (
            <span className="font-mono text-micro tracking-[0.14em] text-signal" data-numeric>
              {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} M` : `${distanceKm.toFixed(1)} KM`}
            </span>
          )}
        </div>

        <div className="px-3 py-3">
          <p className="text-h3 font-bold leading-tight">{hospital.name}</p>
          <p className="mt-1.5 text-small text-ink-2">
            {hospital.addressLine1}
            {hospital.addressLine1 ? ", " : ""}
            {hospital.city}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {hospital.available24x7 ? <Chip tone="ink">24 / 7</Chip> : <Chip>Limited hours</Chip>}
            <Chip>{hospital.type}</Chip>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewMore}
          className="group flex w-full items-center justify-between border-t border-rule px-3 py-2.5
                     font-mono text-micro uppercase tracking-[0.14em] text-ink
                     transition-colors hover:bg-ink hover:text-paper"
        >
          View more
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-swiss group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
