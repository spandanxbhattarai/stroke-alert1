"use client";

import { useCallback, useEffect, useState } from "react";
import type { Hospital, HospitalWithDistance } from "@strokealert/shared";
import { API_URL } from "../lib/api";
import Container from "./ui/Container";
import SectionHeader from "./ui/SectionHeader";
import { RevealGroup, RevealItem } from "./ui/Reveal";
import { ButtonLink } from "./ui/Button";
import { PhoneIcon } from "./ui/Icons";
import HospitalCard from "./HospitalCard";
import LocationSearch from "./LocationSearch";
import { useGeo } from "./GeoProvider";
import { formatCoord } from "../lib/nepal-geo";

type Result = HospitalWithDistance | Hospital;

export default function HospitalList() {
  const { status: geoStatus, coords } = useGeo();
  const [hospitals, setHospitals] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNearest = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/hospitals/nearest?lat=${lat}&lng=${lng}&limit=10`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHospitals(data.data || []);
    } catch {
      setError("Could not reach the hospital network.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async (city?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ pageSize: "20", active: "true" });
      if (city) params.set("city", city);
      const res = await fetch(`${API_URL}/api/hospitals?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHospitals(data.data || []);
    } catch {
      setError("Could not reach the hospital network.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Follow the shared geolocation result: precise list when granted, full list otherwise.
  useEffect(() => {
    if (geoStatus === "locating" || geoStatus === "idle") return;
    if (geoStatus === "granted" && coords) {
      fetchNearest(coords.lat, coords.lng);
    } else {
      fetchAll();
    }
  }, [geoStatus, coords, fetchNearest, fetchAll]);

  const located = geoStatus === "granted" && coords;

  return (
    <section id="nearest" aria-label="Nearest hospitals" className="py-16 sm:py-24">
      <Container>
        <SectionHeader
          index="03"
          kicker="Nearest first"
          titleLines={located ? ["Closest to", "you now"] : ["Stroke-ready", "hospitals"]}
          lede={
            located
              ? "Ranked by straight-line distance from your device. Call the hospital directly — do not drive yourself."
              : "Ordered as recorded in the network. Allow location access, or search by city, to rank them by distance."
          }
          aside={
            <div className="border-t border-ink pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="label">Position</p>
              {located ? (
                <p className="mt-2 font-mono text-small leading-relaxed text-ink" data-numeric>
                  {formatCoord(coords.lat, "lat")}
                  <br />
                  {formatCoord(coords.lng, "lng")}
                </p>
              ) : (
                <p className="mt-2 font-mono text-small text-ink-3">
                  {geoStatus === "locating"
                    ? "Locating…"
                    : geoStatus === "denied"
                      ? "Access denied"
                      : "Unavailable"}
                </p>
              )}
            </div>
          }
        />

        {(geoStatus === "denied" || geoStatus === "unsupported") && (
          <div className="mb-10 border-y border-rule py-6">
            <LocationSearch onSearch={fetchAll} />
          </div>
        )}

        {error ? (
          <div className="border border-signal p-8 text-center sm:p-12">
            <p className="label text-signal">{error}</p>
            <p className="mt-4 text-body text-ink-2">
              Do not wait for this page. Call the national ambulance line.
            </p>
            <ButtonLink
              href="tel:102"
              variant="signal"
              size="lg"
              className="mt-6"
              icon={<PhoneIcon className="h-4 w-4" />}
            >
              Call 102 — Nepal
            </ButtonLink>
          </div>
        ) : loading ? (
          <div className="divide-y divide-rule border-y border-rule">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-gutter py-7">
                <div className="col-span-1 h-3 animate-pulse bg-paper-2" />
                <div className="col-span-6 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse bg-paper-2" />
                  <div className="h-3 w-1/2 animate-pulse bg-paper-2" />
                </div>
                <div className="col-span-2 h-6 animate-pulse bg-paper-2" />
                <div className="col-span-3 h-12 animate-pulse bg-paper-2" />
              </div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="border-y border-rule py-16 text-center">
            <p className="label">No hospitals recorded for this search</p>
            <ButtonLink
              href="tel:102"
              variant="signal"
              size="lg"
              className="mt-6"
              icon={<PhoneIcon className="h-4 w-4" />}
            >
              Call 102 — Nepal
            </ButtonLink>
          </div>
        ) : (
          <>
            <RevealGroup
              as="ul"
              className="divide-y divide-rule border-y border-rule"
              stagger={0.05}
            >
              {hospitals.map((h, i) => (
                <RevealItem as="li" key={h.id}>
                  <HospitalCard hospital={h} index={i} />
                </RevealItem>
              ))}
            </RevealGroup>

            <p className="mt-4 font-mono text-micro uppercase tracking-[0.14em] text-ink-3">
              {String(hospitals.length).padStart(2, "0")} hospitals shown
              {located ? " · ranked by distance" : ""}
            </p>
          </>
        )}
      </Container>
    </section>
  );
}
