"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../components/AdminShell";
import MapPreview from "../../components/MapPreview";
import NepalLocator from "../../../components/map/NepalLocator";
import Chip from "../../../components/ui/Chip";
import { ButtonLink } from "../../../components/ui/Button";
import { Reveal } from "../../../components/ui/Reveal";
import { PhoneIcon, PinIcon } from "../../../components/ui/Icons";
import { formatCoord } from "../../../lib/nepal-geo";
import type { Hospital } from "@strokealert/shared";
import { API_URL } from "../../../lib/api";

const TYPE_LABEL: Record<string, string> = {
  GOVERNMENT: "Government",
  PRIVATE: "Private",
  NGO: "NGO",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-rule py-3.5 last:border-b-0">
      <dt className="label col-span-1">{label}</dt>
      <dd className="col-span-2 text-body text-ink">{children}</dd>
    </div>
  );
}

export default function ViewHospitalPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch(`${API_URL}/api/hospitals/${id}`)
      .then((r) => r.json())
      .then((d) => setHospital(d.data))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <AdminShell index="05" kicker="Record" title="Loading…">
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 space-y-3 lg:col-span-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse bg-paper-2" />
            ))}
          </div>
          <div className="col-span-12 h-64 animate-pulse bg-paper-2 lg:col-span-5" />
        </div>
      </AdminShell>
    );
  }

  if (!hospital) {
    return (
      <AdminShell index="05" kicker="Record" title="Not found">
        <p className="border border-rule px-6 py-12 text-center text-body text-ink-2">
          This hospital record no longer exists.
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      index="05"
      kicker={`${hospital.city} · ${hospital.state}`}
      title={hospital.name}
      actions={
        <>
          <ButtonLink href={`/admin/hospitals/${id}/edit`} variant="ink" size="md">
            Edit record
          </ButtonLink>
          <ButtonLink
            href={`tel:${hospital.emergencyPhone || hospital.phone}`}
            variant="signal"
            size="md"
            icon={<PhoneIcon className="h-4 w-4" />}
          >
            Call
          </ButtonLink>
        </>
      }
    >
      <Reveal className="mb-8 flex flex-wrap gap-1.5">
        {hospital.available24x7 ? <Chip tone="signal">Open 24 / 7</Chip> : <Chip>Limited hours</Chip>}
        <Chip tone="ink">{TYPE_LABEL[hospital.type] ?? hospital.type}</Chip>
        {hospital.isActive ? <Chip>Active</Chip> : <Chip tone="muted">Inactive — hidden from public</Chip>}
      </Reveal>

      <div className="grid grid-cols-12 gap-gutter">
        <Reveal className="col-span-12 lg:col-span-7">
          <p className="label border-b border-ink pb-3">Record</p>
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
              <a href={`tel:${hospital.phone}`} className="font-mono hover:text-signal" data-numeric>
                {hospital.phone}
              </a>
            </Row>
            {hospital.emergencyPhone && (
              <Row label="Emergency">
                <a
                  href={`tel:${hospital.emergencyPhone}`}
                  className="font-mono font-medium text-signal"
                  data-numeric
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
                {formatCoord(hospital.latitude, "lat")} / {formatCoord(hospital.longitude, "lng")}
              </span>
            </Row>
            {hospital.notes && <Row label="Notes">{hospital.notes}</Row>}
          </dl>

          <div className="mt-6">
            <p className="label border-b border-ink pb-3">Street view</p>
            <div className="mt-4">
              <MapPreview googleMapsLink={hospital.googleMapsLink} name={hospital.name} />
            </div>
            <ButtonLink
              href={hospital.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="mt-px"
              full
              icon={<PinIcon className="h-4 w-4" />}
            >
              Open directions
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 lg:col-span-5">
          <p className="label border-b border-ink pb-3">Position in the network</p>
          <div className="mt-4 border border-rule p-4">
            <NepalLocator
              latitude={hospital.latitude}
              longitude={hospital.longitude}
              label={hospital.name}
            />
          </div>
        </Reveal>
      </div>
    </AdminShell>
  );
}
