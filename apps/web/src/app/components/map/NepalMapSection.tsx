"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { Hospital } from "@strokealert/shared";
import { API_URL } from "../../lib/api";
import { NEPAL_PROVINCES, NEPAL_VIEWBOX, isInsideNepal, projectPoint } from "../../data/nepal-map";
import { provinceAtPoint, spreadMarkers } from "../../lib/nepal-geo";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import Chip from "../ui/Chip";
import CountUp from "../ui/CountUp";
import { CrosshairIcon } from "../ui/Icons";
import { DUR, EASE } from "../ui/motion";
import { distanceKm, useGeo } from "../GeoProvider";
import NepalMap, { type MapMarker } from "./NepalMap";
import MapTooltip from "./MapTooltip";
import HospitalDrawer from "./HospitalDrawer";
import MapLegend from "./MapLegend";

/** A hospital plus everything the map needs to know about it. */
interface Placed {
  hospital: Hospital;
  x: number;
  y: number;
  provinceNo: number | null;
  provinceName: string | null;
  onMap: boolean;
}

export default function NepalMapSection() {
  const { coords } = useGeo();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [activeProvince, setActiveProvince] = useState<number | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<number | null>(null);

  // Lets the pointer travel from a marker into its tooltip without it vanishing.
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/hospitals?pageSize=200&active=true`)
      .then((r) => {
        if (!r.ok) throw new Error("request failed");
        return r.json();
      })
      .then((d) => {
        if (cancelled) return;
        setHospitals(d.data || []);
        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  /** Project every hospital and resolve its province from its own position. */
  const placed = useMemo<Placed[]>(() => {
    return hospitals.map((hospital) => {
      const { x, y } = projectPoint(hospital.latitude, hospital.longitude);
      const onMap = isInsideNepal(hospital.latitude, hospital.longitude);
      const province = onMap ? provinceAtPoint(x, y) : null;
      return {
        hospital,
        x,
        y,
        provinceNo: province?.no ?? null,
        provinceName: province?.name ?? null,
        onMap,
      };
    });
  }, [hospitals]);

  const markers = useMemo<MapMarker[]>(
    () =>
      spreadMarkers(
        placed
          .filter((p) => p.onMap)
          .map((p) => ({
            id: p.hospital.id,
            x: p.x,
            y: p.y,
            name: p.hospital.name,
            city: p.hospital.city,
            available24x7: p.hospital.available24x7,
            provinceNo: p.provinceNo,
          }))
      ),
    [placed]
  );

  const byId = useMemo(() => new Map(placed.map((p) => [p.hospital.id, p])), [placed]);
  const markerById = useMemo(() => new Map(markers.map((m) => [m.id, m])), [markers]);

  const provinceCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of placed) {
      if (p.provinceNo == null) continue;
      counts.set(p.provinceNo, (counts.get(p.provinceNo) ?? 0) + 1);
    }
    return counts;
  }, [placed]);

  const listed = useMemo(
    () =>
      placed
        .filter((p) => activeProvince === null || p.provinceNo === activeProvince)
        .sort((a, b) => a.hospital.name.localeCompare(b.hospital.name)),
    [placed, activeProvince]
  );

  const offMapCount = placed.filter((p) => !p.onMap).length;
  const total = placed.length;
  const alwaysOpen = placed.filter((p) => p.hospital.available24x7).length;

  const distanceFor = useCallback(
    (h: Hospital) => (coords ? distanceKm(coords, h.latitude, h.longitude) : null),
    [coords]
  );

  const hovered = hoveredId ? byId.get(hoveredId) : null;
  const hoveredMarker = hoveredId ? markerById.get(hoveredId) : null;
  const drawerEntry = drawerId ? byId.get(drawerId) : null;

  const handleHover = useCallback((id: string | null) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (id === null) {
      leaveTimer.current = setTimeout(() => setHoveredId(null), 140);
    } else {
      setHoveredId(id);
    }
  }, []);

  const keepTooltip = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  return (
    <section id="network" aria-label="Hospital network across Nepal" className="py-16 sm:py-24">
      <Container>
        <SectionHeader
          index="01"
          kicker="Network"
          titleLines={["Hospitals", "across Nepal"]}
          lede="Every stroke-ready hospital in the StrokeAlert network, plotted on Nepal's 77 districts. Hover a marker for its name and location — open it for phone numbers, capabilities and directions."
          aside={
            <dl className="grid grid-cols-3 gap-4 border-t border-ink pt-4 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:border-l lg:pl-6">
              {[
                { label: "Hospitals", value: total },
                { label: "Provinces", value: provinceCounts.size },
                { label: "Open 24/7", value: alwaysOpen },
              ].map((stat) => (
                <div key={stat.label} className="lg:border-b lg:border-rule lg:py-3 lg:first:pt-0">
                  <dd className="font-mono text-display-m font-medium leading-none">
                    <CountUp to={stat.value} />
                  </dd>
                  <dt className="label mt-1.5">{stat.label}</dt>
                </div>
              ))}
            </dl>
          }
        />

        {/* province filter */}
        <Reveal className="mb-4 flex flex-wrap items-center gap-px border-y border-rule py-3">
          <button
            type="button"
            onClick={() => setActiveProvince(null)}
            onPointerEnter={() => setHoveredProvince(null)}
            className={clsx(
              "tap px-3 font-mono text-micro uppercase tracking-[0.14em] transition-colors",
              activeProvince === null ? "text-ink" : "text-ink-3 hover:text-ink"
            )}
          >
            All Nepal
          </button>
          <span className="h-4 w-px bg-rule" aria-hidden />
          {NEPAL_PROVINCES.map((p) => {
            const count = provinceCounts.get(p.no) ?? 0;
            const active = activeProvince === p.no;
            return (
              <button
                key={p.id}
                type="button"
                disabled={count === 0}
                onClick={() => setActiveProvince(active ? null : p.no)}
                onPointerEnter={() => setHoveredProvince(p.no)}
                onPointerLeave={() => setHoveredProvince(null)}
                className={clsx(
                  "tap flex items-center gap-1.5 px-3 font-mono text-micro uppercase tracking-[0.14em] transition-colors",
                  "disabled:cursor-not-allowed disabled:text-ink-3/50",
                  active ? "text-signal" : "text-ink-3 hover:text-ink"
                )}
              >
                {p.name}
                <span data-numeric className="text-[0.5625rem]">
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </Reveal>

        <div className="grid grid-cols-12 gap-gutter">
          {/* map panel */}
          <Reveal className="col-span-12 lg:col-span-8">
            <div className="border border-ink bg-paper p-3 sm:p-5">
              <div
                className="relative"
                style={{ aspectRatio: `${NEPAL_VIEWBOX.width} / ${NEPAL_VIEWBOX.height}` }}
                onPointerLeave={() => handleHover(null)}
              >
                {state === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="label animate-pulse">Loading network…</span>
                  </div>
                )}
                {state === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="label text-signal">Network unavailable</span>
                    <a href="tel:102" className="text-display-m font-bold text-signal">
                      Call 102
                    </a>
                  </div>
                )}

                {state === "ready" && (
                  <>
                    <NepalMap
                      markers={markers}
                      selectedId={selectedId}
                      hoveredId={hoveredId}
                      activeProvince={activeProvince}
                      hoveredProvince={hoveredProvince}
                      onHover={handleHover}
                      onSelect={(id) => {
                        setSelectedId(id);
                        setHoveredId(id);
                      }}
                      onProvinceHover={setHoveredProvince}
                      onProvinceSelect={setActiveProvince}
                    />

                    <AnimatePresence>
                      {hovered && hoveredMarker && (
                        <MapTooltip
                          key={hovered.hospital.id}
                          hospital={hovered.hospital}
                          x={hoveredMarker.x}
                          y={hoveredMarker.y}
                          provinceName={hovered.provinceName}
                          distanceKm={distanceFor(hovered.hospital)}
                          onViewMore={() => {
                            setSelectedId(hovered.hospital.id);
                            setDrawerId(hovered.hospital.id);
                          }}
                          onPointerEnter={keepTooltip}
                          onPointerLeave={() => handleHover(null)}
                        />
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>

              <div className="mt-4 border-t border-rule pt-3">
                <MapLegend offMapCount={offMapCount} />
              </div>
            </div>
          </Reveal>

          {/* sidebar list — the map's non-visual equivalent */}
          <Reveal delay={0.1} className="col-span-12 lg:col-span-4">
            <div className="flex h-full flex-col border border-rule">
              <div className="flex items-center justify-between border-b border-ink bg-paper-2 px-4 py-3">
                <span className="label-ink">
                  {activeProvince === null
                    ? "All hospitals"
                    : NEPAL_PROVINCES.find((p) => p.no === activeProvince)?.name}
                </span>
                <span className="label" data-numeric>
                  {String(listed.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="max-h-[520px] flex-1 divide-y divide-rule overflow-y-auto">
                {listed.map((p) => {
                  const active = p.hospital.id === hoveredId || p.hospital.id === selectedId;
                  const d = distanceFor(p.hospital);
                  return (
                    <li key={p.hospital.id}>
                      <button
                        type="button"
                        onPointerEnter={() => handleHover(p.hospital.id)}
                        onPointerLeave={() => handleHover(null)}
                        onFocus={() => handleHover(p.hospital.id)}
                        onClick={() => {
                          setSelectedId(p.hospital.id);
                          setDrawerId(p.hospital.id);
                        }}
                        className={clsx(
                          "group relative w-full px-4 py-3 text-left transition-colors",
                          active ? "bg-paper-2" : "hover:bg-paper-2"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="map-list-marker"
                            className="absolute inset-y-0 left-0 w-[3px] bg-signal"
                            transition={{ duration: DUR.fast, ease: EASE }}
                          />
                        )}
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-body font-semibold">{p.hospital.name}</span>
                          {d !== null && (
                            <span className="shrink-0 font-mono text-micro text-ink-2" data-numeric>
                              {d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="truncate text-small text-ink-2">
                            {p.hospital.city}
                            {p.provinceName ? ` · ${p.provinceName}` : ""}
                          </span>
                          {p.hospital.available24x7 && <Chip tone="ink">24/7</Chip>}
                          {!p.onMap && <Chip tone="muted">Off map</Chip>}
                        </div>
                      </button>
                    </li>
                  );
                })}

                {state === "ready" && listed.length === 0 && (
                  <li className="px-4 py-10 text-center">
                    <p className="label">No hospitals recorded here</p>
                  </li>
                )}
                {state === "loading" &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className="px-4 py-4">
                      <div className="h-3 w-2/3 animate-pulse bg-paper-2" />
                      <div className="mt-2 h-2.5 w-1/3 animate-pulse bg-paper-2" />
                    </li>
                  ))}
              </ul>

              <p className="flex items-center gap-2 border-t border-rule px-4 py-3 text-small text-ink-3">
                <CrosshairIcon className="h-3.5 w-3.5" />
                Select a hospital to see full details
              </p>
            </div>
          </Reveal>
        </div>
      </Container>

      <HospitalDrawer
        hospital={drawerEntry?.hospital ?? null}
        provinceName={drawerEntry?.provinceName ?? null}
        distanceKm={drawerEntry ? distanceFor(drawerEntry.hospital) : null}
        onClose={() => setDrawerId(null)}
      />
    </section>
  );
}
