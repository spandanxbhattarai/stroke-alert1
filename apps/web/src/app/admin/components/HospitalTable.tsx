"use client";

import Link from "next/link";
import type { Hospital } from "@strokealert/shared";

interface Props {
  hospitals: Hospital[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

const TYPE_BADGE: Record<string, string> = {
  GOVERNMENT: "bg-blue-100 text-blue-700",
  PRIVATE: "bg-purple-100 text-purple-700",
  NGO: "bg-orange-100 text-orange-700",
};

export default function HospitalTable({ hospitals, onDelete, onToggleStatus }: Props) {
  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-3">🏥</p>
        <p>No hospitals found. <Link href="/admin/hospitals/new" className="text-red-600 underline">Add one</Link></p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Hospital</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((h) => (
            <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <Link href={`/admin/hospitals/${h.id}`} className="font-semibold text-gray-900 hover:text-red-600">
                  {h.name}
                </Link>
                {h.available24x7 && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">24/7</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-600">{h.city}</td>
              <td className="py-3 px-4">
                <a href={`tel:${h.phone}`} className="text-blue-600 hover:underline">{h.phone}</a>
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_BADGE[h.type] || ""}`}>
                  {h.type}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onToggleStatus(h.id, !h.isActive)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                    h.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  aria-label={`${h.isActive ? "Deactivate" : "Activate"} ${h.name}`}
                >
                  {h.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/hospitals/${h.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    aria-label={`Edit ${h.name}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(h.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                    aria-label={`Delete ${h.name}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
