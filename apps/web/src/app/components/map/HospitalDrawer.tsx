"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Hospital } from "@strokealert/shared";
import Chip from "../ui/Chip";
import { ButtonLink } from "../ui/Button";
import { CloseIcon, PhoneIcon, PinIcon } from "../ui/Icons";
import { DUR, EASE, SPRING } from "../ui/motion";
import { formatCoord } from "../../lib/nepal-geo";

/** One row of the hairline definition list. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-rule py-3">
      <dt className="label col-span-1">{label}</dt>
      <dd className="col-span-2 text-body text-ink">{children}</dd>
    </div>
  );
}

export default function HospitalDrawer({
  hospital,
  provinceName,
  distanceKm,
  onClose,
}: {
  hospital: Hospital | null;
  provinceName: string | null;
  distanceKm: number | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const open = Boolean(hospital);

  // Esc closes; body scroll locks while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const callNumber = hospital?.emergencyPhone || hospital?.phone;

  return (
    <AnimatePresence>
      {hospital && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast }}
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col
                       border-l border-ink bg-paper"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={reduced ? { duration: DUR.fast } : SPRING}
            role="dialog"
            aria-modal="true"
            aria-label={`${hospital.name} details`}
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4 border-b border-ink px-6 py-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-label uppercase tracking-[0.14em] text-signal">
                    {provinceName ?? "Nepal"}
                  </span>
                  {distanceKm !== null && (
                    <span className="label" data-numeric>
                      · {distanceKm.toFixed(1)} km away
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-display-m font-bold uppercase leading-none">
                  {hospital.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="tap -mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center
                           border border-rule text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-5 flex flex-wrap gap-1.5">
                {hospital.available24x7 ? (
                  <Chip tone="signal">Open 24 / 7</Chip>
                ) : (
                  <Chip>Limited hours</Chip>
                )}
                <Chip tone="ink">{hospital.type}</Chip>
                {!hospital.isActive && <Chip tone="muted">Inactive</Chip>}
              </div>

              <dl>
                <Row label="Address">
                  {hospital.addressLine1}
                  {hospital.addressLine2 ? `, ${hospital.addressLine2}` : ""}
                  <br />
                  {hospital.city}, {hospital.state}
                  {hospital.postalCode ? ` ${hospital.postalCode}` : ""}
                  <br />
                  {hospital.country}
                </Row>

                <Row label="Phone">
                  <a href={`tel:${hospital.phone}`} className="font-mono hover:text-signal">
                    {hospital.phone}
                  </a>
                </Row>

                {hospital.emergencyPhone && (
                  <Row label="Emergency">
                    <a
                      href={`tel:${hospital.emergencyPhone}`}
                      className="font-mono font-medium text-signal"
                    >
                      {hospital.emergencyPhone}
                    </a>
                  </Row>
                )}

                <Row label="Capability">
                  {hospital.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.specializations.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  ) : (
                    <span className="text-ink-3">Not recorded</span>
                  )}
                </Row>

                <Row label="Coordinates">
                  <span className="font-mono text-small" data-numeric>
                    {formatCoord(hospital.latitude, "lat")}
                    <br />
                    {formatCoord(hospital.longitude, "lng")}
                  </span>
                </Row>

                {hospital.notes && <Row label="Notes">{hospital.notes}</Row>}
              </dl>
            </div>

            {/* actions — exempt from Swiss restraint, per REDESIGN_PLAN.md §0 */}
            <div className="grid grid-cols-2 gap-px border-t border-ink bg-rule">
              <ButtonLink
                href={`tel:${callNumber}`}
                variant="signal"
                size="lg"
                full
                icon={<PhoneIcon className="h-4 w-4" />}
                aria-label={`Call ${hospital.name} at ${callNumber}`}
              >
                Call now
              </ButtonLink>
              <ButtonLink
                href={hospital.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="ink"
                size="lg"
                full
                icon={<PinIcon className="h-4 w-4" />}
                aria-label={`Get directions to ${hospital.name}`}
              >
                Directions
              </ButtonLink>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
