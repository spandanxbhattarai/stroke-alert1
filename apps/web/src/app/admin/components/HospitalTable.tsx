"use client";

import Link from "next/link";
import type { Hospital } from "@strokealert/shared";
import clsx from "clsx";
import Chip from "../../components/ui/Chip";
import { ArrowRightIcon, PlusIcon } from "../../components/ui/Icons";
import { ButtonLink } from "../../components/ui/Button";

interface Props {
  hospitals: Hospital[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export default function HospitalTable({ hospitals, onDelete, onToggleStatus }: Props) {
  if (hospitals.length === 0) {
    return (
      <div className="border border-rule px-6 py-20 text-center">
        <p className="label">No hospitals match this view</p>
        <ButtonLink
          href="/admin/hospitals/new"
          variant="ink"
          size="md"
          className="mt-6"
          icon={<PlusIcon className="h-4 w-4" />}
        >
          Add the first one
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-rule">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink bg-paper-2">
            {["Hospital", "City", "Phone", "Type", "Status", ""].map((h, i) => (
              <th
                key={h || i}
                scope="col"
                className={clsx(
                  "px-4 py-3 font-mono text-micro font-normal uppercase tracking-[0.14em] text-ink-2",
                  i === 5 && "text-right"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hospitals.map((h) => (
            <tr
              key={h.id}
              className="group border-b border-rule transition-colors last:border-b-0 hover:bg-paper-2"
            >
              <td className="px-4 py-3.5">
                <Link
                  href={`/admin/hospitals/${h.id}`}
                  className="flex items-center gap-2 text-body font-semibold transition-colors hover:text-signal"
                >
                  <span className="truncate">{h.name}</span>
                  {h.available24x7 && <Chip tone="ink">24/7</Chip>}
                </Link>
                <p className="mt-1 truncate text-small text-ink-3">{h.addressLine1}</p>
              </td>

              <td className="px-4 py-3.5">
                <span className="font-mono text-small text-ink-2">{h.city}</span>
              </td>

              <td className="px-4 py-3.5">
                <a
                  href={`tel:${h.phone}`}
                  className="font-mono text-small text-ink transition-colors hover:text-signal"
                  data-numeric
                >
                  {h.phone}
                </a>
                {h.emergencyPhone && (
                  <p className="mt-1 font-mono text-micro tracking-[0.14em] text-signal" data-numeric>
                    {h.emergencyPhone}
                  </p>
                )}
              </td>

              <td className="px-4 py-3.5">
                <Chip>{h.type}</Chip>
              </td>

              <td className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onToggleStatus(h.id, !h.isActive)}
                  aria-label={`${h.isActive ? "Deactivate" : "Activate"} ${h.name}`}
                  className={clsx(
                    "inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-micro uppercase",
                    "tracking-[0.14em] transition-colors",
                    h.isActive
                      ? "border-ink bg-ink text-paper hover:bg-paper hover:text-ink"
                      : "border-rule text-ink-3 hover:border-ink hover:text-ink"
                  )}
                >
                  <span
                    className={clsx(
                      "h-1.5 w-1.5 rounded-full",
                      h.isActive ? "bg-signal" : "bg-ink-3"
                    )}
                    aria-hidden
                  />
                  {h.isActive ? "Active" : "Inactive"}
                </button>
              </td>

              <td className="px-4 py-3.5 text-right">
                <div className="inline-flex items-center gap-4">
                  <Link
                    href={`/admin/hospitals/${h.id}/edit`}
                    className="font-mono text-micro uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-ink"
                    aria-label={`Edit ${h.name}`}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(h.id)}
                    className="font-mono text-micro uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-signal"
                    aria-label={`Delete ${h.name}`}
                  >
                    Delete
                  </button>
                  <Link
                    href={`/admin/hospitals/${h.id}`}
                    aria-label={`View ${h.name}`}
                    className="text-ink-3 transition-all duration-300 ease-swiss hover:text-ink group-hover:translate-x-0.5"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
