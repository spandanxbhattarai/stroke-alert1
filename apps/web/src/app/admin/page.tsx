"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import Link from "next/link";

interface Stats {
  total: number;
  active: number;
  citiesCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500 mb-8">Overview of StrokeAlert hospital network</p>

          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-28 animate-pulse" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard label="Total Hospitals" value={stats.total} icon="🏥" color="blue" />
              <StatCard label="Active Hospitals" value={stats.active} icon="✅" color="green" />
              <StatCard label="Cities Covered" value={stats.citiesCount} icon="🌆" color="red" />
            </div>
          ) : null}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/hospitals/new"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                + Add Hospital
              </Link>
              <Link
                href="/admin/hospitals"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                View All Hospitals
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
