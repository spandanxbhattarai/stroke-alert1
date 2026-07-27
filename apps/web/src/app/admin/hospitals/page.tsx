"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import HospitalTable from "../components/HospitalTable";
import { ButtonLink, Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { PlusIcon, SearchIcon } from "../../components/ui/Icons";
import type { Hospital } from "@strokealert/shared";
import { API_URL } from "../../lib/api";

export default function HospitalsPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const fetchHospitals = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`${API_URL}/api/hospitals?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      setHospitals(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total ?? (data.data?.length || 0));
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => {
    // Debounced so typing in the search field doesn't fire a request per keystroke.
    const t = setTimeout(fetchHospitals, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchHospitals, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hospital? This cannot be undone.")) return;
    const token = getToken();
    await fetch(`${API_URL}/api/hospitals/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    fetchHospitals();
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    const token = getToken();
    await fetch(`${API_URL}/api/hospitals/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });
    fetchHospitals();
  };

  return (
    <AdminShell
      index="02"
      kicker="Records"
      title="Hospitals"
      lede="Every hospital in the network. Deactivate rather than delete when a facility is temporarily unavailable."
      actions={
        <ButtonLink
          href="/admin/hospitals/new"
          variant="signal"
          size="md"
          icon={<PlusIcon className="h-4 w-4" />}
        >
          Add hospital
        </ButtonLink>
      }
    >
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-5">
        <div className="w-full max-w-[360px]">
          <label htmlFor="admin-search" className="label mb-1.5 block">
            Search name, city, or address
          </label>
          <div className="flex items-center gap-3 border-b border-rule focus-within:border-signal">
            <SearchIcon className="h-4 w-4 shrink-0 text-ink-3" />
            <input
              id="admin-search"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Kathmandu"
              className="w-full border-0 bg-transparent py-2.5 text-body text-ink placeholder:text-ink-3 focus:outline-none"
            />
          </div>
        </div>

        <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-3" data-numeric>
          {String(total).padStart(2, "0")} records
        </p>
      </Reveal>

      {loading ? (
        <div className="border border-rule">
          <div className="border-b border-ink bg-paper-2 px-4 py-3">
            <div className="h-3 w-32 animate-pulse bg-rule" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-rule px-4 py-4 last:border-b-0">
              <div className="h-3.5 w-1/3 animate-pulse bg-paper-2" />
              <div className="mt-2 h-2.5 w-1/4 animate-pulse bg-paper-2" />
            </div>
          ))}
        </div>
      ) : (
        <HospitalTable
          hospitals={hospitals}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-rule pt-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </Button>
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-ink-2" data-numeric>
            {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </AdminShell>
  );
}
