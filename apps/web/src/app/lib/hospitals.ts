import type { Hospital, HospitalWithDistance } from "@strokealert/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:4000";

export async function getHospitals(params?: { city?: string; search?: string }): Promise<Hospital[]> {
  const url = new URL(`${API_URL}/api/hospitals`);
  if (params?.city) url.searchParams.set("city", params.city);
  if (params?.search) url.searchParams.set("search", params.search);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function getNearestHospitals(
  lat: number,
  lng: number,
  limit = 10
): Promise<HospitalWithDistance[]> {
  const res = await fetch(
    `${API_URL}/api/hospitals/nearest?lat=${lat}&lng=${lng}&limit=${limit}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function getHospital(id: string): Promise<Hospital | null> {
  const res = await fetch(`${API_URL}/api/hospitals/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}
