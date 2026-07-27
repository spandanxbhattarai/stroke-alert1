"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import Logo from "../../components/ui/Logo";
import { GridIcon, ListIcon, LogoutIcon, PlusIcon } from "../../components/ui/Icons";
import { DUR, EASE } from "../../components/ui/motion";
import { API_URL } from "../../lib/api";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: GridIcon, exact: true },
  { href: "/admin/hospitals", label: "Hospitals", Icon: ListIcon, exact: false },
  { href: "/admin/hospitals/new", label: "Add", Icon: PlusIcon, exact: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("admin_token");
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // Logging out locally is what matters; a failed server call must not trap the admin.
    }
    router.push("/admin/login");
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && pathname !== "/admin/hospitals/new";

  return (
    <aside
      className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-ink bg-paper px-4
                 no-scrollbar lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:flex-col lg:items-stretch
                 lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:px-0"
    >
      <div className="flex shrink-0 items-center py-4 lg:border-b lg:border-rule lg:px-5 lg:py-6">
        <Link href="/admin" aria-label="StrokeAlert admin home">
          <Logo size="md" />
        </Link>
      </div>

      <p className="label hidden px-5 pt-6 lg:block">Manage</p>

      <nav aria-label="Admin navigation" className="flex items-stretch gap-1 lg:mt-2 lg:flex-col lg:gap-0">
        {NAV.map(({ href, label, Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "tap relative flex shrink-0 items-center gap-3 px-4 font-mono text-micro uppercase",
                "tracking-[0.14em] transition-colors lg:px-5 lg:py-3.5",
                active ? "text-ink" : "text-ink-3 hover:text-ink"
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-marker"
                  className="absolute bottom-0 left-0 h-[3px] w-full bg-signal lg:bottom-auto lg:h-full lg:w-[3px]"
                  transition={{ duration: DUR.fast, ease: EASE }}
                />
              )}
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex shrink-0 items-stretch gap-1 lg:ml-0 lg:mt-auto lg:flex-col lg:gap-0 lg:border-t lg:border-rule lg:py-2">
        <Link
          href="/"
          className="tap flex shrink-0 items-center gap-3 px-4 font-mono text-micro uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink lg:px-5 lg:py-3"
        >
          Public site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="tap flex shrink-0 items-center gap-3 px-4 font-mono text-micro uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-signal lg:px-5 lg:py-3"
        >
          <LogoutIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
