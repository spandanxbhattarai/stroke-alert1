"use client";

import type { Hospital, HospitalWithDistance } from "@strokealert/shared";
import Chip from "./ui/Chip";
import { ButtonLink } from "./ui/Button";
import { PhoneIcon, PinIcon } from "./ui/Icons";

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * A hairline row, not a floating card. Rank index in the margin, name and
 * address in the measure, distance right-aligned in mono, then the two actions.
 */
export default function HospitalCard({
  hospital,
  index,
}: {
  hospital: Hospital | HospitalWithDistance;
  index: number;
}) {
  const distance =
    "distance" in hospital && hospital.distance != null ? hospital.distance : null;
  const callNumber = hospital.emergencyPhone || hospital.phone;

  return (
    <div className="group grid grid-cols-12 gap-x-gutter gap-y-5 py-6 transition-colors duration-300 sm:py-7">
      {/* rank */}
      <div className="col-span-2 sm:col-span-1">
        <span className="font-mono text-label tracking-[0.14em] text-ink-3" data-numeric>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* identity */}
      <div className="col-span-10 min-w-0 sm:col-span-6">
        <h3 className="text-[1.125rem] font-bold leading-snug sm:text-[1.25rem]">
          {hospital.name}
        </h3>
        <p className="mt-1.5 text-body text-ink-2">
          {hospital.addressLine1}
          {hospital.addressLine1 ? ", " : ""}
          {hospital.city}, {hospital.state}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hospital.available24x7 && <Chip tone="ink">Open 24 / 7</Chip>}
          {hospital.specializations.slice(0, 3).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {hospital.specializations.length > 3 && (
            <span className="self-center font-mono text-micro uppercase tracking-[0.14em] text-ink-3">
              +{hospital.specializations.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* distance */}
      <div className="col-span-12 sm:col-span-2 sm:text-right">
        {distance !== null ? (
          <>
            <p className="font-mono text-[1.375rem] font-medium leading-none text-signal" data-numeric>
              {formatDistance(distance)}
            </p>
            <p className="label mt-1.5">Away</p>
          </>
        ) : (
          <p className="label">{hospital.city}</p>
        )}
      </div>

      {/* actions */}
      <div className="col-span-12 flex flex-col gap-px sm:col-span-3 sm:self-center">
        <ButtonLink
          href={`tel:${callNumber}`}
          variant="signal"
          size="lg"
          full
          icon={<PhoneIcon className="h-4 w-4" />}
          aria-label={`Call ${hospital.name} at ${callNumber}`}
        >
          Call
        </ButtonLink>
        <ButtonLink
          href={hospital.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="md"
          full
          icon={<PinIcon className="h-4 w-4" />}
          aria-label={`Get directions to ${hospital.name}`}
        >
          Directions
        </ButtonLink>
      </div>
    </div>
  );
}
