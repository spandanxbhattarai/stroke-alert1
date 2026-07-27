"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "./components/AdminShell";
import StatCard from "./components/StatCard";
import { ButtonLink } from "../components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "../components/ui/Reveal";
import { ArrowRightIcon, ListIcon, PlusIcon } from "../components/ui/Icons";
import { API_URL } from "../lib/api";

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
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <AdminShell
      index="01"
      kicker="Overview"
      title="Dashboard"
      lede="The state of the StrokeAlert hospital network."
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
      {loading ? (
        <div className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-paper p-7">
              <div className="h-3 w-24 animate-pulse bg-paper-2" />
              <div className="mt-8 h-12 w-20 animate-pulse bg-paper-2" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <RevealGroup
          className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3"
          stagger={0.08}
        >
          <RevealItem>
            <StatCard index="01" label="Hospitals" value={stats.total} note="Total records" />
          </RevealItem>
          <RevealItem>
            <StatCard
              index="02"
              label="Active"
              value={stats.active}
              note="Visible to the public"
            />
          </RevealItem>
          <RevealItem>
            <StatCard index="03" label="Cities" value={stats.citiesCount} note="Distinct cities covered" />
          </RevealItem>
        </RevealGroup>
      ) : (
        <p className="border border-signal px-4 py-3 font-mono text-micro uppercase tracking-[0.14em] text-signal">
          Statistics unavailable
        </p>
      )}

      {/* quick actions */}
      <Reveal className="mt-12">
        <p className="label border-b border-ink pb-3">Quick actions</p>
        <ul className="grid grid-cols-1 gap-px border-x border-b border-rule bg-rule sm:grid-cols-2">
          {[
            {
              href: "/admin/hospitals/new",
              title: "Add a hospital",
              body: "Record a new stroke-ready facility with its coordinates and emergency line.",
              Icon: PlusIcon,
            },
            {
              href: "/admin/hospitals",
              title: "Review the network",
              body: "Search, edit, deactivate, or verify existing hospital records.",
              Icon: ListIcon,
            },
          ].map(({ href, title, body, Icon }) => (
            <li key={href} className="bg-paper">
              <Link
                href={href}
                className="group flex h-full items-start gap-5 p-6 transition-colors hover:bg-paper-2 sm:p-7"
              >
                <Icon className="mt-1 h-5 w-5 shrink-0 text-ink-3 transition-colors group-hover:text-signal" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-h3 font-semibold">{title}</span>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-300 ease-swiss group-hover:translate-x-1 group-hover:text-ink" />
                  </span>
                  <span className="mt-2 block text-body text-ink-2">{body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </AdminShell>
  );
}
