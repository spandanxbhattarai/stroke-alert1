"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import HospitalForm from "../../../components/HospitalForm";
import type { Hospital } from "@strokealert/shared";
import type { CreateHospitalInput } from "@strokealert/shared";

export default function EditHospitalPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/hospitals/${id}`)
      .then((r) => r.json())
      .then((d) => setHospital(d.data))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 text-center text-gray-500">Hospital not found.</main>
      </div>
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
    type: hospital.type as any,
    specializations: hospital.specializations as any,
    available24x7: hospital.available24x7,
    isActive: hospital.isActive,
    notes: hospital.notes || undefined,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900">Edit Hospital</h1>
            <p className="text-gray-500">Update details for {hospital.name}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <HospitalForm mode="edit" hospitalId={String(id)} defaultValues={defaultValues} />
          </div>
        </div>
      </main>
    </div>
  );
}
