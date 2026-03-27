"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import MapPreview from "../../components/MapPreview";
import Link from "next/link";
import type { Hospital } from "@strokealert/shared";

const TYPE_LABEL: Record<string, string> = {
  GOVERNMENT: "Government",
  PRIVATE: "Private",
  NGO: "NGO",
};

export default function ViewHospitalPage() {
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
          <div className="h-64 bg-gray-200 rounded-2xl" />
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{hospital.name}</h1>
              <p className="text-gray-500">{hospital.city}, {hospital.state}</p>
            </div>
            <Link
              href={`/admin/hospitals/${id}/edit`}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Edit
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <h2 className="font-bold text-gray-800">Contact</h2>
              <p className="text-sm"><span className="text-gray-500">Phone:</span>{" "}
                <a href={`tel:${hospital.phone}`} className="text-blue-600">{hospital.phone}</a>
              </p>
              {hospital.emergencyPhone && (
                <p className="text-sm"><span className="text-gray-500">Emergency:</span>{" "}
                  <a href={`tel:${hospital.emergencyPhone}`} className="text-red-600 font-bold">{hospital.emergencyPhone}</a>
                </p>
              )}
              <p className="text-sm"><span className="text-gray-500">Address:</span>{" "}
                {hospital.addressLine1}, {hospital.city}, {hospital.state}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <h2 className="font-bold text-gray-800">Details</h2>
              <p className="text-sm"><span className="text-gray-500">Type:</span> {TYPE_LABEL[hospital.type]}</p>
              <p className="text-sm"><span className="text-gray-500">Available 24/7:</span> {hospital.available24x7 ? "Yes" : "No"}</p>
              <p className="text-sm">
                <span className="text-gray-500">Status:</span>{" "}
                <span className={hospital.isActive ? "text-green-600 font-semibold" : "text-gray-400"}>
                  {hospital.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <div>
                <span className="text-gray-500 text-sm">Specializations:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hospital.specializations.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-800 mb-3">Location</h2>
            <p className="text-sm text-gray-500 mb-3">
              Coordinates: {hospital.latitude}, {hospital.longitude}
            </p>
            <MapPreview googleMapsLink={hospital.googleMapsLink} name={hospital.name} />
          </div>
        </div>
      </main>
    </div>
  );
}
