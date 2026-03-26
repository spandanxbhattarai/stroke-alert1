"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/hospitals", label: "Hospitals", icon: "🏥" },
  { href: "/admin/hospitals/new", label: "Add Hospital", icon: "➕" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("admin_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          <div>
            <div className="font-black text-gray-900">StrokeAlert</div>
            <div className="text-xs text-gray-500">Admin Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>🚪</span>
          Sign Out
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-1"
        >
          <span>🌐</span>
          Public Page
        </Link>
      </div>
    </aside>
  );
}
