"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import HospitalTable from "../components/HospitalTable";
import type { Hospital } from "@strokealert/shared";
import Link from "next/link";

export default function HospitalsPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const fetchHospitals = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (search) params.set("search", search);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hospitals?${params}`,
        { headers: { Authorization: `Bearer ${token}` }, credentials: "include" }
      );
      const data = await res.json();
      setHospitals(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => { fetchHospitals(); }, [fetchHospitals]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hospital? This cannot be undone.")) return;
    const token = getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hospitals/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    fetchHospitals();
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    const token = getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hospitals/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });
    fetchHospitals();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Hospitals</h1>
              <p className="text-gray-500">Manage hospital records</p>
            </div>
            <Link
              href="/admin/hospitals/new"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              + Add Hospital
            </Link>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or city..."
              className="w-full sm:w-80 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              aria-label="Search hospitals"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200">
            {loading ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Loading hospitals...</div>
            ) : (
              <HospitalTable
                hospitals={hospitals}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
