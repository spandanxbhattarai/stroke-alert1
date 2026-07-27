"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../components/AdminShell";
import HospitalForm from "../../../components/HospitalForm";
import type { CreateHospitalInput, Hospital } from "@strokealert/shared";
import { API_URL } from "../../../../lib/api";

export default function EditHospitalPage() {
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
      <AdminShell index="04" kicker="Editing" title="Loading…">
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-rule py-8">
              <div className="h-3 w-24 animate-pulse bg-paper-2" />
              <div className="mt-6 h-8 w-full animate-pulse bg-paper-2" />
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  if (!hospital) {
    return (
      <AdminShell index="04" kicker="Editing" title="Not found">
        <p className="border border-rule px-6 py-12 text-center text-body text-ink-2">
          This hospital record no longer exists.
        </p>
      </AdminShell>
    );
  }

  const defaultValues: Partial<CreateHospitalInput> = {
    name: hospital.name,
    addressLine1: hospital.addressLine1,
    addressLine2: hospital.addressLine2 || undefined,
    city: hospital.city,
    state: hospital.state,
    country: hospital.country,
    postalCode: hospital.postalCode || undefined,
    phone: hospital.phone,
    emergencyPhone: hospital.emergencyPhone || undefined,
    latitude: hospital.latitude,
    longitude: hospital.longitude,
    googleMapsLink: hospital.googleMapsLink,
    type: hospital.type as CreateHospitalInput["type"],
    specializations: hospital.specializations as CreateHospitalInput["specializations"],
    available24x7: hospital.available24x7,
    isActive: hospital.isActive,
    notes: hospital.notes || undefined,
  };

  return (
    <AdminShell
      index="04"
      kicker="Editing"
      title={hospital.name}
      lede="Changes go live to the public map and the nearest-hospital list immediately."
    >
      <HospitalForm mode="edit" hospitalId={String(id)} defaultValues={defaultValues} />
    </AdminShell>
  );
}
