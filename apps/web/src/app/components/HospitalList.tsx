"use client";

import { useEffect, useState, useCallback } from "react";
import HospitalCard from "./HospitalCard";
import LocationSearch from "./LocationSearch";
import type { HospitalWithDistance, Hospital } from "@strokealert/shared";

type Status = "idle" | "loading" | "success" | "denied" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function HospitalList() {
  const [status, setStatus] = useState<Status>("idle");
  const [hospitals, setHospitals] = useState<(HospitalWithDistance | Hospital)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNearest = useCallback(async (lat: number, lng: number) => {
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/hospitals/nearest?lat=${lat}&lng=${lng}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      const data = await res.json();
      setHospitals(data.data || []);
      setStatus("success");
    } catch {
      setError("Unable to load hospitals. Please call Nepal Emergency: 102");
      setStatus("error");
    }
  }, []);

  const fetchAll = useCallback(async (city?: string) => {
    setStatus("loading");
    try {
      const url = city
        ? `${API_URL}/api/hospitals?city=${encodeURIComponent(city)}`
        : `${API_URL}/api/hospitals`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      const data = await res.json();
      setHospitals(data.data || []);
      setStatus("success");
    } catch {
      setError("Unable to load hospitals. Please call Nepal Emergency: 102");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchAll();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchNearest(pos.coords.latitude, pos.coords.longitude),
      () => setStatus("denied"),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [fetchNearest, fetchAll]);

  if (status === "denied") {
    return (
      <div className="max-w-2xl mx-auto mt-6">
        <p className="text-center text-gray-600 mb-4">
          Location access denied. Search by city to find nearby hospitals.
        </p>
        <LocationSearch onSearch={fetchAll} />
        {status === "success" || hospitals.length > 0 ? (
          <HospitalResults hospitals={hospitals} />
        ) : null}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto mt-6 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700 font-semibold">{error}</p>
        <a
          href="tel:102"
          className="mt-4 inline-block bg-red-600 text-white thumb-friendly rounded-xl"
          aria-label="Call Nepal Emergency Number 102"
        >
          📞 Call 102 — Nepal Emergency
        </a>
      </div>
    );
  }

  if (status === "idle" || status === "loading") {
    return (
      <div className="max-w-2xl mx-auto mt-6 space-y-4">
        <p className="text-center text-gray-500 font-medium animate-pulse">
          📍 Finding nearest hospitals...
        </p>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {hospitals.length > 0
          ? `${hospitals.length} Nearest Hospitals Found`
          : "No hospitals found"}
      </h2>
      <HospitalResults hospitals={hospitals} />
    </div>
  );
}

function HospitalResults({ hospitals }: { hospitals: (HospitalWithDistance | Hospital)[] }) {
  if (hospitals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No hospitals found in this area.</p>
        <a href="tel:102" className="text-red-600 font-bold mt-2 inline-block">
          Call 102 for Nepal Emergency
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list" aria-label="Hospital list">
      {hospitals.map((h) => (
        <article key={h.id} role="listitem">
          <HospitalCard hospital={h} />
        </article>
      ))}
    </div>
  );
}
